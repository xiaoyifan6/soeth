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
};
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