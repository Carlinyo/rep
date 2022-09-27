"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 3:
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const chat_service_1 = __webpack_require__(21);
const socketstrategy_1 = __webpack_require__(51);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    const socketIoClientProvider = app.get(chat_service_1.ChatService);
    app.connectMicroservice({
        strategy: new socketstrategy_1.SocketIoClientStrategy(socketIoClientProvider.getSocket()),
    });
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
/******/ 	__webpack_require__.h = () => ("f41221f379f26afb25ee")
/******/ })();
/******/ 
/******/ }
;