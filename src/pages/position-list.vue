<template>
  <div
    :class="
      (list && list.length === 0 && wallet.connected) || !wallet.connected
        ? 'position-center position-list-container'
        : 'position-list-container'
    "
  >
    <Back />
    <div class="position-title">
      <div>
        Your Positions
        <span v-if="list && list.length > 0 && wallet.connected">({{ list && list.length }})</span>
      </div>
      <svg aria-hidden="true" :class="refresh ? 'refresh refresh-icon ' : 'refresh-icon'" @click="clickRefresh">
        <use xlink:href="#icon-icon-refresh" />
      </svg>
    </div>
    <div v-if="list && list.length > 0 && wallet.connected" class="position-list">
      <PositionItem v-for="(pItem, index) in list" :key="index" :p-item="pItem"></PositionItem>
    </div>
    <div v-if="list && list.length === 0 && wallet.connected" class="no-data">
      <img src="@/assets/image/img-no-Positions@2x.png" alt="" />
      <span>No data</span>
    </div>
    <div v-if="!wallet.connected" class="no-data">
      <img src="@/assets/image/img-connect-wallet@2x.png" alt="" />
      <a-button class="connect-wallet" @click="wallet.setIsShowWalletModal(true)">Connect Wallet</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, reactive } from 'vue'
import { useWalletStore } from '../store/wallet'

export default defineComponent({
  setup() {
    const loading = ref(false)
    const refresh = ref(false)
    const clickRefresh = () => {
      refresh.value = true
      setTimeout(() => {
        refresh.value = false
      }, 1000)
    }
    let list = reactive([
      {
        name: 'CUSDT-CUSDC',
        fee: '0.0001',
        swap_account: '6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR',
        token_a: {
          symbol: 'CUSDT',
          name: 'CUSDT',
          token_mint: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
          swap_token_account: 'EPyDSacqb9PH4SoXFov21VPnVSdMBw4N4aQurC89k8ei',
          decimal: 8,
          show_decimal: 4,
          calculate_decimal: 6
        },
        token_b: {
          symbol: 'CUSDC',
          name: 'CUSDC',
          token_mint: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
          swap_token_account: 'EDSWfuCTcCNXM5WeMZntLkQUjZuXeCp6mEKe5FbEXNX',
          decimal: 8,
          show_decimal: 4,
          calculate_decimal: 6
        },
        price_interval: { lower_price: '0.995', upper_price: '1.0004' },
        version: 2,
        tokenSwapKey: '6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR',
        accountType: 0,
        isInitialized: 1,
        nonce: 255,
        tokenProgramId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        manager: 'AYKFAKqx6ZWWC6Hkr4Csj3AcwLxCyLpq1tRk5TRWwqyz',
        managerTokenA: 'FQEcvmkiiP95pkJ1s17qe6P5nGZtXFph45eeSggmQRni',
        managerTokenB: 'Ch5BksXMFLGQ6CcL2dD8MACy1JsNAr5bQWfqKS5DEFTJ',
        swapTokenA: 'EPyDSacqb9PH4SoXFov21VPnVSdMBw4N4aQurC89k8ei',
        swapTokenB: 'EDSWfuCTcCNXM5WeMZntLkQUjZuXeCp6mEKe5FbEXNX',
        tokenAMint: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
        tokenBMint: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
        ticksKey: '25SMMLkn91997idMeyHSQCKHLdyAK5xgc2xy9y1ErrRL',
        positionsKey: 'CeLGR1idhpsdym3LFm9oodFa5fkWSmGjJ1CW9SGyfzvD',
        curveType: 0,
        managerFee: '0.00002',
        tickSpace: 1,
        currentSqrtPrice: '0.999768630519',
        currentLiquity: '246658087861075202',
        feeGrowthGlobal0: '0.0000133953863346',
        feeGrowthGlobal1: '0.0000126495577595',
        managerFeeA: '782334664',
        managerFeeB: '408082167',
        feeView: 0.01,
        currentPriceView: 0.9995373145698367,
        currentPriceViewReverse: '1.000462899607067',
        index: '3',
        positionId: 'DRvEJ1CuxMxX6eCQfEoCPddgu7dFi8zqLZQPTxhroStV',
        lowerTick: -50,
        upperTick: 4,
        liquity: '',
        feeGrowthInsideALast: '0.0000133914429271',
        feeGrowthInsideBLast: '0.0000126457075474',
        tokenAFee: '0',
        tokenBFee: '0',
        minPrice: '0.99501272792',
        maxPrice: '1.00040006000',
        nftTokenAccount: 'BLvMkGTn2GBhb375BSgZKCgRhrDfBry6v2DtKfmVXJjW',
        nftTokenMint: 'DRvEJ1CuxMxX6eCQfEoCPddgu7dFi8zqLZQPTxhroStV'
      },
      {
        name: 'CUSDT-CUSDC',
        fee: '0.0001',
        swap_account: '6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR',
        token_a: {
          symbol: 'CUSDT',
          name: 'CUSDT',
          token_mint: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
          swap_token_account: 'EPyDSacqb9PH4SoXFov21VPnVSdMBw4N4aQurC89k8ei',
          decimal: 8,
          show_decimal: 4,
          calculate_decimal: 6
        },
        token_b: {
          symbol: 'CUSDC',
          name: 'CUSDC',
          token_mint: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
          swap_token_account: 'EDSWfuCTcCNXM5WeMZntLkQUjZuXeCp6mEKe5FbEXNX',
          decimal: 8,
          show_decimal: 4,
          calculate_decimal: 6
        },
        price_interval: { lower_price: '0.995', upper_price: '1.0004' },
        version: 2,
        tokenSwapKey: '6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR',
        accountType: 0,
        isInitialized: 1,
        nonce: 255,
        tokenProgramId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        manager: 'AYKFAKqx6ZWWC6Hkr4Csj3AcwLxCyLpq1tRk5TRWwqyz',
        managerTokenA: 'FQEcvmkiiP95pkJ1s17qe6P5nGZtXFph45eeSggmQRni',
        managerTokenB: 'Ch5BksXMFLGQ6CcL2dD8MACy1JsNAr5bQWfqKS5DEFTJ',
        swapTokenA: 'EPyDSacqb9PH4SoXFov21VPnVSdMBw4N4aQurC89k8ei',
        swapTokenB: 'EDSWfuCTcCNXM5WeMZntLkQUjZuXeCp6mEKe5FbEXNX',
        tokenAMint: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
        tokenBMint: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
        ticksKey: '25SMMLkn91997idMeyHSQCKHLdyAK5xgc2xy9y1ErrRL',
        positionsKey: 'CeLGR1idhpsdym3LFm9oodFa5fkWSmGjJ1CW9SGyfzvD',
        curveType: 0,
        managerFee: '0.00002',
        tickSpace: 1,
        currentSqrtPrice: '0.999768630519',
        currentLiquity: '246658087861075202',
        feeGrowthGlobal0: '0.0000133953863346',
        feeGrowthGlobal1: '0.0000126495577595',
        managerFeeA: '782334664',
        managerFeeB: '408082167',
        feeView: 0.01,
        currentPriceView: 0.9995373145698367,
        currentPriceViewReverse: '1.000462899607067',
        index: '58',
        positionId: '3XLR74hZpFVGKMNwoedHccq99LR5wP3gmSueSW6pjSks',
        lowerTick: -50,
        upperTick: 4,
        liquity: '232423209336',
        feeGrowthInsideALast: '0.0000133914429271',
        feeGrowthInsideBLast: '0.0000126457075474',
        tokenAFee: '0',
        tokenBFee: '0',
        minPrice: '0.99501272792',
        maxPrice: '1.00040006000',
        nftTokenAccount: '7TNUCpcZfFoTNDPynwGHRpjuvZAz9sYAeoxz2JteioxF',
        nftTokenMint: '3XLR74hZpFVGKMNwoedHccq99LR5wP3gmSueSW6pjSks'
      },
      {
        name: 'FUSDT-FUSDC',
        fee: '0.0001',
        swap_account: 'BfE9ULrwezFZ1MEJJbsfc5aCSwJxzpbzwBPHPtBkZmxg',
        token_a: {
          symbol: 'FUSDT',
          name: 'FUSDT',
          token_mint: 'Dnaoqp4Erw1iAhbLnh1SW7fGkGGcCAoLCAuXz8m27EjB',
          swap_token_account: '6QWNEREW7PUMXGPb4fkmXXtETWKuAKX55UAEPyMfxaas',
          decimal: 9,
          show_decimal: 4,
          icon: 'https://archive.crema.finance/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
        },
        token_b: {
          symbol: 'USDC',
          name: 'USD Coin',
          token_mint: 'Ap4nbtHLUbUedzKQnEGu5EQcgfonVsCX3pWdZgKq8GwH',
          swap_token_account: 'BntG1ST8owGCUsWWuABwuDqdMVkC6LxXxdGbHzyhfRtr',
          decimal: 9,
          show_decimal: 4,
          icon: 'https://archive.crema.finance/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        version: 2,
        tokenSwapKey: 'BfE9ULrwezFZ1MEJJbsfc5aCSwJxzpbzwBPHPtBkZmxg',
        accountType: 0,
        isInitialized: 1,
        nonce: 255,
        tokenProgramId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        manager: 'GcuwE8qWHRYtFYMAGUizLTouwx6DbCVdCrrsyHVzv6rc',
        managerTokenA: '4HHFzPkHTqwW5FF4wZ4pdkQjEQhZh4i7v1bJU7jT6dYQ',
        managerTokenB: 'HUw3MqNhH8ndpxkyMDo7fQEncApVKHaMka2K5YaNPjQB',
        swapTokenA: '6QWNEREW7PUMXGPb4fkmXXtETWKuAKX55UAEPyMfxaas',
        swapTokenB: 'BntG1ST8owGCUsWWuABwuDqdMVkC6LxXxdGbHzyhfRtr',
        tokenAMint: 'Dnaoqp4Erw1iAhbLnh1SW7fGkGGcCAoLCAuXz8m27EjB',
        tokenBMint: 'Ap4nbtHLUbUedzKQnEGu5EQcgfonVsCX3pWdZgKq8GwH',
        ticksKey: 'FgBAxk1HYDyHRsfF2XHeMdTRK2qTR8GPN8d8UEdJviWz',
        positionsKey: '6FDJhMdTnzzNb1LdXEDieUo3UXGRB29pCpP2bb1KAKW5',
        curveType: 0,
        managerFee: '0.00002',
        tickSpace: 5,
        currentSqrtPrice: '0.999948025128',
        currentLiquity: '156635041254653013',
        feeGrowthGlobal0: '0.0000000056366475',
        feeGrowthGlobal1: '0.0000000014780232',
        managerFeeA: '172200000',
        managerFeeB: '45100426',
        feeView: 0.01,
        currentPriceView: 0.9998960529573874,
        currentPriceViewReverse: '1.0001039578487236',
        index: '52',
        positionId: 'DtX8hUnYTyde28r1ixv73eW483Sk1wat1VeDjLrLyzEc',
        lowerTick: -7,
        upperTick: 3,
        liquity: '69321061064116',
        feeGrowthInsideALast: '0.0000000056366475',
        feeGrowthInsideBLast: '0.0000000014780232',
        tokenAFee: '0',
        tokenBFee: '0',
        minPrice: '0.99930027991',
        maxPrice: '1.00030003000',
        nftTokenAccount: '76PRDdT8qiVG6UzxYVtdE8p6pcN9PReHQmRyctUKRC2S',
        nftTokenMint: 'DtX8hUnYTyde28r1ixv73eW483Sk1wat1VeDjLrLyzEc'
      }
    ])
    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })
    return { wallet, list, loading, clickRefresh, refresh }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
.position-list-container {
  width: 440px;
  height: 100%;
  margin: 0px auto;
  .back {
    > svg {
      width: 20px;
      height: 20px;
      fill: @textActive;
    }
  }
  .position-title {
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      font-size: 20px;
      font-weight: 400;
      color: @textActive;
      span {
        font-size: 14px;
        font-weight: 400;
        color: @textDefault;
      }
    }
    .refresh-icon {
      width: 16px;
      height: 16px;
      fill: @textEffect;
    }
    .refresh {
      animation: spin 1s linear infinite;
    }
    // > svg {
    //   width: 16px;
    //   height: 16px;
    //   fill: @textActive;
    // }
  }
  .position-list {
    margin-top: 16px;
  }
  .no-data {
    margin-top: 16px;
    width: 100%;
    height: 240px;
    display: flex;
    flex-direction: column;
    background: #121212;
    text-align: center;
    img {
      width: 116px;
      height: 116px;
      margin: 40px auto 0;
    }
    span {
      margin-top: 20px;
      font-size: 14px;
      font-weight: 400;
      color: @textActive;
    }
    .connect-wallet {
      width: 120px;
      height: 24px;
      line-height: 1;
      padding: 0;
      margin: 20px auto 0;
    }
  }
}
.position-center {
  height: 400px;
}
@media (max-width: 750px) {
  .position-list-container {
    width: 100%;
  }
}
</style>
