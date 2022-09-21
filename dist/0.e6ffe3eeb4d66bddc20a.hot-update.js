"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 7:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(8);
const typeorm_1 = __webpack_require__(9);
const app_controller_1 = __webpack_require__(10);
const app_service_1 = __webpack_require__(11);
const messages_entity_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(12);
const register_service_1 = __webpack_require__(19);
const register_controller_1 = __webpack_require__(20);
const register_module_1 = __webpack_require__(21);
const login_controller_1 = __webpack_require__(14);
const login_module_1 = __webpack_require__(15);
const home_controller_1 = __webpack_require__(22);
const home_module_1 = __webpack_require__(23);
const routes = [
    { path: "", LoginController: login_controller_1.LoginController },
    { path: "register", RegisterController: register_controller_1.RegisterController },
    { path: "home", HomeController: home_controller_1.HomeController },
];
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            Router,
            typeorm_1.TypeOrmModule.forRoot({
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: "root",
                password: "asdasd123",
                database: "chat_db",
                entities: [user_entity_1.User, messages_entity_1.Messages],
                synchronize: true,
            }),
            register_module_1.RegisterModule,
            login_module_1.LoginModule,
            home_module_1.HomeModule,
        ],
        controllers: [
            app_controller_1.AppController,
            register_controller_1.RegisterController,
            login_controller_1.LoginController,
            home_controller_1.HomeController,
        ],
        providers: [app_service_1.AppService, register_service_1.RegisterService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("9d3ddb59a48407d383fb")
/******/ })();
/******/ 
/******/ }
;