import { CustomApi } from "../base/CustomApi";
export declare class EthApi extends CustomApi {
    constructor(config: any, mode: string);
    getSymbol(): string;
    plugin(): string;
    getMode(): string;
    usePlugin(): boolean;
    isInitPlugin(): boolean;
    hasAccount(): boolean;
    defaultAccount(): string;
    check(): boolean;
    addEvent(name: string, cbk: Function): void;
}
