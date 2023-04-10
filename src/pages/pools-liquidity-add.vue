<template>
  <div class="linquidity-add-container">
    <Back />
    <div class="title">
      <div class="left">{{ $t('common.addLiquidity') }}</div>
      <div class="right title-right">
        <div class="slippage-icon" @click="isShowSwapSetting = true">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-icon-setslippage" />
          </svg>
          <span>{{ slippage }}%</span>
        </div>
        <svg class="icon information-icon" aria-hidden="true" @click="isShowAddress = true">
          <use xlink:href="#icon-icon-information" />
        </svg>
        <RefreshIcon
          :loading="refresh"
          :auto-refresh-time="autoRefreshTime"
          :countdown="countdown"
          @clickRefresh="clickRefresh"
        ></RefreshIcon>
      </div>
    </div>
    <div class="swap-card">
      <div class="card-container">
        <div class="card-item">
          <Assets-Card
            v-model="fromCoinAmount"
            :input-value="fromCoinAmount"
            :coin-name="fromCoin ? fromCoin.symbol : ''"
            :coin-address="fromCoin ? fromCoin.address : ''"
            :coin-decimals="fromCoin ? fromCoin.decimals : 6"
            :coin-icon="fromCoin ? fromCoin.logoURI : ''"
            :swap-direction="'From'"
            @onMax="maxBtnSelect"
            @onInput="amount => (fromCoinAmount = amount)"
            @onFocus="
              () => {
                fixedFromCoin = true
              }
            "
            @onSelect="openCoinSelect('fromCoin')"
          />
        </div>
        <div class="card-item">
          <Assets-Card
            v-model="toCoinAmount"
            :input-value="toCoinAmount"
            :coin-name="toCoin ? toCoin.symbol : ''"
            :coin-address="toCoin ? toCoin.address : ''"
            :coin-decimals="toCoin ? toCoin.decimals : 6"
            :swap-direction="'To'"
            :coin-icon="toCoin ? toCoin.logoURI : ''"
            @onMax="maxBtnSelect"
            @onInput="amount => (toCoinAmount = amount)"
            @onFocus="
              () => {
                fixedFromCoin = false
              }
            "
            @onSelect="openCoinSelect('toCoin')"
          />
        </div>
        <img :class="change ? 'gang animationex' : 'gang'" src="../assets/image/img-leverage@2x.png" alt="" />
        <div class="exchange">
          <svg :class="change ? 'icon animationex' : 'icon'" aria-hidden="true">
            <use xlink:href="#icon-icon-add1" />
          </svg>
        </div>
      </div>
      <div v-if="BtnText !== 'Pool not found'" class="induction">
        <div v-if="fromCoin && toCoin" class="item">
          <div class="induction-text">{{ $t('common.rate') }}</div>
          <div class="induction-value induction-value-change">
            <span v-if="!rateChange">1 {{ fromCoin.symbol }} ≈ {{ decimalFormat(rate, toCoin.decimals) }} {{ toCoin.symbol }}</span>
            <span v-else
              >1 {{ toCoin.symbol }} ≈ {{ decimalFormat(String(1 / Number(rate)), fromCoin.decimals) }} {{ fromCoin.symbol }}</span
            >
            <!-- <img :src="importIcon`/image/icon-change@2x.png`" alt="" /> -->
            <svg class="icon-change" aria-hidden="true" @click="rateChange = !rateChange">
              <use xlink:href="#icon-a-icon-change2" />
            </svg>
          </div>
        </div>
        <div v-if="fromCoinAmount && toCoinAmount" class="item">
          <div class="induction-text">{{ $t('common.shareOfPool') }}</div>
          <div class="induction-value">{{ share }}%</div>
        </div>
        <div v-if="fromCoinAmount && toCoinAmount && lpAmountView" class="item">
          <div class="induction-text">{{ $t('common.lPTokensReceived') }}</div>
          <div class="induction-value">
            {{ lpAmountView }}
          </div>
        </div>
      </div>
    </div>

    <a-button
      :disabled="
        !wallet.connected
          ? false
          : loading ||
            swaping ||
            !fromCoin ||
            !toCoin ||
            !Number(fromCoinAmount) ||
            !Number(toCoinAmount) ||
            swapBtnText == $t('button.poolNotFound') ||
            !assets[fromCoin.address] ||
            Number(fromCoinAmount) > prettyAmount(assets[fromCoin.address].balance, fromCoin.decimals) ||
            Number(toCoinAmount) > prettyAmount(assets[toCoin.address].balance, toCoin.decimals)
      "
      :loading="swaping"
      class="big-btn"
      @click="!wallet.connected ? wallet.setIsShowWalletModal(true) : (isShowAddConfirm = true)"
    >
      <svg v-if="wallet.connected" class="icon" aria-hidden="true">
        <use xlink:href="#icon-icon-add" />
      </svg>
      <span>{{ !wallet.connected ? $t('button.connectWallet') : BtnText }}</span>
    </a-button>
    <NetworkTips />
    <div
      v-if="
        currentLpInfo &&
        currentLpInfo.myLpBalance &&
        Number(currentLpInfo.balance) !== 0 &&
        wallet.connected &&
        BtnText !== $t('button.poolNotFound')
      "
      class="showMyLiquidity"
    >
      <div class="myLiquidity">
        <div class="left">{{ $t('common.yourLiquidity') }}</div>
        <div class="right">
          <p>{{ currentLpInfo.myLpBalance }} LP</p>
          <span>≈ ${{ addCommom(currentLpInfo.myBalanceUSD, 2) }}</span>
        </div>
      </div>
      <div class="liquidityAsset">
        <div class="item">
          <div class="left">
            <img :src="fromCoin.logoURI || importIcon(`/image/coins/${fromCoin.symbol.toLowerCase()}.png`)" alt="" />
            <span>{{ fromCoin.symbol }}</span>
            <span class="coin-name">{{ fromCoin?.name }}</span>
          </div>
          <div class="right">{{ addCommom(currentLpInfo.myCoinXAmount, fromCoin.decimals) }}</div>
        </div>
        <div class="item">
          <div class="left">
            <img :src="toCoin.logoURI || importIcon(`/image/coins/${toCoin.symbol.toLowerCase()}.png`)" alt="" />
            <span>{{ toCoin.symbol }}</span>
            <span class="coin-name">{{ toCoin?.name }}</span>
          </div>
          <div class="right">{{ addCommom(currentLpInfo.myCoinYAmount, toCoin.decimals) }}</div>
        </div>
      </div>
      <div class="induction induction-liquidity">
        <!-- <div class="item">
        <div class="induction-text">LP Reward APR</div>
        <div class="induction-value">8.12%</div>
      </div> -->
        <div class="item">
          <div class="induction-text">{{ $t('common.shareOfPool') }}</div>
          <div class="induction-value">{{ currentLpInfo.myshareOfPool }} %</div>
        </div>
      </div>
    </div>
    <CoinSelect
      v-if="showCoinSelect"
      :existing-coins="existingCoins"
      :last-select-coin="lastSelectCoin"
      @onSelect="onCoinSelect"
      @onClose="showCoinSelect = false"
    ></CoinSelect>
    <Address v-if="isShowAddress" :from-coins="fromCoin" :to-coins="toCoin" @onClose="isShowAddress = false" />
    <SwapSetting v-if="isShowSwapSetting" @onClose="isShowSwapSetting = false" />
    <ManagementAddConfirm
      v-if="isShowAddConfirm"
      :current-lp-info="currentLpInfo"
      :is-increase="currentLpInfo && currentLpInfo.balance ? true : false"
      :fixed-from-coin="fixedFromCoin"
      :from-coin="fromCoin"
      :to-coin="toCoin"
      :share="share"
      :rate="rate"
      :lp-amount="lpAmountView"
      :from-coin-amount="fromCoinAmount"
      :to-coin-amount="toCoinAmount"
      :current-recived-lp="lpAmountView"
      @on-close="isShowAddConfirm = false"
      @to-add="toAdd"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, computed, watchEffect, watch } from 'vue'
import { AptosClient } from 'aptos'
import importIcon from '@/utils/import-icon'
import { useIndexStore } from '../store'
import { useWalletStore } from '../store/wallet'
import { getCurrentLP, prettyAmount } from '@/utils/tokens'
import { addCommom, checkNullObj, fixD, decimalFormat } from '@/utils'
import useContract from '@/composables/useContract'
import { useRouter, useRoute } from 'vue-router'
import { useLiquidityStore } from '@/store/liquidity'
import { decimalsMultiplier, d } from 'test-cetus-sdk/dist/utils/numbers'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'

definePageMeta({
  middleware: ['detail']
})
export default defineComponent({
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })
    const indexStore = useIndexStore()
    const store = computed(() => {
      return indexStore
    })
    const liquidityStore = useLiquidityStore()
    const liquidity = computed(() => {
      return liquidityStore
    })
    let hasLiquidity = ref(true)
    let change = ref(false)
    let refresh = ref(false)
    let isShowAddress = ref(false)
    let isShowSwapSetting = ref(false)
    let rateChange = ref(false)
    const currentCoinKey = ref('fromCoin')
    const existingCoins = ref('')
    const lastSelectCoin = ref('')
    const showCoinSelect = ref(false)
    const isShowAddConfirm = ref(false)
    const fixedFromCoin = ref(true)
    const loading = ref(false)
    const swaping = ref(false)
    const fromCoinAmount = ref('')
    const toCoinAmount = ref('')
    const autoRefreshTime = ref(20)
    const countdown = ref(0)
    const marketTimer = ref(null as any)
    const router = useRouter()
    const route = useRoute()
    const coinfrom: string = router?.currentRoute?.value?.query?.from || Object.values(liquidity.value.lpTokens)[0].coinA
    const cointo: string = router?.currentRoute?.value?.query?.to || Object.values(liquidity.value.lpTokens)[0].coinB
    const fromCoin = ref<any>('')
    const toCoin = ref<any>('')

    watchEffect(() => {
      if (!checkNullObj(liquidity.value.lpTokens) && !checkNullObj(liquidityStore.tokens)) {
        if (!fromCoin.value && !toCoin.value) {
          fromCoin.value = liquidityStore.tokens[coinfrom] || Object.values(liquidity.value.lpTokens)[0].coinA
          toCoin.value = liquidityStore.tokens[cointo] || Object.values(liquidity.value.lpTokens)[0].coinB
        }
      }
    })

    watch(
      () => [store.value.chainName, liquidity.value.lpTokens],
      ([newChainName, newLpTokens], [oldChainName, oldLpTokens]) => {
        if (newChainName && !checkNullObj(newLpTokens)) {
          fromCoin.value = liquidityStore.tokens[coinfrom] || Object.values(newLpTokens)[0].coinA
          toCoin.value = liquidityStore.tokens[cointo] || Object.values(newLpTokens)[0].coinB
        }
      }
    )

    const rate = ref('')
    const { t } = useI18n()
    const slippage = computed(() => {
      return store.value.slippage
    })
    const BtnText = computed(() => {
      // let lp = ''
      // let reverseLp = ''
      // if (fromCoin.value && toCoin.value) {
      //   lp = fromCoin.value.symbol + '-' + toCoin.value.symbol
      //   reverseLp = toCoin.value.symbol + '-' + fromCoin.value.symbol
      // } else {
      //   lp = ''
      //   reverseLp = ''
      // }
      // if (!Object.keys(LP_TOKENS).includes(lp)) {
      //   if (!Object.keys(LP_TOKENS).includes(reverseLp)) {
      //     return t('button.poolNotFound')
      //   }
      // }
      const currentLp = getCurrentLP(fromCoin.value && fromCoin.value.symbol, toCoin.value && toCoin.value.symbol, liquidityStore.lpTokens)
      if (!currentLp) return t('button.poolNotFound')
      // if (fromCoin.value && Number(fromCoinAmount.value) > Number(liquidity.value.tokens[fromCoin.value.symbol].balance)) {
      //   return t('button.insufficientBalance', { name: fromCoin.value.symbol })
      // }
      // if (toCoin.value && Number(toCoinAmount.value) > Number(liquidity.value.tokens[toCoin.value.symbol].balance)) {
      //   return t('button.insufficientBalance', { name: toCoin.value.symbol })
      // }

      if (wallet.value.assets && wallet.value.assets[fromCoin.value.address]) {
        if (
          fromCoin.value &&
          Number(fromCoinAmount.value) > Number(prettyAmount(wallet.value.assets[fromCoin.value.address].balance, fromCoin.value.decimals))
        ) {
          return t('button.insufficientBalance', {
            name: fromCoin.value.symbol
          })
        }
      } else if (wallet.value.assets && !wallet.value.assets[fromCoin.value.address]) {
        return t('button.insufficientBalance', {
          name: fromCoin.value.symbol
        })
      }

      if (wallet.value.assets && wallet.value.assets[toCoin.value.address]) {
        if (
          toCoin.value &&
          Number(toCoinAmount.value) > Number(prettyAmount(wallet.value.assets[toCoin.value.address].balance, toCoin.value.decimals))
        ) {
          return t('button.insufficientBalance', {
            name: toCoin.value.symbol
          })
        }
      } else if (wallet.value.assets && !wallet.value.assets[toCoin.value.address]) {
        return t('button.insufficientBalance', {
          name: toCoin.value.symbol
        })
      }
      if (!Number(fromCoinAmount.value)) {
        return t('button.enterAmount')
      }
      return t('button.addToPool')
    })
    const openCoinSelect = (key: string) => {
      currentCoinKey.value = key
      if (key === 'fromCoin') {
        existingCoins.value = toCoin.value?.symbol || ''
        lastSelectCoin.value = fromCoin.value?.symbol || ''
      } else {
        existingCoins.value = fromCoin.value?.symbol || ''
        lastSelectCoin.value = toCoin.value?.symbol || ''
      }
      showCoinSelect.value = true
    }
    const onCoinSelect = token => {
      fromCoinAmount.value = ''
      toCoinAmount.value = ''
      if (currentCoinKey.value === 'fromCoin') {
        if (toCoin.value) {
          if (token.symbol.toLowerCase() === toCoin?.value.symbol.toLowerCase()) {
            toCoin.value = null
          }
        }
        fromCoin.value = token
      } else {
        if (fromCoin.value) {
          if (token.symbol.toLowerCase() === fromCoin?.value.symbol.toLowerCase()) {
            fromCoin.value = null
          }
        }
        toCoin.value = token
      }
      showCoinSelect.value = false
    }
    const maxBtnSelect = (key: string, balance: any) => {
      if (key === 'fromCoin') {
        fixedFromCoin.value = true
        fromCoinAmount.value = balance.value
      } else {
        fixedFromCoin.value = false
        toCoinAmount.value = balance.value
      }
    }

    // watchEffect(async () => {
    //   if (wallet.value.address) {
    //     liquidityStore.setMyLplist(wallet.value.address)
    //   }
    // })
    onMounted(async () => {
      const coinfrom: any = router.currentRoute.value.query.from
      const cointo: any = router.currentRoute.value.query.to
      // if (liquidity.value.myLplist && wallet.value.address) {
      //   const list: any = liquidity.value.myLplist
      //   let currentLP
      //   if (coinfrom && cointo) {
      //     currentLP = getCurrentLP(coinfrom, cointo)
      //   }
      //   if (currentLP) {
      //     const info = list.filter((item: any) => item.symbol === currentLP.symbol)[0]
      //     currentLpInfo.value = info
      //   }
      // }

      // rate.value = await contractStore.getPrice({
      //   coinX: liquidity.value.tokens[coinfrom],
      //   coinY: liquidity.value.tokens[cointo]
      // })

      setMarketTimer()
    })

    watch(
      () => [liquidity.value.myLplist, fromCoin.value, toCoin.value],
      async ([newMyLplist, newFromCoin, newToCoin]) => {
        if (!checkNullObj(newMyLplist) && newFromCoin && newToCoin) {
          rate.value =
            (await contractStore.getPrice({
              coinX: liquidity.value.tokens[newFromCoin.symbol],
              coinY: liquidity.value.tokens[newToCoin.symbol]
            })) || ''
        }
      }
    )

    const clickRefresh = async () => {
      countdown.value = 0
      refresh.value = true
      setTimeout(() => {
        refresh.value = false
      }, 1000)
      if (wallet.value.address) {
        liquidityStore.setMyLplist(wallet.value.address)
      }
      rate.value = await contractStore.getPrice({
        coinX: liquidity.value.tokens[coinfrom],
        coinY: liquidity.value.tokens[cointo]
      })
    }
    const clickExchange = () => {
      const token = fromCoin.value
      fromCoin.value = toCoin.value
      toCoin.value = token
      change.value = true
      route.query = {}
      setTimeout(() => {
        change.value = false
      }, 300)
    }
    const setMarketTimer = () => {
      marketTimer.value = setInterval(() => {
        if (!loading.value) {
          if (countdown.value < autoRefreshTime.value) {
            countdown.value += 1

            if (countdown.value === autoRefreshTime.value) {
              countdown.value = 0
              marketTimer.value = null
              window.clearInterval(marketTimer.value)
              getAmount(fixedFromCoin.value ? fromCoinAmount.value : toCoinAmount.value)
            }
          }
        }
      }, 1000)
    }
    const clickBtn = async () => {
      isShowAddConfirm.value = true
    }
    const contractStore = useContract()
    // const antiShake = (val: string, time: number) => {
    //   return setTimeout(() => {
    //     if (fromCoin.value && toCoin.value) {
    //       getAmount(`${val}`)
    //     }
    //   }, time)
    // }
    // watchEffect(onInvalidate => {
    //   if (!change.value) {
    //     if (fixedFromCoin.value) {
    //       const timer = antiShake(fromCoinAmount.value, 500)
    //       onInvalidate(() => clearTimeout(timer))
    //     } else {
    //       const timer = antiShake(toCoinAmount.value, 500)
    //       onInvalidate(() => clearTimeout(timer))
    //     }
    //   } else {
    //     if (fixedFromCoin.value) {
    //       toCoinAmount.value = fromCoinAmount.value
    //       const timer = antiShake(toCoinAmount.value, 500)
    //       onInvalidate(() => clearTimeout(timer))
    //     } else {
    //       fromCoinAmount.value = toCoinAmount.value
    //       const timer = antiShake(fromCoinAmount.value, 500)
    //       onInvalidate(() => clearTimeout(timer))
    //     }
    //   }
    // })
    watch(
      fixedFromCoin,
      debounce((newVal, oldVal) => {
        fixedFromCoin.value = newVal
        // if (newVal !== oldVal) {
        //   if (fixedFromCoin.value) {
        //     getAmount(fromCoinAmount.value)
        //   } else {
        //     getAmount(toCoinAmount.value)
        //   }
        // }
      }, 800)
    )
    watch(
      fromCoinAmount,
      debounce((newVal, oldVal) => {
        if (newVal && fixedFromCoin.value) {
          getAmount(newVal)
        }
        if (newVal == '' && fixedFromCoin.value) {
          toCoinAmount.value = ''
        }
      }, 500)
    )
    watch(
      toCoinAmount,
      debounce((newVal, oldVal) => {
        if (newVal && !fixedFromCoin.value) {
          getAmount(newVal)
        }
        if (newVal == '' && !fixedFromCoin.value) {
          fromCoinAmount.value = ''
        }
      }, 500)
    )

    const lpAmountView = ref('')
    const share = ref('')
    const getAmount = async val => {
      const params = ref<any>({})
      if (val !== '' && BtnText.value !== t('common.poolNotFound')) {
        if (fixedFromCoin.value) {
          params.value = {
            coinX: liquidity.value.tokens[fromCoin.value.symbol],
            coinY: liquidity.value.tokens[toCoin.value.symbol],
            amount: val
          }
        } else {
          params.value = {
            coinX: liquidity.value.tokens[toCoin.value.symbol],
            coinY: liquidity.value.tokens[fromCoin.value.symbol],
            amount: val
          }
        }
        if (params.value) {
          try {
            const result: any = await contractStore.getLiquidityAndCoinYByCoinX(params.value)
            if (result == -1) {
              share.value = '100'
              const a = d(fromCoinAmount.value).mul(Math.pow(10, fromCoin.value.decimals))
              const b = d(toCoinAmount.value).mul(Math.pow(10, toCoin.value.decimals))
              lpAmountView.value = decimalFormat(a.mul(b).sqrt().div(Math.pow(10, 6)).toString(), 6) || ''
              if (fromCoinAmount.value && toCoinAmount.value) {
                rate.value = String(Number(toCoinAmount.value) / Number(fromCoinAmount.value))
              } else {
                rate.value = '0'
              }
              return
            }
            if (fixedFromCoin.value) {
              toCoinAmount.value = result.coinYAmount
            } else {
              fromCoinAmount.value = result.coinYAmount
            }
            lpAmountView.value = result.lpAmountView
            // share of pool
            const s = await contractStore.getShareOfPool({
              coinX: liquidity.value.tokens[fromCoin.value.symbol],
              coinY: liquidity.value.tokens[toCoin.value.symbol],
              currentLpVal: result.lpAmount
            })
            share.value = s
            // }
          } catch (error) {
            console.log('pools-liquidity-add###getAmount###share##error###', error)
          }
        }
      } else {
        if (fixedFromCoin.value) {
          toCoinAmount.value = ''
        } else {
          fromCoinAmount.value = ''
        }
      }
    }

    const currentLpInfo = ref<any>({})

    watch(
      () => [store.value.chainName, wallet.value.address, liquidity.value.lpTokens],
      ([newChainName, newWalletAddress, newLpTokens]) => {
        if (newChainName && !checkNullObj(newLpTokens)) {
          liquidityStore.setMyLplist(newWalletAddress)
        }
      },
      {
        immediate: true
      }
    )

    watchEffect(() => {
      if (fromCoin.value && toCoin.value && liquidity.value.myLplist) {
        if (liquidity.value.myLplist.length > 0 && wallet.value.address) {
          const list: any = liquidity.value.myLplist
          let currentLP
          if (fromCoin.value.symbol && toCoin.value.symbol) {
            currentLP = getCurrentLP(fromCoin.value.symbol, toCoin.value.symbol, liquidity.value.lpTokens)
          }
          if (currentLP) {
            const info = list.filter((item: any) => item.symbol === currentLP.symbol)[0]

            currentLpInfo.value = info
          }
        }
      }
    })

    const { setIsShowSuccess, setIsShowRejected, setIsShowWaiting, setTransactionDesc, setTransactionTxid } = indexStore
    const toAdd = async () => {
      isShowAddConfirm.value = false
      setTransactionTxid('')
      setTransactionDesc(
        t('tips.addLiquiditySuccessText', {
          from: `${fromCoinAmount.value} ${fromCoin.value?.symbol}`,
          to: `${toCoinAmount.value} ${toCoin.value?.symbol}`
        })
      )
      setIsShowWaiting(true)

      try {
        const params: any = ref({})
        if (fixedFromCoin.value) {
          params.value = {
            coinX: liquidity.value.tokens[fromCoin.value.symbol],
            coinY: liquidity.value.tokens[toCoin.value.symbol],
            coinXAmount: fromCoinAmount.value,
            coinYAmount: toCoinAmount.value,
            slippage: Number(store.value.slippage) / 100
          }
        } else {
          params.value = {
            coinX: liquidity.value.tokens[toCoin.value.symbol],
            coinY: liquidity.value.tokens[fromCoin.value.symbol],
            coinXAmount: toCoinAmount.value,
            coinYAmount: fromCoinAmount.value,
            slippage: Number(store.value.slippage) / 100
          }
        }
        const payload = await contractStore.createAddLiquidityTransactionPayload(params.value)

        let tx
        if (store.value.chainName !== 'Aptos') {
          const res = await wallet.value.currentWallet.signAndExecuteTransaction(payload)
          tx = contractStore.handleTx(res)
        } else {
          tx = await wallet.value.currentWallet.signAndSubmitTransaction(payload)
        }

        if (tx && tx.hash) {
          setTransactionTxid(tx.hash)
          setIsShowWaiting(false)
          setIsShowSuccess(true)
          const params = {
            title: t('common.addLiquidity'),
            desc: t('tips.increaseLiquiditySuccess', {
              from: `${fromCoinAmount.value} ${fromCoin.value?.symbol}`,
              to: `${toCoinAmount.value} ${toCoin.value?.symbol}`
            }),
            hash: tx.hash,
            descTransactions: `Add ${fromCoinAmount.value} ${fromCoin.value?.symbol} and ${toCoinAmount.value} ${toCoin.value?.symbol} 
         to the pool`,
            sender: wallet.value.address,
            chainName: store.value.chainName
          }
          contractStore.showTransitionPending(params)
          const transitionStatus = await contractStore.watchTransaction(params)
          if (transitionStatus) {
            setTimeout(() => {
              clickRefresh()
            }, 1000)
          }
          // }
        } else {
          setIsShowWaiting(false)
          setIsShowRejected(true)
        }
        swaping.value = false
        toCoinAmount.value = ''
        fromCoinAmount.value = ''
      } catch (error) {
        console.log('0208###toAdd###error####', error)
        swaping.value = false
        setIsShowWaiting(false)
        setIsShowRejected(true)
        toCoinAmount.value = ''
        fromCoinAmount.value = ''
      }
    }

    const assets = computed(() => {
      return wallet.value.assets
    })
    return {
      addCommom,
      share,
      prettyAmount,
      fixD,
      decimalFormat,
      currentLpInfo,
      lpAmountView,
      coinfrom,
      cointo,
      router,
      wallet,
      hasLiquidity,
      importIcon,
      clickExchange,
      clickRefresh,
      refresh,
      change,
      isShowAddress,
      isShowSwapSetting,
      fromCoin,
      toCoin,
      slippage,
      openCoinSelect,
      onCoinSelect,
      existingCoins,
      lastSelectCoin,
      currentCoinKey,
      showCoinSelect,
      fromCoinAmount,
      toCoinAmount,
      maxBtnSelect,
      fixedFromCoin,
      BtnText,
      clickBtn,
      loading,
      swaping,
      autoRefreshTime,
      countdown,
      setMarketTimer,
      marketTimer,
      rateChange,
      isShowAddConfirm,
      rate,
      toAdd,
      assets
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
@keyframes exchange {
  0% {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }

  100% {
    transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }
}
.theme-sui {
  .exchange {
    background: url('/sui-image/img-swap-bg@2x.png') !important;
    background-size: 100% 100% !important;
  }
}

.linquidity-add-container {
  width: 480px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 12px;
    .left {
      font-size: 20px;
      color: @textActive;
    }
  }
  .swap-card {
    background: @cardDefault;
    .card-container {
      width: 100%;
      position: relative;
      .card-item {
        padding-right: 16px;
        background: @cardAsset;
      }
      .exchange {
        background: url('../assets/image/img-swap-bg@2x.png');
        background-size: 100% 100%;
        width: 36px;
        height: 36px;
        padding-top: 4px;
        text-align: center;
        position: absolute;
        right: 0px;
        top: 50%;
        margin-top: -18px;
        svg {
          width: 28px;
          height: 28px;
          fill: @themeColor;
        }
      }
      .animationex {
        animation: exchange 0.3s 1 linear;
        -webkit-transform-origin: center center;
        -ms-transform-origin: center center;
        transform-origin: center center;
      }
      .gang {
        width: 6px;
        height: 192px;
        position: absolute;
        right: 16px;
        top: 50%;
        margin-top: -86px;
      }
    }
  }
  .ant-btn {
    margin-top: 8px;
  }
  .induction-liquidity {
    background: #121212 !important;
    .liquidity-item {
      margin-top: -10px !important;
    }
    .item {
      .left {
        display: flex;
        p {
          margin-bottom: 0 !important;
        }
        img {
          width: 20px;
          height: 20px;
          &:nth-child(2) {
            margin-left: -8px;
            margin-right: 8px;
          }
        }
      }
      .right {
        color: @textActive;
      }
    }
    p {
      font-size: 16px;
      color: @textActive;
    }
  }
}
@media (max-width: 750px) {
  .linquidity-add-container {
    width: 100%;
  }
}
</style>
