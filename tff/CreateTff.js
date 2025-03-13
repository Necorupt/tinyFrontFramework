import Tff from "./Tff";
import CompileProvider from "./providers/compile"

export default function CreateTff() {
  if (window.tff) {
    return window.tff;
  }

  window.tff = new Tff();
  let tff = window.tff;

  let module = tff.module("tff", []);

  module.provider('$compile', CompileProvider)

  return window.tff;
}
