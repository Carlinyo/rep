"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = Array(21).concat([
/* 21 */
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
exports.ChatService = void 0;
const common_1 = __webpack_require__(6);
const config_1 = __webpack_require__(23);
const socket_io_client_1 = __webpack_require__(50);
let ChatService = class ChatService {
    connect() {
        this.socket = (0, socket_io_client_1.io)(this.config.get());
    }
};
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object)
], ChatService.prototype, "config", void 0);
ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
exports.ChatService = ChatService;


/***/ }),
/* 22 */,
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(__webpack_require__(24));


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(25), exports);
__exportStar(__webpack_require__(33), exports);
__exportStar(__webpack_require__(40), exports);
__exportStar(__webpack_require__(45), exports);
__exportStar(__webpack_require__(47), exports);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var ConfigModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigModule = void 0;
const common_1 = __webpack_require__(6);
const shared_utils_1 = __webpack_require__(26);
const dotenv = __importStar(__webpack_require__(27));
const dotenv_expand_1 = __webpack_require__(28);
const fs = __importStar(__webpack_require__(29));
const path_1 = __webpack_require__(30);
const config_host_module_1 = __webpack_require__(31);
const config_constants_1 = __webpack_require__(32);
const config_service_1 = __webpack_require__(33);
const create_config_factory_util_1 = __webpack_require__(35);
const get_registration_token_util_1 = __webpack_require__(38);
const merge_configs_util_1 = __webpack_require__(39);
let ConfigModule = ConfigModule_1 = class ConfigModule {
    /**
     * This promise resolves when "dotenv" completes loading environment variables.
     * When "ignoreEnvFile" is set to true, then it will resolve immediately after the
     * "ConfigModule#forRoot" method is called.
     */
    static get envVariablesLoaded() {
        return this._envVariablesLoaded;
    }
    /**
     * Loads process environment variables depending on the "ignoreEnvFile" flag and "envFilePath" value.
     * Also, registers custom configurations globally.
     * @param options
     */
    static forRoot(options = {}) {
        let validatedEnvConfig = undefined;
        let config = options.ignoreEnvFile ? {} : this.loadEnvFile(options);
        if (!options.ignoreEnvVars) {
            config = Object.assign(Object.assign({}, config), process.env);
        }
        if (options.validate) {
            const validatedConfig = options.validate(config);
            validatedEnvConfig = validatedConfig;
            this.assignVariablesToProcess(validatedConfig);
        }
        else if (options.validationSchema) {
            const validationOptions = this.getSchemaValidationOptions(options);
            const { error, value: validatedConfig } = options.validationSchema.validate(config, validationOptions);
            if (error) {
                throw new Error(`Config validation error: ${error.message}`);
            }
            validatedEnvConfig = validatedConfig;
            this.assignVariablesToProcess(validatedConfig);
        }
        else {
            this.assignVariablesToProcess(config);
        }
        const isConfigToLoad = options.load && options.load.length;
        const providers = (options.load || [])
            .map(factory => (0, create_config_factory_util_1.createConfigProvider)(factory))
            .filter(item => item);
        const configProviderTokens = providers.map(item => item.provide);
        const configServiceProvider = {
            provide: config_service_1.ConfigService,
            useFactory: (configService) => {
                if (options.cache) {
                    configService.isCacheEnabled = true;
                }
                return configService;
            },
            inject: [config_constants_1.CONFIGURATION_SERVICE_TOKEN, ...configProviderTokens],
        };
        providers.push(configServiceProvider);
        if (validatedEnvConfig) {
            const validatedEnvConfigLoader = {
                provide: config_constants_1.VALIDATED_ENV_LOADER,
                useFactory: (host) => {
                    host[config_constants_1.VALIDATED_ENV_PROPNAME] = validatedEnvConfig;
                },
                inject: [config_constants_1.CONFIGURATION_TOKEN],
            };
            providers.push(validatedEnvConfigLoader);
        }
        this.environmentVariablesLoadedSignal();
        return {
            module: ConfigModule_1,
            global: options.isGlobal,
            providers: isConfigToLoad
                ? [
                    ...providers,
                    {
                        provide: config_constants_1.CONFIGURATION_LOADER,
                        useFactory: (host, ...configurations) => {
                            configurations.forEach((item, index) => this.mergePartial(host, item, providers[index]));
                        },
                        inject: [config_constants_1.CONFIGURATION_TOKEN, ...configProviderTokens],
                    },
                ]
                : providers,
            exports: [config_service_1.ConfigService, ...configProviderTokens],
        };
    }
    /**
     * Registers configuration object (partial registration).
     * @param config
     */
    static forFeature(config) {
        const configProvider = (0, create_config_factory_util_1.createConfigProvider)(config);
        const serviceProvider = {
            provide: config_service_1.ConfigService,
            useFactory: (configService) => configService,
            inject: [config_constants_1.CONFIGURATION_SERVICE_TOKEN, configProvider.provide],
        };
        return {
            module: ConfigModule_1,
            providers: [
                configProvider,
                serviceProvider,
                {
                    provide: config_constants_1.CONFIGURATION_LOADER,
                    useFactory: (host, partialConfig) => {
                        this.mergePartial(host, partialConfig, configProvider);
                    },
                    inject: [config_constants_1.CONFIGURATION_TOKEN, configProvider.provide],
                },
            ],
            exports: [config_service_1.ConfigService, configProvider.provide],
        };
    }
    static loadEnvFile(options) {
        const envFilePaths = Array.isArray(options.envFilePath)
            ? options.envFilePath
            : [options.envFilePath || (0, path_1.resolve)(process.cwd(), '.env')];
        let config = {};
        for (const envFilePath of envFilePaths) {
            if (fs.existsSync(envFilePath)) {
                config = Object.assign(dotenv.parse(fs.readFileSync(envFilePath)), config);
                if (options.expandVariables) {
                    const expandOptions = typeof options.expandVariables === 'object' ? options.expandVariables : {};
                    config = (0, dotenv_expand_1.expand)(Object.assign(Object.assign({}, expandOptions), { parsed: config })).parsed || config;
                }
            }
        }
        return config;
    }
    static assignVariablesToProcess(config) {
        if (!(0, shared_utils_1.isObject)(config)) {
            return;
        }
        const keys = Object.keys(config).filter(key => !(key in process.env));
        keys.forEach(key => (process.env[key] = config[key]));
    }
    static mergePartial(host, item, provider) {
        const factoryRef = provider.useFactory;
        const token = (0, get_registration_token_util_1.getRegistrationToken)(factoryRef);
        (0, merge_configs_util_1.mergeConfigObject)(host, item, token);
    }
    static getSchemaValidationOptions(options) {
        if (options.validationOptions) {
            if (typeof options.validationOptions.allowUnknown === 'undefined') {
                options.validationOptions.allowUnknown = true;
            }
            return options.validationOptions;
        }
        return {
            abortEarly: false,
            allowUnknown: true,
        };
    }
};
ConfigModule._envVariablesLoaded = new Promise(resolve => (ConfigModule_1.environmentVariablesLoadedSignal = resolve));
ConfigModule = ConfigModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [config_host_module_1.ConfigHostModule],
        providers: [
            {
                provide: config_service_1.ConfigService,
                useExisting: config_constants_1.CONFIGURATION_SERVICE_TOKEN,
            },
        ],
        exports: [config_host_module_1.ConfigHostModule, config_service_1.ConfigService],
    })
], ConfigModule);
exports.ConfigModule = ConfigModule;


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("@nestjs/common/utils/shared.utils");

/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),
/* 28 */
/***/ ((module) => {



function _interpolate (envValue, environment, config) {
  const matches = envValue.match(/(.?\${*[\w]*(?::-[\w/]*)?}*)/g) || []

  return matches.reduce(function (newEnv, match, index) {
    const parts = /(.?)\${*([\w]*(?::-[\w/]*)?)?}*/g.exec(match)
    if (!parts || parts.length === 0) {
      return newEnv
    }

    const prefix = parts[1]

    let value, replacePart

    if (prefix === '\\') {
      replacePart = parts[0]
      value = replacePart.replace('\\$', '$')
    } else {
      const keyParts = parts[2].split(':-')
      const key = keyParts[0]
      replacePart = parts[0].substring(prefix.length)
      // process.env value 'wins' over .env file's value
      value = Object.prototype.hasOwnProperty.call(environment, key)
        ? environment[key]
        : (config.parsed[key] || keyParts[1] || '')

      // If the value is found, remove nested expansions.
      if (keyParts.length > 1 && value) {
        const replaceNested = matches[index + 1]
        matches[index + 1] = ''

        newEnv = newEnv.replace(replaceNested, '')
      }
      // Resolve recursive interpolations
      value = _interpolate(value, environment, config)
    }

    return newEnv.replace(replacePart, value)
  }, envValue)
}

function expand (config) {
  // if ignoring process.env, use a blank object
  const environment = config.ignoreProcessEnv ? {} : process.env

  for (const configKey in config.parsed) {
    const value = Object.prototype.hasOwnProperty.call(environment, configKey) ? environment[configKey] : config.parsed[configKey]

    config.parsed[configKey] = _interpolate(value, environment, config)
  }

  for (const processKey in config.parsed) {
    environment[processKey] = config.parsed[processKey]
  }

  return config
}

module.exports.expand = expand


/***/ }),
/* 29 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigHostModule = void 0;
const common_1 = __webpack_require__(6);
const config_constants_1 = __webpack_require__(32);
const config_service_1 = __webpack_require__(33);
let ConfigHostModule = class ConfigHostModule {
};
ConfigHostModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: config_constants_1.CONFIGURATION_TOKEN,
                useFactory: () => ({}),
            },
            {
                provide: config_constants_1.CONFIGURATION_SERVICE_TOKEN,
                useClass: config_service_1.ConfigService,
            },
        ],
        exports: [config_constants_1.CONFIGURATION_TOKEN, config_constants_1.CONFIGURATION_SERVICE_TOKEN],
    })
], ConfigHostModule);
exports.ConfigHostModule = ConfigHostModule;


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AS_PROVIDER_METHOD_KEY = exports.VALIDATED_ENV_PROPNAME = exports.PARTIAL_CONFIGURATION_PROPNAME = exports.PARTIAL_CONFIGURATION_KEY = exports.VALIDATED_ENV_LOADER = exports.CONFIGURATION_LOADER = exports.CONFIGURATION_TOKEN = exports.CONFIGURATION_SERVICE_TOKEN = void 0;
/**
 * Injection tokens
 */
exports.CONFIGURATION_SERVICE_TOKEN = Symbol('CONFIG_SERVICE');
exports.CONFIGURATION_TOKEN = 'CONFIGURATION_TOKEN';
exports.CONFIGURATION_LOADER = 'CONFIGURATION_LOADER';
exports.VALIDATED_ENV_LOADER = 'VALIDATED_ENV_LOADER';
exports.PARTIAL_CONFIGURATION_KEY = 'PARTIAL_CONFIGURATION_KEY';
exports.PARTIAL_CONFIGURATION_PROPNAME = 'KEY';
exports.VALIDATED_ENV_PROPNAME = '_PROCESS_ENV_VALIDATED';
exports.AS_PROVIDER_METHOD_KEY = 'asProvider';


/***/ }),
/* 33 */
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigService = void 0;
const common_1 = __webpack_require__(6);
const shared_utils_1 = __webpack_require__(26);
const lodash_1 = __webpack_require__(34);
const config_constants_1 = __webpack_require__(32);
let ConfigService = class ConfigService {
    constructor(internalConfig = {}) {
        this.internalConfig = internalConfig;
        this.cache = {};
        this._isCacheEnabled = false;
    }
    set isCacheEnabled(value) {
        this._isCacheEnabled = value;
    }
    get isCacheEnabled() {
        return this._isCacheEnabled;
    }
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * It returns a default value if the key does not exist.
     * @param propertyPath
     * @param defaultValueOrOptions
     */
    get(propertyPath, defaultValueOrOptions, options) {
        const validatedEnvValue = this.getFromValidatedEnv(propertyPath);
        if (!(0, shared_utils_1.isUndefined)(validatedEnvValue)) {
            return validatedEnvValue;
        }
        const defaultValue = this.isGetOptionsObject(defaultValueOrOptions) && !options
            ? undefined
            : defaultValueOrOptions;
        const processEnvValue = this.getFromProcessEnv(propertyPath, defaultValue);
        if (!(0, shared_utils_1.isUndefined)(processEnvValue)) {
            return processEnvValue;
        }
        const internalValue = this.getFromInternalConfig(propertyPath);
        if (!(0, shared_utils_1.isUndefined)(internalValue)) {
            return internalValue;
        }
        return defaultValue;
    }
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * It returns a default value if the key does not exist.
     * If the default value is undefined an exception will be thrown.
     * @param propertyPath
     * @param defaultValueOrOptions
     */
    getOrThrow(propertyPath, defaultValueOrOptions, options) {
        // @ts-expect-error Bypass method overloads
        const value = this.get(propertyPath, defaultValueOrOptions, options);
        if ((0, shared_utils_1.isUndefined)(value)) {
            throw new TypeError(`Configuration key "${propertyPath.toString()}" does not exist`);
        }
        return value;
    }
    getFromCache(propertyPath, defaultValue) {
        const cachedValue = (0, lodash_1.get)(this.cache, propertyPath);
        return (0, shared_utils_1.isUndefined)(cachedValue)
            ? defaultValue
            : cachedValue;
    }
    getFromValidatedEnv(propertyPath) {
        const validatedEnvValue = (0, lodash_1.get)(this.internalConfig[config_constants_1.VALIDATED_ENV_PROPNAME], propertyPath);
        return validatedEnvValue;
    }
    getFromProcessEnv(propertyPath, defaultValue) {
        if (this.isCacheEnabled &&
            (0, lodash_1.has)(this.cache, propertyPath)) {
            const cachedValue = this.getFromCache(propertyPath, defaultValue);
            return !(0, shared_utils_1.isUndefined)(cachedValue) ? cachedValue : defaultValue;
        }
        const processValue = (0, lodash_1.get)(process.env, propertyPath);
        this.setInCacheIfDefined(propertyPath, processValue);
        return processValue;
    }
    getFromInternalConfig(propertyPath) {
        const internalValue = (0, lodash_1.get)(this.internalConfig, propertyPath);
        return internalValue;
    }
    setInCacheIfDefined(propertyPath, value) {
        if (typeof value === 'undefined') {
            return;
        }
        (0, lodash_1.set)(this.cache, propertyPath, value);
    }
    isGetOptionsObject(options) {
        return options && (options === null || options === void 0 ? void 0 : options.infer) && Object.keys(options).length === 1;
    }
};
ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(config_constants_1.CONFIGURATION_TOKEN)),
    __metadata("design:paramtypes", [Object])
], ConfigService);
exports.ConfigService = ConfigService;


/***/ }),
/* 34 */
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createConfigProvider = void 0;
const uuid_1 = __webpack_require__(36);
const get_config_token_util_1 = __webpack_require__(37);
function createConfigProvider(factory) {
    return {
        provide: factory.KEY || (0, get_config_token_util_1.getConfigToken)((0, uuid_1.v4)()),
        useFactory: factory,
        inject: [],
    };
}
exports.createConfigProvider = createConfigProvider;


/***/ }),
/* 36 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfigToken = void 0;
function getConfigToken(token) {
    return `CONFIGURATION(${token})`;
}
exports.getConfigToken = getConfigToken;


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRegistrationToken = void 0;
const config_constants_1 = __webpack_require__(32);
function getRegistrationToken(config) {
    return config[config_constants_1.PARTIAL_CONFIGURATION_KEY];
}
exports.getRegistrationToken = getRegistrationToken;


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mergeConfigObject = void 0;
const lodash_1 = __webpack_require__(34);
function mergeConfigObject(host, partial, token) {
    if (token) {
        (0, lodash_1.set)(host, token, partial);
        return partial;
    }
    Object.assign(host, partial);
}
exports.mergeConfigObject = mergeConfigObject;


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(41), exports);
__exportStar(__webpack_require__(42), exports);
__exportStar(__webpack_require__(43), exports);
__exportStar(__webpack_require__(44), exports);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(46), exports);
__exportStar(__webpack_require__(37), exports);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerAs = void 0;
const __1 = __webpack_require__(24);
const config_constants_1 = __webpack_require__(32);
const get_config_token_util_1 = __webpack_require__(37);
/**
 * Registers the configuration object behind a specified token.
 */
function registerAs(token, configFactory) {
    const defineProperty = (key, value) => {
        Object.defineProperty(configFactory, key, {
            configurable: false,
            enumerable: false,
            value,
            writable: false,
        });
    };
    defineProperty(config_constants_1.PARTIAL_CONFIGURATION_KEY, token);
    defineProperty(config_constants_1.PARTIAL_CONFIGURATION_PROPNAME, (0, get_config_token_util_1.getConfigToken)(token));
    defineProperty(config_constants_1.AS_PROVIDER_METHOD_KEY, () => ({
        imports: [__1.ConfigModule.forFeature(configFactory)],
        useFactory: (config) => config,
        inject: [(0, get_config_token_util_1.getConfigToken)(token)],
    }));
    return configFactory;
}
exports.registerAs = registerAs;


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(48), exports);
__exportStar(__webpack_require__(49), exports);


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("socket.io-client");

/***/ })
]);
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("088bf0835e82270f9184")
/******/ })();
/******/ 
/******/ }
;