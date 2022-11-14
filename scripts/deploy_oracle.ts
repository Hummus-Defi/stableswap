import { network } from 'hardhat'
import { deployDiaOracle, deployOracle, deployOracleProvider } from './helpers/deploy'

async function main() {
  if (network.name === 'andromeda') {
    await deployOracleProvider()
  } else {
    await deployOracle()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
