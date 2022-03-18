import 'dotenv/config'

import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-solhint'
import '@nomiclabs/hardhat-etherscan'
import '@typechain/hardhat'
import '@openzeppelin/hardhat-upgrades'
import 'solidity-coverage'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'hardhat-docgen'
import '@hardhat-docgen/core'
import '@hardhat-docgen/markdown'
import 'hardhat-contract-sizer'

import { HardhatUserConfig } from 'hardhat/config'

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    mainnet: {
      url: process.env.ALCHEMY_API || '',
      gasPrice: 140 * 1000000000,
    },
    rinkeby: {
      url: process.env.RINKEBY_API || '',
      chainId: 4,
      gasPrice: 5 * 1000000000,
    },
    kovan: {
      url: process.env.KOVAN_API || '',
      chainId: 42,
      gasPrice: 2 * 1000000000,
    },
    stardust: {
      url: 'https://stardust.metis.io/?owner=588',
      chainId: 588,
    },
    andromeda: {
      url: 'https://andromeda.metis.io/?owner=1088',
      chainId: 1088,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: './build/typechain/',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 200000,
  },
  namedAccounts: {
    // accounts

    deployer: 0,

    // contracts

    DIA: {
      1088: '0x6E6E633320Ca9f2c8a8722c5f4a993D9a093462E',
    },
    MOCK_FEED: {
      42: '0x12Fd2C9F869Ff1ac194209daE34e0be688A58086',
    },
    ORACLE: {
      42: '0xC711114a030337efe434FEA747B0f81bC926B640',
      // 1088: '0x6E6E633320Ca9f2c8a8722c5f4a993D9a093462E', // https://docs.diadata.org/documentation/oracle-documentation/deployed-contracts
    },
    ROUTER: {
      42: '0xE8a371e7A4aA192c6ae06cf31d1FbA30D57F99a0',
    },
    USD_POOL: {
      42: '0x4411744f2687a7EF3e9770bf29b7afD2834A2Ade',
    },
    USD_ACCOUNT: {
      4: '',
      42: '0x24BBD559a81971A37E6fCaEfc02E8Ed54FDdd7A9',
      1088: '',
    },

    // tokens

    DAI: {
      42: '0x3d7d3Bc096A8d77c87761da6A06a12c039F467B6',
      1088: '0x4651B38e7ec14BB3db731369BFE5B08F2466Bd0A',
    },
    HLPDAI: {
      42: '0x53211440f038dBBe9DE1B9fa58757cb430ecb752',
    },
    HLPUSDC: {
      42: '0x0F6f2E19Bc2Ad2b847dd329A0D89DC0043003754',
    },
    HLPUSDT: {
      42: '0x44ba84500C5CeEB235653BA4952bc61F376847Ec',
    },

    USDC: {
      42: '0xE4E979C680cCCD0498fA35BC28b81cCf46a91d3e',
      1088: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21', // m.USDC
    },
    USDT: {
      42: '0x4cE4541832b31b2D6E581759D07f0838e7FEeE5b',
      1088: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC', // m.USDT
    },
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: false,
    except: ['/test/*', '/mock/*', '/hardhat-proxy/*'],
  },
  etherscan: {
    // API key for snowtrace.io
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}

if (process.env.ACCOUNT_PRIVATE_KEYS) {
  config.networks = {
    ...config.networks,
    mainnet: {
      ...config.networks?.mainnet,
      accounts: JSON.parse(process.env.ACCOUNT_PRIVATE_KEYS),
    },
    rinkeby: {
      ...config.networks?.rinkeby,
      accounts: JSON.parse(process.env.ACCOUNT_PRIVATE_KEYS),
    },
    kovan: {
      ...config.networks?.kovan,
      accounts: JSON.parse(process.env.ACCOUNT_PRIVATE_KEYS),
    },
    stardust: {
      ...config.networks?.stardust,
      accounts: JSON.parse(process.env.ACCOUNT_PRIVATE_KEYS),
    },
    andromeda: {
      ...config.networks?.andromeda,
      accounts: JSON.parse(process.env.ACCOUNT_PRIVATE_KEYS),
    },
  }
}

if (process.env.FORK_MAINNET && config.networks) {
  config.networks.hardhat = {
    forking: {
      url: process.env.ALCHEMY_API ? process.env.ALCHEMY_API : '',
    },
    chainId: 1,
  }
}

config.gasReporter = {
  enabled: process.env.REPORT_GAS ? true : false,
}

export default config
