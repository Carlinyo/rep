"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 24:
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatGateway = void 0;
const websockets_1 = __webpack_require__(25);
const chat_service_1 = __webpack_require__(9);
const socket_io_1 = __webpack_require__(26);
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
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
    async login(socket, data) {
        await this.chatService.findUser(data);
    }
    async createUser(socket, data) {
        let users = await this.chatService.getUsers();
        if (users.every((el) => el.user.username !== data.data.to_email)) {
            await this.chatService.createUser(data);
        }
        else {
            await this.chatService.updateUser(data);
        }
    }
    async getUserByToken(socket, data) {
        let user = await this.chatService.findUserByToken(data);
        user = user.sort((a, b) => a.id - b.id);
        socket.emit("userByToken", user);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("getUsers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getGroups"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getGroups", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("groupMessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getGroupMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("input"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onInput", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "login", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("createUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "createUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getUserByToken"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _j : Object, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getUserByToken", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: "*:*", transport: ["websocket"] }),
    __metadata("design:paramtypes", [typeof (_a = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _a : Object])
], ChatGateway);
exports.ChatGateway = ChatGateway;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("3165b8aaa6f42d62c53b")
/******/ })();
/******/ 
/******/ }
;