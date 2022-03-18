# USD Stableswap Deployment

## Oracle Deployment

1. Deploy the Oracle, if not done previously

```
npx hardhat run scripts/deploy_oracle.ts --network <network-name>
```

2. Add USD Asset Price Feeds

```
TBD
```

## Pool Deployment

1. Deploy the USD Pool

```
npx hardhat run scripts/deploy_pool.ts --network <network-name>
```

2. Deploy the USD Aggregate Account

```
npx hardhat run scripts/deploy_usd_account.ts --network <network-name>
```

3. Deploy the USD Pool Assets

```
npx hardhat run scripts/deploy_usd_assets.ts --network <network-name>
```

4. Setup the Pool (Set Price Oracle, Add USD Assets)

```
npx hardhat run scripts/deploy_usd_pool.ts --network <network-name>
```

## Router Deployment

1. Deploy the Router

```
npx hardhat run scripts/deploy_router.ts
```

2. Setup the Router (Approve Pool USD Assets)

```
npx hardhat run scripts/setup_usd_router.ts
```
