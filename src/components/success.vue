<template>
  <Modal :visible="true" class="transaction-success" centered title="" width="400px" :footer="null" @cancel="$emit('onClose')">
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="success-container">
      <img v-if="store.theme == 'default'" src="../assets/image/img-Transaction-Submitted@2x.png" alt="" />
      <img v-else src="../assets/sui-image/img-Transaction-Submitted@2x.png" alt="" />
      <p class="waiting-title">{{ $t('common.transactionSubmitted') }}</p>
      <p class="waiting-text">
        <a
          :href="
            chainName === 'Aptos'
              ? `https://explorer.aptoslabs.com/txn/${store.currentTransactionTxid}?network=${config.network}`
              : `https://explorer.sui.io/transaction/${encodeURIComponent(store.currentTransactionTxid)}?network=${config.network}`
          "
          target="_blank"
        >
          <span>{{ $t('common.viewExplorer') }}</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-jump"></use>
          </svg>
        </a>
      </p>
      <a-button @click="$emit('onClose')">{{ $t('button.ok') }}</a-button>
    </div>
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
  setup() {
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })

    const chainName = computed(() => {
      return counter.chainName
    })

    const config = computed(() => {
      return configure[store.value.chainName]
    })

    return {
      importIcon,
      store,
      config,
      chainName
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.success-container {
  text-align: center;
  img {
    width: 116px;
    height: 116px;
    margin: 30px auto 0px;
  }
  .waiting-title {
    font-size: 14px;
    color: @textActive;
    margin: 10px 0 3px;
  }
  .waiting-text {
    font-size: 14px;
    color: @themeColor;
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      display: flex;
      align-items: center;
      color: @themeColor;
      &:hover {
        text-decoration: underline;
      }
    }
    .icon {
      fill: @themeColor;
      width: 20px;
      height: 20px;
    }
  }
  .ant-btn {
    margin-bottom: 20px;
    border: none;
    width: 120px;
    height: 24px;
    line-height: 12px !important;
  }
}
</style>
