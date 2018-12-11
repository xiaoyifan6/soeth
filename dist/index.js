"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SoethAPI = /** @class */ (function () {
    function SoethAPI(config) {
        this._config = config;
    }
    Object.defineProperty(SoethAPI.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    SoethAPI.prototype.helloWorld = function () {
        console.log("hello world");
    };
    return SoethAPI;
}());
exports.SoethAPI = SoethAPI;
//# sourceMappingURL=index.js.map