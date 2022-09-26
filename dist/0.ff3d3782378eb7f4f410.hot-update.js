"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 15:
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterService = void 0;
const common_1 = __webpack_require__(6);
const groups_entity_1 = __webpack_require__(16);
let RegisterService = class RegisterService {
    constructor() { }
    async JoinToGroup(user) {
        let User = this.dataSource
            .getRepository(groups_entity_1.groups)
            .createQueryBuilder("groups")
            .where("user.groupId = :groupId", { groupId: user.groupId });
        console.log(User);
        this.users.save(user);
    }
    async getGroups() {
        return await this.Groups.find();
    }
};
RegisterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RegisterService);
exports.RegisterService = RegisterService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("4d702d5d20e9a4fe6d85")
/******/ })();
/******/ 
/******/ }
;