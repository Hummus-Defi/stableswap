import { parseEther, parseUnits } from 'ethers/lib/utils'
import { deployMockERC20 } from '../helpers/deploy'

async function main() {
  await deployMockERC20('DAI Stablecoin', 'DAI', 18, parseEther('1000000'))
  await deployMockERC20('USDC Token', 'm.USDC', 6, parseUnits('1000000', 6))
  await deployMockERC20('USDT Token', 'm.USDT', 6, parseUnits('1000000', 6))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
