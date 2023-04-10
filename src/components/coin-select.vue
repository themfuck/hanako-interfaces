<template>
  <Modal
    :title="$t('modal.selectTokenModalTitle')"
    class="select-mod"
    :width="400"
    centered
    :visible="true"
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="coin-select-modal">
      <div class="search-input">
        <input
          v-model="keyword"
          onkeyup="value=value.replace(/[^A-Za-z0-9]+$/g,'')"
          :placeholder="$t('inputPlaceholder.selectTokenModalPlaceholder')"
        />
        <svg v-if="keyword" class="clear-icon icon modal-icon-close" aria-hidden="true" @click="keyword = ''">
          <use xlink:href="#icon-a-icon-Shutdown"></use>
        </svg>
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
      <div class="line"></div>
      <div class="coin-list-box">
        <vue-scroll>
          <ul v-if="tokenList && tokenList.length > 0" class="coin-list">
            <li v-for="(item, index) in tokenList" :key="index" :class="item.unusable ? 'unusable' : ''" @click="toSelect(item)">
              <div class="left">
                <img :src="item.icon || item.logoURI || importIcon(`/image/coins/${item.symbol.toLowerCase()}.png`)" />
                <div class="name-box">
                  <span>{{ item.symbol }}</span>
                  <p>{{ item.name }}</p>
                </div>
              </div>
              <div class="balance-box">
                <div class="balance">
                  <div v-if="wallet.loading">
                    <a-space>
                      <loading-outlined />
                    </a-space>
                  </div>
                  <div v-else-if="wallet.connected && assets[item.address]">
                    {{ prettyAmount(assets[item.address].balance, item.decimals) }}
                  </div>

                  <div v-else>0</div>
                </div>
                <p></p>
              </div>
            </li>
          </ul>
          <div v-else class="no-data">
            <img v-if="store.theme == 'default'" src="../assets/image/img-no-Positions@2x.png" />
            <img v-else src="../assets/sui-image/img-no-Positions@2x.png" />
            <p>{{ 'No tokens found' }}</p>
          </div>
        </vue-scroll>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch, watchEffect } from 'vue'
import { Modal } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import importIcon from '@/utils/import-icon'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useWalletStore } from '../store/wallet'
import { useLiquidityStore } from '@/store/liquidity'
import { useIndexStore } from '@/store'
import { checkNullObj } from '@/utils'
import { prettyAmount } from '@/utils/tokens'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { Modal, LoadingOutlined },
  props: {
    existingCoins: {
      type: String,
      default: ''
    },
    lastSelectCoin: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    const { t } = useI18n()
    const tabList = ref([t('tab.all'), t('tab.native'), t('tab.layerZero'), t('tab.wormhole'), t('tab.celer')])
    const currentTab = ref(t('tab.all'))
    const tabKey = ref('')
    const indexStore = useIndexStore()
    const chainName = computed(() => {
      return indexStore.chainName
    })
    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })
    const liquidityStore = useLiquidityStore()
    const liquidity = computed(() => {
      return liquidityStore
    })
    const tokenList = ref<any>([])
    const keyword = ref(null)
    const counter = useIndexStore()
    const assets = computed(() => {
      return wallet.value.assets
    })

    const store = computed(() => {
      return counter
    })

    watch(
      () => liquidity.value.tokens,
      newValue => {
        if (!checkNullObj(newValue)) {
          tokenList.value = Object.values(newValue)
        }
      },
      {
        immediate: true
      }
    )

    watch(keyword, newVal => {
      updateTokenList(newVal)
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
      } else if (newVal == t('tab.native')) {
        tabKey.value = 'native'
      }
      updateTokenList(keyword.value)
    })

    watch(
      () => liquidity.value.tokens,
      newValue => {
        if (!checkNullObj(newValue)) {
          tokenList.value = Object.values(newValue)
        }
      },
      {
        immediate: true
      }
    )
    onMounted(() => {
      updateTokenList('')
    })
    const updateTokenList = keyword => {
      let newTokens: any = []
      const tokensObj = { ...liquidity.value.tokens }
      for (const symbol of Object.keys(tokensObj)) {
        let tokenInfo: any = cloneDeep(tokensObj[symbol])

        if (tokenInfo.symbol.toUpperCase() === 'SUI' && chainName.value !== 'Aptos') {
          tokenInfo.sortToken = true
        } else {
          tokenInfo.sortToken = false
        }

        if (props.lastSelectCoin && tokenInfo && tokenInfo.symbol === props.lastSelectCoin) {
          tokenInfo.unusable = true
        } else {
          tokenInfo.unusable = false
        }
        const balance =
          (wallet.value.assets &&
            wallet.value.assets[tokenInfo.address] &&
            Number(prettyAmount(wallet.value.assets[tokenInfo.address].balance, tokenInfo.decimals))) ||
          0
        tokenInfo = { ...tokenInfo, balance }
        newTokens.push(tokenInfo)
      }
      let sortResult: any
      if (wallet.value.address) {
        sortResult = newTokens.sort((a, b) => a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0)).sort((a, b) => b.balance - a.balance)
      } else {
        sortResult = newTokens.sort((a, b) => a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0))
      }
      if (keyword) {
        const result = sortResult.filter(item => {
          return (
            item.symbol.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
            item.address.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
          )
        })
        if (currentTab.value) {
          const newResult = result.filter(ele => {
            return currentTab.value == 'Native'
              ? ele.name.toLowerCase().indexOf('z') == -1 &&
                  ele.name.toLowerCase().indexOf('wo') == -1 &&
                  ele.name.toLowerCase().indexOf('ce') == -1
              : ele.name.toLowerCase().includes(tabKey.value.toLowerCase())
          })
          tokenList.value = newResult.sort((a, b) => b.sortToken - a.sortToken).sort((a, b) => b.unusable - a.unusable)
        } else {
          tokenList.value = result.sort((a, b) => b.sortToken - a.sortToken).sort((a, b) => b.unusable - a.unusable)
        }
      } else {
        if (currentTab.value) {
          const newResult = sortResult.filter(ele => {
            return currentTab.value == 'Native'
              ? ele.name.toLowerCase().indexOf('z') == -1 &&
                  ele.name.toLowerCase().indexOf('wo') == -1 &&
                  ele.name.toLowerCase().indexOf('ce') == -1
              : ele.name.toLowerCase().includes(tabKey.value.toLowerCase())
          })
          tokenList.value = newResult.sort((a, b) => b.sortToken - a.sortToken).sort((a, b) => b.unusable - a.unusable)
        } else {
          tokenList.value = sortResult.sort((a, b) => b.sortToken - a.sortToken).sort((a, b) => b.unusable - a.unusable)
        }
      }
    }

    watchEffect(() => {
      if (!checkNullObj(liquidity.value.tokens)) {
        updateTokenList('')
      }
    })

    const toSelect = (item: any, oldItem: any) => {
      ctx.emit('onSelect', item)
      ctx.emit('onClose')
    }
    return { chainName, tabList, currentTab, tokenList, importIcon, keyword, wallet, toSelect, store, assets, prettyAmount }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.coin-select-modal {
  .search-input {
    width: 100%;
    height: 40px;
    position: relative;
    padding: 0 16px;
    margin-top: 16px;
    input {
      width: 100%;
      height: 100%;
      background: @cardEnter;
      font-size: 14px;
      border: none;
      outline: none;
      padding: 0px 35px 0 16px;
      color: @textActive;
    }
    .clear-icon {
      width: 16px;
      height: 16px;
      fill: @textDefault;
      position: absolute;
      right: 30px;
      top: 12px;
      &:hover {
        fill: @textActive;
      }
    }
  }
  .coin-list-box::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .coin-list-box::-webkit-scrollbar-thumb {
    background: #585a5c;
    border-radius: 4px;
  }
  .coin-list-box::-webkit-scrollbar-corner {
    background: transparent !important;
  }
  .tab-list {
    padding: 0 16px;
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 16px;
    .item-container {
      width: 25%;
      height: 40px;
      box-sizing: border-box;
      border: 1px solid #333;
      background: @backgroundColor;
      text-align: center;
      line-height: 38px;
      font-size: 12px;
      color: @textDefault;
      border-right: 1px solid transparent;
      cursor: pointer;
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
  .line {
    width: 100%;
    height: 1px;
    background: #333;
    margin: 16px 0 0px;
  }
  .coin-list-box {
    height: 265px;
    overflow-y: auto;
    .coin-list {
      width: 100%;
      min-height: 200px;
      padding: 0;
      li {
        &:nth-child(2n) {
          background: @backgroundColor !important;
        }
        display: flex;
        height: 60px;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: @textActive;
        cursor: pointer;
        background: @backgroundColor;
        padding: 0 16px;
        &.active,
        &:hover {
          background: @cardTopTrans !important;
          border-radius: 0px;
        }
        .left {
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            border-radius: 100%;
          }
          .name-box {
            margin-left: 8px;
            span {
              font-size: 14px;
              color: @textActive;
            }
            span,
            p {
              padding: 0px;
              margin: 0px;
            }
            p {
              font-size: 12px;
              color: @textDefault;
            }
          }
        }
        .balance-box {
          padding-right: 10px;
          .balance {
            font-size: 12px;
          }
        }
        &.unusable {
          color: @textDefault;
          cursor: not-allowed;
          .left {
            img {
              filter: brightness(0.5);
            }
            span {
              color: rgba(#fff, 0.5);
            }
          }
        }
      }
    }
  }
  .no-data {
    width: 100%;
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      width: 80px;
      height: 80px;
    }
    p {
      color: @textDefault;
      padding-top: 10px;
    }
  }
}
</style>
