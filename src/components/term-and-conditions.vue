<template>
  <div class="term-and-conditions">
    <div class="term-and-conditions-content">
      <div class="box">
        <h3 class="title">Term and Conditions</h3>
        <div class="img-box">
          <img v-if="store.theme !== 'default'" src="../assets/sui-image/img-Sui-Term-and-Conditions@3x.png" />
          <img v-else src="../assets/image/img-Term-and-Conditions@2x.png" />
        </div>
        <p class="note">Please read & accept terms before using this site.</p>
        <div class="accept">
          <div class="radio" @click="isSelect = !isSelect">
            <img v-if="isSelect && store.theme === 'default'" src="../assets/image/icon-selected@2x.png" />
            <img v-if="isSelect && store.theme !== 'default'" src="../assets/sui-image/icon-selected@3x.png" />
          </div>
          <span>I accept the </span> <a href="https://www.cetus.zone/terms" target="_blank"> terms and conditions</a>
        </div>
      </div>
      <!-- <div class="continue" @click="$emit('close')">Continue</div> -->
      <a-button :disabled="!isSelect" class="big-btn continue" @click="$emit('close')">Continue</a-button>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useIndexStore } from '../store/index'

export default defineComponent({
  setup() {
    const isSelect = ref(false)
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })
    return { isSelect, store }
  }
})
</script>

<style lang="less" scoped>
@import '../assets/css/base.less';
.theme-sui {
  .accept {
    .radio {
      width: 24px !important;
      height: 24px !important;
      background: url('../assets/sui-image/checkbox.png') !important;
      background-size: 100% 100% !important;
    }
  }
}
.term-and-conditions {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999999;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  .term-and-conditions-content {
    width: 440px;
    height: 376px;
    background: @cardEmphasize;
  }
  .box {
    padding: 17px 16px;
    .title {
      font-size: 16px;
      color: @textActive;
    }
    .img-box {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 16px;
      img {
        width: 140px;
        height: 140px;
      }
    }
    .note {
      font-size: 16px;
      color: @textActive;
      text-align: center;
      padding-top: 21px;
    }
    .accept {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 44px;
      background: @termGradient;
      .radio {
        width: 24px;
        height: 24px;
        background: url('../assets/image/checkbox@2x.png');
        background-size: 100% 100%;
      }
      img {
        width: 24px;
        height: 24px;
      }
      span {
        color: #fff;
        margin-left: 6px;
      }
      a {
        font-size: 14px;
        color: @buttonDefault;
        margin-left: 6px;
        text-decoration: none;
      }
    }
  }
  .continue {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @buttonDefault;
    color: #222;
    font-size: 20px;
    cursor: pointer;
    font-weight: 500;
  }
}

@media (max-width: 750px) {
  .term-and-conditions {
    .term-and-conditions-content {
      width: 90%;
      height: auto;
      .box {
        .title {
          font-size: 14px;
        }
        .img-box {
          img {
            width: 90px;
            height: 90px;
          }
        }
        .note {
          font-size: 14px;
        }
        .accept {
          height: 36px;
        }
      }
      .continue {
        height: 40px;
      }
    }
  }
}
</style>
