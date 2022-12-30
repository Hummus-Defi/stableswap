import { getNamedAccounts } from 'hardhat'
import { deployAsset } from './helpers/deploy'

async function main() {
  const { USD_ACCOUNT, DAI_V2 } = await getNamedAccounts()

  await deployAsset(DAI_V2, 'Hummus DAI Token', 'HLP-m.DAI', USD_ACCOUNT)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
