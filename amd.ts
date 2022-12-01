export type ImportsMap = { imports: Record<string, string> };


export interface Global {
  System?: any;
  define?: any;
}

export interface AmdModule {
  setters: Function[],
  execute: Function
}


type Fetcher = (url: string) => Promise<string>;

const defaultFetcher = ((url: string) => fetch(url).then(r => r.text()));

class System {
  importsMap: ImportsMap = {
    imports: {},
  };
  readonly resolvedExports: Record<string, Promise<any>> = {};
  readonly executedDeps: Record<string, any> = {};
  readonly modules: Record<string, any> = {};
  readonly asyncModules: Record<string, any> = {};

  constructor(
    private readonly fetch: Fetcher = defaultFetcher
  ) {
  }

  addImportMap(map: ImportsMap) {
    if (!('imports' in map)) {
      throw new Error('Missing imports in imports map')
    }
    this.importsMap = map;
  }

  register(id: string, deps: string[], func: ($__export: Function, $__moduleContext: { id: string }) => AmdModule) {
    delete this.executedDeps[id];
    delete this.resolvedExports[id];
    return this.modules[id] = Promise.resolve([deps, func]);
  }

  normalize(id: string) {
    // TODO(kirjs): Actually normalize
    return id.replace('./', '');
  }

  async getModule(id: string) {
    id = this.normalize(id);
    const module = await this.modules[id];

    if (module) {
      return module;
    }

    if (this.importsMap.imports[id]) {
      if (this.asyncModules[id]) {
        return this.asyncModules[id];
      }

      return this.asyncModules[id] = await this.fetchModule(id);
    }

    throw new Error(`no module: "${id}"`);
  }

  async resolveExports(...ids: string[]) {
    return Promise.all(ids.map(async id => {
        id = this.normalize(id);
        if (this.resolvedExports[id]) {
          return await this.resolvedExports[id];
        }

        const exports: Record<string, unknown> = {};

        if (id === 'exports') {
          return exports
        }
        const mod = await this.getModule(id);

        return this.resolvedExports[id] = new Promise(async (resolve, reject) => {
          if (!mod) {
            throw new Error("can't fetch module: " + id);
          }

          const [deps, func] = mod;

          function $__export(key: string, value: unknown) {
            exports[key] = value;
          }

          const $__moduleContext = {id};

          try {
            const {setters, execute} = await func($__export, $__moduleContext);
            const resolvedDeps = (await this.resolveExports(...deps)).map(d => d.exports);

            for (let i = 0; i < resolvedDeps.length; i++) {
              setters[i](resolvedDeps[i]);
            }
            resolve({setters, execute, exports});
          } catch (e) {
            console.log(e);
            throw e;
          }
        });

      }
    ));
  }

  async executeDeps(...ids: string[]) {
    return Promise.all(ids.map(async id => {
        id = this.normalize(id);
        if (this.executedDeps[id]) {
          return this.executedDeps[id];
        }

        if (!this.resolvedExports[id]) {
          throw new Error('No resolvedImports for: ' + id);
        }

        return this.executedDeps[id] = new Promise(async (resolve, reject) => {
          const [deps] = await this.getModule(id);

          const executedDeps = await this.executeDeps(...deps);

          const {execute, exports, setters} = await this.resolvedExports[id];

          for (let i = 0; i < executedDeps.length; i++) {
            setters[i](executedDeps[i]);
          }

          try {
            await execute();
          } catch (e) {
            debugger
            console.log(e);
            throw e;
          }

          resolve(exports);
        });


      }
    ));
  }

  async import(id: string) {
    await this.resolveExports(id);
    return (await this.executeDeps(id))[0];
  }

  private async fetchModule(id: string) {
    const module = await this.fetch(this.importsMap.imports[id]);
    const define = (allDeps: string[], func: Function) => {
      const deps = allDeps.slice(1);
      this.register(id, deps, function ($__export: Function,) {
        const resolvedDeps: unknown[] = [];

        return {
          setters: deps.map((a, i) => (r: unknown) => resolvedDeps[i] = r),
          execute: () => {
            const exports = {};
            const result = func(exports, ...resolvedDeps);

            for (const [key, value] of Object.entries(exports)) {
              $__export(key, value);
            }

            return result;
          }
        }
      });
    }
    define.amd = true;


    if (!('document' in globalThis)) {
      // Tell the UMD to wire up to AMD, and not node.
      const exports: undefined = undefined;
      await eval(module);
    } else {
      const head = document.getElementsByTagName('head')[0];
      (globalThis as any).define = define;
      const tag = document.createElement("script");
      tag.type = 'text/javascript';
      tag.textContent = module;
      head.appendChild(tag)
    }

    return this.modules[id];
  }
}

export const AMDLoader = (globalThis as any).AMDLoader = function (global: Global = {}, fetcher?: Fetcher) {
  global.System = new System(fetcher);
  return global;
}

if (typeof window !== 'undefined') {
  AMDLoader(window as any);
}
