import { deployFraxRateProvider, deployRateProvider } from './helpers/deploy'
import { getNamedAccounts } from 'hardhat'

async function main() {
  const { FRXETH_FEEDHIGH, SFRXETH_FEED, ETH_FEED } = await getNamedAccounts()
  await deployFraxRateProvider(SFRXETH_FEED, FRXETH_FEEDHIGH, ETH_FEED)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
