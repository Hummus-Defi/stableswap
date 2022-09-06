import { getNamedAccounts } from 'hardhat'
import { deployAsset } from './helpers/deploy'

async function main() {
  const { USD_ACCOUNT, BUSD } = await getNamedAccounts()

  await deployAsset(BUSD, 'Hummus Binance USD', 'HLP-m.BUSD', USD_ACCOUNT)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
