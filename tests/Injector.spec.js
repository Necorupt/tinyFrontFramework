
import { beforeEach, describe, expect, inject, it, vi } from 'vitest';
import CreateTff from '../tff/CreateTff';
import CreateInjector from '../tff/CreateInjector';

describe("Injector", function () {
    beforeEach(function () {
        delete window.tff;
        CreateTff();
    });

    it("can create constant module", function () {
        let module = window.tff.module("constant",[]);
        module.constant = 100;

        let injector = CreateInjector(['constant']);

        console.error("Injector", injector)
        expect(injector.has('constant')).toBe(true);
    });
})