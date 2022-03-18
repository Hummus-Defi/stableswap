import { deployPool } from './helpers/deploy'

async function main() {
  await deployPool()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
