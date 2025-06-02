import { beforeEach, describe, expect, inject, it, vi } from "vitest";
import { CreateTff } from "../tff";
import { CreateInjector } from "../tff";

describe("Compile module", function () {
  beforeEach(function () {
    delete window.tff;
    CreateTff();
  });

  it("Is has $compile provider", function () {
    let injector = CreateInjector(["tff"]);

    expect(injector.has("$compile")).toBe(true);
  });

  it("Can create directive", function () {
    // let testingMod = window.tff.module("hello-world", []);
    // let directive = {d: 'one'};
    // let directive2 = {d: 'two'};

    // testingMod.directive("testing", directive);
    // testingMod.directive("testing", directive2);

    // let injector = CreateInjector(['tff', 'hello-world']);
    // let result = injector.get('testing_directive');

    // expect(injector.has("unregistred")).toBe(false);
  });
});
