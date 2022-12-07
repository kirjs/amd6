import { AMDLoader } from "./amd";
import {
  getCounter,
  registerA,
  registerAltSimpleDep, registerAngularApp,
  registerB,
  registerBox,
  registerC,
  registerDep, registerD, registerE,
  umdExample
} from "./data";
import { readFileSync } from "fs";

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


  function createFakeAngularAppSystem() {
    const {System, fetcher} = setup();

    const baseUrl = 'https://angul.ar'

    const bundles = {
      "@angular/core": `${baseUrl}/bundles/angular-core.js`,
      "@angular/platform-browser": `${baseUrl}/bundles/angular-platform-browser.js`,
      "@angular/platform-browser-dynamic": `${baseUrl}/bundles/angular-platform-browser-dynamic.js`,
      "@angular/compiler": `${baseUrl}/bundles/angular-compiler.js`,
      "@angular/forms": `${baseUrl}/bundles/angular-forms.js`,
      "@angular/common": `${baseUrl}/bundles/angular-common.js`,
      "rxjs": `${baseUrl}/bundles/rxjs.js`,
      "rxjs/operators": `${baseUrl}/bundles/rxjs-operators.js`,
      "tslib": `${baseUrl}/bundles/tslib.js`,
    };

    Object.values(bundles).forEach(path => {
      fetcher.set(path, readFileSync(path.replace(baseUrl, '.'), 'utf-8'));
    })

    System.addImportMap({imports: bundles});

    return System;
  }

  it('exports define and System', () => {
    const l = setup();
    expect(l.System.register).toEqual(expect.any(Function));
  });

  it('allows to register a module', async () => {
    const {System} = setup();
    registerA(System);

    const p = await System.import('./depA');

    expect(p.func()).toBe(123);
  });

  it('picks up exports from execute function', async () => {
    const {System} = setup();
    registerA(System);

    const p = await System.import('./depA');

    expect(p.exportedValue).toBe(20);
  });

  it('picks up exports from execute function deps', async () => {
    const {System} = setup();
    registerA(System);
    registerB(System);

    const p = await System.import('./depB');

    expect(p.reExportedValue).toBe(21);
  });

  it('allows re-adding modules', async () => {
    const {System} = setup();
    registerA(System);
    await System.import('./depA');
    registerAltSimpleDep(System);
    const p = await System.import('./depA');
    expect(p.value).toBe('alt-value');
  });

  it('picks up a single dependency', async () => {
    const {System} = setup();
    registerA(System);
    registerB(System);
    const p = await System.import('./depB');
    expect(p.reExportedValue).toBe(21)
  });


  it('resolved async deps, in execute phase', async () => {
    const {System, createFakeFetchableDef} = setup();

    createFakeFetchableDef('depA', umdExample);
    registerDep(System);
    registerC(System);

    const p = await System.import('depD');
    expect(p.reExportedValue).toBe(11);
  });

  it('works with Angular', async () => {
    const {System, fetcher} = setup();
    fetcher.set('https://angul.ar/common', readFileSync('./bundles/angular-common.js', 'utf-8'));
    fetcher.set('https://angul.ar/core', readFileSync('./bundles/angular-core.js', 'utf-8'));
    fetcher.set('https://angul.ar/rxjs', readFileSync('./bundles/rxjs.js', 'utf-8'));
    fetcher.set('https://angul.ar/rxjs-operators', readFileSync('./bundles/rxjs-operators.js', 'utf-8'));
    fetcher.set('https://angul.ar/tslib', readFileSync('./bundles/tslib.js', 'utf-8'));
    System.addImportMap({
      imports: {
        '@angular/common': 'https://angul.ar/common',
        '@angular/core': 'https://angul.ar/core',
        'rxjs': 'https://angul.ar/rxjs',
        'rxjs/operators': 'https://angul.ar/rxjs-operators',
        'tslib': 'https://angul.ar/tslib'
      }
    });

    registerBox(System);
    const p = await System.import('./box.component');
    expect(p.BoxComponent).toStrictEqual(expect.any(Function));
  });

  it('bootstrap Angular app with standalone components', async () => {
    const System = createFakeAngularAppSystem();

    eval(readFileSync('./bundles/zone.js', 'utf-8'))
    registerAngularApp(System);


    await expect(System.import('main')).resolves.toStrictEqual(expect.anything());
  })


  it('does not refetch the same module twice', async () => {
    const {System, fetcher, createFakeFetchableDef} = setup();
    const {code, getCount, cleanUp} = getCounter('counter');
    createFakeFetchableDef('depA', code);

    registerE(System);
    registerD(System);

    await System.import('./depE');
    expect(getCount()).toBe(1);
    cleanUp();
  });


});
