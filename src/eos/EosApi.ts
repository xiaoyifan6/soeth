import { BaseAPI, sdk, SymbolType, APICreator, ErrorCode } from "../base/Base";
import { CustomApi } from "../base/CustomApi";
import { Eos } from "../lib/eosjs";
import { Scatter, IAccount, Identity, EosSetting, EOSConfig } from "./Base";

export class EosApi extends CustomApi {
    protected _scatter: Scatter | undefined;
    protected _eos: Eos | undefined;
    protected _config: EOSConfig;
    protected _account: IAccount | undefined;

    protected miss_identity_cbk: Function | undefined;

    public constructor(config: EosSetting, mode: string) {
        super(mode);
        this._config = new EOSConfig(config);

        var win: any = window;
        this._scatter = win['scatter'];
        if (this._scatter) {
            this._scatter.requireVersion(3.0);
            this._eos = this._scatter.eos(this._config.eosNetwork, Eos, {}, this._config.protocal);
        } else {
            this._eos = undefined;
        }
    }

    public get eos(): Eos | undefined {
        return this._eos;
    }

    public getSymbol(): string { return SymbolType.eos; } // eos或者eth

    public plugin(): string { return "Scatter" } // 插件名称

    public usePlugin(): boolean { return true; } // 是否使用插件

    public isInitPlugin(): boolean { return this._eos != undefined; } // 插件是否初始化了

    public hasAccount(): boolean { return this._account != undefined; } // 是否有账号

    public defaultAccount(): string { return this._account ? this._account.name : ""; } // 获取默认账号

    public check(): boolean {
        if (this.isInitPlugin()) {
            this.error_cbk && this.error_cbk(ErrorCode.PluginNotInit);
            return false;
        } else if (this.hasAccount()) {
            this.error_cbk && this.error_cbk(ErrorCode.AccountNotFound);
            return false;
        } else if (!this.identity) {
            this.error_cbk && this.error_cbk(ErrorCode.MissIdentity);
            this.miss_identity_cbk && this.miss_identity_cbk();
            return false;
        }
        return true;
    }

    public get identity(): Identity | undefined { return this._scatter ? this._scatter.identity : undefined; }

    public addEvent(name: string, cbk: Function): void { }

    public forgetIdentity() { this._scatter && this._scatter.forgetIdentity(); }

    protected updateStatus(): void {
        super.updateStatus();

        var win: any = window;
        if (!this._scatter) {
            win['scatter'] && (this._scatter = win['scatter']);
            if (this._scatter) {
                this._scatter.requireVersion(3.0);
                this._eos = this._scatter.eos(this._config.eosNetwork, Eos, {}, this._config.protocal);
            }
        }

        if (this.identity) {
            var name = this.defaultAccount;

            this._account = this.identity.accounts.find((accound) => {
                return accound.blockchain == "eos";
            });

            if (name != this.defaultAccount) {
                this.account_changed_cbk && this.account_changed_cbk(this.defaultAccount, name);
            }
        }
    }

    public onMissItentity(cbk: Function): EosApi {
        this.miss_identity_cbk = cbk;
        return this;
    }

    public encode(value: string): string {
        return Eos.modules.format.encodeName(value, false);
    }

    public decode(value: string): string {
        return Eos.modules.format.decodeName(value.toString(), false)
    }

    public async requireIdentity() {
        if (!this._scatter) {
            this.error_cbk && this.error_cbk(ErrorCode.PluginNotInit);
            throw { errorCode: ErrorCode.PluginNotInit };
        }

        try {
            var res = await this._scatter.getIdentity({ accounts: [this._config.eosNetwork] });
            if (res) {
                this._account = res.accounts.find((accound) => { return accound.blockchain == "eos"; });
                return res;
            } else {
                this.error_cbk && this.error_cbk(ErrorCode.AccountNotFound);
                throw { errorCode: ErrorCode.AccountNotFound };
            }
        } catch (e) {
            throw e;
        }
    }
}

sdk.register(SymbolType.eos, new class implements APICreator {
    public generateAPI(config: any, mode: any): BaseAPI {
        return new EosApi(config, mode);
    }
}());