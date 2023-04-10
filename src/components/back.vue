<template>
  <div class="back" @click="back">
    <svg aria-hidden="true" class="back-icon">
      <use xlink:href="#icon-icon-back" />
    </svg>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter()
    const back = () => {
      if (props.url) {
        router.push('props.url')
      } else {
        router.back()
      }
    }
    return { back }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.back {
  width: 20px;
  height: 20px;
  .back-icon {
    width: 20px;
    height: 20px;
    fill: @textActive;
    &:hover {
      fill: @themeColor;
    }
  }
}
</style>
