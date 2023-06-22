import { deployRateProvider } from '../helpers/deploy'
import { getNamedAccounts } from 'hardhat'

async function main() {
  const { BTC_FEED, ETH_FEED, METIS_FEED, USDC_FEED } = await getNamedAccounts()
  await deployRateProvider(BTC_FEED)
  await deployRateProvider(ETH_FEED)
  await deployRateProvider(METIS_FEED)
  await deployRateProvider(USDC_FEED)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
