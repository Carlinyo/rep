"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 18:
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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const groups_entity_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
const group_user_entity_1 = __webpack_require__(19);
let RegisterService = class RegisterService {
    constructor(users, group_user, Groups) {
        this.users = users;
        this.group_user = group_user;
        this.Groups = Groups;
    }
    async JoinToGroup(user) {
        console.log(user);
        let group = await this.users.findBy({ group: user.group });
        let contains = 0;
        group.forEach((el) => {
            if (el.username === user.username) {
                contains = 1;
                return user.username + "_" + Math.round(Math.random() * 100);
            }
        });
        if (group.length < 5 && contains === 0) {
            let User = await this.users.save(user);
            console.log(User, "User");
            this.group_user.save({ group: user.group, user: User.id });
            return group;
        }
        else {
            return "Group is Full";
        }
    }
    async getGroups() {
        return await this.Groups.find({ include: { all: true, nested: true } });
    }
    async leaveGroup(id) {
        let user = await this.users.findOneBy(id);
        await this.users.delete(user);
    }
    async getUsers() {
        return await this.group_user.find({
            rel,
        });
    }
};
RegisterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(group_user_entity_1.Group_User)),
    __param(2, (0, typeorm_1.InjectRepository)(groups_entity_1.groups)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RegisterService);
exports.RegisterService = RegisterService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("1996ca9f86e61bd3c799")
/******/ })();
/******/ 
/******/ }
;