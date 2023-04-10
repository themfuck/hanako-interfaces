import SDK from 'test-cetus-sdk'
import { SdkOptions } from 'test-cetus-sdk'

const sdkOptions: SdkOptions = {
  rpcUrl: 'https://testnet.aptoslabs.com',
  networkOptions: {
    nativeToken: '0x1::aptos_coin::AptosCoin',
    modules: {
      LiquidswapDeployer: '0x23f2032cdea2fd00e53834a1e6c488b9ee7dac3e5591a4ea30646e4ff1afc219'
    }
  }
}

export function makeSDK() {
  return new SDK(sdkOptions)
}

export function getAccount() {
  const sdk = makeSDK()
}
