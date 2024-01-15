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
    sepolia: {
      url: 'https://sepolia.rpc.metisdevops.link',
      chainId: 59901,
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
      },
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
      59901: 0,
      1088: '0x08961b470a39bEE12435f3742aFaA70B64DCa893',
    },

    // contracts
    FEED: {
      599: '0xEcE9362Df2501aB3FbfE868C488ce195c1052D9D', // TestChainlinkAggregator, $1 feed
      59901: '0x4114458c9b16850309143cF2688D3a6185e975C3', // TestChainlinkAggregator, $1 feed
      1088: '0xa479FC13e40155e853e790115423704BF06a065F', // DIA, https://docs.diadata.org/documentation/oracle-documentation/deployed-contracts
    },
    ORACLE: {
      599: '0x4114458c9b16850309143cF2688D3a6185e975C3', // ChainlinkProxyPriceProvider
      59901: '0x0B86B14E970c4462f6703Ba1DaF93Ec9EEeD92d0',
      1088: '0xdF7f13dE0b969413b9b801a6771e9fDd73Ea058c', // OracleProvider
      // 1088: '0x3f1c587090c6ED373D71f7623201f724BBB0a6bf', // Old DiaProxyPriceProvider
    },
    ROUTER: {
      599: '0x77c0708c4553b5CfD9c18017f222d873EcB0a64F',
      59901: '0x8b2AF921F3eaef0d9D6a47B65E1F7F83bEfB2f1f',
      1088: '0x6B6F7437DF9cE9552ED7Fc8f529BAf48fb305534',
    },

    // Main Pool
    USD_POOL: {
      // 599: '0xaFFbDb406d41b9a1AFD041FeBD412A2dd236244C', // V1

      // 1088: '0x7AA7E41871B06f15Bccd212098DeE98d944786ab', // V1
      599: '0x9F51f0D7F500343E969D28010C7Eb0Db1bCaAEf9',
      // 59901: '0xa6ae03Ff644156401205Afb6d241f245E3714F78',
      59901: '0x2f895C24ee749A9dC7e66c3355093E2440d5aAe1',
      1088: '0x248fD66e6ED1E0B325d7b80F5A7e7d8AA2b2528b',
    },
    USD_ACCOUNT: {
      599: '0xF8F6F0C986B2dE4ABf1E8AAE12ffad3A376438D2',
      59901: '0xFE0401CeCBfDA864cAE84F8e716B71e32eD405aE',
      1088: '0x866F899a6562cD7a3d220249da374AB4F972D3C5',
    },

    // Alt Pools
    MAI_ACCOUNT: {
      599: '0x6FFc3168E5Ba2Cf43C3e87a463c2CcDa7047B8Da',
      59901: '0x5F0eC89b44f66Be79f442C2E3214bd01dae4cb82',
      1088: '0x92C8c8F488D4797B81921451c82e9345D1196eC6',
    },
    MAI_POOL: {
      // 599: '0xeedd391103DEaa5370A4995800195f124B4fB49D', // V1
      // 1088: '0xeBe9BC8a373a3e8eCE71FAC4d9733DC9F6701869', // V1
      599: '0x5B70D206bF9d4c1c482179552815345Ea172dA7f',
      59901: '0x57e1228Cc8fBcAF0F1288AaDDe228f491d8470e6',
      1088: '0x5b7e71f6364da1716c44a5278098bc46711b9516',
    },

    // chainlink feeds, https://docs.chain.link/docs/data-feeds-metis/
    USDC_FEED: {
      599: '0xEcE9362Df2501aB3FbfE868C488ce195c1052D9D', // $1
      59901: '0x4114458c9b16850309143cF2688D3a6185e975C3',
      1088: '0x663855969c85F3BE415807250414Ca9129533a5f',
    },
    USDT_FEED: {
      1088: '0x51864b8948Aa5e35aace2BaDaF901D63418A3b9D',
    },
    DAI_FEED: {
      1088: '0xe0351cAAE70B5AdBD0107cD5331AD1D79c4c1CA1',
    },
    BTC_FEED: {
      599: '0xc5c290d3681a3B67bb47140F97c76BdE72469491', // $30k
      59901: '0x360ABFFd59C9aA5E9114d712C932E0ceA81FF472', // $40k
      1088: '0x51Ed8Fecf96813826F727CaBDF01b3cF6a61373e',
    },
    ETH_FEED: {
      599: '0x1BA958B67F33E54a0635C5174E1a67F3A65839D0', // $2k
      59901: '0x59965FFE39eff72e61aA68fFb5c058e0633b1adB', // $2.5k
      1088: '0x3BBe70e2F96c87aEce7F67A2b0178052f62E37fE',
    },
    METIS_FEED: {
      599: '0xeF5Fd1246fc5f851449df573F833F9Ec658cd3c5', // $20
      59901: '0xD630FAC060598Cc180d59AA35e87cFebdC473C2d', // $100
      1088: '0xD4a5Bb03B5D66d9bf81507379302Ac2C2DFDFa6D',
    },

    // rate providers
    BTC_PROVIDER: {
      599: '0xE961CEfceE75DBCB3A47B6E51886bc9d1e43c8eD',
      59901: '0xd5A67E95f21155f147be33562158a453Aa423840',
      1088: '0xB2497b06806b8e8A986c7a2aFaaB7053d44685cd',
    },
    ETH_PROVIDER: {
      599: '0xBd27CcBb8e34D25BB2288bA77901a4C33252E37D',
      59901: '0x5A2f94f17D9cB368B9Ec4f583981b5d06FfD9fe4',
      1088: '0xC207b09ae34fE1c8626620Bd9814c7215Ad1A296',
    },
    METIS_PROVIDER: {
      599: '0x1Ab4E3633758495E703252f6d97DC5Fe4855beb9',
      59901: '0x9cadd693cDb2B118F00252Bb3be4C6Df6A74d42C',
      1088: '0x441Db4FcEf73142221c0A6e80F48F874149FB912',
    },
    USDC_PROVIDER: {
      599: '0x28A3229E9fDf32d9DB624536EDa209DBD32977AF',
      59901: '0xb999a120CBB6a6e01Ae8e5fAdBebD2014731F8D8',
      1088: '0xdf01a632b3Fd854Acd6395b4d80960469629150C',
    },

    // tokens

    BUSD: {
      // m.BUSD
      599: '0xB6932F9CCd572bE8Bc3174fbf10CF951e87505Fc',
      59901: '0x3830421FdcC5c12095372BbBa362E4dc3E161b9e',
      1088: '0xb809cda0c2f79f43248C32b5DcB09d5cD26BbF10',
    },
    DAI: {
      // Relay DAI, Deprecated
      599: '0x4c7A71a7B2066f71db85d3Cc4eD96f55cb509F8e',
      59901: '0xEcE9362Df2501aB3FbfE868C488ce195c1052D9D',
      1088: '0x4651B38e7ec14BB3db731369BFE5B08F2466Bd0A',
    },
    DAI_V2: {
      // m.DAI
      599: '0x213d869824A1f24ba6E02B27e9B3063b85b6DED6',
      59901: '0xfB24B51BA6F5A742Df226711071B7D8c20F942C0',
      1088: '0x4c078361FC9BbB78DF910800A991C7c3DD2F6ce0',
    },
    MAI: {
      // Multichain MAI
      599: '0x4C9030F25F0E0e25E9bBA9734D350afCf4e574AA',
      59901: '0xC40cE87603baE1833b57d9Db2934074615C9aAdd',
      1088: '0xdFA46478F9e5EA86d57387849598dbFB2e964b02',
    },
    USDC: {
      // m.USDC
      599: '0x159B73D85b93E9F108F7FCCB77Ae1271607682db',
      59901: '0xb1d8270f19351328CF3DC4FC9FF3c75d5c770Ca4',
      1088: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21',
    },
    USDT: {
      // m.USDT
      599: '0x24BBD559a81971A37E6fCaEfc02E8Ed54FDdd7A9',
      59901: '0xf8F06e6fdb132D99BD8f91b54dBFe77073dA5bcC',
      1088: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC',
    },
    QI: {
      599: '0x5d7FB1329d87467752a6Eb82Bca2530152992020',
      1088: '0x3F56e0c36d275367b8C502090EDF38289b3dEa0d',
    },
    METIS: {
      599: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
      59901: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
      1088: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    },
    WETH: {
      599: '0xc2b06A1707E7351bA25c2F0bA8287e1A233e4b9A',
      59901: '0xD08a2917653d4E460893203471f0000826fb4034',
      1088: '0x420000000000000000000000000000000000000A',
    },
    WBTC: {
      599: '0x8b8f17a4BfeEcB6c2FD11E66FE17e5F1E86078Dd',
      59901: '0x31D7095Ff509272D28D7Fb3aFEE1EFFf2E61fA43',
      1088: '0x433E43047B95cB83517abd7c9978Bdf7005E9938',
    },

    // Main Pool LP Assets
    HLPBUSD: {
      599: '0x3bfAAD9C299Af01AF1eB1c51cd934753dA000531',
      59901: '0x614EB732275e6b99A8cE5E4E4782526c714cB29A',
      1088: '0x919395161Dd538aa0fB065A8EaC878B18D07FbCd',
    },
    HLPDAI: {
      599: '0x2e08D7A362a4d45Da76429a04E3DC6019E145794',
      59901: '0x77c0708c4553b5CfD9c18017f222d873EcB0a64F',
      1088: '0xd5A0760D55ad46B6A1C46D28725e4C117312a7aD',
    },
    HLPDAI_V2: {
      599: '0x1BF3c7B140867293F131548222DC1B5dD0baEd2B',
      59901: '0xE10c8EE1062952f506Ec768f8C547c049b901343',
      1088: '0x0CAd02c4c6fB7c0d403aF74Ba9adA3bf40df6478',
    },
    HLPUSDC: {
      599: '0x25748645193FD23102CEFE2f62Ea688E17afFBC5',
      59901: '0x26083dD68999f46B79783DD25Fd2ed094ef7EAe8',
      1088: '0x9E3F3Be65fEc3731197AFF816489eB1Eb6E6b830',
    },
    HLPUSDT: {
      599: '0x26083dD68999f46B79783DD25Fd2ed094ef7EAe8',
      59901: '0x2e08D7A362a4d45Da76429a04E3DC6019E145794',
      1088: '0x9F51f0D7F500343E969D28010C7Eb0Db1bCaAEf9',
    },

    // Alt Pool LP Assets
    HLPUSDC_MAI: {
      599: '0x56990c5c86fe2afFdd9c7d28b9f85ef1C7a691Fe',
      59901: '0x714f8948dEc0537A1f374F4De94E5D566E104927',
      1088: '0x8a19e755610aECB3c55BdE4eCfb9185ef0267400',
    },
    HLPMAI: {
      599: '0x2545b20912DeECa12a29BE7F6DCD9A5a56630eBf',
      59901: '0x89E0810f426d3251a1A1c2a4E2414406dABe6AF3',
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
        network: 'andromeda',
        chainId: 1088,
        urls: {
          apiURL: 'https://andromeda-explorer.metis.io/api',
          browserURL: 'https://andromeda-explorer.metis.io',
        },
      },
      {
        network: 'goerli',
        chainId: 599,
        urls: {
          apiURL: 'https://goerli.explorer.metisdevops.link/api',
          browserURL: 'https://goerli.explorer.metisdevops.link',
        },
      },
      {
        network: 'sepolia',
        chainId: 59901,
        urls: {
          apiURL: 'https://sepolia.explorer.metisdevops.link/api',
          browserURL: 'https://sepolia.explorer.metisdevops.link',
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
    sepolia: {
      ...config.networks?.sepolia,
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
