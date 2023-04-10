<template>
  <Modal width="440px" :visible="true" :footer="null" title="Add Liquidity" class="add-liquidity-modal" @cancel="$emit('onClose')">
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="add-liquidity-container">
      <div class="top">
        <!-- <div class="coin-pair">
          <img
            :src="secondConfirmData.fromCoin.icon || importIcon(`/image/coins/${secondConfirmData.fromCoin.symbol.toLowerCase()}.png`)"
          />
          <img :src="secondConfirmData.toCoin.icon || importIcon(`/image/coins/${secondConfirmData.toCoin.symbol.toLowerCase()}.png`)" />
          <span>{{ secondConfirmData.fromCoin.symbol }} - {{ secondConfirmData.toCoin.symbol }}</span>
        </div> -->
        <CoinPairName :from-coin="secondConfirmData.fromCoin" :to-coin="secondConfirmData.toCoin" />
        <StatusBlock :current-status="secondConfirmData.currentStatus" />
      </div>
      <div class="induction info">
        <div class="item">
          <span class="induction-text">{{ secondConfirmData.fromCoin.symbol }}</span>
          <span v-if="!isIncrease" class="induction-value">{{ secondConfirmData.fromCoinAmount || 0 }}</span>
          <span v-else class="induction-value">{{ secondConfirmData.fromCoinAmount || 0 }} → 3.1212</span>
        </div>
        <div class="item">
          <span class="induction-text">{{ secondConfirmData.toCoin.symbol }}</span>
          <span v-if="!isIncrease" class="induction-value">{{ secondConfirmData.toCoinAmount || 0 }}</span>
          <span v-else class="induction-value">{{ secondConfirmData.toCoinAmount || 0 }} → 7.99212</span>
        </div>
        <div class="item">
          <span class="induction-text">Fee Tier</span>
          <span class="induction-value">{{ secondConfirmData.feeTier }}</span>
        </div>
      </div>
      <div class="range-box">
        <div class="range-title">
          <h3>Selected Range</h3>
        </div>
        <div class="current-price">
          <!-- <span>Current price</span> -->
          <div v-if="direct">
            1 {{ secondConfirmData.fromCoin.symbol }} ≈
            {{ fixD(secondConfirmData.currentPrice, secondConfirmData.toCoin.decimal) }}
            {{ secondConfirmData.toCoin.symbol }}
          </div>
          <div v-else>
            1 {{ secondConfirmData.toCoin.symbol }} ≈
            {{ fixD(1 / secondConfirmData.currentPrice, secondConfirmData.toCoin.decimal) }}
            {{ secondConfirmData.fromCoin.symbol }}
          </div>
          <!-- <div class="coin-tab">
            <div :class="direct ? 'active' : ''" @click="changeDirect(true)">
              {{ secondConfirmData.fromCoin.symbol }}
            </div>
            <div :class="!direct ? 'active' : ''" @click="changeDirect(false)">
              {{ secondConfirmData.toCoin.symbol }}
            </div>
          </div> -->
          <CoinTab
            :direct="direct"
            :form-coin-symbol="secondConfirmData.fromCoin.symbol"
            :to-coin-symbol="secondConfirmData.toCoin.symbol"
            @changeDirect="val => (direct = val)"
          />
        </div>
        <div class="price-range-block">
          <div class="price-item">
            <div class="title">Min Price</div>
            <p v-if="direct" class="price">
              {{ decimalFormat(secondConfirmData.minPrice, 6) }}
            </p>
            <p v-else class="price">
              {{ decimalFormat(1 / secondConfirmData.maxPrice, 6) }}
            </p>
            <div v-if="!direct" class="text">
              {{ secondConfirmData.fromCoin.symbol }} per
              {{ secondConfirmData.toCoin.symbol }}
            </div>
            <div v-else class="text">
              {{ secondConfirmData.toCoin.symbol }} per
              {{ secondConfirmData.fromCoin.symbol }}
            </div>
          </div>
          <div class="price-item">
            <div class="title">Max Price</div>
            <p v-if="direct" class="price">
              {{ secondConfirmData.maxPrice.indexOf('∞') > -1 ? '∞' : decimalFormat(secondConfirmData.maxPrice, 6) }}
            </p>
            <p v-else class="price">
              {{ secondConfirmData.maxPrice.indexOf('∞') > -1 ? '∞' : decimalFormat(1 / secondConfirmData.minPrice, 6) }}
            </p>
            <div v-if="!direct" class="text">
              {{ secondConfirmData.fromCoin.symbol }} per
              {{ secondConfirmData.toCoin.symbol }}
            </div>
            <div v-else class="text">
              {{ secondConfirmData.toCoin.symbol }} per
              {{ secondConfirmData.fromCoin.symbol }}
            </div>
          </div>
        </div>
        <div class="text-block">
          <div class="note">
            Your position will be 100% composed of
            {{ secondConfirmData.fromCoin.symbol }} at this price
          </div>

          <div class="note">
            Your position will be 100% composed of
            {{ secondConfirmData.toCoin.symbol }} at this price
          </div>
        </div>
      </div>
    </div>
    <a-button class="big-btn liquidity-btn">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-icon-add" />
      </svg>
      {{ !isIncrease ? 'Add Liquidity' : 'Add More' }}
    </a-button>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { fixD, decimalFormat } from '@/utils'
export default defineComponent({
  components: { Modal },
  props: {
    isIncrease: {
      type: Boolean,
      required: false
    }
  },
  setup() {
    const secondConfirmData = reactive({
      fromCoin: {
        symbol: 'CUSDT',
        name: 'CUSDT',
        token_mint: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
        swap_token_account: 'EPyDSacqb9PH4SoXFov21VPnVSdMBw4N4aQurC89k8ei',
        decimal: 8,
        show_decimal: 4,
        calculate_decimal: 6,
        tokenAccountAddress: 'EFVNcMQwxzwsGq4uhRDPeZHy4LUY1R7EPzGK8dFngZNu',
        balance: { decimals: 8, _decimals: '100000000', wei: '60195129396' }
      },
      toCoin: {
        symbol: 'CUSDC',
        name: 'CUSDC',
        token_mint: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
        swap_token_account: 'EDSWfuCTcCNXM5WeMZntLkQUjZuXeCp6mEKe5FbEXNX',
        decimal: 8,
        show_decimal: 4,
        calculate_decimal: 6,
        tokenAccountAddress: 'HCcBQYAh6kTw5CL58urZCWdFevsU2SWSxaHYmVf3bo2Q',
        balance: { decimals: 8, _decimals: '100000000', wei: '76482100375' }
      },
      fromCoinAmount: '1',
      toCoinAmount: '5.25132139',
      currentPrice: 0.9995373145698367,
      minPrice: '0.9950127279292509038664997734721554603704755158639167078309052856',
      maxPrice: '1.0004000600040001',
      showFromCoinLock: false,
      showToCoinLock: false,
      currentStatus: 'Active',
      feeTier: '0.01%'
    })
    const direct = ref(true)
    function changeDirect(value: boolean) {
      direct.value = value
    }
    return { secondConfirmData, importIcon, fixD, decimalFormat, direct, changeDirect }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.add-liquidity-modal {
  position: relative;
  .add-liquidity-container {
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .status {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px 16px;
        min-width: 80px;
        height: 28px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        i {
          width: 6px;
          height: 6px;
          background: #00ff4d;
          border-radius: 100%;
          margin-right: 6px;
        }
        svg {
          width: 20px;
          height: 20px;
          fill: rgba(255, 255, 255, 0.8);
          margin-right: 4px;
        }
        span {
          font-size: 14px;
          color: #fff;
        }
      }
    }

    .info {
      width: 100%;
      margin-top: 20px;
    }

    .range-box {
      width: 100%;
      margin-top: 8px;
      .current-price {
        color: @themeColor;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .range-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        h3 {
          font-size: 16px;
          color: @textActive;
          font-weight: 500;
        }
      }
      .text-block {
        .note {
          padding: 10px 16px;
        }
      }
    }
  }
  .liquidity-btn {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    bottom: -65px;
  }
}
@media (max-width: 750px) {
  .add-liquidity-modal {
    .range-box {
      position: relative;
      .current-price {
        div {
          &:nth-child(1) {
            margin-top: 8px;
          }
          &:nth-child(2) {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
    }
  }
}
</style>
