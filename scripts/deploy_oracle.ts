import { deployOracle } from './helpers/deploy'

async function main() {
  await deployOracle()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
