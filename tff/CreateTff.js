import Tff from "./Tff";
import CompileProvider from "./providers/CompileProvider";

export default function CreateTff() {
  if (window.tff) {
    return window.tff;
  }

  let tff = new Tff();
  let module = tff.module("tff", []);

  module.provider("$compile", CompileProvider);

  window.tff = tff;
  return window.tff;
}
