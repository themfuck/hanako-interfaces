<template>
  <div>
    <div>
      <a-button @click="bitkeepTest">bitkeep test</a-button>
      <!-- <a-button @click="bitkeepAccount">bitkeep account</a-button> -->
      <a-button @click="coin98test">coin98test</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useWalletStore } from '@/store/wallet'
export default defineComponent({
  setup() {
    const walletSotre = useWalletStore()
    const { currentWallet, connected, address } = walletSotre
    const bitkeepTest = () => {
      currentWallet.signAndExecuteTransaction({
        type: 'move-call',
        data: {
          packageObjectId: '0x2',
          module: 'devnet_nft',
          function: 'mint',
          typeArguments: [],
          arguments: [
            'Example NFT',
            'An example NFT created by demo Dapp',
            'ipfs://bafkreibngqhl3gaa7daob4i2vccziay2jjlp435cf66vhono7nrvww53ty'
          ],
          gasBudget: 10000
        }
      })
    }

    // const bitkeepAccount = () => {}

    const coin98test = () => {
      window.coin98.sui.executeMoveCall
    }

    return {
      bitkeepTest,
      // bitkeepAccount,
      coin98test
    }
  }
})
</script>
