import $ParseProvider from "./parse";

export default class Module {

    #name = '';
    #modules = new Array();
    template = '';
    #wathers = new Array();
    #moduleInst = {};

    constructor(_module) {
        this.#moduleInst = _module;

        let proxy = new Proxy(_module.data, {
            set: function (target, key, value) {
                console.log(`${key} set to ${value}`);
                target[key] = value;
                return true;
            }
        });
    
        _module.data = proxy;

        this.#wathers.push(proxy);
        this.template = _module.template;
    }

    $watch(watchFn, listnerFn) {
        let watcher = {
            watchFn,
            scope,
        }
    }

    $eval(expr, args){
        $ParseProvider.call(this.#moduleInst.data,expr)
    }

    mount(){

    }
}