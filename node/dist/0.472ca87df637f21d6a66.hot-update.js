exports.id = 0;
exports.ids = null;
exports.modules = [
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const socketstrategy_1 = __webpack_require__(51);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    const socketIoClientProvider = app.get(SocketIoClientProvider);
    app.connectMicroservice({
        strategy: new socketstrategy_1.SocketIoClientStrategy(socketIoClientProvider.getSocket()),
    });
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    await app.listen(3000);
}
bootstrap();


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketIoClientStrategy = void 0;
const microservices_1 = __webpack_require__(52);
class SocketIoClientStrategy extends microservices_1.Server {
    constructor(client) {
        super();
        this.client = client;
    }
    listen(callback) {
        this.client.on('connection', () => {
            console.log('connect');
        });
        this.client.on('error', (error) => {
            console.log(error);
        });
        this.messageHandlers.forEach((handler, pattern) => {
            this.client.on(pattern, (data) => {
                handler(data, this.client);
            });
        });
        callback();
    }
    close() {
        this.client.disconnect();
    }
}
exports.SocketIoClientStrategy = SocketIoClientStrategy;


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
/*
 * Nest @microservices
 * Copyright(c) 2017 - 2022 Kamil Mysliwiec
 * https://nestjs.com
 * MIT Licensed
 */
__webpack_require__(54);
tslib_1.__exportStar(__webpack_require__(55), exports);
tslib_1.__exportStar(__webpack_require__(114), exports);
tslib_1.__exportStar(__webpack_require__(122), exports);
tslib_1.__exportStar(__webpack_require__(79), exports);
tslib_1.__exportStar(__webpack_require__(133), exports);
tslib_1.__exportStar(__webpack_require__(82), exports);
tslib_1.__exportStar(__webpack_require__(138), exports);
tslib_1.__exportStar(__webpack_require__(151), exports);
tslib_1.__exportStar(__webpack_require__(155), exports);
tslib_1.__exportStar(__webpack_require__(97), exports);
tslib_1.__exportStar(__webpack_require__(187), exports);
tslib_1.__exportStar(__webpack_require__(199), exports);


/***/ }),
/* 53 */
/***/ ((module) => {

"use strict";
module.exports = require("tslib");

/***/ }),
/* 54 */
/***/ ((module) => {

"use strict";
module.exports = require("reflect-metadata");

/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientProxyFactory = void 0;
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(56), exports);
tslib_1.__exportStar(__webpack_require__(76), exports);
tslib_1.__exportStar(__webpack_require__(95), exports);
tslib_1.__exportStar(__webpack_require__(101), exports);
tslib_1.__exportStar(__webpack_require__(66), exports);
var client_proxy_factory_1 = __webpack_require__(107);
Object.defineProperty(exports, "ClientProxyFactory", ({ enumerable: true, get: function () { return client_proxy_factory_1.ClientProxyFactory; } }));
tslib_1.__exportStar(__webpack_require__(108), exports);
tslib_1.__exportStar(__webpack_require__(109), exports);
tslib_1.__exportStar(__webpack_require__(112), exports);


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientGrpcProxy = void 0;
const logger_service_1 = __webpack_require__(57);
const load_package_util_1 = __webpack_require__(58);
const shared_utils_1 = __webpack_require__(26);
const rxjs_1 = __webpack_require__(59);
const constants_1 = __webpack_require__(60);
const invalid_grpc_package_exception_1 = __webpack_require__(62);
const invalid_grpc_service_exception_1 = __webpack_require__(64);
const invalid_proto_definition_exception_1 = __webpack_require__(65);
const client_proxy_1 = __webpack_require__(66);
const constants_2 = __webpack_require__(74);
let grpcPackage = {};
let grpcProtoLoaderPackage = {};
class ClientGrpcProxy extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        this.clients = new Map();
        this.grpcClients = [];
        this.url = this.getOptionsProp(options, 'url') || constants_1.GRPC_DEFAULT_URL;
        const protoLoader = this.getOptionsProp(options, 'protoLoader') || constants_1.GRPC_DEFAULT_PROTO_LOADER;
        grpcPackage = (0, load_package_util_1.loadPackage)('@grpc/grpc-js', ClientGrpcProxy.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@grpc/grpc-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        grpcProtoLoaderPackage = (0, load_package_util_1.loadPackage)(protoLoader, ClientGrpcProxy.name, () => protoLoader === constants_1.GRPC_DEFAULT_PROTO_LOADER
            ? __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@grpc/proto-loader'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
            : __webpack_require__(75)(protoLoader));
        this.grpcClients = this.createClients();
    }
    getService(name) {
        const grpcClient = this.createClientByServiceName(name);
        const clientRef = this.getClient(name);
        if (!clientRef) {
            throw new invalid_grpc_service_exception_1.InvalidGrpcServiceException(name);
        }
        const protoMethods = Object.keys(clientRef[name].prototype);
        const grpcService = {};
        protoMethods.forEach(m => {
            grpcService[m] = this.createServiceMethod(grpcClient, m);
        });
        return grpcService;
    }
    getClientByServiceName(name) {
        return this.clients.get(name) || this.createClientByServiceName(name);
    }
    createClientByServiceName(name) {
        const clientRef = this.getClient(name);
        if (!clientRef) {
            throw new invalid_grpc_service_exception_1.InvalidGrpcServiceException(name);
        }
        const channelOptions = this.options && this.options.channelOptions
            ? this.options.channelOptions
            : {};
        if (this.options && this.options.maxSendMessageLength) {
            channelOptions['grpc.max_send_message_length'] =
                this.options.maxSendMessageLength;
        }
        if (this.options && this.options.maxReceiveMessageLength) {
            channelOptions['grpc.max_receive_message_length'] =
                this.options.maxReceiveMessageLength;
        }
        if (this.options && this.options.maxMetadataSize) {
            channelOptions['grpc.max_metadata_size'] = this.options.maxMetadataSize;
        }
        const keepaliveOptions = this.getKeepaliveOptions();
        const options = Object.assign(Object.assign({}, channelOptions), keepaliveOptions);
        const credentials = this.options.credentials || grpcPackage.credentials.createInsecure();
        const grpcClient = new clientRef[name](this.url, credentials, options);
        this.clients.set(name, grpcClient);
        return grpcClient;
    }
    getKeepaliveOptions() {
        if (!(0, shared_utils_1.isObject)(this.options.keepalive)) {
            return {};
        }
        const keepaliveKeys = {
            keepaliveTimeMs: 'grpc.keepalive_time_ms',
            keepaliveTimeoutMs: 'grpc.keepalive_timeout_ms',
            keepalivePermitWithoutCalls: 'grpc.keepalive_permit_without_calls',
            http2MaxPingsWithoutData: 'grpc.http2.max_pings_without_data',
            http2MinTimeBetweenPingsMs: 'grpc.http2.min_time_between_pings_ms',
            http2MinPingIntervalWithoutDataMs: 'grpc.http2.min_ping_interval_without_data_ms',
            http2MaxPingStrikes: 'grpc.http2.max_ping_strikes',
        };
        const keepaliveOptions = {};
        for (const [optionKey, optionValue] of Object.entries(this.options.keepalive)) {
            const key = keepaliveKeys[optionKey];
            if (key === undefined) {
                continue;
            }
            keepaliveOptions[key] = optionValue;
        }
        return keepaliveOptions;
    }
    createServiceMethod(client, methodName) {
        return client[methodName].responseStream
            ? this.createStreamServiceMethod(client, methodName)
            : this.createUnaryServiceMethod(client, methodName);
    }
    createStreamServiceMethod(client, methodName) {
        return (...args) => {
            const isRequestStream = client[methodName].requestStream;
            const stream = new rxjs_1.Observable(observer => {
                let isClientCanceled = false;
                let upstreamSubscription;
                const upstreamSubjectOrData = args[0];
                const maybeMetadata = args[1];
                const isUpstreamSubject = upstreamSubjectOrData && (0, shared_utils_1.isFunction)(upstreamSubjectOrData.subscribe);
                const call = isRequestStream && isUpstreamSubject
                    ? client[methodName](maybeMetadata)
                    : client[methodName](...args);
                if (isRequestStream && isUpstreamSubject) {
                    upstreamSubscription = upstreamSubjectOrData.subscribe((val) => call.write(val), (err) => call.emit('error', err), () => call.end());
                }
                call.on('data', (data) => observer.next(data));
                call.on('error', (error) => {
                    if (error.details === constants_2.GRPC_CANCELLED) {
                        call.destroy();
                        if (isClientCanceled) {
                            return;
                        }
                    }
                    observer.error(this.serializeError(error));
                });
                call.on('end', () => {
                    if (upstreamSubscription) {
                        upstreamSubscription.unsubscribe();
                        upstreamSubscription = null;
                    }
                    call.removeAllListeners();
                    observer.complete();
                });
                return () => {
                    if (upstreamSubscription) {
                        upstreamSubscription.unsubscribe();
                        upstreamSubscription = null;
                    }
                    if (call.finished) {
                        return undefined;
                    }
                    isClientCanceled = true;
                    call.cancel();
                };
            });
            return stream;
        };
    }
    createUnaryServiceMethod(client, methodName) {
        return (...args) => {
            const isRequestStream = client[methodName].requestStream;
            const upstreamSubjectOrData = args[0];
            const isUpstreamSubject = upstreamSubjectOrData && (0, shared_utils_1.isFunction)(upstreamSubjectOrData.subscribe);
            if (isRequestStream && isUpstreamSubject) {
                return new rxjs_1.Observable(observer => {
                    const callArgs = [
                        (error, data) => {
                            if (error) {
                                return observer.error(this.serializeError(error));
                            }
                            observer.next(data);
                            observer.complete();
                        },
                    ];
                    const maybeMetadata = args[1];
                    if (maybeMetadata) {
                        callArgs.unshift(maybeMetadata);
                    }
                    const call = client[methodName](...callArgs);
                    const upstreamSubscription = upstreamSubjectOrData.subscribe((val) => call.write(val), (err) => call.emit('error', err), () => call.end());
                    return () => {
                        upstreamSubscription.unsubscribe();
                    };
                });
            }
            return new rxjs_1.Observable(observer => {
                const call = client[methodName](...args, (error, data) => {
                    if (error) {
                        return observer.error(this.serializeError(error));
                    }
                    observer.next(data);
                    observer.complete();
                });
                return () => {
                    if (!call.finished) {
                        call.cancel();
                    }
                };
            });
        };
    }
    createClients() {
        const grpcContext = this.loadProto();
        const packageOption = this.getOptionsProp(this.options, 'package');
        const grpcPackages = [];
        const packageNames = Array.isArray(packageOption)
            ? packageOption
            : [packageOption];
        for (const packageName of packageNames) {
            const grpcPkg = this.lookupPackage(grpcContext, packageName);
            if (!grpcPkg) {
                const invalidPackageError = new invalid_grpc_package_exception_1.InvalidGrpcPackageException(packageName);
                this.logger.error(invalidPackageError.message, invalidPackageError.stack);
                throw invalidPackageError;
            }
            grpcPackages.push(grpcPkg);
        }
        return grpcPackages;
    }
    loadProto() {
        try {
            const file = this.getOptionsProp(this.options, 'protoPath');
            const loader = this.getOptionsProp(this.options, 'loader');
            const packageDefinition = this.getOptionsProp(this.options, 'packageDefinition') ||
                grpcProtoLoaderPackage.loadSync(file, loader);
            const packageObject = grpcPackage.loadPackageDefinition(packageDefinition);
            return packageObject;
        }
        catch (err) {
            const invalidProtoError = new invalid_proto_definition_exception_1.InvalidProtoDefinitionException(err.path);
            const message = err && err.message ? err.message : invalidProtoError.message;
            this.logger.error(message, invalidProtoError.stack);
            throw invalidProtoError;
        }
    }
    lookupPackage(root, packageName) {
        /** Reference: https://github.com/kondi/rxjs-grpc */
        let pkg = root;
        if (packageName) {
            for (const name of packageName.split('.')) {
                pkg = pkg[name];
            }
        }
        return pkg;
    }
    close() {
        this.grpcClients
            .filter(client => client && (0, shared_utils_1.isFunction)(client.close))
            .forEach(client => client.close());
        this.grpcClients = [];
    }
    async connect() {
        throw new Error('The "connect()" method is not supported in gRPC mode.');
    }
    send(pattern, data) {
        throw new Error('Method is not supported in gRPC mode. Use ClientGrpc instead (learn more in the documentation).');
    }
    getClient(name) {
        return this.grpcClients.find(client => client.hasOwnProperty(name));
    }
    publish(packet, callback) {
        throw new Error('Method is not supported in gRPC mode. Use ClientGrpc instead (learn more in the documentation).');
    }
    async dispatchEvent(packet) {
        throw new Error('Method is not supported in gRPC mode. Use ClientGrpc instead (learn more in the documentation).');
    }
}
exports.ClientGrpcProxy = ClientGrpcProxy;


/***/ }),
/* 57 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/services/logger.service");

/***/ }),
/* 58 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/utils/load-package.util");

/***/ }),
/* 59 */
/***/ ((module) => {

"use strict";
module.exports = require("rxjs");

/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CONNECTION_FAILED_MESSAGE = exports.EADDRINUSE = exports.CONN_ERR = exports.ECONNREFUSED = exports.MQTT_WILDCARD_ALL = exports.MQTT_WILDCARD_SINGLE = exports.MQTT_SEPARATOR = exports.KAFKA_DEFAULT_GROUP = exports.KAFKA_DEFAULT_CLIENT = exports.DISCONNECTED_RMQ_MESSAGE = exports.NO_MESSAGE_HANDLER = exports.NO_EVENT_HANDLER = exports.GRPC_DEFAULT_PROTO_LOADER = exports.RQM_DEFAULT_NO_ASSERT = exports.RQM_DEFAULT_PERSISTENT = exports.RQM_DEFAULT_NOACK = exports.RQM_DEFAULT_QUEUE_OPTIONS = exports.RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT = exports.RQM_DEFAULT_PREFETCH_COUNT = exports.RQM_DEFAULT_QUEUE = exports.REPLY_PATTERN_METADATA = exports.REQUEST_PATTERN_METADATA = exports.PARAM_ARGS_METADATA = exports.CLIENT_METADATA = exports.PATTERN_HANDLER_METADATA = exports.CLIENT_CONFIGURATION_METADATA = exports.TRANSPORT_METADATA = exports.PATTERN_EXTRAS_METADATA = exports.PATTERN_METADATA = exports.CANCEL_EVENT = exports.SUBSCRIBE = exports.CLOSE_EVENT = exports.ERROR_EVENT = exports.DATA_EVENT = exports.MESSAGE_EVENT = exports.CONNECT_FAILED_EVENT = exports.DISCONNECT_EVENT = exports.CONNECT_EVENT = exports.KAFKA_DEFAULT_BROKER = exports.RQM_DEFAULT_URL = exports.GRPC_DEFAULT_URL = exports.MQTT_DEFAULT_URL = exports.NATS_DEFAULT_URL = exports.REDIS_DEFAULT_HOST = exports.REDIS_DEFAULT_PORT = exports.TCP_DEFAULT_HOST = exports.TCP_DEFAULT_PORT = void 0;
const constants_1 = __webpack_require__(61);
exports.TCP_DEFAULT_PORT = 3000;
exports.TCP_DEFAULT_HOST = 'localhost';
exports.REDIS_DEFAULT_PORT = 6379;
exports.REDIS_DEFAULT_HOST = 'localhost';
exports.NATS_DEFAULT_URL = 'nats://localhost:4222';
exports.MQTT_DEFAULT_URL = 'mqtt://localhost:1883';
exports.GRPC_DEFAULT_URL = 'localhost:5000';
exports.RQM_DEFAULT_URL = 'amqp://localhost';
exports.KAFKA_DEFAULT_BROKER = 'localhost:9092';
exports.CONNECT_EVENT = 'connect';
exports.DISCONNECT_EVENT = 'disconnect';
exports.CONNECT_FAILED_EVENT = 'connectFailed';
exports.MESSAGE_EVENT = 'message';
exports.DATA_EVENT = 'data';
exports.ERROR_EVENT = 'error';
exports.CLOSE_EVENT = 'close';
exports.SUBSCRIBE = 'subscribe';
exports.CANCEL_EVENT = 'cancelled';
exports.PATTERN_METADATA = 'microservices:pattern';
exports.PATTERN_EXTRAS_METADATA = 'microservices:pattern_extras';
exports.TRANSPORT_METADATA = 'microservices:transport';
exports.CLIENT_CONFIGURATION_METADATA = 'microservices:client';
exports.PATTERN_HANDLER_METADATA = 'microservices:handler_type';
exports.CLIENT_METADATA = 'microservices:is_client_instance';
exports.PARAM_ARGS_METADATA = constants_1.ROUTE_ARGS_METADATA;
exports.REQUEST_PATTERN_METADATA = 'microservices:request_pattern';
exports.REPLY_PATTERN_METADATA = 'microservices:reply_pattern';
exports.RQM_DEFAULT_QUEUE = 'default';
exports.RQM_DEFAULT_PREFETCH_COUNT = 0;
exports.RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT = false;
exports.RQM_DEFAULT_QUEUE_OPTIONS = {};
exports.RQM_DEFAULT_NOACK = true;
exports.RQM_DEFAULT_PERSISTENT = false;
exports.RQM_DEFAULT_NO_ASSERT = false;
exports.GRPC_DEFAULT_PROTO_LOADER = '@grpc/proto-loader';
const NO_EVENT_HANDLER = (text, pattern) => `There is no matching event handler defined in the remote service. Event pattern: ${pattern}`;
exports.NO_EVENT_HANDLER = NO_EVENT_HANDLER;
exports.NO_MESSAGE_HANDLER = `There is no matching message handler defined in the remote service.`;
exports.DISCONNECTED_RMQ_MESSAGE = `Disconnected from RMQ. Trying to reconnect.`;
exports.KAFKA_DEFAULT_CLIENT = 'nestjs-consumer';
exports.KAFKA_DEFAULT_GROUP = 'nestjs-group';
exports.MQTT_SEPARATOR = '/';
exports.MQTT_WILDCARD_SINGLE = '+';
exports.MQTT_WILDCARD_ALL = '#';
exports.ECONNREFUSED = 'ECONNREFUSED';
exports.CONN_ERR = 'CONN_ERR';
exports.EADDRINUSE = 'EADDRINUSE';
exports.CONNECTION_FAILED_MESSAGE = 'Connection to transport failed. Trying to reconnect...';


/***/ }),
/* 61 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/constants");

/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvalidGrpcPackageException = void 0;
const runtime_exception_1 = __webpack_require__(63);
class InvalidGrpcPackageException extends runtime_exception_1.RuntimeException {
    constructor(name) {
        super(`The invalid gRPC package (package "${name}" not found)`);
    }
}
exports.InvalidGrpcPackageException = InvalidGrpcPackageException;


/***/ }),
/* 63 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/errors/exceptions/runtime.exception");

/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvalidGrpcServiceException = void 0;
const runtime_exception_1 = __webpack_require__(63);
class InvalidGrpcServiceException extends runtime_exception_1.RuntimeException {
    constructor(name) {
        super(`The invalid gRPC service (service "${name}" not found)`);
    }
}
exports.InvalidGrpcServiceException = InvalidGrpcServiceException;


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvalidProtoDefinitionException = void 0;
const runtime_exception_1 = __webpack_require__(63);
class InvalidProtoDefinitionException extends runtime_exception_1.RuntimeException {
    constructor(path) {
        super(`The invalid .proto definition (file at "${path}" not found)`);
    }
}
exports.InvalidProtoDefinitionException = InvalidProtoDefinitionException;


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientProxy = void 0;
const random_string_generator_util_1 = __webpack_require__(67);
const shared_utils_1 = __webpack_require__(26);
const rxjs_1 = __webpack_require__(59);
const operators_1 = __webpack_require__(68);
const constants_1 = __webpack_require__(60);
const incoming_response_deserializer_1 = __webpack_require__(69);
const invalid_message_exception_1 = __webpack_require__(70);
const identity_serializer_1 = __webpack_require__(71);
const utils_1 = __webpack_require__(72);
class ClientProxy {
    constructor() {
        this.routingMap = new Map();
    }
    send(pattern, data) {
        if ((0, shared_utils_1.isNil)(pattern) || (0, shared_utils_1.isNil)(data)) {
            return (0, rxjs_1.throwError)(() => new invalid_message_exception_1.InvalidMessageException());
        }
        return (0, rxjs_1.defer)(async () => this.connect()).pipe((0, operators_1.mergeMap)(() => new rxjs_1.Observable((observer) => {
            const callback = this.createObserver(observer);
            return this.publish({ pattern, data }, callback);
        })));
    }
    emit(pattern, data) {
        if ((0, shared_utils_1.isNil)(pattern) || (0, shared_utils_1.isNil)(data)) {
            return (0, rxjs_1.throwError)(() => new invalid_message_exception_1.InvalidMessageException());
        }
        const source = (0, rxjs_1.defer)(async () => this.connect()).pipe((0, operators_1.mergeMap)(() => this.dispatchEvent({ pattern, data })));
        const connectableSource = (0, rxjs_1.connectable)(source, {
            connector: () => new rxjs_1.Subject(),
            resetOnDisconnect: false,
        });
        connectableSource.connect();
        return connectableSource;
    }
    createObserver(observer) {
        return ({ err, response, isDisposed }) => {
            if (err) {
                return observer.error(this.serializeError(err));
            }
            else if (response !== undefined && isDisposed) {
                observer.next(this.serializeResponse(response));
                return observer.complete();
            }
            else if (isDisposed) {
                return observer.complete();
            }
            observer.next(this.serializeResponse(response));
        };
    }
    serializeError(err) {
        return err;
    }
    serializeResponse(response) {
        return response;
    }
    assignPacketId(packet) {
        const id = (0, random_string_generator_util_1.randomStringGenerator)();
        return Object.assign(packet, { id });
    }
    connect$(instance, errorEvent = constants_1.ERROR_EVENT, connectEvent = constants_1.CONNECT_EVENT) {
        const error$ = (0, rxjs_1.fromEvent)(instance, errorEvent).pipe((0, operators_1.map)((err) => {
            throw err;
        }));
        const connect$ = (0, rxjs_1.fromEvent)(instance, connectEvent);
        return (0, rxjs_1.merge)(error$, connect$).pipe((0, operators_1.take)(1));
    }
    getOptionsProp(obj, prop, defaultValue = undefined) {
        return (obj && obj[prop]) || defaultValue;
    }
    normalizePattern(pattern) {
        return (0, utils_1.transformPatternToRoute)(pattern);
    }
    initializeSerializer(options) {
        this.serializer =
            (options &&
                options.serializer) ||
                new identity_serializer_1.IdentitySerializer();
    }
    initializeDeserializer(options) {
        this.deserializer =
            (options &&
                options.deserializer) ||
                new incoming_response_deserializer_1.IncomingResponseDeserializer();
    }
}
exports.ClientProxy = ClientProxy;


/***/ }),
/* 67 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/utils/random-string-generator.util");

/***/ }),
/* 68 */
/***/ ((module) => {

"use strict";
module.exports = require("rxjs/operators");

/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IncomingResponseDeserializer = void 0;
const shared_utils_1 = __webpack_require__(26);
class IncomingResponseDeserializer {
    deserialize(value, options) {
        return this.isExternal(value) ? this.mapToSchema(value) : value;
    }
    isExternal(value) {
        if (!value) {
            return true;
        }
        if (!(0, shared_utils_1.isUndefined)(value.err) ||
            !(0, shared_utils_1.isUndefined)(value.response) ||
            !(0, shared_utils_1.isUndefined)(value.isDisposed)) {
            return false;
        }
        return true;
    }
    mapToSchema(value) {
        return {
            id: value && value.id,
            response: value,
            isDisposed: true,
        };
    }
}
exports.IncomingResponseDeserializer = IncomingResponseDeserializer;


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvalidMessageException = void 0;
const runtime_exception_1 = __webpack_require__(63);
class InvalidMessageException extends runtime_exception_1.RuntimeException {
    constructor() {
        super(`The invalid data or message pattern (undefined/null)`);
    }
}
exports.InvalidMessageException = InvalidMessageException;


/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IdentitySerializer = void 0;
class IdentitySerializer {
    serialize(value) {
        return value;
    }
}
exports.IdentitySerializer = IdentitySerializer;


/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(73), exports);


/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transformPatternToRoute = void 0;
const shared_utils_1 = __webpack_require__(26);
/**
 * Transforms the Pattern to Route.
 * 1. If Pattern is a `string`, it will be returned as it is.
 * 2. If Pattern is a `number`, it will be converted to `string`.
 * 3. If Pattern is a `JSON` object, it will be transformed to Route. For that end,
 * the function will sort properties of `JSON` Object and creates `route` string
 * according to the following template:
 * <key1>:<value1>/<key2>:<value2>/.../<keyN>:<valueN>
 *
 * @param  {MsPattern} pattern - client pattern
 * @returns string
 */
function transformPatternToRoute(pattern) {
    if ((0, shared_utils_1.isString)(pattern) || (0, shared_utils_1.isNumber)(pattern)) {
        return `${pattern}`;
    }
    if (!(0, shared_utils_1.isObject)(pattern)) {
        return pattern;
    }
    const sortedKeys = Object.keys(pattern).sort((a, b) => ('' + a).localeCompare(b));
    // Creates the array of Pattern params from sorted keys and their corresponding values
    const sortedPatternParams = sortedKeys.map(key => {
        let partialRoute = `"${key}":`;
        partialRoute += (0, shared_utils_1.isString)(pattern[key])
            ? `"${transformPatternToRoute(pattern[key])}"`
            : transformPatternToRoute(pattern[key]);
        return partialRoute;
    });
    const route = sortedPatternParams.join(',');
    return `{${route}}`;
}
exports.transformPatternToRoute = transformPatternToRoute;


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RABBITMQ_REPLY_QUEUE = exports.GRPC_CANCELLED = void 0;
exports.GRPC_CANCELLED = 'Cancelled';
exports.RABBITMQ_REPLY_QUEUE = 'amq.rabbitmq.reply-to';


/***/ }),
/* 75 */
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 75;
module.exports = webpackEmptyContext;

/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientKafka = void 0;
const logger_service_1 = __webpack_require__(57);
const load_package_util_1 = __webpack_require__(58);
const shared_utils_1 = __webpack_require__(26);
const constants_1 = __webpack_require__(60);
const kafka_response_deserializer_1 = __webpack_require__(77);
const enums_1 = __webpack_require__(79);
const invalid_kafka_client_topic_exception_1 = __webpack_require__(81);
const helpers_1 = __webpack_require__(82);
const kafka_request_serializer_1 = __webpack_require__(94);
const client_proxy_1 = __webpack_require__(66);
let kafkaPackage = {};
class ClientKafka extends client_proxy_1.ClientProxy {
    constructor(options) {
        var _a;
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(ClientKafka.name);
        this.client = null;
        this.consumer = null;
        this.producer = null;
        this.parser = null;
        this.responsePatterns = [];
        this.consumerAssignments = {};
        const clientOptions = this.getOptionsProp(this.options, 'client') || {};
        const consumerOptions = this.getOptionsProp(this.options, 'consumer') || {};
        const postfixId = (_a = this.getOptionsProp(this.options, 'postfixId')) !== null && _a !== void 0 ? _a : '-client';
        this.producerOnlyMode =
            this.getOptionsProp(this.options, 'producerOnlyMode') || false;
        this.brokers = clientOptions.brokers || [constants_1.KAFKA_DEFAULT_BROKER];
        // Append a unique id to the clientId and groupId
        // so they don't collide with a microservices client
        this.clientId =
            (clientOptions.clientId || constants_1.KAFKA_DEFAULT_CLIENT) + postfixId;
        this.groupId = (consumerOptions.groupId || constants_1.KAFKA_DEFAULT_GROUP) + postfixId;
        kafkaPackage = (0, load_package_util_1.loadPackage)('kafkajs', ClientKafka.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'kafkajs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.parser = new helpers_1.KafkaParser((options && options.parser) || undefined);
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    subscribeToResponseOf(pattern) {
        const request = this.normalizePattern(pattern);
        this.responsePatterns.push(this.getResponsePatternName(request));
    }
    async close() {
        this.producer && (await this.producer.disconnect());
        this.consumer && (await this.consumer.disconnect());
        this.producer = null;
        this.consumer = null;
        this.client = null;
    }
    async connect() {
        if (this.client) {
            return this.producer;
        }
        this.client = this.createClient();
        if (!this.producerOnlyMode) {
            const partitionAssigners = [
                (config) => new helpers_1.KafkaReplyPartitionAssigner(this, config),
            ];
            const consumerOptions = Object.assign({
                partitionAssigners,
            }, this.options.consumer || {}, {
                groupId: this.groupId,
            });
            this.consumer = this.client.consumer(consumerOptions);
            // set member assignments on join and rebalance
            this.consumer.on(this.consumer.events.GROUP_JOIN, this.setConsumerAssignments.bind(this));
            await this.consumer.connect();
            await this.bindTopics();
        }
        this.producer = this.client.producer(this.options.producer || {});
        await this.producer.connect();
        return this.producer;
    }
    async bindTopics() {
        if (!this.consumer) {
            throw Error('No consumer initialized');
        }
        const consumerSubscribeOptions = this.options.subscribe || {};
        const subscribeTo = async (responsePattern) => this.consumer.subscribe(Object.assign({ topic: responsePattern }, consumerSubscribeOptions));
        await Promise.all(this.responsePatterns.map(subscribeTo));
        await this.consumer.run(Object.assign(this.options.run || {}, {
            eachMessage: this.createResponseCallback(),
        }));
    }
    createClient() {
        const kafkaConfig = Object.assign({ logCreator: helpers_1.KafkaLogger.bind(null, this.logger) }, this.options.client, { brokers: this.brokers, clientId: this.clientId });
        return new kafkaPackage.Kafka(kafkaConfig);
    }
    createResponseCallback() {
        return async (payload) => {
            const rawMessage = this.parser.parse(Object.assign(payload.message, {
                topic: payload.topic,
                partition: payload.partition,
            }));
            if ((0, shared_utils_1.isUndefined)(rawMessage.headers[enums_1.KafkaHeaders.CORRELATION_ID])) {
                return;
            }
            const { err, response, isDisposed, id } = await this.deserializer.deserialize(rawMessage);
            const callback = this.routingMap.get(id);
            if (!callback) {
                return;
            }
            if (err || isDisposed) {
                return callback({
                    err,
                    response,
                    isDisposed,
                });
            }
            callback({
                err,
                response,
            });
        };
    }
    getConsumerAssignments() {
        return this.consumerAssignments;
    }
    async dispatchEvent(packet) {
        const pattern = this.normalizePattern(packet.pattern);
        const outgoingEvent = await this.serializer.serialize(packet.data, {
            pattern,
        });
        const message = Object.assign({
            topic: pattern,
            messages: [outgoingEvent],
        }, this.options.send || {});
        return this.producer.send(message);
    }
    getReplyTopicPartition(topic) {
        const minimumPartition = this.consumerAssignments[topic];
        if ((0, shared_utils_1.isUndefined)(minimumPartition)) {
            throw new invalid_kafka_client_topic_exception_1.InvalidKafkaClientTopicException(topic);
        }
        // get the minimum partition
        return minimumPartition.toString();
    }
    publish(partialPacket, callback) {
        const packet = this.assignPacketId(partialPacket);
        this.routingMap.set(packet.id, callback);
        const cleanup = () => this.routingMap.delete(packet.id);
        const errorCallback = (err) => {
            cleanup();
            callback({ err });
        };
        try {
            const pattern = this.normalizePattern(partialPacket.pattern);
            const replyTopic = this.getResponsePatternName(pattern);
            const replyPartition = this.getReplyTopicPartition(replyTopic);
            Promise.resolve(this.serializer.serialize(packet.data, { pattern }))
                .then((serializedPacket) => {
                serializedPacket.headers[enums_1.KafkaHeaders.CORRELATION_ID] = packet.id;
                serializedPacket.headers[enums_1.KafkaHeaders.REPLY_TOPIC] = replyTopic;
                serializedPacket.headers[enums_1.KafkaHeaders.REPLY_PARTITION] =
                    replyPartition;
                const message = Object.assign({
                    topic: pattern,
                    messages: [serializedPacket],
                }, this.options.send || {});
                return this.producer.send(message);
            })
                .catch(err => errorCallback(err));
            return cleanup;
        }
        catch (err) {
            errorCallback(err);
        }
    }
    getResponsePatternName(pattern) {
        return `${pattern}.reply`;
    }
    setConsumerAssignments(data) {
        const consumerAssignments = {};
        // only need to set the minimum
        Object.keys(data.payload.memberAssignment).forEach(memberId => {
            const minimumPartition = Math.min(...data.payload.memberAssignment[memberId]);
            consumerAssignments[memberId] = minimumPartition;
        });
        this.consumerAssignments = consumerAssignments;
    }
    initializeSerializer(options) {
        this.serializer =
            (options && options.serializer) || new kafka_request_serializer_1.KafkaRequestSerializer();
    }
    initializeDeserializer(options) {
        this.deserializer =
            (options && options.deserializer) || new kafka_response_deserializer_1.KafkaResponseDeserializer();
    }
    commitOffsets(topicPartitions) {
        if (this.consumer) {
            return this.consumer.commitOffsets(topicPartitions);
        }
        else {
            throw new Error('No consumer initialized');
        }
    }
}
exports.ClientKafka = ClientKafka;


/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaResponseDeserializer = void 0;
const shared_utils_1 = __webpack_require__(26);
const kafka_headers_enum_1 = __webpack_require__(78);
class KafkaResponseDeserializer {
    deserialize(message, options) {
        const id = message.headers[kafka_headers_enum_1.KafkaHeaders.CORRELATION_ID].toString();
        if (!(0, shared_utils_1.isUndefined)(message.headers[kafka_headers_enum_1.KafkaHeaders.NEST_ERR])) {
            return {
                id,
                err: message.headers[kafka_headers_enum_1.KafkaHeaders.NEST_ERR],
                isDisposed: true,
            };
        }
        if (!(0, shared_utils_1.isUndefined)(message.headers[kafka_headers_enum_1.KafkaHeaders.NEST_IS_DISPOSED])) {
            return {
                id,
                response: message.value,
                isDisposed: true,
            };
        }
        return {
            id,
            response: message.value,
            isDisposed: false,
        };
    }
}
exports.KafkaResponseDeserializer = KafkaResponseDeserializer;


/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaHeaders = void 0;
/**
 * @see https://docs.spring.io/spring-kafka/api/org/springframework/kafka/support/KafkaHeaders.html
 */
var KafkaHeaders;
(function (KafkaHeaders) {
    KafkaHeaders["ACKNOWLEDGMENT"] = "kafka_acknowledgment";
    KafkaHeaders["BATCH_CONVERTED_HEADERS"] = "kafka_batchConvertedHeaders";
    KafkaHeaders["CONSUMER"] = "kafka_consumer";
    KafkaHeaders["CORRELATION_ID"] = "kafka_correlationId";
    KafkaHeaders["DELIVERY_ATTEMPT"] = "kafka_deliveryAttempt";
    KafkaHeaders["DLT_EXCEPTION_FQCN"] = "kafka_dlt-exception-fqcn";
    KafkaHeaders["DLT_EXCEPTION_MESSAGE"] = "kafka_dlt-exception-message";
    KafkaHeaders["DLT_EXCEPTION_STACKTRACE"] = "kafka_dlt-exception-stacktrace";
    KafkaHeaders["DLT_ORIGINAL_OFFSET"] = "kafka_dlt-original-offset";
    KafkaHeaders["DLT_ORIGINAL_PARTITION"] = "kafka_dlt-original-partition";
    KafkaHeaders["DLT_ORIGINAL_TIMESTAMP"] = "kafka_dlt-original-timestamp";
    KafkaHeaders["DLT_ORIGINAL_TIMESTAMP_TYPE"] = "kafka_dlt-original-timestamp-type";
    KafkaHeaders["DLT_ORIGINAL_TOPIC"] = "kafka_dlt-original-topic";
    KafkaHeaders["GROUP_ID"] = "kafka_groupId";
    KafkaHeaders["MESSAGE_KEY"] = "kafka_messageKey";
    KafkaHeaders["NATIVE_HEADERS"] = "kafka_nativeHeaders";
    KafkaHeaders["OFFSET"] = "kafka_offset";
    KafkaHeaders["PARTITION_ID"] = "kafka_partitionId";
    KafkaHeaders["PREFIX"] = "kafka_";
    KafkaHeaders["RAW_DATA"] = "kafka_data";
    KafkaHeaders["RECEIVED"] = "kafka_received";
    KafkaHeaders["RECEIVED_MESSAGE_KEY"] = "kafka_receivedMessageKey";
    KafkaHeaders["RECEIVED_PARTITION_ID"] = "kafka_receivedPartitionId";
    KafkaHeaders["RECEIVED_TIMESTAMP"] = "kafka_receivedTimestamp";
    KafkaHeaders["RECEIVED_TOPIC"] = "kafka_receivedTopic";
    KafkaHeaders["RECORD_METADATA"] = "kafka_recordMetadata";
    KafkaHeaders["REPLY_PARTITION"] = "kafka_replyPartition";
    KafkaHeaders["REPLY_TOPIC"] = "kafka_replyTopic";
    KafkaHeaders["TIMESTAMP"] = "kafka_timestamp";
    KafkaHeaders["TIMESTAMP_TYPE"] = "kafka_timestampType";
    KafkaHeaders["TOPIC"] = "kafka_topic";
    // framework specific headers
    KafkaHeaders["NEST_ERR"] = "kafka_nest-err";
    KafkaHeaders["NEST_IS_DISPOSED"] = "kafka_nest-is-disposed";
})(KafkaHeaders = exports.KafkaHeaders || (exports.KafkaHeaders = {}));


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(80), exports);
tslib_1.__exportStar(__webpack_require__(78), exports);


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transport = void 0;
var Transport;
(function (Transport) {
    Transport[Transport["TCP"] = 0] = "TCP";
    Transport[Transport["REDIS"] = 1] = "REDIS";
    Transport[Transport["NATS"] = 2] = "NATS";
    Transport[Transport["MQTT"] = 3] = "MQTT";
    Transport[Transport["GRPC"] = 4] = "GRPC";
    Transport[Transport["RMQ"] = 5] = "RMQ";
    Transport[Transport["KAFKA"] = 6] = "KAFKA";
})(Transport = exports.Transport || (exports.Transport = {}));


/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvalidKafkaClientTopicException = void 0;
const runtime_exception_1 = __webpack_require__(63);
class InvalidKafkaClientTopicException extends runtime_exception_1.RuntimeException {
    constructor(topic) {
        super(`The client consumer did not subscribe to the corresponding reply topic (${topic}).`);
    }
}
exports.InvalidKafkaClientTopicException = InvalidKafkaClientTopicException;


/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(83), exports);
tslib_1.__exportStar(__webpack_require__(90), exports);
tslib_1.__exportStar(__webpack_require__(92), exports);
tslib_1.__exportStar(__webpack_require__(93), exports);
tslib_1.__exportStar(__webpack_require__(87), exports);


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JsonSocket = void 0;
const buffer_1 = __webpack_require__(84);
const string_decoder_1 = __webpack_require__(85);
const corrupted_packet_length_exception_1 = __webpack_require__(86);
const tcp_socket_1 = __webpack_require__(87);
class JsonSocket extends tcp_socket_1.TcpSocket {
    constructor() {
        super(...arguments);
        this.contentLength = null;
        this.buffer = '';
        this.stringDecoder = new string_decoder_1.StringDecoder();
        this.delimiter = '#';
    }
    handleSend(message, callback) {
        this.socket.write(this.formatMessageData(message), 'utf-8', callback);
    }
    handleData(dataRaw) {
        const data = buffer_1.Buffer.isBuffer(dataRaw)
            ? this.stringDecoder.write(dataRaw)
            : dataRaw;
        this.buffer += data;
        if (this.contentLength == null) {
            const i = this.buffer.indexOf(this.delimiter);
            /**
             * Check if the buffer has the delimiter (#),
             * if not, the end of the buffer string might be in the middle of a content length string
             */
            if (i !== -1) {
                const rawContentLength = this.buffer.substring(0, i);
                this.contentLength = parseInt(rawContentLength, 10);
                if (isNaN(this.contentLength)) {
                    this.contentLength = null;
                    this.buffer = '';
                    throw new corrupted_packet_length_exception_1.CorruptedPacketLengthException(rawContentLength);
                }
                this.buffer = this.buffer.substring(i + 1);
            }
        }
        if (this.contentLength !== null) {
            const length = this.buffer.length;
            if (length === this.contentLength) {
                this.handleMessage(this.buffer);
            }
            else if (length > this.contentLength) {
                const message = this.buffer.substring(0, this.contentLength);
                const rest = this.buffer.substring(this.contentLength);
                this.handleMessage(message);
                this.handleData(rest);
            }
        }
    }
    handleMessage(message) {
        this.contentLength = null;
        this.buffer = '';
        this.emitMessage(message);
    }
    formatMessageData(message) {
        const messageData = JSON.stringify(message);
        const length = messageData.length;
        const data = length + this.delimiter + messageData;
        return data;
    }
}
exports.JsonSocket = JsonSocket;


/***/ }),
/* 84 */
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),
/* 85 */
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CorruptedPacketLengthException = void 0;
class CorruptedPacketLengthException extends Error {
    constructor(rawContentLength) {
        super(`Corrupted length value "${rawContentLength}" supplied in a packet`);
    }
}
exports.CorruptedPacketLengthException = CorruptedPacketLengthException;


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TcpSocket = void 0;
const constants_1 = __webpack_require__(60);
const net_socket_closed_exception_1 = __webpack_require__(88);
const invalid_json_format_exception_1 = __webpack_require__(89);
class TcpSocket {
    constructor(socket) {
        this.socket = socket;
        this.isClosed = false;
        this.socket.on(constants_1.DATA_EVENT, this.onData.bind(this));
        this.socket.on(constants_1.CONNECT_EVENT, () => (this.isClosed = false));
        this.socket.on(constants_1.CLOSE_EVENT, () => (this.isClosed = true));
        this.socket.on(constants_1.ERROR_EVENT, () => (this.isClosed = true));
    }
    get netSocket() {
        return this.socket;
    }
    connect(port, host) {
        this.socket.connect(port, host);
        return this;
    }
    on(event, callback) {
        this.socket.on(event, callback);
        return this;
    }
    once(event, callback) {
        this.socket.once(event, callback);
        return this;
    }
    end() {
        this.socket.end();
        return this;
    }
    sendMessage(message, callback) {
        if (this.isClosed) {
            callback && callback(new net_socket_closed_exception_1.NetSocketClosedException());
            return;
        }
        this.handleSend(message, callback);
    }
    onData(data) {
        try {
            this.handleData(data);
        }
        catch (e) {
            this.socket.emit(constants_1.ERROR_EVENT, e.message);
            this.socket.end();
        }
    }
    emitMessage(data) {
        let message;
        try {
            message = JSON.parse(data);
        }
        catch (e) {
            throw new invalid_json_format_exception_1.InvalidJSONFormatException(e, data);
        }
        message = message || {};
        this.socket.emit(constants_1.MESSAGE_EVENT, message);
    }
}
exports.TcpSocket = TcpSocket;


/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NetSocketClosedException = void 0;
class NetSocketClosedException extends Error {
    constructor() {
        super(`The net socket is closed.`);
    }
}
exports.NetSocketClosedException = NetSocketClosedException;


/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvalidJSONFormatException = void 0;
class InvalidJSONFormatException extends Error {
    constructor(err, data) {
        super(`Could not parse JSON: ${err.message}\nRequest data: ${data}`);
    }
}
exports.InvalidJSONFormatException = InvalidJSONFormatException;


/***/ }),
/* 90 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaLogger = void 0;
const tslib_1 = __webpack_require__(53);
const kafka_interface_1 = __webpack_require__(91);
const KafkaLogger = (logger) => ({ namespace, level, label, log }) => {
    let loggerMethod;
    switch (level) {
        case kafka_interface_1.logLevel.ERROR:
        case kafka_interface_1.logLevel.NOTHING:
            loggerMethod = 'error';
            break;
        case kafka_interface_1.logLevel.WARN:
            loggerMethod = 'warn';
            break;
        case kafka_interface_1.logLevel.INFO:
            loggerMethod = 'log';
            break;
        case kafka_interface_1.logLevel.DEBUG:
        default:
            loggerMethod = 'debug';
            break;
    }
    const { message } = log, others = tslib_1.__rest(log, ["message"]);
    if (logger[loggerMethod]) {
        logger[loggerMethod](`${label} [${namespace}] ${message} ${JSON.stringify(others)}`);
    }
};
exports.KafkaLogger = KafkaLogger;


/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Do NOT add NestJS logic to this interface.  It is meant to ONLY represent the types for the kafkajs package.
 *
 * @see https://github.com/tulios/kafkajs/blob/master/types/index.d.ts
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompressionCodecs = exports.CompressionTypes = exports.logLevel = exports.AssignerProtocol = exports.PartitionAssigners = exports.ResourcePatternTypes = exports.AclOperationTypes = exports.AclPermissionTypes = exports.ConfigSource = exports.ConfigResourceTypes = exports.AclResourceTypes = exports.Partitioners = void 0;
var AclResourceTypes;
(function (AclResourceTypes) {
    AclResourceTypes[AclResourceTypes["UNKNOWN"] = 0] = "UNKNOWN";
    AclResourceTypes[AclResourceTypes["ANY"] = 1] = "ANY";
    AclResourceTypes[AclResourceTypes["TOPIC"] = 2] = "TOPIC";
    AclResourceTypes[AclResourceTypes["GROUP"] = 3] = "GROUP";
    AclResourceTypes[AclResourceTypes["CLUSTER"] = 4] = "CLUSTER";
    AclResourceTypes[AclResourceTypes["TRANSACTIONAL_ID"] = 5] = "TRANSACTIONAL_ID";
    AclResourceTypes[AclResourceTypes["DELEGATION_TOKEN"] = 6] = "DELEGATION_TOKEN";
})(AclResourceTypes = exports.AclResourceTypes || (exports.AclResourceTypes = {}));
var ConfigResourceTypes;
(function (ConfigResourceTypes) {
    ConfigResourceTypes[ConfigResourceTypes["UNKNOWN"] = 0] = "UNKNOWN";
    ConfigResourceTypes[ConfigResourceTypes["TOPIC"] = 2] = "TOPIC";
    ConfigResourceTypes[ConfigResourceTypes["BROKER"] = 4] = "BROKER";
    ConfigResourceTypes[ConfigResourceTypes["BROKER_LOGGER"] = 8] = "BROKER_LOGGER";
})(ConfigResourceTypes = exports.ConfigResourceTypes || (exports.ConfigResourceTypes = {}));
var ConfigSource;
(function (ConfigSource) {
    ConfigSource[ConfigSource["UNKNOWN"] = 0] = "UNKNOWN";
    ConfigSource[ConfigSource["TOPIC_CONFIG"] = 1] = "TOPIC_CONFIG";
    ConfigSource[ConfigSource["DYNAMIC_BROKER_CONFIG"] = 2] = "DYNAMIC_BROKER_CONFIG";
    ConfigSource[ConfigSource["DYNAMIC_DEFAULT_BROKER_CONFIG"] = 3] = "DYNAMIC_DEFAULT_BROKER_CONFIG";
    ConfigSource[ConfigSource["STATIC_BROKER_CONFIG"] = 4] = "STATIC_BROKER_CONFIG";
    ConfigSource[ConfigSource["DEFAULT_CONFIG"] = 5] = "DEFAULT_CONFIG";
    ConfigSource[ConfigSource["DYNAMIC_BROKER_LOGGER_CONFIG"] = 6] = "DYNAMIC_BROKER_LOGGER_CONFIG";
})(ConfigSource = exports.ConfigSource || (exports.ConfigSource = {}));
var AclPermissionTypes;
(function (AclPermissionTypes) {
    AclPermissionTypes[AclPermissionTypes["UNKNOWN"] = 0] = "UNKNOWN";
    AclPermissionTypes[AclPermissionTypes["ANY"] = 1] = "ANY";
    AclPermissionTypes[AclPermissionTypes["DENY"] = 2] = "DENY";
    AclPermissionTypes[AclPermissionTypes["ALLOW"] = 3] = "ALLOW";
})(AclPermissionTypes = exports.AclPermissionTypes || (exports.AclPermissionTypes = {}));
var AclOperationTypes;
(function (AclOperationTypes) {
    AclOperationTypes[AclOperationTypes["UNKNOWN"] = 0] = "UNKNOWN";
    AclOperationTypes[AclOperationTypes["ANY"] = 1] = "ANY";
    AclOperationTypes[AclOperationTypes["ALL"] = 2] = "ALL";
    AclOperationTypes[AclOperationTypes["READ"] = 3] = "READ";
    AclOperationTypes[AclOperationTypes["WRITE"] = 4] = "WRITE";
    AclOperationTypes[AclOperationTypes["CREATE"] = 5] = "CREATE";
    AclOperationTypes[AclOperationTypes["DELETE"] = 6] = "DELETE";
    AclOperationTypes[AclOperationTypes["ALTER"] = 7] = "ALTER";
    AclOperationTypes[AclOperationTypes["DESCRIBE"] = 8] = "DESCRIBE";
    AclOperationTypes[AclOperationTypes["CLUSTER_ACTION"] = 9] = "CLUSTER_ACTION";
    AclOperationTypes[AclOperationTypes["DESCRIBE_CONFIGS"] = 10] = "DESCRIBE_CONFIGS";
    AclOperationTypes[AclOperationTypes["ALTER_CONFIGS"] = 11] = "ALTER_CONFIGS";
    AclOperationTypes[AclOperationTypes["IDEMPOTENT_WRITE"] = 12] = "IDEMPOTENT_WRITE";
})(AclOperationTypes = exports.AclOperationTypes || (exports.AclOperationTypes = {}));
var ResourcePatternTypes;
(function (ResourcePatternTypes) {
    ResourcePatternTypes[ResourcePatternTypes["UNKNOWN"] = 0] = "UNKNOWN";
    ResourcePatternTypes[ResourcePatternTypes["ANY"] = 1] = "ANY";
    ResourcePatternTypes[ResourcePatternTypes["MATCH"] = 2] = "MATCH";
    ResourcePatternTypes[ResourcePatternTypes["LITERAL"] = 3] = "LITERAL";
    ResourcePatternTypes[ResourcePatternTypes["PREFIXED"] = 4] = "PREFIXED";
})(ResourcePatternTypes = exports.ResourcePatternTypes || (exports.ResourcePatternTypes = {}));
var logLevel;
(function (logLevel) {
    logLevel[logLevel["NOTHING"] = 0] = "NOTHING";
    logLevel[logLevel["ERROR"] = 1] = "ERROR";
    logLevel[logLevel["WARN"] = 2] = "WARN";
    logLevel[logLevel["INFO"] = 4] = "INFO";
    logLevel[logLevel["DEBUG"] = 5] = "DEBUG";
})(logLevel = exports.logLevel || (exports.logLevel = {}));
var CompressionTypes;
(function (CompressionTypes) {
    CompressionTypes[CompressionTypes["None"] = 0] = "None";
    CompressionTypes[CompressionTypes["GZIP"] = 1] = "GZIP";
    CompressionTypes[CompressionTypes["Snappy"] = 2] = "Snappy";
    CompressionTypes[CompressionTypes["LZ4"] = 3] = "LZ4";
    CompressionTypes[CompressionTypes["ZSTD"] = 4] = "ZSTD";
})(CompressionTypes = exports.CompressionTypes || (exports.CompressionTypes = {}));


/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaParser = void 0;
const shared_utils_1 = __webpack_require__(26);
class KafkaParser {
    constructor(config) {
        this.keepBinary = (config && config.keepBinary) || false;
    }
    parse(data) {
        // Clone object to as modifying the original one would break KafkaJS retries
        const result = Object.assign(Object.assign({}, data), { headers: Object.assign({}, data.headers) });
        if (!this.keepBinary) {
            result.value = this.decode(data.value);
        }
        if (!(0, shared_utils_1.isNil)(data.key)) {
            result.key = this.decode(data.key);
        }
        if (!(0, shared_utils_1.isNil)(data.headers)) {
            const decodeHeaderByKey = (key) => {
                result.headers[key] = this.decode(data.headers[key]);
            };
            Object.keys(data.headers).forEach(decodeHeaderByKey);
        }
        else {
            result.headers = {};
        }
        return result;
    }
    decode(value) {
        if ((0, shared_utils_1.isNil)(value)) {
            return null;
        }
        // A value with the "leading zero byte" indicates the schema payload.
        // The "content" is possibly binary and should not be touched & parsed.
        if (Buffer.isBuffer(value) &&
            value.length > 0 &&
            value.readUInt8(0) === 0) {
            return value;
        }
        let result = value.toString();
        const startChar = result.charAt(0);
        // only try to parse objects and arrays
        if (startChar === '{' || startChar === '[') {
            try {
                result = JSON.parse(value.toString());
            }
            catch (e) { }
        }
        return result;
    }
}
exports.KafkaParser = KafkaParser;


/***/ }),
/* 93 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaReplyPartitionAssigner = void 0;
const load_package_util_1 = __webpack_require__(58);
const shared_utils_1 = __webpack_require__(26);
let kafkaPackage = {};
class KafkaReplyPartitionAssigner {
    constructor(clientKafka, config) {
        this.clientKafka = clientKafka;
        this.config = config;
        this.name = 'NestReplyPartitionAssigner';
        this.version = 1;
        kafkaPackage = (0, load_package_util_1.loadPackage)('kafkajs', KafkaReplyPartitionAssigner.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'kafkajs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
    }
    /**
     * This process can result in imbalanced assignments
     * @param {array} members array of members, e.g: [{ memberId: 'test-5f93f5a3' }]
     * @param {array} topics
     * @param {Buffer} userData
     * @returns {array} object partitions per topic per member
     */
    async assign(group) {
        const assignment = {};
        const previousAssignment = {};
        const membersCount = group.members.length;
        const decodedMembers = group.members.map(member => this.decodeMember(member));
        const sortedMemberIds = decodedMembers
            .map(member => member.memberId)
            .sort();
        // build the previous assignment and an inverse map of topic > partition > memberId for lookup
        decodedMembers.forEach(member => {
            if (!previousAssignment[member.memberId] &&
                Object.keys(member.previousAssignment).length > 0) {
                previousAssignment[member.memberId] = member.previousAssignment;
            }
        });
        // build a collection of topics and partitions
        const topicsPartitions = group.topics
            .map(topic => {
            const partitionMetadata = this.config.cluster.findTopicPartitionMetadata(topic);
            return partitionMetadata.map(m => {
                return {
                    topic,
                    partitionId: m.partitionId,
                };
            });
        })
            .reduce((acc, val) => acc.concat(val), []);
        // create the new assignment by populating the members with the first partition of the topics
        sortedMemberIds.forEach(assignee => {
            if (!assignment[assignee]) {
                assignment[assignee] = {};
            }
            // add topics to each member
            group.topics.forEach(topic => {
                if (!assignment[assignee][topic]) {
                    assignment[assignee][topic] = [];
                }
                // see if the topic and partition belong to a previous assignment
                if (previousAssignment[assignee] &&
                    !(0, shared_utils_1.isUndefined)(previousAssignment[assignee][topic])) {
                    // take the minimum partition since replies will be sent to the minimum partition
                    const firstPartition = previousAssignment[assignee][topic];
                    // create the assignment with the first partition
                    assignment[assignee][topic].push(firstPartition);
                    // find and remove this topic and partition from the topicPartitions to be assigned later
                    const topicsPartitionsIndex = topicsPartitions.findIndex(topicPartition => {
                        return (topicPartition.topic === topic &&
                            topicPartition.partitionId === firstPartition);
                    });
                    // only continue if we found a partition matching this topic
                    if (topicsPartitionsIndex !== -1) {
                        // remove inline
                        topicsPartitions.splice(topicsPartitionsIndex, 1);
                    }
                }
            });
        });
        // check for member topics that have a partition length of 0
        sortedMemberIds.forEach(assignee => {
            group.topics.forEach(topic => {
                // only continue if there are no partitions for assignee's topic
                if (assignment[assignee][topic].length === 0) {
                    // find the first partition for this topic
                    const topicsPartitionsIndex = topicsPartitions.findIndex(topicPartition => {
                        return topicPartition.topic === topic;
                    });
                    if (topicsPartitionsIndex !== -1) {
                        // find and set the topic partition
                        const partition = topicsPartitions[topicsPartitionsIndex].partitionId;
                        assignment[assignee][topic].push(partition);
                        // remove this partition from the topics partitions collection
                        topicsPartitions.splice(topicsPartitionsIndex, 1);
                    }
                }
            });
        });
        // then balance out the rest of the topic partitions across the members
        const insertAssignmentsByTopic = (topicPartition, i) => {
            const assignee = sortedMemberIds[i % membersCount];
            assignment[assignee][topicPartition.topic].push(topicPartition.partitionId);
        };
        // build the assignments
        topicsPartitions.forEach(insertAssignmentsByTopic);
        // encode the end result
        return Object.keys(assignment).map(memberId => ({
            memberId,
            memberAssignment: kafkaPackage.AssignerProtocol.MemberAssignment.encode({
                version: this.version,
                assignment: assignment[memberId],
            }),
        }));
    }
    protocol(subscription) {
        const stringifiedUserData = JSON.stringify({
            previousAssignment: this.getPreviousAssignment(),
        });
        subscription.userData = Buffer.from(stringifiedUserData);
        return {
            name: this.name,
            metadata: kafkaPackage.AssignerProtocol.MemberMetadata.encode({
                version: this.version,
                topics: subscription.topics,
                userData: subscription.userData,
            }),
        };
    }
    getPreviousAssignment() {
        return this.clientKafka.getConsumerAssignments();
    }
    decodeMember(member) {
        const memberMetadata = kafkaPackage.AssignerProtocol.MemberMetadata.decode(member.memberMetadata);
        const memberUserData = JSON.parse(memberMetadata.userData.toString());
        return {
            memberId: member.memberId,
            previousAssignment: memberUserData.previousAssignment,
        };
    }
}
exports.KafkaReplyPartitionAssigner = KafkaReplyPartitionAssigner;


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaRequestSerializer = void 0;
const shared_utils_1 = __webpack_require__(26);
class KafkaRequestSerializer {
    serialize(value) {
        const isNotKafkaMessage = (0, shared_utils_1.isNil)(value) ||
            !(0, shared_utils_1.isObject)(value) ||
            (!('key' in value) && !('value' in value));
        if (isNotKafkaMessage) {
            value = { value };
        }
        value.value = this.encode(value.value);
        if (!(0, shared_utils_1.isNil)(value.key)) {
            value.key = this.encode(value.key);
        }
        if ((0, shared_utils_1.isNil)(value.headers)) {
            value.headers = {};
        }
        return value;
    }
    encode(value) {
        const isObjectOrArray = !(0, shared_utils_1.isNil)(value) && !(0, shared_utils_1.isString)(value) && !Buffer.isBuffer(value);
        if (isObjectOrArray) {
            return (0, shared_utils_1.isPlainObject)(value) || Array.isArray(value)
                ? JSON.stringify(value)
                : value.toString();
        }
        else if ((0, shared_utils_1.isUndefined)(value)) {
            return null;
        }
        return value;
    }
}
exports.KafkaRequestSerializer = KafkaRequestSerializer;


/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientMqtt = void 0;
const logger_service_1 = __webpack_require__(57);
const load_package_util_1 = __webpack_require__(58);
const rxjs_1 = __webpack_require__(59);
const operators_1 = __webpack_require__(68);
const constants_1 = __webpack_require__(60);
const mqtt_record_serializer_1 = __webpack_require__(96);
const client_proxy_1 = __webpack_require__(66);
let mqttPackage = {};
class ClientMqtt extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        this.subscriptionsCount = new Map();
        this.url = this.getOptionsProp(this.options, 'url') || constants_1.MQTT_DEFAULT_URL;
        mqttPackage = (0, load_package_util_1.loadPackage)('mqtt', ClientMqtt.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'mqtt'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    getRequestPattern(pattern) {
        return pattern;
    }
    getResponsePattern(pattern) {
        return `${pattern}/reply`;
    }
    close() {
        this.mqttClient && this.mqttClient.end();
        this.mqttClient = null;
        this.connection = null;
    }
    connect() {
        if (this.mqttClient) {
            return this.connection;
        }
        this.mqttClient = this.createClient();
        this.handleError(this.mqttClient);
        const connect$ = this.connect$(this.mqttClient);
        this.connection = (0, rxjs_1.lastValueFrom)(this.mergeCloseEvent(this.mqttClient, connect$).pipe((0, operators_1.tap)(() => this.mqttClient.on(constants_1.MESSAGE_EVENT, this.createResponseCallback())), (0, operators_1.share)())).catch(err => {
            if (err instanceof rxjs_1.EmptyError) {
                return;
            }
            throw err;
        });
        return this.connection;
    }
    mergeCloseEvent(instance, source$) {
        const close$ = (0, rxjs_1.fromEvent)(instance, constants_1.CLOSE_EVENT).pipe((0, operators_1.map)((err) => {
            throw err;
        }));
        return (0, rxjs_1.merge)(source$, close$).pipe((0, operators_1.first)());
    }
    createClient() {
        return mqttPackage.connect(this.url, this.options);
    }
    handleError(client) {
        client.addListener(constants_1.ERROR_EVENT, (err) => err.code !== constants_1.ECONNREFUSED && this.logger.error(err));
    }
    createResponseCallback() {
        return async (channel, buffer) => {
            const packet = JSON.parse(buffer.toString());
            const { err, response, isDisposed, id } = await this.deserializer.deserialize(packet);
            const callback = this.routingMap.get(id);
            if (!callback) {
                return undefined;
            }
            if (isDisposed || err) {
                return callback({
                    err,
                    response,
                    isDisposed: true,
                });
            }
            callback({
                err,
                response,
            });
        };
    }
    publish(partialPacket, callback) {
        try {
            const packet = this.assignPacketId(partialPacket);
            const pattern = this.normalizePattern(partialPacket.pattern);
            const serializedPacket = this.serializer.serialize(packet);
            const responseChannel = this.getResponsePattern(pattern);
            let subscriptionsCount = this.subscriptionsCount.get(responseChannel) || 0;
            const publishPacket = () => {
                subscriptionsCount = this.subscriptionsCount.get(responseChannel) || 0;
                this.subscriptionsCount.set(responseChannel, subscriptionsCount + 1);
                this.routingMap.set(packet.id, callback);
                const options = serializedPacket.options;
                delete serializedPacket.options;
                this.mqttClient.publish(this.getRequestPattern(pattern), JSON.stringify(serializedPacket), this.mergePacketOptions(options));
            };
            if (subscriptionsCount <= 0) {
                this.mqttClient.subscribe(responseChannel, (err) => !err && publishPacket());
            }
            else {
                publishPacket();
            }
            return () => {
                this.unsubscribeFromChannel(responseChannel);
                this.routingMap.delete(packet.id);
            };
        }
        catch (err) {
            callback({ err });
        }
    }
    dispatchEvent(packet) {
        const pattern = this.normalizePattern(packet.pattern);
        const serializedPacket = this.serializer.serialize(packet);
        const options = serializedPacket.options;
        delete serializedPacket.options;
        return new Promise((resolve, reject) => this.mqttClient.publish(pattern, JSON.stringify(serializedPacket), this.mergePacketOptions(options), (err) => (err ? reject(err) : resolve())));
    }
    unsubscribeFromChannel(channel) {
        const subscriptionCount = this.subscriptionsCount.get(channel);
        this.subscriptionsCount.set(channel, subscriptionCount - 1);
        if (subscriptionCount - 1 <= 0) {
            this.mqttClient.unsubscribe(channel);
        }
    }
    initializeSerializer(options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new mqtt_record_serializer_1.MqttRecordSerializer();
    }
    mergePacketOptions(requestOptions) {
        var _a, _b, _c;
        if (!requestOptions && !((_a = this.options) === null || _a === void 0 ? void 0 : _a.userProperties)) {
            return undefined;
        }
        return Object.assign(Object.assign({}, requestOptions), { properties: Object.assign(Object.assign({}, requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.properties), { userProperties: Object.assign(Object.assign({}, (_b = this.options) === null || _b === void 0 ? void 0 : _b.userProperties), (_c = requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.properties) === null || _c === void 0 ? void 0 : _c.userProperties) }) });
    }
}
exports.ClientMqtt = ClientMqtt;


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MqttRecordSerializer = void 0;
const shared_utils_1 = __webpack_require__(26);
const record_builders_1 = __webpack_require__(97);
class MqttRecordSerializer {
    serialize(packet) {
        if ((packet === null || packet === void 0 ? void 0 : packet.data) &&
            (0, shared_utils_1.isObject)(packet.data) &&
            packet.data instanceof record_builders_1.MqttRecord) {
            const record = packet.data;
            return Object.assign(Object.assign({}, packet), { data: record.data, options: record.options });
        }
        return packet;
    }
}
exports.MqttRecordSerializer = MqttRecordSerializer;


/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(98), exports);
tslib_1.__exportStar(__webpack_require__(99), exports);
tslib_1.__exportStar(__webpack_require__(100), exports);


/***/ }),
/* 98 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MqttRecordBuilder = exports.MqttRecord = void 0;
class MqttRecord {
    constructor(data, options) {
        this.data = data;
        this.options = options;
    }
}
exports.MqttRecord = MqttRecord;
class MqttRecordBuilder {
    constructor(data) {
        this.data = data;
    }
    setData(data) {
        this.data = data;
        return this;
    }
    setQoS(qos) {
        this.options = Object.assign(Object.assign({}, this.options), { qos });
        return this;
    }
    setRetain(retain) {
        this.options = Object.assign(Object.assign({}, this.options), { retain });
        return this;
    }
    setDup(dup) {
        this.options = Object.assign(Object.assign({}, this.options), { dup });
        return this;
    }
    setProperties(properties) {
        this.options = Object.assign(Object.assign({}, this.options), { properties });
        return this;
    }
    build() {
        return new MqttRecord(this.data, this.options);
    }
}
exports.MqttRecordBuilder = MqttRecordBuilder;


/***/ }),
/* 99 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NatsRecordBuilder = exports.NatsRecord = void 0;
class NatsRecord {
    constructor(data, headers) {
        this.data = data;
        this.headers = headers;
    }
}
exports.NatsRecord = NatsRecord;
class NatsRecordBuilder {
    constructor(data) {
        this.data = data;
    }
    setHeaders(headers) {
        this.headers = headers;
        return this;
    }
    setData(data) {
        this.data = data;
        return this;
    }
    build() {
        return new NatsRecord(this.data, this.headers);
    }
}
exports.NatsRecordBuilder = NatsRecordBuilder;


/***/ }),
/* 100 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RmqRecordBuilder = exports.RmqRecord = void 0;
class RmqRecord {
    constructor(data, options) {
        this.data = data;
        this.options = options;
    }
}
exports.RmqRecord = RmqRecord;
class RmqRecordBuilder {
    constructor(data) {
        this.data = data;
    }
    setOptions(options) {
        this.options = options;
        return this;
    }
    setData(data) {
        this.data = data;
        return this;
    }
    build() {
        return new RmqRecord(this.data, this.options);
    }
}
exports.RmqRecordBuilder = RmqRecordBuilder;


/***/ }),
/* 101 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientNats = void 0;
const tslib_1 = __webpack_require__(53);
const logger_service_1 = __webpack_require__(57);
const load_package_util_1 = __webpack_require__(58);
const shared_utils_1 = __webpack_require__(26);
const constants_1 = __webpack_require__(60);
const nats_response_json_deserializer_1 = __webpack_require__(102);
const empty_response_exception_1 = __webpack_require__(105);
const nats_record_serializer_1 = __webpack_require__(106);
const client_proxy_1 = __webpack_require__(66);
let natsPackage = {};
class ClientNats extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(ClientNats.name);
        natsPackage = (0, load_package_util_1.loadPackage)('nats', ClientNats.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'nats'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    async close() {
        var _a;
        await ((_a = this.natsClient) === null || _a === void 0 ? void 0 : _a.close());
        this.natsClient = null;
    }
    async connect() {
        if (this.natsClient) {
            return this.natsClient;
        }
        this.natsClient = await this.createClient();
        this.handleStatusUpdates(this.natsClient);
        return this.natsClient;
    }
    createClient() {
        const options = this.options || {};
        return natsPackage.connect(Object.assign({ servers: constants_1.NATS_DEFAULT_URL }, options));
    }
    async handleStatusUpdates(client) {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__asyncValues(client.status()), _c; _c = await _b.next(), !_c.done;) {
                const status = _c.value;
                const data = status.data && (0, shared_utils_1.isObject)(status.data)
                    ? JSON.stringify(status.data)
                    : status.data;
                if (status.type === 'disconnect' || status.type === 'error') {
                    this.logger.error(`NatsError: type: "${status.type}", data: "${data}".`);
                }
                else {
                    const message = `NatsStatus: type: "${status.type}", data: "${data}".`;
                    if (status.type === 'pingTimer') {
                        this.logger.debug(message);
                    }
                    else {
                        this.logger.log(message);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    createSubscriptionHandler(packet, callback) {
        return async (error, natsMsg) => {
            if (error) {
                return callback({
                    err: error,
                });
            }
            const rawPacket = natsMsg.data;
            if ((rawPacket === null || rawPacket === void 0 ? void 0 : rawPacket.length) === 0) {
                return callback({
                    err: new empty_response_exception_1.EmptyResponseException(this.normalizePattern(packet.pattern)),
                    isDisposed: true,
                });
            }
            const message = await this.deserializer.deserialize(rawPacket);
            if (message.id && message.id !== packet.id) {
                return undefined;
            }
            const { err, response, isDisposed } = message;
            if (isDisposed || err) {
                return callback({
                    err,
                    response,
                    isDisposed: true,
                });
            }
            callback({
                err,
                response,
            });
        };
    }
    publish(partialPacket, callback) {
        try {
            const packet = this.assignPacketId(partialPacket);
            const channel = this.normalizePattern(partialPacket.pattern);
            const serializedPacket = this.serializer.serialize(packet);
            const inbox = natsPackage.createInbox();
            const subscriptionHandler = this.createSubscriptionHandler(packet, callback);
            const subscription = this.natsClient.subscribe(inbox, {
                callback: subscriptionHandler,
            });
            const headers = this.mergeHeaders(serializedPacket.headers);
            this.natsClient.publish(channel, serializedPacket.data, {
                reply: inbox,
                headers,
            });
            return () => subscription.unsubscribe();
        }
        catch (err) {
            callback({ err });
        }
    }
    dispatchEvent(packet) {
        const pattern = this.normalizePattern(packet.pattern);
        const serializedPacket = this.serializer.serialize(packet);
        const headers = this.mergeHeaders(serializedPacket.headers);
        return new Promise((resolve, reject) => {
            try {
                this.natsClient.publish(pattern, serializedPacket.data, {
                    headers,
                });
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    initializeSerializer(options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new nats_record_serializer_1.NatsRecordSerializer();
    }
    initializeDeserializer(options) {
        var _a;
        this.deserializer =
            (_a = options === null || options === void 0 ? void 0 : options.deserializer) !== null && _a !== void 0 ? _a : new nats_response_json_deserializer_1.NatsResponseJSONDeserializer();
    }
    mergeHeaders(requestHeaders) {
        var _a, _b;
        if (!requestHeaders && !((_a = this.options) === null || _a === void 0 ? void 0 : _a.headers)) {
            return undefined;
        }
        const headers = requestHeaders !== null && requestHeaders !== void 0 ? requestHeaders : natsPackage.headers();
        for (const [key, value] of Object.entries(((_b = this.options) === null || _b === void 0 ? void 0 : _b.headers) || {})) {
            if (!headers.has(key)) {
                headers.set(key, value);
            }
        }
        return headers;
    }
}
exports.ClientNats = ClientNats;


/***/ }),
/* 102 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NatsResponseJSONDeserializer = void 0;
const load_package_util_1 = __webpack_require__(58);
const incoming_response_deserializer_1 = __webpack_require__(69);
const nats_request_json_deserializer_1 = __webpack_require__(103);
let natsPackage = {};
class NatsResponseJSONDeserializer extends incoming_response_deserializer_1.IncomingResponseDeserializer {
    constructor() {
        super();
        natsPackage = (0, load_package_util_1.loadPackage)('nats', nats_request_json_deserializer_1.NatsRequestJSONDeserializer.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'nats'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.jsonCodec = natsPackage.JSONCodec();
    }
    deserialize(value, options) {
        const decodedRequest = this.jsonCodec.decode(value);
        return super.deserialize(decodedRequest, options);
    }
}
exports.NatsResponseJSONDeserializer = NatsResponseJSONDeserializer;


/***/ }),
/* 103 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NatsRequestJSONDeserializer = void 0;
const load_package_util_1 = __webpack_require__(58);
const incoming_request_deserializer_1 = __webpack_require__(104);
let natsPackage = {};
class NatsRequestJSONDeserializer extends incoming_request_deserializer_1.IncomingRequestDeserializer {
    constructor() {
        super();
        natsPackage = (0, load_package_util_1.loadPackage)('nats', NatsRequestJSONDeserializer.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'nats'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.jsonCodec = natsPackage.JSONCodec();
    }
    deserialize(value, options) {
        const decodedRequest = this.jsonCodec.decode(value);
        return super.deserialize(decodedRequest, options);
    }
}
exports.NatsRequestJSONDeserializer = NatsRequestJSONDeserializer;


/***/ }),
/* 104 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IncomingRequestDeserializer = void 0;
const shared_utils_1 = __webpack_require__(26);
class IncomingRequestDeserializer {
    deserialize(value, options) {
        return this.isExternal(value) ? this.mapToSchema(value, options) : value;
    }
    isExternal(value) {
        if (!value) {
            return true;
        }
        if (!(0, shared_utils_1.isUndefined)(value.pattern) ||
            !(0, shared_utils_1.isUndefined)(value.data)) {
            return false;
        }
        return true;
    }
    mapToSchema(value, options) {
        if (!options) {
            return {
                pattern: undefined,
                data: undefined,
            };
        }
        return {
            pattern: options.channel,
            data: value,
        };
    }
}
exports.IncomingRequestDeserializer = IncomingRequestDeserializer;


/***/ }),
/* 105 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmptyResponseException = void 0;
class EmptyResponseException extends Error {
    constructor(pattern) {
        super(`Empty response. There are no subscribers listening to that message ("${pattern}")`);
    }
}
exports.EmptyResponseException = EmptyResponseException;


/***/ }),
/* 106 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NatsRecordSerializer = void 0;
const load_package_util_1 = __webpack_require__(58);
const shared_utils_1 = __webpack_require__(26);
const record_builders_1 = __webpack_require__(97);
let natsPackage = {};
class NatsRecordSerializer {
    constructor() {
        natsPackage = (0, load_package_util_1.loadPackage)('nats', NatsRecordSerializer.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'nats'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.jsonCodec = natsPackage.JSONCodec();
    }
    serialize(packet) {
        const natsMessage = (packet === null || packet === void 0 ? void 0 : packet.data) && (0, shared_utils_1.isObject)(packet.data) && packet.data instanceof record_builders_1.NatsRecord
            ? packet.data
            : new record_builders_1.NatsRecordBuilder(packet === null || packet === void 0 ? void 0 : packet.data).build();
        return {
            data: this.jsonCodec.encode(Object.assign(Object.assign({}, packet), { data: natsMessage.data })),
            headers: natsMessage.headers,
        };
    }
}
exports.NatsRecordSerializer = NatsRecordSerializer;


/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientProxyFactory = void 0;
const transport_enum_1 = __webpack_require__(80);
const client_grpc_1 = __webpack_require__(56);
const client_kafka_1 = __webpack_require__(76);
const client_mqtt_1 = __webpack_require__(95);
const client_nats_1 = __webpack_require__(101);
const client_redis_1 = __webpack_require__(108);
const client_rmq_1 = __webpack_require__(109);
const client_tcp_1 = __webpack_require__(112);
class ClientProxyFactory {
    static create(clientOptions) {
        if (this.isCustomClientOptions(clientOptions)) {
            const { customClass, options } = clientOptions;
            return new customClass(options);
        }
        const { transport, options } = clientOptions || {};
        switch (transport) {
            case transport_enum_1.Transport.REDIS:
                return new client_redis_1.ClientRedis(options);
            case transport_enum_1.Transport.NATS:
                return new client_nats_1.ClientNats(options);
            case transport_enum_1.Transport.MQTT:
                return new client_mqtt_1.ClientMqtt(options);
            case transport_enum_1.Transport.GRPC:
                return new client_grpc_1.ClientGrpcProxy(options);
            case transport_enum_1.Transport.RMQ:
                return new client_rmq_1.ClientRMQ(options);
            case transport_enum_1.Transport.KAFKA:
                return new client_kafka_1.ClientKafka(options);
            default:
                return new client_tcp_1.ClientTCP(options);
        }
    }
    static isCustomClientOptions(options) {
        return !!options.customClass;
    }
}
exports.ClientProxyFactory = ClientProxyFactory;


/***/ }),
/* 108 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientRedis = void 0;
const logger_service_1 = __webpack_require__(57);
const load_package_util_1 = __webpack_require__(58);
const constants_1 = __webpack_require__(60);
const client_proxy_1 = __webpack_require__(66);
let redisPackage = {};
class ClientRedis extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        this.subscriptionsCount = new Map();
        this.isExplicitlyTerminated = false;
        redisPackage = (0, load_package_util_1.loadPackage)('ioredis', ClientRedis.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'ioredis'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    getRequestPattern(pattern) {
        return pattern;
    }
    getReplyPattern(pattern) {
        return `${pattern}.reply`;
    }
    close() {
        this.pubClient && this.pubClient.quit();
        this.subClient && this.subClient.quit();
        this.pubClient = this.subClient = null;
        this.isExplicitlyTerminated = true;
    }
    async connect() {
        if (this.pubClient && this.subClient) {
            return this.connection;
        }
        this.pubClient = this.createClient();
        this.subClient = this.createClient();
        this.handleError(this.pubClient);
        this.handleError(this.subClient);
        this.connection = Promise.all([
            this.subClient.connect(),
            this.pubClient.connect(),
        ]);
        await this.connection;
        this.subClient.on(constants_1.MESSAGE_EVENT, this.createResponseCallback());
        return this.connection;
    }
    createClient() {
        return new redisPackage(Object.assign(Object.assign({ host: constants_1.REDIS_DEFAULT_HOST, port: constants_1.REDIS_DEFAULT_PORT }, this.getClientOptions()), { lazyConnect: true }));
    }
    handleError(client) {
        client.addListener(constants_1.ERROR_EVENT, (err) => this.logger.error(err));
    }
    getClientOptions() {
        const retryStrategy = (times) => this.createRetryStrategy(times);
        return Object.assign(Object.assign({}, (this.options || {})), { retryStrategy });
    }
    createRetryStrategy(times) {
        if (this.isExplicitlyTerminated) {
            return undefined;
        }
        if (!this.getOptionsProp(this.options, 'retryAttempts') ||
            times > this.getOptionsProp(this.options, 'retryAttempts')) {
            this.logger.error('Retry time exhausted');
            return;
        }
        return this.getOptionsProp(this.options, 'retryDelay') || 0;
    }
    createResponseCallback() {
        return async (channel, buffer) => {
            const packet = JSON.parse(buffer);
            const { err, response, isDisposed, id } = await this.deserializer.deserialize(packet);
            const callback = this.routingMap.get(id);
            if (!callback) {
                return;
            }
            if (isDisposed || err) {
                return callback({
                    err,
                    response,
                    isDisposed: true,
                });
            }
            callback({
                err,
                response,
            });
        };
    }
    publish(partialPacket, callback) {
        try {
            const packet = this.assignPacketId(partialPacket);
            const pattern = this.normalizePattern(partialPacket.pattern);
            const serializedPacket = this.serializer.serialize(packet);
            const responseChannel = this.getReplyPattern(pattern);
            let subscriptionsCount = this.subscriptionsCount.get(responseChannel) || 0;
            const publishPacket = () => {
                subscriptionsCount = this.subscriptionsCount.get(responseChannel) || 0;
                this.subscriptionsCount.set(responseChannel, subscriptionsCount + 1);
                this.routingMap.set(packet.id, callback);
                this.pubClient.publish(this.getRequestPattern(pattern), JSON.stringify(serializedPacket));
            };
            if (subscriptionsCount <= 0) {
                this.subClient.subscribe(responseChannel, (err) => !err && publishPacket());
            }
            else {
                publishPacket();
            }
            return () => {
                this.unsubscribeFromChannel(responseChannel);
                this.routingMap.delete(packet.id);
            };
        }
        catch (err) {
            callback({ err });
        }
    }
    dispatchEvent(packet) {
        const pattern = this.normalizePattern(packet.pattern);
        const serializedPacket = this.serializer.serialize(packet);
        return new Promise((resolve, reject) => this.pubClient.publish(pattern, JSON.stringify(serializedPacket), err => err ? reject(err) : resolve()));
    }
    unsubscribeFromChannel(channel) {
        const subscriptionCount = this.subscriptionsCount.get(channel);
        this.subscriptionsCount.set(channel, subscriptionCount - 1);
        if (subscriptionCount - 1 <= 0) {
            this.subClient.unsubscribe(channel);
        }
    }
}
exports.ClientRedis = ClientRedis;


/***/ }),
/* 109 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientRMQ = void 0;
const logger_service_1 = __webpack_require__(57);
const load_package_util_1 = __webpack_require__(58);
const random_string_generator_util_1 = __webpack_require__(67);
const shared_utils_1 = __webpack_require__(26);
const events_1 = __webpack_require__(110);
const rxjs_1 = __webpack_require__(59);
const operators_1 = __webpack_require__(68);
const constants_1 = __webpack_require__(60);
const rmq_record_serializer_1 = __webpack_require__(111);
const client_proxy_1 = __webpack_require__(66);
let rqmPackage = {};
const REPLY_QUEUE = 'amq.rabbitmq.reply-to';
class ClientRMQ extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        this.client = null;
        this.channel = null;
        this.urls = this.getOptionsProp(this.options, 'urls') || [constants_1.RQM_DEFAULT_URL];
        this.queue =
            this.getOptionsProp(this.options, 'queue') || constants_1.RQM_DEFAULT_QUEUE;
        this.queueOptions =
            this.getOptionsProp(this.options, 'queueOptions') ||
                constants_1.RQM_DEFAULT_QUEUE_OPTIONS;
        this.replyQueue =
            this.getOptionsProp(this.options, 'replyQueue') || REPLY_QUEUE;
        this.persistent =
            this.getOptionsProp(this.options, 'persistent') || constants_1.RQM_DEFAULT_PERSISTENT;
        this.noAssert =
            this.getOptionsProp(this.options, 'noAssert') || constants_1.RQM_DEFAULT_NO_ASSERT;
        (0, load_package_util_1.loadPackage)('amqplib', ClientRMQ.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'amqplib'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        rqmPackage = (0, load_package_util_1.loadPackage)('amqp-connection-manager', ClientRMQ.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'amqp-connection-manager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    close() {
        this.channel && this.channel.close();
        this.client && this.client.close();
        this.channel = null;
        this.client = null;
    }
    connect() {
        if (this.client) {
            return this.connection;
        }
        this.client = this.createClient();
        this.handleError(this.client);
        this.handleDisconnectError(this.client);
        const connect$ = this.connect$(this.client);
        this.connection = (0, rxjs_1.lastValueFrom)(this.mergeDisconnectEvent(this.client, connect$).pipe((0, operators_1.switchMap)(() => this.createChannel()), (0, operators_1.share)())).catch(err => {
            if (err instanceof rxjs_1.EmptyError) {
                return;
            }
            throw err;
        });
        return this.connection;
    }
    createChannel() {
        return new Promise(resolve => {
            this.channel = this.client.createChannel({
                json: false,
                setup: (channel) => this.setupChannel(channel, resolve),
            });
        });
    }
    createClient() {
        const socketOptions = this.getOptionsProp(this.options, 'socketOptions');
        return rqmPackage.connect(this.urls, {
            connectionOptions: socketOptions,
        });
    }
    mergeDisconnectEvent(instance, source$) {
        const eventToError = (eventType) => (0, rxjs_1.fromEvent)(instance, eventType).pipe((0, operators_1.map)((err) => {
            throw err;
        }));
        const disconnect$ = eventToError(constants_1.DISCONNECT_EVENT);
        const urls = this.getOptionsProp(this.options, 'urls', []);
        const connectFailed$ = eventToError(constants_1.CONNECT_FAILED_EVENT).pipe((0, operators_1.retryWhen)(e => e.pipe((0, operators_1.scan)((errorCount, error) => {
            if (urls.indexOf(error.url) >= urls.length - 1) {
                throw error;
            }
            return errorCount + 1;
        }, 0))));
        return (0, rxjs_1.merge)(source$, disconnect$, connectFailed$).pipe((0, operators_1.first)());
    }
    async setupChannel(channel, resolve) {
        const prefetchCount = this.getOptionsProp(this.options, 'prefetchCount') ||
            constants_1.RQM_DEFAULT_PREFETCH_COUNT;
        const isGlobalPrefetchCount = this.getOptionsProp(this.options, 'isGlobalPrefetchCount') ||
            constants_1.RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT;
        if (!this.queueOptions.noAssert) {
            await channel.assertQueue(this.queue, this.queueOptions);
        }
        await channel.prefetch(prefetchCount, isGlobalPrefetchCount);
        this.responseEmitter = new events_1.EventEmitter();
        this.responseEmitter.setMaxListeners(0);
        await this.consumeChannel(channel);
        resolve();
    }
    async consumeChannel(channel) {
        const noAck = this.getOptionsProp(this.options, 'noAck', constants_1.RQM_DEFAULT_NOACK);
        await channel.consume(this.replyQueue, (msg) => this.responseEmitter.emit(msg.properties.correlationId, msg), {
            noAck,
        });
    }
    handleError(client) {
        client.addListener(constants_1.ERROR_EVENT, (err) => this.logger.error(err));
    }
    handleDisconnectError(client) {
        client.addListener(constants_1.DISCONNECT_EVENT, (err) => {
            this.logger.error(constants_1.DISCONNECTED_RMQ_MESSAGE);
            this.logger.error(err);
            this.close();
        });
    }
    async handleMessage(packet, options, callback) {
        if ((0, shared_utils_1.isFunction)(options)) {
            callback = options;
            options = undefined;
        }
        const { err, response, isDisposed } = await this.deserializer.deserialize(packet, options);
        if (isDisposed || err) {
            callback({
                err,
                response,
                isDisposed: true,
            });
        }
        callback({
            err,
            response,
        });
    }
    publish(message, callback) {
        try {
            const correlationId = (0, random_string_generator_util_1.randomStringGenerator)();
            const listener = ({ content, options, }) => this.handleMessage(JSON.parse(content.toString()), options, callback);
            Object.assign(message, { id: correlationId });
            const serializedPacket = this.serializer.serialize(message);
            const options = serializedPacket.options;
            delete serializedPacket.options;
            this.responseEmitter.on(correlationId, listener);
            this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(serializedPacket)), Object.assign(Object.assign({ replyTo: this.replyQueue, persistent: this.persistent }, options), { headers: this.mergeHeaders(options === null || options === void 0 ? void 0 : options.headers), correlationId }));
            return () => this.responseEmitter.removeListener(correlationId, listener);
        }
        catch (err) {
            callback({ err });
        }
    }
    dispatchEvent(packet) {
        const serializedPacket = this.serializer.serialize(packet);
        const options = serializedPacket.options;
        delete serializedPacket.options;
        return new Promise((resolve, reject) => this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(serializedPacket)), Object.assign(Object.assign({ persistent: this.persistent }, options), { headers: this.mergeHeaders(options === null || options === void 0 ? void 0 : options.headers) }), (err) => (err ? reject(err) : resolve())));
    }
    initializeSerializer(options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new rmq_record_serializer_1.RmqRecordSerializer();
    }
    mergeHeaders(requestHeaders) {
        var _a, _b;
        if (!requestHeaders && !((_a = this.options) === null || _a === void 0 ? void 0 : _a.headers)) {
            return undefined;
        }
        return Object.assign(Object.assign({}, (_b = this.options) === null || _b === void 0 ? void 0 : _b.headers), requestHeaders);
    }
}
exports.ClientRMQ = ClientRMQ;


/***/ }),
/* 110 */
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RmqRecordSerializer = void 0;
const shared_utils_1 = __webpack_require__(26);
const record_builders_1 = __webpack_require__(97);
class RmqRecordSerializer {
    serialize(packet) {
        if ((packet === null || packet === void 0 ? void 0 : packet.data) &&
            (0, shared_utils_1.isObject)(packet.data) &&
            packet.data instanceof record_builders_1.RmqRecord) {
            const record = packet.data;
            return Object.assign(Object.assign({}, packet), { data: record.data, options: record.options });
        }
        return packet;
    }
}
exports.RmqRecordSerializer = RmqRecordSerializer;


/***/ }),
/* 112 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientTCP = void 0;
const common_1 = __webpack_require__(6);
const net = __webpack_require__(113);
const rxjs_1 = __webpack_require__(59);
const operators_1 = __webpack_require__(68);
const constants_1 = __webpack_require__(60);
const helpers_1 = __webpack_require__(82);
const client_proxy_1 = __webpack_require__(66);
class ClientTCP extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.logger = new common_1.Logger(ClientTCP.name);
        this.isConnected = false;
        this.port = this.getOptionsProp(options, 'port') || constants_1.TCP_DEFAULT_PORT;
        this.host = this.getOptionsProp(options, 'host') || constants_1.TCP_DEFAULT_HOST;
        this.socketClass =
            this.getOptionsProp(options, 'socketClass') || helpers_1.JsonSocket;
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    connect() {
        if (this.connection) {
            return this.connection;
        }
        this.socket = this.createSocket();
        this.bindEvents(this.socket);
        const source$ = this.connect$(this.socket.netSocket).pipe((0, operators_1.tap)(() => {
            this.isConnected = true;
            this.socket.on(constants_1.MESSAGE_EVENT, (buffer) => this.handleResponse(buffer));
        }), (0, operators_1.share)());
        this.socket.connect(this.port, this.host);
        this.connection = (0, rxjs_1.lastValueFrom)(source$).catch(err => {
            if (err instanceof rxjs_1.EmptyError) {
                return;
            }
            throw err;
        });
        return this.connection;
    }
    async handleResponse(buffer) {
        const { err, response, isDisposed, id } = await this.deserializer.deserialize(buffer);
        const callback = this.routingMap.get(id);
        if (!callback) {
            return undefined;
        }
        if (isDisposed || err) {
            return callback({
                err,
                response,
                isDisposed: true,
            });
        }
        callback({
            err,
            response,
        });
    }
    createSocket() {
        return new this.socketClass(new net.Socket());
    }
    close() {
        this.socket && this.socket.end();
        this.handleClose();
    }
    bindEvents(socket) {
        socket.on(constants_1.ERROR_EVENT, (err) => err.code !== constants_1.ECONNREFUSED && this.handleError(err));
        socket.on(constants_1.CLOSE_EVENT, () => this.handleClose());
    }
    handleError(err) {
        this.logger.error(err);
    }
    handleClose() {
        this.isConnected = false;
        this.socket = null;
        this.connection = undefined;
        if (this.routingMap.size > 0) {
            const err = new Error('Connection closed');
            for (const callback of this.routingMap.values()) {
                callback({ err });
            }
            this.routingMap.clear();
        }
    }
    publish(partialPacket, callback) {
        try {
            const packet = this.assignPacketId(partialPacket);
            const serializedPacket = this.serializer.serialize(packet);
            this.routingMap.set(packet.id, callback);
            this.socket.sendMessage(serializedPacket);
            return () => this.routingMap.delete(packet.id);
        }
        catch (err) {
            callback({ err });
        }
    }
    async dispatchEvent(packet) {
        const pattern = this.normalizePattern(packet.pattern);
        const serializedPacket = this.serializer.serialize(Object.assign(Object.assign({}, packet), { pattern }));
        return this.socket.sendMessage(serializedPacket);
    }
}
exports.ClientTCP = ClientTCP;


/***/ }),
/* 113 */
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),
/* 114 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(115), exports);
tslib_1.__exportStar(__webpack_require__(117), exports);
tslib_1.__exportStar(__webpack_require__(118), exports);
tslib_1.__exportStar(__webpack_require__(119), exports);
tslib_1.__exportStar(__webpack_require__(120), exports);
tslib_1.__exportStar(__webpack_require__(121), exports);
tslib_1.__exportStar(__webpack_require__(116), exports);


/***/ }),
/* 115 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaContext = void 0;
const base_rpc_context_1 = __webpack_require__(116);
class KafkaContext extends base_rpc_context_1.BaseRpcContext {
    constructor(args) {
        super(args);
    }
    /**
     * Returns the reference to the original message.
     */
    getMessage() {
        return this.args[0];
    }
    /**
     * Returns the partition.
     */
    getPartition() {
        return this.args[1];
    }
    /**
     * Returns the name of the topic.
     */
    getTopic() {
        return this.args[2];
    }
    /**
     * Returns the Kafka consumer reference.
     */
    getConsumer() {
        return this.args[3];
    }
    /**
     * Returns the Kafka heartbeat callback.
     */
    getHeartbeat() {
        return this.args[4];
    }
    /**
     * Returns the Kafka producer reference,
     */
    getProducer() {
        return this.args[5];
    }
}
exports.KafkaContext = KafkaContext;


/***/ }),
/* 116 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseRpcContext = void 0;
class BaseRpcContext {
    constructor(args) {
        this.args = args;
    }
    /**
     * Returns the array of arguments being passed to the handler.
     */
    getArgs() {
        return this.args;
    }
    /**
     * Returns a particular argument by index.
     * @param index index of argument to retrieve
     */
    getArgByIndex(index) {
        return this.args[index];
    }
}
exports.BaseRpcContext = BaseRpcContext;


/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MqttContext = void 0;
const base_rpc_context_1 = __webpack_require__(116);
class MqttContext extends base_rpc_context_1.BaseRpcContext {
    constructor(args) {
        super(args);
    }
    /**
     * Returns the name of the topic.
     */
    getTopic() {
        return this.args[0];
    }
    /**
     * Returns the reference to the original MQTT packet.
     */
    getPacket() {
        return this.args[1];
    }
}
exports.MqttContext = MqttContext;


/***/ }),
/* 118 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NatsContext = void 0;
const base_rpc_context_1 = __webpack_require__(116);
class NatsContext extends base_rpc_context_1.BaseRpcContext {
    constructor(args) {
        super(args);
    }
    /**
     * Returns the name of the subject.
     */
    getSubject() {
        return this.args[0];
    }
    /**
     * Returns message headers (if exist).
     */
    getHeaders() {
        return this.args[1];
    }
}
exports.NatsContext = NatsContext;


/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisContext = void 0;
const base_rpc_context_1 = __webpack_require__(116);
class RedisContext extends base_rpc_context_1.BaseRpcContext {
    constructor(args) {
        super(args);
    }
    /**
     * Returns the name of the channel.
     */
    getChannel() {
        return this.args[0];
    }
}
exports.RedisContext = RedisContext;


/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RmqContext = void 0;
const base_rpc_context_1 = __webpack_require__(116);
class RmqContext extends base_rpc_context_1.BaseRpcContext {
    constructor(args) {
        super(args);
    }
    /**
     * Returns the original message (with properties, fields, and content).
     */
    getMessage() {
        return this.args[0];
    }
    /**
     * Returns the reference to the original RMQ channel.
     */
    getChannelRef() {
        return this.args[1];
    }
    /**
     * Returns the name of the pattern.
     */
    getPattern() {
        return this.args[2];
    }
}
exports.RmqContext = RmqContext;


/***/ }),
/* 121 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TcpContext = void 0;
const base_rpc_context_1 = __webpack_require__(116);
class TcpContext extends base_rpc_context_1.BaseRpcContext {
    constructor(args) {
        super(args);
    }
    /**
     * Returns the underlying JSON socket.
     */
    getSocketRef() {
        return this.args[0];
    }
    /**
     * Returns the name of the pattern.
     */
    getPattern() {
        return this.args[1];
    }
}
exports.TcpContext = TcpContext;


/***/ }),
/* 122 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(123), exports);
tslib_1.__exportStar(__webpack_require__(124), exports);
tslib_1.__exportStar(__webpack_require__(128), exports);
tslib_1.__exportStar(__webpack_require__(130), exports);
tslib_1.__exportStar(__webpack_require__(131), exports);
tslib_1.__exportStar(__webpack_require__(132), exports);


/***/ }),
/* 123 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Client = void 0;
const constants_1 = __webpack_require__(60);
/**
 * Attaches the `ClientProxy` instance to the given property
 *
 * @param  {ClientOptions} metadata optional client metadata
 */
function Client(metadata) {
    return (target, propertyKey) => {
        Reflect.set(target, propertyKey, null);
        Reflect.defineMetadata(constants_1.CLIENT_METADATA, true, target, propertyKey);
        Reflect.defineMetadata(constants_1.CLIENT_CONFIGURATION_METADATA, metadata, target, propertyKey);
    };
}
exports.Client = Client;


/***/ }),
/* 124 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ctx = void 0;
const rpc_paramtype_enum_1 = __webpack_require__(125);
const param_utils_1 = __webpack_require__(126);
exports.Ctx = (0, param_utils_1.createRpcParamDecorator)(rpc_paramtype_enum_1.RpcParamtype.CONTEXT);


/***/ }),
/* 125 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcParamtype = void 0;
var RpcParamtype;
(function (RpcParamtype) {
    RpcParamtype[RpcParamtype["PAYLOAD"] = 3] = "PAYLOAD";
    RpcParamtype[RpcParamtype["CONTEXT"] = 6] = "CONTEXT";
    RpcParamtype[RpcParamtype["GRPC_CALL"] = 9] = "GRPC_CALL";
})(RpcParamtype = exports.RpcParamtype || (exports.RpcParamtype = {}));


/***/ }),
/* 126 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createPipesRpcParamDecorator = exports.createRpcParamDecorator = void 0;
const route_params_decorator_1 = __webpack_require__(127);
const shared_utils_1 = __webpack_require__(26);
__webpack_require__(54);
const constants_1 = __webpack_require__(60);
function createRpcParamDecorator(paramtype) {
    return (...pipes) => (target, key, index) => {
        const args = Reflect.getMetadata(constants_1.PARAM_ARGS_METADATA, target.constructor, key) || {};
        Reflect.defineMetadata(constants_1.PARAM_ARGS_METADATA, (0, route_params_decorator_1.assignMetadata)(args, paramtype, index, undefined, ...pipes), target.constructor, key);
    };
}
exports.createRpcParamDecorator = createRpcParamDecorator;
const createPipesRpcParamDecorator = (paramtype) => (data, ...pipes) => (target, key, index) => {
    const args = Reflect.getMetadata(constants_1.PARAM_ARGS_METADATA, target.constructor, key) || {};
    const hasParamData = (0, shared_utils_1.isNil)(data) || (0, shared_utils_1.isString)(data);
    const paramData = hasParamData ? data : undefined;
    const paramPipes = hasParamData ? pipes : [data, ...pipes];
    Reflect.defineMetadata(constants_1.PARAM_ARGS_METADATA, (0, route_params_decorator_1.assignMetadata)(args, paramtype, index, paramData, ...paramPipes), target.constructor, key);
};
exports.createPipesRpcParamDecorator = createPipesRpcParamDecorator;


/***/ }),
/* 127 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/decorators/http/route-params.decorator");

/***/ }),
/* 128 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventPattern = void 0;
const shared_utils_1 = __webpack_require__(26);
const constants_1 = __webpack_require__(60);
const pattern_handler_enum_1 = __webpack_require__(129);
/**
 * Subscribes to incoming events which fulfils chosen pattern.
 */
const EventPattern = (metadata, transportOrExtras, maybeExtras) => {
    let transport;
    let extras;
    if (((0, shared_utils_1.isNumber)(transportOrExtras) || (0, shared_utils_1.isSymbol)(transportOrExtras)) &&
        (0, shared_utils_1.isNil)(maybeExtras)) {
        transport = transportOrExtras;
    }
    else if ((0, shared_utils_1.isObject)(transportOrExtras) && (0, shared_utils_1.isNil)(maybeExtras)) {
        extras = transportOrExtras;
    }
    else {
        transport = transportOrExtras;
        extras = maybeExtras;
    }
    return (target, key, descriptor) => {
        Reflect.defineMetadata(constants_1.PATTERN_METADATA, [].concat(metadata), descriptor.value);
        Reflect.defineMetadata(constants_1.PATTERN_HANDLER_METADATA, pattern_handler_enum_1.PatternHandler.EVENT, descriptor.value);
        Reflect.defineMetadata(constants_1.TRANSPORT_METADATA, transport, descriptor.value);
        Reflect.defineMetadata(constants_1.PATTERN_EXTRAS_METADATA, extras, descriptor.value);
        return descriptor;
    };
};
exports.EventPattern = EventPattern;


/***/ }),
/* 129 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PatternHandler = void 0;
var PatternHandler;
(function (PatternHandler) {
    PatternHandler[PatternHandler["MESSAGE"] = 1] = "MESSAGE";
    PatternHandler[PatternHandler["EVENT"] = 2] = "EVENT";
})(PatternHandler = exports.PatternHandler || (exports.PatternHandler = {}));


/***/ }),
/* 130 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GrpcService = void 0;
const common_1 = __webpack_require__(6);
/**
 * Defines the GrpcService. The service can inject dependencies through constructor.
 * Those dependencies have to belong to the same module.
 */
exports.GrpcService = common_1.Controller;


/***/ }),
/* 131 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createGrpcMethodMetadata = exports.GrpcStreamCall = exports.GrpcStreamMethod = exports.GrpcMethod = exports.MessagePattern = exports.GrpcMethodStreamingType = void 0;
const shared_utils_1 = __webpack_require__(26);
/* eslint-disable @typescript-eslint/no-use-before-define */
const constants_1 = __webpack_require__(60);
const pattern_handler_enum_1 = __webpack_require__(129);
const enums_1 = __webpack_require__(79);
var GrpcMethodStreamingType;
(function (GrpcMethodStreamingType) {
    GrpcMethodStreamingType["NO_STREAMING"] = "no_stream";
    GrpcMethodStreamingType["RX_STREAMING"] = "rx_stream";
    GrpcMethodStreamingType["PT_STREAMING"] = "pt_stream";
})(GrpcMethodStreamingType = exports.GrpcMethodStreamingType || (exports.GrpcMethodStreamingType = {}));
/**
 * Subscribes to incoming messages which fulfils chosen pattern.
 */
const MessagePattern = (metadata, transportOrExtras, maybeExtras) => {
    let transport;
    let extras;
    if (((0, shared_utils_1.isNumber)(transportOrExtras) || (0, shared_utils_1.isSymbol)(transportOrExtras)) &&
        (0, shared_utils_1.isNil)(maybeExtras)) {
        transport = transportOrExtras;
    }
    else if ((0, shared_utils_1.isObject)(transportOrExtras) && (0, shared_utils_1.isNil)(maybeExtras)) {
        extras = transportOrExtras;
    }
    else {
        transport = transportOrExtras;
        extras = maybeExtras;
    }
    return (target, key, descriptor) => {
        Reflect.defineMetadata(constants_1.PATTERN_METADATA, [].concat(metadata), descriptor.value);
        Reflect.defineMetadata(constants_1.PATTERN_HANDLER_METADATA, pattern_handler_enum_1.PatternHandler.MESSAGE, descriptor.value);
        Reflect.defineMetadata(constants_1.TRANSPORT_METADATA, transport, descriptor.value);
        Reflect.defineMetadata(constants_1.PATTERN_EXTRAS_METADATA, extras, descriptor.value);
        return descriptor;
    };
};
exports.MessagePattern = MessagePattern;
function GrpcMethod(service, method) {
    return (target, key, descriptor) => {
        const metadata = createGrpcMethodMetadata(target, key, service, method);
        return (0, exports.MessagePattern)(metadata, enums_1.Transport.GRPC)(target, key, descriptor);
    };
}
exports.GrpcMethod = GrpcMethod;
function GrpcStreamMethod(service, method) {
    return (target, key, descriptor) => {
        const metadata = createGrpcMethodMetadata(target, key, service, method, GrpcMethodStreamingType.RX_STREAMING);
        return (0, exports.MessagePattern)(metadata, enums_1.Transport.GRPC)(target, key, descriptor);
    };
}
exports.GrpcStreamMethod = GrpcStreamMethod;
function GrpcStreamCall(service, method) {
    return (target, key, descriptor) => {
        const metadata = createGrpcMethodMetadata(target, key, service, method, GrpcMethodStreamingType.PT_STREAMING);
        return (0, exports.MessagePattern)(metadata, enums_1.Transport.GRPC)(target, key, descriptor);
    };
}
exports.GrpcStreamCall = GrpcStreamCall;
function createGrpcMethodMetadata(target, key, service, method, streaming = GrpcMethodStreamingType.NO_STREAMING) {
    const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    if (!service) {
        const { name } = target.constructor;
        return {
            service: name,
            rpc: capitalizeFirstLetter(key),
            streaming,
        };
    }
    if (service && !method) {
        return { service, rpc: capitalizeFirstLetter(key), streaming };
    }
    return { service, rpc: method, streaming };
}
exports.createGrpcMethodMetadata = createGrpcMethodMetadata;


/***/ }),
/* 132 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Payload = void 0;
const rpc_paramtype_enum_1 = __webpack_require__(125);
const param_utils_1 = __webpack_require__(126);
function Payload(propertyOrPipe, ...pipes) {
    return (0, param_utils_1.createPipesRpcParamDecorator)(rpc_paramtype_enum_1.RpcParamtype.PAYLOAD)(propertyOrPipe, ...pipes);
}
exports.Payload = Payload;


/***/ }),
/* 133 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(134), exports);
tslib_1.__exportStar(__webpack_require__(137), exports);
tslib_1.__exportStar(__webpack_require__(136), exports);


/***/ }),
/* 134 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseRpcExceptionFilter = void 0;
/* eslint-disable prefer-spread */
const common_1 = __webpack_require__(6);
const shared_utils_1 = __webpack_require__(26);
const constants_1 = __webpack_require__(135);
const rxjs_1 = __webpack_require__(59);
const rpc_exception_1 = __webpack_require__(136);
class BaseRpcExceptionFilter {
    catch(exception, host) {
        const status = 'error';
        if (!(exception instanceof rpc_exception_1.RpcException)) {
            return this.handleUnknownError(exception, status);
        }
        const res = exception.getError();
        const message = (0, shared_utils_1.isObject)(res) ? res : { status, message: res };
        return (0, rxjs_1.throwError)(() => message);
    }
    handleUnknownError(exception, status) {
        const errorMessage = constants_1.MESSAGES.UNKNOWN_EXCEPTION_MESSAGE;
        const loggerArgs = this.isError(exception)
            ? [exception.message, exception.stack]
            : [exception];
        const logger = BaseRpcExceptionFilter.logger;
        logger.error.apply(logger, loggerArgs);
        return (0, rxjs_1.throwError)(() => ({ status, message: errorMessage }));
    }
    isError(exception) {
        return !!((0, shared_utils_1.isObject)(exception) && exception.message);
    }
}
exports.BaseRpcExceptionFilter = BaseRpcExceptionFilter;
BaseRpcExceptionFilter.logger = new common_1.Logger('RpcExceptionsHandler');


/***/ }),
/* 135 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/constants");

/***/ }),
/* 136 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcException = void 0;
const shared_utils_1 = __webpack_require__(26);
class RpcException extends Error {
    constructor(error) {
        super();
        this.error = error;
        this.initMessage();
    }
    initMessage() {
        if ((0, shared_utils_1.isString)(this.error)) {
            this.message = this.error;
        }
        else if ((0, shared_utils_1.isObject)(this.error) &&
            (0, shared_utils_1.isString)(this.error.message)) {
            this.message = this.error.message;
        }
        else if (this.constructor) {
            this.message = this.constructor.name
                .match(/[A-Z][a-z]+|[0-9]+/g)
                .join(' ');
        }
    }
    getError() {
        return this.error;
    }
}
exports.RpcException = RpcException;


/***/ }),
/* 137 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaRetriableException = void 0;
const rpc_exception_1 = __webpack_require__(136);
/**
 * Exception that instructs Kafka driver to instead of introspecting
 * error processing flow and sending serialized error message to the consumer,
 * force bubble it up to the "eachMessage" callback of the underlying "kafkajs" package
 * (even if interceptors are applied, or an observable stream is returned from the message handler).
 *
 * A transient exception that if retried may succeed.
 *
 * @publicApi
 */
class KafkaRetriableException extends rpc_exception_1.RpcException {
    getError() {
        return this;
    }
}
exports.KafkaRetriableException = KafkaRetriableException;


/***/ }),
/* 138 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(139), exports);
tslib_1.__exportStar(__webpack_require__(140), exports);
tslib_1.__exportStar(__webpack_require__(141), exports);
tslib_1.__exportStar(__webpack_require__(142), exports);
tslib_1.__exportStar(__webpack_require__(143), exports);
tslib_1.__exportStar(__webpack_require__(144), exports);
tslib_1.__exportStar(__webpack_require__(145), exports);
tslib_1.__exportStar(__webpack_require__(146), exports);
tslib_1.__exportStar(__webpack_require__(147), exports);
tslib_1.__exportStar(__webpack_require__(148), exports);
tslib_1.__exportStar(__webpack_require__(149), exports);
tslib_1.__exportStar(__webpack_require__(150), exports);


/***/ }),
/* 139 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 140 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 141 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 142 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 143 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 144 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 145 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 146 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 147 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 148 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 149 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 150 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 151 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(152), exports);
tslib_1.__exportStar(__webpack_require__(153), exports);


/***/ }),
/* 152 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var ClientsModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientsModule = void 0;
const tslib_1 = __webpack_require__(53);
const common_1 = __webpack_require__(6);
const client_1 = __webpack_require__(55);
let ClientsModule = ClientsModule_1 = class ClientsModule {
    static register(options) {
        const clients = (options || []).map(item => ({
            provide: item.name,
            useValue: this.assignOnAppShutdownHook(client_1.ClientProxyFactory.create(item)),
        }));
        return {
            module: ClientsModule_1,
            providers: clients,
            exports: clients,
        };
    }
    static registerAsync(options) {
        const providers = options.reduce((accProviders, item) => accProviders
            .concat(this.createAsyncProviders(item))
            .concat(item.extraProviders || []), []);
        const imports = options.reduce((accImports, option) => option.imports && !accImports.includes(option.imports)
            ? accImports.concat(option.imports)
            : accImports, []);
        return {
            module: ClientsModule_1,
            imports,
            providers: providers,
            exports: providers,
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: options.name,
                useFactory: this.createFactoryWrapper(options.useFactory),
                inject: options.inject || [],
            };
        }
        return {
            provide: options.name,
            useFactory: this.createFactoryWrapper((optionsFactory) => optionsFactory.createClientOptions()),
            inject: [options.useExisting || options.useClass],
        };
    }
    static createFactoryWrapper(useFactory) {
        return async (...args) => {
            const clientOptions = await useFactory(...args);
            const clientProxyRef = client_1.ClientProxyFactory.create(clientOptions);
            return this.assignOnAppShutdownHook(clientProxyRef);
        };
    }
    static assignOnAppShutdownHook(client) {
        client.onApplicationShutdown =
            client.close;
        return client;
    }
};
ClientsModule = ClientsModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], ClientsModule);
exports.ClientsModule = ClientsModule;


/***/ }),
/* 153 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(154), exports);


/***/ }),
/* 154 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 155 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NestMicroservice = void 0;
const logger_service_1 = __webpack_require__(57);
const constants_1 = __webpack_require__(135);
const optional_require_1 = __webpack_require__(156);
const nest_application_context_1 = __webpack_require__(157);
const transport_enum_1 = __webpack_require__(80);
const microservices_module_1 = __webpack_require__(158);
const server_factory_1 = __webpack_require__(198);
const { SocketModule } = (0, optional_require_1.optionalRequire)('@nestjs/websockets/socket-module', () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@nestjs/websockets/socket-module'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
class NestMicroservice extends nest_application_context_1.NestApplicationContext {
    constructor(container, config = {}, applicationConfig) {
        super(container);
        this.applicationConfig = applicationConfig;
        this.logger = new logger_service_1.Logger(NestMicroservice.name, {
            timestamp: true,
        });
        this.microservicesModule = new microservices_module_1.MicroservicesModule();
        this.socketModule = SocketModule ? new SocketModule() : null;
        this.isTerminated = false;
        this.isInitHookCalled = false;
        this.microservicesModule.register(container, this.applicationConfig);
        this.createServer(config);
        this.selectContextModule();
    }
    createServer(config) {
        try {
            this.microserviceConfig = Object.assign({ transport: transport_enum_1.Transport.TCP }, config);
            const { strategy } = config;
            this.server = strategy
                ? strategy
                : server_factory_1.ServerFactory.create(this.microserviceConfig);
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async registerModules() {
        this.socketModule &&
            this.socketModule.register(this.container, this.applicationConfig);
        this.microservicesModule.setupClients(this.container);
        this.registerListeners();
        this.setIsInitialized(true);
        if (!this.isInitHookCalled) {
            await this.callInitHook();
            await this.callBootstrapHook();
        }
    }
    registerListeners() {
        this.microservicesModule.setupListeners(this.container, this.server);
    }
    useWebSocketAdapter(adapter) {
        this.applicationConfig.setIoAdapter(adapter);
        return this;
    }
    useGlobalFilters(...filters) {
        this.applicationConfig.useGlobalFilters(...filters);
        return this;
    }
    useGlobalPipes(...pipes) {
        this.applicationConfig.useGlobalPipes(...pipes);
        return this;
    }
    useGlobalInterceptors(...interceptors) {
        this.applicationConfig.useGlobalInterceptors(...interceptors);
        return this;
    }
    useGlobalGuards(...guards) {
        this.applicationConfig.useGlobalGuards(...guards);
        return this;
    }
    async init() {
        if (this.isInitialized) {
            return this;
        }
        await super.init();
        await this.registerModules();
        return this;
    }
    async listen() {
        !this.isInitialized && (await this.registerModules());
        return new Promise((resolve, reject) => {
            this.server.listen((err, info) => {
                var _a, _b;
                if ((_b = (_a = this.microserviceConfig) === null || _a === void 0 ? void 0 : _a.autoFlushLogs) !== null && _b !== void 0 ? _b : true) {
                    this.flushLogs();
                }
                if (err) {
                    return reject(err);
                }
                this.logger.log(constants_1.MESSAGES.MICROSERVICE_READY);
                resolve(info);
            });
        });
    }
    async close() {
        await this.server.close();
        if (this.isTerminated) {
            return;
        }
        this.setIsTerminated(true);
        await this.closeApplication();
    }
    setIsInitialized(isInitialized) {
        this.isInitialized = isInitialized;
    }
    setIsTerminated(isTerminated) {
        this.isTerminated = isTerminated;
    }
    setIsInitHookCalled(isInitHookCalled) {
        this.isInitHookCalled = isInitHookCalled;
    }
    async closeApplication() {
        this.socketModule && (await this.socketModule.close());
        this.microservicesModule && (await this.microservicesModule.close());
        await super.close();
        this.setIsTerminated(true);
    }
    async dispose() {
        if (this.isTerminated) {
            return;
        }
        await this.server.close();
        this.socketModule && (await this.socketModule.close());
        this.microservicesModule && (await this.microservicesModule.close());
    }
}
exports.NestMicroservice = NestMicroservice;


/***/ }),
/* 156 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/helpers/optional-require");

/***/ }),
/* 157 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/nest-application-context");

/***/ }),
/* 158 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MicroservicesModule = void 0;
const runtime_exception_1 = __webpack_require__(63);
const guards_consumer_1 = __webpack_require__(159);
const guards_context_creator_1 = __webpack_require__(160);
const injector_1 = __webpack_require__(161);
const interceptors_consumer_1 = __webpack_require__(162);
const interceptors_context_creator_1 = __webpack_require__(163);
const pipes_consumer_1 = __webpack_require__(164);
const pipes_context_creator_1 = __webpack_require__(165);
const client_1 = __webpack_require__(55);
const container_1 = __webpack_require__(166);
const exception_filters_context_1 = __webpack_require__(167);
const rpc_context_creator_1 = __webpack_require__(173);
const rpc_proxy_1 = __webpack_require__(179);
const listeners_controller_1 = __webpack_require__(181);
class MicroservicesModule {
    constructor() {
        this.clientsContainer = new container_1.ClientsContainer();
    }
    register(container, config) {
        const exceptionFiltersContext = new exception_filters_context_1.ExceptionFiltersContext(container, config);
        const contextCreator = new rpc_context_creator_1.RpcContextCreator(new rpc_proxy_1.RpcProxy(), exceptionFiltersContext, new pipes_context_creator_1.PipesContextCreator(container, config), new pipes_consumer_1.PipesConsumer(), new guards_context_creator_1.GuardsContextCreator(container, config), new guards_consumer_1.GuardsConsumer(), new interceptors_context_creator_1.InterceptorsContextCreator(container, config), new interceptors_consumer_1.InterceptorsConsumer());
        const injector = new injector_1.Injector();
        this.listenersController = new listeners_controller_1.ListenersController(this.clientsContainer, contextCreator, container, injector, client_1.ClientProxyFactory, exceptionFiltersContext);
    }
    setupListeners(container, server) {
        if (!this.listenersController) {
            throw new runtime_exception_1.RuntimeException();
        }
        const modules = container.getModules();
        modules.forEach(({ controllers }, moduleRef) => this.bindListeners(controllers, server, moduleRef));
    }
    setupClients(container) {
        if (!this.listenersController) {
            throw new runtime_exception_1.RuntimeException();
        }
        const modules = container.getModules();
        modules.forEach(({ controllers, providers }) => {
            this.bindClients(controllers);
            this.bindClients(providers);
        });
    }
    bindListeners(controllers, server, moduleName) {
        controllers.forEach(wrapper => this.listenersController.registerPatternHandlers(wrapper, server, moduleName));
    }
    bindClients(items) {
        items.forEach(({ instance, isNotMetatype }) => {
            !isNotMetatype &&
                this.listenersController.assignClientsToProperties(instance);
        });
    }
    async close() {
        const clients = this.clientsContainer.getAllClients();
        await Promise.all(clients.map(client => client.close()));
        this.clientsContainer.clear();
    }
}
exports.MicroservicesModule = MicroservicesModule;


/***/ }),
/* 159 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/guards/guards-consumer");

/***/ }),
/* 160 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/guards/guards-context-creator");

/***/ }),
/* 161 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/injector/injector");

/***/ }),
/* 162 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/interceptors/interceptors-consumer");

/***/ }),
/* 163 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/interceptors/interceptors-context-creator");

/***/ }),
/* 164 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/pipes/pipes-consumer");

/***/ }),
/* 165 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/pipes/pipes-context-creator");

/***/ }),
/* 166 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientsContainer = void 0;
class ClientsContainer {
    constructor() {
        this.clients = [];
    }
    getAllClients() {
        return this.clients;
    }
    addClient(client) {
        this.clients.push(client);
    }
    clear() {
        this.clients = [];
    }
}
exports.ClientsContainer = ClientsContainer;


/***/ }),
/* 167 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExceptionFiltersContext = void 0;
const constants_1 = __webpack_require__(61);
const shared_utils_1 = __webpack_require__(26);
const base_exception_filter_context_1 = __webpack_require__(168);
const constants_2 = __webpack_require__(169);
const rpc_exceptions_handler_1 = __webpack_require__(170);
const iterare_1 = __webpack_require__(172);
class ExceptionFiltersContext extends base_exception_filter_context_1.BaseExceptionFilterContext {
    constructor(container, config) {
        super(container);
        this.config = config;
    }
    create(instance, callback, module, contextId = constants_2.STATIC_CONTEXT, inquirerId) {
        this.moduleContext = module;
        const exceptionHandler = new rpc_exceptions_handler_1.RpcExceptionsHandler();
        const filters = this.createContext(instance, callback, constants_1.EXCEPTION_FILTERS_METADATA, contextId, inquirerId);
        if ((0, shared_utils_1.isEmpty)(filters)) {
            return exceptionHandler;
        }
        exceptionHandler.setCustomFilters(filters.reverse());
        return exceptionHandler;
    }
    getGlobalMetadata(contextId = constants_2.STATIC_CONTEXT, inquirerId) {
        const globalFilters = this.config.getGlobalFilters();
        if (contextId === constants_2.STATIC_CONTEXT && !inquirerId) {
            return globalFilters;
        }
        const scopedFilterWrappers = this.config.getGlobalRequestFilters();
        const scopedFilters = (0, iterare_1.iterate)(scopedFilterWrappers)
            .map(wrapper => wrapper.getInstanceByContextId(contextId, inquirerId))
            .filter(host => !!host)
            .map(host => host.instance)
            .toArray();
        return globalFilters.concat(scopedFilters);
    }
}
exports.ExceptionFiltersContext = ExceptionFiltersContext;


/***/ }),
/* 168 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/exceptions/base-exception-filter-context");

/***/ }),
/* 169 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/injector/constants");

/***/ }),
/* 170 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcExceptionsHandler = void 0;
const shared_utils_1 = __webpack_require__(26);
const invalid_exception_filter_exception_1 = __webpack_require__(171);
const base_rpc_exception_filter_1 = __webpack_require__(134);
class RpcExceptionsHandler extends base_rpc_exception_filter_1.BaseRpcExceptionFilter {
    constructor() {
        super(...arguments);
        this.filters = [];
    }
    handle(exception, host) {
        const filterResult$ = this.invokeCustomFilters(exception, host);
        if (filterResult$) {
            return filterResult$;
        }
        return super.catch(exception, host);
    }
    setCustomFilters(filters) {
        if (!Array.isArray(filters)) {
            throw new invalid_exception_filter_exception_1.InvalidExceptionFilterException();
        }
        this.filters = filters;
    }
    invokeCustomFilters(exception, host) {
        if ((0, shared_utils_1.isEmpty)(this.filters)) {
            return null;
        }
        const filter = this.filters.find(({ exceptionMetatypes }) => {
            const hasMetatype = !exceptionMetatypes.length ||
                exceptionMetatypes.some(ExceptionMetatype => exception instanceof ExceptionMetatype);
            return hasMetatype;
        });
        return filter ? filter.func(exception, host) : null;
    }
}
exports.RpcExceptionsHandler = RpcExceptionsHandler;


/***/ }),
/* 171 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/errors/exceptions/invalid-exception-filter.exception");

/***/ }),
/* 172 */
/***/ ((module) => {

"use strict";
module.exports = require("iterare");

/***/ }),
/* 173 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcContextCreator = void 0;
const constants_1 = __webpack_require__(61);
const shared_utils_1 = __webpack_require__(26);
const constants_2 = __webpack_require__(174);
const context_utils_1 = __webpack_require__(175);
const handler_metadata_storage_1 = __webpack_require__(176);
const constants_3 = __webpack_require__(169);
const constants_4 = __webpack_require__(60);
const exceptions_1 = __webpack_require__(133);
const rpc_params_factory_1 = __webpack_require__(177);
const rpc_metadata_constants_1 = __webpack_require__(178);
class RpcContextCreator {
    constructor(rpcProxy, exceptionFiltersContext, pipesContextCreator, pipesConsumer, guardsContextCreator, guardsConsumer, interceptorsContextCreator, interceptorsConsumer) {
        this.rpcProxy = rpcProxy;
        this.exceptionFiltersContext = exceptionFiltersContext;
        this.pipesContextCreator = pipesContextCreator;
        this.pipesConsumer = pipesConsumer;
        this.guardsContextCreator = guardsContextCreator;
        this.guardsConsumer = guardsConsumer;
        this.interceptorsContextCreator = interceptorsContextCreator;
        this.interceptorsConsumer = interceptorsConsumer;
        this.contextUtils = new context_utils_1.ContextUtils();
        this.rpcParamsFactory = new rpc_params_factory_1.RpcParamsFactory();
        this.handlerMetadataStorage = new handler_metadata_storage_1.HandlerMetadataStorage();
    }
    create(instance, callback, moduleKey, methodName, contextId = constants_3.STATIC_CONTEXT, inquirerId, defaultCallMetadata = rpc_metadata_constants_1.DEFAULT_CALLBACK_METADATA) {
        const contextType = 'rpc';
        const { argsLength, paramtypes, getParamsMetadata } = this.getMetadata(instance, methodName, defaultCallMetadata, contextType);
        const exceptionHandler = this.exceptionFiltersContext.create(instance, callback, moduleKey, contextId, inquirerId);
        const pipes = this.pipesContextCreator.create(instance, callback, moduleKey, contextId, inquirerId);
        const guards = this.guardsContextCreator.create(instance, callback, moduleKey, contextId, inquirerId);
        const interceptors = this.interceptorsContextCreator.create(instance, callback, moduleKey, contextId, inquirerId);
        const paramsMetadata = getParamsMetadata(moduleKey);
        const paramsOptions = paramsMetadata
            ? this.contextUtils.mergeParamsMetatypes(paramsMetadata, paramtypes)
            : [];
        const fnApplyPipes = this.createPipesFn(pipes, paramsOptions);
        const fnCanActivate = this.createGuardsFn(guards, instance, callback, contextType);
        const handler = (initialArgs, args) => async () => {
            if (fnApplyPipes) {
                await fnApplyPipes(initialArgs, ...args);
                return callback.apply(instance, initialArgs);
            }
            return callback.apply(instance, args);
        };
        return this.rpcProxy.create(async (...args) => {
            const initialArgs = this.contextUtils.createNullArray(argsLength);
            fnCanActivate && (await fnCanActivate(args));
            return this.interceptorsConsumer.intercept(interceptors, args, instance, callback, handler(initialArgs, args), contextType);
        }, exceptionHandler);
    }
    reflectCallbackParamtypes(instance, callback) {
        return Reflect.getMetadata(constants_1.PARAMTYPES_METADATA, instance, callback.name);
    }
    createGuardsFn(guards, instance, callback, contextType) {
        const canActivateFn = async (args) => {
            const canActivate = await this.guardsConsumer.tryActivate(guards, args, instance, callback, contextType);
            if (!canActivate) {
                throw new exceptions_1.RpcException(constants_2.FORBIDDEN_MESSAGE);
            }
        };
        return guards.length ? canActivateFn : null;
    }
    getMetadata(instance, methodName, defaultCallMetadata, contextType) {
        const cacheMetadata = this.handlerMetadataStorage.get(instance, methodName);
        if (cacheMetadata) {
            return cacheMetadata;
        }
        const metadata = this.contextUtils.reflectCallbackMetadata(instance, methodName, constants_4.PARAM_ARGS_METADATA) || defaultCallMetadata;
        const keys = Object.keys(metadata);
        const argsLength = this.contextUtils.getArgumentsLength(keys, metadata);
        const paramtypes = this.contextUtils.reflectCallbackParamtypes(instance, methodName);
        const contextFactory = this.contextUtils.getContextFactory(contextType, instance, instance[methodName]);
        const getParamsMetadata = (moduleKey) => this.exchangeKeysForValues(keys, metadata, moduleKey, this.rpcParamsFactory, contextFactory);
        const handlerMetadata = {
            argsLength,
            paramtypes,
            getParamsMetadata,
        };
        this.handlerMetadataStorage.set(instance, methodName, handlerMetadata);
        return handlerMetadata;
    }
    exchangeKeysForValues(keys, metadata, moduleContext, paramsFactory, contextFactory) {
        this.pipesContextCreator.setModuleContext(moduleContext);
        return keys.map(key => {
            const { index, data, pipes: pipesCollection } = metadata[key];
            const pipes = this.pipesContextCreator.createConcreteContext(pipesCollection);
            const type = this.contextUtils.mapParamType(key);
            if (key.includes(constants_1.CUSTOM_ROUTE_ARGS_METADATA)) {
                const { factory } = metadata[key];
                const customExtractValue = this.contextUtils.getCustomFactory(factory, data, contextFactory);
                return { index, extractValue: customExtractValue, type, data, pipes };
            }
            const numericType = Number(type);
            const extractValue = (...args) => paramsFactory.exchangeKeyForValue(numericType, data, args);
            return { index, extractValue, type: numericType, data, pipes };
        });
    }
    createPipesFn(pipes, paramsOptions) {
        const pipesFn = async (args, ...params) => {
            const resolveParamValue = async (param) => {
                const { index, extractValue, type, data, metatype, pipes: paramPipes, } = param;
                const value = extractValue(...params);
                args[index] = await this.getParamValue(value, { metatype, type, data }, pipes.concat(paramPipes));
            };
            await Promise.all(paramsOptions.map(resolveParamValue));
        };
        return paramsOptions.length ? pipesFn : null;
    }
    async getParamValue(value, { metatype, type, data }, pipes) {
        return (0, shared_utils_1.isEmpty)(pipes)
            ? value
            : this.pipesConsumer.apply(value, { metatype, type, data }, pipes);
    }
}
exports.RpcContextCreator = RpcContextCreator;


/***/ }),
/* 174 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/guards/constants");

/***/ }),
/* 175 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/helpers/context-utils");

/***/ }),
/* 176 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/helpers/handler-metadata-storage");

/***/ }),
/* 177 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcParamsFactory = void 0;
const rpc_paramtype_enum_1 = __webpack_require__(125);
class RpcParamsFactory {
    exchangeKeyForValue(type, data, args) {
        var _a;
        if (!args) {
            return null;
        }
        switch (type) {
            case rpc_paramtype_enum_1.RpcParamtype.PAYLOAD:
                return data ? (_a = args[0]) === null || _a === void 0 ? void 0 : _a[data] : args[0];
            case rpc_paramtype_enum_1.RpcParamtype.CONTEXT:
                return args[1];
            case rpc_paramtype_enum_1.RpcParamtype.GRPC_CALL:
                return args[2];
            default:
                return null;
        }
    }
}
exports.RpcParamsFactory = RpcParamsFactory;


/***/ }),
/* 178 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_GRPC_CALLBACK_METADATA = exports.DEFAULT_CALLBACK_METADATA = void 0;
const rpc_paramtype_enum_1 = __webpack_require__(125);
exports.DEFAULT_CALLBACK_METADATA = {
    [`${rpc_paramtype_enum_1.RpcParamtype.PAYLOAD}:0`]: { index: 0, data: undefined, pipes: [] },
};
exports.DEFAULT_GRPC_CALLBACK_METADATA = Object.assign({ [`${rpc_paramtype_enum_1.RpcParamtype.CONTEXT}:1`]: { index: 1, data: undefined, pipes: [] }, [`${rpc_paramtype_enum_1.RpcParamtype.GRPC_CALL}:2`]: { index: 2, data: undefined, pipes: [] } }, exports.DEFAULT_CALLBACK_METADATA);


/***/ }),
/* 179 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcProxy = void 0;
const execution_context_host_1 = __webpack_require__(180);
const rxjs_1 = __webpack_require__(59);
const operators_1 = __webpack_require__(68);
class RpcProxy {
    create(targetCallback, exceptionsHandler) {
        return async (...args) => {
            try {
                const result = await targetCallback(...args);
                return !(0, rxjs_1.isObservable)(result)
                    ? result
                    : result.pipe((0, operators_1.catchError)(error => this.handleError(exceptionsHandler, args, error)));
            }
            catch (error) {
                return this.handleError(exceptionsHandler, args, error);
            }
        };
    }
    handleError(exceptionsHandler, args, error) {
        const host = new execution_context_host_1.ExecutionContextHost(args);
        host.setType('rpc');
        return exceptionsHandler.handle(error, host);
    }
}
exports.RpcProxy = RpcProxy;


/***/ }),
/* 180 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/helpers/execution-context-host");

/***/ }),
/* 181 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListenersController = void 0;
const shared_utils_1 = __webpack_require__(26);
const context_id_factory_1 = __webpack_require__(182);
const execution_context_host_1 = __webpack_require__(180);
const constants_1 = __webpack_require__(169);
const metadata_scanner_1 = __webpack_require__(183);
const request_constants_1 = __webpack_require__(184);
const rxjs_1 = __webpack_require__(59);
const request_context_host_1 = __webpack_require__(185);
const rpc_metadata_constants_1 = __webpack_require__(178);
const listener_metadata_explorer_1 = __webpack_require__(186);
const server_1 = __webpack_require__(187);
class ListenersController {
    constructor(clientsContainer, contextCreator, container, injector, clientFactory, exceptionFiltersContext) {
        this.clientsContainer = clientsContainer;
        this.contextCreator = contextCreator;
        this.container = container;
        this.injector = injector;
        this.clientFactory = clientFactory;
        this.exceptionFiltersContext = exceptionFiltersContext;
        this.metadataExplorer = new listener_metadata_explorer_1.ListenerMetadataExplorer(new metadata_scanner_1.MetadataScanner());
        this.exceptionFiltersCache = new WeakMap();
    }
    registerPatternHandlers(instanceWrapper, server, moduleKey) {
        const { instance } = instanceWrapper;
        const isStatic = instanceWrapper.isDependencyTreeStatic();
        const patternHandlers = this.metadataExplorer.explore(instance);
        const moduleRef = this.container.getModuleByKey(moduleKey);
        const defaultCallMetadata = server instanceof server_1.ServerGrpc
            ? rpc_metadata_constants_1.DEFAULT_GRPC_CALLBACK_METADATA
            : rpc_metadata_constants_1.DEFAULT_CALLBACK_METADATA;
        patternHandlers
            .filter(({ transport }) => (0, shared_utils_1.isUndefined)(transport) ||
            (0, shared_utils_1.isUndefined)(server.transportId) ||
            transport === server.transportId)
            .reduce((acc, handler) => {
            var _a;
            // Optional chaining for backward-compatibility
            (_a = handler.patterns) === null || _a === void 0 ? void 0 : _a.forEach(pattern => acc.push(Object.assign(Object.assign({}, handler), { patterns: [pattern] })));
            return acc;
        }, [])
            .forEach(({ patterns: [pattern], targetCallback, methodKey, extras, isEventHandler, }) => {
            if (isStatic) {
                const proxy = this.contextCreator.create(instance, targetCallback, moduleKey, methodKey, constants_1.STATIC_CONTEXT, undefined, defaultCallMetadata);
                if (isEventHandler) {
                    const eventHandler = (...args) => {
                        var _a;
                        const originalArgs = args;
                        const [dataOrContextHost] = originalArgs;
                        if (dataOrContextHost instanceof request_context_host_1.RequestContextHost) {
                            args = args.slice(1, args.length);
                        }
                        const originalReturnValue = proxy(...args);
                        const returnedValueWrapper = (_a = eventHandler.next) === null || _a === void 0 ? void 0 : _a.call(eventHandler, ...originalArgs);
                        returnedValueWrapper === null || returnedValueWrapper === void 0 ? void 0 : returnedValueWrapper.then(returnedValue => this.connectIfStream(returnedValue));
                        return originalReturnValue;
                    };
                    return server.addHandler(pattern, eventHandler, isEventHandler, extras);
                }
                else {
                    return server.addHandler(pattern, proxy, isEventHandler, extras);
                }
            }
            const asyncHandler = this.createRequestScopedHandler(instanceWrapper, pattern, moduleRef, moduleKey, methodKey, defaultCallMetadata);
            server.addHandler(pattern, asyncHandler, isEventHandler, extras);
        });
    }
    assignClientsToProperties(instance) {
        for (const { property, metadata, } of this.metadataExplorer.scanForClientHooks(instance)) {
            const client = this.clientFactory.create(metadata);
            this.clientsContainer.addClient(client);
            this.assignClientToInstance(instance, property, client);
        }
    }
    assignClientToInstance(instance, property, client) {
        Reflect.set(instance, property, client);
    }
    createRequestScopedHandler(wrapper, pattern, moduleRef, moduleKey, methodKey, defaultCallMetadata = rpc_metadata_constants_1.DEFAULT_CALLBACK_METADATA) {
        const collection = moduleRef.controllers;
        const { instance } = wrapper;
        const requestScopedHandler = async (...args) => {
            var _a;
            try {
                let contextId;
                let [dataOrContextHost] = args;
                if (dataOrContextHost instanceof request_context_host_1.RequestContextHost) {
                    contextId = this.getContextId(dataOrContextHost);
                    args.shift();
                }
                else {
                    const [data, reqCtx] = args;
                    const request = request_context_host_1.RequestContextHost.create(pattern, data, reqCtx);
                    contextId = this.getContextId(request);
                    this.container.registerRequestProvider(contextId.getParent ? contextId.payload : request, contextId);
                    dataOrContextHost = request;
                }
                const contextInstance = await this.injector.loadPerContext(instance, moduleRef, collection, contextId);
                const proxy = this.contextCreator.create(contextInstance, contextInstance[methodKey], moduleKey, methodKey, contextId, wrapper.id, defaultCallMetadata);
                const returnedValueWrapper = (_a = requestScopedHandler.next) === null || _a === void 0 ? void 0 : _a.call(requestScopedHandler, dataOrContextHost, ...args);
                returnedValueWrapper === null || returnedValueWrapper === void 0 ? void 0 : returnedValueWrapper.then(returnedValue => this.connectIfStream(returnedValue));
                return proxy(...args);
            }
            catch (err) {
                let exceptionFilter = this.exceptionFiltersCache.get(instance[methodKey]);
                if (!exceptionFilter) {
                    exceptionFilter = this.exceptionFiltersContext.create(instance, instance[methodKey], moduleKey);
                    this.exceptionFiltersCache.set(instance[methodKey], exceptionFilter);
                }
                const host = new execution_context_host_1.ExecutionContextHost(args);
                host.setType('rpc');
                return exceptionFilter.handle(err, host);
            }
        };
        return requestScopedHandler;
    }
    getContextId(request) {
        const contextId = context_id_factory_1.ContextIdFactory.getByRequest(request);
        if (!request[request_constants_1.REQUEST_CONTEXT_ID]) {
            Object.defineProperty(request, request_constants_1.REQUEST_CONTEXT_ID, {
                value: contextId,
                enumerable: false,
                writable: false,
                configurable: false,
            });
            this.container.registerRequestProvider(contextId.getParent ? contextId.payload : request, contextId);
        }
        return contextId;
    }
    connectIfStream(source) {
        if (!source) {
            return;
        }
        const connectableSource = (0, rxjs_1.connectable)(source, {
            connector: () => new rxjs_1.Subject(),
            resetOnDisconnect: false,
        });
        connectableSource.connect();
    }
}
exports.ListenersController = ListenersController;


/***/ }),
/* 182 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/helpers/context-id-factory");

/***/ }),
/* 183 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/metadata-scanner");

/***/ }),
/* 184 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/router/request/request-constants");

/***/ }),
/* 185 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestContextHost = void 0;
class RequestContextHost {
    constructor(pattern, data, context) {
        this.pattern = pattern;
        this.data = data;
        this.context = context;
    }
    static create(pattern, data, context) {
        const host = new RequestContextHost(pattern, data, context);
        return host;
    }
    getData() {
        return this.data;
    }
    getPattern() {
        return this.pattern;
    }
    getContext() {
        return this.context;
    }
}
exports.RequestContextHost = RequestContextHost;


/***/ }),
/* 186 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListenerMetadataExplorer = void 0;
const shared_utils_1 = __webpack_require__(26);
const constants_1 = __webpack_require__(60);
const pattern_handler_enum_1 = __webpack_require__(129);
class ListenerMetadataExplorer {
    constructor(metadataScanner) {
        this.metadataScanner = metadataScanner;
    }
    explore(instance) {
        const instancePrototype = Object.getPrototypeOf(instance);
        return this.metadataScanner.scanFromPrototype(instance, instancePrototype, method => this.exploreMethodMetadata(instancePrototype, method));
    }
    exploreMethodMetadata(instancePrototype, methodKey) {
        const targetCallback = instancePrototype[methodKey];
        const handlerType = Reflect.getMetadata(constants_1.PATTERN_HANDLER_METADATA, targetCallback);
        if ((0, shared_utils_1.isUndefined)(handlerType)) {
            return;
        }
        const patterns = Reflect.getMetadata(constants_1.PATTERN_METADATA, targetCallback);
        const transport = Reflect.getMetadata(constants_1.TRANSPORT_METADATA, targetCallback);
        const extras = Reflect.getMetadata(constants_1.PATTERN_EXTRAS_METADATA, targetCallback);
        return {
            methodKey,
            targetCallback,
            patterns,
            transport,
            extras,
            isEventHandler: handlerType === pattern_handler_enum_1.PatternHandler.EVENT,
        };
    }
    *scanForClientHooks(instance) {
        for (const propertyKey in instance) {
            if ((0, shared_utils_1.isFunction)(propertyKey)) {
                continue;
            }
            const property = String(propertyKey);
            const isClient = Reflect.getMetadata(constants_1.CLIENT_METADATA, instance, property);
            if ((0, shared_utils_1.isUndefined)(isClient)) {
                continue;
            }
            const metadata = Reflect.getMetadata(constants_1.CLIENT_CONFIGURATION_METADATA, instance, property);
            yield { property, metadata };
        }
    }
}
exports.ListenerMetadataExplorer = ListenerMetadataExplorer;


/***/ }),
/* 187 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53);
tslib_1.__exportStar(__webpack_require__(188), exports);
tslib_1.__exportStar(__webpack_require__(189), exports);
tslib_1.__exportStar(__webpack_require__(191), exports);
tslib_1.__exportStar(__webpack_require__(193), exports);
tslib_1.__exportStar(__webpack_require__(194), exports);
tslib_1.__exportStar(__webpack_require__(195), exports);
tslib_1.__exportStar(__webpack_require__(196), exports);
tslib_1.__exportStar(__webpack_require__(197), exports);


/***/ }),
/* 188 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Server = void 0;
const logger_service_1 = __webpack_require__(57);
const load_package_util_1 = __webpack_require__(58);
const rxjs_1 = __webpack_require__(59);
const operators_1 = __webpack_require__(68);
const constants_1 = __webpack_require__(60);
const incoming_request_deserializer_1 = __webpack_require__(104);
const identity_serializer_1 = __webpack_require__(71);
const utils_1 = __webpack_require__(72);
class Server {
    constructor() {
        this.messageHandlers = new Map();
        this.logger = new logger_service_1.Logger(Server.name);
    }
    addHandler(pattern, callback, isEventHandler = false, extras = {}) {
        const normalizedPattern = this.normalizePattern(pattern);
        callback.isEventHandler = isEventHandler;
        callback.extras = extras;
        if (this.messageHandlers.has(normalizedPattern) && isEventHandler) {
            const headRef = this.messageHandlers.get(normalizedPattern);
            const getTail = (handler) => (handler === null || handler === void 0 ? void 0 : handler.next) ? getTail(handler.next) : handler;
            const tailRef = getTail(headRef);
            tailRef.next = callback;
        }
        else {
            this.messageHandlers.set(normalizedPattern, callback);
        }
    }
    getHandlers() {
        return this.messageHandlers;
    }
    getHandlerByPattern(pattern) {
        const route = this.getRouteFromPattern(pattern);
        return this.messageHandlers.has(route)
            ? this.messageHandlers.get(route)
            : null;
    }
    send(stream$, respond) {
        let dataBuffer = null;
        const scheduleOnNextTick = (data) => {
            if (!dataBuffer) {
                dataBuffer = [data];
                process.nextTick(async () => {
                    for (const item of dataBuffer) {
                        await respond(item);
                    }
                    dataBuffer = null;
                });
            }
            else if (!data.isDisposed) {
                dataBuffer = dataBuffer.concat(data);
            }
            else {
                dataBuffer[dataBuffer.length - 1].isDisposed = data.isDisposed;
            }
        };
        return stream$
            .pipe((0, operators_1.catchError)((err) => {
            scheduleOnNextTick({ err });
            return rxjs_1.EMPTY;
        }), (0, operators_1.finalize)(() => scheduleOnNextTick({ isDisposed: true })))
            .subscribe((response) => scheduleOnNextTick({ response }));
    }
    async handleEvent(pattern, packet, context) {
        const handler = this.getHandlerByPattern(pattern);
        if (!handler) {
            return this.logger.error((0, constants_1.NO_EVENT_HANDLER) `${pattern}`);
        }
        const resultOrStream = await handler(packet.data, context);
        if ((0, rxjs_1.isObservable)(resultOrStream)) {
            const connectableSource = (0, rxjs_1.connectable)(resultOrStream, {
                connector: () => new rxjs_1.Subject(),
                resetOnDisconnect: false,
            });
            connectableSource.connect();
        }
    }
    transformToObservable(resultOrDeferred) {
        if (resultOrDeferred instanceof Promise) {
            return (0, rxjs_1.from)(resultOrDeferred);
        }
        if ((0, rxjs_1.isObservable)(resultOrDeferred)) {
            return resultOrDeferred;
        }
        return (0, rxjs_1.of)(resultOrDeferred);
    }
    getOptionsProp(obj, prop, defaultValue = undefined) {
        return obj && prop in obj ? obj[prop] : defaultValue;
    }
    handleError(error) {
        this.logger.error(error);
    }
    loadPackage(name, ctx, loader) {
        return (0, load_package_util_1.loadPackage)(name, ctx, loader);
    }
    initializeSerializer(options) {
        this.serializer =
            (options &&
                options.serializer) ||
                new identity_serializer_1.IdentitySerializer();
    }
    initializeDeserializer(options) {
        this.deserializer =
            (options &&
                options.deserializer) ||
                new incoming_request_deserializer_1.IncomingRequestDeserializer();
    }
    /**
     * Transforms the server Pattern to valid type and returns a route for him.
     *
     * @param  {string} pattern - server pattern
     * @returns string
     */
    getRouteFromPattern(pattern) {
        let validPattern;
        try {
            validPattern = JSON.parse(pattern);
        }
        catch (error) {
            // Uses a fundamental object (`pattern` variable without any conversion)
            validPattern = pattern;
        }
        return this.normalizePattern(validPattern);
    }
    normalizePattern(pattern) {
        return (0, utils_1.transformPatternToRoute)(pattern);
    }
}
exports.Server = Server;


/***/ }),
/* 189 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerGrpc = void 0;
const shared_utils_1 = __webpack_require__(26);
const rxjs_1 = __webpack_require__(59);
const operators_1 = __webpack_require__(68);
const constants_1 = __webpack_require__(60);
const decorators_1 = __webpack_require__(122);
const enums_1 = __webpack_require__(79);
const invalid_grpc_package_exception_1 = __webpack_require__(62);
const invalid_proto_definition_exception_1 = __webpack_require__(65);
const server_1 = __webpack_require__(188);
let grpcPackage = {};
let grpcProtoLoaderPackage = {};
class ServerGrpc extends server_1.Server {
    constructor(options) {
        super();
        this.options = options;
        this.transportId = enums_1.Transport.GRPC;
        this.url = this.getOptionsProp(options, 'url') || constants_1.GRPC_DEFAULT_URL;
        const protoLoader = this.getOptionsProp(options, 'protoLoader') || constants_1.GRPC_DEFAULT_PROTO_LOADER;
        grpcPackage = this.loadPackage('@grpc/grpc-js', ServerGrpc.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@grpc/grpc-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        grpcProtoLoaderPackage = this.loadPackage(protoLoader, ServerGrpc.name, () => protoLoader === constants_1.GRPC_DEFAULT_PROTO_LOADER
            ? __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@grpc/proto-loader'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
            : __webpack_require__(190)(protoLoader));
    }
    async listen(callback) {
        try {
            this.grpcClient = await this.createClient();
            await this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    }
    async start(callback) {
        await this.bindEvents();
        this.grpcClient.start();
        callback();
    }
    async bindEvents() {
        const grpcContext = this.loadProto();
        const packageOption = this.getOptionsProp(this.options, 'package');
        const packageNames = Array.isArray(packageOption)
            ? packageOption
            : [packageOption];
        for (const packageName of packageNames) {
            const grpcPkg = this.lookupPackage(grpcContext, packageName);
            await this.createServices(grpcPkg, packageName);
        }
    }
    /**
     * Will return all of the services along with their fully namespaced
     * names as an array of objects.
     * This method initiates recursive scan of grpcPkg object
     */
    getServiceNames(grpcPkg) {
        // Define accumulator to collect all of the services available to load
        const services = [];
        // Initiate recursive services collector starting with empty name
        this.collectDeepServices('', grpcPkg, services);
        return services;
    }
    /**
     * Will create service mapping from gRPC generated Object to handlers
     * defined with @GrpcMethod or @GrpcStreamMethod annotations
     *
     * @param grpcService
     * @param name
     */
    async createService(grpcService, name) {
        const service = {};
        for (const methodName in grpcService.prototype) {
            let pattern = '';
            let methodHandler = null;
            let streamingType = decorators_1.GrpcMethodStreamingType.NO_STREAMING;
            const methodFunction = grpcService.prototype[methodName];
            const methodReqStreaming = methodFunction.requestStream;
            if (!(0, shared_utils_1.isUndefined)(methodReqStreaming) && methodReqStreaming) {
                // Try first pattern to be presented, RX streaming pattern would be
                // a preferable pattern to select among a few defined
                pattern = this.createPattern(name, methodName, decorators_1.GrpcMethodStreamingType.RX_STREAMING);
                methodHandler = this.messageHandlers.get(pattern);
                streamingType = decorators_1.GrpcMethodStreamingType.RX_STREAMING;
                // If first pattern didn't match to any of handlers then try
                // pass-through handler to be presented
                if (!methodHandler) {
                    pattern = this.createPattern(name, methodName, decorators_1.GrpcMethodStreamingType.PT_STREAMING);
                    methodHandler = this.messageHandlers.get(pattern);
                    streamingType = decorators_1.GrpcMethodStreamingType.PT_STREAMING;
                }
            }
            else {
                pattern = this.createPattern(name, methodName, decorators_1.GrpcMethodStreamingType.NO_STREAMING);
                // Select handler if any presented for No-Streaming pattern
                methodHandler = this.messageHandlers.get(pattern);
                streamingType = decorators_1.GrpcMethodStreamingType.NO_STREAMING;
            }
            if (!methodHandler) {
                continue;
            }
            service[methodName] = await this.createServiceMethod(methodHandler, grpcService.prototype[methodName], streamingType);
        }
        return service;
    }
    /**
     * Will create a string of a JSON serialized format
     *
     * @param service name of the service which should be a match to gRPC service definition name
     * @param methodName name of the method which is coming after rpc keyword
     * @param streaming GrpcMethodStreamingType parameter which should correspond to
     * stream keyword in gRPC service request part
     */
    createPattern(service, methodName, streaming) {
        return JSON.stringify({
            service,
            rpc: methodName,
            streaming,
        });
    }
    /**
     * Will return async function which will handle gRPC call
     * with Rx streams or as a direct call passthrough
     *
     * @param methodHandler
     * @param protoNativeHandler
     */
    createServiceMethod(methodHandler, protoNativeHandler, streamType) {
        // If proto handler has request stream as "true" then we expect it to have
        // streaming from the side of requester
        if (protoNativeHandler.requestStream) {
            // If any handlers were defined with GrpcStreamMethod annotation use RX
            if (streamType === decorators_1.GrpcMethodStreamingType.RX_STREAMING) {
                return this.createRequestStreamMethod(methodHandler, protoNativeHandler.responseStream);
            }
            // If any handlers were defined with GrpcStreamCall annotation
            else if (streamType === decorators_1.GrpcMethodStreamingType.PT_STREAMING) {
                return this.createStreamCallMethod(methodHandler, protoNativeHandler.responseStream);
            }
        }
        return protoNativeHandler.responseStream
            ? this.createStreamServiceMethod(methodHandler)
            : this.createUnaryServiceMethod(methodHandler);
    }
    createUnaryServiceMethod(methodHandler) {
        return async (call, callback) => {
            const handler = methodHandler(call.request, call.metadata, call);
            this.transformToObservable(await handler).subscribe({
                next: data => callback(null, data),
                error: (err) => callback(err),
            });
        };
    }
    createStreamServiceMethod(methodHandler) {
        return async (call, callback) => {
            const handler = methodHandler(call.request, call.metadata, call);
            const result$ = this.transformToObservable(await handler);
            await result$
                .pipe((0, operators_1.takeUntil)((0, rxjs_1.fromEvent)(call, constants_1.CANCEL_EVENT)), (0, operators_1.catchError)(err => {
                call.emit('error', err);
                return rxjs_1.EMPTY;
            }))
                .forEach(data => call.write(data));
            call.end();
        };
    }
    createRequestStreamMethod(methodHandler, isResponseStream) {
        return async (call, callback) => {
            const req = new rxjs_1.Subject();
            call.on('data', (m) => req.next(m));
            call.on('error', (e) => {
                // Check if error means that stream ended on other end
                const isCancelledError = String(e).toLowerCase().indexOf('cancelled');
                if (isCancelledError) {
                    call.end();
                    return;
                }
                // If another error then just pass it along
                req.error(e);
            });
            call.on('end', () => req.complete());
            const handler = methodHandler(req.asObservable(), call.metadata, call);
            const res = this.transformToObservable(await handler);
            if (isResponseStream) {
                await res
                    .pipe((0, operators_1.takeUntil)((0, rxjs_1.fromEvent)(call, constants_1.CANCEL_EVENT)), (0, operators_1.catchError)(err => {
                    call.emit('error', err);
                    return rxjs_1.EMPTY;
                }))
                    .forEach(m => call.write(m));
                call.end();
            }
            else {
                const response = await (0, rxjs_1.lastValueFrom)(res.pipe((0, operators_1.takeUntil)((0, rxjs_1.fromEvent)(call, constants_1.CANCEL_EVENT)), (0, operators_1.catchError)(err => {
                    callback(err, null);
                    return rxjs_1.EMPTY;
                })));
                if (!(0, shared_utils_1.isUndefined)(response)) {
                    callback(null, response);
                }
            }
        };
    }
    createStreamCallMethod(methodHandler, isResponseStream) {
        return async (call, callback) => {
            if (isResponseStream) {
                methodHandler(call);
            }
            else {
                methodHandler(call, callback);
            }
        };
    }
    close() {
        this.grpcClient && this.grpcClient.forceShutdown();
        this.grpcClient = null;
    }
    deserialize(obj) {
        try {
            return JSON.parse(obj);
        }
        catch (e) {
            return obj;
        }
    }
    addHandler(pattern, callback, isEventHandler = false) {
        const route = (0, shared_utils_1.isString)(pattern) ? pattern : JSON.stringify(pattern);
        callback.isEventHandler = isEventHandler;
        this.messageHandlers.set(route, callback);
    }
    async createClient() {
        const channelOptions = this.options && this.options.channelOptions
            ? this.options.channelOptions
            : {};
        if (this.options && this.options.maxSendMessageLength) {
            channelOptions['grpc.max_send_message_length'] =
                this.options.maxSendMessageLength;
        }
        if (this.options && this.options.maxReceiveMessageLength) {
            channelOptions['grpc.max_receive_message_length'] =
                this.options.maxReceiveMessageLength;
        }
        if (this.options && this.options.maxMetadataSize) {
            channelOptions['grpc.max_metadata_size'] = this.options.maxMetadataSize;
        }
        const server = new grpcPackage.Server(channelOptions);
        const credentials = this.getOptionsProp(this.options, 'credentials');
        await new Promise((resolve, reject) => {
            server.bindAsync(this.url, credentials || grpcPackage.ServerCredentials.createInsecure(), (error, port) => error ? reject(error) : resolve(port));
        });
        return server;
    }
    lookupPackage(root, packageName) {
        /** Reference: https://github.com/kondi/rxjs-grpc */
        let pkg = root;
        for (const name of packageName.split(/\./)) {
            pkg = pkg[name];
        }
        return pkg;
    }
    loadProto() {
        try {
            const file = this.getOptionsProp(this.options, 'protoPath');
            const loader = this.getOptionsProp(this.options, 'loader');
            const packageDefinition = grpcProtoLoaderPackage.loadSync(file, loader);
            const packageObject = grpcPackage.loadPackageDefinition(packageDefinition);
            return packageObject;
        }
        catch (err) {
            const invalidProtoError = new invalid_proto_definition_exception_1.InvalidProtoDefinitionException(err.path);
            const message = err && err.message ? err.message : invalidProtoError.message;
            this.logger.error(message, invalidProtoError.stack);
            throw err;
        }
    }
    /**
     * Recursively fetch all of the service methods available on loaded
     * protobuf descriptor object, and collect those as an objects with
     * dot-syntax full-path names.
     *
     * Example:
     *  for proto package Bundle.FirstService with service Events { rpc...
     *  will be resolved to object of (while loaded for Bundle package):
     *    {
     *      name: "FirstService.Events",
     *      service: {Object}
     *    }
     */
    collectDeepServices(name, grpcDefinition, accumulator) {
        if (!(0, shared_utils_1.isObject)(grpcDefinition)) {
            return;
        }
        const keysToTraverse = Object.keys(grpcDefinition);
        // Traverse definitions or namespace extensions
        for (const key of keysToTraverse) {
            const nameExtended = this.parseDeepServiceName(name, key);
            const deepDefinition = grpcDefinition[key];
            const isServiceDefined = deepDefinition && !(0, shared_utils_1.isUndefined)(deepDefinition.service);
            const isServiceBoolean = isServiceDefined
                ? deepDefinition.service !== false
                : false;
            if (isServiceDefined && isServiceBoolean) {
                accumulator.push({
                    name: nameExtended,
                    service: deepDefinition,
                });
            }
            // Continue recursion until objects end or service definition found
            else {
                this.collectDeepServices(nameExtended, deepDefinition, accumulator);
            }
        }
    }
    parseDeepServiceName(name, key) {
        // If depth is zero then just return key
        if (name.length === 0) {
            return key;
        }
        // Otherwise add next through dot syntax
        return name + '.' + key;
    }
    async createServices(grpcPkg, packageName) {
        if (!grpcPkg) {
            const invalidPackageError = new invalid_grpc_package_exception_1.InvalidGrpcPackageException(packageName);
            this.logger.error(invalidPackageError.message, invalidPackageError.stack);
            throw invalidPackageError;
        }
        // Take all of the services defined in grpcPkg and assign them to
        // method handlers defined in Controllers
        for (const definition of this.getServiceNames(grpcPkg)) {
            this.grpcClient.addService(
            // First parameter requires exact service definition from proto
            definition.service.service, 
            // Here full proto definition required along with namespaced pattern name
            await this.createService(definition.service, definition.name));
        }
    }
}
exports.ServerGrpc = ServerGrpc;


/***/ }),
/* 190 */
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 190;
module.exports = webpackEmptyContext;

/***/ }),
/* 191 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerKafka = void 0;
const logger_service_1 = __webpack_require__(57);
const shared_utils_1 = __webpack_require__(26);
const rxjs_1 = __webpack_require__(59);
const constants_1 = __webpack_require__(60);
const ctx_host_1 = __webpack_require__(114);
const kafka_request_deserializer_1 = __webpack_require__(192);
const enums_1 = __webpack_require__(79);
const exceptions_1 = __webpack_require__(133);
const helpers_1 = __webpack_require__(82);
const kafka_request_serializer_1 = __webpack_require__(94);
const server_1 = __webpack_require__(188);
let kafkaPackage = {};
class ServerKafka extends server_1.Server {
    constructor(options) {
        var _a;
        super();
        this.options = options;
        this.transportId = enums_1.Transport.KAFKA;
        this.logger = new logger_service_1.Logger(ServerKafka.name);
        this.client = null;
        this.consumer = null;
        this.producer = null;
        this.parser = null;
        const clientOptions = this.getOptionsProp(this.options, 'client') || {};
        const consumerOptions = this.getOptionsProp(this.options, 'consumer') || {};
        const postfixId = (_a = this.getOptionsProp(this.options, 'postfixId')) !== null && _a !== void 0 ? _a : '-server';
        this.brokers = clientOptions.brokers || [constants_1.KAFKA_DEFAULT_BROKER];
        // append a unique id to the clientId and groupId
        // so they don't collide with a microservices client
        this.clientId =
            (clientOptions.clientId || constants_1.KAFKA_DEFAULT_CLIENT) + postfixId;
        this.groupId = (consumerOptions.groupId || constants_1.KAFKA_DEFAULT_GROUP) + postfixId;
        kafkaPackage = this.loadPackage('kafkajs', ServerKafka.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'kafkajs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.parser = new helpers_1.KafkaParser((options && options.parser) || undefined);
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    async listen(callback) {
        try {
            this.client = this.createClient();
            await this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    }
    async close() {
        this.consumer && (await this.consumer.disconnect());
        this.producer && (await this.producer.disconnect());
        this.consumer = null;
        this.producer = null;
        this.client = null;
    }
    async start(callback) {
        const consumerOptions = Object.assign(this.options.consumer || {}, {
            groupId: this.groupId,
        });
        this.consumer = this.client.consumer(consumerOptions);
        this.producer = this.client.producer(this.options.producer);
        await this.consumer.connect();
        await this.producer.connect();
        await this.bindEvents(this.consumer);
        callback();
    }
    createClient() {
        return new kafkaPackage.Kafka(Object.assign({ logCreator: helpers_1.KafkaLogger.bind(null, this.logger) }, this.options.client, { clientId: this.clientId, brokers: this.brokers }));
    }
    async bindEvents(consumer) {
        const registeredPatterns = [...this.messageHandlers.keys()];
        const consumerSubscribeOptions = this.options.subscribe || {};
        const subscribeToPattern = async (pattern) => consumer.subscribe(Object.assign({ topic: pattern }, consumerSubscribeOptions));
        await Promise.all(registeredPatterns.map(subscribeToPattern));
        const consumerRunOptions = Object.assign(this.options.run || {}, {
            eachMessage: this.getMessageHandler(),
        });
        await consumer.run(consumerRunOptions);
    }
    getMessageHandler() {
        return async (payload) => this.handleMessage(payload);
    }
    getPublisher(replyTopic, replyPartition, correlationId) {
        return (data) => this.sendMessage(data, replyTopic, replyPartition, correlationId);
    }
    async handleMessage(payload) {
        const channel = payload.topic;
        const rawMessage = this.parser.parse(Object.assign(payload.message, {
            topic: payload.topic,
            partition: payload.partition,
        }));
        const headers = rawMessage.headers;
        const correlationId = headers[enums_1.KafkaHeaders.CORRELATION_ID];
        const replyTopic = headers[enums_1.KafkaHeaders.REPLY_TOPIC];
        const replyPartition = headers[enums_1.KafkaHeaders.REPLY_PARTITION];
        const packet = await this.deserializer.deserialize(rawMessage, { channel });
        const kafkaContext = new ctx_host_1.KafkaContext([
            rawMessage,
            payload.partition,
            payload.topic,
            this.consumer,
            payload.heartbeat,
            this.producer,
        ]);
        const handler = this.getHandlerByPattern(packet.pattern);
        // if the correlation id or reply topic is not set
        // then this is an event (events could still have correlation id)
        if ((handler === null || handler === void 0 ? void 0 : handler.isEventHandler) || !correlationId || !replyTopic) {
            return this.handleEvent(packet.pattern, packet, kafkaContext);
        }
        const publish = this.getPublisher(replyTopic, replyPartition, correlationId);
        if (!handler) {
            return publish({
                id: correlationId,
                err: constants_1.NO_MESSAGE_HANDLER,
            });
        }
        const response$ = this.transformToObservable(await handler(packet.data, kafkaContext));
        const replayStream$ = new rxjs_1.ReplaySubject();
        await this.combineStreamsAndThrowIfRetriable(response$, replayStream$);
        this.send(replayStream$, publish);
    }
    combineStreamsAndThrowIfRetriable(response$, replayStream$) {
        return new Promise((resolve, reject) => {
            let isPromiseResolved = false;
            response$.subscribe({
                next: val => {
                    replayStream$.next(val);
                    if (!isPromiseResolved) {
                        isPromiseResolved = true;
                        resolve();
                    }
                },
                error: err => {
                    if (err instanceof exceptions_1.KafkaRetriableException && !isPromiseResolved) {
                        isPromiseResolved = true;
                        reject(err);
                    }
                    replayStream$.error(err);
                },
                complete: () => replayStream$.complete(),
            });
        });
    }
    async sendMessage(message, replyTopic, replyPartition, correlationId) {
        const outgoingMessage = await this.serializer.serialize(message.response);
        this.assignReplyPartition(replyPartition, outgoingMessage);
        this.assignCorrelationIdHeader(correlationId, outgoingMessage);
        this.assignErrorHeader(message, outgoingMessage);
        this.assignIsDisposedHeader(message, outgoingMessage);
        const replyMessage = Object.assign({
            topic: replyTopic,
            messages: [outgoingMessage],
        }, this.options.send || {});
        return this.producer.send(replyMessage);
    }
    assignIsDisposedHeader(outgoingResponse, outgoingMessage) {
        if (!outgoingResponse.isDisposed) {
            return;
        }
        outgoingMessage.headers[enums_1.KafkaHeaders.NEST_IS_DISPOSED] = Buffer.alloc(1);
    }
    assignErrorHeader(outgoingResponse, outgoingMessage) {
        if (!outgoingResponse.err) {
            return;
        }
        const stringifiedError = typeof outgoingResponse.err === 'object'
            ? JSON.stringify(outgoingResponse.err)
            : outgoingResponse.err;
        outgoingMessage.headers[enums_1.KafkaHeaders.NEST_ERR] =
            Buffer.from(stringifiedError);
    }
    assignCorrelationIdHeader(correlationId, outgoingMessage) {
        outgoingMessage.headers[enums_1.KafkaHeaders.CORRELATION_ID] =
            Buffer.from(correlationId);
    }
    assignReplyPartition(replyPartition, outgoingMessage) {
        if ((0, shared_utils_1.isNil)(replyPartition)) {
            return;
        }
        outgoingMessage.partition = parseFloat(replyPartition);
    }
    async handleEvent(pattern, packet, context) {
        const handler = this.getHandlerByPattern(pattern);
        if (!handler) {
            return this.logger.error((0, constants_1.NO_EVENT_HANDLER) `${pattern}`);
        }
        const resultOrStream = await handler(packet.data, context);
        if ((0, rxjs_1.isObservable)(resultOrStream)) {
            await (0, rxjs_1.lastValueFrom)(resultOrStream);
        }
    }
    initializeSerializer(options) {
        this.serializer =
            (options && options.serializer) || new kafka_request_serializer_1.KafkaRequestSerializer();
    }
    initializeDeserializer(options) {
        var _a;
        this.deserializer = (_a = options === null || options === void 0 ? void 0 : options.deserializer) !== null && _a !== void 0 ? _a : new kafka_request_deserializer_1.KafkaRequestDeserializer();
    }
}
exports.ServerKafka = ServerKafka;


/***/ }),
/* 192 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaRequestDeserializer = void 0;
const incoming_request_deserializer_1 = __webpack_require__(104);
class KafkaRequestDeserializer extends incoming_request_deserializer_1.IncomingRequestDeserializer {
    mapToSchema(data, options) {
        var _a;
        if (!options) {
            return {
                pattern: undefined,
                data: undefined,
            };
        }
        return {
            pattern: options.channel,
            data: (_a = data === null || data === void 0 ? void 0 : data.value) !== null && _a !== void 0 ? _a : data,
        };
    }
}
exports.KafkaRequestDeserializer = KafkaRequestDeserializer;


/***/ }),
/* 193 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerMqtt = void 0;
const shared_utils_1 = __webpack_require__(26);
const constants_1 = __webpack_require__(60);
const mqtt_context_1 = __webpack_require__(117);
const enums_1 = __webpack_require__(79);
const mqtt_record_serializer_1 = __webpack_require__(96);
const server_1 = __webpack_require__(188);
let mqttPackage = {};
class ServerMqtt extends server_1.Server {
    constructor(options) {
        super();
        this.options = options;
        this.transportId = enums_1.Transport.MQTT;
        this.url = this.getOptionsProp(options, 'url') || constants_1.MQTT_DEFAULT_URL;
        mqttPackage = this.loadPackage('mqtt', ServerMqtt.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'mqtt'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    async listen(callback) {
        try {
            this.mqttClient = this.createMqttClient();
            this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    }
    start(callback) {
        this.handleError(this.mqttClient);
        this.bindEvents(this.mqttClient);
        this.mqttClient.on(constants_1.CONNECT_EVENT, () => callback());
    }
    bindEvents(mqttClient) {
        mqttClient.on(constants_1.MESSAGE_EVENT, this.getMessageHandler(mqttClient).bind(this));
        const registeredPatterns = [...this.messageHandlers.keys()];
        registeredPatterns.forEach(pattern => {
            const { isEventHandler } = this.messageHandlers.get(pattern);
            mqttClient.subscribe(isEventHandler ? pattern : this.getRequestPattern(pattern), this.getOptionsProp(this.options, 'subscribeOptions'));
        });
    }
    close() {
        this.mqttClient && this.mqttClient.end();
    }
    createMqttClient() {
        return mqttPackage.connect(this.url, this.options);
    }
    getMessageHandler(pub) {
        return async (channel, buffer, originalPacket) => this.handleMessage(channel, buffer, pub, originalPacket);
    }
    async handleMessage(channel, buffer, pub, originalPacket) {
        const rawPacket = this.parseMessage(buffer.toString());
        const packet = await this.deserializer.deserialize(rawPacket, { channel });
        const mqttContext = new mqtt_context_1.MqttContext([channel, originalPacket]);
        if ((0, shared_utils_1.isUndefined)(packet.id)) {
            return this.handleEvent(channel, packet, mqttContext);
        }
        const publish = this.getPublisher(pub, channel, packet.id);
        const handler = this.getHandlerByPattern(channel);
        if (!handler) {
            const status = 'error';
            const noHandlerPacket = {
                id: packet.id,
                status,
                err: constants_1.NO_MESSAGE_HANDLER,
            };
            return publish(noHandlerPacket);
        }
        const response$ = this.transformToObservable(await handler(packet.data, mqttContext));
        response$ && this.send(response$, publish);
    }
    getPublisher(client, pattern, id) {
        return (response) => {
            Object.assign(response, { id });
            const outgoingResponse = this.serializer.serialize(response);
            const options = outgoingResponse.options;
            delete outgoingResponse.options;
            return client.publish(this.getReplyPattern(pattern), JSON.stringify(outgoingResponse), options);
        };
    }
    parseMessage(content) {
        try {
            return JSON.parse(content);
        }
        catch (e) {
            return content;
        }
    }
    matchMqttPattern(pattern, topic) {
        const patternSegments = pattern.split(constants_1.MQTT_SEPARATOR);
        const topicSegments = topic.split(constants_1.MQTT_SEPARATOR);
        const patternSegmentsLength = patternSegments.length;
        const topicSegmentsLength = topicSegments.length;
        const lastIndex = patternSegmentsLength - 1;
        for (let i = 0; i < patternSegmentsLength; i++) {
            const currentPattern = patternSegments[i];
            const patternChar = currentPattern[0];
            const currentTopic = topicSegments[i];
            if (!currentTopic && !currentPattern) {
                continue;
            }
            if (!currentTopic && currentPattern !== constants_1.MQTT_WILDCARD_ALL) {
                return false;
            }
            if (patternChar === constants_1.MQTT_WILDCARD_ALL) {
                return i === lastIndex;
            }
            if (patternChar !== constants_1.MQTT_WILDCARD_SINGLE &&
                currentPattern !== currentTopic) {
                return false;
            }
        }
        return patternSegmentsLength === topicSegmentsLength;
    }
    getHandlerByPattern(pattern) {
        const route = this.getRouteFromPattern(pattern);
        if (this.messageHandlers.has(route)) {
            return this.messageHandlers.get(route) || null;
        }
        for (const [key, value] of this.messageHandlers) {
            if (!key.includes(constants_1.MQTT_WILDCARD_SINGLE) &&
                !key.includes(constants_1.MQTT_WILDCARD_ALL)) {
                continue;
            }
            const keyWithoutSharedPrefix = this.removeHandlerKeySharedPrefix(key);
            if (this.matchMqttPattern(keyWithoutSharedPrefix, route)) {
                return value;
            }
        }
        return null;
    }
    removeHandlerKeySharedPrefix(handlerKey) {
        return handlerKey && handlerKey.startsWith('$share')
            ? handlerKey.split('/').slice(2).join('/')
            : handlerKey;
    }
    getRequestPattern(pattern) {
        return pattern;
    }
    getReplyPattern(pattern) {
        return `${pattern}/reply`;
    }
    handleError(stream) {
        stream.on(constants_1.ERROR_EVENT, (err) => this.logger.error(err));
    }
    initializeSerializer(options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new mqtt_record_serializer_1.MqttRecordSerializer();
    }
}
exports.ServerMqtt = ServerMqtt;


/***/ }),
/* 194 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerNats = void 0;
const tslib_1 = __webpack_require__(53);
const shared_utils_1 = __webpack_require__(26);
const constants_1 = __webpack_require__(60);
const nats_context_1 = __webpack_require__(118);
const nats_request_json_deserializer_1 = __webpack_require__(103);
const enums_1 = __webpack_require__(79);
const nats_record_serializer_1 = __webpack_require__(106);
const server_1 = __webpack_require__(188);
let natsPackage = {};
class ServerNats extends server_1.Server {
    constructor(options) {
        super();
        this.options = options;
        this.transportId = enums_1.Transport.NATS;
        natsPackage = this.loadPackage('nats', ServerNats.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'nats'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    async listen(callback) {
        try {
            this.natsClient = await this.createNatsClient();
            this.handleStatusUpdates(this.natsClient);
            this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    }
    start(callback) {
        this.bindEvents(this.natsClient);
        callback();
    }
    bindEvents(client) {
        const queue = this.getOptionsProp(this.options, 'queue');
        const subscribe = (channel) => client.subscribe(channel, {
            queue,
            callback: this.getMessageHandler(channel).bind(this),
        });
        const registeredPatterns = [...this.messageHandlers.keys()];
        registeredPatterns.forEach(channel => subscribe(channel));
    }
    async close() {
        var _a;
        await ((_a = this.natsClient) === null || _a === void 0 ? void 0 : _a.close());
        this.natsClient = null;
    }
    createNatsClient() {
        const options = this.options || {};
        return natsPackage.connect(Object.assign({ servers: constants_1.NATS_DEFAULT_URL }, options));
    }
    getMessageHandler(channel) {
        return async (error, message) => {
            if (error) {
                return this.logger.error(error);
            }
            return this.handleMessage(channel, message);
        };
    }
    async handleMessage(channel, natsMsg) {
        const callerSubject = natsMsg.subject;
        const rawMessage = natsMsg.data;
        const replyTo = natsMsg.reply;
        const natsCtx = new nats_context_1.NatsContext([callerSubject, natsMsg.headers]);
        const message = await this.deserializer.deserialize(rawMessage, {
            channel,
            replyTo,
        });
        if ((0, shared_utils_1.isUndefined)(message.id)) {
            return this.handleEvent(channel, message, natsCtx);
        }
        const publish = this.getPublisher(natsMsg, message.id);
        const handler = this.getHandlerByPattern(channel);
        if (!handler) {
            const status = 'error';
            const noHandlerPacket = {
                id: message.id,
                status,
                err: constants_1.NO_MESSAGE_HANDLER,
            };
            return publish(noHandlerPacket);
        }
        const response$ = this.transformToObservable(await handler(message.data, natsCtx));
        response$ && this.send(response$, publish);
    }
    getPublisher(natsMsg, id) {
        if (natsMsg.reply) {
            return (response) => {
                Object.assign(response, { id });
                const outgoingResponse = this.serializer.serialize(response);
                return natsMsg.respond(outgoingResponse.data, {
                    headers: outgoingResponse.headers,
                });
            };
        }
        // In case the "reply" topic is not provided, there's no need for a reply.
        // Method returns a noop function instead
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => { };
    }
    async handleStatusUpdates(client) {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__asyncValues(client.status()), _c; _c = await _b.next(), !_c.done;) {
                const status = _c.value;
                const data = status.data && (0, shared_utils_1.isObject)(status.data)
                    ? JSON.stringify(status.data)
                    : status.data;
                if (status.type === 'disconnect' || status.type === 'error') {
                    this.logger.error(`NatsError: type: "${status.type}", data: "${data}".`);
                }
                else {
                    const message = `NatsStatus: type: "${status.type}", data: "${data}".`;
                    if (status.type === 'pingTimer') {
                        this.logger.debug(message);
                    }
                    else {
                        this.logger.log(message);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    initializeSerializer(options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new nats_record_serializer_1.NatsRecordSerializer();
    }
    initializeDeserializer(options) {
        var _a;
        this.deserializer =
            (_a = options === null || options === void 0 ? void 0 : options.deserializer) !== null && _a !== void 0 ? _a : new nats_request_json_deserializer_1.NatsRequestJSONDeserializer();
    }
}
exports.ServerNats = ServerNats;


/***/ }),
/* 195 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerRedis = void 0;
const shared_utils_1 = __webpack_require__(26);
const constants_1 = __webpack_require__(60);
const ctx_host_1 = __webpack_require__(114);
const enums_1 = __webpack_require__(79);
const server_1 = __webpack_require__(188);
let redisPackage = {};
class ServerRedis extends server_1.Server {
    constructor(options) {
        super();
        this.options = options;
        this.transportId = enums_1.Transport.REDIS;
        this.isExplicitlyTerminated = false;
        redisPackage = this.loadPackage('ioredis', ServerRedis.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'ioredis'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    listen(callback) {
        try {
            this.subClient = this.createRedisClient();
            this.pubClient = this.createRedisClient();
            this.handleError(this.pubClient);
            this.handleError(this.subClient);
            this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    }
    start(callback) {
        Promise.all([this.subClient.connect(), this.pubClient.connect()])
            .then(() => {
            this.bindEvents(this.subClient, this.pubClient);
            callback();
        })
            .catch(callback);
    }
    bindEvents(subClient, pubClient) {
        subClient.on(constants_1.MESSAGE_EVENT, this.getMessageHandler(pubClient).bind(this));
        const subscribePatterns = [...this.messageHandlers.keys()];
        subscribePatterns.forEach(pattern => {
            const { isEventHandler } = this.messageHandlers.get(pattern);
            subClient.subscribe(isEventHandler ? pattern : this.getRequestPattern(pattern));
        });
    }
    close() {
        this.isExplicitlyTerminated = true;
        this.pubClient && this.pubClient.quit();
        this.subClient && this.subClient.quit();
    }
    createRedisClient() {
        return new redisPackage(Object.assign(Object.assign({ port: constants_1.REDIS_DEFAULT_PORT, host: constants_1.REDIS_DEFAULT_HOST }, this.getClientOptions()), { lazyConnect: true }));
    }
    getMessageHandler(pub) {
        return async (channel, buffer) => this.handleMessage(channel, buffer, pub);
    }
    async handleMessage(channel, buffer, pub) {
        const rawMessage = this.parseMessage(buffer);
        const packet = await this.deserializer.deserialize(rawMessage, { channel });
        const redisCtx = new ctx_host_1.RedisContext([channel]);
        if ((0, shared_utils_1.isUndefined)(packet.id)) {
            return this.handleEvent(channel, packet, redisCtx);
        }
        const publish = this.getPublisher(pub, channel, packet.id);
        const handler = this.getHandlerByPattern(channel);
        if (!handler) {
            const status = 'error';
            const noHandlerPacket = {
                id: packet.id,
                status,
                err: constants_1.NO_MESSAGE_HANDLER,
            };
            return publish(noHandlerPacket);
        }
        const response$ = this.transformToObservable(await handler(packet.data, redisCtx));
        response$ && this.send(response$, publish);
    }
    getPublisher(pub, pattern, id) {
        return (response) => {
            Object.assign(response, { id });
            const outgoingResponse = this.serializer.serialize(response);
            return pub.publish(this.getReplyPattern(pattern), JSON.stringify(outgoingResponse));
        };
    }
    parseMessage(content) {
        try {
            return JSON.parse(content);
        }
        catch (e) {
            return content;
        }
    }
    getRequestPattern(pattern) {
        return pattern;
    }
    getReplyPattern(pattern) {
        return `${pattern}.reply`;
    }
    handleError(stream) {
        stream.on(constants_1.ERROR_EVENT, (err) => this.logger.error(err));
    }
    getClientOptions() {
        const retryStrategy = (times) => this.createRetryStrategy(times);
        return Object.assign(Object.assign({}, (this.options || {})), { retryStrategy });
    }
    createRetryStrategy(times) {
        if (this.isExplicitlyTerminated) {
            return undefined;
        }
        if (!this.getOptionsProp(this.options, 'retryAttempts') ||
            times > this.getOptionsProp(this.options, 'retryAttempts')) {
            this.logger.error(`Retry time exhausted`);
            return;
        }
        return this.getOptionsProp(this.options, 'retryDelay') || 0;
    }
}
exports.ServerRedis = ServerRedis;


/***/ }),
/* 196 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerRMQ = void 0;
const shared_utils_1 = __webpack_require__(26);
const constants_1 = __webpack_require__(60);
const ctx_host_1 = __webpack_require__(114);
const enums_1 = __webpack_require__(79);
const rmq_record_serializer_1 = __webpack_require__(111);
const server_1 = __webpack_require__(188);
let rqmPackage = {};
const INFINITE_CONNECTION_ATTEMPTS = -1;
class ServerRMQ extends server_1.Server {
    constructor(options) {
        super();
        this.options = options;
        this.transportId = enums_1.Transport.RMQ;
        this.server = null;
        this.channel = null;
        this.connectionAttempts = 0;
        this.urls = this.getOptionsProp(this.options, 'urls') || [constants_1.RQM_DEFAULT_URL];
        this.queue =
            this.getOptionsProp(this.options, 'queue') || constants_1.RQM_DEFAULT_QUEUE;
        this.prefetchCount =
            this.getOptionsProp(this.options, 'prefetchCount') ||
                constants_1.RQM_DEFAULT_PREFETCH_COUNT;
        this.isGlobalPrefetchCount =
            this.getOptionsProp(this.options, 'isGlobalPrefetchCount') ||
                constants_1.RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT;
        this.queueOptions =
            this.getOptionsProp(this.options, 'queueOptions') ||
                constants_1.RQM_DEFAULT_QUEUE_OPTIONS;
        this.noAssert =
            this.getOptionsProp(this.options, 'noAssert') || constants_1.RQM_DEFAULT_NO_ASSERT;
        this.loadPackage('amqplib', ServerRMQ.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'amqplib'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        rqmPackage = this.loadPackage('amqp-connection-manager', ServerRMQ.name, () => __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'amqp-connection-manager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    async listen(callback) {
        try {
            await this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    }
    close() {
        this.channel && this.channel.close();
        this.server && this.server.close();
    }
    async start(callback) {
        this.server = this.createClient();
        this.server.on(constants_1.CONNECT_EVENT, () => {
            if (this.channel) {
                return;
            }
            this.channel = this.server.createChannel({
                json: false,
                setup: (channel) => this.setupChannel(channel, callback),
            });
        });
        const maxConnectionAttempts = this.getOptionsProp(this.options, 'maxConnectionAttempts', INFINITE_CONNECTION_ATTEMPTS);
        this.server.on(constants_1.DISCONNECT_EVENT, (err) => {
            this.logger.error(constants_1.DISCONNECTED_RMQ_MESSAGE);
            this.logger.error(err);
        });
        this.server.on(constants_1.CONNECT_FAILED_EVENT, (error) => {
            var _a;
            this.logger.error(constants_1.CONNECTION_FAILED_MESSAGE);
            if (error === null || error === void 0 ? void 0 : error.err) {
                this.logger.error(error.err);
            }
            const isReconnecting = !!this.channel;
            if (maxConnectionAttempts === INFINITE_CONNECTION_ATTEMPTS ||
                isReconnecting) {
                return;
            }
            if (++this.connectionAttempts === maxConnectionAttempts) {
                this.close();
                callback === null || callback === void 0 ? void 0 : callback((_a = error.err) !== null && _a !== void 0 ? _a : new Error(constants_1.CONNECTION_FAILED_MESSAGE));
            }
        });
    }
    createClient() {
        const socketOptions = this.getOptionsProp(this.options, 'socketOptions');
        return rqmPackage.connect(this.urls, {
            connectionOptions: socketOptions,
            heartbeatIntervalInSeconds: socketOptions === null || socketOptions === void 0 ? void 0 : socketOptions.heartbeatIntervalInSeconds,
            reconnectTimeInSeconds: socketOptions === null || socketOptions === void 0 ? void 0 : socketOptions.reconnectTimeInSeconds,
        });
    }
    async setupChannel(channel, callback) {
        const noAck = this.getOptionsProp(this.options, 'noAck', constants_1.RQM_DEFAULT_NOACK);
        if (!this.queueOptions.noAssert) {
            await channel.assertQueue(this.queue, this.queueOptions);
        }
        await channel.prefetch(this.prefetchCount, this.isGlobalPrefetchCount);
        channel.consume(this.queue, (msg) => this.handleMessage(msg, channel), {
            noAck,
        });
        callback();
    }
    async handleMessage(message, channel) {
        if ((0, shared_utils_1.isNil)(message)) {
            return;
        }
        const { content, properties } = message;
        const rawMessage = JSON.parse(content.toString());
        const packet = await this.deserializer.deserialize(rawMessage, properties);
        const pattern = (0, shared_utils_1.isString)(packet.pattern)
            ? packet.pattern
            : JSON.stringify(packet.pattern);
        const rmqContext = new ctx_host_1.RmqContext([message, channel, pattern]);
        if ((0, shared_utils_1.isUndefined)(packet.id)) {
            return this.handleEvent(pattern, packet, rmqContext);
        }
        const handler = this.getHandlerByPattern(pattern);
        if (!handler) {
            const status = 'error';
            const noHandlerPacket = {
                id: packet.id,
                err: constants_1.NO_MESSAGE_HANDLER,
                status,
            };
            return this.sendMessage(noHandlerPacket, properties.replyTo, properties.correlationId);
        }
        const response$ = this.transformToObservable(await handler(packet.data, rmqContext));
        const publish = (data) => this.sendMessage(data, properties.replyTo, properties.correlationId);
        response$ && this.send(response$, publish);
    }
    sendMessage(message, replyTo, correlationId) {
        const outgoingResponse = this.serializer.serialize(message);
        const options = outgoingResponse.options;
        delete outgoingResponse.options;
        const buffer = Buffer.from(JSON.stringify(outgoingResponse));
        this.channel.sendToQueue(replyTo, buffer, Object.assign({ correlationId }, options));
    }
    initializeSerializer(options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new rmq_record_serializer_1.RmqRecordSerializer();
    }
}
exports.ServerRMQ = ServerRMQ;


/***/ }),
/* 197 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerTCP = void 0;
const shared_utils_1 = __webpack_require__(26);
const net = __webpack_require__(113);
const constants_1 = __webpack_require__(60);
const tcp_context_1 = __webpack_require__(121);
const enums_1 = __webpack_require__(79);
const helpers_1 = __webpack_require__(82);
const server_1 = __webpack_require__(188);
class ServerTCP extends server_1.Server {
    constructor(options) {
        super();
        this.options = options;
        this.transportId = enums_1.Transport.TCP;
        this.isExplicitlyTerminated = false;
        this.retryAttemptsCount = 0;
        this.port = this.getOptionsProp(options, 'port') || constants_1.TCP_DEFAULT_PORT;
        this.host = this.getOptionsProp(options, 'host') || constants_1.TCP_DEFAULT_HOST;
        this.socketClass =
            this.getOptionsProp(options, 'socketClass') || helpers_1.JsonSocket;
        this.init();
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    listen(callback) {
        this.server.once(constants_1.ERROR_EVENT, (err) => {
            if ((err === null || err === void 0 ? void 0 : err.code) === constants_1.EADDRINUSE || (err === null || err === void 0 ? void 0 : err.code) === constants_1.ECONNREFUSED) {
                return callback(err);
            }
        });
        this.server.listen(this.port, this.host, callback);
    }
    close() {
        this.isExplicitlyTerminated = true;
        this.server.close();
    }
    bindHandler(socket) {
        const readSocket = this.getSocketInstance(socket);
        readSocket.on(constants_1.MESSAGE_EVENT, async (msg) => this.handleMessage(readSocket, msg));
        readSocket.on(constants_1.ERROR_EVENT, this.handleError.bind(this));
    }
    async handleMessage(socket, rawMessage) {
        const packet = await this.deserializer.deserialize(rawMessage);
        const pattern = !(0, shared_utils_1.isString)(packet.pattern)
            ? JSON.stringify(packet.pattern)
            : packet.pattern;
        const tcpContext = new tcp_context_1.TcpContext([socket, pattern]);
        if ((0, shared_utils_1.isUndefined)(packet.id)) {
            return this.handleEvent(pattern, packet, tcpContext);
        }
        const handler = this.getHandlerByPattern(pattern);
        if (!handler) {
            const status = 'error';
            const noHandlerPacket = this.serializer.serialize({
                id: packet.id,
                status,
                err: constants_1.NO_MESSAGE_HANDLER,
            });
            return socket.sendMessage(noHandlerPacket);
        }
        const response$ = this.transformToObservable(await handler(packet.data, tcpContext));
        response$ &&
            this.send(response$, data => {
                Object.assign(data, { id: packet.id });
                const outgoingResponse = this.serializer.serialize(data);
                socket.sendMessage(outgoingResponse);
            });
    }
    handleClose() {
        if (this.isExplicitlyTerminated ||
            !this.getOptionsProp(this.options, 'retryAttempts') ||
            this.retryAttemptsCount >=
                this.getOptionsProp(this.options, 'retryAttempts')) {
            return undefined;
        }
        ++this.retryAttemptsCount;
        return setTimeout(() => this.server.listen(this.port, this.host), this.getOptionsProp(this.options, 'retryDelay') || 0);
    }
    init() {
        this.server = net.createServer(this.bindHandler.bind(this));
        this.server.on(constants_1.ERROR_EVENT, this.handleError.bind(this));
        this.server.on(constants_1.CLOSE_EVENT, this.handleClose.bind(this));
    }
    getSocketInstance(socket) {
        return new this.socketClass(socket);
    }
}
exports.ServerTCP = ServerTCP;


/***/ }),
/* 198 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerFactory = void 0;
const transport_enum_1 = __webpack_require__(80);
const server_grpc_1 = __webpack_require__(189);
const server_kafka_1 = __webpack_require__(191);
const server_mqtt_1 = __webpack_require__(193);
const server_nats_1 = __webpack_require__(194);
const server_redis_1 = __webpack_require__(195);
const server_tcp_1 = __webpack_require__(197);
const server_rmq_1 = __webpack_require__(196);
class ServerFactory {
    static create(microserviceOptions) {
        const { transport, options } = microserviceOptions;
        switch (transport) {
            case transport_enum_1.Transport.REDIS:
                return new server_redis_1.ServerRedis(options);
            case transport_enum_1.Transport.NATS:
                return new server_nats_1.ServerNats(options);
            case transport_enum_1.Transport.MQTT:
                return new server_mqtt_1.ServerMqtt(options);
            case transport_enum_1.Transport.GRPC:
                return new server_grpc_1.ServerGrpc(options);
            case transport_enum_1.Transport.KAFKA:
                return new server_kafka_1.ServerKafka(options);
            case transport_enum_1.Transport.RMQ:
                return new server_rmq_1.ServerRMQ(options);
            default:
                return new server_tcp_1.ServerTCP(options);
        }
    }
}
exports.ServerFactory = ServerFactory;


/***/ }),
/* 199 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CONTEXT = void 0;
const core_1 = __webpack_require__(4);
exports.CONTEXT = core_1.REQUEST;


/***/ })
];
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("c746f9d0a03d25200d55")
/******/ })();
/******/ 
/******/ }
;