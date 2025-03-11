import Tff from "./Tff";

var modules = new Array();

export default function CreateTff() {
    if(!window.tff){
        let tff = window.tff = new Tff();

        return tff;
    }

    return window.tff;
}