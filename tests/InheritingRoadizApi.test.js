"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var RoadizApi_1 = __importDefault(require("../src/RoadizApi"));
var HeadlessRoadizApi = /** @class */ (function (_super) {
    __extends(HeadlessRoadizApi, _super);
    function HeadlessRoadizApi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeadlessRoadizApi.prototype.getPages = function (params) {
        return this.getNodesSourcesForType('page', params);
    };
    HeadlessRoadizApi.prototype.getPagesTags = function (params) {
        return this.getTagsForType('page', params);
    };
    HeadlessRoadizApi.prototype.getNeutrals = function (params) {
        return this.getNodesSourcesForType('neutral', params);
    };
    HeadlessRoadizApi.prototype.getNeutralsTags = function (params) {
        return this.getTagsForType('neutral', params);
    };
    return HeadlessRoadizApi;
}(RoadizApi_1["default"]));
test('Headless API: NSPage', function () {
    var api = new HeadlessRoadizApi(process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, false);
    return api.getPages({
        order: {
            'node.position': 'ASC'
        }
    }).then(function (response) {
        expect(response.status).toBe(200);
        expect(response.data["hydra:member"][0]).toBeDefined();
        expect(response.data["hydra:member"][0]['@type']).toBe('Page');
        response.data["hydra:member"].forEach(function (page) {
            expect(page.url).toContain('/');
            page.image.forEach(function (document) {
                expect(document.url).toContain('/files');
            });
        });
    });
});
test('Headless API: By path', function () {
    var api = new HeadlessRoadizApi(process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, false);
    return api.getSingleNodesSourcesByPath('/').then(function (response) {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data['@type']).toBe('Page');
        expect(response.data.url).toBe('/');
    });
});
test('Headless API: Home alternate links', function () {
    var api = new HeadlessRoadizApi(process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, false);
    return api.getSingleNodesSourcesByPath('/').then(function (response) {
        expect(api.getAlternateLinks(response)).toStrictEqual([{
                url: '/',
                locale: 'en'
            }, {
                url: '/fr',
                locale: 'fr'
            }]);
    });
});
test('Headless API: Sitemap FR', function () {
    var api = new HeadlessRoadizApi(process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, false);
    return api.fetchAllUrlsForLocale('fr').then(function (urls) {
        urls.forEach(function (url) {
            expect(url).toContain('/');
        });
    });
});
test('Headless API: Sitemap EN', function () {
    var api = new HeadlessRoadizApi(process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, false);
    return api.fetchAllUrlsForLocale('en').then(function (urls) {
        urls.forEach(function (url) {
            expect(url).toContain('/');
        });
    });
});
test('Headless API: NSNeutral', function () {
    var api = new HeadlessRoadizApi(process.env.API_BASE_URL, process.env.API_NON_PREVIEW_API_KEY, false);
    return api.getNeutrals({
        page: 1
    }).then(function (response) {
        expect(response.status).toBe(200);
        expect(response.data["hydra:member"][0]).toBeDefined();
        expect(response.data["hydra:member"][0]['@type']).toBe('Neutral');
    });
});
