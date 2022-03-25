import { ethers, getNamedAccounts } from 'hardhat'
import { addAsset, setPool, setPriceOracle } from './helpers/transaction'

async function initPoolAsset(pool: string, asset: string, token: string) {
  await setPool(asset, pool)
  await addAsset(pool, asset, token)
}

async function main() {
  const { USD_POOL, HLPDAI, HLPUSDC, HLPUSDT, DAI, USDC, USDT } = await getNamedAccounts()

  // await setPriceOracle(USD_POOL, ORACLE)

  await initPoolAsset(USD_POOL, HLPUSDC, USDC)
  await initPoolAsset(USD_POOL, HLPUSDT, USDT)
  await initPoolAsset(USD_POOL, HLPDAI, DAI)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
