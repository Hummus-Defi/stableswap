import { ethers } from 'hardhat'

// Asset

export const setPool = async (assetAddress: string, pool: string) => {
  const asset = await ethers.getContractAt('Asset', assetAddress)
  const tx = await asset.setPool(pool)
  await tx.wait()
}

// Pool

export const setPriceOracle = async (poolAddress: string, priceOracle: string) => {
  const pool = await ethers.getContractAt('Pool', poolAddress)
  const tx = await pool.setPriceOracle(priceOracle)
  await tx.wait()
}

export const addAsset = async (poolAddress: string, asset: string, token: string) => {
  const pool = await ethers.getContractAt('Pool', poolAddress)
  const tx = await pool.addAsset(token, asset)
  await tx.wait()
}

// Router

export const approveSpendingByPool = async (routerAddress: string, pool: string, tokens: string[]) => {
  const router = await ethers.getContractAt('HummusRouter01', routerAddress)
  const tx = await router.approveSpendingByPool(tokens, pool)
  await tx.wait()
}
