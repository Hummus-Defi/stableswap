import { ethers, getNamedAccounts, network } from 'hardhat'

async function main() {
  const { ORACLE, FEED, DAI, USDC, USDT } = await getNamedAccounts()
  let oracle, tx

  if (network.name === 'andromeda') {
    oracle = await ethers.getContractAt('DiaProxyPriceProvider', ORACLE)
    tx = await oracle.setAssetSources([DAI, USDC, USDT], [FEED, FEED, FEED], ['DAI/USD', 'USDC/USD', 'USDT/USD'])
    await tx.wait()
  } else {
    oracle = await ethers.getContractAt('ChainlinkProxyPriceProvider', ORACLE)
    tx = await oracle.setAssetSources([DAI, USDC, USDT], [FEED, FEED, FEED])
    await tx.wait()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
