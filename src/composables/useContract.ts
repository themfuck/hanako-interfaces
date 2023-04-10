import { FaucetClient } from 'aptos'
import SDK from 'test-cetus-sdk'
import { SdkOptions } from 'test-cetus-sdk'
import { decimalsMultiplier, d } from 'test-cetus-sdk/dist/utils/numbers'
import { composeType } from 'test-cetus-sdk/dist/utils/contracts'
import { reactive, ref, computed } from 'vue'

import { convertToDecimals, prettyAmount, Tokens, getCurrentLP, getDirection, isInTokens, isInLpTokens } from '@/utils/tokens'
import { fixD, decimalFormat } from '@/utils/index'
import { useWalletStore } from '@/store/wallet'
import { useLiquidityStore } from '@/store/liquidity'
import { useIndexStore } from '@/store'
import { useNuxtApp } from '#app'
import Decimal from 'decimal.js'
import config from '@/utils/config'
import useSuiContract from '@/composables/useSuiContract'

const AMM_SWAP_MODULE = 'amm_swap'
const POOL_STRUCT = 'Pool'
export default function () {
  // const LiquidswapDeployer = '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba'
  const LiquidswapDeployer = config['Aptos'].liquidswapDeployer
  const sdkOptions: SdkOptions = {
    // rpcUrl: 'https://fullnode.devnet.aptoslabs.com',
    // rpcUrl: 'https://testnet.aptoslabs.com',
    rpcUrl: config['Aptos'].rpcUrl,
    networkOptions: {
      nativeToken: '0x1::aptos_coin::AptosCoin',
      modules: {
        LiquidswapDeployer: config['Aptos'].liquidswapDeployer
      }
    }
  }

  const RATES = {
    ceUSDC: 1,
    ceUSDT: 1,
    ceBUSD: 1,
    ceDAI: 1,
    zUSDC: 1,
    zUSDT: 1,
    whUSDC: 1,
    whUSDT: 1
  }

  const sdk = reactive(new SDK(sdkOptions))

  const walletSotre = useWalletStore()
  const liquidityStore = useLiquidityStore()
  const liquidity = computed(() => {
    return liquidityStore
  })

  const indexStore = useIndexStore()
  const index = computed(() => {
    return indexStore
  })

  const suiContract = useSuiContract(index.value.chainName)

  const getCoinStores = async (account: string) => {
    try {
      const list = await sdk.Resources.getCoinStores(account)
      const result: any = []
      list.forEach(item => {
        let address = ''
        if (item.coinAddress.includes('0x0000000000000000000000000000000000000000000000000000000000000001')) {
          address = item.coinAddress.replace(/0x0000000000000000000000000000000000000000000000000000000000000001/, '0x1')
        } else {
          address = item.coinAddress
        }
        result.push({
          ...item,
          coinAddress: address
        })
      })

      return result
    } catch (err) {
      return []
    }
  }

  // get user wallet account
  const getAccount = async (account: string) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      suiContract.getAccount(account)
      return
    }
    try {
      walletSotre.setLoading(true)
      const list = await getCoinStores(account)
      const assets: any = {}
      list.forEach(item => {
        const balance = item ? item.coin.value : '0'
        assets[item.coinAddress] = {
          ...item,
          balance
        }
      })

      walletSotre.setAssets(assets)
      walletSotre.setLoading(false)
    } catch (error) {
      console.log('getAccount##error###', error)
      walletSotre.setLoading(false)
      walletSotre.setAssets({})
    }
  }

  const { $notify } = useNuxtApp()
  interface transitionStatusParams {
    title: string
    desc: string
    hash: string
    descTransactions?: string
    sender?: string
    chainName?: string
  }
  const showTransitionPending = (params: transitionStatusParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      suiContract.showTransitionPending(params)
      return
    }
    const { $notify } = useNuxtApp()
    $notify.success({
      key: params.hash + 'loading',
      icon: h('img', {
        class: { 'notify-icon': true, 'loading-animate': true },
        src: index.value.theme == 'default' ? '/image/img-loading@2x.png' : '/sui-image/img-loading.png'
      }),
      message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: params.title }, null)]),
      description: h('div', { class: 'notification-title' }, [
        h('div', { class: 'notification-text', innerHTML: 'Confirming transaction' }, null),
        h(
          'a',
          {
            href: `https://explorer.aptoslabs.com/txn/${params.hash}?network=${config['Aptos'].network}`,
            target: '_blank',
            innerHTML: 'View transaction'
          },
          null
        )
      ]),
      duration: 0,
      class: 'ant-notification-copy ant-notification-swap'
    })
  }

  const showTransitionSuccess = (params: transitionStatusParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      suiContract.showTransitionSuccess(params)
      return
    }
    $notify.success({
      icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-icon-change1' })]),
      message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: `${params.title} success` }, null)]),
      description: h('div', { class: 'notification-title' }, [
        h('div', { class: 'notification-text', innerHTML: params.desc }, null),
        h(
          'a',
          {
            href: `https://explorer.aptoslabs.com/txn/${params.hash}?network=${config['Aptos'].network}`,
            target: '_blank',
            innerHTML: 'View transaction'
          },
          null
        )
      ]),
      duration: 4.5,
      class: 'ant-notification-copy ant-notification-swap'
    })
  }

  const showTransitionError = (title: string) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      suiContract.showTransitionError(title)
      return
    }
    $notify.error({
      icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-a-icon-Shutdown' })]),
      message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: `${title} failed` }, null)]),
      description: 'Something went wrong',
      duration: 4.5,
      class: 'ant-notification-copy ant-notification-error'
    })
  }
  // Monitor hash status
  const watchTransaction = async (params: transitionStatusParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const res = await suiContract.watchTransaction(params)
      const transactionsInfo = {
        ...params,
        date: new Date().getTime() + 604800000
      }
      indexStore.setTransactionList(transactionsInfo)
      return res
    }
    // const client = new AptosClient(sdkOptions.rpcUrl)
    const res: any = await sdk.client.waitForTransactionWithResult(params.hash)
    if (res && res.success) {
      // return true
      $notify.close(params.hash + 'loading')
      showTransitionSuccess(params)
      const transactionsInfo = {
        ...params,
        ...res,
        date: new Date().getTime() + 604800000
      }
      indexStore.setTransactionList(transactionsInfo)
      return true
    } else if (res && !res.success) {
      // return false
      $notify.close(params.hash + 'loading')
      showTransitionError(params.title)
      return false
    } else {
      setTimeout(() => {
        return watchTransaction(params)
      }, 3000)
    }
  }

  interface getLiquidityPoolResourceParams {
    coinX: Tokens
    coinY: Tokens
  }
  // Obtain LP information, coinX, coinY are passed in order of LP
  const getLiquidityPoolResource = async (params: getLiquidityPoolResourceParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const suiRes = suiContract.getLiquidityPoolResource(params)
      return suiRes
    }
    const liquidityPoolType = composeType(LiquidswapDeployer, AMM_SWAP_MODULE, POOL_STRUCT, [params.coinX.address, params.coinY.address])
    let coinXAmount = ''
    let coinYAmount = ''
    try {
      const liquidityPoolResource = await sdk.Resources.fetchAccountResource(LiquidswapDeployer, liquidityPoolType)

      if (liquidityPoolResource && liquidityPoolResource.data) {
        const data: any = liquidityPoolResource.data
        coinXAmount = data?.coin_a?.value || ''
        coinYAmount = data?.coin_b?.value || ''
      }
    } catch (err) {}
    return {
      coinXAmount: coinXAmount && prettyAmount(coinXAmount, params.coinX.decimals),
      coinYAmount: coinYAmount && prettyAmount(coinYAmount, params.coinY.decimals)
    }
  }

  // Get price
  const getPrice = async (params: getLiquidityPoolResourceParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const suiRes = suiContract.getPrice(params)
      return suiRes
    }
    const lpResource: any = await getLiquidityPoolResource(params)
    const { coinXAmount, coinYAmount } = lpResource
    return d(coinYAmount).div(d(coinXAmount)).toString()
  }

  interface getShareOfPoolParams {
    coinX: Tokens
    coinY: Tokens
    currentLpVal: string
  }
  // Get Share of Pool (Add Liquidity)
  const getShareOfPool = async (params: getShareOfPoolParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const res = suiContract.getShareOfPool(params)
      return res
    }
    const currentLP: any = getCurrentLP(params.coinX.symbol, params.coinY.symbol, liquidity.value.lpTokens)
    const lpResource: any = await getCoinInfos()
    const res = lpResource.filter(item => item.coinAddress == currentLP.address)[0]
    if (res && res.total) {
      const total = d(res.total)
      const share = d(params.currentLpVal)
        .div(total.plus(d(params.currentLpVal)))
        .mul(100)
      if (Number(share) > 0.01) return decimalFormat(share.toString(), 2) || ''
    }
    return '<0.01'
  }

  const getMyLpList = async (account: string, poolObjectIdList: any = []) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const res = await suiContract.getMyLpList(account, poolObjectIdList)
      return res
    }
    const newList: any = []
    const baseLpList = Object.values(liquidity.value.lpTokens)
    const lpResource: any = await getCoinInfos()

    for (let i = 0; i < baseLpList.length; i++) {
      const lpBaseInfo: any = baseLpList[i]
      const lpCoinXYResource: any = await getLiquidityPoolResource({ coinX: lpBaseInfo.coinA, coinY: lpBaseInfo.coinB })
      const lpResourceInfo = lpResource.filter(item => item.coinAddress === lpBaseInfo.address)[0]
      const totalLp = (lpResourceInfo && lpResourceInfo.total) || ''
      const { coinXAmount, coinYAmount } = lpCoinXYResource
      // const t = d(coinYAmount || '0').plus(d(coinYAmount || '0'))
      const tvl =
        index.value.addressLpTokens[lpBaseInfo.address].tvl_in_usd == '' ? '0' : index.value.addressLpTokens[lpBaseInfo.address].tvl_in_usd
      const lpPrice = (totalLp && d(tvl).div(d(totalLp))) || d(0)
      const rate = RATES[lpBaseInfo.coinB.symbol] || 1
      // const totalLpUSD = t.mul(rate).toString()
      const totalLpUSD = tvl || '0'
      const price = d(coinYAmount || '0')
        .div(d(coinXAmount || '0'))
        .toString()
      newList.push({
        ...lpBaseInfo,
        lpSupply: totalLp,
        totalLpUSD,
        price,
        lpPrice
      })
    }

    if (account) {
      const lpList: any = []
      const list = await getCoinStores(account)
      // for (let i = 0; i < list.length; i++) {
      for (let i = 0; i < newList.length; i++) {
        // const item = list[i]
        const lpInfo = newList[i]
        const item = list.filter(citem => {
          return citem.coinAddress === lpInfo.address
        })[0]
        if (item && isInLpTokens(item.coinAddress, liquidity.value.lpTokens)) {
          // const lpInfo = newList.filter(litem => item.coinAddress === litem.address)[0]
          const lpResource: any = await getLiquidityPoolResource({ coinX: lpInfo.coinA, coinY: lpInfo.coinB })
          const { coinXAmount, coinYAmount } = lpResource
          // const totalLpUSD = d(coinXAmount).plus(d(coinYAmount)).mul(RATES[lpInfo.coinB.symbol]).toString()
          const totalLpUSD = lpInfo.totalLpUSD
          const lpPrice = lpInfo.lpPrice
          const price = d(coinYAmount).div(d(coinXAmount)).toString()
          const balance = item.coin.value
          if (!Number(balance)) {
            lpList.push({ ...lpInfo })
            continue
          }
          const myLpWithCoinXY = await getCoinXYForLiquidity({
            coinX: lpInfo.coinA,
            coinY: lpInfo.coinB,
            liquidity: balance
          })
          const myBalanceUSD = d(balance).mul(lpPrice)
          const myshareOfPool = d(myBalanceUSD).div(totalLpUSD).mul(100).toString()
          const b = fixD(d(item.coin.value).div(Math.pow(10, lpInfo.decimals)).toString(), lpInfo.decimals)
          let newBalance
          if (!Number(b)) {
            newBalance = '<0.000000001'
          } else {
            newBalance = b
          }

          lpList.push({
            ...item,
            ...lpInfo,
            balance: item.coin.value,
            balanceOrigin: item.coin.value,
            myLpBalance: newBalance,
            myBalanceUSD,
            // totalLpUSD,
            totalCoinXAmount: coinXAmount,
            totalCoinYAmount: coinYAmount,
            myCoinXAmount: decimalFormat(myLpWithCoinXY.coinXAmount, lpInfo.coinA.decimals),
            myCoinYAmount: decimalFormat(myLpWithCoinXY.coinYAmount, lpInfo.coinB.decimals),
            myshareOfPool: Number(myshareOfPool) < 0.01 ? '<0.01' : fixD(myshareOfPool, 2)
            // price
          })
        } else {
          lpList.push({ ...lpInfo })
        }
      }

      return lpList
    }
    return newList
  }

  interface calculateRatesParams {
    fromToken: Tokens
    toToken: Tokens
    amount: number | string
    interactiveToken: 'from' | 'to'
  }

  // Precomputed
  const calculateRates = async (params: calculateRatesParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const suiRes = await suiContract.calculateRates(params)
      return suiRes
    }
    const currentLP: any = getCurrentLP(params.fromToken.symbol, params.toToken.symbol, liquidity.value.lpTokens)
    const direction = getDirection(params.fromToken.symbol, params.toToken.symbol, liquidity.value.lpTokens)
    const amount = convertToDecimals(
      params.amount,
      params.interactiveToken === 'from' ? params.fromToken.decimals : params.toToken.decimals
    )
    const output = await sdk.Swap.calculateRates({
      fromToken: params.fromToken.address,
      toToken: params.toToken.address,
      amount: amount.toString(),
      feeDenominator: currentLP.feeDenominator,
      feeNumerator: currentLP.feeNumerator,
      interactiveToken: params.interactiveToken,
      direction
    })

    const result = prettyAmount(output, params.interactiveToken === 'from' ? params.toToken.decimals : params.fromToken.decimals)
    return Number(result) > 0 ? result : 'InsufficientLiquidity'
  }

  interface calculateImpactParams {
    fromToken: Tokens
    toToken: Tokens
    fromAmount: string | number
    toAmount: string | number
    interactiveToken: 'from' | 'to'
  }

  // calculate price impact
  const calculatePriceImpact = async (params: calculateImpactParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const suiRes = await suiContract.calculatePriceImpact(params)
      return suiRes
    }
    const direction = getDirection(params.fromToken.symbol, params.toToken.symbol, liquidity.value.lpTokens)
    let interactiveToken: 'from' | 'to' = 'from'
    if ((direction && params.interactiveToken === 'from') || (!direction && params.interactiveToken === 'to')) {
      interactiveToken = 'from'
    } else {
      interactiveToken = 'to'
    }
    const fromAmount = convertToDecimals(params.fromAmount, params.fromToken.decimals)
    const toAmount = convertToDecimals(params.toAmount, params.toToken.decimals)
    const result = await sdk.Swap.calculatePriceImpact({
      fromToken: direction ? params.fromToken.address : params.toToken.address,
      toToken: direction ? params.toToken.address : params.fromToken.address,
      fromAmount: direction ? fromAmount : toAmount,
      toAmount: direction ? toAmount : fromAmount,
      interactiveToken
    })

    const impact = fixD(Math.abs(Number(result)), 2)

    return Number(impact) ? impact : '<0.01'
  }

  interface swapTransactionParams {
    fromToken: Tokens
    toToken: Tokens
    fromAmount: string | number
    toAmount: string | number
    interactiveToken: 'from' | 'to'
    slippage: number
  }

  const createSwapTransactionPayload = async (params: swapTransactionParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const suiRes = suiContract.createSwapTransactionPayload(params)
      return suiRes
    }
    const direction = getDirection(params.fromToken.symbol, params.toToken.symbol, liquidity.value.lpTokens)
    let interactiveToken: 'from' | 'to' = 'from'
    if ((direction && params.interactiveToken === 'from') || (!direction && params.interactiveToken === 'to')) {
      interactiveToken = 'from'
    } else {
      interactiveToken = 'to'
    }
    const fromAmount = convertToDecimals(params.fromAmount, params.fromToken.decimals)
    const toAmount = convertToDecimals(params.toAmount, params.toToken.decimals)
    const rate = await calculateRates({
      fromToken: params.fromToken,
      toToken: params.toToken,
      amount: params.interactiveToken === 'from' ? params.fromAmount : params.toAmount,
      interactiveToken: params.interactiveToken
    })
    const toAmountNew = convertToDecimals(rate, params.interactiveToken === 'from' ? params.toToken.decimals : params.fromToken.decimals)

    const result = await sdk.Swap.createSwapTransactionPayload({
      fromToken: params.fromToken.address,
      toToken: params.toToken.address,
      // fromAmount: params.interactiveToken === 'from' ? fromAmount.toString() : toAmountNew.toString(),
      // toAmount: params.interactiveToken === 'from' ? toAmountNew.toString() : toAmount.toString(),
      fromAmount:
        params.interactiveToken === 'from' ? fromAmount.toString() : fixD(toAmountNew.plus(toAmountNew.mul(params.slippage)).toString(), 0),
      // eslint-disable-next-line max-len
      toAmount:
        params.interactiveToken === 'from' ? fixD(toAmountNew.minus(toAmountNew.mul(params.slippage)).toString(), 0) : toAmount.toString(),
      interactiveToken: params.interactiveToken,
      slippage: params.slippage
    })

    return result
  }

  const getCoinInfos = async () => {
    const coinInfoArray = await sdk.Resources.getCoinInfos(LiquidswapDeployer)
    const result: any = []
    coinInfoArray.forEach((item: any) => {
      const total = item.supply.vec[0].integer.vec[0].value || ''
      let address = ''
      if (item.coinAddress.includes('0x0000000000000000000000000000000000000000000000000000000000000001')) {
        address = item.coinAddress.replace(/0x0000000000000000000000000000000000000000000000000000000000000001/, '0x1')
      } else {
        address = item.coinAddress
      }
      result.push({
        ...item,
        total,
        coinAddress: address
      })
    })
    return result
  }

  interface getLiquidityAndCoinYByCoinXParams {
    coinX: Tokens
    coinY: Tokens
    amount: string | number
  }
  // Add liquidity pre-calculation (note: coinX, coinY are passed in order of input)
  const getLiquidityAndCoinYByCoinX = async (params: getLiquidityAndCoinYByCoinXParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const suiRes = await suiContract.getLiquidityAndCoinYByCoinX(params)
      return suiRes
    }
    const currentLP: any = getCurrentLP(params.coinX.symbol, params.coinY.symbol, liquidity.value.lpTokens)
    const direction = getDirection(params.coinX.symbol, params.coinY.symbol, liquidity.value.lpTokens)

    const amountX = convertToDecimals(params.amount, params.coinX.decimals)
    const result: any = await sdk.Liquidity.getLiquidityAndCoinYByCoinX({
      coinX: params.coinX.address,
      coinY: params.coinY.address,
      amountX,
      direction
    })
    if (result == -1) return result
    const prettyLpAmount = decimalFormat(prettyAmount(result.lpAmount.toString(), currentLP.decimals), currentLP.decimals) || ''
    const lpAmountView = Number(prettyLpAmount) ? prettyLpAmount : `<${d(1).div(Math.pow(10, currentLP.decimals).toString())}`
    return {
      coinYAmount: prettyAmount(result.coinYAmount.toString(), params.coinY.decimals),
      coinYAmountOrigin: result.coinYAmount,
      lpAmount: result.lpAmount.toString(),
      lpAmountView
    }
  }
  interface getCoinXForLiquidityParams {
    coinX: Tokens
    coinY: Tokens
    liquidity: string | number
  }

  // Obtain coinX, coinY quantity through liquidity
  const getCoinXYForLiquidity = async (params: getCoinXForLiquidityParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const suiRes = await suiContract.getCoinXYForLiquidity(params)
      return suiRes
    }
    const direction = getDirection(params.coinX.symbol, params.coinY.symbol, liquidity.value.lpTokens)

    const result = await sdk.Liquidity.getCoinXYForLiquidity({
      coinX: params.coinX.address,
      coinY: params.coinY.address,
      liquidity: Number(params.liquidity),
      direction
    })

    return {
      coinXAmount: prettyAmount(result.coinXAmount.toString(), params.coinX.decimals),
      coinYAmount: prettyAmount(result.coinYAmount.toString(), params.coinY.decimals)
    }
  }

  interface addLiquidityParams {
    coinX: Tokens
    coinY: Tokens
    coinXAmount: string | number
    coinYAmount: string | number
    slippage: number
  }
  // Get Add Liquidity Payload
  const createAddLiquidityTransactionPayload = async (params: addLiquidityParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const suiRes = await suiContract.createAddLiquidityTransactionPayload(params)
      return suiRes
    }
    const coinXAmount = convertToDecimals(params.coinXAmount, params.coinX.decimals)

    let coinYAmount
    const coinYRes = await getLiquidityAndCoinYByCoinX({
      coinX: params.coinX,
      coinY: params.coinY,
      amount: params.coinXAmount
    })
    if (coinYRes && coinYRes !== -1) {
      coinYAmount = coinYRes.coinYAmountOrigin
    }

    const result = await sdk.Liquidity.createAddLiquidityTransactionPayload({
      coinX: params.coinX.address,
      coinY: params.coinY.address,
      coinXAmount,
      coinYAmount: coinYAmount ? coinYAmount : convertToDecimals(params.coinYAmount, params.coinY.decimals),
      slippage: params.slippage
    })

    return result
  }

  interface removeLiquidityParams {
    coinX: Tokens
    coinY: Tokens
    liquidity: string | number
    slippage: number
  }
  // Get Remove Liquidity Payload
  const removeLiquidityTransactionPayload = async (params: removeLiquidityParams) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      const suiRes = await suiContract.removeLiquidityTransactionPayload(params)
      return suiRes
    }
    const result = await sdk.Liquidity.removeLiquidityTransactionPayload({
      coinX: params.coinX.address,
      coinY: params.coinY.address,
      liquidity: params.liquidity,
      slippage: params.slippage
    })

    return result
  }

  const getCoin = (coin: string) => {
    let payload
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      payload = suiContract.getCoin()
    } else {
      if (coin === 'all') {
        payload = {
          type: 'entry_function_payload',
          function: '0x84dc9d921d277db5047dcb17addc2ecfbddfad087dd4ea825b2d17785755cb29::cetus_faucet::faucet',
          arguments: [],
          type_arguments: []
        }
      } else {
        payload = {
          type: 'entry_function_payload',
          function: '0x84dc9d921d277db5047dcb17addc2ecfbddfad087dd4ea825b2d17785755cb29::cetus_faucet::faucetSeparateCoin',
          arguments: [],
          type_arguments: [liquidity.value.tokens[coin].address]
        }
      }
    }

    return payload
  }

  // Get the timestamp (seconds) of the last test coin claim
  const getFaucetAllLimit = async (account: string) => {
    const result: any = await sdk.Resources.fetchAccountResource(
      account,
      '0x84dc9d921d277db5047dcb17addc2ecfbddfad087dd4ea825b2d17785755cb29::cetus_faucet::FaucetAllLimit'
    )
    return (result && result.data && result.data.faucet_timestamp) || ''
  }

  const getFaucetSeparateCountdown = (coin: string) => {
    return {
      type: 'entry_function_payload',
      function: '0x84dc9d921d277db5047dcb17addc2ecfbddfad087dd4ea825b2d17785755cb29::cetus_faucet::faucetSeparateCountdown',
      arguments: [],
      type_arguments: [liquidity.value.tokens[coin].address]
    }
  }

  const handleTx = (res: any) => {
    if (index.value.chainName !== 'Aptos') {
      const suiContract = useSuiContract(index.value.chainName)
      return suiContract.handleTx(res)
    }
    return res
  }

  return {
    sdk,
    getAccount,
    calculateRates,
    createSwapTransactionPayload,
    calculatePriceImpact,
    getLiquidityAndCoinYByCoinX,
    getCoinXYForLiquidity,
    createAddLiquidityTransactionPayload,
    removeLiquidityTransactionPayload,
    getCoinInfos,
    getMyLpList,
    getCoin,
    getFaucetAllLimit,
    getFaucetSeparateCountdown,
    getPrice,
    getShareOfPool,
    watchTransaction,
    showTransitionPending,
    showTransitionSuccess,
    showTransitionError,
    handleTx
    // getLiquidityPoolResource
  }
}
