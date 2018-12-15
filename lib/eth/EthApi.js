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
var web3_1 = require("web3");
var EthApi = /** @class */ (function (_super) {
    __extends(EthApi, _super);
    function EthApi(config, mode) {
        var _this = _super.call(this, mode) || this;
        _this._config = config;
        _this._netId = '';
        _this._contractMap = {};
        _this._contractBMap = {};
        var win = window;
        var ethereum = win['ethereum'];
        if (ethereum) {
            _this._web3 = new web3_1.Web3(ethereum);
            _this.requireIdentity();
        }
        _this._web3_browser = new web3_1.Web3(new web3_1.Web3.providers.HttpProvider(_this._config.contractURL));
        var contracts = _this._config.contracts instanceof Array ? _this._config.contracts : [_this._config.contracts];
        for (var _i = 0, contracts_1 = contracts; _i < contracts_1.length; _i++) {
            var contract = contracts_1[_i];
            _this._web3 && (_this._contractMap[contract.name] = _this._web3.eth.contract(contract.data).at(contract.address));
            _this._web3_browser &&
                (_this._contractMap[contract.name] = _this._web3_browser.eth.contract(contract.data).at(contract.address));
        }
        return _this;
    }
    EthApi.prototype.onNetChanged = function (cbk) {
        this.net_changed_cbk = cbk;
    };
    EthApi.prototype.requireIdentity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var win, ethereum, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        win = window;
                        ethereum = win['ethereum'];
                        if (!ethereum)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ethereum.enable()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.error_cbk && this.error_cbk(Base_1.ErrorCode.MissIdentity, e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EthApi.prototype.updateStatus = function () {
        var _this = this;
        _super.prototype.updateStatus.call(this);
        if (!this.isInitPlugin()) {
            var win = window;
            var ethereum = win['ethereum'];
            if (ethereum) {
                this._web3 = new web3_1.Web3(ethereum);
                this._web3_browser = new web3_1.Web3(new web3_1.Web3.providers.HttpProvider(this._config.contractURL));
                this.requireIdentity();
            }
        }
        var web3 = this._web3;
        if (!web3)
            return;
        // 检查网络状态
        web3.version.getNetwork(function (err, netId) {
            if (netId !== _this._netId) {
                _this.net_changed_cbk && _this.net_changed_cbk(netId, _this._netId);
                _this._netId = netId;
            }
            err && _this.error_cbk && _this.error_cbk(Base_1.ErrorCode.NetError, err);
        });
        // 检查账号是否切换
        web3.eth.getAccounts(function (err, res) {
            // 检查是否切换账户
            if (res.length === 0) {
                return;
            }
            var account = res[0];
            if (account !== _this._account) {
                _this.account_changed_cbk && _this.account_changed_cbk(account, _this._account);
                _this._account = account;
            }
            err && _this.error_cbk && _this.error_cbk(Base_1.ErrorCode.AccountError, err);
        });
    };
    EthApi.prototype.getSymbol = function () {
        return Base_1.SymbolType.eth;
    }; // eos或者eth
    EthApi.prototype.plugin = function () {
        return 'MateMask';
    }; // 插件名称
    EthApi.prototype.usePlugin = function () {
        return true;
    }; // 是否使用插件
    EthApi.prototype.isInitPlugin = function () {
        return this._web3 !== undefined;
    }; // 插件是否初始化了
    EthApi.prototype.hasAccount = function () {
        return this._account !== undefined;
    }; // 是否有账号
    EthApi.prototype.defaultAccount = function () {
        return this._web3 ? this._web3.eth.defaultAccount : '';
    }; // 获取默认账号
    EthApi.prototype.check = function () {
        if (this.isInitPlugin()) {
            this.error_cbk && this.error_cbk(Base_1.ErrorCode.PluginNotInit);
            return false;
        }
        else if (this.hasAccount()) {
            this.error_cbk && this.error_cbk(Base_1.ErrorCode.AccountNotFound);
            return false;
        }
        else if (!this._netId) {
            this.error_cbk && this.error_cbk(Base_1.ErrorCode.NetNotReady);
            return false;
        }
        return true;
    };
    EthApi.prototype.getBalance = function () {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!self._web3) {
                resolve(0);
                return;
            }
            self._web3.eth.getBalance(_this.defaultAccount(), function (err, result) {
                resolve(err ? 0 : result.toNumber());
            });
        });
    };
    EthApi.prototype.getGasPrice = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!self._web3) {
                resolve(1);
                return;
            }
            self._web3.eth.getGasPrice(function (err, res) {
                resolve(err ? 1 : res.toNumber());
            });
        });
    };
    EthApi.prototype.hexCharCodeToStr = function (hexCharCodeStr) {
        if (!hexCharCodeStr)
            return '';
        var trimedStr = hexCharCodeStr.trim();
        var rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr;
        var len = rawStr.length;
        if (len % 2 !== 0) {
            console.warn('Illegal Format ASCII Code!');
            return '';
        }
        var curCharCode;
        var resultStr = [];
        for (var i = 0; i < len; i = i + 2) {
            curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
            var char = String.fromCharCode(curCharCode);
            if (char !== '\u0000')
                resultStr.push(char);
        }
        return resultStr.join('');
    };
    EthApi.prototype.format2Eth = function (wei) {
        var num = wei ? wei.toNumber() : 0;
        return num / Math.pow(10, 18);
    };
    EthApi.prototype.getTransactionReceiptByHash = function (hash) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!hash) {
                reject();
                return;
            }
            if (!self._web3) {
                reject();
                return;
            }
            self._web3.eth.getTransactionReceipt(hash, function (err, receipt) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(receipt);
                }
            });
        });
    };
    EthApi.prototype.addEvent = function (name, cbk) {
        // todo
    };
    return EthApi;
}(CustomApi_1.CustomApi));
exports.EthApi = EthApi;
//# sourceMappingURL=EthApi.js.map