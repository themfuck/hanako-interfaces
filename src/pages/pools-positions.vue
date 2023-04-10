<template>
  <div class="pools-container">
    <div class="title">
      <div class="left">
        <span>Concentrated Liquidity</span>
        <div class="position" @click="router.push('/position-list')">My Position</div>
      </div>
      <div class="right title-right">
        <span class="clear" @click="clearAll">Clear All</span>
        <div class="slippage-icon" @click="isShowSwapSetting = true">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-icon-setslippage" />
          </svg>
          <span>{{ slippage }}%</span>
        </div>
        <Refresh-Icon :loading="refresh" :auto-refresh-time="autoRefreshTime" :countdown="countdown" @clickRefresh="clickRefresh()" />
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="pools-card">
          <div class="first-card">
            <div class="top">
              <CoinPairName :from-coin="fromCoin" :to-coin="toCoin" />
              <!-- <div class="logo">
                <div class="img-box">
                  <img v-if="fromCoin" :src="fromCoin?.coinIcon || importIcon(`/image/coins/${fromCoin?.symbol.toLowerCase()}.png`)" />
                  <img v-if="toCoin" :src="toCoin?.coinIcon || importIcon(`/image/coins/${toCoin?.symbol.toLowerCase()}.png`)" />
                </div>
                <span v-show="!fromCoin || !toCoin" 6-=="coin-name">Select Pool</span>
                <span v-if="fromCoin && toCoin" class="coin-name">{{ fromCoin?.symbol }} - {{ toCoin?.symbol }}</span>
              </div> -->
              <div v-if="fromCoin && toCoin" class="toggle">
                <div :class="!direct ? 'item' : 'item active-item'" @click="!direct ? toggle() : ''">
                  {{ direct ? fromCoin?.symbol : toCoin?.symbol }}
                </div>
                <div :class="!direct ? 'item active-item' : 'item '" @click="direct ? toggle() : ''">
                  {{ direct ? toCoin?.symbol : fromCoin?.symbol }}
                </div>
              </div>
              <!-- <CoinTab :direct="direct"
               :form-coin-symbol="fromCoin.symbol"
               :to-coin-symbol="toCoin.symbol"
                @changeDirect="toggle()" /> -->
            </div>
            <a-input placeholder="Fee Tier" :value="inputValue" disabled />
            <div
              :class="clickClear || !fromCoin || !toCoin ? 'isEdit isEdit-noHover' : 'isEdit'"
              @click="clickClear || !fromCoin || !toCoin ? '' : (edit = !edit)"
            >
              {{ clickClear || !fromCoin || !toCoin ? 'Edit after selecting a pool' : edit ? 'Hide' : 'Edit' }}
            </div>
            <div v-if="edit" class="fee-container">
              <div
                v-for="(item, index) in feeTierList"
                :key="index"
                :class="inputValue.includes(item.label) ? 'fee-item fee-item-active' : 'fee-item'"
                @click="inputValue = item.label"
              >
                <p>{{ item.title }}</p>
                <span>{{ item.text }}</span>
                <img :src="importIcon(`/image/icon-check@2x.png`)" alt="" />
              </div>
            </div>
          </div>
          <div class="card-container">
            <div class="card-item">
              <Assets-Card
                v-model="fromCoinAmount"
                :input-value="fromCoinAmount"
                :coin-name="fromCoin ? fromCoin.symbol : null"
                :balance="fromCoin ? fromCoin.balance : null"
                :coin-icon="fromCoin ? fromCoin.icon : ''"
                :swap-direction="'From'"
                @onMax="maxBtnSelect('fromCoin')"
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
                :balance="toCoin ? toCoin.balance : null"
                :swap-direction="'To'"
                :coin-icon="toCoin ? toCoin.icon : ''"
                @onMax="maxBtnSelect('toCoin')"
                @onInput="amount => (toCoinAmount = amount)"
                @onFocus="
                  () => {
                    fixedFromCoin = false
                  }
                "
                @onSelect="openCoinSelect('toCoin')"
              />
            </div>
            <div v-if="unilateral" class="unilateral">
              <img :src="importIcon(`/image/img-lock@2x.png`)" alt="" />
              <p>The market price is outside your specified price range. Single-asset deposit only.</p>
            </div>
            <img v-if="!unilateral" class="add" src="../assets/image/icon-Add-Liquidity@2x.png" alt="" @click="toggle" />
          </div>
        </div>
        <a-button :disabled="!fromCoinAmount || clickClear" class="big-btn" @click="isShowLiquidityModal = true">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-add" />
          </svg>
          <span>{{ addLiquidityBtnText }}</span>
        </a-button>
      </div>
      <div class="right">
        <div class="title">
          <div class="titLeft">
            <p v-if="fromCoin && toCoin">Current Price</p>
            <div v-if="fromCoin && toCoin" class="coin">1 {{ fromCoin?.symbol }} ≈ 1.00035 {{ toCoin?.symbol }}</div>
          </div>
          <div v-if="fromCoin && toCoin" class="zoom">
            <div class="amplification"></div>
            <div class="narrow"></div>
          </div>
        </div>
        <div class="chart-img">
          <!-- <img v-if="!clickClear" src="../assets/image/chart.png" alt="" /> -->
          <img v-if="clickClear" class="noDataImg" src="../assets/image/img-no-data@2x.png" />
        </div>
        <div :class="clickClear ? 'set-price-mask' : ''"></div>
        <Set-Price
          :min="minPrice"
          :max="maxPrice"
          :from-coin="fromCoin"
          :to-coin="toCoin"
          :direction="direction"
          :invalid-price-range="invalidPriceRange"
          :default-min-price="defaultMinPrice"
          :default-max-price="defaultMaxPrice"
          @onChangeMinPrice="priceRangeChangeMin"
          @onChangeMaxPrice="priceRangeChangeMax"
        >
        </Set-Price>
        <div v-if="positionTips" class="position-tips">
          <img :src="importIcon(`/image/icon-tips@2x.png`)" alt="" />
          <p class="tips">Your position will not earn fees or be used in trades until the market price moves into your range.</p>
        </div>
        <div v-if="positionError" class="position-tips">
          <img :src="importIcon(`/image/icon-tips-error@2x.png`)" alt="" />
          <p class="error">The max price should be higher than min price.</p>
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
    <SwapSetting v-if="isShowSwapSetting" @onClose="isShowSwapSetting = false" />
    <AddLiquidity v-if="isShowLiquidityModal" @onClose="isShowLiquidityModal = false"></AddLiquidity>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useIndexStore } from '../store'
import importIcon from '@/utils/import-icon'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const store = useIndexStore()
    const autoRefreshTime = ref(20)
    const countdown = ref(0)
    const marketTimer = ref(null as any)
    const loading = ref(false)
    const isShowSwapSetting = ref(false)
    const unilateral = ref(false)
    const currentCoinKey = ref('fromCoin')
    const existingCoins = ref('')
    const lastSelectCoin = ref('')
    const showCoinSelect = ref(false)
    const direct = ref(true)
    const refresh = ref(false)
    const fixedFromCoin = ref(true)
    const direction = ref(true)
    const clickClear = ref(false)
    const fromCoinAmount = ref('')
    const toCoinAmount = ref('')
    const minPrice = ref('0.999')
    const maxPrice = ref('1.001')
    const defaultMinPrice = ref('0.999')
    const defaultMaxPrice = ref('1.001')
    const edit = ref(false)
    const positionTips = ref(false)
    const positionError = ref(false)
    const inputValue = ref('0.3% fee tier')
    const clickRefresh = () => {
      countdown.value = 0
      refresh.value = true
      setTimeout(() => {
        refresh.value = false
      }, 1000)
    }
    const invalidPriceRange = computed(() => {
      if (Number(minPrice.value) > Number(maxPrice.value)) {
        return true
      }
      return false
    })
    const feeTierList = computed(() => {
      return [
        { label: '0.05% fee tier', title: '0.05% fee', text: 'Best for stable pairs.' },
        { label: '0.3% fee tier', title: '0.3% fee', text: 'Best for most pairs.' },
        { label: '1% fee tier', title: '1% fee', text: 'Best for exotic pairs.' }
      ]
    })
    const slippage = computed(() => {
      return store.slippage
    })
    const addLiquidityBtnText = computed(() => {
      if (clickClear.value) {
        return 'Select a token'
      }
      if (!Number(fromCoinAmount.value)) {
        return 'Enter an amount'
      }
      return 'Add Liquidity'
    })
    const fromCoin = ref<any>({
      symbol: 'SOL',
      name: 'Wrapped SOL',
      mintAddress: '11111111111111111111111111111111',
      token_mint: '11111111111111111111111111111111',
      decimals: 9,
      decimal: 9,
      official: true,
      showDefault: true,
      balance: 111
    })
    const toCoin = ref<any>({
      symbol: 'USDC',
      name: 'USD Coin',
      token_mint: 'Ap4nbtHLUbUedzKQnEGu5EQcgfonVsCX3pWdZgKq8GwH',
      swap_token_account: 'BntG1ST8owGCUsWWuABwuDqdMVkC6LxXxdGbHzyhfRtr',
      decimal: 9,
      show_decimal: 4,
      icon: 'https://archive.crema.finance/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      balance: 777
    })
    onMounted(() => {
      setMarketTimer()
    })
    const priceRangeChangeMin = (value: string) => {
      minPrice.value = value
    }
    const priceRangeChangeMax = (value: string) => {
      maxPrice.value = value
    }
    const toggle = () => {
      const token = fromCoin.value
      fromCoin.value = toCoin.value
      toCoin.value = token
      direct.value = !direct.value
    }
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
      clickClear.value = false
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
    const maxBtnSelect = (key: string) => {
      if (key === 'fromCoin') {
        fixedFromCoin.value = true
        fromCoinAmount.value = fromCoin.value && fromCoin.value.balance
      } else {
        fixedFromCoin.value = false
        toCoinAmount.value = toCoin.value && toCoin.value.balance
      }
    }
    const setMarketTimer = () => {
      marketTimer.value = setInterval(() => {
        if (!loading.value) {
          if (countdown.value < autoRefreshTime.value) {
            countdown.value += 1

            if (countdown.value === autoRefreshTime.value) {
              countdown.value = 0
            }
          }
        }
      }, 1000)
    }

    const clearAll = () => {
      fromCoin.value = null
      toCoin.value = null
      minPrice.value = '0'
      maxPrice.value = '0'
      // currentCoinTab.value = ''
      // currentFeeTier.value = -1
      fromCoinAmount.value = ''
      toCoinAmount.value = ''
      clickClear.value = true
      inputValue.value = ''
      edit.value = false
    }

    const isShowLiquidityModal = ref(false)
    const router = useRouter()
    return {
      importIcon,
      refresh,
      addLiquidityBtnText,
      slippage,
      isShowSwapSetting,
      autoRefreshTime,
      countdown,
      setMarketTimer,
      marketTimer,
      loading,
      fromCoin,
      toCoin,
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
      isShowLiquidityModal,
      direct,
      toggle,
      edit,
      inputValue,
      feeTierList,
      minPrice,
      maxPrice,
      direction,
      invalidPriceRange,
      defaultMinPrice,
      defaultMaxPrice,
      priceRangeChangeMin,
      priceRangeChangeMax,
      unilateral,
      clearAll,
      clickClear,
      positionError,
      positionTips,
      router,
      clickRefresh
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.set-price-mask {
  width: 484px;
  height: 150px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10000;
  background-color: rgba(#121212, 0.9);
}
.pools-container {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    height: 20px;
    .left {
      font-size: 20px;
      color: @textActive;
      display: flex;
      align-items: center;
      .position {
        width: 118px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: url('../assets/image/btn-Default@2x.png');
        background-size: 100% 100%;
        margin-left: 20px;
        font-size: 14px;
        font-weight: 500;
        &:hover {
          background: url('../assets/image/btn-Hover@2x.png');
          background-size: 100% 100%;
        }
      }
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
    //     &:hover {
    //       color: @textActive;
    //     }
    //   }
    //   svg {
    //     width: 20px;
    //     height: 20px;
    //     fill: @textEffect;
    //   }
    // }
  }
  .content {
    display: flex;
    .left {
      margin-right: 8px;
      width: 480px;
      .pools-card {
        background: @cardDefault;
        .first-card {
          padding: 16px;
          width: 100%;
          background: @cardTop;
          position: relative;
          .top {
            display: flex;
            justify-content: space-between;
            align-content: center;
            // .logo {
            //   display: flex;
            //   align-content: center;
            //   img {
            //     width: 24px;
            //     height: 24px;
            //     &:nth-child(2) {
            //       margin-left: -5px;
            //     }
            //   }
            //   .coin-name {
            //     margin-left: 8px;
            //     font-size: 16px;
            //     font-weight: 500;
            //     color: #ffffff;
            //   }
            // }
            .toggle {
              display: flex;
              .item {
                width: 76px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                background: @buttonDetailDefault;
                font-size: 12px;
                font-weight: 500;
                color: @textDefault;
                border: 1px solid #333;
                border-radius: 0 !important;
                &:nth-child(1) {
                  border-right: 1px solid transparent;
                  border-radius: 0 !important;
                }
                &:nth-child(2) {
                  border-left: 1px solid transparent;
                  border-radius: 0 !important;
                }
              }
              .active-item {
                color: @textActive;
                border: 1px solid @borderDefault !important;
                border-radius: 0 !important;
              }
            }
          }
          .ant-input {
            margin-top: 12px;
            width: 100%;
            height: 40px;
            border: 1px solid @borderDefault !important;
            // padding-right: 100px;
          }
          .isEdit {
            width: 100%;
            height: 40px;
            font-weight: 500;
            color: @textDefault;
            position: absolute;
            top: 64px;
            right: 30px;
            text-align: right;
            &:hover {
              color: @textActive;
            }
          }
          .isEdit-noHover {
            &:hover {
              color: @textDefault;
            }
          }
          .fee-container {
            margin-top: 12px;
            display: flex;
            justify-content: space-between;
            .fee-item {
              padding: 16px 12px;
              border: 1px solid @borderDefault;
              position: relative;
              p {
                font-size: 14px;
                font-weight: 500;
                color: @textActive;
                margin-bottom: 0px;
              }
              span {
                font-size: 12px;
                font-weight: 400;
                color: @textDefault;
              }
              img {
                width: 24px;
                height: 24px;
                display: none;
                position: absolute;
                right: 0px;
                top: 0px;
              }
            }
            .fee-item-active {
              border: 1px solid @themeColor;
              img {
                display: block;
              }
            }
          }
        }
        .card-container {
          position: relative;
          .unilateral {
            width: 100%;
            height: 128px;
            padding: 16px;
            text-align: center;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid @borderDefault;
            backdrop-filter: blur(8px);
            position: absolute;
            bottom: 0;
            left: 0;
            img {
              height: 40px;
            }
            p {
              width: 310px;
              height: 40px;
              margin: auto;
              font-size: 12px;
              font-weight: 400;
              color: @textActive;
              line-height: 20px;
              margin-bottom: 0;
              margin-top: 16px;
            }
          }
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
      }
    }
    .right {
      background: #121212;
      padding: 16px;
      height: 100%;
      position: relative;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        .titLeft {
          display: flex;
          align-items: center;
          p {
            font-size: 14px;
            color: @textActive;
            margin-bottom: 0px;
          }
          .coin {
            font-size: 14px;
            font-weight: 500;
            color: @themeColor;
            margin-left: 5px;
          }
        }
        .zoom {
          display: flex;
          .amplification {
            width: 20px;
            height: 20px;
            background: url('../assets/image/icon-amplification-def@2x.png');
            background-size: 100% 100%;
            &:hover {
              background: url('../assets/image/icon-amplification-hover@2x.png');
              background-size: 100% 100%;
            }
            margin-right: 16px;
          }
          .narrow {
            width: 20px;
            height: 20px;
            background: url('../assets/image/icon-narrow-def@2x.png');
            background-size: 100% 100%;
            &:hover {
              background: url('../assets/image/icon-narrow-hover@2x.png');
              background-size: 100% 100%;
            }
          }
        }
      }
      .chart-img {
        width: 100%;
        height: 210px;
        position: relative;
        img {
          width: 100%;
          height: 210px;
        }
        .noDataImg {
          width: 116px;
          height: 116px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .position-tips {
        display: flex;
        align-items: center;
        margin-top: 12px;
        img {
          width: 16px;
          height: 16px;
        }
        p {
          font-size: 12px;
          font-weight: 400;
          color: @textTips;
          line-height: 20px;
          margin-bottom: 0;
          margin-left: 5px;
        }
        .error {
          color: @textWarning;
        }
      }
    }
  }
  .ant-btn {
    margin-top: 8px;
  }
}
@media (max-width: 750px) {
  .pools-container {
    width: 100%;
    .title {
      align-items: flex-end;
      display: unset;
      position: relative;
      .left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        span {
          font-size: 20px;
        }
        .position {
          margin-left: 0;
          margin-top: 12px;
        }
      }
      .right {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    .content {
      width: 100%;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      .left {
        width: 100%;
        margin-right: 0;
        .pools-card {
          .first-card {
            padding: 16px 8px;
            .fee-container {
              display: flex;
              flex-direction: column;
              .fee-item {
                // height: 52px;
                padding: 8px 12px;
                margin-top: 8px;
                &:nth-child(1) {
                  margin-top: 0px;
                }
                img {
                  position: absolute;
                  top: 50%;
                  right: 12px;
                  transform: translateY(-50%);
                }
              }
            }
          }
        }
      }
      .right {
        margin-top: 12px;
        width: 100%;
        height: 100%;
        padding: 15px 8px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
