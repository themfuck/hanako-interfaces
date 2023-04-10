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
  bitkeep: { suiWallet: SuiWallet }
}

declare const window: SuiWalletWindow

export class BitKeepSuiWalletAdapter implements WalletAdapter {
  connecting: boolean
  connected: boolean

  getAccounts(): Promise<string[]> {
    return window.bitkeep.suiWallet.getAccounts()
  }
  executeMoveCall(transaction: MoveCallTransaction): Promise<SuiTransactionResponse> {
    return window.bitkeep.suiWallet.executeMoveCall(transaction)
  }
  executeSerializedMoveCall(transactionBytes: Uint8Array): Promise<SuiTransactionResponse> {
    return window.bitkeep.suiWallet.executeSerializedMoveCall(transactionBytes)
  }
  signAndExecuteTransaction(transaction: SignableTransaction): Promise<SuiTransactionResponse> {
    const payload: any = {
      type: 'move-call',
      data: transaction.data
    }
    // return window.bitkeep.suiWallet.signAndExecuteTransaction(transaction)
    return window.bitkeep.suiWallet.signAndExecuteTransaction(payload)
  }

  name = 'BitKeep'

  url = 'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil'

  async connect(): Promise<void> {
    this.connecting = true
    if (window.bitkeep.suiWallet) {
      const wallet = window.bitkeep.suiWallet
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
