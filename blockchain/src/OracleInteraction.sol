// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Importing ERC20 interface for bond currency interactions
import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

// Importing UMA's Optimistic Oracle V3 interface
import "./OptimisticOracleV3Interface.sol";

/// @title OracleInteraction
/// @notice This contract interacts with UMA's Optimistic Oracle V3 to request and settle data.
/// @dev The contract uses UMA's oracle for off-chain data validation and resolution.
contract OracleInteraction {
    
    // Instance of the Optimistic Oracle V3
    OptimisticOracleV3Interface private oracle;

    // ERC20 token used for bonding assertions
    IERC20 private bondCurrency;

    // Identifier used for UMA's oracle requests (e.g., a Yes/No query)
    bytes32 public identifier = "YES_OR_NO_QUERY";

    // Encoded ancillary data, which includes the question for the oracle
    bytes public ancillaryData;

    // Timestamp of the data request
    uint256 public requestTime;

    // Unique identifier for the assertion made to the oracle
    bytes32 public assertionId;

    // Events to log key actions
    event DataRequested(string question);  // Emitted when data is requested
    event DataSettled(bool outcome);       // Emitted when data is settled

    /// @notice Constructor initializes the oracle and bond currency.
    /// @param _oracleAddress Address of the UMA Optimistic Oracle V3.
    /// @param _bondCurrency Address of the ERC20 token used for bonding.
    constructor(address _oracleAddress, address _bondCurrency) {
        oracle = OptimisticOracleV3Interface(_oracleAddress);
        bondCurrency = IERC20(_bondCurrency);
    }

    /// @notice Request data from UMA's Optimistic Oracle.
    /// @param question The question to be submitted to the oracle.
    /// @dev Encodes the question as ancillary data and submits it along with other parameters.
    function requestData(string memory question) external {
        // Encode the question as ancillary data for the oracle
        ancillaryData = abi.encodePacked("Q:", question, " Who will win the 2024 US Presidential Election?");
        requestTime = block.timestamp;

        uint256 bondAmount = 1 ether; // Example bond amount, could be adjusted based on requirements

        // Make the assertion request to the Optimistic Oracle
        assertionId = oracle.assertTruth(
            ancillaryData,         // Encoded question (ancillary data)
            msg.sender,            // Asserter (caller) address
            address(this),         // Callback recipient (this contract)
            address(0),            // No custom escalation manager
            7200,                  // Liveness period: 2 hours
            bondCurrency,          // ERC20 token used as bond currency
            bondAmount,            // Bond amount
            identifier,            // UMA identifier for Yes/No queries
            bytes32(0)             // No custom domain specified
        );

        emit DataRequested(question);
    }

    /// @notice Settle the assertion and retrieve the resolved result.
    /// @dev Settles the assertion and fetches the boolean result from the oracle.
    function settleData() external {
        // Settle the assertion to finalize its result
        oracle.settleAssertion(assertionId);

        // Fetch the resolved result (true for "Yes", false for "No")
        bool outcome = oracle.getAssertionResult(assertionId);

        emit DataSettled(outcome);
    }
}
