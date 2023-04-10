<template>
  <div class="contract-container">
    <!-- <a-button v-if="!isConnected" @click="toConnect">connect petra wallet</a-button>
    <div v-else>
      <a-button @click="toDisconnect">disconnect petra wallet</a-button>
      <div>{{ accountAddress }}</div>
      <a-button @click="toTest">message_mint_coin_2</a-button>
    </div> -->

    <a-button v-if="!isConnected" @click="toConnectMartian">connect Martian wallet</a-button>
    <div v-else>
      <a-button @click="toDisconnectMartian">disconnect Martian wallet</a-button>
      <div>{{ accountAddress }}</div>
      <!-- <a-button @click="toTestMartianInstruction">test 0x1 transfer</a-button> -->
      <!-- <a-button @click="toTestMartianRegister">register</a-button> -->
      <!-- <div>
        <a-button @click="toTestMartianFaucet">Faucet</a-button>
      </div> -->
      <!-- <a-button @click="toTest">message_mint_coin_2</a-button> -->
      <a-button @click="faucetCoin">USDT Faucet</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  setup() {
    const t = 123
    const isConnected = ref(false)
    const accountAddress = ref('')

    async function toConnect() {
      const result = await (window as any).aptos.connect()
      const address = await (window as any).aptos.account()
      accountAddress.value = address.address
      const status = await (window as any).aptos.isConnected()
      isConnected.value = status
      const network = await (window as any).aptos.network()
    }

    async function toDisconnect() {
      const result = await (window as any).aptos.disconnect()
      accountAddress.value = ''
      isConnected.value = false
    }

    async function toConnectMartian() {
      const result = await (window as any).martian.connect()
      const address = await (window as any).martian.account()
      accountAddress.value = address.address
      const status = await (window as any).martian.isConnected()
      isConnected.value = status
    }

    async function toDisconnectMartian() {
      const result = await (window as any).martian.disconnect()
      accountAddress.value = ''
      isConnected.value = false
    }

    async function toTestMartianInstruction() {
      const response = await (window as any).martian.connect()
      const sender = response.address
      const payload = {
        arguments: [sender, 717],
        function: '0x1::coin::transfer',
        type: 'entry_function_payload',
        type_arguments: ['0x1::aptos_coin::AptosCoin']
      }
      const transaction = await (window as any).martian.generateTransaction(sender, payload)
      const txnHash = await (window as any).martian.signAndSubmitTransaction(transaction)
    }

    async function toTestMartianRegister() {
      const response = await (window as any).martian.connect()
      const sender = response.address
      const payload = {
        type: 'entry_function_payload',
        function: '0x01::coins::register',
        arguments: [],
        // type_arguments: []
        type_arguments: ['0x2dd7a57e5637468c02c72df4af7397897f3bc8066372ecf79c90136fb4d16ab7::message::USDT ']
      }

      const transaction = await (window as any).martian.generateTransaction(sender, payload)
      const txnHash = await (window as any).martian.signAndSubmitTransaction(transaction)
    }

    // xyk-amm 0x84dc9d921d277db5047dcb17addc2ecfbddfad087dd4ea825b2d17785755cb29::aubium::faucet
    async function toTestMartianFaucet() {
      const response = await (window as any).martian.connect()
      const sender = response.address
      const payload = {
        type: 'entry_function_payload',
        function: '0x84dc9d921d277db5047dcb17addc2ecfbddfad087dd4ea825b2d17785755cb29::aubrium::faucet',
        arguments: [],
        type_arguments: []
      }

      const transaction = await (window as any).martian.generateTransaction(sender, payload)
      const txnHash = await (window as any).martian.signAndSubmitTransaction(transaction)
    }

    function stringToHex(text: string) {
      const encoder = new TextEncoder()
      const encoded = encoder.encode(text)
      return Array.from(encoded, i => i.toString(16).padStart(2, '0')).join('')
    }
    async function toTest() {
      const transaction = {
        type: 'entry_function_payload',
        // type: 'script_function_payload',
        function: '0x2dd7a57e5637468c02c72df4af7397897f3bc8066372ecf79c90136fb4d16ab7::message::mint_coin_2',
        arguments: [
          // stringToHex('0x2dd7a57e5637468c02c72df4af7397897f3bc8066372ecf79c90136fb4d16ab7'),
          // stringToHex('0x83f44fc5763d1f5c2c75191642f222c8e1279e80fd24ce97e6bccef1dff93842'),
          // stringToHex('1')
          '0x2dd7a57e5637468c02c72df4af7397897f3bc8066372ecf79c90136fb4d16ab7',
          '0x83f44fc5763d1f5c2c75191642f222c8e1279e80fd24ce97e6bccef1dff93842',
          '1'
        ],
        // type_arguments: []
        // type_arguments: ['0x2dd7a57e5637468c02c72df4af7397897f3bc8066372ecf79c90136fb4d16ab7::message::EnscrowCoin']
        type_arguments: ['0x1::aptos_coin::TestCoin']
      }

      const response = await (window as any).aptos.signAndSubmitTransaction(transaction)
    }

    const faucetCoin = async () => {
      const response = await (window as any).martian.connect()
      const sender = response.address

      const payload = {
        type: 'entry_function_payload',
        function: '0x84dc9d921d277db5047dcb17addc2ecfbddfad087dd4ea825b2d17785755cb29::cetus_faucet::faucet',
        arguments: [],
        type_arguments: []
      }

      const transaction = await (window as any).martian.generateTransaction(sender, payload)
      const txnHash = await (window as any).martian.signAndSubmitTransaction(transaction)
    }

    onMounted(async () => {
      try {
        // const address = await (window as any).aptos.account()
        // if (address) {
        //   accountAddress.value = address.address
        // }
        // const status = await (window as any).aptos.isConnected()
        // isConnected.value = status

        const address = await (window as any).martian.account()
        if (address) {
          accountAddress.value = address.address
        }
        const status = await (window as any).martian.isConnected()
        isConnected.value = status
      } catch (err) {
        console.log('err###', err)
      }
    })

    return {
      t,
      isConnected,
      accountAddress,
      toConnect,
      toDisconnect,
      toTest,
      toConnectMartian,
      toDisconnectMartian,
      toTestMartianInstruction,
      toTestMartianRegister,
      toTestMartianFaucet,
      faucetCoin
    }
  }
})
</script>
<style lang="less" scoped>
.contract-container {
  color: #fff;
}
</style>
