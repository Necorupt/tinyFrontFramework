
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
    })
})