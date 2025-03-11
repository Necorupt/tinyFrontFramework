import Scope from "../tff/Scope.js";
import { beforeEach, describe, expect, it, vi } from 'vitest'
import increment from "./mocks/increment.js";

describe("Scope", function () {

    var scope;
    beforeEach(function () {
        scope = new Scope();
    });

    it('can be created and used as object', function () {
        scope.test = 1;

        expect(scope.test).toBe(1);
    });

    it('can change old value', function () {
        scope.value = 1;

        let oldValGiven = 0;

        scope.$watch(
            (scope) => { return scope.value },
            (newValue, oldValue, scope) => { oldValGiven = oldValue }
        );

        scope.$digest();
        expect(oldValGiven).toBe(1);
    });

    it('can run without listner function', function () {
        scope.value = 1;

        scope.$watch(
            (scope) => { return scope.value },
        );

        expect(scope.value).toBe(1);
    });

    it('can catch exceptions', function () {
        scope.value = 1;

        let oldValGiven = 0;

        scope.$watch(
            (scope) => { return scope.value },
            (newValue, oldValue, scope) => { throw Error; }
        );

        scope.$watch(
            (scope) => { return scope.value; },
            (newValue, oldValue, scope) => { return oldValue++; }
        );
        scope.$digest();
        expect(scope.value).toBe(1);
    });

    it('listener function is called', function () {
        let watchFn = () => 'test';
        vi.mock('./mocks/increment.js', { spy: true })
        let listnerFn = increment;

        scope.$watch(watchFn, listnerFn);
        scope.$digest();

        expect(listnerFn).toHaveBeenCalled();
    });

    it('executes $eval function and return valid result', function () {
        scope.value = 100;

        let result = scope.$eval(function (scope, arg) {
            return scope.value * arg;
        }, 2);

        expect(result).toBe(200);
    });

    it('can run passed funtion and execute digit', function () {
        scope.value = 1;

        scope.$watch(
            (scope) => { return scope.value; },
            (newValue, oldValue, scope) => { return oldValue++; }
        );
        scope.$digest();

        scope.$apply((scope) => scope.value++);

        expect(scope.value).toBe(2);
    });

    it('can emmits events', function () {
        vi.mock('./mocks/increment.js', { spy: true })
        let listnerFn = increment;

        scope.$on('testEvent', listnerFn);

        scope.$emit('testEvent');

        expect(listnerFn).toHaveBeenCalled();
    });

    it('work without events', function () {
        scope.$emit('anotherTest');
    });

    it('canPass arguments', function () {
        let someValue = 0;

        scope.$on('testEvent', (a, b, c) =>
            someValue = a + b + c
        );

        scope.$emit('testEvent', 1, 2, 3);

        expect(someValue).toBe(6);

    });
})