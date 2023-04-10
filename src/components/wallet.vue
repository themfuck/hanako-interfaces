<template>
  <div v-if="wallet.connected" class="wallet-info" @click="wallet.setIsShowWalletModal(true)">
    <img :src="`/image/wallet/${wallet.walletIcon.toLowerCase()}.png`" alt="" />
    <div class="addressAndDev">
      <span v-if="index.chainName !== 'Aptos'">{{ currentNetwork }}</span>
      <span :style="index.chainName === 'Aptos' ? 'margin-bottom: 0px' : ''">
        {{ wallet.address && wallet.address.substr(0, 6) }}
        ...
        {{ wallet.address && wallet.address.substr(wallet.address.length - 4, 4) }}
      </span>
    </div>
  </div>
  <div v-else class="wallet-info noConnect" @click="wallet.setIsShowWalletModal(true)">
    {{ $t('button.connect') }}
    <!-- <span>Testnet</span> -->
  </div>
</template>
<script lang="ts">
import importIcon from '@/utils/import-icon'
import { defineComponent, computed } from 'vue'
import { useWalletStore } from '../store/wallet'
import { useIndexStore } from '../store/index'
import configure from '@/utils/config'
export default defineComponent({
  setup() {
    const store = useWalletStore()
    const wallet = computed(() => {
      return store
    })

    const indexStore = useIndexStore()
    const index = computed(() => {
      return indexStore
    })

    const config = computed(() => {
      return configure[index.value.chainName]
    })

    const currentNetwork = computed(() => {
      const network = config.value.network
      return network.charAt(0).toUpperCase() + network.slice(1)
    })

    return { wallet, importIcon, store, index, currentNetwork }
  }
})
</script>

<style lang="less" scoped>
@import '@/assets/css/base.less';
div {
  color: @textActive;
  cursor: pointer;
}
.wallet-info {
  // width: 36px;
  height: 36px;
  padding: 6px 12px;
  background: @buttonDetailDefault;
  border: 1px solid @borderDefault;
  font-size: 14px;
  display: flex;
  align-items: center;
  .addressAndDev {
    display: flex;
    flex-direction: column;
    span {
      &:nth-child(1) {
        font-size: 12px;
        color: @themeColor;
        margin-bottom: -6px;
      }
    }
  }
  &:hover {
    background: @buttonDetailHover;
  }
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 5px;
  }
}

.noConnect {
  display: unset;
  background: @buttonDefault;
  color: rgba(0, 0, 0, 0.85) !important;

  span {
    font-size: 12px;
    color: @themeColor;
    margin-left: 4px;
  }
  &:hover {
    background: @buttonHover;
  }
}
@media (max-width: 750px) {
  .wallet-info {
    height: 32px;
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 6px 10px 6px 4px;
    img {
      width: 20px;
      height: 20px;
      margin-right: 2px;
    }
  }
}
</style>
