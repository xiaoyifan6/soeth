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
var MultiNet = /** @class */ (function (_super) {
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
}(Base_1.Net));
var EOSConfig = /** @class */ (function () {
    function EOSConfig(setting) {
        this._setting = setting;
        this._nets = new (MultiNet.bind.apply(MultiNet, [void 0].concat((typeof this._setting.nets == "string" ? [this._setting.nets] : this._setting.nets))))();
    }
    Object.defineProperty(EOSConfig.prototype, "setting", {
        get: function () {
            return this._setting;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EOSConfig.prototype, "url", {
        get: function () { return this._nets.url; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EOSConfig.prototype, "httpEndpoint", {
        get: function () { return this._nets.url; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EOSConfig.prototype, "host", {
        get: function () { return this._nets.host; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EOSConfig.prototype, "port", {
        get: function () { return this._nets.port; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EOSConfig.prototype, "protocal", {
        get: function () { return this._nets.protocal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EOSConfig.prototype, "privateKey", {
        get: function () { return this._setting.privateKey; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EOSConfig.prototype, "defaultContract", {
        get: function () { return this._setting.defaultContract; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EOSConfig.prototype, "chainId", {
        get: function () { return this._setting.chainId; },
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
exports.EOSConfig = EOSConfig;
//# sourceMappingURL=Base.js.map