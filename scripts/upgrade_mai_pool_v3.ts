import { getNamedAccounts } from 'hardhat'
import { upgradePoolSecondaryV3 } from './helpers/upgrade'

async function main() {
  const { MAI_POOL } = await getNamedAccounts()
  await upgradePoolSecondaryV3(MAI_POOL)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
