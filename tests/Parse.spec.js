import { beforeEach, describe, expect, it, vi } from 'vitest'
import parse from "../tff/Parse.js";

describe("Parse", function () {
    it('Can parse integer', function () {
        var fn = parse('100');
        expect(fn()).toBe(100);
    });

    it('Can parse float', function () {
        var fn = parse('123.25');
        expect(fn()).toBe(123.25);
    });

    it('Can parse float without integer part', function () {
        var fn = parse('.25');
        expect(fn()).toBe(0.25);
    });

    // it('Can parse scientific notation', function () {
    //     var fn = parse('4e3');
    //     expect(fn()).toBe(4000);
    // });

    it('Can parse string', function () {
        var fn = parse('"hello"');
        expect(fn()).toBe("hello");
    });

    it('Can parse true', function () {
        var fn = parse('true');
        expect(fn()).toBe(false);
    });

    it('Can parse false', function () {
        var fn = parse('false');
        expect(fn()).toBe(false);
    });
})