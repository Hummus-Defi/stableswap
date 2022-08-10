import { getNamedAccounts } from 'hardhat'
import { deployAggregateAccount, deployAsset, deployPool, deployPoolSecondary } from '../helpers/deploy'
import { addAsset, setPool } from '../helpers/transaction'

async function main() {
  const { USDC, USDT, DAI_OLD, DAI } = await getNamedAccounts()

  // deploy agg acct
  const account = await deployAggregateAccount('USD', true)

  // deploy assets
  const usdc = await deployAsset(USDC, 'Hummus USDC Token', 'HLP-m.USDC', account.address)
  const usdt = await deployAsset(USDT, 'Hummus USDT Token', 'HLP-m.USDT', account.address)
  const daiOld = await deployAsset(DAI_OLD, 'Hummus DAI Stablecoin', 'HLP-DAI', account.address)
  const dai = await deployAsset(DAI, 'Hummus DAI Token', 'HLP-m.DAI', account.address)

  // deploy pool
  const pool = await deployPool()

  // init assets
  await setPool(usdc.address, pool.address)
  await setPool(usdt.address, pool.address)
  await setPool(daiOld.address, pool.address)
  await setPool(dai.address, pool.address)

  // init pool
  await addAsset(pool.address, usdc.address, USDC)
  await addAsset(pool.address, usdt.address, USDT)
  await addAsset(pool.address, daiOld.address, DAI_OLD)
  await addAsset(pool.address, dai.address, DAI)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
