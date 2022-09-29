"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = [
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
async function bootstrap() {
    const cors = __webpack_require__(27);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
        cors: true
    });
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    await app.listen(5001);
}
bootstrap();


/***/ }),
/* 4 */,
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const app_controller_1 = __webpack_require__(8);
const app_service_1 = __webpack_require__(15);
const messages_entity_1 = __webpack_require__(14);
const user_entity_1 = __webpack_require__(13);
const register_module_1 = __webpack_require__(16);
const home_controller_1 = __webpack_require__(20);
const home_module_1 = __webpack_require__(21);
const groups_entity_1 = __webpack_require__(12);
const groupmessages_entity_1 = __webpack_require__(10);
const chat_service_1 = __webpack_require__(9);
const chat_module_1 = __webpack_require__(23);
const group_user_entity_1 = __webpack_require__(19);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: "root",
                password: "asdasd123",
                database: "chat_db",
                entities: [user_entity_1.User, messages_entity_1.Messages, groups_entity_1.groups, groupmessages_entity_1.GroupsMessages, group_user_entity_1.Group_User],
                synchronize: true,
                autoLoadEntities: true,
            }),
            register_module_1.RegisterModule,
            home_module_1.HomeModule,
            typeorm_1.TypeOrmModule.forFeature([messages_entity_1.Messages, groupmessages_entity_1.GroupsMessages]),
            chat_module_1.ChatModule,
        ],
        controllers: [app_controller_1.AppController, home_controller_1.HomeController],
        providers: [app_service_1.AppService, chat_service_1.ChatService],
        exports: [typeorm_1.TypeOrmModule],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 6 */,
/* 7 */,
/* 8 */
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
exports.AppController = void 0;
const common_1 = __webpack_require__(6);
const chat_service_1 = __webpack_require__(9);
let AppController = class AppController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    sendMessage(body) {
        this.chatService.sendMessage(body);
    }
    getMessages(id) {
        this.chatService.getUserMessages(id);
    }
    getGroupMessages(groupId) {
        this.chatService.getGroupMessages(groupId);
    }
    sendGroupMessage(body) {
        this.chatService.sendGroupMessage(body);
    }
};
__decorate([
    (0, common_1.Post)("/sendMessage"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)("/getMessages"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)("/getGroupMessages"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getGroupMessages", null);
__decorate([
    (0, common_1.Post)("/sendMessageToGroup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sendGroupMessage", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),
/* 9 */,
/* 10 */
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
exports.GroupsMessages = void 0;
const typeorm_1 = __webpack_require__(11);
const groups_entity_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
let GroupsMessages = class GroupsMessages {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GroupsMessages.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], GroupsMessages.prototype, "from", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => groups_entity_1.groups, (group) => group),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object)
], GroupsMessages.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupsMessages.prototype, "message", void 0);
GroupsMessages = __decorate([
    (0, typeorm_1.Entity)()
], GroupsMessages);
exports.GroupsMessages = GroupsMessages;


/***/ }),
/* 11 */,
/* 12 */
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
exports.groups = void 0;
const typeorm_1 = __webpack_require__(11);
const user_entity_1 = __webpack_require__(13);
let groups = class groups {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], groups.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], groups.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], groups.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], groups.prototype, "groupsId", void 0);
groups = __decorate([
    (0, typeorm_1.Entity)()
], groups);
exports.groups = groups;


/***/ }),
/* 13 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const typeorm_1 = __webpack_require__(11);
const groups_entity_1 = __webpack_require__(12);
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => groups_entity_1.groups, (group) => group),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", typeof (_a = typeof groups_entity_1.groups !== "undefined" && groups_entity_1.groups) === "function" ? _a : Object)
], User.prototype, "group", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;


/***/ }),
/* 14 */
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
exports.Messages = void 0;
const typeorm_1 = __webpack_require__(11);
const user_entity_1 = __webpack_require__(13);
let Messages = class Messages {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Messages.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Messages.prototype, "from", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object)
], Messages.prototype, "to", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Messages.prototype, "message", void 0);
Messages = __decorate([
    (0, typeorm_1.Entity)()
], Messages);
exports.Messages = Messages;


/***/ }),
/* 15 */,
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterModule = void 0;
const common_1 = __webpack_require__(6);
const user_entity_1 = __webpack_require__(13);
const register_controller_1 = __webpack_require__(17);
const register_service_1 = __webpack_require__(18);
const typeorm_1 = __webpack_require__(7);
const groups_entity_1 = __webpack_require__(12);
const group_user_entity_1 = __webpack_require__(19);
let RegisterModule = class RegisterModule {
};
RegisterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, groups_entity_1.groups, group_user_entity_1.Group_User])],
        providers: [register_service_1.RegisterService],
        controllers: [register_controller_1.RegisterController],
        exports: [typeorm_1.TypeOrmModule],
    })
], RegisterModule);
exports.RegisterModule = RegisterModule;


/***/ }),
/* 17 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterController = void 0;
const common_1 = __webpack_require__(6);
const register_service_1 = __webpack_require__(18);
let RegisterController = class RegisterController {
    constructor(regService) {
        this.regService = regService;
    }
    joinToGroup(body) {
        this.regService.JoinToGroup(body);
    }
    leaveGroup(id) {
        this.regService.leaveGroup(id);
    }
    async getUsers() {
        return await this.regService.getUsers();
    }
    async getGroups() {
        return await this.regService.getGroups();
    }
};
__decorate([
    (0, common_1.Post)('/joinToGroup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], RegisterController.prototype, "joinToGroup", null);
__decorate([
    (0, common_1.Post)('/leaveGroup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], RegisterController.prototype, "leaveGroup", null);
__decorate([
    (0, common_1.Get)('/getUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('/getGroups'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "getGroups", null);
RegisterController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof register_service_1.RegisterService !== "undefined" && register_service_1.RegisterService) === "function" ? _a : Object])
], RegisterController);
exports.RegisterController = RegisterController;


/***/ }),
/* 18 */
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
        console.log(user, "user");
        let group = await this.users.find({
            where: { groupsId: user.group },
            relation: ["group"],
        });
        console.log(group);
        let contains = 0;
        group.forEach((el) => {
            if (el.username === user.username) {
                contains = 1;
                return user.username + "_" + Math.round(Math.random() * 100);
            }
        });
        if (group.length < 5 && contains === 0) {
            let User = await this.users.save(user);
            this.group_user.save({
                groupsId: user.group,
                group: user.group,
                user: User.id,
            });
            return group;
        }
        else {
            return "Group is Full";
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
        let Users = await this.users.find();
        console.log(Users);
        return await this.group_user.find({
            relations: ["user", "group"],
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


/***/ }),
/* 19 */
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
exports.Group_User = void 0;
const typeorm_1 = __webpack_require__(11);
const groups_entity_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
let Group_User = class Group_User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Group_User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => groups_entity_1.groups, (group) => group),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Group_User.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Group_User.prototype, "user", void 0);
Group_User = __decorate([
    (0, typeorm_1.Entity)()
], Group_User);
exports.Group_User = Group_User;


/***/ }),
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
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
const message_dto_1 = __webpack_require__(26);
const chat_service_1 = __webpack_require__(9);
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
    }
    afterInit(server) {
        console.log("Init", server);
    }
    handleConnection(socket) {
        process.nextTick(() => {
            socket.emit("messages");
        });
    }
    handleDisconnect(socket) {
        console.log("disconected", socket);
    }
    handleNewMessage(chat, socket) {
        this.chatService.sendMessage(chat);
        socket.emit("newChat", chat);
        socket.broadcast.emit("newChat", chat);
    }
};
__decorate([
    (0, common_1.Bind)((0, websockets_1.MessageBody)(), (0, websockets_1.ConnectedSocket)()),
    (0, websockets_1.SubscribeMessage)("chat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof message_dto_1.MessageDto !== "undefined" && message_dto_1.MessageDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleNewMessage", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [typeof (_a = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _a : Object])
], ChatGateway);
exports.ChatGateway = ChatGateway;


/***/ }),
/* 25 */,
/* 26 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageDto = void 0;
class MessageDto {
}
exports.MessageDto = MessageDto;


/***/ })
];
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("c862763d9051a476f337")
/******/ })();
/******/ 
/******/ }
;