<template>
  <div class="card">
    <div class="top">
      <div class="left" @click="hasArrow ? selectCoin() : ''">
        <img v-if="coinName" :src="coinIcon || importIcon(`/image/coins/${coinName.toLowerCase()}.png`)" />
        <span>{{ coinName ? coinName : $t('modal.selectTokenModalTitle') }}</span>
        <svg v-if="hasArrow" class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon_on" />
        </svg>
      </div>
      <div class="right">
        {{ isTotal ? $t('common.total') : $t('common.balance') }}
        <span class="balance">{{ removeBalance ? removeBalance : balance }}</span>
        <!-- <template v-else>
          <a-spin :indicator="indicator" />
        </template> -->
        <a-button v-if="havemax && balance > 0" :disabled="!coinName" class="max-btn" @click="max">{{ $t('button.max') }}</a-button>
      </div>
    </div>
    <div class="bottom">
      <!-- oninput="this.value = this.value.replace(/[^\d.]/g,'');" -->
      <!-- oninput="value = value.replace(/[^\d-]*(\d*(?:\.\d{0,8})?).*$/g, '$1')" -->
      <a-input
        v-if="!inputDisabled"
        :value="inputValue == 'InsufficientLiquidity' ? '' : inputValue"
        placeholder="0.0"
        :disabled="inputDisabled"
        @change="inputChange"
        @input="$emit('onInput', $event.target.value)"
        @focus="$emit('onFocus')"
      />
      <div v-else class="input-div">
        <span v-if="inputValue">{{ inputValue }}</span>
        <template v-else>
          <a-spin :indicator="indicator" />
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref, computed, watchEffect } from 'vue'
import importIcon from '@/utils/import-icon'
import { TOKENS } from '@/utils/tokens'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useLiquidityStore } from '@/store/liquidity'
import { useI18n } from 'vue-i18n'
import { prettyAmount } from '@/utils/tokens'
import { useWalletStore } from '@/store/wallet'
import { checkNullObj } from '@/utils'

export default defineComponent({
  props: {
    inputValue: {
      type: String,
      default: ''
    },
    inputDisabled: {
      type: Boolean,
      default: false
    },
    coinName: {
      type: String,
      default: ''
    },
    coinAddress: {
      type: String,
      default: ''
    },
    coinDecimals: {
      type: Number,
      default: 6
    },
    removeBalance: {
      type: String,
      default: ''
    },
    coinIcon: {
      type: String,
      default: ''
    },
    havemax: {
      type: Boolean,
      default: true
    },
    hasArrow: {
      type: Boolean,
      default: true
    },
    isTotal: {
      type: Boolean,
      default: false
    },
    swapDirection: {
      type: String,
      default: ''
    }
  },
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
    function selectCoin() {
      this.$emit('onSelect')
    }
    const inputChange = e => {
      if (props.coinName == 'USDC' || props.coinName == 'USDT') {
        e.target.value = e.target.value.replace(/[^\d-]*(\d*(?:\.\d{0,6})?).*$/g, '$1')
      } else {
        e.target.value = e.target.value.replace(/[^\d-]*(\d*(?:\.\d{0,8})?).*$/g, '$1')
      }
    }

    const liquidityStore = useLiquidityStore()

    const liquidity = computed(() => {
      return liquidityStore
    })

    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })

    const balance = computed(() => {
      if (wallet.value.connected) {
        return (
          (wallet.value.assets[props.coinAddress] &&
            wallet.value.assets[props.coinAddress].balance &&
            prettyAmount(wallet.value.assets[props.coinAddress].balance, props.coinDecimals)) ||
          0
        )
      } else {
        return '--'
      }
    })

    const max = () => {
      if (props.swapDirection == 'From') {
        ctx.emit('onMax', 'fromCoin', balance)
      } else {
        ctx.emit('onMax', 'toCoin', balance)
      }
    }

    // const balance = computed(() => {
    //   return props.coinName && liquidity.value.tokens[props.coinName] && liquidity.value.tokens[props.coinName].balance
    // })
    return {
      indicator,
      inputChange,
      TOKENS,
      importIcon,
      selectCoin,
      balance,
      t,
      prettyAmount,
      max,
      connected: wallet.value.connected
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.card {
  background: @cardAsset;
  width: 100%;
  height: 128px;
  padding: 16px;
  .ant-spin-spinning {
    width: 14px !important;
    height: 14px !important;
    line-height: 10px !important;
    margin-right: 4px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      background: @buttonDetailDefault;
      border: 1px solid @borderDefault;
      width: 146px;
      height: 40px;
      color: @textActive;
      padding: 8px 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        svg {
          fill: @textActive;
        }
      }
      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
      svg {
        width: 12px;
        height: 12px;
        margin-left: 5px;
        fill: @textEffect;
      }
    }
    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: @textDefault;
      .balance {
        color: @textActive;
        margin: 0 5px;
      }
    }
  }
  .bottom {
    margin-top: 12px;
    .ant-input {
      font-size: 24px;
      padding-left: 0 !important;
    }
    .input-div {
      font-size: 24px;
      color: @textActive;
    }
  }
}
@media (max-width: 750px) {
  .card {
    padding: 16px 8px;
  }
}
</style>
