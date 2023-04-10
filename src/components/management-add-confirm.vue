<template>
  <Modal
    width="440px"
    :visible="true"
    :footer="null"
    :title="$t('modal.addLiquidityModalTitle')"
    class="add-confirm-modal"
    @cancel="$emit('on-close')"
  >
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="add-confirm-container">
      <div class="card-content">
        <div class="top">
          <div class="coin">
            <img :src="fromCoin.logoURI || importIcon(`/image/coins/${fromCoin.symbol.toLowerCase()}.png`)" />
            <img :src="toCoin.logoURI || importIcon(`/image/coins/${toCoin.symbol.toLowerCase()}.png`)" />
            <p>{{ currentRecivedLp }} LP</p>
          </div>
        </div>
        <div class="bottom">
          <div class="induction">
            <div class="item">
              <div class="induction-text">{{ $t('common.rate') }}</div>
              <div class="induction-value induction-value-change">
                <span v-if="!rateChange">1 {{ fromCoin.symbol }} ≈ {{ fixD(rate, toCoin.decimals) }} {{ toCoin.symbol }}</span>
                <span v-else>1 {{ toCoin.symbol }} ≈ {{ fixD(1 / rate, fromCoin.decimals) }} {{ fromCoin.symbol }}</span>
                <svg class="icon-change" aria-hidden="true" @click="rateChange = !rateChange">
                  <use xlink:href="#icon-a-icon-change2" />
                </svg>
              </div>
            </div>
            <div class="item">
              <div class="induction-text">{{ $t('modal.slippageTolerance') }}</div>
              <div class="induction-value">{{ slippage }}%</div>
            </div>
            <div class="item">
              <div class="induction-text">{{ $t('common.liquidityDeposited') }}</div>
              <div v-if="!isIncrease" class="induction-value">{{ fromCoinAmount }} {{ fromCoin.symbol }}</div>
              <div v-else class="induction-value">
                {{ fixD(currentLpInfo.myCoinXAmount, fromCoin.decimals) }} →
                {{ fixD(Number(currentLpInfo.myCoinXAmount) + Number(fromCoinAmount), fromCoin.decimals) }}
                {{ fromCoin.symbol }}
              </div>
            </div>
            <div class="item liquidity-item">
              <div class="induction-text"></div>
              <div v-if="!isIncrease" class="induction-value">{{ toCoinAmount }} {{ toCoin.symbol }}</div>
              <div v-else class="induction-value">
                {{ fixD(currentLpInfo.myCoinYAmount, toCoin.decimals) }} →
                {{ fixD(Number(currentLpInfo.myCoinYAmount) + Number(toCoinAmount), toCoin.decimals) }} {{ toCoin.symbol }}
              </div>
            </div>
            <div class="item">
              <div class="induction-text">{{ $t('common.shareOfPool') }}</div>
              <div v-if="!isIncrease" class="induction-value">{{ share }}%</div>
              <div v-else class="induction-value">{{ currentLpInfo.myshareOfPool }}% → {{ newShare }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-button class="big-btn swap-confirm-btn" @click="clickNextBtn">
      {{ $t('button.confirmSupply') }}
    </a-button>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { fixD, decimalFormat } from '@/utils'
import { useIndexStore } from '../store'
import { decimalsMultiplier, d } from 'test-cetus-sdk/dist/utils/numbers'

export default defineComponent({
  components: { Modal },
  props: {
    isIncrease: {
      type: Boolean,
      required: false
    },
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
    fixedFromCoin: {
      type: Boolean,
      required: true
    },
    currentLpInfo: {
      type: Object,
      required: true
    },
    share: {
      type: String,
      required: true
    },
    rate: {
      type: String,
      required: true
    },
    currentRecivedLp: {
      type: String,
      required: true
    }
  },
  emits: ['to-add', 'on-close'],
  setup(props, ctx) {
    const store = useIndexStore()
    const slippage = ref(store.slippage || 0.5)
    const direct = ref(true)
    const rateChange = ref(false)
    function changeDirect(value: boolean) {
      direct.value = value
    }
    const clickNextBtn = async () => {
      ctx.emit('to-add')
    }

    const newShare = computed(() => {
      // if (props.share.includes('<') && props.currentLpInfo.myshareOfPool.includes('<')) {
      //   return '<0.01'
      // } else if (props.share.includes('<')) {
      //   return props.currentLpInfo.myshareOfPool
      // } else if (props.currentLpInfo.myshareOfPool.includes('<')) {
      //   return props.share
      // } else {
      //   return decimalFormat(String(Number(props.currentLpInfo.myshareOfPool) + Number(props.share)), 2)
      // }
      if (props.currentLpInfo) {
        const m = d(props.currentLpInfo.balanceOrigin).plus(d(props.currentRecivedLp).mul(Math.pow(10, 6)))
        const t = d(props.currentLpInfo.lpSupply).plus(d(props.currentRecivedLp).mul(Math.pow(10, 6)))
        const s = m.div(t).mul(100).toString()
        if (Number(s) > 0.01) return fixD(s, 2) || ''
        return '<0.01'
      }
      return ''
    })
    return {
      importIcon,
      fixD,
      decimalFormat,
      direct,
      changeDirect,
      rateChange,
      clickNextBtn,
      slippage,
      newShare
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.add-confirm-modal {
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
          &:nth-child(2) {
            margin-left: -8px;
            margin-right: 8px;
          }
        }
        p {
          font-size: 16px;
          color: @textActive;
          margin-bottom: 0;
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
      .liquidity-item {
        margin-top: -10px !important;
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
