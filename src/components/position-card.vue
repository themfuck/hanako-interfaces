<template>
  <div class="position-card">
    <svg
      id="textPathDemo"
      class="round-text h5-svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="600"
      viewBox="0 0 600 600"
    >
      <path
        id="text-path1"
        class="text-path"
        :d="
          isPc // eslint-disable-next-line max-len
            ? 'M40 12 H200 A28 28 0 0 1 226 40 V305 A28 28 0 0 1 200 332 H40 A28 28 0 0 1 12 306 V40 A28 28 0 0 1 40 12 H200 A28 28 0 0 1 226 40 V305 A28 28 0 0 1 200 332 H40 A28 28 0 0 1 12 306 V40 A28 28 0 0 1 40 12 z'
            : 'M40 12 H340 V160  H40  V40 z'
        "
        fill="none"
        stroke="rgba(0,0,0,0)"
        stroke-dasharray="5,2"
        stroke-width="1"
      />
      <text class="circle-text">
        <textPath xlink:href="#text-path1" class="text-content" textLength="280" :startOffset="isPc ? '0' : '70'">
          {{ positionInfo.nftTokenMint }}
          <animate v-if="isPc" attributeName="startOffset" from="0" to="1020" begin="0s" dur="24s" repeatCount="indefinite" />
        </textPath>
        <textPath xlink:href="#text-path1" class="text-content" textLength="280" :startOffset="isPc ? '520' : '510'">
          {{ positionInfo.nftTokenMint }}
          <animate v-if="isPc" attributeName="startOffset" from="520" to="1540" begin="0s" dur="24s" repeatCount="indefinite" />
        </textPath>
      </text>
    </svg>
    <div class="position-card-content">
      <!-- <div class="address top-right-address">
        {{ positionInfo.nftTokenMint }}
      </div>
      <div class="address bottom-left-address">
        {{ positionInfo.nftTokenMint }}
      </div> -->
      <div class="coin-fee">
        <div class="pair-name">
          {{ positionInfo.token_a.symbol }} -
          {{ positionInfo.token_b.symbol }}
        </div>
        <div class="fee">0.3%</div>
      </div>
      <div class="min-tick">
        <div class="leabl">Min Tick</div>
        <div class="text">1.1234</div>
      </div>
      <div class="min-tick">
        <div class="leabl">Min Tick</div>
        <div class="text">44321</div>
      </div>
      <div class="position-address">
        {{ positionInfo.nftTokenAccount && positionInfo.nftTokenAccount.substr(0, 7) }}
        ...
        {{ positionInfo.nftTokenAccount && positionInfo.nftTokenAccount.substr(positionInfo.nftTokenAccount.length - 4, 4) }}
        <svg class="icon copy-icon" aria-hidden="true" @click="indexStore.copy(positionInfo.nftTokenAccount)">
          <use xlink:href="#icon-icon-copy"></use>
        </svg>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useIndexStore } from '../store'

export default defineComponent({
  props: {
    positionInfo: {
      type: Object,
      required: true
    }
  },
  setup() {
    let isPc = ref(false)
    const indexStore = useIndexStore()
    onMounted(() => {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 750) {
        isPc.value = false
      } else {
        isPc.value = true
      }
      window.onresize = () => {
        if (screenWidth < 750) {
          isPc.value = false
        } else {
          isPc.value = true
        }
      }
    })
    return { indexStore, isPc }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.position-card {
  width: 261px;
  height: 370px;
  background: url('../../assets/image/img-Positions@2x.png');
  background-size: 100% 100%;
  padding: 12px;
  overflow: hidden;
  position: relative;
  svg {
    position: absolute;
    top: 305px;
    left: 274px;
    z-index: 100;
    offset-path: path('M40 12 H200 A28 28 0 0 1 226 40 V305 A28 28 0 0 1 200 332 H40 A28 28 0 0 1 12 306 V40 A28 28 0 0 1 40 12');
  }
  .text-content {
    z-index: 100;
    fill: @textDefault;
    font-size: 12px !important;
  }
  .circle-text {
    font-size: 12px !important;
  }
  .position-card-content {
    // position: relative;
    padding: 50px 30px 0 30px;
    .address {
      width: 10px;
      color: @textActive;
      transform: matrix(0, 0.5, -0.5, 0, 0, 0);
    }
    // .top-right-address {
    // position: absolute;
    // right: 3px;
    // top: 0px;
    // }

    // .bottom-left-address {
    //   position: absolute;
    //   left: 3px;
    //   top: 156px;
    // }
    .pair-name {
      font-size: 20px;
      font-weight: 400;
      color: @textActive;
    }
    .fee {
      width: 52px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      color: @textActive;
      font-weight: 500;
      background: rgba(#fff, 0.1);
      margin: 8px 0 40px;
    }
    .min-tick {
      margin-top: 16px;
      display: flex;
      align-items: center;
      .leabl {
        color: @textDefault;
      }
      .text {
        color: @textActive;
        margin-left: 44px;
      }
    }
    .position-address {
      font-weight: 400;
      color: @textActive;
      font-size: 12px;
      margin-top: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .copy-icon {
        position: absolute;
        top: -8px;
        left: 58px;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 20px;
        height: 20px;
        fill: @textDefault;
        &:hover {
          fill: @textActive;
        }
      }
    }
  }
}
@media (max-width: 750px) {
  .position-card {
    width: 100%;
    height: 191px;
    background: url('../../assets/image/img-h5-Positions@2x.png');
    background-size: 100% 100%;
    .h5-svg {
      top: 298px;
      left: 242px;
    }
    svg {
      offset-path: path('M40 12 H340 V160  H40  V40 z');
    }
    .position-card-content {
      padding: 26px 40px;
      .coin-fee {
        display: flex;
        align-items: center;
      }
      .fee {
        display: inline-block;
        margin: 0;
        margin-left: 8px;
      }
      .position-address {
        display: flex;
        justify-content: flex-start;
        margin-top: 20px;
        .copy-icon {
          position: absolute;
          left: 70px !important;
          right: unset;
        }
      }
    }
  }
}
</style>
