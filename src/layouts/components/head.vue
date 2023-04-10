<template>
  <header>
    <div class="left">
      <!-- <div class="logo" @click="gotoHome" /> -->
      <a v-if="config" class="logo" :href="`${config.cmmSite}/swap`"></a>
      <div class="alpha"></div>
    </div>
    <Menu :open-h5-icon="openH5Icon" />
    <div class="menu-right">
      <div v-if="store.chainName !== 'Aptos'" class="request-coin" @click="isRequestCoins = true">
        <img v-if="store.theme == 'default'" src="../../assets/image/icon-RequestCoins@2x.png" alt="" />
        <img v-else src="../../assets/sui-image/icon-RequestCoins@2x.png" alt="" />
        <span>Request Coins</span>
      </div>
      <div
        class="swaichChain"
        @click.stop="
          () => {
            openH5Icon = false
            openMore = false
            openSwitchLang = false
            openSwitchChain = !openSwitchChain
          }
        "
      >
        <div :class="openSwitchChain ? 'text rodegText' : 'text'">
          <img :src="importIcon(`/image/${chainName.toLowerCase()}.png`)" alt="" />
          <span>{{ chainName }}</span>
          <svg aria-hidden="true" class="icon">
            <use xlink:href="#icon-icon_on" />
          </svg>
        </div>
        <div v-if="openSwitchChain" class="list">
          <p>Switch Chain</p>
          <div
            v-for="item in chainList"
            :key="item.id"
            :class="
              item.id == store.chainName && config.network === item.network.toLowerCase()
                ? 'item-container item-active-container'
                : 'item-container'
            "
          >
            <div class="item" @click="changeChain(item)">
              <img
                v-if="store.theme == 'default' && item.id == store.chainName && config.network === item.network.toLowerCase()"
                class="selected-icon"
                src="../../assets/image/icon-check@2x.png"
                alt=""
              />
              <img
                v-if="store.theme.includes('sui') && item.id == store.chainName && config.network === item.network.toLowerCase()"
                class="selected-icon"
                src="../../assets/sui-image/checked.png"
                alt=""
              />
              <img :src="importIcon(`/image/${item.name.toLowerCase()}.png`)" alt="" />
              <span class="name">{{ item.name }}</span>
              <span class="gap"></span>
              <i :class="`network-tag-${item.network}`">{{ item.network }}</i>
            </div>
          </div>
        </div>
      </div>
      <Wallet />

      <div
        class="switch-lang"
        @click.stop="
          () => {
            openH5Icon = false
            openSwitchChain = false
            openMore = false
            openSwitchLang = !openSwitchLang
          }
        "
      >
        <div class="current-lang">
          <img src="@/assets/image/icon-language.png" alt="" />
          <!-- <span>
            {{ langObj[counter.lang] }}
          </span>
          <svg :class="openSwitchLang ? 'icon-open' : ''" class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon_on" />
          </svg> -->
        </div>
        <div v-if="openSwitchLang" class="list">
          <div
            v-for="item in langList"
            :key="item.value"
            :class="item.value == counter.lang ? 'item-container item-active-container' : 'item-container'"
          >
            <div class="item" @click="changeLang(item.value)">
              <span>{{ item.icon }}&nbsp;&nbsp;{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="devnet"></div> -->
      <div
        class="more"
        @click.stop="
          () => {
            openH5Icon = false
            openSwitchChain = false
            openSwitchLang = false
            openMore = !openMore
          }
        "
      >
        <div class="spot"></div>
        <div class="spot"></div>
        <div class="spot"></div>
        <div v-if="openMore" class="list">
          <div v-for="item in list" :key="item.name" class="item-container">
            <a class="item" :href="item.link" target="_blank">
              <svg aria-hidden="true" class="icon">
                <use :xlink:href="item.icon" />
              </svg>
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>
      <div
        class="img-box"
        @click.stop="
          () => {
            openMore = false
            openSwitchChain = false
            openSwitchLang = false
            openH5Icon = !openH5Icon
          }
        "
      >
        <svg aria-hidden="true" class="icon">
          <use xlink:href="#icon-icon-menu" />
        </svg>
      </div>
    </div>
    <RequestCoins v-if="isRequestCoins" @onClose="isRequestCoins = false" />
  </header>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed, watch } from 'vue'
import importIcon from '@/utils/import-icon'
import { useRouter } from 'vue-router'
import useTheme from '@/composables/useTheme'
import { useIndexStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { useWalletStore } from '@/store/wallet'
import { useLiquidityStore } from '@/store/liquidity'
import { Aptos } from '@fewcha/web3'
import configure from '@/utils/config'

export default defineComponent({
  setup(ctx) {
    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })

    const liquidityStore = useLiquidityStore()

    let isRequestCoins = ref(false)
    let openMore = ref(false)
    let openSwitchChain = ref(false)
    let openH5Icon = ref(false)
    let openSwitchLang = ref(false)
    const router = useRouter()
    const languageValue = ref('')
    const { t, locale } = useI18n()

    const langObj = {
      en: '🇬🇧 English',
      th: '🇹🇭 ไทย',
      hi: '🇮🇳 Hindī',
      kr: '🇰🇷 한국어',
      vi: '🇻🇳 Tiếng Việt',
      ja: '🇯🇵 日本語',
      ru: '🇷🇺 Русский',
      tr: '🇹🇷 Türkçe'
    }
    const langList = [
      {
        icon: '🇬🇧',
        label: 'English',
        value: 'en'
      },
      {
        icon: '🇹🇭',
        label: 'ไทย',
        value: 'th'
      },
      {
        icon: '🇮🇳',
        label: 'Hindī',
        value: 'hi'
      },
      {
        icon: '🇰🇷',
        label: '한국어',
        value: 'kr'
      },
      {
        icon: '🇻🇳',
        label: 'Tiếng Việt',
        value: 'vi'
      },
      {
        icon: '🇯🇵',
        label: '日本語',
        value: 'ja'
      },
      {
        icon: '🇷🇺',
        label: 'Русский',
        value: 'ru'
      },
      {
        icon: '🇹🇷',
        label: 'Türkçe',
        value: 'tr'
      }
    ]
    const chainList = [
      {
        id: 'Aptos',
        name: 'Aptos',
        env: '',
        network: 'Mainnet'
      },
      {
        id: 'Sui',
        name: 'Sui',
        env: 'pre',
        network: 'Devnet'
      },
      {
        id: 'Sui2',
        name: 'Sui',
        env: 'pre2',
        network: 'Testnet'
      }
    ]
    const list = [
      {
        name: t('contactUS.docs'),
        icon: '#icon-svg-docs',
        link: 'https://cetus-1.gitbook.io/cetus-docs/'
      },
      {
        name: t('contactUS.twitter'),
        icon: '#icon-svg-twitter',
        link: 'https://twitter.com/CetusProtocol'
      },
      {
        name: t('contactUS.discord'),
        icon: '#icon-svg-Discord',
        link: 'https://discord.gg/cetusprotocol'
      },
      {
        name: t('contactUS.tgGroup'),
        icon: '#icon-svg-lark',
        link: 'https://t.me/cetuscommunity'
      },
      {
        name: t('contactUS.tgChannel'),
        icon: '#icon-svg-tg',
        link: 'https://t.me/cetusprotocol'
      },
      {
        name: t('contactUS.medium'),
        icon: '#icon-svg-medium',
        link: 'https://medium.com/@CetusProtocol'
      }
    ]
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })
    let currentChain = ref(store.value.chainName || 'Aptos')
    const themeStore = useTheme()
    onMounted(() => {
      const language: any = router?.currentRoute?.value?.query?.language
      if (language) {
        changeLang(language)
      }
      const swaichChain: any = router?.currentRoute?.value?.query?.swaichChain
      if (swaichChain == 'aptos') {
        themeStore.seleteDefaultTheme()
        walletStore.setCurrentWallet({
          wallet: wallet.value.aptosCurrentWallet,
          isConnected: wallet.value.aptosConnected,
          account: wallet.value.aptosAddress,
          platform: 'Aptos',
          icon: wallet.value.aptosWalletIcon
        })
      }
      document.addEventListener('click', () => {
        openH5Icon.value = false
        openMore.value = false
        openSwitchChain.value = false
        openSwitchLang.value = false
      })
      languageValue.value = locale.value
      getListHref()
    })
    watch(
      () => counter.lang,
      newValue => {
        languageValue.value = newValue
      }
    )
    onUnmounted(() => {
      document.removeEventListener('click', () => {
        openH5Icon.value = false
        openMore.value = false
        openSwitchChain.value = false
        openSwitchLang.value = false
      })
    })
    const gotoHome = () => {
      router.push('/')
    }
    const getListHref = () => {
      window.setInterval(() => {
        list[0].name = t('contactUS.docs')
        list[1].name = t('contactUS.twitter')
        list[2].name = t('contactUS.discord')
        list[3].name = t('contactUS.tgGroup')
        list[4].name = t('contactUS.tgChannel')
        list[5].name = t('contactUS.medium')
      }, 1000)
    }
    const changeChain = item => {
      liquidityStore.resetTokenAndLp()
      currentChain.value = item.id
      if (item.id == 'Aptos') {
        themeStore.seleteDefaultTheme()
        walletStore.setCurrentWallet({
          wallet: wallet.value.aptosCurrentWallet,
          isConnected: wallet.value.aptosConnected,
          account: wallet.value.aptosAddress,
          platform: 'Aptos',
          icon: wallet.value.aptosWalletIcon
        })
        window.location.href = `${config.value.cmmSite}/?language=${languageValue.value}`
      } else if (item.id == 'Sui') {
        themeStore.selectSuiTheme()
        walletStore.setCurrentWallet({
          wallet: wallet.value.suiCurrentWallet,
          isConnected: wallet.value.suiConnected,
          account: wallet.value.suiAddress,
          platform: 'Sui',
          icon: wallet.value.suiWalletIcon
        })
      } else if (item.id === 'Sui2') {
        themeStore.selectSui2Theme()
        walletStore.setCurrentWallet({
          wallet: wallet.value.suiCurrentWallet,
          isConnected: wallet.value.suiConnected,
          account: wallet.value.suiAddress,
          platform: 'Sui',
          icon: wallet.value.suiWalletIcon
        })
      }
    }

    const { setLang } = counter
    const changeLang = value => {
      setLang(value)
      locale.value = value
    }
    const config = computed(() => {
      return configure[store.value.chainName]
    })

    const chainName = computed(() => {
      if (store.value.chainName && store.value.chainName.toLowerCase().includes('sui')) {
        const arr = store.value.chainName.split('2')
        return arr[0]
      }
      return store.value.chainName
    })
    return {
      config,
      changeChain,
      currentChain,
      chainList,
      openSwitchChain,
      store,
      isRequestCoins,
      importIcon,
      openH5Icon,
      openMore,
      list,
      gotoHome,
      changeLang,
      langList,
      openSwitchLang,
      counter,
      langObj,
      chainName
    }
  }
})
</script>
<style lang="less" scoped>
@import '../../assets/css/base.less';
.theme-sui {
  .alpha {
    background: url('/sui-image/label-Alpha@2x.png') !important;
    background-size: 100% 100% !important;
  }
}
header {
  width: 100%;
  height: 100%;
  padding: 20px 40px;
  position: relative;
  background: @backgroundColor;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
  .logo {
    position: absolute;
    top: 50%;
    left: 40px;
    transform: translateY(-50%);
    width: 132px;
    height: 32px;
    background: url('../../assets/image/img-logo@2x.png');
    background-size: 100% 100%;
    z-index: 100;
    cursor: pointer;
  }
  .alpha {
    position: absolute;
    top: 50%;
    left: 184px;
    transform: translateY(-50%);
    width: 66px;
    height: 24px;
    background: url('/image/label-Alpha@2x.png');
    background-size: 100% 100%;
  }
  .devnet {
    width: 61px;
    height: 14px;
    background: url('/image/label-devnet@2x.png');
    background-size: 100% 100%;
    position: absolute;
    top: -14px;
    right: 48px;
  }
  .menu-right {
    position: absolute;
    top: 50%;
    right: 40px;
    transform: translateY(-50%);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    .swaichChain {
      position: relative;
      margin-right: 20px;
      .text {
        display: flex;
        align-items: center;
        &:hover {
          span {
            color: @themeColor;
          }
          svg {
            fill: @textActive;
          }
        }
        img {
          width: 24px;
          height: 24px;
        }
        span {
          margin: 0 5px;
          font-size: 12px;
          color: @textActive;
        }
        svg {
          width: 12px;
          height: 12px;
          fill: @textDefault;
        }
      }
      .rodegText {
        svg {
          rotate: 180deg;
        }
      }
      .list {
        width: 164px;
        position: absolute;
        top: 36px;
        left: -28px;
        background: #181818;
        padding: 12px 0 0;
        p {
          padding: 0 0 0 8px;
          font-size: 12px;
          color: @textActive;
        }
        .item-container {
          // padding: 0 20px;
          padding-left: 20px;
          padding-right: 8px;
          height: 40px;
          line-height: 40px;
          &:hover {
            background: #262626;
          }
          .item {
            display: flex;
            align-items: center;
            position: relative;
            img {
              width: 24px;
              height: 24px;
              margin-left: 6px;
              &.selected-icon {
                position: absolute;
                left: -24px;
              }
            }
            .name {
              font-size: 12px;
              margin-left: 5px;
              color: @textActive;
            }
            .gap {
              flex: 1;
            }
            i {
              width: 56px;
              height: 20px;
              font-size: 12px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-style: normal;
              &.network-tag-Devnet {
                background: rgba(#034e70, 0.5);
                color: #75c8ff;
              }
              &.network-tag-Testnet {
                background: rgba(#41528e, 0.5);
                color: #8c9dff;
              }
              &.network-tag-Mainnet {
                background: rgba(#213f37, 0.5);
                color: #67ffd8;
              }
            }
          }
        }
        .item-active-container {
          width: 100%;
          background: @buttonDetailDefault;
          // padding: 0 3px !important;
          border: 1px solid @borderDefault;
          &:hover {
            background: transparent;
          }
          .item {
            // img {
            //   margin-left: 0px;
            //   &:nth-child(1) {
            //     width: 20px;
            //     height: 20px;
            //     margin-right: 2px;
            //   }
            // }
            span {
              color: @themeColor;
            }
          }
        }
      }
    }
    .switch-lang {
      display: block;
      // width: 90px;
      // height: 36px;
      // padding: 6px 12px;
      background: @buttonDetailDefault;
      border: 1px solid @borderDefault;
      font-size: 14px;
      margin-left: 12px;
      position: relative;
      &:hover {
        background: @buttonDetailHover;
      }
      .current-lang {
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        flex-direction: row-reverse;
        align-items: center;
        text-align: center;
        padding: 6px;
        color: @textActive;
        .icon {
          width: 12px;
          height: 12px;
          fill: @textActive;
          margin-left: 3px;
          transition: all 0.5s;
        }
        .icon-open {
          transform: rotate(180deg);
        }
        img {
          width: 20px;
          height: 20px;
        }
      }
      .list {
        width: 96px;
        position: absolute;
        top: 36px;
        right: 0;
        padding: 12px 0;
        p {
          padding: 0 20px;
          font-size: 12px;
          color: @textActive;
        }
        .item-container {
          // padding: 0 20px;
          height: 40px;
          line-height: 40px;
          padding: 0 3px !important;
          background: #181818;
          .item {
            display: flex;
            align-items: center;
            img {
              width: 24px;
              height: 24px;
            }
            span {
              font-size: 12px;
              margin-left: 5px;
              color: @textActive;
            }
          }
        }
        .item-active-container {
          width: 100%;
          background: @buttonDetailDefault;
          border: 1px solid @borderDefault;
          .item {
            img {
              &:nth-child(1) {
                width: 20px;
                height: 20px;
                margin-right: 3px;
              }
            }
            span {
              color: @themeColor;
            }
          }
        }
      }
    }
    .request-coin {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      &:hover {
        // background: @buttonDetailHover;
        span {
          color: @themeColor;
        }
      }
      img {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
      span {
        width: 85px;
        font-size: 12px;
        color: @textActive;
      }
    }
    .img-box {
      display: none;
    }
    .more {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 12px;
      width: 36px;
      height: 36px;
      background: @buttonDetailDefault;
      border: 1px solid @borderDefault;
      position: relative;
      &:hover {
        background: @buttonDetailHover;
      }
      .spot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: @textActive;
        &:nth-child(2) {
          margin: 0 3px;
        }
      }
      .list {
        position: absolute;
        top: 44px;
        right: 0;
        padding: 12px 8px;
        width: 120px;
        background: @moreBg;
        .item-container {
          margin-bottom: 24px;
          &:nth-last-child(1) {
            margin-bottom: 0;
          }
          .item {
            display: flex;
            align-items: center;
            &:hover {
              svg {
                fill: @themeColor;
              }
              span {
                color: @themeColor;
              }
            }
            svg {
              width: 20px;
              height: 20px;
              fill: @textActive;
              margin-right: 12px;
            }
            span {
              font-size: 12px;
              color: @textActive;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 900px) {
  header {
    padding: 0;
    height: 88px;
    .logo {
      position: absolute;
      top: 50%;
      left: 18px;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      background: url('../../assets/image/img-h5-logo@2x.png') center no-repeat;
      background-size: 100% 100%;
    }
    .alpha {
      position: absolute;
      top: 50%;
      left: 60px !important;
    }
  }
}
@media (max-width: 750px) {
  header {
    padding: 0;
    height: 88px;
    .logo {
      position: absolute;
      top: 50%;
      left: 18px;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      background: url('../../assets/image/img-h5-logo@2x.png') center no-repeat;
      background-size: 100% 100%;
    }
    .alpha {
      display: none;
    }
    .devnet {
      position: absolute;
      top: -14px;
      right: 36px;
    }
    .menu-right {
      display: flex;
      align-items: center;
      position: absolute;
      top: 50%;
      right: 18px;
      transform: translateY(-50%);
      // .swaichChain {
      //   display: none;
      // }
      .request-coin {
        position: absolute;
        top: 35px;
        right: 0px;
        margin-right: 0px;
        img {
          margin-right: 2px;
        }
      }
      .img-box {
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-left: 16px;
        display: block;
      }
      svg {
        width: 100%;
        height: 100%;
        fill: @textActive;
      }
      .more {
        display: none;
      }
      .switch-lang {
        display: none;
      }
    }
  }
}
</style>
