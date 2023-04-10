<template>
  <div class="stats-container">
    <div class="title">{{ $t('common.overview') }}</div>
    <StatsEcharts class="title-overview" :is-show="showEcharts" :wd-all="wdAll" />
    <!-- <H5StatsEcharts class="h5-overview" :is-show="showEchart" :wd-all="wdAll" /> -->
    <div class="top-pools">
      <div class="title">{{ $t('common.topPools') }}</div>
      <div class="content">
        <div
          v-for="(item, index) in currentTopPoolsList"
          :key="index"
          class="item"
          @click="
            router.push(
              `/pools-liquidity-add?from=${
                addressTokens && addressTokens[item.token_a_address] && addressTokens[item.token_a_address].symbol
              }&&to=${addressTokens && addressTokens[item.token_a_address] && addressTokens[item.token_b_address].symbol}`
            )
          "
        >
          <div class="top">
            <CoinPairName
              :from-coin="addressTokens && addressTokens[item.token_a_address]"
              :to-coin="addressTokens && addressTokens[item.token_b_address]"
            />
            <a-button class="cancel-btn">{{ $t('common.deposit') }}</a-button>
          </div>
          <div class="bottom">
            <div class="data">
              <span>{{ $t('common.tvl') }}</span>
              <p>${{ item.tvl_in_usd ? addCommom(item.tvl_in_usd, 2) : '--' }}</p>
            </div>
            <div class="data">
              <span>{{ $t('common.volume24h') }}</span>
              <p>${{ item.vol_in_usd_24h ? addCommom(item.vol_in_usd_24h, 2) : '--' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="panation">
        <a-pagination
          v-model:current="currentPools"
          :page-size="isPc ? 6 : 4"
          simple
          :total="topPoolsList.length"
          @change="onChangePools"
        />
      </div>
    </div>
    <div class="top-tokens">
      <div class="title">{{ $t('common.topTokens') }}</div>
      <div class="content">
        <div class="item">
          <span>{{ $t('common.tokens') }}</span>
          <span>{{ $t('common.price') }}</span>
          <span>{{ $t('common.volume24h') }}</span>
          <span>&nbsp;</span>
        </div>
        <div v-for="(item, index) in currentTopTokensList" :key="index" class="item pc-item">
          <div class="token">
            <img
              :src="
                (addressTokens && addressTokens[item.address] && addressTokens[item.address].logoURI) ||
                importIcon(
                  `/image/coins/${addressTokens && addressTokens[item.address] && addressTokens[item.address].symbol.toLowerCase()}.png`
                )
              "
              alt=""
            />
            <div class="name">
              <p>
                {{ addressTokens && addressTokens[item.address] && addressTokens[item.address].symbol }}
              </p>
              <span> {{ addressTokens && addressTokens[item.address] && addressTokens[item.address].name }}</span>
            </div>
          </div>
          <div class="price">
            <p>${{ addCommom(item.price, 2) }}</p>
            <div :class="item.price_rate_24h.includes('-') ? 'change redecue-change' : 'change add-change'">
              {{ item.price_rate_24h !== '0%' && !item.price_rate_24h.includes('-') ? `+${item.price_rate_24h}` : item.price_rate_24h }}
            </div>
          </div>
          <div class="volume">${{ addCommom(item.vol_in_usd_24h, 2) == '0.00' ? 0 : addCommom(item.vol_in_usd_24h, 2) }}</div>
          <div class="btn-box">
            <a-button
              class="cancel-btn"
              @click="router.push(`/swap?to=${addressTokens && addressTokens[item.address] && addressTokens[item.address].symbol}`)"
            >
              {{ $t('button.swap') }}
            </a-button>
          </div>
        </div>

        <div v-for="(item, index) in currentTopTokensList" :key="index" class="item h5-item">
          <div class="top">
            <div class="token">
              <img :src="addressTokens && addressTokens[item.address] && addressTokens[item.address].logoURI" alt="" />
              <div class="name">
                <p>
                  {{ addressTokens && addressTokens[item.address] && addressTokens[item.address].symbol }}
                </p>
                <span> {{ addressTokens && addressTokens[item.address] && addressTokens[item.address].name }}</span>
              </div>
            </div>
            <a-button
              class="cancel-btn"
              @click="router.push(`/swap?to=${addressTokens && addressTokens[item.address] && addressTokens[item.address].symbol}`)"
            >
              {{ $t('button.swap') }}
            </a-button>
          </div>
          <div class="bottom">
            <div class="data">
              <span>{{ $t('common.price') }}</span>
              <div class="price">
                <p>${{ addCommom(item.price, 2) }}</p>
                <div :class="item.price_rate_24h.includes('-') ? 'change redecue-change' : 'change add-change'">
                  {{ item.price_rate_24h }}
                </div>
              </div>
            </div>
            <div class="data">
              <span>{{ $t('common.volume24h') }}</span>
              <p>${{ addCommom(item.vol_in_usd_24h, 2) == '0.00' ? 0 : addCommom(item.vol_in_usd_24h, 2) }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="panation">
        <a-pagination
          v-model:current="currentTokens"
          :page-size="isPc ? 10 : 4"
          simple
          :total="topTokensList.length"
          @change="onChangeTokens"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, computed, watchEffect, watch } from 'vue'
import importIcon from '@/utils/import-icon'
import { useRouter } from 'vue-router'
import { useIndexStore } from '@/store'
import { addCommom } from '@/utils'
import { useLiquidityStore } from '@/store/liquidity'

export default defineComponent({
  setup() {
    const liquidityStore = useLiquidityStore()

    const liquidity = computed(() => {
      return liquidityStore
    })
    const addressTokens = computed(() => {
      return liquidity.value.addressTokens || {}
    })
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })
    const router = useRouter()
    let showEcharts = ref('big')
    const currentPools = ref<number>(1)
    const currentTokens = ref<number>(1)
    let isPc = ref(false)
    const getStats = () => {
      window.setInterval(() => {
        counter.getStatsData()
      }, 120000)
    }
    onMounted(() => {
      getStats()
      const screenWidth = document.body.clientWidth
      if (screenWidth < 750) {
        isPc.value = false
      } else {
        isPc.value = true
      }
      window.onresize = () => {
        if (screenWidth < 750) {
          isPc.value = false
        } else {
          isPc.value = true
        }
      }
      if (isPc.value) {
        onChangePools(currentPools.value, 6)
        onChangeTokens(currentTokens.value, 10)
      } else {
        onChangePools(currentPools.value, 4)
        onChangeTokens(currentTokens.value, 4)
      }
    })
    let currentTopPoolsList: any = ref([])
    const topPoolsList = computed(() => {
      return store.value.topPoolsList
    })

    watch(topPoolsList, () => {
      if (isPc.value) {
        onChangePools(currentPools.value, 6)
      } else {
        onChangePools(currentPools.value, 4)
      }
    })
    const onChangePools = (page: any, pageSize: any) => {
      currentPools.value = page
      const start = pageSize * page - pageSize
      let end = pageSize * page
      end = end > topPoolsList.value.length ? topPoolsList.value.length : end
      const result = topPoolsList.value.filter((item, index) => {
        return index >= start && index < end
      })
      if (result.length > 0) {
        currentTopPoolsList.value = result
      }
      return result
    }
    let currentTopTokensList: any = ref([])
    const topTokensList = computed(() => {
      return store.value.topTokensList
    })

    watch(topTokensList, () => {
      if (isPc.value) {
        onChangeTokens(currentTokens.value, 10)
      } else {
        onChangeTokens(currentTokens.value, 4)
      }
    })
    const onChangeTokens = (page: any, pageSize: any) => {
      currentTokens.value = page
      const start = pageSize * page - pageSize
      let end = pageSize * page
      end = end > topTokensList.value.length ? topTokensList.value.length : end
      const result = topTokensList.value.filter((item, index) => {
        return index >= start && index < end
      })
      if (result.length > 0) {
        currentTopTokensList.value = result
      }
      return result
    }
    watch(
      () => store.value.chainName,
      newValue => {
        if (newValue !== 'Aptos') {
          router.push('/swap')
        }
      },
      {
        immediate: true
      }
    )
    return {
      addCommom,
      store,
      importIcon,
      topPoolsList,
      addressTokens,
      showEcharts,
      currentPools,
      onChangePools,
      currentTopPoolsList,
      onChangeTokens,
      currentTokens,
      currentTopTokensList,
      topTokensList,
      router,
      isPc
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.stats-container {
  width: 800px;
  margin: auto;
  .title {
    font-size: 20px;
    font-weight: 500;
    color: @textActive;
    line-height: 20px;
    margin-bottom: 20px;
  }
  .panation {
    background: @moreBgReserve;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
  }
  .top-pools {
    width: 100%;
    padding-top: 16px;
    background: #121212;
    margin-top: 8px;
    .title {
      margin-bottom: 8px;
      padding: 0 16px;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      padding: 0 16px;
      .item {
        // width: 49%;
        width: 380px;
        background: @cardCenter;
        padding: 16px;
        margin-top: 8px;
        &:hover {
          // background: @cardCenterHover;
          .cancel-btn {
            background: @depositBtnHover !important;
          }
        }
        .top {
          display: flex;
          justify-content: space-between;
          height: 28px;
          .cancel-btn {
            font-size: 12px !important;
            width: 100px !important;
            height: 28px !important;
            line-height: 14px !important;
            &:hover {
              background: @depositBtnHover !important;
            }
          }
        }
        .bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          .data {
            width: 50%;
            span {
              color: @textDefaultStats;
              font-size: 12px;
            }
            p {
              font-size: 14px;
              color: @textActive;
              margin-bottom: 0 !important;
            }
          }
        }
      }
    }
  }
  .top-tokens {
    width: 100%;
    padding-top: 16px;
    background: #121212;
    margin-top: 8px;
    .title {
      margin-bottom: 8px;
      padding: 0 16px;
    }
    .content {
      width: 100%;
      // padding: 0 16px;
      .pc-item {
        display: block;
      }
      .h5-item {
        display: none !important;
      }
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 52px;
        padding: 0 16px;
        // margin-bottom: 24px;
        &:hover {
          background: @cardCenterHover;
        }
        span {
          width: 26%;
          font-size: 12px;
          color: @textDefaultStats;
        }
        &:nth-child(1) {
          margin-top: 8px;
          height: 34px;
          &:hover {
            background: unset;
          }
          span {
            &:nth-child(1) {
              width: 35%;
            }
            &:nth-child(2) {
              width: 30%;
            }
            &:nth-child(3) {
              width: 23%;
            }
            &:nth-child(4) {
              width: 12%;
            }
          }
        }

        .token {
          display: flex;
          align-items: center;
          width: 35%;
          img {
            width: 28px;
            height: 28px;
            margin-right: 8px;
          }
          &:hover {
            .name {
              span {
                display: block;
              }
            }
          }
        }
        p {
          margin-bottom: 0 !important;
          color: @textActive;
        }
        .name {
          // width: 100%;
          display: flex;
          align-items: center;
          p {
            position: relative;
            margin-bottom: 0 !important;
            color: @textActive;
            display: block;
          }
          span {
            display: inline-block;
            display: none;
            color: @textDefault;
            text-align: center;
            background: #1c1b1b;
            font-size: 12px;
            // height: 24px;
            // line-height: 24px;
            width: 100%;
            padding: 3px 8px;
            margin: 0 5px;
          }
        }
        .price {
          width: 30%;
          display: flex;
          align-items: center;
          .change {
            height: 16px;
            line-height: 16px;
            font-size: 12px;
            padding: 0px 4px;
            margin-left: 8px;
          }
          .add-change {
            background: @greenBg;
            color: @themeColor;
          }
          .redecue-change {
            background: @redBg;
            color: @redColor;
          }
        }
        .volume {
          width: 23%;
          color: @textActive;
        }
        .btn-box {
          width: 12%;
          display: flex;
          justify-content: flex-end;
          .cancel-btn {
            font-size: 12px !important;
            width: 80px !important;
            height: 28px !important;
            line-height: 14px !important;
            &:hover {
              background: @depositBtnHover !important;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 750px) {
  .stats-container {
    width: 100%;
    .top-pools {
      width: 100%;
      .content {
        display: flex;
        flex-direction: column;
        .item {
          width: 100%;
          padding: 16px;
          min-width: 100%;
          &:hover {
            background: unset !important;
          }
        }
      }
    }
    .top-tokens {
      .content {
        padding: 0 16px !important;
        .pc-item {
          display: none;
        }
        .h5-item {
          display: block !important;
          width: 100%;
          background: @cardCenter;
          padding: 16px;
          margin-top: 8px;
          margin-bottom: 0 !important;
          height: unset !important;
          // padding: 0 !important;
          &:hover {
            background: unset !important;
          }
          .top {
            display: flex;
            justify-content: space-between;
            .token {
              &:hover {
                .name {
                  span {
                    display: none;
                  }
                }
              }
            }
            .cancel-btn {
              font-size: 12px !important;
              width: 80px !important;
              height: 28px !important;
              line-height: 14px !important;
            }
          }
          .bottom {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
            .data {
              width: 40%;
              &:nth-child(1) {
                width: 60%;
              }
              .price {
                width: 100%;
              }
              span {
                color: @textDefaultStats;
                font-size: 12px;
              }
              p {
                font-size: 14px;
                color: @textActive;
                margin-bottom: 0 !important;
              }
            }
          }
        }
        .item {
          &:nth-child(1) {
            display: none;
          }
        }
      }
    }
  }
}
</style>
