import { getNamedAccounts } from 'hardhat'
import { deployTimelock } from './helpers/deploy'

const TWO_DAYS = 60 * 60 * 24 * 2

async function main() {
  const { deployer, multisig } = await getNamedAccounts()

  await deployTimelock(TWO_DAYS, [deployer, multisig], [deployer, multisig])
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
