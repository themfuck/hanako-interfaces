<template>
  <div class="remove-liquidity">
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
        <!-- <Refresh-Icon
        :loading="refresh"
        :auto-refresh-time="autoRefreshTime"
        :countdown="countdown"
        @clickRefresh="clickRefresh()" /> -->
      </div>
    </div>
    <div class="remove-liquidity-center">
      <div class="top">
        <CoinPairName v-if="currentPositionInfo" :from-coin="currentPositionInfo.token_a" :to-coin="currentPositionInfo.token_b" />
        <!-- <div v-if="currentPositionInfo" class="coin-pair">
          <img
            :src="currentPositionInfo.token_a.icon || importIcon(`/image/coins/${currentPositionInfo.token_a.symbol.toLowerCase()}.png`)"
          />
          <img
            :src="currentPositionInfo.token_b.icon || importIcon(`/image/coins/${currentPositionInfo.token_b.symbol.toLowerCase()}.png`)"
          />
          <span>{{ currentPositionInfo.token_a.symbol }} - {{ currentPositionInfo.token_b.symbol }}</span>
        </div> -->
        <StatusBlock :current-status="currentPositionInfo && currentPositionInfo.currentStatus" />
      </div>
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
            <!-- <span>{{ sliderVal }}%</span> -->
            <a-input v-model:value="sliderVal" suffix="%" />
            <a-slider v-model:value="sliderVal"></a-slider>
          </div>
        </div>
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
      <div class="item">
        <div class="induction-text">Fees Earned</div>
        <div class="induction-value">26.42 USDC</div>
      </div>
      <div class="item">
        <div class="induction-text"></div>
        <div class="induction-value">0.02403 USDT</div>
      </div>
    </div>
    <a-button class="remove-btn big-btn">
      <svg aria-hidden="true">
        <use xlink:href="#icon-icon-Remove" />
      </svg>
      <span>Remove</span>
    </a-button>
    <SwapSetting v-if="isShowSwapSetting" @onClose="isShowSwapSetting = false" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import importIcon from '@/utils/import-icon'
export default defineComponent({
  setup() {
    // const autoRefreshTime = ref(20)
    let isShowSwapSetting = ref(false)
    // const loading = ref(false)
    const refresh = ref(false)
    // const countdown = ref(0)
    const clickRefresh = () => {
      // countdown.value = 0
      refresh.value = true
      // loading.value = true
      setTimeout(() => {
        refresh.value = false
      }, 1000)
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
        name: 'MAX',
        value: 100
      }
    ]
    const currentPositionInfo = reactive({
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
    const sliderVal = ref<number>(50)
    const slippage = ref(1)
    return {
      // autoRefreshTime,
      refresh,
      // countdown,
      amountArr,
      sliderVal,
      currentPositionInfo,
      slippage,
      importIcon,
      clickRefresh,
      isShowSwapSetting
      // loading
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.remove-liquidity {
  width: 480px;
  .back {
    svg {
      width: 20px;
      height: 20px;
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
    //   svg {
    //     width: 20px;
    //     height: 20px;
    //     fill: @textEffect;
    //   }
    //   span {
    //     padding-top: 3px;
    //     font-size: 12px;
    //     margin: 0 16px 0 4px;
    //   }
    // }
  }
  .remove-liquidity-center {
    margin-top: 12px;
    .top {
      display: flex;
      align-items: center;
      padding: 20px 16px;
      background: @cardTop;
      > div {
        margin-right: 8px;
      }
      // .coin-pair {
      //   display: flex;
      //   align-items: center;
      //   img {
      //     width: 24px;
      //     height: 24px;
      //     border-radius: 100%;
      //     &:nth-of-type(2) {
      //       margin-left: -10px;
      //     }
      //   }
      //   span {
      //     font-size: 14px;
      //     font-weight: normal;
      //     margin-left: 10px;
      //     color: @textActive;
      //   }
      // }
      // .data-block-status {
      //   line-height: 1;
      //   margin-left: 8px;
      // }
    }
    .bottom {
      padding: 12px 16px;
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
              // background: @cardEnter;
              width: 64px;
              height: 32px;
              // border: 1px solid transparent;
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
          // .ant-input {
          //   // padding-left: 35px;
          //   display: inline-block;
          //   width: 100px;
          //   height: 40px;
          //   line-height: 40px;
          //   text-align: center;
          //   background: @cardEnter !important;
          //   margin-right: 10px;
          // }
          .ant-slider {
            width: 336px;
            margin: 10px 0 10px 10px;
          }
        }
      }
    }
  }
  .remove-liquidity-bottom {
    // padding: 20px 16px;
    background: #121212;
    margin: 8px 0;
    .item {
      &:nth-child(2) {
        margin-top: -10px !important;
      }
      &:nth-child(4) {
        margin-top: -10px !important;
      }
    }
    // .remove-info {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    //   color: @textActive;
    //   font-size: 12px;
    //   line-height: 1;
    //   & + .remove-info {
    //     margin-top: 16px;
    //   }
    // }
  }
}
@media (max-width: 750px) {
  .remove-liquidity {
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
