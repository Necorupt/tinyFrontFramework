export default function CreateInjector(modulesToLoad) {
  let cache = {};
  let loadedModules = {};
  let FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
  let FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

  let $provide = {
    constant: function (key, value) {
      cache[key] = value;
    },
    provider: function (key, provider) {
      cache[key] = invoke(provider.$get, provider);
    },
  };

  function annotate(fn) {
    if (typeof fn === "object") {
      return fn.slice(0, fn.length - 1);
    } else if (fn.$inject) {
      return fn.$inject;
    } else if (!fn.length) {
      return [];
    }

    let source = fn.toString();
    let argDeclaration = source.match(FN_ARGS);

    let args =  argDeclaration[1].split(',').map((el) => {
      return el;
    });

    return args;
  }

  function invoke(fn, self) {
    let args = annotate(fn).map((token) => cache[token]);

    return fn.apply(self, args);
  }

  modulesToLoad.forEach(function loadModule(moduleName) {
    if (loadedModules.hasOwnProperty(moduleName) === false) {
      loadedModules[moduleName] = true;
      let module = window.tff.module(moduleName);

      for (let requiered of module.requires) {
        loadModule(requiered);
      }

      for (let invokeArgs of module._invokeQueue) {
        let method = invokeArgs[0];
        let args = invokeArgs[1];

        $provide[method].apply($provide, args);
      }

      cache[moduleName] = true;
    }
  });

  return {
    has: function (key) {
      return cache.hasOwnProperty(key);
    },
    get: function (key) {
      return cache[key];
    },
    invoke: invoke,
  };
}
