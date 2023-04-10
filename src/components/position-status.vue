<template>
  <div class="position-status" :class="`position-status-${currentStatus.toLowerCase()}`">
    <StatusBlock class="status-block" :current-status="currentStatus"></StatusBlock>
    <div v-if="nftTokenMint" class="owner-addres">
      <a
        :href="
          chainName === 'Aptos'
            ? `https://explorer.aptoslabs.com/account/${nftTokenAccount}?network=${config.network}`
            : `https://explorer.sui.io/addresses/${nftTokenAccount}?network=${config.network}`
        "
        target="_blank"
      >
        {{ nftTokenMint.substr(0, 4) }}
        ...
        {{ nftTokenMint.substr(nftTokenMint.length - 4, 4) }}
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import configure from '@/utils/config'
import { useIndexStore } from '@/store/index'
export default defineComponent({
  props: {
    pItem: {
      type: Object,
      required: true
    },
    currentStatus: {
      type: String,
      required: true
    },
    nftTokenAccount: {
      type: String,
      required: true
    },
    nftTokenMint: {
      type: String,
      required: true
    }
  },
  setup() {
    const indexStore = useIndexStore()
    const config = computed(() => {
      return configure[indexStore.chainName]
    })
    const chainName = computed(() => {
      return indexStore.chainName
    })
    return { config, chainName }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.position-status {
  width: 138px;
  height: 138px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .status-block {
    display: flex;
    justify-content: center;
  }
  .owner-addres {
    width: 100px;
    height: 20px;
    background: rgba(#fff, 0.1);
    border-radius: 11px;
    margin: 5px auto 0;
    a {
      color: @textActive;
      display: block;
      width: 100%;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.position-status-active {
  background: url('../../assets/image/img-Positions-Active@2x.png');
  background-size: 100% 100%;
}
.position-status-inactive {
  background: url('../../assets/image/img-Positions-Inactive@2x.png');
  background-size: 100% 100%;
}
.position-status-closed {
  background: url('../../assets/image/img-Positions-Inactive@2x.png');
  background-size: 100% 100%;
}
@media (max-width: 750px) {
  .position-status {
    width: 130px;
    height: 130px;
  }
}
</style>
