"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 16:
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JoinedUserMessage = void 0;
const typeorm_1 = __webpack_require__(11);
const groups_entity_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
let JoinedUserMessage = class JoinedUserMessage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JoinedUserMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], JoinedUserMessage.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => groups_entity_1.groups, (user) => user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object)
], JoinedUserMessage.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JoinedUserMessage.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JoinedUserMessage.prototype, "message", void 0);
JoinedUserMessage = __decorate([
    (0, typeorm_1.Entity)()
], JoinedUserMessage);
exports.JoinedUserMessage = JoinedUserMessage;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("77588b77f08b02292979")
/******/ })();
/******/ 
/******/ }
;