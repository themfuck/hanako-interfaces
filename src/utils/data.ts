const faucetObjectId = '0x61df0e8caaf7b241d137fdc97906e3ca6bd68cca'
export const SUITOKENS = [
  {
    address: `${faucetObjectId}::usdt::USDT`,
    calculate_decimals: 6,
    decimals: 6,
    logoURI: 'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdt::USDT/icon.png',
    name: 'USDT',
    show_decimals: 6,
    symbol: 'USDT'
  },
  {
    address: `${faucetObjectId}::usdc::USDC`,
    calculate_decimals: 6,
    decimals: 6,
    logoURI: 'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdc::USDC/icon.png',
    name: 'USDC',
    show_decimals: 6,
    symbol: 'USDC'
  },
  {
    address: `${faucetObjectId}::btc::BTC`,
    calculate_decimals: 8,
    decimals: 8,
    logoURI:
      // eslint-disable-next-line max-len
      'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::btc::BTC/icon.png',
    name: 'BTC',
    show_decimals: 8,
    symbol: 'BTC'
  },
  {
    address: `${faucetObjectId}::eth::ETH`,
    calculate_decimals: 8,
    decimals: 8,
    logoURI:
      // eslint-disable-next-line max-len
      'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::eth::ETH/icon.png',
    name: 'ETH',
    show_decimals: 8,
    symbol: 'ETH'
  }
]

export const SUILPLIST = [
  {
    address: '0x4c7aff02dda0b7648da3da5da5b0ec8b4451a2e9',
    coinA: {
      address: `${faucetObjectId}::usdt::USDT`,
      calculate_decimals: 6,
      decimals: 6,
      logoURI:
        // eslint-disable-next-line max-len
        'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdt::USDT/icon.png',
      name: 'USDT',
      show_decimals: 6,
      symbol: 'USDT'
    },
    coinB: {
      address: `${faucetObjectId}::usdc::USDC`,
      calculate_decimals: 6,
      decimals: 6,
      logoURI:
        // eslint-disable-next-line max-len
        'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdc::USDC/icon.png',
      name: 'USDC',
      show_decimals: 6,
      symbol: 'USDC'
    },
    decimals: 6,
    fee: '0.002',
    feeDenominator: '1000',
    feeNumerator: '2',
    name: 'USDT-USDC',
    symbol: 'USDT-USDC'
  },
  {
    address: '0x00d2907d0f4101f8cc5fd48160f50177d8e0902d',
    coinA: {
      address: `${faucetObjectId}::btc::BTC`,
      calculate_decimals: 8,
      decimals: 8,
      logoURI:
        // eslint-disable-next-line max-len
        'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::btc::BTC/icon.png',
      name: 'BTC',
      show_decimals: 8,
      symbol: 'BTC'
    },
    coinB: {
      address: `${faucetObjectId}::usdc::USDC`,
      calculate_decimals: 6,
      decimals: 6,
      logoURI:
        // eslint-disable-next-line max-len
        'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdc::USDC/icon.png',
      name: 'USDC',
      show_decimals: 6,
      symbol: 'USDC'
    },
    decimals: 6,
    fee: '0.002',
    feeDenominator: '1000',
    feeNumerator: '2',
    name: 'BTC-USDC',
    symbol: 'BTC-USDC'
  },
  {
    address: '0x3356910868130dd6ff4aaefb23ac68101ac67997',
    coinA: {
      address: `${faucetObjectId}::eth::ETH`,
      calculate_decimals: 8,
      decimals: 8,
      logoURI:
        // eslint-disable-next-line max-len
        'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::eth::ETH/icon.png',
      name: 'ETH',
      show_decimals: 8,
      symbol: 'ETH'
    },
    coinB: {
      address: `${faucetObjectId}::usdc::USDC`,
      calculate_decimals: 6,
      decimals: 6,
      logoURI:
        // eslint-disable-next-line max-len
        'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdc::USDC/icon.png',
      name: 'USDC',
      show_decimals: 6,
      symbol: 'USDC'
    },
    decimals: 6,
    fee: '0.002',
    feeDenominator: '1000',
    feeNumerator: '2',
    name: 'ETH-USDC',
    symbol: 'ETH-USDC'
  }
]
