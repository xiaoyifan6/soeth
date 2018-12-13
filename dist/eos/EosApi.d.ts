import { CustomApi } from "../base/CustomApi";
import { Eos } from "../lib/eosjs";
import { Scatter, IAccount, Identity, EosSetting, EOSConfig } from "./Base";
export declare class EosApi extends CustomApi {
    protected _scatter: Scatter | undefined;
    protected _eos: Eos | undefined;
    protected _config: EOSConfig;
    protected _account: IAccount | undefined;
    protected miss_identity_cbk: Function | undefined;
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
}
