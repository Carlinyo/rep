"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 19:
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
exports.RegisterService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const groups_entity_1 = __webpack_require__(12);
const group_user_entity_1 = __webpack_require__(15);
let RegisterService = class RegisterService {
    constructor(Groups, group_user) {
        this.Groups = Groups;
        this.group_user = group_user;
    }
};
RegisterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(groups_entity_1.groups)),
    __param(1, (0, typeorm_1.InjectRepository)(group_user_entity_1.Group_User)),
    __metadata("design:paramtypes", [Object, Object])
], RegisterService);
exports.RegisterService = RegisterService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("f2f4d0f45b76b56e4618")
/******/ })();
/******/ 
/******/ }
;