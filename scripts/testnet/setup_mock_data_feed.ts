import { ethers, getNamedAccounts } from 'hardhat'

async function main() {
  const { ORACLE, MOCK_FEED, DAI, USDC, USDT } = await getNamedAccounts()
  const oracle = await ethers.getContractAt('ChainlinkProxyPriceProvider', ORACLE)
  const tx = await oracle.setAssetSources([DAI, USDC, USDT], [MOCK_FEED, MOCK_FEED, MOCK_FEED])
  await tx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
