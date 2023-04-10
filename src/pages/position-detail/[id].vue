<template>
  <div class="position-detail-container">
    <div class="position-detail-header">
      <div class="back-and-refresh">
        <Back />
        <svg aria-hidden="true" :class="refresh ? 'refresh refresh-icon ' : 'refresh-icon'" @click="clickRefresh">
          <use xlink:href="#icon-icon-refresh" />
        </svg>
      </div>
      <div class="action-position">
        <div class="coin-pair">
          <!-- <img :src="positionInfo.token_a.icon || importIcon(`/image/coins/${positionInfo.token_a.symbol.toLowerCase()}.png`)" />
          <img :src="positionInfo.token_b.icon || importIcon(`/image/coins/${positionInfo.token_b.symbol.toLowerCase()}.png`)" />
          <span>{{ positionInfo.token_a.symbol }} - {{ positionInfo.token_b.symbol }}</span> -->
          <div class="coin-pair-left">
            <CoinPairName v-if="direct" :from-coin="positionInfo.token_a" :to-coin="positionInfo.token_b" />
            <CoinPairName v-else :from-coin="positionInfo.token_b" :to-coin="positionInfo.token_a" />
            <div class="fee">0.3%</div>
          </div>
          <StatusBlock :current-status="positionInfo.currentStatus" />
        </div>
        <div class="acton-btn-box">
          <a-button class="remove-liquidity action-btn" @click="toRemove">
            <svg aria-hidden="true" class="action-icon">
              <use xlink:href="#icon-icon-Reduction" />
            </svg>
            Remove
          </a-button>
          <a-button class="increase-liquidity action-btn" @click="toIncrease">
            <svg aria-hidden="true" class="action-icon">
              <use xlink:href="#icon-icon-add" />
            </svg>
            Increase
          </a-button>
        </div>
      </div>
    </div>

    <div class="position-content">
      <div class="left">
        <PositionCard :position-info="positionInfo"></PositionCard>
      </div>
      <div class="right">
        <LiquidityCard title="Liquidity" :position-info="positionInfo"></LiquidityCard>
        <LiquidityCard title="Unclaimed fees" :position-info="positionInfo" @openClaim="isShowClaim = true"></LiquidityCard>
      </div>
    </div>
    <PositionPriceRange :position-info="positionInfo" :direct="direct" @changeDirect="val => (direct = val)"></PositionPriceRange>
    <ClaimFees v-if="isShowClaim" :position-info="positionInfo" @onClose="isShowClaim = false" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import importIcon from '@/utils/import-icon'
import { useLiquidityStore } from '@/store/liquidity'
import { useRouter } from 'vue-router'
definePageMeta({
  middleware: ['detail']
})
export default defineComponent({
  setup() {
    const isShowClaim = ref(false)
    const refresh = ref(false)
    const direct = ref(true)
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
    const router = useRouter()
    const liquididySrote = useLiquidityStore()
    function toRemove() {
      liquididySrote.setCurrentLiquidity(positionInfo)
      router.push('/remove-liquidity')
    }
    function toIncrease() {
      liquididySrote.setCurrentLiquidity(positionInfo)
      router.push('/increase-liquidity')
    }
    const clickRefresh = () => {
      refresh.value = true
      setTimeout(() => {
        refresh.value = false
      }, 1000)
    }
    return { positionInfo, importIcon, router, toRemove, toIncrease, isShowClaim, direct, refresh, clickRefresh }
  }
})
</script>
<style lang="less" scoped>
@import '../../assets/css/base.less';
@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
.position-detail-container {
  line-height: 1;
  width: 664px;
  .position-detail-header {
    .back-and-refresh {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .back-icon {
        width: 20px;
        height: 20px;
        fill: @textActive;
      }
      // .refresh-icon {
      //   width: 16px;
      //   height: 16px;
      //   fill: @textActive;
      // }
      .refresh-icon {
        width: 16px;
        height: 16px;
        fill: @textEffect;
      }
      .refresh {
        animation: spin 1s linear infinite;
      }
    }
    .action-position {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .coin-pair {
        display: flex;
        align-items: center;
        //   img {
        //     width: 24px;
        //     height: 24px;
        //     &:nth-of-type(2) {
        //       margin-left: -10px;
        //     }
        //   }
        //   span {
        //     font-size: 16px;
        //     font-weight: 500;
        //     color: @textActive;
        //     margin-left: 8px;
        //   }
        .coin-pair-left {
          display: flex;
          align-items: center;
        }
      }
      .fee {
        padding: 2px 8px;
        background: rgba(#fff, 0.1);
        color: @textActive;
        font-size: 14px;
        font-weight: 500;
        margin: 0 10px;
      }
      .acton-btn-box {
        display: flex;
        .action-btn {
          width: 80px;
          height: 28px;
          line-height: 1;
          padding: 0;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 12px;
            height: 12px;
            margin-right: 5px;
          }
        }
        .remove-liquidity {
          background: @buttonDetailDefault !important;
          border: 1px solid @borderDefault !important;
          color: @themeColor !important;
          &:hover {
            background: @buttonDetailHover !important;
          }
          svg {
            fill: @themeColor;
          }
        }
        .increase-liquidity {
          margin-left: 12px;
          svg {
            fill: #222;
          }
        }
      }
    }
  }
  .position-content {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    .left {
      margin-left: -5px;
      margin-top: -2px;
    }
    .right {
      margin-left: 8px;
      .liquidity-card + .liquidity-card + {
        margin-top: 8px;
      }
    }
  }
}
@media (max-width: 750px) {
  .position-detail-container {
    width: 100%;
    .position-detail-header {
      .action-position {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .coin-pair {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .acton-btn-box {
          width: 100%;
          margin-top: 8px;
          .ant-btn {
            width: 48%;
            height: 32px;
          }
        }
      }
    }
    .position-content {
      display: flex;
      flex-direction: column;
      .right {
        margin-left: 0;
        margin-top: 10px;
      }
    }
  }
}
</style>
