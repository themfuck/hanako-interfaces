<template>
  <div class="pools-position-item">
    <div class="card-header">
      <CoinPairName v-if="index.chainName === 'Aptos'" :from-coin="pItem.coinA" :to-coin="pItem.coinB" />
      <!-- <svg :class="openCard ? 'icon open-icon' : 'icon'" aria-hidden="true" @click="openCard = !openCard">
        <use xlink:href="#icon-icon_on" />
      </svg> -->
      <div v-else class="coin-logo">
        <div class="img-box">
          <img v-if="pItem.coinA" :src="pItem.coinA?.logoURI || importIcon(`/image/coins/${pItem.coinA?.symbol.toLowerCase()}.png`)" />
          <img v-if="pItem.coinB" :src="pItem.coinB?.logoURI || importIcon(`/image/coins/${pItem.coinB?.symbol.toLowerCase()}.png`)" />
        </div>
        <div v-show="pItem.coinA && pItem.coinB" class="symbol-name">
          <span class="coin-symbol">{{ pItem.coinA?.symbol }} / {{ pItem.coinB?.symbol }}</span>
          <span class="coin-name">{{ pItem.coinA?.name }} / {{ pItem.coinB?.name }}</span>
        </div>
      </div>
      <div
        v-if="(index.chainName === 'Aptos' && pItem.coinA.name.toLowerCase().includes('z')) || pItem.coinB.name.toLowerCase().includes('z')"
        class="label green"
      >
        LayerZero
      </div>
      <div
        v-if="
          (index.chainName === 'Aptos' && pItem.coinA.name.toLowerCase().includes('wo')) || pItem.coinB.name.toLowerCase().includes('wo')
        "
        class="label blue"
      >
        Wormhole
      </div>
      <div
        v-if="
          (index.chainName === 'Aptos' && pItem.coinA.name.toLowerCase().includes('ce')) || pItem.coinB.name.toLowerCase().includes('ce')
        "
        class="label purple"
      >
        Celer
      </div>
    </div>
    <div class="induction">
      <div class="item">
        <div class="induction-text">{{ $t('common.totalLiquidity') }}</div>
        <div v-if="pItem.totalLpUSD" class="induction-value">
          <div v-if="pItem.showTotalLpUSD || index.chainName == 'Aptos'">
            {{ pItem.totalLpUSD && `$ ${addCommom(pItem.totalLpUSD, 2)}` }}
          </div>
          <div v-else class="coin-amount">
            <div>
              <span>{{ addCommom(pItem.totalCoinXAmount, pItem.coinA.decimals) }}</span> <i>{{ pItem.coinA.symbol }}</i>
            </div>
            <div>
              <span>{{ addCommom(pItem.totalCoinYAmount, pItem.coinB.decimals) }}</span> <i>{{ pItem.coinB.symbol }}</i>
            </div>
          </div>
        </div>
        <template v-else>
          <a-spin :indicator="indicator" />
        </template>
      </div>
    </div>
    <div class="card-content">
      <div v-if="pItem && Number(pItem.balance) && wallet.connected" class="content-top">
        <div class="top">
          <div class="text">{{ $t('common.yourPoolTokens') }}</div>
          <div class="value">
            <p>{{ getLpView(pItem) }}</p>
            &nbsp;&nbsp;
            <span v-if="Number(pItem.myBalanceUSD)"> ~ ${{ addCommom(pItem.myBalanceUSD, 2) }} </span>
          </div>
        </div>
        <div class="bottom">
          <div class="btn-box">
            <a-button class="cancel-btn" @click="toRemove">{{ $t('button.remove') }}</a-button>
            <a-button :disabled="index.chainName == 'Aptos'" class="confirm-btn" @click="toAdd">{{ $t('button.add') }}</a-button>
          </div>
        </div>
      </div>
      <a-button
        v-else
        :disabled="index.chainName == 'Aptos'"
        class="add-big-btn"
        @click="router.push(`/pools-liquidity-add?from=${pItem.coinA.symbol}&to=${pItem.coinB.symbol}`)"
      >
        {{ $t('button.addLiquidity') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, h, reactive } from 'vue'
import importIcon from '@/utils/import-icon'
import { thousands, addCommom } from '@/utils'
import { useWalletStore } from '../store/wallet'
import { useIndexStore } from '../store/index'
import { useRouter } from 'vue-router'
import { d } from 'test-cetus-sdk/dist/utils/numbers'
import { LoadingOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  props: {
    pItem: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '12px',
        color: '#fff',
        paddingBottom: '3px'
      },
      spin: true
    })

    const router = useRouter()
    const walletStore = useWalletStore()
    const wallet = computed(() => {
      return walletStore
    })

    const indexStore = useIndexStore()
    const index = computed(() => {
      return indexStore
    })

    function toRemove() {
      if (props.pItem) router.push(`/pools-management-remove?from=${props.pItem.coinA.symbol}&to=${props.pItem.coinB.symbol}`)
    }
    function toAdd() {
      if (props.pItem) router.push(`/pools-liquidity-add?from=${props.pItem.coinA.symbol}&to=${props.pItem.coinB.symbol}`)
    }
    function getLpView(pitem: any) {
      const lp = pitem.balance
      const r = d(lp).div(Math.pow(10, pitem.decimals)).toString()
      return addCommom(r, pitem.decimals)
    }
    return { indicator, thousands, importIcon, router, toRemove, toAdd, wallet, addCommom, getLpView, index }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.pools-position-item {
  margin-bottom: 8px;
  .ant-spin-spinning {
    width: 14px !important;
    height: 14px !important;
    line-height: 10px !important;
    margin-right: 4px;
  }
  .card-header {
    background: @cardTop;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    .coin-logo {
      display: flex;
      align-items: center;
      img {
        width: 36px;
        height: 36px;
        &:nth-child(2) {
          margin-left: -6px;
        }
        &:nth-last-child(1) {
          margin-right: 8px;
        }
      }
      .coin-symbol {
        font-size: 16px;
        font-weight: 400;
        color: @textActive;
      }
      .symbol-name {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .coin-name {
          font-size: 12px;
          font-weight: 400;
          color: @textDefault;
        }
      }
    }
    .label {
      width: 90px;
      height: 22px;
      text-align: center;
      line-height: 22px;
      font-size: 12px;
    }
    .green {
      background: url('../assets/image/green.png');
      background-size: 100% 100%;
      color: #6dd7ba;
    }
    .purple {
      background: url('../assets/image/purple.png');
      background-size: 100% 100%;
      color: #899bff;
    }
    .blue {
      background: url('../assets/image/blue.png');
      background-size: 100% 100%;
      color: #6dc0d7;
    }
    svg {
      width: 12px;
      height: 12px;
      fill: @themeColor;
    }
    .open-icon {
      transform: rotateX(180deg);
    }
  }
  .induction {
    background: #121212;
    padding-bottom: 0;
    .induction-text {
      font-size: 14px;
    }
    .induction-value {
      font-size: 14px;
    }
    .coin-amount {
      font-size: 12px;
      div {
        display: flex;
        justify-content: flex-end;
      }
      i {
        color: @textDefault;
        font-style: normal;
        margin-left: 4px;
      }
    }
  }
  .card-content {
    background: #121212;
    padding: 16px;
    .top {
      width: 100%;
      padding: 16px 0;
      background: @cardCenter;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      .text {
        padding-left: 12px;
        font-size: 14px;
        color: @textDefault;
      }
      .value {
        margin-top: 5px;
        padding-left: 12px;
        display: flex;
        align-items: flex-end;
        p {
          font-size: 16px;
          color: @textActive;
          margin-bottom: 0;
        }
        span {
          font-size: 14px;
          color: @textDefault;
        }
      }
    }
    .btn-box {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      .ant-btn {
        width: 48% !important;
        height: 42px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
      }
    }
  }
  .add-big-btn {
    font-size: 14px !important;
    width: 100% !important;
    font-weight: 500 !important;
    height: 42px !important;
  }
}

@media (max-width: 750px) {
  .pools-position-item {
    width: 100%;
    .card-header {
      padding: 14px 8px;
      .coin-logo {
        img {
          width: 32px;
          height: 32px;
        }
        .coin-symbol {
          font-size: 14px;
          font-weight: 400;
          color: @textActive;
        }
      }
    }
    .card-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 8px;
      .content-top {
        width: 100%;
      }
      .bottom {
        width: 100%;
      }
      .btn-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .ant-btn {
          width: 48% !important;
          height: 32px !important;
        }
      }
    }
  }
}
</style>
