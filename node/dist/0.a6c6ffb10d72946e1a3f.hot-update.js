"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 17:
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
exports.RegisterController = void 0;
const common_1 = __webpack_require__(6);
const register_service_1 = __webpack_require__(18);
let RegisterController = class RegisterController {
    constructor(regService) {
        this.regService = regService;
    }
    async joinToGroup(body, ) {
        console.log(body);
        return await this.regService.JoinToGroup(body);
    }
    leaveGroup(id) {
        this.regService.leaveGroup(id);
    }
    async getUsers() {
        return await this.regService.getUsers();
    }
    async getGroups() {
        return await this.regService.getGroups();
    }
    async getGroupData(body) {
        return await this.regService.GetGroupData(Object.keys(body)[0]);
    }
};
__decorate([
    (0, common_1.Post)('/joinToGroup'),
    __param(0, (0, common_1.Body)()),
    __param(1, common_1.Res),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "joinToGroup", null);
__decorate([
    (0, common_1.Post)('/leaveGroup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], RegisterController.prototype, "leaveGroup", null);
__decorate([
    (0, common_1.Get)('/getUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('/getGroups'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "getGroups", null);
__decorate([
    (0, common_1.Post)('/getGroupData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "getGroupData", null);
RegisterController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof register_service_1.RegisterService !== "undefined" && register_service_1.RegisterService) === "function" ? _a : Object])
], RegisterController);
exports.RegisterController = RegisterController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("96303d5157a3fd5319c0")
/******/ })();
/******/ 
/******/ }
;