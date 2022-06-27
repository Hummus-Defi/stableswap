import { deployPoolVariable } from './helpers/deploy'

async function main() {
  await deployPoolVariable()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
