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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const groupmessages_entity_1 = __webpack_require__(10);
const groups_entity_1 = __webpack_require__(12);
const group_user_entity_1 = __webpack_require__(15);
const join_messages_entity_1 = __webpack_require__(28);
const messages_entity_1 = __webpack_require__(14);
const user_entity_1 = __webpack_require__(13);
let ChatService = class ChatService {
    constructor(users, group_user, gMessages, messages, Groups, ) {
        this.users = users;
        this.group_user = group_user;
        this.gMessages = gMessages;
        this.messages = messages;
        this.Groups = Groups;
    }
    async sendGroupMessage(body) {
        let Message = await this.messages.save(body.message);
        await this.gMessages.save({
            message: Message.id,
            from: body.from,
            group: body.group,
        });
    }
    async JoinToGroup(user) {
        let group = await this.users.find({
            relations: { group: true },
        });
        let groupUsers = group.filter((el) => el.group.id === +user.group);
        let contains = 0;
        for (let i = 0; i < groupUsers.length; i++) {
            if (groupUsers[i].username === user.username) {
                contains = 1;
                return {
                    status: user.username + "_" + Math.round(Math.random() * 100),
                };
            }
        }
        if (groupUsers.length < 5 && contains === 0) {
            let User = await this.users.save(user);
            await this.group_user.save({
                group: user.group,
                user: User.id,
            });
            return { user: User, status: "Ok" };
        }
    }
    async getUser(id) {
        return await this.users.find({ where: { id: id } });
    }
    async joinedMessage(message) {
        return await this.messages.save(message);
    }
    async leaveGroup(id) {
        let user = await this.users.findOneBy(id);
        await this.users.delete(user);
    }
    async GetGroupData(id) {
        let groupMessages = await this.gMessages.find({
            relations: { group: true, from: true, message: true },
        });
        let groupUsers = groupMessages
            .filter((el) => el.group.id === +id)
            .sort((a, b) => b.id > a.id);
        let users = await this.users.find({ relations: ["group"] }), Users = users.filter((el) => el.group.id === +id);
        return { messages: groupUsers, users: Users };
    }
    async getGroups() {
        return await this.Groups.find();
    }
    async getUsers() {
        return await this.group_user.find({
            relations: ["user", "group"],
        });
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(group_user_entity_1.Group_User)),
    __param(2, (0, typeorm_1.InjectRepository)(groupmessages_entity_1.GroupsMessages)),
    __param(3, (0, typeorm_1.InjectRepository)(messages_entity_1.Messages)),
    __param(4, (0, typeorm_1.InjectRepository)(groups_entity_1.groups)),
    __param(5, (0, typeorm_1.InjectRepository)(join_messages_entity_1.JoinMessages)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ChatService);
exports.ChatService = ChatService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("8877e75f30ffb960ffa0")
/******/ })();
/******/ 
/******/ }
;