declare namespace base {
    const SymbolType: {
        eth: string;
        eos: string;
    };
    interface BaseAPI {
        getSymbol(): string;
        plugin(): string;
        getMode(): string;
        usePlugin(): boolean;
        isInitPlugin(): boolean;
        hasAccount(): boolean;
        defaultAccount(): string;
        check(): boolean;
        addEvent(name: string, cbk: Function): void;
        onEvent(cbk: Function): BaseAPI;
        onError(cbk: Function): BaseAPI;
        onAccountChanged(cbk: Function): BaseAPI;
        onIdentity(cbk: Function): BaseAPI;
        onContract(cbk: Function): BaseAPI;
    }
    const ErrorCode: {
        PluginNotInit: number;
        AccountNotFound: number;
        MissIdentity: number;
        TranSactionError: number;
        NetError: number;
        AccountError: number;
        NetNotReady: number;
        UnknowError: number;
    };
    interface APICreator {
        generateAPI(config: any, mode: any): BaseAPI;
    }
    class Net {
        protected _url: string;
        readonly url: string;
        constructor(url: string);
        readonly host: string;
        readonly port: number;
        readonly protocal: string;
    }
    class Base {
        private _API;
        private _createMap;
        private _apiMap;
        private generateKey;
        initSdk(symbol: string, config: any, mode?: string): BaseAPI;
        register(symbol: string, creator: APICreator): void;
        readonly API: BaseAPI | undefined;
        readonly symbolName: string;
        readonly plugin: string;
        canUse(symbol: string, mode?: string): boolean;
        use(symbol: string, mode?: string): BaseAPI | undefined;
    }
}
declare namespace base {
    type NullableFunction = Function | undefined;
    abstract class CustomApi implements BaseAPI {
        private _mode;
        private _isRunning;
        private _tIndex;
        protected event_cbk: NullableFunction;
        protected error_cbk: NullableFunction;
        protected account_changed_cbk: NullableFunction;
        protected contract_cbk: NullableFunction;
        protected identity_cbk: NullableFunction;
        readonly mode: string;
        readonly isRunning: boolean;
        onEvent(cbk: Function): BaseAPI;
        onError(cbk: Function): BaseAPI;
        onAccountChanged(cbk: Function): BaseAPI;
        onIdentity(cbk: Function): BaseAPI;
        onContract(cbk: Function): BaseAPI;
        getMode(): string;
        protected sleep(t: number): Promise<any>;
        protected start(): void;
        protected stop(): void;
        abstract getSymbol(): string;
        abstract plugin(): string;
        abstract usePlugin(): boolean;
        abstract isInitPlugin(): boolean;
        abstract hasAccount(): boolean;
        abstract defaultAccount(): string;
        abstract check(): boolean;
        abstract addEvent(name: string, cbk: Function): void;
        protected updateStatus(): void;
        constructor(mode: string);
    }
}
declare namespace eth {
    type MixedData = string | number | Object | any[] | BigNumber;
    type Web3 = {
        currentProvider: Web3.Provider;
        eth: Web3.EthApi;
        personal: Web3.PersonalApi | undefined;
        version: Web3.VersionApi;
        net: Web3.NetApi;
        isConnected: () => boolean;
        setProvider: (provider: Web3.Provider) => void;
        reset: (keepIsSyncing: boolean) => void;
        toHex: (data: MixedData) => string;
        toAscii: (hex: string) => string;
        fromAscii: (ascii: string, padding?: number) => string;
        toDecimal: (hex: string) => number;
        fromDecimal: (value: number | string) => string;
        fromWei: (value: number | string | BigNumber, unit: Web3.Unit) => string | BigNumber;
        toWei: (amount: number | string | BigNumber, unit: Web3.Unit) => string | BigNumber;
        toBigNumber: (value: number | string) => BigNumber;
        isAddress: (address: string) => boolean;
        isChecksumAddress: (address: string) => boolean;
        sha3: (value: string, options?: Web3.Sha3Options) => string;
    };
    namespace Web3 {
        type ContractAbi = AbiDefinition[];
        type AbiDefinition = FunctionAbi | EventAbi;
        type FunctionAbi = MethodAbi | ConstructorAbi | FallbackAbi;
        type MethodAbi = {
            type: 'function';
            name: string;
            inputs: FunctionParameter[];
            outputs: FunctionParameter[];
            constant: boolean;
            payable: boolean;
            stateMutability: string;
        };
        type ConstructorAbi = {
            type: 'constructor';
            inputs: FunctionParameter[];
            payable: boolean;
        };
        type FallbackAbi = {
            type: 'fallback';
            payable: boolean;
        };
        type EventParameter = {
            name: string;
            type: string;
            indexed: boolean;
        };
        type EventAbi = {
            type: 'event';
            name: string;
            inputs: EventParameter[];
            anonymous: boolean;
        };
        type FunctionParameter = {
            name: string;
            type: string;
        };
        type ContractInstance = {
            address: string;
            abi: Web3.ContractAbi;
            [name: string]: any;
        };
        type Contract<A> = {
            at: (address: string) => A;
            address: string;
            abi: Web3.ContractAbi;
            [name: string]: any;
        };
        type FilterObject = {
            fromBlock: number | string;
            toBlock: number | string;
            address: string;
            topics: string[];
        };
        type SolidityEvent<A> = {
            event: string;
            address: string;
            args: A;
        };
        type FilterResult = {
            get: (callback: () => void) => void;
            watch: <A>(callback: (err: Error, result: SolidityEvent<A>) => void) => void;
            stopWatching: (callback: () => void) => void;
        };
        type JSONRPCRequestPayload = {
            params?: any[];
            method: string;
            id: number;
            jsonrpc: string;
        };
        type JSONRPCResponsePayload = {
            result: any;
            id: number;
            jsonrpc: string;
        };
        type Provider = {
            sendAsync: (payload: JSONRPCRequestPayload, callback: (err: Error, result: JSONRPCResponsePayload) => void) => void;
        };
        type Sha3Options = {
            encoding: 'hex';
        };
        type EthApi = {
            coinbase: string;
            mining: boolean;
            hashrate: number;
            gasPrice: BigNumber;
            accounts: string[];
            blockNumber: number;
            defaultAccount: string;
            defaultBlock: Web3.BlockParam;
            syncing: Web3.SyncingResult;
            compile: {
                solidity: (sourceString: string, cb?: (err: Error, result: any) => void) => Object;
            };
            getMining: (cd: (err: Error, mining: boolean) => void) => void;
            getHashrate: (cd: (err: Error, hashrate: number) => void) => void;
            getGasPrice: (cd: (err: Error, gasPrice: BigNumber) => void) => void;
            getAccounts: (cd: (err: Error, accounts: string[]) => void) => void;
            getBlockNumber: (callback: (err: Error, blockNumber: number) => void) => void;
            getSyncing: (cd: (err: Error, syncing: Web3.SyncingResult) => void) => void;
            isSyncing: (cb: (err: Error, isSyncing: boolean, syncingState: Web3.SyncingState) => void) => Web3.IsSyncing;
            getBlock: (hashStringOrBlockNumber: string | Web3.BlockParam, returnTransactionObjects: true, callback: (err: Error, blockObj: Web3.BlockWithTransactionData) => void) => void;
            getBlockTransactionCount: (hashStringOrBlockNumber: string | Web3.BlockParam, callback: (err: Error, blockTransactionCount: number) => void) => void;
            getUncle: (hashStringOrBlockNumber: string | Web3.BlockParam, uncleNumber: number, callback: (err: Error, uncle: Web3.BlockWithoutTransactionData) => void) => void;
            getTransaction: (transactionHash: string, callback: (err: Error, transaction: Web3.Transaction) => void) => void;
            getTransactionFromBlock: (hashStringOrBlockNumber: string | Web3.BlockParam, indexNumber: number, callback: (err: Error, transaction: Web3.Transaction) => void) => void;
            contract: (abi: Web3.AbiDefinition[]) => Web3.Contract<any>;
            getBalance: (addressHexString: string, callback: (err: Error, result: BigNumber) => void) => void;
            getStorageAt: (address: string, position: number, callback: (err: Error, storage: string) => void) => void;
            getCode: (addressHexString: string, callback: (err: Error, code: string) => void) => void;
            filter: (value: string | Web3.FilterObject) => Web3.FilterResult;
            sendTransaction: (txData: Web3.TxData, callback: (err: Error, value: string) => void) => void;
            sendRawTransaction: (rawTxData: string, callback: (err: Error, value: string) => void) => void;
            sign: (address: string, data: string, callback: (err: Error, signature: string) => void) => void;
            getTransactionReceipt: (txHash: string, callback: (err: Error, receipt: Web3.TransactionReceipt) => void) => void;
            call: (callData: Web3.CallData, callback: (err: Error, result: string) => void) => void;
            estimateGas: (callData: Web3.CallData, callback: (err: Error, gas: number) => void) => void;
            getTransactionCount: (address: string, callback: (err: Error, count: number) => void) => void;
        };
        type VersionApi = {
            api: string;
            network: string;
            node: string;
            ethereum: string;
            whisper: string;
            getNetwork: (cd: (err: Error, networkId: string) => void) => void;
            getNode: (cd: (err: Error, nodeVersion: string) => void) => void;
            getEthereum: (cd: (err: Error, ethereum: string) => void) => void;
            getWhisper: (cd: (err: Error, whisper: string) => void) => void;
        };
        type PersonalApi = {
            listAccounts: string[] | undefined;
            newAccount: (password?: string) => string;
            unlockAccount: (address: string, password?: string, duration?: number) => boolean;
            lockAccount: (address: string) => boolean;
            sign: (message: string, account: string, password: string) => string;
        };
        type NetApi = {
            listening: boolean;
            peerCount: boolean;
            getListening: (cd: (err: Error, listening: boolean) => void) => void;
            getPeerCount: (cd: (err: Error, peerCount: number) => void) => void;
        };
        type BlockParam = number | 'earliest' | 'latest' | 'pending';
        type Unit = 'kwei' | 'ada' | 'mwei' | 'babbage' | 'gwei' | 'shannon' | 'szabo' | 'finney' | 'ether' | 'kether' | 'grand' | 'einstein' | 'mether' | 'gether' | 'tether';
        type SyncingState = {
            startingBlock: number;
            currentBlock: number;
            highestBlock: number;
        };
        type SyncingResult = false | SyncingState;
        type IsSyncing = {
            addCallback: (cb: (err: Error, isSyncing: boolean, syncingState: SyncingState) => void) => void;
            stopWatching: () => void;
        };
        type AbstractBlock = {
            number: number | null;
            hash: string | null;
            parentHash: string;
            nonce: string | null;
            sha3Uncles: string;
            logsBloom: string | null;
            transactionsRoot: string;
            stateRoot: string;
            miner: string;
            difficulty: BigNumber;
            totalDifficulty: BigNumber;
            extraData: string;
            size: number;
            gasLimit: number;
            gasUser: number;
            timestamp: number;
            uncles: string[];
        };
        type BlockWithoutTransactionData = {
            transactions: string[];
            number: number | null;
            hash: string | null;
            parentHash: string;
            nonce: string | null;
            sha3Uncles: string;
            logsBloom: string | null;
            transactionsRoot: string;
            stateRoot: string;
            miner: string;
            difficulty: BigNumber;
            totalDifficulty: BigNumber;
            extraData: string;
            size: number;
            gasLimit: number;
            gasUser: number;
            timestamp: number;
            uncles: string[];
        };
        type BlockWithTransactionData = {
            transactions: Transaction[];
            number: number | null;
            hash: string | null;
            parentHash: string;
            nonce: string | null;
            sha3Uncles: string;
            logsBloom: string | null;
            transactionsRoot: string;
            stateRoot: string;
            miner: string;
            difficulty: BigNumber;
            totalDifficulty: BigNumber;
            extraData: string;
            size: number;
            gasLimit: number;
            gasUser: number;
            timestamp: number;
            uncles: string[];
        };
        type Transaction = {
            hash: string;
            nonce: number;
            blockHash: string | null;
            blockNumber: number | null;
            transactionIndex: number | null;
            from: string;
            to: string | null;
            value: BigNumber;
            gasPrice: BigNumber;
            gas: number;
            input: string;
        };
        type CallTxDataBase = {
            to?: string;
            value?: number | string | BigNumber;
            gas?: number | string | BigNumber;
            gasPrice?: number | string | BigNumber;
            data?: string;
            nonce?: number;
        };
        type TxData = {
            from: string;
            to?: string;
            value?: number | string | BigNumber;
            gas?: number | string | BigNumber;
            gasPrice?: number | string | BigNumber;
            data?: string;
            nonce?: number;
        };
        type CallData = {
            from?: string;
            to?: string;
            value?: number | string | BigNumber;
            gas?: number | string | BigNumber;
            gasPrice?: number | string | BigNumber;
            data?: string;
            nonce?: number;
        };
        type TransactionReceipt = {
            blockHash: string;
            blockNumber: number;
            transactionHash: string;
            transactionIndex: number;
            from: string;
            to: string;
            cumulativeGasUsed: number;
            gasUsed: number;
            contractAddress: string | null;
            logs: LogEntry[];
        };
        type LogEntry = {
            logIndex: number | null;
            transactionIndex: number;
            transactionHash: string;
            blockHash: string | null;
            blockNumber: number | null;
            address: string;
            data: string;
            topics: string[];
        };
    }
}
declare namespace eth {
    type BigNumber = {
        toNumber: () => number;
    };
    type EosContractSetting = {
        address: string;
        name: string;
        data: any[];
    };
    type EthSetting = {
        contractURL: string;
        contracts: EosContractSetting | EosContractSetting[];
    };
}
declare namespace eth {
    class EthApi extends base.CustomApi {
        protected _web3: Web3 | undefined;
        protected _web3_browser: Web3 | undefined;
        protected _netId: string;
        protected _config: EthSetting;
        protected _account: string | undefined;
        protected _contractMap: {
            [name: string]: Web3.Contract<any>;
        };
        protected _contractBMap: {
            [name: string]: Web3.Contract<any>;
        };
        protected net_changed_cbk: Function | undefined;
        onNetChanged(cbk: Function): void;
        constructor(config: EthSetting, mode: string);
        requireIdentity(): Promise<void>;
        protected updateStatus(): void;
        getSymbol(): string;
        plugin(): string;
        usePlugin(): boolean;
        isInitPlugin(): boolean;
        hasAccount(): boolean;
        defaultAccount(): string;
        check(): boolean;
        getBalance(): Promise<number>;
        protected getGasPrice(): Promise<number>;
        hexCharCodeToStr(hexCharCodeStr: string): string;
        format2Eth(wei: BigNumber): number;
        getTransactionReceiptByHash(hash: string): Promise<Web3.TransactionReceipt>;
        addEvent(name: string, cbk: Function): void;
    }
}
declare namespace eos {
    type IAccount = {
        name: string;
        authority: string;
        blockchain: string;
    };
    type Identity = {
        hash: string;
        publicKey: string;
        name: string;
        kyc: boolean;
        accounts: IAccount[];
    };
    type Scatter = {
        identity: Identity;
        requireVersion: Function;
        getIdentity: (param: any) => Promise<Identity>;
        eos: Function;
        eth: Function;
        forgetIdentity: Function;
    };
    type EosSetting = {
        privateKey?: string;
        defaultContract?: string;
        nets: string | string[];
        chainId: string;
    };
    class EOSConfig {
        private _setting;
        private _nets;
        readonly setting: EosSetting;
        constructor(setting: EosSetting);
        readonly url: string;
        readonly httpEndpoint: string;
        readonly host: string;
        readonly port: number;
        readonly protocal: string;
        readonly privateKey: string | undefined;
        readonly defaultContract: string | undefined;
        readonly chainId: string;
        readonly eosNetwork: {
            blockchain: string;
            host: string;
            port: number;
            protocol: string;
            chainId: string;
        };
    }
}
declare namespace eos {
    type blockInfoResult = {
        block_cpu_limit: number;
        block_net_limit: number;
        chain_id: string;
        head_block_id: string;
        head_block_num: number;
        head_block_producer: string;
        head_block_time: string;
        last_irreversible_block_id: string;
        last_irreversible_block_num: number;
        server_version: string;
        server_version_string: string;
        virtual_block_cpu_limit: number;
        virtual_block_net_limit: number;
    };
    type getBlockResult = {
        action_mroot: string;
        block_extensions: any[];
        block_num: number;
        confirmed: number;
        header_extensions: any[];
        id: string;
        new_producers: any;
        previous: string;
        producer: string;
        producer_signature: string;
        ref_block_prefix: number;
        schedule_version: number;
        timestamp: string;
        transaction_mroot: string;
        transactions: any[];
    };
    type getAccountResult = {
        account_name: string;
        cpu_limit: {
            used: number;
            available: number;
            max: number;
        };
        cpu_weight: number;
        created: string;
        head_block_num: number;
        head_block_time: string;
        last_code_update: string;
        net_limit: {
            used: number;
            available: number;
            max: number;
        };
        net_weight: number;
        permissions: {
            parent: string;
            perm_name: string;
            required_auth: {
                accounts: any[];
                keys: any[];
                threshold: number;
                waits: any[];
            };
        }[];
        privileged: boolean;
        ram_quota: number;
        ram_usage: number;
        refund_request: any;
        self_delegated_bandwidth: any;
        total_resources: any;
        voter_info: any;
    };
    type apiResult = {
        abi_extensions: any[];
        actions: {
            name: string;
            ricardian_contract: string;
            type: string;
        }[];
        error_messages: any[];
        ricardian_clauses: any[];
        structs: {
            base: string;
            fields: {
                name: string;
                type: string;
            }[];
            name: string;
        }[];
        tables: any[];
        types: {
            new_type_name: string;
            type: string;
        }[];
        variants: any[];
        version: string;
    };
    type getCodeResult = {
        account_name: string;
        wast: string;
        wasm: string;
        code_hash: string;
        abi: any;
    };
    type getCodeHashResult = {
        account_name: string;
        code_hash: string;
    };
    type getAbiResult = {
        account_name: string;
        abi: any;
    };
    type getRawCodeAndAbiResult = {
        account_name: string;
        wasm: any;
        abi: any;
    };
    type abiJsonToBinResult = {
        binargs: any;
    };
    type abiBinToJsonResult = {
        args: any;
    };
    type getTableRowsResult = {
        rows: any;
        more: boolean;
    };
    type getCurrencyStatsResult = {
        supply: string;
        max_supply: string;
        issure: string;
    };
    type getProducersResult = {
        rows: any;
        total_producer_vote_weight: number;
        more: string;
        returnedFields: any;
    };
    type producerResult = {
        producers: {
            block_signing_key: string;
            producer_name: string;
        }[];
        version: number;
    };
    type getProducerScheduleResult = {
        pending: any;
        proposed: any;
        owner: producerResult;
        active: producerResult;
        recovery: producerResult;
    };
    type getScheduledTransactionsResult = {
        ows: any;
        more: string;
    };
    type pushTransactionResult = {
        transaction_id: any;
        processed: any;
    };
    type getActionsResultItem = {
        account_action_seq: number;
        action_trace: {
            account_ram_deltas: any[];
            act: {
                account: string;
                authorization: {
                    actor: string;
                    permission: string;
                }[];
                data: {
                    from: string;
                    to: string;
                    quantity: string;
                    memo: string;
                };
                hex_data: string;
                name: string;
            };
            block_num: number;
            block_time: string;
            console: string;
            context_free: boolean;
            elapsed: number;
            except: any;
            inline_traces: any[];
            producer_block_id: any;
            receipt: {
                abi_sequence: number;
                act_digest: string;
                auth_sequence: any[];
                code_sequence: number;
                global_sequence: number;
                receiver: string;
                recv_sequence: number;
            };
            trx_id: string;
        };
        block_num: number;
        block_time: string;
        global_action_seq: number;
    };
    type getActionsResult = {
        actions: Array<getActionsResultItem>;
        last_irreversible_block: number;
        time_limit_exceeded_error: boolean;
    };
    type getTransactionResult = {
        id: string;
        trx: any;
        block_time: string;
        block_num: number;
        last_irreversible_block: number;
        traces: Array<any>;
    };
    type getKeyAccountsResult = {
        account_names: Array<string>;
    };
    type getControlledAccountsResult = {
        controlled_accounts: Array<string>;
    };
    type authorizationParam = {
        actor: string;
        permission: string;
    };
    type actionParam = {
        account: string;
        name: string;
        authorization: authorizationParam[];
        data?: any;
        hex_data?: string;
    };
    type actionParams = {
        actions: actionParam[];
    };
    type actionTraceResult = {
        receipt: {
            receiver: number;
            act_digest: number;
            global_sequence: number;
            recv_sequence: number;
            auth_sequence: Array<any>[];
            code_sequence: number;
            abi_sequence: number;
        };
        act: actionParam;
        context_free: boolean;
        elapsed: number;
        console: any;
        trx_id: string;
        block_num: number;
        block_time: string;
        producer_block_id: any;
        account_ram_deltas: any[];
        except: any;
        inline_traces: any[];
    };
    type transactionResult = {
        broadcast: boolean;
        transaction: {
            compression: string;
            transaction: {
                expiration: string;
                ref_block_num: number;
                ref_block_prefix: number;
                max_net_usage_words: number;
                max_cpu_usage_ms: number;
                delay_sec: number;
                context_free_actions: any[];
                actions: {
                    account: string;
                    name: string;
                    authorization: {
                        actor: string;
                        permission: string;
                    }[];
                    data: any;
                }[];
                transaction_extensions: any[];
            };
            signatures: string[];
        };
        transaction_id: string;
        processed: {
            id: string;
            block_num: number;
            block_time: string;
            producer_block_id: any;
            receipt: {
                status: string;
                cpu_usage_us: number;
                net_usage_words: number;
            };
            elapsed: number;
            net_usage: number;
            scheduled: boolean;
            action_traces: actionTraceResult[];
            except: any;
        };
    };
    type accountParam = {
        creator: string;
        name: string;
        owner: string;
        active: string;
        recovery: string;
    };
    type TransferParam = {
        from: string;
        to: string;
        quantity: string;
        memo: string;
    };
    type optionParam = {
        broadcast?: boolean;
        sign?: boolean;
        authorization?: any;
        blocksBehind?: number;
        expireSeconds?: number;
    };
    type tableRowPraam = {
        json?: boolean;
        code: string;
        scope: string;
        table: string;
        table_key?: string;
        lower_bound?: any;
        upper_bound?: any;
        limit?: number;
        key_type?: string;
        index_position?: number;
    };
    type Eos = {
        getInfo: (param: any) => Promise<blockInfoResult>;
        getBlock: (block_num_or_id: number) => Promise<getBlockResult>;
        getAccount: (account_name: string) => Promise<getAccountResult>;
        getActions: (account_name: string, pos: number, offset: number) => Promise<getActionsResult>;
        getCurrencyBalance: (code: string, account: string, symbol: string) => Promise<Array<string>>;
        getCurrencyStats: (code: string, symbol: string) => Promise<{
            [symbol: string]: getCurrencyStatsResult;
        }>;
        getKeyAccounts: (public_key: string) => Promise<getKeyAccountsResult>;
        getCodeHash: (account_name: string) => Promise<getCodeHashResult>;
        getAbi: (account_name: string) => Promise<getAbiResult>;
        getProducerSchedule: (param: any) => Promise<getProducerScheduleResult>;
        contract: (account_name: string) => Promise<any>;
        transaction: (param: actionParams, option?: any) => Promise<transactionResult>;
        newaccount: (param: accountParam) => Promise<transactionResult>;
        transfer: (param: TransferParam, toptions: optionParam | boolean) => Promise<any>;
        getTransaction: (id: string, block_num_hint: any) => Promise<getTransactionResult>;
        getCode: (account_name: string, code_as_wasm: any) => Promise<getCodeResult>;
        getRawCodeAndAbi: (account_name: string) => Promise<getRawCodeAndAbiResult>;
        abiJsonToBin: (code: string, action: string, args: any[]) => Promise<abiJsonToBinResult>;
        abiBinToJson: (code: any, action: any, binargs: any) => Promise<abiBinToJsonResult>;
        getRequiredKeys: (transaction: any, available_keys: any) => Set<string>;
        getBlockHeaderState: (block_num_or_id: any) => Promise<string>;
        getTableRows: (param: tableRowPraam) => Promise<getTableRowsResult>;
        getProducers: (jsin: any, lower_bound: any, limit: any) => Promise<getProducersResult>;
        getScheduledTransactions: (json: any, lower_bound: any, limit: any) => Promise<getScheduledTransactionsResult>;
        pushTransaction: (signed_transaction: any) => Promise<pushTransactionResult>;
        pushTransactions: (signed_transaction: any) => any;
        getControlledAccounts: (controlling_account: any) => Promise<getControlledAccountsResult>;
    };
}
declare namespace eos {
    class EosApi extends base.CustomApi {
        protected _scatter: Scatter | undefined;
        protected _eos: Eos | undefined;
        protected _config: EOSConfig;
        protected _account: IAccount | undefined;
        protected miss_identity_cbk: Function | undefined;
        private formatEos;
        constructor(config: EosSetting, mode: string);
        readonly eos: Eos | undefined;
        getSymbol(): string;
        plugin(): string;
        usePlugin(): boolean;
        isInitPlugin(): boolean;
        hasAccount(): boolean;
        defaultAccount(): string;
        check(): boolean;
        readonly identity: Identity | undefined;
        addEvent(name: string, cbk: Function): void;
        forgetIdentity(): void;
        protected updateStatus(): void;
        onMissItentity(cbk: Function): EosApi;
        encode(value: string): string;
        decode(value: string): string;
        requireIdentity(): Promise<Identity>;
        getBalance(): Promise<number>;
        getAccountInfo(): Promise<getAccountResult> | undefined;
        transaction(account: IAccount, to: string, currency: string, memo?: string): Promise<transactionResult> | undefined;
        getAuthorization(): string;
        doAction(contractName: string, actionName: string, authorization: string | string[], ...param: any[]): Promise<any>;
        doSimpleAction(actionName: string, ...param: any[]): Promise<undefined>;
        getTableRows(table: string, scope: string, contractName?: string, limit?: number, lower_bound?: number, table_key?: string): Promise<getTableRowsResult>;
        getAllTableRows(scope: string | number, tableName: string, table_key?: string, contractName?: string): Promise<any[]>;
        getGlobalData(): Promise<any>;
        getRamPrice(): Promise<number>;
        buyRam(ramAmount: number): Promise<any>;
        getNetCpuPrice(): Promise<{
            netPrice: number;
            cpuPrice: number;
        }>;
        sellRam(ramAmount: number): Promise<any>;
        delegatebw(net_amount: number, cpu_amount: number): Promise<any>;
        undelegatebw(net_amount: number, cpu_amount: number): Promise<any>;
        private handleError;
    }
}
export declare const soeth: base.Base;
export declare let API: base.BaseAPI | undefined;
