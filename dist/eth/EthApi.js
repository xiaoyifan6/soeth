"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Base_1 = require("../base/Base");
var CustomApi_1 = require("../base/CustomApi");
var EthApi = /** @class */ (function (_super) {
    __extends(EthApi, _super);
    function EthApi(config, mode) {
        return _super.call(this, mode) || this;
    }
    EthApi.prototype.getSymbol = function () { return Base_1.SymbolType.eth; }; // eos或者eth
    EthApi.prototype.plugin = function () { return ""; }; // 插件名称
    EthApi.prototype.getMode = function () { return ""; }; // 模式: local/testnet/mainet
    EthApi.prototype.usePlugin = function () { return true; }; // 是否使用插件
    EthApi.prototype.isInitPlugin = function () { return true; }; // 插件是否初始化了
    EthApi.prototype.hasAccount = function () { return true; }; // 是否有账号
    EthApi.prototype.defaultAccount = function () { return ""; }; // 获取默认账号
    EthApi.prototype.check = function () { return true; };
    EthApi.prototype.addEvent = function (name, cbk) { };
    return EthApi;
}(CustomApi_1.CustomApi));
exports.EthApi = EthApi;
Base_1.sdk.register(Base_1.SymbolType.eth, new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.generateAPI = function (config, mode) {
        return new EthApi(config, mode);
    };
    return class_1;
}())());
//# sourceMappingURL=EthApi.js.map