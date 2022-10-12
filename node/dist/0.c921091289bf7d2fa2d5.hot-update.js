"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 24:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatModule = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const groupmessages_entity_1 = __webpack_require__(10);
const messages_entity_1 = __webpack_require__(14);
const chat_gateway_1 = __webpack_require__(25);
const chat_service_1 = __webpack_require__(9);
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([messages_entity_1.Messages, groupmessages_entity_1.GroupsMessages, Group])],
        providers: [chat_service_1.ChatService, chat_gateway_1.ChatGateway],
    })
], ChatModule);
exports.ChatModule = ChatModule;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("951f19e36e6284942573")
/******/ })();
/******/ 
/******/ }
;