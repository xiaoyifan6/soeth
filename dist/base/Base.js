"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolType = {
    eth: "eth",
    eos: "eos"
};
exports.ErrorCode = {
    PluginNotInit: 1000,
    AccountNotFound: 1001,
    MissIdentity: 1002,
    TranSactionError: 1003,
    NetError: 1004,
    AccountError: 1005,
    NetNotReady: 1006,
    UnknowError: -1
};
var Net = /** @class */ (function () {
    function Net(url) {
        this._url = url;
    }
    Object.defineProperty(Net.prototype, "url", {
        get: function () { return this._url; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Net.prototype, "host", {
        get: function () { return this._url.split(":")[1].replace(/\/\//g, ""); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Net.prototype, "port", {
        get: function () { return parseInt(this._url.split(":")[2] || "443"); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Net.prototype, "protocal", {
        get: function () { return this._url.split(":")[0]; },
        enumerable: true,
        configurable: true
    });
    return Net;
}());
exports.Net = Net;
var Base = /** @class */ (function () {
    function Base() {
        this._createMap = {};
        this._apiMap = {};
    }
    Base.prototype.generateKey = function (symbol, mode) {
        return symbol + "_" + mode;
    };
    Base.prototype.initSdk = function (symbol, config, mode) {
        if (mode === void 0) { mode = ""; }
        var key = this.generateKey(symbol, mode);
        return this._API = this._apiMap[key] = this._createMap[symbol].generateAPI(config, mode);
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
            return this._API == undefined ? "" : this._API.getSymbol();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "plugin", {
        get: function () {
            return this._API == undefined ? "" : this._API.plugin();
        },
        enumerable: true,
        configurable: true
    });
    Base.prototype.canUse = function (symbol, mode) {
        if (mode === void 0) { mode = ""; }
        var key = this.generateKey(symbol, mode);
        return this._apiMap[key] != undefined;
    };
    Base.prototype.use = function (symbol, mode) {
        if (mode === void 0) { mode = ""; }
        var key = this.generateKey(symbol, mode);
        return this.canUse(symbol, mode) ? (this._API = this._apiMap[key]) : undefined;
    };
    return Base;
}());
exports.sdk = new Base();
//# sourceMappingURL=Base.js.map