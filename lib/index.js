"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Base_1 = require("./base/Base");
var EthApi_1 = require("./eth/EthApi");
var EosApi_1 = require("./eos/EosApi");
var base = new Base_1.Base();
base.register(Base_1.SymbolType.eos, new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.generateAPI = function (config, mode) {
        return new EosApi_1.EosApi(config, mode);
    };
    return class_1;
}())());
base.register(Base_1.SymbolType.eth, new /** @class */ (function () {
    function class_2() {
    }
    class_2.prototype.generateAPI = function (config, mode) {
        return new EthApi_1.EthApi(config, mode);
    };
    return class_2;
}())());
exports.soeth = base;
exports.API = base.API;
//# sourceMappingURL=index.js.map