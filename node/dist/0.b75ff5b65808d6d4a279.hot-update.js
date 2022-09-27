"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 3:
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const platform_fastify_1 = __webpack_require__(5);
const path_1 = __webpack_require__(6);
const app_module_1 = __webpack_require__(7);
const hbs = __webpack_require__(12);
hbs.handlebars.helpers = Object.assign({}, __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'handlebars-helpers'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))());
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    app.useStaticAssets({
        root: (0, path_1.join)(__dirname, '..', 'public'),
        prefix: '/public/',
    });
    app.setViewEngine({
        engine: {
            handlebars: __webpack_require__(11),
        },
        templates: (0, path_1.join)(__dirname, '..', 'views'),
    });
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    await app.listen(3000);
}
bootstrap();


/***/ }),

/***/ 12:
/***/ ((module) => {

module.exports = require("hbs");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("4e0d676cc0807b3fea1b")
/******/ })();
/******/ 
/******/ }
;