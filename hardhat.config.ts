import 'dotenv/config'

import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-solhint'
// import '@nomiclabs/hardhat-etherscan'
import 'metis-sourcecode-verify'
import '@typechain/hardhat'
import '@openzeppelin/hardhat-upgrades'
import 'solidity-coverage'
import 'hardhat-abi-exporter'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'hardhat-docgen'
import '@hardhat-docgen/core'
import '@hardhat-docgen/markdown'
import 'hardhat-contract-sizer'
import 'hardhat-spdx-license-identifier'

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
  abiExporter: {
    flat: true,
    clear: true,
    runOnCompile: true,
    path: './build/abi',
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  mocha: {
    timeout: 200000,
  },
  namedAccounts: {
    // accounts

    deployer: 0,

    // contracts
    FEED: {
      42: '0x12Fd2C9F869Ff1ac194209daE34e0be688A58086',
      588: '0x3d7d3Bc096A8d77c87761da6A06a12c039F467B6',
      1088: '0x6E6E633320Ca9f2c8a8722c5f4a993D9a093462E', // DIA, https://docs.diadata.org/documentation/oracle-documentation/deployed-contracts
    },
    ORACLE: {
      42: '0xC711114a030337efe434FEA747B0f81bC926B640',
      588: '0xFE0401CeCBfDA864cAE84F8e716B71e32eD405aE',
    },
    ROUTER: {
      42: '0xE8a371e7A4aA192c6ae06cf31d1FbA30D57F99a0',
      1088: '0x6B6F7437DF9cE9552ED7Fc8f529BAf48fb305534',
    },
    USD_POOL: {
      42: '0x4411744f2687a7EF3e9770bf29b7afD2834A2Ade',
      588: '0x4114458c9b16850309143cF2688D3a6185e975C3',
      1088: '0x7AA7E41871B06f15Bccd212098DeE98d944786ab',
    },
    USD_ACCOUNT: {
      42: '0x24BBD559a81971A37E6fCaEfc02E8Ed54FDdd7A9',
      588: '0x0B86B14E970c4462f6703Ba1DaF93Ec9EEeD92d0',
      1088: '0x866F899a6562cD7a3d220249da374AB4F972D3C5',
    },

    // tokens

    DAI: {
      42: '0x3d7d3Bc096A8d77c87761da6A06a12c039F467B6',
      588: '0x4c7A71a7B2066f71db85d3Cc4eD96f55cb509F8e',
      1088: '0x4651B38e7ec14BB3db731369BFE5B08F2466Bd0A', // rDAI
    },
    USDC: {
      42: '0xE4E979C680cCCD0498fA35BC28b81cCf46a91d3e',
      588: '0x159B73D85b93E9F108F7FCCB77Ae1271607682db',
      1088: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21', // m.USDC
    },
    USDT: {
      42: '0x4cE4541832b31b2D6E581759D07f0838e7FEeE5b',
      588: '0x24BBD559a81971A37E6fCaEfc02E8Ed54FDdd7A9',
      1088: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC', // m.USDT
    },

    // LP assets
    HLPDAI: {
      42: '0x53211440f038dBBe9DE1B9fa58757cb430ecb752',
      588: '0xaFFbDb406d41b9a1AFD041FeBD412A2dd236244C',
      1088: '0xd5A0760D55ad46B6A1C46D28725e4C117312a7aD',
    },
    HLPUSDC: {
      42: '0x0F6f2E19Bc2Ad2b847dd329A0D89DC0043003754',
      588: '0xa6ae03Ff644156401205Afb6d241f245E3714F78',
      1088: '0x9E3F3Be65fEc3731197AFF816489eB1Eb6E6b830',
    },
    HLPUSDT: {
      42: '0x44ba84500C5CeEB235653BA4952bc61F376847Ec',
      588: '0xF8F6F0C986B2dE4ABf1E8AAE12ffad3A376438D2',
      1088: '0x9F51f0D7F500343E969D28010C7Eb0Db1bCaAEf9',
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
    apiKey: {
      metisAndromeda: 'apikey',
    },
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
