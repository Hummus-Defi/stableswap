import { ethers, upgrades } from 'hardhat'

export const upgradePool = async (proxyAddress: string) => {
  const Pool = await ethers.getContractFactory('Pool')
  console.log('Upgrading Pool...')
  const pool = await upgrades.upgradeProxy(proxyAddress, Pool, { unsafeAllow: ['delegatecall'] })
  console.log('Upgraded Pool.')
  return pool
}

export const upgradePoolV2 = async (proxyAddress: string) => {
  const PoolV2 = await ethers.getContractFactory('PoolV2')
  console.log('Upgrading PoolV2...')
  const pool = await upgrades.upgradeProxy(proxyAddress, PoolV2, { unsafeAllow: ['delegatecall'] })
  console.log('Upgraded PoolV2.')
  return pool
}

export const upgradePoolSecondaryV2 = async (proxyAddress: string) => {
  const PoolSecondaryV2 = await ethers.getContractFactory('PoolSecondaryV2')
  console.log('Upgrading PoolSecondaryV2...')
  const pool = await upgrades.upgradeProxy(proxyAddress, PoolSecondaryV2, { unsafeAllow: ['delegatecall'] })
  console.log('Upgraded PoolSecondaryV2.')
  return pool
}
