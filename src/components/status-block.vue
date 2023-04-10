<template>
  <a-tooltip placement="top" arrow-point-at-center="true">
    <template #title>
      <span>The price of this pool is currently out of your position price range.</span>
    </template>
    <div class="data-block-status">
      <div v-if="currentStatus === 'Closed'">
        <img src="@/assets/image/img-inactive@2x.png" alt="" />
      </div>
      <div v-else-if="currentStatus === 'Active'">
        <img src="@/assets/image/img-Active@2x.png" alt="" />
      </div>
    </div>
  </a-tooltip>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    currentStatus: {
      type: String,
      required: true
    }
  }
})
</script>
<style lang="less" scoped>
.data-block-status {
  text-align: center;
  img {
    width: 52px;
    height: 20px;
  }
}
</style>
