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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Base_1 = require("../base/Base");
var CustomApi_1 = require("../base/CustomApi");
var eosjs_1 = require("../lib/eosjs");
var Base_2 = require("./Base");
var EosApi = /** @class */ (function (_super) {
    __extends(EosApi, _super);
    function EosApi(config, mode) {
        var _this = _super.call(this, mode) || this;
        _this._config = new Base_2.EOSConfig(config);
        var win = window;
        _this._scatter = win['scatter'];
        if (_this._scatter) {
            _this._scatter.requireVersion(3.0);
            _this._eos = _this._scatter.eos(_this._config.eosNetwork, eosjs_1.Eos, {}, _this._config.protocal);
        }
        else {
            _this._eos = undefined;
        }
        return _this;
    }
    Object.defineProperty(EosApi.prototype, "eos", {
        get: function () {
            return this._eos;
        },
        enumerable: true,
        configurable: true
    });
    EosApi.prototype.getSymbol = function () { return Base_1.SymbolType.eos; }; // eos或者eth
    EosApi.prototype.plugin = function () { return "Scatter"; }; // 插件名称
    EosApi.prototype.usePlugin = function () { return true; }; // 是否使用插件
    EosApi.prototype.isInitPlugin = function () { return this._eos != undefined; }; // 插件是否初始化了
    EosApi.prototype.hasAccount = function () { return this._account != undefined; }; // 是否有账号
    EosApi.prototype.defaultAccount = function () { return this._account ? this._account.name : ""; }; // 获取默认账号
    EosApi.prototype.check = function () {
        if (this.isInitPlugin()) {
            this.error_cbk && this.error_cbk(Base_1.ErrorCode.PluginNotInit);
            return false;
        }
        else if (this.hasAccount()) {
            this.error_cbk && this.error_cbk(Base_1.ErrorCode.AccountNotFound);
            return false;
        }
        else if (!this.identity) {
            this.error_cbk && this.error_cbk(Base_1.ErrorCode.MissIdentity);
            this.miss_identity_cbk && this.miss_identity_cbk();
            return false;
        }
        return true;
    };
    Object.defineProperty(EosApi.prototype, "identity", {
        get: function () { return this._scatter ? this._scatter.identity : undefined; },
        enumerable: true,
        configurable: true
    });
    EosApi.prototype.addEvent = function (name, cbk) { };
    EosApi.prototype.forgetIdentity = function () { this._scatter && this._scatter.forgetIdentity(); };
    EosApi.prototype.updateStatus = function () {
        _super.prototype.updateStatus.call(this);
        var win = window;
        if (!this._scatter) {
            win['scatter'] && (this._scatter = win['scatter']);
            if (this._scatter) {
                this._scatter.requireVersion(3.0);
                this._eos = this._scatter.eos(this._config.eosNetwork, eosjs_1.Eos, {}, this._config.protocal);
            }
        }
        if (this.identity) {
            var name = this.defaultAccount;
            this._account = this.identity.accounts.find(function (accound) {
                return accound.blockchain == "eos";
            });
            if (name != this.defaultAccount) {
                this.account_changed_cbk && this.account_changed_cbk(this.defaultAccount, name);
            }
        }
    };
    EosApi.prototype.onMissItentity = function (cbk) {
        this.miss_identity_cbk = cbk;
        return this;
    };
    EosApi.prototype.encode = function (value) {
        return eosjs_1.Eos.modules.format.encodeName(value, false);
    };
    EosApi.prototype.decode = function (value) {
        return eosjs_1.Eos.modules.format.decodeName(value.toString(), false);
    };
    EosApi.prototype.requireIdentity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._scatter) {
                            this.error_cbk && this.error_cbk(Base_1.ErrorCode.PluginNotInit);
                            throw { errorCode: Base_1.ErrorCode.PluginNotInit };
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._scatter.getIdentity({ accounts: [this._config.eosNetwork] })];
                    case 2:
                        res = _a.sent();
                        if (res) {
                            this._account = res.accounts.find(function (accound) { return accound.blockchain == "eos"; });
                            return [2 /*return*/, res];
                        }
                        else {
                            this.error_cbk && this.error_cbk(Base_1.ErrorCode.AccountNotFound);
                            throw { errorCode: Base_1.ErrorCode.AccountNotFound };
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return EosApi;
}(CustomApi_1.CustomApi));
exports.EosApi = EosApi;
Base_1.sdk.register(Base_1.SymbolType.eos, new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.generateAPI = function (config, mode) {
        return new EosApi(config, mode);
    };
    return class_1;
}())());
//# sourceMappingURL=EosApi.js.map