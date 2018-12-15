import { CustomApi } from '../base/CustomApi';
import { Web3 } from 'web3';
import { EthSetting } from './Base';
import BigNumber from 'bignumber';
export declare class EthApi extends CustomApi {
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
