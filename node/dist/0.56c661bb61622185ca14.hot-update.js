"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 23:
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
const groups_entity_1 = __webpack_require__(12);
const group_user_entity_1 = __webpack_require__(15);
const join_messages_entity_1 = __webpack_require__(28);
const messages_entity_1 = __webpack_require__(14);
const user_entity_1 = __webpack_require__(13);
const chat_gateway_1 = __webpack_require__(24);
const chat_service_1 = __webpack_require__(9);
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, groups_entity_1.groups, messages_entity_1.Messages, groupmessages_entity_1.GroupsMessages, group_user_entity_1.Group_User, join_messages_entity_1.JoinMessages])],
        providers: [chat_service_1.ChatService, chat_gateway_1.ChatGateway],
    })
], ChatModule);
exports.ChatModule = ChatModule;


/***/ }),

/***/ 28:
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JoinMessages = void 0;
const typeorm_1 = __webpack_require__(11);
const groups_entity_1 = __webpack_require__(12);
let JoinMessages = class JoinMessages {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JoinMessages.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JoinMessages.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JoinMessages.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => groups_entity_1.groups, (group) => group),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", typeof (_a = typeof groups_entity_1.groups !== "undefined" && groups_entity_1.groups) === "function" ? _a : Object)
], JoinMessages.prototype, "group", void 0);
JoinMessages = __decorate([
    (0, typeorm_1.Entity)()
], JoinMessages);
exports.JoinMessages = JoinMessages;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("1c6c9e6ba5b2cd849e2b")
/******/ })();
/******/ 
/******/ }
;