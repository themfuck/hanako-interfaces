<template>
  <div class="coin-tab">
    <div :class="direct ? 'active' : ''" @click="$emit('changeDirect', true)">
      {{ formCoinSymbol }}
    </div>
    <div :class="!direct ? 'active' : ''" @click="$emit('changeDirect', false)">
      {{ toCoinSymbol }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    direct: {
      type: Boolean,
      default: true
    },
    formCoinSymbol: {
      type: String,
      default: ''
    },
    toCoinSymbol: {
      type: String,
      default: ''
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
// .coin-tab {
//   min-width: 100px;
//   height: 28px;
//   margin-left: 12px;
//   background: #0f0f0f;
//   display: flex;
//   align-items: center;
//   div {
//     color: @textDefault;
//     height: 100%;
//     display: flex;
//     padding: 6px 21px;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     &.active {
//       background: @buttonDetailDefault;
//       border: 1px solid @borderDefault;
//       color: @textActive;
//     }
//   }
// }
.coin-tab {
  width: 152px;
  height: 28px;
  background: @cardEmphasize;
  display: flex;
  align-items: center;
  margin-left: 20px;
  div {
    border: 1px solid #333;
    width: 50%;
    color: @textDefault;
    height: 100%;
    display: flex;
    padding: 6px 21px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    border-radius: 0 !important;
    &:nth-child(1) {
      border-right: 1px solid transparent;
      border-radius: 0 !important;
    }
    &:nth-child(2) {
      border-left: 1px solid transparent;
      border-radius: 0 !important;
    }
    &.active {
      background: @buttonDetailDefault;
      border: 1px solid @borderDefault !important;
      color: @textActive;
      border-radius: 0 !important;
    }
  }
}
</style>
