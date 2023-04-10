<template>
  <Modal
    :visible="true"
    class="claim-fees"
    centered
    :closable="true"
    title="Claim fees"
    width="400px"
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="claim-container">
      <div v-if="positionInfo && positionInfo.token_a.symbol && positionInfo.token_a.token_mint" class="pc-claim">
        <img :src="importIcon(`/image/coins/${positionInfo.token_a.symbol.toLowerCase()}.png`)" />
        <span>{{ positionInfo.tokenAFee }} {{ positionInfo.token_a.symbol }}</span>
      </div>
      <div v-if="positionInfo && positionInfo.token_b.symbol && positionInfo.token_b.token_mint" class="pc-claim">
        <img :src="importIcon(`/image/coins/${positionInfo.token_b.symbol.toLowerCase()}.png`)" />
        <span>{{ positionInfo.tokenBFee }} {{ positionInfo.token_b.symbol }}</span>
      </div>
    </div>
    <a-button class="big-btn claim-btn">Claim</a-button>
  </Modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { useIndexStore } from '../store'

export default defineComponent({
  components: { Modal },
  props: {
    positionInfo: {
      type: Object,
      required: true
    }
  },
  setup() {
    const store = useIndexStore()
    const { copy } = store
    return {
      importIcon,
      store,
      copy
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.claim-fees {
  .ant-modal-content {
    .ant-modal-body {
      padding: 0 !important;
    }
  }
  .claim-container {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin-top: 12px;
    > .pc-claim {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: @textActive;
      & + div {
        margin-top: 14px;
      }
    }
    .icon {
      width: 20px;
      height: 20px;
      fill: @textDefault;
      &:hover {
        fill: @textActive;
      }
    }
    img {
      width: 24px;
      height: 24px;
    }
  }
  .claim-btn {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    bottom: -65px;
  }
}
</style>
