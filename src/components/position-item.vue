<template>
  <div class="position-item">
    <div class="card-header">
      <!-- <div class="coin-pair">
        <img :src="pItem.token_a.icon || importIcon(`/image/coins/${pItem.token_a.symbol.toLowerCase()}.png`)" />
        <img :src="pItem.token_b.icon || importIcon(`/image/coins/${pItem.token_b.symbol.toLowerCase()}.png`)" />
        <span>{{ pItem.token_a.symbol }} - {{ pItem.token_b.symbol }}</span>
      </div> -->
      <CoinPairName :from-coin="pItem.token_a" :to-coin="pItem.token_b" />
      <div class="fee">0.3%</div>
    </div>
    <div class="card-content">
      <div class="left">
        <div class="min-and-max">
          <div class="label">Min:</div>
          <div class="text">1504.2 USDT pre USDC</div>
        </div>
        <img src="@/assets/image/icon-arrow@2x.png" alt="" />
        <div class="min-and-max">
          <div class="label">Max:</div>
          <div class="text">1504.2 USDT pre USDC</div>
        </div>
        <div class="details-btn" @click="router.push('/position-detail/111')">Details</div>
      </div>
      <div class="right">
        <PositionStatus
          :p-item="pItem"
          :current-status="getCurrentStatus(pItem)"
          :nft-token-account="pItem.nftTokenAccount"
          :nft-token-mint="pItem.nftTokenMint"
        ></PositionStatus>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import importIcon from '@/utils/import-icon'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    pItem: {
      type: Object,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    function getCurrentStatus(pItem: any) {
      if (!pItem.liquity || pItem.liquity.toString() == '0') {
        return 'Closed'
      } else if (
        (Number(pItem.currentPriceView) >= Number(pItem.minPrice) && Number(pItem.currentPriceView) <= Number(pItem.maxPrice)) ||
        (!Number(pItem.minPrice) && isNaN(Number(pItem.maxPrice)))
      ) {
        return 'Active'
      } else {
        return 'Inactive'
      }
    }
    return { importIcon, getCurrentStatus, router }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.position-item {
  margin-bottom: 8px;
  .card-header {
    background: @cardTop;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    // .coin-pair {
    //   img {
    //     width: 24px;
    //     height: 24px;
    //     &:nth-of-type(2) {
    //       margin-left: -10px;
    //     }
    //   }
    //   span {
    //     font-size: 16px;
    //     font-weight: 500;
    //     color: @textActive;
    //     margin-left: 8px;
    //   }
    // }
    .fee {
      padding: 2px 8px;
      background: rgba(#fff, 0.1);
      color: @textActive;
      font-size: 14px;
      font-weight: 400;
    }
  }
  .card-content {
    background: #121212;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    .left {
      text-align: center;
      .min-and-max {
        display: flex;
        font-size: 12px;
        font-weight: 400;
        .label {
          color: @textDefault;
        }
        .text {
          margin-left: 12px;
          font-weight: 400 !important;
          color: @textActive;
        }
      }
      img {
        width: 20px;
        height: 20px;
        margin: 12px auto;
      }
      .details-btn {
        width: 200px;
        height: 28px;
        background: @buttonDetailDefault;
        border: 1px solid @borderDefault;
        color: @themeColor;
        text-align: center;
        line-height: 28px;
        margin-top: 20px;
        font-size: 12px;
        font-weight: 400;
        &:hover {
          background: @buttonDetailHover;
        }
      }
    }
  }
}

@media (max-width: 750px) {
  .position-item {
    .card-header {
      padding: 14px 8px;
    }
    .card-content {
      display: flex;
      align-items: center;
      flex-direction: column-reverse;
      padding: 20px 8px;
      .left {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-top: 15px;
        width: 100%;
        .min-and-max {
          .label {
            color: @textActive;
          }
          .text {
            margin-left: 6px;
          }
        }
        .details-btn {
          width: 100% !important;
        }
      }
    }
  }
}
</style>
