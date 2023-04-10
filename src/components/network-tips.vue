<template>
  <div v-if="isShowTips && chainName === 'Aptos' && aptosConnected" class="network-tips">
    <svg class="icon modal-icon-close" aria-hidden="true">
      <use xlink:href="#icon-a-icon-Shutdown"></use>
    </svg>
    <span>Wallet is not connected to Mainnet</span>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { useWalletStore } from '@/store/wallet'
import config from '@/utils/config'
import { useIndexStore } from '@/store'
export default defineComponent({
  setup() {
    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })
    const walletNetwork = ref('')
    const isShowTips = ref(false)
    const indexStore = useIndexStore()
    const index = computed(() => {
      return indexStore
    })
    watch(
      () => wallet.value.walletNetwork,
      newValue => {
        walletNetwork.value = newValue
        if (newValue && index.value.chainName && newValue.toLowerCase().indexOf(config[index.value.chainName].network) < 0) {
          isShowTips.value = true
        } else {
          isShowTips.value = false
        }
      },
      {
        immediate: true
      }
    )
    const aptosConnected = computed(() => {
      return wallet.value.aptosConnected
    })

    const configNetwork = ref('')
    const chainName = ref('')
    watch(
      () => index.value.chainName,
      newValue => {
        if (newValue) {
          configNetwork.value = config[index.value.chainName].network
          chainName.value = index.value.chainName
        }
      },
      {
        immediate: true
      }
    )

    return {
      walletNetwork,
      configNetwork: configNetwork,
      isShowTips,
      chainName,
      aptosConnected
    }
  }
})
</script>
<style lang="less" scoped>
.network-tips {
  color: #ff5073;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  .icon {
    width: 16px;
    height: 16px;
    fill: #ff5073;
    margin-right: 10px;
  }
}
</style>
