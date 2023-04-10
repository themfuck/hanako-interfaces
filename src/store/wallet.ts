import { defineStore } from 'pinia'
import { BaseWalletAdapter } from '@/wallet/BaseAdapter'
const AUTO_REFRESH_TIME = 5
export const useWalletStore = defineStore('wallet', {
  state: () => {
    return {
      loading: false,
      autoRefreshTime: AUTO_REFRESH_TIME,
      countdown: 0,
      connected: false,
      aptosConnected: false,
      suiConnected: false,
      address: '',
      aptosAddress: '',
      suiAddress: '',
      platform: '',
      isShowWalletModal: false,
      walletName: '',
      aptosWalletName: '',
      suiWalletName: '',
      currentWallet: null as any,
      aptosCurrentWallet: null as any,
      suiCurrentWallet: null as any,
      walletIcon: '',
      aptosWalletIcon: '',
      suiWalletIcon: '',
      switchWallet: false,
      assets: {},
      walletIconName: '',
      aptosWalletIconName: '',
      suiWalletIconName: '',
      walletNetwork: ''
    }
  },
  actions: {
    setLoading(loading: boolean) {
      if (loading) {
        this.countdown = AUTO_REFRESH_TIME
      }
      this.loading = loading
      if (!loading) {
        this.countdown = 0
      }
    },
    setCountdown(countdown: any) {
      this.countdown = countdown
    },
    setWalletStatus() {
      this.connected = true
    },
    setSwitchWallet(status) {
      this.switchWallet = status
    },
    setIsShowWalletModal(status) {
      this.isShowWalletModal = status
    },
    setWalletInfo(status, walletName) {
      this.connected = status
      this.platform = walletName
    },
    setCurrentWallet(data) {
      if (data.wallet) {
        this.currentWallet = data.wallet
        this.connected = data.isConnected
        this.address = data.account
        this.walletIcon = data.icon
        this.walletName = data.wallet.name
        if (data.platform === 'Sui') {
          this.suiCurrentWallet = data.wallet
          this.suiConnected = data.isConnected
          this.suiAddress = data.account
          this.suiWalletIcon = data.icon
          this.suiWalletName = data.walletName
          this.walletName = data.walletName
        } else {
          this.aptosCurrentWallet = data.wallet
          this.aptosConnected = data.isConnected
          this.aptosAddress = data.account
          this.aptosWalletIcon = data.icon
          this.aptosWalletName = data.wallet.name
        }
      } else {
        this.currentWallet = null
        this.connected = false
        this.address = ''
        this.walletIcon = ''
        this.walletName = ''
        if (data.platform === 'Sui') {
          this.suiCurrentWallet = null
          this.suiConnected = false
          this.suiAddress = ''
          this.suiWalletIcon = ''
          this.suiWalletName = ''
        } else {
          this.aptosCurrentWallet = null
          this.aptosConnected = false
          this.aptosAddress = ''
          this.aptosWalletIcon = ''
          this.aptosWalletName = ''
        }
      }
    },
    setAssets(data) {
      this.assets = data
    },
    setWalletIconName(value) {
      this.walletIconName = value
      localStorage.setItem('walletIconName', value)
    },
    setNetwork(value) {
      this.walletNetwork = value
    }
  }
})
