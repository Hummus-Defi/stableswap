import { parseUnits } from 'ethers/lib/utils'
import { deployMockDataFeed } from '../helpers/deploy'

async function main() {
  const feed = await deployMockDataFeed()
  const tx = await feed.setLatestAnswer(parseUnits('1', 8), Math.floor(Date.now() / 1000))
  await tx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
