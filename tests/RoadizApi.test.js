"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var RoadizApi_1 = __importDefault(require("../src/RoadizApi"));
test('Non-configured API is not found', function () {
    var api = new RoadizApi_1["default"]('http://nope.test/api/1.0', 'xxxx', false);
    return api.getNodesSources({
        page: 1
    })["catch"](function (reason) {
        expect(reason.response).toBeUndefined();
    });
});
test('Bad api key API', function () {
    var api = new RoadizApi_1["default"](process.env.API_BASE_URL, 'xxxxxx', false);
    return api.getNodesSources({
        page: 1
    })["catch"](function (response) {
        expect(response.response.status).toBe(403);
    });
});
test('Configured API', function () {
    var api = new RoadizApi_1["default"](process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, false);
    return api.getNodesSources({
        page: 1
    }).then(function (response) {
        expect(response.status).toBe(200);
    });
});
test('Test NodesSources HydraCollection response', function () {
    var api = new RoadizApi_1["default"](process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, false);
    return api.getNodesSources({}).then(function (response) {
        expect(response.data["hydra:totalItems"]).toBeGreaterThan(1);
        expect(response.data["hydra:member"][0]).toHaveProperty('@type');
        expect(response.data["hydra:member"][0]).toHaveProperty('slug');
    });
});
test('Test CommonContent Response HydraCollection response', function () {
    var api = new RoadizApi_1["default"](process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, false);
    return api.getNodesSources({}).then(function (response) {
        expect(response.data["hydra:totalItems"]).toBeGreaterThan(1);
        expect(response.data["hydra:member"][0]).toHaveProperty('@type');
        expect(response.data["hydra:member"][0]).toHaveProperty('slug');
    });
});
test('Bad Api key preview API', function () {
    var api = new RoadizApi_1["default"](process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, true);
    return api.getNodesSources({
        page: 1
    })["catch"](function (response) {
        expect(response.response.status).toBe(403);
    });
});
test('Configured preview API', function () {
    var api = new RoadizApi_1["default"](process.env.API_BASE_URL, process.env.API_PREVIEW_API_KEY, true);
    return api.getNodesSources({
        page: 1
    }).then(function (response) {
        expect(response.status).toBe(200);
    });
});
