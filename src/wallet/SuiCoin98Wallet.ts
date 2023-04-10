// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { MoveCallTransaction, SignableTransaction, SuiAddress, SuiTransactionResponse } from '@mysten/sui.js'
import { WalletAdapter } from '@mysten/wallet-adapter-base'

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
  // suiWallet: SuiWallet
  coin98: { sui: SuiWallet }
}

declare const window: SuiWalletWindow

export class Coin98SuiWalletAdapter implements WalletAdapter {
  connecting: boolean
  connected: boolean

  getAccounts(): Promise<string[]> {
    return window.coin98.sui.getAccounts()
  }
  executeMoveCall(transaction: MoveCallTransaction): Promise<SuiTransactionResponse> {
    return window.coin98.sui.executeMoveCall(transaction)
  }
  executeSerializedMoveCall(transactionBytes: Uint8Array): Promise<SuiTransactionResponse> {
    return window.coin98.sui.executeSerializedMoveCall(transactionBytes)
  }
  signAndExecuteTransaction(transaction: SignableTransaction): Promise<SuiTransactionResponse> {
    return window.coin98.sui.signAndExecuteTransaction(transaction)
  }

  name = 'Coin98'

  url = 'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg'

  async connect(): Promise<void> {
    this.connecting = true
    if (window.coin98.sui) {
      const wallet = window.coin98.sui
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
