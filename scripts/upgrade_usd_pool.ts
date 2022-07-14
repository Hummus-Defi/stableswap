import { getNamedAccounts } from 'hardhat'
import { upgradePool } from './helpers/upgrade'

async function main() {
  const { USD_POOL } = await getNamedAccounts()
  await upgradePool(USD_POOL)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
