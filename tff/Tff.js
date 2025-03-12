export default class Tff {
  #modules = new Array();

  Init(params) {}

  RegisterProvider(Provider) {}

  getModule(name) {
    return this.#modules[name];
  }

  ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  createModule(name, requires) {
    if (name === "hasOwnProperty") {
      throw "Invalid module name";
    }

    let moduleInstance = {
      name: name,
      requires: requires,
      constant: function (key, value) {},
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
