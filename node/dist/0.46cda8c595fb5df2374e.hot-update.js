"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 3:
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const platform_fastify_1 = __webpack_require__(5);
simport;
{
    AppModule;
}
from;
'./app.module';
async function bootstrap() {
    const app = await core_1.NestFactory.create(AppModule, new platform_fastify_1.FastifyAdapter());
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    await app.listen(3000);
}
bootstrap();


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("0465f6a6a97328312f6d")
/******/ })();
/******/ 
/******/ }
;