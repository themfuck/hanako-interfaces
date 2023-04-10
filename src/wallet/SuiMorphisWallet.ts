// @morphis-wallet/morphis-wallet-adapter
import { MoveCallTransaction, SignableTransaction, SuiAddress, SuiTransactionResponse } from '@mysten/sui.js'
import { WalletNotReadyError } from './errors'

const ALL_PERMISSION_TYPES = ['viewAccount', 'suggestTransactions'] as const
type AllPermissionsType = typeof ALL_PERMISSION_TYPES
type PermissionType = AllPermissionsType[number]

interface MorphisWallet {
  hasPermissions(permissions: readonly PermissionType[]): Promise<boolean>
  requestPermissions(): Promise<boolean>
  getAccounts(): Promise<SuiAddress[]>
  executeMoveCall(transaction: MoveCallTransaction): Promise<SuiTransactionResponse>
  executeSerializedMoveCall(transactionBytes: string | Uint8Array): Promise<SuiTransactionResponse>
  signAndExecuteTransaction(transaction: SignableTransaction): Promise<SuiTransactionResponse>
}

interface MorphisWalletWindow {
  morphisWallet: MorphisWallet
}

declare const window: MorphisWalletWindow

export class MorphisWalletAdapter {
  connecting: boolean
  connected: boolean
  name = 'Morphis Wallet'
  icon = ''
  url = 'https://chrome.google.com/webstore/detail/morphis-wallet/heefohaffomkkkphnlpohglngmbcclhi'

  getAccounts(): Promise<string[]> {
    return window.morphisWallet.getAccounts()
  }

  signAndExecuteTransaction(transaction: SignableTransaction): Promise<SuiTransactionResponse> {
    return window.morphisWallet.signAndExecuteTransaction(transaction)
  }

  executeMoveCall(transaction: MoveCallTransaction): Promise<SuiTransactionResponse> {
    return window.morphisWallet.executeMoveCall(transaction)
  }
  executeSerializedMoveCall(transactionBytes: string | Uint8Array): Promise<SuiTransactionResponse> {
    return window.morphisWallet.executeSerializedMoveCall(transactionBytes)
  }

  async connect(): Promise<void> {
    this.connecting = true
    if (window.morphisWallet) {
      const wallet = window.morphisWallet
      try {
        await wallet.requestPermissions()
        const newLocal: readonly PermissionType[] = ALL_PERMISSION_TYPES
        await wallet.hasPermissions(newLocal)
        this.connected = true
      } catch (err) {
        console.error(err)
      } finally {
        this.connecting = false
      }
    } else {
      throw new WalletNotReadyError()
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected == true) {
      this.connected = false
    }
  }

  constructor() {
    this.connected = false
    this.connecting = false
  }
}
