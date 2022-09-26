"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const messages_entity_1 = require("./model/messages.entity");
const user_entity_1 = require("./model/user.entity");
const register_module_1 = require("./register/register.module");
const home_controller_1 = require("./home/home.controller");
const home_module_1 = require("./home/home.module");
const groups_entity_1 = require("./model/groups.entity");
const groupmessages_entity_1 = require("./model/groupmessages.entity");
const chat_service_1 = require("./chat/chat.service");
const chat_module_1 = require("./chat/chat.module");
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
                entities: [user_entity_1.User, messages_entity_1.Messages, groups_entity_1.groups, groupmessages_entity_1.GroupsMessages],
                synchronize: true,
                autoLoadEntities: true
            }),
            register_module_1.RegisterModule,
            home_module_1.HomeModule,
            typeorm_1.TypeOrmModule.forFeature([messages_entity_1.Messages, groupmessages_entity_1.GroupsMessages]),
            chat_module_1.ChatModule
        ],
        controllers: [
            app_controller_1.AppController,
            home_controller_1.HomeController,
        ],
        providers: [app_service_1.AppService, chat_service_1.ChatService],
        exports: [typeorm_1.TypeOrmModule]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map