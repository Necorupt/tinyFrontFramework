import Tff from "./Tff";

export default function CreateTff() {
    if(!window.tff){
        let tff = window.tff = new Tff();

        return tff;
    }

    return window.tff;
}