namespace eos {
  export type blockInfoResult = {
    block_cpu_limit: number
    block_net_limit: number
    chain_id: string
    head_block_id: string
    head_block_num: number
    head_block_producer: string
    head_block_time: string
    last_irreversible_block_id: string
    last_irreversible_block_num: number
    server_version: string
    server_version_string: string
    virtual_block_cpu_limit: number
    virtual_block_net_limit: number
  }

  export type getBlockResult = {
    action_mroot: string
    block_extensions: any[]
    block_num: number
    confirmed: number
    header_extensions: any[]
    id: string
    new_producers: any
    previous: string
    producer: string
    producer_signature: string
    ref_block_prefix: number
    schedule_version: number
    timestamp: string
    transaction_mroot: string
    transactions: any[]
  }

  export type getAccountResult = {
    account_name: string
    cpu_limit: { used: number; available: number; max: number }
    cpu_weight: number
    created: string
    head_block_num: number
    head_block_time: string
    last_code_update: string
    net_limit: { used: number; available: number; max: number }
    net_weight: number
    permissions: {
      parent: string
      perm_name: string
      required_auth: {
        accounts: any[]
        keys: any[]
        threshold: number
        waits: any[]
      }
    }[]
    privileged: boolean
    ram_quota: number
    ram_usage: number
    refund_request: any
    self_delegated_bandwidth: any
    total_resources: any
    voter_info: any
  }

  export type apiResult = {
    abi_extensions: any[]
    actions: {
      name: string
      ricardian_contract: string
      type: string
    }[]
    error_messages: any[]
    ricardian_clauses: any[]
    structs: {
      base: string
      fields: {
        name: string
        type: string
      }[]
      name: string
    }[]
    tables: any[]
    types: {
      new_type_name: string
      type: string
    }[]
    variants: any[]
    version: string
  }

  export type getCodeResult = {
    account_name: string
    wast: string
    wasm: string
    code_hash: string
    abi: any
  }

  export type getCodeHashResult = {
    account_name: string
    code_hash: string
  }

  export type getAbiResult = {
    account_name: string
    abi: any
  }

  export type getRawCodeAndAbiResult = {
    account_name: string
    wasm: any
    abi: any
  }

  export type abiJsonToBinResult = {
    binargs: any
  }

  export type abiBinToJsonResult = {
    args: any
  }

  export type getTableRowsResult = {
    rows: any
    more: boolean
  }

  export type getCurrencyStatsResult = {
    supply: string
    max_supply: string
    issure: string
  }

  export type getProducersResult = {
    rows: any
    total_producer_vote_weight: number
    more: string
    returnedFields: any
  }

  export type producerResult = {
    producers: {
      block_signing_key: string
      producer_name: string
    }[]
    version: number
  }

  export type getProducerScheduleResult = {
    pending: any
    proposed: any
    owner: producerResult
    active: producerResult
    recovery: producerResult
  }

  export type getScheduledTransactionsResult = {
    ows: any
    more: string
  }

  export type pushTransactionResult = {
    transaction_id: any
    processed: any
  }

  export type getActionsResultItem = {
    account_action_seq: number
    action_trace: {
      account_ram_deltas: any[]
      act: {
        account: string
        authorization: { actor: string; permission: string }[]
        data: { from: string; to: string; quantity: string; memo: string }
        hex_data: string
        name: string
      }
      block_num: number
      block_time: string
      console: string
      context_free: boolean
      elapsed: number
      except: any
      inline_traces: any[]
      producer_block_id: any
      receipt: {
        abi_sequence: number
        act_digest: string
        auth_sequence: any[]
        code_sequence: number
        global_sequence: number
        receiver: string
        recv_sequence: number
      }
      trx_id: string
    }
    block_num: number
    block_time: string
    global_action_seq: number
  }

  export type getActionsResult = {
    actions: Array<getActionsResultItem>
    last_irreversible_block: number
    time_limit_exceeded_error: boolean
  }

  export type getTransactionResult = {
    id: string
    trx: any
    block_time: string
    block_num: number
    last_irreversible_block: number
    traces: Array<any>
  }

  export type getKeyAccountsResult = {
    account_names: Array<string>
  }

  export type getControlledAccountsResult = {
    controlled_accounts: Array<string>
  }

  export type authorizationParam = {
    actor: string
    permission: string
  }

  export type actionParam = {
    account: string
    name: string
    authorization: authorizationParam[]
    data?: any
    hex_data?: string
  }

  export type actionParams = {
    actions: actionParam[]
  }

  export type actionTraceResult = {
    receipt: {
      receiver: number
      act_digest: number
      global_sequence: number
      recv_sequence: number
      auth_sequence: Array<any>[]
      code_sequence: number
      abi_sequence: number
    }
    act: actionParam
    context_free: boolean
    elapsed: number
    console: any
    trx_id: string
    block_num: number
    block_time: string
    producer_block_id: any
    account_ram_deltas: any[]
    except: any
    inline_traces: any[]
  }

  export type transactionResult = {
    broadcast: boolean
    transaction: {
      compression: string
      transaction: {
        expiration: string
        ref_block_num: number
        ref_block_prefix: number
        max_net_usage_words: number
        max_cpu_usage_ms: number
        delay_sec: number
        context_free_actions: any[]
        actions: {
          account: string
          name: string
          authorization: {
            actor: string
            permission: string
          }[]
          data: any
        }[]
        transaction_extensions: any[]
      }
      signatures: string[]
    }
    transaction_id: string
    processed: {
      id: string
      block_num: number
      block_time: string
      producer_block_id: any
      receipt: {
        status: string
        cpu_usage_us: number
        net_usage_words: number
      }
      elapsed: number
      net_usage: number
      scheduled: boolean
      action_traces: actionTraceResult[]
      except: any
    }
  }

  export type accountParam = {
    creator: string
    name: string
    owner: string
    active: string
    recovery: string
  }

  export type TransferParam = {
    from: string
    to: string
    quantity: string
    memo: string
  }

  export type optionParam = {
    broadcast?: boolean
    sign?: boolean
    authorization?: any
    blocksBehind?: number
    expireSeconds?: number
  }

  export type tableRowPraam = {
    json?: boolean
    code: string
    scope: string
    table: string
    table_key?: string
    lower_bound?: any
    upper_bound?: any
    limit?: number
    key_type?: string
    index_position?: number
  }

  export type Eos = {
    getInfo: (param: any) => Promise<blockInfoResult>
    getBlock: (block_num_or_id: number) => Promise<getBlockResult>
    getAccount: (account_name: string) => Promise<getAccountResult>
    getActions: (account_name: string, pos: number, offset: number) => Promise<getActionsResult>
    getCurrencyBalance: (code: string, account: string, symbol: string) => Promise<Array<string>>
    getCurrencyStats: (code: string, symbol: string) => Promise<{ [symbol: string]: getCurrencyStatsResult }>
    getKeyAccounts: (public_key: string) => Promise<getKeyAccountsResult>
    getCodeHash: (account_name: string) => Promise<getCodeHashResult>
    getAbi: (account_name: string) => Promise<getAbiResult>
    getProducerSchedule: (param: any) => Promise<getProducerScheduleResult>
    contract: (account_name: string) => Promise<any>
    transaction: (param: actionParams, option?: any) => Promise<transactionResult>
    newaccount: (param: accountParam) => Promise<transactionResult>
    transfer: (param: TransferParam, toptions: optionParam | boolean) => Promise<any>

    getTransaction: (id: string, block_num_hint: any) => Promise<getTransactionResult>
    getCode: (account_name: string, code_as_wasm: any) => Promise<getCodeResult>
    getRawCodeAndAbi: (account_name: string) => Promise<getRawCodeAndAbiResult>
    abiJsonToBin: (code: string, action: string, args: any[]) => Promise<abiJsonToBinResult>
    abiBinToJson: (code: any, action: any, binargs: any) => Promise<abiBinToJsonResult>
    getRequiredKeys: (transaction: any, available_keys: any) => Set<string>
    getBlockHeaderState: (block_num_or_id: any) => Promise<string>
    getTableRows: (param: tableRowPraam) => Promise<getTableRowsResult>
    getProducers: (jsin: any, lower_bound: any, limit: any) => Promise<getProducersResult>

    getScheduledTransactions: (json: any, lower_bound: any, limit: any) => Promise<getScheduledTransactionsResult>
    pushTransaction: (signed_transaction: any) => Promise<pushTransactionResult>
    pushTransactions: (signed_transaction: any) => any
    getControlledAccounts: (controlling_account: any) => Promise<getControlledAccountsResult>
  }
}
