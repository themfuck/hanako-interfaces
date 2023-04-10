<template>
  <template v-if="isLoading">
    <a-spin v-if="store.theme" class="startLoading" />
  </template>
  <!-- <NuxtLoadingIndicator v-if="isLoading" height="100vh" color="red" throttle="12000" duration="200000" /> -->
  <div v-else class="default-container">
    <div class="header-container">
      <c-head />
    </div>
    <div class="body-container">
      <div class="body-container-bg">
        <div class="body-container-con">
          <NuxtPage />
        </div>
      </div>
    </div>
    <!-- <c-footer /> -->
    <Success v-if="store && store.isShowSuccess" @onClose="store.setIsShowSuccess(false)"></Success>
    <Rejected v-if="store && store.isShowRejected" @onClose="store.setIsShowRejected(false)"></Rejected>
    <Waiting v-if="store && store.isShowWaiting" @onClose="store.setIsShowWaiting(false)"></Waiting>
    <WalletModal
      v-if="wallet && wallet.isShowWalletModal"
      @onDisconnect="onDisconnect()"
      @onSwitch="onSwitch()"
      @onClose="wallet.setIsShowWalletModal(false)"
    ></WalletModal>
    <TermAndConditions v-if="showTerm" @close="closeTerm" />
  </div>
</template>
<script>
import { defineComponent, onBeforeUnmount } from '@vue/composition-api'
import CHead from './components/head.vue'
import { useIndexStore } from '../store/index'
import { useWalletStore } from '../store/wallet'
import { useLiquidityStore } from '@/store/liquidity'
import { TOKENS } from '@/utils/tokens'
import { useRouter, useRoute } from 'vue-router'
import useWalletProvider from '@/composables/useWalletProvider'
import configure from '@/utils/config'

export default defineComponent({
  components: { CHead },
  setup() {
    const isLoading = ref(true)
    const walletStore = useWalletStore()
    const route = useRoute()
    const themeStore = useTheme()
    onMounted(() => {
      if (route && route.query && route.query.source) {
        themeStore.seleteDefaultTheme()
      } else {
        const platform = route?.query?.chain
        const network = route?.query?.network
        const localTheme = platform || localStorage.getItem('theme')
        if (localTheme && localTheme.includes('sui')) {
          if (network === 'testnet' || localTheme === 'sui2') {
            themeStore.selectSui2Theme()
          } else {
            themeStore.selectSuiTheme()
          }
        } else {
          themeStore.seleteDefaultTheme()
        }
      }
      setTimeout(() => {
        isLoading.value = false
      }, 1000)
    })
    const contractStore = useContract()
    const { disconnect, currentWallet } = useWalletProvider()
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })
    const wallet = computed(() => {
      return walletStore
    })

    //------------------watch wallet network start
    if (window && window.aptos && window.aptos.onNetworkChange) {
      window?.aptos?.onNetworkChange(newNetwork => {
        walletStore.setNetwork(newNetwork.networkName)
      })
    }
    if (window && window.martian && window.martian.onNetworkChange) {
      window?.martian?.onNetworkChange(networkName => walletStore.setNetwork(networkName))
    }

    if (window && window.pontem && window.pontem.onNetworkChange) {
      window?.pontem?.onNetworkChange(newNetwork => {
        walletStore.setNetwork(newNetwork.name)
      })
    }

    //------------------watch wallet netword end
    counter.getStatsData()

    const liquidityStore = useLiquidityStore()
    const liquidity = computed(() => {
      return liquidityStore
    })
    let walletTimer = ref(null)

    watch(
      () => store.value.chainName,
      newValue => {
        if (newValue) {
          liquidityStore.getTokenList(newValue)
          liquidityStore.getLpList(newValue)
          if (newValue == 'Aptos') {
            liquidityStore.getCmmLpList(newValue)
          }
        }
      },
      {
        immediate: true
      }
    )
    const config = computed(() => {
      return configure[store.value.chainName]
    })
    const router = useRoute()
    watch(
      () => [router.path, configure[store.value.chainName], counter.lang, store.value.chainName],
      ([newValue, config, lang, chainName]) => {
        if (config && chainName == 'Aptos') {
          if (newValue == '/swap') {
            window.location.href = `${configure[store.value.chainName].cmmSite}/swap/?language=${lang}`
          }
          if (newValue == '/stats') {
            window.location.href = `${configure[store.value.chainName].cmmSite}/stats/?language=${lang}`
          }
          if (router.path && router.path.includes('pools-liquidity-add')) {
            window.location.href = `${configure[store.value.chainName].cmmSite}/?language=${lang}`
          }
        }
      },
      {
        immediate: true,
        deep: true
      }
    )

    // watch(
    //   () => wallet.value.address,
    //   newValue => {
    //     if (newValue) {
    //       contractStore.getAccount(newValue)
    //     }
    //   },
    //   {
    //     immediate: true
    //   }
    // )
    watchEffect(() => {
      if (wallet.value.address && store.value.chainName) {
        contractStore.getAccount(wallet.value.address)
      }
    })
    // onMounted(() => {
    // })

    const autoConnet = () => {
      const walletProvider = useWalletProvider()
      const chainName = localStorage.getItem('chainName')
      const walletName = localStorage.getItem(`cetus-${chainName}-current-wallet`)
      const walletIconName = localStorage.getItem(`cetus-${chainName}-wallet-icon-name`)
      const suiwalletName = localStorage.getItem(`cetus-${chainName}-current-suiwallet`)

      if (walletName) {
        walletProvider.connect(walletName, walletIconName, chainName, '', suiwalletName)
      } else if (chainName && chainName.toLowerCase().includes('sui')) {
        walletProvider.disconnect()
      }

      walletTimer.value = window.setInterval(async () => {
        if (wallet.value.address && !wallet.value.loading) {
          if (wallet && wallet.value.address) {
            if (wallet.value.countdown < wallet.value.autoRefreshTime) {
              walletStore.setCountdown(wallet.value.countdown + 1)
              if (wallet.value.countdown === wallet.value.autoRefreshTime) {
                try {
                  await contractStore.getAccount(wallet.value.address)
                } catch (error) {
                  console.log(error, 'errorBalance')
                }
              }
            }
          }
        }
      }, 10000)
    }

    watch(
      () => store.value.theme,
      newValue => {
        const chain = newValue === 'sui2' ? 'sui' : newValue
        document.getElementsByTagName('body')[0].className = `theme-${chain}`
        if (newValue) {
          autoConnet()
          isLoading.value = true
          setTimeout(() => {
            isLoading.value = false
          }, 2000)
        }
      },
      {
        immediate: true
      }
    )

    onBeforeUnmount(() => {
      window.clearInterval(walletTimer)
    })

    const onDisconnect = () => {
      walletStore.setIsShowWalletModal(false)
      disconnect()
    }
    const onSwitch = () => {
      walletStore.setSwitchWallet(true)
    }

    const showTerm = ref(false)
    const isFirstAccess = localStorage.getItem('isFirstAccess')
    if (!isFirstAccess) {
      showTerm.value = true
    }
    const closeTerm = () => {
      localStorage.setItem('isFirstAccess', true)
      showTerm.value = false
    }

    return {
      store,
      wallet,
      onSwitch,
      onDisconnect,
      isLoading,
      showTerm,
      closeTerm
    }
  }
})
</script>
<style lang="less" scoped>
@import '@/assets/css/base.less';
.theme-sui {
  .body-container {
    .body-container-bg {
      background: @backgroundColor url('/sui-image/img-bg@2x.png') center no-repeat !important;
      background-size: 1200px 600px !important;
    }
  }
}
.startLoading {
  width: 100% !important;
  height: 100vh !important;
  background: @backgroundColor;
  z-index: 999999;
  .ant-spin-dot-spin {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -50px;
    .ant-spin-dot-item {
      width: 30px !important;
      height: 30px !important;
      background-color: @themeColor;
    }
  }
}
.default-container {
  width: 100%;
  min-width: 1100px;
  // margin: 0 auto;
  height: 100vh;
  position: relative;
  background: @backgroundColor;
  .header-container {
    width: 100%;
    min-width: 1100px;
    position: static;
    // position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .body-container {
    // height: calc(100vh - 62px);
    width: 100%;
    height: 100%;
    padding-top: 62px;
    background: @backgroundColor;
    .body-container-bg {
      width: 100%;
      margin: 0 auto;
      height: 100%;
      background: @backgroundColor url('/image/img-bg@2x.png') center no-repeat;
      background-size: 1200px 600px;
      position: absolute;
      left: 50%;
      top: 0px;
      transform: translateX(-50%);
      padding-bottom: 40px;
      overflow: scroll;
      min-height: 100vh;
      .body-container-con {
        padding-top: 110px;
        display: flex;
        // align-items: center;
        justify-content: center;
      }
    }
  }
}
@media (max-width: 750px) {
  .theme-sui {
    .body-container {
      .body-container-bg {
        background: url('/sui-image/img-h5-bg@2x.png') center no-repeat !important;
        background-size: 375px 220px !important;
      }
    }
  }
  .default-container {
    width: 100%;
    min-width: unset;
    .header-container {
      width: 100%;
      min-width: unset !important;
      // padding-top: 20px;
      position: fixed !important;
      top: 0;
      left: 0;
    }
    .body-container {
      width: 100%;
      height: 100%;
      .body-container-bg {
        // position: unset;
        // transform: translate(0);
        // left: 0;
        // top: 0;
        width: 100%;
        height: 100%;
        background: @backgroundColor url('/image/img-h5-bg@2x.png') center no-repeat;
        background-size: 375px 220px;
        padding-bottom: 80px;
        .body-container-con {
          padding: 110px 18px 0;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
