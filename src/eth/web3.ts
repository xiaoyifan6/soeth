namespace eth {
  type MixedData = string | number | Object | any[] | BigNumber
  export type Web3 = {
    currentProvider: Web3.Provider

    eth: Web3.EthApi
    personal: Web3.PersonalApi | undefined
    version: Web3.VersionApi
    net: Web3.NetApi

    // constructor:(provider?: Web3.Provider)

    isConnected: () => boolean
    setProvider: (provider: Web3.Provider) => void
    reset: (keepIsSyncing: boolean) => void
    toHex: (data: MixedData) => string
    toAscii: (hex: string) => string
    fromAscii: (ascii: string, padding?: number) => string
    toDecimal: (hex: string) => number
    fromDecimal: (value: number | string) => string
    fromWei: (value: number | string | BigNumber, unit: Web3.Unit) => string | BigNumber
    toWei: (amount: number | string | BigNumber, unit: Web3.Unit) => string | BigNumber
    toBigNumber: (value: number | string) => BigNumber
    isAddress: (address: string) => boolean
    isChecksumAddress: (address: string) => boolean
    sha3: (value: string, options?: Web3.Sha3Options) => string
  }

  export namespace Web3 {
    export type ContractAbi = AbiDefinition[]

    export type AbiDefinition = FunctionAbi | EventAbi

    export type FunctionAbi = MethodAbi | ConstructorAbi | FallbackAbi

    export type MethodAbi = {
      type: 'function'
      name: string
      inputs: FunctionParameter[]
      outputs: FunctionParameter[]
      constant: boolean
      payable: boolean
      stateMutability: string
    }

    export type ConstructorAbi = {
      type: 'constructor'
      inputs: FunctionParameter[]
      payable: boolean
    }

    export type FallbackAbi = {
      type: 'fallback'
      payable: boolean
    }

    export type EventParameter = {
      name: string
      type: string
      indexed: boolean
    }

    export type EventAbi = {
      type: 'event'
      name: string
      inputs: EventParameter[]
      anonymous: boolean
    }

    export type FunctionParameter = {
      name: string
      type: string
    }

    export type ContractInstance = {
      address: string
      abi: Web3.ContractAbi
      [name: string]: any
    }

    export type Contract<A> = {
      at: (address: string) => A
      address: string
      abi: Web3.ContractAbi
      [name: string]: any
    }

    export type FilterObject = {
      fromBlock: number | string
      toBlock: number | string
      address: string
      topics: string[]
    }

    export type SolidityEvent<A> = {
      event: string
      address: string
      args: A
    }

    export type FilterResult = {
      get: (callback: () => void) => void
      watch: <A>(callback: (err: Error, result: SolidityEvent<A>) => void) => void
      stopWatching: (callback: () => void) => void
    }

    export type JSONRPCRequestPayload = {
      params?: any[]
      method: string
      id: number
      jsonrpc: string
    }

    export type JSONRPCResponsePayload = {
      result: any
      id: number
      jsonrpc: string
    }

    export type Provider = {
      sendAsync: (
        payload: JSONRPCRequestPayload,
        callback: (err: Error, result: JSONRPCResponsePayload) => void
      ) => void
    }

    export type Sha3Options = {
      encoding: 'hex'
    }

    export type EthApi = {
      coinbase: string
      mining: boolean
      hashrate: number
      gasPrice: BigNumber
      accounts: string[]
      blockNumber: number
      defaultAccount: string
      defaultBlock: Web3.BlockParam
      syncing: Web3.SyncingResult
      compile: {
        solidity: (sourceString: string, cb?: (err: Error, result: any) => void) => Object
      }
      getMining: (cd: (err: Error, mining: boolean) => void) => void
      getHashrate: (cd: (err: Error, hashrate: number) => void) => void
      getGasPrice: (cd: (err: Error, gasPrice: BigNumber) => void) => void
      getAccounts: (cd: (err: Error, accounts: string[]) => void) => void
      getBlockNumber: (callback: (err: Error, blockNumber: number) => void) => void
      getSyncing: (cd: (err: Error, syncing: Web3.SyncingResult) => void) => void
      isSyncing: (cb: (err: Error, isSyncing: boolean, syncingState: Web3.SyncingState) => void) => Web3.IsSyncing

      //   getBlock: (hashStringOrBlockNumber: string | Web3.BlockParam) => Web3.BlockWithoutTransactionData
      //   getBlock: (
      //     hashStringOrBlockNumber: string | Web3.BlockParam,
      //     callback: (err: Error, blockObj: Web3.BlockWithoutTransactionData) => void
      //   ) => void
      //   getBlock: (
      //     hashStringOrBlockNumber: string | Web3.BlockParam,
      //     returnTransactionObjects: true
      //   ) => Web3.BlockWithTransactionData
      getBlock: (
        hashStringOrBlockNumber: string | Web3.BlockParam,
        returnTransactionObjects: true,
        callback: (err: Error, blockObj: Web3.BlockWithTransactionData) => void
      ) => void

      //   getBlockTransactionCount: (hashStringOrBlockNumber: string | Web3.BlockParam) => number
      getBlockTransactionCount: (
        hashStringOrBlockNumber: string | Web3.BlockParam,
        callback: (err: Error, blockTransactionCount: number) => void
      ) => void

      // TODO returnTransactionObjects
      //   getUncle: (hashStringOrBlockNumber: string | Web3.BlockParam, uncleNumber: number) => Web3.BlockWithoutTransactionData
      getUncle: (
        hashStringOrBlockNumber: string | Web3.BlockParam,
        uncleNumber: number,
        callback: (err: Error, uncle: Web3.BlockWithoutTransactionData) => void
      ) => void

      //   getTransaction: (transactionHash: string) => Web3.Transaction
      getTransaction: (transactionHash: string, callback: (err: Error, transaction: Web3.Transaction) => void) => void

      //   getTransactionFromBlock: (hashStringOrBlockNumber: string | Web3.BlockParam, indexNumber: number) => Web3.Transaction
      getTransactionFromBlock: (
        hashStringOrBlockNumber: string | Web3.BlockParam,
        indexNumber: number,
        callback: (err: Error, transaction: Web3.Transaction) => void
      ) => void

      contract: (abi: Web3.AbiDefinition[]) => Web3.Contract<any>

      // TODO block param
      //   getBalance: (addressHexString: string) => BigNumber
      getBalance: (addressHexString: string, callback: (err: Error, result: BigNumber) => void) => void

      // TODO block param
      //   getStorageAt: (address: string, position: number) => string
      getStorageAt: (address: string, position: number, callback: (err: Error, storage: string) => void) => void

      // TODO block param
      //   getCode: (addressHexString: string) => string
      getCode: (addressHexString: string, callback: (err: Error, code: string) => void) => void

      filter: (value: string | Web3.FilterObject) => Web3.FilterResult

      //   sendTransaction: (txData: Web3.TxData) => string
      sendTransaction: (txData: Web3.TxData, callback: (err: Error, value: string) => void) => void

      //   sendRawTransaction: (rawTxData: string) => string
      sendRawTransaction: (rawTxData: string, callback: (err: Error, value: string) => void) => void

      //   sign: (address: string, data: string) => string
      sign: (address: string, data: string, callback: (err: Error, signature: string) => void) => void

      //   getTransactionReceipt: (txHash: string) => Web3.TransactionReceipt
      getTransactionReceipt: (txHash: string, callback: (err: Error, receipt: Web3.TransactionReceipt) => void) => void

      // TODO block param
      //   call: (callData: Web3.CallData) => string
      call: (callData: Web3.CallData, callback: (err: Error, result: string) => void) => void

      //   estimateGas: (callData: Web3.CallData) => number
      estimateGas: (callData: Web3.CallData, callback: (err: Error, gas: number) => void) => void

      // TODO defaultBlock
      //   getTransactionCount: (address: string) => number
      getTransactionCount: (address: string, callback: (err: Error, count: number) => void) => void
    }

    export type VersionApi = {
      api: string
      network: string
      node: string
      ethereum: string
      whisper: string
      getNetwork: (cd: (err: Error, networkId: string) => void) => void
      getNode: (cd: (err: Error, nodeVersion: string) => void) => void
      getEthereum: (cd: (err: Error, ethereum: string) => void) => void
      getWhisper: (cd: (err: Error, whisper: string) => void) => void
    }

    export type PersonalApi = {
      listAccounts: string[] | undefined
      newAccount: (password?: string) => string
      unlockAccount: (address: string, password?: string, duration?: number) => boolean
      lockAccount: (address: string) => boolean
      sign: (message: string, account: string, password: string) => string
    }

    export type NetApi = {
      listening: boolean
      peerCount: boolean
      getListening: (cd: (err: Error, listening: boolean) => void) => void
      getPeerCount: (cd: (err: Error, peerCount: number) => void) => void
    }

    export type BlockParam = number | 'earliest' | 'latest' | 'pending'

    export type Unit =
      | 'kwei'
      | 'ada'
      | 'mwei'
      | 'babbage'
      | 'gwei'
      | 'shannon'
      | 'szabo'
      | 'finney'
      | 'ether'
      | 'kether'
      | 'grand'
      | 'einstein'
      | 'mether'
      | 'gether'
      | 'tether'

    export type SyncingState = {
      startingBlock: number
      currentBlock: number
      highestBlock: number
    }

    export type SyncingResult = false | SyncingState

    export type IsSyncing = {
      addCallback: (cb: (err: Error, isSyncing: boolean, syncingState: SyncingState) => void) => void
      stopWatching: () => void
    }

    export type AbstractBlock = {
      number: number | null
      hash: string | null
      parentHash: string
      nonce: string | null
      sha3Uncles: string
      logsBloom: string | null
      transactionsRoot: string
      stateRoot: string
      miner: string
      difficulty: BigNumber
      totalDifficulty: BigNumber
      extraData: string
      size: number
      gasLimit: number
      gasUser: number
      timestamp: number
      uncles: string[]
    }
    export type BlockWithoutTransactionData = {
      transactions: string[]
      number: number | null
      hash: string | null
      parentHash: string
      nonce: string | null
      sha3Uncles: string
      logsBloom: string | null
      transactionsRoot: string
      stateRoot: string
      miner: string
      difficulty: BigNumber
      totalDifficulty: BigNumber
      extraData: string
      size: number
      gasLimit: number
      gasUser: number
      timestamp: number
      uncles: string[]
    }

    export type BlockWithTransactionData = {
      transactions: Transaction[]
      number: number | null
      hash: string | null
      parentHash: string
      nonce: string | null
      sha3Uncles: string
      logsBloom: string | null
      transactionsRoot: string
      stateRoot: string
      miner: string
      difficulty: BigNumber
      totalDifficulty: BigNumber
      extraData: string
      size: number
      gasLimit: number
      gasUser: number
      timestamp: number
      uncles: string[]
    }

    export type Transaction = {
      hash: string
      nonce: number
      blockHash: string | null
      blockNumber: number | null
      transactionIndex: number | null
      from: string
      to: string | null
      value: BigNumber
      gasPrice: BigNumber
      gas: number
      input: string
    }

    export type CallTxDataBase = {
      to?: string
      value?: number | string | BigNumber
      gas?: number | string | BigNumber
      gasPrice?: number | string | BigNumber
      data?: string
      nonce?: number
    }

    export type TxData = {
      from: string
      to?: string
      value?: number | string | BigNumber
      gas?: number | string | BigNumber
      gasPrice?: number | string | BigNumber
      data?: string
      nonce?: number
    }

    export type CallData = {
      from?: string
      to?: string
      value?: number | string | BigNumber
      gas?: number | string | BigNumber
      gasPrice?: number | string | BigNumber
      data?: string
      nonce?: number
    }

    export type TransactionReceipt = {
      blockHash: string
      blockNumber: number
      transactionHash: string
      transactionIndex: number
      from: string
      to: string
      cumulativeGasUsed: number
      gasUsed: number
      contractAddress: string | null
      logs: LogEntry[]
    }

    export type LogEntry = {
      logIndex: number | null
      transactionIndex: number
      transactionHash: string
      blockHash: string | null
      blockNumber: number | null
      address: string
      data: string
      topics: string[]
    }
  }
}
