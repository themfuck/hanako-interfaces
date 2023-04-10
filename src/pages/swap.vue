<template>
  <div class="swap-container">
    <div class="title">
      <div class="left">{{ $t('menu.swap') }}</div>
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
            :havemax="false"
            :coin-name="toCoin ? toCoin.symbol : ''"
            :coin-address="toCoin ? toCoin.address : ''"
            :coin-decimals="toCoin ? toCoin.decimals : 6"
            :swap-direction="'To'"
            :coin-icon="toCoin ? toCoin.logoURI : ''"
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
        <div class="exchange" @click="clickExchange()">
          <svg :class="change ? 'icon animationex' : 'icon'" aria-hidden="true">
            <use xlink:href="#icon-icon-swap1" />
          </svg>
        </div>
      </div>
      <div
        v-if="
          currentLP &&
          fromCoinAmount &&
          toCoinAmount &&
          fromCoinAmount !== '0' &&
          toCoinAmount !== '0' &&
          impact !== '' &&
          swapBtnText !== $t('button.poolNotFound')
        "
        class="induction"
      >
        <div class="item">
          <div class="induction-text">{{ $t('common.exchangeRate') }}</div>
          <div class="induction-value induction-value-change" @click="rateChange = !rateChange">
            <span v-if="!rateChange">
              1 {{ fromCoin.symbol }} ≈
              <span v-if="oneToAmount">{{ decimalFormat(oneToAmount, toCoin.decimals) }}&nbsp;</span>
              <template v-else>
                <a-spin :indicator="indicator" />
              </template>
              <!-- {{ decimalFormat(oneToAmount, toCoin.decimals) }} -->
              {{ toCoin.symbol }}
            </span>
            <span v-else>
              1 {{ toCoin.symbol }} ≈
              <span v-if="oneFromAmount">{{ decimalFormat(oneFromAmount, fromCoin.decimals) }}&nbsp;</span>
              <template v-else>
                <a-spin :indicator="indicator" />
              </template>
              <!-- {{ decimalFormat(oneFromAmount, fromCoin.decimals) }} -->
              {{ fromCoin.symbol }}
            </span>
            <!-- <img :src="importIcon`/image/icon-change@2x.png`" alt="" /> -->
            <svg class="icon-change" aria-hidden="true">
              <use xlink:href="#icon-a-icon-change2" />
            </svg>
          </div>
        </div>
        <div class="item">
          <div class="induction-text">{{ $t('common.priceImpact') }}</div>
          <div class="induction-value">{{ impact }}%</div>
        </div>
        <div class="item">
          <div class="induction-text">
            {{ fixedFromCoin ? 'Minimum Received' : ' Maximum Sold' }}
          </div>
          <div class="induction-value">
            {{
              fixedFromCoin
                ? fixD(Number(toCoinAmount) - (Number(toCoinAmount) * Number(slippage)) / 100, toCoin.decimals)
                : fixD((Number(fromCoinAmount) * Number(slippage)) / 100 + Number(fromCoinAmount), fromCoin.decimals)
            }}
            {{ fixedFromCoin ? toCoin.symbol : fromCoin.symbol }}
          </div>
        </div>
        <div class="item">
          <div class="induction-text">{{ $t('common.fee') }}</div>
          <div class="induction-value">{{ currentLP.fee }}%</div>
        </div>
      </div>
    </div>
    <a-button
      :disabled="
        !wallet.connected
          ? false
          : swaping ||
            !fromCoin ||
            !toCoin ||
            !Number(fromCoinAmount) ||
            !Number(toCoinAmount) ||
            Number(fromCoinAmount) > Number(fromCoin.balance) ||
            swapBtnText == 'Pool not found' ||
            swapBtnText !== $t('button.swap')
      "
      class="big-btn"
      @click="!wallet.connected ? wallet.setIsShowWalletModal(true) : (isSwapConfirmMpdal = true)"
    >
      <svg v-if="wallet.connected" class="icon" aria-hidden="true">
        <use xlink:href="#icon-icon-swap" />
      </svg>
      <span>{{ !wallet.connected ? $t('button.connectWallet') : swapBtnText }}</span>
    </a-button>
    <NetworkTips />

    <CoinSelect
      v-if="showCoinSelect"
      :existing-coins="existingCoins"
      :last-select-coin="lastSelectCoin"
      @onSelect="onCoinSelect"
      @onClose="showCoinSelect = false"
    ></CoinSelect>
    <Address v-if="isShowAddress" :from-coins="fromCoin" :to-coins="toCoin" @onClose="isShowAddress = false" />
    <SwapSetting v-if="isShowSwapSetting" @onClose="isShowSwapSetting = false" />
    <SwapConfirm
      v-if="isSwapConfirmMpdal"
      :fixed-from-coin="fixedFromCoin"
      :from-coin="fromCoin"
      :to-coin="toCoin"
      :from-coin-amount="fromCoinAmount"
      :to-coin-amount="toCoinAmount"
      :one-to-amount="oneToAmount"
      :one-from-amount="oneFromAmount"
      :rate-change="rateChange"
      :tokens="tokens"
      :impact="impact"
      :fee="0.4"
      @impact="onImpact()"
      @changeRateChange="rateChange = !rateChange"
      @update-amount="updateAmount"
      @on-close="isSwapConfirmMpdal = false"
      @to-swap="toSwap"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, computed, h, watchEffect, watch } from 'vue'
import importIcon from '@/utils/import-icon'
import { useIndexStore } from '../store'
import { getCurrentLP, prettyAmount } from '@/utils/tokens'
import { checkNullObj, decimalFormat, fixD } from '@/utils'
import useContract from '@/composables/useContract'
import { useLiquidityStore } from '@/store/liquidity'
import { useWalletStore } from '@/store/wallet'
import { debounce } from 'lodash-es'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '12px',
        color: '#fff',
        paddingBottom: '3px'
      },
      spin: true
    })
    const indexStore = useIndexStore()
    const index = computed(() => {
      return indexStore
    })
    const liquidityStore = useLiquidityStore()
    const liquidity = computed(() => {
      return liquidityStore
    })
    const contractStore = useContract()
    let change = ref(false)
    let refresh = ref(false)
    let isShowAddress = ref(false)
    let isShowSwapSetting = ref(false)
    let rateChange = ref(false)
    let isSwapConfirmMpdal = ref(false)
    const currentCoinKey = ref('fromCoin')
    const existingCoins = ref('')
    const lastSelectCoin = ref('')
    const showCoinSelect = ref(false)
    const fixedFromCoin = ref(true)
    const loading = ref(false)
    const swaping = ref(false)
    const fromCoinAmount = ref('')
    const toCoinAmount = ref('')
    const autoRefreshTime = ref(20)
    const countdown = ref(0)
    const marketTimer = ref(null as any)
    const slippage = computed(() => {
      return index.value.slippage
    })
    const lpTokens = ref({})
    const tokens = ref({})
    const fromCoin = ref<any>({})
    const toCoin = ref<any>({})
    const router = useRouter()
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

    watch(
      () => liquidity.value.lpTokens,
      newValue => {
        // newValue === oldValue
        console.log(newValue, '===>newVal')
        const tokens: any = liquidity.value.tokens
        const lpTokenList: any = Object.values(newValue)
        if (!checkNullObj(newValue)) {
          lpTokens.value = newValue
          if (tokens) {
            fromCoin.value = tokens[lpTokenList[0].coinA.symbol]
            toCoin.value = tokens[lpTokenList[0].coinB.symbol]
          }
        }
      },
      {
        immediate: true
      }
    )

    watch(
      () => [liquidity.value.tokens, liquidity.value.lpTokens],
      ([newTokens, newLpTokens]) => {
        if (newTokens && newLpTokens && !checkNullObj(newTokens) && !checkNullObj(newLpTokens)) {
          tokens.value = newTokens
          const lpTokenList: any = Object.values(newLpTokens)
          fromCoin.value = newTokens[lpTokenList[0].coinA.symbol]
          toCoin.value = newTokens[lpTokenList[0].coinB.symbol]
        }
      },
      {
        immediate: true
      }
    )
    // watchEffect(() => {
    //   if (!checkNullObj(liquidity.value.lpTokens) && !checkNullObj(liquidity.value.tokens)) {
    //     const lpTokenList: any = Object.values(liquidity.value.lpTokens)
    //     lpTokens.value = liquidity.value.lpTokens
    //     fromCoin.value = tokens.value[lpTokenList[0].coinA.symbol]
    //     toCoin.value = tokens.value[lpTokenList[0].coinB.symbol]
    //   }
    // })

    onMounted(async () => {
      setMarketTimer()

      if (router && router.currentRoute) {
        const cointo: any = router.currentRoute.value.query.to
        if (cointo) {
          toCoin.value = liquidity.value.tokens[cointo]
          currentCoinKey.value = 'toCoin'
          fromCoin.value = ''
        }
      }
    })

    const { t, locale } = useI18n()
    const currentLP = computed(() => {
      if (fromCoin.value && toCoin.value) {
        return getCurrentLP(fromCoin.value.symbol, toCoin.value.symbol, liquidity.value.lpTokens)
      } else {
        return ''
      }
    })

    const insufficientLiquidity = ref(false)

    const swapBtnText = computed(() => {
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
      if (!fromCoin.value || !toCoin.value) {
        return 'Select a token'
      }
      if (insufficientLiquidity.value) {
        return t('button.insufficientLiquidity')
      }
      if (fromCoin.value && toCoin.value) {
        const currentLp = getCurrentLP(fromCoin.value.symbol, toCoin.value.symbol, liquidity.value.lpTokens)
        if (!currentLp) return 'Pool not found'
      }
      if (!Number(fromCoinAmount.value) || Number(fromCoinAmount.value) == 0 || Number(toCoinAmount.value) == 0) {
        return t('button.enterAmount')
      }

      // if (
      //   (toCoinAmount.value && fromCoinAmount.value == 'InsufficientLiquidity') ||
      //   (fromCoinAmount.value && toCoinAmount.value == 'InsufficientLiquidity')
      // ) {
      // if (fromCoin.value && Number(fromCoinAmount.value) > fromCoin.value.balance) {
      if (wallet.value.assets) {
        const balance =
          wallet.value.assets && wallet.value.assets[fromCoin.value.address]
            ? wallet.value.assets[fromCoin.value.address] &&
              Number(prettyAmount(wallet.value.assets[fromCoin.value.address].balance, fromCoin.value.decimals))
            : 0
        if (fromCoin.value && Number(fromCoinAmount.value) > Number(balance)) {
          return t('button.insufficientBalance', {
            name: fromCoin.value.symbol
          })
        }
      }
      return t('button.swap')
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
    const maxBtnSelect = (key, balance: any) => {
      if (key === 'fromCoin') {
        fixedFromCoin.value = true
        fromCoinAmount.value = fromCoin.value.address === '0x2::sui::SUI' ? balance.value - 0.0001 : balance.value
      } else {
        fixedFromCoin.value = false
        toCoinAmount.value = toCoin.value.address === '0x2::sui::SUI' ? balance.value - 0.0001 : balance.value
      }
    }
    const clickRefresh = () => {
      countdown.value = 0
      refresh.value = true

      setTimeout(() => {
        refresh.value = false
        setMarketTimer()
      }, 1000)
    }
    const clickExchange = () => {
      const token = fromCoin.value
      fromCoin.value = toCoin.value
      toCoin.value = token
      change.value = true
      fixedFromCoin.value = !fixedFromCoin.value
      // console.log(fixedFromCoin.value, toCoinAmount.value, fromCoinAmount.value, 'fixedFromCoin.value')
      if (fixedFromCoin.value) {
        fromCoinAmount.value = toCoinAmount.value
        toCoinAmount.value = ''
      } else {
        toCoinAmount.value = fromCoinAmount.value
        fromCoinAmount.value = ''
      }
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
              // getAmount(fixedFromCoin.value ? fromCoinAmount.value : toCoinAmount.value)
            }
          }
        }
      }, 1000)
    }

    watch(
      fixedFromCoin,
      debounce((newVal, oldVal) => {
        fixedFromCoin.value = newVal
      }, 500)
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

    const getAmount = async val => {
      if (!fromCoinAmount.value && !toCoinAmount.value) return
      if (val !== '' && swapBtnText.value !== t('button.poolNotFound')) {
        try {
          const result = await contractStore.calculateRates({
            fromToken: tokens.value[fromCoin.value.symbol],
            toToken: tokens.value[toCoin.value.symbol],
            amount: val,
            interactiveToken: fixedFromCoin.value ? 'from' : 'to'
          })

          if (result !== 'InsufficientLiquidity') {
            insufficientLiquidity.value = false
            if (fixedFromCoin.value) {
              toCoinAmount.value = result
              onImpact()
              if (!rateChange.value) {
                oneToAmount.value = (Number(result) / val).toString()
              } else {
                oneFromAmount.value = (val / Number(result)).toString()
              }
            } else {
              fromCoinAmount.value = result
              onImpact()
              if (!rateChange.value) {
                oneToAmount.value = (val / Number(result)).toString()
              } else {
                oneFromAmount.value = (Number(result) / val).toString()
              }
            }
          } else {
            insufficientLiquidity.value = true
            oneToAmount.value = ''
            oneFromAmount.value = ''
            if (fixedFromCoin.value) {
              toCoinAmount.value = ''
            } else {
              fromCoinAmount.value = ''
            }
          }
        } catch (error) {
          console.log('testGetCoinXYForLiquidityerr', error)
        }
      } else {
        if (fixedFromCoin.value) {
          toCoinAmount.value = ''
        } else {
          fromCoinAmount.value = ''
        }
      }
    }

    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })

    const currentLpInfo = ref<any>({})
    const oneFromAmount = ref('')
    const oneToAmount = ref('')
    // fixedFromCoin
    watch(change, () => {
      oneFromAmount.value = ''
      oneToAmount.value = ''
      if (fixedFromCoin.value) {
        getAmount(fromCoinAmount.value)
      } else {
        getAmount(toCoinAmount.value)
      }
    })
    watch(rateChange, () => {
      oneFromAmount.value = ''
      oneToAmount.value = ''
      if (fixedFromCoin.value) {
        getAmount(fromCoinAmount.value)
      } else {
        getAmount(toCoinAmount.value)
      }
    })
    const impact = ref('')
    const onImpact = async () => {
      try {
        const result = await contractStore.calculatePriceImpact({
          fromToken: tokens.value[fromCoin.value.symbol],
          toToken: tokens.value[toCoin.value.symbol],
          fromAmount: fromCoinAmount.value,
          toAmount: toCoinAmount.value,
          interactiveToken: fixedFromCoin.value ? 'from' : 'to'
        })
        if (result !== 0) {
          impact.value = result
        } else {
          impact.value = '0'
        }
      } catch (error) {
        console.log(error, 'impactERR')
      }
    }

    const { setIsShowSuccess, setIsShowRejected, setIsShowWaiting, setTransactionDesc, setTransactionTxid } = indexStore
    const toSwap = async () => {
      isSwapConfirmMpdal.value = false
      swaping.value = true
      setTransactionTxid('')
      setTransactionDesc(
        t('tips.swapping', {
          from: `${fromCoinAmount.value} ${fromCoin.value?.symbol}`,
          to: `${toCoinAmount.value} ${toCoin.value?.symbol}`
        })
      )
      setIsShowWaiting(true)
      try {
        const payload = await contractStore.createSwapTransactionPayload({
          fromToken: tokens.value[fromCoin.value.symbol],
          toToken: tokens.value[toCoin.value.symbol],
          fromAmount: fromCoinAmount.value,
          toAmount: toCoinAmount.value,
          interactiveToken: fixedFromCoin.value ? 'from' : 'to',
          slippage: Number(index.value.slippage) / 100
        })

        let tx
        if (index.value.chainName !== 'Aptos') {
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
            title: t('tips.swap'),
            desc: t('tips.swapSuccessText', {
              from: `${fromCoinAmount.value} ${fromCoin.value?.symbol}`,
              to: `${toCoinAmount.value} ${toCoin.value?.symbol}`
            }),
            hash: tx.hash,
            descTransactions: `Swap ${fromCoinAmount.value} ${fromCoin.value?.symbol} for ${toCoinAmount.value} ${toCoin.value?.symbol}`,
            sender: wallet.value.address,
            chainName: index.value.chainName
          }
          contractStore.showTransitionPending(params)
          const transitionStatus = await contractStore.watchTransaction(params)
          if (transitionStatus) {
            setTimeout(() => {
              contractStore.getAccount(wallet.value.address)
            }, 1000)
          }
        } else {
          setIsShowWaiting(false)
          setIsShowRejected(true)
        }
        fromCoinAmount.value = ''
        toCoinAmount.value = ''
        swaping.value = false
      } catch (error) {
        console.log('toswap###error####', error)
        fromCoinAmount.value = ''
        toCoinAmount.value = ''
        swaping.value = false
        setIsShowWaiting(false)
        setIsShowRejected(true)
      }
    }

    const updateAmount = () => {
      getAmount(fixedFromCoin.value ? fromCoinAmount.value : toCoinAmount.value)
    }

    return {
      indicator,
      wallet,
      currentLpInfo,
      fixD,
      decimalFormat,
      impact,
      oneFromAmount,
      oneToAmount,
      onImpact,
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
      swapBtnText,
      toSwap,
      loading,
      swaping,
      autoRefreshTime,
      countdown,
      setMarketTimer,
      marketTimer,
      rateChange,
      isSwapConfirmMpdal,
      currentLP,
      t,
      tokens,
      updateAmount,
      insufficientLiquidity
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

.swap-container {
  width: 480px;
  .ant-spin-spinning {
    width: 14px !important;
    height: 14px !important;
    line-height: 10px !important;
    margin-right: 4px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    .left {
      font-size: 20px;
      color: @textActive;
    }
    // .right {
    //   display: flex;
    //   align-items: center;
    //   color: @textEffect;
    //   .slippage-icon {
    //     display: flex;
    //     align-items: center;
    //     &:hover {
    //       span {
    //         color: @textActive;
    //       }
    //       svg {
    //         fill: @textActive;
    //       }
    //     }
    //   }
    //   span {
    //     font-size: 12px;
    //     padding-top: 3px;
    //     margin: 0 16px 0 4px;
    //   }
    //   .information-icon {
    //     margin-right: 16px;
    //   }
    //   svg {
    //     width: 20px;
    //     height: 20px;
    //     fill: @textEffect;
    //     &:hover {
    //       fill: @textActive;
    //     }
    //   }
    // }
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
}
@media (max-width: 750px) {
  .swap-container {
    width: 100%;
  }
}
</style>
