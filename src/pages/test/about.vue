<template>
  <div>
    <!-- <Address v-if="isShowAddress" :from-coins="fromCoin" :to-coins="toCoin" @onClose="isShowAddress = false" /> -->
    <SwapSetting v-if="isShowSwapSetting" @onClose="isShowSwapSetting = false" />
    <!-- <CoinSelect v-if="isShowCoinSelect" @onClose="isShowCoinSelect = false"></CoinSelect> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, watchEffect, reactive } from 'vue'
export default defineComponent({
  setup() {
    const { count, list } = useTestList()
    const fromCoin = reactive({
      symbol: 'CUSDT',
      name: 'CUSDT',
      token_mint: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
      swap_token_account: 'EPyDSacqb9PH4SoXFov21VPnVSdMBw4N4aQurC89k8ei',
      decimal: 8,
      show_decimal: 4,
      calculate_decimal: 6
    })
    const toCoin = reactive({
      symbol: 'CUSDC',
      name: 'CUSDC',
      token_mint: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
      swap_token_account: 'EDSWfuCTcCNXM5WeMZntLkQUjZuXeCp6mEKe5FbEXNX',
      decimal: 8,
      show_decimal: 4,
      calculate_decimal: 6
    })
    const isShowAddress = ref(true)
    const isShowSwapSetting = ref(true)
    const isShowCoinSelect = ref(true)
    return {
      fromCoin,
      toCoin,
      isShowAddress,
      isShowSwapSetting,
      isShowCoinSelect
    }
  }
})
</script>
