<template>
  <div class="increase-liquidity-container">
    <div class="back-title">
      <Back />
      <div class="title">
        <p>{{ $t('common.increaseLiquidity') }}</p>
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
          <!-- <Refresh-Icon
           :loading="refresh"
            :auto-refresh-time="autoRefreshTime"
             :countdown="countdown"
              @clickRefresh="clickRefresh()" /> -->
        </div>
      </div>
    </div>
    <div class="price-range">
      <div class="price-range-header">
        <div class="left">
          <!-- <div v-if="!direct" class="img-box">
            <img v-if="positionInfo.token_a.symbol" :src="importIcon(`/image/coins/${positionInfo.token_a.symbol?.toLowerCase()}.png`)" />
            <img v-if="positionInfo.token_b.symbol" :src="importIcon(`/image/coins/${positionInfo.token_b.symbol.toLowerCase()}.png`)" />
          </div>
          <div v-else class="img-box">
            <img v-if="positionInfo.token_b.symbol" :src="importIcon(`/image/coins/${positionInfo.token_b.symbol?.toLowerCase()}.png`)" />
            <img v-if="positionInfo.token_a.symbol" :src="importIcon(`/image/coins/${positionInfo.token_a.symbol.toLowerCase()}.png`)" />
          </div>
          <span v-if="!direct"> {{ positionInfo.token_a.symbol }} - {{ positionInfo.token_b.symbol }} </span>
          <span v-else> {{ positionInfo.token_a.symbol }} - {{ positionInfo.token_b.symbol }} </span> -->
          <CoinPairName :from-coin="positionInfo.token_a" :to-coin="positionInfo.token_b" />
          <StatusBlock :current-status="positionInfo.currentStatus"></StatusBlock>
        </div>
        <div class="right">
          <!-- <div class="coin-tab">
            <div :class="direct ? 'active' : ''" @click="changeDirect(true)">
              {{ positionInfo.token_a.symbol }}
            </div>
            <div :class="!direct ? 'active' : ''" @click="changeDirect(false)">
              {{ positionInfo.token_b.symbol }}
            </div>
          </div> -->
          <div class="fee">0.3%</div>
        </div>
      </div>
      <div class="price-range-footer">
        <!-- <div class="induction">
          <div class="item">
            <div class="induction-text">{{ positionInfo.token_a.symbol }}</div>
            <div class="induction-value">
              {{ positionInfo.fromCoinAmount }}
            </div>
          </div>
          <div class="item">
            <div class="induction-text">{{ positionInfo.token_b.symbol }}</div>
            <div class="induction-value">{{ positionInfo.toCoinAmount }}</div>
          </div>
          <div class="item">
            <div class="induction-text">Fee Tier</div>
            <div class="induction-value">{{ positionInfo.feeView }}%</div>
          </div>
        </div> -->
        <div class="select-range">
          <p>{{ $t('common.selectedRange') }}</p>
          <div class="range-bottom">
            <div v-if="direct" class="price">
              1 {{ positionInfo.token_a.symbol }} ≈
              {{ fixD(positionInfo.currentPrice, positionInfo.token_b.decimal) }}
              {{ positionInfo.token_b.symbol }}
            </div>
            <div v-else class="price">
              1 {{ positionInfo.token_b.symbol }} ≈
              {{ fixD(1 / positionInfo.currentPrice, positionInfo.token_b.decimal) }}
              {{ positionInfo.token_a.symbol }}
            </div>
            <CoinTab
              :direct="direct"
              :form-coin-symbol="positionInfo.token_a.symbol"
              :to-coin-symbol="positionInfo.token_b.symbol"
              @changeDirect="val => (direct = val)"
            />
          </div>
        </div>
        <div class="price-range-block">
          <div class="price-item">
            <div class="title">Min Price</div>
            <p v-if="direct" class="price">
              {{ decimalFormat(positionInfo.minPrice, 6) }}
            </p>
            <p v-else class="price">
              {{ decimalFormat(1 / positionInfo.maxPrice, 6) }}
            </p>
            <div v-if="!direct" class="text">
              {{ positionInfo.token_a.symbol }} per
              {{ positionInfo.token_b.symbol }}
            </div>
            <div v-else class="text">
              {{ positionInfo.token_b.symbol }} per
              {{ positionInfo.token_a.symbol }}
            </div>
          </div>
          <div class="price-item">
            <div class="title">Max Price</div>
            <p v-if="direct" class="price">
              {{ positionInfo.maxPrice.indexOf('∞') > -1 ? '∞' : decimalFormat(positionInfo.maxPrice, 6) }}
            </p>
            <p v-else class="price">
              {{ positionInfo.maxPrice.indexOf('∞') > -1 ? '∞' : decimalFormat(1 / positionInfo.minPrice, 6) }}
            </p>
            <div v-if="!direct" class="text">
              {{ positionInfo.token_a.symbol }} per
              {{ positionInfo.token_b.symbol }}
            </div>
            <div v-else class="text">
              {{ positionInfo.token_b.symbol }} per
              {{ positionInfo.token_a.symbol }}
            </div>
          </div>
        </div>
        <div class="text-block">
          <div class="note">
            Your position will be 100% composed of
            {{ positionInfo.token_a.symbol }} at this price
          </div>

          <div class="note">
            Your position will be 100% composed of
            {{ positionInfo.token_b.symbol }} at this price
          </div>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card-item">
        <Assets-Card
          v-model="fromCoinAmount"
          :has-arrow="false"
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
          :has-arrow="false"
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
    </div>
    <div class="induction remove-liquidity-bottom">
      <div class="item">
        <div class="induction-text">Liquidity</div>
        <div class="induction-value">26.42 USDC → 23.172 USDC</div>
      </div>
      <div class="item">
        <div class="induction-text"></div>
        <div class="induction-value">0.02403 USDT → 0.00821 USDT</div>
      </div>
    </div>
    <a-button :disabled="!fromCoinAmount" class="big-btn" @click="isShowLiquidityModal = true">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-icon-add" />
      </svg>
      <span>{{ addLiquidityBtnText }}</span>
    </a-button>
    <CoinSelect
      v-if="showCoinSelect"
      :existing-coins="existingCoins"
      :last-select-coin="lastSelectCoin"
      @onSelect="onCoinSelect"
      @onClose="showCoinSelect = false"
    ></CoinSelect>
    <SwapSetting v-if="isShowSwapSetting" @onClose="isShowSwapSetting = false" />
    <AddLiquidity v-if="isShowLiquidityModal" :is-increase="true" @onClose="isShowLiquidityModal = false"></AddLiquidity>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { fixD, decimalFormat } from '@/utils/index'
import { useIndexStore } from '../store'
import importIcon from '@/utils/import-icon'

export default defineComponent({
  setup() {
    const store = useIndexStore()
    const autoRefreshTime = ref(20)
    const countdown = ref(0)
    const marketTimer = ref(null as any)
    let refresh = ref(false)
    const loading = ref(false)
    const currentCoinKey = ref('fromCoin')
    const existingCoins = ref('')
    const lastSelectCoin = ref('')
    const showCoinSelect = ref(false)
    const change = ref(false)
    const fixedFromCoin = ref(true)
    const fromCoinAmount = ref('')
    const toCoinAmount = ref('')
    const isShowLiquidityModal = ref(false)
    const isShowSwapSetting = ref(false)
    const slippage = computed(() => {
      return store.slippage
    })
    const addLiquidityBtnText = computed(() => {
      if (!Number(fromCoinAmount.value)) {
        return 'Enter an amount'
      }
      return 'Add More Liquidity'
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
    const positionInfo = reactive({
      name: 'CUSDT-CUSDC',
      fee: '0.0001',
      swap_account: '6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR',
      token_a: {
        symbol: 'CUSDT',
        name: 'CUSDT',
        token_mint: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
        swap_token_account: 'EPyDSacqb9PH4SoXFov21VPnVSdMBw4N4aQurC89k8ei',
        decimal: 8,
        show_decimal: 4,
        calculate_decimal: 6
      },
      token_b: {
        symbol: 'CUSDC',
        name: 'CUSDC',
        token_mint: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
        swap_token_account: 'EDSWfuCTcCNXM5WeMZntLkQUjZuXeCp6mEKe5FbEXNX',
        decimal: 8,
        show_decimal: 4,
        calculate_decimal: 6
      },
      price_interval: { lower_price: '0.995', upper_price: '1.0004' },
      version: 2,
      tokenSwapKey: '6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR',
      accountType: 0,
      isInitialized: 1,
      nonce: 255,
      tokenProgramId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      manager: 'AYKFAKqx6ZWWC6Hkr4Csj3AcwLxCyLpq1tRk5TRWwqyz',
      managerTokenA: 'FQEcvmkiiP95pkJ1s17qe6P5nGZtXFph45eeSggmQRni',
      managerTokenB: 'Ch5BksXMFLGQ6CcL2dD8MACy1JsNAr5bQWfqKS5DEFTJ',
      swapTokenA: 'EPyDSacqb9PH4SoXFov21VPnVSdMBw4N4aQurC89k8ei',
      swapTokenB: 'EDSWfuCTcCNXM5WeMZntLkQUjZuXeCp6mEKe5FbEXNX',
      tokenAMint: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
      tokenBMint: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
      ticksKey: '25SMMLkn91997idMeyHSQCKHLdyAK5xgc2xy9y1ErrRL',
      positionsKey: 'CeLGR1idhpsdym3LFm9oodFa5fkWSmGjJ1CW9SGyfzvD',
      curveType: 0,
      managerFee: '0.00002',
      tickSpace: 1,
      currentSqrtPrice: '0.999768630519',
      currentLiquity: '246658087861075202',
      feeGrowthGlobal0: '0.0000133953863346',
      feeGrowthGlobal1: '0.0000126495577595',
      managerFeeA: '782334664',
      managerFeeB: '408082167',
      feeView: 0.01,
      currentPriceView: 0.9995373145698367,
      currentPriceViewReverse: '1.000462899607067',
      index: '58',
      positionId: '3XLR74hZpFVGKMNwoedHccq99LR5wP3gmSueSW6pjSks',
      lowerTick: -50,
      upperTick: 4,
      liquity: '232423209336',
      feeGrowthInsideALast: '0.0000133914429271',
      feeGrowthInsideBLast: '0.0000126457075474',
      tokenAFee: '0',
      tokenBFee: '0',
      minPrice: '0.99501272792',
      maxPrice: '1.00040006000',
      nftTokenAccount: '7TNUCpcZfFoTNDPynwGHRpjuvZAz9sYAeoxz2JteioxF',
      nftTokenMint: '3XLR74hZpFVGKMNwoedHccq99LR5wP3gmSueSW6pjSks',
      nftTokenId: '3XLR74hZpFVGKMNwoedHccq99LR5wP3gmSueSW6pjSks',
      fromCoinAmount: '1.00265752',
      toCoinAmount: '5.26527690',
      tokenaFee: '0.0000091653942686965242',
      tokenbFee: '0.000008948786529063001656',
      amountUSD: '6.2674',
      feeUSD: '0.00001810994010336969776027693945159814',
      currentStatus: 'Active',
      id: '3XLR74hZpFVGKMNwoedHccq99LR5wP3gmSueSW6pjSks',
      fromPercent: 16,
      toPercent: 84
    })
    onMounted(() => {
      setMarketTimer()
    })
    const direct = ref(true)
    function changeDirect(value: boolean) {
      direct.value = value
    }
    const clickRefresh = () => {
      countdown.value = 0
      refresh.value = true
      setTimeout(() => {
        refresh.value = false
      }, 1000)
    }
    const toggle = () => {
      const token = fromCoin.value
      fromCoin.value = toCoin.value
      toCoin.value = token
      change.value = !change.value
    }
    const openCoinSelect = (key: string) => {
      currentCoinKey.value = key
      if (key === 'fromCoin') {
        existingCoins.value = toCoin?.symbol || ''
        lastSelectCoin.value = fromCoin?.symbol || ''
      } else {
        existingCoins.value = fromCoin?.symbol || ''
        lastSelectCoin.value = toCoin?.symbol || ''
      }
      showCoinSelect.value = true
    }
    const onCoinSelect = token => {
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
        fromCoinAmount.value = fromCoin && fromCoin.value.balance
      } else {
        fixedFromCoin.value = false
        toCoinAmount.value = toCoin && toCoin.value.balance
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
    return {
      importIcon,
      changeDirect,
      fixD,
      decimalFormat,
      direct,
      positionInfo,
      clickRefresh,
      refresh,
      autoRefreshTime,
      countdown,
      setMarketTimer,
      marketTimer,
      loading,
      slippage,
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
      change,
      toggle,
      addLiquidityBtnText,
      isShowLiquidityModal,
      isShowSwapSetting
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.increase-liquidity-container {
  width: 480px;
  height: 100%;
  .back-title {
    .back-icon {
      width: 20px;
      height: 20px;
      fill: @textActive;
    }
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 12px 0;
      p {
        font-size: 20px;
        font-weight: 500;
        color: @textActive;
        margin-bottom: 0;
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
      //   svg {
      //     width: 20px;
      //     height: 20px;
      //     fill: @textEffect;
      //   }
      // }
    }
  }
  .price-range {
    margin-top: 8px;
    .price-range-header {
      padding: 18px 20px;
      background: @cardTop;
      display: flex;
      justify-content: space-between;
      line-height: 1;
      .left {
        display: flex;
        align-items: center;
        > div {
          margin-right: 8px;
        }
        span {
          color: @textActive;
          font-size: 16px;
          font-weight: 500;
        }
        .data-block-status {
          margin-left: 4px;
        }
        // .img-box {
        //   margin-right: 8px;
        //   img {
        //     width: 24px;
        //     height: 24px;
        //     &:nth-child(2) {
        //       margin-left: -5px;
        //     }
        //   }
        // }
      }
      .right {
        .fee {
          padding: 2px 8px;
          background: rgba(#fff, 0.1);
          color: @textActive;
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
    .price-range-footer {
      background: #121212;
      padding: 0 20px;
      padding-top: 1px;
      .induction {
        background: #121212;
        padding: 0;
        padding-top: 16px;
      }
      .select-range {
        font-size: 16px;
        font-weight: 500;
        color: @textActive;
        margin-top: 12px;
        justify-content: space-between;
        align-items: center;
        p {
          margin-bottom: 0;
        }
        .range-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          .price {
            font-size: 14px;
            font-weight: 500;
            color: @themeColor;
          }
        }
      }
    }
  }
  .card-container {
    margin: 8px 0 0;
  }
  .ant-btn {
    margin-top: 8px;
  }
}
@media (max-width: 750px) {
  .increase-liquidity-container {
    width: 100%;
    .price-range {
      .price-range-header {
        // position: relative;
        padding: 18px 8px;
        display: flex;
        .left {
          width: 100%;
          display: flex;
          // justify-content: space-between;
        }
        // .right {
        //   position: absolute;
        //   bottom: -40px;
        //   left: 50%;
        //   transform: translateX(-50%);
        // }
      }
      .price-range-footer {
        padding: 1px 8px 0;
        .select-range {
          position: relative;
          .range-bottom {
            .price {
              margin-top: 12px;
            }
            div {
              &:nth-child(2) {
                position: absolute;
                top: 0;
                right: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
