<template>
  <div class="wallet-test-container">
    <div>
      <a-button><span class="test-color">change theme</span></a-button>
      <a-button @click="themeStore.seleteDefaultTheme">aptos theme</a-button>
      <a-button @click="themeStore.selectSuiTheme">sui theme</a-button>
    </div>
    <div>{{ wallet.address }}</div>
    <a-button v-for="item in walletList" :key="item" @click="toConnect(item)">connect {{ item }}</a-button>
    <a-button @click="toDisconnect">disconnect</a-button>
    <div>
      <a-button @click="toTestTransaction">get coin</a-button>
    </div>
    <div>
      <a-button @click="testCalculateRates">testCalculateRates</a-button>
    </div>
    <div>
      <a-button @click="testCalculatePriceImpact">testCalculatePriceImpact</a-button>
    </div>
    <div>
      <a-button @click="toSwap">toSwap</a-button>
    </div>
    <div>
      <a-button @click="testGetLiquidityAndCoinYByCoinX">testGetLiquidityAndCoinYByCoinX</a-button>
    </div>
    <div>
      <a-button @click="testGetCoinXYForLiquidity">testGetCoinXYForLiquidity</a-button>
    </div>
    <div>
      <a-button @click="toAddLiquidity">toAddLiquidity</a-button>
    </div>
    <div>
      <a-button @click="getCoinInfos">getCoinInfos</a-button>
    </div>
    <div>
      <a-button @click="testGetMyLpList">testGetMyLpList</a-button>
    </div>
    <div>
      <a-button @click="test0921">test0921</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, watchEffect, ref, computed } from 'vue'
import SDK from 'test-cetus-sdk'
import { AptosClient } from 'aptos'
import useWalletProvider from '@/composables/useWalletProvider'
import { useWalletStore } from '@/store/wallet'
import { storeToRefs } from 'pinia'
import useContract from '@/composables/useContract'
import useTheme from '@/composables/useTheme'
import { TOKENS } from '@/utils/tokens'
// import useContract from '@/composables/useContract'

export default defineComponent({
  setup() {
    const walletSotre = useWalletStore()
    const contractStore = useContract()
    // const { currentWallet, connected, address } = walletSotore
    const wallet = computed(() => {
      return walletSotre
    })

    const { connect, disconnect } = useWalletProvider()
    // const { list, count, getList } = useTestList()
    // onMounted(() => {
    //   connect('test')
    // })
    const walletList = ref(['Martian', 'Petra', 'Pontem', 'Fewcha', 'Hippo', 'Hippo Web', 'Spika'])

    const toConnect = item => {
      connect(item)
    }

    const toDisconnect = () => {
      disconnect()
    }

    const toTestTransaction = async () => {
      const payload = {
        type: 'entry_function_payload',
        function: '0x84dc9d921d277db5047dcb17addc2ecfbddfad087dd4ea825b2d17785755cb29::cetus_faucet::faucet',
        arguments: [],
        type_arguments: []
      }

      const otherOptions = {
        max_gas_amount: '5000',
        gas_unit_price: '100'
      }

      const test = await wallet.value.currentWallet.signAndSubmitTransaction(payload, otherOptions)
    }

    watchEffect(async () => {
      if (wallet.value.address) {
        const accountList = await contractStore.getAccount(wallet.value.address)
      }
    })

    const testCalculateRates = async () => {
      const output = await contractStore.calculateRates({
        fromToken: TOKENS['BTC'],
        toToken: TOKENS['ETH'],
        amount: '0.00001',
        interactiveToken: 'from'
      })
    }

    const testCalculatePriceImpact = async () => {
      const result = await contractStore.calculatePriceImpact({
        fromToken: TOKENS['BTC'],
        toToken: TOKENS['ETH'],
        fromAmount: '0.00001',
        toAmount: '0.000007',
        interactiveToken: 'from'
      })
    }

    const toSwap = async () => {
      const payload = await contractStore.createSwapTransactionPayload({
        fromToken: TOKENS['BTC'],
        toToken: TOKENS['ETH'],
        fromAmount: '0.00001',
        toAmount: '0.000007',
        interactiveToken: 'from',
        slippage: 0.1
      })

      const tx = await wallet.value.currentWallet.signAndSubmitTransaction(payload)
    }

    const testGetLiquidityAndCoinYByCoinX = async () => {
      const result = await contractStore.getLiquidityAndCoinYByCoinX({
        coinX: TOKENS['BTC'],
        coinY: TOKENS['ETH'],
        amount: 10
      })
    }
    // {coinYAmount: '7.096568', lpAmount: '8424113.0037224934431'}
    const testGetCoinXYForLiquidity = async () => {
      const result = await contractStore.getCoinXYForLiquidity({
        coinX: TOKENS['BTC'],
        coinY: TOKENS['ETH'],
        liquidity: '8424113.0037224934431'
      })
    }

    const toAddLiquidity = async () => {
      // const coinXAmount = '1'

      const payload = await contractStore.createAddLiquidityTransactionPayload({
        coinX: TOKENS['BTC'],
        coinY: TOKENS['ETH'],
        coinXAmount: '1',
        coinYAmount: '7.096568',
        slippage: 0.1
      })
      const tx = await wallet.value.currentWallet.signAndSubmitTransaction(payload)
    }

    const getCoinInfos = async () => {
      const result = await contractStore.getCoinInfos()
    }

    const testGetMyLpList = async () => {
      const result = await contractStore.getMyLpList(wallet.value.address)
    }

    // 0x453b073e4f541806dbc999823aa0c9f25ab9f759b0cd1d3840bfd58eee231526
    const test0921 = async () => {
      const tx = await wallet.value.currentWallet.signAndSubmitTransaction(
        {
          function: '0x5efac8e9c1cc1e290186442953ef651bfdd59b83059f375f5dd149c719edad34::faucet::request',
          type_arguments: ['0x5efac8e9c1cc1e290186442953ef651bfdd59b83059f375f5dd149c719edad34::coins::USDT'],
          arguments: ['0x5efac8e9c1cc1e290186442953ef651bfdd59b83059f375f5dd149c719edad34'],
          type: 'entry_function_payload'
        },
        { maxGasAmount: '5000', gasUnitPrice: '100' }
      )
    }

    const themeStore = useTheme()

    return {
      wallet,
      walletList,
      toConnect,
      toDisconnect,
      toTestTransaction,
      testCalculateRates,
      testCalculatePriceImpact,
      toSwap,
      testGetLiquidityAndCoinYByCoinX,
      testGetCoinXYForLiquidity,
      toAddLiquidity,
      getCoinInfos,
      testGetMyLpList,
      test0921,
      themeStore
    }
  }
})
</script>
<style lang="less" scoped>
.wallet-test-container {
  color: #fff;
  .test-color {
    color: @themeColor;
  }
}
</style>
