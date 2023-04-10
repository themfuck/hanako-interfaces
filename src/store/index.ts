import { defineStore } from 'pinia'
import { useNuxtApp, useFetch } from '#app'
import { i18n } from '@/plugins/i18n'
import Cookies from 'cookies-ts'
import config from '@/utils/config'

const cookies = new Cookies()

export const useIndexStore = defineStore('index', {
  state: () => {
    return {
      slippage: localStorage.getItem('cetus-slippage') || '0.5',
      isShowSuccess: false,
      isShowRejected: false,
      isShowWaiting: false,
      currentTransactionDesc: '',
      currentTransactionTxid: '',
      theme: '',
      chainName: '',
      positionNum: 0,
      statsData: {},
      topPoolsList: [],
      topTokensList: [],
      lang: cookies.get('lang') || 'en',
      addressLpTokens: {},
      transactionList: JSON.parse(localStorage.getItem('transactionList') || '[]') || []
    }
  },
  actions: {
    copy(text: string) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
      } else {
        const inp = document.createElement('input')
        inp.readOnly = true
        document.body.appendChild(inp)
        inp.value = text
        inp.select()
        document.execCommand('Copy')
        document.body.removeChild(inp)
      }
      const { $notify } = useNuxtApp()
      $notify.success({
        icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-icon-change1' })]),
        duration: 4.5,
        message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: i18n.global.t('tips.copySuccess') }, null)]),
        class: 'ant-notification-copy'
      })

      // $notify.success({
      //   icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-icon-change1' })]),
      //   message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: 'Swap' }, null)]),
      //   description: h('div', { class: 'notification-title' }, [
      //     h('div', { class: 'notification-text', innerHTML: 'Swap 1.0001 APTOS' }, null),
      //     h('a', { href: 'www.baidu.com', innerHTML: 'View transaction' }, null)
      //   ]),
      //   // duration: 4.5,
      //   class: 'ant-notification-copy ant-notification-swap'
      // })

      // $notify.warning({
      //   icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-icon-tips' })]),
      //   message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: 'Transaction hasn’t been sent' }, null)]),
      //   class: 'ant-notification-copy ant-notification-warning'
      // })

      // $notify.success({
      //   icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-icon-loading' })]),
      //   message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: 'Transaction in progress' }, null)]),
      //   description: h('div', { class: 'notification-title' }, [
      //     h(
      //       'div',
      //       { class: 'notification-text', innerHTML: 'Confirmation is in progress.Check your transaction on  <a href="">here</a>' },
      //       null
      //     )
      //   ]),
      //   // duration: 4.5,
      //   class: 'ant-notification-loading ant-notification-copy'
      // })

      // $notify.error({
      //   icon: h('svg', { class: { icon: true }, 'aria-hidden': true }, [h('use', { 'xlink:href': '#icon-a-icon-Shutdown' })]),
      //   message: h('div', { class: 'notification-title' }, [h('span', { innerHTML: 'Swap failed' }, null)]),
      //   description: 'Something went wrong',
      //   // duration: 4.5,
      //   class: 'ant-notification-copy ant-notification-error'
      // })
    },
    setSlippage(slippage) {
      this.slippage = slippage
      localStorage.setItem('cetus-slippage', slippage)
    },
    setPositiomNum() {
      this.positionNum = this.positionNum + 1
    },
    setTheme(theme) {
      this.theme = theme
      if (theme == 'default') {
        this.chainName = 'Aptos'
        localStorage.setItem('chainName', 'Aptos')
      } else if (theme == 'sui') {
        this.chainName = 'Sui'
        localStorage.setItem('chainName', 'Sui')
      } else if (theme == 'sui2') {
        this.chainName = 'Sui2'
        localStorage.setItem('chainName', 'Sui2')
      }
    },
    setIsShowSuccess(status) {
      this.isShowSuccess = status
    },
    setIsShowRejected(status) {
      this.isShowRejected = status
    },
    setIsShowWaiting(status) {
      this.isShowWaiting = status
    },
    setTransactionDesc(status) {
      this.currentTransactionDesc = status
    },
    setTransactionTxid(status) {
      this.currentTransactionTxid = status
    },
    async getStatsData() {
      const result: any = []
      const poolsList: any = []
      const tokensList: any = []
      let addressLpTokens: any = []
      // await useFetch(`${config.api}/v1/swap/count`, {
      //   onResponse({ request, response, options }) {
      //     result = response._data.data
      //     poolsList = response._data.data.pools
      //     tokensList = response._data.data.tokens
      //   }
      // })
      const { data } = await fetch(`${config[this.chainName || 'Aptos'].api}/v1/swap/count`).then(rsp => rsp.json())
      this.statsData = data
      this.topPoolsList = data.pools
      this.topTokensList = data.tokens
      addressLpTokens = Object.fromEntries(data.pools.map(item => [item.name, item]))
      this.addressLpTokens = addressLpTokens
      // rsp.json()
    },
    setLang(status) {
      cookies.set('lang', status)
      this.lang = status
    },
    setTransactionList(trans) {
      this.transactionList.push(trans)
      localStorage.setItem('transactionList', JSON.stringify(this.transactionList))
    },
    clearTransactionList() {
      // this.transactionList = []
      const list = this.transactionList.filter(ele => {
        return ele.chainName !== this.chainName
      })
      this.transactionList = list
      localStorage.setItem('transactionList', list.length > 0 ? JSON.stringify(list) : '')
    }
  }
})
