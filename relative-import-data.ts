// @ts-nocheck
import { System as SystemType } from "./amd";

export function registerComponentA(System: SystemType) {
  System.register('componentA', ["../componentB/componentB"], function (exports_1, context_1) {
    "use strict";
    var componentB_1, ComponentA;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (componentB_1_1) {
                componentB_1 = componentB_1_1;
            }
        ],
        execute: function () {
            ComponentA = class ComponentA {
                constructor() {
                    this.type = 'root';
                    this.relative = new componentB_1.ComponentB();
                }
            };
            exports_1("ComponentA", ComponentA);
        }
    };
});

}
export function registerChildComponent(System: SystemType) {
  System.register('child-component', ["./utils"], function (exports_1, context_1) {
    "use strict";
    var utils_1, ChildComponent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            ChildComponent = class ChildComponent {
                constructor() {
                    this.type = 'child';
                    this.utilsValue = utils_1.utils;
                }
            };
            exports_1("ChildComponent", ChildComponent);
        }
    };
});

}
export function registerUtils(System: SystemType) {
  System.register('utils', [], function (exports_1, context_1) {
    "use strict";
    var utils;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("utils", utils = '123');
        }
    };
});

}
export function registerComponentB(System: SystemType) {
  System.register('componentB', ["./child/child-component", "rxjs"], function (exports_1, context_1) {
    "use strict";
    var child_component_1, rxjs_1, ComponentB;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (child_component_1_1) {
                child_component_1 = child_component_1_1;
            },
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            }
        ],
        execute: function () {
            ComponentB = class ComponentB {
                constructor() {
                    this.type = 'root';
                    this.child = new child_component_1.ChildComponent();
                    this.stream$ = rxjs_1.of([]);
                }
            };
            exports_1("ComponentB", ComponentB);
        }
    };
});

}
export function registerIndex(System: SystemType) {
  System.register('index', ["./componentA/componentA"], function (exports_1, context_1) {
    "use strict";
    var componentA_1, main;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (componentA_1_1) {
                componentA_1 = componentA_1_1;
            }
        ],
        execute: function () {
            exports_1("main", main = new componentA_1.ComponentA());
        }
    };
});

}
