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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const groups_entity_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
const group_user_entity_1 = __webpack_require__(19);
const groupmessages_entity_1 = __webpack_require__(10);
let RegisterService = class RegisterService {
    constructor(users, group_user, Groups, GroupMessages) {
        this.users = users;
        this.group_user = group_user;
        this.Groups = Groups;
        this.GroupMessages = GroupMessages;
    }
    async JoinToGroup(user) {
        console.log(user);
        let group = await this.users.find({
            relations: { group: true },
        });
        let groupUsers = group.filter((el) => el.group.id === +user.group.group);
        let contains = 0;
        console.log(groupUsers);
        for (let i = 0; i < groupUsers.length; i++) {
            if (groupUsers[i].username === user.group.username) {
                console.log(1);
                contains = 1;
                return user.group.username + "_" + Math.round(Math.random() * 100);
            }
        }
        if (groupUsers.length < 5 && contains === 0) {
            console.log(2);
            let User = await this.users.save(user.group);
            this.group_user.save({
                group: user.group.group,
                user: User.id,
            });
            return "Ok";
        }
    }
    async getGroups() {
        return await this.Groups.find();
    }
    async leaveGroup(id) {
        let user = await this.users.findOneBy(id);
        await this.users.delete(user);
    }
    async getUsers() {
        return await this.group_user.find({
            relations: ["user", "group"],
        });
    }
    async GetGroupData(id) {
        let groupMessages = await this.GroupMessages.find({
            relations: { group: true, from: true },
        });
        let groupUsers = users.filter((el) => el.group.id === +id);
        console.log(groupUsers);
    }
};
RegisterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(group_user_entity_1.Group_User)),
    __param(2, (0, typeorm_1.InjectRepository)(groups_entity_1.groups)),
    __param(3, (0, typeorm_1.InjectRepository)(groupmessages_entity_1.GroupsMessages)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], RegisterService);
exports.RegisterService = RegisterService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("999e38ccc2e086dd8051")
/******/ })();
/******/ 
/******/ }
;