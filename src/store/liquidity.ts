import { defineStore } from 'pinia'
import useContract from '@/composables/useContract'
import config from '@/utils/config'
import { SUITOKENS, SUILPLIST } from '@/utils/data'

export const useLiquidityStore = defineStore('liquidity', {
  state: () => {
    return {
      currentPositionInfo: {},
      liquidityList: [],
      myLplist: [],
      tokens: {},
      lpTokens: {},
      cmmLpTokens: [],
      addressLpTokens: {},
      addressTokens: {}
    }
  },
  actions: {
    setCurrentLiquidity(liquidityInfo) {
      this.currentPositionInfo = liquidityInfo
    },
    setLiquidityList(data) {
      this.liquidityList = data
    },
    async setMyLplist(account) {
      const contractStore = useContract()
      const lpBaseList = Object.values(this.lpTokens)
      const poolObjectIdList = lpBaseList.map((item: any) => {
        return item.address
      })
      const mylpList = await contractStore.getMyLpList(account, poolObjectIdList)
      const resultList: any = []
      console.log(mylpList, '====>mylpList')
      lpBaseList.forEach(item => {
        const myLpItem = mylpList.filter(litem => litem.address === item.address)[0]
        if (myLpItem) {
          resultList.push({
            ...item,
            ...myLpItem
          })
        } else {
          resultList.push({ ...item })
        }
      })

      this.myLplist = resultList.sort((a, b) => b.totalLpUSD - a.totalLpUSD)
    },
    async setTokens(data) {
      const result: any = {}
      data.forEach((item: any) => {
        result[item.symbol] = item
      })
      this.tokens = result
    },
    async getTokenList(chainName: string) {
      // if (chainName === 'Sui') {
      //   const result = Object.fromEntries(SUITOKENS.map(item => [item.symbol, item]))
      //   const addressResult = Object.fromEntries(SUITOKENS.map(item => [item.address, item]))
      //   this.tokens = result
      //   this.addressTokens = addressResult
      //   return
      // }

      let result: any = []
      let addressResult: any = []
      const res: any = await $fetch(
        `${config[chainName].api}/${chainName.toLowerCase() === 'sui2' ? 'sui' : chainName.toLowerCase()}/config/token-list`
      )
      const data = res.data
      if (data) {
        result = Object.fromEntries(data.map(item => [item.symbol, item]))
        addressResult = Object.fromEntries(data.map(item => [item.address, item]))
      }
      this.tokens = result
      this.addressTokens = addressResult
    },
    async getLpList(chainName: string) {
      let result: any = []
      let addressResult: any = []
      this.lpTokens = []

      // if (chainName === 'Sui') {
      //   result = Object.fromEntries(
      //     SUILPLIST.map((item: any) => [
      //       item.symbol,
      //       {
      //         ...item,
      //         fee: item.fee * 100
      //       }
      //     ])
      //   )

      //   addressResult = Object.fromEntries(
      //     SUILPLIST.map((item: any) => [
      //       item.address,
      //       {
      //         ...item,
      //         fee: item.fee * 100
      //       }
      //     ])
      //   )

      //   this.lpTokens = result
      //   this.addressLpTokens = addressResult
      //   return
      // }

      const res: any = await $fetch(
        `${config[chainName].api}/${chainName.toLowerCase() === 'sui2' ? 'sui' : chainName.toLowerCase()}/config/lp-list`
      )
      const data = res.data
      if (data) {
        result = Object.fromEntries(
          data.map(item => [
            item.symbol,
            {
              ...item,
              fee: item.fee * 100
            }
          ])
        )
        addressResult = Object.fromEntries(
          data.map(item => [
            item.address,
            {
              ...item,
              fee: item.fee * 100
            }
          ])
        )
      }
      this.lpTokens = result
      this.addressLpTokens = addressResult
    },
    async getCmmLpList(chainName: string) {
      const res: any = await $fetch(
        `${config[chainName].cmmApi}/v2/${chainName.toLowerCase() === 'sui2' ? 'sui' : chainName.toLowerCase()}/config/lp-list`
      )
      this.cmmLpTokens = res.data || []
    },
    resetTokenAndLp() {
      this.currentPositionInfo = {}
      this.liquidityList = []
      this.myLplist = []
      this.tokens = {}
      this.lpTokens = {}
      this.addressLpTokens = {}
      this.addressTokens = {}
    }
  }
})
