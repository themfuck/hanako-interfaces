<template>
  <Modal
    :visible="true"
    class="mint-address"
    centered
    :closable="true"
    :title="$t('modal.AddressModalTitle')"
    width="400px"
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="address-container">
      <div v-if="fromCoins && fromCoins.symbol && fromCoins.address" class="pc-address">
        <div class="left">
          <img :src="fromCoins.icon || importIcon(`/image/coins/${fromCoins.symbol.toLowerCase()}.png`)" />
          <span>
            {{ fromCoins.address && fromCoins.address.substr(0, 26) }}
            ...
            <!-- {{ fromCoins.address && fromCoins.address.substr(fromCoins.address.length - 35, 12) }}  -->
          </span>
        </div>
        <svg class="icon" aria-hidden="true" @click="copy(fromCoins.address)">
          <use xlink:href="#icon-icon-copy" />
        </svg>
      </div>
      <div v-if="toCoins && toCoins.symbol && toCoins.address" class="pc-address">
        <div class="left">
          <img :src="toCoins.icon || importIcon(`/image/coins/${toCoins.symbol.toLowerCase()}.png`)" />
          <span>
            {{ toCoins.address && toCoins.address.substr(0, 26) }}
            ...
            <!-- {{ toCoins.address && toCoins.address.substr(toCoins.address.length - 35, 12) }} -->
          </span>
        </div>
        <svg class="icon" aria-hidden="true" @click="copy(toCoins.address)">
          <use xlink:href="#icon-icon-copy" />
        </svg>
      </div>
      <div v-if="toCoins && toCoins.symbol && toCoins.address" class="pc-address">
        <div class="left">
          <div class="img-box">
            <img :src="fromCoins.icon || importIcon(`/image/coins/${fromCoins.symbol.toLowerCase()}.png`)" />
            <img :src="toCoins.icon || importIcon(`/image/coins/${toCoins.symbol.toLowerCase()}.png`)" />
          </div>
          <span>
            {{ address && address.substr(0, 26) }}
            ...
            <!-- {{ address && address.substr(address.length - 35, 12) }} -->
          </span>
        </div>
        <svg class="icon" aria-hidden="true" @click="copy(address)">
          <use xlink:href="#icon-icon-copy" />
        </svg>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { useIndexStore } from '../store'
import { getCurrentLP } from '@/utils/tokens'
import { useLiquidityStore } from '@/store/liquidity'

export default defineComponent({
  components: { Modal },
  props: {
    fromCoins: {
      type: Object,
      required: true
    },
    toCoins: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useIndexStore()
    const { copy } = store
    let address = ref('')
    const liquidityStore = useLiquidityStore()
    // onMounted(() => {
    // let findLp
    // let lp = ''
    // let reverseLp = ''
    // if (props.fromCoins && props.toCoins) {
    //   lp = props.fromCoins.symbol + '-' + props.toCoins.symbol
    //   reverseLp = props.toCoins.symbol + '-' + props.fromCoins.symbol
    // } else {
    //   lp = ''
    //   reverseLp = ''
    // }
    // if (Object.keys(LP_TOKENS).includes(lp)) {
    //   findLp = Object.keys(LP_TOKENS).filter(item => item == lp)
    // } else {
    //   if (Object.keys(LP_TOKENS).includes(reverseLp)) {
    //     findLp = Object.keys(LP_TOKENS).filter(item => item == reverseLp)
    //   }
    // }
    // address.value = LP_TOKENS[findLp[0]].address
    const currentLp = getCurrentLP(props.fromCoins.symbol, props.toCoins.symbol, liquidityStore.lpTokens)
    address.value = currentLp.address
    // })
    return {
      importIcon,
      store,
      copy,
      address
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.mint-address {
  .address-container {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin-top: 12px;
    > .pc-address {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        color: @textActive;
      }
      & + div {
        margin-top: 14px;
      }
      span {
        margin-left: 16px;
      }
    }
    .icon {
      width: 20px;
      height: 20px;
      fill: @textDefault;
      &:hover {
        fill: @textActive;
      }
    }
    img {
      width: 24px;
      height: 24px;
      &:nth-child(2) {
        margin-left: -8px;
      }
    }
  }
}
@media (max-width: 350px) {
  .mint-address {
    .address-container {
      .pc-address {
        .left {
          img {
            width: 18px;
            height: 18px;
          }
          span {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
