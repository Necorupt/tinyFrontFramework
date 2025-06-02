export default class Tff {
  #modules = new Array();

  Init(params) {}

  RegisterProvider(Provider) {}

  getModule(name) {
    return this.#modules[name];
  }

  createModule(name, requires) {
    if (name === "hasOwnProperty") {
      throw "Invalid module name";
    }
    let invokeQueue = [];

    var invokeLater = function (method, arrayMethod) {
      return function () {
        invokeQueue[arrayMethod || 'push']([method, arguments]);

        return moduleInstance;
      };
    };

    let moduleInstance = {
      name: name,
      requires: requires,
      constant: invokeLater("constant", 'unshift'),
      provider: invokeLater("provider"),
      directive: invokeLater("$compile"),
      _invokeQueue: invokeQueue,
    };

    this.#modules[name] = moduleInstance;
    return moduleInstance;
  }

  module(name, requires) {
    if (requires) {
      return this.createModule(name, requires);
    }

    return this.getModule(name);
  }
}
