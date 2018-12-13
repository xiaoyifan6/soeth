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
    EosApi.prototype.formatEos = function (value) { return parseFloat(value); };
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
            var name = this.defaultAccount();
            this._account = this.identity.accounts.find(function (accound) {
                return accound.blockchain == "eos";
            });
            if (name != this.defaultAccount()) {
                this.account_changed_cbk && this.account_changed_cbk(this.defaultAccount(), name);
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
    EosApi.prototype.getBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var eos, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eos = this.eos;
                        if (!eos)
                            return [2 /*return*/, 0];
                        return [4 /*yield*/, eos.getCurrencyBalance("eosio.token", this.defaultAccount(), this.getSymbol().toUpperCase())];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res && res.length > 0 ? parseFloat(res[0]) : 0];
                }
            });
        });
    };
    EosApi.prototype.getAccountInfo = function () {
        var eos = this.eos;
        if (!eos)
            return undefined;
        return eos.getAccount(this.defaultAccount());
    };
    EosApi.prototype.transaction = function (account, to, currency, memo) {
        if (memo === void 0) { memo = ""; }
        var eos = this.eos;
        if (!eos)
            return undefined;
        return eos.transaction({
            actions: [
                {
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                            actor: account.name,
                            permission: account.authority
                        }],
                    data: {
                        from: account.name,
                        to: to,
                        quantity: currency,
                        memo: memo
                    }
                }
            ],
        }, { broadcast: true, sign: true });
    };
    EosApi.prototype.getAuthorization = function () {
        var account = this._account;
        return account ? account.name + "@" + account.authority : "";
    };
    EosApi.prototype.doAction = function (contractName, actionName, authorization) {
        var param = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            param[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var eos, options, contract, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eos = this.eos;
                        if (!eos)
                            return [2 /*return*/, undefined];
                        options = {
                            authorization: typeof authorization == "string" ? [authorization] : authorization
                        };
                        return [4 /*yield*/, eos.contract(contractName)];
                    case 1:
                        contract = _a.sent();
                        if (!contract)
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, contract[actionName].apply(window, param.concat(options))];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    EosApi.prototype.doSimpleAction = function (actionName) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._config.defaultContract) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.doAction.apply(this, [this._config.defaultContract, actionName, this.getAuthorization()].concat(param))];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = undefined;
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    EosApi.prototype.getTableRows = function (table, scope, contractName, limit, lower_bound, table_key) {
        return __awaiter(this, void 0, void 0, function () {
            var param, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!contractName) {
                            if (!this._config.defaultContract)
                                return [2 /*return*/, { rows: [], more: false }];
                            contractName = this._config.defaultContract;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        param = {
                            code: contractName,
                            scope: scope,
                            table: table,
                            json: true,
                            lower_bound: lower_bound
                        };
                        limit && (param["limit"] = limit);
                        table_key && (param["table_key"] = table_key);
                        if (!this.eos)
                            return [2 /*return*/, { rows: [], more: false }];
                        return [4 /*yield*/, this.eos.getTableRows(param)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_2 = _a.sent();
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EosApi.prototype.getAllTableRows = function (scope, tableName, table_key, contractName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, limit, lower_bound, data, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!contractName) {
                            if (!this._config.defaultContract)
                                return [2 /*return*/, []];
                            contractName = this._config.defaultContract;
                        }
                        if (!scope)
                            return [2 /*return*/, []];
                        result = [];
                        limit = 10;
                        lower_bound = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getTableRows(tableName, scope.toString(), contractName, limit, lower_bound, table_key)];
                    case 2:
                        data = _a.sent();
                        if (!data)
                            return [3 /*break*/, 3];
                        if (data.rows && data.rows.length > 0) {
                            for (i = 0; i < data.rows.length; i++) {
                                result.push(data.rows[i]);
                            }
                            lower_bound += data.rows.length;
                            if (!data.more)
                                return [3 /*break*/, 3];
                        }
                        else {
                            return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, result];
                }
            });
        });
    };
    EosApi.prototype.getGlobalData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTableRows("eosio", "global", "eosio")];
                    case 1:
                        res = _a.sent();
                        if (res && res.rows && res.rows.length > 0)
                            return [2 /*return*/, res.rows[0]];
                        return [2 /*return*/, null];
                }
            });
        });
    };
    EosApi.prototype.getRamPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTableRows("eosio", "rammarket", "eosio")];
                    case 1:
                        res = _a.sent();
                        if (res && res.rows && res.rows.length > 0) {
                            return [2 /*return*/, this.formatEos(res.rows[0].quote.balance) / this.formatEos(res.rows[0].base.balance) * 1024];
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    EosApi.prototype.buyRam = function (ramAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        this.contract_cbk && this.contract_cbk(0);
                        return [4 /*yield*/, this.doAction("eosio", "buyrambytes", this.defaultAccount(), this.defaultAccount(), ramAmount)];
                    case 1:
                        res = _a.sent();
                        this.contract_cbk && this.contract_cbk(1, res);
                        return [2 /*return*/, res];
                    case 2:
                        e_3 = _a.sent();
                        this.handleError(e_3);
                        throw e_3;
                    case 3:
                        this.contract_cbk && this.contract_cbk(3);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EosApi.prototype.getNetCpuPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, netPrice, cpuPrice, netBalance, netTotal, cpuBalance, cpuTotal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAccountInfo()];
                    case 1:
                        res = _a.sent();
                        netPrice = 0;
                        cpuPrice = 0;
                        if (res) {
                            netBalance = res.net_weight / 10000;
                            netTotal = res.net_limit.max / 1024;
                            //(netBalance / netTotal)获取到的是过去3天内的平均消耗量，除以３获取每天的平均消耗量，即价格
                            netPrice = ((netBalance / netTotal) / 3);
                            console.log(netBalance, netTotal, netPrice);
                            cpuBalance = res.cpu_weight / 10000;
                            cpuTotal = res.cpu_limit.max / 1024;
                            //(cpuBalance / cpuTotal)获取到的是过去3天内的平均消耗量，除以３获取每天的平均消耗量，即价格
                            cpuPrice = ((cpuBalance / cpuTotal) / 3);
                        }
                        return [2 /*return*/, {
                                netPrice: netPrice,
                                cpuPrice: cpuPrice,
                            }];
                }
            });
        });
    };
    EosApi.prototype.sellRam = function (ramAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        this.contract_cbk && this.contract_cbk(0);
                        return [4 /*yield*/, this.doAction("eosio", "sellram", this.defaultAccount(), ramAmount)];
                    case 1:
                        res = _a.sent();
                        this.contract_cbk && this.contract_cbk(1, res);
                        return [2 /*return*/, res];
                    case 2:
                        e_4 = _a.sent();
                        this.handleError(e_4);
                        throw e_4;
                    case 3:
                        this.contract_cbk && this.contract_cbk(3);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //抵押EOS购买NET、CPU
    EosApi.prototype.delegatebw = function (net_amount, cpu_amount) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        this.contract_cbk && this.contract_cbk(0);
                        return [4 /*yield*/, this.doAction("eosio", "delegatebw", this.defaultAccount(), this.defaultAccount(), net_amount.toFixed(4) + " EOS", cpu_amount.toFixed(4) + " EOS", 0)];
                    case 1:
                        res = _a.sent();
                        this.contract_cbk && this.contract_cbk(1, res);
                        return [2 /*return*/, res];
                    case 2:
                        e_5 = _a.sent();
                        this.handleError(e_5);
                        throw e_5;
                    case 3:
                        this.contract_cbk && this.contract_cbk(3);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //从NET、CPU资源中赎回EOS
    EosApi.prototype.undelegatebw = function (net_amount, cpu_amount) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        this.contract_cbk && this.contract_cbk(0);
                        return [4 /*yield*/, this.doAction("eosio", "undelegatebw", this.defaultAccount(), this.defaultAccount(), net_amount.toFixed(4) + " EOS", cpu_amount.toFixed(4) + " EOS")];
                    case 1:
                        res = _a.sent();
                        this.contract_cbk && this.contract_cbk(1, res);
                        return [2 /*return*/, res];
                    case 2:
                        e_6 = _a.sent();
                        this.handleError(e_6);
                        throw e_6;
                    case 3:
                        this.contract_cbk && this.contract_cbk(3);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EosApi.prototype.handleError = function (e) {
        if (!e)
            return;
        if (typeof e == 'string') {
            try {
                var obj = JSON.parse(e);
                typeof obj == 'object' && obj && (e = obj);
            }
            catch (e) { }
        }
        this.error_cbk && (e.error && e.error.details ? this.error_cbk(Base_1.ErrorCode.TranSactionError, e) : this.error_cbk(Base_1.ErrorCode.UnknowError, e));
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