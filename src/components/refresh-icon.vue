<template>
  <a-tooltip placement="top" arrow-point-at-center="true">
    <template #title>
      <span>{{ $t('tips.swapAutoRefresh') }}</span>
    </template>
    <div class="progress" @click="$emit('clickRefresh')">
      <a-progress
        type="circle"
        trail-color="#B5B8C2"
        :stroke-color="store.theme == 'default' ? '#68FFD8' : '#76C8FF'"
        :width="16"
        :show-info="false"
        :stroke-width="8"
        :percent="(100 / autoRefreshTime) * countdown"
      />
      <svg aria-hidden="true" :class="loading ? 'refresh icon' : 'icon'">
        <use xlink:href="#icon-icon-refresh" />
      </svg>
    </div>
  </a-tooltip>
</template>

<script lang="ts">
import { useIndexStore } from '@/store'
import { defineComponent, computed } from 'vue'
export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    autoRefreshTime: {
      type: Number,
      default: 20
    },
    countdown: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })
    return { store }
  }
})
</script>

<style lang="less" scoped>
@import '../assets/css/base.less';
@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
.refresh {
  animation: spin 1s linear infinite;
}
.progress {
  position: relative;
  width: 16px;
  height: 17px;
  margin-left: 0px;
  margin-top: -8px;
  .icon {
    width: 12px;
    height: 12px;
    fill: @textEffect;
    position: absolute;
    top: 50%;
    left: 50%;
    // transform: translate(-50%, -50%);
    margin-top: -2px;
    margin-left: -6px;
  }
}
</style>
