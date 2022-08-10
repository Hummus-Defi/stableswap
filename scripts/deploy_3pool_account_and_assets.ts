import { getNamedAccounts } from 'hardhat'
import { deployAggregateAccount, deployAsset } from './helpers/deploy'

async function main() {
  const { METIS, USDC, WETH } = await getNamedAccounts()

  const account = await deployAggregateAccount('3pool', false)

  await deployAsset(USDC, 'Metis USDC Token', 'HLP-m.USDC-3Pool', account.address)
  await deployAsset(METIS, 'Metis Token', 'HLP-METIS-3Pool', account.address)
  await deployAsset(WETH, 'Metis WETH Token', 'HLP-ETH-3Pool', account.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
