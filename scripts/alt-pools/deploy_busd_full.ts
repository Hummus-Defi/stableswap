import { getNamedAccounts } from 'hardhat'
import { deployAggregateAccount, deployAsset, deployPoolSecondary } from '../helpers/deploy'

async function main() {
  const { USDC, BUSD } = await getNamedAccounts()
  const account = await deployAggregateAccount('USD_BUSD', true)

  const usdc = await deployAsset(USDC, 'Hummus USDC Token (BUSD)', 'HLP-m.USDC-BUSD', account.address)
  const busd = await deployAsset(BUSD, 'Hummus Poly-Peg BUSD', 'HLP-BUSD', account.address)

  const pool = await deployPoolSecondary()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
