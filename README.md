# Prediction Market

This repository contains smart contracts for a decentralized, cross-chain prediction market. The project utilizes **UMA's Optimistic Oracle V3** on Ethereum (Sepolia) for secure data resolution and **Kaia Blockchain** for managing user interactions and bets. The architecture leverages an off-chain relayer to handle cross-chain communication.

## Project Structure

- **src/**: Contains the main smart contracts:
  - `PredictionMarket.sol`: The main prediction market contract deployed on Kaia. Users place bets on outcomes, and an off-chain relay resolves the outcome based on UMA’s Oracle.
  - `OracleInteraction.sol`: Deployed on Ethereum (Sepolia), this contract interacts with UMA's Optimistic Oracle to submit and settle assertions.
  - `OptimisticOracleV3Interface.sol`: This is the UMA Protocol optimistic oracle smart contract for disputing and asserting data from Kaia's prediction market
- **script/**: Deployment scripts for each contract using Foundry.
- **test/**: Test scripts for simulating contract functionality.

## Setup

1. **Install Dependencies**:
   ```bash
   forge install
   ```

2. **Environment Variables**:
   Create a `.env` file with your environment variables:
   ```plaintext
   KAIA_RPC_URL="https://kaia-rpc-url"
   SEPOLIA_RPC_URL="https://sepolia-rpc-url"
   PRIVATE_KEY="your_private_key"
   ```

## Deployment

1. **Deploy `PredictionMarket` to Kaia**:
   ```bash
   forge script script/DeployPredictionMarket.s.sol:DeployPredictionMarket --rpc-url $KAIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
   ```

2. **Deploy `OracleInteraction` to Sepolia**:
   ```bash
   forge script script/DeployOracleInteraction.s.sol:DeployOracleInteraction --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
   ```

## Usage

- **Place Bets**: Users can interact with the `PredictionMarket` contract on Kaia to place "Yes" or "No" bets.
- **Resolve Market**: An off-chain relay will monitor and call `OracleInteraction` on Sepolia to get the outcome from UMA’s Optimistic Oracle. The relay will then call `resolveMarket` on Kaia’s `PredictionMarket`.

## Testing

Run all tests using Foundry:
```bash
forge test
```
