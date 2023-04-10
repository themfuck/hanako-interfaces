<template>
  <div class="pools-position-list-container">
    <!-- <div class="top-card">
      <i class="tit">Become a Liquidity Provider</i>
      <div class="desc">Receive LP tokens and earn 0.25% trading fees</div>
      <a-button @click="router.push('/pools-liquidity-add')">Add Liquidity</a-button>
    </div> -->

    <a v-if="chainName == 'Aptos' && config" :href="`${config.cmmSite}/pools?language=${languageValue}`">
      <svg class="icon cmm-icon" aria-hidden="true">
        <use xlink:href="#icon-icon-back" />
      </svg>
    </a>
    <div class="position-title">
      <div>
        {{ $t('menu.pools') }}
        <!-- <span v-if="list && list.length > 0">({{ list && list.length }})</span> -->
      </div>
      <svg aria-hidden="true" :class="refresh ? 'refresh refresh-icon ' : 'refresh-icon'" @click="clickRefresh">
        <use xlink:href="#icon-icon-refresh" />
      </svg>
    </div>
    <a v-if="chainName == 'Aptos' && config" :href="`${config.cmmSite}/pools`" class="migrate-earn"></a>
    <!-- <div class="total-tvl">
      <i>TVL</i>
      <span v-if="totalTVL">$ {{ addCommom(totalTVL, 2) }}</span>
      <template v-else>
        <a-spin :indicator="indicator" />
      </template>
    </div> -->
    <div class="search-input">
      <input
        v-model="searchKey"
        onkeyup="value=value.replace(/[^A-Za-z0-9]+$/g,'')"
        :placeholder="$t('inputPlaceholder.liquidityPlaceholder')"
      />
      <div class="search-icon" @click="updateLpList(searchKey)"></div>
    </div>
    <div v-if="chainName === 'Aptos'" class="tab-list">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        class="item-container"
        :class="currentTab == item ? 'item-container-active item-container' : 'item-container'"
        @click="currentTab = item"
      >
        <div class="item">{{ item }}</div>
      </div>
    </div>
    <div v-if="!loading">
      <div v-if="list && list.length > 0" class="position-list">
        <PoolsPositionItem v-for="(pItem, index) in list" :key="index" :p-item="pItem"></PoolsPositionItem>
      </div>
      <div v-if="list && list.length <= 0" class="no-data">
        <img v-if="indexStore.theme == 'default'" src="../assets/image/img-no-Positions@2x.png" />
        <img v-else src="../assets/sui-image/img-no-Positions@2x.png" />
        <span>{{ $t('common.poolsNotFound') }}</span>
      </div>
    </div>
    <template v-else>
      <a-spin />
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, watchEffect, watch, onUnmounted } from 'vue'
import { useWalletStore } from '../store/wallet'
import { useRouter } from 'vue-router'
import { useLiquidityStore } from '@/store/liquidity'
import { useIndexStore } from '@/store/index'
import { addCommom, checkNullObj } from '@/utils'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import useContract from '@/composables/useContract'
import configure from '@/utils/config'

export default defineComponent({
  setup() {
    const { t, locale } = useI18n()
    const tabList = ref([t('tab.all'), t('tab.layerZero'), t('tab.wormhole'), t('tab.celer')])
    const currentTab = ref(t('tab.all'))
    const tabKey = ref('')
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '12px',
        color: '#fff',
        paddingBottom: '3px'
      },
      spin: true
    })
    const router = useRouter()
    const loading = ref(false)
    const refresh = ref(false)
    const searchKey = ref(null)
    const totalTVL = ref(0)
    const liquidityStore = useLiquidityStore()
    const languageValue = ref('')
    const liquidity = computed(() => {
      return liquidityStore
    })

    const indexStore = useIndexStore()
    const chainName = computed(() => {
      return indexStore.chainName
    })

    const list = ref([])
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })
    const clickRefresh = async () => {
      refresh.value = true
      liquidityStore.setMyLplist(wallet.value.address || '')
      counter.getStatsData()
      setTimeout(() => {
        refresh.value = false
      }, 1000)
    }
    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })

    watch(searchKey, newVal => {
      updateLpList(searchKey.value)
    })
    watch(currentTab, newVal => {
      if (newVal == t('tab.all')) {
        tabKey.value = ''
      } else if (newVal == t('tab.layerZero')) {
        tabKey.value = 'z'
      } else if (newVal == t('tab.wormhole')) {
        tabKey.value = 'wo'
      } else if (newVal == t('tab.celer')) {
        tabKey.value = 'ce'
      }
      updateLpList(searchKey.value)
    })
    const updateLpList = searchKey => {
      loading.value = true
      if (liquidity.value.myLplist.length > 0) {
        list.value = liquidity.value.myLplist
      }

      if (searchKey) {
        const result = list.value.filter(ele => {
          return (
            ele.symbol.toLowerCase().includes(searchKey.toLowerCase()) ||
            ele.coinA.name.toLowerCase().includes(searchKey.toLowerCase()) ||
            ele.coinB.name.toLowerCase().includes(searchKey.toLowerCase())
          )
        })
        if (currentTab.value) {
          const newResult = result.filter(ele => {
            return (
              ele.symbol.toLowerCase().includes(tabKey.value.toLowerCase()) ||
              ele.coinA.name.toLowerCase().includes(tabKey.value.toLowerCase()) ||
              ele.coinB.name.toLowerCase().includes(tabKey.value.toLowerCase())
            )
          })
          list.value = newResult
          loading.value = false
        } else {
          list.value = result
          loading.value = false
        }
      } else {
        if (currentTab.value) {
          const newResult = list.value.filter(ele => {
            return (
              ele.symbol.toLowerCase().includes(tabKey.value.toLowerCase()) ||
              ele.coinA.name.toLowerCase().includes(tabKey.value.toLowerCase()) ||
              ele.coinB.name.toLowerCase().includes(tabKey.value.toLowerCase())
            )
          })
          list.value = newResult
          loading.value = false
        }
      }
    }

    watch(
      () => [liquidity.value.lpTokens, chainName.value, wallet.value.address],
      ([newLpTokens, newChainName]) => {
        if (newLpTokens && !checkNullObj(newLpTokens)) {
          const newList: any = Object.values(newLpTokens)
          if (newChainName === 'Sui' && newList[0].address.includes('PoolLiquidityCoin')) {
            list.value = []
          } else {
            list.value = Object.values(newLpTokens)
            liquidityStore.setMyLplist(wallet.value.address)
          }
        }
      },
      {
        immediate: true
      }
    )

    watch(
      () => [liquidity.value.myLplist, chainName.value],
      ([newMyList, newChainName]) => {
        if (newMyList && newMyList.length > 0) {
          if (!(newChainName === 'Sui' && newMyList[0]?.address.includes('PoolLiquidityCoin'))) {
            updateLpList(searchKey.value)
            // list.value = newMyList
          }
        }
      },
      {
        immediate: true
      }
    )

    let getCountTimer: any = null
    onMounted(() => {
      const language: any = router?.currentRoute?.value?.query?.language
      if (language) {
        changeLang(language)
      }
      languageValue.value = locale.value
      getCountTimer = window.setInterval(() => {
        liquidityStore.setMyLplist(wallet.value.address || '')
        counter.getStatsData()
      }, 120000)
    })
    watch(
      () => indexStore.lang,
      newValue => {
        languageValue.value = newValue
      }
    )
    const { setLang } = counter
    const changeLang = value => {
      setLang(value)
      locale.value = value
    }
    onUnmounted(() => {
      window.clearInterval(getCountTimer)
      clearInterval(getCountTimer)
    })

    const config = computed(() => {
      return configure[indexStore.chainName]
    })
    return {
      config,
      indexStore,
      currentTab,
      tabList,
      indicator,
      wallet,
      list,
      loading,
      clickRefresh,
      refresh,
      router,
      liquidity,
      searchKey,
      updateLpList,
      totalTVL,
      addCommom,
      chainName,
      languageValue
    }
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
.theme-sui {
  .search-icon {
    background: url('../assets/sui-image/icon-amplification-def.png') !important;
    background-size: 100% 100% !important;
    // &:hover {
    //   background: url('../assets/image/icon-serach-hover@2x.png');
    //   background-size: 100% 100%;
    // }
  }
  .migrate-earn {
    display: none !important;
  }
}

.pools-position-list-container {
  width: 480px;
  height: 100%;
  margin: 0px auto;
  .ant-spin-spinning {
    width: 100%;
    height: 350px;
    position: relative;
  }
  .tab-list {
    display: flex;
    align-items: center;
    width: 100%;
    .item-container {
      width: 25%;
      height: 40px;
      box-sizing: border-box;
      margin-top: 8px;
      border: 1px solid #333;
      background: #121212;
      text-align: center;
      line-height: 40px;
      font-size: 12px;
      color: @textDefault;
      border-right: 1px solid transparent;
      // border-left: 1px solid transparent;
      &:nth-last-child(1) {
        border-right: 1px solid #333;
      }
      .item {
        height: 100%;
        color: @textDefault;
        border: 1px solid transparent;
      }
    }
    .item-container-active {
      .item {
        color: @themeColor;
        border: 1px solid @themeColor !important;
      }
    }
  }
  .no-data {
    margin-top: 8px !important;
    width: 100%;
    height: 240px;
    display: flex;
    flex-direction: column;
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
  }
  .back {
    > svg {
      width: 20px;
      height: 20px;
      fill: @textActive;
    }
  }
  .top-card {
    width: 100%;
    height: 146px;
    padding: 22px 16px;
    background: url('../assets/image/img-banner@2x.png');
    background-size: 100% 100%;
    position: relative;
    .tit {
      font-size: 22px;
      color: @textActive;
      font-weight: 600;
      text-shadow: @themeColor 1px 0 10px;
    }
    .desc {
      color: @textActive;
      font-size: 14px;
      margin-top: 15px;
      margin-bottom: 18px;
    }
    .ant-btn {
      width: 140px !important;
      height: 32px !important;
      position: absolute;
      font-size: 14px !important;
      font-weight: 500 !important;
      left: 18px;
      bottom: 22px;
    }
  }
  .position-title {
    // margin-top: 12px;
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
      &:hover {
        fill: @textActive;
      }
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
  .cmm-icon {
    width: 16px;
    height: 16px;
    fill: @textEffect;
    &:hover {
      fill: @textActive;
    }
  }
  .total-tvl {
    background: @cardTopReserve;
    width: 100%;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    i {
      font-size: 20px;
      font-weight: 700;
      background: linear-gradient(270deg, #71fabb 0%, #3078e0 100%);
      background-clip: text;
      color: transparent;
    }
    span {
      font-size: 16px;
      font-weight: 600;
      color: @themeColor;
    }
  }
  .migrate-earn {
    width: 100%;
    height: 100px;
    display: block;
    margin: 8px 0;
    background: url('../assets/image/migrate-earn.png');
    background-size: 100% 100%;
  }
  .search-input {
    background: @cardEnter;
    width: 100%;
    height: 40px;
    position: relative;
    border: 1px solid @borderDefault;
    input {
      width: 100%;
      height: 100%;
      background: transparent;
      border-radius: 10px;
      font-size: 14px;
      border: none;
      outline: none;
      padding: 0px 35px 0 20px;
      color: @textActive;
    }
    .search-icon {
      width: 22px;
      height: 22px;
      background: url('../assets/image/icon-serach@2x.png');
      background-size: 100% 100%;
      position: absolute;
      right: 12px;
      top: 8px;
      &:hover {
        background: url('../assets/image/icon-serach-hover@2x.png');
        background-size: 100% 100%;
      }
    }
  }
  .position-list {
    margin-top: 8px;
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
.pools-position-center {
  height: 400px;
}
@media (max-width: 750px) {
  .pools-position-list-container {
    width: 100%;
    .top-card {
      width: 100%;
      height: 150px;
      background: url('../assets/image/img-banner@2x.png') 50% no-repeat;
      background-size: cover;
      .ant-btn {
        width: 100px !important;
        height: 24px !important;
        line-height: 16px !important;
        font-size: 12px !important;
        left: 24px;
      }
    }
    .migrate-earn {
      height: 90px;
      background: url('../assets/image/migrate-earn-h5.png');
      background-size: 100% 100%;
    }
    .position-list {
      width: 100%;
    }
  }
}
@media (max-width: 485px) {
  .pools-position-list-container {
    width: 100%;
    .top-card {
      width: 100%;
      height: 120px;
      .ant-btn {
        left: 18px;
        bottom: 12px;
      }
    }
  }
}
@media (max-width: 385px) {
  .pools-position-list-container {
    .top-card {
      height: 100px;
      .ant-btn {
        left: 14px;
        bottom: 12px;
      }
    }
  }
}
@media (max-width: 325px) {
  .pools-position-list-container {
    .top-card {
      .ant-btn {
        left: 5px;
        bottom: 8px;
      }
    }
  }
}
</style>
