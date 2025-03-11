export default class Tff {

    #modules = new Array();

    Init(params) {

    }

    RegisterProvider(Provider) {

    }

    getModule(name) {
        return this.#modules[name];
    }

    createModule(name, requires) {
        if (name === 'hasOwnProperty') {
            throw 'Invalid module name';
        }

        let moduleInstance = {
            name: name,
            requires: requires,
            constant: function(key, value){

            }
        }

        this.#modules[name] = moduleInstance;
        return moduleInstance;
    }


    module(name, requires) {
        if (requires) {
            return this.createModule(name, requires);
        }

        return this.getModule(name);
    }

    LoadModule(_module) {
        let module = loadModule(_module);
        this.#modules.push(module);

        return module;
    }

    Mount(querySelector, _module) {
        let element = document.querySelector(querySelector);

        console.log(element);
        element.innerHTML = _module.template;
    }

}