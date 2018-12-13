import { BaseAPI } from "./Base";

type NullableFunction = Function | undefined;

export abstract class CustomApi implements BaseAPI {

    private _mode: string;
    private _isRunning: boolean;
    private _tIndex: number;

    protected event_cbk: NullableFunction;
    protected error_cbk: NullableFunction;
    protected account_changed_cbk: NullableFunction;
    protected contract_cbk: NullableFunction;
    protected identity_cbk: NullableFunction;

    public get mode(): string { return this._mode; }
    public get isRunning(): boolean { return this._isRunning; }

    public onEvent(cbk: Function): BaseAPI { this.error_cbk = cbk; return this; } //事件调用

    public onError(cbk: Function): BaseAPI { this.error_cbk = cbk; return this; } // 错误

    public onAccountChanged(cbk: Function): BaseAPI { this.account_changed_cbk = cbk; return this; } //账号切换

    public onIdentity(cbk: Function): BaseAPI { this.identity_cbk = cbk; return this; } // 是否授权

    public onContract(cbk: Function): BaseAPI { this.contract_cbk = cbk; return this; } // 合约调用

    public getMode(): string { return this._mode; }

    protected sleep(t: number) {
        return new Promise<any>((resolve) => {
            setTimeout(() => {
                resolve();
            }, t);
        });
    }

    protected start() {
        this.updateStatus();

        if (!this.usePlugin() || this._isRunning) return;
        this._isRunning = true;
        let self = this;
        this._tIndex = window.setInterval(() => {
            if (!self._isRunning) {
                clearInterval(self._tIndex);
            }
            self.updateStatus();
        }, 10000);
    }

    protected stop() {
        this._isRunning = false;
    }

    abstract getSymbol(): string;
    abstract plugin(): string;
    abstract usePlugin(): boolean;
    abstract isInitPlugin(): boolean;
    abstract hasAccount(): boolean;
    abstract defaultAccount(): string;
    abstract check(): boolean;
    abstract addEvent(name: string, cbk: Function): void;

    protected updateStatus(): void { } // 更新状态 只有使用插件时会用到

    public constructor(mode: string) {
        this._mode = mode;
        this._isRunning = false;
        this._tIndex = 0;

        this.start();
    }
}