import { beforeEach, describe, expect, it, vi } from "vitest";
import parse from "../tff/Parse.js";

describe("Parse", function () {
  it("Can parse integer", function () {
    var fn = parse("100");
    expect(fn()).toBe(100);
  });

  it("Can parse float", function () {
    var fn = parse("123.25");
    expect(fn()).toBe(123.25);
  });

  it("Can parse float without integer part", function () {
    var fn = parse(".25");
    expect(fn()).toBe(0.25);
  });

  it("Can ignore whitespaces", function () {
    var fn = parse("\t\r\n  100  ");

    expect(fn()).toBe(100);
  });

  // it('Can parse scientific notation', function () {
  //     var fn = parse('4e3');
  //     expect(fn()).toBe(4000);
  // });

  it("Can parse string", function () {
    var fn = parse('"hello"');
    expect(fn()).toBe("hello");
  });

  // it('Can parse null', function () {
  //     var fn = parse('null');
  //     console.error("FN()", fn());
  //     expect(fn()).toBe(null);
  // });

  it("Can parse true", function () {
    var fn = parse("true");
    expect(fn()).toBe(true);
  });

  it("Can parse false", function () {
    var fn = parse("false");
    expect(fn()).toBe(false);
  });

  it("can parse empty array", function () {
    var fn = parse("[]");

    expect(fn()).toEqual([]);
  });

  it("can parse simple array", function () {
    var fn = parse("[1,2,3,4]");

    expect(fn()).toEqual([1, 2, 3, 4]);
  });

  it("can parse multitype array", function () {
    var fn = parse('[1 , 2, "three" , [4, 5]]');

    expect(fn()).toEqual([1, 2, "three", [4, 5]]);
  });

  it("can parse empty object", function () {
    let fn = parse("{}");

    expect(fn()).toEqual({});
  });

  it("can parse simple object", function () {
    let fn = parse('{0: 1, 1: "B"}');

    expect(fn()).toEqual({ 0: 1, 1: "B" });
  });

  it("can parse simple object with identifiter keys", function () {
    let fn = parse('{a: 1, b: "B"}');

    expect(fn()).toEqual({ a: 1, b: "B" });
  });

  it('looks up attribute from the scope', function(){
      let fn = parse('test');

      expect(fn({test: 100})).toBe(100);
      expect(fn({})).toBeUndefined();
  });
});
