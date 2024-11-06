// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import "../src/PredictionMarket.sol";

contract DeployPredictionMarket is Script {
        function run() external {
        vm.startBroadcast();
        
        address oracleRelayer = 0xEEE5BEC08C3fd98535183c247931FFC439778A7C;
        uint bettingDuration = 1 weeks;

        new PredictionMarket(bettingDuration, oracleRelayer);

        vm.stopBroadcast();

        console.log("PredictionMarket deployed at:", address(predictionMarket));

    }
}
// forge script script/DeployPredictionMarket.s.sol --rpc-url $KAIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
