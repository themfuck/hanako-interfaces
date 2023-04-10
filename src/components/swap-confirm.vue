<template>
  <Modal
    width="440px"
    :visible="true"
    :footer="null"
    :mask-closable="false"
    :title="$t('modal.swapConfirmTitle')"
    class="swap-confirm-modal"
    @cancel="$emit('on-close')"
  >
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="swap-confirm-container">
      <div class="card-content">
        <div class="top">
          <div class="coin">
            <img :src="fromCoin.logoURI || importIcon(`/image/coins/${fromCoin.symbol.toLowerCase()}.png`)" />
            <p>{{ fromCoinAmount }}</p>
            &nbsp;&nbsp;
            <p>{{ fromCoin.symbol }}</p>
          </div>
          <div class="svg-box">
            <svg class="icon modal-icon-close" aria-hidden="true">
              <use xlink:href="#icon-icon-swap2"></use>
            </svg>
          </div>
          <div class="coin">
            <img :src="toCoin.logoURI || importIcon(`/image/coins/${toCoin.symbol.toLowerCase()}.png`)" />
            <p>{{ toCoinAmount }}</p>
            &nbsp;&nbsp;
            <p>{{ toCoin.symbol }}</p>
          </div>
        </div>
        <div class="bottom">
          <div class="induction">
            <div class="item">
              <div class="induction-text">{{ $t('common.rate') }}</div>
              <div class="induction-value induction-value-change">
                <span v-if="!rateChange">
                  1 {{ fromCoin.symbol }} ≈
                  {{ fixD(Number(toCoinAmount) / Number(fromCoinAmount), toCoin.decimals) }}
                  {{ toCoin.symbol }}
                </span>
                <span v-else>
                  1 {{ toCoin.symbol }} ≈
                  {{ fixD(Number(fromCoinAmount) / Number(toCoinAmount), toCoin.decimals) }}
                  {{ toCoin.symbol }}
                </span>
                <svg class="icon-change" aria-hidden="true" @click="changeRateChange">
                  <use xlink:href="#icon-a-icon-change2" />
                </svg>
              </div>
            </div>
            <div class="item">
              <div class="induction-text">
                {{ $t('modal.slippageTolerance') }}
              </div>
              <div class="induction-value">{{ slippage }}%</div>
            </div>
            <div class="item">
              <!-- <div class="induction-text">{{ !rateChange ? 'Minimum Received' : ' Maximum Sold' }}</div> -->
              <div class="induction-text">
                {{ fixedFromCoin ? 'Minimum Received' : ' Maximum Sold' }}
              </div>
              <div class="induction-value">
                {{
                  fixedFromCoin
                    ? fixD(toCoinAmount - (Number(toCoinAmount) * Number(slippage)) / 100, toCoin.decimals)
                    : fixD((Number(fromCoinAmount) * Number(slippage)) / 100 + Number(fromCoinAmount), fromCoin.decimals)
                }}
                {{ fixedFromCoin ? toCoin.symbol : fromCoin.symbol }}
              </div>
            </div>
            <div class="item">
              <div class="induction-text">{{ $t('common.priceImpact') }}</div>
              <div class="induction-value">{{ impact }} %</div>
            </div>
            <div class="item">
              <div class="induction-text">{{ $t('common.fee') }}</div>
              <div class="induction-value">{{ liquidityProviderFee }} {{ fromCoin.symbol }}</div>
            </div>
          </div>
          <div v-if="isAccept" class="btn-box">
            <div class="left">
              <svg class="icon modal-icon-close" aria-hidden="true">
                <use xlink:href="#icon-icon-tips"></use>
              </svg>
              <p>Price Updated</p>
            </div>
            <a-button class="confirm-btn" @click="updatePrice()">Accept</a-button>
          </div>
        </div>
      </div>
    </div>
    <a-button class="big-btn swap-confirm-btn" :disabled="isAccept" @click="clickNextBtn()">
      {{ $t('button.confirmSwap') }}
    </a-button>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { fixD, decimalFormat } from '@/utils'
import { useIndexStore } from '../store'
import { TOKENS, getCurrentLP } from '@/utils/tokens'
import useContract from '@/composables/useContract'
import { d } from 'test-cetus-sdk/dist/utils/numbers'
import { useLiquidityStore } from '@/store/liquidity'

export default defineComponent({
  components: { Modal },
  props: {
    fromCoin: {
      type: Object,
      required: true
    },
    toCoin: {
      type: Object,
      required: true
    },
    fromCoinAmount: {
      type: String,
      required: true
    },
    toCoinAmount: {
      type: String,
      required: true
    },
    impact: {
      type: String,
      required: true
    },
    fee: {
      type: String,
      required: true
    },
    fixedFromCoin: {
      type: Boolean,
      required: true
    },
    oneToAmount: {
      type: String,
      required: true
    },
    oneFromAmount: {
      type: String,
      required: true
    },
    rateChange: {
      type: Boolean,
      required: true
    },
    tokens: {
      type: Object,
      required: true
    }
  },
  emits: ['to-swap', 'on-close', 'update-amount', 'changeRateChange'],
  setup(props, ctx) {
    const store = useIndexStore()
    const liquidityStore = useLiquidityStore()

    const liquidityProviderFee = computed(() => {
      // const currentLP = getCurrentLP(props.fromCoin.symbol, props.toCoin.symbol)
      const currentLP = getCurrentLP(props.fromCoin.symbol, props.toCoin.symbol, liquidityStore.lpTokens)

      const fee = decimalFormat(d(props.fromCoinAmount).mul(d(currentLP.fee).div(100)).toString(), props.fromCoin.decimals)
      return fee
    })
    const slippage = ref(store.slippage || 0.5)
    const direct = ref(true)
    function changeDirect(value: boolean) {
      direct.value = value
    }
    const isAccept = ref(false)
    const isupdateAmount = ref(false)
    const updatePrice = () => {
      ctx.emit('update-amount')
      isAccept.value = false
    }
    const clickNextBtn = async () => {
      ctx.emit('to-swap')
    }
    const changeRateChange = () => {
      ctx.emit('changeRateChange')
    }
    let getAmountTimer: any = null
    onMounted(() => {
      getAmountTimer = window.setInterval(() => {
        getAmount(props.fixedFromCoin ? props.fromCoinAmount : props.toCoinAmount)
      }, 5000)
    })
    onUnmounted(() => {
      window.clearInterval(getAmountTimer)
      clearInterval(getAmountTimer)
    })
    const contractStore = useContract()
    const getAmount = async val => {
      try {
        const result = await contractStore.calculateRates({
          fromToken: props.tokens[props.fromCoin.symbol],
          toToken: props.tokens[props.toCoin.symbol],
          amount: val,
          interactiveToken: props.fixedFromCoin ? 'from' : 'to'
        })

        const slippage = Number(store.slippage) / 100
        if (props.fixedFromCoin) {
          if (Number(result) !== Number(props.toCoinAmount)) {
            isAccept.value = true
          }
          if (Number(result) - Number(result) * slippage > Number(props.toCoinAmount)) {
            isupdateAmount.value = true
          }
        } else {
          if (Number(result) !== Number(props.fromCoinAmount)) {
            isAccept.value = true
          }
          if (Number(result) + Number(result) * slippage < Number(props.fromCoinAmount)) {
            isupdateAmount.value = true
          }
        }
      } catch (error) {
        console.log('testGetCoinXYForLiquidityerr', error)
      }
    }

    return {
      importIcon,
      fixD,
      decimalFormat,
      direct,
      changeDirect,
      clickNextBtn,
      slippage,
      liquidityProviderFee,
      isAccept,
      updatePrice,
      isupdateAmount
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.theme-sui {
  .svg-box {
    background: url('/sui-image/img-swap-bg@2x.png') !important;
    background-size: 100% 100% !important;
  }
}
.swap-confirm-modal {
  position: relative;
  .card-content {
    // background: #121212;
    .top {
      padding: 22px 0;
      background: @cardCenter;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .coin {
        display: flex;
        img {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        p {
          font-size: 16px;
          color: @textActive;
          margin-bottom: 0;
          &:nth-child(1) {
            margin-right: 20px;
          }
        }
      }
      .svg-box {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../assets/image/img-swap-bg@2x.png');
        background-size: 100% 100%;
        margin: 12px 0;
        svg {
          width: 28px;
          height: 28px;
          fill: @themeColor;
        }
      }
    }
    .induction {
      background: unset;
      padding: 16px 0;
      .induction-text {
        font-size: 12px;
      }
      .induction-value {
        font-size: 12px;
      }
    }
    .btn-box {
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        svg {
          width: 16px;
          height: 16px;
        }
        p {
          color: @textTips;
          font-size: 14px;
          margin-bottom: 0;
          margin-left: 5px;
        }
      }
      .ant-btn {
        width: 96px !important;
        height: 32px !important;
      }
    }
  }
  .swap-confirm-btn {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    bottom: -65px;
  }
}
@media (max-width: 750px) {
  .add-liquidity-modal {
  }
}
</style>
