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

    let moduleInstance = {
      name: name,
      requires: requires,
      constant: function (key, value) {
        invokeQueue.push(["constant", [key, value]]);
      },
      provider: function (key, provider) {
        invokeQueue.push(["provider", [key, provider]]);
      },
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
