export default class Tff{

    #modules = new Array();

    Init(params){

    }

    RegisterProvider(Provider){

    }

    LoadModule(_module){
        let module = loadModule(_module);
        this.#modules.push(module);

        return module;
    }

    Mount(querySelector, _module){
        let element = document.querySelector(querySelector);

        console.log(element);
        element.innerHTML = _module.template;
    }

}