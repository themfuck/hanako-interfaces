const env = 'pro'

// const platform = localStorage.getItem('chainName') || 'Aptos'
// const platform = 'Aptos'
const config = {
  pro: {
    Aptos: {
      liquidswapDeployer: '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba',
      rpcUrl: 'https://fullnode.mainnet.aptoslabs.com',
      explorerUrl: 'https://explorer.aptoslabs.com',
      network: 'mainnet',
      api: 'https://api.cetus.zone',
      cmmApi: 'https://api.cetus.zone',
      cmmSite: 'https://app.cetus.zone'
    },
    Sui: {
      liquidswapDeployer: '0xc396c0df0933f2d153ab5ca62ecd2b9bcfd5d745',
      globalPauseStatusObjectId: '0xff477e8178a6e3b4ac24fa9b87381e8edafebd2b',
      faucetObjectId: '0xc56d377be263eee9d425b530385601b3483b4a83',
      // rpcUrl: 'https://fullnode.testnet.sui.io',
      rpcUrl: 'https://fullnode.devnet.sui.io',
      explorerUrl: 'https://explorer.sui.io/',
      network: 'devnet',
      api: 'https://api.devcetus.com',
      cmmSite: 'https://app.cetus.zone',
      testCoin: [
        '0x3cadcda2218fae9bb29f978f10a1fd578a1fe217',
        '0xaddf089cb1539e34d9ca395980312c6a14b0161c',
        '0xb88ed37e8162adb1a7ce4a2f7ade81b264f247f2',
        '0x6bcab4d2ae4a6c8bd5f35c140305e4bd9ae35e7f'
      ]
    },
    Sui2: {
      liquidswapDeployer: '0xe974dd7d6dc87eaeb41aeaf36e135f5bc5f88ff7',
      globalPauseStatusObjectId: '0x67aabaf1a4a546ca4f18e29ef96bbffd00ee043b',
      faucetObjectId: '0x3477ff9927318838f31a9411f7af778b053b142a',
      rpcUrl: 'https://fullnode.testnet.sui.io',
      // rpcUrl: 'https://fullnode.devnet.sui.io',
      explorerUrl: 'https://explorer.sui.io/',
      network: 'testnet',
      api: 'https://api.cetus.zone',
      cmmSite: 'https://app.cetus.zone',
      testCoin: [
        '0x4dda13c0c0b82fcbe8d8d71c22c79b431b64df2d',
        '0x7d56f36c91122f27301da722439fbee979ba8902',
        '0xe892725413a624c1fafe44a6269e3c443c67c9a7',
        '0x679a373c4f0f5bd7969fc29af17e24277f5d4a9d'
      ]
    }
  },
  pre: {
    Aptos: {
      liquidswapDeployer: '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba',
      rpcUrl: 'https://fullnode.mainnet.aptoslabs.com',
      explorerUrl: 'https://explorer.aptoslabs.com',
      network: 'mainnet',
      api: 'https://pre-api.devcetus.com',
      cmmApi: 'https://api.cetus.zone',
      cmmSite: 'https://cetus-cmm-pre.netlify.app'
    },
    Sui: {
      liquidswapDeployer: '0xc396c0df0933f2d153ab5ca62ecd2b9bcfd5d745',
      globalPauseStatusObjectId: '0xff477e8178a6e3b4ac24fa9b87381e8edafebd2b',
      faucetObjectId: '0xc56d377be263eee9d425b530385601b3483b4a83',
      // rpcUrl: 'https://fullnode.testnet.sui.io',
      rpcUrl: 'https://fullnode.devnet.sui.io',
      explorerUrl: 'https://explorer.sui.io/',
      network: 'devnet',
      api: 'https://api.devcetus.com',
      cmmSite: 'https://cetus-cmm-pre.netlify.app',
      testCoin: [
        '0x3cadcda2218fae9bb29f978f10a1fd578a1fe217',
        '0xaddf089cb1539e34d9ca395980312c6a14b0161c',
        '0xb88ed37e8162adb1a7ce4a2f7ade81b264f247f2',
        '0x6bcab4d2ae4a6c8bd5f35c140305e4bd9ae35e7f'
      ]
    },
    Sui2: {
      liquidswapDeployer: '0xe974dd7d6dc87eaeb41aeaf36e135f5bc5f88ff7',
      globalPauseStatusObjectId: '0x67aabaf1a4a546ca4f18e29ef96bbffd00ee043b',
      faucetObjectId: '0x3477ff9927318838f31a9411f7af778b053b142a',
      rpcUrl: 'https://fullnode.testnet.sui.io',
      // rpcUrl: 'https://fullnode.devnet.sui.io',
      explorerUrl: 'https://explorer.sui.io/',
      network: 'testnet',
      api: 'https://pre-api.devcetus.com',
      cmmSite: 'https://cetus-cmm-pre.netlify.app',
      testCoin: [
        '0x4dda13c0c0b82fcbe8d8d71c22c79b431b64df2d',
        '0x7d56f36c91122f27301da722439fbee979ba8902',
        '0xe892725413a624c1fafe44a6269e3c443c67c9a7',
        '0x679a373c4f0f5bd7969fc29af17e24277f5d4a9d'
      ]
    }
  },
  test: {
    Aptos: {
      liquidswapDeployer: '0x2dd7a57e5637468c02c72df4af7397897f3bc8066372ecf79c90136fb4d16ab7',
      rpcUrl: 'https://testnet.aptoslabs.com',
      explorerUrl: 'https://explorer.aptoslabs.com',
      network: 'testnet',
      api: 'https://api.devcetus.com',
      cmmApi: 'https://api.devcetus.com',
      cmmSite: 'https://cetus-cmm-app-testnet.netlify.app'
    },
    Sui: {
      liquidswapDeployer: '0x1e4feed754290dc7c96f9499e9723e781d93cb04',
      globalPauseStatusObjectId: '0x4e17c22a0e61ae8afbfc1ca3307680795c30c4a5',
      faucetObjectId: '0x6eaeaa8debcf7ac807ffa4651777382c0ff35e9a',
      // rpcUrl: 'https://fullnode.testnet.sui.io',
      rpcUrl: 'https://fullnode.devnet.sui.io:443',
      explorerUrl: 'https://explorer.sui.io/',
      network: 'devnet',
      api: 'https://api.devcetus.com',
      cmmSite: 'https://cetus-cmm-app-testnet.netlify.app'
    }
  },
  dev: {
    Aptos: {
      liquidswapDeployer: '0x1ce98d89494e9d3d7935bc3bd5fc714fc2abb99db3f024162552c4ba172f4d28',
      rpcUrl: 'https://fullnode.devnet.aptoslabs.com',
      explorerUrl: 'https://explorer.aptoslabs.com',
      network: 'devnet',
      api: 'https://api.devcetus.com',
      cmmApi: 'https://api.devcetus.com',
      cmmSite: 'https://cetus-cmm-app-testnet.netlify.app'
    },
    Sui: {
      liquidswapDeployer: '0x1e4feed754290dc7c96f9499e9723e781d93cb04',
      globalPauseStatusObjectId: '0x4e17c22a0e61ae8afbfc1ca3307680795c30c4a5',
      faucetObjectId: '0x6eaeaa8debcf7ac807ffa4651777382c0ff35e9a',
      rpcUrl: 'https://fullnode.testnet.sui.io',
      explorerUrl: 'https://explorer.sui.io/',
      network: 'testnet',
      api: 'https://api.devcetus.zone',
      cmmSite: 'https://cetus-cmm-app-testnet.netlify.app'
    }
  }
}

export default {
  ...config[env]
}
