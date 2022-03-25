import { getNamedAccounts } from 'hardhat'
import { deployAsset } from './helpers/deploy'

async function main() {
  const { USD_ACCOUNT, DAI, USDC, USDT } = await getNamedAccounts()

  await deployAsset(USDC, 'Hummus USDC Token', 'HLP-m.USDC', USD_ACCOUNT)
  await deployAsset(USDT, 'Hummus USDT Token', 'HLP-m.USDT', USD_ACCOUNT)
  await deployAsset(DAI, 'Hummus DAI Stablecoin', 'HLP-DAI', USD_ACCOUNT)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
