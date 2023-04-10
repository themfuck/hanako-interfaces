<template>
  <div class="coin-logo">
    <div class="img-box">
      <img v-if="fromCoin" :src="fromCoin?.logoURI || importIcon(`/image/coins/${fromCoin?.symbol.toLowerCase()}.png`)" />
      <img v-if="toCoin" :src="toCoin?.logoURI || importIcon(`/image/coins/${toCoin?.symbol.toLowerCase()}.png`)" />
    </div>
    <span v-show="!fromCoin || !toCoin" class="coin-name">Select Pool</span>
    <!-- <span v-if="fromCoin && toCoin" class="coin-name">{{ fromCoin?.symbol }} - {{ toCoin?.symbol }}</span> -->
    <span v-show="fromCoin && toCoin" class="coin-name">{{ fromCoin?.symbol }} / {{ toCoin?.symbol }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import importIcon from '@/utils/import-icon'

export default defineComponent({
  props: {
    fromCoin: {
      type: Object,
      default: null
    },
    toCoin: {
      type: Object,
      default: null
    }
  },
  setup() {
    return { importIcon }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.coin-logo {
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    &:nth-child(2) {
      margin-left: -6px;
    }
    &:nth-last-child(1) {
      margin-right: 8px;
    }
  }
  .coin-name {
    font-size: 16px;
    font-weight: 400;
    color: @textActive;
  }
}
@media (max-width: 750px) {
  .coin-logo {
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      &:nth-child(2) {
        margin-left: -6px;
      }
    }
    .coin-name {
      font-size: 14px;
      font-weight: 400;
      color: @textActive;
    }
  }
}
</style>
