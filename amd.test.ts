import { AMDLoader } from "./amd";
import {
  getCounter,
  registerA,
  registerAltSimpleDep,
  registerB,
  registerBox,
  registerC,
  registerDep,
  umdExample
} from "./data";
import { readFileSync } from "fs";
import {
    registerChildComponent,
    registerComponentA,
    registerComponentB,
    registerIndex,
    registerUtils
} from './relative-import-data';
import {isObservable} from 'rxjs';


function createFakeFetcher() {
  const fakes: Record<string, Promise<string>> = {};

  function fetcher(url: string) {
    if (!fakes[url]) {
      throw new Error('fake does not exist: ' + url);
    }

    return fakes[url];
  }

  fetcher.set = (url: string, value: string) => {
    fakes[url] = Promise.resolve(value);
  }

  return fetcher;
}


describe('Loader', function () {
  function setup() {
    const fetcher = createFakeFetcher();
    const result = AMDLoader({}, fetcher);

    function createFakeFetchableDef(name: string, code: string) {
      fetcher.set('https://piro.jok/' + name, code);
      result.System.addImportMap({imports: {'depA': 'https://piro.jok/' + name}});
    }

    return {
      ...result,
      fetcher,
      createFakeFetchableDef,
    };
  }

  it('exports define and System', () => {
    const l = setup();
    expect(l.System.register).toEqual(expect.any(Function));
  });

  it('allows to register a module', async () => {
    const {System} = setup();
    registerA(System);

    const p = await System.import('depA');

    expect(p.func()).toBe(123);
  });

  it('picks up exports from execute function', async () => {
    const {System} = setup();
    registerA(System);

    const p = await System.import('depA');

    expect(p.exportedValue).toBe(20);
  });

  it('picks up exports from execute function deps', async () => {
    const {System} = setup();
    registerA(System);
    registerB(System);

    const p = await System.import('depB');

    expect(p.reExportedValue).toBe(21);
  });

  it('allows re-adding modules', async () => {
    const {System} = setup();
    registerA(System);
    await System.import('depA');
    registerAltSimpleDep(System);
    const p = await System.import('depA');
    expect(p.value).toBe('alt-value');
  });

  it('picks up a single dependency', async () => {
    const {System} = setup();
    registerA(System);
    registerB(System);
    const p = await System.import('depB');
    expect(p.reExportedValue).toBe(21)
  });


  it('resolved async deps, in execute phase', async () => {
    const {System, createFakeFetchableDef} = setup();

    createFakeFetchableDef('depA', umdExample);
    registerDep(System);
    registerB(System);

    const p = await System.import('depB');
    expect(p.reExportedValue).toBe(11);
  });

  it('works with Angular', async () => {
    const {System, fetcher} = setup();
    fetcher.set('https://angul.ar/common', readFileSync('./bundles/angular-common.js', 'utf-8'));
    fetcher.set('https://angul.ar/core', readFileSync('./bundles/angular-core.js', 'utf-8'));
    fetcher.set('https://angul.ar/rxjs', readFileSync('./bundles/rxjs.js', 'utf-8'));
    fetcher.set('https://angul.ar/rxjs-operators', readFileSync('./bundles/rxjs-operators.js', 'utf-8'));
    System.addImportMap({
      imports: {
        '@angular/common': 'https://angul.ar/common',
        '@angular/core': 'https://angul.ar/core',
        'rxjs': 'https://angul.ar/rxjs',
        'rxjs/operators': 'https://angul.ar/rxjs-operators'
      }
    });

    registerBox(System);
    const p = await System.import('box.component');
    expect(p.BoxComponent).toStrictEqual(expect.any(Function));
  });


  it('does not refetch the same module twice', async () => {
    const {System, fetcher, createFakeFetchableDef} = setup();
    const {code, getCount, cleanUp} = getCounter('counter');
    createFakeFetchableDef('depA', code);

    registerB(System);
    registerC(System);

    await System.import('depС');
    expect(getCount()).toBe(1);
    cleanUp();
  });

  it('resolve relative deps', async () => {
    const {System, fetcher} = setup();
    fetcher.set('https://angul.ar/rxjs', readFileSync('./bundles/rxjs.js', 'utf-8'));
    System.addImportMap({
        imports: {
            'rxjs': 'https://angul.ar/rxjs',
        }
    });

    registerIndex(System);
    registerComponentA(System);
    registerComponentB(System);
    registerChildComponent(System);
    registerUtils(System);

    const componentAWrapper = await System.import('componentA');
    expect(componentAWrapper.ComponentA).toStrictEqual(expect.any(Function));

    const componentBWrapper = await System.import('componentB');
    expect(componentBWrapper.ComponentB).toStrictEqual(expect.any(Function));

    const componentB = new componentBWrapper.ComponentB();

    expect(isObservable(componentB.stream$)).toBe(true);

    const childComponentWrapper = await System.import('child-component');
    expect(childComponentWrapper.ChildComponent).toStrictEqual(expect.any(Function));

    const childComponent = new childComponentWrapper.ChildComponent()
    expect(childComponent.utilsValue).toBe('123');

    const utilsWrapper = await System.import('utils');
    expect(utilsWrapper.utils).toBe('123');
  })
});
