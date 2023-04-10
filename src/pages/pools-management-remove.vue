<template>
  <div class="management-remove-liquidity">
    <Back />
    <div class="remove-liquidity-top">
      <div class="remove-title">{{ $t('common.removeLiquidity') }}</div>
      <div class="right title-right">
        <div class="slippage-icon" @click="isShowSwapSetting = true">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-icon-setslippage" />
          </svg>
          <span>{{ slippage }}%</span>
        </div>
        <svg aria-hidden="true" :class="refresh ? 'refresh refresh-icon ' : 'refresh-icon'" @click="clickRefresh">
          <use xlink:href="#icon-icon-refresh" />
        </svg>
      </div>
    </div>
    <div class="remove-liquidity-center">
      <!-- <div class="top">
        <CoinPairName v-if="currentPositionInfo" :from-coin="currentPositionInfo.token_a" :to-coin="currentPositionInfo.token_b" />
        <div class="coin-tab">
          <div @click="toAdd">Add</div>
          <div @click="toRemove">Remove</div>
        </div>
      </div> -->
      <div class="bottom">
        <div class="add-amount">
          <div class="add-amount-header">
            <span>{{ $t('common.amount') }}</span>
            <div class="amount-list">
              <div
                v-for="(item, index) in amountArr"
                :key="index"
                class="amount-item"
                :class="sliderVal == item.value ? 'amount-item-active' : ''"
                @click="sliderVal = item.value"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="slider-box">
            <a-input v-model:value="sliderVal" oninput="this.value = this.value.replace(/[^\d.]/g,'');" suffix="%" />
            <a-slider v-model:value="sliderVal"></a-slider>
          </div>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card-item">
        <Assets-Card
          v-model="fromCoinAmount"
          :has-arrow="false"
          :input-disabled="true"
          :havemax="false"
          :is-total="true"
          :input-value="addCommom(fromCoinAmount, fromCoin.decimals)"
          :coin-name="fromCoin ? fromCoin.symbol : null"
          :remove-balance="addCommom(currentLpInfo.myCoinXAmount, fromCoin.decimals) || null"
          :coin-icon="fromCoin ? fromCoin.logoURI : ''"
          :is-remove="true"
          :swap-direction="'From'"
          @onMax="maxBtnSelect('fromCoin')"
          @onInput="amount => (fromCoinAmount = amount)"
          @onFocus="
            () => {
              fixedFromCoin = true
            }
          "
        />
      </div>
      <div class="card-item">
        <Assets-Card
          v-model="toCoinAmount"
          :has-arrow="false"
          :havemax="false"
          :is-total="true"
          :input-disabled="true"
          :input-value="addCommom(toCoinAmount, toCoin.decimals)"
          :coin-name="toCoin ? toCoin.symbol : ''"
          :remove-balance="addCommom(currentLpInfo.myCoinYAmount, toCoin.decimals) || null"
          :swap-direction="'To'"
          :is-remove="true"
          :coin-icon="toCoin ? toCoin.logoURI : ''"
          @onMax="maxBtnSelect('toCoin')"
          @onInput="amount => (toCoinAmount = amount)"
          @onFocus="
            () => {
              fixedFromCoin = false
            }
          "
        />
      </div>
      <!-- <img class="add" src="../assets/image/icon-Add-Liquidity@2x.png" alt="" @click="clickExchange()" /> -->
    </div>
    <div class="induction remove-liquidity-bottom">
      <div class="item">
        <div class="induction-text">{{ $t('common.rate') }}</div>
        <div class="induction-value induction-value-change" @click="rateChange = !rateChange">
          <span v-if="!rateChange">
            1 {{ fromCoin && fromCoin.symbol }} ≈
            <span v-if="currentLpInfo.price">{{ decimalFormat(currentLpInfo.price, toCoin.decimals) }}</span>
            <template v-else>
              <a-spin :indicator="indicator" />
            </template>
            {{ toCoin && toCoin.symbol }}
          </span>
          <span v-else
            >1 {{ toCoin && toCoin.symbol }} ≈ {{ decimalFormat(String(1 / currentLpInfo.price), fromCoin.decimals) }}
            {{ fromCoin && fromCoin.symbol }}</span
          >
          <!-- <img :src="importIcon`/image/icon-change@2x.png`" alt="" /> -->
          <svg class="icon-change" aria-hidden="true">
            <use xlink:href="#icon-a-icon-change2" />
          </svg>
        </div>
      </div>
    </div>
    <a-button
      :disabled="!wallet.connected ? false : sliderVal == 0 || !fromCoinAmount || !toCoinAmount || loading"
      class="remove-btn big-btn"
      @click="!wallet.connected ? wallet.setIsShowWalletModal(true) : (isShowRemoveModal = true)"
    >
      <svg v-if="wallet.connected" aria-hidden="true">
        <use xlink:href="#icon-icon-Remove" />
      </svg>
      <span>{{ !wallet.connected ? 'Connect Wallet' : btnText }}</span>
    </a-button>
    <NetworkTips />

    <div v-if="wallet.connected" class="showMyLiquidity">
      <div class="myLiquidity">
        <div class="left">{{ $t('common.yourLiquidity') }}</div>
        <div v-if="currentLpInfo.myLpBalance" class="right">
          <p>{{ currentLpInfo.myLpBalance }} LP</p>
          <span>≈ ${{ addCommom(currentLpInfo.myBalanceUSD, 2) }}</span>
        </div>
        <template v-else>
          <a-spin :indicator="indicator" />
        </template>
      </div>
      <div class="liquidityAsset">
        <div class="item">
          <div v-if="fromCoin" class="left">
            <img :src="fromCoin.logoURI || importIcon(`/image/coins/${fromCoin.symbol.toLowerCase()}.png`)" alt="" />
            <span>{{ fromCoin.symbol }}</span>
            <span class="coin-name">{{ fromCoin?.name }}</span>
          </div>
          <div v-if="currentLpInfo.myCoinXAmount" class="right">{{ addCommom(currentLpInfo.myCoinXAmount, fromCoin.decimals) }}</div>
          <template v-else>
            <a-spin :indicator="indicator" />
          </template>
        </div>
        <div class="item">
          <div v-if="toCoin" class="left">
            <img :src="toCoin.logoURI || importIcon(`/image/coins/${toCoin.symbol.toLowerCase()}.png`)" alt="" />
            <span>{{ toCoin.symbol }}</span>
            <span class="coin-name">{{ toCoin?.name }}</span>
          </div>
          <div v-if="currentLpInfo.myCoinYAmount" class="right">{{ addCommom(currentLpInfo.myCoinYAmount, toCoin.decimals) }}</div>
          <template v-else>
            <a-spin :indicator="indicator" />
          </template>
        </div>
      </div>
      <div class="induction induction-liquidity">
        <div class="item">
          <div class="induction-text">{{ $t('common.shareOfPool') }}</div>
          <div v-if="currentLpInfo.myshareOfPool" class="induction-value">{{ currentLpInfo.myshareOfPool }} %</div>
          <template v-else>
            <a-spin :indicator="indicator" />
          </template>
        </div>
      </div>
    </div>
    <SwapSetting v-if="isShowSwapSetting" @onClose="isShowSwapSetting = false" />
    <ManagementRemoveConfirm
      v-if="isShowRemoveModal"
      :liquidity-balance="selectLp"
      :fixed-from-coin="fixedFromCoin"
      :from-coin="currentLpInfo.coinA"
      :to-coin="currentLpInfo.coinB"
      :from-coin-amount="addCommom(fromCoinAmount, fromCoin.decimals)"
      :to-coin-amount="addCommom(toCoinAmount, toCoin.decimals)"
      :burn-value="selectLpView"
      :current-lp-info="currentLpInfo"
      :loading="loading"
      @on-close="isShowRemoveModal = false"
      @to-remove="toRemove"
    />
    <RemoveDeposit
      v-if="isRemoveSuccessModal && isCmmHavePool"
      :from-coin="currentLpInfo.coinA"
      :to-coin="currentLpInfo.coinB"
      :fee="fee"
      @on-close="
        () => {
          isRemoveSuccessModal = false
          if (Number(sliderVal) == 100) {
            router.push('/pools')
          }
        }
      "
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed, watchEffect, watch, onMounted } from 'vue'
import importIcon from '@/utils/import-icon'
import { useLiquidityStore } from '@/store/liquidity'
import { useWalletStore } from '../store/wallet'
import { useIndexStore } from '../store'
import { prettyAmount, getCurrentLP } from '@/utils/tokens'
import { fixD, decimalFormat, addCommom, checkNullObj } from '@/utils'
import { useRouter } from 'vue-router'
import useContract from '@/composables/useContract'
import { d } from 'test-cetus-sdk/dist/utils/numbers'
import { debounce } from 'lodash-es'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#app'

definePageMeta({
  middleware: ['detail']
})
export default defineComponent({
  setup(props, ctx) {
    const { t, locale } = useI18n()
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '12px',
        color: '#fff',
        paddingBottom: '3px'
      },
      spin: true
    })
    const router = useRouter()
    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })
    const liquidityStore = useLiquidityStore()
    const liquidity = computed(() => {
      return liquidityStore
    })

    let isShowSwapSetting = ref(false)
    let isShowRemoveModal = ref(false)
    let isRemoveSuccessModal = ref(false)
    let isCmmHavePool = ref(false)
    let rateChange = ref(false)
    let change = ref(false)
    const refresh = ref(false)
    const fixedFromCoin = ref(true)
    const direct = ref(true)
    const fromCoinAmount = ref('')
    const toCoinAmount = ref('')
    const sliderVal = ref('50')
    const lpTokens = ref({})
    const tokens = ref({})
    watchEffect(() => {
      if (!checkNullObj(liquidity.value.lpTokens)) {
        lpTokens.value = liquidity.value.lpTokens
      }
    })
    const indexStore = useIndexStore()
    const index = computed(() => {
      return indexStore
    })
    const slippage = computed(() => {
      return index.value.slippage
    })
    const fromCoin = ref<any>()
    const toCoin = ref<any>()
    // watchEffect(() => {
    //   if (!checkNullObj(liquidity.value.tokens)) {
    //     tokens.value = liquidity.value.tokens
    //     fromCoin.value = tokens.value[router.currentRoute.value.query.from]
    //     toCoin.value = tokens.value[router.currentRoute.value.query.to]
    //   }
    // })

    const currentLpInfo = ref<any>({})
    const selectLp = ref('')
    const selectLpView = ref('')
    const btnText = computed(() => {
      if (!Number(fromCoinAmount.value)) {
        return t('button.enterAmount')
      }
      // if (fromCoin.value && fromCoin.value && Number(fromCoinAmount.value) > fromCoin.value.balance) {
      //   return 'Insufficient balance'
      // }
      return t('button.remove')
    })

    watch(
      () => [index.value.chainName, liquidity.value.lpTokens],
      ([newChainName, newLpTokens]) => {
        if (newChainName && !checkNullObj(newLpTokens)) {
          fromCoin.value = liquidityStore.tokens[router.currentRoute.value.query.from]
          toCoin.value = liquidityStore.tokens[router.currentRoute.value.query.to]
        }
      },
      {
        immediate: true
      }
    )

    const clickRefresh = () => {
      refresh.value = true
      setTimeout(() => {
        refresh.value = false
      }, 1000)
      if (wallet.value.address) {
        liquidityStore.setMyLplist(wallet.value.address)
      }
    }
    const amountArr = [
      {
        name: '25%',
        value: 25
      },
      {
        name: '50%',
        value: 50
      },
      {
        name: '75%',
        value: 75
      },
      {
        name: t('button.max'),
        value: 100
      }
    ]
    const clickExchange = () => {
      const token = fromCoin.value
      fromCoin.value = toCoin.value
      toCoin.value = token
      change.value = true
      setTimeout(() => {
        change.value = false
      }, 300)
    }
    const maxBtnSelect = (key: string) => {
      if (key === 'fromCoin') {
        fixedFromCoin.value = true
        fromCoinAmount.value = (fromCoin.value && decimalFormat(fromCoin.value.balance, currentLpInfo.value.coinA.value.decimals)) || ''
      } else {
        fixedFromCoin.value = false
        toCoinAmount.value = (toCoin.value && decimalFormat(toCoin.value.balance, currentLpInfo.value.coinB.value.decimals)) || ''
      }
    }
    const contractStore = useContract()
    // const antiShake = (val: string, time: number) => {
    //   const p = Number(val) / 100
    //   return setTimeout(() => {
    //     if (val === '100') {
    //       getAmount(currentLpInfo.value.balanceOrigin)
    //     } else {
    //       getAmount(d(currentLpInfo.value.balanceOrigin).mul(p).toString())
    //     }
    //   }, time)
    // }
    // watchEffect(onInvalidate => {
    //   const timer = antiShake(sliderVal.value, 500)
    //   onInvalidate(() => clearTimeout(timer))
    // })
    watch(
      sliderVal,
      debounce((newVal, oldVal) => {
        sliderVal.value = newVal
        if (newVal == 0) {
          fromCoinAmount.value = '0'
          toCoinAmount.value = '0'
        } else {
          if (newVal > 100) {
            sliderVal.value = '100'
          }
          if (newVal !== oldVal) {
            const p = Number(sliderVal.value) / 100
            if (sliderVal.value === '100') {
              getAmount(currentLpInfo.value.balanceOrigin)
            } else {
              getAmount(d(currentLpInfo.value.balanceOrigin).mul(p).toString())
            }
          }
        }
      }, 500)
    )
    const fee = ref('')
    watch(currentLpInfo, () => {
      if (currentLpInfo.value) {
        const result: any = liquidityStore.cmmLpTokens.filter((ele: any) => {
          return ele.coinA.address == currentLpInfo.value.coinA.address && ele.coinB.address == currentLpInfo.value.coinB.address
        })
        if (result.length > 0) {
          fee.value = result[0].fee
          isCmmHavePool.value = true
        }
        getAmount(
          d(currentLpInfo.value.balanceOrigin)
            .mul(Number(sliderVal.value) / 100)
            .toString()
        )
      }
    })
    const getAmount = async val => {
      if (!fromCoin.value || !toCoin.value) return
      const currentLP: any = getCurrentLP(fromCoin.value.symbol, toCoin.value.symbol, liquidityStore.lpTokens)
      selectLp.value = val
      selectLpView.value = decimalFormat(d(val).div(Math.pow(10, currentLP.decimals)).toString(), currentLP.decimals) || ''
      if (val !== '' && val !== 0 && val !== '0') {
        let params: any = {
          coinX: currentLP.coinA,
          coinY: currentLP.coinB,
          liquidity: val
        }
        if (params) {
          try {
            const result = await contractStore.getCoinXYForLiquidity(params)
            fromCoinAmount.value = decimalFormat(result.coinXAmount, currentLpInfo.value.coinA.decimals) || ''
            toCoinAmount.value = decimalFormat(result.coinYAmount, currentLpInfo.value.coinB.decimals) || ''
          } catch (error) {
            console.log('testGetCoinXYForLiquidityerr', error)
          }
        }
      } else {
        toCoinAmount.value = ''
        fromCoinAmount.value = ''
      }
    }
    const loading = ref(false)
    const { $notify } = useNuxtApp()
    const { setIsShowSuccess, setIsShowRejected, setIsShowWaiting, setTransactionDesc, setTransactionTxid } = indexStore
    const toRemove = async () => {
      if (
        Number(addCommom(fromCoinAmount.value, fromCoin.value.decimals)) <= 0 ||
        Number(addCommom(toCoinAmount.value, toCoin.value.decimals)) <= 0
      ) {
        $notify.error({
          icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-a-icon-Shutdown' })]),
          message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: 'Error' }, null)]),
          description: 'This transaction would fail',
          duration: 4.5,
          class: 'ant-notification-copy ant-notification-error'
        })
      } else {
        isShowRemoveModal.value = false
        loading.value = true
        setTransactionTxid('')
        setTransactionDesc(
          t('tips.removeLiquidiyText', {
            from: `${addCommom(fromCoinAmount.value, fromCoin.value.decimals)} ${currentLpInfo.value.coinA.symbol}`,
            to: `${addCommom(toCoinAmount.value, toCoin.value.decimals)} ${currentLpInfo.value.coinB.symbol}`
          })
        )
        setIsShowWaiting(true)
        try {
          const params: any = ref({})
          params.value = {
            // coinX: tokens.value[currentLpInfo.value.coinA.symbol],
            // coinY: tokens.value[currentLpInfo.value.coinB.symbol],
            coinX: currentLpInfo.value.coinA,
            coinY: currentLpInfo.value.coinB,
            liquidity: parseInt(selectLp.value),
            slippage: Number(index.value.slippage) / 100
          }
          const payload = await contractStore.removeLiquidityTransactionPayload(params.value)

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
              title: t('common.removeLiquidity'),
              desc: t('tips.removeSuccessText', {
                from: `${addCommom(fromCoinAmount.value, fromCoin.value.decimals)} ${currentLpInfo.value.coinA.symbol}`,
                to: `${addCommom(toCoinAmount.value, toCoin.value.decimals)} ${currentLpInfo.value.coinB.symbol}`
              }),
              hash: tx.hash,
              descTransactions: `Remove ${fromCoinAmount.value} ${fromCoin.value?.symbol} and ${toCoinAmount.value} ${toCoin.value?.symbol} 
             from the pool`,
              sender: wallet.value.address,
              chainName: index.value.chainName
            }
            contractStore.showTransitionPending(params)
            const transitionStatus = await contractStore.watchTransaction(params)
            if (transitionStatus) {
              if (isCmmHavePool.value) {
                setIsShowSuccess(false)
                isRemoveSuccessModal.value = true
              } else {
                if (Number(sliderVal.value) == 100) {
                  router.push('/pools')
                }
                setTimeout(() => {
                  liquidityStore.setMyLplist(wallet.value.address)
                }, 3000)
                setTimeout(() => {
                  liquidityStore.setMyLplist(wallet.value.address)
                }, 6000)
              }
            }
          } else {
            setIsShowWaiting(false)
            setIsShowRejected(true)
          }
          loading.value = false
        } catch (error) {
          console.log('Remove error', error)
          loading.value = false
          setIsShowWaiting(false)
          setIsShowRejected(true)
        }
      }
    }

    watch(
      () => [wallet.value.address, liquidity.value.lpTokens],
      ([newAddress, newLpTokens]) => {
        if (!checkNullObj(newLpTokens)) {
          liquidityStore.setMyLplist(newAddress)
        }
      },
      {
        immediate: true
      }
    )

    watch(
      () => [liquidity.value.myLplist, wallet.value.address],
      ([newMyList, newWalletAddress]) => {
        if (newMyList && wallet.value.address) {
          const list: any = newMyList
          const coinfrom: any = router.currentRoute.value.query.from
          const cointo: any = router.currentRoute.value.query.to
          let currentLP
          if (coinfrom && cointo) {
            currentLP = getCurrentLP(coinfrom, cointo, newMyList)
          }
          if (currentLP) {
            if (!currentLP.balance || !Number(currentLP.balance)) {
              router.push('/pools')
              return
            }
            const info = list.filter((item: any) => item.symbol === currentLP.symbol)[0]
            if (info) {
              currentLpInfo.value = info
            }
          }
        }
      },
      {
        immediate: true
      }
    )

    return {
      fee,
      isRemoveSuccessModal,
      isCmmHavePool,
      loading,
      indicator,
      addCommom,
      fixD,
      decimalFormat,
      prettyAmount,
      liquidity,
      clickExchange,
      change,
      fixedFromCoin,
      router,
      wallet,
      refresh,
      amountArr,
      sliderVal,
      slippage,
      importIcon,
      clickRefresh,
      isShowSwapSetting,
      fromCoin,
      toCoin,
      maxBtnSelect,
      fromCoinAmount,
      toCoinAmount,
      direct,
      rateChange,
      isShowRemoveModal,
      btnText,
      currentLpInfo,
      selectLp,
      selectLpView,
      toRemove
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.management-remove-liquidity {
  width: 480px;
  .ant-spin-spinning {
    width: 14px !important;
    height: 14px !important;
    line-height: 10px !important;
    margin-right: 4px;
  }
  .back {
    svg {
      width: 20px;
      height: 20px;
      fill: @textActive;
    }
  }
  .refresh-icon {
    &:hover {
      fill: @textActive;
    }
  }
  .remove-liquidity-top {
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .remove-title {
      font-size: 20px;
      font-weight: 500;
      color: @textActive;
    }
  }
  .remove-liquidity-center {
    margin-top: 12px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 16px;
      background: @cardTop;
      .coin-tab {
        width: 152px;
        height: 28px;
        background: @cardEmphasize;
        display: flex;
        align-items: center;
        // margin-left: 20px;
        div {
          border: 1px solid #333;
          width: 50%;
          color: @textDefault;
          height: 100%;
          display: flex;
          padding: 6px 21px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          border-radius: 0 !important;
          &:nth-child(1) {
            border-right: none;
          }
          &:nth-child(2) {
            background: @buttonDetailDefault;
            border: 1px solid @borderDefault !important;
            color: @textActive;
            border-radius: 0 !important;
          }
        }
      }
    }
    .bottom {
      padding: 12px 16px 30px;
      background: #121212;
      .add-amount {
        .add-amount-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          span {
            font-size: 16px;
            font-weight: 500;
            color: @textActive;
          }
          .amount-list {
            display: flex;
            align-items: center;
            .amount-item {
              width: 64px;
              height: 32px;
              border: 1px solid #333;
              text-align: center;
              line-height: 32px;
              font-size: 12px;
              color: @textDefault;
              border-right: 1px solid transparent;
              &:nth-last-child(1) {
                border-right: 1px solid #333;
              }
            }
            .amount-item-active {
              color: @textActive;
              background: @buttonDetailDefault;
              border: 1px solid @borderDefault !important;
            }
          }
        }
        .slider-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: @themeColor;
          margin-top: 16px;
          display: flex;
          .ant-input-affix-wrapper {
            display: flex;
            width: 100px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: @cardEnter !important;
            margin-right: 10px;
          }
          .ant-slider {
            width: 336px;
            margin: 10px 0 10px 10px;
          }
        }
      }
    }
  }
  .card-container {
    position: relative;
    .add {
      width: 36px;
      height: 36px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -18px;
      margin-left: -18px;
    }
  }
  .remove-btn {
    svg {
      transform: rotate(180deg);
    }
  }
  .remove-liquidity-bottom {
    // background: #121212;
    margin: 0px 0 8px;
    .liquidity-item {
      margin-top: -10px !important;
    }
  }
  .induction-liquidity {
    // background: @cardEmphasize;
    background: #121212 !important;
    // margin-top: 8px;
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
  .management-remove-liquidity {
    width: 100%;
    .remove-liquidity-center {
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 8px;
      }
      .bottom {
        padding: 12px 8px;
        .add-amount {
          .add-amount-header {
            .amount-list {
              .amount-item {
                width: 50px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
