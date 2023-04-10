<template>
  <div class="suitest-container">
    <h3>sui test</h3>
    <div>
      <a-button @click="toConnect">connect</a-button>
      <a-button @click="toDisconnect">disconnect</a-button>
    </div>
    <p>{{ address }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { WalletAdapter } from '@mysten/wallet-adapter-base/dist'
import { SuietWalletAdapter } from '@suiet/wallet-adapter'
import { SuiWalletAdapter } from '@/wallet/SuiWallet'

export default defineComponent({
  setup() {
    const address = ref('')

    enum Permission {
      VIEW_ACCOUNT = 'viewAccount',
      SUGGEST_TX = 'suggestTransactions'
    }
    const suietAdapter = new SuietWalletAdapter()
    const supportedWallets: { adapter: WalletAdapter }[] = [
      {
        adapter: suietAdapter
      }
    ]
    const toConnect = async () => {
      // sui wallet
      const suiWallet = new SuiWalletAdapter()
      const test = await suiWallet.connect()
    }

    const toDisconnect = async () => {
      const resData = await (window as any).__suiet__.disconnect()
    }

    return {
      address,
      toConnect,
      toDisconnect
    }
  }
})
</script>
<style lang="less" scoped>
.suitest-container {
  width: 100%;
  color: #fff;
}
</style>
