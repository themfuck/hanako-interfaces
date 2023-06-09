import { MaybeHexString, Types } from 'aptos'
import {
  WalletAccountChangeError,
  WalletDisconnectionError,
  WalletNetworkChangeError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletGetNetworkError,
  WalletSignAndSubmitMessageError,
  WalletSignMessageError,
  WalletSignTransactionError
} from './errors'
import {
  AccountKeys,
  BaseWalletAdapter,
  NetworkInfo,
  scopePollingDetectionStrategy,
  WalletAdapterNetwork,
  WalletName,
  SignMessageResponse,
  SignMessagePayload,
  WalletReadyState
} from './BaseAdapter'

interface ConnectHyperPayAccount {
  address: MaybeHexString
  method: string
  publicKey: MaybeHexString
  status: number
}

interface HyperPayAccount {
  address: MaybeHexString
  publicKey: MaybeHexString
  authKey: MaybeHexString
  isConnected: boolean
}
interface IHyperPayWallet {
  connect: () => Promise<ConnectHyperPayAccount>
  account(): Promise<HyperPayAccount>
  isConnected(): Promise<boolean>
  getChainId(): Promise<{ chainId: number }>
  network(): Promise<WalletAdapterNetwork>
  generateTransaction(sender: MaybeHexString, payload: any, options?: any): Promise<any>
  signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<Types.HexEncodedBytes>
  signTransaction(transaction: Types.TransactionPayload): Promise<Uint8Array>
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse>
  disconnect(): Promise<void>
}

interface HyperPayWindow extends Window {
  hyperpay?: IHyperPayWallet
}

declare const window: HyperPayWindow

export const HyperPayWalletName = 'HyperPay' as WalletName<'HyperPay'>

export interface HyperPayWalletAdapterConfig {
  provider?: IHyperPayWallet
  // network?: WalletAdapterNetwork;
  timeout?: number
}

export class HyperPayWalletAdapter extends BaseWalletAdapter {
  name = HyperPayWalletName

  url = 'https://www.hyperpay.io/'

  icon = 'https://hyperpay.oss-ap-southeast-1.aliyuncs.com/heperpay/1666601839.png'

  protected _provider: IHyperPayWallet | any

  protected _network: WalletAdapterNetwork | any

  protected _chainId: string | any

  protected _api: string | any

  protected _timeout: number

  protected _readyState: WalletReadyState =
    typeof window === 'undefined' || typeof document === 'undefined' ? WalletReadyState.Unsupported : WalletReadyState.NotDetected

  protected _connecting: boolean

  protected _wallet: HyperPayAccount | null

  constructor({
    // provider,
    // network = WalletAdapterNetwork.Mainnet,
    timeout = 10000
  }: HyperPayWalletAdapterConfig = {}) {
    super()

    this._provider = typeof window !== 'undefined' ? window.hyperpay : undefined
    // this._network = network;
    this._timeout = timeout
    this._connecting = false
    this._wallet = null

    if (typeof window !== 'undefined' && this._readyState !== WalletReadyState.Unsupported) {
      scopePollingDetectionStrategy(() => {
        if (window.hyperpay) {
          this._readyState = WalletReadyState.Installed
          this.emit('readyStateChange', this._readyState)
          return true
        }
        return false
      })
    }
  }

  get publicAccount(): AccountKeys {
    return {
      publicKey: this._wallet?.publicKey || null,
      address: this._wallet?.address || null,
      authKey: this._wallet?.authKey || null
    }
  }

  get network(): NetworkInfo {
    return {
      name: this._network,
      api: this._api,
      chainId: this._chainId
    }
  }

  get connecting(): boolean {
    return this._connecting
  }

  get connected(): boolean {
    return !!this._wallet?.isConnected
  }

  get readyState(): WalletReadyState {
    return this._readyState
  }

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return
      if (!(this._readyState === WalletReadyState.Loadable || this._readyState === WalletReadyState.Installed))
        throw new WalletNotReadyError()
      this._connecting = true

      const provider = this._provider || window.hyperpay
      const isConnected = await provider?.isConnected()
      if (isConnected) {
        await provider?.disconnect()
      }
      const response = await provider?.connect()

      if (!response) {
        throw new WalletNotConnectedError('No connect response')
      }

      const walletAccount = await provider?.account()
      if (walletAccount) {
        this._wallet = {
          ...walletAccount,
          isConnected: true
        }

        try {
          const name = await provider?.network()
          const { chainId } = await provider?.getChainId()
          const api = null

          this._network = name
          this._chainId = chainId.toString()
          this._api = api
        } catch (error: any) {
          const errMsg = error.message
          this.emit('error', new WalletGetNetworkError(errMsg))
          throw error
        }
      }
      this.emit('connect', this._wallet?.address || '')
    } catch (error: any) {
      this.emit('error', new Error(error))
      throw error
    } finally {
      this._connecting = false
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet
    const provider = this._provider || window.hyperpay
    if (wallet) {
      this._wallet = null

      try {
        await provider?.disconnect()
      } catch (error: any) {
        this.emit('error', new WalletDisconnectionError(error?.message, error))
      }
    }

    this.emit('disconnect')
  }

  async signTransaction(transactionPyld: Types.TransactionPayload, options?: any): Promise<Uint8Array> {
    try {
      const wallet = this._wallet
      const provider = this._provider || window.hyperpay
      if (!wallet || !provider) throw new WalletNotConnectedError()
      const tx = await provider.generateTransaction(wallet.address || '', transactionPyld, options)
      if (!tx) throw new Error('Cannot generate transaction')
      const response = await provider?.signTransaction(tx)

      if (!response) {
        throw new Error('No response')
      }
      return response
    } catch (error: any) {
      this.emit('error', new WalletSignTransactionError(error))
      throw error
    }
  }

  async signAndSubmitTransaction(transactionPyld: Types.TransactionPayload, options?: any): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const wallet = this._wallet
      const provider = this._provider || window.hyperpay
      if (!wallet || !provider) throw new WalletNotConnectedError()
      const tx = await provider.generateTransaction(wallet.address || '', transactionPyld, options)
      if (!tx) throw new Error('Cannot generate transaction')
      const response = await provider?.signAndSubmitTransaction(tx)

      if (!response) {
        throw new Error('No response')
      }
      return { hash: response }
    } catch (error: any) {
      this.emit('error', new WalletSignAndSubmitMessageError(error))
      throw error
    }
  }

  async signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      const wallet = this._wallet
      const provider = this._provider || window.hyperpay
      if (!wallet || !provider) throw new WalletNotConnectedError()
      if (typeof msgPayload !== 'object' || !msgPayload.nonce) {
        throw new WalletSignMessageError('Invalid signMessage Payload')
      }
      const response = await provider?.signMessage(msgPayload)
      if (response) {
        return response
      } else {
        throw new Error('Sign Message failed')
      }
    } catch (error: any) {
      const errMsg = error.message
      this.emit('error', new WalletSignMessageError(errMsg))
      throw error
    }
  }

  async onAccountChange(): Promise<void> {
    try {
      const wallet = this._wallet
      const provider = this._provider || window.hyperpay
      if (!wallet || !provider) throw new WalletNotConnectedError()
      //To be implemented
    } catch (error: any) {
      const errMsg = error.message
      this.emit('error', new WalletAccountChangeError(errMsg))
      throw error
    }
  }

  async onNetworkChange(): Promise<void> {
    try {
      const wallet = this._wallet
      const provider = this._provider || window.hyperpay
      if (!wallet || !provider) throw new WalletNotConnectedError()
      //To be implemented
    } catch (error: any) {
      const errMsg = error.message
      this.emit('error', new WalletNetworkChangeError(errMsg))
      throw error
    }
  }
}
