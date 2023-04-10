<template>
  <div v-if="isShow == 'big'" class="echarts-container">
    <div class="echarts-content-box">
      <div class="echarts-tab">
        <!-- <p v-if="volTime.day">{{ volTime.day }} {{ volTime.month }} , {{ volTime.year }}</p>
        <p v-else-if="volTime.current">
          {{ volTime.current ? volTime.current : '' }}
        </p>
        <p v-else>Past 24H</p> -->
        <div class="title-day" :class="echartVal == 'D' ? 'title-active' : ''" @click="changeEchart('D')">D</div>
        <div class="title-week" :class="echartVal == 'W' ? 'title-active' : ''" @click="changeEchart('W')">W</div>
        <div class="title-mouth" :class="echartVal == 'M' ? 'title-active' : ''" @click="changeEchart('M')">M</div>
      </div>
      <div class="echarts-content">
        <div class="left">
          <span>{{ $t('common.tradingVal24h') }}</span>
          <p>${{ TradingVolume ? addCommom(TradingVolume, 2) : addCommom(vol_in_usd_24h, 2) }}</p>
        </div>
        <div id="echartsBox" class="right"></div>
      </div>
    </div>
    <div class="echarts-data">
      <div class="item">
        <div class="left">
          <span>{{ $t('common.cumulativeVolume') }}</span>
          <p>${{ addCommom(getNum(vol_in_usd), 2) }}</p>
        </div>
        <img v-if="store.theme == 'default'" src="../assets/image/ICON-Cumulative-Volume@2x.png" />
        <img v-else src="../assets/sui-image/ICON-Cumulative-Volume@2x.png" />
      </div>
      <div class="item">
        <div class="left">
          <span>{{ $t('common.totalValueLocked') }}</span>
          <p>${{ addCommom(getNum(tvl_in_usd), 2) }}</p>
        </div>
        <img v-if="store.theme == 'default'" src="../assets/image/ICON-Total-Value-Locked@2x.png" />
        <img v-else src="../assets/sui-image/ICON-Total-Value-Locked@2x.png" />
      </div>
      <div class="item">
        <div class="left">
          <span>{{ $t('common.cumulativeTransactions') }}</span>
          <p>{{ addCommom(tx_num, 2) }}</p>
        </div>
        <img v-if="store.theme == 'default'" src="../assets/image/ICON-Cumulative-Transactions@2x.png" />
        <img v-else src="../assets/sui-image/ICON-Cumulative-Transactions@2x.png" />
      </div>
      <div class="item">
        <div class="left">
          <span>{{ $t('common.totalAccount') }}</span>
          <p>{{ addCommom(user_num, 2) }}</p>
        </div>
        <img v-if="store.theme == 'default'" src="../assets/image/ICON-Account-Value-Locked@2x.png" />
        <img v-else src="../assets/sui-image/ICON-Account-Value-Locked@2x.png" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useIndexStore } from '@/store'
import { addCommom, checkNullObj } from '@/utils'
import * as echarts from 'echarts'
import { defineComponent, computed, onMounted, watchEffect, ref } from 'vue'
import configure from '@/utils/config'

export default defineComponent({
  props: {
    isShow: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    const counter = useIndexStore()
    const store: any = computed(() => {
      return counter
    })

    const config = computed(() => {
      return configure[store.value.chainName]
    })
    // watchEffect(async () => {
    //   if (store.value.theme) {
    //     setTimeout(() => {
    //       initialize()
    //     }, 50)
    //   }
    // })
    onMounted(() => {
      setTimeout(() => {
        getPhan(40, 100, 4, 'vol', 'day')
      }, 100)
    })
    const vol_in_usd_24h = ref(0)
    const vol_in_usd = ref(0)
    const tvl_in_usd = ref(0)
    const tx_num = ref(0)
    const user_num = ref(0)
    const getNum = value => {
      if (!value) return 0
      const newValue = ['', '', '']
      let fr = 1000
      let num = 3
      let txt = ''
      let fm = 1
      while (value / fr >= 1) {
        fr *= 10
        num += 1
      }

      if (num <= 6) {
        newValue[0] = value + ''
        newValue[1] = ''
      } else if (num <= 12) {
        txt = parseInt(String(num - 4)) / 3 >= 1 ? 'M' : 'K'
        fm = txt === 'K' ? 1000 : 1000000
        if (value % fm === 0) {
          newValue[0] = parseInt(String(value / fm)) + ''
        } else {
          newValue[0] = retain(parseFloat(String(value / fm)), 1)
        }
        newValue[1] = txt
      } else if (num <= 16) {
        txt = (num - 9) / 3 > 1 ? 'T' : 'B'
        fm = 1
        if (txt === 'B') {
          fm = 1000000000
        } else if (txt === 'T') {
          fm = 1000000000000
        }
        if (value % fm === 0) {
          newValue[0] = parseInt(String(value / fm)) + ''
        } else {
          newValue[0] = retain(parseFloat(String(value / fm)), 2)
        }
        newValue[1] = txt
      }
      if (value < 1000) {
        newValue[0] = value + ''
        newValue[1] = ''
      }
      return newValue.join('')
    }
    const retain = (num, decimal) => {
      num = num.toString()
      let index = num.indexOf('.')
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
      } else {
        num = num.substring(0)
      }
      return parseFloat(num).toFixed(decimal)
    }

    watchEffect(() => {
      if (!checkNullObj(store.value.statsData)) {
        vol_in_usd_24h.value = store.value.statsData.vol_in_usd_24h
        vol_in_usd.value = store.value.statsData.vol_in_usd
        tvl_in_usd.value = store.value.statsData.tvl_in_usd
        tx_num.value = store.value.statsData.tx_num
        user_num.value = store.value.statsData.user_num
      }
    })

    const echartVal = ref('D')
    const pillar: any = ref({})
    const changeEchart = val => {
      echartVal.value = val
      if (val == 'D') {
        getPhan(40, 100, 4, 'vol', 'day')
      } else if (val == 'W') {
        getPhan(30, 100, 7, 'vol', 'wek')
      } else if (val == 'M') {
        getPhan(20, 100, 10, 'vol', 'mon')
      }
    }
    const getPhan = async (val, num, width, title, date) => {
      const { data } = await fetch(`${config.value.api}/v1/histogram?date_type=${date}&typ=${title}&limit=${val}`).then(rsp => rsp.json())
      let list = data.list
      const result: any = {
        categoryData: [],
        valueData: [],
        wheelBase: []
      }
      if (list) {
        list.forEach(item => {
          result.categoryData.push(item.date.slice(0, 10))
          result.valueData.push(item.num)
        })
      }
      pillar.value = result
      initialize(num, width)
    }

    const volTime = ref({ day: '', month: '', year: '', current: '' })

    const TradingVolume = ref('')

    const mouthEn = months => {
      return months == 1
        ? 'Jan'
        : months == 2
        ? 'Feb'
        : months == 3
        ? 'Mar'
        : months == 4
        ? 'Apr'
        : months == 5
        ? 'May'
        : months == 6
        ? 'Jun'
        : months == 7
        ? 'Jul'
        : months == 8
        ? 'Aug'
        : months == 9
        ? 'Sep'
        : months == 10
        ? 'Oct'
        : months == 11
        ? 'Nov'
        : 'Dec'
    }

    const initialize = (val, wid) => {
      const chartpillar: any = document.getElementById('echartsBox')
      const myPillar = echarts.init(chartpillar)
      const colorList =
        store.value.theme == 'default'
          ? [
              '#1B302A',
              '#1C342D',
              '#1F3A32',
              '#1F3F34',
              '#22463B',
              '#234A3D',
              '#264F42',
              '#285544',
              '#295949',
              '#2D604E',
              '#2F6550',
              '#316954',
              '#336F59',
              '#34735B',
              '#377A61',
              '#397E64',
              '#3C856A',
              '#3E896D',
              '#408F71',
              '#449575',
              '#469A78',
              '#479D7C',
              '#4BA482',
              '#4EAB86',
              '#50AF89',
              '#50AF89',
              '#4EAB86',
              '#4BA482',
              '#479D7C',
              '#469A78',
              '#449575',
              '#408F71',
              '#3E896D',
              '#3C856A',
              '#397E64',
              '#377A61',
              '#34735B',
              '#336F59',
              '#316954',
              '#2F6550',
              '#2D604E',
              '#295949',
              '#285544',
              '#264F42',
              '#234A3D',
              '#22463B',
              '#1F3F34',
              '#1F3A32',
              '#1C342D',
              '#1B302A'
            ]
          : [
              '#182025',
              '#181E23',
              '#192832',
              '#1B2B38',
              '#1C2F3E',
              '#1F3444',
              '#1E3545',
              '#213B4F',
              '#254156',
              '#26455A',
              '#294961',
              '#2D4E67',
              '#2E536C',
              '#335772',
              '#365C78',
              '#3B6380',
              '#3F6886',
              '#406987',
              '#45708E',
              '#487393',
              '#4F7B9C',
              '#5580A3',
              '#5886A9',
              '#5F8BAF',
              '#6390B4',
              '#6390B4',
              '#5F8BAF',
              '#5886A9',
              '#5580A3',
              '#4F7B9C',
              '#487393',
              '#45708E',
              '#406987',
              '#3F6886',
              '#3B6380',
              '#365C78',
              '#335772',
              '#2E536C',
              '#2D4E67',
              '#294961',
              '#26455A',
              '#254156',
              '#213B4F',
              '#1E3545',
              '#1F3444',
              '#1C2F3E',
              '#1B2B38',
              '#192832',
              '#181E23',
              '#182025'
            ]

      let optionPillar: any = {
        tooltip: {
          // position: 'top',
          trigger: 'axis',
          position: function (point, params, dom, rect, size) {
            return [point[0] - 50, '10%']
          },
          backgroundColor: '#28353F',
          borderColor: 'transparent',
          extraCssText: 'height:24px;',
          formatter: function (params) {
            let months = params[0].axisValue.slice(5, 7)
            let value = mouthEn(months)
            const day = params[0].axisValue.slice(8, 10)
            const month = value
            const year = params[0].axisValue.slice(0, 4)
            volTime.value = {
              day: day,
              month: month,
              year: year,
              // current: params[0].dataIndex == this.list.categoryData.length - 1 ? 'current' : ''
              current: ''
            }

            TradingVolume.value = addCommom(params[0].value, 2)
            if (store.value.theme == 'default') {
              return (
                '&nbsp;&nbsp;&nbsp;' + day + '&nbsp;' + month + '&nbsp;' + year + '&nbsp;&nbsp;&nbsp;'
                // '</span>' +
                // '&nbsp;&nbsp;&nbsp;' +
                // '<span style="color:#46FFCF">' +
                // '$' +
                // '&nbsp;' +
                // addCommom(params[0].value, 2) +
                // '&nbsp;&nbsp;&nbsp;'
              )
            } else {
              return (
                '&nbsp;&nbsp;&nbsp;' + day + '&nbsp;' + month + '&nbsp;' + year + '&nbsp;&nbsp;&nbsp;'
                // params[0].name +
                // '</span>' +
                // '&nbsp;&nbsp;&nbsp;' +
                // '<span style="color:#76C8FF">' +
                // '$' +
                // '&nbsp;' +
                // params[0].value +
                // '&nbsp;&nbsp;&nbsp;'
              )
            }
          },
          textStyle: {
            color: '#909DB4',
            innerHeight: '24',
            lineHeight: '24'
          },
          padding: 0
        },
        xAxis: {
          max: pillar.value.categoryData.length > 40 ? 40 : pillar.value.categoryData.length - 1,
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          },
          data: pillar.value.categoryData,
          axisLabel: {
            formatter: (val, index) => {
              let showdata: any
              let months = val.slice(5, 7)
              let mValue = mouthEn(months)
              if (echartVal.value == 'M') {
                showdata = mValue
              } else {
                showdata = val.slice(8, 10)
              }
              return `${showdata}`
            }
          }
        },
        yAxis: {
          show: false,
          splitArea: { show: false }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: val,
            zoomLock: true
          }
        ],
        series: [
          {
            data: pillar.value.valueData,
            type: 'bar',
            itemStyle: {
              emphasis: {
                barBorderRadius: 7
              },
              normal: {
                barBorderRadius: 7,
                color: params => {
                  return colorList[params.dataIndex]
                }
              }
            },
            barWidth: wid
            // barCategoryGap: 4
          }
        ],
        grid: {
          right: 24
        }
      }
      if (document.body.clientWidth < 750) {
        optionPillar.grid = {
          bottom: 20
        }
      }
      if (store.value.theme == 'default') {
        optionPillar.tooltip.backgroundColor = '#293F38'
      }
      optionPillar && myPillar.setOption(optionPillar)
      myPillar.on('globalout', params => {
        volTime.value = { day: '', month: '', year: '', current: '' }
        TradingVolume.value = ''
      })
    }

    return {
      store,
      addCommom,
      vol_in_usd_24h,
      vol_in_usd,
      tvl_in_usd,
      tx_num,
      user_num,
      changeEchart,
      echartVal,
      volTime,
      TradingVolume,
      getNum
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';

.theme-sui {
  .echarts-content {
    background: url('../assets/sui-image/IMG-Trading-Volume@2x.png') !important;
    background-size: 100% 100% !important;
  }
}

.echarts-container {
  width: 100%;
  // border: 2px solid @borderGradient;
  background: @borderGradient;
  padding: 0 2px;

  .echarts-content-box {
    padding-top: 16px;
    background: #121212;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .echarts-tab {
      padding-right: 20px;
      display: flex;
      align-items: center;
      z-index: 99999;
      margin-bottom: 8px;
      p {
        color: @textActive;
        margin-bottom: 0 !important;
        margin-right: 10px;
      }
      > div {
        width: 24px;
        height: 24px;
        background: @cardEmphasize;
        border: 1px solid transparent;
        text-align: center;
        line-height: 24px;
        color: @textDefault;
        &:hover {
          color: @textActive;
        }
      }
      .title-active {
        color: @textActive;
        border: 1px solid @borderDefault;
        background: @buttonDetailDefault;
      }
    }
    .echarts-content {
      width: 100%;
      height: 156px;
      background: url('../assets/image/IMG-Trading-Volume-BG@2x.png');
      background-size: 100% 100%;
      padding: 20px 0px 10px 20px;
      display: flex;
      justify-content: space-between;

      .left {
        margin-top: 50px;

        span {
          font-size: 14px;
          color: @textDefaultStats;
        }

        p {
          margin-bottom: 0 !important;
          color: @themeColor;
          font-size: 20px;
          font-weight: 900;
        }
      }

      .right {
        margin-top: -50px;
        // margin-right: -40px;
        width: 450px;
        height: 216px;
        padding: 0px;
        z-index: 9999;
      }
    }
  }

  .echarts-data {
    width: 100%;
    display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    white-space: nowrap;
    background: @backgroundColor !important;

    .item {
      background: @moreBgReserve;
      // width: 264px;
      max-width: 25%;
      min-width: 25%;
      // width: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // text-align: center;
      padding: 24px 0px 24px 12px;
      border-right: 1px solid #142f2a;
      position: relative;

      span {
        font-size: 14px;
        color: @textDefaultStats;
      }

      p {
        margin-bottom: 0 !important;
        color: @themeColor;
        font-size: 20px;
        font-weight: 900;
      }
      .left {
        width: 100%;
      }

      > img {
        width: 40px;
        height: 40px;
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
      }

      &:nth-of-type(4) {
        border: none;
      }

      &:nth-of-type(4) {
        border: none;
      }
      // &:hover {
      //   background: @moreBgReserveHover;
      // }
    }
  }
}

@media (max-width: 750px) {
  .echarts-container {
    width: 100%;

    .echarts-content-box {
      .echarts-content {
        display: flex;
        flex-direction: column;
        height: 180px;
        background: @h5Stats !important;
        // overflow: hidden;
        padding-top: 28px;
        padding-left: 0 !important;
        .left {
          margin-top: -30px;
          padding-left: 20px !important;
        }

        .right {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100% !important;
          margin-top: -20px;
          // margin-left: -40px;
          // margin-right: 0 !important;
          // width: 420px !important;
          height: 170px !important;
          padding: 0px;
          z-index: 9999;
        }
      }
    }

    .echarts-data {
      display: flex;
      flex-direction: column;

      &:hover {
        background: unset !important;
      }

      .item {
        width: 100%;
        max-width: 100%;
        height: 80px;
      }
    }
  }
}
</style>
