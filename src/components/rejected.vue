<template>
  <Modal :visible="true" class="transiaction-rejected" centered title="" width="400px" :footer="null" @cancel="$emit('onClose')">
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="rejected-container">
      <img v-if="store.theme == 'default'" src="../assets/image/img-transaction-rejected@2x.png" alt="" />
      <img v-else src="../assets/sui-image/img-Transaction-rejected@2x.png" alt="" />
      <p class="waiting-title">{{ $t('modal.rejectedModalText') }}</p>
      <a-button @click="$emit('onClose')">{{ $t('button.ok') }}</a-button>
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
      importIcon,
      store
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.rejected-container {
  text-align: center;
  img {
    width: 116px;
    height: 116px;
    margin: 30px auto 0px;
  }
  .waiting-title {
    font-size: 14px;
    color: @textActive;
    margin: 10px 0 0;
  }
  .ant-btn {
    margin: 15px 0 20px;
    border: none;
    width: 120px;
    height: 24px;
    line-height: 12px !important;
  }
}
</style>
