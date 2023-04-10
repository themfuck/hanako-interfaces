// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { MoveCallTransaction, SignableTransaction, SuiAddress, SuiTransactionResponse } from '@mysten/sui.js'
import { WalletAdapter } from '@mysten/wallet-adapter-base'
import { WalletNotReadyError } from './errors'

const ALL_PERMISSION_TYPES = ['viewAccount', 'suggestTransactions'] as const
type AllPermissionsType = typeof ALL_PERMISSION_TYPES
type PermissionType = AllPermissionsType[number]

interface SuiWallet {
  hasPermissions(permissions: readonly PermissionType[]): Promise<boolean>
  requestPermissions(): Promise<boolean>
  getAccounts(): Promise<SuiAddress[]>
  executeMoveCall: (transaction: MoveCallTransaction) => Promise<SuiTransactionResponse>
  executeSerializedMoveCall: (transactionBytes: Uint8Array) => Promise<SuiTransactionResponse>
  signAndExecuteTransaction: (transaction: SignableTransaction) => Promise<SuiTransactionResponse>
}

interface SuiWalletWindow {
  ethosWallet: SuiWallet
}

declare const window: SuiWalletWindow

/**
 * @deprecated This wallet adapter has been replaced by the `WalletStandardAdapterProvider`.
 */
export class EthosSuiWalletAdapter implements WalletAdapter {
  connecting: boolean
  connected: boolean

  getAccounts(): Promise<string[]> {
    return window.ethosWallet.getAccounts()
  }
  executeMoveCall(transaction: MoveCallTransaction): Promise<SuiTransactionResponse> {
    return window.ethosWallet.executeMoveCall(transaction)
  }
  executeSerializedMoveCall(transactionBytes: Uint8Array): Promise<SuiTransactionResponse> {
    return window.ethosWallet.executeSerializedMoveCall(transactionBytes)
  }
  signAndExecuteTransaction(transaction: SignableTransaction): Promise<SuiTransactionResponse> {
    return window.ethosWallet.signAndExecuteTransaction(transaction)
  }

  name = 'Ethos Wallet'

  url = 'https://chrome.google.com/webstore/detail/ethos-sui-wallet/mcbigmjiafegjnnogedioegffbooigli'

  async connect(): Promise<void> {
    this.connecting = true
    if (window.ethosWallet) {
      const wallet = window.ethosWallet
      try {
        const given = await wallet.requestPermissions()
        const newLocal: readonly PermissionType[] = ['viewAccount']
        const perms = await wallet.hasPermissions(newLocal)
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

  // Come back to this later
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
