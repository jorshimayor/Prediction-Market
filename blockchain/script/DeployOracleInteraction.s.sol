// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import "../src/OracleInteraction.sol";

contract DeployOracleInteraction is Script {
       function run() external {
        vm.startBroadcast();
        
        address oracleAddress = 0xFd9e2642a170aDD10F53Ee14a93FcF2F31924944;  // UMA's deployed oracle address
        address bondCurrency = 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43; // ERC20 Token for bonds

        new OracleInteraction(oracleAddress, bondCurrency);

        vm.stopBroadcast();

        console.log("OracleInteraction deployed at:", address(oracleInteraction));

    }
}

// forge script script/DeployOracleInteraction.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
