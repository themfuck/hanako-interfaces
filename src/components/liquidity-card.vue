<template>
  <div class="liquidity-card">
    <div class="liquidity-top">
      <div class="left">
        <div class="title">{{ title }}</div>
        <a-button v-if="title !== 'Liquidity'" class="claim-btn" @click="$emit('openClaim')">Claim</a-button>
      </div>
      <div class="right">
        <div class="amount">$ 519554.141</div>
      </div>
    </div>
    <div class="liquidity-bottom">
      <div class="token-a">
        <div class="left">
          <img :src="positionInfo.token_a.icon || importIcon(`/image/coins/${positionInfo.token_a.symbol.toLowerCase()}.png`)" />
          <span>{{ positionInfo.token_a.symbol }}</span>
          <svg v-if="title == 'Liquidity'" class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-jump"></use>
          </svg>
        </div>
        <div class="right">
          <span>0.01641</span>
          <div v-if="title == 'Liquidity'" class="fee">50%</div>
        </div>
      </div>
      <div class="token-b">
        <div class="left">
          <img :src="positionInfo.token_a.icon || importIcon(`/image/coins/${positionInfo.token_b.symbol.toLowerCase()}.png`)" />
          <span>{{ positionInfo.token_b.symbol }}</span>
        </div>
        <div class="right">
          <span>0.01641</span>
          <div v-if="title == 'Liquidity'" class="fee">50%</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import importIcon from '@/utils/import-icon'
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    },
    positionInfo: {
      type: Object,
      required: true
    }
  },
  setup() {
    return { importIcon }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.liquidity-card {
  width: 400px;
  .liquidity-top {
    height: 80px;
    padding: 16px 20px;
    background: @cardTop;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .left {
      height: 24px;
      margin-top: -5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 14px;
        font-weight: 400;
        color: @textDefault;
      }
      .claim-btn {
        width: 80px;
        height: 24px;
        background: @themeColor;
        line-height: 1;
        font-size: 12px;
      }
    }
    .right {
      .amount {
        font-size: 20px;
        font-weight: 400;
        color: @textActive;
        // margin-top: 14px;
      }
    }
  }
  .liquidity-bottom {
    background: #121212;
    padding: 12px 20px;
    .token-a,
    .token-b {
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        img {
          width: 24px;
          height: 24px;
        }
        span {
          font-size: 16px;
          font-weight: 400;
          color: @textActive;
          margin-left: 8px;
        }
        svg {
          width: 14px;
          height: 14px;
          fill: @textActive;
          margin-left: 5px;
          &:hover {
            fill: @themeColor;
          }
        }
      }
      .right {
        color: @textActive;
        display: flex;
        align-items: center;
        .fee {
          width: 60px;
          height: 28px;
          background: @buttonDetailDefault;
          border: 1px solid @borderDefault;
          text-align: center;
          line-height: 28px;
          margin-left: 8px;
        }
      }
    }
    .token-b {
      margin-top: 24px;
    }
  }
}
@media (max-width: 750px) {
  .liquidity-card {
    width: 100%;
    .liquidity-top,
    .liquidity-bottom {
      padding-left: 8px;
      padding-right: 8px;
    }
  }
}
</style>
