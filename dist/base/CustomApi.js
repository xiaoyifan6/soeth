"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomApi = /** @class */ (function () {
    function CustomApi(mode) {
        this._mode = mode;
        this._isRunning = false;
        this._tIndex = 0;
        this.start();
    }
    Object.defineProperty(CustomApi.prototype, "mode", {
        get: function () { return this._mode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomApi.prototype, "isRunning", {
        get: function () { return this._isRunning; },
        enumerable: true,
        configurable: true
    });
    CustomApi.prototype.onEvent = function (cbk) { this.error_cbk = cbk; return this; }; //事件调用
    CustomApi.prototype.onError = function (cbk) { this.error_cbk = cbk; return this; }; // 错误
    CustomApi.prototype.onAccountChanged = function (cbk) { this.account_changed_cbk = cbk; return this; }; //账号切换
    CustomApi.prototype.onIdentity = function (cbk) { this.identity_cbk = cbk; return this; }; // 是否授权
    CustomApi.prototype.onContract = function (cbk) { this.contract_cbk = cbk; return this; }; // 合约调用
    CustomApi.prototype.getMode = function () { return this._mode; };
    CustomApi.prototype.sleep = function (t) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, t);
        });
    };
    CustomApi.prototype.start = function () {
        this.updateStatus();
        if (!this.usePlugin() || this._isRunning)
            return;
        this._isRunning = true;
        var self = this;
        this._tIndex = window.setInterval(function () {
            if (!self._isRunning) {
                clearInterval(self._tIndex);
            }
            self.updateStatus();
        }, 10000);
    };
    CustomApi.prototype.stop = function () {
        this._isRunning = false;
    };
    CustomApi.prototype.updateStatus = function () { }; // 更新状态 只有使用插件时会用到
    return CustomApi;
}());
exports.CustomApi = CustomApi;
//# sourceMappingURL=CustomApi.js.map