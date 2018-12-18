"use strict";
var base;
(function (base) {
    base.SymbolType = {
        eth: 'eth',
        eos: 'eos'
    };
    base.BaseEvent = {
        EVENT_CBK: 'event callback',
        ERROR_CBK: 'error callback',
        ACCOUNT_CHANGED: 'account changed',
        CONTRACT_CBK: 'contract callbact',
        IDENTITY_CBK: 'identity callback'
    };
    base.ErrorCode = {
        PluginNotInit: 1000,
        AccountNotFound: 1001,
        MissIdentity: 1002,
        TranSactionError: 1003,
        NetError: 1004,
        AccountError: 1005,
        NetNotReady: 1006,
        UnknowError: -1
    };
    var Net = (function () {
        function Net(url) {
            this._url = url;
        }
        Object.defineProperty(Net.prototype, "url", {
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Net.prototype, "host", {
            get: function () {
                return this._url.split(':')[1].replace(/\/\//g, '');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Net.prototype, "port", {
            get: function () {
                return parseInt(this._url.split(':')[2] || '443', 10);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Net.prototype, "protocal", {
            get: function () {
                return this._url.split(':')[0];
            },
            enumerable: true,
            configurable: true
        });
        return Net;
    }());
    base.Net = Net;
    var Base = (function () {
        function Base() {
            this._createMap = {};
            this._apiMap = {};
        }
        Base.prototype.generateKey = function (symbol, mode) {
            return symbol + '_' + mode;
        };
        Base.prototype.initSdk = function (symbol, core, config, mode) {
            if (mode === void 0) { mode = ''; }
            var key = this.generateKey(symbol, mode);
            return (this._API = this._apiMap[key] = this._createMap[symbol].generateAPI(core, config, mode));
        };
        Base.prototype.register = function (symbol, creator) {
            this._createMap[symbol] = creator;
        };
        Object.defineProperty(Base.prototype, "API", {
            get: function () {
                return this._API;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Base.prototype, "symbolName", {
            get: function () {
                return this._API === undefined ? '' : this._API.getSymbol();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Base.prototype, "plugin", {
            get: function () {
                return this._API === undefined ? '' : this._API.plugin();
            },
            enumerable: true,
            configurable: true
        });
        Base.prototype.canUse = function (symbol, mode) {
            if (mode === void 0) { mode = ''; }
            var key = this.generateKey(symbol, mode);
            return this._apiMap[key] !== undefined;
        };
        Base.prototype.use = function (symbol, mode) {
            if (mode === void 0) { mode = ''; }
            var key = this.generateKey(symbol, mode);
            return this.canUse(symbol, mode) ? (this._API = this._apiMap[key]) : undefined;
        };
        return Base;
    }());
    base.Base = Base;
})(base || (base = {}));
"use strict";
var base;
(function (base) {
    var CustomApi = (function () {
        function CustomApi(_core, mode) {
            this._mode = mode;
            this._isRunning = false;
            this._tIndex = 0;
            this.event_Map = {};
            this.start();
        }
        Object.defineProperty(CustomApi.prototype, "core", {
            get: function () {
                return this._core;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomApi.prototype, "mode", {
            get: function () {
                return this._mode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomApi.prototype, "isRunning", {
            get: function () {
                return this._isRunning;
            },
            enumerable: true,
            configurable: true
        });
        CustomApi.prototype.addEventListener = function (name, cbk, thisObj) {
            if (this.event_Map[name]) {
                var obj = this.event_Map[name].find(function (v) {
                    return v.event_cbk === cbk && ((v.thisObj && v.thisObj === thisObj) || (!v.thisObj && !thisObj));
                });
                if (obj)
                    return this;
            }
            else {
                this.event_Map[name] = [];
            }
            this.event_Map[name].push({
                event_cbk: cbk,
                thisObj: thisObj
            });
            return this;
        };
        CustomApi.prototype.onError = function (errorCode, detail) {
            this.invorkEvent(base.BaseEvent.ERROR_CBK, {
                errorCode: errorCode,
                detail: detail
            });
            return this;
        };
        CustomApi.prototype.onContract = function (status, detail) {
            this.invorkEvent(base.BaseEvent.CONTRACT_CBK, {
                errorCode: status,
                detail: detail
            });
            return this;
        };
        CustomApi.prototype.invorkEvent = function (name, data) {
            var eventList = this.event_Map[name];
            if (eventList) {
                for (var i = 0; i < eventList.length; i++) {
                    var eventObj = eventList[i];
                    eventObj.event_cbk.apply(eventObj.thisObj || window, [
                        {
                            target: eventObj.thisObj,
                            data: data
                        }
                    ]);
                }
            }
        };
        CustomApi.prototype.removeEventListener = function (name, cbk, thisObj) {
            if (this.event_Map[name]) {
                var obj = this.event_Map[name].find(function (v) {
                    return v.event_cbk === cbk && ((v.thisObj && v.thisObj === thisObj) || (!v.thisObj && !thisObj));
                });
                var index = obj ? this.event_Map[name].indexOf(obj) : -1;
                if (index > -1) {
                    this.event_Map[name].splice(index, 1);
                }
            }
            return this;
        };
        CustomApi.prototype.getMode = function () {
            return this._mode;
        };
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
        CustomApi.prototype.updateStatus = function () {
        };
        return CustomApi;
    }());
    base.CustomApi = CustomApi;
})(base || (base = {}));
"use strict";
"use strict";
var eth;
(function (eth) {
    eth.EthEvent = {
        NET_CHANGED: 'net changed callback'
    };
})(eth || (eth = {}));
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
var eth;
(function (eth) {
    var EthApi = (function (_super) {
        __extends(EthApi, _super);
        function EthApi(core, config, mode) {
            var _this = _super.call(this, core, mode) || this;
            _this._config = config;
            _this._netId = '';
            _this._contractMap = {};
            _this._contractBMap = {};
            var win = window;
            var ethereum = win['ethereum'];
            var _Web3 = core;
            if (ethereum) {
                _this._web3 = new _Web3(ethereum);
                _this.requireIdentity();
            }
            _this._web3_browser = new _Web3(new _Web3.providers.HttpProvider(_this._config.contractURL));
            var contracts = _this._config.contracts instanceof Array ? _this._config.contracts : [_this._config.contracts];
            for (var _i = 0, contracts_1 = contracts; _i < contracts_1.length; _i++) {
                var contract = contracts_1[_i];
                _this._web3 && (_this._contractMap[contract.name] = _this._web3.eth.contract(contract.data).at(contract.address));
                _this._web3_browser &&
                    (_this._contractMap[contract.name] = _this._web3_browser.eth.contract(contract.data).at(contract.address));
            }
            return _this;
        }
        EthApi.prototype.requireIdentity = function () {
            return __awaiter(this, void 0, void 0, function () {
                var win, ethereum, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            win = window;
                            ethereum = win['ethereum'];
                            if (!ethereum)
                                return [2];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, ethereum.enable()];
                        case 2:
                            _a.sent();
                            return [3, 4];
                        case 3:
                            e_1 = _a.sent();
                            this.onError(base.ErrorCode.MissIdentity, e_1);
                            return [3, 4];
                        case 4: return [2];
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
                var _Web3 = this.core;
                if (ethereum) {
                    this._web3 = new _Web3(ethereum);
                    this._web3_browser = new _Web3(new _Web3.providers.HttpProvider(this._config.contractURL));
                    this.requireIdentity();
                }
            }
            var web3 = this._web3;
            if (!web3)
                return;
            web3.version.getNetwork(function (err, netId) {
                if (netId !== _this._netId) {
                    _this.invorkEvent(eth.EthEvent.NET_CHANGED, {
                        netId: netId,
                        oldNetId: _this._netId
                    });
                    _this._netId = netId;
                }
                err && _this.onError(base.ErrorCode.NetError, err);
            });
            web3.eth.getAccounts(function (err, res) {
                if (res.length === 0) {
                    return;
                }
                var account = res[0];
                if (account !== _this._account) {
                    _this.invorkEvent(base.BaseEvent.ACCOUNT_CHANGED, {
                        account: account,
                        oldAccount: _this._account
                    });
                    _this._account = account;
                }
                err && _this.onError(base.ErrorCode.AccountError, err);
            });
        };
        EthApi.prototype.getSymbol = function () {
            return base.SymbolType.eth;
        };
        EthApi.prototype.plugin = function () {
            return 'MateMask';
        };
        EthApi.prototype.usePlugin = function () {
            return true;
        };
        EthApi.prototype.isInitPlugin = function () {
            return this._web3 !== undefined;
        };
        EthApi.prototype.hasAccount = function () {
            return this._account !== undefined;
        };
        EthApi.prototype.defaultAccount = function () {
            return this._web3 ? this._web3.eth.defaultAccount : '';
        };
        EthApi.prototype.check = function () {
            if (this.isInitPlugin()) {
                this.onError(base.ErrorCode.PluginNotInit);
                return false;
            }
            else if (this.hasAccount()) {
                this.onError(base.ErrorCode.AccountNotFound);
                return false;
            }
            else if (!this._netId) {
                this.onError(base.ErrorCode.NetNotReady);
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
            var resultStr = new Array();
            for (var i = 0; i < len; i = i + 2) {
                curCharCode = parseInt(rawStr.substr(i, 2), 16);
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
        };
        return EthApi;
    }(base.CustomApi));
    eth.EthApi = EthApi;
})(eth || (eth = {}));
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
var eos;
(function (eos) {
    eos.EosEvent = {
        MISS_IDENTITY: 'miss identity callback'
    };
    var MultiNet = (function (_super) {
        __extends(MultiNet, _super);
        function MultiNet() {
            var urls = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                urls[_i] = arguments[_i];
            }
            var _this = _super.call(this, urls[0]) || this;
            _this._urls = [];
            for (var i = 0; i < urls.length; i++) {
                _this._urls[i] = { url: urls[i], dt: 0 };
            }
            return _this;
        }
        MultiNet.prototype.sort = function () {
            this._urls.sort(function (a, b) {
                return a.dt - b.dt;
            });
            this._urls.length > 0 && (this._url = this._urls[0].url);
        };
        MultiNet.prototype.recorde = function (dt) {
            if (dt === void 0) { dt = Number.POSITIVE_INFINITY; }
            var a = this._urls[0];
            a && (a.dt = dt) && this.sort();
        };
        return MultiNet;
    }(base.Net));
    var EOSConfig = (function () {
        function EOSConfig(setting) {
            this._setting = setting;
            this._nets = new (MultiNet.bind.apply(MultiNet, [void 0].concat((typeof this._setting.nets === 'string' ? [this._setting.nets] : this._setting.nets))))();
        }
        Object.defineProperty(EOSConfig.prototype, "setting", {
            get: function () {
                return this._setting;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EOSConfig.prototype, "url", {
            get: function () {
                return this._nets.url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EOSConfig.prototype, "httpEndpoint", {
            get: function () {
                return this._nets.url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EOSConfig.prototype, "host", {
            get: function () {
                return this._nets.host;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EOSConfig.prototype, "port", {
            get: function () {
                return this._nets.port;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EOSConfig.prototype, "protocal", {
            get: function () {
                return this._nets.protocal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EOSConfig.prototype, "privateKey", {
            get: function () {
                return this._setting.privateKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EOSConfig.prototype, "defaultContract", {
            get: function () {
                return this._setting.defaultContract;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EOSConfig.prototype, "chainId", {
            get: function () {
                return this._setting.chainId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EOSConfig.prototype, "eosNetwork", {
            get: function () {
                return {
                    blockchain: 'eos',
                    host: this._nets.host,
                    port: this._nets.port,
                    protocol: this._nets.protocal,
                    chainId: this._setting.chainId
                };
            },
            enumerable: true,
            configurable: true
        });
        return EOSConfig;
    }());
    eos.EOSConfig = EOSConfig;
})(eos || (eos = {}));
"use strict";
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
var eos;
(function (eos_1) {
    var EosApi = (function (_super) {
        __extends(EosApi, _super);
        function EosApi(core, config, mode) {
            var _this = _super.call(this, core, mode) || this;
            _this._config = new eos_1.EOSConfig(config);
            var win = window;
            _this._scatter = win['scatter'];
            if (_this._scatter) {
                _this._scatter.requireVersion(3.0);
                _this._eos = _this._scatter.eos(_this._config.eosNetwork, core, {}, _this._config.protocal);
            }
            else {
                _this._eos = undefined;
            }
            return _this;
        }
        EosApi.prototype.formatEos = function (value) {
            return parseFloat(value);
        };
        Object.defineProperty(EosApi.prototype, "eos", {
            get: function () {
                return this._eos;
            },
            enumerable: true,
            configurable: true
        });
        EosApi.prototype.getSymbol = function () {
            return base.SymbolType.eos;
        };
        EosApi.prototype.plugin = function () {
            return 'Scatter';
        };
        EosApi.prototype.usePlugin = function () {
            return true;
        };
        EosApi.prototype.isInitPlugin = function () {
            return this._eos !== undefined;
        };
        EosApi.prototype.hasAccount = function () {
            return this._account !== undefined;
        };
        EosApi.prototype.defaultAccount = function () {
            return this._account ? this._account.name : '';
        };
        EosApi.prototype.check = function () {
            if (this.isInitPlugin()) {
                this.onError(base.ErrorCode.PluginNotInit);
                return false;
            }
            else if (this.hasAccount()) {
                this.onError(base.ErrorCode.AccountNotFound);
                return false;
            }
            else if (!this.identity) {
                this.onError(base.ErrorCode.MissIdentity);
                this.invorkEvent(eos_1.EosEvent.MISS_IDENTITY, {});
                return false;
            }
            return true;
        };
        Object.defineProperty(EosApi.prototype, "identity", {
            get: function () {
                return this._scatter ? this._scatter.identity : undefined;
            },
            enumerable: true,
            configurable: true
        });
        EosApi.prototype.addEvent = function (name, cbk) {
        };
        EosApi.prototype.forgetIdentity = function () {
            this._scatter && this._scatter.forgetIdentity();
        };
        EosApi.prototype.updateStatus = function () {
            _super.prototype.updateStatus.call(this);
            var win = window;
            if (!this._scatter) {
                win['scatter'] && (this._scatter = win['scatter']);
                if (this._scatter) {
                    this._scatter.requireVersion(3.0);
                    this._eos = this._scatter.eos(this._config.eosNetwork, this.core, {}, this._config.protocal);
                }
            }
            if (this.identity) {
                var name_1 = this.defaultAccount();
                this._account = this.identity.accounts.find(function (accound) {
                    return accound.blockchain === 'eos';
                });
                if (name_1 !== this.defaultAccount()) {
                    this.invorkEvent(base.BaseEvent.ACCOUNT_CHANGED, {
                        account: this.defaultAccount(),
                        oldAccount: name_1
                    });
                }
            }
        };
        EosApi.prototype.encode = function (value) {
            return this.core.modules.format.encodeName(value, false);
        };
        EosApi.prototype.decode = function (value) {
            return this.core.modules.format.decodeName(value.toString(), false);
        };
        EosApi.prototype.requireIdentity = function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this._scatter) {
                                this.onError(base.ErrorCode.PluginNotInit);
                                throw { errorCode: base.ErrorCode.PluginNotInit };
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this._scatter.getIdentity({ accounts: [this._config.eosNetwork] })];
                        case 2:
                            res = _a.sent();
                            if (res) {
                                this._account = res.accounts.find(function (accound) {
                                    return accound.blockchain === 'eos';
                                });
                                return [2, res];
                            }
                            else {
                                this.onError(base.ErrorCode.AccountNotFound);
                                throw { errorCode: base.ErrorCode.AccountNotFound };
                            }
                            return [3, 4];
                        case 3:
                            e_1 = _a.sent();
                            throw e_1;
                        case 4: return [2];
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
                                return [2, 0];
                            return [4, eos.getCurrencyBalance('eosio.token', this.defaultAccount(), this.getSymbol().toUpperCase())];
                        case 1:
                            res = _a.sent();
                            return [2, res && res.length > 0 ? parseFloat(res[0]) : 0];
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
            if (memo === void 0) { memo = ''; }
            var eos = this.eos;
            if (!eos)
                return undefined;
            return eos.transaction({
                actions: [
                    {
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [
                            {
                                actor: account.name,
                                permission: account.authority
                            }
                        ],
                        data: {
                            from: account.name,
                            to: to,
                            quantity: currency,
                            memo: memo
                        }
                    }
                ]
            }, { broadcast: true, sign: true });
        };
        EosApi.prototype.getAuthorization = function () {
            var account = this._account;
            return account ? account.name + "@" + account.authority : '';
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
                                return [2, undefined];
                            options = {
                                authorization: typeof authorization === 'string' ? [authorization] : authorization
                            };
                            return [4, eos.contract(contractName)];
                        case 1:
                            contract = _a.sent();
                            if (!contract)
                                return [2, undefined];
                            return [4, contract[actionName].apply(window, param.concat(options))];
                        case 2:
                            res = _a.sent();
                            return [2, res];
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
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            res = undefined;
                            if (!this._config.defaultContract) return [3, 2];
                            return [4, this.doAction.apply(this, [this._config.defaultContract, actionName, this.getAuthorization()].concat(param))];
                        case 1:
                            res = _a.sent();
                            _a.label = 2;
                        case 2: return [2, res];
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
                                    return [2, { rows: [], more: false }];
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
                            limit && (param['limit'] = limit);
                            table_key && (param['table_key'] = table_key);
                            if (!this.eos)
                                return [2, { rows: [], more: false }];
                            return [4, this.eos.getTableRows(param)];
                        case 2: return [2, _a.sent()];
                        case 3:
                            e_2 = _a.sent();
                            throw e_2;
                        case 4: return [2];
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
                                    return [2, []];
                                contractName = this._config.defaultContract;
                            }
                            if (!scope)
                                return [2, []];
                            result = new Array();
                            limit = 10;
                            lower_bound = 0;
                            _a.label = 1;
                        case 1:
                            if (!true) return [3, 3];
                            return [4, this.getTableRows(tableName, scope.toString(), contractName, limit, lower_bound, table_key)];
                        case 2:
                            data = _a.sent();
                            if (!data)
                                return [3, 3];
                            if (data.rows && data.rows.length > 0) {
                                for (i = 0; i < data.rows.length; i++) {
                                    result.push(data.rows[i]);
                                }
                                lower_bound += data.rows.length;
                                if (!data.more)
                                    return [3, 3];
                            }
                            else {
                                return [3, 3];
                            }
                            return [3, 1];
                        case 3: return [2, result];
                    }
                });
            });
        };
        EosApi.prototype.getGlobalData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.getTableRows('eosio', 'global', 'eosio')];
                        case 1:
                            res = _a.sent();
                            if (res && res.rows && res.rows.length > 0)
                                return [2, res.rows[0]];
                            return [2, null];
                    }
                });
            });
        };
        EosApi.prototype.getRamPrice = function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.getTableRows('eosio', 'rammarket', 'eosio')];
                        case 1:
                            res = _a.sent();
                            if (res && res.rows && res.rows.length > 0) {
                                return [2, (this.formatEos(res.rows[0].quote.balance) / this.formatEos(res.rows[0].base.balance)) * 1024];
                            }
                            return [2, 0];
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
                            this.onContract(0);
                            return [4, this.doAction('eosio', 'buyrambytes', this.defaultAccount(), this.defaultAccount(), ramAmount)];
                        case 1:
                            res = _a.sent();
                            this.onContract(1, res);
                            return [2, res];
                        case 2:
                            e_3 = _a.sent();
                            this.handleError(e_3);
                            throw e_3;
                        case 3:
                            this.onContract(3);
                            return [7];
                        case 4: return [2];
                    }
                });
            });
        };
        EosApi.prototype.getNetCpuPrice = function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, netPrice, cpuPrice, netBalance, netTotal, cpuBalance, cpuTotal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.getAccountInfo()];
                        case 1:
                            res = _a.sent();
                            netPrice = 0;
                            cpuPrice = 0;
                            if (res) {
                                netBalance = res.net_weight / 10000;
                                netTotal = res.net_limit.max / 1024;
                                netPrice = netBalance / netTotal / 3;
                                console.log(netBalance, netTotal, netPrice);
                                cpuBalance = res.cpu_weight / 10000;
                                cpuTotal = res.cpu_limit.max / 1024;
                                cpuPrice = cpuBalance / cpuTotal / 3;
                            }
                            return [2, {
                                    netPrice: netPrice,
                                    cpuPrice: cpuPrice
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
                            this.onContract(0);
                            return [4, this.doAction('eosio', 'sellram', this.defaultAccount(), ramAmount)];
                        case 1:
                            res = _a.sent();
                            this.onContract(1, res);
                            return [2, res];
                        case 2:
                            e_4 = _a.sent();
                            this.handleError(e_4);
                            throw e_4;
                        case 3:
                            this.onContract(3);
                            return [7];
                        case 4: return [2];
                    }
                });
            });
        };
        EosApi.prototype.delegatebw = function (net_amount, cpu_amount) {
            return __awaiter(this, void 0, void 0, function () {
                var res, e_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            this.onContract(0);
                            return [4, this.doAction('eosio', 'delegatebw', this.defaultAccount(), this.defaultAccount(), net_amount.toFixed(4) + " EOS", cpu_amount.toFixed(4) + " EOS", 0)];
                        case 1:
                            res = _a.sent();
                            this.onContract(1, res);
                            return [2, res];
                        case 2:
                            e_5 = _a.sent();
                            this.handleError(e_5);
                            throw e_5;
                        case 3:
                            this.onContract(3);
                            return [7];
                        case 4: return [2];
                    }
                });
            });
        };
        EosApi.prototype.undelegatebw = function (net_amount, cpu_amount) {
            return __awaiter(this, void 0, void 0, function () {
                var res, e_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            this.onContract(0);
                            return [4, this.doAction('eosio', 'undelegatebw', this.defaultAccount(), this.defaultAccount(), net_amount.toFixed(4) + " EOS", cpu_amount.toFixed(4) + " EOS")];
                        case 1:
                            res = _a.sent();
                            this.onContract(1, res);
                            return [2, res];
                        case 2:
                            e_6 = _a.sent();
                            this.handleError(e_6);
                            throw e_6;
                        case 3:
                            this.onContract(3);
                            return [7];
                        case 4: return [2];
                    }
                });
            });
        };
        EosApi.prototype.handleError = function (e) {
            if (!e)
                return;
            if (typeof e === 'string') {
                try {
                    var obj = JSON.parse(e);
                    typeof obj === 'object' && obj && (e = obj);
                }
                catch (e) {
                }
            }
            e.error && e.error.details
                ? this.onError(base.ErrorCode.TranSactionError, e)
                : this.onError(base.ErrorCode.UnknowError, e);
        };
        return EosApi;
    }(base.CustomApi));
    eos_1.EosApi = EosApi;
})(eos || (eos = {}));
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _base = new base.Base();
_base.register(base.SymbolType.eos, new (function () {
    function class_1() {
    }
    class_1.prototype.generateAPI = function (core, config, mode) {
        return new eos.EosApi(core, config, mode);
    };
    return class_1;
}())());
_base.register(base.SymbolType.eth, new (function () {
    function class_2() {
    }
    class_2.prototype.generateAPI = function (core, config, mode) {
        return new eth.EthApi(core, config, mode);
    };
    return class_2;
}())());
exports.soeth = _base;
exports.API = _base.API;
