exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 9:
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (35:92)\nFile was processed with these loaders:\n * ./node_modules/ts-loader/index.js\nYou may need an additional loader to handle the result of these loaders.\n|     async sendGroupMessage(body) {\n|         let Message = await this.messages.save(body.message);\n>         await this.gMessages.save({ message: Message.id, from: body.groupData.from, group:  });\n|         console.log(body);\n|     }");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("dedcda80e7ac78f95816")
/******/ })();
/******/ 
/******/ }
;