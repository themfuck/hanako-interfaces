<template>
  <Modal
    width="440px"
    :visible="true"
    :footer="null"
    :title="$t('modal.addLiquidityModalTitle')"
    class="remove-confirm-modal"
    @cancel="$emit('on-close')"
  >
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="remove-confirm-container">
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
              <use xlink:href="#icon-icon-add1"></use>
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
          <div class="desc">
            <!-- {{ slippageDesc }} -->
            {{ $t('modal.removeLiquidityText', { slippage: slippage + '%' }) }}
          </div>
          <div class="induction">
            <div class="item">
              <div class="induction-text">{{ $t('common.rate') }}</div>
              <div class="induction-value induction-value-change">
                <span v-if="!rateChange">1 {{ fromCoin.symbol }} ≈ {{ fixD(currentLpInfo.price, 2) }} {{ toCoin.symbol }}</span>
                <span v-else
                  >1 {{ toCoin.symbol }} ≈
                  {{ fixD(1 / currentLpInfo.price, 2) }}
                  {{ fromCoin.symbol }}</span
                >
                <svg class="icon-change" aria-hidden="true" @click="rateChange = !rateChange">
                  <use xlink:href="#icon-a-icon-change2" />
                </svg>
              </div>
            </div>
            <div class="item">
              <div class="induction-text">
                {{ fromCoin.symbol }} - {{ toCoin.symbol }}
                {{ $t('modal.removeLiquidityLpBurned') }}
              </div>
              <div class="induction-value">{{ burnValue }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-button class="big-btn swap-confirm-btn" :loading="loading" @click="clickNextBtn">
      {{ $t('button.confirmRemove') }}
    </a-button>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { fixD, decimalFormat } from '@/utils'
import { useIndexStore } from '../store'
import useContract from '@/composables/useContract'
import { useWalletStore } from '@/store/wallet'
import { useLiquidityStore } from '@/store/liquidity'
import { convertToDecimals, TOKENS } from '@/utils/tokens'
import { useI18n } from 'vue-i18n'
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
    burnValue: {
      type: String,
      required: true
    },
    fixedFromCoin: {
      type: Boolean,
      required: true
    },
    liquidityBalance: {
      type: String,
      required: true
    },
    currentLpInfo: {
      type: Object,
      required: true
    },
    slideVal: {
      type: String,
      required: true
    }
  },
  emits: ['on-close', 'to-remove'],
  setup(props, ctx) {
    const store = useIndexStore()
    const { t } = useI18n()
    const contractStore = useContract()
    const walletSotre = useWalletStore()
    const wallet = computed(() => {
      return walletSotre
    })
    const liquidityStore = useLiquidityStore()

    const slippage = ref(store.slippage || 0.5)
    // const slippageDesc = t('modal.removeLiquidityText', { slippage: slippage })
    const { setIsShowSuccess, setIsShowRejected, setIsShowWaiting, setTransactionDesc, setTransactionTxid } = store
    const direct = ref(true)
    const rateChange = ref(false)
    function changeDirect(value: boolean) {
      direct.value = value
    }
    const clickNextBtn = async () => {
      ctx.emit('to-remove')
    }
    return {
      slippage,
      importIcon,
      fixD,
      decimalFormat,
      direct,
      changeDirect,
      rateChange,
      clickNextBtn
      // slippageDesc
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
.remove-confirm-modal {
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
    .desc {
      color: @textDefault;
      font-size: 14px;
      margin-top: 16px;
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
  }
  .swap-confirm-btn {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    bottom: -65px;
  }
}
@media (max-width: 750px) {
  .remove-liquidity-modal {
  }
}
</style>
