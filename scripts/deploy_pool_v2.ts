import { deployPoolV2 } from './helpers/deploy'

async function main() {
  await deployPoolV2()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
