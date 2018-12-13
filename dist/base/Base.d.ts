export declare const SymbolType: {
    eth: string;
    eos: string;
};
export interface BaseAPI {
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
export declare const ErrorCode: {
    PluginNotInit: number;
    AccountNotFound: number;
    MissIdentity: number;
};
export interface APICreator {
    generateAPI(config: any, mode: any): BaseAPI;
}
declare class Base {
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
export declare var sdk: Base;
export {};
