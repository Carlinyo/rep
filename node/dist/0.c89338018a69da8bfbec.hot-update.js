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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatGateway = void 0;
const common_1 = __webpack_require__(6);
const websockets_1 = __webpack_require__(25);
const chat_service_1 = __webpack_require__(9);
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
    }
    afterInit(server) {
        console.log("Init", server);
    }
    handleConnection(socket) {
        console.log(socket);
        process.nextTick(() => {
            socket.emit("messages");
        });
    }
    handleDisconnect(socket) {
        console.log("disconected", socket);
    }
    handleNewMessage(chat, socket) {
        console.log("New Chat", chat);
        this.chatService.sendMessage(chat);
        socket.emit("newChat", chat);
        socket.broadcast.emit("newChat", chat);
    }
};
__decorate([
    (0, common_1.Bind)((0, websockets_1.MessageBody)(), (0, websockets_1.ConnectedSocket)()),
    (0, websockets_1.SubscribeMessage)("chat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof MessagesDto !== "undefined" && MessagesDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleNewMessage", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [typeof (_a = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _a : Object])
], ChatGateway);
exports.ChatGateway = ChatGateway;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("ceb4a9b2a45aff172294")
/******/ })();
/******/ 
/******/ }
;