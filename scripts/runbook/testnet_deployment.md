# Testnet Deployment

Deploy these contracts prior to doing a core pool deployment.

1. Deploy the Mock ERC20 Contracts for DAI, USDC, and USDT. Set the `DAI`, `USDC`, and `USDT` variables in `hardhat.config.ts`.

```
npx hardhat run scripts/testnet/deploy_mock_erc20.ts
```

2. Deploy the Mock Chainlink Data Feed. Set the `MOCK_FEED` variable in the `hardhat.config.ts`.

```
npx hardhat run scripts/testnet/deploy_mock_data_feed.ts
```

3. Setup the Mock Data Feed.

```
npx hardhat run scripts/testnet/setup_mock_data_feed.ts
```
