<template>
  <Modal :title="$t('modal.settingModalTitle')" class="setting" centered :visible="true" width="400px" @cancel="$emit('onClose')">
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <div class="setting-container">
      <div class="title">{{ $t('modal.slippageTolerance') }}</div>
      <div class="tag-list">
        <a-tag
          v-for="(item, index) in settingArr"
          :key="index"
          :class="item == slippage ? 'tag-active' : ''"
          @click="changeActiveIndex(index, item)"
        >
          {{ item }}%
        </a-tag>
      </div>
      <!-- <Tag class="edit-setting tag-active"> -->
      <div class="input-box">
        <a-input
          v-model:value="slippage"
          placeholder=""
          suffix="%"
          class="slippage-input"
          :class="
            Number(slippage) > 1 && 50 >= Number(slippage) ? 'slippage-input-waring' : Number(slippage) > 50 ? 'slippage-input-error' : ''
          "
        />
        <span class="custom">{{ $t('modal.customSlippage') }}</span>
      </div>
      <!-- </Tag> -->
    </div>
    <div
      v-if="slippage"
      class="slippage-hint"
      :class="Number(slippage) > 1 && 50 >= Number(slippage) ? 'slippage-hint-waring' : Number(slippage) > 50 ? 'slippage-hint-error' : ''"
    >
      <svg v-if="Number(slippage) > 1 && 50 >= Number(slippage)" class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-icon-tips"></use>
      </svg>
      <svg v-if="Number(slippage) > 50" class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
      <p>
        {{
          Number(slippage) > 1 && 50 >= Number(slippage)
            ? $t('tips.slippageTolerance2')
            : Number(slippage) > 50
            ? $t('tips.slippageTolerance1')
            : ''
        }}
      </p>
    </div>
    <template #footer>
      <div class="footer">
        <a-button type="cancel" class="cancel-btn" @click="$emit('onClose')">{{ $t('button.cancel') }}</a-button>
        <a-button class="confirmbtn" :disabled="Number(slippage) == 0 || Number(slippage) > 100" @click="confirm">
          {{ $t('button.confirm') }}
        </a-button>
      </div>
    </template>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, defineEmits, ref } from 'vue'
import { Modal } from 'ant-design-vue'
import { useIndexStore } from '../store'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  components: { Modal },
  setup(props, ctx) {
    const { t, locale } = useI18n()

    const store = useIndexStore()
    const settingArr = ['0.1', '0.5', '1']
    const slippage = ref(store.slippage || 0.5)
    const { setSlippage } = store
    const emit = defineEmits(['onClose'])

    function changeActiveIndex(index, item) {
      slippage.value = item
    }
    function confirm() {
      setSlippage(slippage.value)
      ctx.emit('onClose', false)
    }
    return { settingArr, changeActiveIndex, confirm, emit, slippage, t }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.setting {
  .title {
    font-size: 14px;
    font-weight: 400;
    color: @textDefault;
  }
  .tag-list {
    margin-top: 12px;
    .ant-tag {
      width: 122px;
      height: 40px;
      background: transparent;
      border: 1px solid #333;
      text-align: center;
      line-height: 40px;
      margin-right: 0;
      color: @textDefault;
      margin-bottom: 12px;
      border-radius: 0 !important;
      cursor: pointer;
      &:nth-child(1) {
        border-right: 1px solid transparent;
      }
      &:nth-child(2) {
        border-right: 1px solid transparent;
      }
    }
    .tag-active {
      background: @buttonDetailDefault;
      border: 1px solid @borderDefault;
      border-radius: 0 !important;
      color: @textActive;
      &:nth-child(1) {
        border-right: 1px solid @borderDefault;
      }
      &:nth-child(2) {
        border-right: 1px solid @borderDefault;
      }
    }
  }

  // .edit-setting {
  //   width: 100%;
  //   height: 40px;
  //   margin-top: 12px;
  //   background: @tabDefault;
  //   border: 1px solid transparent;
  //   padding: 0;
  //   &.tag-active {
  //     background: @buttonDetailDefault;
  //     border: 1px solid @borderDefault;
  //     border-radius: 0 !important;
  //   }
  .input-box {
    position: relative;
    .ant-input-affix-wrapper {
      // display: block;
      // width: 100%;
      height: 40px;
      border-radius: 0 !important;
      // border: none;
      // outline: none;
      // background: @tabDefault;
      // color: @textActive;
      // text-align: center;
      // padding-left: 200px;
      &::placeholder {
        color: @textActive;
        text-align: right !important;
      }
    }
    .custom {
      display: inline-block;
      background: @cardEnter;
      pointer-events: none;
      color: @textDefault;
      padding-right: 10px;
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 999;
    }
  }
  .slippage-hint {
    display: flex;
    align-items: center;
    svg {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
    p {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 0;
    }
  }
  .slippage-hint-waring {
    margin-top: 12px;
    svg {
      fill: #ffca68;
    }
    p {
      color: #ffca68;
    }
  }
  .slippage-hint-error {
    margin-top: 12px;
    svg {
      fill: #ff6868;
    }
    p {
      color: #ff6868;
    }
  }
  .footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ant-btn {
      margin-left: 0;
      font-size: 16px;
      &:nth-child(2) {
        width: 176px;
        height: 48px !important;
        margin-left: 16px !important;
      }
    }
  }
}
@media (max-width: 750px) {
  .setting {
    width: 100%;
    .tag-list {
      width: 100%;
      margin-top: 12px;
      display: flex;
      .ant-tag {
        flex: 1;
      }
    }
  }
}
</style>
