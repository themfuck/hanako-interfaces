<template>
  <Modal :width="420" :visible="true" class="wallet-modal" :footer="null" centered @cancel="wallet.setIsShowWalletModal(false)">
    <template #closeIcon>
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-a-icon-Shutdown"></use>
      </svg>
    </template>
    <template #title>
      <h3 v-if="!wallet.connected || wallet.switchWallet" class="wallet-title">
        {{ $t('modal.walletModal') }}
      </h3>
      <p v-if="!wallet.connected || wallet.switchWallet" class="wallet-sub-title">
        {{ $t('modal.walletModalText') }}
      </p>
      <h3 v-if="wallet.connected && !wallet.switchWallet" class="wallet-title">
        {{ $t('modal.walletConnectModalTitle') }}
      </h3>
    </template>
    <div v-if="wallet.connected && !wallet.switchWallet" class="toogle">
      <span :class="currentToggle == 'Wallet' ? 'active-span' : ''" @click="currentToggle = 'Wallet'">Wallet</span>
      <span :class="currentToggle == 'Transactions' ? 'active-span' : ''" @click="currentToggle = 'Transactions'"> Transactions </span>
    </div>
    <div v-if="!wallet.connected || wallet.switchWallet" class="select-wallet">
      <button v-for="(info, name) in walletList" :key="name" :disabled="isLoading" class="wallet-item" ghost @click="setWallet(true, info)">
        <span>{{ name == 'suiWallet' ? 'Sui Wallet' : name }}</span>
        <div class="icon-box">
          <img :src="`/image/wallet/${info.iconName.toLowerCase()}.png`" />
        </div>
      </button>
    </div>
    <div v-else :class="currentToggle == 'Wallet' ? 'wallet-info walletflex' : 'wallet-info transations-info'">
      <div v-if="currentToggle == 'Wallet'" class="left">
        <div class="platform">{{ $t('modal.walletName') }} {{ wallet.walletName }}</div>
        <p class="address">
          {{ wallet.address && wallet.address.substr(0, 6) }}
          ...
          {{ wallet.address && wallet.address.substr(wallet.address.length - 4, 4) }}
          <svg class="icon" aria-hidden="true" @click="indexStore.copy(wallet.address)">
            <use xlink:href="#icon-icon-copy"></use>
          </svg>
        </p>
        <div class="copy-and-view">
          <a
            class="view"
            target="_blank"
            :href="
              chainName === 'Aptos'
                ? `https://explorer.aptoslabs.com/account/${wallet.address}?network=${config.network}`
                : `https://explorer.sui.io/addresses/${wallet.address}?network=${config.network}`
            "
          >
            <span>{{ $t('common.viewExplorer') }}</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-jump"></use>
            </svg>
          </a>
        </div>
        <div class="btn-box">
          <div class="item">
            <div class="svg-box">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-icon-Disconnect1"></use>
              </svg>
            </div>
            <p @click="$emit('onDisconnect')">Disconnect</p>
          </div>
          <div class="item">
            <div class="svg-box">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-icon-Switch1"></use>
              </svg>
            </div>
            <p @click="$emit('onSwitch')">Switch</p>
          </div>
          <!-- <a-button type="cancel" class="cancel-btn" @click="$emit('onDisconnect')">{{ $t('button.disconnect') }}</a-button>
          <a-button class="switch-wallet-btn" @click="$emit('onSwitch')">{{ $t('button.switchWallet') }}</a-button> -->
        </div>
      </div>
      <div v-else class="transtions">
        <div v-if="transactionList.length > 0" class="transtionDetail">
          <div class="top">
            <p>{{ $t('common.recentTransactions') }}</p>
            <span @click="clearTrans">{{ $t('common.clearAll') }}</span>
          </div>
          <div class="bottom">
            <div v-for="(item, index) in transactionList" :key="index" class="item">
              <a
                target="_blank"
                class="bottomLeft"
                :href="
                  chainName !== 'Aptos'
                    ? `https://explorer.sui.io/transaction/${encodeURIComponent(item.hash)}?network=${config.network}`
                    : `https://explorer.aptoslabs.com/txn/${item.hash}?network=${config.network}`
                "
              >
                {{ item.descTransactions }}
                <!-- <svg class="icon modal-icon-close" aria-hidden="true">
                    <use xlink:href="#icon-icon-jump"></use>
                  </svg> -->
              </a>
              <img v-if="chainName !== 'Aptos'" src="../assets/sui-image/success.png" alt="" />
              <img v-else src="../assets/image/success.png" alt="" />
              <!-- <img v-else src="../assets/image/filed.png" alt="" /> -->
            </div>
          </div>
        </div>
        <div v-else class="noData">
          <img v-if="store.theme == 'default'" src="../assets/image/img-no-Positions@2x.png" />
          <img v-else src="../assets/sui-image/img-no-Positions@2x.png" />
          <p>No Recent Transactions</p>
        </div>
      </div>
      <div v-if="currentToggle == 'Wallet'" class="right">
        <img v-if="store.theme == 'default'" src="../assets/image/logo-bg@2x.png" alt="" />
        <img v-else src="../assets/sui-image/logo-bg@2x.png" alt="" />
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted, computed, watchEffect, watch } from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { useWalletStore } from '../store/wallet'
import { useIndexStore } from '../store/index'
import { useNuxtApp } from '#app'
import useWalletProvider from '@/composables/useWalletProvider'
import configure from '@/utils/config'
import configs from '@/utils/config'
export default defineComponent({
  components: { Modal },
  setup() {
    const nuxtApp = useNuxtApp()
    const walletStore = useWalletStore()
    const indexStore = useIndexStore()
    const counter = useIndexStore()
    const store = computed(() => {
      return counter
    })

    const chainName = computed(() => {
      return store.value.chainName
    })

    const config = computed(() => {
      return configure[chainName.value]
    })
    const currentToggle = ref('Wallet')
    const aptosWalletList = reactive({
      Martian: {
        name: 'Martian',
        url: 'https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk',
        iconName: 'Martian',
        icon:
          // eslint-disable-next-line max-len
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUyIiBoZWlnaHQ9IjM1MiIgdmlld0JveD0iMCAwIDM1MiAzNTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTIiIGhlaWdodD0iMzUyIiByeD0iODciIGZpbGw9IiMxRjFGMUYiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNjkuNzAxIDg5LjA4NDFDMTU5LjUwOCA4OS44MzA5IDE1MC41NDcgOTIuMDAxNCAxNDEuMDc2IDk2LjAxNjlDMTM5LjQyNCA5Ni43MTc0IDEzMy43MDIgOTkuNjAzNyAxMzIuMTE2IDEwMC41MzdDMTI4LjEzMSAxMDIuODgxIDEyMy4wNDMgMTA2LjQ5NiAxMTkuNTg2IDEwOS40NEMxMTYuOTc1IDExMS42NjUgMTExLjIxNiAxMTcuNDUyIDEwOS4yMDIgMTE5Ljg3NkMxMDUuMDg1IDEyNC44MzIgMTAxLjA4OCAxMzAuODg2IDk4LjQzODQgMTM2LjE3OUM5Ny45OTQyIDEzNy4wNjYgOTcuNTYzNSAxMzcuODE3IDk3LjQ4MTMgMTM3Ljg0OEM5Ny4zOTkzIDEzNy44OCA5Ny4zMzIgMTM3Ljk5NSA5Ny4zMzIgMTM4LjEwNUM5Ny4zMzIgMTM4LjIxNCA5Ni43Njg1IDEzOS42MDggOTYuMDc5NiAxNDEuMkM5NC42OTc1IDE0NC4zOTYgOTIuOTE3NiAxNDkuNDk2IDkxLjk5MjUgMTUyLjkwOUM4OS42MjY3IDE2MS42NCA4OC41NDA3IDE3Mi40OTUgODkuMTgxMSAxODEuMDExQzkwLjM4ODggMTk3LjA3MSA5NS4xODY2IDIxMS4xMiAxMDMuODUzIDIyMy45NzVDMTEwLjE0NyAyMzMuMzExIDExOC4zMzYgMjQxLjQxMyAxMjcuOTk1IDI0Ny44NjFDMTM4LjkzNiAyNTUuMTYzIDE1MS45NzEgMjU5LjkxIDE2NS41MzIgMjYxLjUyOUMxNjkuMjQ3IDI2MS45NzIgMTc3LjczMSAyNjIuMTQ2IDE4MS43NjIgMjYxLjg2MUMxOTguMDkzIDI2MC43MDYgMjEzLjYxNiAyNTQuOTk0IDIyNi43OCAyNDUuMjk3QzI0NC4wODIgMjMyLjU1MiAyNTYuMDc2IDIxMy43OTcgMjYwLjMzMiAxOTIuODM0QzI2MS42MDEgMTg2LjU4MiAyNjIuMDA2IDE4Mi4zNTUgMjYyIDE3NS40MDdDMjYxLjk5NiAxNzAuMzM3IDI2MS45NDYgMTY5LjI5NSAyNjEuNTQxIDE2NS44MjlDMjU5LjcwNSAxNTAuMTQyIDI1NC4wNTkgMTM1Ljg4OCAyNDQuNzgzIDEyMy41MjdDMjM4LjkwMyAxMTUuNjg5IDIzMC45OTIgMTA4LjI0OCAyMjMuMDk4IDEwMy4xMjlDMjE4LjQ4NSAxMDAuMTM2IDIxNi4xNzggOTguODU1NSAyMTEuNjYxIDk2Ljc3NzRDMjAyLjMzOCA5Mi40ODc5IDE5Mi4zNzYgODkuOTA5MSAxODIuMTg3IDg5LjE0NzlDMTgwLjA0MiA4OC45ODc2IDE3MS42MDYgODguOTQ0NSAxNjkuNzAxIDg5LjA4NDFaTTE4My4wMjUgMTAzLjY1N0MxODkuNTAzIDEwNC4zNDggMTk2LjI4NCAxMDYuMDM0IDIwMi4zNiAxMDguNDY0TDIwNC4zNTYgMTA5LjI2MkwyMDQuMzU2IDExMC44MjJDMjA0LjM1NyAxMTYuODk2IDIwMC4zNDQgMTIyLjMwNyAxOTQuMzMzIDEyNC4zMzRMMTkyLjcyIDEyNC44NzhMMTczLjUyMyAxMjQuOTg3QzE1NS4yODkgMTI1LjA5IDE1MS45OTQgMTI1LjE3NSAxNDcuNjE2IDEyNS42NTdDMTM3LjY3NiAxMjYuNzUyIDEyOS44NzIgMTI4LjI2NSAxMjEuMzAyIDEzMC43NjFDMTIwLjA1IDEzMS4xMjUgMTE4LjkxNyAxMzEuNDI0IDExOC43ODUgMTMxLjQyNEMxMTguNDY0IDEzMS40MjQgMTE4LjkwOSAxMzAuNzkxIDEyMC43NTIgMTI4LjYyMkMxMjQuNDgzIDEyNC4yMzMgMTMwLjczMiAxMTguNTk4IDEzNC43MDYgMTE2LjA0MUMxMzUuMTI2IDExNS43NyAxMzUuNTA4IDExNS41MDkgMTM1LjU1NSAxMTUuNDZDMTM1LjYwMiAxMTUuNDExIDEzNi4yNTEgMTE0Ljk3OSAxMzYuOTk5IDExNC41MDFDMTQyLjI2MyAxMTEuMTMxIDE0OC4wMzYgMTA4LjQ0MSAxNTQuMDcyIDEwNi41NDNDMTU5LjY1OCAxMDQuNzg3IDE2NC44MTQgMTAzLjg3MiAxNzIuMTY0IDEwMy4zMzFDMTczLjg3NCAxMDMuMjA2IDE4MC43MjMgMTAzLjQxMSAxODMuMDI1IDEwMy42NTdaTTIxOS4xMzMgMTE4LjAyMkMyMjIuNzUxIDEyMC43NzkgMjI5LjQ5OSAxMjcuMTM2IDIyOS40OTkgMTI3Ljc4N0MyMjkuNDk5IDEyOC42MDYgMjI2Ljc1IDEzMy40OTMgMjI0Ljc4NCAxMzYuMTY4QzIxOC4wMzIgMTQ1LjM1NSAyMDcuOTIxIDE1MS41NTYgMTk2Ljc5NyAxNTMuMzMyQzE5My45NDUgMTUzLjc4OCAxOTEuOTk0IDE1My44MzUgMTc1LjczMiAxNTMuODQ1QzE1NS4zOTYgMTUzLjg1NyAxNTIuNTc3IDE1My45NjYgMTQ1LjA2OCAxNTUuMDI4QzEzMS4xNjkgMTU2Ljk5NCAxMTguMDA0IDE2MS4zODUgMTA1Ljc3IDE2OC4xMzdDMTA0Ljc1NyAxNjguNjk1IDEwMy44ODUgMTY5LjEwOCAxMDMuODMxIDE2OS4wNTRDMTAzLjY1IDE2OC44NzMgMTA0LjMxMyAxNjMuOTY5IDEwNC44OTUgMTYxLjE4MkMxMDUuNTE0IDE1OC4yMTggMTA2LjU0MiAxNTQuNDE0IDEwNy4zMTEgMTUyLjI0N0wxMDcuNzg2IDE1MC45MDlMMTA5LjQ4MSAxNTAuMTU2QzEyMC45OTQgMTQ1LjA0MiAxMzQuODA4IDE0MS4zODIgMTQ3LjQ0NyAxNDAuMDk3QzE1NC4yNTggMTM5LjQwNSAxNTUuMTY2IDEzOS4zNzggMTczLjk0OCAxMzkuMzA0QzE4NC45MTIgMTM5LjI2MSAxOTMuMTE2IDEzOS4xNiAxOTMuOTMgMTM5LjA2QzE5NS4yOCAxMzguODkyIDE5Ny44NDYgMTM4LjI4NyAxOTkuNDEgMTM3Ljc2NkMxOTkuODQxIDEzNy42MjIgMjAxLjE4OCAxMzcuMDI1IDIwMi40MDMgMTM2LjQzOUMyMDkuNTU2IDEzMi45ODcgMjE0LjkxIDEyNi43OTggMjE3LjM1OCAxMTkuMTU0QzIxNy43OTIgMTE3Ljc5OCAyMTguMDU3IDExNy4yMDQgMjE4LjE4NCAxMTcuM0MyMTguMjg3IDExNy4zNzggMjE4LjcxNCAxMTcuNzAzIDIxOS4xMzMgMTE4LjAyMlpNMjM5LjM5OSAxNDEuODI1QzI0MC42NzggMTQ0LjAyMyAyNDIuODA1IDE0OS4xNjMgMjQ0LjA5MSAxNTMuMTZDMjQ1LjE0MSAxNTYuNDI2IDI0NS4yMTggMTU2LjgxOCAyNDQuODk5IDE1Ny4zMDVDMjQ0LjQ1MyAxNTcuOTg1IDIzOC45OTEgMTYzLjUxMSAyMzcuMzc3IDE2NC45MTZDMjI5LjUxNCAxNzEuNzU2IDIyMC4yNTIgMTc2Ljg4MiAyMTAuNTc1IDE3OS43NUMyMDUuNzczIDE4MS4xNzMgMjAxLjM0NCAxODIuMDAxIDE5NS42MjMgMTgyLjU0NkMxOTQuNjk4IDE4Mi42MzQgMTg1Ljk0NSAxODIuNzE2IDE3Ni4xNzIgMTgyLjcyOUMxNTUuMDkgMTgyLjc1NSAxNTMuODA5IDE4Mi44MTEgMTQ2LjU5NyAxODQuMDAxQzEzMy44MDkgMTg2LjExMiAxMjAuNjg1IDE5MS43MDYgMTEwLjA5NCAxOTkuNTZDMTA5LjIwNSAyMDAuMjE5IDEwOC4zNjggMjAwLjc2NyAxMDguMjM1IDIwMC43NzdDMTA3Ljk1NCAyMDAuNzk4IDEwNy4zODIgMTk5LjIxOCAxMDYuMjQ0IDE5NS4yNzZDMTA1LjQyOSAxOTIuNDUyIDEwNC4yNDggMTg2LjgxNCAxMDQuMzMxIDE4Ni4xNEMxMDQuMzcxIDE4NS44MTkgMTA0Ljg5NyAxODUuNDAxIDEwNi43NiAxODQuMjExQzExNy42NTkgMTc3LjI0NiAxMjkuNDk5IDE3Mi40ODcgMTQxLjkyNSAxNzAuMDc1QzE0NS4zODMgMTY5LjQwNCAxNDUuOTMxIDE2OS4zMjIgMTQ5Ljk5NSAxNjguODY1QzE1NSAxNjguMzAyIDE1Ni42NjQgMTY4LjI2MSAxNzcuMDA2IDE2OC4yMDVDMTk1LjY3MiAxNjguMTUzIDE5NS44ODMgMTY4LjE0NCAyMDAuODc0IDE2Ny4xNzRDMjA4LjYzNiAxNjUuNjY3IDIxNi4yMDcgMTYyLjQ3MyAyMjIuNjI4IDE1Ny45OThDMjI4LjUzMyAxNTMuODgyIDIzNC40MDMgMTQ3Ljg5MiAyMzcuOTcgMTQyLjM0QzIzOC40MDMgMTQxLjY2NiAyMzguODA3IDE0MS4xMTIgMjM4Ljg2OCAxNDEuMTA5QzIzOC45MjkgMTQxLjEwNiAyMzkuMTY4IDE0MS40MjggMjM5LjM5OSAxNDEuODI1Wk0yNDcuNjc1IDE3Ni44MDhDMjQ3LjY3MiAxODEuNTQ5IDI0Ni43NTUgMTg4LjE3NyAyNDUuMzU5IDE5My41MzNDMjQ0Ljk1NyAxOTUuMDc3IDI0NC44NDcgMTk1LjMwOCAyNDQuMzggMTk1LjU5QzI0NC4wOSAxOTUuNzY2IDI0My4zMTggMTk2LjIzOCAyNDIuNjY0IDE5Ni42NDFDMjMwLjUzNCAyMDQuMTA4IDIxNi40MTUgMjA5LjEzNyAyMDMuMTIxIDIxMC43MjVDMjAxLjUxMSAyMTAuOTE3IDE5OS41NDQgMjExLjE2MyAxOTguNzUgMjExLjI3MUMxOTcuNzcgMjExLjQwNCAxOTAuNzU0IDIxMS41MDcgMTc2LjkyMSAyMTEuNTkxQzE2NS43MDkgMjExLjY1OCAxNTYuMzA2IDIxMS43NTYgMTU2LjAyNSAyMTEuODA3QzE1NS43NDUgMjExLjg1OSAxNTQuNzkgMjExLjk4OSAxNTMuOTAyIDIxMi4wOTdDMTQzLjc3MiAyMTMuMzI1IDEzMy4yMDggMjE3Ljg1OSAxMjUuMTU2IDIyNC40MzRDMTI0LjQzNiAyMjUuMDIyIDEyMy43NzIgMjI1LjUwMyAxMjMuNjggMjI1LjUwM0MxMjMuMTkxIDIyNS41MDMgMTE4LjA5MiAyMTkuMjc5IDExNS44OSAyMTUuOTk0QzExNC45NDQgMjE0LjU4MiAxMTQuNzM2IDIxNC4xNjEgMTE0Ljg5IDIxMy45NzJDMTE1LjIyNyAyMTMuNTU4IDExOS40MjggMjEwLjM5MSAxMjEuMiAyMDkuMjE1QzEyNy40NDEgMjA1LjA3NCAxMzQuMTA1IDIwMS45NjQgMTQwLjk5MSAxOTkuOThDMTQ1LjAwMyAxOTguODI0IDE0Ny45NDkgMTk4LjIyNyAxNTMuMDM3IDE5Ny41NDJDMTU1LjMzMiAxOTcuMjMzIDE1OC42NjcgMTk3LjE3NSAxODAuMTQ4IDE5Ny4wNzJDMTk1Ljg1OCAxOTYuOTk2IDE5Ny4xMiAxOTYuOTQ2IDIwMi4zMTggMTk2LjE5N0MyMTQuNzAxIDE5NC40MTIgMjI2LjYyNyAxODkuODU3IDIzNy4zOTggMTgyLjc5N0MyMzkuNTQ4IDE4MS4zODggMjQzLjcxMiAxNzguMjU2IDI0NS43MjIgMTc2LjUzNUMyNDYuNjU2IDE3NS43MzUgMjQ3LjQ3OCAxNzUuMDc4IDI0Ny41NDggMTc1LjA3NEMyNDcuNjE4IDE3NS4wNyAyNDcuNjc1IDE3NS44NSAyNDcuNjc1IDE3Ni44MDhaTTIzNC40MjUgMjE3LjEyOUMyMzQuNDI1IDIxNy4yOTQgMjMyLjIxOCAyMjAuMTc1IDIzMC42MTYgMjIyLjEwMkMyMjguODg1IDIyNC4xODUgMjIzLjkyOSAyMjkuMTM0IDIyMS44NjYgMjMwLjg0MUMyMTAuMzQ3IDI0MC4zNzEgMTk3LjE0MSAyNDUuOTA2IDE4Mi4yNzIgMjQ3LjQzNUMxNzkuMjIyIDI0Ny43NDggMTcxLjA4OSAyNDcuNjk4IDE2OC4xMDQgMjQ3LjM0NkMxNjAuNTU1IDI0Ni40NTggMTUzLjk3MiAyNDQuNzYzIDE0Ny40NDcgMjQyLjAyOEMxNDUuOTEzIDI0MS4zODUgMTQxLjgxNCAyMzkuMzc5IDE0MC41MDMgMjM4LjYyOUMxMzcuODA3IDIzNy4wODkgMTM0Ljg3MyAyMzUuMjExIDEzNC44NzggMjM1LjAzMUMxMzQuODg4IDIzNC42ODQgMTM5LjY4MSAyMzEuNjU0IDE0Mi4xOTUgMjMwLjQwN0MxNDYuMDU3IDIyOC40OSAxNDkuNDU3IDIyNy4zOTcgMTU0LjM5IDIyNi40ODdDMTU2LjMxMiAyMjYuMTMyIDE1Ni45MTEgMjI2LjExOSAxNzYuNDExIDIyNi4wMDFDMTg3LjQzNiAyMjUuOTM0IDE5Ni44MDEgMjI1LjgzNSAxOTcuMjIxIDIyNS43OEMxOTcuNjQyIDIyNS43MjUgMTk5LjAxOCAyMjUuNTk3IDIwMC4yNzkgMjI1LjQ5NEMyMDUuMTI2IDIyNS4xIDIxMS44NDMgMjIzLjk3NiAyMTYuOTU5IDIyMi43MDRDMjE5LjYzOSAyMjIuMDM4IDIyNC4xNTggMjIwLjc5NCAyMjQuNjU3IDIyMC41ODZDMjI0Ljg0NCAyMjAuNTA4IDIyNi4wMjkgMjIwLjA5MiAyMjcuMjkgMjE5LjY2MkMyMjguNTUxIDIxOS4yMzEgMjMwLjYxNSAyMTguNDY2IDIzMS44NzcgMjE3Ljk2MUMyMzQuMzIzIDIxNi45ODIgMjM0LjQyNSAyMTYuOTQ5IDIzNC40MjUgMjE3LjEyOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo='
      },
      Pontem: {
        name: 'Pontem',
        url: 'https://chrome.google.com/webstore/detail/pontem-wallet/phkbamefinggmakgklpkljjmgibohnba',
        iconName: 'Pontem',
        icon:
          // eslint-disable-next-line max-len
          'https://www.gitbook.com/cdn-cgi/image/width=20,height=20,fit=contain,dpr=2,format=auto/https%3A%2F%2F736486047-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MVVJKmKQGx983dZy_jr%252Favatar-1619180126965.png%3Fgeneration%3D1619180127194239%26alt%3Dmedia'
      },
      Fewcha: {
        name: 'Fewcha',
        url: 'https://fewcha.app/',
        iconName: 'Fewcha',
        icon: 'https://miro.medium.com/fit/c/176/176/1*a0WaY-q7gjCRiuryRG6TkQ.png'
      },
      // HyperPay: {
      //   name: 'HyperPay',
      //   url: 'https://www.hyperpay.io/',
      //   iconName: 'hyperpay',
      //   icon: ''
      // },
      Coin98: {
        name: 'Coin98',
        url: 'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
        iconName: 'coin98',
        icon: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/c98wallet.png'
      },

      Blocto: {
        name: 'Blocto',
        url: 'https://portto.com/download',
        iconName: 'Blocto',
        icon: ''
      },
      Petra: {
        name: 'Petra',
        url: 'https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci',
        iconName: 'Petra',
        icon: 'https://miro.medium.com/fit/c/176/176/1*Gf747eyRywU8Img0tK5wvw.png'
      },
      OKX: {
        name: 'OKX',
        url: 'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
        iconName: 'OKX',
        icon: ''
      },
      Spika: {
        name: 'Spika',
        url: 'https://chrome.google.com/webstore/detail/spika/fadkojdgchhfkdkklllhcphknohbmjmb',
        iconName: 'Spika',
        icon: 'https://pbs.twimg.com/profile_images/1562544739181887488/vSqEIeyh_400x400.png'
      },
      TokenPocket: {
        name: 'TokenPocket',
        url: 'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
        iconName: 'TokenPocket',
        icon: 'https://tp-statics.tokenpocket.pro/logo/tokenpocket.png'
      },
      BitKeep: {
        name: 'BitKeep',
        url: 'https://chrome.google.com/webstore/detail/bitkeep-bitcoin-crypto-wa/jiidiaalihmmhddjgbnbgdfflelocpak',
        iconName: 'BitKeep',
        icon: 'https://raw.githubusercontent.com/bitkeepwallet/download/main/logo-png/BitKeep_logo_circle.png'
      },
      Rise: {
        name: 'Rise',
        url: 'https://chrome.google.com/webstore/detail/rise-aptos-wallet/hbbgbephgojikajhfbomhlmmollphcad',
        iconName: 'Rise',
        icon: ''
      },
      OpenBlock: {
        name: 'OpenBlock',
        url: 'https://chrome.google.com/webstore/detail/openblock-bridge/memiokcjdencbponfgbkojkenpdpejhj',
        iconName: 'OpenBlock',
        icon: ''
      },
      Trust: {
        name: 'Trust',
        url: 'https://trustwallet.com/',
        iconName: 'Trust',
        icon: ''
      },
      // Msafe: {
      //   name: 'Msafe',
      //   url: '',
      //   iconName: 'Msafe',
      //   icon: ''
      // },
      Spacecy: {
        name: 'Spacecy',
        url: 'https://chrome.google.com/webstore/detail/spacecy-wallet/mkchoaaiifodcflmbaphdgeidocajadp?hl=en-US',
        iconName: 'Spacecy',
        icon: ''
      }
      // Hippo: {
      //   name: 'Hippo',
      //   url: 'https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk',
      //   iconName: 'Hippo',
      //   icon: 'https://ui-test1-22e7c.web.app/static/media/hippo_logo.ecded6bf411652de9b7f.png'
      // },
      // 'Hippo Web': {
      //   name: 'Hippo Web',
      //   url: 'https://github.com/hippospace/hippo-wallet',
      //   iconName: 'Hippo Web',
      //   icon: 'https://ui-test1-22e7c.web.app/static/media/hippo_logo.ecded6bf411652de9b7f.png'
      // },
    })

    const suiWalletList = reactive({
      suiWallet: {
        name: 'Sui Wallet',
        walletName: 'Sui Wallet',
        url: 'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
        iconName: 'sui-wallet-icon',
        icon: ''
      },
      Martian: {
        name: 'Martian',
        walletName: 'Martian Sui Wallet',
        url: 'https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk',
        iconName: 'Martian',
        icon: ''
      },
      Suiet: {
        name: 'Suiet',
        walletName: 'Suiet',
        url: 'https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd',
        iconName: 'suiet-icon',
        icon: ''
      },
      Fewcha: {
        name: 'Fewcha',
        walletName: 'Fewcha Move Wallet',
        url: 'https://fewcha.app/',
        iconName: 'Fewcha',
        icon: 'https://miro.medium.com/fit/c/176/176/1*a0WaY-q7gjCRiuryRG6TkQ.png'
      },
      // BitKeep: {
      //   name: 'BitKeep',
      //   walletName: 'Bitkeep Wallet',
      //   url: 'https://chrome.google.com/webstore/detail/bitkeep-bitcoin-crypto-wa/jiidiaalihmmhddjgbnbgdfflelocpak',
      //   iconName: 'BitKeep',
      //   icon: 'https://raw.githubusercontent.com/bitkeepwallet/download/main/logo-png/BitKeep_logo_circle.png'
      // },
      // Coin98: {
      //   name: 'Coin98',
      //   url: 'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
      //   iconName: 'coin98',
      //   icon: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/c98wallet.png'
      // },
      Ethos: {
        name: 'Ethos',
        walletName: 'Ethos Wallet',
        url: 'https://chrome.google.com/webstore/detail/ethos-sui-wallet/mcbigmjiafegjnnogedioegffbooigli',
        iconName: 'Ethos',
        icon: ''
      },
      Morphis: {
        name: 'Morphis',
        walletName: 'Morphis Wallet',
        url: 'https://chrome.google.com/webstore/detail/morphis-wallet/heefohaffomkkkphnlpohglngmbcclhi',
        iconName: 'Morphis',
        icon: ''
      },
      Spacecy: {
        name: 'Spacecy',
        walletName: 'Spacecy Sui Wallet',
        url: 'https://chrome.google.com/webstore/detail/spacecy-wallet/mkchoaaiifodcflmbaphdgeidocajadp',
        iconName: 'Spacecy',
        icon: ''
      },
      Glass: {
        name: 'Glass',
        walletName: 'GlassWallet',
        url: 'https://chrome.google.com/webstore/detail/glass-wallet-sui-wallet/loinekcabhlmhjjbocijdoimmejangoa',
        iconName: 'Glass',
        icon: ''
      }
      // BitKeep: {
      //   name: 'BitKeep',
      //   url: 'https://chrome.google.com/webstore/detail/bitkeep-bitcoin-crypto-wa/jiidiaalihmmhddjgbnbgdfflelocpak',
      //   iconName: 'BitKeep',
      //   icon: 'https://raw.githubusercontent.com/bitkeepwallet/download/main/logo-png/BitKeep_logo_circle.png'
      // },
      // Coin98: {
      //   name: 'Coin98',
      //   url: 'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
      //   iconName: 'coin98',
      //   icon: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/c98wallet.png'
      // }
      // MartianSuiWallet: {
      //   name: 'Martian Sui Wallet',
      //   url: 'https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk',
      //   iconName: 'Martian',
      //   icon: ''
      // }
      // MartianSuiWallet: {
      //   name: 'Martian Sui Wallet',
      //   url: 'https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk',
      //   iconName: 'Martian',
      //   icon: ''
      // }
    })

    const walletList = computed(() => {
      if (store.value.chainName !== 'Aptos') {
        return suiWalletList
      } else {
        return aptosWalletList
      }
    })
    const isLoading = ref(false)

    const wallet = computed(() => {
      return walletStore
    })
    const { connect, disconnect } = useWalletProvider()
    function setWallet(status, walletinfo) {
      if (store.value.chainName !== 'Aptos') {
        connect(walletinfo.walletName, walletinfo.iconName, store.value.chainName, walletinfo.url, walletinfo.name)
      } else {
        connect(walletinfo.name, walletinfo.iconName, store.value.chainName)
      }
      walletStore.setIsShowWalletModal(false)
      walletStore.setWalletIconName(walletinfo.iconName)
    }
    const transactionList: any = ref([])
    watch(
      () => store.value.transactionList,
      newList => {
        if (newList) {
          transactionList.value = newList
            .sort((a, b) => {
              return b.date - a.date
            })
            .filter((ele, index) => {
              return ele.date > new Date().getTime() && ele.sender == wallet.value.address && index < 50
            })
        }
      },
      {
        immediate: true,
        deep: true
      }
    )

    // onMounted(() => {
    // getTrans()
    // });
    const offset = ref(0)
    const scrollDisabled = ref(false)

    const clearTrans = () => {
      indexStore.clearTransactionList()
    }

    return {
      offset,
      scrollDisabled,
      // getTrans,
      transactionList,
      store,
      currentToggle,
      importIcon,
      walletList,
      wallet,
      isLoading,
      nuxtApp,
      setWallet,
      indexStore,
      config,
      chainName,
      clearTrans
    }
  }
})
</script>
<style lang="less" scoped>
@import '../assets/css/base.less';
.bottomCon {
  height: 246px;
  overflow: scroll;
}
.bottomConHei {
  height: 100%;
}
.wallet-title {
  font-size: 16px;
  color: @textActive;
}
.wallet-sub-title {
  font-size: 14px;
  // color: rgba(255, 255, 255, 0.6);
  color: @textDefault;
}
.toogle {
  width: 100%;
  height: 32px;
  line-height: 32px;
  margin-top: 20px;
  margin-bottom: 10px;
  span {
    border: 1px solid rgba(255, 255, 255, 0.5);
    display: inline-block;
    width: 50%;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    &:nth-child(1) {
      border-right: 1px solid transparent;
    }
    &:nth-child(2) {
      border-left: 1px solid transparent;
    }
  }
  .active-span {
    color: @textActive;
    border: 1px solid @themeColor !important;
  }
}
// .sui-select-wallet {
//   height: 100% !important;
// }
.select-wallet {
  height: 100% !important;
  // height: 280px;
  // overflow: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .wallet-item {
    width: 48%;
    // width: 390px;
    // height: 52px;
    background: transparent;
    // // background: #292535;
    // // border: 2px solid #292535;
    // border-radius: 10px;
    // width: 200px;
    height: 60px;
    // border-radius: 8px;
    border: 1px solid #313437;

    cursor: pointer;
    // border: 1px solid transparent;
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 12px;
    // &:first-child {
    //   margin-top: 0px;
    // }
    &.active,
    &:hover {
      // background: rgba(255, 255, 255, 0.1);
      // border-radius: 10px;
      background: #313437;
      // border-radius: 8px;
      // border: 1px solid #1b1b1b;
    }

    .icon-box {
      width: 32px;
      height: 32px;
      font-size: 0px;
      border-radius: 8px;
      // background: #5f667c;
      // margin-right: 16px;
      display: flex;
      align-items: center;
    }

    img {
      width: 32px;
      height: 32px;
    }
    span {
      font-size: 14px;
      color: #fff;
    }
    // > div {
    //   width: 100%;
    //   height: 100%;
    //   border-radius: 10px;
    //   background: #000;
    //   display: flex;
    //   align-items: center;
    //   padding: 0px 20px;

    // }
  }
}
.walletflex {
  // display: flex;
  // align-items: center;
  position: relative;
}
.wallet-info {
  // text-align: center;
  // height: 170px;
  // background: @cardCenter;
  // margin-top: 10px;
  // padding: 16px;
  .left {
    background: @cardCenter;
    padding: 20px 16px;
    z-index: 99999;
  }
  .platform {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    // margin-top: 10px;
  }
  .address {
    font-weight: 600;
    color: #fff;
    margin: 5px 0;
    font-size: 28px;
    z-index: 99999;
    .icon {
      width: 20px;
      height: 20px;
      fill: white;
      z-index: 99999;
      &:hover {
        fill: @themeColor;
      }
    }
  }
  .copy-and-view {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    a {
      display: flex;
      align-items: center;
      font-size: 14px;
      cursor: pointer;
      color: @themeColor;
      .icon {
        width: 14px;
        height: 14px;
        fill: @themeColor;
        margin-left: 5px;
      }
      &:hover {
        color: @themeColor;
        text-decoration: underline;
        .icon {
          fill: @themeColor;
        }
      }
    }
  }

  // .disconnect-btn {
  //   width: 168px;
  //   height: 40px;
  //   font-size: 14px;
  //   color: @themeColor;
  // }
  .btn-box {
    display: flex;
    justify-content: space-between;
    width: 65%;
    .ant-btn {
      font-size: 16px;
    }
    .item {
      display: flex;
      align-items: center;
      margin-right: 40px;
      .svg-box {
        display: flex;
        align-items: center;
        //   width: 20px;
        //   height: 20px;
        // background: @themeColor;
      }
      svg {
        width: 18px;
        height: 18px;
        fill: @themeColor;
        margin-right: 5px;
      }
      p {
        font-size: 12px;
        color: @themeColor;
        margin-bottom: 0 !important;
      }
    }
  }
  // .disconnect-btn-box {
  //   width: 168px;
  //   height: 48px;
  //   font-size: 16px;
  //   border-radius: 10px;
  //   padding: 2px;
  //   background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
  .disconnect-btn {
    // width: 100%;
    // height: 100%;
    // border: none;
    // background: #1b2023 !important;
    // border-radius: 10px;
    // color: #fff;
    width: 176px;
    height: 48px;
    box-shadow: 0px 4px 12px 0px #25282c;
    border-radius: 12px;
    border: 1px solid #3f434e;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    &:hover {
      background: rgba(255, 255, 255, 0.05) !important;
    }
  }
  // }

  .switch-wallet-btn {
    width: 176px;

    // width: 100%;
    height: 48px;
    // color: #fff;
    // border: none;
    font-size: 16px;
    // background: linear-gradient(268deg, #5fe6d0 0%, #597bff 38%, #9380ff 72%, #e590ff 100%);
    // border-radius: 12px;
    // line-height: 42px;
    // font-weight: 600;
    // &:hover {
    //   background: linear-gradient(268deg, #74ffe8 0%, #7592ff 39%, #a08fff 74%, #e89aff 100%);
    // }
  }
  .transtions {
    display: flex;
    align-items: center;
    // justify-content: center;
    flex-direction: column;
    width: 100%;
    background: @cardCenter;
    padding: 16px 0 16px 16px;
    overflow: auto;
    height: 170px;
    .transtionDetail {
      width: 100%;
      .top {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 16px;
        // margin-top: 20px;
        p {
          font-size: 14px;
          color: @textActive;
          margin-bottom: 0;
        }
        span {
          font-size: 12px;
          color: @textDefault;
          &:hover {
            color: @textActive;
          }
        }
      }
      .bottom {
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding-right: 16px;
          &:hover {
            .bottomLeft {
              text-decoration: underline;
            }
          }
          .bottomLeft {
            display: flex;
            align-items: center;
            color: @themeColor;
            width: 90%;
            font-size: 12px;
            svg {
              width: 14px;
              height: 14px;
              fill: @themeColor;
              margin-left: 5px;
            }
          }
          .filedLeft {
            color: @textWarning;
            svg {
              fill: @textWarning;
            }
          }
          img {
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }
  .noData {
    width: 100%;
    // min-height: 260px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      width: 80px;
      height: 80px;
    }
    p {
      color: @textDefault;
      padding-top: 10px;
    }
  }
  .right {
    position: absolute;
    top: 33px;
    right: 0;
    img {
      width: 122px;
      height: 139px;
    }
  }
}
@media (max-width: 750px) {
  .wallet-info {
    width: 100%;
    .btn-box {
      width: 100%;
      .ant-btn {
        width: 48%;
      }
    }
  }
}
</style>
<style lang="less">
.wallet-modal {
  .ant-modal-header {
    padding-left: 16px;
  }
  .ant-modal-content {
    .ant-modal-body {
      padding: 0px 16px 20px 16px !important;
    }
  }
}
</style>
