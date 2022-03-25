import { getNamedAccounts } from 'hardhat'
import { approveSpendingByPool } from './helpers/transaction'

async function main() {
  const { ROUTER, USD_POOL, DAI, USDC, USDT } = await getNamedAccounts()
  await approveSpendingByPool(ROUTER, USD_POOL, [USDC, USDT, DAI])
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
