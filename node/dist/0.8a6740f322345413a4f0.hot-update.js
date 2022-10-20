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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const groupmessages_entity_1 = __webpack_require__(10);
const groups_entity_1 = __webpack_require__(12);
const group_user_entity_1 = __webpack_require__(15);
const joined_user_emtity_1 = __webpack_require__(16);
const letf_users_entity_1 = __webpack_require__(17);
const messages_entity_1 = __webpack_require__(14);
const user_entity_1 = __webpack_require__(13);
let ChatService = class ChatService {
    constructor(users, group_user, gMessages, messages, Groups, joinedUserMessages, LeftUsersMessage) {
        this.users = users;
        this.group_user = group_user;
        this.gMessages = gMessages;
        this.messages = messages;
        this.Groups = Groups;
        this.joinedUserMessages = joinedUserMessages;
        this.LeftUsersMessage = LeftUsersMessage;
    }
    async sendGroupMessage(body) {
        let Message = await this.messages.save(body.message);
        await this.gMessages.save({
            message: Message.id,
            from: body.from,
            group: body.group,
        });
    }
    async LogoutUser(id) {
        let groupUser = await this.group_user.findOne({ where: { user: +id } });
        if (groupUser) {
            await this.group_user.delete(groupUser);
        }
    }
    async getUser(id) {
        return await this.users.find({ where: { id: id } });
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
        let users = await this.users.find({ where: { group: +id } });
        return { messages: groupUsers, users: users };
    }
    async getGroups() {
        return await this.Groups.find();
    }
    async getUsers() {
        return await this.group_user.find({
            relations: ["user", "group"],
        });
    }
    async sendJoinedUserMessages(message) {
        let Message = await this.joinedUserMessages.save(message);
        setTimeout(async () => {
            await this.joinedUserMessages.delete(Message);
        }, 15000);
        return Message;
    }
    async getJoinedMessages() {
        return await this.joinedUserMessages.find();
    }
    async sendLeftUserMessage(data) {
        let message = await this.LeftUsersMessage.save(data);
        setTimeout(async () => {
            await this.LeftUsersMessage.delete(message);
        }, 15000);
        return message;
    }
    async getLeftMessages() {
        return await this.LeftUsersMessage.find();
    }
    async createUser(data) {
        let user = await this.users.save({
            username: data.data.to_email,
            type: 0,
            verification: 0,
            password: "",
            token: data.token,
        });
        data.data.groups.map(async (group) => {
            await this.group_user.save({ group: group, user: user.id });
        });
        return user;
    }
    async updateUser(data) {
        let currUser = await this.users.find({
            where: { username: data.data.to_email },
        });
        console.log(currUser[0].id);
        let user = await this.users
            .createQueryBuilder()
            .update(this.users)
            .set({
            token: data.token,
        })
            .where("id = :currUser[0].id", { id: currUser[0].id })
            .execute();
        console.log(user);
    }
    async findUser(data) {
        console.log(data);
        let users = await this.users.find();
        console.log(users);
        let user;
        for (let i = 0; i < users.length; i++) {
            if (users[i].token === data.token) {
                user = users[i];
            }
        }
        console.log(user);
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(group_user_entity_1.Group_User)),
    __param(2, (0, typeorm_1.InjectRepository)(groupmessages_entity_1.GroupsMessages)),
    __param(3, (0, typeorm_1.InjectRepository)(messages_entity_1.Messages)),
    __param(4, (0, typeorm_1.InjectRepository)(groups_entity_1.groups)),
    __param(5, (0, typeorm_1.InjectRepository)(joined_user_emtity_1.JoinedUserMessage)),
    __param(6, (0, typeorm_1.InjectRepository)(letf_users_entity_1.LeftUsers)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], ChatService);
exports.ChatService = ChatService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("0c284052fec60bd82b62")
/******/ })();
/******/ 
/******/ }
;