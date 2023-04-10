<template>
  <Modal :visible="true" class="remove-success" centered title="" width="440px" :footer="null" @cancel="$emit('onClose')">
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="remove-success-container">
      <div class="left">
        <div class="tit">Remove Successful</div>
        <div class="desc">
          Provide Liquidity for
          <a :href="`${config.cmmSite}/deposit?tokena=${fromCoin.address}&tokenb=${toCoin.address}&fee=${fee}`">
            Cetus concentrated liquidity pools
          </a>
          to earn more.
        </div>
      </div>
      <img v-if="store.theme == 'default'" src="../assets/image/img-RemoveSuccessful@2x.png" alt="" />
      <!-- <img v-else src="../assets/sui-image/img-Transaction-rejected@2x.png" alt="" /> -->
      <!-- <p class="waiting-title">{{ $t('modal.rejectedModalText') }}</p> -->
    </div>
    <a-button class="big-btn deposit-btn" @click="$emit('onClose')">
      <a :href="`${config.cmmSite}/deposit?tokena=${fromCoin.address}&tokenb=${toCoin.address}&fee=${fee}`"> Deposit </a>
    </a-button>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { useIndexStore } from '@/store'
import configure from '@/utils/config'

export default defineComponent({
  components: { Modal },
  props: {
    fromCoin: {
      type: Object,
      required: true
    },
    toCoin: {
      type: Object,
      required: true
    },
    fee: {
      type: String,
      required: true
    }
  },
  setup() {
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })
    const config = computed(() => {
      return configure[store.value.chainName]
    })
    return {
      config,
      importIcon,
      store
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.remove-success {
  text-align: center;
  // position: relative;
  .ant-modal-body {
    background: url('../assets/image/remove-deposit-bg.png') !important;
    background-size: 100% 100% !important;
  }
  .remove-success-container {
    // background: #121212;
    display: flex;
    padding-top: 10px;
    img {
      width: 180px;
      height: 150px;
    }
    .left {
      .tit {
        font-size: 16px;
        font-weight: 500;
        color: @textActive;
      }
      .desc {
        font-size: 14px;
        font-weight: 500;
        color: @textActive;
        margin-top: 30px;
        a {
          color: @themeColor;
        }
      }
    }
  }
  .deposit-btn {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    bottom: -65px;
    a {
      font-size: 18px;
    }
  }
}
</style>
