<template>
  <Modal :width="440" :visible="true" class="request-modal" title="Request Coins" :footer="null" centered @cancel="$emit('onClose')">
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="request-title">
      You need {{ storeCounter.theme == 'default' ? 'Aptos' : 'Sui' }} faucet coins to receive our test coins.
    </div>
    <div class="top">
      <div class="left">
        <img src="../assets/image/icon-white-tips.png" alt="" />
      </div>
      <div class="right">
        To get {{ storeCounter.theme == 'default' ? 'Aptos' : 'Sui' }} faucets, please request them inside your wallet extension.
      </div>
    </div>
    <div class="bottom">
      <div v-for="item in list" :key="item.name" class="item">
        <!-- <img :src="importIcon(`/image/coins/${item.name.toLowerCase()}.png`)" alt="" /> -->
        <img :src="item.icon" alt="" />
        <span>&nbsp;&nbsp;{{ item.name }}&nbsp;:&nbsp;{{ item.num }}</span>
      </div>
    </div>
    <a-button :disabled="!wallet.connected ? false : loading || !start" class="big-btn request-btn" @click="toGetCoin">
      <span>{{ !wallet.connected ? 'Connect Wallet' : 'Request' }}</span>
      <span v-if="!start && wallet.connected">{{ hour }}:{{ min }}:{{ sec }}</span>
    </a-button>
    <!-- <div v-if="requestError" class="request-error">
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
      <p class="error">Insufficient APTOS balance</p>
    </div> -->
  </Modal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, watchEffect } from 'vue'
import { Modal } from 'ant-design-vue'
import { TOKENS } from '@/utils/tokens'
import importIcon from '@/utils/import-icon'
import { useWalletStore } from '@/store/wallet'
import { useNuxtApp } from '#app'
import useContract from '@/composables/useContract'
import useSuiContract from '@/composables/useSuiContract'
import { useIndexStore } from '@/store'
export default defineComponent({
  components: { Modal },
  setup(props, ctx) {
    const contractStore = useContract()
    const suiContract = useSuiContract()
    const counter = useIndexStore()
    const storeCounter = computed(() => {
      return counter
    })
    const requestError = ref(false)

    const list = computed(() => {
      if (storeCounter.value.chainName !== 'Aptos') {
        return [
          {
            name: 'USDT',
            // eslint-disable-next-line max-len
            icon: 'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdt::USDT/icon.png',
            num: '200'
          },
          {
            name: 'USDC',
            num: '200',
            // eslint-disable-next-line max-len
            icon: 'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdc::USDC/icon.png'
          },
          {
            name: 'ETH',
            num: '0.1',
            // eslint-disable-next-line max-len
            icon: 'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::eth::ETH/icon.png'
          },
          {
            name: 'BTC',
            num: '0.01',
            // eslint-disable-next-line max-len
            icon: 'https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::btc::BTC/icon.png'
          }
        ]
      } else {
        return [
          {
            name: 'USDT',
            // eslint-disable-next-line max-len
            icon: 'https://archive.cetus.zone/assets/mainnet/0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT/icon.png',
            num: '200'
          },
          {
            name: 'cUSDC',
            num: '200',
            // eslint-disable-next-line max-len
            icon: 'https://archive.cetus.zone/assets/mainnet/0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC/icon.png'
          },
          {
            name: 'ETH',
            num: '0.1',
            // eslint-disable-next-line max-len
            icon: 'https://archive.cetus.zone/assets/mainnet/0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin/icon.png'
          },
          {
            name: 'BTC',
            num: '0.01',
            // eslint-disable-next-line max-len
            icon: 'https://archive.cetus.zone/assets/mainnet/0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WbtcCoin/icon.png'
          }
        ]
      }
    })
    const { $notify } = useNuxtApp()
    const walletSotre = useWalletStore()
    const wallet = computed(() => {
      return walletSotre
    })

    const { setIsShowSuccess, setIsShowRejected, setIsShowWaiting, setTransactionDesc, setTransactionTxid } = counter
    const start = ref(false)
    const loading = ref(false)
    const toGetCoin = async () => {
      if (!wallet.value.connected) {
        wallet.value.setIsShowWalletModal(true)
      } else {
        // ctx.emit('onClose')
        loading.value = true
        setTransactionTxid('')
        setTransactionDesc('')
        setIsShowWaiting(true)
        try {
          const payload = contractStore.getCoin('all')
          let tx
          if (storeCounter.value.chainName === 'Aptos') {
            tx = await wallet.value.currentWallet.signAndSubmitTransaction(payload)
          } else {
            const res = await wallet.value.currentWallet.signAndExecuteTransaction(payload)
            console.log('1220###request coin###res###', res)
            tx = contractStore.handleTx(res)
            console.log('1220###request coin###tx###', tx)
          }

          if (tx) {
            start.value = false
            setTransactionTxid(tx.hash)
            setIsShowWaiting(false)
            setIsShowSuccess(true)
            const params = {
              title: 'Request Coins',
              desc: '',
              hash: tx.hash,
              sender: wallet.value.address,
              descTransactions: 'Request Coins',
              chainName: storeCounter.value.chainName
            }
            contractStore.showTransitionPending(params)
            const transitionStatus = await contractStore.watchTransaction(params)
            if (storeCounter.value.chainName === 'Aptos') {
              getTimes(wallet.value.address)
              if (transitionStatus) {
                setTimeout(() => {
                  contractStore.getAccount(wallet.value.address)
                  getTimes(wallet.value.address)
                }, 1000)
              }
            } else {
              if (transitionStatus) {
                setTimeout(() => {
                  contractStore.getAccount(wallet.value.address)
                  ctx.emit('onClose')
                }, 1000)
              }
            }
          } else {
            setIsShowWaiting(false)
            // setIsShowRejected(true)
            $notify.error({
              icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-a-icon-Shutdown' })]),
              duration: 4.5,
              message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: 'Request Coins Failed' }, null)]),
              description: 'Something went wrong',
              class: 'ant-notification-copy ant-notification-error'
            })
          }
          loading.value = false
        } catch (error) {
          console.log('1220####request coin###error####', error)
          loading.value = false
          setIsShowWaiting(false)
          // setIsShowRejected(true)
          $notify.error({
            icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-a-icon-Shutdown' })]),
            message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: 'Request Coins Failed' }, null)]),
            duration: 4.5,
            description: 'Something went wrong',
            class: 'ant-notification-copy ant-notification-error'
          })
        }
      }
    }
    // onMounted(() => {
    //   if (wallet.value.address) {
    //     getTimes(wallet.value.address)
    //     // getBalance()
    //   }
    // })
    const startTime = ref(0)
    const endTime = ref(0)
    const hour: string | number = ref('--')
    const min: string | number = ref('--')
    const sec: string | number = ref('--')
    const getTimes = async account => {
      const date = new Date().getTime()
      try {
        const t = await contractStore.getFaucetAllLimit(account)
        if (t) {
          start.value = false
          startTime.value = t * 1000 //16:00
          endTime.value = (Number(t) + 43200) * 1000
        } else {
          start.value = true
        }
        if (date > endTime.value) {
          start.value = true
        }
        if (date > startTime.value && date < endTime.value) {
          let timer = window.setInterval(() => {
            countDown(endTime.value)
            const dateIn = new Date().getTime()
            if (dateIn > endTime.value) {
              start.value = true
              getTimes(account)
              clearInterval(timer)
            }
          }, 1000)
        }
      } catch (error) {
        start.value = true
        console.log(error, 'requesrCoinsError')
      }
    }

    watchEffect(async () => {
      if (wallet.value.address) {
        getTimes(wallet.value.address)
        // getBalance()
      }
    })
    const countDown = time => {
      let nowTime = new Date().getTime()
      let inputTime = time
      let times: string | number = (inputTime - nowTime) / 1000
      let d: string | number = parseInt(String(times / 60 / 60 / 24))
      d = d < 10 ? '0' + d : d
      let h: string | number = parseInt(String((times / 60 / 60) % 24))
      h = h < 10 ? '0' + h : h
      let m: string | number = parseInt(String((times / 60) % 60))
      m = m < 10 ? '0' + m : m
      let s: string | number = parseInt(String(times % 60))
      s = s < 10 ? '0' + s : s
      hour.value = h
      min.value = m
      sec.value = s
    }
    const aptosBalance = ref('0')
    return {
      storeCounter,
      wallet,
      importIcon,
      TOKENS,
      list,
      requestError,
      toGetCoin,
      start,
      hour,
      min,
      sec,
      loading,
      aptosBalance
    }
  }
})
</script>
<style lang="less">
@import '../assets/css/base.less';
.request-modal {
  .request-title {
    color: @textActive;
  }
  .top {
    margin-top: 20px;
    height: 88px;
    width: 100%;
    border: 1px solid @borderDefault;
    display: flex;
    align-items: center;
    background: #181818;
    padding: 24px 16px;
    .left {
      margin-right: 16px;
      img {
        width: 16px;
        height: 16px;
      }
    }
    .right {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
    }
  }
  .bottom {
    width: 100%;
    height: 88px;
    background: @cardTop;
    margin-top: 12px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      padding-left: 50px;
      img {
        width: 24px;
        height: 24px;
      }
      color: @themeColor;
    }
  }
  .request-btn {
    display: flex;
    align-items: center;
    height: 40px !important;
    span {
      &:nth-child(2) {
        margin-left: 8px;
        font-size: 12px !important;
        margin-bottom: 0 !important;
      }
    }
  }
  .request-error {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    svg {
      width: 16px;
      height: 16px;
      fill: #ff6868;
      margin-right: 5px;
    }
    p {
      color: #ff6868;
      font-size: 14px;
      margin-bottom: 0 !important;
    }
  }
}
@media (max-width: 750px) {
  .request-modal {
    width: 100%;
    .bottom {
      .item {
        padding-left: 22px;
      }
    }
  }
}
</style>
