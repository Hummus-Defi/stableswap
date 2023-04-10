import 'dotenv/config'

import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-solhint'
import '@nomiclabs/hardhat-etherscan'
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
  networks: {
    goerli: {
      url: 'https://goerli.gateway.metisdevops.link',
      chainId: 599,
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
      {
        version: '0.8.2',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      }
    ],
  },
  typechain: {
    outDir: './build/typechain',
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
    multisig: {
      599: 0,
      1088: '0x08961b470a39bEE12435f3742aFaA70B64DCa893',
    },

    // contracts
    FEED: {
      599: '0xEcE9362Df2501aB3FbfE868C488ce195c1052D9D', // TestChainlinkAggregator
      1088: '0xa479FC13e40155e853e790115423704BF06a065F', // DIA, https://docs.diadata.org/documentation/oracle-documentation/deployed-contracts
    },
    ORACLE: {
      599: '0x4114458c9b16850309143cF2688D3a6185e975C3', // ChainlinkProxyPriceProvider
      1088: '0xdF7f13dE0b969413b9b801a6771e9fDd73Ea058c', // OracleProvider
      // 1088: '0x3f1c587090c6ED373D71f7623201f724BBB0a6bf', // Old DiaProxyPriceProvider
    },
    ROUTER: {
      599: '0x77c0708c4553b5CfD9c18017f222d873EcB0a64F',
      1088: '0x6B6F7437DF9cE9552ED7Fc8f529BAf48fb305534',
    },

    // Main Pool
    USD_POOL: {
      // 599: '0xaFFbDb406d41b9a1AFD041FeBD412A2dd236244C', // V1
      // 1088: '0x7AA7E41871B06f15Bccd212098DeE98d944786ab', // V1
      599: '0x9F51f0D7F500343E969D28010C7Eb0Db1bCaAEf9',
      1088: '0x248fD66e6ED1E0B325d7b80F5A7e7d8AA2b2528b',
    },
    USD_ACCOUNT: {
      599: '0xF8F6F0C986B2dE4ABf1E8AAE12ffad3A376438D2',
      1088: '0x866F899a6562cD7a3d220249da374AB4F972D3C5',
    },

    // Alt Pools
    MAI_ACCOUNT: {
      599: '0x6FFc3168E5Ba2Cf43C3e87a463c2CcDa7047B8Da',
      1088: '0x92C8c8F488D4797B81921451c82e9345D1196eC6',
    },
    MAI_POOL: {
      // 599: '0xeedd391103DEaa5370A4995800195f124B4fB49D', // V1
      // 1088: '0xeBe9BC8a373a3e8eCE71FAC4d9733DC9F6701869', // V1
      599: '0x5B70D206bF9d4c1c482179552815345Ea172dA7f',
      1088: '0x23f0b6274e3126f6b5c70faabbc59b04108b58ba',
    },

    // chainlink feeds, https://docs.chain.link/docs/data-feeds-metis/
    USDC_FEED: {
      1088: '0x663855969c85F3BE415807250414Ca9129533a5f',
    },
    USDT_FEED: {
      1088: '0x51864b8948Aa5e35aace2BaDaF901D63418A3b9D',
    },
    DAI_FEED: {
      1088: '0xe0351cAAE70B5AdBD0107cD5331AD1D79c4c1CA1'
    },

    // tokens

    BUSD: {
      // m.BUSD
      599: '0xB6932F9CCd572bE8Bc3174fbf10CF951e87505Fc',
      1088: '0xb809cda0c2f79f43248C32b5DcB09d5cD26BbF10',
    },
    DAI: {
      // Relay DAI, Deprecated
      599: '0x4c7A71a7B2066f71db85d3Cc4eD96f55cb509F8e',
      1088: '0x4651B38e7ec14BB3db731369BFE5B08F2466Bd0A',
    },
    DAI_V2: {
      // m.DAI
      599: '0x213d869824A1f24ba6E02B27e9B3063b85b6DED6',
      1088: '0x4c078361FC9BbB78DF910800A991C7c3DD2F6ce0',
    },
    MAI: {
      // Multichain MAI
      599: '0x4C9030F25F0E0e25E9bBA9734D350afCf4e574AA',
      1088: '0xdFA46478F9e5EA86d57387849598dbFB2e964b02',
    },
    USDC: {
      // m.USDC
      599: '0x159B73D85b93E9F108F7FCCB77Ae1271607682db',
      1088: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21',
    },
    USDT: {
      // m.USDT
      599: '0x24BBD559a81971A37E6fCaEfc02E8Ed54FDdd7A9',
      1088: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC',
    },
    QI: {
      599: '0x5d7FB1329d87467752a6Eb82Bca2530152992020',
      1088: '0x3F56e0c36d275367b8C502090EDF38289b3dEa0d',
    },
    METIS: {
      599: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
      1088: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    },
    WETH: {
      599: '0xc2b06A1707E7351bA25c2F0bA8287e1A233e4b9A',
      1088: '0x420000000000000000000000000000000000000A',
    },

    // Main Pool LP Assets
    HLPBUSD: {
      599: '0x3bfAAD9C299Af01AF1eB1c51cd934753dA000531',
      1088: '0x919395161Dd538aa0fB065A8EaC878B18D07FbCd',
    },
    HLPDAI: {
      599: '0x2e08D7A362a4d45Da76429a04E3DC6019E145794',
      1088: '0xd5A0760D55ad46B6A1C46D28725e4C117312a7aD',
    },
    HLPDAI_V2: {
      599: '0x1BF3c7B140867293F131548222DC1B5dD0baEd2B',
      1088: '0x0CAd02c4c6fB7c0d403aF74Ba9adA3bf40df6478',
    },
    HLPUSDC: {
      599: '0x25748645193FD23102CEFE2f62Ea688E17afFBC5',
      1088: '0x9E3F3Be65fEc3731197AFF816489eB1Eb6E6b830',
    },
    HLPUSDT: {
      599: '0x26083dD68999f46B79783DD25Fd2ed094ef7EAe8',
      1088: '0x9F51f0D7F500343E969D28010C7Eb0Db1bCaAEf9',
    },

    // Alt Pool LP Assets
    HLPUSDC_MAI: {
      599: '0x56990c5c86fe2afFdd9c7d28b9f85ef1C7a691Fe',
      1088: '0x8a19e755610aECB3c55BdE4eCfb9185ef0267400',
    },
    HLPMAI: {
      599: '0x2545b20912DeECa12a29BE7F6DCD9A5a56630eBf',
      1088: '0x3Eaa426861a283F0E46b6411aeB3C3608B090E0e',
    },
  },
  // docgen: {
  //   path: './docs',
  //   clear: true,
  //   runOnCompile: false,
  //   except: ['/test/*', '/mock/*', '/hardhat-proxy/*'],
  // },
  etherscan: {
    apiKey: 'api-key',
    customChains: [
      {
        network: "andromeda",
        chainId: 1088,
        urls: {
          apiURL: "https://andromeda-explorer.metis.io/api",
          browserURL: "https://andromeda-explorer.metis.io",
        },
      },
      {
        network: "goerli",
        chainId: 599,
        urls: {
          apiURL: "https://goerli.explorer.metisdevops.link/api",
          browserURL: "https://goerli.explorer.metisdevops.link",
        },
      },
    ],
  },
}

if (process.env.ACCOUNT_PRIVATE_KEYS) {
  config.networks = {
    ...config.networks,
    goerli: {
      ...config.networks?.goerli,
      accounts: JSON.parse(process.env.ACCOUNT_PRIVATE_KEYS),
    },
    andromeda: {
      ...config.networks?.andromeda,
      accounts: JSON.parse(process.env.ACCOUNT_PRIVATE_KEYS),
    },
  }
}

config.gasReporter = {
  enabled: process.env.REPORT_GAS ? true : false,
}

export default config
