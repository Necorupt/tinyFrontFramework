import Tff from "./Tff";

var modules = new Array();

function createModule(name, requires) {
    if (name === 'hasOwnProperty') {
        throw 'Invalid module name';
    }

    let moduleInstance = {
        name: name,
        requires: requires,
    }

    modules[name] = moduleInstance;
    return moduleInstance;
}

export default function CreateTff() {
    return window.tff = window.tff || new Tff();
}