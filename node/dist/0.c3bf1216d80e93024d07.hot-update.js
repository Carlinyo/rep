"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 17:
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
const register_controller_1 = __webpack_require__(18);
const register_service_1 = __webpack_require__(19);
const typeorm_1 = __webpack_require__(7);
const groups_entity_1 = __webpack_require__(12);
const group_user_entity_1 = __webpack_require__(15);
const groupmessages_entity_1 = __webpack_require__(10);
const user_user_message_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'src/model/user_user_message.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let RegisterModule = class RegisterModule {
};
RegisterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, groups_entity_1.groups, group_user_entity_1.Group_User, groupmessages_entity_1.GroupsMessages, user_user_message_entity_1.UserToUserMessage])],
        providers: [register_service_1.RegisterService],
        controllers: [register_controller_1.RegisterController],
        exports: [typeorm_1.TypeOrmModule],
    })
], RegisterModule);
exports.RegisterModule = RegisterModule;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("7841a4a6758edb81b832")
/******/ })();
/******/ 
/******/ }
;