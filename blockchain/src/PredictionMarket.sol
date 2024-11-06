// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title PredictionMarket
/// @notice A simple prediction market where users can bet on a "Yes" or "No" outcome.
/// @dev Utilizes an external oracle for resolving the market outcome.
contract PredictionMarket {
    
    // State variables
    address public owner;            // Owner of the contract, responsible for managing key functions.
    address public oracleRelayer;    // Address of the oracle relayer responsible for setting the market outcome.
    uint public deadline;            // Deadline for betting, after which no more bets are allowed.
    bool public marketResolved;      // Indicates whether the market outcome has been resolved.
    bool public outcome;             // The final outcome of the market: true (Yes) or false (No).

    // Mappings to track user bets and total bets
    mapping(address => uint) public betsOnYes;  // Amount of ether each user has bet on "Yes".
    mapping(address => uint) public betsOnNo;   // Amount of ether each user has bet on "No".
    uint public totalBetsOnYes;                 // Total amount of ether bet on "Yes".
    uint public totalBetsOnNo;                  // Total amount of ether bet on "No".

    // Events
    event RequestOracleData(uint256 timestamp, string question);  // Emitted when oracle data is requested.
    event MarketResolved(bool outcome);                           // Emitted when the market is resolved.

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    modifier onlyRelayer() {
        require(msg.sender == oracleRelayer, "Only relayer can call");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Betting period over");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Betting period ongoing");
        _;
    }

    /// @notice Constructor to initialize the prediction market.
    /// @param _bettingDuration Duration in seconds for which betting is allowed.
    /// @param _oracleRelayer Address of the oracle relayer.
    constructor(uint _bettingDuration, address _oracleRelayer) {
        owner = msg.sender;
        deadline = block.timestamp + _bettingDuration;
        oracleRelayer = _oracleRelayer;
    }

    /// @notice Allows users to place a bet on "Yes".
    /// @dev Only callable before the betting deadline.
    function betYes() external payable beforeDeadline {
        require(msg.value > 0, "Bet amount must be greater than zero");
        betsOnYes[msg.sender] += msg.value;
        totalBetsOnYes += msg.value;
    }

    /// @notice Allows users to place a bet on "No".
    /// @dev Only callable before the betting deadline.
    function betNo() external payable beforeDeadline {
        require(msg.value > 0, "Bet amount must be greater than zero");
        betsOnNo[msg.sender] += msg.value;
        totalBetsOnNo += msg.value;
    }

    /// @notice Requests data from the oracle by emitting an event.
    /// @param question The question to be resolved by the oracle.
    /// @dev Only callable by the owner after the betting deadline.
    function requestMarketData(string memory question) external onlyOwner afterDeadline {
        emit RequestOracleData(block.timestamp, question);
    }

    /// @notice Resolves the market based on the outcome provided by the oracle.
    /// @param _outcome The outcome of the market: true for "Yes", false for "No".
    /// @dev Only callable by the oracle relayer and only once per market.
    function resolveMarket(bool _outcome) external onlyRelayer {
        require(!marketResolved, "Market already resolved");
        outcome = _outcome;
        marketResolved = true;
        emit MarketResolved(outcome);
    }

    /// @notice Allows users to claim their winnings based on the market outcome.
    /// @dev Users can claim their winnings after the market is resolved.
    function claimWinnings() external afterDeadline {
        require(marketResolved, "Market not resolved");
        uint winnings;

        if (outcome) {
            require(betsOnYes[msg.sender] > 0, "No winnings to claim");
            winnings = (betsOnYes[msg.sender] * address(this).balance) / totalBetsOnYes;
            betsOnYes[msg.sender] = 0;  // Reset to prevent re-entry
        } else {
            require(betsOnNo[msg.sender] > 0, "No winnings to claim");
            winnings = (betsOnNo[msg.sender] * address(this).balance) / totalBetsOnNo;
            betsOnNo[msg.sender] = 0;  // Reset to prevent re-entry
        }

        payable(msg.sender).transfer(winnings);  // Transfer winnings to the user
    }

    /// @notice Allows the owner to withdraw unclaimed funds after the market is resolved.
    /// @dev Ensures that the market outcome has been resolved before withdrawing funds.
    function withdrawUnclaimedFunds() external onlyOwner {
        require(marketResolved, "Market must be resolved before withdrawing");
        payable(owner).transfer(address(this).balance);
    }
}
