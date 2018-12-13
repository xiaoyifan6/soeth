import { CustomApi } from "../base/CustomApi";
import { Eos } from "../lib/eosjs";
import { Scatter, IAccount, Identity, EosSetting, EOSConfig } from "./Base";
export declare class EosApi extends CustomApi {
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
    getAccountInfo(): Promise<{
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
    }> | undefined;
    transaction(account: IAccount, to: string, currency: string, memo?: string): Promise<{
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
            action_traces: {
                receipt: {
                    receiver: number;
                    act_digest: number;
                    global_sequence: number;
                    recv_sequence: number;
                    auth_sequence: any[][];
                    code_sequence: number;
                    abi_sequence: number;
                };
                act: {
                    account: string;
                    name: string;
                    authorization: {
                        actor: string;
                        permission: string;
                    }[];
                    data?: any;
                    hex_data?: string | undefined;
                };
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
            }[];
            except: any;
        };
    }> | undefined;
    getAuthorization(): string;
    doAction(contractName: string, actionName: string, authorization: string | string[], ...param: any[]): Promise<any>;
    doSimpleAction(actionName: string, ...param: any[]): Promise<any>;
    getTableRows(table: string, scope: string, contractName?: string, limit?: number, lower_bound?: number, table_key?: string): Promise<{
        rows: any;
        more: boolean;
    }>;
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
