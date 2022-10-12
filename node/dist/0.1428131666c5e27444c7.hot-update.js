"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 9:
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const groupmessages_entity_1 = __webpack_require__(10);
const messages_entity_1 = __webpack_require__(14);
const typeorm_2 = __webpack_require__(11);
let ChatService = class ChatService {
    constructor(messages, gMessages) {
        this.messages = messages;
        this.gMessages = gMessages;
    }
    sendMessage(message) {
        this.messages.save(message);
    }
    getUserMessages(id) {
        this.messages.findBy(id);
    }
    async sendGroupMessage(message) {
        let Message = await this.messages.save({ message: message.message, date: message.date });
        let id = await this.gMessages.save({ from: message.from, group: message.group, message: Message.id });
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(messages_entity_1.Messages)),
    __param(1, (0, typeorm_1.InjectRepository)(groupmessages_entity_1.GroupsMessages)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], ChatService);
exports.ChatService = ChatService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("26c70f039a06e0e1b4d7")
/******/ })();
/******/ 
/******/ }
;