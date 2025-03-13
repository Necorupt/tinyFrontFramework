import { beforeEach, describe, expect, inject, it, vi } from "vitest";
import { CreateTff } from "../tff";
import { CreateInjector } from "../tff";

describe("Injector", function () {
  beforeEach(function () {
    delete window.tff;
    CreateTff();
  });

  it("can create constant module", function () {
    window.tff.module("constant", []);

    let injector = CreateInjector(["constant"]);

    expect(injector.has("constant")).toBe(true);
  });

  it("hasn't unregistred module", function () {
    window.tff.module("constant", []);

    let injector = CreateInjector(["constant"]);

    expect(injector.has("unregistred")).toBe(false);
  });

  it("can load multiple modules", function () {
    window.tff.module("constant", []);
    window.tff.module("constant_2", []);

    let injector = CreateInjector(["constant", "constant_2"]);

    expect(injector.has("constant")).toBe(true);
    expect(injector.has("constant_2")).toBe(true);
  });

  it("can load requiered module", function () {
    window.tff.module("constant", []);
    window.tff.module("constant_2", []);
    window.tff.module("constant_3", ["constant_2", "constant"]);

    let injector = CreateInjector(["constant_3"]);

    expect(injector.has("constant")).toBe(true);
    expect(injector.has("constant_2")).toBe(true);
    expect(injector.has("constant_3")).toBe(true);
  });

  it("can invoke function", function () {
    let module = window.tff.module("module", []);
    module.constant("a", 1);
    module.constant("b", 2);

    let injector = CreateInjector(["module"]);

    let fn = (a, b) => a + b;

    fn.$inject = ["a", "b"];

    expect(injector.invoke(fn)).toBe(3);
  });

  it("allow register provider and use it", function () {
    let module = window.tff.module("module", []);
    module.provider("a", {
      $get: function () {
        return 1;
      },
    });

    let injector = CreateInjector(["module"]);

    expect(injector.has("a")).toBe(true);
    expect(injector.get("a")).toBe(1);
  });

  it("can inject method to provider", function () {
    let module = window.tff.module("module", []);
    module.constant("b", 2);
    module.provider("a", {
      $get: function (b) {
        console.error(this);
        return b * 2;
      },
    });

    let injector = CreateInjector(["module"]);

    expect(injector.has("a")).toBe(true);
    expect(injector.get("a")).toBe(4);

    let ttfInjector = CreateInjector(["tff"]);
    let compile = ttfInjector.get("$compile");

    console.error(ttfInjector.invoke(function ($compile) {
        console.error(this);
    }));
  });
});
