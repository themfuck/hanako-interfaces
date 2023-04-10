import { useLiquidityStore } from '@/store/liquidity'
import { decimalsMultiplier, d } from 'test-cetus-sdk/dist/utils/numbers'
export interface Tokens {
  [key: string]: any
  [index: number]: any
}

export const TOKENS: Tokens = {
  APT: {
    symbol: 'APT',
    name: 'Aptos Coin',
    decimals: 8,
    address: '0x1::aptos_coin::AptosCoin'
  },
  zUSDC: {
    symbol: 'zUSDC',
    name: 'USD Coin (LayerZero)',
    decimals: 6,
    address: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC'
  },
  zUSDT: {
    symbol: 'zUSDT',
    name: 'Tether USD (LayerZero)',
    decimals: 6,
    address: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT'
  },
  zWETH: {
    symbol: 'zWETH',
    name: 'Wrapped Ether (LayerZero)',
    decimals: 6,
    address: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH'
  },
  tAPT: {
    symbol: 'tAPT',
    name: 'Tortuga Staked APT',
    decimals: 8,
    address: '0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin'
  },
  ceUSDC: {
    symbol: 'ceUSDC',
    name: 'USD Coin (Celer)',
    decimals: 6,
    address: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin'
  },
  ceUSDT: {
    symbol: 'ceUSDT',
    name: 'Tether USD (Celer)',
    decimals: 6,
    address: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin'
  },
  ceWBTC: {
    symbol: 'ceWBTC',
    name: 'Wrapped BTC (Celer)',
    decimals: 8,
    address: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WbtcCoin'
  },
  ceDAI: {
    symbol: 'ceDAI',
    name: 'Dai Stablecoin (Celer)',
    decimals: 8,
    address: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::DaiCoin'
  },
  ceWETH: {
    symbol: 'ceWETH',
    name: 'Wrapper Ether (Celer)',
    decimals: 8,
    address: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin'
  },
  ceBNB: {
    symbol: 'ceBNB',
    name: 'Binance Coin (Celer)',
    decimals: 8,
    address: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin'
  },
  ceBUSD: {
    symbol: 'ceBUSD',
    name: 'Binance USD (Celer)',
    decimals: 8,
    address: '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BusdCoin'
  },
  stAPT: {
    symbol: 'stAPT',
    name: 'Ditto Staked Aptos',
    decimals: 8,
    address: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos'
  },
  whUSDC: {
    symbol: 'whUSDC',
    name: 'USD Coin (Wormhole)',
    decimals: 6,
    address: '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T'
  },
  whWETH: {
    symbol: 'whWETH',
    name: 'Wrapped Ether (Wormhole)',
    decimals: 8,
    address: '0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T'
  },
  whBTC: {
    symbol: 'whBTC',
    name: 'Wrapped BTC (Wormhole)',
    decimals: 8,
    address: '0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e::coin::T'
  }
}

export const LP_TOKENS: Tokens = {
  'APT-zUSDC': {
    symbol: 'APT-zUSDC',
    name: 'APT-zUSDC',
    decimals: 6,
    coinA: TOKENS['APT'],
    coinB: TOKENS['zUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x1::aptos_coin::AptosCoin,0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>'
  },
  'APT-zUSDT': {
    symbol: 'APT-zUSDT',
    name: 'APT-zUSDT',
    decimals: 6,
    coinA: TOKENS['APT'],
    coinB: TOKENS['zUSDT'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x1::aptos_coin::AptosCoin,0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>'
  },
  'zWETH-zUSDC': {
    symbol: 'zWETH-zUSDC',
    name: 'zWETH-zUSDC',
    decimals: 6,
    coinA: TOKENS['zWETH'],
    coinB: TOKENS['zUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH,0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>'
  },
  'tAPT-zUSDC': {
    symbol: 'tAPT-zUSDC',
    name: 'tAPT-zUSDC',
    decimals: 6,
    coinA: TOKENS['tAPT'],
    coinB: TOKENS['zUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin,0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>'
  },
  'tAPT-zUSDT': {
    symbol: 'tAPT-zUSDT',
    name: 'tAPT-zUSDT',
    decimals: 6,
    coinA: TOKENS['tAPT'],
    coinB: TOKENS['zUSDT'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin,0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>'
  },
  'tAPT-ceUSDT': {
    symbol: 'tAPT-ceUSDT',
    name: 'tAPT-ceUSDT',
    decimals: 6,
    coinA: TOKENS['tAPT'],
    coinB: TOKENS['ceUSDT'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin>'
  },
  'tAPT-ceUSDC': {
    symbol: 'tAPT-ceUSDC',
    name: 'tAPT-ceUSDC',
    decimals: 6,
    coinA: TOKENS['tAPT'],
    coinB: TOKENS['ceUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>'
  },
  'APT-ceUSDC': {
    symbol: 'APT-ceUSDC',
    name: 'APT-ceUSDC',
    decimals: 6,
    coinA: TOKENS['APT'],
    coinB: TOKENS['ceUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x1::aptos_coin::AptosCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>'
  },
  'APT-ceUSDT': {
    symbol: 'APT-ceUSDT',
    name: 'APT-ceUSDT',
    decimals: 6,
    coinA: TOKENS['APT'],
    coinB: TOKENS['ceUSDT'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x1::aptos_coin::AptosCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin>'
  },
  'APT-ceDAI': {
    symbol: 'APT-ceDAI',
    name: 'APT-ceDAI',
    decimals: 6,
    coinA: TOKENS['APT'],
    coinB: TOKENS['ceDAI'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x1::aptos_coin::AptosCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::DaiCoin>'
  },
  'ceWBTC-ceUSDC': {
    symbol: 'ceWBTC-ceUSDC',
    name: 'ceWBTC-ceUSDC',
    decimals: 6,
    coinA: TOKENS['ceWBTC'],
    coinB: TOKENS['ceUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WbtcCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>'
  },
  'ceWETH-ceUSDC': {
    symbol: 'ceWETH-ceUSDC',
    name: 'ceWETH-ceUSDC',
    decimals: 6,
    coinA: TOKENS['ceWETH'],
    coinB: TOKENS['ceUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>'
  },
  // 'ceWBTC-ceDAI': {
  //   symbol: 'ceWBTC-ceDAI',
  //   name: 'ceWBTC-ceDAI',
  //   decimals: 6,
  //   coinA: TOKENS['ceWBTC'],
  //   coinB: TOKENS['ceDAI'],
  //   feeDenominator: '1000',
  //   feeNumerator: '2',
  //   fee: '0.2',
  //   address:
  // eslint-disable-next-line max-len
  //     '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WbtcCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::DaiCoin>'
  // },
  // 'ceWETH-ceDAI': {
  //   symbol: 'ceWBTC-ceDAI',
  //   name: 'ceWBTC-ceDAI',
  //   decimals: 6,
  //   coinA: TOKENS['ceWBTC'],
  //   coinB: TOKENS['ceDAI'],
  //   feeDenominator: '1000',
  //   feeNumerator: '2',
  //   fee: '0.2',
  //   address:
  // eslint-disable-next-line max-len
  //     '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::DaiCoin>'
  // },
  'ceBNB-ceBUSD': {
    symbol: 'ceBNB-ceBUSD',
    name: 'ceBNB-ceBUSD',
    decimals: 6,
    coinA: TOKENS['ceBNB'],
    coinB: TOKENS['ceBUSD'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BusdCoin>'
  },
  'stAPT-zUSDC': {
    symbol: 'stAPT-zUSDC',
    name: 'stAPT-zUSDC',
    decimals: 6,
    coinA: TOKENS['stAPT'],
    coinB: TOKENS['zUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos,0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>'
  },
  'stAPT-zUSDT': {
    symbol: 'stAPT-zUSDT',
    name: 'stAPT-zUSDT',
    decimals: 6,
    coinA: TOKENS['stAPT'],
    coinB: TOKENS['zUSDT'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos,0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>'
  },
  'stAPT-ceUSDC': {
    symbol: 'stAPT-ceUSDC',
    name: 'stAPT-ceUSDC',
    decimals: 6,
    coinA: TOKENS['stAPT'],
    coinB: TOKENS['ceUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>'
  },
  'stAPT-ceUSDT': {
    symbol: 'stAPT-ceUSDT',
    name: 'stAPT-ceUSDT',
    decimals: 6,
    coinA: TOKENS['stAPT'],
    coinB: TOKENS['ceUSDT'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos,0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin>'
  },
  'tAPT-whUSDC': {
    symbol: 'tAPT-whUSDC',
    name: 'tAPT-whUSDC',
    decimals: 6,
    coinA: TOKENS['tAPT'],
    coinB: TOKENS['whUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin,0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>'
  },
  'APT-whUSDC': {
    symbol: 'APT-whUSDC',
    name: 'APT-whUSDC',
    decimals: 6,
    coinA: TOKENS['APT'],
    coinB: TOKENS['whUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0x1::aptos_coin::AptosCoin,0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>'
  },
  'whWETH-whUSDC': {
    symbol: 'whWETH-whUSDC',
    name: 'whWETH-whUSDC',
    decimals: 6,
    coinA: TOKENS['whWETH'],
    coinB: TOKENS['whUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T,0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>'
  },
  'whBTC-whUSDC': {
    symbol: 'whBTC-whUSDC',
    name: 'whBTC-whUSDC',
    decimals: 6,
    coinA: TOKENS['whBTC'],
    coinB: TOKENS['whUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e::coin::T,0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>'
  },
  'stAPT-whUSDC': {
    symbol: 'stAPT-whUSDC',
    name: 'stAPT-whUSDC',
    decimals: 6,
    coinA: TOKENS['stAPT'],
    coinB: TOKENS['whUSDC'],
    feeDenominator: '1000',
    feeNumerator: '2',
    fee: '0.2',
    address:
      // eslint-disable-next-line max-len
      '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::PoolLiquidityCoin<0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos,0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>'
  }
  // 'stAPT-whUSDC': {
  //   symbol: '',
  //   name: '',
  //   decimals: 6,
  //   coinA: TOKENS[''],
  //   coinB: TOKENS[''],
  //   feeDenominator: '1000',
  //   feeNumerator: '2',
  //   fee: '0.2',
  //   address:
  //     // eslint-disable-next-line max-len
  //     ''
  // }
}

export const isInTokens = (address: string, tokens) => {
  const result = Object.values(tokens).filter(item => item.address === address)
  return result && result.length > 0 ? true : false
}

export const isInLpTokens = (address: string, tokens) => {
  const result = Object.values(tokens).filter(item => item.address === address)
  return result && result.length > 0 ? true : false
}

export function prettyAmount(amount: string | number, decimals: number) {
  const mul = decimalsMultiplier(decimals)

  return d(amount).div(mul).toString()
}

export function convertToDecimals(amount: string | number, decimals: number) {
  const mul = decimalsMultiplier(decimals)

  return d(amount).mul(mul)
}

export function getCurrentLP(fromCoin: string, toCoin: string, lpTokens) {
  const result = Object.values(lpTokens).filter(item => {
    return (
      (fromCoin === item.coinA.symbol && toCoin === item.coinB.symbol) || (fromCoin === item.coinB.symbol && toCoin === item.coinA.symbol)
    )
  })
  return (result && result[0]) || null
}

export function getInteractiveToken(fromCoin: string, toCoin: string, lpTokens) {
  if (lpTokens[`${fromCoin}-${toCoin}`]) {
    return 'from'
  } else if (lpTokens[`${toCoin}-${fromCoin}`]) {
    return 'to'
  }
  return 'from'
}

export function getDirection(fromCoin: string, toCoin: string, lpTokens) {
  if (lpTokens[`${fromCoin}-${toCoin}`]) {
    return true
  }
  return false
}
