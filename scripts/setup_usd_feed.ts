import { ethers, getNamedAccounts, network } from 'hardhat'

async function main() {
  const { ORACLE, FEED, DAI, USDC, USDT } = await getNamedAccounts()
  let oracle

  if (network.name === 'andromeda') {
  } else {
    oracle = await ethers.getContractAt('ChainlinkProxyPriceProvider', ORACLE)
  }
  const tx = await oracle.setAssetSources([DAI, USDC, USDT], [FEED, FEED, FEED])
  await tx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
