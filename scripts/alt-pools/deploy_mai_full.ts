import { getNamedAccounts } from 'hardhat'
import { deployAggregateAccount, deployAsset, deployPoolSecondary } from '../helpers/deploy'
import { addAsset, setPool } from '../helpers/transaction'

async function main() {
  const { USDC, MAI } = await getNamedAccounts()
  const account = await deployAggregateAccount('USD_MAI', true)

  const usdc = await deployAsset(USDC, 'Hummus USDC Token (MAI)', 'HLP-m.USDC-MAI', account.address)
  const mai = await deployAsset(MAI, 'Hummus Mai Stablecoin', 'HLP-MAI', account.address)

  const pool = await deployPoolSecondary()

  // set pool on usdc/mai
  await setPool(usdc.address, pool.address)
  await setPool(mai.address, pool.address)

  // add usdc/mai to pool
  await addAsset(pool.address, usdc.address, USDC)
  await addAsset(pool.address, mai.address, MAI)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
