import { BaseAPI, sdk, SymbolType, APICreator } from "../base/Base";
import { CustomApi } from "../base/CustomApi";

export class EthApi extends CustomApi {

    public constructor(config: any, mode: string) {
        super(mode);
    }

    public getSymbol(): string { return SymbolType.eth; } // eos或者eth

    public plugin(): string { return "" } // 插件名称

    public getMode(): string { return "" }// 模式: local/testnet/mainet

    public usePlugin(): boolean { return true; } // 是否使用插件

    public isInitPlugin(): boolean { return true; } // 插件是否初始化了

    public hasAccount(): boolean { return true; } // 是否有账号

    public defaultAccount(): string { return ""; } // 获取默认账号

    public check(): boolean { return true; }

    public addEvent(name: string, cbk: Function): void { }

}

sdk.register(SymbolType.eth, new class implements APICreator {
    public generateAPI(config: any, mode: any): BaseAPI {
        return new EthApi(config, mode);
    }
}());