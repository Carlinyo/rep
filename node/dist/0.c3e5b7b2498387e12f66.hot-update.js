"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 25:
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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatGateway = void 0;
const common_1 = __webpack_require__(6);
const websockets_1 = __webpack_require__(26);
const chat_service_1 = __webpack_require__(9);
const socket_io_1 = __webpack_require__(27);
const typeorm_1 = __webpack_require__(7);
const group_user_entity_1 = __webpack_require__(15);
const typeorm_2 = __webpack_require__(11);
let ChatGateway = class ChatGateway {
    constructor(chatService, group_user) {
        this.chatService = chatService;
        this.group_user = group_user;
    }
    afterInit(server) { }
    async handleConnection(socket) {
        let messages = await this.chatService.GetGroupData(socket.id);
        socket.emit("messages", messages);
    }
    async handleDisconnect(socket) {
        let user = await this.group_user.findOne({
            where: { user: socket.id },
            relations: { user: true, group: true },
        });
        if (user) {
            this.server.emit("users-changed", { user: user.username, event: "left" });
        }
    }
    async getGroupData(client, data) {
        client.emit('message', data);
        console.log(data);
    }
    sendMessage(message) {
        this.chatService.sendGroupMessage(message);
    }
    handleNewMessage(chat, socket) {
        console.log(chat);
        this.chatService.sendGroupMessage(chat);
        socket.emit("newChat", chat);
        socket.broadcast.emit("newChat", chat);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _c : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("sendMessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getGroupData", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("sendMessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof sendMessageTypes !== "undefined" && sendMessageTypes) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Bind)((0, websockets_1.MessageBody)(), (0, websockets_1.ConnectedSocket)()),
    (0, websockets_1.SubscribeMessage)("chat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof sendMessageTypes !== "undefined" && sendMessageTypes) === "function" ? _f : Object, typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleNewMessage", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: "*:*" }),
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
/******/ 	__webpack_require__.h = () => ("ab6a08551f5636ae317e")
/******/ })();
/******/ 
/******/ }
;