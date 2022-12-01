// @ts-nocheck
import { System as SystemType } from "./amd";


export function registerA(System: SystemType) {
  System.register('depA', [], function ($__export, $__moduleContext) {
    $__export('func', function func() {
      return 123;
    });

    return {
      setters: [],
      execute: function () {
        $__export('exportedValue', 20);
      }
    };
  });
}

export function registerB(System: SystemType) {
  System.register('depB', ['./depA'], function ($__export, $__moduleContext) {
    let depA: any;

    return {
      setters: [function (p: any) {
        depA = p;
      }],
      execute: function () {
        $__export('reExportedValue', depA.exportedValue + 1);
      }
    };
  });
}

export function registerC(System: SystemType) {
  System.register('depС', ['./depB', './depA'], function ($__export, $__moduleContext) {
    let depA: any;

    return {
      setters: [function (p: any) {

      },function (p: any) {
        depA = p;
      }],
      execute: function () {
        $__export('reExportedValue', depA.exportedValue + 1);
      }
    };
  });
}


export function registerDep(System: SystemType) {
  System.register('dep', [], function ($__export, $__moduleContext) {
    $__export('v', 123);
    return {
      setters: [],
      execute: function () {
      }
    };
  });
}


export function registerAltSimpleDep(System: SystemType) {
  System.register('depA', [], function ($__export, $__moduleContext) {
    $__export('value', 'alt-value');
    $__export('exportedValue', 'alt-value');
    return {
      setters: [],
      execute: function () {
      }
    };
  });
}

// ts
export function registerBox(System: SystemType) {
  System.register("box.component", ["@angular/core"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
      var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var core_1, BoxComponent;
    var __moduleName = context_1 && context_1.id;

    function evalJs(js) {
      return eval(js);
    }

    exports_1("evalJs", evalJs);
    return {
      setters: [
        function (core_1_1) {
          core_1 = core_1_1;
        }
      ],
      execute: function () {
        BoxComponent = class BoxComponent {
          constructor() {
            this.circleColor = "green";
          }
        };
        BoxComponent = __decorate([
          core_1.Component({
            selector: 'my-app',
            template: `<div><slides-circle
      [size]="5"
      [color]="circleColor"></slides-circle></div>`
          })
        ], BoxComponent);
        exports_1("BoxComponent", BoxComponent);
      }
    };
  });

}

export const umdExample = `
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('dep'));
    } else {
        // Browser globals
        factory((root.myModuleName = {}), root.dep);
    }
}(typeof self !== 'undefined' ? self : this, function (exports, b) {
    // Use b in some fashion.

    // attach properties to the exports object to define
    // the exported module properties.
    exports.func = function () {};
    exports.exportedValue = 10;
}));
`


export const getCounter = (id) => {
  const globalName = '___count_' + id;
  global[globalName] = 0;

  const getCount = () => {
    return global[globalName];
  }

  const cleanUp = () => {
    delete global[globalName];
  }
  const code = `
  (function (root, factory) {
          define(['exports'], factory);
  }(typeof self !== 'undefined' ? self : this, function (exports) {            
      global['${globalName}']++;
  }));
  `;
  return {
    code,
    getCount,
    cleanUp,
  };
}
