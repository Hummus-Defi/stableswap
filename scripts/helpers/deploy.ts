import { BigNumberish } from 'ethers'
import { ethers, upgrades } from 'hardhat'

// Proxies

export const deployAggregateAccount = async (accountName: string, isStable: boolean) => {
  const AggregateAccount = await ethers.getContractFactory('AggregateAccount')
  console.log('Deploying AggregateAccount...')
  const aggregateAccount = await upgrades.deployProxy(AggregateAccount, [accountName, isStable])
  await aggregateAccount.deployed()
  console.log('Deployed to:', aggregateAccount.address)
  return aggregateAccount
}

export const deployAsset = async (tokenAddress: string, name: string, symbol: string, aggregateAddress: string) => {
  const Asset = await ethers.getContractFactory('Asset')
  console.log('Deploying Asset:', name)
  const asset = await upgrades.deployProxy(Asset, [tokenAddress, name, symbol, aggregateAddress], {
    unsafeAllow: ['delegatecall'],
  })
  await asset.deployTransaction.wait()
  console.log('Deployed to:', asset.address)
  return asset
}

export const deployPool = async () => {
  const Pool = await ethers.getContractFactory('Pool')
  console.log('Deploying Pool...')
  const pool = await upgrades.deployProxy(Pool, [], { unsafeAllow: ['delegatecall'] })
  await pool.deployTransaction.wait()
  console.log('Deployed to:', pool.address)
  return pool
}

// Immutable

export const deployOracle = async () => {
  const ChainlinkProxyPriceProvider = await ethers.getContractFactory('ChainlinkProxyPriceProvider')
  console.log('Deploying ChainlinkProxyPriceProvider...')
  const chainlinkProxyPriceProvider = await ChainlinkProxyPriceProvider.deploy([], [])
  await chainlinkProxyPriceProvider.deployed()
  console.log('Deployed to:', chainlinkProxyPriceProvider.address)
  return chainlinkProxyPriceProvider
}

export const deployRouter = async () => {
  const RouterFactory = await ethers.getContractFactory('HummusRouter01')
  console.log('Deploying HummusRouter01...')
  const router = await RouterFactory.deploy()
  await router.deployed()
  console.log('Deployed to:', router.address)
  return router
}

// Testnet

export const deployMockERC20 = async (name: string, symbol: string, decimals: number, supply: BigNumberish) => {
  const MintableFactory = await ethers.getContractFactory('TestERC20')
  console.log('Deploying TestERC20:', name)
  const mintable = await MintableFactory.deploy(name, symbol, decimals, supply)
  await mintable.deployed()
  console.log('Deployed at:', mintable.address)
  return mintable
}

export const deployMockDataFeed = async () => {
  const TestChainlinkAggregatorFactory = ethers.getContractFactory('TestChainlinkAggregator')
  console.log('Deploying TestChainlinkAggregator...')
  const testChainlinkAggregator = await (await TestChainlinkAggregatorFactory).deploy()
  await testChainlinkAggregator.deployed()
  console.log('Deployed at:', testChainlinkAggregator.address)
  return testChainlinkAggregator
}
