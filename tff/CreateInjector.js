export default function CreateInjector(modulesToLoad) {
  let cache = {};

  let $provide = {
    constant: function (key, value) {
      cache[key] = value;
    },
  };

  for (let moduleName of modulesToLoad) {
    let module = window.tff.module(moduleName);

    cache[moduleName] = true;
  }

  return {
    has: function (key) {
      return cache.hasOwnProperty(key);
    },
  };
}
