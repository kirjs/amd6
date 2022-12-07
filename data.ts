// @ts-nocheck
import { System as SystemType } from "./amd";


export function registerA(System: SystemType) {
  System.register('./depA', [], function ($__export, $__moduleContext) {
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
  System.register('./depB', ['./depA'], function ($__export, $__moduleContext) {
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
  System.register('depD', ['depA'], function ($__export, $__moduleContext) {
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

export function registerD(System: SystemType) {
  System.register('./depE', ['./depB', 'depA'], function ($__export, $__moduleContext) {
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

export function registerE(System: SystemType) {
  System.register('./depB', ['depA'], function ($__export, $__moduleContext) {
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
  System.register('./depA', [], function ($__export, $__moduleContext) {
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
  System.register("./box.component", ["@angular/core"], function (exports_1, context_1) {
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

export function registerAngularApp(System: SystemType) {
  /// <amd-module name="./app/app.component" />
  System.register("./app/app.component", ["tslib", "@angular/core", "@angular/forms", "@angular/common", "./app/test/child.component", "./app/child.component"], function (exports_1, context_1) {
    "use strict";
    var tslib_1, core_1, forms_1, common_1, child_component_1, child_component_2, AppComponent;
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [
        function (tslib_1_1) {
          tslib_1 = tslib_1_1;
        },
        function (core_1_1) {
          core_1 = core_1_1;
        },
        function (forms_1_1) {
          forms_1 = forms_1_1;
        },
        function (common_1_1) {
          common_1 = common_1_1;
        },
        function (child_component_1_1) {
          child_component_1 = child_component_1_1;
        },
        function (child_component_2_1) {
          child_component_2 = child_component_2_1;
        }
      ],
      execute: function () {
        AppComponent = /** @class */ (function () {
          function AppComponent() {
            this.title = 'sandbox';
            this.control = new forms_1.FormControl('', { nonNullable: true });
          }
          AppComponent = tslib_1.__decorate([
            core_1.Component({
              selector: 'app-root',
              standalone: true,
              imports: [common_1.AsyncPipe, forms_1.ReactiveFormsModule, child_component_1.Child2Component, child_component_2.ChildComponent],
              template: "\n    {{title}}\n\n    <div class=\"wrapper\">\n      Color: <input type=\"color\" [formControl]=\"control\">\n\n      <app-child [color]=\"control.valueChanges | async\"></app-child>\n      <app-child2 [color]=\"control.valueChanges | async\"></app-child2>\n    </div>\n\n  ",
              styles: ["\n    .wrapper {\n    display: flex;\n      align-items: flex-start;\n      justify-content: flex-start;\n  }\n  "],
              changeDetection: core_1.ChangeDetectionStrategy.OnPush
            })
          ], AppComponent);
          return AppComponent;
        }());
        exports_1("AppComponent", AppComponent);
      }
    };
  });

  /// <amd-module name="./app/child.component" />
  System.register("./app/child.component", ["tslib", "@angular/core"], function (exports_1, context_1) {
    "use strict";
    var tslib_1, core_1, ChildComponent;
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [
        function (tslib_1_1) {
          tslib_1 = tslib_1_1;
        },
        function (core_1_1) {
          core_1 = core_1_1;
        }
      ],
      execute: function () {
        ChildComponent = /** @class */ (function () {
          function ChildComponent() {
          }
          tslib_1.__decorate([
            core_1.Input(),
            core_1.HostBinding('style.--bg')
          ], ChildComponent.prototype, "color", void 0);
          ChildComponent = tslib_1.__decorate([
            core_1.Component({
              selector: 'app-child',
              standalone: true,
              template: "\n    <div class=\"square\">\n      Child 1\n    </div>\n  ",
              styles: ["\n  .square {\n    background: var(--bg);\n    height: 100px;\n    width: 200px;\n    border: 1px dashed red;\n  }\n  "],
              changeDetection: core_1.ChangeDetectionStrategy.OnPush
            })
          ], ChildComponent);
          return ChildComponent;
        }());
        exports_1("ChildComponent", ChildComponent);
      }
    };
  });

  /// <amd-module name="./app/test/child.component" />
  System.register("./app/test/child.component", ["tslib", "@angular/core"], function (exports_1, context_1) {
    "use strict";
    var tslib_1, core_1, Child2Component;
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [
        function (tslib_1_1) {
          tslib_1 = tslib_1_1;
        },
        function (core_1_1) {
          core_1 = core_1_1;
        }
      ],
      execute: function () {
        Child2Component = /** @class */ (function () {
          function Child2Component() {
          }
          tslib_1.__decorate([
            core_1.Input(),
            core_1.HostBinding('style.--bg')
          ], Child2Component.prototype, "color", void 0);
          Child2Component = tslib_1.__decorate([
            core_1.Component({
              selector: 'app-child2',
              standalone: true,
              template: "\n    <div class=\"square2\">\n      Child 2\n    </div>\n  ",
              styles: ["\n  .square2 {\n    border: 1px solid green;\n    background: var(--bg);\n    height: 100px;\n    width: 200px;\n\n  }\n  "],
              changeDetection: core_1.ChangeDetectionStrategy.OnPush
            })
          ], Child2Component);
          return Child2Component;
        }());
        exports_1("Child2Component", Child2Component);
      }
    };
  });

  /// <amd-module name="main" />
  System.register("main", ["@angular/platform-browser", "./app/app.component", "@angular/compiler", "@angular/core"], function (exports_1, context_1) {
    "use strict";
    var platform_browser_1, app_component_1, core_1;
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [
        function (platform_browser_1_1) {
          platform_browser_1 = platform_browser_1_1;
        },
        function (app_component_1_1) {
          app_component_1 = app_component_1_1;
        },
        function (_1) {
        },
        function (core_1_1) {
          core_1 = core_1_1;
        }
      ],
      execute: function () {
        platform_browser_1.bootstrapApplication(app_component_1.AppComponent, {
          providers: [
            {
              provide: core_1.NgZone,
              useValue: {}
            }
          ]
        });
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
