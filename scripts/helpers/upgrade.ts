import { ethers, upgrades } from "hardhat"

export const upgradePool = async (proxyAddress:string) => {
  const Pool = await ethers.getContractFactory('Pool')
  console.log('Upgrading Pool...')
  const pool = await upgrades.upgradeProxy(proxyAddress, Pool, { unsafeAllow: ['delegatecall'] })
  console.log('Upgraded Pool.')
  return pool
}