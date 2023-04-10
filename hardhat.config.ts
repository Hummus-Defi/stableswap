import 'dotenv/config'

import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-solhint'
import '@nomiclabs/hardhat-etherscan'
// import 'metis-sourcecode-verify'
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
    stardust: {
      url: 'https://stardust.metis.io/?owner=588',
      chainId: 588,
    },
    goerli: {
      url: 'https://goerli.gateway.metisdevops.link',
      chainId: 599
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
    multisig: {
      1088: '0x08961b470a39bEE12435f3742aFaA70B64DCa893',
      default: 0
    },

    // contracts
    FEED: {
      588: '0x3d7d3Bc096A8d77c87761da6A06a12c039F467B6',
      599: '0x3d7d3Bc096A8d77c87761da6A06a12c039F467B6',
      1088: '0xa479FC13e40155e853e790115423704BF06a065F', // DIA, https://docs.diadata.org/documentation/oracle-documentation/deployed-contracts
    },
    ORACLE: {
      588: '0xFE0401CeCBfDA864cAE84F8e716B71e32eD405aE', // ChainlinkProxyPriceProvider
      599: '0xC711114a030337efe434FEA747B0f81bC926B640', // ChainlinkProxyPriceProvider
      1088: '0xdF7f13dE0b969413b9b801a6771e9fDd73Ea058c', // OracleProvider
      // 1088: '0x3f1c587090c6ED373D71f7623201f724BBB0a6bf', // Old DiaProxyPriceProvider
    },
    ROUTER: {
      588: '0x56990c5c86fe2afFdd9c7d28b9f85ef1C7a691Fe',
      599: '0xE8a371e7A4aA192c6ae06cf31d1FbA30D57F99a0',
      1088: '0x6B6F7437DF9cE9552ED7Fc8f529BAf48fb305534',
    },

    // Main Pool
    USD_POOL: {
      // 588: '0xBaF3C61797843F7e34341D5e74Aa320550db02d2', // V1
      // 1088: '0x7AA7E41871B06f15Bccd212098DeE98d944786ab', // V1
      588: '0x9377f666dd67d01249ff0bf908fd9d660bc34e91',
      599: '0x263136DBDc29618907b9CAd0A7C64c32E741098A',
      1088: '0x248fD66e6ED1E0B325d7b80F5A7e7d8AA2b2528b',
    },
    USD_ACCOUNT: {
      588: '0x492C20f8de3bAa251d0d9F3c7743b03450aeECaD',
      599: '0x0F6f2E19Bc2Ad2b847dd329A0D89DC0043003754',
      1088: '0x866F899a6562cD7a3d220249da374AB4F972D3C5',
    },

    // Alt Pools
    MAI_ACCOUNT: {
      588: '0xBf7d1003fC3B9CD0aD9Ff49933EA26A164444f8A',
      599: '0xd578467A909f1CE382ebe854CC905771A3767ecE',
      1088: '0x92C8c8F488D4797B81921451c82e9345D1196eC6',
    },
    MAI_POOL: {
      // 588: '0x6B839448a0f90CBC10B86087aEbBe28ce4C08CcB', // V1
      // 1088: '0xeBe9BC8a373a3e8eCE71FAC4d9733DC9F6701869', // V1
      588: '0xb5FF0063A810F500A717c434F0C852C5eE7cBe22',
      599: '0x3552Fe670260343979ADaC4FA35DD123f5625Bf7',
      1088: '0x23f0b6274e3126f6b5c70faabbc59b04108b58ba',
    },

    // Deprecated Pools
    BUSD_POOL: {
      599: '0x92C8c8F488D4797B81921451c82e9345D1196eC6',
      1088: '0x9D73ae2Cc55EC84e0005Bd35Fd5ff68ef4fB8aC5'
    },

    // chainlink feeds, https://docs.chain.link/docs/data-feeds-metis/
    USDC_FEED: {
      1088: '0x663855969c85F3BE415807250414Ca9129533a5f',
    },
    USDT_FEED: {
      1088: '0x51864b8948Aa5e35aace2BaDaF901D63418A3b9D',
    },

    // tokens

    BUSD: {
      588: '0x9e0D716C77599f662c13B45fdBa27685F72E4E2D',
      599: '0xB6932F9CCd572bE8Bc3174fbf10CF951e87505Fc',
      1088: '0xb809cda0c2f79f43248C32b5DcB09d5cD26BbF10',
    },
    DAI: {
      588: '0x44ba84500C5CeEB235653BA4952bc61F376847Ec',
      599: '0x213d869824A1f24ba6E02B27e9B3063b85b6DED6',
      1088: '0x4c078361FC9BbB78DF910800A991C7c3DD2F6ce0', // m.DAI
    },
    DAI_OLD: {
      588: '0x4c7A71a7B2066f71db85d3Cc4eD96f55cb509F8e',
      599: '0x4c7A71a7B2066f71db85d3Cc4eD96f55cb509F8e',
      1088: '0x4651B38e7ec14BB3db731369BFE5B08F2466Bd0A', // Relay DAI
    },
    MAI: {
      588: '0xBf6Cb984f327223eF92DeDF927edE317661b0F87',
      599: '0x4C9030F25F0E0e25E9bBA9734D350afCf4e574AA',
      1088: '0xdFA46478F9e5EA86d57387849598dbFB2e964b02', // Multichain MAI
    },
    USDC: {
      588: '0x159B73D85b93E9F108F7FCCB77Ae1271607682db',
      599: '0x159B73D85b93E9F108F7FCCB77Ae1271607682db',
      1088: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21', // m.USDC
    },
    USDT: {
      588: '0x24BBD559a81971A37E6fCaEfc02E8Ed54FDdd7A9',
      599: '0x24BBD559a81971A37E6fCaEfc02E8Ed54FDdd7A9',
      1088: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC', // m.USDT
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
      1088: '0x420000000000000000000000000000000000000A',
    },

    // LP Assets - ordered by deployment
    HLPUSDC: {
      588: '0x8531939828265A346B4554B8e6478E6c12383952',
      599: '0x9196df3c5a8919a46249c35e6c7F35E42CA4F618',
      1088: '0x9E3F3Be65fEc3731197AFF816489eB1Eb6E6b830',
    },
    HLPUSDT: {
      588: '0x9421c84388218e85f7274fE67Ed316FFc524eB4b',
      599: '0x4411744f2687a7EF3e9770bf29b7afD2834A2Ade',
      1088: '0x9F51f0D7F500343E969D28010C7Eb0Db1bCaAEf9',
    },
    HLPDAI_OLD: {
      588: '0x1C03ec1cC105fb925fCE78155Dd81dEf896237f7',
      599: '0x0bE3863c47E6EaB8d2DD4C663FdDDd19E7430885',
      1088: '0xd5A0760D55ad46B6A1C46D28725e4C117312a7aD',
    },
    HLPDAI: {
      588: '0xaD78Bb846eaf59f3faB8088E905c9d525DD7B2F1',
      599: '0xD63B25e7Eb27b14B56A7b74E672c0acf984e5ecb',
      1088: '0x0CAd02c4c6fB7c0d403aF74Ba9adA3bf40df6478',
    },
    HLPUSDC_MAI: {
      588: '0xA179C9Df25c4a80Ecfa8ec3788D3C055b1B2bAB2',
      599: '0xD2331f707C1fd662b31392Aebb5b80647F198FD4',
      1088: '0x8a19e755610aECB3c55BdE4eCfb9185ef0267400',
    },
    HLPMAI: {
      588: '0x409862B7758577952971a0350935bCA4a54C63C0',
      599: '0x523968911c8F9f466a6f34aB969E17FCA67175F9',
      1088: '0x3Eaa426861a283F0E46b6411aeB3C3608B090E0e',
    },
    HLPBUSD: {
      588: '0xEDC1d5b4835844C0234ef2297338417dE0F1A3d9',
      599: '0x5788C334fBC63ee1B6eb4Dac4e84e1ee5bC1e6c1',
      1088: '0x919395161Dd538aa0fB065A8EaC878B18D07FbCd',
    },
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: false,
    except: ['/test/*', '/mock/*', '/hardhat-proxy/*'],
  },
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
    stardust: {
      ...config.networks?.stardust,
      accounts: JSON.parse(process.env.ACCOUNT_PRIVATE_KEYS),
    },
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
