<template>
  <div class="set-price-item">
    <h3 class="title">{{ pType }} Price</h3>
    <div class="input-box">
      <a class="minus-btn">
        <div :class="!fromCoin && !toCoin ? 'reductionDis' : 'reduction'"></div>
      </a>
      <a-input
        id="pValu"
        :value="inputValue"
        autocomplete="off"
        oninput="this.value = this.value.replace(/[^\d.]/g,'');"
        @input="$emit('onInput', $event.target.value)"
      />
      <a class="plus-btn">
        <div :class="!fromCoin && !toCoin ? 'addDis' : 'add'"></div>
      </a>
    </div>
    <p class="per-text" :class="!toCoin && !fromCoin ? 'per-text-disabled' : ''">
      {{ toCoin && toCoin.symbol }} per {{ fromCoin && fromCoin.symbol }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    inputValue: {
      type: String,
      required: true
    },
    pType: {
      type: String,
      default: 'Max'
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
    defaultMaxPrice: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="less" scoped>
@import '../assets/css/base.less';
.set-price-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  width: 234px;
  .title {
    color: @textDefault;
    margin-bottom: 0;
    font-size: 12px;
  }
  .input-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ant-input {
      text-align: center;
    }
    .plus-btn {
      .add {
        width: 20px;
        height: 20px;
        background: url('../assets/image/icon-add-def@2x.png');
        background-size: 100% 100%;
        &:hover {
          background: url('../assets/image/icon-add-hover@2x.png');
          background-size: 100% 100%;
        }
      }
      .addDis {
        width: 20px;
        height: 20px;
        background: url('../assets/image/icon-add-Disabled@2x.png');
        background-size: 100% 100%;
      }
    }
    .minus-btn {
      .reduction {
        width: 20px;
        height: 20px;
        background: url('../assets/image/icon-Reduction-def@2x.png');
        background-size: 100% 100%;
        &:hover {
          background: url('../assets/image/icon-Reduction-hover@2x.png');
          background-size: 100% 100%;
        }
      }
      .reductionDis {
        width: 20px;
        height: 20px;
        background: url('../assets/image/icon-Reduction-Disabled@2x.png');
        background-size: 100% 100%;
      }
    }
  }
  .per-text {
    color: @textDefault;
    margin-bottom: 0;
    font-size: 12px;
  }
}
@media (max-width: 750px) {
  .set-price-item {
    width: 50%;
    padding: 12px 8px;
    .input-box {
      width: 100%;
    }
  }
}
</style>
