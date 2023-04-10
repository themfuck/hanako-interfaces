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
  account(): Promise<SuiAddress[]>
  executeMoveCall: (transaction: MoveCallTransaction) => Promise<SuiTransactionResponse>
  executeSerializedMoveCall: (transactionBytes: Uint8Array) => Promise<SuiTransactionResponse>
  signAndExecuteTransaction: (transaction: SignableTransaction) => Promise<SuiTransactionResponse>
}

interface SuiWalletWindow {
  // suiWallet: SuiWallet
  spacecy: { sui: SuiWallet }
}

declare const window: SuiWalletWindow

export class SuiSpacecyWalletAdapter implements WalletAdapter {
  connecting: boolean
  connected: boolean

  getAccounts(): Promise<string[]> {
    return window.spacecy.sui.account()
  }
  executeMoveCall(transaction: MoveCallTransaction): Promise<SuiTransactionResponse> {
    return window.spacecy.sui.executeMoveCall(transaction)
  }
  executeSerializedMoveCall(transactionBytes: Uint8Array): Promise<SuiTransactionResponse> {
    return window.spacecy.sui.executeSerializedMoveCall(transactionBytes)
  }
  signAndExecuteTransaction(transaction: SignableTransaction): Promise<SuiTransactionResponse> {
    return window.spacecy.sui.signAndExecuteTransaction(transaction)
  }

  name = 'Spacecy'

  url = 'https://chrome.google.com/webstore/detail/spacecy-wallet/mkchoaaiifodcflmbaphdgeidocajadp'

  async connect(): Promise<void> {
    this.connecting = true
    if (window?.spacecy?.sui) {
      const wallet = window.spacecy.sui
      try {
        const given = await wallet.requestPermissions()
        // const newLocal: readonly PermissionType[] = ['viewAccount']
        // const perms = await wallet.hasPermissions(newLocal)
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
