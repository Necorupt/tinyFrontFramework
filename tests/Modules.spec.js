
import { beforeEach, describe, expect, inject, it, vi } from 'vitest';
import CreateTff from '../tff/CreateTff';

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

    it("allow register module", function(){
        CreateTff();
        
        let module = window.tff.module('test',[]);
        
        expect(module).toBeDefined();
        expect(module.name).toEqual('test');
    });
})