import { getNamedAccounts } from 'hardhat'
import { upgradePoolV2 } from './helpers/upgrade'

async function main() {
  const { USD_POOL } = await getNamedAccounts()
  await upgradePoolV2(USD_POOL)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
