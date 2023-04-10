<template>
  <div class="set-price">
    <div class="title">
      <div class="left">Set Price Range</div>
      <div class="right">
        <span @click="resetPrice">Reset</span>
        <div class="full-range-btn" @click="changeShowUnderStand()">
          <div class="check-img">
            <img v-if="isRadio" src="../assets/image/icon-check@2x.png" alt="" />
          </div>
          <span>Full range</span>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div v-if="!showUnderStand" class="card">
        <Set-Price-Item
          v-model="minPrice"
          :input-value="minPrice"
          p-type="Min"
          :default-max-price="defaultMaxPrice"
          :from-coin="fromCoin"
          :to-coin="toCoin"
          :dirction="dirction"
          @onInput="val => (minPrice = val)"
        ></Set-Price-Item>
        <SetPriceItem
          v-model="maxPrice"
          :input-value="maxPrice"
          p-type="Max"
          :default-max-price="defaultMaxPrice"
          :from-coin="fromCoin"
          :to-coin="toCoin"
          :dirction="dirction"
          @onInput="val => (maxPrice = val)"
        ></SetPriceItem>
        <img :src="importIcon(`/image/lmg-line@2x.png`)" alt="" />
      </div>
      <div v-else class="understand">
        <div class="left">
          <p>Lower Efficiency</p>
          <p>Please note that full range positions may earn less fees than concentrated liquidity.</p>
        </div>
        <div class="right">
          <a-button @click="understand">I understand</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import importIcon from '@/utils/import-icon'

export default defineComponent({
  props: {
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    defaultMinPrice: {
      type: String,
      default: ''
    },
    defaultMaxPrice: {
      type: String,
      default: ''
    },
    fromCoin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    toCoin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dirction: {
      type: Boolean,
      default: true
    },
    invalidPriceRange: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    let minPrice = ref('')
    let maxPrice = ref('')
    // let understand = ref(false)
    let isRadio = ref(false)
    let showUnderStand = ref(false)
    onMounted(() => {
      minPrice.value = props.min
      maxPrice.value = props.max
    })
    watch(
      () => props.min,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          minPrice.value = props.min
        }
      }
    )
    watch(
      () => props.max,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          maxPrice.value = props.max
        }
      }
    )
    watch(minPrice, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        ctx.emit('onChangeMinPrice', newVal)
      }
    })
    watch(maxPrice, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        ctx.emit('onChangeMaxPrice', newVal)
      }
    })
    const resetPrice = () => {
      minPrice.value = props.defaultMinPrice
      maxPrice.value = props.defaultMaxPrice
      showUnderStand.value = false
      isRadio.value = false
    }
    const understand = () => {
      showUnderStand.value = false
      minPrice.value = '0'
      maxPrice.value = '∞'
    }
    const changeShowUnderStand = () => {
      isRadio.value = !isRadio.value
      if (isRadio.value) {
        showUnderStand.value = true
      } else {
        resetPrice()
      }
      if (!showUnderStand.value) {
        minPrice.value = props.defaultMinPrice
        maxPrice.value = props.defaultMaxPrice
      }
    }
    return { importIcon, resetPrice, changeShowUnderStand, showUnderStand, minPrice, maxPrice, understand, isRadio }
  }
})
</script>

<style lang="less" scoped>
@import '../assets/css/base.less';
.set-price {
  margin-top: 16px;
  .title {
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      color: @textActive;
      font-size: 16px;
    }
    .right {
      display: flex;
      align-items: center;
      span {
        font-size: 12px;
        font-weight: 500;
        color: @textDefault;
        &:hover {
          color: @textActive;
        }
      }
      .full-range-btn {
        display: flex;
        align-items: center;
        .check-img {
          width: 16px;
          height: 16px;
          background: url('../assets/image/checkbox@2x.png');
          background-size: 100% 100%;
          margin-left: 16px;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px;
          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
  .card-container {
    position: relative;
    .card {
      width: 468px;
      background: @cardEmphasize;
      display: flex;
      position: relative;
      img {
        width: 8px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -4px;
      }
    }
    .understand {
      padding: 16px 20px;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid @borderDefault;
      backdrop-filter: blur(8px);
      display: flex;
      // position: absolute;
      // top: 0;
      // left: 0;
      .left {
        width: 300px;
        height: 40px;
        font-size: 12px;
        font-weight: 400;
        color: @textTips;
        line-height: 20px;
        p {
          margin-bottom: 5px;
        }
      }
      .right {
        width: 88px;
        height: 20px;
        margin-left: 15px;
        margin-top: 20px;
      }
    }
  }
}
@media (max-width: 750px) {
  .set-price {
    width: 100%;
    height: 100%;
    .card-container {
      width: 100%;
      height: 100%;
      .card {
        width: 100%;
      }
      .understand {
        display: flex;
        flex-direction: column;
        align-items: center;
        // height: unset;
        padding: 8px 8px 16px;
        .left {
          height: 100%;
        }
        .right {
          margin: 8px 0;
        }
      }
    }
  }
}
</style>
