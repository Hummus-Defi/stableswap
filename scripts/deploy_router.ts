import { deployRouter } from './helpers/deploy'

async function main() {
  await deployRouter()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
