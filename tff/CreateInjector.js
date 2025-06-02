export default function CreateInjector(modulesToLoad) {
  let loadedModules = {};
  let FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
  let FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  let STRIP_COMMENTS = /\/\*.*\*\//;

  var instanceCache = {};
  var providerCache = {};

  let $provide = {
    constant: function (key, value) {
      if (key === "hasOwnProperty") {
        throw "hasOwnProperty is not valid constant key";
      }
      instanceCache[key] = value;
    },
    provider: function (key, provider) {
      providerCache[key + "_provider"] = provider;
    },
  };

  function annotate(fn) {
    if (typeof fn === "object") {
      return fn.slice(0, fn.length - 1);
    } else if (fn.$inject) {
      return fn.$inject;
    } else if (!fn.length) {
      return [];
    } else {
      let source = fn.toString().replace(STRIP_COMMENTS, "");
      let argDeclaration = source.match(FN_ARGS);

      let args = argDeclaration[1].split(",").map((el) => {
        return el.match(FN_ARG)[2];
      });

      return args;
    }
  }

  function getService(name) {
    if (instanceCache.hasOwnProperty(name)) {
      return instanceCache[name];
    } else if (providerCache.hasOwnProperty(name + "_provider")) {
      let provider = providerCache[name + "_provider"];

      return invoke(provider.$get, provider);
    }
  }

  function invoke(fn, self, locals) {
    let args = annotate(fn).map((token) => {
      if (typeof token === "string") {
        return locals && locals.hasOwnProperty(token)
          ? locals[token]
          : getService(token);
      } else {
        throw "Incorect injection token! Expected string, got " + token;
      }
    });

    if(typeof fn === 'object'){
      fn = fn[Object.keys(fn)[Object.keys(fn).length - 1]];
    }

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

      instanceCache[moduleName] = true;
    }
  });

  function instantiate(Type){
    let instance = {};
    invoke(Type, instance);
    return instance;
  }

  return {
    has: function (key) {
      return (
        instanceCache.hasOwnProperty(key) ||
        providerCache.hasOwnProperty(key + "_provider")
      );
    },
    get: getService,
    invoke: invoke,
    annotate: annotate,
    instantiate: instantiate,
  };
}
