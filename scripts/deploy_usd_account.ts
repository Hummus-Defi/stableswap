import { deployAggregateAccount } from './helpers/deploy'

async function main() {
  await deployAggregateAccount('USD', true)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
