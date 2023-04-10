<template>
  <div>
    <a-button type="primary" @click="testFun">test</a-button>
    <!-- <NuxtLink to="/about">link</NuxtLink>
    <MyTest /> -->
    <ul class="wallet-list">
      <li v-for="(item, index) in wallets" :key="index" @click="toConnect(item.name)">{{ item.name }}</li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, reactive, watchEffect } from 'vue'
import { createWalletKitCore, WalletKitCore, WalletKitCoreState } from '@mysten/wallet-kit-core'
import { WalletStandardAdapterProvider } from '@mysten/wallet-adapter-wallet-standard'

export default defineComponent({
  setup() {
    console.log('this is test')
    const adapters = [new WalletStandardAdapterProvider()]
    console.log('0131###adapters####', adapters)
    const walletKitRef = reactive(createWalletKitCore({ adapters }))
    const walletState = computed(() => {
      return walletKitRef.getState()
    })
    const wallets = computed(() => {
      // console.log('0131###walletKitRef###', walletKitRef)
      // console.log('0131###walletKitRef.getState()###', walletKitRef.getState())

      // const walletState = reactive(walletKitRef.getState())
      return walletState.value.wallets || []
    })

    const testFun = () => {
      // const adapters = [new WalletStandardAdapterProvider()]
      // console.log('0131###adapters####', adapters)

      // const walletKitRef = createWalletKitCore({ adapters })

      console.log('0131###walletKitRef###', walletKitRef)
      console.log('0131###walletKitRef.getState()###', walletKitRef.getState())
    }

    const toConnect = async (walletName: string) => {
      console.log('0131toConnect####walletName####', walletName)
      try {
        const res = await walletKitRef.connect(walletName)
        console.log('0131###toConnect Success###', res)
        console.log('0131###walletKitRef.getState()###', walletKitRef.getState())
      } catch (err) {
        console.log('0131###toConnect Error###', err)
      }
    }

    watchEffect(() => {
      console.log('0131###walletState####', walletState)
    })

    return {
      testFun,
      wallets,
      toConnect
    }
  }
})
</script>
