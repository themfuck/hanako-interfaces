<template>
  <div class="price-range">
    <div class="price-range-header">
      <div class="left">
        <span>Price range</span>
        <StatusBlock :current-status="positionInfo.currentStatus"></StatusBlock>
      </div>
      <div class="right">
        <div v-if="direct" class="price">
          1 {{ positionInfo.token_a.symbol }} ≈
          {{ fixD(positionInfo.currentPrice, positionInfo.token_b.decimal) }}
          {{ positionInfo.token_b.symbol }}
        </div>
        <div v-else class="price">
          1 {{ positionInfo.token_b.symbol }} ≈
          {{ fixD(1 / positionInfo.currentPrice, positionInfo.token_b.decimal) }}
          {{ positionInfo.token_a.symbol }}
        </div>
        <!-- <div class="coin-tab">
          <div :class="direct ? 'active' : ''" @click="changeDirect(true)">
            {{ positionInfo.token_a.symbol }}
          </div>
          <div :class="!direct ? 'active' : ''" @click="changeDirect(false)">
            {{ positionInfo.token_b.symbol }}
          </div>
        </div> -->
        <CoinTab
          :direct="direct"
          :form-coin-symbol="positionInfo.token_a.symbol"
          :to-coin-symbol="positionInfo.token_b.symbol"
          @changeDirect="val => $emit('changeDirect', val)"
        />
      </div>
    </div>
    <div class="price-range-footer">
      <div class="price-range-block">
        <div class="price-item">
          <div class="title">Min Price</div>
          <p v-if="direct" class="price">
            {{ decimalFormat(positionInfo.minPrice, 6) }}
          </p>
          <p v-else class="price">
            {{ decimalFormat(1 / positionInfo.maxPrice, 6) }}
          </p>
          <div v-if="!direct" class="text">
            {{ positionInfo.token_a.symbol }} per
            {{ positionInfo.token_b.symbol }}
          </div>
          <div v-else class="text">
            {{ positionInfo.token_b.symbol }} per
            {{ positionInfo.token_a.symbol }}
          </div>
        </div>
        <div class="price-item">
          <div class="title">Max Price</div>
          <p v-if="direct" class="price">
            {{ positionInfo.maxPrice.indexOf('∞') > -1 ? '∞' : decimalFormat(positionInfo.maxPrice, 6) }}
          </p>
          <p v-else class="price">
            {{ positionInfo.maxPrice.indexOf('∞') > -1 ? '∞' : decimalFormat(1 / positionInfo.minPrice, 6) }}
          </p>
          <div v-if="!direct" class="text">
            {{ positionInfo.token_a.symbol }} per
            {{ positionInfo.token_b.symbol }}
          </div>
          <div v-else class="text">
            {{ positionInfo.token_b.symbol }} per
            {{ positionInfo.token_a.symbol }}
          </div>
        </div>
      </div>
      <div class="text-block">
        <div class="note">
          Your position will be 100% composed of
          {{ positionInfo.token_a.symbol }} at this price
        </div>

        <div class="note">
          Your position will be 100% composed of
          {{ positionInfo.token_b.symbol }} at this price
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { fixD, decimalFormat } from '@/utils/index'
export default defineComponent({
  props: {
    positionInfo: {
      type: Object,
      required: true
    },
    direct: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    // const direct = ref(true)
    // const change = (value: boolean) => {
    //   ctx.emit('changeDirect', value)
    // }
    return { fixD, decimalFormat }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.price-range {
  margin-top: 8px;
  .price-range-header {
    padding: 18px 20px;
    background: @cardTop;
    display: flex;
    justify-content: space-between;
    line-height: 1;
    .left {
      display: flex;
      align-items: center;
      span {
        color: @textActive;
        font-size: 16px;
        font-weight: 500;
        margin-right: 8px;
      }
      .data-block-status {
        margin-left: 4px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .price {
        font-size: 14px;
        font-weight: 500;
        color: @themeColor;
      }
    }
  }
  .price-range-footer {
    background: #121212;
    padding: 0 20px;
    .price-range-block {
      border-bottom: 1px solid rgba(#717171, 0.1);
      background: transparent !important;
      margin-top: 0px;
      .price-item {
        padding: 16px 0;
      }
    }
    .text-block {
      .note {
        padding: 10px 52px 21px 70px;
      }
    }
  }
}
@media (max-width: 750px) {
  .price-range {
    margin-top: 10px 8px;
    .price-range-header {
      padding: 8px;
      position: relative;
      height: 80px;
      .left {
        margin-top: -20px;
      }
      .right {
        .price {
          position: absolute;
          left: 8px;
          bottom: 10px;
        }
        .coin-tab {
          margin-top: -20px;
        }
      }
    }
    .price-range-footer {
      padding: 10px;
      .text-block {
        .note {
          padding: 10px;
        }
      }
    }
  }
}
</style>
