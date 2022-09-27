"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 3:
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const cors_1 = __webpack_require__(25);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
        cors: true
    });
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    app.use((0, cors_1.default)({ origin: true, credentials: true }));
    await app.listen(5001);
}
bootstrap();


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("4886c9b35a967930e335")
/******/ })();
/******/ 
/******/ }
;