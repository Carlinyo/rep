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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatGateway = void 0;
const websockets_1 = __webpack_require__(24);
const chat_service_1 = __webpack_require__(9);
const socket_io_1 = __webpack_require__(25);
const typeorm_1 = __webpack_require__(7);
const group_user_entity_1 = __webpack_require__(15);
const typeorm_2 = __webpack_require__(11);
const joined_user_messages_dto_1 = __webpack_require__(26);
let ChatGateway = class ChatGateway {
    constructor(chatService, group_user) {
        this.chatService = chatService;
        this.group_user = group_user;
    }
    afterInit(server) { }
    async handleConnection(socket) { }
    async handleDisconnect(socket) { }
    async getUsers(socket) {
        let users = await this.chatService.getUsers();
        socket.emit("getUsers", users);
    }
    async getGroups(socket) {
        let groups = await this.chatService.getGroups();
        socket.emit("getGroups", groups);
    }
    async getGroupMessage(socket, message) {
        let data;
        if (!message.status) {
            await this.chatService.sendGroupMessage(message);
            data = await this.chatService.GetGroupData(message.group);
        }
        else if (message.status) {
            data = await this.chatService.GetGroupData(message.id);
        }
        socket.emit("groupData", data);
        socket.broadcast.emit("groupData", data);
    }
    async onInput(socket, data) {
        if (data.typing) {
            socket.broadcast.emit("typing", { from: data.userId, status: "true" });
        }
        else {
            socket.broadcast.emit("typing", { from: data.userId, status: "false" });
        }
    }
    async joinedUsername(socket, data) {
        let date = new Date().getHours() + ":" + new Date().getMinutes();
        data.date = date;
        if (data.count === "0") {
            delete data.count;
            let Message = await this.chatService.sendJoinedUserMessages(data);
            let messages = await this.chatService.getJoinedMessages();
            socket.emit("joinedUser", { message: Message, messages });
            socket.broadcast.emit("joinedUser", { message: Message, messages });
        }
        else {
            let messages = await this.chatService.getJoinedMessages();
            socket.emit("joinedUser", { messages });
            socket.broadcast.emit("joinedUser", { messages });
        }
    }
    async deleteUser(socket, data) {
        console.log(data);
        let date = new Date().getHours() + ":" + new Date().getMinutes();
        data.date = date;
        await this.chatService.sendLeftUserMessage(data);
        let messages = await this.chatService.getLeftMessages();
        socket.emit("getLeftMessages", messages);
        socket.broadcast.emit("getLeftMessages", messages);
        if (data.user) {
            await this.chatService.LogoutUser(data.user);
        }
    }
    async login(socket, data) {
        let user = await this.chatService;
        console.log(user);
    }
    async createUser(socket, data) {
        let users = await this.chatService.getUsers();
        if (users.every((el) => el.user.username !== data.data.to_email)) {
            let user = await this.chatService.createUser(data);
        }
    }
    async getUserByToken() {
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _c : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("getUsers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getGroups"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getGroups", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("groupMessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getGroupMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("input"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onInput", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("user"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object, typeof (_j = typeof joined_user_messages_dto_1.JoinedUserMessagesDto !== "undefined" && joined_user_messages_dto_1.JoinedUserMessagesDto) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinedUsername", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("logOutUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _k : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "deleteUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _l : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "login", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("createUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _m : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "createUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getUserByToken'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getUserByToken", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: "*:*", transport: ["websocket"] }),
    __param(1, (0, typeorm_1.InjectRepository)(group_user_entity_1.Group_User)),
    __metadata("design:paramtypes", [typeof (_a = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], ChatGateway);
exports.ChatGateway = ChatGateway;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("ba7daa45e57e3535f1d2")
/******/ })();
/******/ 
/******/ }
;