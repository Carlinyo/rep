exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 9:
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (35:18)\nFile was processed with these loaders:\n * ./node_modules/ts-loader/index.js\nYou may need an additional loader to handle the result of these loaders.\n|     async sendGroupMessage(message) {\n|         let Message = await this.messages.save({ message: message.message, date: message.date });\n>         let id = +, Message, id;\n|         await this.gMessages.save({ from: message.from, group: message.group, message: Message.id });\n|     }");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("2ff75ab6b98f326d2688")
/******/ })();
/******/ 
/******/ }
;