import { beforeEach, describe, expect, inject, it, vi } from "vitest";
import CreateTff from "../tff/CreateTff";

describe("Modules", function () {
  beforeEach(function () {
    delete window.tff;
  });

  it("can create ttf once", function () {
    CreateTff();
    let tff = window.tff;
    CreateTff();

    expect(window.tff).toBe(tff);
  });

  it("can't create invalid module", function () {
    CreateTff();
    let module = undefined;

    const t = () => {
      module = window.tff.module("hasOwnProperty", []);
    };

    expect(t).toThrow("Invalid module name")
  });

  it("allow register module", function () {
    CreateTff();

    let module = window.tff.module("test", []);

    expect(module).toBeDefined();
    expect(module.name).toEqual("test");
  });

  it("can get module", function () {
    CreateTff();

    let module = window.tff.module("test", true);

    expect(module).toBeDefined();
    expect(window.tff.module("test", false)).toEqual(module);
  });
});
