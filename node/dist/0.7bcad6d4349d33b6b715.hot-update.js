"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 8:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(6);
const chat_service_1 = __webpack_require__(9);
let AppController = class AppController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    sendMessage(body) {
        this.chatService.sendMessage(body);
    }
    getMessages(id) {
        this.chatService.getUserMessages(id);
    }
    getGroupMessages(groupId) {
        this.chatService.getGroupMessages(groupId);
    }
    sendGroupMessage(body) {
        this.chatService.sendGroupMessage(body);
    }
};
__decorate([
    (0, common_1.Post)("/sendMessage"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)("/getMessages"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)("/getGroupMessages"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getGroupMessages", null);
__decorate([
    (0, common_1.Post)("/sendMessageToGroup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sendGroupMessage", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("56788724e1bf644e3938")
/******/ })();
/******/ 
/******/ }
;