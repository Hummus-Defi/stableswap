import { parseEther, parseUnits } from 'ethers/lib/utils'
import { deployMockERC20 } from '../helpers/deploy'

async function main() {
  await deployMockERC20('Binance USD', 'm.BUSD', 18, parseEther('1000000'))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
