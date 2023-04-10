<template>
  <Modal
    :visible="true"
    class="transaction-waiting"
    centered
    :title="$t('modal.waitingModalTitle')"
    width="400px"
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="waiting-container">
      <div class="loading-pic">
        <img v-if="store.theme == 'default'" src="../assets/image/img-loading@2x.png" alt="" />
        <img v-else src="../assets/sui-image/img-loading.png" alt="" />
      </div>
      <!-- <p class="waiting-title">Swap 0.0240357 CSV to 26.4235 USDT</p> -->
      <p class="waiting-title">{{ store.currentTransactionDesc }}</p>
      <p class="waiting-desc">{{ $t('modal.waitingModalText') }}</p>
    </div>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { useIndexStore } from '@/store'

export default defineComponent({
  components: { Modal },
  setup() {
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })
    return {
      store,
      importIcon
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.waiting-container {
  text-align: center;
  .loading-pic {
    width: 48px;
    height: 48px;
    margin: 30px auto;
    text-align: center;
    animation: myrotate 3s infinite linear;
    img {
      width: 48px;
      height: 48px;
    }
  }
  @keyframes myrotate {
    0% {
      -webkit-transform: rotate(0deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  .waiting-title {
    width: 270px;
    font-size: 14px;
    color: @textActive;
    text-align: center;
    margin: 0 auto !important;
  }
  .waiting-desc {
    margin-top: 8px;
    font-size: 14px;
    color: @textDefault;
  }
}
</style>
