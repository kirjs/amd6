(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "rxjs"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var rxjs_1 = require("rxjs");
    var x = new rxjs_1.BehaviorSubject('lol');
});
