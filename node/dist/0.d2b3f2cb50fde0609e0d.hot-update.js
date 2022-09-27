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
const path_1 = __webpack_require__(5);
const app_module_1 = __webpack_require__(6);
const platform_fastify_1 = __webpack_require__(10);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
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
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*
 * Nest @platform-fastify
 * Copyright(c) 2017 - 2022 Kamil Mysliwiec
 * https://nestjs.com
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(11);
tslib_1.__exportStar(__webpack_require__(12), exports);
tslib_1.__exportStar(__webpack_require__(222), exports);


/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = require("tslib");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(11);
tslib_1.__exportStar(__webpack_require__(13), exports);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FastifyAdapter = void 0;
const common_1 = __webpack_require__(7);
const load_package_util_1 = __webpack_require__(14);
const shared_utils_1 = __webpack_require__(15);
const http_adapter_1 = __webpack_require__(16);
const fastify_1 = __webpack_require__(17);
const Reply = __webpack_require__(37);
// `querystring` is used internally in fastify for registering urlencoded body parser.
const querystring_1 = __webpack_require__(160);
class FastifyAdapter extends http_adapter_1.AbstractHttpAdapter {
    constructor(instanceOrOptions) {
        super();
        this.versionConstraint = {
            name: 'version',
            validate(value) {
                if (!(0, shared_utils_1.isString)(value) && !Array.isArray(value)) {
                    throw new Error('Version constraint should be a string or an array of strings.');
                }
            },
            storage() {
                const versions = new Map();
                return {
                    get(version) {
                        if (Array.isArray(version)) {
                            return versions.get(version.find(v => versions.has(v))) || null;
                        }
                        return versions.get(version) || null;
                    },
                    set(versionOrVersions, store) {
                        const storeVersionConstraint = (version) => versions.set(version, store);
                        if (Array.isArray(versionOrVersions))
                            versionOrVersions.forEach(storeVersionConstraint);
                        else
                            storeVersionConstraint(versionOrVersions);
                    },
                    del(version) {
                        if (Array.isArray(version)) {
                            version.forEach(v => versions.delete(v));
                        }
                        else {
                            versions.delete(version);
                        }
                    },
                    empty() {
                        versions.clear();
                    },
                };
            },
            deriveConstraint: (req) => {
                var _a, _b, _c, _d;
                // Media Type (Accept Header) Versioning Handler
                if (this.versioningOptions.type === common_1.VersioningType.MEDIA_TYPE) {
                    const MEDIA_TYPE_HEADER = 'Accept';
                    const acceptHeaderValue = (((_a = req.headers) === null || _a === void 0 ? void 0 : _a[MEDIA_TYPE_HEADER]) || ((_b = req.headers) === null || _b === void 0 ? void 0 : _b[MEDIA_TYPE_HEADER.toLowerCase()]));
                    const acceptHeaderVersionParameter = acceptHeaderValue
                        ? acceptHeaderValue.split(';')[1]
                        : '';
                    return (0, shared_utils_1.isUndefined)(acceptHeaderVersionParameter)
                        ? common_1.VERSION_NEUTRAL // No version was supplied
                        : acceptHeaderVersionParameter.split(this.versioningOptions.key)[1];
                }
                // Header Versioning Handler
                else if (this.versioningOptions.type === common_1.VersioningType.HEADER) {
                    const customHeaderVersionParameter = ((_c = req.headers) === null || _c === void 0 ? void 0 : _c[this.versioningOptions.header]) ||
                        ((_d = req.headers) === null || _d === void 0 ? void 0 : _d[this.versioningOptions.header.toLowerCase()]);
                    return (0, shared_utils_1.isUndefined)(customHeaderVersionParameter)
                        ? common_1.VERSION_NEUTRAL // No version was supplied
                        : customHeaderVersionParameter;
                }
                // Custom Versioning Handler
                else if (this.versioningOptions.type === common_1.VersioningType.CUSTOM) {
                    return this.versioningOptions.extractor(req);
                }
                return undefined;
            },
            mustMatchWhenDerived: false,
        };
        const instance = instanceOrOptions && instanceOrOptions.server
            ? instanceOrOptions
            : (0, fastify_1.fastify)(Object.assign({ constraints: {
                    version: this.versionConstraint,
                } }, instanceOrOptions));
        this.setInstance(instance);
    }
    get isParserRegistered() {
        return !!this._isParserRegistered;
    }
    async init() {
        if (this.isMiddieRegistered) {
            return;
        }
        await this.registerMiddie();
    }
    listen(port, ...args) {
        const isFirstArgTypeofFunction = typeof args[0] === 'function';
        const callback = isFirstArgTypeofFunction ? args[0] : args[1];
        const options = {
            port: +port,
        };
        if (!isFirstArgTypeofFunction) {
            options.host = args[0];
        }
        return this.instance.listen(options, callback);
    }
    get(...args) {
        return this.injectConstraintsIfVersioned('get', ...args);
    }
    post(...args) {
        return this.injectConstraintsIfVersioned('post', ...args);
    }
    head(...args) {
        return this.injectConstraintsIfVersioned('head', ...args);
    }
    delete(...args) {
        return this.injectConstraintsIfVersioned('delete', ...args);
    }
    put(...args) {
        return this.injectConstraintsIfVersioned('put', ...args);
    }
    patch(...args) {
        return this.injectConstraintsIfVersioned('patch', ...args);
    }
    options(...args) {
        return this.injectConstraintsIfVersioned('options', ...args);
    }
    applyVersionFilter(handler, version, versioningOptions) {
        if (!this.versioningOptions) {
            this.versioningOptions = versioningOptions;
        }
        const versionedRoute = handler;
        versionedRoute.version = version;
        return versionedRoute;
    }
    reply(response, body, statusCode) {
        const fastifyReply = this.isNativeResponse(response)
            ? new Reply(response, {
                context: {
                    preSerialization: null,
                    preValidation: [],
                    preHandler: [],
                    onSend: [],
                    onError: [],
                },
            }, {})
            : response;
        if (statusCode) {
            fastifyReply.status(statusCode);
        }
        if (body instanceof common_1.StreamableFile) {
            const streamHeaders = body.getHeaders();
            if (fastifyReply.getHeader('Content-Type') === undefined &&
                streamHeaders.type !== undefined) {
                fastifyReply.header('Content-Type', streamHeaders.type);
            }
            if (fastifyReply.getHeader('Content-Disposition') === undefined &&
                streamHeaders.disposition !== undefined) {
                fastifyReply.header('Content-Disposition', streamHeaders.disposition);
            }
            if (fastifyReply.getHeader('Content-Length') === undefined &&
                streamHeaders.length !== undefined) {
                fastifyReply.header('Content-Length', streamHeaders.length);
            }
            body = body.getStream();
        }
        return fastifyReply.send(body);
    }
    status(response, statusCode) {
        if (this.isNativeResponse(response)) {
            response.statusCode = statusCode;
            return response;
        }
        return response.code(statusCode);
    }
    end(response, message) {
        response.raw.end(message);
    }
    render(response, view, options) {
        return response && response.view(view, options);
    }
    redirect(response, statusCode, url) {
        const code = statusCode !== null && statusCode !== void 0 ? statusCode : common_1.HttpStatus.FOUND;
        return response.status(code).redirect(url);
    }
    setErrorHandler(handler) {
        return this.instance.setErrorHandler(handler);
    }
    setNotFoundHandler(handler) {
        return this.instance.setNotFoundHandler(handler);
    }
    getHttpServer() {
        return this.instance.server;
    }
    getInstance() {
        return this.instance;
    }
    register(plugin, opts) {
        return this.instance.register(plugin, opts);
    }
    inject(opts) {
        return this.instance.inject(opts);
    }
    async close() {
        try {
            return await this.instance.close();
        }
        catch (err) {
            // Check if server is still running
            if (err.code !== 'ERR_SERVER_NOT_RUNNING') {
                throw err;
            }
            return;
        }
    }
    initHttpServer() {
        this.httpServer = this.instance.server;
    }
    useStaticAssets(options) {
        return this.register((0, load_package_util_1.loadPackage)('@fastify/static', 'FastifyAdapter.useStaticAssets()', () => __webpack_require__(161)), options);
    }
    setViewEngine(options) {
        if ((0, shared_utils_1.isString)(options)) {
            new common_1.Logger('FastifyAdapter').error("setViewEngine() doesn't support a string argument.");
            process.exit(1);
        }
        return this.register((0, load_package_util_1.loadPackage)('@fastify/view', 'FastifyAdapter.setViewEngine()', () => __webpack_require__(162)), options);
    }
    isHeadersSent(response) {
        return response.sent;
    }
    setHeader(response, name, value) {
        return response.header(name, value);
    }
    getRequestHostname(request) {
        return request.hostname;
    }
    getRequestMethod(request) {
        return request.raw ? request.raw.method : request.method;
    }
    getRequestUrl(request) {
        return this.getRequestOriginalUrl(request.raw || request);
    }
    enableCors(options) {
        this.register(Promise.resolve().then(() => __webpack_require__(163)), options);
    }
    registerParserMiddleware(prefix, rawBody) {
        if (this._isParserRegistered) {
            return;
        }
        this.registerUrlencodedContentParser(rawBody);
        this.registerJsonContentParser(rawBody);
        this._isParserRegistered = true;
    }
    async createMiddlewareFactory(requestMethod) {
        if (!this.isMiddieRegistered) {
            await this.registerMiddie();
        }
        return (path, callback) => {
            let normalizedPath = path.endsWith('/*')
                ? `${path.slice(0, -1)}(.*)`
                : path;
            // Fallback to "(.*)" to support plugins like GraphQL
            normalizedPath = normalizedPath === '/(.*)' ? '(.*)' : normalizedPath;
            // The following type assertion is valid as we use import('@fastify/middie') rather than require('@fastify/middie')
            // ref https://github.com/fastify/middie/pull/55
            this.instance.use(normalizedPath, callback);
        };
    }
    getType() {
        return 'fastify';
    }
    registerWithPrefix(factory, prefix = '/') {
        return this.instance.register(factory, { prefix });
    }
    isNativeResponse(response) {
        return !('status' in response);
    }
    registerJsonContentParser(rawBody) {
        const { bodyLimit } = this.getInstance().initialConfig;
        this.getInstance().addContentTypeParser('application/json', { parseAs: 'buffer', bodyLimit }, (req, body, done) => {
            if (rawBody === true && Buffer.isBuffer(body)) {
                req.rawBody = body;
            }
            const { onProtoPoisoning, onConstructorPoisoning } = this.instance.initialConfig;
            const defaultJsonParser = this.instance.getDefaultJsonParser(onProtoPoisoning || 'error', onConstructorPoisoning || 'error');
            defaultJsonParser(req, body, done);
        });
    }
    registerUrlencodedContentParser(rawBody) {
        const { bodyLimit } = this.getInstance().initialConfig;
        this.getInstance().addContentTypeParser('application/x-www-form-urlencoded', { parseAs: 'buffer', bodyLimit }, (req, body, done) => {
            if (rawBody === true && Buffer.isBuffer(body)) {
                req.rawBody = body;
            }
            done(null, (0, querystring_1.parse)(body.toString()));
        });
    }
    async registerMiddie() {
        this.isMiddieRegistered = true;
        await this.register(Promise.resolve().then(() => __webpack_require__(218)));
    }
    getRequestOriginalUrl(rawRequest) {
        return rawRequest.originalUrl || rawRequest.url;
    }
    injectConstraintsIfVersioned(routerMethodKey, ...args) {
        const handlerRef = args[args.length - 1];
        const isVersioned = !(0, shared_utils_1.isUndefined)(handlerRef.version) &&
            handlerRef.version !== common_1.VERSION_NEUTRAL;
        if (isVersioned) {
            const isPathAndRouteTuple = args.length === 2;
            if (isPathAndRouteTuple) {
                const options = {
                    constraints: {
                        version: handlerRef.version,
                    },
                };
                const path = args[0];
                return this.instance[routerMethodKey](path, options, handlerRef);
            }
        }
        return this.instance[routerMethodKey](...args);
    }
}
exports.FastifyAdapter = FastifyAdapter;


/***/ }),
/* 14 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/utils/load-package.util");

/***/ }),
/* 15 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/utils/shared.utils");

/***/ }),
/* 16 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/adapters/http-adapter");

/***/ }),
/* 17 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const VERSION = '4.6.0'

const Avvio = __webpack_require__(18)
const http = __webpack_require__(27)
let lightMyRequest

const {
  kAvvioBoot,
  kChildren,
  kServerBindings,
  kBodyLimit,
  kRoutePrefix,
  kLogLevel,
  kLogSerializers,
  kHooks,
  kSchemaController,
  kRequestAcceptVersion,
  kReplySerializerDefault,
  kContentTypeParser,
  kReply,
  kRequest,
  kFourOhFour,
  kState,
  kOptions,
  kPluginNameChain,
  kSchemaErrorFormatter,
  kErrorHandler,
  kKeepAliveConnections,
  kFourOhFourContext
} = __webpack_require__(28)

const { createServer, compileValidateHTTPVersion } = __webpack_require__(29)
const Reply = __webpack_require__(37)
const Request = __webpack_require__(90)
const { supportedMethods } = __webpack_require__(93)
const decorator = __webpack_require__(94)
const ContentTypeParser = __webpack_require__(95)
const SchemaController = __webpack_require__(99)
const { Hooks, hookRunnerApplication, supportedHooks } = __webpack_require__(39)
const { createLogger } = __webpack_require__(43)
const pluginUtils = __webpack_require__(123)
const reqIdGenFactory = __webpack_require__(124)
const { buildRouting, validateBodyLimitOption } = __webpack_require__(125)
const build404 = __webpack_require__(147)
const getSecuredInitialConfig = __webpack_require__(148)
const override = __webpack_require__(150)
const warning = __webpack_require__(32)
const noopSet = __webpack_require__(151)
const { defaultInitOptions } = getSecuredInitialConfig

const {
  FST_ERR_BAD_URL,
  FST_ERR_FORCE_CLOSE_CONNECTIONS_IDLE_NOT_AVAILABLE,
  AVVIO_ERRORS_MAP,
  appendStackTrace
} = __webpack_require__(34)

const { buildErrorHandler } = __webpack_require__(86)

const onBadUrlContext = {
  config: {
  },
  onSend: [],
  onError: [],
  [kFourOhFourContext]: null
}

function defaultBuildPrettyMeta (route) {
  // return a shallow copy of route's sanitized context

  const cleanKeys = {}
  const allowedProps = ['errorHandler', 'logLevel', 'logSerializers']

  allowedProps.concat(supportedHooks).forEach(k => {
    cleanKeys[k] = route.store[k]
  })

  return Object.assign({}, cleanKeys)
}

function fastify (options) {
  // Options validations
  options = options || {}

  if (typeof options !== 'object') {
    throw new TypeError('Options must be an object')
  }

  if (options.querystringParser && typeof options.querystringParser !== 'function') {
    throw new Error(`querystringParser option should be a function, instead got '${typeof options.querystringParser}'`)
  }

  if (options.schemaController && options.schemaController.bucket && typeof options.schemaController.bucket !== 'function') {
    throw new Error(`schemaController.bucket option should be a function, instead got '${typeof options.schemaController.bucket}'`)
  }

  validateBodyLimitOption(options.bodyLimit)

  const requestIdHeader = (options.requestIdHeader === false) ? false : (options.requestIdHeader || defaultInitOptions.requestIdHeader)
  const genReqId = reqIdGenFactory(requestIdHeader, options.genReqId)
  const requestIdLogLabel = options.requestIdLogLabel || 'reqId'
  const bodyLimit = options.bodyLimit || defaultInitOptions.bodyLimit
  const disableRequestLogging = options.disableRequestLogging || false

  const ajvOptions = Object.assign({
    customOptions: {},
    plugins: []
  }, options.ajv)
  const frameworkErrors = options.frameworkErrors

  // Ajv options
  if (!ajvOptions.customOptions || Object.prototype.toString.call(ajvOptions.customOptions) !== '[object Object]') {
    throw new Error(`ajv.customOptions option should be an object, instead got '${typeof ajvOptions.customOptions}'`)
  }
  if (!ajvOptions.plugins || !Array.isArray(ajvOptions.plugins)) {
    throw new Error(`ajv.plugins option should be an array, instead got '${typeof ajvOptions.plugins}'`)
  }

  // Instance Fastify components
  const { logger, hasLogger } = createLogger(options)

  // Update the options with the fixed values
  options.connectionTimeout = options.connectionTimeout || defaultInitOptions.connectionTimeout
  options.keepAliveTimeout = options.keepAliveTimeout || defaultInitOptions.keepAliveTimeout
  options.maxRequestsPerSocket = options.maxRequestsPerSocket || defaultInitOptions.maxRequestsPerSocket
  options.requestTimeout = options.requestTimeout || defaultInitOptions.requestTimeout
  options.logger = logger
  options.genReqId = genReqId
  options.requestIdHeader = requestIdHeader
  options.requestIdLogLabel = requestIdLogLabel
  options.disableRequestLogging = disableRequestLogging
  options.ajv = ajvOptions
  options.clientErrorHandler = options.clientErrorHandler || defaultClientErrorHandler

  const initialConfig = getSecuredInitialConfig(options)

  // exposeHeadRoutes have its default set from the validator
  options.exposeHeadRoutes = initialConfig.exposeHeadRoutes

  let constraints = options.constraints
  if (options.versioning) {
    warning.emit('FSTDEP009')
    constraints = {
      ...constraints,
      version: {
        name: 'version',
        mustMatchWhenDerived: true,
        storage: options.versioning.storage,
        deriveConstraint: options.versioning.deriveVersion,
        validate (value) {
          if (typeof value !== 'string') {
            throw new Error('Version constraint should be a string.')
          }
        }
      }
    }
  }

  // Default router
  const router = buildRouting({
    config: {
      defaultRoute,
      onBadUrl,
      constraints,
      ignoreTrailingSlash: options.ignoreTrailingSlash || defaultInitOptions.ignoreTrailingSlash,
      ignoreDuplicateSlashes: options.ignoreDuplicateSlashes || defaultInitOptions.ignoreDuplicateSlashes,
      maxParamLength: options.maxParamLength || defaultInitOptions.maxParamLength,
      caseSensitive: options.caseSensitive,
      allowUnsafeRegex: options.allowUnsafeRegex || defaultInitOptions.allowUnsafeRegex,
      buildPrettyMeta: defaultBuildPrettyMeta,
      querystringParser: options.querystringParser
    }
  })

  // 404 router, used for handling encapsulated 404 handlers
  const fourOhFour = build404(options)

  // HTTP server and its handler
  const httpHandler = wrapRouting(router.routing, options)

  // we need to set this before calling createServer
  options.http2SessionTimeout = initialConfig.http2SessionTimeout
  const { server, listen } = createServer(options, httpHandler)

  const serverHasCloseAllConnections = typeof server.closeAllConnections === 'function'
  const serverHasCloseIdleConnections = typeof server.closeIdleConnections === 'function'

  let forceCloseConnections = options.forceCloseConnections
  if (forceCloseConnections === 'idle' && !serverHasCloseIdleConnections) {
    throw new FST_ERR_FORCE_CLOSE_CONNECTIONS_IDLE_NOT_AVAILABLE()
  } else if (typeof forceCloseConnections !== 'boolean') {
    /* istanbul ignore next: only one branch can be valid in a given Node.js version */
    forceCloseConnections = serverHasCloseIdleConnections ? 'idle' : false
  }

  const keepAliveConnections = !serverHasCloseAllConnections && forceCloseConnections === true ? new Set() : noopSet()

  const setupResponseListeners = Reply.setupResponseListeners
  const schemaController = SchemaController.buildSchemaController(null, options.schemaController)

  // Public API
  const fastify = {
    // Fastify internals
    [kState]: {
      listening: false,
      closing: false,
      started: false
    },
    [kKeepAliveConnections]: keepAliveConnections,
    [kOptions]: options,
    [kChildren]: [],
    [kServerBindings]: [],
    [kBodyLimit]: bodyLimit,
    [kRoutePrefix]: '',
    [kLogLevel]: '',
    [kLogSerializers]: null,
    [kHooks]: new Hooks(),
    [kSchemaController]: schemaController,
    [kSchemaErrorFormatter]: null,
    [kErrorHandler]: buildErrorHandler(),
    [kReplySerializerDefault]: null,
    [kContentTypeParser]: new ContentTypeParser(
      bodyLimit,
      (options.onProtoPoisoning || defaultInitOptions.onProtoPoisoning),
      (options.onConstructorPoisoning || defaultInitOptions.onConstructorPoisoning)
    ),
    [kReply]: Reply.buildReply(Reply),
    [kRequest]: Request.buildRequest(Request, options.trustProxy),
    [kFourOhFour]: fourOhFour,
    [pluginUtils.registeredPlugins]: [],
    [kPluginNameChain]: ['fastify'],
    [kAvvioBoot]: null,
    // routing method
    routing: httpHandler,
    getDefaultRoute: router.getDefaultRoute.bind(router),
    setDefaultRoute: router.setDefaultRoute.bind(router),
    // routes shorthand methods
    delete: function _delete (url, options, handler) {
      return router.prepareRoute.call(this, { method: 'DELETE', url, options, handler })
    },
    get: function _get (url, options, handler) {
      return router.prepareRoute.call(this, { method: 'GET', url, options, handler })
    },
    head: function _head (url, options, handler) {
      return router.prepareRoute.call(this, { method: 'HEAD', url, options, handler })
    },
    patch: function _patch (url, options, handler) {
      return router.prepareRoute.call(this, { method: 'PATCH', url, options, handler })
    },
    post: function _post (url, options, handler) {
      return router.prepareRoute.call(this, { method: 'POST', url, options, handler })
    },
    put: function _put (url, options, handler) {
      return router.prepareRoute.call(this, { method: 'PUT', url, options, handler })
    },
    options: function _options (url, options, handler) {
      return router.prepareRoute.call(this, { method: 'OPTIONS', url, options, handler })
    },
    all: function _all (url, options, handler) {
      return router.prepareRoute.call(this, { method: supportedMethods, url, options, handler })
    },
    // extended route
    route: function _route (options) {
      // we need the fastify object that we are producing so we apply a lazy loading of the function,
      // otherwise we should bind it after the declaration
      return router.route.call(this, { options })
    },
    hasRoute: function _route (options) {
      return router.hasRoute.call(this, { options })
    },
    // expose logger instance
    log: logger,
    // type provider
    withTypeProvider,
    // hooks
    addHook,
    // schemas
    addSchema,
    getSchema: schemaController.getSchema.bind(schemaController),
    getSchemas: schemaController.getSchemas.bind(schemaController),
    setValidatorCompiler,
    setSerializerCompiler,
    setSchemaController,
    setReplySerializer,
    setSchemaErrorFormatter,
    // custom parsers
    addContentTypeParser: ContentTypeParser.helpers.addContentTypeParser,
    hasContentTypeParser: ContentTypeParser.helpers.hasContentTypeParser,
    getDefaultJsonParser: ContentTypeParser.defaultParsers.getDefaultJsonParser,
    defaultTextParser: ContentTypeParser.defaultParsers.defaultTextParser,
    removeContentTypeParser: ContentTypeParser.helpers.removeContentTypeParser,
    removeAllContentTypeParsers: ContentTypeParser.helpers.removeAllContentTypeParsers,
    // Fastify architecture methods (initialized by Avvio)
    register: null,
    after: null,
    ready: null,
    onClose: null,
    close: null,
    printPlugins: null,
    hasPlugin: function (name) {
      return this[kPluginNameChain].includes(name)
    },
    // http server
    listen,
    server,
    addresses: function () {
      /* istanbul ignore next */
      const binded = this[kServerBindings].map(b => b.address())
      binded.push(this.server.address())
      return binded.filter(adr => adr)
    },
    // extend fastify objects
    decorate: decorator.add,
    hasDecorator: decorator.exist,
    decorateReply: decorator.decorateReply,
    decorateRequest: decorator.decorateRequest,
    hasRequestDecorator: decorator.existRequest,
    hasReplyDecorator: decorator.existReply,
    // fake http injection
    inject,
    // pretty print of the registered routes
    printRoutes,
    // custom error handling
    setNotFoundHandler,
    setErrorHandler,
    // Set fastify initial configuration options read-only object
    initialConfig,
    // constraint strategies
    addConstraintStrategy: router.addConstraintStrategy.bind(router),
    hasConstraintStrategy: router.hasConstraintStrategy.bind(router)
  }

  Object.defineProperties(fastify, {
    pluginName: {
      configurable: true,
      get () {
        if (this[kPluginNameChain].length > 1) {
          return this[kPluginNameChain].join(' -> ')
        }
        return this[kPluginNameChain][0]
      }
    },
    prefix: {
      configurable: true,
      get () { return this[kRoutePrefix] }
    },
    validatorCompiler: {
      configurable: true,
      get () { return this[kSchemaController].getValidatorCompiler() }
    },
    serializerCompiler: {
      configurable: true,
      get () { return this[kSchemaController].getSerializerCompiler() }
    },
    version: {
      configurable: true,
      get () { return VERSION }
    },
    errorHandler: {
      configurable: true,
      get () {
        return this[kErrorHandler].func
      }
    }
  })

  if (options.schemaErrorFormatter) {
    validateSchemaErrorFormatter(options.schemaErrorFormatter)
    fastify[kSchemaErrorFormatter] = options.schemaErrorFormatter.bind(fastify)
  }

  // Install and configure Avvio
  // Avvio will update the following Fastify methods:
  // - register
  // - after
  // - ready
  // - onClose
  // - close

  const avvioPluginTimeout = Number(options.pluginTimeout)
  const avvio = Avvio(fastify, {
    autostart: false,
    timeout: isNaN(avvioPluginTimeout) === false ? avvioPluginTimeout : defaultInitOptions.pluginTimeout,
    expose: {
      use: 'register'
    }
  })
  // Override to allow the plugin encapsulation
  avvio.override = override
  avvio.on('start', () => (fastify[kState].started = true))
  fastify[kAvvioBoot] = fastify.ready // the avvio ready function
  fastify.ready = ready // overwrite the avvio ready function
  fastify.printPlugins = avvio.prettyPrint.bind(avvio)

  // cache the closing value, since we are checking it in an hot path
  avvio.once('preReady', () => {
    fastify.onClose((instance, done) => {
      fastify[kState].closing = true
      router.closeRoutes()
      if (fastify[kState].listening) {
        // No new TCP connections are accepted
        instance.server.close(done)

        /* istanbul ignore next: Cannot test this without Node.js core support */
        if (forceCloseConnections === 'idle') {
          instance.server.closeIdleConnections()
        /* istanbul ignore next: Cannot test this without Node.js core support */
        } else if (serverHasCloseAllConnections && forceCloseConnections) {
          instance.server.closeAllConnections()
        } else {
          for (const conn of fastify[kKeepAliveConnections]) {
            // We must invoke the destroy method instead of merely unreffing
            // the sockets. If we only unref, then the callback passed to
            // `fastify.close` will never be invoked; nor will any of the
            // registered `onClose` hooks.
            conn.destroy()
            fastify[kKeepAliveConnections].delete(conn)
          }
        }
      } else {
        done(null)
      }
    })
  })

  // Set the default 404 handler
  fastify.setNotFoundHandler()
  fourOhFour.arrange404(fastify)

  router.setup(options, {
    avvio,
    fourOhFour,
    logger,
    hasLogger,
    setupResponseListeners,
    throwIfAlreadyStarted,
    validateHTTPVersion: compileValidateHTTPVersion(options),
    keepAliveConnections
  })

  // Delay configuring clientError handler so that it can access fastify state.
  server.on('clientError', options.clientErrorHandler.bind(fastify))

  try {
    const dc = __webpack_require__(152)
    const initChannel = dc.channel('fastify.initialization')
    if (initChannel.hasSubscribers) {
      initChannel.publish({ fastify })
    }
  } catch (e) {
    // This only happens if `diagnostics_channel` isn't available, i.e. earlier
    // versions of Node.js. In that event, we don't care, so ignore the error.
  }

  return fastify

  function throwIfAlreadyStarted (msg) {
    if (fastify[kState].started) throw new Error(msg)
  }

  // HTTP injection handling
  // If the server is not ready yet, this
  // utility will automatically force it.
  function inject (opts, cb) {
    // lightMyRequest is dynamically loaded as it seems very expensive
    // because of Ajv
    if (lightMyRequest === undefined) {
      lightMyRequest = __webpack_require__(153)
    }

    if (fastify[kState].started) {
      if (fastify[kState].closing) {
        // Force to return an error
        const error = new Error('Server is closed')
        if (cb) {
          cb(error)
          return
        } else {
          return Promise.reject(error)
        }
      }
      return lightMyRequest(httpHandler, opts, cb)
    }

    if (cb) {
      this.ready(err => {
        if (err) cb(err, null)
        else lightMyRequest(httpHandler, opts, cb)
      })
    } else {
      return lightMyRequest((req, res) => {
        this.ready(function (err) {
          if (err) {
            res.emit('error', err)
            return
          }
          httpHandler(req, res)
        })
      }, opts)
    }
  }

  function ready (cb) {
    let resolveReady
    let rejectReady

    // run the hooks after returning the promise
    process.nextTick(runHooks)

    if (!cb) {
      return new Promise(function (resolve, reject) {
        resolveReady = resolve
        rejectReady = reject
      })
    }

    function runHooks () {
      // start loading
      fastify[kAvvioBoot]((err, done) => {
        if (err || fastify[kState].started) {
          manageErr(err)
        } else {
          hookRunnerApplication('onReady', fastify[kAvvioBoot], fastify, manageErr)
        }
        done()
      })
    }

    function manageErr (err) {
      // If the error comes out of Avvio's Error codes
      // We create a make and preserve the previous error
      // as cause
      err = err != null && AVVIO_ERRORS_MAP[err.code] != null
        ? appendStackTrace(err, new AVVIO_ERRORS_MAP[err.code](err.message))
        : err

      if (cb) {
        if (err) {
          cb(err)
        } else {
          cb(undefined, fastify)
        }
      } else {
        if (err) {
          return rejectReady(err)
        }
        resolveReady(fastify)
      }
    }
  }

  // Used exclusively in TypeScript contexts to enable auto type inference from JSON schema.
  function withTypeProvider () {
    return this
  }

  // wrapper that we expose to the user for hooks handling
  function addHook (name, fn) {
    throwIfAlreadyStarted('Cannot call "addHook" when fastify instance is already started!')

    if (name === 'onSend' || name === 'preSerialization' || name === 'onError' || name === 'preParsing') {
      if (fn.constructor.name === 'AsyncFunction' && fn.length === 4) {
        throw new Error('Async function has too many arguments. Async hooks should not use the \'done\' argument.')
      }
    } else if (name === 'onReady') {
      if (fn.constructor.name === 'AsyncFunction' && fn.length !== 0) {
        throw new Error('Async function has too many arguments. Async hooks should not use the \'done\' argument.')
      }
    } else {
      if (fn.constructor.name === 'AsyncFunction' && fn.length === 3) {
        throw new Error('Async function has too many arguments. Async hooks should not use the \'done\' argument.')
      }
    }

    if (name === 'onClose') {
      this.onClose(fn)
    } else if (name === 'onReady') {
      this[kHooks].add(name, fn)
    } else if (name === 'onRoute') {
      this[kHooks].validate(name, fn)
      this[kHooks].add(name, fn)
    } else {
      this.after((err, done) => {
        _addHook.call(this, name, fn)
        done(err)
      })
    }
    return this

    function _addHook (name, fn) {
      this[kHooks].add(name, fn)
      this[kChildren].forEach(child => _addHook.call(child, name, fn))
    }
  }

  // wrapper that we expose to the user for schemas handling
  function addSchema (schema) {
    throwIfAlreadyStarted('Cannot call "addSchema" when fastify instance is already started!')
    this[kSchemaController].add(schema)
    this[kChildren].forEach(child => child.addSchema(schema))
    return this
  }

  function defaultClientErrorHandler (err, socket) {
    // In case of a connection reset, the socket has been destroyed and there is nothing that needs to be done.
    // https://nodejs.org/api/http.html#http_event_clienterror
    if (err.code === 'ECONNRESET' || socket.destroyed) {
      return
    }

    const body = JSON.stringify({
      error: http.STATUS_CODES['400'],
      message: 'Client Error',
      statusCode: 400
    })

    // Most devs do not know what to do with this error.
    // In the vast majority of cases, it's a network error and/or some
    // config issue on the load balancer side.
    this.log.trace({ err }, 'client error')
    // Copying standard node behaviour
    // https://github.com/nodejs/node/blob/6ca23d7846cb47e84fd344543e394e50938540be/lib/_http_server.js#L666

    // If the socket is not writable, there is no reason to try to send data.
    if (socket.writable) {
      socket.write(`HTTP/1.1 400 Bad Request\r\nContent-Length: ${body.length}\r\nContent-Type: application/json\r\n\r\n${body}`)
    }
    socket.destroy(err)
  }

  // If the router does not match any route, every request will land here
  // req and res are Node.js core objects
  function defaultRoute (req, res) {
    if (req.headers['accept-version'] !== undefined) {
      // we remove the accept-version header for performance result
      // because we do not want to go through the constraint checking
      // the usage of symbol here to prevent any collision on custom header name
      req.headers[kRequestAcceptVersion] = req.headers['accept-version']
      req.headers['accept-version'] = undefined
    }
    fourOhFour.router.lookup(req, res)
  }

  function onBadUrl (path, req, res) {
    if (frameworkErrors) {
      const id = genReqId(req)
      const childLogger = logger.child({ reqId: id })

      childLogger.info({ req }, 'incoming request')

      const request = new Request(id, null, req, null, childLogger, onBadUrlContext)
      const reply = new Reply(res, request, childLogger)
      return frameworkErrors(new FST_ERR_BAD_URL(path), request, reply)
    }
    const body = `{"error":"Bad Request","message":"'${path}' is not a valid url component","statusCode":400}`
    res.writeHead(400, {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    })
    res.end(body)
  }

  function setNotFoundHandler (opts, handler) {
    throwIfAlreadyStarted('Cannot call "setNotFoundHandler" when fastify instance is already started!')

    fourOhFour.setNotFoundHandler.call(this, opts, handler, avvio, router.routeHandler)
    return this
  }

  function setValidatorCompiler (validatorCompiler) {
    throwIfAlreadyStarted('Cannot call "setValidatorCompiler" when fastify instance is already started!')
    this[kSchemaController].setValidatorCompiler(validatorCompiler)
    return this
  }

  function setSchemaErrorFormatter (errorFormatter) {
    throwIfAlreadyStarted('Cannot call "setSchemaErrorFormatter" when fastify instance is already started!')
    validateSchemaErrorFormatter(errorFormatter)
    this[kSchemaErrorFormatter] = errorFormatter.bind(this)
    return this
  }

  function setSerializerCompiler (serializerCompiler) {
    throwIfAlreadyStarted('Cannot call "setSerializerCompiler" when fastify instance is already started!')
    this[kSchemaController].setSerializerCompiler(serializerCompiler)
    return this
  }

  function setSchemaController (schemaControllerOpts) {
    throwIfAlreadyStarted('Cannot call "setSchemaController" when fastify instance is already started!')
    const old = this[kSchemaController]
    const schemaController = SchemaController.buildSchemaController(old, Object.assign({}, old.opts, schemaControllerOpts))
    this[kSchemaController] = schemaController
    this.getSchema = schemaController.getSchema.bind(schemaController)
    this.getSchemas = schemaController.getSchemas.bind(schemaController)
    return this
  }

  function setReplySerializer (replySerializer) {
    throwIfAlreadyStarted('Cannot call "setReplySerializer" when fastify instance is already started!')

    this[kReplySerializerDefault] = replySerializer
    return this
  }

  // wrapper that we expose to the user for configure the custom error handler
  function setErrorHandler (func) {
    throwIfAlreadyStarted('Cannot call "setErrorHandler" when fastify instance is already started!')

    this[kErrorHandler] = buildErrorHandler(this[kErrorHandler], func.bind(this))
    return this
  }

  function printRoutes (opts = {}) {
    // includeHooks:true - shortcut to include all supported hooks exported by fastify.Hooks
    opts.includeMeta = opts.includeHooks ? opts.includeMeta ? supportedHooks.concat(opts.includeMeta) : supportedHooks : opts.includeMeta
    return router.printRoutes(opts)
  }
}

function validateSchemaErrorFormatter (schemaErrorFormatter) {
  if (typeof schemaErrorFormatter !== 'function') {
    throw new Error(`schemaErrorFormatter option should be a function, instead got ${typeof schemaErrorFormatter}`)
  } else if (schemaErrorFormatter.constructor.name === 'AsyncFunction') {
    throw new Error('schemaErrorFormatter option should not be an async function')
  }
}

function wrapRouting (httpHandler, { rewriteUrl, logger }) {
  if (!rewriteUrl) {
    return httpHandler
  }
  return function preRouting (req, res) {
    const originalUrl = req.url
    const url = rewriteUrl(req)
    if (originalUrl !== url) {
      logger.debug({ originalUrl, url }, 'rewrite url')
      if (typeof url === 'string') {
        req.url = url
      } else {
        req.destroy(new Error(`Rewrite url for "${req.url}" needs to be of type "string" but received "${typeof url}"`))
      }
    }
    httpHandler(req, res)
  }
}

/**
 * These export configurations enable JS and TS developers
 * to consumer fastify in whatever way best suits their needs.
 * Some examples of supported import syntax includes:
 * - `const fastify = require('fastify')`
 * - `const { fastify } = require('fastify')`
 * - `import * as Fastify from 'fastify'`
 * - `import { fastify, TSC_definition } from 'fastify'`
 * - `import fastify from 'fastify'`
 * - `import fastify, { TSC_definition } from 'fastify'`
 */
module.exports = fastify
module.exports.fastify = fastify
module.exports["default"] = fastify


/***/ }),
/* 18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fastq = __webpack_require__(19)
const EE = (__webpack_require__(20).EventEmitter)
const inherits = (__webpack_require__(21).inherits)
const {
  AVV_ERR_EXPOSE_ALREADY_DEFINED,
  AVV_ERR_CALLBACK_NOT_FN,
  AVV_ERR_PLUGIN_NOT_VALID,
  AVV_ERR_ROOT_PLG_BOOTED,
  AVV_ERR_READY_TIMEOUT
} = __webpack_require__(22)
const TimeTree = __webpack_require__(23)
const Plugin = __webpack_require__(25)
const debug = __webpack_require__(26)('avvio')
const kAvvio = Symbol('kAvvio')
const kThenifyDoNotWrap = Symbol('kThenifyDoNotWrap')

function wrap (server, opts, instance) {
  const expose = opts.expose || {}
  const useKey = expose.use || 'use'
  const afterKey = expose.after || 'after'
  const readyKey = expose.ready || 'ready'
  const onCloseKey = expose.onClose || 'onClose'
  const closeKey = expose.close || 'close'

  if (server[useKey]) {
    throw new AVV_ERR_EXPOSE_ALREADY_DEFINED(useKey)
  }

  if (server[afterKey]) {
    throw new AVV_ERR_EXPOSE_ALREADY_DEFINED(afterKey)
  }

  if (server[readyKey]) {
    throw new AVV_ERR_EXPOSE_ALREADY_DEFINED(readyKey)
  }

  server[useKey] = function (fn, opts) {
    instance.use(fn, opts)
    return this
  }

  Object.defineProperty(server, 'then', { get: thenify.bind(instance) })
  server[kAvvio] = true

  server[afterKey] = function (func) {
    if (typeof func !== 'function') {
      return instance._loadRegistered()
    }
    instance.after(encapsulateThreeParam(func, this))
    return this
  }

  server[readyKey] = function (func) {
    if (func && typeof func !== 'function') {
      throw new AVV_ERR_CALLBACK_NOT_FN(readyKey, typeof func)
    }
    return instance.ready(func ? encapsulateThreeParam(func, this) : undefined)
  }

  server[onCloseKey] = function (func) {
    if (typeof func !== 'function') {
      throw new AVV_ERR_CALLBACK_NOT_FN(onCloseKey, typeof func)
    }
    instance.onClose(encapsulateTwoParam(func, this))
    return this
  }

  server[closeKey] = function (func) {
    if (func && typeof func !== 'function') {
      throw new AVV_ERR_CALLBACK_NOT_FN(closeKey, typeof func)
    }

    if (func) {
      instance.close(encapsulateThreeParam(func, this))
      return this
    }

    // this is a Promise
    return instance.close()
  }
}

function Boot (server, opts, done) {
  if (typeof server === 'function' && arguments.length === 1) {
    done = server
    opts = {}
    server = null
  }

  if (typeof opts === 'function') {
    done = opts
    opts = {}
  }

  opts = opts || {}

  if (!(this instanceof Boot)) {
    const instance = new Boot(server, opts, done)

    if (server) {
      wrap(server, opts, instance)
    }

    return instance
  }

  if (opts.autostart !== false) {
    opts.autostart = true
  }

  server = server || this

  this._timeout = Number(opts.timeout) || 0
  this._server = server
  this._current = []
  this._error = null
  this._isOnCloseHandlerKey = Symbol('isOnCloseHandler')
  this._lastUsed = null

  this.setMaxListeners(0)

  if (done) {
    this.once('start', done)
  }

  this.started = false
  this.booted = false
  this.pluginTree = new TimeTree()

  this._readyQ = fastq(this, callWithCbOrNextTick, 1)
  this._readyQ.pause()
  this._readyQ.drain = () => {
    this.emit('start')
    // nooping this, we want to emit start only once
    this._readyQ.drain = noop
  }

  this._closeQ = fastq(this, closeWithCbOrNextTick, 1)
  this._closeQ.pause()
  this._closeQ.drain = () => {
    this.emit('close')
    // nooping this, we want to emit close only once
    this._closeQ.drain = noop
  }

  this._doStart = null
  this._root = new Plugin(this, root.bind(this), opts, false, 0)
  this._root.once('start', (serverName, funcName, time) => {
    const nodeId = this.pluginTree.start(null, funcName, time)
    this._root.once('loaded', (serverName, funcName, time) => {
      this.pluginTree.stop(nodeId, time)
    })
  })

  Plugin.loadPlugin.call(this, this._root, (err) => {
    debug('root plugin ready')
    try {
      this.emit('preReady')
      this._root = null
    } catch (prereadyError) {
      err = err || this._error || prereadyError
    }

    if (err) {
      this._error = err
      if (this._readyQ.length() === 0) {
        throw err
      }
    } else {
      this.booted = true
    }
    this._readyQ.resume()
  })
}

function root (s, opts, done) {
  this._doStart = done
  if (opts.autostart) {
    this.start()
  }
}

inherits(Boot, EE)

Boot.prototype.start = function () {
  this.started = true

  // we need to wait any call to use() to happen
  process.nextTick(this._doStart)
  return this
}

// allows to override the instance of a server, given a plugin
Boot.prototype.override = function (server, func, opts) {
  return server
}

function assertPlugin (plugin) {
  // Faux modules are modules built with TypeScript
  // or Babel that they export a .default property.
  if (plugin && typeof plugin === 'object' && typeof plugin.default === 'function') {
    plugin = plugin.default
  }
  if (!(plugin && (typeof plugin === 'function' || typeof plugin.then === 'function'))) {
    throw new AVV_ERR_PLUGIN_NOT_VALID(typeof plugin)
  }
  return plugin
}

Boot.prototype[kAvvio] = true

// load a plugin
Boot.prototype.use = function (plugin, opts) {
  this._lastUsed = this._addPlugin(plugin, opts, false)
  return this
}

Boot.prototype._loadRegistered = function () {
  const plugin = this._current[0]
  const weNeedToStart = !this.started && !this.booted

  // if the root plugin is not loaded, let's resume that
  // so one can use after() befor calling ready
  if (weNeedToStart) {
    process.nextTick(() => this._root.q.resume())
  }

  if (!plugin) {
    return Promise.resolve()
  }

  return plugin.loadedSoFar()
}

Object.defineProperty(Boot.prototype, 'then', { get: thenify })

Boot.prototype._addPlugin = function (plugin, opts, isAfter) {
  plugin = assertPlugin(plugin)
  opts = opts || {}

  if (this.booted) {
    throw new AVV_ERR_ROOT_PLG_BOOTED()
  }

  // we always add plugins to load at the current element
  const current = this._current[0]

  const obj = new Plugin(this, plugin, opts, isAfter)
  obj.once('start', (serverName, funcName, time) => {
    const nodeId = this.pluginTree.start(current.name, funcName, time)
    obj.once('loaded', (serverName, funcName, time) => {
      this.pluginTree.stop(nodeId, time)
    })
  })

  if (current.loaded) {
    throw new Error(obj.name, current.name)
  }

  // we add the plugin to be loaded at the end of the current queue
  current.enqueue(obj, (err) => {
    if (err) {
      this._error = err
    }
  })

  return obj
}

Boot.prototype.after = function (func) {
  if (!func) {
    return this._loadRegistered()
  }

  this._addPlugin(_after.bind(this), {}, true)

  function _after (s, opts, done) {
    callWithCbOrNextTick.call(this, func, done)
  }

  return this
}

Boot.prototype.onClose = function (func) {
  // this is used to distinguish between onClose and close handlers
  // because they share the same queue but must be called with different signatures

  if (typeof func !== 'function') {
    throw new Error('not a function')
  }

  func[this._isOnCloseHandlerKey] = true
  this._closeQ.unshift(func, callback.bind(this))

  function callback (err) {
    if (err) this._error = err
  }

  return this
}

Boot.prototype.close = function (func) {
  let promise

  if (func) {
    if (typeof func !== 'function') {
      throw new AVV_ERR_CALLBACK_NOT_FN('close', typeof func)
    }
  } else {
    promise = new Promise(function (resolve, reject) {
      func = function (err) {
        if (err) {
          return reject(err)
        }
        resolve()
      }
    })
  }

  this.ready(() => {
    this._error = null
    this._closeQ.push(func)
    process.nextTick(this._closeQ.resume.bind(this._closeQ))
  })

  return promise
}

Boot.prototype.ready = function (func) {
  if (func) {
    if (typeof func !== 'function') {
      throw new AVV_ERR_CALLBACK_NOT_FN('ready', typeof func)
    }
    this._readyQ.push(func)
    queueMicrotask(this.start.bind(this))
    return
  }

  return new Promise((resolve, reject) => {
    this._readyQ.push(readyPromiseCB)
    this.start()

    /**
     * The `encapsulateThreeParam` let callback function
     * bind to the right server instance.
     * In promises we need to track the last server
     * instance loaded, the first one in the _current queue.
     */
    const relativeContext = this._current[0].server

    function readyPromiseCB (err, context, done) {
      // the context is always binded to the root server
      if (err) {
        reject(err)
      } else {
        resolve(relativeContext)
      }
      process.nextTick(done)
    }
  })
}

Boot.prototype.prettyPrint = function () {
  return this.pluginTree.prittyPrint()
}

Boot.prototype.toJSON = function () {
  return this.pluginTree.toJSON()
}

function noop () { }

function thenify () {
  // If the instance is ready, then there is
  // nothing to await. This is true during
  // await server.ready() as ready() resolves
  // with the server, end we will end up here
  // because of automatic promise chaining.
  if (this.booted) {
    debug('thenify returning null because we are already booted')
    return
  }

  // Calling resolve(this._server) would fetch the then
  // property on the server, which will lead it here.
  // If we do not break the recursion, we will loop
  // forever.
  if (this[kThenifyDoNotWrap]) {
    this[kThenifyDoNotWrap] = false
    return
  }

  debug('thenify')
  return (resolve, reject) => {
    const p = this._loadRegistered()
    return p.then(() => {
      this[kThenifyDoNotWrap] = true
      return resolve(this._server)
    }, reject)
  }
}

function callWithCbOrNextTick (func, cb, context) {
  context = this._server
  const err = this._error
  let res

  // with this the error will appear just in the next after/ready callback
  this._error = null
  if (func.length === 0) {
    this._error = err
    res = func()
    if (res && !res[kAvvio] && typeof res.then === 'function') {
      res.then(() => process.nextTick(cb), (e) => process.nextTick(cb, e))
    } else {
      process.nextTick(cb)
    }
  } else if (func.length === 1) {
    res = func(err)
    if (res && !res[kAvvio] && typeof res.then === 'function') {
      res.then(() => process.nextTick(cb), (e) => process.nextTick(cb, e))
    } else {
      process.nextTick(cb)
    }
  } else {
    if (this._timeout === 0) {
      if (func.length === 2) {
        func(err, cb)
      } else {
        func(err, context, cb)
      }
    } else {
      timeoutCall.call(this, func, err, context, cb)
    }
  }
}

function timeoutCall (func, rootErr, context, cb) {
  const name = func.name
  debug('setting up ready timeout', name, this._timeout)
  let timer = setTimeout(() => {
    debug('timed out', name)
    timer = null
    const toutErr = new AVV_ERR_READY_TIMEOUT(name)
    toutErr.fn = func
    this._error = toutErr
    cb(toutErr)
  }, this._timeout)

  if (func.length === 2) {
    func(rootErr, timeoutCb.bind(this))
  } else {
    func(rootErr, context, timeoutCb.bind(this))
  }

  function timeoutCb (err) {
    if (timer) {
      clearTimeout(timer)
      this._error = err
      cb(this._error)
    } else {
      // timeout has been triggered
      // can not call cb twice
    }
  }
}

function closeWithCbOrNextTick (func, cb, context) {
  context = this._server
  const isOnCloseHandler = func[this._isOnCloseHandlerKey]
  if (func.length === 0 || func.length === 1) {
    let promise
    if (isOnCloseHandler) {
      promise = func(context)
    } else {
      promise = func(this._error)
    }
    if (promise && typeof promise.then === 'function') {
      debug('resolving close/onClose promise')
      promise.then(
        () => process.nextTick(cb),
        (e) => process.nextTick(cb, e))
    } else {
      process.nextTick(cb)
    }
  } else if (func.length === 2) {
    if (isOnCloseHandler) {
      func(context, cb)
    } else {
      func(this._error, cb)
    }
  } else {
    if (isOnCloseHandler) {
      func(context, cb)
    } else {
      func(this._error, context, cb)
    }
  }
}

function encapsulateTwoParam (func, that) {
  return _encapsulateTwoParam.bind(that)
  function _encapsulateTwoParam (context, cb) {
    let res
    if (func.length === 0) {
      res = func()
      if (res && res.then) {
        res.then(function () {
          process.nextTick(cb)
        }, cb)
      } else {
        process.nextTick(cb)
      }
    } else if (func.length === 1) {
      res = func(this)

      if (res && res.then) {
        res.then(function () {
          process.nextTick(cb)
        }, cb)
      } else {
        process.nextTick(cb)
      }
    } else {
      func(this, cb)
    }
  }
}

function encapsulateThreeParam (func, that) {
  return _encapsulateThreeParam.bind(that)
  function _encapsulateThreeParam (err, cb) {
    let res
    if (!func) {
      process.nextTick(cb)
    } else if (func.length === 0) {
      res = func()
      if (res && res.then) {
        res.then(function () {
          process.nextTick(cb, err)
        }, cb)
      } else {
        process.nextTick(cb, err)
      }
    } else if (func.length === 1) {
      res = func(err)
      if (res && res.then) {
        res.then(function () {
          process.nextTick(cb)
        }, cb)
      } else {
        process.nextTick(cb)
      }
    } else if (func.length === 2) {
      func(err, cb)
    } else {
      func(err, this, cb)
    }
  }
}

module.exports = Boot
module.exports.express = function (app) {
  return Boot(app, {
    expose: {
      use: 'load'
    }
  })
}


/***/ }),
/* 19 */
/***/ ((module) => {

"use strict";
module.exports = require("fastq");

/***/ }),
/* 20 */
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),
/* 21 */
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),
/* 22 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// Code inherited from fastify-error
const { inherits, format } = __webpack_require__(21)

function createError (code, message, Base = Error) {
  if (!code) throw new Error('Avvio error code must not be empty')
  if (!message) throw new Error('Avvio base error message must not be empty')

  function AvvioError (a, b, c) {
    if (!(this instanceof AvvioError)) {
      return new AvvioError(a, b, c)
    }

    Error.captureStackTrace(this, AvvioError)

    this.code = code
    this.message = message
    this.name = 'AvvioError'

    // more performant than spread (...) operator
    if (a && b && c) {
      this.message = format(message, a, b, c)
    } else if (a && b) {
      this.message = format(message, a, b)
    } else if (a) {
      this.message = format(message, a)
    } else {
      this.message = message
    }
  }

  AvvioError.prototype[Symbol.toStringTag] = 'Error'
  AvvioError.prototype.toString = function () {
    return `${this.name} [${this.code}]: ${this.message}`
  }

  inherits(AvvioError, Base)

  return AvvioError
}

module.exports = {
  createError,
  AVV_ERR_EXPOSE_ALREADY_DEFINED: createError(
    'AVV_ERR_EXPOSE_ALREADY_DEFINED',
    "'%s' () is already defined, specify an expose option"
  ),
  AVV_ERR_CALLBACK_NOT_FN: createError(
    'AVV_ERR_CALLBACK_NOT_FN',
    "Callback for '%s' hook is not a function. Received: '%s'"
  ),
  AVV_ERR_PLUGIN_NOT_VALID: createError(
    'AVV_ERR_PLUGIN_NOT_VALID',
    "Plugin must be a function or a promise. Received: '%s'"
  ),
  AVV_ERR_ROOT_PLG_BOOTED: createError(
    'AVV_ERR_PLUGIN_NOT_VALID',
    'Root plugin has already booted'
  ),
  AVV_ERR_PARENT_PLG_LOADED: createError(
    'AVV_ERR_PARENT_PLG_LOADED',
    "Impossible to load '%s' plugin because the parent '%s' was already loaded"
  ),
  AVV_ERR_READY_TIMEOUT: createError(
    'AVV_ERR_READY_TIMEOUT',
    "Plugin did not start in time: '%s'. You may have forgotten to call 'done' function or to resolve a Promise"
  )
}


/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const archy = __webpack_require__(24)

const kUntrackNode = Symbol('avvio.TimeTree.untrackNode')
const kTrackNode = Symbol('avvio.TimeTree.trackNode')
const kGetParent = Symbol('avvio.TimeTree.getParent')
const kGetNode = Symbol('avvio.TimeTree.getNode')
const kAddNode = Symbol('avvio.TimeTree.addNode')

class TimeTree {
  constructor () {
    this.root = null
    this.tableId = new Map()
    this.tableLabel = new Map()
  }

  [kTrackNode] (node) {
    this.tableId.set(node.id, node)
    if (this.tableLabel.has(node.label)) {
      this.tableLabel.get(node.label).push(node)
    } else {
      this.tableLabel.set(node.label, [node])
    }
  }

  [kUntrackNode] (node) {
    this.tableId.delete(node.id)

    const labelNode = this.tableLabel.get(node.label)
    if (labelNode.id) {
      this.tableLabel.delete(node.label)
      return
    }
    labelNode.pop()

    if (labelNode.length === 0) {
      this.tableLabel.delete(node.label)
    }
  }

  [kGetParent] (parent) {
    if (parent === null) {
      return this.root
    }

    const parentNode = this.tableLabel.get(parent)
    if (parentNode.id) {
      return parentNode
    }
    return parentNode[parentNode.length - 1]
  }

  [kGetNode] (nodeId) {
    return this.tableId.get(nodeId)
  }

  [kAddNode] (parent, childName, start) {
    const isRoot = parent === null
    if (isRoot) {
      this.root = {
        id: 'root',
        label: childName,
        start,
        nodes: []
      }
      this[kTrackNode](this.root)
      return this.root.id
    }

    const parentNode = this[kGetParent](parent)
    const nodeId = `${childName}-${Math.random()}`
    const childNode = {
      id: nodeId,
      parent,
      start,
      label: childName,
      nodes: []
    }
    parentNode.nodes.push(childNode)
    this[kTrackNode](childNode)
    return nodeId
  }

  start (parent, childName, start = Date.now()) {
    return this[kAddNode](parent, childName, start)
  }

  stop (nodeId, stop = Date.now()) {
    const node = this[kGetNode](nodeId)
    if (node) {
      node.stop = stop
      node.diff = (node.stop - node.start) || 0
      this[kUntrackNode](node)
    }
  }

  toJSON () {
    return Object.assign({}, this.root)
  }

  prittyPrint () {
    const decorateText = (node) => {
      node.label = `${node.label} ${node.diff} ms`
      if (node.nodes.length > 0) {
        node.nodes = node.nodes.map(_ => decorateText(_))
      }
      return node
    }
    const out = decorateText(this.toJSON())
    return archy(out)
  }
}

module.exports = TimeTree


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = function archy (obj, prefix, opts) {
    if (prefix === undefined) prefix = '';
    if (!opts) opts = {};
    var chr = function (s) {
        var chars = {
            '│' : '|',
            '└' : '`',
            '├' : '+',
            '─' : '-',
            '┬' : '-'
        };
        return opts.unicode === false ? chars[s] : s;
    };
    
    if (typeof obj === 'string') obj = { label : obj };
    
    var nodes = obj.nodes || [];
    var lines = (obj.label || '').split('\n');
    var splitter = '\n' + prefix + (nodes.length ? chr('│') : ' ') + ' ';
    
    return prefix
        + lines.join(splitter) + '\n'
        + nodes.map(function (node, ix) {
            var last = ix === nodes.length - 1;
            var more = node.nodes && node.nodes.length;
            var prefix_ = prefix + (last ? ' ' : chr('│')) + ' ';
            
            return prefix
                + (last ? chr('└') : chr('├')) + chr('─')
                + (more ? chr('┬') : chr('─')) + ' '
                + archy(node, prefix_, opts).slice(prefix.length + 2)
            ;
        }).join('')
    ;
};


/***/ }),
/* 25 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fastq = __webpack_require__(19)
const EE = (__webpack_require__(20).EventEmitter)
const inherits = (__webpack_require__(21).inherits)
const debug = __webpack_require__(26)('avvio')
const { AVV_ERR_READY_TIMEOUT } = __webpack_require__(22)

// this symbol is assigned by fastify-plugin
const kPluginMeta = Symbol.for('plugin-meta')

function getName (func, optsOrFunc) {
  // use explicit function metadata if set
  if (func[kPluginMeta] && func[kPluginMeta].name) {
    return func[kPluginMeta].name
  }

  if (typeof optsOrFunc !== 'undefined' && typeof optsOrFunc !== 'function' && optsOrFunc.name) {
    return optsOrFunc.name
  }

  // use the function name if it exists
  if (func.name) {
    return func.name
  }

  // takes the first two lines of the function if nothing else works
  return func.toString().split('\n').slice(0, 2).map(s => s.trim()).join(' -- ')
}

function promise () {
  const obj = {}

  obj.promise = new Promise((resolve, reject) => {
    obj.resolve = resolve
    obj.reject = reject
  })

  return obj
}

function Plugin (parent, func, optsOrFunc, isAfter, timeout) {
  this.started = false
  this.func = func
  this.opts = optsOrFunc
  this.onFinish = null
  this.parent = parent
  this.timeout = timeout === undefined ? parent._timeout : timeout
  this.name = getName(func, optsOrFunc)
  this.isAfter = isAfter
  this.q = fastq(parent, loadPluginNextTick, 1)
  this.q.pause()
  this._error = null
  this.loaded = false
  this._promise = null

  // always start the queue in the next tick
  // because we try to attach subsequent call to use()
  // to the right plugin. we need to defer them,
  // or they will end up at the top of _current
}

inherits(Plugin, EE)

Plugin.prototype.exec = function (server, cb) {
  const func = this.func
  let completed = false
  const name = this.name

  if (this.parent._error && !this.isAfter) {
    debug('skipping loading of plugin as parent errored and it is not an after', name)
    process.nextTick(cb)
    return
  }

  if (!this.isAfter) {
    // Skip override for after
    try {
      this.server = this.parent.override(server, func, this.opts)
    } catch (err) {
      debug('override errored', name)
      return cb(err)
    }
  } else {
    this.server = server
  }

  this.opts = typeof this.opts === 'function' ? this.opts(this.server) : this.opts

  debug('exec', name)

  let timer

  const done = (err) => {
    if (completed) {
      debug('loading complete', name)
      return
    }

    this._error = err

    if (err) {
      debug('exec errored', name)
    } else {
      debug('exec completed', name)
    }

    completed = true

    if (timer) {
      clearTimeout(timer)
    }

    cb(err)
  }

  if (this.timeout > 0) {
    debug('setting up timeout', name, this.timeout)
    timer = setTimeout(function () {
      debug('timed out', name)
      timer = null
      const err = new AVV_ERR_READY_TIMEOUT(name)
      err.fn = func
      done(err)
    }, this.timeout)
  }

  this.started = true
  this.emit('start', this.server ? this.server.name : null, this.name, Date.now())
  const promise = func(this.server, this.opts, done)

  if (promise && typeof promise.then === 'function') {
    debug('exec: resolving promise', name)

    promise.then(
      () => process.nextTick(done),
      (e) => process.nextTick(done, e))
  }
}

Plugin.prototype.loadedSoFar = function () {
  if (this.loaded) {
    return Promise.resolve()
  }

  const setup = () => {
    this.server.after((err, cb) => {
      this._error = err
      this.q.pause()

      if (err) {
        debug('rejecting promise', this.name, err)
        this._promise.reject(err)
      } else {
        debug('resolving promise', this.name)
        this._promise.resolve()
      }
      this._promise = null

      process.nextTick(cb, err)
    })
    this.q.resume()
  }

  let res

  if (!this._promise) {
    this._promise = promise()
    res = this._promise.promise

    if (!this.server) {
      this.on('start', setup)
    } else {
      setup()
    }
  } else {
    res = Promise.resolve()
  }

  return res
}

Plugin.prototype.enqueue = function (obj, cb) {
  debug('enqueue', this.name, obj.name)
  this.emit('enqueue', this.server ? this.server.name : null, this.name, Date.now())
  this.q.push(obj, cb)
}

Plugin.prototype.finish = function (err, cb) {
  debug('finish', this.name, err)
  const done = () => {
    if (this.loaded) {
      return
    }

    debug('loaded', this.name)
    this.emit('loaded', this.server ? this.server.name : null, this.name, Date.now())
    this.loaded = true

    cb(err)
  }

  if (err) {
    if (this._promise) {
      this._promise.reject(err)
      this._promise = null
    }
    done()
    return
  }

  const check = () => {
    debug('check', this.name, this.q.length(), this.q.running(), this._promise)
    if (this.q.length() === 0 && this.q.running() === 0) {
      if (this._promise) {
        const wrap = () => {
          debug('wrap')
          queueMicrotask(check)
        }
        this._promise.resolve()
        this._promise.promise.then(wrap, wrap)
        this._promise = null
      } else {
        done()
      }
    } else {
      debug('delayed', this.name)
      // finish when the queue of nested plugins to load is empty
      this.q.drain = () => {
        debug('drain', this.name)
        this.q.drain = noop

        // we defer the check, as a safety net for things
        // that might be scheduled in the loading callback
        queueMicrotask(check)
      }
    }
  }

  queueMicrotask(check)

  // we start loading the dependents plugins only once
  // the current level is finished
  this.q.resume()
}

// delays plugin loading until the next tick to ensure any bound `_after` callbacks have a chance
// to run prior to executing the next plugin
function loadPluginNextTick (toLoad, cb) {
  const parent = this
  process.nextTick(loadPlugin.bind(parent), toLoad, cb)
}

// loads a plugin
function loadPlugin (toLoad, cb) {
  if (typeof toLoad.func.then === 'function') {
    toLoad.func.then((fn) => {
      if (typeof fn.default === 'function') {
        fn = fn.default
      }
      toLoad.func = fn
      loadPlugin.call(this, toLoad, cb)
    }, cb)
    return
  }

  const last = this._current[0]

  // place the plugin at the top of _current
  this._current.unshift(toLoad)

  toLoad.exec((last && last.server) || this._server, (err) => {
    toLoad.finish(err, (err) => {
      this._current.shift()
      cb(err)
    })
  })
}

function noop () {}

module.exports = Plugin
module.exports.loadPlugin = loadPlugin


/***/ }),
/* 26 */
/***/ ((module) => {

"use strict";
module.exports = require("debug");

/***/ }),
/* 27 */
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),
/* 28 */
/***/ ((module) => {

"use strict";


const keys = {
  kAvvioBoot: Symbol('fastify.avvioBoot'),
  kChildren: Symbol('fastify.children'),
  kServerBindings: Symbol('fastify.serverBindings'),
  kBodyLimit: Symbol('fastify.bodyLimit'),
  kRoutePrefix: Symbol('fastify.routePrefix'),
  kLogLevel: Symbol('fastify.logLevel'),
  kLogSerializers: Symbol('fastify.logSerializers'),
  kHooks: Symbol('fastify.hooks'),
  kContentTypeParser: Symbol('fastify.contentTypeParser'),
  kState: Symbol('fastify.state'),
  kOptions: Symbol('fastify.options'),
  kDisableRequestLogging: Symbol('fastify.disableRequestLogging'),
  kPluginNameChain: Symbol('fastify.pluginNameChain'),
  // Schema
  kSchemaController: Symbol('fastify.schemaController'),
  kSchemaHeaders: Symbol('headers-schema'),
  kSchemaParams: Symbol('params-schema'),
  kSchemaQuerystring: Symbol('querystring-schema'),
  kSchemaBody: Symbol('body-schema'),
  kSchemaResponse: Symbol('response-schema'),
  kSchemaErrorFormatter: Symbol('fastify.schemaErrorFormatter'),
  kSchemaVisited: Symbol('fastify.schemas.visited'),
  // Request
  kRequest: Symbol('fastify.Request'),
  kRequestValidateFns: Symbol('fastify.request.cache.validateFns'),
  kRequestPayloadStream: Symbol('fastify.RequestPayloadStream'),
  kRequestAcceptVersion: Symbol('fastify.RequestAcceptVersion'),
  // 404
  kFourOhFour: Symbol('fastify.404'),
  kCanSetNotFoundHandler: Symbol('fastify.canSetNotFoundHandler'),
  kFourOhFourLevelInstance: Symbol('fastify.404LogLevelInstance'),
  kFourOhFourContext: Symbol('fastify.404ContextKey'),
  kDefaultJsonParse: Symbol('fastify.defaultJSONParse'),
  // Reply
  kReply: Symbol('fastify.Reply'),
  kReplySerializer: Symbol('fastify.reply.serializer'),
  kReplyIsError: Symbol('fastify.reply.isError'),
  kReplyHeaders: Symbol('fastify.reply.headers'),
  kReplyTrailers: Symbol('fastify.reply.trailers'),
  kReplyHasStatusCode: Symbol('fastify.reply.hasStatusCode'),
  kReplyHijacked: Symbol('fastify.reply.hijacked'),
  kReplyStartTime: Symbol('fastify.reply.startTime'),
  kReplyNextErrorHandler: Symbol('fastify.reply.nextErrorHandler'),
  kReplyEndTime: Symbol('fastify.reply.endTime'),
  kReplyErrorHandlerCalled: Symbol('fastify.reply.errorHandlerCalled'),
  kReplyIsRunningOnErrorHook: Symbol('fastify.reply.isRunningOnErrorHook'),
  kReplySerializerDefault: Symbol('fastify.replySerializerDefault'),
  kReplySerializeWeakMap: Symbol('fastify.reply.cache.serializeFns'),
  // This symbol is only meant to be used for fastify tests and should not be used for any other purpose
  kTestInternals: Symbol('fastify.testInternals'),
  kErrorHandler: Symbol('fastify.errorHandler'),
  kHasBeenDecorated: Symbol('fastify.hasBeenDecorated'),
  kKeepAliveConnections: Symbol('fastify.keepAliveConnections'),
  kRouteByFastify: Symbol('fastify.routeByFastify')
}

module.exports = keys


/***/ }),
/* 29 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const http = __webpack_require__(27)
const https = __webpack_require__(30)
const dns = __webpack_require__(31)

const warnings = __webpack_require__(32)
const { kState, kOptions, kServerBindings } = __webpack_require__(28)
const { FST_ERR_HTTP2_INVALID_VERSION, FST_ERR_REOPENED_CLOSE_SERVER, FST_ERR_REOPENED_SERVER } = __webpack_require__(34)

module.exports.createServer = createServer
module.exports.compileValidateHTTPVersion = compileValidateHTTPVersion

function createServer (options, httpHandler) {
  const server = getServerInstance(options, httpHandler)

  return { server, listen }

  // `this` is the Fastify object
  function listen (listenOptions, ...args) {
    let cb = args.slice(-1).pop()
    // When the variadic signature deprecation is complete, the function
    // declaration should become:
    //   function listen (listenOptions = { port: 0, host: 'localhost' }, cb = undefined)
    // Upon doing so, the `normalizeListenArgs` function is no longer needed,
    // and all of this preamble to feed it correctly also no longer needed.
    const firstArgType = Object.prototype.toString.call(arguments[0])
    if (arguments.length === 0) {
      listenOptions = normalizeListenArgs([])
    } else if (arguments.length > 0 && (firstArgType !== '[object Object]' && firstArgType !== '[object Function]')) {
      warnings.emit('FSTDEP011')
      listenOptions = normalizeListenArgs(Array.from(arguments))
      cb = listenOptions.cb
    } else if (args.length > 1) {
      // `.listen(obj, a, ..., n, callback )`
      warnings.emit('FSTDEP011')
      // Deal with `.listen(port, host, backlog, [cb])`
      const hostPath = listenOptions.path ? [listenOptions.path] : [listenOptions.port ?? 0, listenOptions.host ?? 'localhost']
      Object.assign(listenOptions, normalizeListenArgs([...hostPath, ...args]))
    } else {
      listenOptions.cb = cb
    }

    // If we have a path specified, don't default host to 'localhost' so we don't end up listening
    // on both path and host
    // See https://github.com/fastify/fastify/issues/4007
    let host
    if (listenOptions.path == null) {
      host = listenOptions.host ?? 'localhost'
    } else {
      host = listenOptions.host
    }
    if (Object.prototype.hasOwnProperty.call(listenOptions, 'host') === false) {
      listenOptions.host = host
    }

    if (host === 'localhost') {
      listenOptions.cb = (err, address) => {
        if (err) {
          // the server did not start
          cb(err, address)
          return
        }

        multipleBindings.call(this, server, httpHandler, options, listenOptions, () => {
          this[kState].listening = true
          cb(null, address)
        })
      }
    }

    // https://github.com/nodejs/node/issues/9390
    // If listening to 'localhost', listen to both 127.0.0.1 or ::1 if they are available.
    // If listening to 127.0.0.1, only listen to 127.0.0.1.
    // If listening to ::1, only listen to ::1.

    if (cb === undefined) {
      const listening = listenPromise.call(this, server, listenOptions)
      /* istanbul ignore else */
      if (host === 'localhost') {
        return listening.then(address => {
          return new Promise((resolve, reject) => {
            multipleBindings.call(this, server, httpHandler, options, listenOptions, () => {
              this[kState].listening = true
              resolve(address)
            })
          })
        })
      }
      return listening
    }

    this.ready(listenCallback.call(this, server, listenOptions))
  }
}

function multipleBindings (mainServer, httpHandler, serverOpts, listenOptions, onListen) {
  // the main server is started, we need to start the secondary servers
  this[kState].listening = false

  // let's check if we need to bind additional addresses
  dns.lookup(listenOptions.host, { all: true }, (dnsErr, addresses) => {
    if (dnsErr) {
      // not blocking the main server listening
      // this.log.warn('dns.lookup error:', dnsErr)
      onListen()
      return
    }

    let binding = 0
    let binded = 0
    const primaryAddress = mainServer.address()
    for (const adr of addresses) {
      if (adr.address !== primaryAddress.address) {
        binding++
        const secondaryOpts = Object.assign({}, listenOptions, {
          host: adr.address,
          port: primaryAddress.port,
          cb: (_ignoreErr) => {
            binded++

            if (!_ignoreErr) {
              this[kServerBindings].push(secondaryServer)
            }

            if (binded === binding) {
              // regardless of the error, we are done
              onListen()
            }
          }
        })

        const secondaryServer = getServerInstance(serverOpts, httpHandler)
        const closeSecondary = () => { secondaryServer.close(() => {}) }
        secondaryServer.on('upgrade', mainServer.emit.bind(mainServer, 'upgrade'))
        mainServer.on('unref', closeSecondary)
        mainServer.on('close', closeSecondary)
        mainServer.on('error', closeSecondary)
        listenCallback.call(this, secondaryServer, secondaryOpts)()
      }
    }

    // no extra bindings are necessary
    if (binding === 0) {
      onListen()
      return
    }

    // in test files we are using unref so we need to propagate the unref event
    // to the secondary servers. It is valid only when the user is
    // listening on localhost
    const originUnref = mainServer.unref
    /* istanbul ignore next */
    mainServer.unref = function () {
      originUnref.call(mainServer)
      mainServer.emit('unref')
    }
  })
}

function listenCallback (server, listenOptions) {
  const wrap = (err) => {
    server.removeListener('error', wrap)
    if (!err) {
      const address = logServerAddress.call(this, server)
      listenOptions.cb(null, address)
    } else {
      this[kState].listening = false
      listenOptions.cb(err, null)
    }
  }

  return (err) => {
    if (err != null) return listenOptions.cb(err)

    if (this[kState].listening && this[kState].closing) {
      return listenOptions.cb(new FST_ERR_REOPENED_CLOSE_SERVER(), null)
    } else if (this[kState].listening) {
      return listenOptions.cb(new FST_ERR_REOPENED_SERVER(), null)
    }

    server.once('error', wrap)
    server.listen(listenOptions, wrap)

    this[kState].listening = true
  }
}

function listenPromise (server, listenOptions) {
  if (this[kState].listening && this[kState].closing) {
    return Promise.reject(new FST_ERR_REOPENED_CLOSE_SERVER())
  } else if (this[kState].listening) {
    return Promise.reject(new FST_ERR_REOPENED_SERVER())
  }

  return this.ready().then(() => {
    let errEventHandler
    const errEvent = new Promise((resolve, reject) => {
      errEventHandler = (err) => {
        this[kState].listening = false
        reject(err)
      }
      server.once('error', errEventHandler)
    })
    const listen = new Promise((resolve, reject) => {
      server.listen(listenOptions, () => {
        server.removeListener('error', errEventHandler)
        resolve(logServerAddress.call(this, server))
      })
      // we set it afterwards because listen can throw
      this[kState].listening = true
    })

    return Promise.race([
      errEvent, // e.g invalid port range error is always emitted before the server listening
      listen
    ])
  })
}

/**
 * Creates a function that, based upon initial configuration, will
 * verify that every incoming request conforms to allowed
 * HTTP versions for the Fastify instance, e.g. a Fastify HTTP/1.1
 * server will not serve HTTP/2 requests upon the result of the
 * verification function.
 *
 * @param {object} options fastify option
 * @param {function} [options.serverFactory] If present, the
 * validator function will skip all checks.
 * @param {boolean} [options.http2 = false] If true, the validator
 * function will allow HTTP/2 requests.
 * @param {object} [options.https = null] https server options
 * @param {boolean} [options.https.allowHTTP1] If true and use
 * with options.http2 the validator function will allow HTTP/1
 * request to http2 server.
 *
 * @returns {function} HTTP version validator function.
 */
function compileValidateHTTPVersion (options) {
  let bypass = false
  // key-value map to store valid http version
  const map = new Map()
  if (options.serverFactory) {
    // When serverFactory is passed, we cannot identify how to check http version reliably
    // So, we should skip the http version check
    bypass = true
  }
  if (options.http2) {
    // HTTP2 must serve HTTP/2.0
    map.set('2.0', true)
    if (options.https && options.https.allowHTTP1 === true) {
      // HTTP2 with HTTPS.allowHTTP1 allow fallback to HTTP/1.1 and HTTP/1.0
      map.set('1.1', true)
      map.set('1.0', true)
    }
  } else {
    // HTTP must server HTTP/1.1 and HTTP/1.0
    map.set('1.1', true)
    map.set('1.0', true)
  }
  // The compiled function here placed in one of the hottest path inside fastify
  // the implementation here must be as performant as possible
  return function validateHTTPVersion (httpVersion) {
    // `bypass` skip the check when custom server factory provided
    // `httpVersion in obj` check for the valid http version we should support
    return bypass || map.has(httpVersion)
  }
}

function getServerInstance (options, httpHandler) {
  let server = null
  if (options.serverFactory) {
    server = options.serverFactory(httpHandler, options)
  } else if (options.http2) {
    if (options.https) {
      server = http2().createSecureServer(options.https, httpHandler)
    } else {
      server = http2().createServer(httpHandler)
    }
    server.on('session', sessionTimeout(options.http2SessionTimeout))
  } else {
    // this is http1
    if (options.https) {
      server = https.createServer(options.https, httpHandler)
    } else {
      server = http.createServer(httpHandler)
    }
    server.keepAliveTimeout = options.keepAliveTimeout
    server.requestTimeout = options.requestTimeout
    // we treat zero as null
    // and null is the default setting from nodejs
    // so we do not pass the option to server
    if (options.maxRequestsPerSocket > 0) {
      server.maxRequestsPerSocket = options.maxRequestsPerSocket
    }
  }

  if (!options.serverFactory) {
    server.setTimeout(options.connectionTimeout)
  }
  return server
}

function normalizeListenArgs (args) {
  if (args.length === 0) {
    return { port: 0, host: 'localhost' }
  }

  const cb = typeof args[args.length - 1] === 'function' ? args.pop() : undefined
  const options = { cb }

  const firstArg = args[0]
  const argsLength = args.length
  const lastArg = args[argsLength - 1]
  if (typeof firstArg === 'string' && isNaN(firstArg)) {
    /* Deal with listen (pipe[, backlog]) */
    options.path = firstArg
    options.backlog = argsLength > 1 ? lastArg : undefined
  } else {
    /* Deal with listen ([port[, host[, backlog]]]) */
    options.port = argsLength >= 1 && Number.isInteger(firstArg) ? firstArg : normalizePort(firstArg)
    // This will listen to what localhost is.
    // It can be 127.0.0.1 or ::1, depending on the operating system.
    // Fixes https://github.com/fastify/fastify/issues/1022.
    options.host = argsLength >= 2 && args[1] ? args[1] : 'localhost'
    options.backlog = argsLength >= 3 ? args[2] : undefined
  }

  return options
}

function normalizePort (firstArg) {
  const port = parseInt(firstArg, 10)
  return port >= 0 && !Number.isNaN(port) ? port : 0
}

function logServerAddress (server) {
  let address = server.address()
  const isUnixSocket = typeof address === 'string'
  /* istanbul ignore next */
  if (!isUnixSocket) {
    if (address.address.indexOf(':') === -1) {
      address = address.address + ':' + address.port
    } else {
      address = '[' + address.address + ']:' + address.port
    }
  }
  /* istanbul ignore next */
  address = (isUnixSocket ? '' : ('http' + (this[kOptions].https ? 's' : '') + '://')) + address

  this.log.info('Server listening at ' + address)
  return address
}

function http2 () {
  try {
    return __webpack_require__(36)
  } catch (err) {
    throw new FST_ERR_HTTP2_INVALID_VERSION()
  }
}

function sessionTimeout (timeout) {
  return function (session) {
    session.setTimeout(timeout, close)
  }
}

function close () {
  this.close()
}


/***/ }),
/* 30 */
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),
/* 31 */
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),
/* 32 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const warning = __webpack_require__(33)()

/**
 * Deprecation codes:
 *   - FSTDEP005
 */

warning.create('FastifyDeprecation', 'FSTDEP005', 'You are accessing the deprecated "request.connection" property. Use "request.socket" instead.')

warning.create('FastifyDeprecation', 'FSTDEP006', 'You are decorating Request/Reply with a reference type. This reference is shared amongst all requests. Use onRequest hook instead. Property: %s')

warning.create('FastifyDeprecation', 'FSTDEP007', 'You are trying to set a HEAD route using "exposeHeadRoute" route flag when a sibling route is already set. See documentation for more info.')

warning.create('FastifyDeprecation', 'FSTDEP008', 'You are using route constraints via the route { version: "..." } option, use { constraints: { version: "..." } } option instead.')

warning.create('FastifyDeprecation', 'FSTDEP009', 'You are using a custom route versioning strategy via the server { versioning: "..." } option, use { constraints: { version: "..." } } option instead.')

warning.create('FastifyDeprecation', 'FSTDEP010', 'Modifying the "reply.sent" property is deprecated. Use the "reply.hijack()" method instead.')

warning.create('FastifyDeprecation', 'FSTDEP011', 'Variadic listen method is deprecated. Please use ".listen(optionsObject)" instead. The variadic signature will be removed in `fastify@5`.')

module.exports = warning


/***/ }),
/* 33 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { format } = __webpack_require__(21)

function build () {
  const codes = {}
  const emitted = new Map()

  function create (name, code, message) {
    if (!name) throw new Error('Warning name must not be empty')
    if (!code) throw new Error('Warning code must not be empty')
    if (!message) throw new Error('Warning message must not be empty')

    code = code.toUpperCase()

    if (codes[code] !== undefined) {
      throw new Error(`The code '${code}' already exist`)
    }

    function buildWarnOpts (a, b, c) {
      // more performant than spread (...) operator
      let formatted
      if (a && b && c) {
        formatted = format(message, a, b, c)
      } else if (a && b) {
        formatted = format(message, a, b)
      } else if (a) {
        formatted = format(message, a)
      } else {
        formatted = message
      }

      return {
        code,
        name,
        message: formatted
      }
    }

    emitted.set(code, false)
    codes[code] = buildWarnOpts

    return codes[code]
  }

  function emit (code, a, b, c) {
    if (codes[code] === undefined) throw new Error(`The code '${code}' does not exist`)
    if (emitted.get(code) === true) return
    emitted.set(code, true)

    const warning = codes[code](a, b, c)
    process.emitWarning(warning.message, warning.name, warning.code)
  }

  return {
    create,
    emit,
    emitted
  }
}

module.exports = build


/***/ }),
/* 34 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const createError = __webpack_require__(35)
const codes = {
  /**
   * Basic
   */
  FST_ERR_NOT_FOUND: createError(
    'FST_ERR_NOT_FOUND',
    'Not Found',
    404
  ),

  /**
   * ContentTypeParser
  */
  FST_ERR_CTP_ALREADY_PRESENT: createError(
    'FST_ERR_CTP_ALREADY_PRESENT',
    "Content type parser '%s' already present."
  ),
  FST_ERR_CTP_INVALID_TYPE: createError(
    'FST_ERR_CTP_INVALID_TYPE',
    'The content type should be a string or a RegExp',
    500,
    TypeError
  ),
  FST_ERR_CTP_EMPTY_TYPE: createError(
    'FST_ERR_CTP_EMPTY_TYPE',
    'The content type cannot be an empty string',
    500,
    TypeError
  ),
  FST_ERR_CTP_INVALID_HANDLER: createError(
    'FST_ERR_CTP_INVALID_HANDLER',
    'The content type handler should be a function',
    500,
    TypeError
  ),
  FST_ERR_CTP_INVALID_PARSE_TYPE: createError(
    'FST_ERR_CTP_INVALID_PARSE_TYPE',
    "The body parser can only parse your data as 'string' or 'buffer', you asked '%s' which is not supported.",
    500,
    TypeError
  ),
  FST_ERR_CTP_BODY_TOO_LARGE: createError(
    'FST_ERR_CTP_BODY_TOO_LARGE',
    'Request body is too large',
    413,
    RangeError
  ),
  FST_ERR_CTP_INVALID_MEDIA_TYPE: createError(
    'FST_ERR_CTP_INVALID_MEDIA_TYPE',
    'Unsupported Media Type: %s',
    415
  ),
  FST_ERR_CTP_INVALID_CONTENT_LENGTH: createError(
    'FST_ERR_CTP_INVALID_CONTENT_LENGTH',
    'Request body size did not match Content-Length',
    400,
    RangeError
  ),
  FST_ERR_CTP_EMPTY_JSON_BODY: createError(
    'FST_ERR_CTP_EMPTY_JSON_BODY',
    "Body cannot be empty when content-type is set to 'application/json'",
    400
  ),

  /**
   * decorate
  */
  FST_ERR_DEC_ALREADY_PRESENT: createError(
    'FST_ERR_DEC_ALREADY_PRESENT',
    "The decorator '%s' has already been added!"
  ),
  FST_ERR_DEC_DEPENDENCY_INVALID_TYPE: createError(
    'FST_ERR_DEC_DEPENDENCY_INVALID_TYPE',
    "The dependencies of decorator '%s' must be of type Array."
  ),
  FST_ERR_DEC_MISSING_DEPENDENCY: createError(
    'FST_ERR_DEC_MISSING_DEPENDENCY',
    "The decorator is missing dependency '%s'."
  ),
  FST_ERR_DEC_AFTER_START: createError(
    'FST_ERR_DEC_AFTER_START',
    "The decorator '%s' has been added after start!"
  ),

  /**
   * hooks
  */
  FST_ERR_HOOK_INVALID_TYPE: createError(
    'FST_ERR_HOOK_INVALID_TYPE',
    'The hook name must be a string',
    500,
    TypeError
  ),
  FST_ERR_HOOK_INVALID_HANDLER: createError(
    'FST_ERR_HOOK_INVALID_HANDLER',
    'The hook callback must be a function',
    500,
    TypeError
  ),

  /**
   * Middlewares
   */
  FST_ERR_MISSING_MIDDLEWARE: createError(
    'FST_ERR_MISSING_MIDDLEWARE',
    'You must register a plugin for handling middlewares, visit fastify.io/docs/latest/Reference/Middleware/ for more info.',
    500
  ),

  FST_ERR_HOOK_TIMEOUT: createError(
    'FST_ERR_HOOK_TIMEOUT',
    "A callback for '%s' hook timed out. You may have forgotten to call 'done' function or to resolve a Promise"
  ),

  /**
   * logger
  */
  FST_ERR_LOG_INVALID_DESTINATION: createError(
    'FST_ERR_LOG_INVALID_DESTINATION',
    'Cannot specify both logger.stream and logger.file options'
  ),

  /**
   * reply
  */
  FST_ERR_REP_INVALID_PAYLOAD_TYPE: createError(
    'FST_ERR_REP_INVALID_PAYLOAD_TYPE',
    "Attempted to send payload of invalid type '%s'. Expected a string or Buffer.",
    500,
    TypeError
  ),
  FST_ERR_REP_ALREADY_SENT: createError(
    'FST_ERR_REP_ALREADY_SENT',
    'Reply was already sent.'
  ),
  FST_ERR_REP_SENT_VALUE: createError(
    'FST_ERR_REP_SENT_VALUE',
    'The only possible value for reply.sent is true.'
  ),
  FST_ERR_SEND_INSIDE_ONERR: createError(
    'FST_ERR_SEND_INSIDE_ONERR',
    'You cannot use `send` inside the `onError` hook'
  ),
  FST_ERR_SEND_UNDEFINED_ERR: createError(
    'FST_ERR_SEND_UNDEFINED_ERR',
    'Undefined error has occurred'
  ),
  FST_ERR_BAD_STATUS_CODE: createError(
    'FST_ERR_BAD_STATUS_CODE',
    'Called reply with an invalid status code: %s'
  ),
  FST_ERR_BAD_TRAILER_NAME: createError(
    'FST_ERR_BAD_TRAILER_NAME',
    'Called reply.trailer with an invalid header name: %s'
  ),
  FST_ERR_BAD_TRAILER_VALUE: createError(
    'FST_ERR_BAD_TRAILER_VALUE',
    "Called reply.trailer('%s', fn) with an invalid type: %s. Expected a function."
  ),
  FST_ERR_MISSING_SERIALIZATION_FN: createError(
    'FST_ERR_MISSING_SERIALIZATION_FN',
    'Missing serialization function. Key "%s"'
  ),
  FST_ERR_REQ_INVALID_VALIDATION_INVOCATION: createError(
    'FST_ERR_REQ_INVALID_VALIDATION_INVOCATION',
    'Invalid validation invocation. Missing validation function for HTTP part "%s" nor schema provided.'
  ),

  /**
   * schemas
  */
  FST_ERR_SCH_MISSING_ID: createError(
    'FST_ERR_SCH_MISSING_ID',
    'Missing schema $id property'
  ),
  FST_ERR_SCH_ALREADY_PRESENT: createError(
    'FST_ERR_SCH_ALREADY_PRESENT',
    "Schema with id '%s' already declared!"
  ),
  FST_ERR_SCH_DUPLICATE: createError(
    'FST_ERR_SCH_DUPLICATE',
    "Schema with '%s' already present!"
  ),
  FST_ERR_SCH_VALIDATION_BUILD: createError(
    'FST_ERR_SCH_VALIDATION_BUILD',
    'Failed building the validation schema for %s: %s, due to error %s'
  ),
  FST_ERR_SCH_SERIALIZATION_BUILD: createError(
    'FST_ERR_SCH_SERIALIZATION_BUILD',
    'Failed building the serialization schema for %s: %s, due to error %s'
  ),

  /**
   * http2
   */
  FST_ERR_HTTP2_INVALID_VERSION: createError(
    'FST_ERR_HTTP2_INVALID_VERSION',
    'HTTP2 is available only from node >= 8.8.1'
  ),

  /**
   * initialConfig
   */
  FST_ERR_INIT_OPTS_INVALID: createError(
    'FST_ERR_INIT_OPTS_INVALID',
    "Invalid initialization options: '%s'"
  ),
  FST_ERR_FORCE_CLOSE_CONNECTIONS_IDLE_NOT_AVAILABLE: createError(
    'FST_ERR_FORCE_CLOSE_CONNECTIONS_IDLE_NOT_AVAILABLE',
    "Cannot set forceCloseConnections to 'idle' as your HTTP server does not support closeIdleConnections method"
  ),

  /**
   * router
   */
  FST_ERR_DUPLICATED_ROUTE: createError(
    'FST_ERR_DUPLICATED_ROUTE',
    "Method '%s' already declared for route '%s'"
  ),
  FST_ERR_BAD_URL: createError(
    'FST_ERR_BAD_URL',
    "'%s' is not a valid url component",
    400
  ),
  FST_ERR_DEFAULT_ROUTE_INVALID_TYPE: createError(
    'FST_ERR_DEFAULT_ROUTE_INVALID_TYPE',
    'The defaultRoute type should be a function',
    500,
    TypeError
  ),
  FST_ERR_INVALID_URL: createError(
    'FST_ERR_INVALID_URL',
    "URL must be a string. Received '%s'",
    400
  ),

  /**
   *  again listen when close server
   */
  FST_ERR_REOPENED_CLOSE_SERVER: createError(
    'FST_ERR_REOPENED_CLOSE_SERVER',
    'Fastify has already been closed and cannot be reopened'
  ),
  FST_ERR_REOPENED_SERVER: createError(
    'FST_ERR_REOPENED_SERVER',
    'Fastify is already listening'
  ),

  /**
   * plugin
   */
  FST_ERR_PLUGIN_VERSION_MISMATCH: createError(
    'FST_ERR_PLUGIN_VERSION_MISMATCH',
    "fastify-plugin: %s - expected '%s' fastify version, '%s' is installed"
  ),

  /**
   *  Avvio Errors map
   */
  AVVIO_ERRORS_MAP: {
    AVV_ERR_CALLBACK_NOT_FN: createError(
      'FST_ERR_PLUGIN_CALLBACK_NOT_FN',
      'fastify-plugin: %s'
    ),
    AVV_ERR_PLUGIN_NOT_VALID: createError(
      'FST_ERR_PLUGIN_NOT_VALID',
      'fastify-plugin: %s'
    ),
    AVV_ERR_ROOT_PLG_BOOTED: createError(
      'FST_ERR_ROOT_PLG_BOOTED',
      'fastify-plugin: %s'
    ),
    AVV_ERR_PARENT_PLG_LOADED: createError(
      'FST_ERR_PARENT_PLUGIN_BOOTED',
      'fastify-plugin: %s'
    ),
    AVV_ERR_READY_TIMEOUT: createError(
      'FST_ERR_PLUGIN_TIMEOUT',
      'fastify-plugin: %s'
    )
  },

  //  Util function
  appendStackTrace (oldErr, newErr) {
    newErr.cause = oldErr

    return newErr
  }
}

module.exports = codes


/***/ }),
/* 35 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { inherits, format } = __webpack_require__(21)

function createError (code, message, statusCode = 500, Base = Error) {
  if (!code) throw new Error('Fastify error code must not be empty')
  if (!message) throw new Error('Fastify error message must not be empty')

  code = code.toUpperCase()

  function FastifyError (a, b, c) {
    if (!new.target) {
      return new FastifyError(...arguments)
    }
    Error.captureStackTrace(this, FastifyError)
    this.name = 'FastifyError'
    this.code = code

    // more performant than spread (...) operator
    switch (arguments.length) {
      case 3:
        this.message = format(message, a, b, c)
        break
      case 2:
        this.message = format(message, a, b)
        break
      case 1:
        this.message = format(message, a)
        break
      case 0:
        this.message = message
        break
      default:
        this.message = format(message, ...arguments)
    }

    this.statusCode = statusCode || undefined
  }
  FastifyError.prototype[Symbol.toStringTag] = 'Error'

  FastifyError.prototype.toString = function () {
    return `${this.name} [${this.code}]: ${this.message}`
  }

  inherits(FastifyError, Base)

  return FastifyError
}

module.exports = createError


/***/ }),
/* 36 */
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),
/* 37 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const eos = (__webpack_require__(38).finished)

const {
  kFourOhFourContext,
  kReplyErrorHandlerCalled,
  kReplyHijacked,
  kReplyStartTime,
  kReplyEndTime,
  kReplySerializer,
  kReplySerializerDefault,
  kReplyIsError,
  kReplyHeaders,
  kReplyTrailers,
  kReplyHasStatusCode,
  kReplyIsRunningOnErrorHook,
  kReplyNextErrorHandler,
  kDisableRequestLogging,
  kSchemaResponse,
  kReplySerializeWeakMap,
  kSchemaController,
  kOptions
} = __webpack_require__(28)
const { hookRunner, hookIterator, onSendHookRunner } = __webpack_require__(39)

const internals = __webpack_require__(40)[Symbol.for('internals')]
const loggerUtils = __webpack_require__(43)
const now = loggerUtils.now
const { handleError } = __webpack_require__(86)
const { getSchemaSerializer } = __webpack_require__(87)

const CONTENT_TYPE = {
  JSON: 'application/json; charset=utf-8',
  PLAIN: 'text/plain; charset=utf-8',
  OCTET: 'application/octet-stream'
}
const {
  FST_ERR_REP_INVALID_PAYLOAD_TYPE,
  FST_ERR_REP_ALREADY_SENT,
  FST_ERR_REP_SENT_VALUE,
  FST_ERR_SEND_INSIDE_ONERR,
  FST_ERR_BAD_STATUS_CODE,
  FST_ERR_BAD_TRAILER_NAME,
  FST_ERR_BAD_TRAILER_VALUE,
  FST_ERR_MISSING_SERIALIZATION_FN
} = __webpack_require__(34)
const warning = __webpack_require__(32)

function Reply (res, request, log) {
  this.raw = res
  this[kReplySerializer] = null
  this[kReplyErrorHandlerCalled] = false
  this[kReplyIsError] = false
  this[kReplyIsRunningOnErrorHook] = false
  this.request = request
  this[kReplyHeaders] = {}
  this[kReplyTrailers] = null
  this[kReplyHasStatusCode] = false
  this[kReplyStartTime] = undefined
  this.log = log
}
Reply.props = []

Object.defineProperties(Reply.prototype, {
  context: {
    get () {
      return this.request.context
    }
  },
  server: {
    get () {
      return this.request.context.server
    }
  },
  sent: {
    enumerable: true,
    get () {
      // We are checking whether reply was hijacked or the response has ended.
      return (this[kReplyHijacked] || this.raw.writableEnded) === true
    },
    set (value) {
      warning.emit('FSTDEP010')

      if (value !== true) {
        throw new FST_ERR_REP_SENT_VALUE()
      }

      // We throw only if sent was overwritten from Fastify
      if (this.sent && this[kReplyHijacked]) {
        throw new FST_ERR_REP_ALREADY_SENT()
      }

      this[kReplyHijacked] = true
    }
  },
  statusCode: {
    get () {
      return this.raw.statusCode
    },
    set (value) {
      this.code(value)
    }
  }
})

Reply.prototype.hijack = function () {
  this[kReplyHijacked] = true
  return this
}

Reply.prototype.send = function (payload) {
  if (this[kReplyIsRunningOnErrorHook] === true) {
    throw new FST_ERR_SEND_INSIDE_ONERR()
  }

  if (this.sent) {
    this.log.warn({ err: new FST_ERR_REP_ALREADY_SENT() }, 'Reply already sent')
    return this
  }

  if (payload instanceof Error || this[kReplyIsError] === true) {
    this[kReplyIsError] = false
    onErrorHook(this, payload, onSendHook)
    return this
  }

  if (payload === undefined) {
    onSendHook(this, payload)
    return this
  }

  const contentType = this.getHeader('content-type')
  const hasContentType = contentType !== undefined

  if (payload !== null) {
    if (typeof payload.pipe === 'function') {
      onSendHook(this, payload)
      return this
    }

    if (Buffer.isBuffer(payload)) {
      if (hasContentType === false) {
        this[kReplyHeaders]['content-type'] = CONTENT_TYPE.OCTET
      }
      onSendHook(this, payload)
      return this
    }

    if (hasContentType === false && typeof payload === 'string') {
      this[kReplyHeaders]['content-type'] = CONTENT_TYPE.PLAIN
      onSendHook(this, payload)
      return this
    }
  }

  if (this[kReplySerializer] !== null) {
    if (typeof payload !== 'string') {
      preserializeHook(this, payload)
      return this
    } else {
      payload = this[kReplySerializer](payload)
    }

  // The indexOf below also matches custom json mimetypes such as 'application/hal+json' or 'application/ld+json'
  } else if (hasContentType === false || contentType.indexOf('json') > -1) {
    if (hasContentType === false) {
      this[kReplyHeaders]['content-type'] = CONTENT_TYPE.JSON
    } else {
      // If user doesn't set charset, we will set charset to utf-8
      if (contentType.indexOf('charset') === -1) {
        const customContentType = contentType.trim()
        if (customContentType.endsWith(';')) {
          // custom content-type is ended with ';'
          this[kReplyHeaders]['content-type'] = `${customContentType} charset=utf-8`
        } else {
          this[kReplyHeaders]['content-type'] = `${customContentType}; charset=utf-8`
        }
      }
    }
    if (typeof payload !== 'string') {
      preserializeHook(this, payload)
      return this
    }
  }

  onSendHook(this, payload)

  return this
}

Reply.prototype.getHeader = function (key) {
  key = key.toLowerCase()
  const res = this.raw
  let value = this[kReplyHeaders][key]
  if (value === undefined && res.hasHeader(key)) {
    value = res.getHeader(key)
  }
  return value
}

Reply.prototype.getHeaders = function () {
  return {
    ...this.raw.getHeaders(),
    ...this[kReplyHeaders]
  }
}

Reply.prototype.hasHeader = function (key) {
  key = key.toLowerCase()

  return this[kReplyHeaders][key] !== undefined || this.raw.hasHeader(key)
}

Reply.prototype.removeHeader = function (key) {
  // Node.js does not like headers with keys set to undefined,
  // so we have to delete the key.
  delete this[kReplyHeaders][key.toLowerCase()]
  return this
}

Reply.prototype.header = function (key, value = '') {
  key = key.toLowerCase()

  if (this[kReplyHeaders][key] && key === 'set-cookie') {
    // https://tools.ietf.org/html/rfc7230#section-3.2.2
    if (typeof this[kReplyHeaders][key] === 'string') {
      this[kReplyHeaders][key] = [this[kReplyHeaders][key]]
    }

    if (Array.isArray(value)) {
      this[kReplyHeaders][key].push(...value)
    } else {
      this[kReplyHeaders][key].push(value)
    }
  } else {
    this[kReplyHeaders][key] = value
  }

  return this
}

Reply.prototype.headers = function (headers) {
  const keys = Object.keys(headers)
  /* eslint-disable no-var */
  for (var i = 0; i !== keys.length; ++i) {
    const key = keys[i]
    this.header(key, headers[key])
  }

  return this
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer#directives
// https://httpwg.org/specs/rfc7230.html#chunked.trailer.part
const INVALID_TRAILERS = new Set([
  'transfer-encoding',
  'content-length',
  'host',
  'cache-control',
  'max-forwards',
  'te',
  'authorization',
  'set-cookie',
  'content-encoding',
  'content-type',
  'content-range',
  'trailer'
])

Reply.prototype.trailer = function (key, fn) {
  key = key.toLowerCase()
  if (INVALID_TRAILERS.has(key)) {
    throw new FST_ERR_BAD_TRAILER_NAME(key)
  }
  if (typeof fn !== 'function') {
    throw new FST_ERR_BAD_TRAILER_VALUE(key, typeof fn)
  }
  if (this[kReplyTrailers] === null) this[kReplyTrailers] = {}
  this[kReplyTrailers][key] = fn
  return this
}

Reply.prototype.hasTrailer = function (key) {
  return this[kReplyTrailers]?.[key.toLowerCase()] !== undefined
}

Reply.prototype.removeTrailer = function (key) {
  if (this[kReplyTrailers] === null) return this
  this[kReplyTrailers][key.toLowerCase()] = undefined
  return this
}

Reply.prototype.code = function (code) {
  const intValue = parseInt(code)
  if (isNaN(intValue) || intValue < 100 || intValue > 599) {
    throw new FST_ERR_BAD_STATUS_CODE(code || String(code))
  }

  this.raw.statusCode = intValue
  this[kReplyHasStatusCode] = true
  return this
}

Reply.prototype.status = Reply.prototype.code

Reply.prototype.getSerializationFunction = function (schemaOrStatus) {
  let serialize

  if (typeof schemaOrStatus === 'string' || typeof schemaOrStatus === 'number') {
    serialize = this.context[kSchemaResponse]?.[schemaOrStatus]
  } else if (typeof schemaOrStatus === 'object') {
    serialize = this.context[kReplySerializeWeakMap]?.get(schemaOrStatus)
  }

  return serialize
}

Reply.prototype.compileSerializationSchema = function (schema, httpStatus = null) {
  const { request } = this
  const { method, url } = request

  // Check if serialize function already compiled
  if (this.context[kReplySerializeWeakMap]?.has(schema)) {
    return this.context[kReplySerializeWeakMap].get(schema)
  }

  const serializerCompiler = this.context.serializerCompiler ||
   this.server[kSchemaController].serializerCompiler ||
  (
    // We compile the schemas if no custom serializerCompiler is provided
    // nor set
    this.server[kSchemaController].setupSerializer(this.server[kOptions]) ||
    this.server[kSchemaController].serializerCompiler
  )

  const serializeFn = serializerCompiler({
    schema,
    method,
    url,
    httpStatus
  })

  // We create a WeakMap to compile the schema only once
  // Its done leazily to avoid add overhead by creating the WeakMap
  // if it is not used
  // TODO: Explore a central cache for all the schemas shared across
  // encapsulated contexts
  if (this.context[kReplySerializeWeakMap] == null) {
    this.context[kReplySerializeWeakMap] = new WeakMap()
  }

  this.context[kReplySerializeWeakMap].set(schema, serializeFn)

  return serializeFn
}

Reply.prototype.serializeInput = function (input, schema, httpStatus) {
  let serialize
  httpStatus = typeof schema === 'string' || typeof schema === 'number'
    ? schema
    : httpStatus

  if (httpStatus != null) {
    serialize = this.context[kSchemaResponse]?.[httpStatus]

    if (serialize == null) throw new FST_ERR_MISSING_SERIALIZATION_FN(httpStatus)
  } else {
    // Check if serialize function already compiled
    if (this.context[kReplySerializeWeakMap]?.has(schema)) {
      serialize = this.context[kReplySerializeWeakMap].get(schema)
    } else {
      serialize = this.compileSerializationSchema(schema, httpStatus)
    }
  }

  return serialize(input)
}

Reply.prototype.serialize = function (payload) {
  if (this[kReplySerializer] !== null) {
    return this[kReplySerializer](payload)
  } else {
    if (this.context && this.context[kReplySerializerDefault]) {
      return this.context[kReplySerializerDefault](payload, this.raw.statusCode)
    } else {
      return serialize(this.context, payload, this.raw.statusCode)
    }
  }
}

Reply.prototype.serializer = function (fn) {
  this[kReplySerializer] = fn
  return this
}

Reply.prototype.type = function (type) {
  this[kReplyHeaders]['content-type'] = type
  return this
}

Reply.prototype.redirect = function (code, url) {
  if (typeof code === 'string') {
    url = code
    code = this[kReplyHasStatusCode] ? this.raw.statusCode : 302
  }

  return this.header('location', url).code(code).send()
}

Reply.prototype.callNotFound = function () {
  notFound(this)
  return this
}

Reply.prototype.getResponseTime = function () {
  let responseTime = 0

  if (this[kReplyStartTime] !== undefined) {
    responseTime = (this[kReplyEndTime] || now()) - this[kReplyStartTime]
  }

  return responseTime
}

// Make reply a thenable, so it could be used with async/await.
// See
// - https://github.com/fastify/fastify/issues/1864 for the discussions
// - https://promisesaplus.com/ for the definition of thenable
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then for the signature
Reply.prototype.then = function (fulfilled, rejected) {
  if (this.sent) {
    fulfilled()
    return
  }

  eos(this.raw, (err) => {
    // We must not treat ERR_STREAM_PREMATURE_CLOSE as
    // an error because it is created by eos, not by the stream.
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      if (rejected) {
        rejected(err)
      } else {
        this.log && this.log.warn('unhandled rejection on reply.then')
      }
    } else {
      fulfilled()
    }
  })
}

function preserializeHook (reply, payload) {
  if (reply.context.preSerialization !== null) {
    onSendHookRunner(
      reply.context.preSerialization,
      reply.request,
      reply,
      payload,
      preserializeHookEnd
    )
  } else {
    preserializeHookEnd(null, reply.request, reply, payload)
  }
}

function preserializeHookEnd (err, request, reply, payload) {
  if (err != null) {
    onErrorHook(reply, err)
    return
  }

  try {
    if (reply[kReplySerializer] !== null) {
      payload = reply[kReplySerializer](payload)
    } else if (reply.context && reply.context[kReplySerializerDefault]) {
      payload = reply.context[kReplySerializerDefault](payload, reply.raw.statusCode)
    } else {
      payload = serialize(reply.context, payload, reply.raw.statusCode)
    }
  } catch (e) {
    wrapSeralizationError(e, reply)
    onErrorHook(reply, e)
    return
  }

  onSendHook(reply, payload)
}

function wrapSeralizationError (error, reply) {
  error.serialization = reply.context.config
}

function onSendHook (reply, payload) {
  if (reply.context.onSend !== null) {
    onSendHookRunner(
      reply.context.onSend,
      reply.request,
      reply,
      payload,
      wrapOnSendEnd
    )
  } else {
    onSendEnd(reply, payload)
  }
}

function wrapOnSendEnd (err, request, reply, payload) {
  if (err != null) {
    onErrorHook(reply, err)
  } else {
    onSendEnd(reply, payload)
  }
}

function onSendEnd (reply, payload) {
  const res = reply.raw
  const req = reply.request
  const statusCode = res.statusCode

  // we check if we need to update the trailers header and set it
  if (reply[kReplyTrailers] !== null) {
    const trailerHeaders = Object.keys(reply[kReplyTrailers])
    let header = ''
    for (const trailerName of trailerHeaders) {
      if (typeof reply[kReplyTrailers][trailerName] !== 'function') continue
      header += ' '
      header += trailerName
    }
    // it must be chunked for trailer to work
    reply.header('Transfer-Encoding', 'chunked')
    reply.header('Trailer', header.trim())
  }

  if (payload === undefined || payload === null) {
    // according to https://tools.ietf.org/html/rfc7230#section-3.3.2
    // we cannot send a content-length for 304 and 204, and all status code
    // < 200
    // A sender MUST NOT send a Content-Length header field in any message
    // that contains a Transfer-Encoding header field.
    // For HEAD we don't overwrite the `content-length`
    if (statusCode >= 200 && statusCode !== 204 && statusCode !== 304 && req.method !== 'HEAD' && reply[kReplyTrailers] === null) {
      reply[kReplyHeaders]['content-length'] = '0'
    }

    res.writeHead(statusCode, reply[kReplyHeaders])
    sendTrailer(payload, res, reply)
    // avoid ArgumentsAdaptorTrampoline from V8
    res.end(null, null, null)
    return
  }

  if (typeof payload.pipe === 'function') {
    sendStream(payload, res, reply)
    return
  }

  if (typeof payload !== 'string' && !Buffer.isBuffer(payload)) {
    throw new FST_ERR_REP_INVALID_PAYLOAD_TYPE(typeof payload)
  }

  if (reply[kReplyTrailers] === null) {
    const contentLength = reply[kReplyHeaders]['content-length']
    if (!contentLength ||
        (req.raw.method !== 'HEAD' &&
         parseInt(contentLength, 10) !== Buffer.byteLength(payload)
        )
    ) {
      reply[kReplyHeaders]['content-length'] = '' + Buffer.byteLength(payload)
    }
  }

  res.writeHead(statusCode, reply[kReplyHeaders])
  // write payload first
  res.write(payload)
  // then send trailers
  sendTrailer(payload, res, reply)
  // avoid ArgumentsAdaptorTrampoline from V8
  res.end(null, null, null)
}

function logStreamError (logger, err, res) {
  if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
    if (!logger[kDisableRequestLogging]) {
      logger.info({ res }, 'stream closed prematurely')
    }
  } else {
    logger.warn({ err }, 'response terminated with an error with headers already sent')
  }
}

function sendStream (payload, res, reply) {
  let sourceOpen = true
  let errorLogged = false

  // set trailer when stream ended
  sendStreamTrailer(payload, res, reply)

  eos(payload, { readable: true, writable: false }, function (err) {
    sourceOpen = false
    if (err != null) {
      if (res.headersSent || reply.request.raw.aborted === true) {
        if (!errorLogged) {
          errorLogged = true
          logStreamError(reply.log, err, res)
        }
        res.destroy()
      } else {
        onErrorHook(reply, err)
      }
    }
    // there is nothing to do if there is not an error
  })

  eos(res, function (err) {
    if (sourceOpen) {
      if (err != null && res.headersSent && !errorLogged) {
        errorLogged = true
        logStreamError(reply.log, err, res)
      }
      if (typeof payload.destroy === 'function') {
        payload.destroy()
      } else if (typeof payload.close === 'function') {
        payload.close(noop)
      } else if (typeof payload.abort === 'function') {
        payload.abort()
      } else {
        reply.log.warn('stream payload does not end properly')
      }
    }
  })

  // streams will error asynchronously, and we want to handle that error
  // appropriately, e.g. a 404 for a missing file. So we cannot use
  // writeHead, and we need to resort to setHeader, which will trigger
  // a writeHead when there is data to send.
  if (!res.headersSent) {
    for (const key in reply[kReplyHeaders]) {
      res.setHeader(key, reply[kReplyHeaders][key])
    }
  } else {
    reply.log.warn('response will send, but you shouldn\'t use res.writeHead in stream mode')
  }
  payload.pipe(res)
}

function sendTrailer (payload, res, reply) {
  if (reply[kReplyTrailers] === null) return
  const trailerHeaders = Object.keys(reply[kReplyTrailers])
  const trailers = {}
  for (const trailerName of trailerHeaders) {
    if (typeof reply[kReplyTrailers][trailerName] !== 'function') continue
    trailers[trailerName] = reply[kReplyTrailers][trailerName](reply, payload)
  }
  res.addTrailers(trailers)
}

function sendStreamTrailer (payload, res, reply) {
  if (reply[kReplyTrailers] === null) return
  payload.on('end', () => sendTrailer(null, res, reply))
}

function onErrorHook (reply, error, cb) {
  if (reply.context.onError !== null && !reply[kReplyNextErrorHandler]) {
    reply[kReplyIsRunningOnErrorHook] = true
    onSendHookRunner(
      reply.context.onError,
      reply.request,
      reply,
      error,
      () => handleError(reply, error, cb)
    )
  } else {
    handleError(reply, error, cb)
  }
}

function setupResponseListeners (reply) {
  reply[kReplyStartTime] = now()

  const onResFinished = err => {
    reply[kReplyEndTime] = now()
    reply.raw.removeListener('finish', onResFinished)
    reply.raw.removeListener('error', onResFinished)

    const ctx = reply.context

    if (ctx && ctx.onResponse !== null) {
      hookRunner(
        ctx.onResponse,
        onResponseIterator,
        reply.request,
        reply,
        onResponseCallback
      )
    } else {
      onResponseCallback(err, reply.request, reply)
    }
  }

  reply.raw.on('finish', onResFinished)
  reply.raw.on('error', onResFinished)
}

function onResponseIterator (fn, request, reply, next) {
  return fn(request, reply, next)
}

function onResponseCallback (err, request, reply) {
  if (reply.log[kDisableRequestLogging]) {
    return
  }

  const responseTime = reply.getResponseTime()

  if (err != null) {
    reply.log.error({
      res: reply,
      err,
      responseTime
    }, 'request errored')
    return
  }

  reply.log.info({
    res: reply,
    responseTime
  }, 'request completed')
}

function buildReply (R) {
  const props = [...R.props]

  function _Reply (res, request, log) {
    this.raw = res
    this[kReplyIsError] = false
    this[kReplyErrorHandlerCalled] = false
    this[kReplyHijacked] = false
    this[kReplySerializer] = null
    this.request = request
    this[kReplyHeaders] = {}
    this[kReplyTrailers] = null
    this[kReplyStartTime] = undefined
    this[kReplyEndTime] = undefined
    this.log = log

    // eslint-disable-next-line no-var
    var prop
    // eslint-disable-next-line no-var
    for (var i = 0; i < props.length; i++) {
      prop = props[i]
      this[prop.key] = prop.value
    }
  }
  Object.setPrototypeOf(_Reply.prototype, R.prototype)
  Object.setPrototypeOf(_Reply, R)
  _Reply.parent = R
  _Reply.props = props
  return _Reply
}

function notFound (reply) {
  if (reply.context[kFourOhFourContext] === null) {
    reply.log.warn('Trying to send a NotFound error inside a 404 handler. Sending basic 404 response.')
    reply.code(404).send('404 Not Found')
    return
  }

  reply.request.context = reply.context[kFourOhFourContext]

  // preHandler hook
  if (reply.context.preHandler !== null) {
    hookRunner(
      reply.context.preHandler,
      hookIterator,
      reply.request,
      reply,
      internals.preHandlerCallback
    )
  } else {
    internals.preHandlerCallback(null, reply.request, reply)
  }
}

/**
 * This function runs when a payload that is not a string|buffer|stream or null
 * should be serialized to be streamed to the response.
 * This is the default serializer that can be customized by the user using the replySerializer
 *
 * @param {object} context the request context
 * @param {object} data the JSON payload to serialize
 * @param {number} statusCode the http status code
 * @returns {string} the serialized payload
 */
function serialize (context, data, statusCode) {
  const fnSerialize = getSchemaSerializer(context, statusCode)
  if (fnSerialize) {
    return fnSerialize(data)
  }
  return JSON.stringify(data)
}

function noop () { }

module.exports = Reply
module.exports.buildReply = buildReply
module.exports.setupResponseListeners = setupResponseListeners


/***/ }),
/* 38 */
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),
/* 39 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const applicationHooks = [
  'onRoute',
  'onRegister',
  'onReady',
  'onClose'
]
const lifecycleHooks = [
  'onTimeout',
  'onRequest',
  'preParsing',
  'preValidation',
  'preSerialization',
  'preHandler',
  'onSend',
  'onResponse',
  'onError'
]
const supportedHooks = lifecycleHooks.concat(applicationHooks)
const {
  FST_ERR_HOOK_INVALID_TYPE,
  FST_ERR_HOOK_INVALID_HANDLER,
  FST_ERR_SEND_UNDEFINED_ERR,
  FST_ERR_HOOK_TIMEOUT,
  AVVIO_ERRORS_MAP,
  appendStackTrace
} = __webpack_require__(34)

const {
  kChildren,
  kHooks
} = __webpack_require__(28)

function Hooks () {
  this.onRequest = []
  this.preParsing = []
  this.preValidation = []
  this.preSerialization = []
  this.preHandler = []
  this.onResponse = []
  this.onSend = []
  this.onError = []
  this.onRoute = []
  this.onRegister = []
  this.onReady = []
  this.onTimeout = []
}

Hooks.prototype.validate = function (hook, fn) {
  if (typeof hook !== 'string') throw new FST_ERR_HOOK_INVALID_TYPE()
  if (typeof fn !== 'function') throw new FST_ERR_HOOK_INVALID_HANDLER()
  if (supportedHooks.indexOf(hook) === -1) {
    throw new Error(`${hook} hook not supported!`)
  }
}

Hooks.prototype.add = function (hook, fn) {
  this.validate(hook, fn)
  this[hook].push(fn)
}

function buildHooks (h) {
  const hooks = new Hooks()
  hooks.onRequest = h.onRequest.slice()
  hooks.preParsing = h.preParsing.slice()
  hooks.preValidation = h.preValidation.slice()
  hooks.preSerialization = h.preSerialization.slice()
  hooks.preHandler = h.preHandler.slice()
  hooks.onSend = h.onSend.slice()
  hooks.onResponse = h.onResponse.slice()
  hooks.onError = h.onError.slice()
  hooks.onRoute = h.onRoute.slice()
  hooks.onRegister = h.onRegister.slice()
  hooks.onTimeout = h.onTimeout.slice()
  hooks.onReady = []
  return hooks
}

function hookRunnerApplication (hookName, boot, server, cb) {
  const hooks = server[kHooks][hookName]
  let i = 0
  let c = 0

  next()

  function exit (err) {
    if (err) {
      if (err.code === 'AVV_ERR_READY_TIMEOUT') {
        err = appendStackTrace(err, new FST_ERR_HOOK_TIMEOUT(hookName))
      } else {
        err = AVVIO_ERRORS_MAP[err.code] != null
          ? appendStackTrace(err, new AVVIO_ERRORS_MAP[err.code](err.message))
          : err
      }

      cb(err)
      return
    }
    cb()
  }

  function next (err) {
    if (err) {
      exit(err)
      return
    }

    if (i === hooks.length && c === server[kChildren].length) {
      if (i === 0 && c === 0) { // speed up start
        exit()
      } else {
        // This is the last function executed for every fastify instance
        boot(function manageTimeout (err, done) {
          // this callback is needed by fastify to provide an hook interface without the error
          // as first parameter and managing it on behalf the user
          exit(err)

          // this callback is needed by avvio to continue the loading of the next `register` plugins
          done(err)
        })
      }
      return
    }

    if (i === hooks.length && c < server[kChildren].length) {
      const child = server[kChildren][c++]
      hookRunnerApplication(hookName, boot, child, next)
      return
    }

    boot(wrap(hooks[i++], server))
    next()
  }

  function wrap (fn, server) {
    return function (err, done) {
      if (err) {
        done(err)
        return
      }

      if (fn.length === 1) {
        try {
          fn.call(server, done)
        } catch (error) {
          done(error)
        }
        return
      }

      const ret = fn.call(server)
      if (ret && typeof ret.then === 'function') {
        ret.then(done, done)
        return
      }

      done(err) // auto done
    }
  }
}

function hookRunner (functions, runner, request, reply, cb) {
  let i = 0

  function next (err) {
    if (err || i === functions.length) {
      cb(err, request, reply)
      return
    }

    let result
    try {
      result = runner(functions[i++], request, reply, next)
    } catch (error) {
      next(error)
      return
    }
    if (result && typeof result.then === 'function') {
      result.then(handleResolve, handleReject)
    }
  }

  function handleResolve () {
    next()
  }

  function handleReject (err) {
    if (!err) {
      err = new FST_ERR_SEND_UNDEFINED_ERR()
    }

    cb(err, request, reply)
  }

  next()
}

function onSendHookRunner (functions, request, reply, payload, cb) {
  let i = 0

  function next (err, newPayload) {
    if (err) {
      cb(err, request, reply, payload)
      return
    }

    if (newPayload !== undefined) {
      payload = newPayload
    }

    if (i === functions.length) {
      cb(null, request, reply, payload)
      return
    }

    let result
    try {
      result = functions[i++](request, reply, payload, next)
    } catch (error) {
      next(error)
      return
    }
    if (result && typeof result.then === 'function') {
      result.then(handleResolve, handleReject)
    }
  }

  function handleResolve (newPayload) {
    next(null, newPayload)
  }

  function handleReject (err) {
    if (!err) {
      err = new FST_ERR_SEND_UNDEFINED_ERR()
    }

    cb(err, request, reply, payload)
  }

  next()
}

function hookIterator (fn, request, reply, next) {
  if (reply.sent === true) return undefined
  return fn(request, reply, next)
}

module.exports = {
  Hooks,
  buildHooks,
  hookRunner,
  onSendHookRunner,
  hookIterator,
  hookRunnerApplication,
  lifecycleHooks,
  supportedHooks
}


/***/ }),
/* 40 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { validate: validateSchema } = __webpack_require__(41)
const { hookRunner, hookIterator } = __webpack_require__(39)
const wrapThenable = __webpack_require__(42)
const {
  kReplyIsError
} = __webpack_require__(28)

function handleRequest (err, request, reply) {
  if (reply.sent === true) return
  if (err != null) {
    reply[kReplyIsError] = true
    reply.send(err)
    return
  }

  const method = request.raw.method
  const headers = request.headers

  if (method === 'GET' || method === 'HEAD' || method === 'SEARCH') {
    handler(request, reply)
    return
  }

  const contentType = headers['content-type']

  if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'TRACE') {
    if (contentType === undefined) {
      if (
        headers['transfer-encoding'] === undefined &&
        (headers['content-length'] === '0' || headers['content-length'] === undefined)
      ) { // Request has no body to parse
        handler(request, reply)
      } else {
        reply.context.contentTypeParser.run('', handler, request, reply)
      }
    } else {
      reply.context.contentTypeParser.run(contentType, handler, request, reply)
    }
    return
  }

  if (method === 'OPTIONS' || method === 'DELETE') {
    if (
      contentType !== undefined &&
      (
        headers['transfer-encoding'] !== undefined ||
        headers['content-length'] !== undefined
      )
    ) {
      reply.context.contentTypeParser.run(contentType, handler, request, reply)
    } else {
      handler(request, reply)
    }
    return
  }

  // Return 404 instead of 405 see https://github.com/fastify/fastify/pull/862 for discussion
  handler(request, reply)
}

function handler (request, reply) {
  try {
    if (reply.context.preValidation !== null) {
      hookRunner(
        reply.context.preValidation,
        hookIterator,
        request,
        reply,
        preValidationCallback
      )
    } else {
      preValidationCallback(null, request, reply)
    }
  } catch (err) {
    preValidationCallback(err, request, reply)
  }
}

function preValidationCallback (err, request, reply) {
  if (reply.sent === true) return

  if (err != null) {
    reply[kReplyIsError] = true
    reply.send(err)
    return
  }

  const result = validateSchema(reply.context, request)
  if (result) {
    if (reply.context.attachValidation === false) {
      reply.send(result)
      return
    }

    reply.request.validationError = result
  }

  // preHandler hook
  if (reply.context.preHandler !== null) {
    hookRunner(
      reply.context.preHandler,
      hookIterator,
      request,
      reply,
      preHandlerCallback
    )
  } else {
    preHandlerCallback(null, request, reply)
  }
}

function preHandlerCallback (err, request, reply) {
  if (reply.sent) return

  if (err != null) {
    reply[kReplyIsError] = true
    reply.send(err)
    return
  }

  let result

  try {
    result = reply.context.handler(request, reply)
  } catch (err) {
    reply[kReplyIsError] = true
    reply.send(err)
    return
  }

  if (result !== undefined) {
    if (result !== null && typeof result.then === 'function') {
      wrapThenable(result, reply)
    } else {
      reply.send(result)
    }
  }
}

module.exports = handleRequest
module.exports[Symbol.for('internals')] = { handler, preHandlerCallback }


/***/ }),
/* 41 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const {
  kSchemaHeaders: headersSchema,
  kSchemaParams: paramsSchema,
  kSchemaQuerystring: querystringSchema,
  kSchemaBody: bodySchema,
  kSchemaResponse: responseSchema
} = __webpack_require__(28)
const scChecker = /^[1-5]{1}[0-9]{2}$|^[1-5]xx$|^default$/

function compileSchemasForSerialization (context, compile) {
  if (!context.schema || !context.schema.response) {
    return
  }
  const { method, url } = context.config || {}
  context[responseSchema] = Object.keys(context.schema.response)
    .reduce(function (acc, statusCode) {
      const schema = context.schema.response[statusCode]
      statusCode = statusCode.toLowerCase()
      if (!scChecker.exec(statusCode)) {
        throw new Error('response schemas should be nested under a valid status code, e.g { 2xx: { type: "object" } }')
      }

      acc[statusCode] = compile({
        schema,
        url,
        method,
        httpStatus: statusCode
      })
      return acc
    }, {})
}

function compileSchemasForValidation (context, compile) {
  const { schema } = context
  if (!schema) {
    return
  }

  const { method, url } = context.config || {}

  const headers = schema.headers
  if (headers && Object.getPrototypeOf(headers) !== Object.prototype) {
    // do not mess with non-literals, e.g. Joi schemas
    context[headersSchema] = compile({ schema: headers, method, url, httpPart: 'headers' })
  } else if (headers) {
    // The header keys are case insensitive
    //  https://tools.ietf.org/html/rfc2616#section-4.2
    const headersSchemaLowerCase = {}
    Object.keys(headers).forEach(k => { headersSchemaLowerCase[k] = headers[k] })
    if (headersSchemaLowerCase.required instanceof Array) {
      headersSchemaLowerCase.required = headersSchemaLowerCase.required.map(h => h.toLowerCase())
    }
    if (headers.properties) {
      headersSchemaLowerCase.properties = {}
      Object.keys(headers.properties).forEach(k => {
        headersSchemaLowerCase.properties[k.toLowerCase()] = headers.properties[k]
      })
    }
    context[headersSchema] = compile({ schema: headersSchemaLowerCase, method, url, httpPart: 'headers' })
  }

  if (schema.body) {
    context[bodySchema] = compile({ schema: schema.body, method, url, httpPart: 'body' })
  }

  if (schema.querystring) {
    context[querystringSchema] = compile({ schema: schema.querystring, method, url, httpPart: 'querystring' })
  }

  if (schema.params) {
    context[paramsSchema] = compile({ schema: schema.params, method, url, httpPart: 'params' })
  }
}

function validateParam (validatorFunction, request, paramName) {
  const isUndefined = request[paramName] === undefined
  const ret = validatorFunction && validatorFunction(isUndefined ? null : request[paramName])
  if (ret === false) return validatorFunction.errors
  if (ret && ret.error) return ret.error
  if (ret && ret.value) request[paramName] = ret.value
  return false
}

function validate (context, request) {
  const params = validateParam(context[paramsSchema], request, 'params')

  if (params) {
    return wrapValidationError(params, 'params', context.schemaErrorFormatter)
  }
  const body = validateParam(context[bodySchema], request, 'body')
  if (body) {
    return wrapValidationError(body, 'body', context.schemaErrorFormatter)
  }
  const query = validateParam(context[querystringSchema], request, 'query')
  if (query) {
    return wrapValidationError(query, 'querystring', context.schemaErrorFormatter)
  }
  const headers = validateParam(context[headersSchema], request, 'headers')
  if (headers) {
    return wrapValidationError(headers, 'headers', context.schemaErrorFormatter)
  }
  return null
}

function wrapValidationError (result, dataVar, schemaErrorFormatter) {
  if (result instanceof Error) {
    result.statusCode = result.statusCode || 400
    result.validationContext = result.validationContext || dataVar
    return result
  }

  const error = schemaErrorFormatter(result, dataVar)
  error.statusCode = error.statusCode || 400
  error.validation = result
  error.validationContext = dataVar
  return error
}

module.exports = {
  symbols: { bodySchema, querystringSchema, responseSchema, paramsSchema, headersSchema },
  compileSchemasForValidation,
  compileSchemasForSerialization,
  validate
}


/***/ }),
/* 42 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const {
  kReplyIsError,
  kReplyHijacked
} = __webpack_require__(28)

function wrapThenable (thenable, reply) {
  thenable.then(function (payload) {
    if (reply[kReplyHijacked] === true) {
      return
    }

    // this is for async functions that are using reply.send directly
    //
    // since wrap-thenable will be called when using reply.send directly
    // without actual return. the response can be sent already or
    // the request may be terminated during the reply. in this situation,
    // it require an extra checking of request.aborted to see whether
    // the request is killed by client.
    if (payload !== undefined || (reply.sent === false && reply.raw.headersSent === false && reply.request.raw.aborted === false)) {
      // we use a try-catch internally to avoid adding a catch to another
      // promise, increase promise perf by 10%
      try {
        reply.send(payload)
      } catch (err) {
        reply[kReplyIsError] = true
        reply.send(err)
      }
    }
  }, function (err) {
    if (reply.sent === true) {
      reply.log.error({ err }, 'Promise errored, but reply.sent = true was set')
      return
    }

    reply[kReplyIsError] = true
    reply.send(err)
  })
}

module.exports = wrapThenable


/***/ }),
/* 43 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Code imported from `pino-http`
 * Repo: https://github.com/pinojs/pino-http
 * License: MIT (https://raw.githubusercontent.com/pinojs/pino-http/master/LICENSE)
 */

const nullLogger = __webpack_require__(44)
const pino = __webpack_require__(45)
const { serializersSym } = pino.symbols
const { FST_ERR_LOG_INVALID_DESTINATION } = __webpack_require__(34)

function createPinoLogger (opts, stream) {
  stream = stream || opts.stream
  delete opts.stream

  if (stream && opts.file) {
    throw new FST_ERR_LOG_INVALID_DESTINATION()
  } else if (opts.file) {
    // we do not have stream
    stream = pino.destination(opts.file)
    delete opts.file
  }

  const prevLogger = opts.logger
  const prevGenReqId = opts.genReqId
  let logger = null

  if (prevLogger) {
    opts.logger = undefined
    opts.genReqId = undefined
    // we need to tap into pino internals because in v5 it supports
    // adding serializers in child loggers
    if (prevLogger[serializersSym]) {
      opts.serializers = Object.assign({}, opts.serializers, prevLogger[serializersSym])
    }
    logger = prevLogger.child({}, opts)
    opts.logger = prevLogger
    opts.genReqId = prevGenReqId
  } else {
    logger = pino(opts, stream)
  }

  return logger
}

const serializers = {
  req: function asReqValue (req) {
    return {
      method: req.method,
      url: req.url,
      version: req.headers && req.headers['accept-version'],
      hostname: req.hostname,
      remoteAddress: req.ip,
      remotePort: req.socket ? req.socket.remotePort : undefined
    }
  },
  err: pino.stdSerializers.err,
  res: function asResValue (reply) {
    return {
      statusCode: reply.statusCode
    }
  }
}

function now () {
  const ts = process.hrtime()
  return (ts[0] * 1e3) + (ts[1] / 1e6)
}

function createLogger (options) {
  if (isValidLogger(options.logger)) {
    const logger = createPinoLogger({
      logger: options.logger,
      serializers: Object.assign({}, serializers, options.logger.serializers)
    })
    return { logger, hasLogger: true }
  } else if (!options.logger) {
    const logger = nullLogger
    logger.child = () => logger
    return { logger, hasLogger: false }
  } else {
    const localLoggerOptions = {}
    if (Object.prototype.toString.call(options.logger) === '[object Object]') {
      Reflect.ownKeys(options.logger).forEach(prop => {
        Object.defineProperty(localLoggerOptions, prop, {
          value: options.logger[prop],
          writable: true,
          enumerable: true,
          configurable: true
        })
      })
    }
    localLoggerOptions.level = localLoggerOptions.level || 'info'
    localLoggerOptions.serializers = Object.assign({}, serializers, localLoggerOptions.serializers)
    options.logger = localLoggerOptions
    const logger = createPinoLogger(options.logger)
    return { logger, hasLogger: true }
  }
}

function isValidLogger (logger) {
  if (!logger) {
    return false
  }

  let result = true
  const methods = ['info', 'error', 'debug', 'fatal', 'warn', 'trace', 'child']
  for (let i = 0; i < methods.length; i += 1) {
    if (!logger[methods[i]] || typeof logger[methods[i]] !== 'function') {
      result = false
      break
    }
  }
  return result
}

module.exports = {
  createLogger,
  serializers,
  now
}


/***/ }),
/* 44 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);


function noop () { }

const proto = {
  fatal: noop,
  error: noop,
  warn: noop,
  info: noop,
  debug: noop,
  trace: noop
}

Object.defineProperty(module, 'exports', {
  get () {
    return Object.create(proto)
  }
})


/***/ }),
/* 45 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint no-prototype-builtins: 0 */
const os = __webpack_require__(46)
const stdSerializers = __webpack_require__(47)
const caller = __webpack_require__(52)
const redaction = __webpack_require__(53)
const time = __webpack_require__(64)
const proto = __webpack_require__(65)
const symbols = __webpack_require__(63)
const { configure } = __webpack_require__(84)
const { assertDefaultLevelFound, mappings, genLsCache, levels } = __webpack_require__(66)
const {
  createArgsNormalizer,
  asChindings,
  buildSafeSonicBoom,
  buildFormatters,
  stringify,
  normalizeDestFileDescriptor,
  noop
} = __webpack_require__(67)
const { version } = __webpack_require__(83)
const {
  chindingsSym,
  redactFmtSym,
  serializersSym,
  timeSym,
  timeSliceIndexSym,
  streamSym,
  stringifySym,
  stringifySafeSym,
  stringifiersSym,
  setLevelSym,
  endSym,
  formatOptsSym,
  messageKeySym,
  errorKeySym,
  nestedKeySym,
  mixinSym,
  useOnlyCustomLevelsSym,
  formattersSym,
  hooksSym,
  nestedKeyStrSym,
  mixinMergeStrategySym
} = symbols
const { epochTime, nullTime } = time
const { pid } = process
const hostname = os.hostname()
const defaultErrorSerializer = stdSerializers.err
const defaultOptions = {
  level: 'info',
  levels,
  messageKey: 'msg',
  errorKey: 'err',
  nestedKey: null,
  enabled: true,
  base: { pid, hostname },
  serializers: Object.assign(Object.create(null), {
    err: defaultErrorSerializer
  }),
  formatters: Object.assign(Object.create(null), {
    bindings (bindings) {
      return bindings
    },
    level (label, number) {
      return { level: number }
    }
  }),
  hooks: {
    logMethod: undefined
  },
  timestamp: epochTime,
  name: undefined,
  redact: null,
  customLevels: null,
  useOnlyCustomLevels: false,
  depthLimit: 5,
  edgeLimit: 100
}

const normalize = createArgsNormalizer(defaultOptions)

const serializers = Object.assign(Object.create(null), stdSerializers)

function pino (...args) {
  const instance = {}
  const { opts, stream } = normalize(instance, caller(), ...args)
  const {
    redact,
    crlf,
    serializers,
    timestamp,
    messageKey,
    errorKey,
    nestedKey,
    base,
    name,
    level,
    customLevels,
    mixin,
    mixinMergeStrategy,
    useOnlyCustomLevels,
    formatters,
    hooks,
    depthLimit,
    edgeLimit,
    onChild
  } = opts

  const stringifySafe = configure({
    maximumDepth: depthLimit,
    maximumBreadth: edgeLimit
  })

  const allFormatters = buildFormatters(
    formatters.level,
    formatters.bindings,
    formatters.log
  )

  const stringifiers = redact ? redaction(redact, stringify) : {}
  const stringifyFn = stringify.bind({
    [stringifySafeSym]: stringifySafe
  })
  const formatOpts = redact
    ? { stringify: stringifiers[redactFmtSym] }
    : { stringify: stringifyFn }
  const end = '}' + (crlf ? '\r\n' : '\n')
  const coreChindings = asChindings.bind(null, {
    [chindingsSym]: '',
    [serializersSym]: serializers,
    [stringifiersSym]: stringifiers,
    [stringifySym]: stringify,
    [stringifySafeSym]: stringifySafe,
    [formattersSym]: allFormatters
  })

  let chindings = ''
  if (base !== null) {
    if (name === undefined) {
      chindings = coreChindings(base)
    } else {
      chindings = coreChindings(Object.assign({}, base, { name }))
    }
  }

  const time = (timestamp instanceof Function)
    ? timestamp
    : (timestamp ? epochTime : nullTime)
  const timeSliceIndex = time().indexOf(':') + 1

  if (useOnlyCustomLevels && !customLevels) throw Error('customLevels is required if useOnlyCustomLevels is set true')
  if (mixin && typeof mixin !== 'function') throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`)

  assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels)
  const levels = mappings(customLevels, useOnlyCustomLevels)

  Object.assign(instance, {
    levels,
    [useOnlyCustomLevelsSym]: useOnlyCustomLevels,
    [streamSym]: stream,
    [timeSym]: time,
    [timeSliceIndexSym]: timeSliceIndex,
    [stringifySym]: stringify,
    [stringifySafeSym]: stringifySafe,
    [stringifiersSym]: stringifiers,
    [endSym]: end,
    [formatOptsSym]: formatOpts,
    [messageKeySym]: messageKey,
    [errorKeySym]: errorKey,
    [nestedKeySym]: nestedKey,
    // protect against injection
    [nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : '',
    [serializersSym]: serializers,
    [mixinSym]: mixin,
    [mixinMergeStrategySym]: mixinMergeStrategy,
    [chindingsSym]: chindings,
    [formattersSym]: allFormatters,
    [hooksSym]: hooks,
    silent: noop,
    onChild
  })

  Object.setPrototypeOf(instance, proto())

  genLsCache(instance)

  instance[setLevelSym](level)

  return instance
}

module.exports = pino

module.exports.destination = (dest = process.stdout.fd) => {
  if (typeof dest === 'object') {
    dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd)
    return buildSafeSonicBoom(dest)
  } else {
    return buildSafeSonicBoom({ dest: normalizeDestFileDescriptor(dest), minLength: 0 })
  }
}

module.exports.transport = __webpack_require__(74)
module.exports.multistream = __webpack_require__(85)

module.exports.levels = mappings()
module.exports.stdSerializers = serializers
module.exports.stdTimeFunctions = Object.assign({}, time)
module.exports.symbols = symbols
module.exports.version = version

// Enables default and name export with TypeScript and Babel
module.exports["default"] = pino
module.exports.pino = pino


/***/ }),
/* 46 */
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),
/* 47 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const errSerializer = __webpack_require__(48)
const reqSerializers = __webpack_require__(50)
const resSerializers = __webpack_require__(51)

module.exports = {
  err: errSerializer,
  mapHttpRequest: reqSerializers.mapHttpRequest,
  mapHttpResponse: resSerializers.mapHttpResponse,
  req: reqSerializers.reqSerializer,
  res: resSerializers.resSerializer,

  wrapErrorSerializer: function wrapErrorSerializer (customSerializer) {
    if (customSerializer === errSerializer) return customSerializer
    return function wrapErrSerializer (err) {
      return customSerializer(errSerializer(err))
    }
  },

  wrapRequestSerializer: function wrapRequestSerializer (customSerializer) {
    if (customSerializer === reqSerializers.reqSerializer) return customSerializer
    return function wrappedReqSerializer (req) {
      return customSerializer(reqSerializers.reqSerializer(req))
    }
  },

  wrapResponseSerializer: function wrapResponseSerializer (customSerializer) {
    if (customSerializer === resSerializers.resSerializer) return customSerializer
    return function wrappedResSerializer (res) {
      return customSerializer(resSerializers.resSerializer(res))
    }
  }
}


/***/ }),
/* 48 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = errSerializer

const { messageWithCauses, stackWithCauses } = __webpack_require__(49)

const { toString } = Object.prototype
const seen = Symbol('circular-ref-tag')
const rawSymbol = Symbol('pino-raw-err-ref')
const pinoErrProto = Object.create({}, {
  type: {
    enumerable: true,
    writable: true,
    value: undefined
  },
  message: {
    enumerable: true,
    writable: true,
    value: undefined
  },
  stack: {
    enumerable: true,
    writable: true,
    value: undefined
  },
  aggregateErrors: {
    enumerable: true,
    writable: true,
    value: undefined
  },
  raw: {
    enumerable: false,
    get: function () {
      return this[rawSymbol]
    },
    set: function (val) {
      this[rawSymbol] = val
    }
  }
})
Object.defineProperty(pinoErrProto, rawSymbol, {
  writable: true,
  value: {}
})

function errSerializer (err) {
  if (!(err instanceof Error)) {
    return err
  }

  err[seen] = undefined // tag to prevent re-looking at this
  const _err = Object.create(pinoErrProto)
  _err.type = toString.call(err.constructor) === '[object Function]'
    ? err.constructor.name
    : err.name
  _err.message = messageWithCauses(err)
  _err.stack = stackWithCauses(err)

  if (global.AggregateError !== undefined && err instanceof global.AggregateError && Array.isArray(err.errors)) {
    _err.aggregateErrors = err.errors.map(err => errSerializer(err))
  }

  for (const key in err) {
    if (_err[key] === undefined) {
      const val = err[key]
      if (val instanceof Error) {
        // We append cause messages and stacks to _err, therefore skipping causes here
        if (key !== 'cause' && !Object.prototype.hasOwnProperty.call(val, seen)) {
          _err[key] = errSerializer(val)
        }
      } else {
        _err[key] = val
      }
    }
  }

  delete err[seen] // clean up tag in case err is serialized again later
  _err.raw = err
  return _err
}


/***/ }),
/* 49 */
/***/ ((module) => {

"use strict";


// **************************************************************
// * Code initially copied/adapted from "pony-cause" npm module *
// * Please upstream improvements there                         *
// **************************************************************

/**
 * @param {Error|{ cause?: unknown|(()=>err)}} err
 * @returns {Error|undefined}
 */
const getErrorCause = (err) => {
  if (!err) return

  /** @type {unknown} */
  // @ts-ignore
  const cause = err.cause

  // VError / NError style causes
  if (typeof cause === 'function') {
    // @ts-ignore
    const causeResult = err.cause()

    return causeResult instanceof Error
      ? causeResult
      : undefined
  } else {
    return cause instanceof Error
      ? cause
      : undefined
  }
}

/**
 * Internal method that keeps a track of which error we have already added, to avoid circular recursion
 *
 * @private
 * @param {Error} err
 * @param {Set<Error>} seen
 * @returns {string}
 */
const _stackWithCauses = (err, seen) => {
  if (!(err instanceof Error)) return ''

  const stack = err.stack || ''

  // Ensure we don't go circular or crazily deep
  if (seen.has(err)) {
    return stack + '\ncauses have become circular...'
  }

  const cause = getErrorCause(err)

  if (cause) {
    seen.add(err)
    return (stack + '\ncaused by: ' + _stackWithCauses(cause, seen))
  } else {
    return stack
  }
}

/**
 * @param {Error} err
 * @returns {string}
 */
const stackWithCauses = (err) => _stackWithCauses(err, new Set())

/**
 * Internal method that keeps a track of which error we have already added, to avoid circular recursion
 *
 * @private
 * @param {Error} err
 * @param {Set<Error>} seen
 * @param {boolean} [skip]
 * @returns {string}
 */
const _messageWithCauses = (err, seen, skip) => {
  if (!(err instanceof Error)) return ''

  const message = skip ? '' : (err.message || '')

  // Ensure we don't go circular or crazily deep
  if (seen.has(err)) {
    return message + ': ...'
  }

  const cause = getErrorCause(err)

  if (cause) {
    seen.add(err)

    // @ts-ignore
    const skipIfVErrorStyleCause = typeof err.cause === 'function'

    return (message +
      (skipIfVErrorStyleCause ? '' : ': ') +
      _messageWithCauses(cause, seen, skipIfVErrorStyleCause))
  } else {
    return message
  }
}

/**
 * @param {Error} err
 * @returns {string}
 */
const messageWithCauses = (err) => _messageWithCauses(err, new Set())

module.exports = {
  getErrorCause,
  stackWithCauses,
  messageWithCauses
}


/***/ }),
/* 50 */
/***/ ((module) => {

"use strict";


module.exports = {
  mapHttpRequest,
  reqSerializer
}

const rawSymbol = Symbol('pino-raw-req-ref')
const pinoReqProto = Object.create({}, {
  id: {
    enumerable: true,
    writable: true,
    value: ''
  },
  method: {
    enumerable: true,
    writable: true,
    value: ''
  },
  url: {
    enumerable: true,
    writable: true,
    value: ''
  },
  query: {
    enumerable: true,
    writable: true,
    value: ''
  },
  params: {
    enumerable: true,
    writable: true,
    value: ''
  },
  headers: {
    enumerable: true,
    writable: true,
    value: {}
  },
  remoteAddress: {
    enumerable: true,
    writable: true,
    value: ''
  },
  remotePort: {
    enumerable: true,
    writable: true,
    value: ''
  },
  raw: {
    enumerable: false,
    get: function () {
      return this[rawSymbol]
    },
    set: function (val) {
      this[rawSymbol] = val
    }
  }
})
Object.defineProperty(pinoReqProto, rawSymbol, {
  writable: true,
  value: {}
})

function reqSerializer (req) {
  // req.info is for hapi compat.
  const connection = req.info || req.socket
  const _req = Object.create(pinoReqProto)
  _req.id = (typeof req.id === 'function' ? req.id() : (req.id || (req.info ? req.info.id : undefined)))
  _req.method = req.method
  // req.originalUrl is for expressjs compat.
  if (req.originalUrl) {
    _req.url = req.originalUrl
  } else {
    const path = req.path
    // path for safe hapi compat.
    _req.url = typeof path === 'string' ? path : (req.url ? req.url.path || req.url : undefined)
  }

  if (req.query) {
    _req.query = req.query
  }

  if (req.params) {
    _req.params = req.params
  }

  _req.headers = req.headers
  _req.remoteAddress = connection && connection.remoteAddress
  _req.remotePort = connection && connection.remotePort
  // req.raw is  for hapi compat/equivalence
  _req.raw = req.raw || req
  return _req
}

function mapHttpRequest (req) {
  return {
    req: reqSerializer(req)
  }
}


/***/ }),
/* 51 */
/***/ ((module) => {

"use strict";


module.exports = {
  mapHttpResponse,
  resSerializer
}

const rawSymbol = Symbol('pino-raw-res-ref')
const pinoResProto = Object.create({}, {
  statusCode: {
    enumerable: true,
    writable: true,
    value: 0
  },
  headers: {
    enumerable: true,
    writable: true,
    value: ''
  },
  raw: {
    enumerable: false,
    get: function () {
      return this[rawSymbol]
    },
    set: function (val) {
      this[rawSymbol] = val
    }
  }
})
Object.defineProperty(pinoResProto, rawSymbol, {
  writable: true,
  value: {}
})

function resSerializer (res) {
  const _res = Object.create(pinoResProto)
  _res.statusCode = res.headersSent ? res.statusCode : null
  _res.headers = res.getHeaders ? res.getHeaders() : res._headers
  _res.raw = res
  return _res
}

function mapHttpResponse (res) {
  return {
    res: resSerializer(res)
  }
}


/***/ }),
/* 52 */
/***/ ((module) => {

"use strict";


function noOpPrepareStackTrace (_, stack) {
  return stack
}

module.exports = function getCallers () {
  const originalPrepare = Error.prepareStackTrace
  Error.prepareStackTrace = noOpPrepareStackTrace
  const stack = new Error().stack
  Error.prepareStackTrace = originalPrepare

  if (!Array.isArray(stack)) {
    return undefined
  }

  const entries = stack.slice(2)

  const fileNames = []

  for (const entry of entries) {
    if (!entry) {
      continue
    }

    fileNames.push(entry.getFileName())
  }

  return fileNames
}


/***/ }),
/* 53 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fastRedact = __webpack_require__(54)
const { redactFmtSym, wildcardFirstSym } = __webpack_require__(63)
const { rx, validator } = fastRedact

const validate = validator({
  ERR_PATHS_MUST_BE_STRINGS: () => 'pino – redacted paths must be strings',
  ERR_INVALID_PATH: (s) => `pino – redact paths array contains an invalid path (${s})`
})

const CENSOR = '[Redacted]'
const strict = false // TODO should this be configurable?

function redaction (opts, serialize) {
  const { paths, censor } = handle(opts)

  const shape = paths.reduce((o, str) => {
    rx.lastIndex = 0
    const first = rx.exec(str)
    const next = rx.exec(str)

    // ns is the top-level path segment, brackets + quoting removed.
    let ns = first[1] !== undefined
      ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, '$1')
      : first[0]

    if (ns === '*') {
      ns = wildcardFirstSym
    }

    // top level key:
    if (next === null) {
      o[ns] = null
      return o
    }

    // path with at least two segments:
    // if ns is already redacted at the top level, ignore lower level redactions
    if (o[ns] === null) {
      return o
    }

    const { index } = next
    const nextPath = `${str.substr(index, str.length - 1)}`

    o[ns] = o[ns] || []

    // shape is a mix of paths beginning with literal values and wildcard
    // paths [ "a.b.c", "*.b.z" ] should reduce to a shape of
    // { "a": [ "b.c", "b.z" ], *: [ "b.z" ] }
    // note: "b.z" is in both "a" and * arrays because "a" matches the wildcard.
    // (* entry has wildcardFirstSym as key)
    if (ns !== wildcardFirstSym && o[ns].length === 0) {
      // first time ns's get all '*' redactions so far
      o[ns].push(...(o[wildcardFirstSym] || []))
    }

    if (ns === wildcardFirstSym) {
      // new * path gets added to all previously registered literal ns's.
      Object.keys(o).forEach(function (k) {
        if (o[k]) {
          o[k].push(nextPath)
        }
      })
    }

    o[ns].push(nextPath)
    return o
  }, {})

  // the redactor assigned to the format symbol key
  // provides top level redaction for instances where
  // an object is interpolated into the msg string
  const result = {
    [redactFmtSym]: fastRedact({ paths, censor, serialize, strict })
  }

  const topCensor = (...args) => {
    return typeof censor === 'function' ? serialize(censor(...args)) : serialize(censor)
  }

  return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
    // top level key:
    if (shape[k] === null) {
      o[k] = (value) => topCensor(value, [k])
    } else {
      const wrappedCensor = typeof censor === 'function'
        ? (value, path) => {
            return censor(value, [k, ...path])
          }
        : censor
      o[k] = fastRedact({
        paths: shape[k],
        censor: wrappedCensor,
        serialize,
        strict
      })
    }
    return o
  }, result)
}

function handle (opts) {
  if (Array.isArray(opts)) {
    opts = { paths: opts, censor: CENSOR }
    validate(opts)
    return opts
  }
  let { paths, censor = CENSOR, remove } = opts
  if (Array.isArray(paths) === false) { throw Error('pino – redact must contain an array of strings') }
  if (remove === true) censor = undefined
  validate({ paths, censor })

  return { paths, censor }
}

module.exports = redaction


/***/ }),
/* 54 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const validator = __webpack_require__(55)
const parse = __webpack_require__(57)
const redactor = __webpack_require__(59)
const restorer = __webpack_require__(60)
const { groupRedact, nestedRedact } = __webpack_require__(61)
const state = __webpack_require__(62)
const rx = __webpack_require__(58)
const validate = validator()
const noop = (o) => o
noop.restore = noop

const DEFAULT_CENSOR = '[REDACTED]'
fastRedact.rx = rx
fastRedact.validator = validator

module.exports = fastRedact

function fastRedact (opts = {}) {
  const paths = Array.from(new Set(opts.paths || []))
  const serialize = 'serialize' in opts ? (
    opts.serialize === false ? opts.serialize
      : (typeof opts.serialize === 'function' ? opts.serialize : JSON.stringify)
  ) : JSON.stringify
  const remove = opts.remove
  if (remove === true && serialize !== JSON.stringify) {
    throw Error('fast-redact – remove option may only be set when serializer is JSON.stringify')
  }
  const censor = remove === true
    ? undefined
    : 'censor' in opts ? opts.censor : DEFAULT_CENSOR

  const isCensorFct = typeof censor === 'function'
  const censorFctTakesPath = isCensorFct && censor.length > 1

  if (paths.length === 0) return serialize || noop

  validate({ paths, serialize, censor })

  const { wildcards, wcLen, secret } = parse({ paths, censor })

  const compileRestore = restorer({ secret, wcLen })
  const strict = 'strict' in opts ? opts.strict : true

  return redactor({ secret, wcLen, serialize, strict, isCensorFct, censorFctTakesPath }, state({
    secret,
    censor,
    compileRestore,
    serialize,
    groupRedact,
    nestedRedact,
    wildcards,
    wcLen
  }))
}


/***/ }),
/* 55 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { createContext, runInContext } = __webpack_require__(56)

module.exports = validator

function validator (opts = {}) {
  const {
    ERR_PATHS_MUST_BE_STRINGS = () => 'fast-redact - Paths must be (non-empty) strings',
    ERR_INVALID_PATH = (s) => `fast-redact – Invalid path (${s})`
  } = opts

  return function validate ({ paths }) {
    paths.forEach((s) => {
      if (typeof s !== 'string') {
        throw Error(ERR_PATHS_MUST_BE_STRINGS())
      }
      try {
        if (/〇/.test(s)) throw Error()
        const proxy = new Proxy({}, { get: () => proxy, set: () => { throw Error() } })
        const expr = (s[0] === '[' ? '' : '.') + s.replace(/^\*/, '〇').replace(/\.\*/g, '.〇').replace(/\[\*\]/g, '[〇]')
        if (/\n|\r|;/.test(expr)) throw Error()
        if (/\/\*/.test(expr)) throw Error()
        runInContext(`
          (function () {
            'use strict'
            o${expr}
            if ([o${expr}].length !== 1) throw Error()
          })()
        `, createContext({ o: proxy, 〇: null }), {
          codeGeneration: { strings: false, wasm: false }
        })
      } catch (e) {
        throw Error(ERR_INVALID_PATH(s))
      }
    })
  }
}


/***/ }),
/* 56 */
/***/ ((module) => {

"use strict";
module.exports = require("vm");

/***/ }),
/* 57 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const rx = __webpack_require__(58)

module.exports = parse

function parse ({ paths }) {
  const wildcards = []
  var wcLen = 0
  const secret = paths.reduce(function (o, strPath, ix) {
    var path = strPath.match(rx).map((p) => p.replace(/'|"|`/g, ''))
    const leadingBracket = strPath[0] === '['
    path = path.map((p) => {
      if (p[0] === '[') return p.substr(1, p.length - 2)
      else return p
    })
    const star = path.indexOf('*')
    if (star > -1) {
      const before = path.slice(0, star)
      const beforeStr = before.join('.')
      const after = path.slice(star + 1, path.length)
      const nested = after.length > 0
      wcLen++
      wildcards.push({
        before,
        beforeStr,
        after,
        nested
      })
    } else {
      o[strPath] = {
        path: path,
        val: undefined,
        precensored: false,
        circle: '',
        escPath: JSON.stringify(strPath),
        leadingBracket: leadingBracket
      }
    }
    return o
  }, {})

  return { wildcards, wcLen, secret }
}


/***/ }),
/* 58 */
/***/ ((module) => {

"use strict";


module.exports = /[^.[\]]+|\[((?:.)*?)\]/g

/*
Regular expression explanation:

Alt 1: /[^.[\]]+/ - Match one or more characters that are *not* a dot (.)
                    opening square bracket ([) or closing square bracket (])

Alt 2: /\[((?:.)*?)\]/ - If the char IS dot or square bracket, then create a capture
                         group (which will be capture group $1) that matches anything
                         within square brackets. Expansion is lazy so it will
                         stop matching as soon as the first closing bracket is met `]`
                         (rather than continuing to match until the final closing bracket).
*/


/***/ }),
/* 59 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const rx = __webpack_require__(58)

module.exports = redactor

function redactor ({ secret, serialize, wcLen, strict, isCensorFct, censorFctTakesPath }, state) {
  /* eslint-disable-next-line */
  const redact = Function('o', `
    if (typeof o !== 'object' || o == null) {
      ${strictImpl(strict, serialize)}
    }
    const { censor, secret } = this
    ${redactTmpl(secret, isCensorFct, censorFctTakesPath)}
    this.compileRestore()
    ${dynamicRedactTmpl(wcLen > 0, isCensorFct, censorFctTakesPath)}
    ${resultTmpl(serialize)}
  `).bind(state)

  if (serialize === false) {
    redact.restore = (o) => state.restore(o)
  }

  return redact
}

function redactTmpl (secret, isCensorFct, censorFctTakesPath) {
  return Object.keys(secret).map((path) => {
    const { escPath, leadingBracket, path: arrPath } = secret[path]
    const skip = leadingBracket ? 1 : 0
    const delim = leadingBracket ? '' : '.'
    const hops = []
    var match
    while ((match = rx.exec(path)) !== null) {
      const [ , ix ] = match
      const { index, input } = match
      if (index > skip) hops.push(input.substring(0, index - (ix ? 0 : 1)))
    }
    var existence = hops.map((p) => `o${delim}${p}`).join(' && ')
    if (existence.length === 0) existence += `o${delim}${path} != null`
    else existence += ` && o${delim}${path} != null`

    const circularDetection = `
      switch (true) {
        ${hops.reverse().map((p) => `
          case o${delim}${p} === censor:
            secret[${escPath}].circle = ${JSON.stringify(p)}
            break
        `).join('\n')}
      }
    `

    const censorArgs = censorFctTakesPath
      ? `val, ${JSON.stringify(arrPath)}`
      : `val`

    return `
      if (${existence}) {
        const val = o${delim}${path}
        if (val === censor) {
          secret[${escPath}].precensored = true
        } else {
          secret[${escPath}].val = val
          o${delim}${path} = ${isCensorFct ? `censor(${censorArgs})` : 'censor'}
          ${circularDetection}
        }
      }
    `
  }).join('\n')
}

function dynamicRedactTmpl (hasWildcards, isCensorFct, censorFctTakesPath) {
  return hasWildcards === true ? `
    {
      const { wildcards, wcLen, groupRedact, nestedRedact } = this
      for (var i = 0; i < wcLen; i++) {
        const { before, beforeStr, after, nested } = wildcards[i]
        if (nested === true) {
          secret[beforeStr] = secret[beforeStr] || []
          nestedRedact(secret[beforeStr], o, before, after, censor, ${isCensorFct}, ${censorFctTakesPath})
        } else secret[beforeStr] = groupRedact(o, before, censor, ${isCensorFct}, ${censorFctTakesPath})
      }
    }
  ` : ''
}

function resultTmpl (serialize) {
  return serialize === false ? `return o` : `
    var s = this.serialize(o)
    this.restore(o)
    return s
  `
}

function strictImpl (strict, serialize) {
  return strict === true
    ? `throw Error('fast-redact: primitives cannot be redacted')`
    : serialize === false ? `return o` : `return this.serialize(o)`
}


/***/ }),
/* 60 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { groupRestore, nestedRestore } = __webpack_require__(61)

module.exports = restorer

function restorer ({ secret, wcLen }) {
  return function compileRestore () {
    if (this.restore) return
    const paths = Object.keys(secret)
    const resetters = resetTmpl(secret, paths)
    const hasWildcards = wcLen > 0
    const state = hasWildcards ? { secret, groupRestore, nestedRestore } : { secret }
    /* eslint-disable-next-line */
    this.restore = Function(
      'o',
      restoreTmpl(resetters, paths, hasWildcards)
    ).bind(state)
  }
}

/**
 * Mutates the original object to be censored by restoring its original values
 * prior to censoring.
 *
 * @param {object} secret Compiled object describing which target fields should
 * be censored and the field states.
 * @param {string[]} paths The list of paths to censor as provided at
 * initialization time.
 *
 * @returns {string} String of JavaScript to be used by `Function()`. The
 * string compiles to the function that does the work in the description.
 */
function resetTmpl (secret, paths) {
  return paths.map((path) => {
    const { circle, escPath, leadingBracket } = secret[path]
    const delim = leadingBracket ? '' : '.'
    const reset = circle
      ? `o.${circle} = secret[${escPath}].val`
      : `o${delim}${path} = secret[${escPath}].val`
    const clear = `secret[${escPath}].val = undefined`
    return `
      if (secret[${escPath}].val !== undefined) {
        try { ${reset} } catch (e) {}
        ${clear}
      }
    `
  }).join('')
}

/**
 * Creates the body of the restore function
 *
 * Restoration of the redacted object happens
 * backwards, in reverse order of redactions,
 * so that repeated redactions on the same object
 * property can be eventually rolled back to the
 * original value.
 *
 * This way dynamic redactions are restored first,
 * starting from the last one working backwards and
 * followed by the static ones.
 *
 * @returns {string} the body of the restore function
 */
function restoreTmpl (resetters, paths, hasWildcards) {
  const dynamicReset = hasWildcards === true ? `
    const keys = Object.keys(secret)
    const len = keys.length
    for (var i = len - 1; i >= ${paths.length}; i--) {
      const k = keys[i]
      const o = secret[k]
      if (o.flat === true) this.groupRestore(o)
      else this.nestedRestore(o)
      secret[k] = null
    }
  ` : ''

  return `
    const secret = this.secret
    ${dynamicReset}
    ${resetters}
    return o
  `
}


/***/ }),
/* 61 */
/***/ ((module) => {

"use strict";


module.exports = {
  groupRedact,
  groupRestore,
  nestedRedact,
  nestedRestore
}

function groupRestore ({ keys, values, target }) {
  if (target == null) return
  const length = keys.length
  for (var i = 0; i < length; i++) {
    const k = keys[i]
    target[k] = values[i]
  }
}

function groupRedact (o, path, censor, isCensorFct, censorFctTakesPath) {
  const target = get(o, path)
  if (target == null) return { keys: null, values: null, target: null, flat: true }
  const keys = Object.keys(target)
  const keysLength = keys.length
  const pathLength = path.length
  const pathWithKey = censorFctTakesPath ? [...path] : undefined
  const values = new Array(keysLength)

  for (var i = 0; i < keysLength; i++) {
    const key = keys[i]
    values[i] = target[key]

    if (censorFctTakesPath) {
      pathWithKey[pathLength] = key
      target[key] = censor(target[key], pathWithKey)
    } else if (isCensorFct) {
      target[key] = censor(target[key])
    } else {
      target[key] = censor
    }
  }
  return { keys, values, target, flat: true }
}

function nestedRestore (arr) {
  const length = arr.length
  for (var i = 0; i < length; i++) {
    const { key, target, value } = arr[i]
    if (has(target, key)) {
      target[key] = value
    }
    /* istanbul ignore else */
    if (typeof target === 'object') {
      const targetKeys = Object.keys(target)
      for (var j = 0; j < targetKeys.length; j++) {
        const tKey = targetKeys[j]
        const subTarget = target[tKey]
        if (has(subTarget, key)) {
          subTarget[key] = value
        }
      }
    }
  }
}

function nestedRedact (store, o, path, ns, censor, isCensorFct, censorFctTakesPath) {
  const target = get(o, path)
  if (target == null) return
  const keys = Object.keys(target)
  const keysLength = keys.length
  for (var i = 0; i < keysLength; i++) {
    const key = keys[i]
    const { value, parent, exists } =
      specialSet(target, key, path, ns, censor, isCensorFct, censorFctTakesPath)

    if (exists === true && parent !== null) {
      store.push({ key: ns[ns.length - 1], target: parent, value })
    }
  }
  return store
}

function has (obj, prop) {
  return obj !== undefined && obj !== null
    ? ('hasOwn' in Object ? Object.hasOwn(obj, prop) : Object.prototype.hasOwnProperty.call(obj, prop))
    : false
}

function specialSet (o, k, path, afterPath, censor, isCensorFct, censorFctTakesPath) {
  const afterPathLen = afterPath.length
  const lastPathIndex = afterPathLen - 1
  const originalKey = k
  var i = -1
  var n
  var nv
  var ov
  var oov = null
  var exists = true
  var wc = null
  ov = n = o[k]
  if (typeof n !== 'object') return { value: null, parent: null, exists }
  while (n != null && ++i < afterPathLen) {
    k = afterPath[i]
    oov = ov
    if (k !== '*' && !wc && !(typeof n === 'object' && k in n)) {
      exists = false
      break
    }
    if (k === '*') {
      wc = k
      if (i !== lastPathIndex) {
        continue
      }
    }
    if (wc) {
      const wcKeys = Object.keys(n)
      for (var j = 0; j < wcKeys.length; j++) {
        const wck = wcKeys[j]
        const wcov = n[wck]
        const kIsWc = k === '*'
        if (kIsWc || (typeof wcov === 'object' && wcov !== null && k in wcov)) {
          if (kIsWc) {
            ov = wcov
          } else {
            ov = wcov[k]
          }
          nv = (i !== lastPathIndex)
            ? ov
            : (isCensorFct
              ? (censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov))
              : censor)
          if (kIsWc) {
            n[wck] = nv
          } else {
            if (wcov[k] === nv) {
              exists = false
            } else {
              wcov[k] = (nv === undefined && censor !== undefined) || (has(wcov, k) && nv === ov) ? wcov[k] : nv
            }
          }
        }
      }
      wc = null
    } else {
      ov = n[k]
      nv = (i !== lastPathIndex)
        ? ov
        : (isCensorFct
          ? (censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov))
          : censor)
      n[k] = (has(n, k) && nv === ov) || (nv === undefined && censor !== undefined) ? n[k] : nv
      n = n[k]
    }
    if (typeof n !== 'object') break
    // prevent circular structure, see https://github.com/pinojs/pino/issues/1513
    if (ov === oov) {
      exists = false
    }
  }
  return { value: ov, parent: oov, exists }
}

function get (o, p) {
  var i = -1
  var l = p.length
  var n = o
  while (n != null && ++i < l) {
    n = n[p[i]]
  }
  return n
}


/***/ }),
/* 62 */
/***/ ((module) => {

"use strict";


module.exports = state

function state (o) {
  const {
    secret,
    censor,
    compileRestore,
    serialize,
    groupRedact,
    nestedRedact,
    wildcards,
    wcLen
  } = o
  const builder = [{ secret, censor, compileRestore }]
  if (serialize !== false) builder.push({ serialize })
  if (wcLen > 0) builder.push({ groupRedact, nestedRedact, wildcards, wcLen })
  return Object.assign(...builder)
}


/***/ }),
/* 63 */
/***/ ((module) => {

"use strict";


const setLevelSym = Symbol('pino.setLevel')
const getLevelSym = Symbol('pino.getLevel')
const levelValSym = Symbol('pino.levelVal')
const useLevelLabelsSym = Symbol('pino.useLevelLabels')
const useOnlyCustomLevelsSym = Symbol('pino.useOnlyCustomLevels')
const mixinSym = Symbol('pino.mixin')

const lsCacheSym = Symbol('pino.lsCache')
const chindingsSym = Symbol('pino.chindings')

const asJsonSym = Symbol('pino.asJson')
const writeSym = Symbol('pino.write')
const redactFmtSym = Symbol('pino.redactFmt')

const timeSym = Symbol('pino.time')
const timeSliceIndexSym = Symbol('pino.timeSliceIndex')
const streamSym = Symbol('pino.stream')
const stringifySym = Symbol('pino.stringify')
const stringifySafeSym = Symbol('pino.stringifySafe')
const stringifiersSym = Symbol('pino.stringifiers')
const endSym = Symbol('pino.end')
const formatOptsSym = Symbol('pino.formatOpts')
const messageKeySym = Symbol('pino.messageKey')
const errorKeySym = Symbol('pino.errorKey')
const nestedKeySym = Symbol('pino.nestedKey')
const nestedKeyStrSym = Symbol('pino.nestedKeyStr')
const mixinMergeStrategySym = Symbol('pino.mixinMergeStrategy')

const wildcardFirstSym = Symbol('pino.wildcardFirst')

// public symbols, no need to use the same pino
// version for these
const serializersSym = Symbol.for('pino.serializers')
const formattersSym = Symbol.for('pino.formatters')
const hooksSym = Symbol.for('pino.hooks')
const needsMetadataGsym = Symbol.for('pino.metadata')

module.exports = {
  setLevelSym,
  getLevelSym,
  levelValSym,
  useLevelLabelsSym,
  mixinSym,
  lsCacheSym,
  chindingsSym,
  asJsonSym,
  writeSym,
  serializersSym,
  redactFmtSym,
  timeSym,
  timeSliceIndexSym,
  streamSym,
  stringifySym,
  stringifySafeSym,
  stringifiersSym,
  endSym,
  formatOptsSym,
  messageKeySym,
  errorKeySym,
  nestedKeySym,
  wildcardFirstSym,
  needsMetadataGsym,
  useOnlyCustomLevelsSym,
  formattersSym,
  hooksSym,
  nestedKeyStrSym,
  mixinMergeStrategySym
}


/***/ }),
/* 64 */
/***/ ((module) => {

"use strict";


const nullTime = () => ''

const epochTime = () => `,"time":${Date.now()}`

const unixTime = () => `,"time":${Math.round(Date.now() / 1000.0)}`

const isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"` // using Date.now() for testability

module.exports = { nullTime, epochTime, unixTime, isoTime }


/***/ }),
/* 65 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* eslint no-prototype-builtins: 0 */

const { EventEmitter } = __webpack_require__(20)
const {
  lsCacheSym,
  levelValSym,
  setLevelSym,
  getLevelSym,
  chindingsSym,
  parsedChindingsSym,
  mixinSym,
  asJsonSym,
  writeSym,
  mixinMergeStrategySym,
  timeSym,
  timeSliceIndexSym,
  streamSym,
  serializersSym,
  formattersSym,
  errorKeySym,
  useOnlyCustomLevelsSym,
  needsMetadataGsym,
  redactFmtSym,
  stringifySym,
  formatOptsSym,
  stringifiersSym
} = __webpack_require__(63)
const {
  getLevel,
  setLevel,
  isLevelEnabled,
  mappings,
  initialLsCache,
  genLsCache,
  assertNoLevelCollisions
} = __webpack_require__(66)
const {
  asChindings,
  asJson,
  buildFormatters,
  stringify
} = __webpack_require__(67)
const {
  version
} = __webpack_require__(83)
const redaction = __webpack_require__(53)

// note: use of class is satirical
// https://github.com/pinojs/pino/pull/433#pullrequestreview-127703127
const constructor = class Pino {}
const prototype = {
  constructor,
  child,
  bindings,
  setBindings,
  flush,
  isLevelEnabled,
  version,
  get level () { return this[getLevelSym]() },
  set level (lvl) { this[setLevelSym](lvl) },
  get levelVal () { return this[levelValSym] },
  set levelVal (n) { throw Error('levelVal is read-only') },
  [lsCacheSym]: initialLsCache,
  [writeSym]: write,
  [asJsonSym]: asJson,
  [getLevelSym]: getLevel,
  [setLevelSym]: setLevel
}

Object.setPrototypeOf(prototype, EventEmitter.prototype)

// exporting and consuming the prototype object using factory pattern fixes scoping issues with getters when serializing
module.exports = function () {
  return Object.create(prototype)
}

const resetChildingsFormatter = bindings => bindings
function child (bindings, options) {
  if (!bindings) {
    throw Error('missing bindings for child Pino')
  }
  options = options || {} // default options to empty object
  const serializers = this[serializersSym]
  const formatters = this[formattersSym]
  const instance = Object.create(this)

  if (options.hasOwnProperty('serializers') === true) {
    instance[serializersSym] = Object.create(null)

    for (const k in serializers) {
      instance[serializersSym][k] = serializers[k]
    }
    const parentSymbols = Object.getOwnPropertySymbols(serializers)
    /* eslint no-var: off */
    for (var i = 0; i < parentSymbols.length; i++) {
      const ks = parentSymbols[i]
      instance[serializersSym][ks] = serializers[ks]
    }

    for (const bk in options.serializers) {
      instance[serializersSym][bk] = options.serializers[bk]
    }
    const bindingsSymbols = Object.getOwnPropertySymbols(options.serializers)
    for (var bi = 0; bi < bindingsSymbols.length; bi++) {
      const bks = bindingsSymbols[bi]
      instance[serializersSym][bks] = options.serializers[bks]
    }
  } else instance[serializersSym] = serializers
  if (options.hasOwnProperty('formatters')) {
    const { level, bindings: chindings, log } = options.formatters
    instance[formattersSym] = buildFormatters(
      level || formatters.level,
      chindings || resetChildingsFormatter,
      log || formatters.log
    )
  } else {
    instance[formattersSym] = buildFormatters(
      formatters.level,
      resetChildingsFormatter,
      formatters.log
    )
  }
  if (options.hasOwnProperty('customLevels') === true) {
    assertNoLevelCollisions(this.levels, options.customLevels)
    instance.levels = mappings(options.customLevels, instance[useOnlyCustomLevelsSym])
    genLsCache(instance)
  }

  // redact must place before asChindings and only replace if exist
  if ((typeof options.redact === 'object' && options.redact !== null) || Array.isArray(options.redact)) {
    instance.redact = options.redact // replace redact directly
    const stringifiers = redaction(instance.redact, stringify)
    const formatOpts = { stringify: stringifiers[redactFmtSym] }
    instance[stringifySym] = stringify
    instance[stringifiersSym] = stringifiers
    instance[formatOptsSym] = formatOpts
  }

  instance[chindingsSym] = asChindings(instance, bindings)
  const childLevel = options.level || this.level
  instance[setLevelSym](childLevel)
  this.onChild(instance)
  return instance
}

function bindings () {
  const chindings = this[chindingsSym]
  const chindingsJson = `{${chindings.substr(1)}}` // at least contains ,"pid":7068,"hostname":"myMac"
  const bindingsFromJson = JSON.parse(chindingsJson)
  delete bindingsFromJson.pid
  delete bindingsFromJson.hostname
  return bindingsFromJson
}

function setBindings (newBindings) {
  const chindings = asChindings(this, newBindings)
  this[chindingsSym] = chindings
  delete this[parsedChindingsSym]
}

/**
 * Default strategy for creating `mergeObject` from arguments and the result from `mixin()`.
 * Fields from `mergeObject` have higher priority in this strategy.
 *
 * @param {Object} mergeObject The object a user has supplied to the logging function.
 * @param {Object} mixinObject The result of the `mixin` method.
 * @return {Object}
 */
function defaultMixinMergeStrategy (mergeObject, mixinObject) {
  return Object.assign(mixinObject, mergeObject)
}

function write (_obj, msg, num) {
  const t = this[timeSym]()
  const mixin = this[mixinSym]
  const errorKey = this[errorKeySym]
  const mixinMergeStrategy = this[mixinMergeStrategySym] || defaultMixinMergeStrategy
  let obj

  if (_obj === undefined || _obj === null) {
    obj = {}
  } else if (_obj instanceof Error) {
    obj = { [errorKey]: _obj }
    if (msg === undefined) {
      msg = _obj.message
    }
  } else {
    obj = _obj
    if (msg === undefined && _obj[errorKey]) {
      msg = _obj[errorKey].message
    }
  }

  if (mixin) {
    obj = mixinMergeStrategy(obj, mixin(obj, num))
  }

  const s = this[asJsonSym](obj, msg, num, t)

  const stream = this[streamSym]
  if (stream[needsMetadataGsym] === true) {
    stream.lastLevel = num
    stream.lastObj = obj
    stream.lastMsg = msg
    stream.lastTime = t.slice(this[timeSliceIndexSym])
    stream.lastLogger = this // for child loggers
  }
  stream.write(s)
}

function noop () {}

function flush () {
  const stream = this[streamSym]
  if ('flush' in stream) stream.flush(noop)
}


/***/ }),
/* 66 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint no-prototype-builtins: 0 */
const {
  lsCacheSym,
  levelValSym,
  useOnlyCustomLevelsSym,
  streamSym,
  formattersSym,
  hooksSym
} = __webpack_require__(63)
const { noop, genLog } = __webpack_require__(67)

const levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
}
const levelMethods = {
  fatal: (hook) => {
    const logFatal = genLog(levels.fatal, hook)
    return function (...args) {
      const stream = this[streamSym]
      logFatal.call(this, ...args)
      if (typeof stream.flushSync === 'function') {
        try {
          stream.flushSync()
        } catch (e) {
          // https://github.com/pinojs/pino/pull/740#discussion_r346788313
        }
      }
    }
  },
  error: (hook) => genLog(levels.error, hook),
  warn: (hook) => genLog(levels.warn, hook),
  info: (hook) => genLog(levels.info, hook),
  debug: (hook) => genLog(levels.debug, hook),
  trace: (hook) => genLog(levels.trace, hook)
}

const nums = Object.keys(levels).reduce((o, k) => {
  o[levels[k]] = k
  return o
}, {})

const initialLsCache = Object.keys(nums).reduce((o, k) => {
  o[k] = '{"level":' + Number(k)
  return o
}, {})

function genLsCache (instance) {
  const formatter = instance[formattersSym].level
  const { labels } = instance.levels
  const cache = {}
  for (const label in labels) {
    const level = formatter(labels[label], Number(label))
    cache[label] = JSON.stringify(level).slice(0, -1)
  }
  instance[lsCacheSym] = cache
  return instance
}

function isStandardLevel (level, useOnlyCustomLevels) {
  if (useOnlyCustomLevels) {
    return false
  }

  switch (level) {
    case 'fatal':
    case 'error':
    case 'warn':
    case 'info':
    case 'debug':
    case 'trace':
      return true
    default:
      return false
  }
}

function setLevel (level) {
  const { labels, values } = this.levels
  if (typeof level === 'number') {
    if (labels[level] === undefined) throw Error('unknown level value' + level)
    level = labels[level]
  }
  if (values[level] === undefined) throw Error('unknown level ' + level)
  const preLevelVal = this[levelValSym]
  const levelVal = this[levelValSym] = values[level]
  const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym]
  const hook = this[hooksSym].logMethod

  for (const key in values) {
    if (levelVal > values[key]) {
      this[key] = noop
      continue
    }
    this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook)
  }

  this.emit(
    'level-change',
    level,
    levelVal,
    labels[preLevelVal],
    preLevelVal
  )
}

function getLevel (level) {
  const { levels, levelVal } = this
  // protection against potential loss of Pino scope from serializers (edge case with circular refs - https://github.com/pinojs/pino/issues/833)
  return (levels && levels.labels) ? levels.labels[levelVal] : ''
}

function isLevelEnabled (logLevel) {
  const { values } = this.levels
  const logLevelVal = values[logLevel]
  return logLevelVal !== undefined && (logLevelVal >= this[levelValSym])
}

function mappings (customLevels = null, useOnlyCustomLevels = false) {
  const customNums = customLevels
    /* eslint-disable */
    ? Object.keys(customLevels).reduce((o, k) => {
        o[customLevels[k]] = k
        return o
      }, {})
    : null
    /* eslint-enable */

  const labels = Object.assign(
    Object.create(Object.prototype, { Infinity: { value: 'silent' } }),
    useOnlyCustomLevels ? null : nums,
    customNums
  )
  const values = Object.assign(
    Object.create(Object.prototype, { silent: { value: Infinity } }),
    useOnlyCustomLevels ? null : levels,
    customLevels
  )
  return { labels, values }
}

function assertDefaultLevelFound (defaultLevel, customLevels, useOnlyCustomLevels) {
  if (typeof defaultLevel === 'number') {
    const values = [].concat(
      Object.keys(customLevels || {}).map(key => customLevels[key]),
      useOnlyCustomLevels ? [] : Object.keys(nums).map(level => +level),
      Infinity
    )
    if (!values.includes(defaultLevel)) {
      throw Error(`default level:${defaultLevel} must be included in custom levels`)
    }
    return
  }

  const labels = Object.assign(
    Object.create(Object.prototype, { silent: { value: Infinity } }),
    useOnlyCustomLevels ? null : levels,
    customLevels
  )
  if (!(defaultLevel in labels)) {
    throw Error(`default level:${defaultLevel} must be included in custom levels`)
  }
}

function assertNoLevelCollisions (levels, customLevels) {
  const { labels, values } = levels
  for (const k in customLevels) {
    if (k in values) {
      throw Error('levels cannot be overridden')
    }
    if (customLevels[k] in labels) {
      throw Error('pre-existing level values cannot be used for new levels')
    }
  }
}

module.exports = {
  initialLsCache,
  genLsCache,
  levelMethods,
  getLevel,
  setLevel,
  isLevelEnabled,
  mappings,
  levels,
  assertNoLevelCollisions,
  assertDefaultLevelFound
}


/***/ }),
/* 67 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* eslint no-prototype-builtins: 0 */

const format = __webpack_require__(68)
const { mapHttpRequest, mapHttpResponse } = __webpack_require__(47)
const SonicBoom = __webpack_require__(69)
const onExit = __webpack_require__(72)
const {
  lsCacheSym,
  chindingsSym,
  writeSym,
  serializersSym,
  formatOptsSym,
  endSym,
  stringifiersSym,
  stringifySym,
  stringifySafeSym,
  wildcardFirstSym,
  nestedKeySym,
  formattersSym,
  messageKeySym,
  nestedKeyStrSym
} = __webpack_require__(63)
const { isMainThread } = __webpack_require__(73)
const transport = __webpack_require__(74)

function noop () {}

function genLog (level, hook) {
  if (!hook) return LOG

  return function hookWrappedLog (...args) {
    hook.call(this, args, LOG, level)
  }

  function LOG (o, ...n) {
    if (typeof o === 'object') {
      let msg = o
      if (o !== null) {
        if (o.method && o.headers && o.socket) {
          o = mapHttpRequest(o)
        } else if (typeof o.setHeader === 'function') {
          o = mapHttpResponse(o)
        }
      }
      let formatParams
      if (msg === null && n.length === 0) {
        formatParams = [null]
      } else {
        msg = n.shift()
        formatParams = n
      }
      this[writeSym](o, format(msg, formatParams, this[formatOptsSym]), level)
    } else {
      this[writeSym](null, format(o, n, this[formatOptsSym]), level)
    }
  }
}

// magically escape strings for json
// relying on their charCodeAt
// everything below 32 needs JSON.stringify()
// 34 and 92 happens all the time, so we
// have a fast case for them
function asString (str) {
  let result = ''
  let last = 0
  let found = false
  let point = 255
  const l = str.length
  if (l > 100) {
    return JSON.stringify(str)
  }
  for (var i = 0; i < l && point >= 32; i++) {
    point = str.charCodeAt(i)
    if (point === 34 || point === 92) {
      result += str.slice(last, i) + '\\'
      last = i
      found = true
    }
  }
  if (!found) {
    result = str
  } else {
    result += str.slice(last)
  }
  return point < 32 ? JSON.stringify(str) : '"' + result + '"'
}

function asJson (obj, msg, num, time) {
  const stringify = this[stringifySym]
  const stringifySafe = this[stringifySafeSym]
  const stringifiers = this[stringifiersSym]
  const end = this[endSym]
  const chindings = this[chindingsSym]
  const serializers = this[serializersSym]
  const formatters = this[formattersSym]
  const messageKey = this[messageKeySym]
  let data = this[lsCacheSym][num] + time

  // we need the child bindings added to the output first so instance logged
  // objects can take precedence when JSON.parse-ing the resulting log line
  data = data + chindings

  let value
  if (formatters.log) {
    obj = formatters.log(obj)
  }
  const wildcardStringifier = stringifiers[wildcardFirstSym]
  let propStr = ''
  for (const key in obj) {
    value = obj[key]
    if (Object.prototype.hasOwnProperty.call(obj, key) && value !== undefined) {
      value = serializers[key] ? serializers[key](value) : value

      const stringifier = stringifiers[key] || wildcardStringifier

      switch (typeof value) {
        case 'undefined':
        case 'function':
          continue
        case 'number':
          /* eslint no-fallthrough: "off" */
          if (Number.isFinite(value) === false) {
            value = null
          }
        // this case explicitly falls through to the next one
        case 'boolean':
          if (stringifier) value = stringifier(value)
          break
        case 'string':
          value = (stringifier || asString)(value)
          break
        default:
          value = (stringifier || stringify)(value, stringifySafe)
      }
      if (value === undefined) continue
      propStr += ',"' + key + '":' + value
    }
  }

  let msgStr = ''
  if (msg !== undefined) {
    value = serializers[messageKey] ? serializers[messageKey](msg) : msg
    const stringifier = stringifiers[messageKey] || wildcardStringifier

    switch (typeof value) {
      case 'function':
        break
      case 'number':
        /* eslint no-fallthrough: "off" */
        if (Number.isFinite(value) === false) {
          value = null
        }
      // this case explicitly falls through to the next one
      case 'boolean':
        if (stringifier) value = stringifier(value)
        msgStr = ',"' + messageKey + '":' + value
        break
      case 'string':
        value = (stringifier || asString)(value)
        msgStr = ',"' + messageKey + '":' + value
        break
      default:
        value = (stringifier || stringify)(value, stringifySafe)
        msgStr = ',"' + messageKey + '":' + value
    }
  }

  if (this[nestedKeySym] && propStr) {
    // place all the obj properties under the specified key
    // the nested key is already formatted from the constructor
    return data + this[nestedKeyStrSym] + propStr.slice(1) + '}' + msgStr + end
  } else {
    return data + propStr + msgStr + end
  }
}

function asChindings (instance, bindings) {
  let value
  let data = instance[chindingsSym]
  const stringify = instance[stringifySym]
  const stringifySafe = instance[stringifySafeSym]
  const stringifiers = instance[stringifiersSym]
  const wildcardStringifier = stringifiers[wildcardFirstSym]
  const serializers = instance[serializersSym]
  const formatter = instance[formattersSym].bindings
  bindings = formatter(bindings)

  for (const key in bindings) {
    value = bindings[key]
    const valid = key !== 'level' &&
      key !== 'serializers' &&
      key !== 'formatters' &&
      key !== 'customLevels' &&
      bindings.hasOwnProperty(key) &&
      value !== undefined
    if (valid === true) {
      value = serializers[key] ? serializers[key](value) : value
      value = (stringifiers[key] || wildcardStringifier || stringify)(value, stringifySafe)
      if (value === undefined) continue
      data += ',"' + key + '":' + value
    }
  }
  return data
}

function hasBeenTampered (stream) {
  return stream.write !== stream.constructor.prototype.write
}

function buildSafeSonicBoom (opts) {
  const stream = new SonicBoom(opts)
  stream.on('error', filterBrokenPipe)
  // if we are sync: false, we must flush on exit
  if (!opts.sync && isMainThread) {
    onExit.register(stream, autoEnd)

    stream.on('close', function () {
      onExit.unregister(stream)
    })
  }
  return stream

  function filterBrokenPipe (err) {
    // Impossible to replicate across all operating systems
    /* istanbul ignore next */
    if (err.code === 'EPIPE') {
      // If we get EPIPE, we should stop logging here
      // however we have no control to the consumer of
      // SonicBoom, so we just overwrite the write method
      stream.write = noop
      stream.end = noop
      stream.flushSync = noop
      stream.destroy = noop
      return
    }
    stream.removeListener('error', filterBrokenPipe)
    stream.emit('error', err)
  }
}

function autoEnd (stream, eventName) {
  // This check is needed only on some platforms
  /* istanbul ignore next */
  if (stream.destroyed) {
    return
  }

  if (eventName === 'beforeExit') {
    // We still have an event loop, let's use it
    stream.flush()
    stream.on('drain', function () {
      stream.end()
    })
  } else {
    // For some reason istanbul is not detecting this, but it's there
    /* istanbul ignore next */
    // We do not have an event loop, so flush synchronously
    stream.flushSync()
  }
}

function createArgsNormalizer (defaultOptions) {
  return function normalizeArgs (instance, caller, opts = {}, stream) {
    // support stream as a string
    if (typeof opts === 'string') {
      stream = buildSafeSonicBoom({ dest: opts })
      opts = {}
    } else if (typeof stream === 'string') {
      if (opts && opts.transport) {
        throw Error('only one of option.transport or stream can be specified')
      }
      stream = buildSafeSonicBoom({ dest: stream })
    } else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
      stream = opts
      opts = {}
    } else if (opts.transport) {
      if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) {
        throw Error('option.transport do not allow stream, please pass to option directly. e.g. pino(transport)')
      }
      if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === 'function') {
        throw Error('option.transport.targets do not allow custom level formatters')
      }

      let customLevels
      if (opts.customLevels) {
        customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels)
      }
      stream = transport({ caller, ...opts.transport, levels: customLevels })
    }
    opts = Object.assign({}, defaultOptions, opts)
    opts.serializers = Object.assign({}, defaultOptions.serializers, opts.serializers)
    opts.formatters = Object.assign({}, defaultOptions.formatters, opts.formatters)

    if (opts.prettyPrint) {
      throw new Error('prettyPrint option is no longer supported, see the pino-pretty package (https://github.com/pinojs/pino-pretty)')
    }

    const { enabled, onChild } = opts
    if (enabled === false) opts.level = 'silent'
    if (!onChild) opts.onChild = noop
    if (!stream) {
      if (!hasBeenTampered(process.stdout)) {
        // If process.stdout.fd is undefined, it means that we are running
        // in a worker thread. Let's assume we are logging to file descriptor 1.
        stream = buildSafeSonicBoom({ fd: process.stdout.fd || 1 })
      } else {
        stream = process.stdout
      }
    }
    return { opts, stream }
  }
}

function stringify (obj, stringifySafeFn) {
  try {
    return JSON.stringify(obj)
  } catch (_) {
    try {
      const stringify = stringifySafeFn || this[stringifySafeSym]
      return stringify(obj)
    } catch (_) {
      return '"[unable to serialize, circular reference is too complex to analyze]"'
    }
  }
}

function buildFormatters (level, bindings, log) {
  return {
    level,
    bindings,
    log
  }
}

/**
 * Convert a string integer file descriptor to a proper native integer
 * file descriptor.
 *
 * @param {string} destination The file descriptor string to attempt to convert.
 *
 * @returns {Number}
 */
function normalizeDestFileDescriptor (destination) {
  const fd = Number(destination)
  if (typeof destination === 'string' && Number.isFinite(fd)) {
    return fd
  }
  // destination could be undefined if we are in a worker
  if (destination === undefined) {
    // This is stdout in UNIX systems
    return 1
  }
  return destination
}

module.exports = {
  noop,
  buildSafeSonicBoom,
  asChindings,
  asJson,
  genLog,
  createArgsNormalizer,
  stringify,
  buildFormatters,
  normalizeDestFileDescriptor
}


/***/ }),
/* 68 */
/***/ ((module) => {

"use strict";

function tryStringify (o) {
  try { return JSON.stringify(o) } catch(e) { return '"[Circular]"' }
}

module.exports = format

function format(f, args, opts) {
  var ss = (opts && opts.stringify) || tryStringify
  var offset = 1
  if (typeof f === 'object' && f !== null) {
    var len = args.length + offset
    if (len === 1) return f
    var objects = new Array(len)
    objects[0] = ss(f)
    for (var index = 1; index < len; index++) {
      objects[index] = ss(args[index])
    }
    return objects.join(' ')
  }
  if (typeof f !== 'string') {
    return f
  }
  var argLen = args.length
  if (argLen === 0) return f
  var str = ''
  var a = 1 - offset
  var lastPos = -1
  var flen = (f && f.length) || 0
  for (var i = 0; i < flen;) {
    if (f.charCodeAt(i) === 37 && i + 1 < flen) {
      lastPos = lastPos > -1 ? lastPos : 0
      switch (f.charCodeAt(i + 1)) {
        case 100: // 'd'
        case 102: // 'f'
          if (a >= argLen)
            break
          if (args[a] == null)  break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += Number(args[a])
          lastPos = i + 2
          i++
          break
        case 105: // 'i'
          if (a >= argLen)
            break
          if (args[a] == null)  break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += Math.floor(Number(args[a]))
          lastPos = i + 2
          i++
          break
        case 79: // 'O'
        case 111: // 'o'
        case 106: // 'j'
          if (a >= argLen)
            break
          if (args[a] === undefined) break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          var type = typeof args[a]
          if (type === 'string') {
            str += '\'' + args[a] + '\''
            lastPos = i + 2
            i++
            break
          }
          if (type === 'function') {
            str += args[a].name || '<anonymous>'
            lastPos = i + 2
            i++
            break
          }
          str += ss(args[a])
          lastPos = i + 2
          i++
          break
        case 115: // 's'
          if (a >= argLen)
            break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += String(args[a])
          lastPos = i + 2
          i++
          break
        case 37: // '%'
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += '%'
          lastPos = i + 2
          i++
          a--
          break
      }
      ++a
    }
    ++i
  }
  if (lastPos === -1)
    return f
  else if (lastPos < flen) {
    str += f.slice(lastPos)
  }

  return str
}


/***/ }),
/* 69 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fs = __webpack_require__(70)
const EventEmitter = __webpack_require__(20)
const inherits = (__webpack_require__(21).inherits)
const path = __webpack_require__(5)
const sleep = __webpack_require__(71)

const BUSY_WRITE_TIMEOUT = 100

// 16 KB. Don't write more than docker buffer size.
// https://github.com/moby/moby/blob/513ec73831269947d38a644c278ce3cac36783b2/daemon/logger/copier.go#L13
const MAX_WRITE = 16 * 1024

function openFile (file, sonic) {
  sonic._opening = true
  sonic._writing = true
  sonic._asyncDrainScheduled = false

  // NOTE: 'error' and 'ready' events emitted below only relevant when sonic.sync===false
  // for sync mode, there is no way to add a listener that will receive these

  function fileOpened (err, fd) {
    if (err) {
      sonic._reopening = false
      sonic._writing = false
      sonic._opening = false

      if (sonic.sync) {
        process.nextTick(() => {
          if (sonic.listenerCount('error') > 0) {
            sonic.emit('error', err)
          }
        })
      } else {
        sonic.emit('error', err)
      }
      return
    }

    sonic.fd = fd
    sonic.file = file
    sonic._reopening = false
    sonic._opening = false
    sonic._writing = false

    if (sonic.sync) {
      process.nextTick(() => sonic.emit('ready'))
    } else {
      sonic.emit('ready')
    }

    if (sonic._reopening) {
      return
    }

    // start
    if (!sonic._writing && sonic._len > sonic.minLength && !sonic.destroyed) {
      actualWrite(sonic)
    }
  }

  const flags = sonic.append ? 'a' : 'w'
  const mode = sonic.mode

  if (sonic.sync) {
    try {
      if (sonic.mkdir) fs.mkdirSync(path.dirname(file), { recursive: true })
      const fd = fs.openSync(file, flags, mode)
      fileOpened(null, fd)
    } catch (err) {
      fileOpened(err)
      throw err
    }
  } else if (sonic.mkdir) {
    fs.mkdir(path.dirname(file), { recursive: true }, (err) => {
      if (err) return fileOpened(err)
      fs.open(file, flags, mode, fileOpened)
    })
  } else {
    fs.open(file, flags, mode, fileOpened)
  }
}

function SonicBoom (opts) {
  if (!(this instanceof SonicBoom)) {
    return new SonicBoom(opts)
  }

  let { fd, dest, minLength, maxLength, maxWrite, sync, append = true, mode, mkdir, retryEAGAIN, fsync } = opts || {}

  fd = fd || dest

  this._bufs = []
  this._len = 0
  this.fd = -1
  this._writing = false
  this._writingBuf = ''
  this._ending = false
  this._reopening = false
  this._asyncDrainScheduled = false
  this._hwm = Math.max(minLength || 0, 16387)
  this.file = null
  this.destroyed = false
  this.minLength = minLength || 0
  this.maxLength = maxLength || 0
  this.maxWrite = maxWrite || MAX_WRITE
  this.sync = sync || false
  this._fsync = fsync || false
  this.append = append || false
  this.mode = mode
  this.retryEAGAIN = retryEAGAIN || (() => true)
  this.mkdir = mkdir || false

  if (typeof fd === 'number') {
    this.fd = fd
    process.nextTick(() => this.emit('ready'))
  } else if (typeof fd === 'string') {
    openFile(fd, this)
  } else {
    throw new Error('SonicBoom supports only file descriptors and files')
  }
  if (this.minLength >= this.maxWrite) {
    throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`)
  }

  this.release = (err, n) => {
    if (err) {
      if (err.code === 'EAGAIN' && this.retryEAGAIN(err, this._writingBuf.length, this._len - this._writingBuf.length)) {
        if (this.sync) {
          // This error code should not happen in sync mode, because it is
          // not using the underlining operating system asynchronous functions.
          // However it happens, and so we handle it.
          // Ref: https://github.com/pinojs/pino/issues/783
          try {
            sleep(BUSY_WRITE_TIMEOUT)
            this.release(undefined, 0)
          } catch (err) {
            this.release(err)
          }
        } else {
          // Let's give the destination some time to process the chunk.
          setTimeout(() => {
            fs.write(this.fd, this._writingBuf, 'utf8', this.release)
          }, BUSY_WRITE_TIMEOUT)
        }
      } else {
        this._writing = false

        this.emit('error', err)
      }
      return
    }

    this.emit('write', n)

    this._len -= n
    // In case of multi-byte characters, the length of the written buffer
    // may be different from the length of the string. Let's make sure
    // we do not have an accumulated string with a negative length.
    // This also mean that ._len is not precise, but it's not a problem as some
    // writes might be triggered earlier than ._minLength.
    if (this._len < 0) {
      this._len = 0
    }

    // TODO if we have a multi-byte character in the buffer, we need to
    // n might not be the same as this._writingBuf.length, so we might loose
    // characters here. The solution to this problem is to use a Buffer for _writingBuf.
    this._writingBuf = this._writingBuf.slice(n)

    if (this._writingBuf.length) {
      if (!this.sync) {
        fs.write(this.fd, this._writingBuf, 'utf8', this.release)
        return
      }

      try {
        do {
          const n = fs.writeSync(this.fd, this._writingBuf, 'utf8')
          this._len -= n
          this._writingBuf = this._writingBuf.slice(n)
        } while (this._writingBuf)
      } catch (err) {
        this.release(err)
        return
      }
    }

    if (this._fsync) {
      fs.fsyncSync(this.fd)
    }

    const len = this._len
    if (this._reopening) {
      this._writing = false
      this._reopening = false
      this.reopen()
    } else if (len > this.minLength) {
      actualWrite(this)
    } else if (this._ending) {
      if (len > 0) {
        actualWrite(this)
      } else {
        this._writing = false
        actualClose(this)
      }
    } else {
      this._writing = false
      if (this.sync) {
        if (!this._asyncDrainScheduled) {
          this._asyncDrainScheduled = true
          process.nextTick(emitDrain, this)
        }
      } else {
        this.emit('drain')
      }
    }
  }

  this.on('newListener', function (name) {
    if (name === 'drain') {
      this._asyncDrainScheduled = false
    }
  })
}

function emitDrain (sonic) {
  const hasListeners = sonic.listenerCount('drain') > 0
  if (!hasListeners) return
  sonic._asyncDrainScheduled = false
  sonic.emit('drain')
}

inherits(SonicBoom, EventEmitter)

SonicBoom.prototype.write = function (data) {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  const len = this._len + data.length
  const bufs = this._bufs

  if (this.maxLength && len > this.maxLength) {
    this.emit('drop', data)
    return this._len < this._hwm
  }

  if (
    bufs.length === 0 ||
    bufs[bufs.length - 1].length + data.length > this.maxWrite
  ) {
    bufs.push('' + data)
  } else {
    bufs[bufs.length - 1] += data
  }

  this._len = len

  if (!this._writing && this._len >= this.minLength) {
    actualWrite(this)
  }

  return this._len < this._hwm
}

SonicBoom.prototype.flush = function () {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this._writing || this.minLength <= 0) {
    return
  }

  if (this._bufs.length === 0) {
    this._bufs.push('')
  }

  actualWrite(this)
}

SonicBoom.prototype.reopen = function (file) {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this._opening) {
    this.once('ready', () => {
      this.reopen(file)
    })
    return
  }

  if (this._ending) {
    return
  }

  if (!this.file) {
    throw new Error('Unable to reopen a file descriptor, you must pass a file to SonicBoom')
  }

  this._reopening = true

  if (this._writing) {
    return
  }

  const fd = this.fd
  this.once('ready', () => {
    if (fd !== this.fd) {
      fs.close(fd, (err) => {
        if (err) {
          return this.emit('error', err)
        }
      })
    }
  })

  openFile(file || this.file, this)
}

SonicBoom.prototype.end = function () {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this._opening) {
    this.once('ready', () => {
      this.end()
    })
    return
  }

  if (this._ending) {
    return
  }

  this._ending = true

  if (this._writing) {
    return
  }

  if (this._len > 0 && this.fd >= 0) {
    actualWrite(this)
  } else {
    actualClose(this)
  }
}

SonicBoom.prototype.flushSync = function () {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this.fd < 0) {
    throw new Error('sonic boom is not ready yet')
  }

  if (!this._writing && this._writingBuf.length > 0) {
    this._bufs.unshift(this._writingBuf)
    this._writingBuf = ''
  }

  while (this._bufs.length) {
    const buf = this._bufs[0]
    try {
      this._len -= fs.writeSync(this.fd, buf, 'utf8')
      this._bufs.shift()
    } catch (err) {
      if (err.code !== 'EAGAIN' || !this.retryEAGAIN(err, buf.length, this._len - buf.length)) {
        throw err
      }

      sleep(BUSY_WRITE_TIMEOUT)
    }
  }
}

SonicBoom.prototype.destroy = function () {
  if (this.destroyed) {
    return
  }
  actualClose(this)
}

function actualWrite (sonic) {
  const release = sonic.release
  sonic._writing = true
  sonic._writingBuf = sonic._writingBuf || sonic._bufs.shift() || ''

  if (sonic.sync) {
    try {
      const written = fs.writeSync(sonic.fd, sonic._writingBuf, 'utf8')
      release(null, written)
    } catch (err) {
      release(err)
    }
  } else {
    fs.write(sonic.fd, sonic._writingBuf, 'utf8', release)
  }
}

function actualClose (sonic) {
  if (sonic.fd === -1) {
    sonic.once('ready', actualClose.bind(null, sonic))
    return
  }

  sonic.destroyed = true
  sonic._bufs = []

  if (sonic.fd !== 1 && sonic.fd !== 2) {
    fs.close(sonic.fd, done)
  } else {
    setImmediate(done)
  }

  function done (err) {
    if (err) {
      sonic.emit('error', err)
      return
    }

    if (sonic._ending && !sonic._writing) {
      sonic.emit('finish')
    }
    sonic.emit('close')
  }
}

/**
 * These export configurations enable JS and TS developers
 * to consumer SonicBoom in whatever way best suits their needs.
 * Some examples of supported import syntax includes:
 * - `const SonicBoom = require('SonicBoom')`
 * - `const { SonicBoom } = require('SonicBoom')`
 * - `import * as SonicBoom from 'SonicBoom'`
 * - `import { SonicBoom } from 'SonicBoom'`
 * - `import SonicBoom from 'SonicBoom'`
 */
SonicBoom.SonicBoom = SonicBoom
SonicBoom.default = SonicBoom
module.exports = SonicBoom


/***/ }),
/* 70 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 71 */
/***/ ((module) => {

"use strict";


/* global SharedArrayBuffer, Atomics */

if (typeof SharedArrayBuffer !== 'undefined' && typeof Atomics !== 'undefined') {
  const nil = new Int32Array(new SharedArrayBuffer(4))

  function sleep (ms) {
    // also filters out NaN, non-number types, including empty strings, but allows bigints
    const valid = ms > 0 && ms < Infinity 
    if (valid === false) {
      if (typeof ms !== 'number' && typeof ms !== 'bigint') {
        throw TypeError('sleep: ms must be a number')
      }
      throw RangeError('sleep: ms must be a number that is greater than 0 but less than Infinity')
    }

    Atomics.wait(nil, 0, 0, Number(ms))
  }
  module.exports = sleep
} else {

  function sleep (ms) {
    // also filters out NaN, non-number types, including empty strings, but allows bigints
    const valid = ms > 0 && ms < Infinity 
    if (valid === false) {
      if (typeof ms !== 'number' && typeof ms !== 'bigint') {
        throw TypeError('sleep: ms must be a number')
      }
      throw RangeError('sleep: ms must be a number that is greater than 0 but less than Infinity')
    }
    const target = Date.now() + Number(ms)
    while (target > Date.now()){}
  }

  module.exports = sleep

}


/***/ }),
/* 72 */
/***/ ((module) => {

"use strict";


const refs = {
  exit: [],
  beforeExit: []
}
const functions = {
  exit: onExit,
  beforeExit: onBeforeExit
}
const registry = new FinalizationRegistry(clear)

function install (event) {
  if (refs[event].length > 0) {
    return
  }

  process.on(event, functions[event])
}

function uninstall (event) {
  if (refs[event].length > 0) {
    return
  }
  process.removeListener(event, functions[event])
}

function onExit () {
  callRefs('exit')
}

function onBeforeExit () {
  callRefs('beforeExit')
}

function callRefs (event) {
  for (const ref of refs[event]) {
    const obj = ref.deref()
    const fn = ref.fn

    // This should always happen, however GC is
    // undeterministic so it might not happen.
    /* istanbul ignore else */
    if (obj !== undefined) {
      fn(obj, event)
    }
  }
}

function clear (ref) {
  for (const event of ['exit', 'beforeExit']) {
    const index = refs[event].indexOf(ref)
    refs[event].splice(index, index + 1)
    uninstall(event)
  }
}

function _register (event, obj, fn) {
  if (obj === undefined) {
    throw new Error('the object can\'t be undefined')
  }
  install(event)
  const ref = new WeakRef(obj)
  ref.fn = fn

  registry.register(obj, ref)
  refs[event].push(ref)
}

function register (obj, fn) {
  _register('exit', obj, fn)
}

function registerBeforeExit (obj, fn) {
  _register('beforeExit', obj, fn)
}

function unregister (obj) {
  registry.unregister(obj)
  for (const event of ['exit', 'beforeExit']) {
    refs[event] = refs[event].filter((ref) => {
      const _obj = ref.deref()
      return _obj && _obj !== obj
    })
    uninstall(event)
  }
}

module.exports = {
  register,
  registerBeforeExit,
  unregister
}


/***/ }),
/* 73 */
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),
/* 74 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { createRequire } = __webpack_require__(75)
const getCallers = __webpack_require__(52)
const { join, isAbsolute } = __webpack_require__(5)
const sleep = __webpack_require__(71)
const onExit = __webpack_require__(72)
const ThreadStream = __webpack_require__(76)

function setupOnExit (stream) {
  // This is leak free, it does not leave event handlers
  onExit.register(stream, autoEnd)
  onExit.registerBeforeExit(stream, flush)

  stream.on('close', function () {
    onExit.unregister(stream)
  })
}

function buildStream (filename, workerData, workerOpts) {
  const stream = new ThreadStream({
    filename,
    workerData,
    workerOpts
  })

  stream.on('ready', onReady)
  stream.on('close', function () {
    process.removeListener('exit', onExit)
  })

  process.on('exit', onExit)

  function onReady () {
    process.removeListener('exit', onExit)
    stream.unref()

    if (workerOpts.autoEnd !== false) {
      setupOnExit(stream)
    }
  }

  function onExit () {
    /* istanbul ignore next */
    if (stream.closed) {
      return
    }
    stream.flushSync()
    // Apparently there is a very sporadic race condition
    // that in certain OS would prevent the messages to be flushed
    // because the thread might not have been created still.
    // Unfortunately we need to sleep(100) in this case.
    sleep(100)
    stream.end()
  }

  return stream
}

function autoEnd (stream) {
  stream.ref()
  stream.flushSync()
  stream.end()
  stream.once('close', function () {
    stream.unref()
  })
}

function flush (stream) {
  stream.flushSync()
}

function transport (fullOptions) {
  const { pipeline, targets, levels, options = {}, worker = {}, caller = getCallers() } = fullOptions

  // Backwards compatibility
  const callers = typeof caller === 'string' ? [caller] : caller

  // This will be eventually modified by bundlers
  const bundlerOverrides = '__bundlerPathsOverrides' in globalThis ? globalThis.__bundlerPathsOverrides : {}

  let target = fullOptions.target

  if (target && targets) {
    throw new Error('only one of target or targets can be specified')
  }

  if (targets) {
    target = bundlerOverrides['pino-worker'] || join(__dirname, 'worker.js')
    options.targets = targets.map((dest) => {
      return {
        ...dest,
        target: fixTarget(dest.target)
      }
    })
  } else if (pipeline) {
    target = bundlerOverrides['pino-pipeline-worker'] || join(__dirname, 'worker-pipeline.js')
    options.targets = pipeline.map((dest) => {
      return {
        ...dest,
        target: fixTarget(dest.target)
      }
    })
  }

  if (levels) {
    options.levels = levels
  }

  return buildStream(fixTarget(target), options, worker)

  function fixTarget (origin) {
    origin = bundlerOverrides[origin] || origin

    if (isAbsolute(origin) || origin.indexOf('file://') === 0) {
      return origin
    }

    if (origin === 'pino/file') {
      return join(__dirname, '..', 'file.js')
    }

    let fixTarget

    for (const filePath of callers) {
      try {
        fixTarget = createRequire(filePath).resolve(origin)
        break
      } catch (err) {
        // Silent catch
        continue
      }
    }

    if (!fixTarget) {
      throw new Error(`unable to determine transport target for "${origin}"`)
    }

    return fixTarget
  }
}

module.exports = transport


/***/ }),
/* 75 */
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),
/* 76 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { version } = __webpack_require__(77)
const { EventEmitter } = __webpack_require__(20)
const { Worker } = __webpack_require__(73)
const { join } = __webpack_require__(5)
const { pathToFileURL } = __webpack_require__(78)
const { wait } = __webpack_require__(79)
const {
  WRITE_INDEX,
  READ_INDEX
} = __webpack_require__(80)
const buffer = __webpack_require__(81)
const assert = __webpack_require__(82)

const kImpl = Symbol('kImpl')

// V8 limit for string size
const MAX_STRING = buffer.constants.MAX_STRING_LENGTH

class FakeWeakRef {
  constructor (value) {
    this._value = value
  }

  deref () {
    return this._value
  }
}

const FinalizationRegistry = global.FinalizationRegistry || class FakeFinalizationRegistry {
  register () {}

  unregister () {}
}

const WeakRef = global.WeakRef || FakeWeakRef

const registry = new FinalizationRegistry((worker) => {
  if (worker.exited) {
    return
  }
  worker.terminate()
})

function createWorker (stream, opts) {
  const { filename, workerData } = opts

  const bundlerOverrides = '__bundlerPathsOverrides' in globalThis ? globalThis.__bundlerPathsOverrides : {}
  const toExecute = bundlerOverrides['thread-stream-worker'] || join(__dirname, 'lib', 'worker.js')

  const worker = new Worker(toExecute, {
    ...opts.workerOpts,
    workerData: {
      filename: filename.indexOf('file://') === 0
        ? filename
        : pathToFileURL(filename).href,
      dataBuf: stream[kImpl].dataBuf,
      stateBuf: stream[kImpl].stateBuf,
      workerData: {
        $context: {
          threadStreamVersion: version
        },
        ...workerData
      }
    }
  })

  // We keep a strong reference for now,
  // we need to start writing first
  worker.stream = new FakeWeakRef(stream)

  worker.on('message', onWorkerMessage)
  worker.on('exit', onWorkerExit)
  registry.register(stream, worker)

  return worker
}

function drain (stream) {
  assert(!stream[kImpl].sync)
  if (stream[kImpl].needDrain) {
    stream[kImpl].needDrain = false
    stream.emit('drain')
  }
}

function nextFlush (stream) {
  const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX)
  let leftover = stream[kImpl].data.length - writeIndex

  if (leftover > 0) {
    if (stream[kImpl].buf.length === 0) {
      stream[kImpl].flushing = false

      if (stream[kImpl].ending) {
        end(stream)
      } else if (stream[kImpl].needDrain) {
        process.nextTick(drain, stream)
      }

      return
    }

    let toWrite = stream[kImpl].buf.slice(0, leftover)
    let toWriteBytes = Buffer.byteLength(toWrite)
    if (toWriteBytes <= leftover) {
      stream[kImpl].buf = stream[kImpl].buf.slice(leftover)
      // process._rawDebug('writing ' + toWrite.length)
      write(stream, toWrite, nextFlush.bind(null, stream))
    } else {
      // multi-byte utf-8
      stream.flush(() => {
        // err is already handled in flush()
        if (stream.destroyed) {
          return
        }

        Atomics.store(stream[kImpl].state, READ_INDEX, 0)
        Atomics.store(stream[kImpl].state, WRITE_INDEX, 0)

        // Find a toWrite length that fits the buffer
        // it must exists as the buffer is at least 4 bytes length
        // and the max utf-8 length for a char is 4 bytes.
        while (toWriteBytes > stream[kImpl].data.length) {
          leftover = leftover / 2
          toWrite = stream[kImpl].buf.slice(0, leftover)
          toWriteBytes = Buffer.byteLength(toWrite)
        }
        stream[kImpl].buf = stream[kImpl].buf.slice(leftover)
        write(stream, toWrite, nextFlush.bind(null, stream))
      })
    }
  } else if (leftover === 0) {
    if (writeIndex === 0 && stream[kImpl].buf.length === 0) {
      // we had a flushSync in the meanwhile
      return
    }
    stream.flush(() => {
      Atomics.store(stream[kImpl].state, READ_INDEX, 0)
      Atomics.store(stream[kImpl].state, WRITE_INDEX, 0)
      nextFlush(stream)
    })
  } else {
    // This should never happen
    destroy(stream, new Error('overwritten'))
  }
}

function onWorkerMessage (msg) {
  const stream = this.stream.deref()
  if (stream === undefined) {
    this.exited = true
    // Terminate the worker.
    this.terminate()
    return
  }

  switch (msg.code) {
    case 'READY':
      // Replace the FakeWeakRef with a
      // proper one.
      this.stream = new WeakRef(stream)

      stream.flush(() => {
        stream[kImpl].ready = true
        stream.emit('ready')
      })
      break
    case 'ERROR':
      destroy(stream, msg.err)
      break
    case 'EVENT':
      if (Array.isArray(msg.args)) {
        stream.emit(msg.name, ...msg.args)
      } else {
        stream.emit(msg.name, msg.args)
      }
      break
    default:
      destroy(stream, new Error('this should not happen: ' + msg.code))
  }
}

function onWorkerExit (code) {
  const stream = this.stream.deref()
  if (stream === undefined) {
    // Nothing to do, the worker already exit
    return
  }
  registry.unregister(stream)
  stream.worker.exited = true
  stream.worker.off('exit', onWorkerExit)
  destroy(stream, code !== 0 ? new Error('the worker thread exited') : null)
}

class ThreadStream extends EventEmitter {
  constructor (opts = {}) {
    super()

    if (opts.bufferSize < 4) {
      throw new Error('bufferSize must at least fit a 4-byte utf-8 char')
    }

    this[kImpl] = {}
    this[kImpl].stateBuf = new SharedArrayBuffer(128)
    this[kImpl].state = new Int32Array(this[kImpl].stateBuf)
    this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024)
    this[kImpl].data = Buffer.from(this[kImpl].dataBuf)
    this[kImpl].sync = opts.sync || false
    this[kImpl].ending = false
    this[kImpl].ended = false
    this[kImpl].needDrain = false
    this[kImpl].destroyed = false
    this[kImpl].flushing = false
    this[kImpl].ready = false
    this[kImpl].finished = false
    this[kImpl].errored = null
    this[kImpl].closed = false
    this[kImpl].buf = ''

    // TODO (fix): Make private?
    this.worker = createWorker(this, opts) // TODO (fix): make private
  }

  write (data) {
    if (this[kImpl].destroyed) {
      error(this, new Error('the worker has exited'))
      return false
    }

    if (this[kImpl].ending) {
      error(this, new Error('the worker is ending'))
      return false
    }

    if (this[kImpl].flushing && this[kImpl].buf.length + data.length >= MAX_STRING) {
      try {
        writeSync(this)
        this[kImpl].flushing = true
      } catch (err) {
        destroy(this, err)
        return false
      }
    }

    this[kImpl].buf += data

    if (this[kImpl].sync) {
      try {
        writeSync(this)
        return true
      } catch (err) {
        destroy(this, err)
        return false
      }
    }

    if (!this[kImpl].flushing) {
      this[kImpl].flushing = true
      setImmediate(nextFlush, this)
    }

    this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].buf.length - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0
    return !this[kImpl].needDrain
  }

  end () {
    if (this[kImpl].destroyed) {
      return
    }

    this[kImpl].ending = true
    end(this)
  }

  flush (cb) {
    if (this[kImpl].destroyed) {
      if (typeof cb === 'function') {
        process.nextTick(cb, new Error('the worker has exited'))
      }
      return
    }

    // TODO write all .buf
    const writeIndex = Atomics.load(this[kImpl].state, WRITE_INDEX)
    // process._rawDebug(`(flush) readIndex (${Atomics.load(this.state, READ_INDEX)}) writeIndex (${Atomics.load(this.state, WRITE_INDEX)})`)
    wait(this[kImpl].state, READ_INDEX, writeIndex, Infinity, (err, res) => {
      if (err) {
        destroy(this, err)
        process.nextTick(cb, err)
        return
      }
      if (res === 'not-equal') {
        // TODO handle deadlock
        this.flush(cb)
        return
      }
      process.nextTick(cb)
    })
  }

  flushSync () {
    if (this[kImpl].destroyed) {
      return
    }

    writeSync(this)
    flushSync(this)
  }

  unref () {
    this.worker.unref()
  }

  ref () {
    this.worker.ref()
  }

  get ready () {
    return this[kImpl].ready
  }

  get destroyed () {
    return this[kImpl].destroyed
  }

  get closed () {
    return this[kImpl].closed
  }

  get writable () {
    return !this[kImpl].destroyed && !this[kImpl].ending
  }

  get writableEnded () {
    return this[kImpl].ending
  }

  get writableFinished () {
    return this[kImpl].finished
  }

  get writableNeedDrain () {
    return this[kImpl].needDrain
  }

  get writableObjectMode () {
    return false
  }

  get writableErrored () {
    return this[kImpl].errored
  }
}

function error (stream, err) {
  setImmediate(() => {
    stream.emit('error', err)
  })
}

function destroy (stream, err) {
  if (stream[kImpl].destroyed) {
    return
  }
  stream[kImpl].destroyed = true

  if (err) {
    stream[kImpl].errored = err
    error(stream, err)
  }

  if (!stream.worker.exited) {
    stream.worker.terminate()
      .catch(() => {})
      .then(() => {
        stream[kImpl].closed = true
        stream.emit('close')
      })
  } else {
    setImmediate(() => {
      stream[kImpl].closed = true
      stream.emit('close')
    })
  }
}

function write (stream, data, cb) {
  // data is smaller than the shared buffer length
  const current = Atomics.load(stream[kImpl].state, WRITE_INDEX)
  const length = Buffer.byteLength(data)
  stream[kImpl].data.write(data, current)
  Atomics.store(stream[kImpl].state, WRITE_INDEX, current + length)
  Atomics.notify(stream[kImpl].state, WRITE_INDEX)
  cb()
  return true
}

function end (stream) {
  if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) {
    return
  }
  stream[kImpl].ended = true

  try {
    stream.flushSync()

    let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX)

    // process._rawDebug('writing index')
    Atomics.store(stream[kImpl].state, WRITE_INDEX, -1)
    // process._rawDebug(`(end) readIndex (${Atomics.load(stream.state, READ_INDEX)}) writeIndex (${Atomics.load(stream.state, WRITE_INDEX)})`)
    Atomics.notify(stream[kImpl].state, WRITE_INDEX)

    // Wait for the process to complete
    let spins = 0
    while (readIndex !== -1) {
      // process._rawDebug(`read = ${read}`)
      Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1000)
      readIndex = Atomics.load(stream[kImpl].state, READ_INDEX)

      if (readIndex === -2) {
        destroy(stream, new Error('end() failed'))
        return
      }

      if (++spins === 10) {
        destroy(stream, new Error('end() took too long (10s)'))
        return
      }
    }

    process.nextTick(() => {
      stream[kImpl].finished = true
      stream.emit('finish')
    })
  } catch (err) {
    destroy(stream, err)
  }
  // process._rawDebug('end finished...')
}

function writeSync (stream) {
  const cb = () => {
    if (stream[kImpl].ending) {
      end(stream)
    } else if (stream[kImpl].needDrain) {
      process.nextTick(drain, stream)
    }
  }
  stream[kImpl].flushing = false

  while (stream[kImpl].buf.length !== 0) {
    const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX)
    let leftover = stream[kImpl].data.length - writeIndex
    if (leftover === 0) {
      flushSync(stream)
      Atomics.store(stream[kImpl].state, READ_INDEX, 0)
      Atomics.store(stream[kImpl].state, WRITE_INDEX, 0)
      continue
    } else if (leftover < 0) {
      // stream should never happen
      throw new Error('overwritten')
    }

    let toWrite = stream[kImpl].buf.slice(0, leftover)
    let toWriteBytes = Buffer.byteLength(toWrite)
    if (toWriteBytes <= leftover) {
      stream[kImpl].buf = stream[kImpl].buf.slice(leftover)
      // process._rawDebug('writing ' + toWrite.length)
      write(stream, toWrite, cb)
    } else {
      // multi-byte utf-8
      flushSync(stream)
      Atomics.store(stream[kImpl].state, READ_INDEX, 0)
      Atomics.store(stream[kImpl].state, WRITE_INDEX, 0)

      // Find a toWrite length that fits the buffer
      // it must exists as the buffer is at least 4 bytes length
      // and the max utf-8 length for a char is 4 bytes.
      while (toWriteBytes > stream[kImpl].buf.length) {
        leftover = leftover / 2
        toWrite = stream[kImpl].buf.slice(0, leftover)
        toWriteBytes = Buffer.byteLength(toWrite)
      }
      stream[kImpl].buf = stream[kImpl].buf.slice(leftover)
      write(stream, toWrite, cb)
    }
  }
}

function flushSync (stream) {
  if (stream[kImpl].flushing) {
    throw new Error('unable to flush while flushing')
  }

  // process._rawDebug('flushSync started')

  const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX)

  let spins = 0

  // TODO handle deadlock
  while (true) {
    const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX)

    if (readIndex === -2) {
      throw Error('_flushSync failed')
    }

    // process._rawDebug(`(flushSync) readIndex (${readIndex}) writeIndex (${writeIndex})`)
    if (readIndex !== writeIndex) {
      // TODO stream timeouts for some reason.
      Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1000)
    } else {
      break
    }

    if (++spins === 10) {
      throw new Error('_flushSync took too long (10s)')
    }
  }
  // process._rawDebug('flushSync finished')
}

module.exports = ThreadStream


/***/ }),
/* 77 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"thread-stream","version":"2.2.0","description":"A streaming way to send data to a Node.js Worker Thread","main":"index.js","types":"index.d.ts","dependencies":{"real-require":"^0.2.0"},"devDependencies":{"@types/node":"^18.0.0","@types/tap":"^15.0.0","desm":"^1.3.0","fastbench":"^1.0.1","husky":"^8.0.1","sonic-boom":"^3.0.0","standard":"^17.0.0","tap":"^16.2.0","ts-node":"^10.8.0","typescript":"^4.7.2","why-is-node-running":"^2.2.2"},"scripts":{"test":"standard && npm run transpile && tap test/*.test.*js && tap --ts test/*.test.*ts","test:ci":"standard && npm run transpile && npm run test:ci:js && npm run test:ci:ts","test:ci:js":"tap --no-check-coverage --coverage-report=lcovonly \\"test/**/*.test.*js\\"","test:ci:ts":"tap --ts --no-check-coverage --coverage-report=lcovonly \\"test/**/*.test.*ts\\"","test:yarn":"npm run transpile && tap \\"test/**/*.test.js\\" --no-check-coverage","transpile":"sh ./test/ts/transpile.sh","prepare":"husky install"},"standard":{"ignore":["test/ts/**/*"]},"repository":{"type":"git","url":"git+https://github.com/mcollina/thread-stream.git"},"keywords":["worker","thread","threads","stream"],"author":"Matteo Collina <hello@matteocollina.com>","license":"MIT","bugs":{"url":"https://github.com/mcollina/thread-stream/issues"},"homepage":"https://github.com/mcollina/thread-stream#readme"}');

/***/ }),
/* 78 */
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),
/* 79 */
/***/ ((module) => {

"use strict";


const MAX_TIMEOUT = 1000

function wait (state, index, expected, timeout, done) {
  const max = Date.now() + timeout
  let current = Atomics.load(state, index)
  if (current === expected) {
    done(null, 'ok')
    return
  }
  let prior = current
  const check = (backoff) => {
    if (Date.now() > max) {
      done(null, 'timed-out')
    } else {
      setTimeout(() => {
        prior = current
        current = Atomics.load(state, index)
        if (current === prior) {
          check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2)
        } else {
          if (current === expected) done(null, 'ok')
          else done(null, 'not-equal')
        }
      }, backoff)
    }
  }
  check(1)
}

// let waitDiffCount = 0
function waitDiff (state, index, expected, timeout, done) {
  // const id = waitDiffCount++
  // process._rawDebug(`>>> waitDiff ${id}`)
  const max = Date.now() + timeout
  let current = Atomics.load(state, index)
  if (current !== expected) {
    done(null, 'ok')
    return
  }
  const check = (backoff) => {
    // process._rawDebug(`${id} ${index} current ${current} expected ${expected}`)
    // process._rawDebug('' + backoff)
    if (Date.now() > max) {
      done(null, 'timed-out')
    } else {
      setTimeout(() => {
        current = Atomics.load(state, index)
        if (current !== expected) {
          done(null, 'ok')
        } else {
          check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2)
        }
      }, backoff)
    }
  }
  check(1)
}

module.exports = { wait, waitDiff }


/***/ }),
/* 80 */
/***/ ((module) => {

"use strict";


const WRITE_INDEX = 4
const READ_INDEX = 8

module.exports = {
  WRITE_INDEX,
  READ_INDEX
}


/***/ }),
/* 81 */
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),
/* 82 */
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),
/* 83 */
/***/ ((module) => {

"use strict";


module.exports = { version: '8.6.0' }


/***/ }),
/* 84 */
/***/ ((module, exports) => {

"use strict";


const { hasOwnProperty } = Object.prototype

const stringify = configure()

// @ts-expect-error
stringify.configure = configure
// @ts-expect-error
stringify.stringify = stringify

// @ts-expect-error
stringify.default = stringify

// @ts-expect-error used for named export
exports.stringify = stringify
// @ts-expect-error used for named export
exports.configure = configure

module.exports = stringify

// eslint-disable-next-line
const strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]|[\ud800-\udbff](?![\udc00-\udfff])|(?:[^\ud800-\udbff]|^)[\udc00-\udfff]/
// eslint-disable-next-line
const strEscapeSequencesReplacer = new RegExp(strEscapeSequencesRegExp, 'g')

// Escaped special characters. Use empty strings to fill up unused entries.
const meta = [
  '\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004',
  '\\u0005', '\\u0006', '\\u0007', '\\b', '\\t',
  '\\n', '\\u000b', '\\f', '\\r', '\\u000e',
  '\\u000f', '\\u0010', '\\u0011', '\\u0012', '\\u0013',
  '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018',
  '\\u0019', '\\u001a', '\\u001b', '\\u001c', '\\u001d',
  '\\u001e', '\\u001f', '', '', '\\"',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '\\\\'
]

function escapeFn (str) {
  if (str.length === 2) {
    const charCode = str.charCodeAt(1)
    return `${str[0]}\\u${charCode.toString(16)}`
  }
  const charCode = str.charCodeAt(0)
  return meta.length > charCode
    ? meta[charCode]
    : `\\u${charCode.toString(16)}`
}

// Escape C0 control characters, double quotes, the backslash and every code
// unit with a numeric value in the inclusive range 0xD800 to 0xDFFF.
function strEscape (str) {
  // Some magic numbers that worked out fine while benchmarking with v8 8.0
  if (str.length < 5000 && !strEscapeSequencesRegExp.test(str)) {
    return str
  }
  if (str.length > 100) {
    return str.replace(strEscapeSequencesReplacer, escapeFn)
  }
  let result = ''
  let last = 0
  for (let i = 0; i < str.length; i++) {
    const point = str.charCodeAt(i)
    if (point === 34 || point === 92 || point < 32) {
      result += `${str.slice(last, i)}${meta[point]}`
      last = i + 1
    } else if (point >= 0xd800 && point <= 0xdfff) {
      if (point <= 0xdbff && i + 1 < str.length) {
        const nextPoint = str.charCodeAt(i + 1)
        if (nextPoint >= 0xdc00 && nextPoint <= 0xdfff) {
          i++
          continue
        }
      }
      result += `${str.slice(last, i)}\\u${point.toString(16)}`
      last = i + 1
    }
  }
  result += str.slice(last)
  return result
}

function insertSort (array) {
  // Insertion sort is very efficient for small input sizes but it has a bad
  // worst case complexity. Thus, use native array sort for bigger values.
  if (array.length > 2e2) {
    return array.sort()
  }
  for (let i = 1; i < array.length; i++) {
    const currentValue = array[i]
    let position = i
    while (position !== 0 && array[position - 1] > currentValue) {
      array[position] = array[position - 1]
      position--
    }
    array[position] = currentValue
  }
  return array
}

const typedArrayPrototypeGetSymbolToStringTag =
  Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(
      Object.getPrototypeOf(
        new Int8Array()
      )
    ),
    Symbol.toStringTag
  ).get

function isTypedArrayWithEntries (value) {
  return typedArrayPrototypeGetSymbolToStringTag.call(value) !== undefined && value.length !== 0
}

function stringifyTypedArray (array, separator, maximumBreadth) {
  if (array.length < maximumBreadth) {
    maximumBreadth = array.length
  }
  const whitespace = separator === ',' ? '' : ' '
  let res = `"0":${whitespace}${array[0]}`
  for (let i = 1; i < maximumBreadth; i++) {
    res += `${separator}"${i}":${whitespace}${array[i]}`
  }
  return res
}

function getCircularValueOption (options) {
  if (options && hasOwnProperty.call(options, 'circularValue')) {
    const circularValue = options.circularValue
    if (typeof circularValue === 'string') {
      return `"${circularValue}"`
    }
    if (circularValue == null) {
      return circularValue
    }
    if (circularValue === Error || circularValue === TypeError) {
      return {
        toString () {
          throw new TypeError('Converting circular structure to JSON')
        }
      }
    }
    throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined')
  }
  return '"[Circular]"'
}

function getBooleanOption (options, key) {
  let value
  if (options && hasOwnProperty.call(options, key)) {
    value = options[key]
    if (typeof value !== 'boolean') {
      throw new TypeError(`The "${key}" argument must be of type boolean`)
    }
  }
  return value === undefined ? true : value
}

function getPositiveIntegerOption (options, key) {
  let value
  if (options && hasOwnProperty.call(options, key)) {
    value = options[key]
    if (typeof value !== 'number') {
      throw new TypeError(`The "${key}" argument must be of type number`)
    }
    if (!Number.isInteger(value)) {
      throw new TypeError(`The "${key}" argument must be an integer`)
    }
    if (value < 1) {
      throw new RangeError(`The "${key}" argument must be >= 1`)
    }
  }
  return value === undefined ? Infinity : value
}

function getItemCount (number) {
  if (number === 1) {
    return '1 item'
  }
  return `${number} items`
}

function getUniqueReplacerSet (replacerArray) {
  const replacerSet = new Set()
  for (const value of replacerArray) {
    if (typeof value === 'string' || typeof value === 'number') {
      replacerSet.add(String(value))
    }
  }
  return replacerSet
}

function getStrictOption (options) {
  if (options && hasOwnProperty.call(options, 'strict')) {
    const value = options.strict
    if (typeof value !== 'boolean') {
      throw new TypeError('The "strict" argument must be of type boolean')
    }
    if (value) {
      return (value) => {
        let message = `Object can not safely be stringified. Received type ${typeof value}`
        if (typeof value !== 'function') message += ` (${value.toString()})`
        throw new Error(message)
      }
    }
  }
}

function configure (options) {
  options = { ...options }
  const fail = getStrictOption(options)
  if (fail) {
    if (options.bigint === undefined) {
      options.bigint = false
    }
    if (!('circularValue' in options)) {
      options.circularValue = Error
    }
  }
  const circularValue = getCircularValueOption(options)
  const bigint = getBooleanOption(options, 'bigint')
  const deterministic = getBooleanOption(options, 'deterministic')
  const maximumDepth = getPositiveIntegerOption(options, 'maximumDepth')
  const maximumBreadth = getPositiveIntegerOption(options, 'maximumBreadth')

  function stringifyFnReplacer (key, parent, stack, replacer, spacer, indentation) {
    let value = parent[key]

    if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
      value = value.toJSON(key)
    }
    value = replacer.call(parent, key, value)

    switch (typeof value) {
      case 'string':
        return `"${strEscape(value)}"`
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }

        let res = ''
        let join = ','
        const originalIndentation = indentation

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          if (spacer !== '') {
            indentation += spacer
            res += `\n${indentation}`
            join = `,\n${indentation}`
          }
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifyFnReplacer(i, value, stack, replacer, spacer, indentation)
            res += tmp !== undefined ? tmp : 'null'
            res += join
          }
          const tmp = stringifyFnReplacer(i, value, stack, replacer, spacer, indentation)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
          }
          if (spacer !== '') {
            res += `\n${originalIndentation}`
          }
          stack.pop()
          return `[${res}]`
        }

        let keys = Object.keys(value)
        const keyLength = keys.length
        if (keyLength === 0) {
          return '{}'
        }
        if (maximumDepth < stack.length + 1) {
          return '"[Object]"'
        }
        let whitespace = ''
        let separator = ''
        if (spacer !== '') {
          indentation += spacer
          join = `,\n${indentation}`
          whitespace = ' '
        }
        let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
        if (isTypedArrayWithEntries(value)) {
          res += stringifyTypedArray(value, join, maximumBreadth)
          keys = keys.slice(value.length)
          maximumPropertiesToStringify -= value.length
          separator = join
        }
        if (deterministic) {
          keys = insertSort(keys)
        }
        stack.push(value)
        for (let i = 0; i < maximumPropertiesToStringify; i++) {
          const key = keys[i]
          const tmp = stringifyFnReplacer(key, value, stack, replacer, spacer, indentation)
          if (tmp !== undefined) {
            res += `${separator}"${strEscape(key)}":${whitespace}${tmp}`
            separator = join
          }
        }
        if (keyLength > maximumBreadth) {
          const removedKeys = keyLength - maximumBreadth
          res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`
          separator = join
        }
        if (spacer !== '' && separator.length > 1) {
          res = `\n${indentation}${res}\n${originalIndentation}`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringifyArrayReplacer (key, value, stack, replacer, spacer, indentation) {
    if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
      value = value.toJSON(key)
    }

    switch (typeof value) {
      case 'string':
        return `"${strEscape(value)}"`
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }

        const originalIndentation = indentation
        let res = ''
        let join = ','

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          if (spacer !== '') {
            indentation += spacer
            res += `\n${indentation}`
            join = `,\n${indentation}`
          }
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifyArrayReplacer(i, value[i], stack, replacer, spacer, indentation)
            res += tmp !== undefined ? tmp : 'null'
            res += join
          }
          const tmp = stringifyArrayReplacer(i, value[i], stack, replacer, spacer, indentation)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
          }
          if (spacer !== '') {
            res += `\n${originalIndentation}`
          }
          stack.pop()
          return `[${res}]`
        }
        if (replacer.size === 0) {
          return '{}'
        }
        stack.push(value)
        let whitespace = ''
        if (spacer !== '') {
          indentation += spacer
          join = `,\n${indentation}`
          whitespace = ' '
        }
        let separator = ''
        for (const key of replacer) {
          const tmp = stringifyArrayReplacer(key, value[key], stack, replacer, spacer, indentation)
          if (tmp !== undefined) {
            res += `${separator}"${strEscape(key)}":${whitespace}${tmp}`
            separator = join
          }
        }
        if (spacer !== '' && separator.length > 1) {
          res = `\n${indentation}${res}\n${originalIndentation}`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringifyIndent (key, value, stack, spacer, indentation) {
    switch (typeof value) {
      case 'string':
        return `"${strEscape(value)}"`
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (typeof value.toJSON === 'function') {
          value = value.toJSON(key)
          // Prevent calling `toJSON` again.
          if (typeof value !== 'object') {
            return stringifyIndent(key, value, stack, spacer, indentation)
          }
          if (value === null) {
            return 'null'
          }
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }
        const originalIndentation = indentation

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          indentation += spacer
          let res = `\n${indentation}`
          const join = `,\n${indentation}`
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifyIndent(i, value[i], stack, spacer, indentation)
            res += tmp !== undefined ? tmp : 'null'
            res += join
          }
          const tmp = stringifyIndent(i, value[i], stack, spacer, indentation)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
          }
          res += `\n${originalIndentation}`
          stack.pop()
          return `[${res}]`
        }

        let keys = Object.keys(value)
        const keyLength = keys.length
        if (keyLength === 0) {
          return '{}'
        }
        if (maximumDepth < stack.length + 1) {
          return '"[Object]"'
        }
        indentation += spacer
        const join = `,\n${indentation}`
        let res = ''
        let separator = ''
        let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
        if (isTypedArrayWithEntries(value)) {
          res += stringifyTypedArray(value, join, maximumBreadth)
          keys = keys.slice(value.length)
          maximumPropertiesToStringify -= value.length
          separator = join
        }
        if (deterministic) {
          keys = insertSort(keys)
        }
        stack.push(value)
        for (let i = 0; i < maximumPropertiesToStringify; i++) {
          const key = keys[i]
          const tmp = stringifyIndent(key, value[key], stack, spacer, indentation)
          if (tmp !== undefined) {
            res += `${separator}"${strEscape(key)}": ${tmp}`
            separator = join
          }
        }
        if (keyLength > maximumBreadth) {
          const removedKeys = keyLength - maximumBreadth
          res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`
          separator = join
        }
        if (separator !== '') {
          res = `\n${indentation}${res}\n${originalIndentation}`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringifySimple (key, value, stack) {
    switch (typeof value) {
      case 'string':
        return `"${strEscape(value)}"`
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (typeof value.toJSON === 'function') {
          value = value.toJSON(key)
          // Prevent calling `toJSON` again
          if (typeof value !== 'object') {
            return stringifySimple(key, value, stack)
          }
          if (value === null) {
            return 'null'
          }
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }

        let res = ''

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifySimple(i, value[i], stack)
            res += tmp !== undefined ? tmp : 'null'
            res += ','
          }
          const tmp = stringifySimple(i, value[i], stack)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `,"... ${getItemCount(removedKeys)} not stringified"`
          }
          stack.pop()
          return `[${res}]`
        }

        let keys = Object.keys(value)
        const keyLength = keys.length
        if (keyLength === 0) {
          return '{}'
        }
        if (maximumDepth < stack.length + 1) {
          return '"[Object]"'
        }
        let separator = ''
        let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
        if (isTypedArrayWithEntries(value)) {
          res += stringifyTypedArray(value, ',', maximumBreadth)
          keys = keys.slice(value.length)
          maximumPropertiesToStringify -= value.length
          separator = ','
        }
        if (deterministic) {
          keys = insertSort(keys)
        }
        stack.push(value)
        for (let i = 0; i < maximumPropertiesToStringify; i++) {
          const key = keys[i]
          const tmp = stringifySimple(key, value[key], stack)
          if (tmp !== undefined) {
            res += `${separator}"${strEscape(key)}":${tmp}`
            separator = ','
          }
        }
        if (keyLength > maximumBreadth) {
          const removedKeys = keyLength - maximumBreadth
          res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringify (value, replacer, space) {
    if (arguments.length > 1) {
      let spacer = ''
      if (typeof space === 'number') {
        spacer = ' '.repeat(Math.min(space, 10))
      } else if (typeof space === 'string') {
        spacer = space.slice(0, 10)
      }
      if (replacer != null) {
        if (typeof replacer === 'function') {
          return stringifyFnReplacer('', { '': value }, [], replacer, spacer, '')
        }
        if (Array.isArray(replacer)) {
          return stringifyArrayReplacer('', value, [], getUniqueReplacerSet(replacer), spacer, '')
        }
      }
      if (spacer.length !== 0) {
        return stringifyIndent('', value, [], spacer, '')
      }
    }
    return stringifySimple('', value, [])
  }

  return stringify
}


/***/ }),
/* 85 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const metadata = Symbol.for('pino.metadata')
const { levels } = __webpack_require__(66)

const defaultLevels = Object.create(levels)
defaultLevels.silent = Infinity

const DEFAULT_INFO_LEVEL = levels.info

function multistream (streamsArray, opts) {
  let counter = 0
  streamsArray = streamsArray || []
  opts = opts || { dedupe: false }

  let levels = defaultLevels
  if (opts.levels && typeof opts.levels === 'object') {
    levels = opts.levels
  }

  const res = {
    write,
    add,
    flushSync,
    end,
    minLevel: 0,
    streams: [],
    clone,
    [metadata]: true
  }

  if (Array.isArray(streamsArray)) {
    streamsArray.forEach(add, res)
  } else {
    add.call(res, streamsArray)
  }

  // clean this object up
  // or it will stay allocated forever
  // as it is closed on the following closures
  streamsArray = null

  return res

  // we can exit early because the streams are ordered by level
  function write (data) {
    let dest
    const level = this.lastLevel
    const { streams } = this
    // for handling situation when several streams has the same level
    let recordedLevel = 0
    let stream

    // if dedupe set to true we send logs to the stream with the highest level
    // therefore, we have to change sorting order
    for (let i = initLoopVar(streams.length, opts.dedupe); checkLoopVar(i, streams.length, opts.dedupe); i = adjustLoopVar(i, opts.dedupe)) {
      dest = streams[i]
      if (dest.level <= level) {
        if (recordedLevel !== 0 && recordedLevel !== dest.level) {
          break
        }
        stream = dest.stream
        if (stream[metadata]) {
          const { lastTime, lastMsg, lastObj, lastLogger } = this
          stream.lastLevel = level
          stream.lastTime = lastTime
          stream.lastMsg = lastMsg
          stream.lastObj = lastObj
          stream.lastLogger = lastLogger
        }
        stream.write(data)
        if (opts.dedupe) {
          recordedLevel = dest.level
        }
      } else if (!opts.dedupe) {
        break
      }
    }
  }

  function flushSync () {
    for (const { stream } of this.streams) {
      if (typeof stream.flushSync === 'function') {
        stream.flushSync()
      }
    }
  }

  function add (dest) {
    if (!dest) {
      return res
    }

    // Check that dest implements either StreamEntry or DestinationStream
    const isStream = typeof dest.write === 'function' || dest.stream
    const stream_ = dest.write ? dest : dest.stream
    // This is necessary to provide a meaningful error message, otherwise it throws somewhere inside write()
    if (!isStream) {
      throw Error('stream object needs to implement either StreamEntry or DestinationStream interface')
    }

    const { streams } = this

    let level
    if (typeof dest.levelVal === 'number') {
      level = dest.levelVal
    } else if (typeof dest.level === 'string') {
      level = levels[dest.level]
    } else if (typeof dest.level === 'number') {
      level = dest.level
    } else {
      level = DEFAULT_INFO_LEVEL
    }

    const dest_ = {
      stream: stream_,
      level,
      levelVal: undefined,
      id: counter++
    }

    streams.unshift(dest_)
    streams.sort(compareByLevel)

    this.minLevel = streams[0].level

    return res
  }

  function end () {
    for (const { stream } of this.streams) {
      if (typeof stream.flushSync === 'function') {
        stream.flushSync()
      }
      stream.end()
    }
  }

  function clone (level) {
    const streams = new Array(this.streams.length)

    for (let i = 0; i < streams.length; i++) {
      streams[i] = {
        level,
        stream: this.streams[i].stream
      }
    }

    return {
      write,
      add,
      minLevel: level,
      streams,
      clone,
      flushSync,
      [metadata]: true
    }
  }
}

function compareByLevel (a, b) {
  return a.level - b.level
}

function initLoopVar (length, dedupe) {
  return dedupe ? length - 1 : 0
}

function adjustLoopVar (i, dedupe) {
  return dedupe ? i - 1 : i + 1
}

function checkLoopVar (i, length, dedupe) {
  return dedupe ? i >= 0 : i < length
}

module.exports = multistream


/***/ }),
/* 86 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const statusCodes = (__webpack_require__(27).STATUS_CODES)
const wrapThenable = __webpack_require__(42)
const {
  kReplyHeaders, kReplyNextErrorHandler, kReplyIsRunningOnErrorHook, kReplyHasStatusCode
} = __webpack_require__(28)

const {
  FST_ERR_REP_INVALID_PAYLOAD_TYPE
} = __webpack_require__(34)

const { getSchemaSerializer } = __webpack_require__(87)

const serializeError = __webpack_require__(89)

const rootErrorHandler = {
  func: defaultErrorHandler,
  toJSON () {
    return this.func.name.toString() + '()'
  }
}

function handleError (reply, error, cb) {
  reply[kReplyIsRunningOnErrorHook] = false

  const context = reply.context
  if (reply[kReplyNextErrorHandler] === false) {
    fallbackErrorHandler(error, reply, function (reply, payload) {
      try {
        reply.raw.writeHead(reply.raw.statusCode, reply[kReplyHeaders])
      } catch (error) {
        reply.log.warn(
          { req: reply.request, res: reply, err: error },
          error && error.message
        )
        reply.raw.writeHead(reply.raw.statusCode)
      }
      reply.raw.end(payload)
    })
    return
  }
  const errorHandler = reply[kReplyNextErrorHandler] || context.errorHandler

  // In case the error handler throws, we set the next errorHandler so we can error again
  reply[kReplyNextErrorHandler] = Object.getPrototypeOf(errorHandler)

  delete reply[kReplyHeaders]['content-length']

  const func = errorHandler.func

  if (!func) {
    reply[kReplyNextErrorHandler] = false
    fallbackErrorHandler(error, reply, cb)
    return
  }

  const result = func(error, reply.request, reply)
  if (result !== undefined) {
    if (result !== null && typeof result.then === 'function') {
      wrapThenable(result, reply)
    } else {
      reply.send(result)
    }
  }
}

function defaultErrorHandler (error, request, reply) {
  setErrorHeaders(error, reply)
  if (!reply[kReplyHasStatusCode] || reply.statusCode === 200) {
    const statusCode = error.statusCode || error.status
    reply.code(statusCode >= 400 ? statusCode : 500)
  }
  if (reply.statusCode < 500) {
    reply.log.info(
      { res: reply, err: error },
      error && error.message
    )
  } else {
    reply.log.error(
      { req: request, res: reply, err: error },
      error && error.message
    )
  }
  reply.send(error)
}

function fallbackErrorHandler (error, reply, cb) {
  const res = reply.raw
  const statusCode = reply.statusCode
  let payload
  try {
    const serializerFn = getSchemaSerializer(reply.context, statusCode)
    payload = (serializerFn === false)
      ? serializeError({
        error: statusCodes[statusCode + ''],
        code: error.code,
        message: error.message,
        statusCode
      })
      : serializerFn(Object.create(error, {
        error: { value: statusCodes[statusCode + ''] },
        message: { value: error.message },
        statusCode: { value: statusCode }
      }))
  } catch (err) {
    // error is always FST_ERR_SCH_SERIALIZATION_BUILD because this is called from route/compileSchemasForSerialization
    reply.log.error({ err, statusCode: res.statusCode }, 'The serializer for the given status code failed')
    reply.code(500)
    payload = serializeError({
      error: statusCodes['500'],
      message: err.message,
      statusCode: 500
    })
  }

  if (typeof payload !== 'string' && !Buffer.isBuffer(payload)) {
    payload = serializeError(new FST_ERR_REP_INVALID_PAYLOAD_TYPE(typeof payload))
  }

  reply[kReplyHeaders]['content-type'] = 'application/json; charset=utf-8'
  reply[kReplyHeaders]['content-length'] = '' + Buffer.byteLength(payload)

  cb(reply, payload)
}

function buildErrorHandler (parent = rootErrorHandler, func) {
  if (!func) {
    return parent
  }

  const errorHandler = Object.create(parent)
  errorHandler.func = func
  return errorHandler
}

function setErrorHeaders (error, reply) {
  const res = reply.raw
  let statusCode = res.statusCode
  statusCode = (statusCode >= 400) ? statusCode : 500
  // treat undefined and null as same
  if (error != null) {
    if (error.headers !== undefined) {
      reply.headers(error.headers)
    }
    if (error.status >= 400) {
      statusCode = error.status
    } else if (error.statusCode >= 400) {
      statusCode = error.statusCode
    }
  }
  res.statusCode = statusCode
}

module.exports = {
  buildErrorHandler,
  handleError
}


/***/ }),
/* 87 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fastClone = __webpack_require__(88)({ circles: false, proto: true })
const { kSchemaVisited, kSchemaResponse } = __webpack_require__(28)
const kFluentSchema = Symbol.for('fluent-schema-object')

const {
  FST_ERR_SCH_MISSING_ID,
  FST_ERR_SCH_ALREADY_PRESENT,
  FST_ERR_SCH_DUPLICATE
} = __webpack_require__(34)

const SCHEMAS_SOURCE = ['params', 'body', 'querystring', 'query', 'headers']

function Schemas (initStore) {
  this.store = initStore || {}
}

Schemas.prototype.add = function (inputSchema) {
  const schema = fastClone((inputSchema.isFluentSchema || inputSchema.isFluentJSONSchema || inputSchema[kFluentSchema])
    ? inputSchema.valueOf()
    : inputSchema
  )

  // devs can add schemas without $id, but with $def instead
  const id = schema.$id
  if (!id) {
    throw new FST_ERR_SCH_MISSING_ID()
  }

  if (this.store[id]) {
    throw new FST_ERR_SCH_ALREADY_PRESENT(id)
  }

  this.store[id] = schema
}

Schemas.prototype.getSchemas = function () {
  return Object.assign({}, this.store)
}

Schemas.prototype.getSchema = function (schemaId) {
  return this.store[schemaId]
}

function normalizeSchema (routeSchemas, serverOptions) {
  if (routeSchemas[kSchemaVisited]) {
    return routeSchemas
  }

  // alias query to querystring schema
  if (routeSchemas.query) {
    // check if our schema has both querystring and query
    if (routeSchemas.querystring) {
      throw new FST_ERR_SCH_DUPLICATE('querystring')
    }
    routeSchemas.querystring = routeSchemas.query
  }

  generateFluentSchema(routeSchemas)

  // let's check if our schemas have a custom prototype
  for (const key of ['headers', 'querystring', 'params', 'body']) {
    if (typeof routeSchemas[key] === 'object' && Object.getPrototypeOf(routeSchemas[key]) !== Object.prototype) {
      routeSchemas[kSchemaVisited] = true
      return routeSchemas
    }
  }

  if (routeSchemas.body) {
    routeSchemas.body = getSchemaAnyway(routeSchemas.body, serverOptions.jsonShorthand)
  }

  if (routeSchemas.headers) {
    routeSchemas.headers = getSchemaAnyway(routeSchemas.headers, serverOptions.jsonShorthand)
  }

  if (routeSchemas.querystring) {
    routeSchemas.querystring = getSchemaAnyway(routeSchemas.querystring, serverOptions.jsonShorthand)
  }

  if (routeSchemas.params) {
    routeSchemas.params = getSchemaAnyway(routeSchemas.params, serverOptions.jsonShorthand)
  }

  if (routeSchemas.response) {
    const httpCodes = Object.keys(routeSchemas.response)
    for (const code of httpCodes) {
      routeSchemas.response[code] = getSchemaAnyway(routeSchemas.response[code], serverOptions.jsonShorthand)
    }
  }

  routeSchemas[kSchemaVisited] = true
  return routeSchemas
}

function generateFluentSchema (schema) {
  for (const key of SCHEMAS_SOURCE) {
    if (schema[key] && (schema[key].isFluentSchema || schema[key][kFluentSchema])) {
      schema[key] = schema[key].valueOf()
    }
  }

  if (schema.response) {
    const httpCodes = Object.keys(schema.response)
    for (const code of httpCodes) {
      if (schema.response[code].isFluentSchema || schema.response[code][kFluentSchema]) {
        schema.response[code] = schema.response[code].valueOf()
      }
    }
  }
}

function getSchemaAnyway (schema, jsonShorthand) {
  if (!jsonShorthand || schema.$ref || schema.oneOf || schema.allOf || schema.anyOf || schema.$merge || schema.$patch) return schema
  if (!schema.type && !schema.properties) {
    return {
      type: 'object',
      properties: schema
    }
  }
  return schema
}

/**
 * Search for the right JSON schema compiled function in the request context
 * setup by the route configuration `schema.response`.
 * It will look for the exact match (eg 200) or generic (eg 2xx)
 *
 * @param {object} context the request context
 * @param {number} statusCode the http status code
 * @returns {function|boolean} the right JSON Schema function to serialize
 * the reply or false if it is not set
 */
function getSchemaSerializer (context, statusCode) {
  const responseSchemaDef = context[kSchemaResponse]
  if (!responseSchemaDef) {
    return false
  }
  if (responseSchemaDef[statusCode]) {
    return responseSchemaDef[statusCode]
  }
  const fallbackStatusCode = (statusCode + '')[0] + 'xx'
  if (responseSchemaDef[fallbackStatusCode]) {
    return responseSchemaDef[fallbackStatusCode]
  }
  if (responseSchemaDef.default) {
    return responseSchemaDef.default
  }
  return false
}

module.exports = {
  buildSchemas (initStore) { return new Schemas(initStore) },
  getSchemaSerializer,
  normalizeSchema
}


/***/ }),
/* 88 */
/***/ ((module) => {

"use strict";

module.exports = rfdc

function copyBuffer (cur) {
  if (cur instanceof Buffer) {
    return Buffer.from(cur)
  }

  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length)
}

function rfdc (opts) {
  opts = opts || {}

  if (opts.circles) return rfdcCircles(opts)
  return opts.proto ? cloneProto : clone

  function cloneArray (a, fn) {
    var keys = Object.keys(a)
    var a2 = new Array(keys.length)
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      var cur = a[k]
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur)
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur)
      } else {
        a2[k] = fn(cur)
      }
    }
    return a2
  }

  function clone (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone))
    var o2 = {}
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), clone))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), clone))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        o2[k] = clone(cur)
      }
    }
    return o2
  }

  function cloneProto (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), cloneProto))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), cloneProto))
    var o2 = {}
    for (var k in o) {
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), cloneProto))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), cloneProto))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        o2[k] = cloneProto(cur)
      }
    }
    return o2
  }
}

function rfdcCircles (opts) {
  var refs = []
  var refsNew = []

  return opts.proto ? cloneProto : clone

  function cloneArray (a, fn) {
    var keys = Object.keys(a)
    var a2 = new Array(keys.length)
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      var cur = a[k]
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur)
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur)
      } else {
        var index = refs.indexOf(cur)
        if (index !== -1) {
          a2[k] = refsNew[index]
        } else {
          a2[k] = fn(cur)
        }
      }
    }
    return a2
  }

  function clone (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone))
    var o2 = {}
    refs.push(o)
    refsNew.push(o2)
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), clone))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), clone))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        var i = refs.indexOf(cur)
        if (i !== -1) {
          o2[k] = refsNew[i]
        } else {
          o2[k] = clone(cur)
        }
      }
    }
    refs.pop()
    refsNew.pop()
    return o2
  }

  function cloneProto (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), cloneProto))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), cloneProto))
    var o2 = {}
    refs.push(o)
    refsNew.push(o2)
    for (var k in o) {
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), cloneProto))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), cloneProto))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        var i = refs.indexOf(cur)
        if (i !== -1) {
          o2[k] = refsNew[i]
        } else {
          o2[k] = cloneProto(cur)
        }
      }
    }
    refs.pop()
    refsNew.pop()
    return o2
  }
}


/***/ }),
/* 89 */
/***/ ((module) => {

"use strict";
// This file is autogenerated by build/build-error-serializer.js, do not edit
/* istanbul ignore file */

  

  

class Serializer {
  constructor (options = {}) {
    switch (options.rounding) {
      case 'floor':
        this.parseInteger = Math.floor
        break
      case 'ceil':
        this.parseInteger = Math.ceil
        break
      case 'round':
        this.parseInteger = Math.round
        break
      default:
        this.parseInteger = Math.trunc
        break
    }
  }

  asInteger (i) {
    if (typeof i === 'bigint') {
      return i.toString()
    } else if (Number.isInteger(i)) {
      return '' + i
    } else {
      /* eslint no-undef: "off" */
      const integer = this.parseInteger(i)
      if (Number.isNaN(integer) || !Number.isFinite(integer)) {
        throw new Error(`The value "${i}" cannot be converted to an integer.`)
      } else {
        return '' + integer
      }
    }
  }

  asNumber (i) {
    const num = Number(i)
    if (Number.isNaN(num)) {
      throw new Error(`The value "${i}" cannot be converted to a number.`)
    } else if (!Number.isFinite(num)) {
      return null
    } else {
      return '' + num
    }
  }

  asBoolean (bool) {
    return bool && 'true' || 'false' // eslint-disable-line
  }

  asDateTime (date) {
    if (date === null) return '""'
    if (date instanceof Date) {
      return '"' + date.toISOString() + '"'
    }
    if (typeof date === 'string') {
      return '"' + date + '"'
    }
    throw new Error(`The value "${date}" cannot be converted to a date-time.`)
  }

  asDate (date) {
    if (date === null) return '""'
    if (date instanceof Date) {
      return '"' + new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10) + '"'
    }
    if (typeof date === 'string') {
      return '"' + date + '"'
    }
    throw new Error(`The value "${date}" cannot be converted to a date.`)
  }

  asTime (date) {
    if (date === null) return '""'
    if (date instanceof Date) {
      return '"' + new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(11, 19) + '"'
    }
    if (typeof date === 'string') {
      return '"' + date + '"'
    }
    throw new Error(`The value "${date}" cannot be converted to a time.`)
  }

  asString (str) {
    const quotes = '"'
    if (str instanceof Date) {
      return quotes + str.toISOString() + quotes
    } else if (str === null) {
      return quotes + quotes
    } else if (str instanceof RegExp) {
      str = str.source
    } else if (typeof str !== 'string') {
      str = str.toString()
    }

    if (str.length < 42) {
      return this.asStringSmall(str)
    } else {
      return JSON.stringify(str)
    }
  }

  // magically escape strings for json
  // relying on their charCodeAt
  // everything below 32 needs JSON.stringify()
  // every string that contain surrogate needs JSON.stringify()
  // 34 and 92 happens all the time, so we
  // have a fast case for them
  asStringSmall (str) {
    const l = str.length
    let result = ''
    let last = 0
    let found = false
    let surrogateFound = false
    let point = 255
    // eslint-disable-next-line
    for (var i = 0; i < l && point >= 32; i++) {
      point = str.charCodeAt(i)
      if (point >= 0xD800 && point <= 0xDFFF) {
        // The current character is a surrogate.
        surrogateFound = true
      }
      if (point === 34 || point === 92) {
        result += str.slice(last, i) + '\\'
        last = i
        found = true
      }
    }

    if (!found) {
      result = str
    } else {
      result += str.slice(last)
    }
    return ((point < 32) || (surrogateFound === true)) ? JSON.stringify(str) : '"' + result + '"'
  }
}

  

  const serializer = new Serializer({"mode":"standalone"})
  

  
    function main (input) {
      let json = ''
      json += anonymous0(input)
      return json
    }
    
    function anonymous0 (input) {
      // #
  
      var obj = (input && typeof input.toJSON === 'function')
    ? input.toJSON()
    : input
  
      var json = '{'
      var addComma = false
  
      if (obj["statusCode"] !== undefined) {
        
  if (addComma) {
    json += ','
  } else {
    addComma = true
  }

        json += "\"statusCode\"" + ':'
      json += serializer.asNumber(obj["statusCode"])
      }
    
      if (obj["code"] !== undefined) {
        
  if (addComma) {
    json += ','
  } else {
    addComma = true
  }

        json += "\"code\"" + ':'
      json += serializer.asString(obj["code"])
      }
    
      if (obj["error"] !== undefined) {
        
  if (addComma) {
    json += ','
  } else {
    addComma = true
  }

        json += "\"error\"" + ':'
      json += serializer.asString(obj["error"])
      }
    
      if (obj["message"] !== undefined) {
        
  if (addComma) {
    json += ','
  } else {
    addComma = true
  }

        json += "\"message\"" + ':'
      json += serializer.asString(obj["message"])
      }
    
      json += '}'
      return json
    }
  
    
    

  module.exports = main
      


/***/ }),
/* 90 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const proxyAddr = __webpack_require__(91)
const semver = __webpack_require__(92)
const warning = __webpack_require__(32)
const {
  kHasBeenDecorated,
  kSchemaBody,
  kSchemaHeaders,
  kSchemaParams,
  kSchemaQuerystring,
  kSchemaController,
  kOptions,
  kRequestValidateWeakMap
} = __webpack_require__(28)
const { FST_ERR_REQ_INVALID_VALIDATION_INVOCATION } = __webpack_require__(34)

const HTTP_PART_SYMBOL_MAP = {
  body: kSchemaBody,
  headers: kSchemaHeaders,
  params: kSchemaParams,
  querystring: kSchemaQuerystring,
  query: kSchemaQuerystring
}

function Request (id, params, req, query, log, context) {
  this.id = id
  this.context = context
  this.params = params
  this.raw = req
  this.query = query
  this.log = log
  this.body = undefined
}
Request.props = []

function getTrustProxyFn (tp) {
  if (typeof tp === 'function') {
    return tp
  }
  if (tp === true) {
    // Support plain true/false
    return function () { return true }
  }
  if (typeof tp === 'number') {
    // Support trusting hop count
    return function (a, i) { return i < tp }
  }
  if (typeof tp === 'string') {
    // Support comma-separated tps
    const vals = tp.split(',').map(it => it.trim())
    return proxyAddr.compile(vals)
  }
  return proxyAddr.compile(tp)
}

function buildRequest (R, trustProxy) {
  if (trustProxy) {
    return buildRequestWithTrustProxy(R, trustProxy)
  }

  return buildRegularRequest(R)
}

function buildRegularRequest (R) {
  const props = [...R.props]
  function _Request (id, params, req, query, log, context) {
    this.id = id
    this.context = context
    this.params = params
    this.raw = req
    this.query = query
    this.log = log
    this.body = undefined

    // eslint-disable-next-line no-var
    var prop
    // eslint-disable-next-line no-var
    for (var i = 0; i < props.length; i++) {
      prop = props[i]
      this[prop.key] = prop.value
    }
  }
  Object.setPrototypeOf(_Request.prototype, R.prototype)
  Object.setPrototypeOf(_Request, R)
  _Request.props = props
  _Request.parent = R

  return _Request
}

function getLastEntryInMultiHeaderValue (headerValue) {
  // we use the last one if the header is set more than once
  const lastIndex = headerValue.lastIndexOf(',')
  return lastIndex === -1 ? headerValue.trim() : headerValue.slice(lastIndex + 1).trim()
}

function buildRequestWithTrustProxy (R, trustProxy) {
  const _Request = buildRegularRequest(R)
  const proxyFn = getTrustProxyFn(trustProxy)

  // This is a more optimized version of decoration
  _Request[kHasBeenDecorated] = true

  Object.defineProperties(_Request.prototype, {
    ip: {
      get () {
        return proxyAddr(this.raw, proxyFn)
      }
    },
    ips: {
      get () {
        return proxyAddr.all(this.raw, proxyFn)
      }
    },
    hostname: {
      get () {
        if (this.ip !== undefined && this.headers['x-forwarded-host']) {
          return getLastEntryInMultiHeaderValue(this.headers['x-forwarded-host'])
        }
        return this.headers.host || this.headers[':authority']
      }
    },
    protocol: {
      get () {
        if (this.headers['x-forwarded-proto']) {
          return getLastEntryInMultiHeaderValue(this.headers['x-forwarded-proto'])
        }
        if (this.socket) {
          return this.socket.encrypted ? 'https' : 'http'
        }
      }
    }
  })

  return _Request
}

Object.defineProperties(Request.prototype, {
  server: {
    get () {
      return this.context.server
    }
  },
  url: {
    get () {
      return this.raw.url
    }
  },
  method: {
    get () {
      return this.raw.method
    }
  },
  routerPath: {
    get () {
      return this.context.config.url
    }
  },
  routerMethod: {
    get () {
      return this.context.config.method
    }
  },
  is404: {
    get () {
      return this.context.config.url === undefined
    }
  },
  connection: {
    get () {
      /* istanbul ignore next */
      if (semver.gte(process.versions.node, '13.0.0')) {
        warning.emit('FSTDEP005')
      }
      return this.raw.connection
    }
  },
  socket: {
    get () {
      return this.raw.socket
    }
  },
  ip: {
    get () {
      if (this.socket) {
        return this.socket.remoteAddress
      }
    }
  },
  hostname: {
    get () {
      return this.raw.headers.host || this.raw.headers[':authority']
    }
  },
  protocol: {
    get () {
      if (this.socket) {
        return this.socket.encrypted ? 'https' : 'http'
      }
    }
  },
  headers: {
    get () {
      if (this.additionalHeaders) {
        return Object.assign({}, this.raw.headers, this.additionalHeaders)
      }
      return this.raw.headers
    },
    set (headers) {
      this.additionalHeaders = headers
    }
  },
  getValidationFunction: {
    value: function (httpPartOrSchema) {
      if (typeof httpPartOrSchema === 'string') {
        const symbol = HTTP_PART_SYMBOL_MAP[httpPartOrSchema]
        return this.context[symbol]
      } else if (typeof httpPartOrSchema === 'object') {
        return this.context[kRequestValidateWeakMap]?.get(httpPartOrSchema)
      }
    }
  },
  compileValidationSchema: {
    value: function (schema, httpPart = null) {
      const { method, url } = this

      if (this.context[kRequestValidateWeakMap]?.has(schema)) {
        return this.context[kRequestValidateWeakMap].get(schema)
      }

      const validatorCompiler = this.context.validatorCompiler ||
      this.server[kSchemaController].validatorCompiler ||
     (
       // We compile the schemas if no custom validatorCompiler is provided
       // nor set
       this.server[kSchemaController].setupValidator(this.server[kOptions]) ||
       this.server[kSchemaController].validatorCompiler
     )

      const validateFn = validatorCompiler({
        schema,
        method,
        url,
        httpPart
      })

      // We create a WeakMap to compile the schema only once
      // Its done leazily to avoid add overhead by creating the WeakMap
      // if it is not used
      // TODO: Explore a central cache for all the schemas shared across
      // encapsulated contexts
      if (this.context[kRequestValidateWeakMap] == null) {
        this.context[kRequestValidateWeakMap] = new WeakMap()
      }

      this.context[kRequestValidateWeakMap].set(schema, validateFn)

      return validateFn
    }
  },
  validateInput: {
    value: function (input, schema, httpPart) {
      httpPart = typeof schema === 'string' ? schema : httpPart

      const symbol = (httpPart != null && typeof httpPart === 'string') && HTTP_PART_SYMBOL_MAP[httpPart]
      let validate

      if (symbol) {
        // Validate using the HTTP Request Part schema
        validate = this.context[symbol]
      }

      // We cannot compile if the schema is missed
      if (validate == null && (schema == null ||
          typeof schema !== 'object' ||
          Array.isArray(schema))
      ) {
        throw new FST_ERR_REQ_INVALID_VALIDATION_INVOCATION(httpPart)
      }

      if (validate == null) {
        if (this.context[kRequestValidateWeakMap]?.has(schema)) {
          validate = this.context[kRequestValidateWeakMap].get(schema)
        } else {
          // We proceed to compile if there's no validate function yet
          validate = this.compileValidationSchema(schema, httpPart)
        }
      }

      return validate(input)
    }
  }
})

module.exports = Request
module.exports.buildRequest = buildRequest


/***/ }),
/* 91 */
/***/ ((module) => {

"use strict";
module.exports = require("proxy-addr");

/***/ }),
/* 92 */
/***/ ((module) => {

"use strict";
module.exports = require("semver");

/***/ }),
/* 93 */
/***/ ((module) => {

"use strict";


module.exports = {
  supportedMethods: [
    'DELETE',
    'GET',
    'HEAD',
    'PATCH',
    'POST',
    'PUT',
    'OPTIONS',
    'PROPFIND',
    'PROPPATCH',
    'MKCOL',
    'COPY',
    'MOVE',
    'LOCK',
    'UNLOCK',
    'TRACE',
    'SEARCH'
  ]
}


/***/ }),
/* 94 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* eslint no-prototype-builtins: 0 */

const {
  kReply,
  kRequest,
  kState,
  kHasBeenDecorated
} = __webpack_require__(28)

const {
  FST_ERR_DEC_ALREADY_PRESENT,
  FST_ERR_DEC_MISSING_DEPENDENCY,
  FST_ERR_DEC_AFTER_START,
  FST_ERR_DEC_DEPENDENCY_INVALID_TYPE
} = __webpack_require__(34)

const warning = __webpack_require__(32)

function decorate (instance, name, fn, dependencies) {
  if (Object.prototype.hasOwnProperty.call(instance, name)) {
    throw new FST_ERR_DEC_ALREADY_PRESENT(name)
  }

  checkDependencies(instance, name, dependencies)

  if (fn && (typeof fn.getter === 'function' || typeof fn.setter === 'function')) {
    Object.defineProperty(instance, name, {
      get: fn.getter,
      set: fn.setter
    })
  } else {
    instance[name] = fn
  }
}

function decorateConstructor (konstructor, name, fn, dependencies) {
  const instance = konstructor.prototype
  if (Object.prototype.hasOwnProperty.call(instance, name) || hasKey(konstructor, name)) {
    throw new FST_ERR_DEC_ALREADY_PRESENT(name)
  }

  konstructor[kHasBeenDecorated] = true
  checkDependencies(konstructor, name, dependencies)

  if (fn && (typeof fn.getter === 'function' || typeof fn.setter === 'function')) {
    Object.defineProperty(instance, name, {
      get: fn.getter,
      set: fn.setter
    })
  } else if (typeof fn === 'function') {
    instance[name] = fn
  } else {
    konstructor.props.push({ key: name, value: fn })
  }
}

function checkReferenceType (name, fn) {
  if (typeof fn === 'object' && fn && !(typeof fn.getter === 'function' || typeof fn.setter === 'function')) {
    warning.emit('FSTDEP006', name)
  }
}

function decorateFastify (name, fn, dependencies) {
  assertNotStarted(this, name)
  decorate(this, name, fn, dependencies)
  return this
}

function checkExistence (instance, name) {
  if (name) {
    return name in instance || (instance.prototype && name in instance.prototype) || hasKey(instance, name)
  }

  return instance in this
}

function hasKey (fn, name) {
  if (fn.props) {
    return fn.props.find(({ key }) => key === name)
  }
  return false
}

function checkRequestExistence (name) {
  if (name && hasKey(this[kRequest], name)) return true
  return checkExistence(this[kRequest].prototype, name)
}

function checkReplyExistence (name) {
  if (name && hasKey(this[kReply], name)) return true
  return checkExistence(this[kReply].prototype, name)
}

function checkDependencies (instance, name, deps) {
  if (deps === undefined || deps === null) {
    return
  }

  if (!Array.isArray(deps)) {
    throw new FST_ERR_DEC_DEPENDENCY_INVALID_TYPE(name)
  }

  // eslint-disable-next-line no-var
  for (var i = 0; i !== deps.length; ++i) {
    if (!checkExistence(instance, deps[i])) {
      throw new FST_ERR_DEC_MISSING_DEPENDENCY(deps[i])
    }
  }
}

function decorateReply (name, fn, dependencies) {
  assertNotStarted(this, name)
  checkReferenceType(name, fn)
  decorateConstructor(this[kReply], name, fn, dependencies)
  return this
}

function decorateRequest (name, fn, dependencies) {
  assertNotStarted(this, name)
  checkReferenceType(name, fn)
  decorateConstructor(this[kRequest], name, fn, dependencies)
  return this
}

function assertNotStarted (instance, name) {
  if (instance[kState].started) {
    throw new FST_ERR_DEC_AFTER_START(name)
  }
}

module.exports = {
  add: decorateFastify,
  exist: checkExistence,
  existRequest: checkRequestExistence,
  existReply: checkReplyExistence,
  dependencies: checkDependencies,
  decorateReply,
  decorateRequest
}


/***/ }),
/* 95 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { AsyncResource } = __webpack_require__(96)
let lru = __webpack_require__(97)
// Needed to handle Webpack and faux modules
// See https://github.com/fastify/fastify/issues/2356
// and https://github.com/fastify/fastify/discussions/2907.
lru = typeof lru === 'function' ? lru : lru.default

const secureJson = __webpack_require__(98)
const {
  kDefaultJsonParse,
  kContentTypeParser,
  kBodyLimit,
  kRequestPayloadStream,
  kState,
  kTestInternals,
  kReplyIsError
} = __webpack_require__(28)

const {
  FST_ERR_CTP_INVALID_TYPE,
  FST_ERR_CTP_EMPTY_TYPE,
  FST_ERR_CTP_ALREADY_PRESENT,
  FST_ERR_CTP_INVALID_HANDLER,
  FST_ERR_CTP_INVALID_PARSE_TYPE,
  FST_ERR_CTP_BODY_TOO_LARGE,
  FST_ERR_CTP_INVALID_MEDIA_TYPE,
  FST_ERR_CTP_INVALID_CONTENT_LENGTH,
  FST_ERR_CTP_EMPTY_JSON_BODY
} = __webpack_require__(34)

function ContentTypeParser (bodyLimit, onProtoPoisoning, onConstructorPoisoning) {
  this[kDefaultJsonParse] = getDefaultJsonParser(onProtoPoisoning, onConstructorPoisoning)
  this.customParsers = {}
  this.customParsers['application/json'] = new Parser(true, false, bodyLimit, this[kDefaultJsonParse])
  this.customParsers['text/plain'] = new Parser(true, false, bodyLimit, defaultPlainTextParser)
  this.parserList = ['application/json', 'text/plain']
  this.parserRegExpList = []
  this.cache = lru(100)
}

ContentTypeParser.prototype.add = function (contentType, opts, parserFn) {
  const contentTypeIsString = typeof contentType === 'string'

  if (!contentTypeIsString && !(contentType instanceof RegExp)) throw new FST_ERR_CTP_INVALID_TYPE()
  if (contentTypeIsString && contentType.length === 0) throw new FST_ERR_CTP_EMPTY_TYPE()
  if (typeof parserFn !== 'function') throw new FST_ERR_CTP_INVALID_HANDLER()

  if (this.existingParser(contentType)) {
    throw new FST_ERR_CTP_ALREADY_PRESENT(contentType)
  }

  if (opts.parseAs !== undefined) {
    if (opts.parseAs !== 'string' && opts.parseAs !== 'buffer') {
      throw new FST_ERR_CTP_INVALID_PARSE_TYPE(opts.parseAs)
    }
  }

  const parser = new Parser(
    opts.parseAs === 'string',
    opts.parseAs === 'buffer',
    opts.bodyLimit,
    parserFn
  )

  if (contentTypeIsString && contentType === '*') {
    this.customParsers[''] = parser
  } else {
    if (contentTypeIsString) {
      this.parserList.unshift(contentType)
    } else {
      this.parserRegExpList.unshift(contentType)
    }
    this.customParsers[contentType] = parser
  }
}

ContentTypeParser.prototype.hasParser = function (contentType) {
  return contentType in this.customParsers
}

ContentTypeParser.prototype.existingParser = function (contentType) {
  if (contentType === 'application/json') {
    return this.customParsers['application/json'] && this.customParsers['application/json'].fn !== this[kDefaultJsonParse]
  }
  if (contentType === 'text/plain') {
    return this.customParsers['text/plain'] && this.customParsers['text/plain'].fn !== defaultPlainTextParser
  }

  return contentType in this.customParsers
}

ContentTypeParser.prototype.getParser = function (contentType) {
  if (contentType in this.customParsers) {
    return this.customParsers[contentType]
  }

  if (this.cache.has(contentType)) {
    return this.cache.get(contentType)
  }

  // eslint-disable-next-line no-var
  for (var i = 0; i !== this.parserList.length; ++i) {
    const parserName = this.parserList[i]
    if (contentType.indexOf(parserName) !== -1) {
      const parser = this.customParsers[parserName]
      this.cache.set(contentType, parser)
      return parser
    }
  }

  // eslint-disable-next-line no-var
  for (var j = 0; j !== this.parserRegExpList.length; ++j) {
    const parserRegExp = this.parserRegExpList[j]
    if (parserRegExp.test(contentType)) {
      const parser = this.customParsers[parserRegExp]
      this.cache.set(contentType, parser)
      return parser
    }
  }

  return this.customParsers['']
}

ContentTypeParser.prototype.removeAll = function () {
  this.customParsers = {}
  this.parserRegExpList = []
  this.parserList = []
  this.cache = lru(100)
}

ContentTypeParser.prototype.remove = function (contentType) {
  if (!(typeof contentType === 'string' || contentType instanceof RegExp)) throw new FST_ERR_CTP_INVALID_TYPE()

  delete this.customParsers[contentType]

  const parsers = typeof contentType === 'string' ? this.parserList : this.parserRegExpList

  const idx = parsers.findIndex(ct => ct.toString() === contentType.toString())

  if (idx > -1) {
    parsers.splice(idx, 1)
  }
}

ContentTypeParser.prototype.run = function (contentType, handler, request, reply) {
  const parser = this.getParser(contentType)
  const resource = new AsyncResource('content-type-parser:run', request)

  if (parser === undefined) {
    reply.send(new FST_ERR_CTP_INVALID_MEDIA_TYPE(contentType || undefined))
  } else if (parser.asString === true || parser.asBuffer === true) {
    rawBody(
      request,
      reply,
      reply.context._parserOptions,
      parser,
      done
    )
  } else {
    const result = parser.fn(request, request[kRequestPayloadStream], done)

    if (result && typeof result.then === 'function') {
      result.then(body => done(null, body), done)
    }
  }

  function done (error, body) {
    // We cannot use resource.bind() because it is broken in node v12 and v14
    resource.runInAsyncScope(() => {
      if (error) {
        reply[kReplyIsError] = true
        reply.send(error)
      } else {
        request.body = body
        handler(request, reply)
      }
    })
  }
}

function rawBody (request, reply, options, parser, done) {
  const asString = parser.asString
  const limit = options.limit === null ? parser.bodyLimit : options.limit
  const contentLength = request.headers['content-length'] === undefined
    ? NaN
    : Number.parseInt(request.headers['content-length'], 10)

  if (contentLength > limit) {
    reply.send(new FST_ERR_CTP_BODY_TOO_LARGE())
    return
  }

  let receivedLength = 0
  let body = asString === true ? '' : []

  const payload = request[kRequestPayloadStream] || request.raw

  if (asString === true) {
    payload.setEncoding('utf8')
  }

  payload.on('data', onData)
  payload.on('end', onEnd)
  payload.on('error', onEnd)
  payload.resume()

  function onData (chunk) {
    receivedLength += chunk.length

    if ((payload.receivedEncodedLength || receivedLength) > limit) {
      payload.removeListener('data', onData)
      payload.removeListener('end', onEnd)
      payload.removeListener('error', onEnd)
      reply.send(new FST_ERR_CTP_BODY_TOO_LARGE())
      return
    }

    if (asString === true) {
      body += chunk
    } else {
      body.push(chunk)
    }
  }

  function onEnd (err) {
    payload.removeListener('data', onData)
    payload.removeListener('end', onEnd)
    payload.removeListener('error', onEnd)

    if (err !== undefined) {
      err.statusCode = 400
      reply[kReplyIsError] = true
      reply.code(err.statusCode).send(err)
      return
    }

    if (asString === true) {
      receivedLength = Buffer.byteLength(body)
    }

    if (!Number.isNaN(contentLength) && (payload.receivedEncodedLength || receivedLength) !== contentLength) {
      reply.send(new FST_ERR_CTP_INVALID_CONTENT_LENGTH())
      return
    }

    if (asString === false) {
      body = Buffer.concat(body)
    }

    const result = parser.fn(request, body, done)
    if (result && typeof result.then === 'function') {
      result.then(body => done(null, body), done)
    }
  }
}

function getDefaultJsonParser (onProtoPoisoning, onConstructorPoisoning) {
  return defaultJsonParser

  function defaultJsonParser (req, body, done) {
    if (body === '' || body == null) {
      return done(new FST_ERR_CTP_EMPTY_JSON_BODY(), undefined)
    }
    let json
    try {
      json = secureJson.parse(body, { protoAction: onProtoPoisoning, constructorAction: onConstructorPoisoning })
    } catch (err) {
      err.statusCode = 400
      return done(err, undefined)
    }
    done(null, json)
  }
}

function defaultPlainTextParser (req, body, done) {
  done(null, body)
}

function Parser (asString, asBuffer, bodyLimit, fn) {
  this.asString = asString
  this.asBuffer = asBuffer
  this.bodyLimit = bodyLimit
  this.fn = fn
}

function buildContentTypeParser (c) {
  const contentTypeParser = new ContentTypeParser()
  contentTypeParser[kDefaultJsonParse] = c[kDefaultJsonParse]
  Object.assign(contentTypeParser.customParsers, c.customParsers)
  contentTypeParser.parserList = c.parserList.slice()
  return contentTypeParser
}

function addContentTypeParser (contentType, opts, parser) {
  if (this[kState].started) {
    throw new Error('Cannot call "addContentTypeParser" when fastify instance is already started!')
  }

  if (typeof opts === 'function') {
    parser = opts
    opts = {}
  }

  if (!opts) opts = {}
  if (!opts.bodyLimit) opts.bodyLimit = this[kBodyLimit]

  if (Array.isArray(contentType)) {
    contentType.forEach((type) => this[kContentTypeParser].add(type, opts, parser))
  } else {
    this[kContentTypeParser].add(contentType, opts, parser)
  }

  return this
}

function hasContentTypeParser (contentType) {
  return this[kContentTypeParser].hasParser(contentType)
}

function removeContentTypeParser (contentType) {
  if (this[kState].started) {
    throw new Error('Cannot call "removeContentTypeParser" when fastify instance is already started!')
  }

  if (Array.isArray(contentType)) {
    for (const type of contentType) {
      this[kContentTypeParser].remove(type)
    }
  } else {
    this[kContentTypeParser].remove(contentType)
  }
}

function removeAllContentTypeParsers () {
  if (this[kState].started) {
    throw new Error('Cannot call "removeAllContentTypeParsers" when fastify instance is already started!')
  }

  this[kContentTypeParser].removeAll()
}

module.exports = ContentTypeParser
module.exports.helpers = {
  buildContentTypeParser,
  addContentTypeParser,
  hasContentTypeParser,
  removeContentTypeParser,
  removeAllContentTypeParsers
}
module.exports.defaultParsers = {
  getDefaultJsonParser,
  defaultTextParser: defaultPlainTextParser
}
module.exports[kTestInternals] = { rawBody }


/***/ }),
/* 96 */
/***/ ((module) => {

"use strict";
module.exports = require("async_hooks");

/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ s)
/* harmony export */ });
class t{constructor(t=0,s=0){this.first=null,this.items=Object.create(null),this.last=null,this.max=t,this.size=0,this.ttl=s}has(t){return t in this.items}clear(){return this.first=null,this.items=Object.create(null),this.last=null,this.size=0,this}delete(t){if(this.has(t)){const s=this.items[t];delete this.items[t],this.size--,null!==s.prev&&(s.prev.next=s.next),null!==s.next&&(s.next.prev=s.prev),this.first===s&&(this.first=s.next),this.last===s&&(this.last=s.prev)}return this}evict(t=!1){if(t||this.size>0){const t=this.first;delete this.items[t.key],this.size--,0===this.size?(this.first=null,this.last=null):(this.first=t.next,this.first.prev=null)}return this}get(t){let s;if(this.has(t)){const i=this.items[t];this.ttl>0&&i.expiry<=(new Date).getTime()?this.delete(t):(s=i.value,this.set(t,s,!0))}return s}keys(){return Object.keys(this.items)}set(t,s,i=!1){let e;if(i||this.has(t)){if(e=this.items[t],e.value=s,this.last!==e){const t=this.last,s=e.next,i=e.prev;this.first===e&&(this.first=e.next),e.next=null,e.prev=this.last,t.next=e,null!==i&&(i.next=s),null!==s&&(s.prev=i)}}else this.max>0&&this.size===this.max&&this.evict(!0),e=this.items[t]={expiry:this.ttl>0?(new Date).getTime()+this.ttl:this.ttl,key:t,prev:this.last,next:null,value:s},1==++this.size?this.first=e:this.last.next=e;return this.last=e,this}}function s(s=1e3,i=0){if(isNaN(s)||s<0)throw new TypeError("Invalid max value");if(isNaN(i)||i<0)throw new TypeError("Invalid ttl value");return new t(s,i)}

/***/ }),
/* 98 */
/***/ ((module) => {

"use strict";


const hasBuffer = typeof Buffer !== 'undefined'
const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/

function parse (text, reviver, options) {
  // Normalize arguments
  if (options == null) {
    if (reviver !== null && typeof reviver === 'object') {
      options = reviver
      reviver = undefined
    }
  }

  if (hasBuffer && Buffer.isBuffer(text)) {
    text = text.toString()
  }

  // BOM checker
  if (text && text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1)
  }

  // Parse normally, allowing exceptions
  const obj = JSON.parse(text, reviver)

  // Ignore null and non-objects
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  const protoAction = (options && options.protoAction) || 'error'
  const constructorAction = (options && options.constructorAction) || 'error'

  // options: 'error' (default) / 'remove' / 'ignore'
  if (protoAction === 'ignore' && constructorAction === 'ignore') {
    return obj
  }

  if (protoAction !== 'ignore' && constructorAction !== 'ignore') {
    if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
      return obj
    }
  } else if (protoAction !== 'ignore' && constructorAction === 'ignore') {
    if (suspectProtoRx.test(text) === false) {
      return obj
    }
  } else {
    if (suspectConstructorRx.test(text) === false) {
      return obj
    }
  }

  // Scan result for proto keys
  return filter(obj, { protoAction, constructorAction, safe: options && options.safe })
}

function filter (obj, { protoAction = 'error', constructorAction = 'error', safe } = {}) {
  let next = [obj]

  while (next.length) {
    const nodes = next
    next = []

    for (const node of nodes) {
      if (protoAction !== 'ignore' && Object.prototype.hasOwnProperty.call(node, '__proto__')) { // Avoid calling node.hasOwnProperty directly
        if (safe === true) {
          return null
        } else if (protoAction === 'error') {
          throw new SyntaxError('Object contains forbidden prototype property')
        }

        delete node.__proto__ // eslint-disable-line no-proto
      }

      if (constructorAction !== 'ignore' &&
          Object.prototype.hasOwnProperty.call(node, 'constructor') &&
          Object.prototype.hasOwnProperty.call(node.constructor, 'prototype')) { // Avoid calling node.hasOwnProperty directly
        if (safe === true) {
          return null
        } else if (constructorAction === 'error') {
          throw new SyntaxError('Object contains forbidden prototype property')
        }

        delete node.constructor
      }

      for (const key in node) {
        const value = node[key]
        if (value && typeof value === 'object') {
          next.push(value)
        }
      }
    }
  }
  return obj
}

function safeParse (text, reviver) {
  try {
    return parse(text, reviver, { safe: true })
  } catch (ignoreError) {
    return null
  }
}

module.exports = {
  parse,
  scan: filter,
  safeParse
}


/***/ }),
/* 99 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { buildSchemas } = __webpack_require__(87)
const SerializerSelector = __webpack_require__(100)
const ValidatorSelector = __webpack_require__(119)

/**
 * Called at every fastify context that is being created.
 * @param {object} parentSchemaCtrl: the SchemaController instance of the Fastify parent context
 * @param {object} opts: the `schemaController` server option. It can be undefined when a parentSchemaCtrl is set
 * @return {object}:a new SchemaController
 */
function buildSchemaController (parentSchemaCtrl, opts) {
  if (parentSchemaCtrl) {
    return new SchemaController(parentSchemaCtrl, opts)
  }

  let compilersFactory = {
    buildValidator: ValidatorSelector(),
    buildSerializer: SerializerSelector()
  }
  if (opts && opts.compilersFactory) {
    compilersFactory = Object.assign(compilersFactory, opts.compilersFactory)
  }

  const option = {
    bucket: (opts && opts.bucket) || buildSchemas,
    compilersFactory
  }

  return new SchemaController(undefined, option)
}

class SchemaController {
  constructor (parent, options) {
    this.opts = options || (parent && parent.opts)
    this.addedSchemas = false

    this.compilersFactory = this.opts.compilersFactory

    if (parent) {
      this.schemaBucket = this.opts.bucket(parent.getSchemas())
      this.validatorCompiler = parent.getValidatorCompiler()
      this.serializerCompiler = parent.getSerializerCompiler()
      this.parent = parent
    } else {
      this.schemaBucket = this.opts.bucket()
    }
  }

  // Bucket interface
  add (schema) {
    this.addedSchemas = true
    return this.schemaBucket.add(schema)
  }

  getSchema (schemaId) {
    return this.schemaBucket.getSchema(schemaId)
  }

  getSchemas () {
    return this.schemaBucket.getSchemas()
  }

  // Schema Controller compilers holder
  setValidatorCompiler (validatorCompiler) {
    this.validatorCompiler = validatorCompiler
  }

  setSerializerCompiler (serializerCompiler) {
    this.serializerCompiler = serializerCompiler
  }

  getValidatorCompiler () {
    return this.validatorCompiler || (this.parent && this.parent.getValidatorCompiler())
  }

  getSerializerCompiler () {
    return this.serializerCompiler || (this.parent && this.parent.getSerializerCompiler())
  }

  getSerializerBuilder () {
    return this.compilersFactory.buildSerializer || (this.parent && this.parent.getSerializerBuilder())
  }

  getValidatorBuilder () {
    return this.compilersFactory.buildValidator || (this.parent && this.parent.getValidatorBuilder())
  }

  /**
   * This method will be called when a validator must be setup.
   * Do not setup the compiler more than once
   * @param {object} serverOptions: the fastify server option
   */
  setupValidator (serverOption) {
    const isReady = this.validatorCompiler !== undefined && !this.addedSchemas
    if (isReady) {
      return
    }
    this.validatorCompiler = this.getValidatorBuilder()(this.schemaBucket.getSchemas(), serverOption.ajv)
  }

  /**
   * This method will be called when a serializer must be setup.
   * Do not setup the compiler more than once
   * @param {object} serverOptions: the fastify server option
   */
  setupSerializer (serverOption) {
    const isReady = this.serializerCompiler !== undefined && !this.addedSchemas
    if (isReady) {
      return
    }

    this.serializerCompiler = this.getSerializerBuilder()(this.schemaBucket.getSchemas(), serverOption.serializerOpts)
  }
}

SchemaController.buildSchemaController = buildSchemaController
module.exports = SchemaController


/***/ }),
/* 100 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fastJsonStringify = __webpack_require__(101)

function SerializerSelector () {
  return function buildSerializerFactory (externalSchemas, serializerOpts) {
    const fjsOpts = Object.assign({}, serializerOpts, { schema: externalSchemas })
    return responseSchemaCompiler.bind(null, fjsOpts)
  }
}

function responseSchemaCompiler (fjsOpts, { schema /* method, url, httpStatus */ }) {
  if (fjsOpts.schema && schema.$id && fjsOpts.schema[schema.$id]) {
    fjsOpts.schema = { ...fjsOpts.schema }
    delete fjsOpts.schema[schema.$id]
  }
  return fastJsonStringify(schema, fjsOpts)
}

module.exports = SerializerSelector
module.exports["default"] = SerializerSelector
module.exports.SerializerSelector = SerializerSelector
module.exports.StandaloneSerializer = __webpack_require__(118)


/***/ }),
/* 101 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* eslint no-prototype-builtins: 0 */

const merge = __webpack_require__(102)()
const clone = __webpack_require__(88)({ proto: true })
const { randomUUID } = __webpack_require__(103)

const validate = __webpack_require__(104)
const Serializer = __webpack_require__(107)
const Validator = __webpack_require__(108)
const RefResolver = __webpack_require__(115)

let largeArraySize = 2e4
let largeArrayMechanism = 'default'
const validLargeArrayMechanisms = [
  'default',
  'json-stringify'
]

const addComma = `
  if (addComma) {
    json += ','
  } else {
    addComma = true
  }
`

function isValidSchema (schema, name) {
  if (!validate(schema)) {
    if (name) {
      name = `"${name}" `
    } else {
      name = ''
    }
    const first = validate.errors[0]
    const err = new Error(`${name}schema is invalid: data${first.instancePath} ${first.message}`)
    err.errors = isValidSchema.errors
    throw err
  }
}

function mergeLocation (location, key) {
  return {
    schema: location.schema[key],
    schemaId: location.schemaId,
    jsonPointer: location.jsonPointer + '/' + key
  }
}

function resolveRef (location, ref) {
  let hashIndex = ref.indexOf('#')
  if (hashIndex === -1) {
    hashIndex = ref.length
  }

  const schemaId = ref.slice(0, hashIndex) || location.schemaId
  const jsonPointer = ref.slice(hashIndex) || '#'

  const schema = refResolver.getSchema(schemaId, jsonPointer)

  if (schema === undefined) {
    throw new Error(`Cannot find reference "${ref}"`)
  }

  if (schema.$ref !== undefined) {
    return resolveRef({ schema, schemaId, jsonPointer }, schema.$ref)
  }

  return { schema, schemaId, jsonPointer }
}

const contextFunctionsNamesBySchema = new Map()

let rootSchemaId = null
let refResolver = null
let validator = null
let contextFunctions = null

function build (schema, options) {
  contextFunctionsNamesBySchema.clear()

  contextFunctions = []
  options = options || {}

  refResolver = new RefResolver()
  validator = new Validator(options.ajv)

  rootSchemaId = schema.$id || randomUUID()

  isValidSchema(schema)
  validator.addSchema(schema, rootSchemaId)
  refResolver.addSchema(schema, rootSchemaId)

  if (options.schema) {
    for (const key of Object.keys(options.schema)) {
      isValidSchema(options.schema[key], key)
      validator.addSchema(options.schema[key], key)
      refResolver.addSchema(options.schema[key], key)
    }
  }

  if (options.rounding) {
    if (!['floor', 'ceil', 'round'].includes(options.rounding)) {
      throw new Error(`Unsupported integer rounding method ${options.rounding}`)
    }
  }

  if (options.largeArrayMechanism) {
    if (validLargeArrayMechanisms.includes(options.largeArrayMechanism)) {
      largeArrayMechanism = options.largeArrayMechanism
    } else {
      throw new Error(`Unsupported large array mechanism ${options.rounding}`)
    }
  }

  if (options.largeArraySize) {
    if (!Number.isNaN(Number.parseInt(options.largeArraySize, 10))) {
      largeArraySize = options.largeArraySize
    } else {
      throw new Error(`Unsupported large array size. Expected integer-like, got ${options.largeArraySize}`)
    }
  }

  const serializer = new Serializer(options)

  const location = { schema, schemaId: rootSchemaId, jsonPointer: '#' }
  const code = buildValue(location, 'input')

  const contextFunctionCode = `
    function main (input) {
      let json = ''
      ${code}
      return json
    }
    ${contextFunctions.join('\n')}
    return main
    `

  const dependenciesName = ['validator', 'serializer', contextFunctionCode]

  if (options.debugMode) {
    options.mode = 'debug'
  }

  if (options.mode === 'debug') {
    return {
      validator,
      serializer,
      code: dependenciesName.join('\n'),
      ajv: validator.ajv
    }
  }

  if (options.mode === 'standalone') {
    // lazy load
    const buildStandaloneCode = __webpack_require__(117)
    return buildStandaloneCode(options, validator, contextFunctionCode)
  }

  /* eslint no-new-func: "off" */
  const contextFunc = new Function('validator', 'serializer', contextFunctionCode)
  const stringifyFunc = contextFunc(validator, serializer)

  refResolver = null
  validator = null
  rootSchemaId = null
  contextFunctions = null
  contextFunctionsNamesBySchema.clear()

  return stringifyFunc
}

const objectKeywords = [
  'maxProperties',
  'minProperties',
  'required',
  'properties',
  'patternProperties',
  'additionalProperties',
  'dependencies'
]

const arrayKeywords = [
  'items',
  'additionalItems',
  'maxItems',
  'minItems',
  'uniqueItems',
  'contains'
]

const stringKeywords = [
  'maxLength',
  'minLength',
  'pattern'
]

const numberKeywords = [
  'multipleOf',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum'
]

/**
 * Infer type based on keyword in order to generate optimized code
 * https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6
 */
function inferTypeByKeyword (schema) {
  // eslint-disable-next-line
  for (var keyword of objectKeywords) {
    if (keyword in schema) return 'object'
  }
  // eslint-disable-next-line
  for (var keyword of arrayKeywords) {
    if (keyword in schema) return 'array'
  }
  // eslint-disable-next-line
  for (var keyword of stringKeywords) {
    if (keyword in schema) return 'string'
  }
  // eslint-disable-next-line
  for (var keyword of numberKeywords) {
    if (keyword in schema) return 'number'
  }
  return schema.type
}

function addPatternProperties (location) {
  const schema = location.schema
  const pp = schema.patternProperties
  let code = `
      var properties = ${JSON.stringify(schema.properties)} || {}
      var keys = Object.keys(obj)
      for (var i = 0; i < keys.length; i++) {
        if (properties[keys[i]]) continue
  `

  const patternPropertiesLocation = mergeLocation(location, 'patternProperties')
  Object.keys(pp).forEach((regex) => {
    let ppLocation = mergeLocation(patternPropertiesLocation, regex)
    if (pp[regex].$ref) {
      ppLocation = resolveRef(ppLocation, pp[regex].$ref)
      pp[regex] = ppLocation.schema
    }

    try {
      RegExp(regex)
    } catch (err) {
      throw new Error(`${err.message}. Found at ${regex} matching ${JSON.stringify(pp[regex])}`)
    }

    const valueCode = buildValue(ppLocation, 'obj[keys[i]]')
    code += `
      if (/${regex.replace(/\\*\//g, '\\/')}/.test(keys[i])) {
        ${addComma}
        json += serializer.asString(keys[i]) + ':'
        ${valueCode}
        continue
      }
    `
  })
  if (schema.additionalProperties) {
    code += additionalProperty(location)
  }

  code += `
      }
  `
  return code
}

function additionalProperty (location) {
  const ap = location.schema.additionalProperties
  let code = ''
  if (ap === true) {
    code += `
        if (obj[keys[i]] !== undefined && typeof obj[keys[i]] !== 'function' && typeof obj[keys[i]] !== 'symbol') {
          ${addComma}
          json += serializer.asString(keys[i]) + ':' + JSON.stringify(obj[keys[i]])
        }
    `

    return code
  }

  let apLocation = mergeLocation(location, 'additionalProperties')
  if (apLocation.schema.$ref) {
    apLocation = resolveRef(apLocation, apLocation.schema.$ref)
  }

  const valueCode = buildValue(apLocation, 'obj[keys[i]]')

  code += `
    ${addComma}
    json += serializer.asString(keys[i]) + ':'
    ${valueCode}
  `

  return code
}

function addAdditionalProperties (location) {
  return `
      var properties = ${JSON.stringify(location.schema.properties)} || {}
      var keys = Object.keys(obj)
      for (var i = 0; i < keys.length; i++) {
        if (properties[keys[i]]) continue
        ${additionalProperty(location)}
      }
  `
}

function buildCode (location) {
  if (location.schema.$ref) {
    location = resolveRef(location, location.schema.$ref)
  }

  const schema = location.schema
  const required = schema.required || []

  let code = ''

  const propertiesLocation = mergeLocation(location, 'properties')
  Object.keys(schema.properties || {}).forEach((key) => {
    let propertyLocation = mergeLocation(propertiesLocation, key)
    if (propertyLocation.$ref) {
      propertyLocation = resolveRef(location, propertyLocation.$ref)
    }

    const sanitized = JSON.stringify(key)
    const asString = JSON.stringify(sanitized)

    // Using obj['key'] !== undefined instead of obj.hasOwnProperty(prop) for perf reasons,
    // see https://github.com/mcollina/fast-json-stringify/pull/3 for discussion.

    code += `
      if (obj[${sanitized}] !== undefined) {
        ${addComma}
        json += ${asString} + ':'
      `

    code += buildValue(propertyLocation, `obj[${JSON.stringify(key)}]`)

    const defaultValue = propertyLocation.schema.default
    if (defaultValue !== undefined) {
      code += `
      } else {
        ${addComma}
        json += ${asString} + ':' + ${JSON.stringify(JSON.stringify(defaultValue))}
      `
    } else if (required.includes(key)) {
      code += `
      } else {
        throw new Error('${sanitized} is required!')
      `
    }

    code += `
      }
    `
  })

  for (const requiredProperty of required) {
    if (schema.properties && schema.properties[requiredProperty] !== undefined) continue
    code += `if (obj['${requiredProperty}'] === undefined) throw new Error('"${requiredProperty}" is required!')\n`
  }

  return code
}

function mergeAllOfSchema (location, schema, mergedSchema) {
  const allOfLocation = mergeLocation(location, 'allOf')

  for (let i = 0; i < schema.allOf.length; i++) {
    let allOfSchema = schema.allOf[i]

    if (allOfSchema.$ref) {
      const allOfSchemaLocation = mergeLocation(allOfLocation, i)
      allOfSchema = resolveRef(allOfSchemaLocation, allOfSchema.$ref).schema
    }

    let allOfSchemaType = allOfSchema.type
    if (allOfSchemaType === undefined) {
      allOfSchemaType = inferTypeByKeyword(allOfSchema)
    }

    if (allOfSchemaType !== undefined) {
      if (
        mergedSchema.type !== undefined &&
        mergedSchema.type !== allOfSchemaType
      ) {
        throw new Error('allOf schemas have different type values')
      }
      mergedSchema.type = allOfSchemaType
    }

    if (allOfSchema.format !== undefined) {
      if (
        mergedSchema.format !== undefined &&
        mergedSchema.format !== allOfSchema.format
      ) {
        throw new Error('allOf schemas have different format values')
      }
      mergedSchema.format = allOfSchema.format
    }

    if (allOfSchema.nullable !== undefined) {
      if (
        mergedSchema.nullable !== undefined &&
        mergedSchema.nullable !== allOfSchema.nullable
      ) {
        throw new Error('allOf schemas have different nullable values')
      }
      mergedSchema.nullable = allOfSchema.nullable
    }

    if (allOfSchema.properties !== undefined) {
      if (mergedSchema.properties === undefined) {
        mergedSchema.properties = {}
      }
      Object.assign(mergedSchema.properties, allOfSchema.properties)
    }

    if (allOfSchema.additionalProperties !== undefined) {
      if (mergedSchema.additionalProperties === undefined) {
        mergedSchema.additionalProperties = {}
      }
      Object.assign(mergedSchema.additionalProperties, allOfSchema.additionalProperties)
    }

    if (allOfSchema.patternProperties !== undefined) {
      if (mergedSchema.patternProperties === undefined) {
        mergedSchema.patternProperties = {}
      }
      Object.assign(mergedSchema.patternProperties, allOfSchema.patternProperties)
    }

    if (allOfSchema.required !== undefined) {
      if (mergedSchema.required === undefined) {
        mergedSchema.required = []
      }
      mergedSchema.required.push(...allOfSchema.required)
    }

    if (allOfSchema.oneOf !== undefined) {
      if (mergedSchema.oneOf === undefined) {
        mergedSchema.oneOf = []
      }
      mergedSchema.oneOf.push(...allOfSchema.oneOf)
    }

    if (allOfSchema.anyOf !== undefined) {
      if (mergedSchema.anyOf === undefined) {
        mergedSchema.anyOf = []
      }
      mergedSchema.anyOf.push(...allOfSchema.anyOf)
    }

    if (allOfSchema.allOf !== undefined) {
      mergeAllOfSchema(location, allOfSchema, mergedSchema)
    }
  }
  delete mergedSchema.allOf

  mergedSchema.$id = `merged_${randomUUID()}`
  validator.addSchema(mergedSchema)
  refResolver.addSchema(mergedSchema)
  location.schemaId = mergedSchema.$id
  location.jsonPointer = '#'
}

function buildInnerObject (location) {
  const schema = location.schema
  let code = buildCode(location)
  if (schema.patternProperties) {
    code += addPatternProperties(location)
  } else if (schema.additionalProperties && !schema.patternProperties) {
    code += addAdditionalProperties(location)
  }
  return code
}

function addIfThenElse (location) {
  const schema = merge({}, location.schema)
  const thenSchema = schema.then
  const elseSchema = schema.else || { additionalProperties: true }

  delete schema.if
  delete schema.then
  delete schema.else

  const ifLocation = mergeLocation(location, 'if')
  const ifSchemaRef = ifLocation.schemaId + ifLocation.jsonPointer

  let code = `
    if (validator.validate("${ifSchemaRef}", obj)) {
  `

  const thenLocation = mergeLocation(location, 'then')
  thenLocation.schema = merge(schema, thenSchema)

  if (thenSchema.if && thenSchema.then) {
    code += addIfThenElse(thenLocation)
  } else {
    code += buildInnerObject(thenLocation)
  }
  code += `
    }
  `

  const elseLocation = mergeLocation(location, 'else')
  elseLocation.schema = merge(schema, elseSchema)

  code += `
      else {
    `

  if (elseSchema.if && elseSchema.then) {
    code += addIfThenElse(elseLocation)
  } else {
    code += buildInnerObject(elseLocation)
  }
  code += `
      }
    `
  return code
}

function toJSON (variableName) {
  return `(${variableName} && typeof ${variableName}.toJSON === 'function')
    ? ${variableName}.toJSON()
    : ${variableName}
  `
}

function buildObject (location) {
  const schema = location.schema

  if (contextFunctionsNamesBySchema.has(schema)) {
    return contextFunctionsNamesBySchema.get(schema)
  }

  const functionName = generateFuncName()
  contextFunctionsNamesBySchema.set(schema, functionName)

  const schemaId = location.schemaId === rootSchemaId ? '' : location.schemaId
  let functionCode = `
    function ${functionName} (input) {
      // ${schemaId + location.jsonPointer}
  `

  functionCode += `
      var obj = ${toJSON('input')}
      var json = '{'
      var addComma = false
  `

  if (schema.if && schema.then) {
    functionCode += addIfThenElse(location)
  } else {
    functionCode += buildInnerObject(location)
  }

  functionCode += `
      json += '}'
      return json
    }
  `

  contextFunctions.push(functionCode)
  return functionName
}

function buildArray (location) {
  const schema = location.schema

  let itemsLocation = mergeLocation(location, 'items')
  itemsLocation.schema = itemsLocation.schema || {}

  if (itemsLocation.schema.$ref) {
    itemsLocation = resolveRef(itemsLocation, itemsLocation.schema.$ref)
  }

  const itemsSchema = itemsLocation.schema

  if (contextFunctionsNamesBySchema.has(schema)) {
    return contextFunctionsNamesBySchema.get(schema)
  }

  const functionName = generateFuncName()
  contextFunctionsNamesBySchema.set(schema, functionName)

  const schemaId = location.schemaId === rootSchemaId ? '' : location.schemaId
  let functionCode = `
    function ${functionName} (obj) {
      // ${schemaId + location.jsonPointer}
  `

  functionCode += `
    if (!Array.isArray(obj)) {
      throw new TypeError(\`The value '$\{obj}' does not match schema definition.\`)
    }
    const arrayLength = obj.length
  `

  if (!schema.additionalItems) {
    functionCode += `
      if (arrayLength > ${itemsSchema.length}) {
        throw new Error(\`Item at ${itemsSchema.length} does not match schema definition.\`)
      }
    `
  }

  if (largeArrayMechanism !== 'default') {
    if (largeArrayMechanism === 'json-stringify') {
      functionCode += `if (arrayLength && arrayLength >= ${largeArraySize}) return JSON.stringify(obj)\n`
    } else {
      throw new Error(`Unsupported large array mechanism ${largeArrayMechanism}`)
    }
  }

  functionCode += `
    let jsonOutput = ''
  `

  if (Array.isArray(itemsSchema)) {
    for (let i = 0; i < itemsSchema.length; i++) {
      const item = itemsSchema[i]
      const tmpRes = buildValue(mergeLocation(itemsLocation, i), `obj[${i}]`)
      functionCode += `
        if (${i} < arrayLength) {
          if (${buildArrayTypeCondition(item.type, `[${i}]`)}) {
            let json = ''
            ${tmpRes}
            jsonOutput += json
            if (${i} < arrayLength - 1) {
              jsonOutput += ','
            }
          } else {
            throw new Error(\`Item at ${i} does not match schema definition.\`)
          }
        }
        `
    }

    if (schema.additionalItems) {
      functionCode += `
        for (let i = ${itemsSchema.length}; i < arrayLength; i++) {
          let json = JSON.stringify(obj[i])
          jsonOutput += json
          if (i < arrayLength - 1) {
            jsonOutput += ','
          }
        }`
    }
  } else {
    const code = buildValue(itemsLocation, 'obj[i]')
    functionCode += `
      for (let i = 0; i < arrayLength; i++) {
        let json = ''
        ${code}
        jsonOutput += json
        if (i < arrayLength - 1) {
          jsonOutput += ','
        }
      }`
  }

  functionCode += `
    return \`[\${jsonOutput}]\`
  }`

  contextFunctions.push(functionCode)
  return functionName
}

function buildArrayTypeCondition (type, accessor) {
  let condition
  switch (type) {
    case 'null':
      condition = `obj${accessor} === null`
      break
    case 'string':
      condition = `typeof obj${accessor} === 'string'`
      break
    case 'integer':
      condition = `Number.isInteger(obj${accessor})`
      break
    case 'number':
      condition = `Number.isFinite(obj${accessor})`
      break
    case 'boolean':
      condition = `typeof obj${accessor} === 'boolean'`
      break
    case 'object':
      condition = `obj${accessor} && typeof obj${accessor} === 'object' && obj${accessor}.constructor === Object`
      break
    case 'array':
      condition = `Array.isArray(obj${accessor})`
      break
    default:
      if (Array.isArray(type)) {
        const conditions = type.map((subType) => {
          return buildArrayTypeCondition(subType, accessor)
        })
        condition = `(${conditions.join(' || ')})`
      } else {
        throw new Error(`${type} unsupported`)
      }
  }
  return condition
}

let genFuncNameCounter = 0
function generateFuncName () {
  return 'anonymous' + genFuncNameCounter++
}

function buildMultiTypeSerializer (location, input) {
  const schema = location.schema
  const types = schema.type.sort(t1 => t1 === 'null' ? -1 : 1)

  let code = ''

  const locationClone = clone(location)
  types.forEach((type, index) => {
    const statement = index === 0 ? 'if' : 'else if'
    locationClone.schema.type = type
    const nestedResult = buildSingleTypeSerializer(locationClone, input)
    switch (type) {
      case 'null':
        code += `
          ${statement} (${input} === null)
            ${nestedResult}
          `
        break
      case 'string': {
        code += `
          ${statement}(
            typeof ${input} === "string" ||
            ${input} === null ||
            ${input} instanceof Date ||
            ${input} instanceof RegExp ||
            (
              typeof ${input} === "object" &&
              typeof ${input}.toString === "function" &&
              ${input}.toString !== Object.prototype.toString &&
              !(${input} instanceof Date)
            )
          )
            ${nestedResult}
        `
        break
      }
      case 'array': {
        code += `
          ${statement}(Array.isArray(${input}))
            ${nestedResult}
        `
        break
      }
      case 'integer': {
        code += `
          ${statement}(Number.isInteger(${input}) || ${input} === null)
            ${nestedResult}
        `
        break
      }
      default: {
        code += `
          ${statement}(typeof ${input} === "${type}" || ${input} === null)
            ${nestedResult}
        `
        break
      }
    }
  })
  code += `
    else throw new Error(\`The value $\{JSON.stringify(${input})} does not match schema definition.\`)
  `

  return code
}

function buildSingleTypeSerializer (location, input) {
  const schema = location.schema

  switch (schema.type) {
    case 'null':
      return 'json += \'null\''
    case 'string': {
      if (schema.format === 'date-time') {
        return `json += serializer.asDateTime(${input})`
      } else if (schema.format === 'date') {
        return `json += serializer.asDate(${input})`
      } else if (schema.format === 'time') {
        return `json += serializer.asTime(${input})`
      } else {
        return `json += serializer.asString(${input})`
      }
    }
    case 'integer':
      return `json += serializer.asInteger(${input})`
    case 'number':
      return `json += serializer.asNumber(${input})`
    case 'boolean':
      return `json += serializer.asBoolean(${input})`
    case 'object': {
      const funcName = buildObject(location)
      return `json += ${funcName}(${input})`
    }
    case 'array': {
      const funcName = buildArray(location)
      return `json += ${funcName}(${input})`
    }
    case undefined:
      return `json += JSON.stringify(${input})`
    default:
      throw new Error(`${schema.type} unsupported`)
  }
}

function buildConstSerializer (location, input) {
  const schema = location.schema
  const type = schema.type

  const hasNullType = Array.isArray(type) && type.includes('null')

  let code = ''

  if (hasNullType) {
    code += `
      if (${input} === null) {
        json += 'null'
      } else {
    `
  }

  code += `json += '${JSON.stringify(schema.const)}'`

  if (hasNullType) {
    code += `
      }
    `
  }

  return code
}

function buildValue (location, input) {
  let schema = location.schema

  if (typeof schema === 'boolean') {
    return `json += JSON.stringify(${input})`
  }

  if (schema.$ref) {
    location = resolveRef(location, schema.$ref)
    schema = location.schema
  }

  if (schema.type === undefined) {
    const inferredType = inferTypeByKeyword(schema)
    if (inferredType) {
      schema.type = inferredType
    }
  }

  if (schema.allOf) {
    const mergedSchema = clone(schema)
    mergeAllOfSchema(location, schema, mergedSchema)
    schema = mergedSchema
    location.schema = mergedSchema
  }

  const type = schema.type

  let code = ''

  if (type === undefined && (schema.anyOf || schema.oneOf)) {
    const type = schema.anyOf ? 'anyOf' : 'oneOf'
    const anyOfLocation = mergeLocation(location, type)

    for (let index = 0; index < location.schema[type].length; index++) {
      const optionLocation = mergeLocation(anyOfLocation, index)
      const schemaRef = optionLocation.schemaId + optionLocation.jsonPointer
      const nestedResult = buildValue(optionLocation, input)
      code += `
        ${index === 0 ? 'if' : 'else if'}(validator.validate("${schemaRef}", ${input}))
          ${nestedResult}
      `
    }

    code += `
      else throw new Error(\`The value $\{JSON.stringify(${input})} does not match schema definition.\`)
    `
    return code
  }

  const nullable = schema.nullable === true
  if (nullable) {
    code += `
      if (${input} === null) {
        json += 'null'
      } else {
    `
  }

  if (schema.const !== undefined) {
    code += buildConstSerializer(location, input)
  } else if (Array.isArray(type)) {
    code += buildMultiTypeSerializer(location, input)
  } else {
    code += buildSingleTypeSerializer(location, input)
  }

  if (nullable) {
    code += `
      }
    `
  }

  return code
}

module.exports = build

module.exports.validLargeArrayMechanisms = validLargeArrayMechanisms

module.exports.restore = function ({ code, validator, serializer }) {
  // eslint-disable-next-line
  return (Function.apply(null, ['validator', 'serializer', code])
    .apply(null, [validator, serializer]))
}


/***/ }),
/* 102 */
/***/ ((module) => {

"use strict";


// based on https://github.com/TehShrike/deepmerge
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

function deepmergeConstructor (options) {
  function isNotPrototypeKey (value) {
    return (
      value !== 'constructor' &&
      value !== 'prototype' &&
      value !== '__proto__'
    )
  }

  function cloneArray (value) {
    let i = 0
    const il = value.length
    const result = new Array(il)
    for (i = 0; i < il; ++i) {
      result[i] = clone(value[i])
    }
    return result
  }

  function cloneObject (target) {
    const result = {}

    const targetKeys = getKeys(target)
    let i, il, key
    for (i = 0, il = targetKeys.length; i < il; ++i) {
      isNotPrototypeKey(key = targetKeys[i]) &&
        (result[key] = clone(target[key]))
    }
    return result
  }

  function concatArrays (target, source) {
    const tl = target.length
    const sl = source.length
    let i = 0
    const result = new Array(tl + sl)
    for (i = 0; i < tl; ++i) {
      result[i] = clone(target[i])
    }
    for (i = 0; i < sl; ++i) {
      result[i + tl] = clone(source[i])
    }
    return result
  }

  const propertyIsEnumerable = Object.prototype.propertyIsEnumerable
  function getSymbolsAndKeys (value) {
    const result = Object.keys(value)
    const keys = Object.getOwnPropertySymbols(value)
    for (let i = 0, il = keys.length; i < il; ++i) {
      propertyIsEnumerable.call(value, keys[i]) && result.push(keys[i])
    }
    return result
  }

  const getKeys = options && options.symbols
    ? getSymbolsAndKeys
    : Object.keys

  function isMergeableObject (value) {
    return typeof value === 'object' && value !== null && !(value instanceof RegExp) && !(value instanceof Date)
  }

  function isPrimitive (value) {
    return typeof value !== 'object' || value === null
  }

  function isPrimitiveOrBuiltIn (value) {
    return typeof value !== 'object' || value === null || value instanceof RegExp || value instanceof Date
  }

  const mergeArray = options && typeof options.mergeArray === 'function'
    ? options.mergeArray({ clone, deepmerge: _deepmerge, getKeys, isMergeableObject })
    : concatArrays

  function clone (entry) {
    return isMergeableObject(entry)
      ? Array.isArray(entry)
        ? cloneArray(entry)
        : cloneObject(entry)
      : entry
  }

  function mergeObject (target, source) {
    const result = {}
    const targetKeys = getKeys(target)
    const sourceKeys = getKeys(source)
    let i, il, key
    for (i = 0, il = targetKeys.length; i < il; ++i) {
      isNotPrototypeKey(key = targetKeys[i]) &&
      (sourceKeys.indexOf(key) === -1) &&
      (result[key] = clone(target[key]))
    }

    for (i = 0, il = sourceKeys.length; i < il; ++i) {
      isNotPrototypeKey(key = sourceKeys[i]) &&
      (
        key in target && (targetKeys.indexOf(key) !== -1 && (result[key] = _deepmerge(target[key], source[key])), true) || // eslint-disable-line no-mixed-operators
        (result[key] = clone(source[key]))
      )
    }
    return result
  }

  function _deepmerge (target, source) {
    const sourceIsArray = Array.isArray(source)
    const targetIsArray = Array.isArray(target)

    if (isPrimitive(source)) {
      return source
    } else if (isPrimitiveOrBuiltIn(target)) {
      return clone(source)
    } else if (sourceIsArray && targetIsArray) {
      return mergeArray(target, source)
    } else if (sourceIsArray !== targetIsArray) {
      return clone(source)
    } else {
      return mergeObject(target, source)
    }
  }

  function _deepmergeAll () {
    switch (arguments.length) {
      case 0:
        return {}
      case 1:
        return clone(arguments[0])
      case 2:
        return _deepmerge(arguments[0], arguments[1])
    }
    let result
    for (let i = 0, il = arguments.length; i < il; ++i) {
      result = _deepmerge(result, arguments[i])
    }
    return result
  }

  return options && options.all
    ? _deepmergeAll
    : _deepmerge
}

module.exports = deepmergeConstructor
module.exports["default"] = deepmergeConstructor
module.exports.deepmerge = deepmergeConstructor


/***/ }),
/* 103 */
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),
/* 104 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* CODE GENERATED BY 'build-schema-validator.js' DO NOT EDIT! */

module.exports = validate10;
module.exports["default"] = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"http://json-schema.org/draft-07/schema#","title":"Core schema meta-schema","definitions":{"schemaArray":{"type":"array","minItems":1,"items":{"$ref":"#"}},"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"allOf":[{"$ref":"#/definitions/nonNegativeInteger"},{"default":0}]},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}},"type":["object","boolean"],"properties":{"$id":{"type":"string","format":"uri-reference"},"$schema":{"type":"string","format":"uri"},"$ref":{"type":"string","format":"uri-reference"},"$comment":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"},"default":true,"readOnly":{"type":"boolean","default":false},"examples":{"type":"array","items":true},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/definitions/nonNegativeInteger"},"minLength":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"additionalItems":{"$ref":"#"},"items":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/schemaArray"}],"default":true},"maxItems":{"$ref":"#/definitions/nonNegativeInteger"},"minItems":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"contains":{"$ref":"#"},"maxProperties":{"$ref":"#/definitions/nonNegativeInteger"},"minProperties":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"required":{"$ref":"#/definitions/stringArray"},"additionalProperties":{"$ref":"#"},"definitions":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"properties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"patternProperties":{"type":"object","additionalProperties":{"$ref":"#"},"propertyNames":{"format":"regex"},"default":{}},"dependencies":{"type":"object","additionalProperties":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/stringArray"}]}},"propertyNames":{"$ref":"#"},"const":true,"enum":{"type":"array","items":true,"minItems":1,"uniqueItems":true},"type":{"anyOf":[{"$ref":"#/definitions/simpleTypes"},{"type":"array","items":{"$ref":"#/definitions/simpleTypes"},"minItems":1,"uniqueItems":true}]},"format":{"type":"string"},"contentMediaType":{"type":"string"},"contentEncoding":{"type":"string"},"if":{"$ref":"#"},"then":{"$ref":"#"},"else":{"$ref":"#"},"allOf":{"$ref":"#/definitions/schemaArray"},"anyOf":{"$ref":"#/definitions/schemaArray"},"oneOf":{"$ref":"#/definitions/schemaArray"},"not":{"$ref":"#"}},"default":true};
const schema12 = {"type":"integer","minimum":0};
const schema18 = {"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]};
const schema20 = {"enum":["array","boolean","integer","null","number","object","string"]};
const formats0 = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
const formats2 = (__webpack_require__(105).fullFormats.uri);
const formats6 = (__webpack_require__(105).fullFormats.regex);
const schema13 = {"allOf":[{"$ref":"#/definitions/nonNegativeInteger"},{"default":0}]};

function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
const _errs1 = errors;
if(!(((typeof data == "number") && (!(data % 1) && !isNaN(data))) && (isFinite(data)))){
validate11.errors = [{instancePath,schemaPath:"#/definitions/nonNegativeInteger/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs1){
if((typeof data == "number") && (isFinite(data))){
if(data < 0 || isNaN(data)){
validate11.errors = [{instancePath,schemaPath:"#/definitions/nonNegativeInteger/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
validate11.errors = vErrors;
return errors === 0;
}

const schema15 = {"type":"array","minItems":1,"items":{"$ref":"#"}};
const root1 = {validate: validate10};

function validate13(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(Array.isArray(data)){
if(data.length < 1){
validate13.errors = [{instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid0 = true;
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
const _errs1 = errors;
if(!(root1.validate(data[i0], {instancePath:instancePath+"/" + i0,parentData:data,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? root1.validate.errors : vErrors.concat(root1.validate.errors);
errors = vErrors.length;
}
var valid0 = _errs1 === errors;
if(!valid0){
break;
}
}
}
}
else {
validate13.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
validate13.errors = vErrors;
return errors === 0;
}

const func0 = (__webpack_require__(106)["default"]);

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="http://json-schema.org/draft-07/schema#" */;
let vErrors = null;
let errors = 0;
if((!(data && typeof data == "object" && !Array.isArray(data))) && (typeof data !== "boolean")){
validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: schema11.type},message:"must be object,boolean"}];
return false;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.$id !== undefined){
let data0 = data.$id;
const _errs1 = errors;
if(errors === _errs1){
if(errors === _errs1){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate10.errors = [{instancePath:instancePath+"/$id",schemaPath:"#/properties/%24id/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
else {
validate10.errors = [{instancePath:instancePath+"/$id",schemaPath:"#/properties/%24id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.$schema !== undefined){
let data1 = data.$schema;
const _errs3 = errors;
if(errors === _errs3){
if(errors === _errs3){
if(typeof data1 === "string"){
if(!(formats2(data1))){
validate10.errors = [{instancePath:instancePath+"/$schema",schemaPath:"#/properties/%24schema/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""}];
return false;
}
}
else {
validate10.errors = [{instancePath:instancePath+"/$schema",schemaPath:"#/properties/%24schema/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.$ref !== undefined){
let data2 = data.$ref;
const _errs5 = errors;
if(errors === _errs5){
if(errors === _errs5){
if(typeof data2 === "string"){
if(!(formats0.test(data2))){
validate10.errors = [{instancePath:instancePath+"/$ref",schemaPath:"#/properties/%24ref/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
else {
validate10.errors = [{instancePath:instancePath+"/$ref",schemaPath:"#/properties/%24ref/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.$comment !== undefined){
const _errs7 = errors;
if(typeof data.$comment !== "string"){
validate10.errors = [{instancePath:instancePath+"/$comment",schemaPath:"#/properties/%24comment/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
const _errs9 = errors;
if(typeof data.title !== "string"){
validate10.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.description !== undefined){
const _errs11 = errors;
if(typeof data.description !== "string"){
validate10.errors = [{instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.readOnly !== undefined){
const _errs13 = errors;
if(typeof data.readOnly !== "boolean"){
validate10.errors = [{instancePath:instancePath+"/readOnly",schemaPath:"#/properties/readOnly/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.examples !== undefined){
const _errs15 = errors;
if(errors === _errs15){
if(!(Array.isArray(data.examples))){
validate10.errors = [{instancePath:instancePath+"/examples",schemaPath:"#/properties/examples/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.multipleOf !== undefined){
let data8 = data.multipleOf;
const _errs17 = errors;
if(errors === _errs17){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 <= 0 || isNaN(data8)){
validate10.errors = [{instancePath:instancePath+"/multipleOf",schemaPath:"#/properties/multipleOf/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"}];
return false;
}
}
else {
validate10.errors = [{instancePath:instancePath+"/multipleOf",schemaPath:"#/properties/multipleOf/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
var valid0 = _errs17 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maximum !== undefined){
let data9 = data.maximum;
const _errs19 = errors;
if(!((typeof data9 == "number") && (isFinite(data9)))){
validate10.errors = [{instancePath:instancePath+"/maximum",schemaPath:"#/properties/maximum/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.exclusiveMaximum !== undefined){
let data10 = data.exclusiveMaximum;
const _errs21 = errors;
if(!((typeof data10 == "number") && (isFinite(data10)))){
validate10.errors = [{instancePath:instancePath+"/exclusiveMaximum",schemaPath:"#/properties/exclusiveMaximum/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.minimum !== undefined){
let data11 = data.minimum;
const _errs23 = errors;
if(!((typeof data11 == "number") && (isFinite(data11)))){
validate10.errors = [{instancePath:instancePath+"/minimum",schemaPath:"#/properties/minimum/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs23 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.exclusiveMinimum !== undefined){
let data12 = data.exclusiveMinimum;
const _errs25 = errors;
if(!((typeof data12 == "number") && (isFinite(data12)))){
validate10.errors = [{instancePath:instancePath+"/exclusiveMinimum",schemaPath:"#/properties/exclusiveMinimum/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxLength !== undefined){
let data13 = data.maxLength;
const _errs27 = errors;
const _errs28 = errors;
if(!(((typeof data13 == "number") && (!(data13 % 1) && !isNaN(data13))) && (isFinite(data13)))){
validate10.errors = [{instancePath:instancePath+"/maxLength",schemaPath:"#/definitions/nonNegativeInteger/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs28){
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 < 0 || isNaN(data13)){
validate10.errors = [{instancePath:instancePath+"/maxLength",schemaPath:"#/definitions/nonNegativeInteger/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
var valid0 = _errs27 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.minLength !== undefined){
const _errs30 = errors;
if(!(validate11(data.minLength, {instancePath:instancePath+"/minLength",parentData:data,parentDataProperty:"minLength",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
var valid0 = _errs30 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pattern !== undefined){
let data15 = data.pattern;
const _errs31 = errors;
if(errors === _errs31){
if(errors === _errs31){
if(typeof data15 === "string"){
if(!(formats6(data15))){
validate10.errors = [{instancePath:instancePath+"/pattern",schemaPath:"#/properties/pattern/format",keyword:"format",params:{format: "regex"},message:"must match format \""+"regex"+"\""}];
return false;
}
}
else {
validate10.errors = [{instancePath:instancePath+"/pattern",schemaPath:"#/properties/pattern/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs31 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.additionalItems !== undefined){
const _errs33 = errors;
if(!(validate10(data.additionalItems, {instancePath:instancePath+"/additionalItems",parentData:data,parentDataProperty:"additionalItems",rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid0 = _errs33 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.items !== undefined){
let data17 = data.items;
const _errs34 = errors;
const _errs35 = errors;
let valid2 = false;
const _errs36 = errors;
if(!(validate10(data17, {instancePath:instancePath+"/items",parentData:data,parentDataProperty:"items",rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var _valid0 = _errs36 === errors;
valid2 = valid2 || _valid0;
if(!valid2){
const _errs37 = errors;
if(!(validate13(data17, {instancePath:instancePath+"/items",parentData:data,parentDataProperty:"items",rootData}))){
vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);
errors = vErrors.length;
}
var _valid0 = _errs37 === errors;
valid2 = valid2 || _valid0;
}
if(!valid2){
const err0 = {instancePath:instancePath+"/items",schemaPath:"#/properties/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs35;
if(vErrors !== null){
if(_errs35){
vErrors.length = _errs35;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs34 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxItems !== undefined){
let data18 = data.maxItems;
const _errs38 = errors;
const _errs39 = errors;
if(!(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18)))){
validate10.errors = [{instancePath:instancePath+"/maxItems",schemaPath:"#/definitions/nonNegativeInteger/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs39){
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 < 0 || isNaN(data18)){
validate10.errors = [{instancePath:instancePath+"/maxItems",schemaPath:"#/definitions/nonNegativeInteger/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
var valid0 = _errs38 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.minItems !== undefined){
const _errs41 = errors;
if(!(validate11(data.minItems, {instancePath:instancePath+"/minItems",parentData:data,parentDataProperty:"minItems",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
var valid0 = _errs41 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.uniqueItems !== undefined){
const _errs42 = errors;
if(typeof data.uniqueItems !== "boolean"){
validate10.errors = [{instancePath:instancePath+"/uniqueItems",schemaPath:"#/properties/uniqueItems/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs42 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contains !== undefined){
const _errs44 = errors;
if(!(validate10(data.contains, {instancePath:instancePath+"/contains",parentData:data,parentDataProperty:"contains",rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid0 = _errs44 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxProperties !== undefined){
let data22 = data.maxProperties;
const _errs45 = errors;
const _errs46 = errors;
if(!(((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22))) && (isFinite(data22)))){
validate10.errors = [{instancePath:instancePath+"/maxProperties",schemaPath:"#/definitions/nonNegativeInteger/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs46){
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 < 0 || isNaN(data22)){
validate10.errors = [{instancePath:instancePath+"/maxProperties",schemaPath:"#/definitions/nonNegativeInteger/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
var valid0 = _errs45 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.minProperties !== undefined){
const _errs48 = errors;
if(!(validate11(data.minProperties, {instancePath:instancePath+"/minProperties",parentData:data,parentDataProperty:"minProperties",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
var valid0 = _errs48 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.required !== undefined){
let data24 = data.required;
const _errs49 = errors;
const _errs50 = errors;
if(errors === _errs50){
if(Array.isArray(data24)){
var valid6 = true;
const len0 = data24.length;
for(let i0=0; i0<len0; i0++){
const _errs52 = errors;
if(typeof data24[i0] !== "string"){
validate10.errors = [{instancePath:instancePath+"/required/" + i0,schemaPath:"#/definitions/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid6 = _errs52 === errors;
if(!valid6){
break;
}
}
if(valid6){
let i1 = data24.length;
let j0;
if(i1 > 1){
const indices0 = {};
for(;i1--;){
let item0 = data24[i1];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
validate10.errors = [{instancePath:instancePath+"/required",schemaPath:"#/definitions/stringArray/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
return false;
break;
}
indices0[item0] = i1;
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/required",schemaPath:"#/definitions/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs49 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.additionalProperties !== undefined){
const _errs54 = errors;
if(!(validate10(data.additionalProperties, {instancePath:instancePath+"/additionalProperties",parentData:data,parentDataProperty:"additionalProperties",rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid0 = _errs54 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.definitions !== undefined){
let data27 = data.definitions;
const _errs55 = errors;
if(errors === _errs55){
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
for(const key0 in data27){
const _errs58 = errors;
if(!(validate10(data27[key0], {instancePath:instancePath+"/definitions/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),parentData:data27,parentDataProperty:key0,rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid8 = _errs58 === errors;
if(!valid8){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/definitions",schemaPath:"#/properties/definitions/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs55 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.properties !== undefined){
let data29 = data.properties;
const _errs59 = errors;
if(errors === _errs59){
if(data29 && typeof data29 == "object" && !Array.isArray(data29)){
for(const key1 in data29){
const _errs62 = errors;
if(!(validate10(data29[key1], {instancePath:instancePath+"/properties/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),parentData:data29,parentDataProperty:key1,rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid9 = _errs62 === errors;
if(!valid9){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/properties",schemaPath:"#/properties/properties/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs59 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.patternProperties !== undefined){
let data31 = data.patternProperties;
const _errs63 = errors;
if(errors === _errs63){
if(data31 && typeof data31 == "object" && !Array.isArray(data31)){
for(const key2 in data31){
const _errs65 = errors;
if(errors === _errs65){
if(typeof key2 === "string"){
if(!(formats6(key2))){
const err1 = {instancePath:instancePath+"/patternProperties",schemaPath:"#/properties/patternProperties/propertyNames/format",keyword:"format",params:{format: "regex"},message:"must match format \""+"regex"+"\"",propertyName:key2};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var valid10 = _errs65 === errors;
if(!valid10){
const err2 = {instancePath:instancePath+"/patternProperties",schemaPath:"#/properties/patternProperties/propertyNames",keyword:"propertyNames",params:{propertyName: key2},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate10.errors = vErrors;
return false;
break;
}
}
if(valid10){
for(const key3 in data31){
const _errs67 = errors;
if(!(validate10(data31[key3], {instancePath:instancePath+"/patternProperties/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),parentData:data31,parentDataProperty:key3,rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid11 = _errs67 === errors;
if(!valid11){
break;
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/patternProperties",schemaPath:"#/properties/patternProperties/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs63 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.dependencies !== undefined){
let data33 = data.dependencies;
const _errs68 = errors;
if(errors === _errs68){
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
for(const key4 in data33){
let data34 = data33[key4];
const _errs71 = errors;
const _errs72 = errors;
let valid13 = false;
const _errs73 = errors;
if(!(validate10(data34, {instancePath:instancePath+"/dependencies/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),parentData:data33,parentDataProperty:key4,rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var _valid1 = _errs73 === errors;
valid13 = valid13 || _valid1;
if(!valid13){
const _errs74 = errors;
const _errs75 = errors;
if(errors === _errs75){
if(Array.isArray(data34)){
var valid15 = true;
const len1 = data34.length;
for(let i2=0; i2<len1; i2++){
const _errs77 = errors;
if(typeof data34[i2] !== "string"){
const err3 = {instancePath:instancePath+"/dependencies/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i2,schemaPath:"#/definitions/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var valid15 = _errs77 === errors;
if(!valid15){
break;
}
}
if(valid15){
let i3 = data34.length;
let j1;
if(i3 > 1){
const indices1 = {};
for(;i3--;){
let item1 = data34[i3];
if(typeof item1 !== "string"){
continue;
}
if(typeof indices1[item1] == "number"){
j1 = indices1[item1];
const err4 = {instancePath:instancePath+"/dependencies/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/definitions/stringArray/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
break;
}
indices1[item1] = i3;
}
}
}
}
else {
const err5 = {instancePath:instancePath+"/dependencies/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/definitions/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var _valid1 = _errs74 === errors;
valid13 = valid13 || _valid1;
}
if(!valid13){
const err6 = {instancePath:instancePath+"/dependencies/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/dependencies/additionalProperties/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs72;
if(vErrors !== null){
if(_errs72){
vErrors.length = _errs72;
}
else {
vErrors = null;
}
}
}
var valid12 = _errs71 === errors;
if(!valid12){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/dependencies",schemaPath:"#/properties/dependencies/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs68 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.propertyNames !== undefined){
const _errs79 = errors;
if(!(validate10(data.propertyNames, {instancePath:instancePath+"/propertyNames",parentData:data,parentDataProperty:"propertyNames",rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid0 = _errs79 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.enum !== undefined){
let data37 = data.enum;
const _errs80 = errors;
if(errors === _errs80){
if(Array.isArray(data37)){
if(data37.length < 1){
validate10.errors = [{instancePath:instancePath+"/enum",schemaPath:"#/properties/enum/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
let i4 = data37.length;
let j2;
if(i4 > 1){
outer0:
for(;i4--;){
for(j2 = i4; j2--;){
if(func0(data37[i4], data37[j2])){
validate10.errors = [{instancePath:instancePath+"/enum",schemaPath:"#/properties/enum/uniqueItems",keyword:"uniqueItems",params:{i: i4, j: j2},message:"must NOT have duplicate items (items ## "+j2+" and "+i4+" are identical)"}];
return false;
break outer0;
}
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/enum",schemaPath:"#/properties/enum/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs80 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data38 = data.type;
const _errs82 = errors;
const _errs83 = errors;
let valid18 = false;
const _errs84 = errors;
if(!(((((((data38 === "array") || (data38 === "boolean")) || (data38 === "integer")) || (data38 === "null")) || (data38 === "number")) || (data38 === "object")) || (data38 === "string"))){
const err7 = {instancePath:instancePath+"/type",schemaPath:"#/definitions/simpleTypes/enum",keyword:"enum",params:{allowedValues: schema20.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var _valid2 = _errs84 === errors;
valid18 = valid18 || _valid2;
if(!valid18){
const _errs86 = errors;
if(errors === _errs86){
if(Array.isArray(data38)){
if(data38.length < 1){
const err8 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/anyOf/1/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
var valid20 = true;
const len2 = data38.length;
for(let i5=0; i5<len2; i5++){
let data39 = data38[i5];
const _errs88 = errors;
if(!(((((((data39 === "array") || (data39 === "boolean")) || (data39 === "integer")) || (data39 === "null")) || (data39 === "number")) || (data39 === "object")) || (data39 === "string"))){
const err9 = {instancePath:instancePath+"/type/" + i5,schemaPath:"#/definitions/simpleTypes/enum",keyword:"enum",params:{allowedValues: schema20.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var valid20 = _errs88 === errors;
if(!valid20){
break;
}
}
if(valid20){
let i6 = data38.length;
let j3;
if(i6 > 1){
outer1:
for(;i6--;){
for(j3 = i6; j3--;){
if(func0(data38[i6], data38[j3])){
const err10 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/anyOf/1/uniqueItems",keyword:"uniqueItems",params:{i: i6, j: j3},message:"must NOT have duplicate items (items ## "+j3+" and "+i6+" are identical)"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
break outer1;
}
}
}
}
}
}
}
else {
const err11 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/anyOf/1/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
var _valid2 = _errs86 === errors;
valid18 = valid18 || _valid2;
}
if(!valid18){
const err12 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs83;
if(vErrors !== null){
if(_errs83){
vErrors.length = _errs83;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs82 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.format !== undefined){
const _errs90 = errors;
if(typeof data.format !== "string"){
validate10.errors = [{instancePath:instancePath+"/format",schemaPath:"#/properties/format/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs90 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contentMediaType !== undefined){
const _errs92 = errors;
if(typeof data.contentMediaType !== "string"){
validate10.errors = [{instancePath:instancePath+"/contentMediaType",schemaPath:"#/properties/contentMediaType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs92 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contentEncoding !== undefined){
const _errs94 = errors;
if(typeof data.contentEncoding !== "string"){
validate10.errors = [{instancePath:instancePath+"/contentEncoding",schemaPath:"#/properties/contentEncoding/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs94 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.if !== undefined){
const _errs96 = errors;
if(!(validate10(data.if, {instancePath:instancePath+"/if",parentData:data,parentDataProperty:"if",rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid0 = _errs96 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.then !== undefined){
const _errs97 = errors;
if(!(validate10(data.then, {instancePath:instancePath+"/then",parentData:data,parentDataProperty:"then",rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid0 = _errs97 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.else !== undefined){
const _errs98 = errors;
if(!(validate10(data.else, {instancePath:instancePath+"/else",parentData:data,parentDataProperty:"else",rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid0 = _errs98 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.allOf !== undefined){
const _errs99 = errors;
if(!(validate13(data.allOf, {instancePath:instancePath+"/allOf",parentData:data,parentDataProperty:"allOf",rootData}))){
vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);
errors = vErrors.length;
}
var valid0 = _errs99 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.anyOf !== undefined){
const _errs100 = errors;
if(!(validate13(data.anyOf, {instancePath:instancePath+"/anyOf",parentData:data,parentDataProperty:"anyOf",rootData}))){
vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);
errors = vErrors.length;
}
var valid0 = _errs100 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.oneOf !== undefined){
const _errs101 = errors;
if(!(validate13(data.oneOf, {instancePath:instancePath+"/oneOf",parentData:data,parentDataProperty:"oneOf",rootData}))){
vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);
errors = vErrors.length;
}
var valid0 = _errs101 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.not !== undefined){
const _errs102 = errors;
if(!(validate10(data.not, {instancePath:instancePath+"/not",parentData:data,parentDataProperty:"not",rootData}))){
vErrors = vErrors === null ? validate10.errors : vErrors.concat(validate10.errors);
errors = vErrors.length;
}
var valid0 = _errs102 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
validate10.errors = vErrors;
return errors === 0;
}


/***/ }),
/* 105 */
/***/ ((module) => {

"use strict";
module.exports = require("ajv-formats/dist/formats");

/***/ }),
/* 106 */
/***/ ((module) => {

"use strict";
module.exports = require("ajv/dist/runtime/equal");

/***/ }),
/* 107 */
/***/ ((module) => {

"use strict";


module.exports = class Serializer {
  constructor (options = {}) {
    switch (options.rounding) {
      case 'floor':
        this.parseInteger = Math.floor
        break
      case 'ceil':
        this.parseInteger = Math.ceil
        break
      case 'round':
        this.parseInteger = Math.round
        break
      default:
        this.parseInteger = Math.trunc
        break
    }
  }

  asInteger (i) {
    if (typeof i === 'bigint') {
      return i.toString()
    } else if (Number.isInteger(i)) {
      return '' + i
    } else {
      /* eslint no-undef: "off" */
      const integer = this.parseInteger(i)
      if (Number.isNaN(integer) || !Number.isFinite(integer)) {
        throw new Error(`The value "${i}" cannot be converted to an integer.`)
      } else {
        return '' + integer
      }
    }
  }

  asNumber (i) {
    const num = Number(i)
    if (Number.isNaN(num)) {
      throw new Error(`The value "${i}" cannot be converted to a number.`)
    } else if (!Number.isFinite(num)) {
      return null
    } else {
      return '' + num
    }
  }

  asBoolean (bool) {
    return bool && 'true' || 'false' // eslint-disable-line
  }

  asDateTime (date) {
    if (date === null) return '""'
    if (date instanceof Date) {
      return '"' + date.toISOString() + '"'
    }
    if (typeof date === 'string') {
      return '"' + date + '"'
    }
    throw new Error(`The value "${date}" cannot be converted to a date-time.`)
  }

  asDate (date) {
    if (date === null) return '""'
    if (date instanceof Date) {
      return '"' + new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10) + '"'
    }
    if (typeof date === 'string') {
      return '"' + date + '"'
    }
    throw new Error(`The value "${date}" cannot be converted to a date.`)
  }

  asTime (date) {
    if (date === null) return '""'
    if (date instanceof Date) {
      return '"' + new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(11, 19) + '"'
    }
    if (typeof date === 'string') {
      return '"' + date + '"'
    }
    throw new Error(`The value "${date}" cannot be converted to a time.`)
  }

  asString (str) {
    const quotes = '"'
    if (str instanceof Date) {
      return quotes + str.toISOString() + quotes
    } else if (str === null) {
      return quotes + quotes
    } else if (str instanceof RegExp) {
      str = str.source
    } else if (typeof str !== 'string') {
      str = str.toString()
    }

    if (str.length < 42) {
      return this.asStringSmall(str)
    } else {
      return JSON.stringify(str)
    }
  }

  // magically escape strings for json
  // relying on their charCodeAt
  // everything below 32 needs JSON.stringify()
  // every string that contain surrogate needs JSON.stringify()
  // 34 and 92 happens all the time, so we
  // have a fast case for them
  asStringSmall (str) {
    const l = str.length
    let result = ''
    let last = 0
    let found = false
    let surrogateFound = false
    let point = 255
    // eslint-disable-next-line
    for (var i = 0; i < l && point >= 32; i++) {
      point = str.charCodeAt(i)
      if (point >= 0xD800 && point <= 0xDFFF) {
        // The current character is a surrogate.
        surrogateFound = true
      }
      if (point === 34 || point === 92) {
        result += str.slice(last, i) + '\\'
        last = i
        found = true
      }
    }

    if (!found) {
      result = str
    } else {
      result += str.slice(last)
    }
    return ((point < 32) || (surrogateFound === true)) ? JSON.stringify(str) : '"' + result + '"'
  }
}


/***/ }),
/* 108 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const Ajv = __webpack_require__(109)
const fastUri = __webpack_require__(110)
const ajvFormats = __webpack_require__(114)
const clone = __webpack_require__(88)({ proto: true })

class Validator {
  constructor (ajvOptions) {
    this.ajv = new Ajv({
      ...ajvOptions,
      strictSchema: false,
      validateSchema: false,
      allowUnionTypes: true,
      uriResolver: fastUri
    })

    ajvFormats(this.ajv)

    this.ajv.addKeyword({
      keyword: 'fjs_type',
      type: 'object',
      errors: false,
      validate: (type, date) => {
        return date instanceof Date
      }
    })
  }

  addSchema (schema, schemaName) {
    let schemaKey = schema.$id || schemaName
    if (schema.$id !== undefined && schema.$id[0] === '#') {
      schemaKey = schemaName + schema.$id // relative URI
    }

    if (
      this.ajv.refs[schemaKey] === undefined &&
      this.ajv.schemas[schemaKey] === undefined
    ) {
      const ajvSchema = clone(schema)
      this.convertSchemaToAjvFormat(ajvSchema)
      this.ajv.addSchema(ajvSchema, schemaKey)
    }
  }

  validate (schemaRef, data) {
    return this.ajv.validate(schemaRef, data)
  }

  // Ajv does not support js date format. In order to properly validate objects containing a date,
  // it needs to replace all occurrences of the string date format with a custom keyword fjs_type.
  // (see https://github.com/fastify/fast-json-stringify/pull/441)
  convertSchemaToAjvFormat (schema) {
    if (schema === null) return

    if (schema.type === 'string') {
      schema.fjs_type = 'string'
      schema.type = ['string', 'object']
    } else if (
      Array.isArray(schema.type) &&
      schema.type.includes('string') &&
      !schema.type.includes('object')
    ) {
      schema.fjs_type = 'string'
      schema.type.push('object')
    }
    for (const property in schema) {
      if (typeof schema[property] === 'object') {
        this.convertSchemaToAjvFormat(schema[property])
      }
    }
  }
}

module.exports = Validator


/***/ }),
/* 109 */
/***/ ((module) => {

"use strict";
module.exports = require("ajv");

/***/ }),
/* 110 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const URL = __webpack_require__(78)
const { normalizeIPv6, normalizeIPv4, removeDotSegments, recomposeAuthority, normalizeComponentEncoding } = __webpack_require__(111)
const SCHEMES = __webpack_require__(113)

function normalize (uri, options) {
  if (typeof uri === 'string') {
    uri = serialize(parse(uri, options), options)
  } else if (typeof uri === 'object') {
    uri = parse(serialize(uri, options), options)
  }
  return uri
}

function resolve (baseURI, relativeURI, options) {
  const schemelessOptions = Object.assign({ scheme: 'null' }, options)
  const resolved = resolveComponents(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true)
  return serialize(resolved, { ...schemelessOptions, skipEscape: true })
}

function resolveComponents (base, relative, options, skipNormalization) {
  const target = {}
  if (!skipNormalization) {
    base = parse(serialize(base, options), options) // normalize base components
    relative = parse(serialize(relative, options), options) // normalize relative components
  }
  options = options || {}

  if (!options.tolerant && relative.scheme) {
    target.scheme = relative.scheme
    // target.authority = relative.authority;
    target.userinfo = relative.userinfo
    target.host = relative.host
    target.port = relative.port
    target.path = removeDotSegments(relative.path || '')
    target.query = relative.query
  } else {
    if (relative.userinfo !== undefined || relative.host !== undefined || relative.port !== undefined) {
      // target.authority = relative.authority;
      target.userinfo = relative.userinfo
      target.host = relative.host
      target.port = relative.port
      target.path = removeDotSegments(relative.path || '')
      target.query = relative.query
    } else {
      if (!relative.path) {
        target.path = base.path
        if (relative.query !== undefined) {
          target.query = relative.query
        } else {
          target.query = base.query
        }
      } else {
        if (relative.path.charAt(0) === '/') {
          target.path = removeDotSegments(relative.path)
        } else {
          if ((base.userinfo !== undefined || base.host !== undefined || base.port !== undefined) && !base.path) {
            target.path = '/' + relative.path
          } else if (!base.path) {
            target.path = relative.path
          } else {
            target.path = base.path.slice(0, base.path.lastIndexOf('/') + 1) + relative.path
          }
          target.path = removeDotSegments(target.path)
        }
        target.query = relative.query
      }
      // target.authority = base.authority;
      target.userinfo = base.userinfo
      target.host = base.host
      target.port = base.port
    }
    target.scheme = base.scheme
  }

  target.fragment = relative.fragment

  return target
}

function equal (uriA, uriB, options) {
  if (typeof uriA === 'string') {
    uriA = unescape(uriA)
    uriA = serialize(normalizeComponentEncoding(parse(uriA, options), true), { ...options, skipEscape: true })
  } else if (typeof uriA === 'object') {
    uriA = serialize(normalizeComponentEncoding(uriA, true), { ...options, skipEscape: true })
  }

  if (typeof uriB === 'string') {
    uriB = unescape(uriB)
    uriB = serialize(normalizeComponentEncoding(parse(uriB, options), true), { ...options, skipEscape: true })
  } else if (typeof uriB === 'object') {
    uriB = serialize(normalizeComponentEncoding(uriB, true), { ...options, skipEscape: true })
  }

  return uriA.toLowerCase() === uriB.toLowerCase()
}

function serialize (cmpts, opts) {
  const components = {
    host: cmpts.host,
    scheme: cmpts.scheme,
    userinfo: cmpts.userinfo,
    port: cmpts.port,
    path: cmpts.path,
    query: cmpts.query,
    nid: cmpts.nid,
    nss: cmpts.nss,
    uuid: cmpts.uuid,
    fragment: cmpts.fragment,
    reference: cmpts.reference,
    resourceName: cmpts.resourceName,
    secure: cmpts.secure,
    error: ''
  }
  const options = Object.assign({}, opts)
  const uriTokens = []

  // find scheme handler
  const schemeHandler = SCHEMES[(options.scheme || components.scheme || '').toLowerCase()]

  // perform scheme specific serialization
  if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(components, options)

  if (components.path !== undefined) {
    if (!options.skipEscape) {
      components.path = escape(components.path)

      if (components.scheme !== undefined) {
        components.path = components.path.split('%3A').join(':')
      }
    } else {
      components.path = unescape(components.path)
    }
  }

  if (options.reference !== 'suffix' && components.scheme) {
    uriTokens.push(components.scheme)
    uriTokens.push(':')
  }

  const authority = recomposeAuthority(components, options)
  if (authority !== undefined) {
    if (options.reference !== 'suffix') {
      uriTokens.push('//')
    }

    uriTokens.push(authority)

    if (components.path && components.path.charAt(0) !== '/') {
      uriTokens.push('/')
    }
  }
  if (components.path !== undefined) {
    let s = components.path

    if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
      s = removeDotSegments(s)
    }

    if (authority === undefined) {
      s = s.replace(/^\/\//, '/%2F') // don't allow the path to start with "//"
    }

    uriTokens.push(s)
  }

  if (components.query !== undefined) {
    uriTokens.push('?')
    uriTokens.push(components.query)
  }

  if (components.fragment !== undefined) {
    uriTokens.push('#')
    uriTokens.push(components.fragment)
  }
  return uriTokens.join('')
}

const URI_PARSE = /^(?:([^:/?#]+):)?(?:\/\/((?:([^/?#@]*)@)?(\[[^/?#\]]+\]|[^/?#:]*)(?::(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i
const NO_MATCH_IS_UNDEFINED = ('').match(/(){0}/)[1] === undefined

function parse (uri, opts) {
  const options = Object.assign({}, opts)
  const parsed = {
    scheme: undefined,
    userinfo: undefined,
    host: '',
    port: undefined,
    path: '',
    query: undefined,
    fragment: undefined
  }
  const gotEncoding = uri.indexOf('%') !== -1
  if (options.reference === 'suffix') uri = (options.scheme ? options.scheme + ':' : '') + '//' + uri

  const matches = uri.match(URI_PARSE)

  if (matches) {
    if (NO_MATCH_IS_UNDEFINED) {
      // store each component
      parsed.scheme = matches[1]
      parsed.userinfo = matches[3]
      parsed.host = matches[4]
      parsed.port = parseInt(matches[5], 10)
      parsed.path = matches[6] || ''
      parsed.query = matches[7]
      parsed.fragment = matches[8]

      // fix port number
      if (isNaN(parsed.port)) {
        parsed.port = matches[5]
      }
    } else { // IE FIX for improper RegExp matching
      // store each component
      parsed.scheme = matches[1] || undefined
      parsed.userinfo = (uri.indexOf('@') !== -1 ? matches[3] : undefined)
      parsed.host = (uri.indexOf('//') !== -1 ? matches[4] : undefined)
      parsed.port = parseInt(matches[5], 10)
      parsed.path = matches[6] || ''
      parsed.query = (uri.indexOf('?') !== -1 ? matches[7] : undefined)
      parsed.fragment = (uri.indexOf('#') !== -1 ? matches[8] : undefined)

      // fix port number
      if (isNaN(parsed.port)) {
        parsed.port = (uri.match(/\/\/(?:.|\n)*:(?:\/|\?|#|$)/) ? matches[4] : undefined)
      }
    }
    if (parsed.host) {
      const ipv4result = normalizeIPv4(parsed.host)
      if (ipv4result.isIPV4 === false) {
        parsed.host = normalizeIPv6(ipv4result.host, { isIPV4: false }).host.toLowerCase()
      } else {
        parsed.host = ipv4result.host
      }
    }
    if (parsed.scheme === undefined && parsed.userinfo === undefined && parsed.host === undefined && parsed.port === undefined && !parsed.path && parsed.query === undefined) {
      parsed.reference = 'same-document'
    } else if (parsed.scheme === undefined) {
      parsed.reference = 'relative'
    } else if (parsed.fragment === undefined) {
      parsed.reference = 'absolute'
    } else {
      parsed.reference = 'uri'
    }

    // check for reference errors
    if (options.reference && options.reference !== 'suffix' && options.reference !== parsed.reference) {
      parsed.error = parsed.error || 'URI is not a ' + options.reference + ' reference.'
    }

    // find scheme handler
    const schemeHandler = SCHEMES[(options.scheme || parsed.scheme || '').toLowerCase()]

    // check if scheme can't handle IRIs
    if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
      // if host component is a domain name
      if (parsed.host && (options.domainHost || (schemeHandler && schemeHandler.domainHost))) {
        // convert Unicode IDN -> ASCII IDN
        try {
          parsed.host = URL.domainToASCII(parsed.host.toLowerCase())
        } catch (e) {
          parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e
        }
      }
      // convert IRI -> URI
    }

    if (!schemeHandler || (schemeHandler && !schemeHandler.skipNormalize)) {
      if (gotEncoding && parsed.scheme !== undefined) {
        parsed.scheme = unescape(parsed.scheme)
      }
      if (gotEncoding && parsed.userinfo !== undefined) {
        parsed.userinfo = unescape(parsed.userinfo)
      }
      if (gotEncoding && parsed.host !== undefined) {
        parsed.host = unescape(parsed.host)
      }
      if (parsed.path !== undefined && parsed.path.length) {
        parsed.path = encodeURI(parsed.path)
      }
      if (parsed.fragment !== undefined && parsed.fragment.length) {
        parsed.fragment = encodeURI(decodeURI(parsed.fragment))
      }
    }

    // perform scheme specific parsing
    if (schemeHandler && schemeHandler.parse) {
      schemeHandler.parse(parsed, options)
    }
  } else {
    parsed.error = parsed.error || 'URI can not be parsed.'
  }
  return parsed
}

module.exports = {
  normalize,
  resolve,
  resolveComponents,
  equal,
  serialize,
  parse
}


/***/ }),
/* 111 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { HEX } = __webpack_require__(112)

function normalizeIPv4 (host) {
  if (findToken(host, '.') < 3) { return { host, isIPV4: false } }
  const matches = host.match(/^(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) || []
  const [address] = matches
  if (address) {
    return { host: stripLeadingZeros(address, '.', false), isIPV4: true }
  } else {
    return { host, isIPV4: false }
  }
}

function stringToHexStripped (input) {
  let acc = ''
  let strip = true
  for (const c of input) {
    if (c !== '0' && strip === true) strip = false
    if (HEX[c] === undefined) return undefined
    if (!strip) acc += c
  }
  return acc
}

function getIPV6 (input) {
  let tokenCount = 0
  const output = { error: false, address: '', zone: '' }
  const address = []
  const buffer = []
  let isZone = false
  let endipv6Encountered = false
  let endIpv6 = false

  function consume () {
    if (buffer.length) {
      if (isZone === false) {
        const hex = stringToHexStripped(buffer.join(''))
        if (hex !== undefined) {
          address.push(hex)
        } else {
          output.error = true
          return false
        }
      }
      buffer.length = 0
    }
    return true
  }

  for (let i = 0; i < input.length; i++) {
    const cursor = input[i]
    if (cursor === '[' || cursor === ']') { continue }
    if (cursor === ':') {
      if (endipv6Encountered === true) {
        endIpv6 = true
      }
      if (!consume()) { break }
      tokenCount++
      address.push(':')
      if (tokenCount > 7) {
        // not valid
        output.error = true
        break
      }
      if (i - 1 >= 0 && input[i - 1] === ':') {
        endipv6Encountered = true
      }
      continue
    } else if (cursor === '%') {
      if (!consume()) { break }
      // switch to zone detection
      isZone = true
    } else {
      buffer.push(cursor)
      continue
    }
  }
  if (buffer.length) {
    if (isZone) {
      output.zone = buffer.join('')
    } else if (endIpv6) {
      address.push(buffer.join(''))
    } else {
      address.push(stringToHexStripped(buffer.join('')))
    }
  }
  output.address = address.join('')
  return output
}

function normalizeIPv6 (host, opts = {}) {
  if (findToken(host, ':') < 2) { return { host, isIPV6: false } }
  const ipv6 = getIPV6(host, opts.isIPV4)

  if (!ipv6.error) {
    let newHost = ipv6.address
    let escapedHost = ipv6.address
    if (ipv6.zone) {
      newHost += '%' + ipv6.zone
      escapedHost += '%25' + ipv6.zone
    }
    return { host: newHost, escapedHost, isIPV6: true }
  } else {
    return { host, isIPV6: false }
  }
}

function stripLeadingZeros (str, token) {
  let out = ''
  let skip = true
  const l = str.length
  for (let i = 0; i < l; i++) {
    const c = str[i]
    if (c === '0' && skip) {
      if ((i + 1 <= l && str[i + 1] === token) || i + 1 === l) {
        out += c
        skip = false
      }
    } else {
      if (c === token) {
        skip = true
      } else {
        skip = false
      }
      out += c
    }
  }
  return out
}

function findToken (str, token) {
  let ind = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === token) ind++
  }
  return ind
}

const RDS1 = /^\.\.?\//
const RDS2 = /^\/\.(\/|$)/
const RDS3 = /^\/\.\.(\/|$)/
const RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/

function removeDotSegments (input) {
  const output = []

  while (input.length) {
    if (input.match(RDS1)) {
      input = input.replace(RDS1, '')
    } else if (input.match(RDS2)) {
      input = input.replace(RDS2, '/')
    } else if (input.match(RDS3)) {
      input = input.replace(RDS3, '/')
      output.pop()
    } else if (input === '.' || input === '..') {
      input = ''
    } else {
      const im = input.match(RDS5)
      if (im) {
        const s = im[0]
        input = input.slice(s.length)
        output.push(s)
      } else {
        throw new Error('Unexpected dot segment condition')
      }
    }
  }
  return output.join('')
}

function normalizeComponentEncoding (components, esc) {
  const func = esc !== true ? escape : unescape
  if (components.scheme !== undefined) {
    components.scheme = func(components.scheme)
  }
  if (components.userinfo !== undefined) {
    components.userinfo = func(components.userinfo)
  }
  if (components.host !== undefined) {
    components.host = func(components.host)
  }
  if (components.path !== undefined) {
    components.path = func(components.path)
  }
  if (components.query !== undefined) {
    components.query = func(components.query)
  }
  if (components.fragment !== undefined) {
    components.fragment = func(components.fragment)
  }
  return components
}

function recomposeAuthority (components, options) {
  const uriTokens = []

  if (components.userinfo !== undefined) {
    uriTokens.push(components.userinfo)
    uriTokens.push('@')
  }

  if (components.host !== undefined) {
    let host = unescape(components.host)
    const ipV4res = normalizeIPv4(host)

    if (ipV4res.isIPV4) {
      host = ipV4res.host
    } else {
      const ipV6res = normalizeIPv6(ipV4res.host, { isIPV4: false })
      if (ipV6res.isIPV6 === true) {
        host = `[${ipV6res.escapedHost}]`
      } else {
        host = components.host
      }
    }
    uriTokens.push(host)
  }

  if (typeof components.port === 'number' || typeof components.port === 'string') {
    uriTokens.push(':')
    uriTokens.push(String(components.port))
  }

  return uriTokens.length ? uriTokens.join('') : undefined
};

module.exports = {
  recomposeAuthority,
  normalizeComponentEncoding,
  removeDotSegments,
  normalizeIPv4,
  normalizeIPv6,
  stringToHexStripped
}


/***/ }),
/* 112 */
/***/ ((module) => {

"use strict";


const HEX = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15
}

module.exports = {
  HEX
}


/***/ }),
/* 113 */
/***/ ((module) => {

"use strict";


const UUID_REG = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
const URN_REG = /([A-Za-z0-9][A-Za-z0-9-]{0,31}):(([A-Za-z0-9()+,\-.:=@;$_!*']|%[0-9A-Fa-f]{2})+)/

function isSecure (wsComponents) {
  return typeof wsComponents.secure === 'boolean' ? wsComponents.secure : String(wsComponents.scheme).toLowerCase() === 'wss'
}

function httpParse (components) {
  if (!components.host) {
    components.error = components.error || 'HTTP URIs must have a host.'
  }

  return components
}

function httpSerialize (components) {
  const secure = String(components.scheme).toLowerCase() === 'https'

  // normalize the default port
  if (components.port === (secure ? 443 : 80) || components.port === '') {
    components.port = undefined
  }

  // normalize the empty path
  if (!components.path) {
    components.path = '/'
  }

  // NOTE: We do not parse query strings for HTTP URIs
  // as WWW Form Url Encoded query strings are part of the HTML4+ spec,
  // and not the HTTP spec.

  return components
}

function wsParse (wsComponents) {
// indicate if the secure flag is set
  wsComponents.secure = isSecure(wsComponents)

  // construct resouce name
  wsComponents.resourceName = (wsComponents.path || '/') + (wsComponents.query ? '?' + wsComponents.query : '')
  wsComponents.path = undefined
  wsComponents.query = undefined

  return wsComponents
}

function wsSerialize (wsComponents) {
// normalize the default port
  if (wsComponents.port === (isSecure(wsComponents) ? 443 : 80) || wsComponents.port === '') {
    wsComponents.port = undefined
  }

  // ensure scheme matches secure flag
  if (typeof wsComponents.secure === 'boolean') {
    wsComponents.scheme = (wsComponents.secure ? 'wss' : 'ws')
    wsComponents.secure = undefined
  }

  // reconstruct path from resource name
  if (wsComponents.resourceName) {
    const [path, query] = wsComponents.resourceName.split('?')
    wsComponents.path = (path && path !== '/' ? path : undefined)
    wsComponents.query = query
    wsComponents.resourceName = undefined
  }

  // forbid fragment component
  wsComponents.fragment = undefined

  return wsComponents
}

function urnParse (urnComponents, options) {
  if (!urnComponents.path) {
    urnComponents.error = 'URN can not be parsed'
    return urnComponents
  }
  const matches = urnComponents.path.match(URN_REG)
  if (matches) {
    const scheme = options.scheme || urnComponents.scheme || 'urn'
    urnComponents.nid = matches[1].toLowerCase()
    urnComponents.nss = matches[2]
    const urnScheme = `${scheme}:${options.nid || urnComponents.nid}`
    const schemeHandler = SCHEMES[urnScheme]
    urnComponents.path = undefined

    if (schemeHandler) {
      urnComponents = schemeHandler.parse(urnComponents, options)
    }
  } else {
    urnComponents.error = urnComponents.error || 'URN can not be parsed.'
  }

  return urnComponents
}

function urnSerialize (urnComponents, options) {
  const scheme = options.scheme || urnComponents.scheme || 'urn'
  const nid = urnComponents.nid.toLowerCase()
  const urnScheme = `${scheme}:${options.nid || nid}`
  const schemeHandler = SCHEMES[urnScheme]

  if (schemeHandler) {
    urnComponents = schemeHandler.serialize(urnComponents, options)
  }

  const uriComponents = urnComponents
  const nss = urnComponents.nss
  uriComponents.path = `${nid || options.nid}:${nss}`

  options.skipEscape = true
  return uriComponents
}

function urnuuidParse (urnComponents, options) {
  const uuidComponents = urnComponents
  uuidComponents.uuid = uuidComponents.nss
  uuidComponents.nss = undefined

  if (!options.tolerant && (!uuidComponents.uuid || !UUID_REG.test(uuidComponents.uuid))) {
    uuidComponents.error = uuidComponents.error || 'UUID is not valid.'
  }

  return uuidComponents
}

function urnuuidSerialize (uuidComponents) {
  const urnComponents = uuidComponents
  // normalize UUID
  urnComponents.nss = (uuidComponents.uuid || '').toLowerCase()
  return urnComponents
}

const http = {
  scheme: 'http',
  domainHost: true,
  parse: httpParse,
  serialize: httpSerialize
}

const https = {
  scheme: 'https',
  domainHost: http.domainHost,
  parse: httpParse,
  serialize: httpSerialize
}

const ws = {
  scheme: 'ws',
  domainHost: true,
  parse: wsParse,
  serialize: wsSerialize
}

const wss = {
  scheme: 'wss',
  domainHost: ws.domainHost,
  parse: ws.parse,
  serialize: ws.serialize
}

const urn = {
  scheme: 'urn',
  parse: urnParse,
  serialize: urnSerialize,
  skipNormalize: true
}

const urnuuid = {
  scheme: 'urn:uuid',
  parse: urnuuidParse,
  serialize: urnuuidSerialize,
  skipNormalize: true
}

const SCHEMES = {
  http,
  https,
  ws,
  wss,
  urn,
  'urn:uuid': urnuuid
}

module.exports = SCHEMES


/***/ }),
/* 114 */
/***/ ((module) => {

"use strict";
module.exports = require("ajv-formats");

/***/ }),
/* 115 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const deepEqual = __webpack_require__(116)

class RefResolver {
  constructor () {
    this.schemas = {}
  }

  addSchema (schema, schemaId) {
    if (schema.$id !== undefined && schema.$id.charAt(0) !== '#') {
      schemaId = schema.$id
    }
    if (this.getSchema(schemaId) === undefined) {
      this.insertSchemaBySchemaId(schema, schemaId)
      this.insertSchemaSubschemas(schema, schemaId)
    }
  }

  getSchema (schemaId, jsonPointer = '#') {
    const schema = this.schemas[schemaId]
    if (schema === undefined) {
      return undefined
    }
    if (schema.anchors[jsonPointer] !== undefined) {
      return schema.anchors[jsonPointer]
    }
    return getDataByJSONPointer(schema.schema, jsonPointer)
  }

  insertSchemaBySchemaId (schema, schemaId) {
    if (
      this.schemas[schemaId] !== undefined &&
      !deepEqual(schema, this.schemas[schemaId].schema)
    ) {
      throw new Error(`There is already another schema with id ${schemaId}`)
    }
    this.schemas[schemaId] = { schema, anchors: {} }
  }

  insertSchemaByAnchor (schema, schemaId, anchor) {
    const { anchors } = this.schemas[schemaId]
    if (
      anchors[anchor] !== undefined &&
      !deepEqual(schema, anchors[anchor])
    ) {
      throw new Error(`There is already another schema with id ${schemaId}#${anchor}`)
    }
    anchors[anchor] = schema
  }

  insertSchemaSubschemas (schema, rootSchemaId) {
    const schemaId = schema.$id
    if (schemaId !== undefined && typeof schemaId === 'string') {
      if (schemaId.charAt(0) === '#') {
        this.insertSchemaByAnchor(schema, rootSchemaId, schemaId)
      } else {
        this.insertSchemaBySchemaId(schema, schemaId)
        rootSchemaId = schemaId
      }
    }

    for (const key in schema) {
      if (typeof schema[key] === 'object' && schema[key] !== null) {
        this.insertSchemaSubschemas(schema[key], rootSchemaId)
      }
    }
  }
}

function getDataByJSONPointer (data, jsonPointer) {
  const parts = jsonPointer.split('/')
  let current = data
  for (const part of parts) {
    if (part === '' || part === '#') continue
    if (typeof current !== 'object' || current === null) {
      return undefined
    }
    current = current[part]
  }
  return current
}

module.exports = RefResolver


/***/ }),
/* 116 */
/***/ ((module) => {

"use strict";
module.exports = require("fast-deep-equal");

/***/ }),
/* 117 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fs = __webpack_require__(70)
const path = __webpack_require__(5)

function buildStandaloneCode (options, validator, contextFunctionCode) {
  const serializerCode = fs.readFileSync(path.join(__dirname, 'serializer.js')).toString()
  let buildAjvCode = ''
  let defaultAjvSchema = ''
  const defaultMeta = validator.ajv.defaultMeta()
  if (typeof defaultMeta === 'string') {
    defaultAjvSchema = defaultMeta
  } else {
    defaultAjvSchema = defaultMeta.$id || defaultMeta.id
  }
  const shouldUseAjv = contextFunctionCode.indexOf('validator') !== -1
  // we need to export the custom json schema
  let ajvSchemasCode = ''
  if (shouldUseAjv) {
    ajvSchemasCode += `const validator = new Validator(${JSON.stringify(options.ajv || {})})\n`
    for (const [id, schema] of Object.entries(validator.ajv.schemas)) {
      // should skip ajv default schema
      if (id === defaultAjvSchema) continue
      ajvSchemasCode += `validator.ajv.addSchema(${JSON.stringify(schema.schema)}, "${id}")\n`
    }
    buildAjvCode = fs.readFileSync(path.join(__dirname, 'validator.js')).toString()
    buildAjvCode = buildAjvCode.replace("'use strict'", '').replace('module.exports = SchemaValidator', '')
  }
  return `
  'use strict'

  ${serializerCode.replace("'use strict'", '').replace('module.exports = ', '')}
  ${buildAjvCode}

  const serializer = new Serializer(${JSON.stringify(options || {})})
  ${ajvSchemasCode}

  ${contextFunctionCode.replace('return main', '')}

  module.exports = main
      `
}

module.exports = buildStandaloneCode


/***/ }),
/* 118 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SerializerSelector = __webpack_require__(100)

function StandaloneSerializer (options = { readMode: true }) {
  if (options.readMode === true && typeof options.restoreFunction !== 'function') {
    throw new Error('You must provide a function for the restoreFunction-option when readMode ON')
  }

  if (options.readMode !== true && typeof options.storeFunction !== 'function') {
    throw new Error('You must provide a function for the storeFunction-option when readMode OFF')
  }

  if (options.readMode === true) {
    // READ MODE: it behalf only in the restore function provided by the user
    return function wrapper () {
      return function (opts) {
        return options.restoreFunction(opts)
      }
    }
  }

  // WRITE MODE: it behalf on the default SerializerSelector, wrapping the API to run the Ajv Standalone code generation
  const factory = SerializerSelector()
  return function wrapper (externalSchemas, serializerOpts = {}) {
    // to generate the serialization source code, this option is mandatory
    serializerOpts.mode = 'standalone'

    const compiler = factory(externalSchemas, serializerOpts)
    return function (opts) { // { schema/*, method, url, httpPart */ }
      const serializeFuncCode = compiler(opts)

      options.storeFunction(opts, serializeFuncCode)

      // eslint-disable-next-line no-new-func
      return new Function(serializeFuncCode)
    }
  }
}

module.exports = StandaloneSerializer
module.exports["default"] = StandaloneSerializer


/***/ }),
/* 119 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const Ajv = (__webpack_require__(109)["default"])
const AjvJTD = __webpack_require__(120)
const fastUri = __webpack_require__(110)

const AjvReference = Symbol.for('fastify.ajv-compiler.reference')

const defaultAjvOptions = {
  coerceTypes: 'array',
  useDefaults: true,
  removeAdditional: true,
  uriResolver: fastUri,
  addUsedSchema: false,
  // Explicitly set allErrors to `false`.
  // When set to `true`, a DoS attack is possible.
  allErrors: false
}

function ValidatorSelector () {
  const validatorPool = new Map()

  return function buildCompilerFromPool (externalSchemas, options) {
    const externals = JSON.stringify(externalSchemas)
    const ajvConfig = JSON.stringify(options.customOptions)

    const uniqueAjvKey = `${externals}${ajvConfig}`
    if (validatorPool.has(uniqueAjvKey)) {
      return validatorPool.get(uniqueAjvKey)
    }

    const compiler = new ValidatorCompiler(externalSchemas, options)
    const ret = compiler.buildValidatorFunction.bind(compiler)
    validatorPool.set(uniqueAjvKey, ret)

    if (options.customOptions.code !== undefined) {
      ret[AjvReference] = compiler
    }

    return ret
  }
}

class ValidatorCompiler {
  constructor (externalSchemas, options) {
    // This instance of Ajv is private
    // it should not be customized or used
    if (options.mode === 'JTD') {
      this.ajv = new AjvJTD(Object.assign({}, defaultAjvOptions, options.customOptions))
    } else {
      this.ajv = new Ajv(Object.assign({}, defaultAjvOptions, options.customOptions))
    }

    let addFormatPlugin = true
    if (options.plugins && options.plugins.length > 0) {
      for (const plugin of options.plugins) {
        if (Array.isArray(plugin)) {
          addFormatPlugin = addFormatPlugin && plugin[0].name !== 'formatsPlugin'
          plugin[0](this.ajv, plugin[1])
        } else {
          addFormatPlugin = addFormatPlugin && plugin.name !== 'formatsPlugin'
          plugin(this.ajv)
        }
      }
    }

    if (addFormatPlugin) {
      __webpack_require__(114)(this.ajv)
    }

    const sourceSchemas = Object.values(externalSchemas)
    for (const extSchema of sourceSchemas) {
      this.ajv.addSchema(extSchema)
    }
  }

  buildValidatorFunction ({ schema/*, method, url, httpPart */ }) {
    // Ajv does not support compiling two schemas with the same
    // id inside the same instance. Therefore if we have already
    // compiled the schema with the given id, we just return it.
    if (schema.$id) {
      const stored = this.ajv.getSchema(schema.$id)
      if (stored) {
        return stored
      }
    }

    return this.ajv.compile(schema)
  }
}

module.exports = ValidatorSelector
module.exports.AjvReference = AjvReference
module.exports.StandaloneValidator = __webpack_require__(121)


/***/ }),
/* 120 */
/***/ ((module) => {

"use strict";
module.exports = require("ajv/dist/jtd");

/***/ }),
/* 121 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const ValidatorSelector = __webpack_require__(119)
const standaloneCode = (__webpack_require__(122)["default"])

function StandaloneValidator (options = { readMode: true }) {
  if (options.readMode === true && !options.restoreFunction) {
    throw new Error('You must provide a restoreFunction options when readMode ON')
  }

  if (options.readMode !== true && !options.storeFunction) {
    throw new Error('You must provide a storeFunction options when readMode OFF')
  }

  if (options.readMode === true) {
    // READ MODE: it behalf only in the restore function provided by the user
    return function wrapper () {
      return function (opts) {
        return options.restoreFunction(opts)
      }
    }
  }

  // WRITE MODE: it behalf on the default ValidatorSelector, wrapping the API to run the Ajv Standalone code generation
  const factory = ValidatorSelector()
  return function wrapper (externalSchemas, ajvOptions = {}) {
    if (!ajvOptions.customOptions || !ajvOptions.customOptions.code) {
      // to generate the validation source code, these options are mandatory
      ajvOptions.customOptions = Object.assign({}, ajvOptions.customOptions, { code: { source: true } })
    }

    const compiler = factory(externalSchemas, ajvOptions)
    return function (opts) { // { schema/*, method, url, httpPart */ }
      const validationFunc = compiler(opts)

      const schemaValidationCode = standaloneCode(compiler[ValidatorSelector.AjvReference].ajv, validationFunc)
      options.storeFunction(opts, schemaValidationCode)

      return validationFunc
    }
  }
}

module.exports = StandaloneValidator


/***/ }),
/* 122 */
/***/ ((module) => {

"use strict";
module.exports = require("ajv/dist/standalone");

/***/ }),
/* 123 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const semver = __webpack_require__(92)
const assert = __webpack_require__(82)
const registeredPlugins = Symbol.for('registered-plugin')
const {
  kTestInternals
} = __webpack_require__(28)
const { exist, existReply, existRequest } = __webpack_require__(94)
const { FST_ERR_PLUGIN_VERSION_MISMATCH } = __webpack_require__(34)

function getMeta (fn) {
  return fn[Symbol.for('plugin-meta')]
}

function getPluginName (func) {
  const display = getDisplayName(func)
  if (display) {
    return display
  }

  // let's see if this is a file, and in that case use that
  // this is common for plugins
  const cache = __webpack_require__.c
  const keys = Object.keys(cache)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (cache[key].exports === func) {
      return key
    }
  }

  // if not maybe it's a named function, so use that
  if (func.name) {
    return func.name
  }

  return null
}

function getFuncPreview (func) {
  // takes the first two lines of the function if nothing else works
  return func.toString().split('\n').slice(0, 2).map(s => s.trim()).join(' -- ')
}

function getDisplayName (fn) {
  return fn[Symbol.for('fastify.display-name')]
}

function shouldSkipOverride (fn) {
  return !!fn[Symbol.for('skip-override')]
}

function checkDependencies (fn) {
  const meta = getMeta(fn)
  if (!meta) return

  const dependencies = meta.dependencies
  if (!dependencies) return
  assert(Array.isArray(dependencies), 'The dependencies should be an array of strings')

  dependencies.forEach(dependency => {
    assert(
      this[registeredPlugins].indexOf(dependency) > -1,
      `The dependency '${dependency}' of plugin '${meta.name}' is not registered`
    )
  })
}

function checkDecorators (fn) {
  const meta = getMeta(fn)
  if (!meta) return

  const { decorators, name } = meta
  if (!decorators) return

  if (decorators.fastify) _checkDecorators(this, 'Fastify', decorators.fastify, name)
  if (decorators.reply) _checkDecorators(this, 'Reply', decorators.reply, name)
  if (decorators.request) _checkDecorators(this, 'Request', decorators.request, name)
}

const checks = {
  Fastify: exist,
  Request: existRequest,
  Reply: existReply
}

function _checkDecorators (that, instance, decorators, name) {
  assert(Array.isArray(decorators), 'The decorators should be an array of strings')

  decorators.forEach(decorator => {
    const withPluginName = typeof name === 'string' ? ` required by '${name}'` : ''
    if (!checks[instance].call(that, decorator)) {
      throw new Error(`The decorator '${decorator}'${withPluginName} is not present in ${instance}`)
    }
  })
}

function checkVersion (fn) {
  const meta = getMeta(fn)
  if (!meta) return

  const requiredVersion = meta.fastify

  const fastifyRc = /-rc.+$/.test(this.version)
  if (fastifyRc === true && semver.gt(this.version, semver.coerce(requiredVersion)) === true) {
    // A Fastify release candidate phase is taking place. In order to reduce
    // the effort needed to test plugins with the RC, we allow plugins targeting
    // the prior Fastify release to be loaded.
    return
  }
  if (requiredVersion && semver.satisfies(this.version, requiredVersion, { includePrerelease: fastifyRc }) === false) {
    // We are not in a release candidate phase. Thus, we must honor the semver
    // ranges defined by the plugin's metadata. Which is to say, if the plugin
    // expects an older version of Fastify than the _current_ version, we will
    // throw an error.
    throw new FST_ERR_PLUGIN_VERSION_MISMATCH(meta.name, requiredVersion, this.version)
  }
}

function registerPluginName (fn) {
  const meta = getMeta(fn)
  if (!meta) return

  const name = meta.name
  if (!name) return
  this[registeredPlugins].push(name)
}

function registerPlugin (fn) {
  registerPluginName.call(this, fn)
  checkVersion.call(this, fn)
  checkDecorators.call(this, fn)
  checkDependencies.call(this, fn)
  return shouldSkipOverride(fn)
}

module.exports = {
  getPluginName,
  getFuncPreview,
  registeredPlugins,
  getDisplayName,
  registerPlugin
}

module.exports[kTestInternals] = {
  shouldSkipOverride,
  getMeta,
  checkDecorators,
  checkDependencies
}


/***/ }),
/* 124 */
/***/ ((module) => {

"use strict";


module.exports = function (requestIdHeader, optGenReqId) {
  // 2,147,483,647 (2^31 − 1) stands for max SMI value (an internal optimization of V8).
  // With this upper bound, if you'll be generating 1k ids/sec, you're going to hit it in ~25 days.
  // This is very likely to happen in real-world applications, hence the limit is enforced.
  // Growing beyond this value will make the id generation slower and cause a deopt.
  // In the worst cases, it will become a float, losing accuracy.
  const maxInt = 2147483647
  let nextReqId = 0
  function defaultGenReqId (req) {
    nextReqId = (nextReqId + 1) & maxInt
    return `req-${nextReqId.toString(36)}`
  }

  const genReqId = optGenReqId || defaultGenReqId

  if (requestIdHeader) {
    // requestIdHeader = typeof requestIdHeader === 'string' ? requestIdHeader : 'request-id'
    return function (req) {
      return req.headers[requestIdHeader] || genReqId(req)
    }
  }

  return genReqId
}


/***/ }),
/* 125 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const FindMyWay = __webpack_require__(126)
const Context = __webpack_require__(145)
const handleRequest = __webpack_require__(40)
const { hookRunner, hookIterator, lifecycleHooks } = __webpack_require__(39)
const { supportedMethods } = __webpack_require__(93)
const { normalizeSchema } = __webpack_require__(87)
const { parseHeadOnSendHandlers } = __webpack_require__(146)
const warning = __webpack_require__(32)
const { kRequestAcceptVersion, kRouteByFastify } = __webpack_require__(28)

const {
  compileSchemasForValidation,
  compileSchemasForSerialization
} = __webpack_require__(41)

const {
  FST_ERR_SCH_VALIDATION_BUILD,
  FST_ERR_SCH_SERIALIZATION_BUILD,
  FST_ERR_DEFAULT_ROUTE_INVALID_TYPE,
  FST_ERR_DUPLICATED_ROUTE,
  FST_ERR_INVALID_URL,
  FST_ERR_SEND_UNDEFINED_ERR
} = __webpack_require__(34)

const {
  kRoutePrefix,
  kLogLevel,
  kLogSerializers,
  kHooks,
  kSchemaController,
  kOptions,
  kReplySerializerDefault,
  kReplyIsError,
  kRequestPayloadStream,
  kDisableRequestLogging,
  kSchemaErrorFormatter,
  kErrorHandler,
  kHasBeenDecorated
} = __webpack_require__(28)
const { buildErrorHandler } = __webpack_require__(86)

function buildRouting (options) {
  const router = FindMyWay(options.config)

  let avvio
  let fourOhFour
  let requestIdLogLabel
  let logger
  let hasLogger
  let setupResponseListeners
  let throwIfAlreadyStarted
  let genReqId
  let disableRequestLogging
  let ignoreTrailingSlash
  let ignoreDuplicateSlashes
  let return503OnClosing
  let globalExposeHeadRoutes
  let validateHTTPVersion
  let keepAliveConnections

  let closing = false

  return {
    setup (options, fastifyArgs) {
      avvio = fastifyArgs.avvio
      fourOhFour = fastifyArgs.fourOhFour
      logger = fastifyArgs.logger
      hasLogger = fastifyArgs.hasLogger
      setupResponseListeners = fastifyArgs.setupResponseListeners
      throwIfAlreadyStarted = fastifyArgs.throwIfAlreadyStarted
      validateHTTPVersion = fastifyArgs.validateHTTPVersion

      globalExposeHeadRoutes = options.exposeHeadRoutes
      requestIdLogLabel = options.requestIdLogLabel
      genReqId = options.genReqId
      disableRequestLogging = options.disableRequestLogging
      ignoreTrailingSlash = options.ignoreTrailingSlash
      ignoreDuplicateSlashes = options.ignoreDuplicateSlashes
      return503OnClosing = Object.prototype.hasOwnProperty.call(options, 'return503OnClosing') ? options.return503OnClosing : true
      keepAliveConnections = fastifyArgs.keepAliveConnections
    },
    routing: router.lookup.bind(router), // router func to find the right handler to call
    route, // configure a route in the fastify instance
    hasRoute,
    prepareRoute,
    getDefaultRoute: function () {
      return router.defaultRoute
    },
    setDefaultRoute: function (defaultRoute) {
      if (typeof defaultRoute !== 'function') {
        throw new FST_ERR_DEFAULT_ROUTE_INVALID_TYPE()
      }

      router.defaultRoute = defaultRoute
    },
    routeHandler,
    closeRoutes: () => { closing = true },
    printRoutes: router.prettyPrint.bind(router),
    addConstraintStrategy,
    hasConstraintStrategy
  }

  function addConstraintStrategy (strategy) {
    throwIfAlreadyStarted('Cannot add constraint strategy when fastify instance is already started!')
    return router.addConstraintStrategy(strategy)
  }

  function hasConstraintStrategy (strategyName) {
    return router.hasConstraintStrategy(strategyName)
  }

  // Convert shorthand to extended route declaration
  function prepareRoute ({ method, url, options, handler, isFastify }) {
    if (typeof url !== 'string') {
      throw new FST_ERR_INVALID_URL(typeof url)
    }

    if (!handler && typeof options === 'function') {
      handler = options // for support over direct function calls such as fastify.get() options are reused as the handler
      options = {}
    } else if (handler && typeof handler === 'function') {
      if (Object.prototype.toString.call(options) !== '[object Object]') {
        throw new Error(`Options for ${method}:${url} route must be an object`)
      } else if (options.handler) {
        if (typeof options.handler === 'function') {
          throw new Error(`Duplicate handler for ${method}:${url} route is not allowed!`)
        } else {
          throw new Error(`Handler for ${method}:${url} route must be a function`)
        }
      }
    }

    options = Object.assign({}, options, {
      method,
      url,
      path: url,
      handler: handler || (options && options.handler)
    })

    return route.call(this, { options, isFastify })
  }

  function hasRoute ({ options }) {
    return router.find(
      options.method,
      options.url || '',
      options.constraints
    ) !== null
  }

  // Route management
  function route ({ options, isFastify }) {
    // Since we are mutating/assigning only top level props, it is fine to have a shallow copy using the spread operator
    const opts = { ...options }

    throwIfAlreadyStarted('Cannot add route when fastify instance is already started!')

    const path = opts.url || opts.path || ''

    if (Array.isArray(opts.method)) {
      // eslint-disable-next-line no-var
      for (var i = 0; i < opts.method.length; ++i) {
        validateMethodAndSchemaBodyOption(opts.method[i], path, opts.schema)
      }
    } else {
      validateMethodAndSchemaBodyOption(opts.method, path, opts.schema)
    }

    if (!opts.handler) {
      throw new Error(`Missing handler function for ${opts.method}:${path} route.`)
    }

    if (opts.errorHandler !== undefined && typeof opts.errorHandler !== 'function') {
      throw new Error(`Error Handler for ${opts.method}:${path} route, if defined, must be a function`)
    }

    validateBodyLimitOption(opts.bodyLimit)

    const prefix = this[kRoutePrefix]

    if (path === '/' && prefix.length > 0 && opts.method !== 'HEAD') {
      switch (opts.prefixTrailingSlash) {
        case 'slash':
          addNewRoute.call(this, { path, isFastify })
          break
        case 'no-slash':
          addNewRoute.call(this, { path: '', isFastify })
          break
        case 'both':
        default:
          addNewRoute.call(this, { path: '', isFastify })
          // If ignoreTrailingSlash is set to true we need to add only the '' route to prevent adding an incomplete one.
          if (ignoreTrailingSlash !== true && (ignoreDuplicateSlashes !== true || !prefix.endsWith('/'))) {
            addNewRoute.call(this, { path, prefixing: true, isFastify })
          }
      }
    } else if (path[0] === '/' && prefix.endsWith('/')) {
      // Ensure that '/prefix/' + '/route' gets registered as '/prefix/route'
      addNewRoute.call(this, { path: path.slice(1), isFastify })
    } else {
      addNewRoute.call(this, { path, isFastify })
    }

    // chainable api
    return this

    function addNewRoute ({ path, prefixing = false, isFastify = false }) {
      const url = prefix + path

      opts.url = url
      opts.path = url
      opts.routePath = path
      opts.prefix = prefix
      opts.logLevel = opts.logLevel || this[kLogLevel]

      if (this[kLogSerializers] || opts.logSerializers) {
        opts.logSerializers = Object.assign(Object.create(this[kLogSerializers]), opts.logSerializers)
      }

      if (opts.attachValidation == null) {
        opts.attachValidation = false
      }

      if (prefixing === false) {
        // run 'onRoute' hooks
        for (const hook of this[kHooks].onRoute) {
          hook.call(this, opts)
        }
      }

      const constraints = opts.constraints || {}
      const config = {
        ...opts.config,
        url,
        method: opts.method
      }

      const context = new Context({
        schema: opts.schema,
        handler: opts.handler.bind(this),
        config,
        errorHandler: opts.errorHandler,
        bodyLimit: opts.bodyLimit,
        logLevel: opts.logLevel,
        logSerializers: opts.logSerializers,
        attachValidation: opts.attachValidation,
        schemaErrorFormatter: opts.schemaErrorFormatter,
        replySerializer: this[kReplySerializerDefault],
        validatorCompiler: opts.validatorCompiler,
        serializerCompiler: opts.serializerCompiler,
        server: this,
        isFastify
      })

      if (opts.version) {
        warning.emit('FSTDEP008')
        constraints.version = opts.version
      }

      const headHandler = router.find('HEAD', opts.url, constraints)
      const hasHEADHandler = headHandler != null

      // remove the head route created by fastify
      if (hasHEADHandler && !context[kRouteByFastify] && headHandler.store[kRouteByFastify]) {
        router.off(opts.method, opts.url, { constraints })
      }

      try {
        router.on(opts.method, opts.url, { constraints }, routeHandler, context)
      } catch (error) {
        // any route insertion error created by fastify can be safely ignore
        // because it only duplicate route for head
        if (!context[kRouteByFastify]) {
          const isDuplicatedRoute = error.message.includes(`Method '${opts.method}' already declared for route '${opts.url}'`)
          if (isDuplicatedRoute) {
            throw new FST_ERR_DUPLICATED_ROUTE(opts.method, opts.url)
          }

          throw error
        }
      }

      this.after((notHandledErr, done) => {
        // Send context async
        context.errorHandler = opts.errorHandler ? buildErrorHandler(this[kErrorHandler], opts.errorHandler) : this[kErrorHandler]
        context._parserOptions.limit = opts.bodyLimit || null
        context.logLevel = opts.logLevel
        context.logSerializers = opts.logSerializers
        context.attachValidation = opts.attachValidation
        context[kReplySerializerDefault] = this[kReplySerializerDefault]
        context.schemaErrorFormatter = opts.schemaErrorFormatter || this[kSchemaErrorFormatter] || context.schemaErrorFormatter

        // Run hooks and more
        avvio.once('preReady', () => {
          for (const hook of lifecycleHooks) {
            const toSet = this[kHooks][hook]
              .concat(opts[hook] || [])
              .map(h => h.bind(this))
            context[hook] = toSet.length ? toSet : null
          }

          // Optimization: avoid encapsulation if no decoration has been done.
          while (!context.Request[kHasBeenDecorated] && context.Request.parent) {
            context.Request = context.Request.parent
          }
          while (!context.Reply[kHasBeenDecorated] && context.Reply.parent) {
            context.Reply = context.Reply.parent
          }

          // Must store the 404 Context in 'preReady' because it is only guaranteed to
          // be available after all of the plugins and routes have been loaded.
          fourOhFour.setContext(this, context)

          if (opts.schema) {
            context.schema = normalizeSchema(context.schema, this.initialConfig)

            const schemaController = this[kSchemaController]
            if (!opts.validatorCompiler && (opts.schema.body || opts.schema.headers || opts.schema.querystring || opts.schema.params)) {
              schemaController.setupValidator(this[kOptions])
            }
            try {
              compileSchemasForValidation(context, opts.validatorCompiler || schemaController.validatorCompiler)
            } catch (error) {
              throw new FST_ERR_SCH_VALIDATION_BUILD(opts.method, url, error.message)
            }

            if (opts.schema.response && !opts.serializerCompiler) {
              schemaController.setupSerializer(this[kOptions])
            }
            try {
              compileSchemasForSerialization(context, opts.serializerCompiler || schemaController.serializerCompiler)
            } catch (error) {
              throw new FST_ERR_SCH_SERIALIZATION_BUILD(opts.method, url, error.message)
            }
          }
        })

        done(notHandledErr)
      })

      // register head route in sync
      // we must place it after the `this.after`
      const { exposeHeadRoute } = opts
      const hasRouteExposeHeadRouteFlag = exposeHeadRoute != null
      const shouldExposeHead = hasRouteExposeHeadRouteFlag ? exposeHeadRoute : globalExposeHeadRoutes

      if (shouldExposeHead && options.method === 'GET' && !hasHEADHandler) {
        const onSendHandlers = parseHeadOnSendHandlers(opts.onSend)
        prepareRoute.call(this, { method: 'HEAD', url: path, options: { ...opts, onSend: onSendHandlers }, isFastify: true })
      } else if (hasHEADHandler && exposeHeadRoute) {
        warning.emit('FSTDEP007')
      }
    }
  }

  // HTTP request entry point, the routing has already been executed
  function routeHandler (req, res, params, context, query) {
    // TODO: The check here should be removed once https://github.com/nodejs/node/issues/43115 resolve in core.
    if (!validateHTTPVersion(req.httpVersion)) {
      const message = '{"error":"HTTP Version Not Supported","message":"HTTP Version Not Supported","statusCode":505}'
      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': message.length
      }
      res.writeHead(505, headers)
      res.end(message)
      return
    }

    if (closing === true) {
      /* istanbul ignore next mac, windows */
      if (req.httpVersionMajor !== 2) {
        res.once('finish', () => req.destroy())
        res.setHeader('Connection', 'close')
      }

      if (return503OnClosing) {
        const headers = {
          'Content-Type': 'application/json',
          'Content-Length': '80'
        }
        res.writeHead(503, headers)
        res.end('{"error":"Service Unavailable","message":"Service Unavailable","statusCode":503}')
        return
      }
    }

    // When server.forceCloseConnections is true, we will collect any requests
    // that have indicated they want persistence so that they can be reaped
    // on server close. Otherwise, the container is a noop container.
    const connHeader = String.prototype.toLowerCase.call(req.headers.connection || '')
    if (connHeader === 'keep-alive') {
      if (keepAliveConnections.has(req.socket) === false) {
        keepAliveConnections.add(req.socket)
        req.socket.on('close', removeTrackedSocket.bind({ keepAliveConnections, socket: req.socket }))
      }
    }

    // we revert the changes in defaultRoute
    if (req.headers[kRequestAcceptVersion] !== undefined) {
      req.headers['accept-version'] = req.headers[kRequestAcceptVersion]
      req.headers[kRequestAcceptVersion] = undefined
    }

    const id = genReqId(req)

    const loggerBinding = {
      [requestIdLogLabel]: id
    }

    const loggerOpts = {
      level: context.logLevel
    }

    if (context.logSerializers) {
      loggerOpts.serializers = context.logSerializers
    }
    const childLogger = logger.child(loggerBinding, loggerOpts)
    childLogger[kDisableRequestLogging] = disableRequestLogging

    const request = new context.Request(id, params, req, query, childLogger, context)
    const reply = new context.Reply(res, request, childLogger)

    if (disableRequestLogging === false) {
      childLogger.info({ req: request }, 'incoming request')
    }

    if (hasLogger === true || context.onResponse !== null) {
      setupResponseListeners(reply)
    }

    if (context.onRequest !== null) {
      hookRunner(
        context.onRequest,
        hookIterator,
        request,
        reply,
        runPreParsing
      )
    } else {
      runPreParsing(null, request, reply)
    }

    if (context.onTimeout !== null) {
      if (!request.raw.socket._meta) {
        request.raw.socket.on('timeout', handleTimeout)
      }
      request.raw.socket._meta = { context, request, reply }
    }
  }
}

function handleTimeout () {
  const { context, request, reply } = this._meta
  hookRunner(
    context.onTimeout,
    hookIterator,
    request,
    reply,
    noop
  )
}

function validateMethodAndSchemaBodyOption (method, path, schema) {
  if (supportedMethods.indexOf(method) === -1) {
    throw new Error(`${method} method is not supported!`)
  }

  if ((method === 'GET' || method === 'HEAD') && schema && schema.body) {
    throw new Error(`Body validation schema for ${method}:${path} route is not supported!`)
  }
}

function validateBodyLimitOption (bodyLimit) {
  if (bodyLimit === undefined) return
  if (!Number.isInteger(bodyLimit) || bodyLimit <= 0) {
    throw new TypeError(`'bodyLimit' option must be an integer > 0. Got '${bodyLimit}'`)
  }
}

function runPreParsing (err, request, reply) {
  if (reply.sent === true) return
  if (err != null) {
    reply[kReplyIsError] = true
    reply.send(err)
    return
  }

  request[kRequestPayloadStream] = request.raw

  if (reply.context.preParsing !== null) {
    preParsingHookRunner(reply.context.preParsing, request, reply, handleRequest)
  } else {
    handleRequest(null, request, reply)
  }
}

function preParsingHookRunner (functions, request, reply, cb) {
  let i = 0

  function next (err, stream) {
    if (reply.sent) {
      return
    }

    if (typeof stream !== 'undefined') {
      request[kRequestPayloadStream] = stream
    }

    if (err || i === functions.length) {
      cb(err, request, reply)
      return
    }

    const fn = functions[i++]
    let result
    try {
      result = fn(request, reply, request[kRequestPayloadStream], next)
    } catch (error) {
      next(error)
      return
    }

    if (result && typeof result.then === 'function') {
      result.then(handleResolve, handleReject)
    }
  }

  function handleResolve (stream) {
    next(null, stream)
  }

  function handleReject (err) {
    if (!err) {
      err = new FST_ERR_SEND_UNDEFINED_ERR()
    }

    next(err)
  }

  next(null, request[kRequestPayloadStream])
}

/**
 * Used within the route handler as a `net.Socket.close` event handler.
 * The purpose is to remove a socket from the tracked sockets collection when
 * the socket has naturally timed out.
 */
function removeTrackedSocket () {
  this.keepAliveConnections.delete(this.socket)
}

function noop () { }

module.exports = { buildRouting, validateBodyLimitOption }


/***/ }),
/* 126 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*
  Char codes:
    '!': 33 - !
    '#': 35 - %23
    '$': 36 - %24
    '%': 37 - %25
    '&': 38 - %26
    ''': 39 - '
    '(': 40 - (
    ')': 41 - )
    '*': 42 - *
    '+': 43 - %2B
    ',': 44 - %2C
    '-': 45 - -
    '.': 46 - .
    '/': 47 - %2F
    ':': 58 - %3A
    ';': 59 - %3B
    '=': 61 - %3D
    '?': 63 - %3F
    '@': 64 - %40
    '_': 95 - _
    '~': 126 - ~
*/

const assert = __webpack_require__(82)
const http = __webpack_require__(27)
const querystring = __webpack_require__(127)
const isRegexSafe = __webpack_require__(132)
const deepEqual = __webpack_require__(116)
const { flattenNode, compressFlattenedNode, prettyPrintFlattenedNode, prettyPrintRoutesArray } = __webpack_require__(138)
const { StaticNode, NODE_TYPES } = __webpack_require__(139)
const Constrainer = __webpack_require__(141)
const { safeDecodeURI, safeDecodeURIComponent } = __webpack_require__(144)

const httpMethods = http.METHODS
const FULL_PATH_REGEXP = /^https?:\/\/.*?\//
const OPTIONAL_PARAM_REGEXP = /(\/:[^/()]*?)\?(\/?)/

if (!isRegexSafe(FULL_PATH_REGEXP)) {
  throw new Error('the FULL_PATH_REGEXP is not safe, update this module')
}

if (!isRegexSafe(OPTIONAL_PARAM_REGEXP)) {
  throw new Error('the OPTIONAL_PARAM_REGEXP is not safe, update this module')
}

function Router (opts) {
  if (!(this instanceof Router)) {
    return new Router(opts)
  }
  opts = opts || {}

  if (opts.defaultRoute) {
    assert(typeof opts.defaultRoute === 'function', 'The default route must be a function')
    this.defaultRoute = opts.defaultRoute
  } else {
    this.defaultRoute = null
  }

  if (opts.onBadUrl) {
    assert(typeof opts.onBadUrl === 'function', 'The bad url handler must be a function')
    this.onBadUrl = opts.onBadUrl
  } else {
    this.onBadUrl = null
  }

  if (opts.buildPrettyMeta) {
    assert(typeof opts.buildPrettyMeta === 'function', 'buildPrettyMeta must be a function')
    this.buildPrettyMeta = opts.buildPrettyMeta
  } else {
    this.buildPrettyMeta = defaultBuildPrettyMeta
  }

  if (opts.querystringParser) {
    assert(typeof opts.querystringParser === 'function', 'querystringParser must be a function')
    this.querystringParser = opts.querystringParser
  } else {
    this.querystringParser = (query) => query === '' ? {} : querystring.parse(query)
  }

  this.caseSensitive = opts.caseSensitive === undefined ? true : opts.caseSensitive
  this.ignoreTrailingSlash = opts.ignoreTrailingSlash || false
  this.ignoreDuplicateSlashes = opts.ignoreDuplicateSlashes || false
  this.maxParamLength = opts.maxParamLength || 100
  this.allowUnsafeRegex = opts.allowUnsafeRegex || false
  this.routes = []
  this.trees = {}
  this.constrainer = new Constrainer(opts.constraints)

  this._routesPatterns = []
}

Router.prototype.on = function on (method, path, opts, handler, store) {
  if (typeof opts === 'function') {
    if (handler !== undefined) {
      store = handler
    }
    handler = opts
    opts = {}
  }
  // path validation
  assert(typeof path === 'string', 'Path should be a string')
  assert(path.length > 0, 'The path could not be empty')
  assert(path[0] === '/' || path[0] === '*', 'The first character of a path should be `/` or `*`')
  // handler validation
  assert(typeof handler === 'function', 'Handler should be a function')

  // path ends with optional parameter
  const optionalParamMatch = path.match(OPTIONAL_PARAM_REGEXP)
  if (optionalParamMatch) {
    assert(path.length === optionalParamMatch.index + optionalParamMatch[0].length, 'Optional Parameter needs to be the last parameter of the path')

    const pathFull = path.replace(OPTIONAL_PARAM_REGEXP, '$1$2')
    const pathOptional = path.replace(OPTIONAL_PARAM_REGEXP, '$2')

    this.on(method, pathFull, opts, handler, store)
    this.on(method, pathOptional, opts, handler, store)
    return
  }

  const route = path

  if (this.ignoreDuplicateSlashes) {
    path = removeDuplicateSlashes(path)
  }

  if (this.ignoreTrailingSlash) {
    path = trimLastSlash(path)
  }

  const methods = Array.isArray(method) ? method : [method]
  for (const method of methods) {
    this._on(method, path, opts, handler, store, route)
    this.routes.push({ method, path, opts, handler, store })
  }
}

Router.prototype._on = function _on (method, path, opts, handler, store) {
  assert(typeof method === 'string', 'Method should be a string')
  assert(httpMethods.includes(method), `Method '${method}' is not an http method.`)

  let constraints = {}
  if (opts.constraints !== undefined) {
    assert(typeof opts.constraints === 'object' && opts.constraints !== null, 'Constraints should be an object')
    if (Object.keys(opts.constraints).length !== 0) {
      constraints = opts.constraints
    }
  }

  this.constrainer.validateConstraints(constraints)
  // Let the constrainer know if any constraints are being used now
  this.constrainer.noteUsage(constraints)

  // Boot the tree for this method if it doesn't exist yet
  if (this.trees[method] === undefined) {
    this.trees[method] = new StaticNode('/')
  }

  if (path === '*' && this.trees[method].prefix.length !== 0) {
    const currentRoot = this.trees[method]
    this.trees[method] = new StaticNode('')
    this.trees[method].staticChildren['/'] = currentRoot
  }

  let currentNode = this.trees[method]
  let parentNodePathIndex = currentNode.prefix.length

  const params = []
  for (let i = 0; i <= path.length; i++) {
    if (path.charCodeAt(i) === 58 && path.charCodeAt(i + 1) === 58) {
      // It's a double colon
      i++
      continue
    }

    const isParametricNode = path.charCodeAt(i) === 58 && path.charCodeAt(i + 1) !== 58
    const isWildcardNode = path.charCodeAt(i) === 42

    if (isParametricNode || isWildcardNode || (i === path.length && i !== parentNodePathIndex)) {
      let staticNodePath = path.slice(parentNodePathIndex, i)
      if (!this.caseSensitive) {
        staticNodePath = staticNodePath.toLowerCase()
      }
      staticNodePath = staticNodePath.split('::').join(':')
      staticNodePath = staticNodePath.split('%').join('%25')
      // add the static part of the route to the tree
      currentNode = currentNode.createStaticChild(staticNodePath)
    }

    if (isParametricNode) {
      let isRegexNode = false
      const regexps = []

      let staticEndingLength = 0
      let lastParamStartIndex = i + 1
      for (let j = lastParamStartIndex; ; j++) {
        const charCode = path.charCodeAt(j)

        if (charCode === 40 || charCode === 45 || charCode === 46) {
          isRegexNode = true

          const paramName = path.slice(lastParamStartIndex, j)
          params.push(paramName)

          if (charCode === 40) {
            const endOfRegexIndex = getClosingParenthensePosition(path, j)
            const regexString = path.slice(j, endOfRegexIndex + 1)

            if (!this.allowUnsafeRegex) {
              assert(isRegexSafe(new RegExp(regexString)), `The regex '${regexString}' is not safe!`)
            }

            regexps.push(trimRegExpStartAndEnd(regexString))

            j = endOfRegexIndex + 1
          } else {
            regexps.push('(.*?)')
          }

          let lastParamEndIndex = j
          for (; lastParamEndIndex < path.length; lastParamEndIndex++) {
            const charCode = path.charCodeAt(lastParamEndIndex)
            if (charCode === 58 || charCode === 47) {
              break
            }
          }

          const staticPart = path.slice(j, lastParamEndIndex)
          if (staticPart) {
            regexps.push(escapeRegExp(staticPart))
          }

          lastParamStartIndex = lastParamEndIndex + 1
          j = lastParamEndIndex

          if (path.charCodeAt(j) === 47 || j === path.length) {
            staticEndingLength = staticPart.length
          }
        } else if (charCode === 47 || j === path.length) {
          const paramName = path.slice(lastParamStartIndex, j)
          params.push(paramName)

          if (regexps.length !== 0) {
            regexps.push('(.*?)')
          }
        }

        if (path.charCodeAt(j) === 47 || j === path.length) {
          path = path.slice(0, i + 1) + path.slice(j - staticEndingLength)
          i += staticEndingLength
          break
        }
      }

      let regex = null
      if (isRegexNode) {
        regex = new RegExp('^' + regexps.join('') + '$')
      }

      currentNode = currentNode.createParametricChild(regex)
      parentNodePathIndex = i + 1
    } else if (isWildcardNode) {
      // add the wildcard parameter
      params.push('*')
      currentNode = currentNode.createWildcardChild()
      parentNodePathIndex = i + 1
    }
  }

  if (!this.caseSensitive) {
    path = path.toLowerCase()
  }

  const isRootWildcard = path === '*' || path === '/*'
  for (const existRoute of this._routesPatterns) {
    let samePath = false

    if (existRoute.path === path) {
      samePath = true
    } else if (isRootWildcard && (existRoute.path === '/*' || existRoute.path === '*')) {
      samePath = true
    }

    if (
      samePath &&
      existRoute.method === method &&
      deepEqual(existRoute.constraints, constraints)
    ) {
      throw new Error(`Method '${method}' already declared for route '${path}' with constraints '${JSON.stringify(constraints)}'`)
    }
  }
  this._routesPatterns.push({ method, path, constraints })

  currentNode.handlerStorage.addHandler(handler, params, store, this.constrainer, constraints)
}

Router.prototype.hasConstraintStrategy = function (strategyName) {
  return this.constrainer.hasConstraintStrategy(strategyName)
}

Router.prototype.addConstraintStrategy = function (constraints) {
  this.constrainer.addConstraintStrategy(constraints)
  this._rebuild(this.routes)
}

Router.prototype.reset = function reset () {
  this.trees = {}
  this.routes = []
  this._routesPatterns = []
}

Router.prototype.off = function off (method, path, constraints) {
  // path validation
  assert(typeof path === 'string', 'Path should be a string')
  assert(path.length > 0, 'The path could not be empty')
  assert(path[0] === '/' || path[0] === '*', 'The first character of a path should be `/` or `*`')
  // options validation
  assert(
    typeof constraints === 'undefined' ||
    (typeof constraints === 'object' && !Array.isArray(constraints) && constraints !== null),
    'Constraints should be an object or undefined.')

  // path ends with optional parameter
  const optionalParamMatch = path.match(OPTIONAL_PARAM_REGEXP)
  if (optionalParamMatch) {
    assert(path.length === optionalParamMatch.index + optionalParamMatch[0].length, 'Optional Parameter needs to be the last parameter of the path')

    const pathFull = path.replace(OPTIONAL_PARAM_REGEXP, '$1$2')
    const pathOptional = path.replace(OPTIONAL_PARAM_REGEXP, '$2')

    this.off(method, pathFull, constraints)
    this.off(method, pathOptional, constraints)
    return
  }

  if (this.ignoreDuplicateSlashes) {
    path = removeDuplicateSlashes(path)
  }

  if (this.ignoreTrailingSlash) {
    path = trimLastSlash(path)
  }

  const methods = Array.isArray(method) ? method : [method]
  for (const method of methods) {
    this._off(method, path, constraints)
  }
}

Router.prototype._off = function _off (method, path, constraints) {
  // method validation
  assert(typeof method === 'string', 'Method should be a string')
  assert(httpMethods.includes(method), `Method '${method}' is not an http method.`)

  function matcherWithoutConstraints (route) {
    return method !== route.method || path !== route.path
  }

  function matcherWithConstraints (route) {
    return matcherWithoutConstraints(route) || !deepEqual(constraints, route.opts.constraints || {})
  }

  const predicate = constraints ? matcherWithConstraints : matcherWithoutConstraints

  // Rebuild tree without the specific route
  const newRoutes = this.routes.filter(predicate)
  this._rebuild(newRoutes)
}

Router.prototype.lookup = function lookup (req, res, ctx) {
  var handle = this.find(req.method, req.url, this.constrainer.deriveConstraints(req, ctx))
  if (handle === null) return this._defaultRoute(req, res, ctx)
  return ctx === undefined
    ? handle.handler(req, res, handle.params, handle.store, handle.searchParams)
    : handle.handler.call(ctx, req, res, handle.params, handle.store, handle.searchParams)
}

Router.prototype.find = function find (method, path, derivedConstraints) {
  let currentNode = this.trees[method]
  if (currentNode === undefined) return null

  if (path.charCodeAt(0) !== 47) { // 47 is '/'
    path = path.replace(FULL_PATH_REGEXP, '/')
  }

  // This must be run before sanitizeUrl as the resulting function
  // .sliceParameter must be constructed with same URL string used
  // throughout the rest of this function.
  if (this.ignoreDuplicateSlashes) {
    path = removeDuplicateSlashes(path)
  }

  let sanitizedUrl
  let querystring
  let shouldDecodeParam

  try {
    sanitizedUrl = safeDecodeURI(path)
    path = sanitizedUrl.path
    querystring = sanitizedUrl.querystring
    shouldDecodeParam = sanitizedUrl.shouldDecodeParam
  } catch (error) {
    return this._onBadUrl(path)
  }

  if (this.ignoreTrailingSlash) {
    path = trimLastSlash(path)
  }

  const originPath = path

  if (this.caseSensitive === false) {
    path = path.toLowerCase()
  }

  const maxParamLength = this.maxParamLength

  let pathIndex = currentNode.prefix.length
  const params = []
  const pathLen = path.length

  const brothersNodesStack = []

  while (true) {
    if (pathIndex === pathLen) {
      const handle = currentNode.handlerStorage.getMatchingHandler(derivedConstraints)

      if (handle !== null) {
        return {
          handler: handle.handler,
          store: handle.store,
          params: handle._createParamsObject(params),
          searchParams: this.querystringParser(querystring)
        }
      }
    }

    let node = currentNode.getNextNode(path, pathIndex, brothersNodesStack, params.length)

    if (node === null) {
      if (brothersNodesStack.length === 0) {
        return null
      }

      const brotherNodeState = brothersNodesStack.pop()
      pathIndex = brotherNodeState.brotherPathIndex
      params.splice(brotherNodeState.paramsCount)
      node = brotherNodeState.brotherNode
    }

    currentNode = node

    // static route
    if (currentNode.kind === NODE_TYPES.STATIC) {
      pathIndex += currentNode.prefix.length
      continue
    }

    if (currentNode.kind === NODE_TYPES.WILDCARD) {
      let param = originPath.slice(pathIndex)
      if (shouldDecodeParam) {
        param = safeDecodeURIComponent(param)
      }

      params.push(param)
      pathIndex = pathLen
      continue
    }

    if (currentNode.kind === NODE_TYPES.PARAMETRIC) {
      let paramEndIndex = originPath.indexOf('/', pathIndex)
      if (paramEndIndex === -1) {
        paramEndIndex = pathLen
      }

      let param = originPath.slice(pathIndex, paramEndIndex)
      if (shouldDecodeParam) {
        param = safeDecodeURIComponent(param)
      }

      if (currentNode.isRegex) {
        const matchedParameters = currentNode.regex.exec(param)
        if (matchedParameters === null) continue

        for (let i = 1; i < matchedParameters.length; i++) {
          const matchedParam = matchedParameters[i]
          if (matchedParam.length > maxParamLength) {
            return null
          }
          params.push(matchedParam)
        }
      } else {
        if (param.length > maxParamLength) {
          return null
        }
        params.push(param)
      }

      pathIndex = paramEndIndex
    }
  }
}

Router.prototype._rebuild = function (routes) {
  this.reset()

  for (const route of routes) {
    const { method, path, opts, handler, store } = route
    this._on(method, path, opts, handler, store)
    this.routes.push({ method, path, opts, handler, store })
  }
}

Router.prototype._defaultRoute = function (req, res, ctx) {
  if (this.defaultRoute !== null) {
    return ctx === undefined
      ? this.defaultRoute(req, res)
      : this.defaultRoute.call(ctx, req, res)
  } else {
    res.statusCode = 404
    res.end()
  }
}

Router.prototype._onBadUrl = function (path) {
  if (this.onBadUrl === null) {
    return null
  }
  const onBadUrl = this.onBadUrl
  return {
    handler: (req, res, ctx) => onBadUrl(path, req, res),
    params: {},
    store: null
  }
}

Router.prototype.prettyPrint = function (opts = {}) {
  opts.commonPrefix = opts.commonPrefix === undefined ? true : opts.commonPrefix // default to original behaviour
  if (!opts.commonPrefix) return prettyPrintRoutesArray.call(this, this.routes, opts)
  const root = {
    prefix: '/',
    nodes: [],
    children: {}
  }

  for (const method in this.trees) {
    const node = this.trees[method]
    if (node) {
      flattenNode(root, node, method)
    }
  }

  compressFlattenedNode(root)

  return prettyPrintFlattenedNode.call(this, root, '', true, opts)
}

for (var i in http.METHODS) {
  /* eslint no-prototype-builtins: "off" */
  if (!http.METHODS.hasOwnProperty(i)) continue
  const m = http.METHODS[i]
  const methodName = m.toLowerCase()

  if (Router.prototype[methodName]) throw new Error('Method already exists: ' + methodName)

  Router.prototype[methodName] = function (path, handler, store) {
    return this.on(m, path, handler, store)
  }
}

Router.prototype.all = function (path, handler, store) {
  this.on(httpMethods, path, handler, store)
}

module.exports = Router

function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function removeDuplicateSlashes (path) {
  return path.replace(/\/\/+/g, '/')
}

function trimLastSlash (path) {
  if (path.length > 1 && path.charCodeAt(path.length - 1) === 47) {
    return path.slice(0, -1)
  }
  return path
}

function trimRegExpStartAndEnd (regexString) {
  // removes chars that marks start "^" and end "$" of regexp
  if (regexString.charCodeAt(1) === 94) {
    regexString = regexString.slice(0, 1) + regexString.slice(2)
  }

  if (regexString.charCodeAt(regexString.length - 2) === 36) {
    regexString = regexString.slice(0, regexString.length - 2) + regexString.slice(regexString.length - 1)
  }

  return regexString
}

function getClosingParenthensePosition (path, idx) {
  // `path.indexOf()` will always return the first position of the closing parenthese,
  // but it's inefficient for grouped or wrong regexp expressions.
  // see issues #62 and #63 for more info

  var parentheses = 1

  while (idx < path.length) {
    idx++

    // ignore skipped chars
    if (path[idx] === '\\') {
      idx++
      continue
    }

    if (path[idx] === ')') {
      parentheses--
    } else if (path[idx] === '(') {
      parentheses++
    }

    if (!parentheses) return idx
  }

  throw new TypeError('Invalid regexp expression in "' + path + '"')
}

function defaultBuildPrettyMeta (route) {
  // buildPrettyMeta function must return an object, which will be parsed into key/value pairs for display
  if (!route) return {}
  if (!route.store) return {}
  return Object.assign({}, route.store)
}


/***/ }),
/* 127 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const parse = __webpack_require__(128);
const stringify = __webpack_require__(130);

const fastQuerystring = {
  parse,
  stringify,
};

/**
 * Enable TS and JS support
 *
 * - `const qs = require('fast-querystring')`
 * - `import qs from 'fast-querystring'`
 */
module.exports = fastQuerystring;
module.exports["default"] = fastQuerystring;


/***/ }),
/* 128 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fastDecode = __webpack_require__(129);

const plusRegex = /\+/g;
const Empty = function () {};
Empty.prototype = Object.create(null);

/**
 * @callback parse
 * @param {string} input
 */
function parse(input) {
  // Optimization: Use new Empty() instead of Object.create(null) for performance
  // v8 has a better optimization for initializing functions compared to Object
  const result = new Empty();

  if (typeof input !== "string") {
    return result;
  }

  let inputLength = input.length;
  let key = "";
  let value = "";
  let startingIndex = -1;
  let equalityIndex = -1;
  let shouldDecodeKey = false;
  let shouldDecodeValue = false;
  let keyHasPlus = false;
  let valueHasPlus = false;
  let hasBothKeyValuePair = false;
  let c = 0;

  // Have a boundary of input.length + 1 to access last pair inside the loop.
  for (let i = 0; i < inputLength + 1; i++) {
    c = i !== inputLength ? input.charCodeAt(i) : 38;

    // Handle '&' and end of line to pass the current values to result
    if (c === 38) {
      hasBothKeyValuePair = equalityIndex > startingIndex;

      // Optimization: Reuse equality index to store the end of key
      if (!hasBothKeyValuePair) {
        equalityIndex = i;
      }

      key = input.slice(startingIndex + 1, equalityIndex);

      // Add key/value pair only if the range size is greater than 1; a.k.a. contains at least "="
      if (hasBothKeyValuePair || key.length > 0) {
        // Optimization: Replace '+' with space
        if (keyHasPlus) {
          key = key.replace(plusRegex, " ");
        }

        // Optimization: Do not decode if it's not necessary.
        if (shouldDecodeKey) {
          key = fastDecode(key) || key;
        }

        if (hasBothKeyValuePair) {
          value = input.slice(equalityIndex + 1, i);

          if (valueHasPlus) {
            value = value.replace(plusRegex, " ");
          }

          if (shouldDecodeValue) {
            value = fastDecode(value) || value;
          }
        }
        const currentValue = result[key];

        if (currentValue === undefined) {
          result[key] = value;
        } else {
          // Optimization: value.pop is faster than Array.isArray(value)
          if (currentValue.pop) {
            currentValue.push(value);
          } else {
            result[key] = [currentValue, value];
          }
        }
      }

      // Reset reading key value pairs
      value = "";
      startingIndex = i;
      equalityIndex = i;
      shouldDecodeKey = false;
      shouldDecodeValue = false;
      keyHasPlus = false;
      valueHasPlus = false;
    }
    // Check '='
    else if (c === 61) {
      if (equalityIndex <= startingIndex) {
        equalityIndex = i;
      }
      // If '=' character occurs again, we should decode the input.
      else {
        shouldDecodeValue = true;
      }
    }
    // Check '+', and remember to replace it with empty space.
    else if (c === 43) {
      if (equalityIndex > startingIndex) {
        valueHasPlus = true;
      } else {
        keyHasPlus = true;
      }
    }
    // Check '%' character for encoding
    else if (c === 37) {
      if (equalityIndex > startingIndex) {
        shouldDecodeValue = true;
      } else {
        shouldDecodeKey = true;
      }
    }
  }

  return result;
}

module.exports = parse;


/***/ }),
/* 129 */
/***/ ((module) => {

"use strict";


var UTF8_ACCEPT = 12
var UTF8_REJECT = 0
var UTF8_DATA = [
  // The first part of the table maps bytes to character to a transition.
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7,
  10, 9, 9, 9, 11, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,

  // The second part of the table maps a state to a new state when adding a
  // transition.
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  12, 0, 0, 0, 0, 24, 36, 48, 60, 72, 84, 96,
  0, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 24, 24, 24, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 24, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

  // The third part maps the current transition to a mask that needs to apply
  // to the byte.
  0x7F, 0x3F, 0x3F, 0x3F, 0x00, 0x1F, 0x0F, 0x0F, 0x0F, 0x07, 0x07, 0x07
]

function decodeURIComponent (uri) {
  var percentPosition = uri.indexOf('%')
  if (percentPosition === -1) return uri

  var length = uri.length
  var decoded = ''
  var last = 0
  var codepoint = 0
  var startOfOctets = percentPosition
  var state = UTF8_ACCEPT

  while (percentPosition > -1 && percentPosition < length) {
    var high = hexCodeToInt(uri[percentPosition + 1], 4)
    var low = hexCodeToInt(uri[percentPosition + 2], 0)
    var byte = high | low
    var type = UTF8_DATA[byte]
    state = UTF8_DATA[256 + state + type]
    codepoint = (codepoint << 6) | (byte & UTF8_DATA[364 + type])

    if (state === UTF8_ACCEPT) {
      decoded += uri.slice(last, startOfOctets)

      decoded += (codepoint <= 0xFFFF)
        ? String.fromCharCode(codepoint)
        : String.fromCharCode(
          (0xD7C0 + (codepoint >> 10)),
          (0xDC00 + (codepoint & 0x3FF))
        )

      codepoint = 0
      last = percentPosition + 3
      percentPosition = startOfOctets = uri.indexOf('%', last)
    } else if (state === UTF8_REJECT) {
      return null
    } else {
      percentPosition += 3
      if (percentPosition < length && uri.charCodeAt(percentPosition) === 37) continue
      return null
    }
  }

  return decoded + uri.slice(last)
}

var HEX = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'a': 10,
  'A': 10,
  'b': 11,
  'B': 11,
  'c': 12,
  'C': 12,
  'd': 13,
  'D': 13,
  'e': 14,
  'E': 14,
  'f': 15,
  'F': 15
}

function hexCodeToInt (c, shift) {
  var i = HEX[c]
  return i === undefined ? 255 : i << shift
}

module.exports = decodeURIComponent


/***/ }),
/* 130 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { encodeString } = __webpack_require__(131);

function getAsPrimitive(value) {
  const type = typeof value;

  if (type === "string") {
    // Length check is handled inside encodeString function
    return encodeString(value);
  } else if (type === "bigint") {
    return value.toString();
  } else if (type === "boolean") {
    return value ? "true" : "false";
  } else if (type === "number" && Number.isFinite(value)) {
    if (Math.abs(value) < 1e21) return value.toString();
    return encodeString(value.toString());
  }

  return "";
}

/**
 * @param {Record<string, string | number | boolean
 * | ReadonlyArray<string | number | boolean> | null>} input
 * @returns {string}
 */
function stringify(input) {
  let result = "";

  if (input === null || typeof input !== "object") {
    return result;
  }

  const separator = "&";
  const keys = Object.keys(input);
  const keyLength = keys.length;
  let valueLength = 0;

  for (let i = 0; i < keyLength; i++) {
    const key = keys[i];
    const value = input[key];
    const encodedKey = encodeString(key) + "=";

    if (i) {
      result += separator;
    }

    if (Array.isArray(value)) {
      valueLength = value.length;
      for (let j = 0; j < valueLength; j++) {
        if (j) {
          result += separator;
        }

        // Optimization: Dividing into multiple lines improves the performance.
        // Since v8 does not need to care about the '+' character if it was one-liner.
        result += encodedKey;
        result += getAsPrimitive(value[j]);
      }
    } else {
      result += encodedKey;
      result += getAsPrimitive(value);
    }
  }

  return result;
}

module.exports = stringify;


/***/ }),
/* 131 */
/***/ ((module) => {

// This file is taken from Node.js project.
// Full implementation can be found from https://github.com/nodejs/node/blob/main/lib/internal/querystring.js

const hexTable = Array.from(
  { length: 256 },
  (_, i) => "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase(),
);

// These characters do not need escaping when generating query strings:
// ! - . _ ~
// ' ( ) *
// digits
// alpha (uppercase)
// alpha (lowercase)
// rome-ignore format: the array should not be formatted
const noEscape = new Int8Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, // 80 - 95
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0,  // 112 - 127
]);

/**
 * @param {string} str
 * @returns {string}
 */
function encodeString(str) {
  const len = str.length;
  if (len === 0) return "";

  let out = "";
  let lastPos = 0;
  let i = 0;

  outer: for (; i < len; i++) {
    let c = str.charCodeAt(i);

    // ASCII
    while (c < 0x80) {
      if (noEscape[c] !== 1) {
        if (lastPos < i) out += str.slice(lastPos, i);
        lastPos = i + 1;
        out += hexTable[c];
      }

      if (++i === len) break outer;

      c = str.charCodeAt(i);
    }

    if (lastPos < i) out += str.slice(lastPos, i);

    // Multi-byte characters ...
    if (c < 0x800) {
      lastPos = i + 1;
      out += hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)];
      continue;
    }
    if (c < 0xD800 || c >= 0xE000) {
      lastPos = i + 1;
      out +=
        hexTable[0xE0 | (c >> 12)] +
        hexTable[0x80 | ((c >> 6) & 0x3F)] +
        hexTable[0x80 | (c & 0x3F)];
      continue;
    }
    // Surrogate pair
    ++i;

    // This branch should never happen because all URLSearchParams entries
    // should already be converted to USVString. But, included for
    // completion's sake anyway.
    if (i >= len) {
      throw new Error("URI malformed");
    }

    const c2 = str.charCodeAt(i) & 0x3FF;

    lastPos = i + 1;
    c = 0x10000 + (((c & 0x3FF) << 10) | c2);
    out +=
      hexTable[0xF0 | (c >> 18)] +
      hexTable[0x80 | ((c >> 12) & 0x3F)] +
      hexTable[0x80 | ((c >> 6) & 0x3F)] +
      hexTable[0x80 | (c & 0x3F)];
  }
  if (lastPos === 0) return str;
  if (lastPos < len) return out + str.slice(lastPos);
  return out;
}

module.exports = { encodeString };


/***/ }),
/* 132 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var parse = __webpack_require__(133)
var types = parse.types

module.exports = function (re, opts) {
  if (!opts) opts = {}
  var replimit = opts.limit === undefined ? 25 : opts.limit

  if (isRegExp(re)) re = re.source
  else if (typeof re !== 'string') re = String(re)

  try { re = parse(re) } catch (err) { return false }

  var reps = 0
  return (function walk (node, starHeight) {
    var i
    var ok
    var len

    if (node.type === types.REPETITION) {
      starHeight++
      reps++
      if (starHeight > 1) return false
      if (reps > replimit) return false
    }

    if (node.options) {
      for (i = 0, len = node.options.length; i < len; i++) {
        ok = walk({ stack: node.options[i] }, starHeight)
        if (!ok) return false
      }
    }
    var stack = node.stack || (node.value && node.value.stack)
    if (!stack) return true

    for (i = 0; i < stack.length; i++) {
      ok = walk(stack[i], starHeight)
      if (!ok) return false
    }

    return true
  })(re, 0)
}

function isRegExp (x) {
  return {}.toString.call(x) === '[object RegExp]'
}


/***/ }),
/* 133 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const util      = __webpack_require__(134);
const types     = __webpack_require__(135);
const sets      = __webpack_require__(136);
const positions = __webpack_require__(137);


module.exports = (regexpStr) => {
  var i = 0, l, c,
    start = { type: types.ROOT, stack: []},

    // Keep track of last clause/group and stack.
    lastGroup = start,
    last = start.stack,
    groupStack = [];


  var repeatErr = (i) => {
    util.error(regexpStr, `Nothing to repeat at column ${i - 1}`);
  };

  // Decode a few escaped characters.
  var str = util.strToChars(regexpStr);
  l = str.length;

  // Iterate through each character in string.
  while (i < l) {
    c = str[i++];

    switch (c) {
      // Handle escaped characters, inclues a few sets.
      case '\\':
        c = str[i++];

        switch (c) {
          case 'b':
            last.push(positions.wordBoundary());
            break;

          case 'B':
            last.push(positions.nonWordBoundary());
            break;

          case 'w':
            last.push(sets.words());
            break;

          case 'W':
            last.push(sets.notWords());
            break;

          case 'd':
            last.push(sets.ints());
            break;

          case 'D':
            last.push(sets.notInts());
            break;

          case 's':
            last.push(sets.whitespace());
            break;

          case 'S':
            last.push(sets.notWhitespace());
            break;

          default:
            // Check if c is integer.
            // In which case it's a reference.
            if (/\d/.test(c)) {
              last.push({ type: types.REFERENCE, value: parseInt(c, 10) });

            // Escaped character.
            } else {
              last.push({ type: types.CHAR, value: c.charCodeAt(0) });
            }
        }

        break;


      // Positionals.
      case '^':
        last.push(positions.begin());
        break;

      case '$':
        last.push(positions.end());
        break;


      // Handle custom sets.
      case '[':
        // Check if this class is 'anti' i.e. [^abc].
        var not;
        if (str[i] === '^') {
          not = true;
          i++;
        } else {
          not = false;
        }

        // Get all the characters in class.
        var classTokens = util.tokenizeClass(str.slice(i), regexpStr);

        // Increase index by length of class.
        i += classTokens[1];
        last.push({
          type: types.SET,
          set: classTokens[0],
          not,
        });

        break;


      // Class of any character except \n.
      case '.':
        last.push(sets.anyChar());
        break;


      // Push group onto stack.
      case '(':
        // Create group.
        var group = {
          type: types.GROUP,
          stack: [],
          remember: true,
        };

        c = str[i];

        // If if this is a special kind of group.
        if (c === '?') {
          c = str[i + 1];
          i += 2;

          // Match if followed by.
          if (c === '=') {
            group.followedBy = true;

          // Match if not followed by.
          } else if (c === '!') {
            group.notFollowedBy = true;

          } else if (c !== ':') {
            util.error(regexpStr,
              `Invalid group, character '${c}'` +
              ` after '?' at column ${i - 1}`);
          }

          group.remember = false;
        }

        // Insert subgroup into current group stack.
        last.push(group);

        // Remember the current group for when the group closes.
        groupStack.push(lastGroup);

        // Make this new group the current group.
        lastGroup = group;
        last = group.stack;
        break;


      // Pop group out of stack.
      case ')':
        if (groupStack.length === 0) {
          util.error(regexpStr, `Unmatched ) at column ${i - 1}`);
        }
        lastGroup = groupStack.pop();

        // Check if this group has a PIPE.
        // To get back the correct last stack.
        last = lastGroup.options ?
          lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
        break;


      // Use pipe character to give more choices.
      case '|':
        // Create array where options are if this is the first PIPE
        // in this clause.
        if (!lastGroup.options) {
          lastGroup.options = [lastGroup.stack];
          delete lastGroup.stack;
        }

        // Create a new stack and add to options for rest of clause.
        var stack = [];
        lastGroup.options.push(stack);
        last = stack;
        break;


      // Repetition.
      // For every repetition, remove last element from last stack
      // then insert back a RANGE object.
      // This design is chosen because there could be more than
      // one repetition symbols in a regex i.e. `a?+{2,3}`.
      case '{':
        var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)), min, max;
        if (rs !== null) {
          if (last.length === 0) {
            repeatErr(i);
          }
          min = parseInt(rs[1], 10);
          max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
          i += rs[0].length;

          last.push({
            type: types.REPETITION,
            min,
            max,
            value: last.pop(),
          });
        } else {
          last.push({
            type: types.CHAR,
            value: 123,
          });
        }
        break;

      case '?':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 0,
          max: 1,
          value: last.pop(),
        });
        break;

      case '+':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 1,
          max: Infinity,
          value: last.pop(),
        });
        break;

      case '*':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 0,
          max: Infinity,
          value: last.pop(),
        });
        break;


      // Default is a character that is not `\[](){}?+*^$`.
      default:
        last.push({
          type: types.CHAR,
          value: c.charCodeAt(0),
        });
    }

  }

  // Check if any groups have not been closed.
  if (groupStack.length !== 0) {
    util.error(regexpStr, 'Unterminated group');
  }

  return start;
};

module.exports.types = types;


/***/ }),
/* 134 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const types = __webpack_require__(135);
const sets  = __webpack_require__(136);


const CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?';
const SLSH = { '0': 0, 't': 9, 'n': 10, 'v': 11, 'f': 12, 'r': 13 };

/**
 * Finds character representations in str and convert all to
 * their respective characters
 *
 * @param {String} str
 * @return {String}
 */
exports.strToChars = function(str) {
  /* jshint maxlen: false */
  var chars_regex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
  str = str.replace(chars_regex, function(s, b, lbs, a16, b16, c8, dctrl, eslsh) {
    if (lbs) {
      return s;
    }

    var code = b ? 8 :
      a16   ? parseInt(a16, 16) :
      b16   ? parseInt(b16, 16) :
      c8    ? parseInt(c8,   8) :
      dctrl ? CTRL.indexOf(dctrl) :
      SLSH[eslsh];

    var c = String.fromCharCode(code);

    // Escape special regex characters.
    if (/[[\]{}^$.|?*+()]/.test(c)) {
      c = '\\' + c;
    }

    return c;
  });

  return str;
};


/**
 * turns class into tokens
 * reads str until it encounters a ] not preceeded by a \
 *
 * @param {String} str
 * @param {String} regexpStr
 * @return {Array.<Array.<Object>, Number>}
 */
exports.tokenizeClass = (str, regexpStr) => {
  /* jshint maxlen: false */
  var tokens = [];
  var regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;
  var rs, c;


  while ((rs = regexp.exec(str)) != null) {
    if (rs[1]) {
      tokens.push(sets.words());

    } else if (rs[2]) {
      tokens.push(sets.ints());

    } else if (rs[3]) {
      tokens.push(sets.whitespace());

    } else if (rs[4]) {
      tokens.push(sets.notWords());

    } else if (rs[5]) {
      tokens.push(sets.notInts());

    } else if (rs[6]) {
      tokens.push(sets.notWhitespace());

    } else if (rs[7]) {
      tokens.push({
        type: types.RANGE,
        from: (rs[8] || rs[9]).charCodeAt(0),
        to: rs[10].charCodeAt(0),
      });

    } else if ((c = rs[12])) {
      tokens.push({
        type: types.CHAR,
        value: c.charCodeAt(0),
      });

    } else {
      return [tokens, regexp.lastIndex];
    }
  }

  exports.error(regexpStr, 'Unterminated character class');
};


/**
 * Shortcut to throw errors.
 *
 * @param {String} regexp
 * @param {String} msg
 */
exports.error = (regexp, msg) => {
  throw new SyntaxError('Invalid regular expression: /' + regexp + '/: ' + msg);
};


/***/ }),
/* 135 */
/***/ ((module) => {

module.exports = {
  ROOT       : 0,
  GROUP      : 1,
  POSITION   : 2,
  SET        : 3,
  RANGE      : 4,
  REPETITION : 5,
  REFERENCE  : 6,
  CHAR       : 7,
};


/***/ }),
/* 136 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const types = __webpack_require__(135);

const INTS = () => [{ type: types.RANGE , from: 48, to: 57 }];

const WORDS = () => {
  return [
    { type: types.CHAR, value: 95 },
    { type: types.RANGE, from: 97, to: 122 },
    { type: types.RANGE, from: 65, to: 90 }
  ].concat(INTS());
};

const WHITESPACE = () => {
  return [
    { type: types.CHAR, value: 9 },
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 11 },
    { type: types.CHAR, value: 12 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 32 },
    { type: types.CHAR, value: 160 },
    { type: types.CHAR, value: 5760 },
    { type: types.RANGE, from: 8192, to: 8202 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 },
    { type: types.CHAR, value: 8239 },
    { type: types.CHAR, value: 8287 },
    { type: types.CHAR, value: 12288 },
    { type: types.CHAR, value: 65279 }
  ];
};

const NOTANYCHAR = () => {
  return [
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 },
  ];
};

// Predefined class objects.
exports.words = () => ({ type: types.SET, set: WORDS(), not: false });
exports.notWords = () => ({ type: types.SET, set: WORDS(), not: true });
exports.ints = () => ({ type: types.SET, set: INTS(), not: false });
exports.notInts = () => ({ type: types.SET, set: INTS(), not: true });
exports.whitespace = () => ({ type: types.SET, set: WHITESPACE(), not: false });
exports.notWhitespace = () => ({ type: types.SET, set: WHITESPACE(), not: true });
exports.anyChar = () => ({ type: types.SET, set: NOTANYCHAR(), not: true });


/***/ }),
/* 137 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const types = __webpack_require__(135);
exports.wordBoundary = () => ({ type: types.POSITION, value: 'b' });
exports.nonWordBoundary = () => ({ type: types.POSITION, value: 'B' });
exports.begin = () => ({ type: types.POSITION, value: '^' });
exports.end = () => ({ type: types.POSITION, value: '$' });


/***/ }),
/* 138 */
/***/ ((module) => {

"use strict";


/* eslint-disable no-multi-spaces */
const indent              = '    '
const branchIndent        = '│   '
const midBranchIndent     = '├── '
const endBranchIndent     = '└── '
const wildcardDelimiter   = '*'
const pathDelimiter       = '/'
const pathRegExp          = /(?=\/)/
/* eslint-enable */

function parseFunctionName (fn) {
  let fName = fn.name || ''

  fName = fName.replace('bound', '').trim()
  fName = (fName || 'anonymous') + '()'
  return fName
}

function parseMeta (meta) {
  if (Array.isArray(meta)) return meta.map(m => parseMeta(m))
  if (typeof meta === 'symbol') return meta.toString()
  if (typeof meta === 'function') return parseFunctionName(meta)
  return meta
}

function buildMetaObject (route, metaArray) {
  const out = {}
  const cleanMeta = this.buildPrettyMeta(route)
  if (!Array.isArray(metaArray)) metaArray = cleanMeta ? Reflect.ownKeys(cleanMeta) : []
  metaArray.forEach(m => {
    const metaKey = typeof m === 'symbol' ? m.toString() : m
    if (cleanMeta && cleanMeta[m]) {
      out[metaKey] = parseMeta(cleanMeta[m])
    }
  })
  return out
}

function prettyPrintRoutesArray (routeArray, opts = {}) {
  if (!this.buildPrettyMeta) throw new Error('buildPrettyMeta not defined')
  opts.includeMeta = opts.includeMeta || null // array of meta objects to display
  const mergedRouteArray = []

  let tree = ''

  routeArray.sort((a, b) => {
    if (!a.path || !b.path) return 0
    return a.path.localeCompare(b.path)
  })

  // merge alike paths
  for (let i = 0; i < routeArray.length; i++) {
    const route = routeArray[i]
    const pathExists = mergedRouteArray.find(r => route.path === r.path)
    if (pathExists) {
      // path already declared, add new method and break out of loop
      pathExists.handlers.push({
        method: route.method,
        opts: route.opts.constraints || undefined,
        meta: opts.includeMeta ? buildMetaObject.call(this, route, opts.includeMeta) : null
      })
      continue
    }

    const routeHandler = {
      method: route.method,
      opts: route.opts.constraints || undefined,
      meta: opts.includeMeta ? buildMetaObject.call(this, route, opts.includeMeta) : null
    }
    mergedRouteArray.push({
      path: route.path,
      methods: [route.method],
      opts: [route.opts],
      handlers: [routeHandler]
    })
  }

  // insert root level path if none defined
  if (!mergedRouteArray.filter(r => r.path === pathDelimiter).length) {
    const rootPath = {
      path: pathDelimiter,
      truncatedPath: '',
      methods: [],
      opts: [],
      handlers: [{}]
    }

    // if wildcard route exists, insert root level after wildcard
    if (mergedRouteArray.filter(r => r.path === wildcardDelimiter).length) {
      mergedRouteArray.splice(1, 0, rootPath)
    } else {
      mergedRouteArray.unshift(rootPath)
    }
  }

  // build tree
  const routeTree = buildRouteTree(mergedRouteArray)

  // draw tree
  routeTree.forEach((rootBranch, idx) => {
    tree += drawBranch(rootBranch, null, idx === routeTree.length - 1, false, true)
    tree += '\n' // newline characters inserted at beginning of drawing function to allow for nested paths
  })

  return tree
}

function buildRouteTree (mergedRouteArray) {
  const result = []
  const temp = { result }
  mergedRouteArray.forEach((route, idx) => {
    let splitPath = route.path.split(pathRegExp)

    // add preceding slash for proper nesting
    if (splitPath[0] !== pathDelimiter) {
      // handle wildcard route
      if (splitPath[0] !== wildcardDelimiter) splitPath = [pathDelimiter, splitPath[0].slice(1), ...splitPath.slice(1)]
    }

    // build tree
    splitPath.reduce((acc, path, pidx) => {
      if (!acc[path]) {
        acc[path] = { result: [] }
        const pathSeg = { path, children: acc[path].result }

        if (pidx === splitPath.length - 1) pathSeg.handlers = route.handlers
        acc.result.push(pathSeg)
      }
      return acc[path]
    }, temp)
  })

  // unfold root object from array
  return result
}

function drawBranch (pathSeg, prefix, endBranch, noPrefix, rootBranch) {
  let branch = ''

  if (!noPrefix && !rootBranch) branch += '\n'
  if (!noPrefix) branch += `${prefix || ''}${endBranch ? endBranchIndent : midBranchIndent}`
  branch += `${pathSeg.path}`

  if (pathSeg.handlers) {
    const flatHandlers = pathSeg.handlers.reduce((acc, curr) => {
      const match = acc.findIndex(h => JSON.stringify(h.opts) === JSON.stringify(curr.opts))
      if (match !== -1) {
        acc[match].method = [acc[match].method, curr.method].join(', ')
      } else {
        acc.push(curr)
      }
      return acc
    }, [])

    flatHandlers.forEach((handler, idx) => {
      if (idx > 0) branch += `${noPrefix ? '' : prefix || ''}${endBranch ? indent : branchIndent}${pathSeg.path}`
      branch += ` (${handler.method || '-'})`
      if (handler.opts && JSON.stringify(handler.opts) !== '{}') branch += ` ${JSON.stringify(handler.opts)}`
      if (handler.meta) {
        Reflect.ownKeys(handler.meta).forEach((m, hidx) => {
          branch += `\n${noPrefix ? '' : prefix || ''}${endBranch ? indent : branchIndent}`
          branch += `• (${m}) ${JSON.stringify(handler.meta[m])}`
        })
      }
      if (flatHandlers.length > 1 && idx !== flatHandlers.length - 1) branch += '\n'
    })
  } else {
    if (pathSeg.children.length > 1) branch += ' (-)'
  }

  if (!noPrefix) prefix = `${prefix || ''}${endBranch ? indent : branchIndent}`

  pathSeg.children.forEach((child, idx) => {
    const endBranch = idx === pathSeg.children.length - 1
    const skipPrefix = (!pathSeg.handlers && pathSeg.children.length === 1)
    branch += drawBranch(child, prefix, endBranch, skipPrefix)
  })

  return branch
}

function prettyPrintFlattenedNode (flattenedNode, prefix, tail, opts) {
  if (!this.buildPrettyMeta) throw new Error('buildPrettyMeta not defined')
  opts.includeMeta = opts.includeMeta || null // array of meta items to display
  let paramName = ''
  const printHandlers = []

  for (const { node, method } of flattenedNode.nodes) {
    for (const handler of node.handlerStorage.handlers) {
      printHandlers.push({ method, ...handler })
    }
  }

  if (printHandlers.length) {
    printHandlers.forEach((handler, index) => {
      let suffix = `(${handler.method || '-'})`
      if (Object.keys(handler.constraints).length > 0) {
        suffix += ' ' + JSON.stringify(handler.constraints)
      }

      let name = ''
      // find locations of parameters in prefix
      const paramIndices = flattenedNode.prefix.split('').map((ch, idx) => ch === ':' ? idx : null).filter(idx => idx !== null)
      if (paramIndices.length) {
        let prevLoc = 0
        paramIndices.forEach((loc, idx) => {
          // find parameter in prefix
          name += flattenedNode.prefix.slice(prevLoc, loc + 1)
          // insert parameters
          name += handler.params[handler.params.length - paramIndices.length + idx]
          if (idx === paramIndices.length - 1) name += flattenedNode.prefix.slice(loc + 1)
          prevLoc = loc + 1
        })
      } else {
        // there are no parameters, return full object
        name = flattenedNode.prefix
      }

      if (index === 0) {
        paramName += `${name} ${suffix}`
      } else {
        paramName += `\n${prefix}${tail ? indent : branchIndent}${name} ${suffix}`
      }
      if (opts.includeMeta) {
        const meta = buildMetaObject.call(this, handler, opts.includeMeta)
        Object.keys(meta).forEach((m, hidx) => {
          paramName += `\n${prefix || ''}${tail ? indent : branchIndent}`
          paramName += `• (${m}) ${JSON.stringify(meta[m])}`
        })
      }
    })
  } else {
    paramName = flattenedNode.prefix
  }

  let tree = `${prefix}${tail ? endBranchIndent : midBranchIndent}${paramName}\n`

  prefix = `${prefix}${tail ? indent : branchIndent}`
  const labels = Object.keys(flattenedNode.children)
  for (let i = 0; i < labels.length; i++) {
    const child = flattenedNode.children[labels[i]]
    tree += prettyPrintFlattenedNode.call(this, child, prefix, i === (labels.length - 1), opts)
  }
  return tree
}

function flattenNode (flattened, node, method) {
  if (node.handlerStorage.handlers.length !== 0) {
    flattened.nodes.push({ method, node })
  }

  if (node.parametricChildren && node.parametricChildren[0]) {
    if (!flattened.children[':']) {
      flattened.children[':'] = {
        prefix: ':',
        nodes: [],
        children: {}
      }
    }
    flattenNode(flattened.children[':'], node.parametricChildren[0], method)
  }

  if (node.wildcardChild) {
    if (!flattened.children['*']) {
      flattened.children['*'] = {
        prefix: '*',
        nodes: [],
        children: {}
      }
    }
    flattenNode(flattened.children['*'], node.wildcardChild, method)
  }

  if (node.staticChildren) {
    for (const child of Object.values(node.staticChildren)) {
      // split on the slash separator but use a regex to lookahead and not actually match it, preserving it in the returned string segments
      const childPrefixSegments = child.prefix.split(pathRegExp)
      let cursor = flattened
      let parent
      for (const segment of childPrefixSegments) {
        parent = cursor
        cursor = cursor.children[segment]
        if (!cursor) {
          cursor = {
            prefix: segment,
            nodes: [],
            children: {}
          }
          parent.children[segment] = cursor
        }
      }
      flattenNode(cursor, child, method)
    }
  }
}

function compressFlattenedNode (flattenedNode) {
  const childKeys = Object.keys(flattenedNode.children)
  if (flattenedNode.nodes.length === 0 && childKeys.length === 1) {
    const child = flattenedNode.children[childKeys[0]]
    if (child.nodes.length <= 1) {
      compressFlattenedNode(child)
      flattenedNode.nodes = child.nodes
      flattenedNode.prefix += child.prefix
      flattenedNode.children = child.children
      return flattenedNode
    }
  }

  for (const key of Object.keys(flattenedNode.children)) {
    compressFlattenedNode(flattenedNode.children[key])
  }

  return flattenedNode
}

module.exports = { flattenNode, compressFlattenedNode, prettyPrintFlattenedNode, prettyPrintRoutesArray }


/***/ }),
/* 139 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const HandlerStorage = __webpack_require__(140)

const NODE_TYPES = {
  STATIC: 0,
  PARAMETRIC: 1,
  WILDCARD: 2
}

class Node {
  constructor () {
    this.handlerStorage = new HandlerStorage()
  }
}

class ParentNode extends Node {
  constructor () {
    super()
    this.staticChildren = {}
  }

  findStaticMatchingChild (path, pathIndex) {
    const staticChild = this.staticChildren[path.charAt(pathIndex)]
    if (staticChild === undefined || !staticChild.matchPrefix(path, pathIndex)) {
      return null
    }
    return staticChild
  }

  createStaticChild (path) {
    if (path.length === 0) {
      return this
    }

    let staticChild = this.staticChildren[path.charAt(0)]
    if (staticChild) {
      let i = 1
      for (; i < staticChild.prefix.length; i++) {
        if (path.charCodeAt(i) !== staticChild.prefix.charCodeAt(i)) {
          staticChild = staticChild.split(this, i)
          break
        }
      }
      return staticChild.createStaticChild(path.slice(i))
    }

    const label = path.charAt(0)
    this.staticChildren[label] = new StaticNode(path)
    return this.staticChildren[label]
  }
}

class StaticNode extends ParentNode {
  constructor (prefix) {
    super()
    this.prefix = prefix
    this.wildcardChild = null
    this.parametricChildren = []
    this.kind = NODE_TYPES.STATIC
    this._compilePrefixMatch()
  }

  createParametricChild (regex) {
    const regexpSource = regex && regex.source

    let parametricChild = this.parametricChildren.find(child => {
      const childRegexSource = child.regex && child.regex.source
      return childRegexSource === regexpSource
    })

    if (parametricChild) {
      return parametricChild
    }

    parametricChild = new ParametricNode(regex)
    if (regex) {
      this.parametricChildren.unshift(parametricChild)
    } else {
      this.parametricChildren.push(parametricChild)
    }
    return parametricChild
  }

  createWildcardChild () {
    if (this.wildcardChild) {
      return this.wildcardChild
    }

    this.wildcardChild = new WildcardNode()
    return this.wildcardChild
  }

  split (parentNode, length) {
    const parentPrefix = this.prefix.slice(0, length)
    const childPrefix = this.prefix.slice(length)

    this.prefix = childPrefix
    this._compilePrefixMatch()

    const staticNode = new StaticNode(parentPrefix)
    staticNode.staticChildren[childPrefix.charAt(0)] = this
    parentNode.staticChildren[parentPrefix.charAt(0)] = staticNode

    return staticNode
  }

  getNextNode (path, pathIndex, nodeStack, paramsCount) {
    let node = this.findStaticMatchingChild(path, pathIndex)
    let parametricBrotherNodeIndex = 0

    if (node === null) {
      if (this.parametricChildren.length === 0) {
        return this.wildcardChild
      }

      node = this.parametricChildren[0]
      parametricBrotherNodeIndex = 1
    }

    if (this.wildcardChild !== null) {
      nodeStack.push({
        paramsCount,
        brotherPathIndex: pathIndex,
        brotherNode: this.wildcardChild
      })
    }

    for (let i = this.parametricChildren.length - 1; i >= parametricBrotherNodeIndex; i--) {
      nodeStack.push({
        paramsCount,
        brotherPathIndex: pathIndex,
        brotherNode: this.parametricChildren[i]
      })
    }

    return node
  }

  _compilePrefixMatch () {
    if (this.prefix.length === 1) {
      this.matchPrefix = () => true
      return
    }

    const lines = []
    for (let i = 1; i < this.prefix.length; i++) {
      const charCode = this.prefix.charCodeAt(i)
      lines.push(`path.charCodeAt(i + ${i}) === ${charCode}`)
    }
    this.matchPrefix = new Function('path', 'i', `return ${lines.join(' && ')}`) // eslint-disable-line
  }
}

class ParametricNode extends ParentNode {
  constructor (regex) {
    super()
    this.regex = regex || null
    this.isRegex = !!regex
    this.kind = NODE_TYPES.PARAMETRIC
  }

  getNextNode (path, pathIndex) {
    return this.findStaticMatchingChild(path, pathIndex)
  }
}

class WildcardNode extends Node {
  constructor () {
    super()
    this.kind = NODE_TYPES.WILDCARD
  }

  getNextNode () {
    return null
  }
}

module.exports = { StaticNode, ParametricNode, WildcardNode, NODE_TYPES }


/***/ }),
/* 140 */
/***/ ((module) => {

"use strict";


class HandlerStorage {
  constructor () {
    this.unconstrainedHandler = null // optimized reference to the handler that will match most of the time
    this.constraints = []
    this.handlers = [] // unoptimized list of handler objects for which the fast matcher function will be compiled
    this.constrainedHandlerStores = null
  }

  // This is the hot path for node handler finding -- change with care!
  getMatchingHandler (derivedConstraints) {
    if (derivedConstraints === undefined) {
      return this.unconstrainedHandler
    }
    return this._getHandlerMatchingConstraints(derivedConstraints)
  }

  addHandler (handler, params, store, constrainer, constraints) {
    const handlerObject = {
      handler,
      params,
      constraints,
      store: store || null,
      _createParamsObject: this._compileCreateParamsObject(params)
    }

    if (Object.keys(constraints).length === 0) {
      this.unconstrainedHandler = handlerObject
    }

    for (const constraint of Object.keys(constraints)) {
      if (!this.constraints.includes(constraint)) {
        if (constraint === 'version') {
          // always check the version constraint first as it is the most selective
          this.constraints.unshift(constraint)
        } else {
          this.constraints.push(constraint)
        }
      }
    }

    if (this.handlers.length >= 32) {
      throw new Error('find-my-way supports a maximum of 32 route handlers per node when there are constraints, limit reached')
    }

    this.handlers.push(handlerObject)
    // Sort the most constrained handlers to the front of the list of handlers so they are tested first.
    this.handlers.sort((a, b) => Object.keys(a.constraints).length - Object.keys(b.constraints).length)

    this._compileGetHandlerMatchingConstraints(constrainer, constraints)
  }

  _compileCreateParamsObject (params) {
    const lines = []
    for (let i = 0; i < params.length; i++) {
      lines.push(`'${params[i]}': paramsArray[${i}]`)
    }
    return new Function('paramsArray', `return {${lines.join(',')}}`)  // eslint-disable-line
  }

  _getHandlerMatchingConstraints () {
    return null
  }

  // Builds a store object that maps from constraint values to a bitmap of handler indexes which pass the constraint for a value
  // So for a host constraint, this might look like { "fastify.io": 0b0010, "google.ca": 0b0101 }, meaning the 3rd handler is constrainted to fastify.io, and the 2nd and 4th handlers are constrained to google.ca.
  // The store's implementation comes from the strategies provided to the Router.
  _buildConstraintStore (store, constraint) {
    for (let i = 0; i < this.handlers.length; i++) {
      const handler = this.handlers[i]
      const constraintValue = handler.constraints[constraint]
      if (constraintValue !== undefined) {
        let indexes = store.get(constraintValue) || 0
        indexes |= 1 << i // set the i-th bit for the mask because this handler is constrained by this value https://stackoverflow.com/questions/1436438/how-do-you-set-clear-and-toggle-a-single-bit-in-javascrip
        store.set(constraintValue, indexes)
      }
    }
  }

  // Builds a bitmask for a given constraint that has a bit for each handler index that is 0 when that handler *is* constrained and 1 when the handler *isnt* constrainted. This is opposite to what might be obvious, but is just for convienience when doing the bitwise operations.
  _constrainedIndexBitmask (constraint) {
    let mask = 0
    for (let i = 0; i < this.handlers.length; i++) {
      const handler = this.handlers[i]
      const constraintValue = handler.constraints[constraint]
      if (constraintValue !== undefined) {
        mask |= 1 << i
      }
    }
    return ~mask
  }

  // Compile a fast function to match the handlers for this node
  // The function implements a general case multi-constraint matching algorithm.
  // The general idea is this: we have a bunch of handlers, each with a potentially different set of constraints, and sometimes none at all. We're given a list of constraint values and we have to use the constraint-value-comparison strategies to see which handlers match the constraint values passed in.
  // We do this by asking each constraint store which handler indexes match the given constraint value for each store. Trickily, the handlers that a store says match are the handlers constrained by that store, but handlers that aren't constrained at all by that store could still match just fine. So, each constraint store can only describe matches for it, and it won't have any bearing on the handlers it doesn't care about. For this reason, we have to ask each stores which handlers match and track which have been matched (or not cared about) by all of them.
  // We use bitmaps to represent these lists of matches so we can use bitwise operations to implement this efficiently. Bitmaps are cheap to allocate, let us implement this masking behaviour in one CPU instruction, and are quite compact in memory. We start with a bitmap set to all 1s representing every handler that is a match candidate, and then for each constraint, see which handlers match using the store, and then mask the result by the mask of handlers that that store applies to, and bitwise AND with the candidate list. Phew.
  // We consider all this compiling function complexity to be worth it, because the naive implementation that just loops over the handlers asking which stores match is quite a bit slower.
  _compileGetHandlerMatchingConstraints (constrainer) {
    this.constrainedHandlerStores = {}

    for (const constraint of this.constraints) {
      const store = constrainer.newStoreForConstraint(constraint)
      this.constrainedHandlerStores[constraint] = store

      this._buildConstraintStore(store, constraint)
    }

    const lines = []
    lines.push(`
    let candidates = ${(1 << this.handlers.length) - 1}
    let mask, matches
    `)
    for (const constraint of this.constraints) {
      // Setup the mask for indexes this constraint applies to. The mask bits are set to 1 for each position if the constraint applies.
      lines.push(`
      mask = ${this._constrainedIndexBitmask(constraint)}
      value = derivedConstraints.${constraint}
      `)

      // If there's no constraint value, none of the handlers constrained by this constraint can match. Remove them from the candidates.
      // If there is a constraint value, get the matching indexes bitmap from the store, and mask it down to only the indexes this constraint applies to, and then bitwise and with the candidates list to leave only matching candidates left.
      const strategy = constrainer.strategies[constraint]
      const matchMask = strategy.mustMatchWhenDerived ? 'matches' : '(matches | mask)'

      lines.push(`
      if (value === undefined) {
        candidates &= mask
      } else {
        matches = this.constrainedHandlerStores.${constraint}.get(value) || 0
        candidates &= ${matchMask}
      }
      if (candidates === 0) return null;
      `)
    }

    // There are some constraints that can be derived and marked as "must match", where if they are derived, they only match routes that actually have a constraint on the value, like the SemVer version constraint.
    // An example: a request comes in for version 1.x, and this node has a handler that matches the path, but there's no version constraint. For SemVer, the find-my-way semantics do not match this handler to that request.
    // This function is used by Nodes with handlers to match when they don't have any constrained routes to exclude request that do have must match derived constraints present.
    for (const constraint in constrainer.strategies) {
      const strategy = constrainer.strategies[constraint]
      if (strategy.mustMatchWhenDerived && !this.constraints.includes(constraint)) {
        lines.push(`if (derivedConstraints.${constraint} !== undefined) return null`)
      }
    }

    // Return the first handler who's bit is set in the candidates https://stackoverflow.com/questions/18134985/how-to-find-index-of-first-set-bit
    lines.push('return this.handlers[Math.floor(Math.log2(candidates))]')

    this._getHandlerMatchingConstraints = new Function('derivedConstraints', lines.join('\n')) // eslint-disable-line
  }
}

module.exports = HandlerStorage


/***/ }),
/* 141 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const acceptVersionStrategy = __webpack_require__(142)
const acceptHostStrategy = __webpack_require__(143)
const assert = __webpack_require__(82)

class Constrainer {
  constructor (customStrategies) {
    this.strategies = {
      version: acceptVersionStrategy,
      host: acceptHostStrategy
    }

    this.strategiesInUse = new Set()

    // validate and optimize prototypes of given custom strategies
    if (customStrategies) {
      for (const strategy of Object.values(customStrategies)) {
        this.addConstraintStrategy(strategy)
      }
    }
  }

  hasConstraintStrategy (strategyName) {
    const customConstraintStrategy = this.strategies[strategyName]
    if (customConstraintStrategy !== undefined) {
      return customConstraintStrategy.isCustom || this.strategiesInUse.has(strategyName)
    }
    return false
  }

  addConstraintStrategy (strategy) {
    assert(typeof strategy.name === 'string' && strategy.name !== '', 'strategy.name is required.')
    assert(strategy.storage && typeof strategy.storage === 'function', 'strategy.storage function is required.')
    assert(strategy.deriveConstraint && typeof strategy.deriveConstraint === 'function', 'strategy.deriveConstraint function is required.')

    if (this.strategies[strategy.name] && this.strategies[strategy.name].isCustom) {
      throw new Error(`There already exists a custom constraint with the name ${strategy.name}.`)
    }

    if (this.strategiesInUse.has(strategy.name)) {
      throw new Error(`There already exists a route with ${strategy.name} constraint.`)
    }

    strategy.isCustom = true
    this.strategies[strategy.name] = strategy

    if (strategy.mustMatchWhenDerived) {
      this.noteUsage({ [strategy.name]: strategy })
    }
  }

  deriveConstraints (req, ctx) {
    return undefined
  }

  // When new constraints start getting used, we need to rebuild the deriver to derive them. Do so if we see novel constraints used.
  noteUsage (constraints) {
    if (constraints) {
      const beforeSize = this.strategiesInUse.size
      for (const key in constraints) {
        this.strategiesInUse.add(key)
      }
      if (beforeSize !== this.strategiesInUse.size) {
        this._buildDeriveConstraints()
      }
    }
  }

  newStoreForConstraint (constraint) {
    if (!this.strategies[constraint]) {
      throw new Error(`No strategy registered for constraint key ${constraint}`)
    }
    return this.strategies[constraint].storage()
  }

  validateConstraints (constraints) {
    for (const key in constraints) {
      const value = constraints[key]
      if (typeof value === 'undefined') {
        throw new Error('Can\'t pass an undefined constraint value, must pass null or no key at all')
      }
      const strategy = this.strategies[key]
      if (!strategy) {
        throw new Error(`No strategy registered for constraint key ${key}`)
      }
      if (strategy.validate) {
        strategy.validate(value)
      }
    }
  }

  // Optimization: build a fast function for deriving the constraints for all the strategies at once. We inline the definitions of the version constraint and the host constraint for performance.
  // If no constraining strategies are in use (no routes constrain on host, or version, or any custom strategies) then we don't need to derive constraints for each route match, so don't do anything special, and just return undefined
  // This allows us to not allocate an object to hold constraint values if no constraints are defined.
  _buildDeriveConstraints () {
    if (this.strategiesInUse.size === 0) return

    const lines = ['return {']

    for (const key of this.strategiesInUse) {
      const strategy = this.strategies[key]
      // Optimization: inline the derivation for the common built in constraints
      if (!strategy.isCustom) {
        if (key === 'version') {
          lines.push('   version: req.headers[\'accept-version\'],')
        } else if (key === 'host') {
          lines.push('   host: req.headers.host || req.headers[\':authority\'],')
        } else {
          throw new Error('unknown non-custom strategy for compiling constraint derivation function')
        }
      } else {
        lines.push(`  ${strategy.name}: this.strategies.${key}.deriveConstraint(req, ctx),`)
      }
    }

    lines.push('}')

    this.deriveConstraints = new Function('req', 'ctx', lines.join('\n')).bind(this) // eslint-disable-line
  }
}

module.exports = Constrainer


/***/ }),
/* 142 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const assert = __webpack_require__(82)

function SemVerStore () {
  if (!(this instanceof SemVerStore)) {
    return new SemVerStore()
  }

  this.store = {}

  this.maxMajor = 0
  this.maxMinors = {}
  this.maxPatches = {}
}

SemVerStore.prototype.set = function (version, store) {
  if (typeof version !== 'string') {
    throw new TypeError('Version should be a string')
  }
  let [major, minor, patch] = version.split('.')

  major = Number(major) || 0
  minor = Number(minor) || 0
  patch = Number(patch) || 0

  if (major >= this.maxMajor) {
    this.maxMajor = major
    this.store.x = store
    this.store['*'] = store
    this.store['x.x'] = store
    this.store['x.x.x'] = store
  }

  if (minor >= (this.maxMinors[major] || 0)) {
    this.maxMinors[major] = minor
    this.store[`${major}.x`] = store
    this.store[`${major}.x.x`] = store
  }

  if (patch >= (this.store[`${major}.${minor}`] || 0)) {
    this.maxPatches[`${major}.${minor}`] = patch
    this.store[`${major}.${minor}.x`] = store
  }

  this.store[`${major}.${minor}.${patch}`] = store
  return this
}

SemVerStore.prototype.get = function (version) {
  return this.store[version]
}

module.exports = {
  name: 'version',
  mustMatchWhenDerived: true,
  storage: SemVerStore,
  validate (value) {
    assert(typeof value === 'string', 'Version should be a string')
  }
}


/***/ }),
/* 143 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const assert = __webpack_require__(82)

function HostStorage () {
  const hosts = {}
  const regexHosts = []
  return {
    get: (host) => {
      const exact = hosts[host]
      if (exact) {
        return exact
      }
      for (const regex of regexHosts) {
        if (regex.host.test(host)) {
          return regex.value
        }
      }
    },
    set: (host, value) => {
      if (host instanceof RegExp) {
        regexHosts.push({ host, value })
      } else {
        hosts[host] = value
      }
    }
  }
}

module.exports = {
  name: 'host',
  mustMatchWhenDerived: false,
  storage: HostStorage,
  validate (value) {
    assert(typeof value === 'string' || Object.prototype.toString.call(value) === '[object RegExp]', 'Host should be a string or a RegExp')
  }
}


/***/ }),
/* 144 */
/***/ ((module) => {

"use strict";


// It must spot all the chars where decodeURIComponent(x) !== decodeURI(x)
// The chars are: # $ & + , / : ; = ? @
function decodeComponentChar (highCharCode, lowCharCode) {
  if (highCharCode === 50) {
    if (lowCharCode === 53) return '%'

    if (lowCharCode === 51) return '#'
    if (lowCharCode === 52) return '$'
    if (lowCharCode === 54) return '&'
    if (lowCharCode === 66) return '+'
    if (lowCharCode === 98) return '+'
    if (lowCharCode === 67) return ','
    if (lowCharCode === 99) return ','
    if (lowCharCode === 70) return '/'
    if (lowCharCode === 102) return '/'
    return null
  }
  if (highCharCode === 51) {
    if (lowCharCode === 65) return ':'
    if (lowCharCode === 97) return ':'
    if (lowCharCode === 66) return ';'
    if (lowCharCode === 98) return ';'
    if (lowCharCode === 68) return '='
    if (lowCharCode === 100) return '='
    if (lowCharCode === 70) return '?'
    if (lowCharCode === 102) return '?'
    return null
  }
  if (highCharCode === 52 && lowCharCode === 48) {
    return '@'
  }
  return null
}

function safeDecodeURI (path) {
  let shouldDecode = false
  let shouldDecodeParam = false

  let querystring = ''

  for (let i = 1; i < path.length; i++) {
    const charCode = path.charCodeAt(i)

    if (charCode === 37) {
      const highCharCode = path.charCodeAt(i + 1)
      const lowCharCode = path.charCodeAt(i + 2)

      if (decodeComponentChar(highCharCode, lowCharCode) === null) {
        shouldDecode = true
      } else {
        shouldDecodeParam = true
        // %25 - encoded % char. We need to encode one more time to prevent double decoding
        if (highCharCode === 50 && lowCharCode === 53) {
          shouldDecode = true
          path = path.slice(0, i + 1) + '25' + path.slice(i + 1)
          i += 2
        }
        i += 2
      }
    // Some systems do not follow RFC and separate the path and query
    // string with a `;` character (code 59), e.g. `/foo;jsessionid=123456`.
    // Thus, we need to split on `;` as well as `?` and `#`.
    } else if (charCode === 63 || charCode === 59 || charCode === 35) {
      querystring = path.slice(i + 1)
      path = path.slice(0, i)
      break
    }
  }
  const decodedPath = shouldDecode ? decodeURI(path) : path
  return { path: decodedPath, querystring, shouldDecodeParam }
}

function safeDecodeURIComponent (uriComponent) {
  const startIndex = uriComponent.indexOf('%')
  if (startIndex === -1) return uriComponent

  let decoded = ''
  let lastIndex = startIndex

  for (let i = startIndex; i < uriComponent.length; i++) {
    if (uriComponent.charCodeAt(i) === 37) {
      const highCharCode = uriComponent.charCodeAt(i + 1)
      const lowCharCode = uriComponent.charCodeAt(i + 2)

      const decodedChar = decodeComponentChar(highCharCode, lowCharCode)
      decoded += uriComponent.slice(lastIndex, i) + decodedChar

      lastIndex = i + 3
    }
  }
  return uriComponent.slice(0, startIndex) + decoded + uriComponent.slice(lastIndex)
}

module.exports = { safeDecodeURI, safeDecodeURIComponent }


/***/ }),
/* 145 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const {
  kFourOhFourContext,
  kReplySerializerDefault,
  kSchemaErrorFormatter,
  kErrorHandler,
  kReply,
  kRequest,
  kBodyLimit,
  kLogLevel,
  kContentTypeParser,
  kRouteByFastify,
  kRequestValidateWeakMap,
  kReplySerializeWeakMap
} = __webpack_require__(28)

// Objects that holds the context of every request
// Every route holds an instance of this object.
function Context ({
  schema,
  handler,
  config,
  errorHandler,
  bodyLimit,
  logLevel,
  logSerializers,
  attachValidation,
  validatorCompiler,
  serializerCompiler,
  replySerializer,
  schemaErrorFormatter,
  server,
  isFastify
}) {
  this.schema = schema
  this.handler = handler
  this.Reply = server[kReply]
  this.Request = server[kRequest]
  this.contentTypeParser = server[kContentTypeParser]
  this.onRequest = null
  this.onSend = null
  this.onError = null
  this.onTimeout = null
  this.preHandler = null
  this.onResponse = null
  this.preSerialization = null
  this.config = config
  this.errorHandler = errorHandler || server[kErrorHandler]
  this._middie = null
  this._parserOptions = {
    limit: bodyLimit || server[kBodyLimit]
  }
  this.logLevel = logLevel || server[kLogLevel]
  this.logSerializers = logSerializers
  this[kFourOhFourContext] = null
  this.attachValidation = attachValidation
  this[kReplySerializerDefault] = replySerializer
  this.schemaErrorFormatter = schemaErrorFormatter || server[kSchemaErrorFormatter] || defaultSchemaErrorFormatter
  this[kRouteByFastify] = isFastify

  this[kRequestValidateWeakMap] = null
  this[kReplySerializeWeakMap] = null
  this.validatorCompiler = validatorCompiler || null
  this.serializerCompiler = serializerCompiler || null

  this.server = server
}

function defaultSchemaErrorFormatter (errors, dataVar) {
  let text = ''
  const separator = ', '

  // eslint-disable-next-line no-var
  for (var i = 0; i !== errors.length; ++i) {
    const e = errors[i]
    text += dataVar + (e.instancePath || '') + ' ' + e.message + separator
  }
  return new Error(text.slice(0, -separator.length))
}

module.exports = Context


/***/ }),
/* 146 */
/***/ ((module) => {

"use strict";

function headRouteOnSendHandler (req, reply, payload, done) {
  // If payload is undefined
  if (payload === undefined) {
    reply.header('content-length', '0')
    return done(null, null)
  }

  if (typeof payload.resume === 'function') {
    payload.on('error', (err) => {
      reply.log.error({ err }, 'Error on Stream found for HEAD route')
    })
    payload.resume()
    return done(null, null)
  }

  const size = '' + Buffer.byteLength(payload)

  reply.header('content-length', size)

  done(null, null)
}

function parseHeadOnSendHandlers (onSendHandlers) {
  if (onSendHandlers == null) return headRouteOnSendHandler
  return Array.isArray(onSendHandlers) ? [...onSendHandlers, headRouteOnSendHandler] : [onSendHandlers, headRouteOnSendHandler]
}

module.exports = {
  parseHeadOnSendHandlers
}


/***/ }),
/* 147 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const FindMyWay = __webpack_require__(126)

const Reply = __webpack_require__(37)
const Request = __webpack_require__(90)
const Context = __webpack_require__(145)
const {
  kRoutePrefix,
  kCanSetNotFoundHandler,
  kFourOhFourLevelInstance,
  kFourOhFourContext,
  kHooks,
  kErrorHandler
} = __webpack_require__(28)
const { lifecycleHooks } = __webpack_require__(39)
const { buildErrorHandler } = __webpack_require__(86)
const fourOhFourContext = {
  config: {
  },
  onSend: [],
  onError: [],
  errorHandler: buildErrorHandler()
}

/**
 * Each fastify instance have a:
 * kFourOhFourLevelInstance: point to a fastify instance that has the 404 handler setted
 * kCanSetNotFoundHandler: bool to track if the 404 handler has already been set
 * kFourOhFour: the singleton instance of this 404 module
 * kFourOhFourContext: the context in the reply object where the handler will be executed
 */
function fourOhFour (options) {
  const { logger, genReqId } = options

  // 404 router, used for handling encapsulated 404 handlers
  const router = FindMyWay({ onBadUrl: createOnBadUrl(), defaultRoute: fourOhFourFallBack })
  let _onBadUrlHandler = null

  return { router, setNotFoundHandler, setContext, arrange404 }

  function arrange404 (instance) {
    // Change the pointer of the fastify instance to itself, so register + prefix can add new 404 handler
    instance[kFourOhFourLevelInstance] = instance
    instance[kCanSetNotFoundHandler] = true
    // we need to bind instance for the context
    router.onBadUrl = router.onBadUrl.bind(instance)
  }

  function basic404 (request, reply) {
    const { url, method } = request.raw
    const message = `Route ${method}:${url} not found`
    request.log.info(message)
    reply.code(404).send({
      message,
      error: 'Not Found',
      statusCode: 404
    })
  }

  function createOnBadUrl () {
    return function onBadUrl (path, req, res) {
      const id = genReqId(req)
      const childLogger = logger.child({ reqId: id })
      const fourOhFourContext = this[kFourOhFourLevelInstance][kFourOhFourContext]
      const request = new Request(id, null, req, null, childLogger, fourOhFourContext)
      const reply = new Reply(res, request, childLogger)

      _onBadUrlHandler(request, reply)
    }
  }

  function setContext (instance, context) {
    const _404Context = Object.assign({}, instance[kFourOhFourContext])
    _404Context.onSend = context.onSend
    context[kFourOhFourContext] = _404Context
  }

  function setNotFoundHandler (opts, handler, avvio, routeHandler) {
    // First initialization of the fastify root instance
    if (this[kCanSetNotFoundHandler] === undefined) {
      this[kCanSetNotFoundHandler] = true
    }
    if (this[kFourOhFourContext] === undefined) {
      this[kFourOhFourContext] = null
    }

    const _fastify = this
    const prefix = this[kRoutePrefix] || '/'

    if (this[kCanSetNotFoundHandler] === false) {
      throw new Error(`Not found handler already set for Fastify instance with prefix: '${prefix}'`)
    }

    if (typeof opts === 'object') {
      if (opts.preHandler) {
        if (Array.isArray(opts.preHandler)) {
          opts.preHandler = opts.preHandler.map(hook => hook.bind(_fastify))
        } else {
          opts.preHandler = opts.preHandler.bind(_fastify)
        }
      }

      if (opts.preValidation) {
        if (Array.isArray(opts.preValidation)) {
          opts.preValidation = opts.preValidation.map(hook => hook.bind(_fastify))
        } else {
          opts.preValidation = opts.preValidation.bind(_fastify)
        }
      }
    }

    if (typeof opts === 'function') {
      handler = opts
      opts = undefined
    }
    opts = opts || {}

    if (handler) {
      this[kFourOhFourLevelInstance][kCanSetNotFoundHandler] = false
      handler = handler.bind(this)
      // update onBadUrl handler
      _onBadUrlHandler = handler
    } else {
      handler = basic404
      // update onBadUrl handler
      _onBadUrlHandler = basic404
    }

    this.after((notHandledErr, done) => {
      _setNotFoundHandler.call(this, prefix, opts, handler, avvio, routeHandler)
      done(notHandledErr)
    })
  }

  function _setNotFoundHandler (prefix, opts, handler, avvio, routeHandler) {
    const context = new Context({
      schema: opts.schema,
      handler,
      config: opts.config || {},
      server: this
    })

    avvio.once('preReady', () => {
      const context = this[kFourOhFourContext]
      for (const hook of lifecycleHooks) {
        const toSet = this[kHooks][hook]
          .concat(opts[hook] || [])
          .map(h => h.bind(this))
        context[hook] = toSet.length ? toSet : null
      }
      context.errorHandler = opts.errorHandler ? buildErrorHandler(this[kErrorHandler], opts.errorHandler) : this[kErrorHandler]
    })

    if (this[kFourOhFourContext] !== null && prefix === '/') {
      Object.assign(this[kFourOhFourContext], context) // Replace the default 404 handler
      return
    }

    this[kFourOhFourLevelInstance][kFourOhFourContext] = context

    router.all(prefix + (prefix.endsWith('/') ? '*' : '/*'), routeHandler, context)
    router.all(prefix, routeHandler, context)
  }

  function fourOhFourFallBack (req, res) {
    // if this happen, we have a very bad bug
    // we might want to do some hard debugging
    // here, let's print out as much info as
    // we can
    const id = genReqId(req)
    const childLogger = logger.child({ reqId: id })

    childLogger.info({ req }, 'incoming request')

    const request = new Request(id, null, req, null, childLogger, fourOhFourContext)
    const reply = new Reply(res, request, childLogger)

    request.log.warn('the default handler for 404 did not catch this, this is likely a fastify bug, please report it')
    request.log.warn(router.prettyPrint())
    reply.code(404).send(new Error('Not Found'))
  }
}

module.exports = fourOhFour


/***/ }),
/* 148 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const validate = __webpack_require__(149)
const deepClone = __webpack_require__(88)({ circles: true, proto: false })
const { FST_ERR_INIT_OPTS_INVALID } = __webpack_require__(34)

function validateInitialConfig (options) {
  const opts = deepClone(options)

  if (!validate(opts)) {
    const error = new FST_ERR_INIT_OPTS_INVALID(JSON.stringify(validate.errors.map(e => e.message)))
    error.errors = validate.errors
    throw error
  }

  return deepFreezeObject(opts)
}

function deepFreezeObject (object) {
  const properties = Object.getOwnPropertyNames(object)

  for (const name of properties) {
    const value = object[name]

    if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
      continue
    }

    object[name] = value && typeof value === 'object' ? deepFreezeObject(value) : value
  }

  return Object.freeze(object)
}

module.exports = validateInitialConfig
module.exports.defaultInitOptions = validate.defaultInitOptions
module.exports.utils = { deepFreezeObject }


/***/ }),
/* 149 */
/***/ ((module) => {

"use strict";
// This file is autogenerated by build/build-validation.js, do not edit
/* istanbul ignore file */

module.exports = validate10;
module.exports["default"] = validate10;
const schema11 = {"type":"object","additionalProperties":false,"properties":{"connectionTimeout":{"type":"integer","default":0},"keepAliveTimeout":{"type":"integer","default":72000},"forceCloseConnections":{"oneOf":[{"type":"string","pattern":"idle"},{"type":"boolean"}]},"maxRequestsPerSocket":{"type":"integer","default":0,"nullable":true},"requestTimeout":{"type":"integer","default":0},"bodyLimit":{"type":"integer","default":1048576},"caseSensitive":{"type":"boolean","default":true},"allowUnsafeRegex":{"type":"boolean","default":false},"http2":{"type":"boolean"},"https":{"if":{"not":{"oneOf":[{"type":"boolean"},{"type":"null"},{"type":"object","additionalProperties":false,"required":["allowHTTP1"],"properties":{"allowHTTP1":{"type":"boolean"}}}]}},"then":{"setDefaultValue":true}},"ignoreTrailingSlash":{"type":"boolean","default":false},"ignoreDuplicateSlashes":{"type":"boolean","default":false},"disableRequestLogging":{"type":"boolean","default":false},"jsonShorthand":{"type":"boolean","default":true},"maxParamLength":{"type":"integer","default":100},"onProtoPoisoning":{"type":"string","default":"error"},"onConstructorPoisoning":{"type":"string","default":"error"},"pluginTimeout":{"type":"integer","default":10000},"requestIdHeader":{"anyOf":[{"enum":[false]},{"type":"string"}],"default":"request-id"},"requestIdLogLabel":{"type":"string","default":"reqId"},"http2SessionTimeout":{"type":"integer","default":72000},"exposeHeadRoutes":{"type":"boolean","default":true},"versioning":{"type":"object","additionalProperties":true,"required":["storage","deriveVersion"],"properties":{"storage":{},"deriveVersion":{}}},"constraints":{"type":"object","additionalProperties":{"type":"object","required":["name","storage","validate","deriveConstraint"],"additionalProperties":true,"properties":{"name":{"type":"string"},"storage":{},"validate":{},"deriveConstraint":{}}}}}};
const func2 = Object.prototype.hasOwnProperty;
const pattern0 = new RegExp("idle", "u");

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.connectionTimeout === undefined){
data.connectionTimeout = 0;
}
if(data.keepAliveTimeout === undefined){
data.keepAliveTimeout = 72000;
}
if(data.maxRequestsPerSocket === undefined){
data.maxRequestsPerSocket = 0;
}
if(data.requestTimeout === undefined){
data.requestTimeout = 0;
}
if(data.bodyLimit === undefined){
data.bodyLimit = 1048576;
}
if(data.caseSensitive === undefined){
data.caseSensitive = true;
}
if(data.allowUnsafeRegex === undefined){
data.allowUnsafeRegex = false;
}
if(data.ignoreTrailingSlash === undefined){
data.ignoreTrailingSlash = false;
}
if(data.ignoreDuplicateSlashes === undefined){
data.ignoreDuplicateSlashes = false;
}
if(data.disableRequestLogging === undefined){
data.disableRequestLogging = false;
}
if(data.jsonShorthand === undefined){
data.jsonShorthand = true;
}
if(data.maxParamLength === undefined){
data.maxParamLength = 100;
}
if(data.onProtoPoisoning === undefined){
data.onProtoPoisoning = "error";
}
if(data.onConstructorPoisoning === undefined){
data.onConstructorPoisoning = "error";
}
if(data.pluginTimeout === undefined){
data.pluginTimeout = 10000;
}
if(data.requestIdHeader === undefined){
data.requestIdHeader = "request-id";
}
if(data.requestIdLogLabel === undefined){
data.requestIdLogLabel = "reqId";
}
if(data.http2SessionTimeout === undefined){
data.http2SessionTimeout = 72000;
}
if(data.exposeHeadRoutes === undefined){
data.exposeHeadRoutes = true;
}
const _errs1 = errors;
for(const key0 in data){
if(!(func2.call(schema11.properties, key0))){
delete data[key0];
}
}
if(_errs1 === errors){
let data0 = data.connectionTimeout;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
let dataType0 = typeof data0;
let coerced0 = undefined;
if(!(coerced0 !== undefined)){
if(dataType0 === "boolean" || data0 === null
              || (dataType0 === "string" && data0 && data0 == +data0 && !(data0 % 1))){
coerced0 = +data0;
}
else {
validate10.errors = [{instancePath:instancePath+"/connectionTimeout",schemaPath:"#/properties/connectionTimeout/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["connectionTimeout"] = coerced0;
}
}
}
var valid0 = _errs2 === errors;
if(valid0){
let data1 = data.keepAliveTimeout;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(!(coerced1 !== undefined)){
if(dataType1 === "boolean" || data1 === null
              || (dataType1 === "string" && data1 && data1 == +data1 && !(data1 % 1))){
coerced1 = +data1;
}
else {
validate10.errors = [{instancePath:instancePath+"/keepAliveTimeout",schemaPath:"#/properties/keepAliveTimeout/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data !== undefined){
data["keepAliveTimeout"] = coerced1;
}
}
}
var valid0 = _errs4 === errors;
if(valid0){
if(data.forceCloseConnections !== undefined){
let data2 = data.forceCloseConnections;
const _errs6 = errors;
const _errs7 = errors;
let valid1 = false;
let passing0 = null;
const _errs8 = errors;
if(typeof data2 !== "string"){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(!(coerced2 !== undefined)){
if(dataType2 == "number" || dataType2 == "boolean"){
coerced2 = "" + data2;
}
else if(data2 === null){
coerced2 = "";
}
else {
const err0 = {instancePath:instancePath+"/forceCloseConnections",schemaPath:"#/properties/forceCloseConnections/oneOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data !== undefined){
data["forceCloseConnections"] = coerced2;
}
}
}
if(errors === _errs8){
if(typeof data2 === "string"){
if(!pattern0.test(data2)){
const err1 = {instancePath:instancePath+"/forceCloseConnections",schemaPath:"#/properties/forceCloseConnections/oneOf/0/pattern",keyword:"pattern",params:{pattern: "idle"},message:"must match pattern \""+"idle"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs8 === errors;
if(_valid0){
valid1 = true;
passing0 = 0;
}
const _errs10 = errors;
if(typeof data2 !== "boolean"){
let coerced3 = undefined;
if(!(coerced3 !== undefined)){
if(data2 === "false" || data2 === 0 || data2 === null){
coerced3 = false;
}
else if(data2 === "true" || data2 === 1){
coerced3 = true;
}
else {
const err2 = {instancePath:instancePath+"/forceCloseConnections",schemaPath:"#/properties/forceCloseConnections/oneOf/1/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(coerced3 !== undefined){
data2 = coerced3;
if(data !== undefined){
data["forceCloseConnections"] = coerced3;
}
}
}
var _valid0 = _errs10 === errors;
if(_valid0 && valid1){
valid1 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid1 = true;
passing0 = 1;
}
}
if(!valid1){
const err3 = {instancePath:instancePath+"/forceCloseConnections",schemaPath:"#/properties/forceCloseConnections/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
let data3 = data.maxRequestsPerSocket;
const _errs12 = errors;
if((!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))) && (data3 !== null)){
let dataType4 = typeof data3;
let coerced4 = undefined;
if(!(coerced4 !== undefined)){
if(dataType4 === "boolean" || data3 === null
              || (dataType4 === "string" && data3 && data3 == +data3 && !(data3 % 1))){
coerced4 = +data3;
}
else if(data3 === "" || data3 === 0 || data3 === false){
coerced4 = null;
}
else {
validate10.errors = [{instancePath:instancePath+"/maxRequestsPerSocket",schemaPath:"#/properties/maxRequestsPerSocket/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced4 !== undefined){
data3 = coerced4;
if(data !== undefined){
data["maxRequestsPerSocket"] = coerced4;
}
}
}
var valid0 = _errs12 === errors;
if(valid0){
let data4 = data.requestTimeout;
const _errs15 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
let dataType5 = typeof data4;
let coerced5 = undefined;
if(!(coerced5 !== undefined)){
if(dataType5 === "boolean" || data4 === null
              || (dataType5 === "string" && data4 && data4 == +data4 && !(data4 % 1))){
coerced5 = +data4;
}
else {
validate10.errors = [{instancePath:instancePath+"/requestTimeout",schemaPath:"#/properties/requestTimeout/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced5 !== undefined){
data4 = coerced5;
if(data !== undefined){
data["requestTimeout"] = coerced5;
}
}
}
var valid0 = _errs15 === errors;
if(valid0){
let data5 = data.bodyLimit;
const _errs17 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
let dataType6 = typeof data5;
let coerced6 = undefined;
if(!(coerced6 !== undefined)){
if(dataType6 === "boolean" || data5 === null
              || (dataType6 === "string" && data5 && data5 == +data5 && !(data5 % 1))){
coerced6 = +data5;
}
else {
validate10.errors = [{instancePath:instancePath+"/bodyLimit",schemaPath:"#/properties/bodyLimit/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced6 !== undefined){
data5 = coerced6;
if(data !== undefined){
data["bodyLimit"] = coerced6;
}
}
}
var valid0 = _errs17 === errors;
if(valid0){
let data6 = data.caseSensitive;
const _errs19 = errors;
if(typeof data6 !== "boolean"){
let coerced7 = undefined;
if(!(coerced7 !== undefined)){
if(data6 === "false" || data6 === 0 || data6 === null){
coerced7 = false;
}
else if(data6 === "true" || data6 === 1){
coerced7 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/caseSensitive",schemaPath:"#/properties/caseSensitive/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced7 !== undefined){
data6 = coerced7;
if(data !== undefined){
data["caseSensitive"] = coerced7;
}
}
}
var valid0 = _errs19 === errors;
if(valid0){
let data7 = data.allowUnsafeRegex;
const _errs21 = errors;
if(typeof data7 !== "boolean"){
let coerced8 = undefined;
if(!(coerced8 !== undefined)){
if(data7 === "false" || data7 === 0 || data7 === null){
coerced8 = false;
}
else if(data7 === "true" || data7 === 1){
coerced8 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/allowUnsafeRegex",schemaPath:"#/properties/allowUnsafeRegex/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced8 !== undefined){
data7 = coerced8;
if(data !== undefined){
data["allowUnsafeRegex"] = coerced8;
}
}
}
var valid0 = _errs21 === errors;
if(valid0){
if(data.http2 !== undefined){
let data8 = data.http2;
const _errs23 = errors;
if(typeof data8 !== "boolean"){
let coerced9 = undefined;
if(!(coerced9 !== undefined)){
if(data8 === "false" || data8 === 0 || data8 === null){
coerced9 = false;
}
else if(data8 === "true" || data8 === 1){
coerced9 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/http2",schemaPath:"#/properties/http2/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced9 !== undefined){
data8 = coerced9;
if(data !== undefined){
data["http2"] = coerced9;
}
}
}
var valid0 = _errs23 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.https !== undefined){
let data9 = data.https;
const _errs25 = errors;
const _errs26 = errors;
let valid2 = true;
const _errs27 = errors;
const _errs28 = errors;
const _errs29 = errors;
const _errs30 = errors;
let valid4 = false;
let passing1 = null;
const _errs31 = errors;
if(typeof data9 !== "boolean"){
let coerced10 = undefined;
if(!(coerced10 !== undefined)){
if(data9 === "false" || data9 === 0 || data9 === null){
coerced10 = false;
}
else if(data9 === "true" || data9 === 1){
coerced10 = true;
}
else {
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(coerced10 !== undefined){
data9 = coerced10;
if(data !== undefined){
data["https"] = coerced10;
}
}
}
var _valid2 = _errs31 === errors;
if(_valid2){
valid4 = true;
passing1 = 0;
}
const _errs33 = errors;
if(data9 !== null){
let coerced11 = undefined;
if(!(coerced11 !== undefined)){
if(data9 === "" || data9 === 0 || data9 === false){
coerced11 = null;
}
else {
const err5 = {};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced11 !== undefined){
data9 = coerced11;
if(data !== undefined){
data["https"] = coerced11;
}
}
}
var _valid2 = _errs33 === errors;
if(_valid2 && valid4){
valid4 = false;
passing1 = [passing1, 1];
}
else {
if(_valid2){
valid4 = true;
passing1 = 1;
}
const _errs35 = errors;
if(errors === _errs35){
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
let missing0;
if((data9.allowHTTP1 === undefined) && (missing0 = "allowHTTP1")){
const err6 = {};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
const _errs37 = errors;
for(const key1 in data9){
if(!(key1 === "allowHTTP1")){
delete data9[key1];
}
}
if(_errs37 === errors){
if(data9.allowHTTP1 !== undefined){
let data10 = data9.allowHTTP1;
if(typeof data10 !== "boolean"){
let coerced12 = undefined;
if(!(coerced12 !== undefined)){
if(data10 === "false" || data10 === 0 || data10 === null){
coerced12 = false;
}
else if(data10 === "true" || data10 === 1){
coerced12 = true;
}
else {
const err7 = {};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(coerced12 !== undefined){
data10 = coerced12;
if(data9 !== undefined){
data9["allowHTTP1"] = coerced12;
}
}
}
}
}
}
}
else {
const err8 = {};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
var _valid2 = _errs35 === errors;
if(_valid2 && valid4){
valid4 = false;
passing1 = [passing1, 2];
}
else {
if(_valid2){
valid4 = true;
passing1 = 2;
}
}
}
if(!valid4){
const err9 = {};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
else {
errors = _errs30;
if(vErrors !== null){
if(_errs30){
vErrors.length = _errs30;
}
else {
vErrors = null;
}
}
}
var valid3 = _errs29 === errors;
if(valid3){
const err10 = {};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
else {
errors = _errs28;
if(vErrors !== null){
if(_errs28){
vErrors.length = _errs28;
}
else {
vErrors = null;
}
}
}
var _valid1 = _errs27 === errors;
errors = _errs26;
if(vErrors !== null){
if(_errs26){
vErrors.length = _errs26;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs40 = errors;
data["https"] = true;
var _valid1 = _errs40 === errors;
valid2 = _valid1;
}
if(!valid2){
const err11 = {instancePath:instancePath+"/https",schemaPath:"#/properties/https/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
validate10.errors = vErrors;
return false;
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
let data11 = data.ignoreTrailingSlash;
const _errs41 = errors;
if(typeof data11 !== "boolean"){
let coerced13 = undefined;
if(!(coerced13 !== undefined)){
if(data11 === "false" || data11 === 0 || data11 === null){
coerced13 = false;
}
else if(data11 === "true" || data11 === 1){
coerced13 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/ignoreTrailingSlash",schemaPath:"#/properties/ignoreTrailingSlash/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced13 !== undefined){
data11 = coerced13;
if(data !== undefined){
data["ignoreTrailingSlash"] = coerced13;
}
}
}
var valid0 = _errs41 === errors;
if(valid0){
let data12 = data.ignoreDuplicateSlashes;
const _errs43 = errors;
if(typeof data12 !== "boolean"){
let coerced14 = undefined;
if(!(coerced14 !== undefined)){
if(data12 === "false" || data12 === 0 || data12 === null){
coerced14 = false;
}
else if(data12 === "true" || data12 === 1){
coerced14 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/ignoreDuplicateSlashes",schemaPath:"#/properties/ignoreDuplicateSlashes/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced14 !== undefined){
data12 = coerced14;
if(data !== undefined){
data["ignoreDuplicateSlashes"] = coerced14;
}
}
}
var valid0 = _errs43 === errors;
if(valid0){
let data13 = data.disableRequestLogging;
const _errs45 = errors;
if(typeof data13 !== "boolean"){
let coerced15 = undefined;
if(!(coerced15 !== undefined)){
if(data13 === "false" || data13 === 0 || data13 === null){
coerced15 = false;
}
else if(data13 === "true" || data13 === 1){
coerced15 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/disableRequestLogging",schemaPath:"#/properties/disableRequestLogging/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced15 !== undefined){
data13 = coerced15;
if(data !== undefined){
data["disableRequestLogging"] = coerced15;
}
}
}
var valid0 = _errs45 === errors;
if(valid0){
let data14 = data.jsonShorthand;
const _errs47 = errors;
if(typeof data14 !== "boolean"){
let coerced16 = undefined;
if(!(coerced16 !== undefined)){
if(data14 === "false" || data14 === 0 || data14 === null){
coerced16 = false;
}
else if(data14 === "true" || data14 === 1){
coerced16 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/jsonShorthand",schemaPath:"#/properties/jsonShorthand/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced16 !== undefined){
data14 = coerced16;
if(data !== undefined){
data["jsonShorthand"] = coerced16;
}
}
}
var valid0 = _errs47 === errors;
if(valid0){
let data15 = data.maxParamLength;
const _errs49 = errors;
if(!(((typeof data15 == "number") && (!(data15 % 1) && !isNaN(data15))) && (isFinite(data15)))){
let dataType17 = typeof data15;
let coerced17 = undefined;
if(!(coerced17 !== undefined)){
if(dataType17 === "boolean" || data15 === null
              || (dataType17 === "string" && data15 && data15 == +data15 && !(data15 % 1))){
coerced17 = +data15;
}
else {
validate10.errors = [{instancePath:instancePath+"/maxParamLength",schemaPath:"#/properties/maxParamLength/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced17 !== undefined){
data15 = coerced17;
if(data !== undefined){
data["maxParamLength"] = coerced17;
}
}
}
var valid0 = _errs49 === errors;
if(valid0){
let data16 = data.onProtoPoisoning;
const _errs51 = errors;
if(typeof data16 !== "string"){
let dataType18 = typeof data16;
let coerced18 = undefined;
if(!(coerced18 !== undefined)){
if(dataType18 == "number" || dataType18 == "boolean"){
coerced18 = "" + data16;
}
else if(data16 === null){
coerced18 = "";
}
else {
validate10.errors = [{instancePath:instancePath+"/onProtoPoisoning",schemaPath:"#/properties/onProtoPoisoning/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced18 !== undefined){
data16 = coerced18;
if(data !== undefined){
data["onProtoPoisoning"] = coerced18;
}
}
}
var valid0 = _errs51 === errors;
if(valid0){
let data17 = data.onConstructorPoisoning;
const _errs53 = errors;
if(typeof data17 !== "string"){
let dataType19 = typeof data17;
let coerced19 = undefined;
if(!(coerced19 !== undefined)){
if(dataType19 == "number" || dataType19 == "boolean"){
coerced19 = "" + data17;
}
else if(data17 === null){
coerced19 = "";
}
else {
validate10.errors = [{instancePath:instancePath+"/onConstructorPoisoning",schemaPath:"#/properties/onConstructorPoisoning/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced19 !== undefined){
data17 = coerced19;
if(data !== undefined){
data["onConstructorPoisoning"] = coerced19;
}
}
}
var valid0 = _errs53 === errors;
if(valid0){
let data18 = data.pluginTimeout;
const _errs55 = errors;
if(!(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18)))){
let dataType20 = typeof data18;
let coerced20 = undefined;
if(!(coerced20 !== undefined)){
if(dataType20 === "boolean" || data18 === null
              || (dataType20 === "string" && data18 && data18 == +data18 && !(data18 % 1))){
coerced20 = +data18;
}
else {
validate10.errors = [{instancePath:instancePath+"/pluginTimeout",schemaPath:"#/properties/pluginTimeout/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced20 !== undefined){
data18 = coerced20;
if(data !== undefined){
data["pluginTimeout"] = coerced20;
}
}
}
var valid0 = _errs55 === errors;
if(valid0){
let data19 = data.requestIdHeader;
const _errs57 = errors;
const _errs58 = errors;
let valid6 = false;
const _errs59 = errors;
if(!(data19 === false)){
const err12 = {instancePath:instancePath+"/requestIdHeader",schemaPath:"#/properties/requestIdHeader/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema11.properties.requestIdHeader.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
var _valid3 = _errs59 === errors;
valid6 = valid6 || _valid3;
if(!valid6){
const _errs60 = errors;
if(typeof data19 !== "string"){
let dataType21 = typeof data19;
let coerced21 = undefined;
if(!(coerced21 !== undefined)){
if(dataType21 == "number" || dataType21 == "boolean"){
coerced21 = "" + data19;
}
else if(data19 === null){
coerced21 = "";
}
else {
const err13 = {instancePath:instancePath+"/requestIdHeader",schemaPath:"#/properties/requestIdHeader/anyOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(coerced21 !== undefined){
data19 = coerced21;
if(data !== undefined){
data["requestIdHeader"] = coerced21;
}
}
}
var _valid3 = _errs60 === errors;
valid6 = valid6 || _valid3;
}
if(!valid6){
const err14 = {instancePath:instancePath+"/requestIdHeader",schemaPath:"#/properties/requestIdHeader/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs58;
if(vErrors !== null){
if(_errs58){
vErrors.length = _errs58;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs57 === errors;
if(valid0){
let data20 = data.requestIdLogLabel;
const _errs62 = errors;
if(typeof data20 !== "string"){
let dataType22 = typeof data20;
let coerced22 = undefined;
if(!(coerced22 !== undefined)){
if(dataType22 == "number" || dataType22 == "boolean"){
coerced22 = "" + data20;
}
else if(data20 === null){
coerced22 = "";
}
else {
validate10.errors = [{instancePath:instancePath+"/requestIdLogLabel",schemaPath:"#/properties/requestIdLogLabel/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced22 !== undefined){
data20 = coerced22;
if(data !== undefined){
data["requestIdLogLabel"] = coerced22;
}
}
}
var valid0 = _errs62 === errors;
if(valid0){
let data21 = data.http2SessionTimeout;
const _errs64 = errors;
if(!(((typeof data21 == "number") && (!(data21 % 1) && !isNaN(data21))) && (isFinite(data21)))){
let dataType23 = typeof data21;
let coerced23 = undefined;
if(!(coerced23 !== undefined)){
if(dataType23 === "boolean" || data21 === null
              || (dataType23 === "string" && data21 && data21 == +data21 && !(data21 % 1))){
coerced23 = +data21;
}
else {
validate10.errors = [{instancePath:instancePath+"/http2SessionTimeout",schemaPath:"#/properties/http2SessionTimeout/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
}
if(coerced23 !== undefined){
data21 = coerced23;
if(data !== undefined){
data["http2SessionTimeout"] = coerced23;
}
}
}
var valid0 = _errs64 === errors;
if(valid0){
let data22 = data.exposeHeadRoutes;
const _errs66 = errors;
if(typeof data22 !== "boolean"){
let coerced24 = undefined;
if(!(coerced24 !== undefined)){
if(data22 === "false" || data22 === 0 || data22 === null){
coerced24 = false;
}
else if(data22 === "true" || data22 === 1){
coerced24 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/exposeHeadRoutes",schemaPath:"#/properties/exposeHeadRoutes/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced24 !== undefined){
data22 = coerced24;
if(data !== undefined){
data["exposeHeadRoutes"] = coerced24;
}
}
}
var valid0 = _errs66 === errors;
if(valid0){
if(data.versioning !== undefined){
let data23 = data.versioning;
const _errs68 = errors;
if(errors === _errs68){
if(data23 && typeof data23 == "object" && !Array.isArray(data23)){
let missing1;
if(((data23.storage === undefined) && (missing1 = "storage")) || ((data23.deriveVersion === undefined) && (missing1 = "deriveVersion"))){
validate10.errors = [{instancePath:instancePath+"/versioning",schemaPath:"#/properties/versioning/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
}
else {
validate10.errors = [{instancePath:instancePath+"/versioning",schemaPath:"#/properties/versioning/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs68 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.constraints !== undefined){
let data24 = data.constraints;
const _errs71 = errors;
if(errors === _errs71){
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
for(const key2 in data24){
let data25 = data24[key2];
const _errs74 = errors;
if(errors === _errs74){
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
let missing2;
if(((((data25.name === undefined) && (missing2 = "name")) || ((data25.storage === undefined) && (missing2 = "storage"))) || ((data25.validate === undefined) && (missing2 = "validate"))) || ((data25.deriveConstraint === undefined) && (missing2 = "deriveConstraint"))){
validate10.errors = [{instancePath:instancePath+"/constraints/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/constraints/additionalProperties/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
if(data25.name !== undefined){
let data26 = data25.name;
if(typeof data26 !== "string"){
let dataType25 = typeof data26;
let coerced25 = undefined;
if(!(coerced25 !== undefined)){
if(dataType25 == "number" || dataType25 == "boolean"){
coerced25 = "" + data26;
}
else if(data26 === null){
coerced25 = "";
}
else {
validate10.errors = [{instancePath:instancePath+"/constraints/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/properties/constraints/additionalProperties/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced25 !== undefined){
data26 = coerced25;
if(data25 !== undefined){
data25["name"] = coerced25;
}
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/constraints/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/constraints/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid7 = _errs74 === errors;
if(!valid7){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/constraints",schemaPath:"#/properties/constraints/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs71 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate10.errors = vErrors;
return errors === 0;
}


module.exports.defaultInitOptions = {"connectionTimeout":0,"keepAliveTimeout":72000,"maxRequestsPerSocket":0,"requestTimeout":0,"bodyLimit":1048576,"caseSensitive":true,"allowUnsafeRegex":false,"disableRequestLogging":false,"jsonShorthand":true,"ignoreTrailingSlash":false,"ignoreDuplicateSlashes":false,"maxParamLength":100,"onProtoPoisoning":"error","onConstructorPoisoning":"error","pluginTimeout":10000,"requestIdHeader":"request-id","requestIdLogLabel":"reqId","http2SessionTimeout":72000,"exposeHeadRoutes":true}


/***/ }),
/* 150 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const {
  kAvvioBoot,
  kChildren,
  kRoutePrefix,
  kLogLevel,
  kLogSerializers,
  kHooks,
  kSchemaController,
  kContentTypeParser,
  kReply,
  kRequest,
  kFourOhFour,
  kPluginNameChain
} = __webpack_require__(28)

const Reply = __webpack_require__(37)
const Request = __webpack_require__(90)
const SchemaController = __webpack_require__(99)
const ContentTypeParser = __webpack_require__(95)
const { buildHooks } = __webpack_require__(39)
const pluginUtils = __webpack_require__(123)

// Function that runs the encapsulation magic.
// Everything that need to be encapsulated must be handled in this function.
module.exports = function override (old, fn, opts) {
  const shouldSkipOverride = pluginUtils.registerPlugin.call(old, fn)

  if (shouldSkipOverride) {
    // after every plugin registration we will enter a new name
    old[kPluginNameChain].push(pluginUtils.getDisplayName(fn))
    return old
  }

  const instance = Object.create(old)
  old[kChildren].push(instance)
  instance.ready = old[kAvvioBoot].bind(instance)
  instance[kChildren] = []

  instance[kReply] = Reply.buildReply(instance[kReply])
  instance[kRequest] = Request.buildRequest(instance[kRequest])

  instance[kContentTypeParser] = ContentTypeParser.helpers.buildContentTypeParser(instance[kContentTypeParser])
  instance[kHooks] = buildHooks(instance[kHooks])
  instance[kRoutePrefix] = buildRoutePrefix(instance[kRoutePrefix], opts.prefix)
  instance[kLogLevel] = opts.logLevel || instance[kLogLevel]
  instance[kSchemaController] = SchemaController.buildSchemaController(old[kSchemaController])
  instance.getSchema = instance[kSchemaController].getSchema.bind(instance[kSchemaController])
  instance.getSchemas = instance[kSchemaController].getSchemas.bind(instance[kSchemaController])
  instance[pluginUtils.registeredPlugins] = Object.create(instance[pluginUtils.registeredPlugins])
  instance[kPluginNameChain] = [pluginUtils.getPluginName(fn) || pluginUtils.getFuncPreview(fn)]

  if (instance[kLogSerializers] || opts.logSerializers) {
    instance[kLogSerializers] = Object.assign(Object.create(instance[kLogSerializers]), opts.logSerializers)
  }

  if (opts.prefix) {
    instance[kFourOhFour].arrange404(instance)
  }

  for (const hook of instance[kHooks].onRegister) hook.call(this, instance, opts)

  return instance
}

function buildRoutePrefix (instancePrefix, pluginPrefix) {
  if (!pluginPrefix) {
    return instancePrefix
  }

  // Ensure that there is a '/' between the prefixes
  if (instancePrefix.endsWith('/') && pluginPrefix[0] === '/') {
    // Remove the extra '/' to avoid: '/first//second'
    pluginPrefix = pluginPrefix.slice(1)
  } else if (pluginPrefix[0] !== '/') {
    pluginPrefix = '/' + pluginPrefix
  }

  return instancePrefix + pluginPrefix
}


/***/ }),
/* 151 */
/***/ ((module) => {

"use strict";


module.exports = function noopSet () {
  return {
    [Symbol.iterator]: function * () {},
    add () {},
    delete () {},
    has () { return true }
  }
}


/***/ }),
/* 152 */
/***/ ((module) => {

"use strict";
module.exports = require("diagnostics_channel");

/***/ }),
/* 153 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const assert = __webpack_require__(82)
const Request = __webpack_require__(154)
const Response = __webpack_require__(157)

const errorMessage = 'The dispatch function has already been invoked'

const optsValidator = __webpack_require__(159)

function inject (dispatchFunc, options, callback) {
  if (typeof callback === 'undefined') {
    return new Chain(dispatchFunc, options)
  } else {
    return doInject(dispatchFunc, options, callback)
  }
}

function makeRequest (dispatchFunc, server, req, res) {
  req.once('error', function (err) {
    if (this.destroyed) res.destroy(err)
  })

  req.once('close', function () {
    if (this.destroyed && !this._error) res.destroy()
  })

  return req.prepare(() => dispatchFunc.call(server, req, res))
}

function doInject (dispatchFunc, options, callback) {
  options = (typeof options === 'string' ? { url: options } : options)

  if (options.validate !== false) {
    assert(typeof dispatchFunc === 'function', 'dispatchFunc should be a function')
    const isOptionValid = optsValidator(options)
    if (!isOptionValid) {
      throw new Error(optsValidator.errors.map(e => e.message))
    }
  }

  const server = options.server || {}

  const RequestConstructor = options.Request
    ? Request.CustomRequest
    : Request

  // Express.js detection
  if (dispatchFunc.request && dispatchFunc.request.app === dispatchFunc) {
    Object.setPrototypeOf(Object.getPrototypeOf(dispatchFunc.request), RequestConstructor.prototype)
    Object.setPrototypeOf(Object.getPrototypeOf(dispatchFunc.response), Response.prototype)
  }

  if (typeof callback === 'function') {
    const req = new RequestConstructor(options)
    const res = new Response(req, callback)

    return makeRequest(dispatchFunc, server, req, res)
  } else {
    return new Promise((resolve, reject) => {
      const req = new RequestConstructor(options)
      const res = new Response(req, resolve, reject)

      makeRequest(dispatchFunc, server, req, res)
    })
  }
}

function Chain (dispatch, option) {
  if (typeof option === 'string') {
    this.option = { url: option }
  } else {
    this.option = Object.assign({}, option)
  }

  this.dispatch = dispatch
  this._hasInvoked = false
  this._promise = null

  if (this.option.autoStart !== false) {
    process.nextTick(() => {
      if (!this._hasInvoked) {
        this.end()
      }
    })
  }
}

const httpMethods = [
  'delete',
  'get',
  'head',
  'options',
  'patch',
  'post',
  'put',
  'trace'
]

httpMethods.forEach(method => {
  Chain.prototype[method] = function (url) {
    if (this._hasInvoked === true || this._promise) {
      throw new Error(errorMessage)
    }
    this.option.url = url
    this.option.method = method.toUpperCase()
    return this
  }
})

const chainMethods = [
  'body',
  'cookies',
  'headers',
  'payload',
  'query'
]

chainMethods.forEach(method => {
  Chain.prototype[method] = function (value) {
    if (this._hasInvoked === true || this._promise) {
      throw new Error(errorMessage)
    }
    this.option[method] = value
    return this
  }
})

Chain.prototype.end = function (callback) {
  if (this._hasInvoked === true || this._promise) {
    throw new Error(errorMessage)
  }
  this._hasInvoked = true
  if (typeof callback === 'function') {
    doInject(this.dispatch, this.option, callback)
  } else {
    this._promise = doInject(this.dispatch, this.option)
    return this._promise
  }
}

Object.getOwnPropertyNames(Promise.prototype).forEach(method => {
  if (method === 'constructor') return
  Chain.prototype[method] = function (...args) {
    if (!this._promise) {
      if (this._hasInvoked === true) {
        throw new Error(errorMessage)
      }
      this._hasInvoked = true
      this._promise = doInject(this.dispatch, this.option)
    }
    return this._promise[method](...args)
  }
})

function isInjection (obj) {
  return (
    obj instanceof Request ||
    obj instanceof Response ||
    (obj && obj.constructor && obj.constructor.name === '_CustomLMRRequest')
  )
}

module.exports = inject
module.exports.inject = inject
module.exports.isInjection = isInjection


/***/ }),
/* 154 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* eslint no-prototype-builtins: 0 */

const { Readable, addAbortSignal } = __webpack_require__(38)
const util = __webpack_require__(21)
const cookie = __webpack_require__(155)
const assert = __webpack_require__(82)
const warning = __webpack_require__(33)()

const parseURL = __webpack_require__(156)
const { EventEmitter } = __webpack_require__(20)

// request.connectin deprecation https://nodejs.org/api/http.html#http_request_connection
warning.create('FastifyDeprecationLightMyRequest', 'FST_LIGHTMYREQUEST_DEP01', 'You are accessing "request.connection", use "request.socket" instead.')

/**
 * Get hostname:port
 *
 * @param {URL} parsedURL
 * @return {String}
 */
function hostHeaderFromURL (parsedURL) {
  return parsedURL.port
    ? parsedURL.host
    : parsedURL.hostname + (parsedURL.protocol === 'https:' ? ':443' : ':80')
}

/**
 * Mock socket object used to fake access to a socket for a request
 *
 * @constructor
 * @param {String} remoteAddress the fake address to show consumers of the socket
 */
class MockSocket extends EventEmitter {
  constructor (remoteAddress) {
    super()
    this.remoteAddress = remoteAddress
  }
}

/**
 * CustomRequest
 *
 * @constructor
 * @param {Object} options
 * @param {(Object|String)} options.url || options.path
 * @param {String} [options.method='GET']
 * @param {String} [options.remoteAddress]
 * @param {Object} [options.cookies]
 * @param {Object} [options.headers]
 * @param {Object} [options.query]
 * @param {Object} [options.Request]
 * @param {any} [options.payload]
 */
function CustomRequest (options) {
  return new _CustomLMRRequest(this)

  function _CustomLMRRequest (obj) {
    Request.call(obj, {
      ...options,
      Request: undefined
    })
    Object.assign(this, obj)

    for (const fn of Object.keys(Request.prototype)) {
      this.constructor.prototype[fn] = Request.prototype[fn]
    }

    util.inherits(this.constructor, options.Request)
    return this
  }
}

/**
 * Request
 *
 * @constructor
 * @param {Object} options
 * @param {(Object|String)} options.url || options.path
 * @param {String} [options.method='GET']
 * @param {String} [options.remoteAddress]
 * @param {Object} [options.cookies]
 * @param {Object} [options.headers]
 * @param {Object} [options.query]
 * @param {any} [options.payload]
 */
function Request (options) {
  Readable.call(this, {
    autoDestroy: false
  })

  const parsedURL = parseURL(options.url || options.path, options.query)

  this.url = parsedURL.pathname + parsedURL.search

  this.aborted = false
  this.httpVersionMajor = 1
  this.httpVersionMinor = 1
  this.httpVersion = '1.1'
  this.method = options.method ? options.method.toUpperCase() : 'GET'

  this.headers = {}
  this.rawHeaders = []
  const headers = options.headers || {}

  for (const field in headers) {
    const fieldLowerCase = field.toLowerCase()
    if (
      (
        fieldLowerCase === 'user-agent' ||
        fieldLowerCase === 'content-type'
      ) && headers[field] === undefined
    ) {
      this.headers[fieldLowerCase] = undefined
      continue
    }
    const value = headers[field]
    assert(value !== undefined, 'invalid value "undefined" for header ' + field)
    this.headers[fieldLowerCase] = '' + value
  }

  if (('user-agent' in this.headers) === false) {
    this.headers['user-agent'] = 'lightMyRequest'
  }
  this.headers.host = this.headers.host || options.authority || hostHeaderFromURL(parsedURL)

  if (options.cookies) {
    const { cookies } = options
    const cookieValues = Object.keys(cookies).map(key => cookie.serialize(key, cookies[key]))
    if (this.headers.cookie) {
      cookieValues.unshift(this.headers.cookie)
    }
    this.headers.cookie = cookieValues.join('; ')
  }

  this.socket = new MockSocket(options.remoteAddress || '127.0.0.1')

  Object.defineProperty(this, 'connection', {
    get () {
      warning.emit('FST_LIGHTMYREQUEST_DEP01')
      return this.socket
    },
    configurable: true
  })

  const signal = options.signal
  /* istanbul ignore if  */
  if (signal) {
    addAbortSignal(signal, this)
  }

  // we keep both payload and body for compatibility reasons
  let payload = options.payload || options.body || null
  const payloadResume = payload && typeof payload.resume === 'function'

  if (payload && typeof payload !== 'string' && !payloadResume && !Buffer.isBuffer(payload)) {
    payload = JSON.stringify(payload)

    if (('content-type' in this.headers) === false) {
      this.headers['content-type'] = 'application/json'
    }
  }

  // Set the content-length for the corresponding payload if none set
  if (payload && !payloadResume && !Object.prototype.hasOwnProperty.call(this.headers, 'content-length')) {
    this.headers['content-length'] = (Buffer.isBuffer(payload) ? payload.length : Buffer.byteLength(payload)).toString()
  }

  for (const header of Object.keys(this.headers)) {
    this.rawHeaders.push(header, this.headers[header])
  }

  // Use _lightMyRequest namespace to avoid collision with Node
  this._lightMyRequest = {
    payload,
    isDone: false,
    simulate: options.simulate || {}
  }

  return this
}

util.inherits(Request, Readable)
util.inherits(CustomRequest, Request)

Request.prototype.prepare = function (next) {
  const payload = this._lightMyRequest.payload
  if (!payload || typeof payload.resume !== 'function') { // does not quack like a stream
    return next()
  }

  const chunks = []

  payload.on('data', (chunk) => chunks.push(Buffer.from(chunk)))

  payload.on('end', () => {
    const payload = Buffer.concat(chunks)
    this.headers['content-length'] = this.headers['content-length'] || ('' + payload.length)
    this._lightMyRequest.payload = payload
    return next()
  })

  // Force to resume the stream. Needed for Stream 1
  payload.resume()
}

Request.prototype._read = function (size) {
  setImmediate(() => {
    if (this._lightMyRequest.isDone) {
      // 'end' defaults to true
      if (this._lightMyRequest.simulate.end !== false) {
        this.push(null)
      }

      return
    }

    this._lightMyRequest.isDone = true

    if (this._lightMyRequest.payload) {
      if (this._lightMyRequest.simulate.split) {
        this.push(this._lightMyRequest.payload.slice(0, 1))
        this.push(this._lightMyRequest.payload.slice(1))
      } else {
        this.push(this._lightMyRequest.payload)
      }
    }

    if (this._lightMyRequest.simulate.error) {
      this.emit('error', new Error('Simulated'))
    }

    if (this._lightMyRequest.simulate.close) {
      this.emit('close')
    }

    // 'end' defaults to true
    if (this._lightMyRequest.simulate.end !== false) {
      this.push(null)
    }
  })
}

Request.prototype.destroy = function (error) {
  if (this.destroyed) return
  this.destroyed = true

  if (error) {
    this._error = true
    process.nextTick(() => this.emit('error', error))
  }

  process.nextTick(() => this.emit('close'))
}

module.exports = Request
module.exports.Request = Request
module.exports.CustomRequest = CustomRequest


/***/ }),
/* 155 */
/***/ ((module) => {

"use strict";
module.exports = require("cookie");

/***/ }),
/* 156 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { URL } = __webpack_require__(78)

const BASE_URL = 'http://localhost'

/**
 * Parse URL
 *
 * @param {(Object|String)} url
 * @param {Object} [query]
 * @return {URL}
 */
module.exports = function parseURL (url, query) {
  if ((typeof url === 'string' || Object.prototype.toString.call(url) === '[object String]') && url.startsWith('//')) {
    url = BASE_URL + url
  }
  const result = typeof url === 'object'
    ? Object.assign(new URL(BASE_URL), url)
    : new URL(url, BASE_URL)

  if (typeof query === 'string') {
    query = new URLSearchParams(query)
    for (const key of query.keys()) {
      result.searchParams.delete(key)
      for (const value of query.getAll(key)) {
        result.searchParams.append(key, value)
      }
    }
  } else {
    const merged = Object.assign({}, url.query, query)
    for (const key in merged) {
      const value = merged[key]

      if (Array.isArray(value)) {
        result.searchParams.delete(key)
        for (const param of value) {
          result.searchParams.append(key, param)
        }
      } else {
        result.searchParams.set(key, value)
      }
    }
  }

  return result
}


/***/ }),
/* 157 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const http = __webpack_require__(27)
const { Writable } = __webpack_require__(38)
const util = __webpack_require__(21)

const setCookie = __webpack_require__(158)

function Response (req, onEnd, reject) {
  http.ServerResponse.call(this, req)

  this._lightMyRequest = { headers: null, trailers: {}, payloadChunks: [] }
  // This forces node@8 to always render the headers
  this.setHeader('foo', 'bar'); this.removeHeader('foo')

  this.assignSocket(getNullSocket())

  this._promiseCallback = typeof reject === 'function'

  let called = false
  const onEndSuccess = (payload) => {
    // no need to early-return if already called because this handler is bound `once`
    called = true
    if (this._promiseCallback) {
      return process.nextTick(() => onEnd(payload))
    }
    process.nextTick(() => onEnd(null, payload))
  }

  const onEndFailure = (err) => {
    if (called) return
    called = true
    if (this._promiseCallback) {
      return process.nextTick(() => reject(err))
    }
    process.nextTick(() => onEnd(err, null))
  }

  this.once('finish', () => {
    const res = generatePayload(this)
    res.raw.req = req
    onEndSuccess(res)
  })

  this.connection.once('error', onEndFailure)

  this.once('error', onEndFailure)

  this.once('close', onEndFailure)
}

util.inherits(Response, http.ServerResponse)

Response.prototype.setTimeout = function (msecs, callback) {
  this.timeoutHandle = setTimeout(() => {
    this.emit('timeout')
  }, msecs)
  this.on('timeout', callback)
  return this
}

Response.prototype.writeHead = function () {
  const result = http.ServerResponse.prototype.writeHead.apply(this, arguments)

  copyHeaders(this)

  return result
}

Response.prototype.write = function (data, encoding, callback) {
  if (this.timeoutHandle) {
    clearTimeout(this.timeoutHandle)
  }
  http.ServerResponse.prototype.write.call(this, data, encoding, callback)
  this._lightMyRequest.payloadChunks.push(Buffer.from(data, encoding))
  return true
}

Response.prototype.end = function (data, encoding, callback) {
  if (data) {
    this.write(data, encoding)
  }

  http.ServerResponse.prototype.end.call(this, callback)

  this.emit('finish')

  // We need to emit 'close' otherwise stream.finished() would
  // not pick it up on Node v16

  this.destroy()
}

Response.prototype.destroy = function (error) {
  if (this.destroyed) return
  this.destroyed = true

  if (error) {
    process.nextTick(() => this.emit('error', error))
  }

  process.nextTick(() => this.emit('close'))
}

Response.prototype.addTrailers = function (trailers) {
  for (const key in trailers) {
    this._lightMyRequest.trailers[key.toLowerCase().trim()] = trailers[key].toString().trim()
  }
}

function generatePayload (response) {
  // This seems only to happen when using `fastify-express` - see https://github.com/fastify/fastify-express/issues/47
  /* istanbul ignore if */
  if (response._lightMyRequest.headers === null) {
    copyHeaders(response)
  }
  // Prepare response object
  const res = {
    raw: {
      res: response
    },
    headers: response._lightMyRequest.headers,
    statusCode: response.statusCode,
    statusMessage: response.statusMessage,
    trailers: {},
    get cookies () {
      return setCookie.parse(this)
    }
  }

  // Prepare payload and trailers
  const rawBuffer = Buffer.concat(response._lightMyRequest.payloadChunks)
  res.rawPayload = rawBuffer

  // we keep both of them for compatibility reasons
  res.payload = rawBuffer.toString()
  res.body = res.payload
  res.trailers = response._lightMyRequest.trailers

  // Prepare payload parsers
  res.json = function parseJsonPayload () {
    if (res.headers['content-type'].indexOf('application/json') < 0) {
      throw new Error('The content-type of the response is not application/json')
    }
    return JSON.parse(res.payload)
  }

  return res
}

// Throws away all written data to prevent response from buffering payload
function getNullSocket () {
  return new Writable({
    write (chunk, encoding, callback) {
      setImmediate(callback)
    }
  })
}

function copyHeaders (response) {
  response._lightMyRequest.headers = Object.assign({}, response.getHeaders())

  // Add raw headers
  ;['Date', 'Connection', 'Transfer-Encoding'].forEach((name) => {
    const regex = new RegExp('\\r\\n' + name + ': ([^\\r]*)\\r\\n')
    const field = response._header.match(regex)
    if (field) {
      response._lightMyRequest.headers[name.toLowerCase()] = field[1]
    }
  })
}

module.exports = Response


/***/ }),
/* 158 */
/***/ ((module) => {

"use strict";


var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false,
};

function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}

function parseString(setCookieValue, options) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);

  var nameValuePairStr = parts.shift();
  var parsed = parseNameValuePair(nameValuePairStr);
  var name = parsed.name;
  var value = parsed.value;

  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  try {
    value = options.decodeValues ? decodeURIComponent(value) : value; // decode cookie value
  } catch (e) {
    console.error(
      "set-cookie-parser encountered an error while decoding a cookie with value '" +
        value +
        "'. Set options.decodeValues to false to disable this feature.",
      e
    );
  }

  var cookie = {
    name: name,
    value: value,
  };

  parts.forEach(function (part) {
    var sides = part.split("=");
    var key = sides.shift().trimLeft().toLowerCase();
    var value = sides.join("=");
    if (key === "expires") {
      cookie.expires = new Date(value);
    } else if (key === "max-age") {
      cookie.maxAge = parseInt(value, 10);
    } else if (key === "secure") {
      cookie.secure = true;
    } else if (key === "httponly") {
      cookie.httpOnly = true;
    } else if (key === "samesite") {
      cookie.sameSite = value;
    } else {
      cookie[key] = value;
    }
  });

  return cookie;
}

function parseNameValuePair(nameValuePairStr) {
  // Parses name-value-pair according to rfc6265bis draft

  var name = "";
  var value = "";
  var nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("="); // everything after the first =, joined by a "=" if there was more than one part
  } else {
    value = nameValuePairStr;
  }

  return { name: name, value: value };
}

function parse(input, options) {
  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  if (!input) {
    if (!options.map) {
      return [];
    } else {
      return {};
    }
  }

  if (input.headers && input.headers["set-cookie"]) {
    // fast-path for node.js (which automatically normalizes header names to lower-case
    input = input.headers["set-cookie"];
  } else if (input.headers) {
    // slow-path for other environments - see #25
    var sch =
      input.headers[
        Object.keys(input.headers).find(function (key) {
          return key.toLowerCase() === "set-cookie";
        })
      ];
    // warn if called on a request-like object with a cookie header rather than a set-cookie header - see #34, 36
    if (!sch && input.headers.cookie && !options.silent) {
      console.warn(
        "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
      );
    }
    input = sch;
  }
  if (!Array.isArray(input)) {
    input = [input];
  }

  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  if (!options.map) {
    return input.filter(isNonEmptyString).map(function (str) {
      return parseString(str, options);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString).reduce(function (cookies, str) {
      var cookie = parseString(str, options);
      cookies[cookie.name] = cookie;
      return cookies;
    }, cookies);
  }
}

/*
  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
  that are within a single set-cookie field-value, such as in the Expires portion.

  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
  React Native's fetch does this for *every* header, including set-cookie.

  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
*/
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }

  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;

  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }

  function notSpecialChar() {
    ch = cookiesString.charAt(pos);

    return ch !== "=" && ch !== ";" && ch !== ",";
  }

  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;

    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        // ',' is a cookie separator if we have later first '=', not ';' or ','
        lastComma = pos;
        pos += 1;

        skipWhitespace();
        nextStart = pos;

        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }

        // currently special character
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          // we found cookies separator
          cookiesSeparatorFound = true;
          // pos is inside the next cookie, so back up and return it.
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          // in param ',' or param separator ';',
          // we continue from that comma
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }

    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }

  return cookiesStrings;
}

module.exports = parse;
module.exports.parse = parse;
module.exports.parseString = parseString;
module.exports.splitCookiesString = splitCookiesString;


/***/ }),
/* 159 */
/***/ ((module) => {

"use strict";
// This file is autogenerated by build\build-validation.js, do not edit
/* istanbul ignore file */
/* eslint-disable */

module.exports = validate10;
module.exports["default"] = validate10;
const schema11 = {"type":"object","properties":{"url":{"oneOf":[{"type":"string"},{"type":"object","properties":{"protocol":{"type":"string"},"hostname":{"type":"string"},"pathname":{"type":"string"}},"additionalProperties":true,"required":["pathname"]}]},"path":{"oneOf":[{"type":"string"},{"type":"object","properties":{"protocol":{"type":"string"},"hostname":{"type":"string"},"pathname":{"type":"string"}},"additionalProperties":true,"required":["pathname"]}]},"cookies":{"type":"object","additionalProperties":true},"headers":{"type":"object","additionalProperties":true},"query":{"anyOf":[{"type":"object","additionalProperties":true},{"type":"string"}]},"simulate":{"type":"object","properties":{"end":{"type":"boolean"},"split":{"type":"boolean"},"error":{"type":"boolean"},"close":{"type":"boolean"}}},"authority":{"type":"string"},"remoteAddress":{"type":"string"},"method":{"type":"string","enum":["ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","acl","bind","checkout","connect","copy","delete","get","head","link","lock","m-search","merge","mkactivity","mkcalendar","mkcol","move","notify","options","patch","post","propfind","proppatch","purge","put","rebind","report","search","source","subscribe","trace","unbind","unlink","unlock","unsubscribe"]},"validate":{"type":"boolean"}},"additionalProperties":true,"oneOf":[{"required":["url"]},{"required":["path"]}]};

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
const _errs1 = errors;
let valid0 = false;
let passing0 = null;
const _errs2 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.url === undefined) && (missing0 = "url")){
const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs2 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
}
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.path === undefined) && (missing1 = "path")){
const err1 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs3 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
}
}
if(!valid0){
const err2 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs1;
if(vErrors !== null){
if(_errs1){
vErrors.length = _errs1;
}
else {
vErrors = null;
}
}
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.url !== undefined){
let data0 = data.url;
const _errs5 = errors;
const _errs6 = errors;
let valid2 = false;
let passing1 = null;
const _errs7 = errors;
if(typeof data0 !== "string"){
let dataType0 = typeof data0;
let coerced0 = undefined;
if(!(coerced0 !== undefined)){
if(dataType0 == "number" || dataType0 == "boolean"){
coerced0 = "" + data0;
}
else if(data0 === null){
coerced0 = "";
}
else {
const err3 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/oneOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(coerced0 !== undefined){
data0 = coerced0;
if(data !== undefined){
data["url"] = coerced0;
}
}
}
var _valid1 = _errs7 === errors;
if(_valid1){
valid2 = true;
passing1 = 0;
}
const _errs9 = errors;
if(errors === _errs9){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
let missing2;
if((data0.pathname === undefined) && (missing2 = "pathname")){
const err4 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/oneOf/1/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
if(data0.protocol !== undefined){
let data1 = data0.protocol;
const _errs12 = errors;
if(typeof data1 !== "string"){
let dataType1 = typeof data1;
let coerced1 = undefined;
if(!(coerced1 !== undefined)){
if(dataType1 == "number" || dataType1 == "boolean"){
coerced1 = "" + data1;
}
else if(data1 === null){
coerced1 = "";
}
else {
const err5 = {instancePath:instancePath+"/url/protocol",schemaPath:"#/properties/url/oneOf/1/properties/protocol/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(coerced1 !== undefined){
data1 = coerced1;
if(data0 !== undefined){
data0["protocol"] = coerced1;
}
}
}
var valid3 = _errs12 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.hostname !== undefined){
let data2 = data0.hostname;
const _errs14 = errors;
if(typeof data2 !== "string"){
let dataType2 = typeof data2;
let coerced2 = undefined;
if(!(coerced2 !== undefined)){
if(dataType2 == "number" || dataType2 == "boolean"){
coerced2 = "" + data2;
}
else if(data2 === null){
coerced2 = "";
}
else {
const err6 = {instancePath:instancePath+"/url/hostname",schemaPath:"#/properties/url/oneOf/1/properties/hostname/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(coerced2 !== undefined){
data2 = coerced2;
if(data0 !== undefined){
data0["hostname"] = coerced2;
}
}
}
var valid3 = _errs14 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data0.pathname !== undefined){
let data3 = data0.pathname;
const _errs16 = errors;
if(typeof data3 !== "string"){
let dataType3 = typeof data3;
let coerced3 = undefined;
if(!(coerced3 !== undefined)){
if(dataType3 == "number" || dataType3 == "boolean"){
coerced3 = "" + data3;
}
else if(data3 === null){
coerced3 = "";
}
else {
const err7 = {instancePath:instancePath+"/url/pathname",schemaPath:"#/properties/url/oneOf/1/properties/pathname/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(coerced3 !== undefined){
data3 = coerced3;
if(data0 !== undefined){
data0["pathname"] = coerced3;
}
}
}
var valid3 = _errs16 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
else {
const err8 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
var _valid1 = _errs9 === errors;
if(_valid1 && valid2){
valid2 = false;
passing1 = [passing1, 1];
}
else {
if(_valid1){
valid2 = true;
passing1 = 1;
}
}
if(!valid2){
const err9 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/oneOf",keyword:"oneOf",params:{passingSchemas: passing1},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
}
var valid1 = _errs5 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.path !== undefined){
let data4 = data.path;
const _errs18 = errors;
const _errs19 = errors;
let valid4 = false;
let passing2 = null;
const _errs20 = errors;
if(typeof data4 !== "string"){
let dataType4 = typeof data4;
let coerced4 = undefined;
if(!(coerced4 !== undefined)){
if(dataType4 == "number" || dataType4 == "boolean"){
coerced4 = "" + data4;
}
else if(data4 === null){
coerced4 = "";
}
else {
const err10 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/oneOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(coerced4 !== undefined){
data4 = coerced4;
if(data !== undefined){
data["path"] = coerced4;
}
}
}
var _valid2 = _errs20 === errors;
if(_valid2){
valid4 = true;
passing2 = 0;
}
const _errs22 = errors;
if(errors === _errs22){
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
let missing3;
if((data4.pathname === undefined) && (missing3 = "pathname")){
const err11 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/oneOf/1/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
else {
if(data4.protocol !== undefined){
let data5 = data4.protocol;
const _errs25 = errors;
if(typeof data5 !== "string"){
let dataType5 = typeof data5;
let coerced5 = undefined;
if(!(coerced5 !== undefined)){
if(dataType5 == "number" || dataType5 == "boolean"){
coerced5 = "" + data5;
}
else if(data5 === null){
coerced5 = "";
}
else {
const err12 = {instancePath:instancePath+"/path/protocol",schemaPath:"#/properties/path/oneOf/1/properties/protocol/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(coerced5 !== undefined){
data5 = coerced5;
if(data4 !== undefined){
data4["protocol"] = coerced5;
}
}
}
var valid5 = _errs25 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data4.hostname !== undefined){
let data6 = data4.hostname;
const _errs27 = errors;
if(typeof data6 !== "string"){
let dataType6 = typeof data6;
let coerced6 = undefined;
if(!(coerced6 !== undefined)){
if(dataType6 == "number" || dataType6 == "boolean"){
coerced6 = "" + data6;
}
else if(data6 === null){
coerced6 = "";
}
else {
const err13 = {instancePath:instancePath+"/path/hostname",schemaPath:"#/properties/path/oneOf/1/properties/hostname/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(coerced6 !== undefined){
data6 = coerced6;
if(data4 !== undefined){
data4["hostname"] = coerced6;
}
}
}
var valid5 = _errs27 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data4.pathname !== undefined){
let data7 = data4.pathname;
const _errs29 = errors;
if(typeof data7 !== "string"){
let dataType7 = typeof data7;
let coerced7 = undefined;
if(!(coerced7 !== undefined)){
if(dataType7 == "number" || dataType7 == "boolean"){
coerced7 = "" + data7;
}
else if(data7 === null){
coerced7 = "";
}
else {
const err14 = {instancePath:instancePath+"/path/pathname",schemaPath:"#/properties/path/oneOf/1/properties/pathname/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(coerced7 !== undefined){
data7 = coerced7;
if(data4 !== undefined){
data4["pathname"] = coerced7;
}
}
}
var valid5 = _errs29 === errors;
}
else {
var valid5 = true;
}
}
}
}
}
else {
const err15 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
var _valid2 = _errs22 === errors;
if(_valid2 && valid4){
valid4 = false;
passing2 = [passing2, 1];
}
else {
if(_valid2){
valid4 = true;
passing2 = 1;
}
}
if(!valid4){
const err16 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/oneOf",keyword:"oneOf",params:{passingSchemas: passing2},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs19;
if(vErrors !== null){
if(_errs19){
vErrors.length = _errs19;
}
else {
vErrors = null;
}
}
}
var valid1 = _errs18 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.cookies !== undefined){
let data8 = data.cookies;
const _errs31 = errors;
if(errors === _errs31){
if(!(data8 && typeof data8 == "object" && !Array.isArray(data8))){
validate10.errors = [{instancePath:instancePath+"/cookies",schemaPath:"#/properties/cookies/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs31 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.headers !== undefined){
let data9 = data.headers;
const _errs34 = errors;
if(errors === _errs34){
if(!(data9 && typeof data9 == "object" && !Array.isArray(data9))){
validate10.errors = [{instancePath:instancePath+"/headers",schemaPath:"#/properties/headers/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs34 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.query !== undefined){
let data10 = data.query;
const _errs37 = errors;
const _errs38 = errors;
let valid6 = false;
const _errs39 = errors;
if(errors === _errs39){
if(!(data10 && typeof data10 == "object" && !Array.isArray(data10))){
const err17 = {instancePath:instancePath+"/query",schemaPath:"#/properties/query/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
var _valid3 = _errs39 === errors;
valid6 = valid6 || _valid3;
if(!valid6){
const _errs42 = errors;
if(typeof data10 !== "string"){
let dataType8 = typeof data10;
let coerced8 = undefined;
if(!(coerced8 !== undefined)){
if(dataType8 == "number" || dataType8 == "boolean"){
coerced8 = "" + data10;
}
else if(data10 === null){
coerced8 = "";
}
else {
const err18 = {instancePath:instancePath+"/query",schemaPath:"#/properties/query/anyOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(coerced8 !== undefined){
data10 = coerced8;
if(data !== undefined){
data["query"] = coerced8;
}
}
}
var _valid3 = _errs42 === errors;
valid6 = valid6 || _valid3;
}
if(!valid6){
const err19 = {instancePath:instancePath+"/query",schemaPath:"#/properties/query/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs38;
if(vErrors !== null){
if(_errs38){
vErrors.length = _errs38;
}
else {
vErrors = null;
}
}
}
var valid1 = _errs37 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.simulate !== undefined){
let data11 = data.simulate;
const _errs44 = errors;
if(errors === _errs44){
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
if(data11.end !== undefined){
let data12 = data11.end;
const _errs46 = errors;
if(typeof data12 !== "boolean"){
let coerced9 = undefined;
if(!(coerced9 !== undefined)){
if(data12 === "false" || data12 === 0 || data12 === null){
coerced9 = false;
}
else if(data12 === "true" || data12 === 1){
coerced9 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/simulate/end",schemaPath:"#/properties/simulate/properties/end/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced9 !== undefined){
data12 = coerced9;
if(data11 !== undefined){
data11["end"] = coerced9;
}
}
}
var valid7 = _errs46 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data11.split !== undefined){
let data13 = data11.split;
const _errs48 = errors;
if(typeof data13 !== "boolean"){
let coerced10 = undefined;
if(!(coerced10 !== undefined)){
if(data13 === "false" || data13 === 0 || data13 === null){
coerced10 = false;
}
else if(data13 === "true" || data13 === 1){
coerced10 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/simulate/split",schemaPath:"#/properties/simulate/properties/split/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced10 !== undefined){
data13 = coerced10;
if(data11 !== undefined){
data11["split"] = coerced10;
}
}
}
var valid7 = _errs48 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data11.error !== undefined){
let data14 = data11.error;
const _errs50 = errors;
if(typeof data14 !== "boolean"){
let coerced11 = undefined;
if(!(coerced11 !== undefined)){
if(data14 === "false" || data14 === 0 || data14 === null){
coerced11 = false;
}
else if(data14 === "true" || data14 === 1){
coerced11 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/simulate/error",schemaPath:"#/properties/simulate/properties/error/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced11 !== undefined){
data14 = coerced11;
if(data11 !== undefined){
data11["error"] = coerced11;
}
}
}
var valid7 = _errs50 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data11.close !== undefined){
let data15 = data11.close;
const _errs52 = errors;
if(typeof data15 !== "boolean"){
let coerced12 = undefined;
if(!(coerced12 !== undefined)){
if(data15 === "false" || data15 === 0 || data15 === null){
coerced12 = false;
}
else if(data15 === "true" || data15 === 1){
coerced12 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/simulate/close",schemaPath:"#/properties/simulate/properties/close/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced12 !== undefined){
data15 = coerced12;
if(data11 !== undefined){
data11["close"] = coerced12;
}
}
}
var valid7 = _errs52 === errors;
}
else {
var valid7 = true;
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/simulate",schemaPath:"#/properties/simulate/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs44 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.authority !== undefined){
let data16 = data.authority;
const _errs54 = errors;
if(typeof data16 !== "string"){
let dataType13 = typeof data16;
let coerced13 = undefined;
if(!(coerced13 !== undefined)){
if(dataType13 == "number" || dataType13 == "boolean"){
coerced13 = "" + data16;
}
else if(data16 === null){
coerced13 = "";
}
else {
validate10.errors = [{instancePath:instancePath+"/authority",schemaPath:"#/properties/authority/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced13 !== undefined){
data16 = coerced13;
if(data !== undefined){
data["authority"] = coerced13;
}
}
}
var valid1 = _errs54 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.remoteAddress !== undefined){
let data17 = data.remoteAddress;
const _errs56 = errors;
if(typeof data17 !== "string"){
let dataType14 = typeof data17;
let coerced14 = undefined;
if(!(coerced14 !== undefined)){
if(dataType14 == "number" || dataType14 == "boolean"){
coerced14 = "" + data17;
}
else if(data17 === null){
coerced14 = "";
}
else {
validate10.errors = [{instancePath:instancePath+"/remoteAddress",schemaPath:"#/properties/remoteAddress/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced14 !== undefined){
data17 = coerced14;
if(data !== undefined){
data["remoteAddress"] = coerced14;
}
}
}
var valid1 = _errs56 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.method !== undefined){
let data18 = data.method;
const _errs58 = errors;
if(typeof data18 !== "string"){
let dataType15 = typeof data18;
let coerced15 = undefined;
if(!(coerced15 !== undefined)){
if(dataType15 == "number" || dataType15 == "boolean"){
coerced15 = "" + data18;
}
else if(data18 === null){
coerced15 = "";
}
else {
validate10.errors = [{instancePath:instancePath+"/method",schemaPath:"#/properties/method/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
if(coerced15 !== undefined){
data18 = coerced15;
if(data !== undefined){
data["method"] = coerced15;
}
}
}
if(!((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((data18 === "ACL") || (data18 === "BIND")) || (data18 === "CHECKOUT")) || (data18 === "CONNECT")) || (data18 === "COPY")) || (data18 === "DELETE")) || (data18 === "GET")) || (data18 === "HEAD")) || (data18 === "LINK")) || (data18 === "LOCK")) || (data18 === "M-SEARCH")) || (data18 === "MERGE")) || (data18 === "MKACTIVITY")) || (data18 === "MKCALENDAR")) || (data18 === "MKCOL")) || (data18 === "MOVE")) || (data18 === "NOTIFY")) || (data18 === "OPTIONS")) || (data18 === "PATCH")) || (data18 === "POST")) || (data18 === "PROPFIND")) || (data18 === "PROPPATCH")) || (data18 === "PURGE")) || (data18 === "PUT")) || (data18 === "REBIND")) || (data18 === "REPORT")) || (data18 === "SEARCH")) || (data18 === "SOURCE")) || (data18 === "SUBSCRIBE")) || (data18 === "TRACE")) || (data18 === "UNBIND")) || (data18 === "UNLINK")) || (data18 === "UNLOCK")) || (data18 === "UNSUBSCRIBE")) || (data18 === "acl")) || (data18 === "bind")) || (data18 === "checkout")) || (data18 === "connect")) || (data18 === "copy")) || (data18 === "delete")) || (data18 === "get")) || (data18 === "head")) || (data18 === "link")) || (data18 === "lock")) || (data18 === "m-search")) || (data18 === "merge")) || (data18 === "mkactivity")) || (data18 === "mkcalendar")) || (data18 === "mkcol")) || (data18 === "move")) || (data18 === "notify")) || (data18 === "options")) || (data18 === "patch")) || (data18 === "post")) || (data18 === "propfind")) || (data18 === "proppatch")) || (data18 === "purge")) || (data18 === "put")) || (data18 === "rebind")) || (data18 === "report")) || (data18 === "search")) || (data18 === "source")) || (data18 === "subscribe")) || (data18 === "trace")) || (data18 === "unbind")) || (data18 === "unlink")) || (data18 === "unlock")) || (data18 === "unsubscribe"))){
validate10.errors = [{instancePath:instancePath+"/method",schemaPath:"#/properties/method/enum",keyword:"enum",params:{allowedValues: schema11.properties.method.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid1 = _errs58 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.validate !== undefined){
let data19 = data.validate;
const _errs60 = errors;
if(typeof data19 !== "boolean"){
let coerced16 = undefined;
if(!(coerced16 !== undefined)){
if(data19 === "false" || data19 === 0 || data19 === null){
coerced16 = false;
}
else if(data19 === "true" || data19 === 1){
coerced16 = true;
}
else {
validate10.errors = [{instancePath:instancePath+"/validate",schemaPath:"#/properties/validate/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
if(coerced16 !== undefined){
data19 = coerced16;
if(data !== undefined){
data["validate"] = coerced16;
}
}
}
var valid1 = _errs60 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate10.errors = vErrors;
return errors === 0;
}



/***/ }),
/* 160 */
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),
/* 161 */
/***/ ((module) => {

"use strict";
module.exports = require("@fastify/static");

/***/ }),
/* 162 */
/***/ ((module) => {

"use strict";
module.exports = require("@fastify/view");

/***/ }),
/* 163 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fp = __webpack_require__(164)
const {
  addAccessControlRequestHeadersToVaryHeader,
  addOriginToVaryHeader
} = __webpack_require__(165)

const defaultOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: false,
  exposedHeaders: null,
  allowedHeaders: null,
  maxAge: null,
  preflight: true,
  strictPreflight: true
}

function fastifyCors (fastify, opts, next) {
  fastify.decorateRequest('corsPreflightEnabled', false)

  let hideOptionsRoute = true
  if (typeof opts === 'function') {
    handleCorsOptionsDelegator(opts, fastify)
  } else {
    if (opts.hideOptionsRoute !== undefined) hideOptionsRoute = opts.hideOptionsRoute
    const corsOptions = Object.assign({}, defaultOptions, opts)
    fastify.addHook('onRequest', function onRequestCors (req, reply, next) {
      onRequest(fastify, corsOptions, req, reply, next)
    })
  }

  // The preflight reply must occur in the hook. This allows fastify-cors to reply to
  // preflight requests BEFORE possible authentication plugins. If the preflight reply
  // occurred in this handler, other plugins may deny the request since the browser will
  // remove most headers (such as the Authentication header).
  //
  // This route simply enables fastify to accept preflight requests.
  fastify.options('*', { schema: { hide: hideOptionsRoute } }, (req, reply) => {
    if (!req.corsPreflightEnabled) {
      // Do not handle preflight requests if the origin option disabled CORS
      reply.callNotFound()
      return
    }

    reply.send()
  })

  next()
}

function handleCorsOptionsDelegator (optionsResolver, fastify) {
  fastify.addHook('onRequest', function onRequestCors (req, reply, next) {
    if (optionsResolver.length === 2) {
      handleCorsOptionsCallbackDelegator(optionsResolver, fastify, req, reply, next)
      return
    } else {
      // handle delegator based on Promise
      const ret = optionsResolver(req)
      if (ret && typeof ret.then === 'function') {
        ret.then(options => Object.assign({}, defaultOptions, options))
          .then(corsOptions => onRequest(fastify, corsOptions, req, reply, next)).catch(next)
        return
      }
    }
    next(new Error('Invalid CORS origin option'))
  })
}

function handleCorsOptionsCallbackDelegator (optionsResolver, fastify, req, reply, next) {
  optionsResolver(req, (err, options) => {
    if (err) {
      next(err)
    } else {
      const corsOptions = Object.assign({}, defaultOptions, options)
      onRequest(fastify, corsOptions, req, reply, next)
    }
  })
}

function onRequest (fastify, options, req, reply, next) {
  // Always set Vary header
  // https://github.com/rs/cors/issues/10
  addOriginToVaryHeader(reply)
  const resolveOriginOption = typeof options.origin === 'function' ? resolveOriginWrapper(fastify, options.origin) : (_, cb) => cb(null, options.origin)

  resolveOriginOption(req, (error, resolvedOriginOption) => {
    if (error !== null) {
      return next(error)
    }

    // Disable CORS and preflight if false
    if (resolvedOriginOption === false) {
      return next()
    }

    // Falsy values are invalid
    if (!resolvedOriginOption) {
      return next(new Error('Invalid CORS origin option'))
    }

    addCorsHeaders(req, reply, resolvedOriginOption, options)

    if (req.raw.method === 'OPTIONS' && options.preflight === true) {
      // Strict mode enforces the required headers for preflight
      if (options.strictPreflight === true && (!req.headers.origin || !req.headers['access-control-request-method'])) {
        reply.status(400).type('text/plain').send('Invalid Preflight Request')
        return
      }

      req.corsPreflightEnabled = true

      addPreflightHeaders(req, reply, options)

      if (!options.preflightContinue) {
        // Do not call the hook callback and terminate the request
        // Safari (and potentially other browsers) need content-length 0,
        // for 204 or they just hang waiting for a body
        reply
          .code(options.optionsSuccessStatus)
          .header('Content-Length', '0')
          .send()
        return
      }
    }

    return next()
  })
}

function addCorsHeaders (req, reply, originOption, corsOptions) {
  const origin = getAccessControlAllowOriginHeader(req.headers.origin, originOption)
  // In the case of origin not allowed the header is not
  // written in the response.
  // https://github.com/fastify/fastify-cors/issues/127
  if (origin) {
    reply.header('Access-Control-Allow-Origin', origin)
  }

  if (corsOptions.credentials) {
    reply.header('Access-Control-Allow-Credentials', 'true')
  }

  if (corsOptions.exposedHeaders !== null) {
    reply.header(
      'Access-Control-Expose-Headers',
      Array.isArray(corsOptions.exposedHeaders) ? corsOptions.exposedHeaders.join(', ') : corsOptions.exposedHeaders
    )
  }
}

function addPreflightHeaders (req, reply, corsOptions) {
  reply.header(
    'Access-Control-Allow-Methods',
    Array.isArray(corsOptions.methods) ? corsOptions.methods.join(', ') : corsOptions.methods
  )

  if (corsOptions.allowedHeaders === null) {
    addAccessControlRequestHeadersToVaryHeader(reply)
    const reqAllowedHeaders = req.headers['access-control-request-headers']
    if (reqAllowedHeaders !== undefined) {
      reply.header('Access-Control-Allow-Headers', reqAllowedHeaders)
    }
  } else {
    reply.header(
      'Access-Control-Allow-Headers',
      Array.isArray(corsOptions.allowedHeaders) ? corsOptions.allowedHeaders.join(', ') : corsOptions.allowedHeaders
    )
  }

  if (corsOptions.maxAge !== null) {
    reply.header('Access-Control-Max-Age', String(corsOptions.maxAge))
  }
}

function resolveOriginWrapper (fastify, origin) {
  return function (req, cb) {
    const result = origin.call(fastify, req.headers.origin, cb)

    // Allow for promises
    if (result && typeof result.then === 'function') {
      result.then(res => cb(null, res), cb)
    }
  }
}

function getAccessControlAllowOriginHeader (reqOrigin, originOption) {
  if (originOption === '*') {
    // allow any origin
    return '*'
  }

  if (typeof originOption === 'string') {
    // fixed origin
    return originOption
  }

  // reflect origin
  return isRequestOriginAllowed(reqOrigin, originOption) ? reqOrigin : false
}

function isRequestOriginAllowed (reqOrigin, allowedOrigin) {
  if (Array.isArray(allowedOrigin)) {
    for (let i = 0; i < allowedOrigin.length; ++i) {
      if (isRequestOriginAllowed(reqOrigin, allowedOrigin[i])) {
        return true
      }
    }
    return false
  } else if (typeof allowedOrigin === 'string') {
    return reqOrigin === allowedOrigin
  } else if (allowedOrigin instanceof RegExp) {
    allowedOrigin.lastIndex = 0
    return allowedOrigin.test(reqOrigin)
  } else {
    return !!allowedOrigin
  }
}

module.exports = fp(fastifyCors, {
  fastify: '4.x',
  name: '@fastify/cors'
})


/***/ }),
/* 164 */
/***/ ((module) => {

"use strict";
module.exports = require("fastify-plugin");

/***/ }),
/* 165 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const LRUCache = (__webpack_require__(166).LRUCache)

/**
 * Field Value Components
 * Most HTTP header field values are defined using common syntax
 * components (token, quoted-string, and comment) separated by
 * whitespace or specific delimiting characters.  Delimiters are chosen
 * from the set of US-ASCII visual characters not allowed in a token
 * (DQUOTE and "(),/:;<=>?@[\]{}").
 *
 * field-name    = token
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
 */

const validFieldnameRE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/
function validateFieldname (fieldname) {
  if (validFieldnameRE.test(fieldname) === false) {
    throw new TypeError('Fieldname contains invalid characters.')
  }
}

function parse (header) {
  header = header.trim().toLowerCase()
  const result = []

  if (header.length === 0) {
    // pass through
  } else if (header.indexOf(',') === -1) {
    result.push(header)
  } else {
    const il = header.length
    let i = 0
    let pos = 0
    let char

    // tokenize the header
    for (i = 0; i < il; ++i) {
      char = header[i]
      // when we have whitespace set the pos to the next position
      if (char === ' ') {
        pos = i + 1
      // `,` is the separator of vary-values
      } else if (char === ',') {
        // if pos and current position are not the same we have a valid token
        if (pos !== i) {
          result.push(header.slice(pos, i))
        }
        // reset the positions
        pos = i + 1
      }
    }

    if (pos !== i) {
      result.push(header.slice(pos, i))
    }
  }

  return result
}

function createAddFieldnameToVary (fieldname) {
  const headerCache = new LRUCache(1000)

  validateFieldname(fieldname)

  return function (reply) {
    let header = reply.getHeader('Vary')

    if (!header) {
      reply.header('Vary', fieldname)
      return
    }

    if (header === '*') {
      return
    }

    if (fieldname === '*') {
      reply.header('Vary', '*')
      return
    }

    if (Array.isArray(header)) {
      header = header.join(', ')
    }

    if (!headerCache.has(header)) {
      const vals = parse(header)

      if (vals.indexOf('*') !== -1) {
        headerCache.set(header, '*')
      } else if (vals.indexOf(fieldname.toLowerCase()) === -1) {
        headerCache.set(header, header + ', ' + fieldname)
      } else {
        headerCache.set(header, null)
      }
    }
    const cached = headerCache.get(header)
    if (cached !== null) {
      reply.header('Vary', cached)
    }
  }
}

module.exports.createAddFieldnameToVary = createAddFieldnameToVary
module.exports.addOriginToVaryHeader = createAddFieldnameToVary('Origin')
module.exports.addAccessControlRequestHeadersToVaryHeader = createAddFieldnameToVary('Access-Control-Request-Headers')
module.exports.parse = parse


/***/ }),
/* 166 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Library Endpoint
 * ===========================
 *
 * Exporting every data structure through a unified endpoint. Consumers
 * of this library should prefer the modular access though.
 */
var Heap = __webpack_require__(167),
    FibonacciHeap = __webpack_require__(173),
    SuffixArray = __webpack_require__(174);

module.exports = {
  BiMap: __webpack_require__(175),
  BitSet: __webpack_require__(176),
  BitVector: __webpack_require__(179),
  BloomFilter: __webpack_require__(180),
  BKTree: __webpack_require__(182),
  CircularBuffer: __webpack_require__(183),
  DefaultMap: __webpack_require__(185),
  DefaultWeakMap: __webpack_require__(186),
  FixedDeque: __webpack_require__(184),
  StaticDisjointSet: __webpack_require__(187),
  FibonacciHeap: FibonacciHeap,
  MinFibonacciHeap: FibonacciHeap.MinFibonacciHeap,
  MaxFibonacciHeap: FibonacciHeap.MaxFibonacciHeap,
  FixedReverseHeap: __webpack_require__(188),
  FuzzyMap: __webpack_require__(189),
  FuzzyMultiMap: __webpack_require__(190),
  HashedArrayTree: __webpack_require__(192),
  Heap: Heap,
  MinHeap: Heap.MinHeap,
  MaxHeap: Heap.MaxHeap,
  StaticIntervalTree: __webpack_require__(193),
  InvertedIndex: __webpack_require__(195),
  KDTree: __webpack_require__(198),
  LinkedList: __webpack_require__(200),
  LRUCache: __webpack_require__(201),
  LRUCacheWithDelete: __webpack_require__(202),
  LRUMap: __webpack_require__(203),
  LRUMapWithDelete: __webpack_require__(204),
  MultiMap: __webpack_require__(191),
  MultiSet: __webpack_require__(205),
  PassjoinIndex: __webpack_require__(206),
  Queue: __webpack_require__(207),
  FixedStack: __webpack_require__(194),
  Stack: __webpack_require__(208),
  SuffixArray: SuffixArray,
  GeneralizedSuffixArray: SuffixArray.GeneralizedSuffixArray,
  Set: __webpack_require__(209),
  SparseQueueSet: __webpack_require__(210),
  SparseMap: __webpack_require__(211),
  SparseSet: __webpack_require__(212),
  SymSpell: __webpack_require__(213),
  Trie: __webpack_require__(214),
  TrieMap: __webpack_require__(215),
  Vector: __webpack_require__(216),
  VPTree: __webpack_require__(217)
};


/***/ }),
/* 167 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Binary Heap
 * ======================
 *
 * Binary heap implementation.
 */
var forEach = __webpack_require__(168),
    comparators = __webpack_require__(170),
    iterables = __webpack_require__(171);

var DEFAULT_COMPARATOR = comparators.DEFAULT_COMPARATOR,
    reverseComparator = comparators.reverseComparator;

/**
 * Heap helper functions.
 */

/**
 * Function used to sift down.
 *
 * @param {function} compare    - Comparison function.
 * @param {array}    heap       - Array storing the heap's data.
 * @param {number}   startIndex - Starting index.
 * @param {number}   i          - Index.
 */
function siftDown(compare, heap, startIndex, i) {
  var item = heap[i],
      parentIndex,
      parent;

  while (i > startIndex) {
    parentIndex = (i - 1) >> 1;
    parent = heap[parentIndex];

    if (compare(item, parent) < 0) {
      heap[i] = parent;
      i = parentIndex;
      continue;
    }

    break;
  }

  heap[i] = item;
}

/**
 * Function used to sift up.
 *
 * @param {function} compare - Comparison function.
 * @param {array}    heap    - Array storing the heap's data.
 * @param {number}   i       - Index.
 */
function siftUp(compare, heap, i) {
  var endIndex = heap.length,
      startIndex = i,
      item = heap[i],
      childIndex = 2 * i + 1,
      rightIndex;

  while (childIndex < endIndex) {
    rightIndex = childIndex + 1;

    if (
      rightIndex < endIndex &&
      compare(heap[childIndex], heap[rightIndex]) >= 0
    ) {
      childIndex = rightIndex;
    }

    heap[i] = heap[childIndex];
    i = childIndex;
    childIndex = 2 * i + 1;
  }

  heap[i] = item;
  siftDown(compare, heap, startIndex, i);
}

/**
 * Function used to push an item into a heap represented by a raw array.
 *
 * @param {function} compare - Comparison function.
 * @param {array}    heap    - Array storing the heap's data.
 * @param {any}      item    - Item to push.
 */
function push(compare, heap, item) {
  heap.push(item);
  siftDown(compare, heap, 0, heap.length - 1);
}

/**
 * Function used to pop an item from a heap represented by a raw array.
 *
 * @param  {function} compare - Comparison function.
 * @param  {array}    heap    - Array storing the heap's data.
 * @return {any}
 */
function pop(compare, heap) {
  var lastItem = heap.pop();

  if (heap.length !== 0) {
    var item = heap[0];
    heap[0] = lastItem;
    siftUp(compare, heap, 0);

    return item;
  }

  return lastItem;
}

/**
 * Function used to pop the heap then push a new value into it, thus "replacing"
 * it.
 *
 * @param  {function} compare - Comparison function.
 * @param  {array}    heap    - Array storing the heap's data.
 * @param  {any}      item    - The item to push.
 * @return {any}
 */
function replace(compare, heap, item) {
  if (heap.length === 0)
    throw new Error('mnemonist/heap.replace: cannot pop an empty heap.');

  var popped = heap[0];
  heap[0] = item;
  siftUp(compare, heap, 0);

  return popped;
}

/**
 * Function used to push an item in the heap then pop the heap and return the
 * popped value.
 *
 * @param  {function} compare - Comparison function.
 * @param  {array}    heap    - Array storing the heap's data.
 * @param  {any}      item    - The item to push.
 * @return {any}
 */
function pushpop(compare, heap, item) {
  var tmp;

  if (heap.length !== 0 && compare(heap[0], item) < 0) {
    tmp = heap[0];
    heap[0] = item;
    item = tmp;
    siftUp(compare, heap, 0);
  }

  return item;
}

/**
 * Converts and array into an abstract heap in linear time.
 *
 * @param {function} compare - Comparison function.
 * @param {array}    array   - Target array.
 */
function heapify(compare, array) {
  var n = array.length,
      l = n >> 1,
      i = l;

  while (--i >= 0)
    siftUp(compare, array, i);
}

/**
 * Fully consumes the given heap.
 *
 * @param  {function} compare - Comparison function.
 * @param  {array}    heap    - Array storing the heap's data.
 * @return {array}
 */
function consume(compare, heap) {
  var l = heap.length,
      i = 0;

  var array = new Array(l);

  while (i < l)
    array[i++] = pop(compare, heap);

  return array;
}

/**
 * Function used to retrieve the n smallest items from the given iterable.
 *
 * @param {function} compare  - Comparison function.
 * @param {number}   n        - Number of top items to retrieve.
 * @param {any}      iterable - Arbitrary iterable.
 * @param {array}
 */
function nsmallest(compare, n, iterable) {
  if (arguments.length === 2) {
    iterable = n;
    n = compare;
    compare = DEFAULT_COMPARATOR;
  }

  var reverseCompare = reverseComparator(compare);

  var i, l, v;

  var min = Infinity;

  var result;

  // If n is equal to 1, it's just a matter of finding the minimum
  if (n === 1) {
    if (iterables.isArrayLike(iterable)) {
      for (i = 0, l = iterable.length; i < l; i++) {
        v = iterable[i];

        if (min === Infinity || compare(v, min) < 0)
          min = v;
      }

      result = new iterable.constructor(1);
      result[0] = min;

      return result;
    }

    forEach(iterable, function(value) {
      if (min === Infinity || compare(value, min) < 0)
        min = value;
    });

    return [min];
  }

  if (iterables.isArrayLike(iterable)) {

    // If n > iterable length, we just clone and sort
    if (n >= iterable.length)
      return iterable.slice().sort(compare);

    result = iterable.slice(0, n);
    heapify(reverseCompare, result);

    for (i = n, l = iterable.length; i < l; i++)
      if (reverseCompare(iterable[i], result[0]) > 0)
        replace(reverseCompare, result, iterable[i]);

    // NOTE: if n is over some number, it becomes faster to consume the heap
    return result.sort(compare);
  }

  // Correct for size
  var size = iterables.guessLength(iterable);

  if (size !== null && size < n)
    n = size;

  result = new Array(n);
  i = 0;

  forEach(iterable, function(value) {
    if (i < n) {
      result[i] = value;
    }
    else {
      if (i === n)
        heapify(reverseCompare, result);

      if (reverseCompare(value, result[0]) > 0)
        replace(reverseCompare, result, value);
    }

    i++;
  });

  if (result.length > i)
    result.length = i;

  // NOTE: if n is over some number, it becomes faster to consume the heap
  return result.sort(compare);
}

/**
 * Function used to retrieve the n largest items from the given iterable.
 *
 * @param {function} compare  - Comparison function.
 * @param {number}   n        - Number of top items to retrieve.
 * @param {any}      iterable - Arbitrary iterable.
 * @param {array}
 */
function nlargest(compare, n, iterable) {
  if (arguments.length === 2) {
    iterable = n;
    n = compare;
    compare = DEFAULT_COMPARATOR;
  }

  var reverseCompare = reverseComparator(compare);

  var i, l, v;

  var max = -Infinity;

  var result;

  // If n is equal to 1, it's just a matter of finding the maximum
  if (n === 1) {
    if (iterables.isArrayLike(iterable)) {
      for (i = 0, l = iterable.length; i < l; i++) {
        v = iterable[i];

        if (max === -Infinity || compare(v, max) > 0)
          max = v;
      }

      result = new iterable.constructor(1);
      result[0] = max;

      return result;
    }

    forEach(iterable, function(value) {
      if (max === -Infinity || compare(value, max) > 0)
        max = value;
    });

    return [max];
  }

  if (iterables.isArrayLike(iterable)) {

    // If n > iterable length, we just clone and sort
    if (n >= iterable.length)
      return iterable.slice().sort(reverseCompare);

    result = iterable.slice(0, n);
    heapify(compare, result);

    for (i = n, l = iterable.length; i < l; i++)
      if (compare(iterable[i], result[0]) > 0)
        replace(compare, result, iterable[i]);

    // NOTE: if n is over some number, it becomes faster to consume the heap
    return result.sort(reverseCompare);
  }

  // Correct for size
  var size = iterables.guessLength(iterable);

  if (size !== null && size < n)
    n = size;

  result = new Array(n);
  i = 0;

  forEach(iterable, function(value) {
    if (i < n) {
      result[i] = value;
    }
    else {
      if (i === n)
        heapify(compare, result);

      if (compare(value, result[0]) > 0)
        replace(compare, result, value);
    }

    i++;
  });

  if (result.length > i)
    result.length = i;

  // NOTE: if n is over some number, it becomes faster to consume the heap
  return result.sort(reverseCompare);
}

/**
 * Binary Minimum Heap.
 *
 * @constructor
 * @param {function} comparator - Comparator function to use.
 */
function Heap(comparator) {
  this.clear();
  this.comparator = comparator || DEFAULT_COMPARATOR;

  if (typeof this.comparator !== 'function')
    throw new Error('mnemonist/Heap.constructor: given comparator should be a function.');
}

/**
 * Method used to clear the heap.
 *
 * @return {undefined}
 */
Heap.prototype.clear = function() {

  // Properties
  this.items = [];
  this.size = 0;
};

/**
 * Method used to push an item into the heap.
 *
 * @param  {any}    item - Item to push.
 * @return {number}
 */
Heap.prototype.push = function(item) {
  push(this.comparator, this.items, item);
  return ++this.size;
};

/**
 * Method used to retrieve the "first" item of the heap.
 *
 * @return {any}
 */
Heap.prototype.peek = function() {
  return this.items[0];
};

/**
 * Method used to retrieve & remove the "first" item of the heap.
 *
 * @return {any}
 */
Heap.prototype.pop = function() {
  if (this.size !== 0)
    this.size--;

  return pop(this.comparator, this.items);
};

/**
 * Method used to pop the heap, then push an item and return the popped
 * item.
 *
 * @param  {any} item - Item to push into the heap.
 * @return {any}
 */
Heap.prototype.replace = function(item) {
  return replace(this.comparator, this.items, item);
};

/**
 * Method used to push the heap, the pop it and return the pooped item.
 *
 * @param  {any} item - Item to push into the heap.
 * @return {any}
 */
Heap.prototype.pushpop = function(item) {
  return pushpop(this.comparator, this.items, item);
};

/**
 * Method used to consume the heap fully and return its items as a sorted array.
 *
 * @return {array}
 */
Heap.prototype.consume = function() {
  this.size = 0;
  return consume(this.comparator, this.items);
};

/**
 * Method used to convert the heap to an array. Note that it basically clone
 * the heap and consumes it completely. This is hardly performant.
 *
 * @return {array}
 */
Heap.prototype.toArray = function() {
  return consume(this.comparator, this.items.slice());
};

/**
 * Convenience known methods.
 */
Heap.prototype.inspect = function() {
  var proxy = this.toArray();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: Heap,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  Heap.prototype[Symbol.for('nodejs.util.inspect.custom')] = Heap.prototype.inspect;

/**
 * Binary Maximum Heap.
 *
 * @constructor
 * @param {function} comparator - Comparator function to use.
 */
function MaxHeap(comparator) {
  this.clear();
  this.comparator = comparator || DEFAULT_COMPARATOR;

  if (typeof this.comparator !== 'function')
    throw new Error('mnemonist/MaxHeap.constructor: given comparator should be a function.');

  this.comparator = reverseComparator(this.comparator);
}

MaxHeap.prototype = Heap.prototype;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a heap.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {function} comparator - Custom comparator function.
 * @return {Heap}
 */
Heap.from = function(iterable, comparator) {
  var heap = new Heap(comparator);

  var items;

  // If iterable is an array, we can be clever about it
  if (iterables.isArrayLike(iterable))
    items = iterable.slice();
  else
    items = iterables.toArray(iterable);

  heapify(heap.comparator, items);
  heap.items = items;
  heap.size = items.length;

  return heap;
};

MaxHeap.from = function(iterable, comparator) {
  var heap = new MaxHeap(comparator);

  var items;

  // If iterable is an array, we can be clever about it
  if (iterables.isArrayLike(iterable))
    items = iterable.slice();
  else
    items = iterables.toArray(iterable);

  heapify(heap.comparator, items);
  heap.items = items;
  heap.size = items.length;

  return heap;
};

/**
 * Exporting.
 */
Heap.siftUp = siftUp;
Heap.siftDown = siftDown;
Heap.push = push;
Heap.pop = pop;
Heap.replace = replace;
Heap.pushpop = pushpop;
Heap.heapify = heapify;
Heap.consume = consume;

Heap.nsmallest = nsmallest;
Heap.nlargest = nlargest;

Heap.MinHeap = Heap;
Heap.MaxHeap = MaxHeap;

module.exports = Heap;


/***/ }),
/* 168 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Obliterator ForEach Function
 * =============================
 *
 * Helper function used to easily iterate over mixed values.
 */
var support = __webpack_require__(169);

var ARRAY_BUFFER_SUPPORT = support.ARRAY_BUFFER_SUPPORT;
var SYMBOL_SUPPORT = support.SYMBOL_SUPPORT;

/**
 * Function able to iterate over almost any iterable JS value.
 *
 * @param  {any}      iterable - Iterable value.
 * @param  {function} callback - Callback function.
 */
module.exports = function forEach(iterable, callback) {
  var iterator, k, i, l, s;

  if (!iterable) throw new Error('obliterator/forEach: invalid iterable.');

  if (typeof callback !== 'function')
    throw new Error('obliterator/forEach: expecting a callback.');

  // The target is an array or a string or function arguments
  if (
    Array.isArray(iterable) ||
    (ARRAY_BUFFER_SUPPORT && ArrayBuffer.isView(iterable)) ||
    typeof iterable === 'string' ||
    iterable.toString() === '[object Arguments]'
  ) {
    for (i = 0, l = iterable.length; i < l; i++) callback(iterable[i], i);
    return;
  }

  // The target has a #.forEach method
  if (typeof iterable.forEach === 'function') {
    iterable.forEach(callback);
    return;
  }

  // The target is iterable
  if (
    SYMBOL_SUPPORT &&
    Symbol.iterator in iterable &&
    typeof iterable.next !== 'function'
  ) {
    iterable = iterable[Symbol.iterator]();
  }

  // The target is an iterator
  if (typeof iterable.next === 'function') {
    iterator = iterable;
    i = 0;

    while (((s = iterator.next()), s.done !== true)) {
      callback(s.value, i);
      i++;
    }

    return;
  }

  // The target is a plain object
  for (k in iterable) {
    if (iterable.hasOwnProperty(k)) {
      callback(iterable[k], k);
    }
  }

  return;
};


/***/ }),
/* 169 */
/***/ ((__unused_webpack_module, exports) => {

exports.ARRAY_BUFFER_SUPPORT = typeof ArrayBuffer !== 'undefined';
exports.SYMBOL_SUPPORT = typeof Symbol !== 'undefined';


/***/ }),
/* 170 */
/***/ ((__unused_webpack_module, exports) => {

/**
 * Mnemonist Heap Comparators
 * ===========================
 *
 * Default comparators & functions dealing with comparators reversing etc.
 */
var DEFAULT_COMPARATOR = function(a, b) {
  if (a < b)
    return -1;
  if (a > b)
    return 1;

  return 0;
};

var DEFAULT_REVERSE_COMPARATOR = function(a, b) {
  if (a < b)
    return 1;
  if (a > b)
    return -1;

  return 0;
};

/**
 * Function used to reverse a comparator.
 */
function reverseComparator(comparator) {
  return function(a, b) {
    return comparator(b, a);
  };
}

/**
 * Function returning a tuple comparator.
 */
function createTupleComparator(size) {
  if (size === 2) {
    return function(a, b) {
      if (a[0] < b[0])
        return -1;

      if (a[0] > b[0])
        return 1;

      if (a[1] < b[1])
        return -1;

      if (a[1] > b[1])
        return 1;

      return 0;
    };
  }

  return function(a, b) {
    var i = 0;

    while (i < size) {
      if (a[i] < b[i])
        return -1;

      if (a[i] > b[i])
        return 1;

      i++;
    }

    return 0;
  };
}

/**
 * Exporting.
 */
exports.DEFAULT_COMPARATOR = DEFAULT_COMPARATOR;
exports.DEFAULT_REVERSE_COMPARATOR = DEFAULT_REVERSE_COMPARATOR;
exports.reverseComparator = reverseComparator;
exports.createTupleComparator = createTupleComparator;


/***/ }),
/* 171 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * Mnemonist Iterable Function
 * ============================
 *
 * Harmonized iteration helpers over mixed iterable targets.
 */
var forEach = __webpack_require__(168);

var typed = __webpack_require__(172);

/**
 * Function used to determine whether the given object supports array-like
 * random access.
 *
 * @param  {any} target - Target object.
 * @return {boolean}
 */
function isArrayLike(target) {
  return Array.isArray(target) || typed.isTypedArray(target);
}

/**
 * Function used to guess the length of the structure over which we are going
 * to iterate.
 *
 * @param  {any} target - Target object.
 * @return {number|undefined}
 */
function guessLength(target) {
  if (typeof target.length === 'number')
    return target.length;

  if (typeof target.size === 'number')
    return target.size;

  return;
}

/**
 * Function used to convert an iterable to an array.
 *
 * @param  {any}   target - Iteration target.
 * @return {array}
 */
function toArray(target) {
  var l = guessLength(target);

  var array = typeof l === 'number' ? new Array(l) : [];

  var i = 0;

  // TODO: we could optimize when given target is array like
  forEach(target, function(value) {
    array[i++] = value;
  });

  return array;
}

/**
 * Same as above but returns a supplementary indices array.
 *
 * @param  {any}   target - Iteration target.
 * @return {array}
 */
function toArrayWithIndices(target) {
  var l = guessLength(target);

  var IndexArray = typeof l === 'number' ?
    typed.getPointerArray(l) :
    Array;

  var array = typeof l === 'number' ? new Array(l) : [];
  var indices = typeof l === 'number' ? new IndexArray(l) : [];

  var i = 0;

  // TODO: we could optimize when given target is array like
  forEach(target, function(value) {
    array[i] = value;
    indices[i] = i++;
  });

  return [array, indices];
}

/**
 * Exporting.
 */
exports.isArrayLike = isArrayLike;
exports.guessLength = guessLength;
exports.toArray = toArray;
exports.toArrayWithIndices = toArrayWithIndices;


/***/ }),
/* 172 */
/***/ ((__unused_webpack_module, exports) => {

/**
 * Mnemonist Typed Array Helpers
 * ==============================
 *
 * Miscellaneous helpers related to typed arrays.
 */

/**
 * When using an unsigned integer array to store pointers, one might want to
 * choose the optimal word size in regards to the actual numbers of pointers
 * to store.
 *
 * This helpers does just that.
 *
 * @param  {number} size - Expected size of the array to map.
 * @return {TypedArray}
 */
var MAX_8BIT_INTEGER = Math.pow(2, 8) - 1,
    MAX_16BIT_INTEGER = Math.pow(2, 16) - 1,
    MAX_32BIT_INTEGER = Math.pow(2, 32) - 1;

var MAX_SIGNED_8BIT_INTEGER = Math.pow(2, 7) - 1,
    MAX_SIGNED_16BIT_INTEGER = Math.pow(2, 15) - 1,
    MAX_SIGNED_32BIT_INTEGER = Math.pow(2, 31) - 1;

exports.getPointerArray = function(size) {
  var maxIndex = size - 1;

  if (maxIndex <= MAX_8BIT_INTEGER)
    return Uint8Array;

  if (maxIndex <= MAX_16BIT_INTEGER)
    return Uint16Array;

  if (maxIndex <= MAX_32BIT_INTEGER)
    return Uint32Array;

  throw new Error('mnemonist: Pointer Array of size > 4294967295 is not supported.');
};

exports.getSignedPointerArray = function(size) {
  var maxIndex = size - 1;

  if (maxIndex <= MAX_SIGNED_8BIT_INTEGER)
    return Int8Array;

  if (maxIndex <= MAX_SIGNED_16BIT_INTEGER)
    return Int16Array;

  if (maxIndex <= MAX_SIGNED_32BIT_INTEGER)
    return Int32Array;

  return Float64Array;
};

/**
 * Function returning the minimal type able to represent the given number.
 *
 * @param  {number} value - Value to test.
 * @return {TypedArrayClass}
 */
exports.getNumberType = function(value) {

  // <= 32 bits itnteger?
  if (value === (value | 0)) {

    // Negative
    if (Math.sign(value) === -1) {
      if (value <= 127 && value >= -128)
        return Int8Array;

      if (value <= 32767 && value >= -32768)
        return Int16Array;

      return Int32Array;
    }
    else {

      if (value <= 255)
        return Uint8Array;

      if (value <= 65535)
        return Uint16Array;

      return Uint32Array;
    }
  }

  // 53 bits integer & floats
  // NOTE: it's kinda hard to tell whether we could use 32bits or not...
  return Float64Array;
};

/**
 * Function returning the minimal type able to represent the given array
 * of JavaScript numbers.
 *
 * @param  {array}    array  - Array to represent.
 * @param  {function} getter - Optional getter.
 * @return {TypedArrayClass}
 */
var TYPE_PRIORITY = {
  Uint8Array: 1,
  Int8Array: 2,
  Uint16Array: 3,
  Int16Array: 4,
  Uint32Array: 5,
  Int32Array: 6,
  Float32Array: 7,
  Float64Array: 8
};

// TODO: make this a one-shot for one value
exports.getMinimalRepresentation = function(array, getter) {
  var maxType = null,
      maxPriority = 0,
      p,
      t,
      v,
      i,
      l;

  for (i = 0, l = array.length; i < l; i++) {
    v = getter ? getter(array[i]) : array[i];
    t = exports.getNumberType(v);
    p = TYPE_PRIORITY[t.name];

    if (p > maxPriority) {
      maxPriority = p;
      maxType = t;
    }
  }

  return maxType;
};

/**
 * Function returning whether the given value is a typed array.
 *
 * @param  {any} value - Value to test.
 * @return {boolean}
 */
exports.isTypedArray = function(value) {
  return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(value);
};

/**
 * Function used to concat byte arrays.
 *
 * @param  {...ByteArray}
 * @return {ByteArray}
 */
exports.concat = function() {
  var length = 0,
      i,
      o,
      l;

  for (i = 0, l = arguments.length; i < l; i++)
    length += arguments[i].length;

  var array = new (arguments[0].constructor)(length);

  for (i = 0, o = 0; i < l; i++) {
    array.set(arguments[i], o);
    o += arguments[i].length;
  }

  return array;
};

/**
 * Function used to initialize a byte array of indices.
 *
 * @param  {number}    length - Length of target.
 * @return {ByteArray}
 */
exports.indices = function(length) {
  var PointerArray = exports.getPointerArray(length);

  var array = new PointerArray(length);

  for (var i = 0; i < length; i++)
    array[i] = i;

  return array;
};


/***/ }),
/* 173 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint no-constant-condition: 0 */
/**
 * Mnemonist Fibonacci Heap
 * =========================
 *
 * Fibonacci heap implementation.
 */
var comparators = __webpack_require__(170),
    forEach = __webpack_require__(168);

var DEFAULT_COMPARATOR = comparators.DEFAULT_COMPARATOR,
    reverseComparator = comparators.reverseComparator;

/**
 * Fibonacci Heap.
 *
 * @constructor
 */
function FibonacciHeap(comparator) {
  this.clear();
  this.comparator = comparator || DEFAULT_COMPARATOR;

  if (typeof this.comparator !== 'function')
    throw new Error('mnemonist/FibonacciHeap.constructor: given comparator should be a function.');
}

/**
 * Method used to clear the heap.
 *
 * @return {undefined}
 */
FibonacciHeap.prototype.clear = function() {

  // Properties
  this.root = null;
  this.min = null;
  this.size = 0;
};

/**
 * Function used to create a node.
 *
 * @param  {any}    item - Target item.
 * @return {object}
 */
function createNode(item) {
  return {
    item: item,
    degree: 0
  };
}

/**
 * Function used to merge the given node with the root list.
 *
 * @param {FibonacciHeap} heap - Target heap.
 * @param {Node}          node - Target node.
 */
function mergeWithRoot(heap, node) {
  if (!heap.root) {
    heap.root = node;
  }
  else {
    node.right = heap.root.right;
    node.left = heap.root;
    heap.root.right.left = node;
    heap.root.right = node;
  }
}

/**
 * Method used to push an item into the heap.
 *
 * @param  {any}    item - Item to push.
 * @return {number}
 */
FibonacciHeap.prototype.push = function(item) {
  var node = createNode(item);
  node.left = node;
  node.right = node;
  mergeWithRoot(this, node);

  if (!this.min || this.comparator(node.item, this.min.item) <= 0)
    this.min = node;

  return ++this.size;
};

/**
 * Method used to get the "first" item of the heap.
 *
 * @return {any}
 */
FibonacciHeap.prototype.peek = function() {
  return this.min ? this.min.item : undefined;
};

/**
 * Function used to consume the given linked list.
 *
 * @param {Node} head - Head node.
 * @param {array}
 */
function consumeLinkedList(head) {
  var nodes = [],
      node = head,
      flag = false;

  while (true) {
    if (node === head && flag)
      break;
    else if (node === head)
      flag = true;

    nodes.push(node);
    node = node.right;
  }

  return nodes;
}

/**
 * Function used to remove the target node from the root list.
 *
 * @param {FibonacciHeap} heap - Target heap.
 * @param {Node}          node - Target node.
 */
function removeFromRoot(heap, node) {
  if (heap.root === node)
    heap.root = node.right;
  node.left.right = node.right;
  node.right.left = node.left;
}

/**
 * Function used to merge the given node with the child list of a root node.
 *
 * @param {Node} parent - Parent node.
 * @param {Node} node   - Target node.
 */
function mergeWithChild(parent, node) {
  if (!parent.child) {
    parent.child = node;
  }
  else {
    node.right = parent.child.right;
    node.left = parent.child;
    parent.child.right.left = node;
    parent.child.right = node;
  }
}

/**
 * Function used to link one node to another in the root list.
 *
 * @param {FibonacciHeap} heap - Target heap.
 * @param {Node}          y - Y node.
 * @param {Node}          x - X node.
 */
function link(heap, y, x) {
  removeFromRoot(heap, y);
  y.left = y;
  y.right = y;
  mergeWithChild(x, y);
  x.degree++;
  y.parent = x;
}

/**
 * Function used to consolidate the heap.
 *
 * @param {FibonacciHeap} heap - Target heap.
 */
function consolidate(heap) {
  var A = new Array(heap.size),
      nodes = consumeLinkedList(heap.root),
      i, l, x, y, d, t;

  for (i = 0, l = nodes.length; i < l; i++) {
    x = nodes[i];
    d = x.degree;

    while (A[d]) {
      y = A[d];

      if (heap.comparator(x.item, y.item) > 0) {
        t = x;
        x = y;
        y = t;
      }

      link(heap, y, x);
      A[d] = null;
      d++;
    }

    A[d] = x;
  }

  for (i = 0; i < heap.size; i++) {
    if (A[i] && heap.comparator(A[i].item, heap.min.item) <= 0)
      heap.min = A[i];
  }
}

/**
 * Method used to retrieve & remove the "first" item of the heap.
 *
 * @return {any}
 */
FibonacciHeap.prototype.pop = function() {
  if (!this.size)
    return undefined;

  var z = this.min;

  if (z.child) {
    var nodes = consumeLinkedList(z.child),
        node,
        i,
        l;

    for (i = 0, l = nodes.length; i < l; i++) {
      node = nodes[i];

      mergeWithRoot(this, node);
      delete node.parent;
    }
  }

  removeFromRoot(this, z);

  if (z === z.right) {
    this.min = null;
    this.root = null;
  }
  else {
    this.min = z.right;
    consolidate(this);
  }

  this.size--;

  return z.item;
};

/**
 * Convenience known methods.
 */
FibonacciHeap.prototype.inspect = function() {
  var proxy = {
    size: this.size
  };

  if (this.min && 'item' in this.min)
    proxy.top = this.min.item;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: FibonacciHeap,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  FibonacciHeap.prototype[Symbol.for('nodejs.util.inspect.custom')] = FibonacciHeap.prototype.inspect;

/**
 * Fibonacci Maximum Heap.
 *
 * @constructor
 */
function MaxFibonacciHeap(comparator) {
  this.clear();
  this.comparator = comparator || DEFAULT_COMPARATOR;

  if (typeof this.comparator !== 'function')
    throw new Error('mnemonist/FibonacciHeap.constructor: given comparator should be a function.');

  this.comparator = reverseComparator(this.comparator);
}

MaxFibonacciHeap.prototype = FibonacciHeap.prototype;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a heap.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {function} comparator - Custom comparator function.
 * @return {FibonacciHeap}
 */
FibonacciHeap.from = function(iterable, comparator) {
  var heap = new FibonacciHeap(comparator);

  forEach(iterable, function(value) {
    heap.push(value);
  });

  return heap;
};

MaxFibonacciHeap.from = function(iterable, comparator) {
  var heap = new MaxFibonacciHeap(comparator);

  forEach(iterable, function(value) {
    heap.push(value);
  });

  return heap;
};

/**
 * Exporting.
 */
FibonacciHeap.MinFibonacciHeap = FibonacciHeap;
FibonacciHeap.MaxFibonacciHeap = MaxFibonacciHeap;
module.exports = FibonacciHeap;


/***/ }),
/* 174 */
/***/ ((module) => {

/**
 * Mnemonist Suffix Array
 * =======================
 *
 * Linear time implementation of a suffix array using the recursive
 * method by Karkkainen and Sanders.
 *
 * [References]:
 * https://www.cs.helsinki.fi/u/tpkarkka/publications/jacm05-revised.pdf
 * http://people.mpi-inf.mpg.de/~sanders/programs/suffix/
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.184.442&rep=rep1&type=pdf
 *
 * [Article]:
 * "Simple Linear Work Suffix Array Construction", Karkkainen and Sanders.
 *
 * [Note]:
 * A paper by Simon J. Puglisi, William F. Smyth & Andrew Turpin named
 * "The Performance of Linear Time Suffix Sorting Algorithms" seems to
 * prove that supralinear algorithm are in fact better faring for
 * "real" world use cases. It would be nice to check this out in JavaScript
 * because the high level of the language could change a lot to the fact.
 *
 * The current code is largely inspired by the following:
 * https://github.com/tixxit/suffixarray/blob/master/suffixarray.js
 */

/**
 * Constants.
 */
var SEPARATOR = '\u0001';

/**
 * Function used to sort the triples.
 *
 * @param {string|array} string - Padded sequence.
 * @param {array}        array  - Array to sort (will be mutated).
 * @param {number}       offset - Index offset.
 */
function sort(string, array, offset) {
  var l = array.length,
      buckets = [],
      i = l,
      j = -1,
      b,
      d = 0,
      bits;

  while (i--)
    j = Math.max(string[array[i] + offset], j);

  bits = j >> 24 && 32 || j >> 16 && 24 || j >> 8 && 16 || 8;

  for (; d < bits; d += 4) {
    for (i = 16; i--;)
      buckets[i] = [];
    for (i = l; i--;)
      buckets[((string[array[i] + offset]) >> d) & 15].push(array[i]);
    for (b = 0; b < 16; b++) {
      for (j = buckets[b].length; j--;)
        array[++i] = buckets[b][j];
    }
  }
}

/**
 * Comparison helper.
 */
function compare(string, lookup, m, n) {
  return (
    (string[m] - string[n]) ||
    (m % 3 === 2 ?
      (string[m + 1] - string[n + 1]) || (lookup[m + 2] - lookup[n + 2]) :
      (lookup[m + 1] - lookup[n + 1]))
  );
}

/**
 * Recursive function used to build the suffix tree in linear time.
 *
 * @param  {string|array} string - Padded sequence.
 * @param  {number}       l      - True length of sequence (unpadded).
 * @return {array}
 */
function build(string, l) {
  var a = [],
      b = [],
      al = (2 * l / 3) | 0,
      bl = l - al,
      r = (al + 1) >> 1,
      i = al,
      j = 0,
      k,
      lookup = [],
      result = [];

  if (l === 1)
    return [0];

  while (i--)
    a[i] = ((i * 3) >> 1) + 1;

  for (i = 3; i--;)
    sort(string, a, i);

  j = b[((a[0] / 3) | 0) + (a[0] % 3 === 1 ? 0 : r)] = 1;

  for (i = 1; i < al; i++) {
    if (string[a[i]] !== string[a[i - 1]] ||
        string[a[i] + 1] !== string[a[i - 1] + 1] ||
        string[a[i] + 2] !== string[a[i - 1] + 2])
      j++;

    b[((a[i] / 3) | 0) + (a[i] % 3 === 1 ? 0 : r)] = j;
  }

  if (j < al) {
    b = build(b, al);

    for (i = al; i--;)
      a[i] = b[i] < r ? b[i] * 3 + 1 : ((b[i] - r) * 3 + 2);
  }

  for (i = al; i--;)
    lookup[a[i]] = i;
  lookup[l] = -1;
  lookup[l + 1] = -2;

  b = l % 3 === 1 ? [l - 1] : [];

  for (i = 0; i < al; i++) {
    if (a[i] % 3 === 1)
      b.push(a[i] - 1);
  }

  sort(string, b, 0);

  for (i = 0, j = 0, k = 0; i < al && j < bl;)
    result[k++] = (
      compare(string, lookup, a[i], b[j]) < 0 ?
        a[i++] :
        b[j++]
    );

  while (i < al)
    result[k++] = a[i++];

  while (j < bl)
    result[k++] = b[j++];

  return result;
}

/**
 * Function used to create the array we are going to work on.
 *
 * @param  {string|array} target - Target sequence.
 * @return {array}
 */
function convert(target) {

  // Creating the alphabet array
  var length = target.length,
      paddingOffset = length % 3,
      array = new Array(length + paddingOffset),
      l,
      i;

  // If we have an arbitrary sequence, we need to transform it
  if (typeof target !== 'string') {
    var uniqueTokens = Object.create(null);

    for (i = 0; i < length; i++) {
      if (!uniqueTokens[target[i]])
        uniqueTokens[target[i]] = true;
    }

    var alphabet = Object.create(null),
        sortedUniqueTokens = Object.keys(uniqueTokens).sort();

    for (i = 0, l = sortedUniqueTokens.length; i < l; i++)
      alphabet[sortedUniqueTokens[i]] = i + 1;

    for (i = 0; i < length; i++) {
      array[i] = alphabet[target[i]];
    }
  }
  else {
    for (i = 0; i < length; i++)
      array[i] = target.charCodeAt(i);
  }

  // Padding the array
  for (; i < paddingOffset; i++)
    array[i] = 0;

  return array;
}

/**
 * Suffix Array.
 *
 * @constructor
 * @param {string|array} string - Sequence for which to build the suffix array.
 */
function SuffixArray(string) {

  // Properties
  this.hasArbitrarySequence = typeof string !== 'string';
  this.string = string;
  this.length = string.length;

  // Building the array
  this.array = build(convert(string), this.length);
}

/**
 * Convenience known methods.
 */
SuffixArray.prototype.toString = function() {
  return this.array.join(',');
};

SuffixArray.prototype.toJSON = function() {
  return this.array;
};

SuffixArray.prototype.inspect = function() {
  var array = new Array(this.length);

  for (var i = 0; i < this.length; i++)
    array[i] = this.string.slice(this.array[i]);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: SuffixArray,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  SuffixArray.prototype[Symbol.for('nodejs.util.inspect.custom')] = SuffixArray.prototype.inspect;

/**
 * Generalized Suffix Array.
 *
 * @constructor
 */
function GeneralizedSuffixArray(strings) {

  // Properties
  this.hasArbitrarySequence = typeof strings[0] !== 'string';
  this.size = strings.length;

  if (this.hasArbitrarySequence) {
    this.text = [];

    for (var i = 0, l = this.size; i < l; i++) {
      this.text.push.apply(this.text, strings[i]);

      if (i < l - 1)
        this.text.push(SEPARATOR);
    }
  }
  else {
    this.text = strings.join(SEPARATOR);
  }

  this.firstLength = strings[0].length;
  this.length = this.text.length;

  // Building the array
  this.array = build(convert(this.text), this.length);
}

/**
 * Method used to retrieve the longest common subsequence of the generalized
 * suffix array.
 *
 * @return {string|array}
 */
GeneralizedSuffixArray.prototype.longestCommonSubsequence = function() {
  var lcs = this.hasArbitrarySequence ? [] : '',
      lcp,
      i,
      j,
      s,
      t;

  for (i = 1; i < this.length; i++) {
    s = this.array[i];
    t = this.array[i - 1];

    if (s < this.firstLength &&
        t < this.firstLength)
      continue;

    if (s > this.firstLength &&
        t > this.firstLength)
      continue;

    lcp = Math.min(this.length - s, this.length - t);

    for (j = 0; j < lcp; j++) {
      if (this.text[s + j] !== this.text[t + j]) {
        lcp = j;
        break;
      }
    }

    if (lcp > lcs.length)
      lcs = this.text.slice(s, s + lcp);
  }

  return lcs;
};

/**
 * Convenience known methods.
 */
GeneralizedSuffixArray.prototype.toString = function() {
  return this.array.join(',');
};

GeneralizedSuffixArray.prototype.toJSON = function() {
  return this.array;
};

GeneralizedSuffixArray.prototype.inspect = function() {
  var array = new Array(this.length);

  for (var i = 0; i < this.length; i++)
    array[i] = this.text.slice(this.array[i]);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: GeneralizedSuffixArray,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  GeneralizedSuffixArray.prototype[Symbol.for('nodejs.util.inspect.custom')] = GeneralizedSuffixArray.prototype.inspect;

/**
 * Exporting.
 */
SuffixArray.GeneralizedSuffixArray = GeneralizedSuffixArray;
module.exports = SuffixArray;


/***/ }),
/* 175 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist BiMap
 * ================
 *
 * JavaScript implementation of a BiMap.
 */
var forEach = __webpack_require__(168);

/**
 * Inverse Map.
 *
 * @constructor
 */
function InverseMap(original) {

  this.size = 0;
  this.items = new Map();
  this.inverse = original;
}

/**
 * BiMap.
 *
 * @constructor
 */
function BiMap() {

  this.size = 0;
  this.items = new Map();
  this.inverse = new InverseMap(this);
}

/**
 * Method used to clear the map.
 *
 * @return {undefined}
 */
function clear() {
  this.size = 0;
  this.items.clear();
  this.inverse.items.clear();
}

BiMap.prototype.clear = clear;
InverseMap.prototype.clear = clear;

/**
 * Method used to set a relation.
 *
 * @param  {any} key - Key.
 * @param  {any} value - Value.
 * @return {BiMap|InverseMap}
 */
function set(key, value) {

  // First we need to attempt to see if the relation is not flawed
  if (this.items.has(key)) {
    var currentValue = this.items.get(key);

    // The relation already exists, we do nothing
    if (currentValue === value)
      return this;
    else
      this.inverse.items.delete(currentValue);
  }

  if (this.inverse.items.has(value)) {
    var currentKey = this.inverse.items.get(value);

    if (currentKey === key)
      return this;
    else
      this.items.delete(currentKey);
  }

  // Here we actually add the relation
  this.items.set(key, value);
  this.inverse.items.set(value, key);

  // Size
  this.size = this.items.size;
  this.inverse.size = this.inverse.items.size;

  return this;
}

BiMap.prototype.set = set;
InverseMap.prototype.set = set;

/**
 * Method used to delete a relation.
 *
 * @param  {any} key - Key.
 * @return {boolean}
 */
function del(key) {
  if (this.items.has(key)) {
    var currentValue = this.items.get(key);

    this.items.delete(key);
    this.inverse.items.delete(currentValue);

    // Size
    this.size = this.items.size;
    this.inverse.size = this.inverse.items.size;

    return true;
  }

  return false;
}

BiMap.prototype.delete = del;
InverseMap.prototype.delete = del;

/**
 * Mapping some Map prototype function unto our two classes.
 */
var METHODS = ['has', 'get', 'forEach', 'keys', 'values', 'entries'];

METHODS.forEach(function(name) {
  BiMap.prototype[name] = InverseMap.prototype[name] = function() {
    return Map.prototype[name].apply(this.items, arguments);
  };
});

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined') {
  BiMap.prototype[Symbol.iterator] = BiMap.prototype.entries;
  InverseMap.prototype[Symbol.iterator] = InverseMap.prototype.entries;
}

/**
 * Convenience known methods.
 */
BiMap.prototype.inspect = function() {
  var dummy = {
    left: this.items,
    right: this.inverse.items
  };

  // Trick so that node displays the name of the constructor
  Object.defineProperty(dummy, 'constructor', {
    value: BiMap,
    enumerable: false
  });

  return dummy;
};

if (typeof Symbol !== 'undefined')
  BiMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = BiMap.prototype.inspect;

InverseMap.prototype.inspect = function() {
  var dummy = {
    left: this.inverse.items,
    right: this.items
  };

  // Trick so that node displays the name of the constructor
  Object.defineProperty(dummy, 'constructor', {
    value: InverseMap,
    enumerable: false
  });

  return dummy;
};

if (typeof Symbol !== 'undefined')
  InverseMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = InverseMap.prototype.inspect;


/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a bimap.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {BiMap}
 */
BiMap.from = function(iterable) {
  var bimap = new BiMap();

  forEach(iterable, function(value, key) {
    bimap.set(key, value);
  });

  return bimap;
};

/**
 * Exporting.
 */
module.exports = BiMap;


/***/ }),
/* 176 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist BitSet
 * =================
 *
 * JavaScript implementation of a fixed-size BitSet based upon a Uint32Array.
 *
 * Notes:
 *   - (i >> 5) is the same as ((i / 32) | 0)
 *   - (i & 0x0000001f) is the same as (i % 32)
 *   - I could use a Float64Array to store more in less blocks but I would lose
 *     the benefits of byte comparison to keep track of size without popcounts.
 */
var Iterator = __webpack_require__(177),
    bitwise = __webpack_require__(178);

/**
 * BitSet.
 *
 * @constructor
 */
function BitSet(length) {

  // Properties
  this.length = length;
  this.clear();

  // Methods

  // Statics
}

/**
 * Method used to clear the bit set.
 *
 * @return {undefined}
 */
BitSet.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.array = new Uint32Array(Math.ceil(this.length / 32));
};

/**
 * Method used to set the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @param  {number} value - Value to set.
 * @return {BitSet}
 */
BitSet.prototype.set = function(index, value) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f,
      oldBytes = this.array[byteIndex],
      newBytes;

  if (value === 0 || value === false)
    newBytes = this.array[byteIndex] &= ~(1 << pos);
  else
    newBytes = this.array[byteIndex] |= (1 << pos);

  // The operands of all bitwise operators are converted to *signed* 32-bit integers.
  // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Signed_32-bit_integers
  // Shifting by 31 changes the sign (i.e. 1 << 31 = -2147483648).
  // Therefore, get unsigned representation by applying '>>> 0'.
  newBytes = newBytes >>> 0;

  // Updating size
  if (newBytes > oldBytes)
    this.size++;
  else if (newBytes < oldBytes)
    this.size--;

  return this;
};

/**
* Method used to reset the given bit's value.
*
* @param  {number} index - Target bit index.
* @return {BitSet}
*/
BitSet.prototype.reset = function(index) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f,
      oldBytes = this.array[byteIndex],
      newBytes;

  newBytes = this.array[byteIndex] &= ~(1 << pos);

  // Updating size
  if (newBytes < oldBytes)
    this.size--;

  return this;
};

/**
 * Method used to flip the value of the given bit.
 *
 * @param  {number} index - Target bit index.
 * @return {BitSet}
 */
BitSet.prototype.flip = function(index) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f,
      oldBytes = this.array[byteIndex];

  var newBytes = this.array[byteIndex] ^= (1 << pos);

  // Get unsigned representation.
  newBytes = newBytes >>> 0;

  // Updating size
  if (newBytes > oldBytes)
    this.size++;
  else if (newBytes < oldBytes)
    this.size--;

  return this;
};

/**
 * Method used to get the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @return {number}
 */
BitSet.prototype.get = function(index) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f;

  return (this.array[byteIndex] >> pos) & 1;
};

/**
 * Method used to test the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @return {BitSet}
 */
BitSet.prototype.test = function(index) {
  return Boolean(this.get(index));
};

/**
 * Method used to return the number of 1 from the beginning of the set up to
 * the ith index.
 *
 * @param  {number} i - Ith index (cannot be > length).
 * @return {number}
 */
BitSet.prototype.rank = function(i) {
  if (this.size === 0)
    return 0;

  var byteIndex = i >> 5,
      pos = i & 0x0000001f,
      r = 0;

  // Accessing the bytes before the last one
  for (var j = 0; j < byteIndex; j++)
    r += bitwise.table8Popcount(this.array[j]);

  // Handling masked last byte
  var maskedByte = this.array[byteIndex] & ((1 << pos) - 1);

  r += bitwise.table8Popcount(maskedByte);

  return r;
};

/**
 * Method used to return the position of the rth 1 in the set or -1 if the
 * set is empty.
 *
 * Note: usually select is implemented using binary search over rank but I
 * tend to think the following linear implementation is faster since here
 * rank is O(n) anyway.
 *
 * @param  {number} r - Rth 1 to select (should be < length).
 * @return {number}
 */
BitSet.prototype.select = function(r) {
  if (this.size === 0)
    return -1;

  // TODO: throw?
  if (r >= this.length)
    return -1;

  var byte,
      b = 32,
      p = 0,
      c = 0;

  for (var i = 0, l = this.array.length; i < l; i++) {
    byte = this.array[i];

    // The byte is empty, let's continue
    if (byte === 0)
      continue;

    // TODO: This branching might not be useful here
    if (i === l - 1)
      b = this.length % 32 || 32;

    // TODO: popcount should speed things up here

    for (var j = 0; j < b; j++, p++) {
      c += (byte >> j) & 1;

      if (c === r)
        return p;
    }
  }
};

/**
 * Method used to iterate over the bit set's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
BitSet.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var length = this.length,
      byte,
      bit,
      b = 32;

  for (var i = 0, l = this.array.length; i < l; i++) {
    byte = this.array[i];

    if (i === l - 1)
      b = length % 32 || 32;

    for (var j = 0; j < b; j++) {
      bit = (byte >> j) & 1;

      callback.call(scope, bit, i * 32 + j);
    }
  }
};

/**
 * Method used to create an iterator over a set's values.
 *
 * @return {Iterator}
 */
BitSet.prototype.values = function() {
  var length = this.length,
      inner = false,
      byte,
      bit,
      array = this.array,
      l = array.length,
      i = 0,
      j = -1,
      b = 32;

  return new Iterator(function next() {
    if (!inner) {

      if (i >= l)
        return {
          done: true
        };

      if (i === l - 1)
        b = length % 32 || 32;

      byte = array[i++];
      inner = true;
      j = -1;
    }

    j++;

    if (j >= b) {
      inner = false;
      return next();
    }

    bit = (byte >> j) & 1;

    return {
      value: bit
    };
  });
};

/**
 * Method used to create an iterator over a set's entries.
 *
 * @return {Iterator}
 */
BitSet.prototype.entries = function() {
  var length = this.length,
      inner = false,
      byte,
      bit,
      array = this.array,
      index,
      l = array.length,
      i = 0,
      j = -1,
      b = 32;

  return new Iterator(function next() {
    if (!inner) {

      if (i >= l)
        return {
          done: true
        };

      if (i === l - 1)
        b = length % 32 || 32;

      byte = array[i++];
      inner = true;
      j = -1;
    }

    j++;
    index = (~-i) * 32 + j;

    if (j >= b) {
      inner = false;
      return next();
    }

    bit = (byte >> j) & 1;

    return {
      value: [index, bit]
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  BitSet.prototype[Symbol.iterator] = BitSet.prototype.values;

/**
 * Convenience known methods.
 */
BitSet.prototype.inspect = function() {
  var proxy = new Uint8Array(this.length);

  this.forEach(function(bit, i) {
    proxy[i] = bit;
  });

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: BitSet,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  BitSet.prototype[Symbol.for('nodejs.util.inspect.custom')] = BitSet.prototype.inspect;

BitSet.prototype.toJSON = function() {
  return Array.from(this.array);
};

/**
 * Exporting.
 */
module.exports = BitSet;


/***/ }),
/* 177 */
/***/ ((module) => {

/**
 * Obliterator Iterator Class
 * ===========================
 *
 * Simple class representing the library's iterators.
 */

/**
 * Iterator class.
 *
 * @constructor
 * @param {function} next - Next function.
 */
function Iterator(next) {
  if (typeof next !== 'function')
    throw new Error('obliterator/iterator: expecting a function!');

  this.next = next;
}

/**
 * If symbols are supported, we add `next` to `Symbol.iterator`.
 */
if (typeof Symbol !== 'undefined')
  Iterator.prototype[Symbol.iterator] = function () {
    return this;
  };

/**
 * Returning an iterator of the given values.
 *
 * @param  {any...} values - Values.
 * @return {Iterator}
 */
Iterator.of = function () {
  var args = arguments,
    l = args.length,
    i = 0;

  return new Iterator(function () {
    if (i >= l) return {done: true};

    return {done: false, value: args[i++]};
  });
};

/**
 * Returning an empty iterator.
 *
 * @return {Iterator}
 */
Iterator.empty = function () {
  var iterator = new Iterator(function () {
    return {done: true};
  });

  return iterator;
};

/**
 * Returning an iterator over the given indexed sequence.
 *
 * @param  {string|Array} sequence - Target sequence.
 * @return {Iterator}
 */
Iterator.fromSequence = function (sequence) {
  var i = 0,
    l = sequence.length;

  return new Iterator(function () {
    if (i >= l) return {done: true};

    return {done: false, value: sequence[i++]};
  });
};

/**
 * Returning whether the given value is an iterator.
 *
 * @param  {any} value - Value.
 * @return {boolean}
 */
Iterator.is = function (value) {
  if (value instanceof Iterator) return true;

  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.next === 'function'
  );
};

/**
 * Exporting.
 */
module.exports = Iterator;


/***/ }),
/* 178 */
/***/ ((__unused_webpack_module, exports) => {

/**
 * Mnemonist Bitwise Helpers
 * ==========================
 *
 * Miscellaneous helpers helping with bitwise operations.
 */

/**
 * Takes a 32 bits integer and returns its MSB using SWAR strategy.
 *
 * @param  {number} x - Target number.
 * @return {number}
 */
function msb32(x) {
  x |= (x >> 1);
  x |= (x >> 2);
  x |= (x >> 4);
  x |= (x >> 8);
  x |= (x >> 16);

  return (x & ~(x >> 1));
}
exports.msb32 = msb32;

/**
 * Takes a byte and returns its MSB using SWAR strategy.
 *
 * @param  {number} x - Target number.
 * @return {number}
 */
function msb8(x) {
  x |= (x >> 1);
  x |= (x >> 2);
  x |= (x >> 4);

  return (x & ~(x >> 1));
}
exports.msb8 = msb8;

/**
 * Takes a number and return bit at position.
 *
 * @param  {number} x   - Target number.
 * @param  {number} pos - Position.
 * @return {number}
 */
exports.test = function(x, pos) {
  return (x >> pos) & 1;
};

/**
 * Compare two bytes and return their critical bit.
 *
 * @param  {number} a - First byte.
 * @param  {number} b - Second byte.
 * @return {number}
 */
exports.criticalBit8 = function(a, b) {
  return msb8(a ^ b);
};

exports.criticalBit8Mask = function(a, b) {
  return (~msb8(a ^ b) >>> 0) & 0xff;
};

exports.testCriticalBit8 = function(x, mask) {
  return (1 + (x | mask)) >> 8;
};

exports.criticalBit32Mask = function(a, b) {
  return (~msb32(a ^ b) >>> 0) & 0xffffffff;
};

/**
 * Takes a 32 bits integer and returns its population count (number of 1 of
 * the binary representation).
 *
 * @param  {number} x - Target number.
 * @return {number}
 */
exports.popcount = function(x) {
  x -= x >> 1 & 0x55555555;
  x = (x & 0x33333333) + (x >> 2 & 0x33333333);
  x = x + (x >> 4) & 0x0f0f0f0f;
  x += x >> 8;
  x += x >> 16;
  return x & 0x7f;
};

/**
 * Slightly faster popcount function based on a precomputed table of 8bits
 * words.
 *
 * @param  {number} x - Target number.
 * @return {number}
 */
var TABLE8 = new Uint8Array(Math.pow(2, 8));

for (var i = 0, l = TABLE8.length; i < l; i++)
  TABLE8[i] = exports.popcount(i);

exports.table8Popcount = function(x) {
  return (
    TABLE8[x & 0xff] +
    TABLE8[(x >> 8) & 0xff] +
    TABLE8[(x >> 16) & 0xff] +
    TABLE8[(x >> 24) & 0xff]
  );
};


/***/ }),
/* 179 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist BitVector
 * ====================
 *
 * JavaScript implementation of a dynamic BitSet based upon a Uint32Array.
 *
 * Notes:
 *   - (i >> 5) is the same as ((i / 32) | 0)
 *   - (i & 0x0000001f) is the same as (i % 32)
 *   - I could use a Float64Array to store more in less blocks but I would lose
 *     the benefits of byte comparison to keep track of size without popcounts.
 */
var Iterator = __webpack_require__(177),
    bitwise = __webpack_require__(178);

/**
 * Constants.
 */
var DEFAULT_GROWING_POLICY = function(capacity) {
  return Math.max(1, Math.ceil(capacity * 1.5));
};

/**
 * Helpers.
 */
function createByteArray(capacity) {
  return new Uint32Array(Math.ceil(capacity / 32));
}

/**
 * BitVector.
 *
 * @constructor
 */
function BitVector(initialLengthOrOptions) {
  var initialLength = initialLengthOrOptions || 0,
      policy = DEFAULT_GROWING_POLICY;

  if (typeof initialLengthOrOptions === 'object') {
    initialLength = (
      initialLengthOrOptions.initialLength ||
      initialLengthOrOptions.initialCapacity ||
      0
    );
    policy = initialLengthOrOptions.policy || policy;
  }

  this.size = 0;
  this.length = initialLength;
  this.capacity = Math.ceil(this.length / 32) * 32;
  this.policy = policy;
  this.array = createByteArray(this.capacity);
}

/**
 * Method used to set the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @param  {number|boolean} value - Value to set.
 * @return {BitVector}
 */
BitVector.prototype.set = function(index, value) {

  // Out of bounds?
  if (this.length < index)
    throw new Error('BitVector.set: index out of bounds.');

  var byteIndex = index >> 5,
      pos = index & 0x0000001f,
      oldBytes = this.array[byteIndex],
      newBytes;

  if (value === 0 || value === false)
    newBytes = this.array[byteIndex] &= ~(1 << pos);
  else
    newBytes = this.array[byteIndex] |= (1 << pos);

  // Get unsigned representation.
  newBytes = newBytes >>> 0;

  // Updating size
  if (newBytes > oldBytes)
    this.size++;
  else if (newBytes < oldBytes)
    this.size--;

  return this;
};

/**
* Method used to reset the given bit's value.
*
* @param  {number} index - Target bit index.
* @return {BitVector}
*/
BitVector.prototype.reset = function(index) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f,
      oldBytes = this.array[byteIndex],
      newBytes;

  newBytes = this.array[byteIndex] &= ~(1 << pos);

  // Updating size
  if (newBytes < oldBytes)
    this.size--;

  return this;
};

/**
 * Method used to flip the value of the given bit.
 *
 * @param  {number} index - Target bit index.
 * @return {BitVector}
 */
BitVector.prototype.flip = function(index) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f,
      oldBytes = this.array[byteIndex];

  var newBytes = this.array[byteIndex] ^= (1 << pos);

  // Get unsigned representation.
  newBytes = newBytes >>> 0;

  // Updating size
  if (newBytes > oldBytes)
    this.size++;
  else if (newBytes < oldBytes)
    this.size--;

  return this;
};

/**
 * Method used to apply the growing policy.
 *
 * @param  {number} [override] - Override capacity.
 * @return {number}
 */
BitVector.prototype.applyPolicy = function(override) {
  var newCapacity = this.policy(override || this.capacity);

  if (typeof newCapacity !== 'number' || newCapacity < 0)
    throw new Error('mnemonist/bit-vector.applyPolicy: policy returned an invalid value (expecting a positive integer).');

  if (newCapacity <= this.capacity)
    throw new Error('mnemonist/bit-vector.applyPolicy: policy returned a less or equal capacity to allocate.');

  // TODO: we should probably check that the returned number is an integer

  // Ceil to nearest 32
  return Math.ceil(newCapacity / 32) * 32;
};

/**
 * Method used to reallocate the underlying array.
 *
 * @param  {number}       capacity - Target capacity.
 * @return {BitVector}
 */
BitVector.prototype.reallocate = function(capacity) {
  var virtualCapacity = capacity;

  capacity = Math.ceil(capacity / 32) * 32;

  if (virtualCapacity < this.length)
    this.length = virtualCapacity;

  if (capacity === this.capacity)
    return this;

  var oldArray = this.array;

  var storageLength = capacity / 32;

  if (storageLength === this.array.length)
    return this;

  if (storageLength > this.array.length) {
    this.array = new Uint32Array(storageLength);
    this.array.set(oldArray, 0);
  }
  else {
    this.array = oldArray.slice(0, storageLength);
  }

  this.capacity = capacity;

  return this;
};

/**
 * Method used to grow the array.
 *
 * @param  {number}       [capacity] - Optional capacity to match.
 * @return {BitVector}
 */
BitVector.prototype.grow = function(capacity) {
  var newCapacity;

  if (typeof capacity === 'number') {

    if (this.capacity >= capacity)
      return this;

    // We need to match the given capacity
    newCapacity = this.capacity;

    while (newCapacity < capacity)
      newCapacity = this.applyPolicy(newCapacity);

    this.reallocate(newCapacity);

    return this;
  }

  // We need to run the policy once
  newCapacity = this.applyPolicy();
  this.reallocate(newCapacity);

  return this;
};

/**
 * Method used to resize the array. Won't deallocate.
 *
 * @param  {number}       length - Target length.
 * @return {BitVector}
 */
BitVector.prototype.resize = function(length) {
  if (length === this.length)
    return this;

  if (length < this.length) {
    this.length = length;
    return this;
  }

  this.length = length;
  this.reallocate(length);

  return this;
};

/**
 * Method used to push a value in the set.
 *
 * @param  {number|boolean} value
 * @return {BitVector}
 */
BitVector.prototype.push = function(value) {
  if (this.capacity === this.length)
    this.grow();

  if (value === 0 || value === false)
    return ++this.length;

  this.size++;

  var index = this.length++,
      byteIndex = index >> 5,
      pos = index & 0x0000001f;

  this.array[byteIndex] |= (1 << pos);

  return this.length;
};

/**
 * Method used to pop the last value of the set.
 *
 * @return {number} - The popped value.
 */
BitVector.prototype.pop = function() {
  if (this.length === 0)
    return;

  var index = --this.length;

  var byteIndex = index >> 5,
      pos = index & 0x0000001f;

  return (this.array[byteIndex] >> pos) & 1;
};

/**
 * Method used to get the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @return {number}
 */
BitVector.prototype.get = function(index) {
  if (this.length < index)
    return undefined;

  var byteIndex = index >> 5,
      pos = index & 0x0000001f;

  return (this.array[byteIndex] >> pos) & 1;
};

/**
 * Method used to test the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @return {BitVector}
 */
BitVector.prototype.test = function(index) {
  if (this.length < index)
    return false;

  return Boolean(this.get(index));
};

/**
 * Method used to return the number of 1 from the beginning of the set up to
 * the ith index.
 *
 * @param  {number} i - Ith index (cannot be > length).
 * @return {number}
 */
BitVector.prototype.rank = function(i) {
  if (this.size === 0)
    return 0;

  var byteIndex = i >> 5,
      pos = i & 0x0000001f,
      r = 0;

  // Accessing the bytes before the last one
  for (var j = 0; j < byteIndex; j++)
    r += bitwise.table8Popcount(this.array[j]);

  // Handling masked last byte
  var maskedByte = this.array[byteIndex] & ((1 << pos) - 1);

  r += bitwise.table8Popcount(maskedByte);

  return r;
};

/**
 * Method used to return the position of the rth 1 in the set or -1 if the
 * set is empty.
 *
 * Note: usually select is implemented using binary search over rank but I
 * tend to think the following linear implementation is faster since here
 * rank is O(n) anyway.
 *
 * @param  {number} r - Rth 1 to select (should be < length).
 * @return {number}
 */
BitVector.prototype.select = function(r) {
  if (this.size === 0)
    return -1;

  // TODO: throw?
  if (r >= this.length)
    return -1;

  var byte,
      b = 32,
      p = 0,
      c = 0;

  for (var i = 0, l = this.array.length; i < l; i++) {
    byte = this.array[i];

    // The byte is empty, let's continue
    if (byte === 0)
      continue;

    // TODO: This branching might not be useful here
    if (i === l - 1)
      b = this.length % 32 || 32;

    // TODO: popcount should speed things up here

    for (var j = 0; j < b; j++, p++) {
      c += (byte >> j) & 1;

      if (c === r)
        return p;
    }
  }
};

/**
 * Method used to iterate over the bit set's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
BitVector.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var length = this.length,
      byte,
      bit,
      b = 32;

  for (var i = 0, l = this.array.length; i < l; i++) {
    byte = this.array[i];

    if (i === l - 1)
      b = length % 32 || 32;

    for (var j = 0; j < b; j++) {
      bit = (byte >> j) & 1;

      callback.call(scope, bit, i * 32 + j);
    }
  }
};

/**
 * Method used to create an iterator over a set's values.
 *
 * @return {Iterator}
 */
BitVector.prototype.values = function() {
  var length = this.length,
      inner = false,
      byte,
      bit,
      array = this.array,
      l = array.length,
      i = 0,
      j = -1,
      b = 32;

  return new Iterator(function next() {
    if (!inner) {

      if (i >= l)
        return {
          done: true
        };

      if (i === l - 1)
        b = length % 32 || 32;

      byte = array[i++];
      inner = true;
      j = -1;
    }

    j++;

    if (j >= b) {
      inner = false;
      return next();
    }

    bit = (byte >> j) & 1;

    return {
      value: bit
    };
  });
};

/**
 * Method used to create an iterator over a set's entries.
 *
 * @return {Iterator}
 */
BitVector.prototype.entries = function() {
  var length = this.length,
      inner = false,
      byte,
      bit,
      array = this.array,
      index,
      l = array.length,
      i = 0,
      j = -1,
      b = 32;

  return new Iterator(function next() {
    if (!inner) {

      if (i >= l)
        return {
          done: true
        };

      if (i === l - 1)
        b = length % 32 || 32;

      byte = array[i++];
      inner = true;
      j = -1;
    }

    j++;
    index = (~-i) * 32 + j;

    if (j >= b) {
      inner = false;
      return next();
    }

    bit = (byte >> j) & 1;

    return {
      value: [index, bit]
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  BitVector.prototype[Symbol.iterator] = BitVector.prototype.values;

/**
 * Convenience known methods.
 */
BitVector.prototype.inspect = function() {
  var proxy = new Uint8Array(this.length);

  this.forEach(function(bit, i) {
    proxy[i] = bit;
  });

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: BitVector,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  BitVector.prototype[Symbol.for('nodejs.util.inspect.custom')] = BitVector.prototype.inspect;

BitVector.prototype.toJSON = function() {
  return Array.from(this.array.slice(0, (this.length >> 5) + 1));
};

/**
 * Exporting.
 */
module.exports = BitVector;


/***/ }),
/* 180 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Bloom Filter
 * =======================
 *
 * Bloom Filter implementation relying on MurmurHash3.
 */
var murmurhash3 = __webpack_require__(181),
    forEach = __webpack_require__(168);

/**
 * Constants.
 */
var LN2_SQUARED = Math.LN2 * Math.LN2;

/**
 * Defaults.
 */
var DEFAULTS = {
  errorRate: 0.005
};

/**
 * Function used to convert a string into a Uint16 byte array.
 *
 * @param  {string}      string - Target string.
 * @return {Uint16Array}
 */
function stringToByteArray(string) {
  var array = new Uint16Array(string.length),
      i,
      l;

  for (i = 0, l = string.length; i < l; i++)
    array[i] = string.charCodeAt(i);

  return array;
}

/**
 * Function used to hash the given byte array.
 *
 * @param  {number}      length - Length of the filter's byte array.
 * @param  {number}      seed   - Seed to use for the hash function.
 * @param  {Uint16Array}        - Byte array representing the string.
 * @return {number}             - The hash.
 *
 * @note length * 8 should probably already be computed as well as seeds.
 */
function hashArray(length, seed, array) {
  var hash = murmurhash3((seed * 0xFBA4C795) & 0xFFFFFFFF, array);

  return hash % (length * 8);
}

/**
 * Bloom Filter.
 *
 * @constructor
 * @param {number|object} capacityOrOptions - Capacity or options.
 */
function BloomFilter(capacityOrOptions) {
  var options = {};

  if (!capacityOrOptions)
    throw new Error('mnemonist/BloomFilter.constructor: a BloomFilter must be created with a capacity.');

  if (typeof capacityOrOptions === 'object')
    options = capacityOrOptions;
  else
    options.capacity = capacityOrOptions;

  // Handling capacity
  if (typeof options.capacity !== 'number' || options.capacity <= 0)
    throw new Error('mnemonist/BloomFilter.constructor: `capacity` option should be a positive integer.');

  this.capacity = options.capacity;

  // Handling error rate
  this.errorRate = options.errorRate || DEFAULTS.errorRate;

  if (typeof this.errorRate !== 'number' || options.errorRate <= 0)
    throw new Error('mnemonist/BloomFilter.constructor: `errorRate` option should be a positive float.');

  this.clear();
}

/**
 * Method used to clear the filter.
 *
 * @return {undefined}
 */
BloomFilter.prototype.clear = function() {

  // Optimizing number of bits & number of hash functions
  var bits = -1 / LN2_SQUARED * this.capacity * Math.log(this.errorRate),
      length = (bits / 8) | 0;

  this.hashFunctions = (length * 8 / this.capacity * Math.LN2) | 0;

  // Creating the data array
  this.data = new Uint8Array(length);

  return;
};

/**
 * Method used to add an string to the filter.
 *
 * @param  {string} string - Item to add.
 * @return {BloomFilter}
 *
 * @note Should probably create a hash function working directly on a string.
 */
BloomFilter.prototype.add = function(string) {

  // Converting the string to a byte array
  var array = stringToByteArray(string);

  // Applying the n hash functions
  for (var i = 0, l = this.hashFunctions; i < l; i++) {
    var index = hashArray(this.data.length, i, array),
        position = (1 << (7 & index));

    this.data[index >> 3] |= position;
  }

  return this;
};

/**
 * Method used to test the given string.
 *
 * @param  {string} string - Item to test.
 * @return {boolean}
 */
BloomFilter.prototype.test = function(string) {

  // Converting the string to a byte array
  var array = stringToByteArray(string);

  // Applying the n hash functions
  for (var i = 0, l = this.hashFunctions; i < l; i++) {
    var index = hashArray(this.data.length, i, array);

    if (!(this.data[index >> 3] & (1 << (7 & index))))
      return false;
  }

  return true;
};

/**
 * Convenience known methods.
 */
BloomFilter.prototype.toJSON = function() {
  return this.data;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a filter.
 *
 * @param  {Iterable}    iterable - Target iterable.
 * @return {BloomFilter}
 */
BloomFilter.from = function(iterable, options) {
  if (!options) {
    options = iterable.length || iterable.size;

    if (typeof options !== 'number')
      throw new Error('BloomFilter.from: could not infer the filter\'s capacity. Try passing it as second argument.');
  }

  var filter = new BloomFilter(options);

  forEach(iterable, function(value) {
    filter.add(value);
  });

  return filter;
};

/**
 * Exporting.
 */
module.exports = BloomFilter;


/***/ }),
/* 181 */
/***/ ((module) => {

/* eslint no-fallthrough: 0 */
/**
 * Mnemonist MurmurHash 3
 * =======================
 *
 * Straightforward implementation of the third version of MurmurHash.
 *
 * Note: this piece of code belong to haschisch.
 */

/**
 * Various helpers.
 */
function mul32(a, b) {
  return (a & 0xffff) * b + (((a >>> 16) * b & 0xffff) << 16) & 0xffffffff;
}

function sum32(a, b) {
  return (a & 0xffff) + (b >>> 16) + (((a >>> 16) + b & 0xffff) << 16) & 0xffffffff;
}

function rotl32(a, b) {
  return (a << b) | (a >>> (32 - b));
}

/**
 * MumurHash3 function.
 *
 * @param  {number}    seed - Seed.
 * @param  {ByteArray} data - Data.
 */
module.exports = function murmurhash3(seed, data) {
  var c1 = 0xcc9e2d51,
      c2 = 0x1b873593,
      r1 = 15,
      r2 = 13,
      m = 5,
      n = 0x6b64e654;

  var hash = seed,
      k1,
      i,
      l;

  for (i = 0, l = data.length - 4; i <= l; i += 4) {
    k1 = (
      data[i] |
      (data[i + 1] << 8) |
      (data[i + 2] << 16) |
      (data[i + 3] << 24)
    );

    k1 = mul32(k1, c1);
    k1 = rotl32(k1, r1);
    k1 = mul32(k1, c2);

    hash ^= k1;
    hash = rotl32(hash, r2);
    hash = mul32(hash, m);
    hash = sum32(hash, n);
  }

  k1 = 0;

  switch (data.length & 3) {
    case 3:
      k1 ^= data[i + 2] << 16;
    case 2:
      k1 ^= data[i + 1] << 8;
    case 1:
      k1 ^= data[i];
      k1 = mul32(k1, c1);
      k1 = rotl32(k1, r1);
      k1 = mul32(k1, c2);
      hash ^= k1;
    default:
  }

  hash ^= data.length;
  hash ^= hash >>> 16;
  hash = mul32(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = mul32(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;

  return hash >>> 0;
};


/***/ }),
/* 182 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint no-constant-condition: 0 */
/**
 * Mnemonist BK Tree
 * ==================
 *
 * Implementation of a Burkhard-Keller tree, allowing fast lookups of words
 * that lie within a specified distance of the query word.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/BK-tree
 *
 * [Article]:
 * W. Burkhard and R. Keller. Some approaches to best-match file searching,
 * CACM, 1973
 */
var forEach = __webpack_require__(168);

/**
 * BK Tree.
 *
 * @constructor
 * @param {function} distance - Distance function to use.
 */
function BKTree(distance) {

  if (typeof distance !== 'function')
    throw new Error('mnemonist/BKTree.constructor: given `distance` should be a function.');

  this.distance = distance;
  this.clear();
}

/**
 * Method used to add an item to the tree.
 *
 * @param  {any} item - Item to add.
 * @return {BKTree}
 */
BKTree.prototype.add = function(item) {

  // Initializing the tree with the first given word
  if (!this.root) {
    this.root = {
      item: item,
      children: {}
    };

    this.size++;
    return this;
  }

  var node = this.root,
      d;

  while (true) {
    d = this.distance(item, node.item);

    if (!node.children[d])
      break;

    node = node.children[d];
  }

  node.children[d] = {
    item: item,
    children: {}
  };

  this.size++;
  return this;
};

/**
 * Method used to query the tree.
 *
 * @param  {number} n     - Maximum distance between query & item.
 * @param  {any}    query - Query
 * @return {BKTree}
 */
BKTree.prototype.search = function(n, query) {
  if (!this.root)
    return [];

  var found = [],
      stack = [this.root],
      node,
      child,
      d,
      i,
      l;

  while (stack.length) {
    node = stack.pop();
    d = this.distance(query, node.item);

    if (d <= n)
      found.push({item: node.item, distance: d});

    for (i = d - n, l = d + n + 1; i < l; i++) {
      child = node.children[i];

      if (child)
        stack.push(child);
    }
  }

  return found;
};

/**
 * Method used to clear the tree.
 *
 * @return {undefined}
 */
BKTree.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.root = null;
};

/**
 * Convenience known methods.
 */
BKTree.prototype.toJSON = function() {
  return this.root;
};

BKTree.prototype.inspect = function() {
  var array = [],
      stack = [this.root],
      node,
      d;

  while (stack.length) {
    node = stack.pop();

    if (!node)
      continue;

    array.push(node.item);

    for (d in node.children)
      stack.push(node.children[d]);
  }

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: BKTree,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  BKTree.prototype[Symbol.for('nodejs.util.inspect.custom')] = BKTree.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a tree.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} distance - Distance function.
 * @return {Heap}
 */
BKTree.from = function(iterable, distance) {
  var tree = new BKTree(distance);

  forEach(iterable, function(value) {
    tree.add(value);
  });

  return tree;
};

/**
 * Exporting.
 */
module.exports = BKTree;


/***/ }),
/* 183 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist CircularBuffer
 * =========================
 *
 * Circular buffer implementation fit to use as a finite deque.
 */
var iterables = __webpack_require__(171),
    FixedDeque = __webpack_require__(184);

/**
 * CircularBuffer.
 *
 * @constructor
 */
function CircularBuffer(ArrayClass, capacity) {

  if (arguments.length < 2)
    throw new Error('mnemonist/circular-buffer: expecting an Array class and a capacity.');

  if (typeof capacity !== 'number' || capacity <= 0)
    throw new Error('mnemonist/circular-buffer: `capacity` should be a positive number.');

  this.ArrayClass = ArrayClass;
  this.capacity = capacity;
  this.items = new ArrayClass(this.capacity);
  this.clear();
}

/**
 * Pasting most of the prototype from FixedDeque.
 */
function paste(name) {
  CircularBuffer.prototype[name] = FixedDeque.prototype[name];
}

Object.keys(FixedDeque.prototype).forEach(paste);

if (typeof Symbol !== 'undefined')
  Object.getOwnPropertySymbols(FixedDeque.prototype).forEach(paste);

/**
 * Method used to append a value to the buffer.
 *
 * @param  {any}    item - Item to append.
 * @return {number}      - Returns the new size of the buffer.
 */
CircularBuffer.prototype.push = function(item) {
  var index = (this.start + this.size) % this.capacity;

  this.items[index] = item;

  // Overwriting?
  if (this.size === this.capacity) {

    // If start is at the end, we wrap around the buffer
    this.start = (index + 1) % this.capacity;

    return this.size;
  }

  return ++this.size;
};

/**
 * Method used to prepend a value to the buffer.
 *
 * @param  {any}    item - Item to prepend.
 * @return {number}      - Returns the new size of the buffer.
 */
CircularBuffer.prototype.unshift = function(item) {
  var index = this.start - 1;

  if (this.start === 0)
    index = this.capacity - 1;

  this.items[index] = item;

  // Overwriting
  if (this.size === this.capacity) {

    this.start = index;

    return this.size;
  }

  this.start = index;

  return ++this.size;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a circular buffer.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {function} ArrayClass - Array class to use.
 * @param  {number}   capacity   - Desired capacity.
 * @return {FiniteStack}
 */
CircularBuffer.from = function(iterable, ArrayClass, capacity) {
  if (arguments.length < 3) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/circular-buffer.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }

  var buffer = new CircularBuffer(ArrayClass, capacity);

  if (iterables.isArrayLike(iterable)) {
    var i, l;

    for (i = 0, l = iterable.length; i < l; i++)
      buffer.items[i] = iterable[i];

    buffer.size = l;

    return buffer;
  }

  iterables.forEach(iterable, function(value) {
    buffer.push(value);
  });

  return buffer;
};

/**
 * Exporting.
 */
module.exports = CircularBuffer;


/***/ }),
/* 184 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist FixedDeque
 * =====================
 *
 * Fixed capacity double-ended queue implemented as ring deque.
 */
var iterables = __webpack_require__(171),
    Iterator = __webpack_require__(177);

/**
 * FixedDeque.
 *
 * @constructor
 */
function FixedDeque(ArrayClass, capacity) {

  if (arguments.length < 2)
    throw new Error('mnemonist/fixed-deque: expecting an Array class and a capacity.');

  if (typeof capacity !== 'number' || capacity <= 0)
    throw new Error('mnemonist/fixed-deque: `capacity` should be a positive number.');

  this.ArrayClass = ArrayClass;
  this.capacity = capacity;
  this.items = new ArrayClass(this.capacity);
  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
FixedDeque.prototype.clear = function() {

  // Properties
  this.start = 0;
  this.size = 0;
};

/**
 * Method used to append a value to the deque.
 *
 * @param  {any}    item - Item to append.
 * @return {number}      - Returns the new size of the deque.
 */
FixedDeque.prototype.push = function(item) {
  if (this.size === this.capacity)
    throw new Error('mnemonist/fixed-deque.push: deque capacity (' + this.capacity + ') exceeded!');

  var index = (this.start + this.size) % this.capacity;

  this.items[index] = item;

  return ++this.size;
};

/**
 * Method used to prepend a value to the deque.
 *
 * @param  {any}    item - Item to prepend.
 * @return {number}      - Returns the new size of the deque.
 */
FixedDeque.prototype.unshift = function(item) {
  if (this.size === this.capacity)
    throw new Error('mnemonist/fixed-deque.unshift: deque capacity (' + this.capacity + ') exceeded!');

  var index = this.start - 1;

  if (this.start === 0)
    index = this.capacity - 1;

  this.items[index] = item;
  this.start = index;

  return ++this.size;
};

/**
 * Method used to pop the deque.
 *
 * @return {any} - Returns the popped item.
 */
FixedDeque.prototype.pop = function() {
  if (this.size === 0)
    return;

  const index = (this.start + this.size - 1) % this.capacity;

  this.size--;

  return this.items[index];
};

/**
 * Method used to shift the deque.
 *
 * @return {any} - Returns the shifted item.
 */
FixedDeque.prototype.shift = function() {
  if (this.size === 0)
    return;

  var index = this.start;

  this.size--;
  this.start++;

  if (this.start === this.capacity)
    this.start = 0;

  return this.items[index];
};

/**
 * Method used to peek the first value of the deque.
 *
 * @return {any}
 */
FixedDeque.prototype.peekFirst = function() {
  if (this.size === 0)
    return;

  return this.items[this.start];
};

/**
 * Method used to peek the last value of the deque.
 *
 * @return {any}
 */
FixedDeque.prototype.peekLast = function() {
  if (this.size === 0)
    return;

  var index = this.start + this.size - 1;

  if (index > this.capacity)
    index -= this.capacity;

  return this.items[index];
};

/**
 * Method used to get the desired value of the deque.
 *
 * @param  {number} index
 * @return {any}
 */
FixedDeque.prototype.get = function(index) {
  if (this.size === 0)
    return;

  index = this.start + index;

  if (index > this.capacity)
    index -= this.capacity;

  return this.items[index];
};

/**
 * Method used to iterate over the deque.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
FixedDeque.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  while (j < l) {
    callback.call(scope, this.items[i], j, this);
    i++;
    j++;

    if (i === c)
      i = 0;
  }
};

/**
 * Method used to convert the deque to a JavaScript array.
 *
 * @return {array}
 */
// TODO: optional array class as argument?
FixedDeque.prototype.toArray = function() {

  // Optimization
  var offset = this.start + this.size;

  if (offset < this.capacity)
    return this.items.slice(this.start, offset);

  var array = new this.ArrayClass(this.size),
      c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  while (j < l) {
    array[j] = this.items[i];
    i++;
    j++;

    if (i === c)
      i = 0;
  }

  return array;
};

/**
 * Method used to create an iterator over the deque's values.
 *
 * @return {Iterator}
 */
FixedDeque.prototype.values = function() {
  var items = this.items,
      c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  return new Iterator(function() {
    if (j >= l)
      return {
        done: true
      };

    var value = items[i];

    i++;
    j++;

    if (i === c)
      i = 0;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over the deque's entries.
 *
 * @return {Iterator}
 */
FixedDeque.prototype.entries = function() {
  var items = this.items,
      c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  return new Iterator(function() {
    if (j >= l)
      return {
        done: true
      };

    var value = items[i];

    i++;

    if (i === c)
      i = 0;

    return {
      value: [j++, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  FixedDeque.prototype[Symbol.iterator] = FixedDeque.prototype.values;

/**
 * Convenience known methods.
 */
FixedDeque.prototype.inspect = function() {
  var array = this.toArray();

  array.type = this.ArrayClass.name;
  array.capacity = this.capacity;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: FixedDeque,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  FixedDeque.prototype[Symbol.for('nodejs.util.inspect.custom')] = FixedDeque.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a deque.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {function} ArrayClass - Array class to use.
 * @param  {number}   capacity   - Desired capacity.
 * @return {FiniteStack}
 */
FixedDeque.from = function(iterable, ArrayClass, capacity) {
  if (arguments.length < 3) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/fixed-deque.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }

  var deque = new FixedDeque(ArrayClass, capacity);

  if (iterables.isArrayLike(iterable)) {
    var i, l;

    for (i = 0, l = iterable.length; i < l; i++)
      deque.items[i] = iterable[i];

    deque.size = l;

    return deque;
  }

  iterables.forEach(iterable, function(value) {
    deque.push(value);
  });

  return deque;
};

/**
 * Exporting.
 */
module.exports = FixedDeque;


/***/ }),
/* 185 */
/***/ ((module) => {

/**
 * Mnemonist DefaultMap
 * =====================
 *
 * JavaScript implementation of a default map that will return a constructed
 * value any time one tries to access an inexisting key. It's quite similar
 * to python's defaultdict.
 */

/**
 * DefaultMap.
 *
 * @constructor
 */
function DefaultMap(factory) {
  if (typeof factory !== 'function')
    throw new Error('mnemonist/DefaultMap.constructor: expecting a function.');

  this.items = new Map();
  this.factory = factory;
  this.size = 0;
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
DefaultMap.prototype.clear = function() {

  // Properties
  this.items.clear();
  this.size = 0;
};

/**
 * Method used to get the value set for given key. If the key does not exist,
 * the value will be created using the provided factory.
 *
 * @param  {any} key - Target key.
 * @return {any}
 */
DefaultMap.prototype.get = function(key) {
  var value = this.items.get(key);

  if (typeof value === 'undefined') {
    value = this.factory(key, this.size);
    this.items.set(key, value);
    this.size++;
  }

  return value;
};

/**
 * Method used to get the value set for given key. If the key does not exist,
 * a value won't be created.
 *
 * @param  {any} key - Target key.
 * @return {any}
 */
DefaultMap.prototype.peek = function(key) {
  return this.items.get(key);
};

/**
 * Method used to set a value for given key.
 *
 * @param  {any} key   - Target key.
 * @param  {any} value - Value.
 * @return {DefaultMap}
 */
DefaultMap.prototype.set = function(key, value) {
  this.items.set(key, value);
  this.size = this.items.size;

  return this;
};

/**
 * Method used to test the existence of a key in the map.
 *
 * @param  {any} key   - Target key.
 * @return {boolean}
 */
DefaultMap.prototype.has = function(key) {
  return this.items.has(key);
};

/**
 * Method used to delete target key.
 *
 * @param  {any} key   - Target key.
 * @return {boolean}
 */
DefaultMap.prototype.delete = function(key) {
  var deleted = this.items.delete(key);

  this.size = this.items.size;

  return deleted;
};

/**
 * Method used to iterate over each of the key/value pairs.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
DefaultMap.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  this.items.forEach(callback, scope);
};

/**
 * Iterators.
 */
DefaultMap.prototype.entries = function() {
  return this.items.entries();
};

DefaultMap.prototype.keys = function() {
  return this.items.keys();
};

DefaultMap.prototype.values = function() {
  return this.items.values();
};

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  DefaultMap.prototype[Symbol.iterator] = DefaultMap.prototype.entries;

/**
 * Convenience known methods.
 */
DefaultMap.prototype.inspect = function() {
  return this.items;
};

if (typeof Symbol !== 'undefined')
  DefaultMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = DefaultMap.prototype.inspect;

/**
 * Typical factories.
 */
DefaultMap.autoIncrement = function() {
  var i = 0;

  return function() {
    return i++;
  };
};

/**
 * Exporting.
 */
module.exports = DefaultMap;


/***/ }),
/* 186 */
/***/ ((module) => {

/**
 * Mnemonist DefaultWeakMap
 * =========================
 *
 * JavaScript implementation of a default weak map that will return a constructed
 * value any time one tries to access an non-existing key. It is similar to
 * DefaultMap but uses ES6 WeakMap that only holds weak reference to keys.
 */

/**
 * DefaultWeakMap.
 *
 * @constructor
 */
function DefaultWeakMap(factory) {
  if (typeof factory !== 'function')
    throw new Error('mnemonist/DefaultWeakMap.constructor: expecting a function.');

  this.items = new WeakMap();
  this.factory = factory;
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
DefaultWeakMap.prototype.clear = function() {

  // Properties
  this.items = new WeakMap();
};

/**
 * Method used to get the value set for given key. If the key does not exist,
 * the value will be created using the provided factory.
 *
 * @param  {any} key - Target key.
 * @return {any}
 */
DefaultWeakMap.prototype.get = function(key) {
  var value = this.items.get(key);

  if (typeof value === 'undefined') {
    value = this.factory(key);
    this.items.set(key, value);
  }

  return value;
};

/**
 * Method used to get the value set for given key. If the key does not exist,
 * a value won't be created.
 *
 * @param  {any} key - Target key.
 * @return {any}
 */
DefaultWeakMap.prototype.peek = function(key) {
  return this.items.get(key);
};

/**
 * Method used to set a value for given key.
 *
 * @param  {any} key   - Target key.
 * @param  {any} value - Value.
 * @return {DefaultMap}
 */
DefaultWeakMap.prototype.set = function(key, value) {
  this.items.set(key, value);
  return this;
};

/**
 * Method used to test the existence of a key in the map.
 *
 * @param  {any} key   - Target key.
 * @return {boolean}
 */
DefaultWeakMap.prototype.has = function(key) {
  return this.items.has(key);
};

/**
 * Method used to delete target key.
 *
 * @param  {any} key   - Target key.
 * @return {boolean}
 */
DefaultWeakMap.prototype.delete = function(key) {
  return this.items.delete(key);
};

/**
 * Convenience known methods.
 */
DefaultWeakMap.prototype.inspect = function() {
  return this.items;
};

if (typeof Symbol !== 'undefined')
  DefaultWeakMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = DefaultWeakMap.prototype.inspect;

/**
 * Exporting.
 */
module.exports = DefaultWeakMap;


/***/ }),
/* 187 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint no-constant-condition: 0 */
/**
 * Mnemonist StaticDisjointSet
 * ============================
 *
 * JavaScript implementation of a static disjoint set (union-find).
 *
 * Note that to remain performant, this implementation needs to know a size
 * beforehand.
 */
var helpers = __webpack_require__(172);

/**
 * StaticDisjointSet.
 *
 * @constructor
 */
function StaticDisjointSet(size) {

  // Optimizing the typed array types
  var ParentsTypedArray = helpers.getPointerArray(size),
      RanksTypedArray = helpers.getPointerArray(Math.log2(size));

  // Properties
  this.size = size;
  this.dimension = size;
  this.parents = new ParentsTypedArray(size);
  this.ranks = new RanksTypedArray(size);

  // Initializing parents
  for (var i = 0; i < size; i++)
    this.parents[i] = i;
}

/**
 * Method used to find the root of the given item.
 *
 * @param  {number} x - Target item.
 * @return {number}
 */
StaticDisjointSet.prototype.find = function(x) {
  var y = x;

  var c, p;

  while (true) {
    c = this.parents[y];

    if (y === c)
      break;

    y = c;
  }

  // Path compression
  while (true) {
    p = this.parents[x];

    if (p === y)
      break;

    this.parents[x] = y;
    x = p;
  }

  return y;
};

/**
 * Method used to perform the union of two items.
 *
 * @param  {number} x - First item.
 * @param  {number} y - Second item.
 * @return {StaticDisjointSet}
 */
StaticDisjointSet.prototype.union = function(x, y) {
  var xRoot = this.find(x),
      yRoot = this.find(y);

  // x and y are already in the same set
  if (xRoot === yRoot)
    return this;

  this.dimension--;

  // x and y are not in the same set, we merge them
  var xRank = this.ranks[x],
      yRank = this.ranks[y];

  if (xRank < yRank) {
    this.parents[xRoot] = yRoot;
  }
  else if (xRank > yRank) {
    this.parents[yRoot] = xRoot;
  }
  else {
    this.parents[yRoot] = xRoot;
    this.ranks[xRoot]++;
  }

  return this;
};

/**
 * Method returning whether two items are connected.
 *
 * @param  {number} x - First item.
 * @param  {number} y - Second item.
 * @return {boolean}
 */
StaticDisjointSet.prototype.connected = function(x, y) {
  var xRoot = this.find(x);

  return xRoot === this.find(y);
};

/**
 * Method returning the set mapping.
 *
 * @return {TypedArray}
 */
StaticDisjointSet.prototype.mapping = function() {
  var MappingClass = helpers.getPointerArray(this.dimension);

  var ids = {},
      mapping = new MappingClass(this.size),
      c = 0;

  var r;

  for (var i = 0, l = this.parents.length; i < l; i++) {
    r = this.find(i);

    if (typeof ids[r] === 'undefined') {
      mapping[i] = c;
      ids[r] = c++;
    }
    else {
      mapping[i] = ids[r];
    }
  }

  return mapping;
};

/**
 * Method used to compile the disjoint set into an array of arrays.
 *
 * @return {array}
 */
StaticDisjointSet.prototype.compile = function() {
  var ids = {},
      result = new Array(this.dimension),
      c = 0;

  var r;

  for (var i = 0, l = this.parents.length; i < l; i++) {
    r = this.find(i);

    if (typeof ids[r] === 'undefined') {
      result[c] = [i];
      ids[r] = c++;
    }
    else {
      result[ids[r]].push(i);
    }
  }

  return result;
};

/**
 * Convenience known methods.
 */
StaticDisjointSet.prototype.inspect = function() {
  var array = this.compile();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: StaticDisjointSet,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  StaticDisjointSet.prototype[Symbol.for('nodejs.util.inspect.custom')] = StaticDisjointSet.prototype.inspect;


/**
 * Exporting.
 */
module.exports = StaticDisjointSet;


/***/ }),
/* 188 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Fixed Reverse Heap
 * =============================
 *
 * Static heap implementation with fixed capacity. It's a "reverse" heap
 * because it stores the elements in reverse so we can replace the worst
 * item in logarithmic time. As such, one cannot pop this heap but can only
 * consume it at the end. This structure is very efficient when trying to
 * find the n smallest/largest items from a larger query (k nearest neigbors
 * for instance).
 */
var comparators = __webpack_require__(170),
    Heap = __webpack_require__(167);

var DEFAULT_COMPARATOR = comparators.DEFAULT_COMPARATOR,
    reverseComparator = comparators.reverseComparator;

/**
 * Helper functions.
 */

/**
 * Function used to sift up.
 *
 * @param {function} compare - Comparison function.
 * @param {array}    heap    - Array storing the heap's data.
 * @param {number}   size    - Heap's true size.
 * @param {number}   i       - Index.
 */
function siftUp(compare, heap, size, i) {
  var endIndex = size,
      startIndex = i,
      item = heap[i],
      childIndex = 2 * i + 1,
      rightIndex;

  while (childIndex < endIndex) {
    rightIndex = childIndex + 1;

    if (
      rightIndex < endIndex &&
      compare(heap[childIndex], heap[rightIndex]) >= 0
    ) {
      childIndex = rightIndex;
    }

    heap[i] = heap[childIndex];
    i = childIndex;
    childIndex = 2 * i + 1;
  }

  heap[i] = item;
  Heap.siftDown(compare, heap, startIndex, i);
}

/**
 * Fully consumes the given heap.
 *
 * @param  {function} ArrayClass - Array class to use.
 * @param  {function} compare    - Comparison function.
 * @param  {array}    heap       - Array storing the heap's data.
 * @param  {number}   size       - True size of the heap.
 * @return {array}
 */
function consume(ArrayClass, compare, heap, size) {
  var l = size,
      i = l;

  var array = new ArrayClass(size),
      lastItem,
      item;

  while (i > 0) {
    lastItem = heap[--i];

    if (i !== 0) {
      item = heap[0];
      heap[0] = lastItem;
      siftUp(compare, heap, --size, 0);
      lastItem = item;
    }

    array[i] = lastItem;
  }

  return array;
}

/**
 * Binary Minimum FixedReverseHeap.
 *
 * @constructor
 * @param {function} ArrayClass - The class of array to use.
 * @param {function} comparator - Comparator function.
 * @param {number}   capacity   - Maximum number of items to keep.
 */
function FixedReverseHeap(ArrayClass, comparator, capacity) {

  // Comparator can be omitted
  if (arguments.length === 2) {
    capacity = comparator;
    comparator = null;
  }

  this.ArrayClass = ArrayClass;
  this.capacity = capacity;

  this.items = new ArrayClass(capacity);
  this.clear();
  this.comparator = comparator || DEFAULT_COMPARATOR;

  if (typeof capacity !== 'number' && capacity <= 0)
    throw new Error('mnemonist/FixedReverseHeap.constructor: capacity should be a number > 0.');

  if (typeof this.comparator !== 'function')
    throw new Error('mnemonist/FixedReverseHeap.constructor: given comparator should be a function.');

  this.comparator = reverseComparator(this.comparator);
}

/**
 * Method used to clear the heap.
 *
 * @return {undefined}
 */
FixedReverseHeap.prototype.clear = function() {

  // Properties
  this.size = 0;
};

/**
 * Method used to push an item into the heap.
 *
 * @param  {any}    item - Item to push.
 * @return {number}
 */
FixedReverseHeap.prototype.push = function(item) {

  // Still some place
  if (this.size < this.capacity) {
    this.items[this.size] = item;
    Heap.siftDown(this.comparator, this.items, 0, this.size);
    this.size++;
  }

  // Heap is full, we need to replace worst item
  else {

    if (this.comparator(item, this.items[0]) > 0)
      Heap.replace(this.comparator, this.items, item);
  }

  return this.size;
};

/**
 * Method used to peek the worst item in the heap.
 *
 * @return {any}
 */
FixedReverseHeap.prototype.peek = function() {
  return this.items[0];
};

/**
 * Method used to consume the heap fully and return its items as a sorted array.
 *
 * @return {array}
 */
FixedReverseHeap.prototype.consume = function() {
  var items = consume(this.ArrayClass, this.comparator, this.items, this.size);
  this.size = 0;

  return items;
};

/**
 * Method used to convert the heap to an array. Note that it basically clone
 * the heap and consumes it completely. This is hardly performant.
 *
 * @return {array}
 */
FixedReverseHeap.prototype.toArray = function() {
  return consume(this.ArrayClass, this.comparator, this.items.slice(0, this.size), this.size);
};

/**
 * Convenience known methods.
 */
FixedReverseHeap.prototype.inspect = function() {
  var proxy = this.toArray();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: FixedReverseHeap,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  FixedReverseHeap.prototype[Symbol.for('nodejs.util.inspect.custom')] = FixedReverseHeap.prototype.inspect;

/**
 * Exporting.
 */
module.exports = FixedReverseHeap;


/***/ }),
/* 189 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Fuzzy Map
 * ====================
 *
 * The fuzzy map is a map whose keys are processed by a function before
 * read/write operations. This can often result in multiple keys accessing
 * the same resource (example: a map with lowercased keys).
 */
var forEach = __webpack_require__(168);

var identity = function(x) {
  return x;
};

/**
 * FuzzyMap.
 *
 * @constructor
 * @param {array|function} descriptor - Hash functions descriptor.
 */
function FuzzyMap(descriptor) {
  this.items = new Map();
  this.clear();

  if (Array.isArray(descriptor)) {
    this.writeHashFunction = descriptor[0];
    this.readHashFunction = descriptor[1];
  }
  else {
    this.writeHashFunction = descriptor;
    this.readHashFunction = descriptor;
  }

  if (!this.writeHashFunction)
    this.writeHashFunction = identity;
  if (!this.readHashFunction)
    this.readHashFunction = identity;

  if (typeof this.writeHashFunction !== 'function')
    throw new Error('mnemonist/FuzzyMap.constructor: invalid hash function given.');

  if (typeof this.readHashFunction !== 'function')
    throw new Error('mnemonist/FuzzyMap.constructor: invalid hash function given.');
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
FuzzyMap.prototype.clear = function() {
  this.items.clear();

  // Properties
  this.size = 0;
};

/**
 * Method used to add an item to the FuzzyMap.
 *
 * @param  {any} item - Item to add.
 * @return {FuzzyMap}
 */
FuzzyMap.prototype.add = function(item) {
  var key = this.writeHashFunction(item);

  this.items.set(key, item);
  this.size = this.items.size;

  return this;
};

/**
 * Method used to set an item in the FuzzyMap using the given key.
 *
 * @param  {any} key  - Key to use.
 * @param  {any} item - Item to add.
 * @return {FuzzyMap}
 */
FuzzyMap.prototype.set = function(key, item) {
  key = this.writeHashFunction(key);

  this.items.set(key, item);
  this.size = this.items.size;

  return this;
};

/**
 * Method used to retrieve an item from the FuzzyMap.
 *
 * @param  {any} key - Key to use.
 * @return {any}
 */
FuzzyMap.prototype.get = function(key) {
  key = this.readHashFunction(key);

  return this.items.get(key);
};

/**
 * Method used to test the existence of an item in the map.
 *
 * @param  {any} key - Key to check.
 * @return {boolean}
 */
FuzzyMap.prototype.has = function(key) {
  key = this.readHashFunction(key);

  return this.items.has(key);
};

/**
 * Method used to iterate over each of the FuzzyMap's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
FuzzyMap.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  this.items.forEach(function(value) {
    callback.call(scope, value, value);
  });
};

/**
 * Method returning an iterator over the FuzzyMap's values.
 *
 * @return {FuzzyMapIterator}
 */
FuzzyMap.prototype.values = function() {
  return this.items.values();
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  FuzzyMap.prototype[Symbol.iterator] = FuzzyMap.prototype.values;

/**
 * Convenience known method.
 */
FuzzyMap.prototype.inspect = function() {
  var array = Array.from(this.items.values());

  Object.defineProperty(array, 'constructor', {
    value: FuzzyMap,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  FuzzyMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = FuzzyMap.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable}       iterable   - Target iterable.
 * @param  {array|function} descriptor - Hash functions descriptor.
 * @param  {boolean}        useSet     - Whether to use #.set or #.add
 * @return {FuzzyMap}
 */
FuzzyMap.from = function(iterable, descriptor, useSet) {
  var map = new FuzzyMap(descriptor);

  forEach(iterable, function(value, key) {
    if (useSet)
      map.set(key, value);
    else
      map.add(value);
  });

  return map;
};

/**
 * Exporting.
 */
module.exports = FuzzyMap;


/***/ }),
/* 190 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist FuzzyMultiMap
 * ========================
 *
 * Same as the fuzzy map but relying on a MultiMap rather than a Map.
 */
var MultiMap = __webpack_require__(191),
    forEach = __webpack_require__(168);

var identity = function(x) {
  return x;
};

/**
 * FuzzyMultiMap.
 *
 * @constructor
 * @param {array|function} descriptor - Hash functions descriptor.
 * @param {function}       Container  - Container to use.
 */
function FuzzyMultiMap(descriptor, Container) {
  this.items = new MultiMap(Container);
  this.clear();

  if (Array.isArray(descriptor)) {
    this.writeHashFunction = descriptor[0];
    this.readHashFunction = descriptor[1];
  }
  else {
    this.writeHashFunction = descriptor;
    this.readHashFunction = descriptor;
  }

  if (!this.writeHashFunction)
    this.writeHashFunction = identity;
  if (!this.readHashFunction)
    this.readHashFunction = identity;

  if (typeof this.writeHashFunction !== 'function')
    throw new Error('mnemonist/FuzzyMultiMap.constructor: invalid hash function given.');

  if (typeof this.readHashFunction !== 'function')
    throw new Error('mnemonist/FuzzyMultiMap.constructor: invalid hash function given.');
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
FuzzyMultiMap.prototype.clear = function() {
  this.items.clear();

  // Properties
  this.size = 0;
  this.dimension = 0;
};

/**
 * Method used to add an item to the index.
 *
 * @param  {any} item - Item to add.
 * @return {FuzzyMultiMap}
 */
FuzzyMultiMap.prototype.add = function(item) {
  var key = this.writeHashFunction(item);

  this.items.set(key, item);
  this.size = this.items.size;
  this.dimension = this.items.dimension;

  return this;
};

/**
 * Method used to set an item in the index using the given key.
 *
 * @param  {any} key  - Key to use.
 * @param  {any} item - Item to add.
 * @return {FuzzyMultiMap}
 */
FuzzyMultiMap.prototype.set = function(key, item) {
  key = this.writeHashFunction(key);

  this.items.set(key, item);
  this.size = this.items.size;
  this.dimension = this.items.dimension;

  return this;
};

/**
 * Method used to retrieve an item from the index.
 *
 * @param  {any} key - Key to use.
 * @return {any}
 */
FuzzyMultiMap.prototype.get = function(key) {
  key = this.readHashFunction(key);

  return this.items.get(key);
};

/**
 * Method used to test the existence of an item in the map.
 *
 * @param  {any} key - Key to check.
 * @return {boolean}
 */
FuzzyMultiMap.prototype.has = function(key) {
  key = this.readHashFunction(key);

  return this.items.has(key);
};

/**
 * Method used to iterate over each of the index's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
FuzzyMultiMap.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  this.items.forEach(function(value) {
    callback.call(scope, value, value);
  });
};

/**
 * Method returning an iterator over the index's values.
 *
 * @return {FuzzyMultiMapIterator}
 */
FuzzyMultiMap.prototype.values = function() {
  return this.items.values();
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  FuzzyMultiMap.prototype[Symbol.iterator] = FuzzyMultiMap.prototype.values;

/**
 * Convenience known method.
 */
FuzzyMultiMap.prototype.inspect = function() {
  var array = Array.from(this);

  Object.defineProperty(array, 'constructor', {
    value: FuzzyMultiMap,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  FuzzyMultiMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = FuzzyMultiMap.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable}       iterable   - Target iterable.
 * @param  {array|function} descriptor - Hash functions descriptor.
 * @param  {function}       Container  - Container to use.
 * @param  {boolean}        useSet     - Whether to use #.set or #.add
 * @return {FuzzyMultiMap}
 */
FuzzyMultiMap.from = function(iterable, descriptor, Container, useSet) {
  if (arguments.length === 3) {
    if (typeof Container === 'boolean') {
      useSet = Container;
      Container = Array;
    }
  }

  var map = new FuzzyMultiMap(descriptor, Container);

  forEach(iterable, function(value, key) {
    if (useSet)
      map.set(key, value);
    else
      map.add(value);
  });

  return map;
};

/**
 * Exporting.
 */
module.exports = FuzzyMultiMap;


/***/ }),
/* 191 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist MultiMap
 * ===================
 *
 * Implementation of a MultiMap with custom container.
 */
var Iterator = __webpack_require__(177),
    forEach = __webpack_require__(168);

/**
 * MultiMap.
 *
 * @constructor
 */
function MultiMap(Container) {

  this.Container = Container || Array;
  this.items = new Map();
  this.clear();

  Object.defineProperty(this.items, 'constructor', {
    value: MultiMap,
    enumerable: false
  });
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
MultiMap.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.dimension = 0;
  this.items.clear();
};

/**
 * Method used to set a value.
 *
 * @param  {any}      key   - Key.
 * @param  {any}      value - Value to add.
 * @return {MultiMap}
 */
MultiMap.prototype.set = function(key, value) {
  var container = this.items.get(key),
      sizeBefore;

  if (!container) {
    this.dimension++;
    container = new this.Container();
    this.items.set(key, container);
  }

  if (this.Container === Set) {
    sizeBefore = container.size;
    container.add(value);

    if (sizeBefore < container.size)
      this.size++;
  }
  else {
    container.push(value);
    this.size++;
  }

  return this;
};

/**
 * Method used to delete the given key.
 *
 * @param  {any}     key - Key to delete.
 * @return {boolean}
 */
MultiMap.prototype.delete = function(key) {
  var container = this.items.get(key);

  if (!container)
    return false;

  this.size -= (this.Container === Set ? container.size : container.length);
  this.dimension--;
  this.items.delete(key);

  return true;
};

/**
 * Method used to delete the remove an item in the container stored at the
 * given key.
 *
 * @param  {any}     key - Key to delete.
 * @return {boolean}
 */
MultiMap.prototype.remove = function(key, value) {
  var container = this.items.get(key),
      wasDeleted,
      index;

  if (!container)
    return false;

  if (this.Container === Set) {
    wasDeleted = container.delete(value);

    if (wasDeleted)
      this.size--;

    if (container.size === 0) {
      this.items.delete(key);
      this.dimension--;
    }

    return wasDeleted;
  }
  else {
    index = container.indexOf(value);

    if (index === -1)
      return false;

    this.size--;

    if (container.length === 1) {
      this.items.delete(key);
      this.dimension--;

      return true;
    }

    container.splice(index, 1);

    return true;
  }
};

/**
 * Method used to return whether the given keys exists in the map.
 *
 * @param  {any}     key - Key to check.
 * @return {boolean}
 */
MultiMap.prototype.has = function(key) {
  return this.items.has(key);
};

/**
 * Method used to return the container stored at the given key or `undefined`.
 *
 * @param  {any}     key - Key to get.
 * @return {boolean}
 */
MultiMap.prototype.get = function(key) {
  return this.items.get(key);
};

/**
 * Method used to return the multiplicity of the given key, meaning the number
 * of times it is set, or, more trivially, the size of the attached container.
 *
 * @param  {any}     key - Key to check.
 * @return {number}
 */
MultiMap.prototype.multiplicity = function(key) {
  var container = this.items.get(key);

  if (typeof container === 'undefined')
    return 0;

  return this.Container === Set ? container.size : container.length;
};
MultiMap.prototype.count = MultiMap.prototype.multiplicity;

/**
 * Method used to iterate over each of the key/value pairs.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
MultiMap.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  // Inner iteration function is created here to avoid creating it in the loop
  var key;
  function inner(value) {
    callback.call(scope, value, key);
  }

  this.items.forEach(function(container, k) {
    key = k;
    container.forEach(inner);
  });
};

/**
 * Method used to iterate over each of the associations.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
MultiMap.prototype.forEachAssociation = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  this.items.forEach(callback, scope);
};

/**
 * Method returning an iterator over the map's keys.
 *
 * @return {Iterator}
 */
MultiMap.prototype.keys = function() {
  return this.items.keys();
};

/**
 * Method returning an iterator over the map's keys.
 *
 * @return {Iterator}
 */
MultiMap.prototype.values = function() {
  var iterator = this.items.values(),
      inContainer = false,
      countainer,
      step,
      i,
      l;

  if (this.Container === Set)
    return new Iterator(function next() {
      if (!inContainer) {
        step = iterator.next();

        if (step.done)
          return {done: true};

        inContainer = true;
        countainer = step.value.values();
      }

      step = countainer.next();

      if (step.done) {
        inContainer = false;
        return next();
      }

      return {
        done: false,
        value: step.value
      };
    });

  return new Iterator(function next() {
    if (!inContainer) {
      step = iterator.next();

      if (step.done)
        return {done: true};

      inContainer = true;
      countainer = step.value;
      i = 0;
      l = countainer.length;
    }

    if (i >= l) {
      inContainer = false;
      return next();
    }

    return {
      done: false,
      value: countainer[i++]
    };
  });
};

/**
 * Method returning an iterator over the map's entries.
 *
 * @return {Iterator}
 */
MultiMap.prototype.entries = function() {
  var iterator = this.items.entries(),
      inContainer = false,
      countainer,
      step,
      key,
      i,
      l;

  if (this.Container === Set)
    return new Iterator(function next() {
      if (!inContainer) {
        step = iterator.next();

        if (step.done)
          return {done: true};

        inContainer = true;
        key = step.value[0];
        countainer = step.value[1].values();
      }

      step = countainer.next();

      if (step.done) {
        inContainer = false;
        return next();
      }

      return {
        done: false,
        value: [key, step.value]
      };
    });

  return new Iterator(function next() {
    if (!inContainer) {
      step = iterator.next();

      if (step.done)
        return {done: true};

      inContainer = true;
      key = step.value[0];
      countainer = step.value[1];
      i = 0;
      l = countainer.length;
    }

    if (i >= l) {
      inContainer = false;
      return next();
    }

    return {
      done: false,
      value: [key, countainer[i++]]
    };
  });
};

/**
 * Method returning an iterator over the map's containers.
 *
 * @return {Iterator}
 */
MultiMap.prototype.containers = function() {
  return this.items.values();
};

/**
 * Method returning an iterator over the map's associations.
 *
 * @return {Iterator}
 */
MultiMap.prototype.associations = function() {
  return this.items.entries();
};

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  MultiMap.prototype[Symbol.iterator] = MultiMap.prototype.entries;

/**
 * Convenience known methods.
 */
MultiMap.prototype.inspect = function() {
  return this.items;
};

if (typeof Symbol !== 'undefined')
  MultiMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = MultiMap.prototype.inspect;
MultiMap.prototype.toJSON = function() {
  return this.items;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable  - Target iterable.
 * @param  {Class}    Container - Container.
 * @return {MultiMap}
 */
MultiMap.from = function(iterable, Container) {
  var map = new MultiMap(Container);

  forEach(iterable, function(value, key) {
    map.set(key, value);
  });

  return map;
};

/**
 * Exporting.
 */
module.exports = MultiMap;


/***/ }),
/* 192 */
/***/ ((module) => {

/**
 * Mnemonist HashedArrayTree
 * ==========================
 *
 * Abstract implementation of a hashed array tree representing arrays growing
 * dynamically.
 */

/**
 * Defaults.
 */
var DEFAULT_BLOCK_SIZE = 1024;

/**
 * Helpers.
 */
function powerOfTwo(x) {
  return (x & (x - 1)) === 0;
}

/**
 * HashedArrayTree.
 *
 * @constructor
 * @param {function}      ArrayClass           - An array constructor.
 * @param {number|object} initialCapacityOrOptions - Self-explanatory.
 */
function HashedArrayTree(ArrayClass, initialCapacityOrOptions) {
  if (arguments.length < 1)
    throw new Error('mnemonist/hashed-array-tree: expecting at least a byte array constructor.');

  var initialCapacity = initialCapacityOrOptions || 0,
      blockSize = DEFAULT_BLOCK_SIZE,
      initialLength = 0;

  if (typeof initialCapacityOrOptions === 'object') {
    initialCapacity = initialCapacityOrOptions.initialCapacity || 0;
    initialLength = initialCapacityOrOptions.initialLength || 0;
    blockSize = initialCapacityOrOptions.blockSize || DEFAULT_BLOCK_SIZE;
  }

  if (!blockSize || !powerOfTwo(blockSize))
    throw new Error('mnemonist/hashed-array-tree: block size should be a power of two.');

  var capacity = Math.max(initialLength, initialCapacity),
      initialBlocks = Math.ceil(capacity / blockSize);

  this.ArrayClass = ArrayClass;
  this.length = initialLength;
  this.capacity = initialBlocks * blockSize;
  this.blockSize = blockSize;
  this.offsetMask = blockSize - 1;
  this.blockMask = Math.log2(blockSize);

  // Allocating initial blocks
  this.blocks = new Array(initialBlocks);

  for (var i = 0; i < initialBlocks; i++)
    this.blocks[i] = new this.ArrayClass(this.blockSize);
}

/**
 * Method used to set a value.
 *
 * @param  {number} index - Index to edit.
 * @param  {any}    value - Value.
 * @return {HashedArrayTree}
 */
HashedArrayTree.prototype.set = function(index, value) {

  // Out of bounds?
  if (this.length < index)
    throw new Error('HashedArrayTree(' + this.ArrayClass.name + ').set: index out of bounds.');

  var block = index >> this.blockMask,
      i = index & this.offsetMask;

  this.blocks[block][i] = value;

  return this;
};

/**
 * Method used to get a value.
 *
 * @param  {number} index - Index to retrieve.
 * @return {any}
 */
HashedArrayTree.prototype.get = function(index) {
  if (this.length < index)
    return;

  var block = index >> this.blockMask,
      i = index & this.offsetMask;

  return this.blocks[block][i];
};

/**
 * Method used to grow the array.
 *
 * @param  {number}          capacity - Optional capacity to accomodate.
 * @return {HashedArrayTree}
 */
HashedArrayTree.prototype.grow = function(capacity) {
  if (typeof capacity !== 'number')
    capacity = this.capacity + this.blockSize;

  if (this.capacity >= capacity)
    return this;

  while (this.capacity < capacity) {
    this.blocks.push(new this.ArrayClass(this.blockSize));
    this.capacity += this.blockSize;
  }

  return this;
};

/**
 * Method used to resize the array. Won't deallocate.
 *
 * @param  {number}       length - Target length.
 * @return {HashedArrayTree}
 */
HashedArrayTree.prototype.resize = function(length) {
  if (length === this.length)
    return this;

  if (length < this.length) {
    this.length = length;
    return this;
  }

  this.length = length;
  this.grow(length);

  return this;
};

/**
 * Method used to push a value into the array.
 *
 * @param  {any}    value - Value to push.
 * @return {number}       - Length of the array.
 */
HashedArrayTree.prototype.push = function(value) {
  if (this.capacity === this.length)
    this.grow();

  var index = this.length;

  var block = index >> this.blockMask,
      i = index & this.offsetMask;

  this.blocks[block][i] = value;

  return ++this.length;
};

/**
 * Method used to pop the last value of the array.
 *
 * @return {number} - The popped value.
 */
HashedArrayTree.prototype.pop = function() {
  if (this.length === 0)
    return;

  var lastBlock = this.blocks[this.blocks.length - 1];

  var i = (--this.length) & this.offsetMask;

  return lastBlock[i];
};

/**
 * Convenience known methods.
 */
HashedArrayTree.prototype.inspect = function() {
  var proxy = new this.ArrayClass(this.length),
      block;

  for (var i = 0, l = this.length; i < l; i++) {
    block = i >> this.blockMask;
    proxy[i] = this.blocks[block][i & this.offsetMask];
  }

  proxy.type = this.ArrayClass.name;
  proxy.items = this.length;
  proxy.capacity = this.capacity;
  proxy.blockSize = this.blockSize;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: HashedArrayTree,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  HashedArrayTree.prototype[Symbol.for('nodejs.util.inspect.custom')] = HashedArrayTree.prototype.inspect;

/**
 * Exporting.
 */
module.exports = HashedArrayTree;


/***/ }),
/* 193 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Mnemonist StaticIntervalTree
 * =============================
 *
 * JavaScript implementation of a static interval tree. This tree is static in
 * that you are required to know all its items beforehand and to built it
 * from an iterable.
 *
 * This implementation represents the interval tree as an augmented balanced
 * binary search tree. It works by sorting the intervals by startpoint first
 * then proceeds building the augmented balanced BST bottom-up from the
 * sorted list.
 *
 * Note that this implementation considers every given intervals as closed for
 * simplicity's sake.
 *
 * For more information: https://en.wikipedia.org/wiki/Interval_tree
 */
var iterables = __webpack_require__(171),
    typed = __webpack_require__(172);

var FixedStack = __webpack_require__(194);


// TODO: pass index to getters
// TODO: custom comparison
// TODO: possibility to pass offset buffer

// TODO: intervals() => Symbol.iterator
// TODO: dfs()

/**
 * Helpers.
 */

/**
 * Recursive function building the BST from the sorted list of interval
 * indices.
 *
 * @param  {array}    intervals     - Array of intervals to index.
 * @param  {function} endGetter     - Getter function for end of intervals.
 * @param  {array}    sortedIndices - Sorted indices of the intervals.
 * @param  {array}    tree          - BST memory.
 * @param  {array}    augmentations - Array of node augmentations.
 * @param  {number}   i             - BST index of current node.
 * @param  {number}   low           - Dichotomy low index.
 * @param  {number}   high          - Dichotomy high index.
 * @return {number}                 - Created node augmentation value.
 */
function buildBST(
  intervals,
  endGetter,
  sortedIndices,
  tree,
  augmentations,
  i,
  low,
  high
) {
  var mid = (low + (high - low) / 2) | 0,
      midMinusOne = ~-mid,
      midPlusOne = -~mid;

  var current = sortedIndices[mid];
  tree[i] = current + 1;

  var end = endGetter ? endGetter(intervals[current]) : intervals[current][1];

  var left = i * 2 + 1,
      right = i * 2 + 2;

  var leftEnd = -Infinity,
      rightEnd = -Infinity;

  if (low <= midMinusOne) {
    leftEnd = buildBST(
      intervals,
      endGetter,
      sortedIndices,
      tree,
      augmentations,
      left,
      low,
      midMinusOne
    );
  }

  if (midPlusOne <= high) {
    rightEnd = buildBST(
      intervals,
      endGetter,
      sortedIndices,
      tree,
      augmentations,
      right,
      midPlusOne,
      high
    );
  }

  var augmentation = Math.max(end, leftEnd, rightEnd);

  var augmentationPointer = current;

  if (augmentation === leftEnd)
    augmentationPointer = augmentations[tree[left] - 1];
  else if (augmentation === rightEnd)
    augmentationPointer = augmentations[tree[right] - 1];

  augmentations[current] = augmentationPointer;

  return augmentation;
}

/**
 * StaticIntervalTree.
 *
 * @constructor
 * @param {array}           intervals - Array of intervals to index.
 * @param {array<function>} getters   - Optional getters.
 */
function StaticIntervalTree(intervals, getters) {

  // Properties
  this.size = intervals.length;
  this.intervals = intervals;

  var startGetter = null,
      endGetter = null;

  if (Array.isArray(getters)) {
    startGetter = getters[0];
    endGetter = getters[1];
  }

  // Building the indices array
  var length = intervals.length;

  var IndicesArray = typed.getPointerArray(length + 1);

  var indices = new IndicesArray(length);

  var i;

  for (i = 1; i < length; i++)
    indices[i] = i;

  // Sorting indices array
  // TODO: check if some version of radix sort can outperform this part
  indices.sort(function(a, b) {
    a = intervals[a];
    b = intervals[b];

    if (startGetter) {
      a = startGetter(a);
      b = startGetter(b);
    }
    else {
      a = a[0];
      b = b[0];
    }

    if (a < b)
      return -1;

    if (a > b)
      return 1;

    // TODO: use getters
    // TODO: this ordering has the following invariant: if query interval
    // contains [nodeStart, max], then whole right subtree can be collected
    // a = a[1];
    // b = b[1];

    // if (a < b)
    //   return 1;

    // if (a > b)
    //   return -1;

    return 0;
  });

  // Building the binary tree
  var height = Math.ceil(Math.log2(length + 1)),
      treeSize = Math.pow(2, height) - 1;

  var tree = new IndicesArray(treeSize);

  var augmentations = new IndicesArray(length);

  buildBST(
    intervals,
    endGetter,
    indices,
    tree,
    augmentations,
    0,
    0,
    length - 1
  );

  // Dropping indices
  indices = null;

  // Storing necessary information
  this.height = height;
  this.tree = tree;
  this.augmentations = augmentations;
  this.startGetter = startGetter;
  this.endGetter = endGetter;

  // Initializing DFS stack
  this.stack = new FixedStack(IndicesArray, this.height);
}

/**
 * Method returning a list of intervals containing the given point.
 *
 * @param  {any}   point - Target point.
 * @return {array}
 */
StaticIntervalTree.prototype.intervalsContainingPoint = function(point) {
  var matches = [];

  var stack = this.stack;

  stack.clear();
  stack.push(0);

  var l = this.tree.length;

  var bstIndex,
      intervalIndex,
      interval,
      maxInterval,
      start,
      end,
      max,
      left,
      right;

  while (stack.size) {
    bstIndex = stack.pop();
    intervalIndex = this.tree[bstIndex] - 1;
    interval = this.intervals[intervalIndex];
    maxInterval = this.intervals[this.augmentations[intervalIndex]];

    max = this.endGetter ? this.endGetter(maxInterval) : maxInterval[1];

    // No possible match, point is farther right than the max end value
    if (point > max)
      continue;

    // Searching left
    left = bstIndex * 2 + 1;

    if (left < l && this.tree[left] !== 0)
      stack.push(left);

    start = this.startGetter ? this.startGetter(interval) : interval[0];
    end = this.endGetter ? this.endGetter(interval) : interval[1];

    // Checking current node
    if (point >= start && point <= end)
      matches.push(interval);

    // If the point is to the left of the start of the current interval,
    // then it cannot be in the right child
    if (point < start)
      continue;

    // Searching right
    right = bstIndex * 2 + 2;

    if (right < l && this.tree[right] !== 0)
      stack.push(right);
  }

  return matches;
};

/**
 * Method returning a list of intervals overlapping the given interval.
 *
 * @param  {any}   interval - Target interval.
 * @return {array}
 */
StaticIntervalTree.prototype.intervalsOverlappingInterval = function(interval) {
  var intervalStart = this.startGetter ? this.startGetter(interval) : interval[0],
      intervalEnd = this.endGetter ? this.endGetter(interval) : interval[1];

  var matches = [];

  var stack = this.stack;

  stack.clear();
  stack.push(0);

  var l = this.tree.length;

  var bstIndex,
      intervalIndex,
      currentInterval,
      maxInterval,
      start,
      end,
      max,
      left,
      right;

  while (stack.size) {
    bstIndex = stack.pop();
    intervalIndex = this.tree[bstIndex] - 1;
    currentInterval = this.intervals[intervalIndex];
    maxInterval = this.intervals[this.augmentations[intervalIndex]];

    max = this.endGetter ? this.endGetter(maxInterval) : maxInterval[1];

    // No possible match, start is farther right than the max end value
    if (intervalStart > max)
      continue;

    // Searching left
    left = bstIndex * 2 + 1;

    if (left < l && this.tree[left] !== 0)
      stack.push(left);

    start = this.startGetter ? this.startGetter(currentInterval) : currentInterval[0];
    end = this.endGetter ? this.endGetter(currentInterval) : currentInterval[1];

    // Checking current node
    if (intervalEnd >= start && intervalStart <= end)
      matches.push(currentInterval);

    // If the end is to the left of the start of the current interval,
    // then it cannot be in the right child
    if (intervalEnd < start)
      continue;

    // Searching right
    right = bstIndex * 2 + 2;

    if (right < l && this.tree[right] !== 0)
      stack.push(right);
  }

  return matches;
};

/**
 * Convenience known methods.
 */
StaticIntervalTree.prototype.inspect = function() {
  var proxy = this.intervals.slice();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: StaticIntervalTree,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  StaticIntervalTree.prototype[Symbol.for('nodejs.util.inspect.custom')] = StaticIntervalTree.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {StaticIntervalTree}
 */
StaticIntervalTree.from = function(iterable, getters) {
  if (iterables.isArrayLike(iterable))
    return new StaticIntervalTree(iterable, getters);

  return new StaticIntervalTree(Array.from(iterable), getters);
};

/**
 * Exporting.
 */
module.exports = StaticIntervalTree;


/***/ }),
/* 194 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist FixedStack
 * =====================
 *
 * The fixed stack is a stack whose capacity is defined beforehand and that
 * cannot be exceeded. This class is really useful when combined with
 * byte arrays to save up some memory and avoid memory re-allocation, hence
 * speeding up computations.
 *
 * This has however a downside: you need to know the maximum size you stack
 * can have during your iteration (which is not too difficult to compute when
 * performing, say, a DFS on a balanced binary tree).
 */
var Iterator = __webpack_require__(177),
    iterables = __webpack_require__(171);

/**
 * FixedStack
 *
 * @constructor
 * @param {function} ArrayClass - Array class to use.
 * @param {number}   capacity   - Desired capacity.
 */
function FixedStack(ArrayClass, capacity) {

  if (arguments.length < 2)
    throw new Error('mnemonist/fixed-stack: expecting an Array class and a capacity.');

  if (typeof capacity !== 'number' || capacity <= 0)
    throw new Error('mnemonist/fixed-stack: `capacity` should be a positive number.');

  this.capacity = capacity;
  this.ArrayClass = ArrayClass;
  this.items = new this.ArrayClass(this.capacity);
  this.clear();
}

/**
 * Method used to clear the stack.
 *
 * @return {undefined}
 */
FixedStack.prototype.clear = function() {

  // Properties
  this.size = 0;
};

/**
 * Method used to add an item to the stack.
 *
 * @param  {any}    item - Item to add.
 * @return {number}
 */
FixedStack.prototype.push = function(item) {
  if (this.size === this.capacity)
    throw new Error('mnemonist/fixed-stack.push: stack capacity (' + this.capacity + ') exceeded!');

  this.items[this.size++] = item;
  return this.size;
};

/**
 * Method used to retrieve & remove the last item of the stack.
 *
 * @return {any}
 */
FixedStack.prototype.pop = function() {
  if (this.size === 0)
    return;

  return this.items[--this.size];
};

/**
 * Method used to get the last item of the stack.
 *
 * @return {any}
 */
FixedStack.prototype.peek = function() {
  return this.items[this.size - 1];
};

/**
 * Method used to iterate over the stack.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
FixedStack.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = 0, l = this.items.length; i < l; i++)
    callback.call(scope, this.items[l - i - 1], i, this);
};

/**
 * Method used to convert the stack to a JavaScript array.
 *
 * @return {array}
 */
FixedStack.prototype.toArray = function() {
  var array = new this.ArrayClass(this.size),
      l = this.size - 1,
      i = this.size;

  while (i--)
    array[i] = this.items[l - i];

  return array;
};

/**
 * Method used to create an iterator over a stack's values.
 *
 * @return {Iterator}
 */
FixedStack.prototype.values = function() {
  var items = this.items,
      l = this.size,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

    var value = items[l - i - 1];
    i++;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over a stack's entries.
 *
 * @return {Iterator}
 */
FixedStack.prototype.entries = function() {
  var items = this.items,
      l = this.size,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

    var value = items[l - i - 1];

    return {
      value: [i++, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  FixedStack.prototype[Symbol.iterator] = FixedStack.prototype.values;


/**
 * Convenience known methods.
 */
FixedStack.prototype.toString = function() {
  return this.toArray().join(',');
};

FixedStack.prototype.toJSON = function() {
  return this.toArray();
};

FixedStack.prototype.inspect = function() {
  var array = this.toArray();

  array.type = this.ArrayClass.name;
  array.capacity = this.capacity;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: FixedStack,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  FixedStack.prototype[Symbol.for('nodejs.util.inspect.custom')] = FixedStack.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a stack.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {function} ArrayClass - Array class to use.
 * @param  {number}   capacity   - Desired capacity.
 * @return {FixedStack}
 */
FixedStack.from = function(iterable, ArrayClass, capacity) {

  if (arguments.length < 3) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/fixed-stack.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }

  var stack = new FixedStack(ArrayClass, capacity);

  if (iterables.isArrayLike(iterable)) {
    var i, l;

    for (i = 0, l = iterable.length; i < l; i++)
      stack.items[i] = iterable[i];

    stack.size = l;

    return stack;
  }

  iterables.forEach(iterable, function(value) {
    stack.push(value);
  });

  return stack;
};

/**
 * Exporting.
 */
module.exports = FixedStack;


/***/ }),
/* 195 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Inverted Index
 * =========================
 *
 * JavaScript implementation of an inverted index.
 */
var Iterator = __webpack_require__(177),
    forEach = __webpack_require__(168),
    helpers = __webpack_require__(196);

function identity(x) {
  return x;
}

/**
 * InvertedIndex.
 *
 * @constructor
 * @param {function} tokenizer - Tokenizer function.
 */
function InvertedIndex(descriptor) {
  this.clear();

  if (Array.isArray(descriptor)) {
    this.documentTokenizer = descriptor[0];
    this.queryTokenizer = descriptor[1];
  }
  else {
    this.documentTokenizer = descriptor;
    this.queryTokenizer = descriptor;
  }

  if (!this.documentTokenizer)
    this.documentTokenizer = identity;
  if (!this.queryTokenizer)
    this.queryTokenizer = identity;

  if (typeof this.documentTokenizer !== 'function')
    throw new Error('mnemonist/InvertedIndex.constructor: document tokenizer is not a function.');

  if (typeof this.queryTokenizer !== 'function')
    throw new Error('mnemonist/InvertedIndex.constructor: query tokenizer is not a function.');
}

/**
 * Method used to clear the InvertedIndex.
 *
 * @return {undefined}
 */
InvertedIndex.prototype.clear = function() {

  // Properties
  this.items = [];
  this.mapping = new Map();
  this.size = 0;
  this.dimension = 0;
};

/**
 * Method used to add a document to the index.
 *
 * @param  {any} doc - Item to add.
 * @return {InvertedIndex}
 */
InvertedIndex.prototype.add = function(doc) {

  // Increasing size
  this.size++;

  // Storing document
  var key = this.items.length;
  this.items.push(doc);

  // Tokenizing the document
  var tokens = this.documentTokenizer(doc);

  if (!Array.isArray(tokens))
    throw new Error('mnemonist/InvertedIndex.add: tokenizer function should return an array of tokens.');

  // Indexing
  var done = new Set(),
      token,
      container;

  for (var i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i];

    if (done.has(token))
      continue;

    done.add(token);

    container = this.mapping.get(token);

    if (!container) {
      container = [];
      this.mapping.set(token, container);
    }

    container.push(key);
  }

  this.dimension = this.mapping.size;

  return this;
};

/**
 * Method used to query the index in a AND fashion.
 *
 * @param  {any} query - Query
 * @return {Set}       - Intersection of documents matching the query.
 */
InvertedIndex.prototype.get = function(query) {

  // Early termination
  if (!this.size)
    return [];

  // First we need to tokenize the query
  var tokens = this.queryTokenizer(query);

  if (!Array.isArray(tokens))
    throw new Error('mnemonist/InvertedIndex.query: tokenizer function should return an array of tokens.');

  if (!tokens.length)
    return [];

  var results = this.mapping.get(tokens[0]),
      c,
      i,
      l;

  if (typeof results === 'undefined' || results.length === 0)
    return [];

  if (tokens.length > 1) {
    for (i = 1, l = tokens.length; i < l; i++) {
      c = this.mapping.get(tokens[i]);

      if (typeof c === 'undefined' || c.length === 0)
        return [];

      results = helpers.intersectionUniqueArrays(results, c);
    }
  }

  var docs = new Array(results.length);

  for (i = 0, l = docs.length; i < l; i++)
    docs[i] = this.items[results[i]];

  return docs;
};

/**
 * Method used to iterate over each of the documents.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
InvertedIndex.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = 0, l = this.documents.length; i < l; i++)
    callback.call(scope, this.documents[i], i, this);
};

/**
 * Method returning an iterator over the index's documents.
 *
 * @return {Iterator}
 */
InvertedIndex.prototype.documents = function() {
  var documents = this.items,
      l = documents.length,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

      var value = documents[i++];

      return {
        value: value,
        done: false
      };
  });
};

/**
 * Method returning an iterator over the index's tokens.
 *
 * @return {Iterator}
 */
InvertedIndex.prototype.tokens = function() {
  return this.mapping.keys();
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  InvertedIndex.prototype[Symbol.iterator] = InvertedIndex.prototype.documents;

/**
 * Convenience known methods.
 */
InvertedIndex.prototype.inspect = function() {
  var array = this.items.slice();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: InvertedIndex,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  InvertedIndex.prototype[Symbol.for('nodejs.util.inspect.custom')] = InvertedIndex.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a InvertedIndex.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} tokenizer - Tokenizer function.
 * @return {InvertedIndex}
 */
InvertedIndex.from = function(iterable, descriptor) {
  var index = new InvertedIndex(descriptor);

  forEach(iterable, function(doc) {
    index.add(doc);
  });

  return index;
};

/**
 * Exporting.
 */
module.exports = InvertedIndex;


/***/ }),
/* 196 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* eslint no-constant-condition: 0 */
/**
 * Mnemonist Merge Helpers
 * ========================
 *
 * Various merge algorithms used to handle sorted lists. Note that the given
 * functions are optimized and won't accept mixed arguments.
 *
 * Note: maybe this piece of code belong to sortilege, along with binary-search.
 */
var typed = __webpack_require__(172),
    isArrayLike = (__webpack_require__(171).isArrayLike),
    binarySearch = __webpack_require__(197),
    FibonacciHeap = __webpack_require__(173);

// TODO: update to use exponential search
// TODO: when not knowing final length => should use plain arrays rather than
// same type as input

/**
 * Merge two sorted array-like structures into one.
 *
 * @param  {array} a - First array.
 * @param  {array} b - Second array.
 * @return {array}
 */
function mergeArrays(a, b) {

  // One of the arrays is empty
  if (a.length === 0)
    return b.slice();
  if (b.length === 0)
    return a.slice();

  // Finding min array
  var tmp;

  if (a[0] > b[0]) {
    tmp = a;
    a = b;
    b = tmp;
  }

  // If array have non overlapping ranges, we can just concatenate them
  var aEnd = a[a.length - 1],
      bStart = b[0];

  if (aEnd <= bStart) {
    if (typed.isTypedArray(a))
      return typed.concat(a, b);
    return a.concat(b);
  }

  // Initializing target
  var array = new a.constructor(a.length + b.length);

  // Iterating until we overlap
  var i, l, v;

  for (i = 0, l = a.length; i < l; i++) {
    v = a[i];

    if (v <= bStart)
      array[i] = v;
    else
      break;
  }

  // Handling overlap
  var aPointer = i,
      aLength = a.length,
      bPointer = 0,
      bLength = b.length,
      aHead,
      bHead;

  while (aPointer < aLength && bPointer < bLength) {
    aHead = a[aPointer];
    bHead = b[bPointer];

    if (aHead <= bHead) {
      array[i++] = aHead;
      aPointer++;
    }
    else {
      array[i++] = bHead;
      bPointer++;
    }
  }

  // Filling
  while (aPointer < aLength)
    array[i++] = a[aPointer++];
  while (bPointer < bLength)
    array[i++] = b[bPointer++];

  return array;
}

/**
 * Perform the union of two already unique sorted array-like structures into one.
 *
 * @param  {array} a - First array.
 * @param  {array} b - Second array.
 * @return {array}
 */
function unionUniqueArrays(a, b) {

  // One of the arrays is empty
  if (a.length === 0)
    return b.slice();
  if (b.length === 0)
    return a.slice();

  // Finding min array
  var tmp;

  if (a[0] > b[0]) {
    tmp = a;
    a = b;
    b = tmp;
  }

  // If array have non overlapping ranges, we can just concatenate them
  var aEnd = a[a.length - 1],
      bStart = b[0];

  if (aEnd < bStart) {
    if (typed.isTypedArray(a))
      return typed.concat(a, b);
    return a.concat(b);
  }

  // Initializing target
  var array = new a.constructor();

  // Iterating until we overlap
  var i, l, v;

  for (i = 0, l = a.length; i < l; i++) {
    v = a[i];

    if (v < bStart)
      array.push(v);
    else
      break;
  }

  // Handling overlap
  var aPointer = i,
      aLength = a.length,
      bPointer = 0,
      bLength = b.length,
      aHead,
      bHead;

  while (aPointer < aLength && bPointer < bLength) {
    aHead = a[aPointer];
    bHead = b[bPointer];

    if (aHead <= bHead) {

      if (array.length === 0 || array[array.length - 1] !== aHead)
        array.push(aHead);

      aPointer++;
    }
    else {
      if (array.length === 0 || array[array.length - 1] !== bHead)
        array.push(bHead);

      bPointer++;
    }
  }

  // Filling
  // TODO: it's possible to optimize a bit here, since the condition is only
  // relevant the first time
  while (aPointer < aLength) {
    aHead = a[aPointer++];

    if (array.length === 0 || array[array.length - 1] !== aHead)
      array.push(aHead);
  }
  while (bPointer < bLength) {
    bHead = b[bPointer++];

    if (array.length === 0 || array[array.length - 1] !== bHead)
      array.push(bHead);
  }

  return array;
}

/**
 * Perform the intersection of two already unique sorted array-like structures into one.
 *
 * @param  {array} a - First array.
 * @param  {array} b - Second array.
 * @return {array}
 */
exports.intersectionUniqueArrays = function(a, b) {

  // One of the arrays is empty
  if (a.length === 0 || b.length === 0)
    return new a.constructor(0);

  // Finding min array
  var tmp;

  if (a[0] > b[0]) {
    tmp = a;
    a = b;
    b = tmp;
  }

  // If array have non overlapping ranges, there is no intersection
  var aEnd = a[a.length - 1],
      bStart = b[0];

  if (aEnd < bStart)
    return new a.constructor(0);

  // Initializing target
  var array = new a.constructor();

  // Handling overlap
  var aPointer = binarySearch.lowerBound(a, bStart),
      aLength = a.length,
      bPointer = 0,
      bLength = binarySearch.upperBound(b, aEnd),
      aHead,
      bHead;

  while (aPointer < aLength && bPointer < bLength) {
    aHead = a[aPointer];
    bHead = b[bPointer];

    if (aHead < bHead) {
      aPointer = binarySearch.lowerBound(a, bHead, aPointer + 1);
    }
    else if (aHead > bHead) {
      bPointer = binarySearch.lowerBound(b, aHead, bPointer + 1);
    }
    else {
      array.push(aHead);
      aPointer++;
      bPointer++;
    }
  }

  return array;
};

/**
 * Merge k sorted array-like structures into one.
 *
 * @param  {array<array>} arrays - Arrays to merge.
 * @return {array}
 */
function kWayMergeArrays(arrays) {
  var length = 0,
      max = -Infinity,
      al,
      i,
      l;

  var filtered = [];

  for (i = 0, l = arrays.length; i < l; i++) {
    al = arrays[i].length;

    if (al === 0)
      continue;

    filtered.push(arrays[i]);

    length += al;

    if (al > max)
      max = al;
  }

  if (filtered.length === 0)
    return new arrays[0].constructor(0);

  if (filtered.length === 1)
    return filtered[0].slice();

  if (filtered.length === 2)
    return mergeArrays(filtered[0], filtered[1]);

  arrays = filtered;

  var array = new arrays[0].constructor(length);

  var PointerArray = typed.getPointerArray(max);

  var pointers = new PointerArray(arrays.length);

  // TODO: benchmark vs. a binomial heap
  var heap = new FibonacciHeap(function(a, b) {
    a = arrays[a][pointers[a]];
    b = arrays[b][pointers[b]];

    if (a < b)
      return -1;

    if (a > b)
      return 1;

    return 0;
  });

  for (i = 0; i < l; i++)
    heap.push(i);

  i = 0;

  var p,
      v;

  while (heap.size) {
    p = heap.pop();
    v = arrays[p][pointers[p]++];
    array[i++] = v;

    if (pointers[p] < arrays[p].length)
      heap.push(p);
  }

  return array;
}

/**
 * Perform the union of k sorted unique array-like structures into one.
 *
 * @param  {array<array>} arrays - Arrays to merge.
 * @return {array}
 */
function kWayUnionUniqueArrays(arrays) {
  var max = -Infinity,
      al,
      i,
      l;

  var filtered = [];

  for (i = 0, l = arrays.length; i < l; i++) {
    al = arrays[i].length;

    if (al === 0)
      continue;

    filtered.push(arrays[i]);

    if (al > max)
      max = al;
  }

  if (filtered.length === 0)
    return new arrays[0].constructor(0);

  if (filtered.length === 1)
    return filtered[0].slice();

  if (filtered.length === 2)
    return unionUniqueArrays(filtered[0], filtered[1]);

  arrays = filtered;

  var array = new arrays[0].constructor();

  var PointerArray = typed.getPointerArray(max);

  var pointers = new PointerArray(arrays.length);

  // TODO: benchmark vs. a binomial heap
  var heap = new FibonacciHeap(function(a, b) {
    a = arrays[a][pointers[a]];
    b = arrays[b][pointers[b]];

    if (a < b)
      return -1;

    if (a > b)
      return 1;

    return 0;
  });

  for (i = 0; i < l; i++)
    heap.push(i);

  var p,
      v;

  while (heap.size) {
    p = heap.pop();
    v = arrays[p][pointers[p]++];

    if (array.length === 0 || array[array.length - 1] !== v)
      array.push(v);

    if (pointers[p] < arrays[p].length)
      heap.push(p);
  }

  return array;
}

/**
 * Perform the intersection of k sorted array-like structures into one.
 *
 * @param  {array<array>} arrays - Arrays to merge.
 * @return {array}
 */
exports.kWayIntersectionUniqueArrays = function(arrays) {
  var max = -Infinity,
      maxStart = -Infinity,
      minEnd = Infinity,
      first,
      last,
      al,
      i,
      l;

  for (i = 0, l = arrays.length; i < l; i++) {
    al = arrays[i].length;

    // If one of the arrays is empty, so is the intersection
    if (al === 0)
      return [];

    if (al > max)
      max = al;

    first = arrays[i][0];
    last = arrays[i][al - 1];

    if (first > maxStart)
      maxStart = first;

    if (last < minEnd)
      minEnd = last;
  }

  // Full overlap is impossible
  if (maxStart > minEnd)
    return [];

  // Only one value
  if (maxStart === minEnd)
    return [maxStart];

  // NOTE: trying to outsmart I(D,I(C,I(A,B))) is pointless unfortunately...
  // NOTE: I tried to be very clever about bounds but it does not seem
  // to improve the performance of the algorithm.
  var a, b,
      array = arrays[0],
      aPointer,
      bPointer,
      aLimit,
      bLimit,
      aHead,
      bHead,
      start = maxStart;

  for (i = 1; i < l; i++) {
    a = array;
    b = arrays[i];

    // Change that to `[]` and observe some perf drops on V8...
    array = new Array();

    aPointer = 0;
    bPointer = binarySearch.lowerBound(b, start);

    aLimit = a.length;
    bLimit = b.length;

    while (aPointer < aLimit && bPointer < bLimit) {
      aHead = a[aPointer];
      bHead = b[bPointer];

      if (aHead < bHead) {
        aPointer = binarySearch.lowerBound(a, bHead, aPointer + 1);
      }
      else if (aHead > bHead) {
        bPointer = binarySearch.lowerBound(b, aHead, bPointer + 1);
      }
      else {
        array.push(aHead);
        aPointer++;
        bPointer++;
      }
    }

    if (array.length === 0)
      return array;

    start = array[0];
  }

  return array;
};

/**
 * Variadic merging all of the given arrays.
 *
 * @param  {...array}
 * @return {array}
 */
exports.merge = function() {
  if (arguments.length === 2) {
    if (isArrayLike(arguments[0]))
      return mergeArrays(arguments[0], arguments[1]);
  }
  else {
    if (isArrayLike(arguments[0]))
      return kWayMergeArrays(arguments);
  }

  return null;
};

/**
 * Variadic function performing the union of all the given unique arrays.
 *
 * @param  {...array}
 * @return {array}
 */
exports.unionUnique = function() {
  if (arguments.length === 2) {
    if (isArrayLike(arguments[0]))
      return unionUniqueArrays(arguments[0], arguments[1]);
  }
  else {
    if (isArrayLike(arguments[0]))
      return kWayUnionUniqueArrays(arguments);
  }

  return null;
};

/**
 * Variadic function performing the intersection of all the given unique arrays.
 *
 * @param  {...array}
 * @return {array}
 */
exports.intersectionUnique = function() {
  if (arguments.length === 2) {
    if (isArrayLike(arguments[0]))
      return exports.intersectionUniqueArrays(arguments[0], arguments[1]);
  }
  else {
    if (isArrayLike(arguments[0]))
      return exports.kWayIntersectionUniqueArrays(arguments);
  }

  return null;
};


/***/ }),
/* 197 */
/***/ ((__unused_webpack_module, exports) => {

/**
 * Mnemonist Binary Search Helpers
 * ================================
 *
 * Typical binary search functions.
 */

/**
 * Function returning the index of the search value in the array or `-1` if
 * not found.
 *
 * @param  {array} array - Haystack.
 * @param  {any}   value - Needle.
 * @return {number}
 */
exports.search = function(array, value, lo, hi) {
  var mid = 0;

  lo = typeof lo !== 'undefined' ? lo : 0;
  hi = typeof hi !== 'undefined' ? hi : array.length;

  hi--;

  var current;

  while (lo <= hi) {
    mid = (lo + hi) >>> 1;

    current = array[mid];

    if (current > value) {
      hi = ~-mid;
    }
    else if (current < value) {
      lo = -~mid;
    }
    else {
      return mid;
    }
  }

  return -1;
};

/**
 * Same as above, but can use a custom comparator function.
 *
 * @param  {function} comparator - Custom comparator function.
 * @param  {array}    array      - Haystack.
 * @param  {any}      value      - Needle.
 * @return {number}
 */
exports.searchWithComparator = function(comparator, array, value) {
  var mid = 0,
      lo = 0,
      hi = ~-array.length,
      comparison;

  while (lo <= hi) {
    mid = (lo + hi) >>> 1;

    comparison = comparator(array[mid], value);

    if (comparison > 0) {
      hi = ~-mid;
    }
    else if (comparison < 0) {
      lo = -~mid;
    }
    else {
      return mid;
    }
  }

  return -1;
};

/**
 * Function returning the lower bound of the given value in the array.
 *
 * @param  {array}  array - Haystack.
 * @param  {any}    value - Needle.
 * @param  {number} [lo] - Start index.
 * @param  {numner} [hi] - End index.
 * @return {number}
 */
exports.lowerBound = function(array, value, lo, hi) {
  var mid = 0;

  lo = typeof lo !== 'undefined' ? lo : 0;
  hi = typeof hi !== 'undefined' ? hi : array.length;

  while (lo < hi) {
    mid = (lo + hi) >>> 1;

    if (value <= array[mid]) {
      hi = mid;
    }
    else {
      lo = -~mid;
    }
  }

  return lo;
};

/**
 * Same as above, but can use a custom comparator function.
 *
 * @param  {function} comparator - Custom comparator function.
 * @param  {array}    array      - Haystack.
 * @param  {any}      value      - Needle.
 * @return {number}
 */
exports.lowerBoundWithComparator = function(comparator, array, value) {
  var mid = 0,
      lo = 0,
      hi = array.length;

  while (lo < hi) {
    mid = (lo + hi) >>> 1;

    if (comparator(value, array[mid]) <= 0) {
      hi = mid;
    }
    else {
      lo = -~mid;
    }
  }

  return lo;
};

/**
 * Same as above, but can work on sorted indices.
 *
 * @param  {array}    array - Haystack.
 * @param  {array}    array - Indices.
 * @param  {any}      value - Needle.
 * @return {number}
 */
exports.lowerBoundIndices = function(array, indices, value, lo, hi) {
  var mid = 0;

  lo = typeof lo !== 'undefined' ? lo : 0;
  hi = typeof hi !== 'undefined' ? hi : array.length;

  while (lo < hi) {
    mid = (lo + hi) >>> 1;

    if (value <= array[indices[mid]]) {
      hi = mid;
    }
    else {
      lo = -~mid;
    }
  }

  return lo;
};

/**
 * Function returning the upper bound of the given value in the array.
 *
 * @param  {array}  array - Haystack.
 * @param  {any}    value - Needle.
 * @param  {number} [lo] - Start index.
 * @param  {numner} [hi] - End index.
 * @return {number}
 */
exports.upperBound = function(array, value, lo, hi) {
  var mid = 0;

  lo = typeof lo !== 'undefined' ? lo : 0;
  hi = typeof hi !== 'undefined' ? hi : array.length;

  while (lo < hi) {
    mid = (lo + hi) >>> 1;

    if (value >= array[mid]) {
      lo = -~mid;
    }
    else {
      hi = mid;
    }
  }

  return lo;
};

/**
 * Same as above, but can use a custom comparator function.
 *
 * @param  {function} comparator - Custom comparator function.
 * @param  {array}    array      - Haystack.
 * @param  {any}      value      - Needle.
 * @return {number}
 */
exports.upperBoundWithComparator = function(comparator, array, value) {
  var mid = 0,
      lo = 0,
      hi = array.length;

  while (lo < hi) {
    mid = (lo + hi) >>> 1;

    if (comparator(value, array[mid]) >= 0) {
      lo = -~mid;
    }
    else {
      hi = mid;
    }
  }

  return lo;
};


/***/ }),
/* 198 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist KDTree
 * =================
 *
 * Low-level JavaScript implementation of a k-dimensional tree.
 */
var iterables = __webpack_require__(171);
var typed = __webpack_require__(172);
var createTupleComparator = (__webpack_require__(170).createTupleComparator);
var FixedReverseHeap = __webpack_require__(188);
var inplaceQuickSortIndices = (__webpack_require__(199).inplaceQuickSortIndices);

/**
 * Helper function used to compute the squared distance between a query point
 * and an indexed points whose values are stored in a tree's axes.
 *
 * Note that squared distance is used instead of euclidean to avoid
 * costly sqrt computations.
 *
 * @param  {number} dimensions - Number of dimensions.
 * @param  {array}  axes       - Axes data.
 * @param  {number} pivot      - Pivot.
 * @param  {array}  point      - Query point.
 * @return {number}
 */
function squaredDistanceAxes(dimensions, axes, pivot, b) {
  var d;

  var dist = 0,
      step;

  for (d = 0; d < dimensions; d++) {
    step = axes[d][pivot] - b[d];
    dist += step * step;
  }

  return dist;
}

/**
 * Helper function used to reshape input data into low-level axes data.
 *
 * @param  {number} dimensions - Number of dimensions.
 * @param  {array}  data       - Data in the shape [label, [x, y, z...]]
 * @return {object}
 */
function reshapeIntoAxes(dimensions, data) {
  var l = data.length;

  var axes = new Array(dimensions),
      labels = new Array(l),
      axis;

  var PointerArray = typed.getPointerArray(l);

  var ids = new PointerArray(l);

  var d, i, row;

  var f = true;

  for (d = 0; d < dimensions; d++) {
    axis = new Float64Array(l);

    for (i = 0; i < l; i++) {
      row = data[i];
      axis[i] = row[1][d];

      if (f) {
        labels[i] = row[0];
        ids[i] = i;
      }
    }

    f = false;
    axes[d] = axis;
  }

  return {axes: axes, ids: ids, labels: labels};
}

/**
 * Helper function used to build a kd-tree from axes data.
 *
 * @param  {number} dimensions - Number of dimensions.
 * @param  {array}  axes       - Axes.
 * @param  {array}  ids        - Indices to sort.
 * @param  {array}  labels     - Point labels.
 * @return {object}
 */
function buildTree(dimensions, axes, ids, labels) {
  var l = labels.length;

  // NOTE: +1 because we need to keep 0 as null pointer
  var PointerArray = typed.getPointerArray(l + 1);

  // Building the tree
  var pivots = new PointerArray(l),
      lefts = new PointerArray(l),
      rights = new PointerArray(l);

  var stack = [[0, 0, ids.length, -1, 0]],
      step,
      parent,
      direction,
      median,
      pivot,
      lo,
      hi;

  var d, i = 0;

  while (stack.length !== 0) {
    step = stack.pop();

    d = step[0];
    lo = step[1];
    hi = step[2];
    parent = step[3];
    direction = step[4];

    inplaceQuickSortIndices(axes[d], ids, lo, hi);

    l = hi - lo;
    median = lo + (l >>> 1); // Fancy floor(l / 2)
    pivot = ids[median];
    pivots[i] = pivot;

    if (parent > -1) {
      if (direction === 0)
        lefts[parent] = i + 1;
      else
        rights[parent] = i + 1;
    }

    d = (d + 1) % dimensions;

    // Right
    if (median !== lo && median !== hi - 1) {
      stack.push([d, median + 1, hi, i, 1]);
    }

    // Left
    if (median !== lo) {
      stack.push([d, lo, median, i, 0]);
    }

    i++;
  }

  return {
    axes: axes,
    labels: labels,
    pivots: pivots,
    lefts: lefts,
    rights: rights
  };
}

/**
 * KDTree.
 *
 * @constructor
 */
function KDTree(dimensions, build) {
  this.dimensions = dimensions;
  this.visited = 0;

  this.axes = build.axes;
  this.labels = build.labels;

  this.pivots = build.pivots;
  this.lefts = build.lefts;
  this.rights = build.rights;

  this.size = this.labels.length;
}

/**
 * Method returning the query's nearest neighbor.
 *
 * @param  {array}  query - Query point.
 * @return {any}
 */
KDTree.prototype.nearestNeighbor = function(query) {
  var bestDistance = Infinity,
      best = null;

  var dimensions = this.dimensions,
      axes = this.axes,
      pivots = this.pivots,
      lefts = this.lefts,
      rights = this.rights;

  var visited = 0;

  function recurse(d, node) {
    visited++;

    var left = lefts[node],
        right = rights[node],
        pivot = pivots[node];

    var dist = squaredDistanceAxes(
      dimensions,
      axes,
      pivot,
      query
    );

    if (dist < bestDistance) {
      best = pivot;
      bestDistance = dist;

      if (dist === 0)
        return;
    }

    var dx = axes[d][pivot] - query[d];

    d = (d + 1) % dimensions;

    // Going the correct way?
    if (dx > 0) {
      if (left !== 0)
        recurse(d, left - 1);
    }
    else {
      if (right !== 0)
        recurse(d, right - 1);
    }

    // Going the other way?
    if (dx * dx < bestDistance) {
      if (dx > 0) {
        if (right !== 0)
          recurse(d, right - 1);
      }
      else {
        if (left !== 0)
          recurse(d, left - 1);
      }
    }
  }

  recurse(0, 0);

  this.visited = visited;
  return this.labels[best];
};

var KNN_HEAP_COMPARATOR_3 = createTupleComparator(3);
var KNN_HEAP_COMPARATOR_2 = createTupleComparator(2);

/**
 * Method returning the query's k nearest neighbors.
 *
 * @param  {number} k     - Number of nearest neighbor to retrieve.
 * @param  {array}  query - Query point.
 * @return {array}
 */

// TODO: can do better by improving upon static-kdtree here
KDTree.prototype.kNearestNeighbors = function(k, query) {
  if (k <= 0)
    throw new Error('mnemonist/kd-tree.kNearestNeighbors: k should be a positive number.');

  k = Math.min(k, this.size);

  if (k === 1)
    return [this.nearestNeighbor(query)];

  var heap = new FixedReverseHeap(Array, KNN_HEAP_COMPARATOR_3, k);

  var dimensions = this.dimensions,
      axes = this.axes,
      pivots = this.pivots,
      lefts = this.lefts,
      rights = this.rights;

  var visited = 0;

  function recurse(d, node) {
    var left = lefts[node],
        right = rights[node],
        pivot = pivots[node];

    var dist = squaredDistanceAxes(
      dimensions,
      axes,
      pivot,
      query
    );

    heap.push([dist, visited++, pivot]);

    var point = query[d],
        split = axes[d][pivot],
        dx = point - split;

    d = (d + 1) % dimensions;

    // Going the correct way?
    if (point < split) {
      if (left !== 0) {
        recurse(d, left - 1);
      }
    }
    else {
      if (right !== 0) {
        recurse(d, right - 1);
      }
    }

    // Going the other way?
    if (dx * dx < heap.peek()[0] || heap.size < k) {
      if (point < split) {
        if (right !== 0) {
          recurse(d, right - 1);
        }
      }
      else {
        if (left !== 0) {
          recurse(d, left - 1);
        }
      }
    }
  }

  recurse(0, 0);

  this.visited = visited;

  var best = heap.consume();

  for (var i = 0; i < best.length; i++)
    best[i] = this.labels[best[i][2]];

  return best;
};

/**
 * Method returning the query's k nearest neighbors by linear search.
 *
 * @param  {number} k     - Number of nearest neighbor to retrieve.
 * @param  {array}  query - Query point.
 * @return {array}
 */
KDTree.prototype.linearKNearestNeighbors = function(k, query) {
  if (k <= 0)
    throw new Error('mnemonist/kd-tree.kNearestNeighbors: k should be a positive number.');

  k = Math.min(k, this.size);

  var heap = new FixedReverseHeap(Array, KNN_HEAP_COMPARATOR_2, k);

  var i, l, dist;

  for (i = 0, l = this.size; i < l; i++) {
    dist = squaredDistanceAxes(
      this.dimensions,
      this.axes,
      this.pivots[i],
      query
    );

    heap.push([dist, i]);
  }

  var best = heap.consume();

  for (i = 0; i < best.length; i++)
    best[i] = this.labels[this.pivots[best[i][1]]];

  return best;
};

/**
 * Convenience known methods.
 */
KDTree.prototype.inspect = function() {
  var dummy = new Map();

  dummy.dimensions = this.dimensions;

  Object.defineProperty(dummy, 'constructor', {
    value: KDTree,
    enumerable: false
  });

  var i, j, point;

  for (i = 0; i < this.size; i++) {
    point = new Array(this.dimensions);

    for (j = 0; j < this.dimensions; j++)
      point[j] = this.axes[j][i];

    dummy.set(this.labels[i], point);
  }

  return dummy;
};

if (typeof Symbol !== 'undefined')
  KDTree.prototype[Symbol.for('nodejs.util.inspect.custom')] = KDTree.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {number}   dimensions - Space dimensions.
 * @return {KDTree}
 */
KDTree.from = function(iterable, dimensions) {
  var data = iterables.toArray(iterable);

  var reshaped = reshapeIntoAxes(dimensions, data);

  var result = buildTree(dimensions, reshaped.axes, reshaped.ids, reshaped.labels);

  return new KDTree(dimensions, result);
};

/**
 * Static @.from function building a KDTree from given axes.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {number}   dimensions - Space dimensions.
 * @return {KDTree}
 */
KDTree.fromAxes = function(axes, labels) {
  if (!labels)
    labels = typed.indices(axes[0].length);

  var dimensions = axes.length;

  var result = buildTree(axes.length, axes, typed.indices(labels.length), labels);

  return new KDTree(dimensions, result);
};

/**
 * Exporting.
 */
module.exports = KDTree;


/***/ }),
/* 199 */
/***/ ((__unused_webpack_module, exports) => {

/**
 * Mnemonist Quick Sort
 * =====================
 *
 * Quick sort related functions.
 * Adapted from: https://alienryderflex.com/quicksort/
 */
var LOS = new Float64Array(64),
    HIS = new Float64Array(64);

function inplaceQuickSort(array, lo, hi) {
  var p, i, l, r, swap;

  LOS[0] = lo;
  HIS[0] = hi;
  i = 0;

  while (i >= 0) {
    l = LOS[i];
    r = HIS[i] - 1;

    if (l < r) {
      p = array[l];

      while (l < r) {
        while (array[r] >= p && l < r)
          r--;

        if (l < r)
          array[l++] = array[r];

        while (array[l] <= p && l < r)
          l++;

        if (l < r)
          array[r--] = array[l];
      }

      array[l] = p;
      LOS[i + 1] = l + 1;
      HIS[i + 1] = HIS[i];
      HIS[i++] = l;

      if (HIS[i] - LOS[i] > HIS[i - 1] - LOS[i - 1]) {
        swap = LOS[i];
        LOS[i] = LOS[i - 1];
        LOS[i - 1] = swap;

        swap = HIS[i];
        HIS[i] = HIS[i - 1];
        HIS[i - 1] = swap;
      }
    }
    else {
      i--;
    }
  }

  return array;
}

exports.inplaceQuickSort = inplaceQuickSort;

function inplaceQuickSortIndices(array, indices, lo, hi) {
  var p, i, l, r, t, swap;

  LOS[0] = lo;
  HIS[0] = hi;
  i = 0;

  while (i >= 0) {
    l = LOS[i];
    r = HIS[i] - 1;

    if (l < r) {
      t = indices[l];
      p = array[t];

      while (l < r) {
        while (array[indices[r]] >= p && l < r)
          r--;

        if (l < r)
          indices[l++] = indices[r];

        while (array[indices[l]] <= p && l < r)
          l++;

        if (l < r)
          indices[r--] = indices[l];
      }

      indices[l] = t;
      LOS[i + 1] = l + 1;
      HIS[i + 1] = HIS[i];
      HIS[i++] = l;

      if (HIS[i] - LOS[i] > HIS[i - 1] - LOS[i - 1]) {
        swap = LOS[i];
        LOS[i] = LOS[i - 1];
        LOS[i - 1] = swap;

        swap = HIS[i];
        HIS[i] = HIS[i - 1];
        HIS[i - 1] = swap;
      }
    }
    else {
      i--;
    }
  }

  return indices;
}

exports.inplaceQuickSortIndices = inplaceQuickSortIndices;


/***/ }),
/* 200 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Linked List
 * ======================
 *
 * Singly linked list implementation. Uses raw JavaScript objects as nodes
 * as benchmarks proved it was the fastest thing to do.
 */
var Iterator = __webpack_require__(177),
    forEach = __webpack_require__(168);

/**
 * Linked List.
 *
 * @constructor
 */
function LinkedList() {
  this.clear();
}

/**
 * Method used to clear the list.
 *
 * @return {undefined}
 */
LinkedList.prototype.clear = function() {

  // Properties
  this.head = null;
  this.tail = null;
  this.size = 0;
};

/**
 * Method used to get the first item of the list.
 *
 * @return {any}
 */
LinkedList.prototype.first = function() {
  return this.head ? this.head.item : undefined;
};
LinkedList.prototype.peek = LinkedList.prototype.first;

/**
 * Method used to get the last item of the list.
 *
 * @return {any}
 */
LinkedList.prototype.last = function() {
  return this.tail ? this.tail.item : undefined;
};

/**
 * Method used to add an item at the end of the list.
 *
 * @param  {any}    item - The item to add.
 * @return {number}
 */
LinkedList.prototype.push = function(item) {
  var node = {item: item, next: null};

  if (!this.head) {
    this.head = node;
    this.tail = node;
  }
  else {
    this.tail.next = node;
    this.tail = node;
  }

  this.size++;

  return this.size;
};

/**
 * Method used to add an item at the beginning of the list.
 *
 * @param  {any}    item - The item to add.
 * @return {number}
 */
LinkedList.prototype.unshift = function(item) {
  var node = {item: item, next: null};

  if (!this.head) {
    this.head = node;
    this.tail = node;
  }
  else {
    if (!this.head.next)
      this.tail = this.head;
    node.next = this.head;
    this.head = node;
  }

  this.size++;

  return this.size;
};

/**
 * Method used to retrieve & remove the first item of the list.
 *
 * @return {any}
 */
LinkedList.prototype.shift = function() {
  if (!this.size)
    return undefined;

  var node = this.head;

  this.head = node.next;
  this.size--;

  return node.item;
};

/**
 * Method used to iterate over the list.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
LinkedList.prototype.forEach = function(callback, scope) {
  if (!this.size)
    return;

  scope = arguments.length > 1 ? scope : this;

  var n = this.head,
      i = 0;

  while (n) {
    callback.call(scope, n.item, i, this);
    n = n.next;
    i++;
  }
};

/**
 * Method used to convert the list into an array.
 *
 * @return {array}
 */
LinkedList.prototype.toArray = function() {
  if (!this.size)
    return [];

  var array = new Array(this.size);

  for (var i = 0, l = this.size, n = this.head; i < l; i++) {
    array[i] = n.item;
    n = n.next;
  }

  return array;
};

/**
 * Method used to create an iterator over a list's values.
 *
 * @return {Iterator}
 */
LinkedList.prototype.values = function() {
  var n = this.head;

  return new Iterator(function() {
    if (!n)
      return {
        done: true
      };

    var value = n.item;
    n = n.next;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over a list's entries.
 *
 * @return {Iterator}
 */
LinkedList.prototype.entries = function() {
  var n = this.head,
      i = 0;

  return new Iterator(function() {
    if (!n)
      return {
        done: true
      };

    var value = n.item;
    n = n.next;
    i++;

    return {
      value: [i - 1, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  LinkedList.prototype[Symbol.iterator] = LinkedList.prototype.values;

/**
 * Convenience known methods.
 */
LinkedList.prototype.toString = function() {
  return this.toArray().join(',');
};

LinkedList.prototype.toJSON = function() {
  return this.toArray();
};

LinkedList.prototype.inspect = function() {
  var array = this.toArray();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: LinkedList,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  LinkedList.prototype[Symbol.for('nodejs.util.inspect.custom')] = LinkedList.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a list.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @return {LinkedList}
 */
LinkedList.from = function(iterable) {
  var list = new LinkedList();

  forEach(iterable, function(value) {
    list.push(value);
  });

  return list;
};

/**
 * Exporting.
 */
module.exports = LinkedList;


/***/ }),
/* 201 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist LRUCache
 * ===================
 *
 * JavaScript implementation of the LRU Cache data structure. To save up
 * memory and allocations this implementation represents its underlying
 * doubly-linked list as static arrays and pointers. Thus, memory is allocated
 * only once at instantiation and JS objects are never created to serve as
 * pointers. This also means this implementation does not trigger too many
 * garbage collections.
 *
 * Note that to save up memory, a LRU Cache can be implemented using a singly
 * linked list by storing predecessors' pointers as hashmap values.
 * However, this means more hashmap lookups and would probably slow the whole
 * thing down. What's more, pointers are not the things taking most space in
 * memory.
 */
var Iterator = __webpack_require__(177),
    forEach = __webpack_require__(168),
    typed = __webpack_require__(172),
    iterables = __webpack_require__(171);

/**
 * LRUCache.
 *
 * @constructor
 * @param {function} Keys     - Array class for storing keys.
 * @param {function} Values   - Array class for storing values.
 * @param {number}   capacity - Desired capacity.
 */
function LRUCache(Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  this.capacity = capacity;

  if (typeof this.capacity !== 'number' || this.capacity <= 0)
    throw new Error('mnemonist/lru-cache: capacity should be positive number.');
  else if (!isFinite(this.capacity) || Math.floor(this.capacity) !== this.capacity)
      throw new Error('mnemonist/lru-cache: capacity should be a finite positive integer.');

  var PointerArray = typed.getPointerArray(capacity);

  this.forward = new PointerArray(capacity);
  this.backward = new PointerArray(capacity);
  this.K = typeof Keys === 'function' ? new Keys(capacity) : new Array(capacity);
  this.V = typeof Values === 'function' ? new Values(capacity) : new Array(capacity);

  // Properties
  this.size = 0;
  this.head = 0;
  this.tail = 0;
  this.items = {};
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
LRUCache.prototype.clear = function() {
  this.size = 0;
  this.head = 0;
  this.tail = 0;
  this.items = {};
};

/**
 * Method used to splay a value on top.
 *
 * @param  {number}   pointer - Pointer of the value to splay on top.
 * @return {LRUCache}
 */
LRUCache.prototype.splayOnTop = function(pointer) {
  var oldHead = this.head;

  if (this.head === pointer)
    return this;

  var previous = this.backward[pointer],
      next = this.forward[pointer];

  if (this.tail === pointer) {
    this.tail = previous;
  }
  else {
    this.backward[next] = previous;
  }

  this.forward[previous] = next;

  this.backward[oldHead] = pointer;
  this.head = pointer;
  this.forward[pointer] = oldHead;

  return this;
};

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {undefined}
 */
LRUCache.prototype.set = function(key, value) {

  var pointer = this.items[key];

  // The key already exists, we just need to update the value and splay on top
  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    this.V[pointer] = value;

    return;
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    pointer = this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    delete this.items[this.K[pointer]];
  }

  // Storing key & value
  this.items[key] = pointer;
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;
};

/**
 * Method used to set the value for the given key in the cache
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {{evicted: boolean, key: any, value: any}} An object containing the
 * key and value of an item that was overwritten or evicted in the set
 * operation, as well as a boolean indicating whether it was evicted due to
 * limited capacity. Return value is null if nothing was evicted or overwritten
 * during the set operation.
 */
LRUCache.prototype.setpop = function(key, value) {
  var oldValue = null;
  var oldKey = null;

  var pointer = this.items[key];

  // The key already exists, we just need to update the value and splay on top
  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    oldValue = this.V[pointer];
    this.V[pointer] = value;
    return {evicted: false, key: key, value: oldValue};
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    pointer = this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    oldValue = this.V[pointer];
    oldKey = this.K[pointer];
    delete this.items[this.K[pointer]];
  }

  // Storing key & value
  this.items[key] = pointer;
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;

  // Return object if eviction took place, otherwise return null
  if (oldKey) {
    return {evicted: true, key: oldKey, value: oldValue};
  }
  else {
    return null;
  }
};

/**
 * Method used to check whether the key exists in the cache.
 *
 * @param  {any} key   - Key.
 * @return {boolean}
 */
LRUCache.prototype.has = function(key) {
  return key in this.items;
};

/**
 * Method used to get the value attached to the given key. Will move the
 * related key to the front of the underlying linked list.
 *
 * @param  {any} key   - Key.
 * @return {any}
 */
LRUCache.prototype.get = function(key) {
  var pointer = this.items[key];

  if (typeof pointer === 'undefined')
    return;

  this.splayOnTop(pointer);

  return this.V[pointer];
};

/**
 * Method used to get the value attached to the given key. Does not modify
 * the ordering of the underlying linked list.
 *
 * @param  {any} key   - Key.
 * @return {any}
 */
LRUCache.prototype.peek = function(key) {
    var pointer = this.items[key];

    if (typeof pointer === 'undefined')
        return;

    return this.V[pointer];
};

/**
 * Method used to iterate over the cache's entries using a callback.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
LRUCache.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var i = 0,
      l = this.size;

  var pointer = this.head,
      keys = this.K,
      values = this.V,
      forward = this.forward;

  while (i < l) {

    callback.call(scope, values[pointer], keys[pointer], this);
    pointer = forward[pointer];

    i++;
  }
};

/**
 * Method used to create an iterator over the cache's keys from most
 * recently used to least recently used.
 *
 * @return {Iterator}
 */
LRUCache.prototype.keys = function() {
  var i = 0,
      l = this.size;

  var pointer = this.head,
      keys = this.K,
      forward = this.forward;

  return new Iterator(function() {
    if (i >= l)
      return {done: true};

    var key = keys[pointer];

    i++;

    if (i < l)
      pointer = forward[pointer];

    return {
      done: false,
      value: key
    };
  });
};

/**
 * Method used to create an iterator over the cache's values from most
 * recently used to least recently used.
 *
 * @return {Iterator}
 */
LRUCache.prototype.values = function() {
  var i = 0,
      l = this.size;

  var pointer = this.head,
      values = this.V,
      forward = this.forward;

  return new Iterator(function() {
    if (i >= l)
      return {done: true};

    var value = values[pointer];

    i++;

    if (i < l)
      pointer = forward[pointer];

    return {
      done: false,
      value: value
    };
  });
};

/**
 * Method used to create an iterator over the cache's entries from most
 * recently used to least recently used.
 *
 * @return {Iterator}
 */
LRUCache.prototype.entries = function() {
  var i = 0,
      l = this.size;

  var pointer = this.head,
      keys = this.K,
      values = this.V,
      forward = this.forward;

  return new Iterator(function() {
    if (i >= l)
      return {done: true};

    var key = keys[pointer],
        value = values[pointer];

    i++;

    if (i < l)
      pointer = forward[pointer];

    return {
      done: false,
      value: [key, value]
    };
  });
};

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  LRUCache.prototype[Symbol.iterator] = LRUCache.prototype.entries;

/**
 * Convenience known methods.
 */
LRUCache.prototype.inspect = function() {
  var proxy = new Map();

  var iterator = this.entries(),
      step;

  while ((step = iterator.next(), !step.done))
    proxy.set(step.value[0], step.value[1]);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: LRUCache,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  LRUCache.prototype[Symbol.for('nodejs.util.inspect.custom')] = LRUCache.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Cache's capacity.
 * @return {LRUCache}
 */
LRUCache.from = function(iterable, Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }
  else if (arguments.length === 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  var cache = new LRUCache(Keys, Values, capacity);

  forEach(iterable, function(value, key) {
    cache.set(key, value);
  });

  return cache;
};

/**
 * Exporting.
 */
module.exports = LRUCache;


/***/ }),
/* 202 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist LRUCacheWithDelete
 * =============================
 *
 * An extension of LRUCache with delete functionality.
 */

var LRUCache = __webpack_require__(201),
    forEach = __webpack_require__(168),
    typed = __webpack_require__(172),
    iterables = __webpack_require__(171);

// The only complication with deleting items is that the LRU's
// performance depends on having a fixed-size list of pointers; the
// doubly-linked-list is happy to expand and contract.
//
// On delete, we record the position of the former item's pointer in a
// list of "holes" in the pointer array. On insert, if there is a hole
// the new pointer slots in to fill the hole; otherwise, it is
// appended as usual. (Note: we are only talking here about the
// internal pointer list. setting or getting an item promotes it
// to the top of the LRU ranking no matter what came before)

function LRUCacheWithDelete(Keys, Values, capacity) {
  if (arguments.length < 2) {
    LRUCache.call(this, Keys);
  }
  else {
    LRUCache.call(this, Keys, Values, capacity);
  }
  var PointerArray = typed.getPointerArray(this.capacity);
  this.deleted = new PointerArray(this.capacity);
  this.deletedSize = 0;
}

for (var k in LRUCache.prototype)
  LRUCacheWithDelete.prototype[k] = LRUCache.prototype[k];
if (typeof Symbol !== 'undefined')
  LRUCacheWithDelete.prototype[Symbol.iterator] = LRUCache.prototype[Symbol.iterator];

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
 LRUCacheWithDelete.prototype.clear = function() {
  LRUCache.prototype.clear.call(this);
  this.deletedSize = 0;
};

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {undefined}
 */
LRUCacheWithDelete.prototype.set = function(key, value) {

  var pointer = this.items[key];

  // The key already exists, we just need to update the value and splay on top
  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    this.V[pointer] = value;

    return;
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    if (this.deletedSize > 0) {
      // If there is a "hole" in the pointer list, reuse it
      pointer = this.deleted[--this.deletedSize];
    }
    else {
      // otherwise append to the pointer list
      pointer = this.size;
    }
    this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    delete this.items[this.K[pointer]];
  }

  // Storing key & value
  this.items[key] = pointer;
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;
};

/**
 * Method used to set the value for the given key in the cache
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {{evicted: boolean, key: any, value: any}} An object containing the
 * key and value of an item that was overwritten or evicted in the set
 * operation, as well as a boolean indicating whether it was evicted due to
 * limited capacity. Return value is null if nothing was evicted or overwritten
 * during the set operation.
 */
LRUCacheWithDelete.prototype.setpop = function(key, value) {
  var oldValue = null;
  var oldKey = null;

  var pointer = this.items[key];

  // The key already exists, we just need to update the value and splay on top
  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    oldValue = this.V[pointer];
    this.V[pointer] = value;
    return {evicted: false, key: key, value: oldValue};
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    if (this.deletedSize > 0) {
      // If there is a "hole" in the pointer list, reuse it
      pointer = this.deleted[--this.deletedSize];
    }
    else {
      // otherwise append to the pointer list
      pointer = this.size;
    }
    this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    oldValue = this.V[pointer];
    oldKey = this.K[pointer];
    delete this.items[this.K[pointer]];
  }

  // Storing key & value
  this.items[key] = pointer;
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;

  // Return object if eviction took place, otherwise return null
  if (oldKey) {
    return {evicted: true, key: oldKey, value: oldValue};
  }
  else {
    return null;
  }
};

/**
 * Method used to delete the entry for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @return {boolean}   - true if the item was present
 */
LRUCacheWithDelete.prototype.delete = function(key) {

  var pointer = this.items[key];

  if (typeof pointer === 'undefined') {
    return false;
  }

  delete this.items[key];

  if (this.size === 1) {
    this.size = 0;
    this.head = 0;
    this.tail = 0;
    this.deletedSize = 0;
    return true;
  }

  var previous = this.backward[pointer],
      next = this.forward[pointer];

  if (this.head === pointer) {
    this.head = next;
  }
  if (this.tail === pointer) {
    this.tail = previous;
  }

  this.forward[previous] = next;
  this.backward[next] = previous;

  this.size--;
  this.deleted[this.deletedSize++] = pointer;

  return true;
};

/**
 * Method used to remove and return the value for the given key in the cache.
 *
 * @param  {any} key                 - Key.
 * @param  {any} [missing=undefined] - Value to return if item is absent
 * @return {any} The value, if present; the missing indicator if absent
 */
LRUCacheWithDelete.prototype.remove = function(key, missing = undefined) {

  var pointer = this.items[key];

  if (typeof pointer === 'undefined') {
    return missing;
  }

  var dead = this.V[pointer];
  delete this.items[key];

  if (this.size === 1) {
    this.size = 0;
    this.head = 0;
    this.tail = 0;
    this.deletedSize = 0;
    return dead;
  }

  var previous = this.backward[pointer],
      next = this.forward[pointer];

  if (this.head === pointer) {
    this.head = next;
  }
  if (this.tail === pointer) {
    this.tail = previous;
  }

  this.forward[previous] = next;
  this.backward[next] = previous;

  this.size--;
  this.deleted[this.deletedSize++] = pointer;

  return dead;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Cache's capacity.
 * @return {LRUCacheWithDelete}
 */
 LRUCacheWithDelete.from = function(iterable, Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }
  else if (arguments.length === 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  var cache = new LRUCacheWithDelete(Keys, Values, capacity);

  forEach(iterable, function(value, key) {
    cache.set(key, value);
  });

  return cache;
};

module.exports = LRUCacheWithDelete;


/***/ }),
/* 203 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist LRUMap
 * =================
 *
 * Variant of the LRUCache class that leverages an ES6 Map instead of an object.
 * It might be faster for some use case but it is still hard to understand
 * when a Map can outperform an object in v8.
 */
var LRUCache = __webpack_require__(201),
    forEach = __webpack_require__(168),
    typed = __webpack_require__(172),
    iterables = __webpack_require__(171);

/**
 * LRUMap.
 *
 * @constructor
 * @param {function} Keys     - Array class for storing keys.
 * @param {function} Values   - Array class for storing values.
 * @param {number}   capacity - Desired capacity.
 */
function LRUMap(Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  this.capacity = capacity;

  if (typeof this.capacity !== 'number' || this.capacity <= 0)
    throw new Error('mnemonist/lru-map: capacity should be positive number.');
  else if (!isFinite(this.capacity) || Math.floor(this.capacity) !== this.capacity)
    throw new Error('mnemonist/lru-map: capacity should be a finite positive integer.');

  var PointerArray = typed.getPointerArray(capacity);

  this.forward = new PointerArray(capacity);
  this.backward = new PointerArray(capacity);
  this.K = typeof Keys === 'function' ? new Keys(capacity) : new Array(capacity);
  this.V = typeof Values === 'function' ? new Values(capacity) : new Array(capacity);

  // Properties
  this.size = 0;
  this.head = 0;
  this.tail = 0;
  this.items = new Map();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
LRUMap.prototype.clear = function() {
  this.size = 0;
  this.head = 0;
  this.tail = 0;
  this.items.clear();
};

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {undefined}
 */
LRUMap.prototype.set = function(key, value) {

  var pointer = this.items.get(key);

  // The key already exists, we just need to update the value and splay on top
  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    this.V[pointer] = value;

    return;
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    pointer = this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    this.items.delete(this.K[pointer]);
  }

  // Storing key & value
  this.items.set(key, pointer);
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;
};

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {{evicted: boolean, key: any, value: any}} An object containing the
 * key and value of an item that was overwritten or evicted in the set
 * operation, as well as a boolean indicating whether it was evicted due to
 * limited capacity. Return value is null if nothing was evicted or overwritten
 * during the set operation.
 */
LRUMap.prototype.setpop = function(key, value) {
  var oldValue = null;
  var oldKey = null;

  var pointer = this.items.get(key);

  // The key already exists, we just need to update the value and splay on top
  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    oldValue = this.V[pointer];
    this.V[pointer] = value;
    return {evicted: false, key: key, value: oldValue};
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    pointer = this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    oldValue = this.V[pointer];
    oldKey = this.K[pointer];
    this.items.delete(this.K[pointer]);
  }

  // Storing key & value
  this.items.set(key, pointer);
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;

  // Return object if eviction took place, otherwise return null
  if (oldKey) {
    return {evicted: true, key: oldKey, value: oldValue};
  }
  else {
    return null;
  }
};

/**
 * Method used to check whether the key exists in the cache.
 *
 * @param  {any} key   - Key.
 * @return {boolean}
 */
LRUMap.prototype.has = function(key) {
  return this.items.has(key);
};

/**
 * Method used to get the value attached to the given key. Will move the
 * related key to the front of the underlying linked list.
 *
 * @param  {any} key   - Key.
 * @return {any}
 */
LRUMap.prototype.get = function(key) {
  var pointer = this.items.get(key);

  if (typeof pointer === 'undefined')
    return;

  this.splayOnTop(pointer);

  return this.V[pointer];
};

/**
 * Method used to get the value attached to the given key. Does not modify
 * the ordering of the underlying linked list.
 *
 * @param  {any} key   - Key.
 * @return {any}
 */
LRUMap.prototype.peek = function(key) {
  var pointer = this.items.get(key);

  if (typeof pointer === 'undefined')
    return;

  return this.V[pointer];
};

/**
 * Methods that can be reused as-is from LRUCache.
 */
LRUMap.prototype.splayOnTop = LRUCache.prototype.splayOnTop;
LRUMap.prototype.forEach = LRUCache.prototype.forEach;
LRUMap.prototype.keys = LRUCache.prototype.keys;
LRUMap.prototype.values = LRUCache.prototype.values;
LRUMap.prototype.entries = LRUCache.prototype.entries;

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  LRUMap.prototype[Symbol.iterator] = LRUMap.prototype.entries;

/**
 * Convenience known methods.
 */
LRUMap.prototype.inspect = LRUCache.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Cache's capacity.
 * @return {LRUMap}
 */
LRUMap.from = function(iterable, Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }
  else if (arguments.length === 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  var cache = new LRUMap(Keys, Values, capacity);

  forEach(iterable, function(value, key) {
    cache.set(key, value);
  });

  return cache;
};

/**
 * Exporting.
 */
module.exports = LRUMap;


/***/ }),
/* 204 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist LRUMapWithDelete
 * ===========================
 *
 * An extension of LRUMap with delete functionality.
 */

var LRUMap = __webpack_require__(203),
    forEach = __webpack_require__(168),
    typed = __webpack_require__(172),
    iterables = __webpack_require__(171);

// The only complication with deleting items is that the LRU's
// performance depends on having a fixed-size list of pointers; the
// doubly-linked-list is happy to expand and contract.
//
// On delete, we record the position of the former item's pointer in a
// list of "holes" in the pointer array. On insert, if there is a hole
// the new pointer slots in to fill the hole; otherwise, it is
// appended as usual. (Note: we are only talking here about the
// internal pointer list. setting or getting an item promotes it
// to the top of the LRU ranking no matter what came before)

function LRUMapWithDelete(Keys, Values, capacity) {
  if (arguments.length < 2) {
    LRUMap.call(this, Keys);
  }
  else {
    LRUMap.call(this, Keys, Values, capacity);
  }
  var PointerArray = typed.getPointerArray(this.capacity);
  this.deleted = new PointerArray(this.capacity);
  this.deletedSize = 0;
}

for (var k in LRUMap.prototype)
  LRUMapWithDelete.prototype[k] = LRUMap.prototype[k];
if (typeof Symbol !== 'undefined')
  LRUMapWithDelete.prototype[Symbol.iterator] = LRUMap.prototype[Symbol.iterator];

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
 LRUMapWithDelete.prototype.clear = function() {
  LRUMap.prototype.clear.call(this);
  this.deletedSize = 0;
};

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {undefined}
 */
LRUMapWithDelete.prototype.set = function(key, value) {

  var pointer = this.items.get(key);

  // The key already exists, we just need to update the value and splay on top
  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    this.V[pointer] = value;

    return;
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    if (this.deletedSize > 0) {
      // If there is a "hole" in the pointer list, reuse it
      pointer = this.deleted[--this.deletedSize];
    }
    else {
      // otherwise append to the pointer list
      pointer = this.size;
    }
    this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    this.items.delete(this.K[pointer]);
  }

  // Storing key & value
  this.items.set(key, pointer);
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;
};

/**
 * Method used to set the value for the given key in the cache
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {{evicted: boolean, key: any, value: any}} An object containing the
 * key and value of an item that was overwritten or evicted in the set
 * operation, as well as a boolean indicating whether it was evicted due to
 * limited capacity. Return value is null if nothing was evicted or overwritten
 * during the set operation.
 */
LRUMapWithDelete.prototype.setpop = function(key, value) {
  var oldValue = null;
  var oldKey = null;

  var pointer = this.items.get(key);

  // The key already exists, we just need to update the value and splay on top
  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    oldValue = this.V[pointer];
    this.V[pointer] = value;
    return {evicted: false, key: key, value: oldValue};
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    if (this.deletedSize > 0) {
      // If there is a "hole" in the pointer list, reuse it
      pointer = this.deleted[--this.deletedSize];
    }
    else {
      // otherwise append to the pointer list
      pointer = this.size;
    }
    this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    oldValue = this.V[pointer];
    oldKey = this.K[pointer];
    this.items.delete(this.K[pointer]);
  }

  // Storing key & value
  this.items.set(key, pointer);
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;

  // Return object if eviction took place, otherwise return null
  if (oldKey) {
    return {evicted: true, key: oldKey, value: oldValue};
  }
  else {
    return null;
  }
};

/**
 * Method used to delete the entry for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @return {boolean}   - true if the item was present
 */
LRUMapWithDelete.prototype.delete = function(key) {

  var pointer = this.items.get(key);

  if (typeof pointer === 'undefined') {
    return false;
  }

  this.items.delete(key);

  if (this.size === 1) {
    this.size = 0;
    this.head = 0;
    this.tail = 0;
    this.deletedSize = 0;
    return true;
  }

  var previous = this.backward[pointer],
      next = this.forward[pointer];

  if (this.head === pointer) {
    this.head = next;
  }
  if (this.tail === pointer) {
    this.tail = previous;
  }

  this.forward[previous] = next;
  this.backward[next] = previous;

  this.size--;
  this.deleted[this.deletedSize++] = pointer;

  return true;
};

/**
 * Method used to remove and return the value for the given key in the cache.
 *
 * @param  {any} key                 - Key.
 * @param  {any} [missing=undefined] - Value to return if item is absent
 * @return {any} The value, if present; the missing indicator if absent
 */
LRUMapWithDelete.prototype.remove = function(key, missing = undefined) {

  var pointer = this.items.get(key);

  if (typeof pointer === 'undefined') {
    return missing;
  }

  var dead = this.V[pointer];
  this.items.delete(key);

  if (this.size === 1) {
    this.size = 0;
    this.head = 0;
    this.tail = 0;
    this.deletedSize = 0;
    return dead;
  }

  var previous = this.backward[pointer],
      next = this.forward[pointer];

  if (this.head === pointer) {
    this.head = next;
  }
  if (this.tail === pointer) {
    this.tail = previous;
  }

  this.forward[previous] = next;
  this.backward[next] = previous;

  this.size--;
  this.deleted[this.deletedSize++] = pointer;

  return dead;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Cache's capacity.
 * @return {LRUMapWithDelete}
 */
 LRUMapWithDelete.from = function(iterable, Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/lru-map.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }
  else if (arguments.length === 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  var cache = new LRUMapWithDelete(Keys, Values, capacity);

  forEach(iterable, function(value, key) {
    cache.set(key, value);
  });

  return cache;
};

module.exports = LRUMapWithDelete;


/***/ }),
/* 205 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist MultiSet
 * ====================
 *
 * JavaScript implementation of a MultiSet.
 */
var Iterator = __webpack_require__(177),
    forEach = __webpack_require__(168),
    FixedReverseHeap = __webpack_require__(188);

/**
 * Helpers.
 */
var MULTISET_ITEM_COMPARATOR = function(a, b) {
  if (a[1] > b[1])
    return -1;
  if (a[1] < b[1])
    return 1;

  return 0;
};

// TODO: helper functions: union, intersection, sum, difference, subtract

/**
 * MultiSet.
 *
 * @constructor
 */
function MultiSet() {
  this.items = new Map();

  Object.defineProperty(this.items, 'constructor', {
    value: MultiSet,
    enumerable: false
  });

  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
MultiSet.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.dimension = 0;
  this.items.clear();
};

/**
 * Method used to add an item to the set.
 *
 * @param  {any}    item  - Item to add.
 * @param  {number} count - Optional count.
 * @return {MultiSet}
 */
MultiSet.prototype.add = function(item, count) {
  if (count === 0)
    return this;

  if (count < 0)
    return this.remove(item, -count);

  count = count || 1;

  if (typeof count !== 'number')
    throw new Error('mnemonist/multi-set.add: given count should be a number.');

  this.size += count;

  const currentCount = this.items.get(item);

  if (currentCount === undefined)
    this.dimension++;
  else
    count += currentCount;

  this.items.set(item, count);

  return this;
};

/**
 * Method used to set the multiplicity of an item in the set.
 *
 * @param  {any}    item  - Target item.
 * @param  {number} count - Desired multiplicity.
 * @return {MultiSet}
 */
MultiSet.prototype.set = function(item, count) {
  var currentCount;

  if (typeof count !== 'number')
    throw new Error('mnemonist/multi-set.set: given count should be a number.');

  // Setting an item to 0 or to a negative number means deleting it from the set
  if (count <= 0) {
    currentCount = this.items.get(item);

    if (typeof currentCount !== 'undefined') {
      this.size -= currentCount;
      this.dimension--;
    }

    this.items.delete(item);
    return this;
  }

  count = count || 1;

  currentCount = this.items.get(item);

  if (typeof currentCount === 'number') {
    this.items.set(item, currentCount + count);
  }
  else {
    this.dimension++;
    this.items.set(item, count);
  }

  this.size += count;

  return this;
};

/**
 * Method used to return whether the item exists in the set.
 *
 * @param  {any} item  - Item to check.
 * @return {boolan}
 */
MultiSet.prototype.has = function(item) {
  return this.items.has(item);
};

/**
 * Method used to delete an item from the set.
 *
 * @param  {any} item  - Item to delete.
 * @return {boolan}
 */
MultiSet.prototype.delete = function(item) {
  var count = this.items.get(item);

  if (count === 0)
    return false;

  this.size -= count;
  this.dimension--;
  this.items.delete(item);

  return true;
};

/**
 * Method used to remove an item from the set.
 *
 * @param  {any} item  - Item to delete.
 * @param  {number} count - Optional count.
 * @return {undefined}
 */
MultiSet.prototype.remove = function(item, count) {
  if (count === 0)
    return;

  if (count < 0)
    return this.add(item, -count);

  count = count || 1;

  if (typeof count !== 'number')
    throw new Error('mnemonist/multi-set.remove: given count should be a number.');

  var currentCount = this.multiplicity(item),
      newCount = Math.max(0, currentCount - count);

  if (newCount === 0) {
    this.delete(item);
  }
  else {
    this.items.set(item, newCount);
    this.size -= (currentCount - newCount);
  }

  return;
};

/**
 * Method used to change a key into another one, merging counts if the target
 * key already exists.
 *
 * @param  {any} a - From key.
 * @param  {any} b - To key.
 * @return {MultiSet}
 */
MultiSet.prototype.edit = function(a, b) {
  var am = this.multiplicity(a);

  // If a does not exist in the set, we can stop right there
  if (am === 0)
    return;

  var bm = this.multiplicity(b);

  this.items.set(b, am + bm);
  this.items.delete(a);

  return this;
};

/**
 * Method used to return the multiplicity of the given item.
 *
 * @param  {any} item  - Item to get.
 * @return {number}
 */
MultiSet.prototype.multiplicity = function(item) {
  var count = this.items.get(item);

  if (typeof count === 'undefined')
    return 0;

  return count;
};
MultiSet.prototype.get = MultiSet.prototype.multiplicity;
MultiSet.prototype.count = MultiSet.prototype.multiplicity;

/**
 * Method used to return the frequency of the given item in the set.
 *
 * @param  {any} item - Item to get.
 * @return {number}
 */
MultiSet.prototype.frequency = function(item) {
  if (this.size === 0)
    return 0;

  var count = this.multiplicity(item);

  return count / this.size;
};

/**
 * Method used to return the n most common items from the set.
 *
 * @param  {number} n - Number of items to retrieve.
 * @return {array}
 */
MultiSet.prototype.top = function(n) {
  if (typeof n !== 'number' || n <= 0)
    throw new Error('mnemonist/multi-set.top: n must be a number > 0.');

  var heap = new FixedReverseHeap(Array, MULTISET_ITEM_COMPARATOR, n);

  var iterator = this.items.entries(),
      step;

  while ((step = iterator.next(), !step.done))
    heap.push(step.value);

  return heap.consume();
};

/**
 * Method used to iterate over the set's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
MultiSet.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var i;

  this.items.forEach(function(multiplicity, value) {

    for (i = 0; i < multiplicity; i++)
      callback.call(scope, value, value);
  });
};

/**
 * Method used to iterate over the set's multiplicities.
 *
 * @param  {function}  callback - Function to call for each multiplicity.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
MultiSet.prototype.forEachMultiplicity = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  this.items.forEach(callback, scope);
};

/**
 * Method returning an iterator over the set's keys. I.e. its unique values,
 * in a sense.
 *
 * @return {Iterator}
 */
MultiSet.prototype.keys = function() {
  return this.items.keys();
};

/**
 * Method returning an iterator over the set's values.
 *
 * @return {Iterator}
 */
MultiSet.prototype.values = function() {
  var iterator = this.items.entries(),
      inContainer = false,
      step,
      value,
      multiplicity,
      i;

  return new Iterator(function next() {
    if (!inContainer) {
      step = iterator.next();

      if (step.done)
        return {done: true};

      inContainer = true;
      value = step.value[0];
      multiplicity = step.value[1];
      i = 0;
    }

    if (i >= multiplicity) {
      inContainer = false;
      return next();
    }

    i++;

    return {
      done: false,
      value: value
    };
  });
};

/**
 * Method returning an iterator over the set's multiplicities.
 *
 * @return {Iterator}
 */
MultiSet.prototype.multiplicities = function() {
  return this.items.entries();
};

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  MultiSet.prototype[Symbol.iterator] = MultiSet.prototype.values;

/**
 * Convenience known methods.
 */
MultiSet.prototype.inspect = function() {
  return this.items;
};

if (typeof Symbol !== 'undefined')
  MultiSet.prototype[Symbol.for('nodejs.util.inspect.custom')] = MultiSet.prototype.inspect;
MultiSet.prototype.toJSON = function() {
  return this.items;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {MultiSet}
 */
MultiSet.from = function(iterable) {
  var set = new MultiSet();

  forEach(iterable, function(value) {
    set.add(value);
  });

  return set;
};

/**
 * Function returning whether the multiset A is a subset of the multiset B.
 *
 * @param  {MultiSet} A - First set.
 * @param  {MultiSet} B - Second set.
 * @return {boolean}
 */
MultiSet.isSubset = function(A, B) {
  var iterator = A.multiplicities(),
      step,
      key,
      mA;

  // Shortcuts
  if (A === B)
    return true;

  if (A.dimension > B.dimension)
    return false;

  while ((step = iterator.next(), !step.done)) {
    key = step.value[0];
    mA = step.value[1];

    if (B.multiplicity(key) < mA)
      return false;
  }

  return true;
};

/**
 * Function returning whether the multiset A is a superset of the multiset B.
 *
 * @param  {MultiSet} A - First set.
 * @param  {MultiSet} B - Second set.
 * @return {boolean}
 */
MultiSet.isSuperset = function(A, B) {
  return MultiSet.isSubset(B, A);
};

/**
 * Exporting.
 */
module.exports = MultiSet;


/***/ }),
/* 206 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist PassjoinIndex
 * ========================
 *
 * The PassjoinIndex is an index leveraging the "passjoin" algorithm as a mean
 * to index strings for Levenshtein distance queries. It features a complexity
 * related to the Levenshtein query threshold k rather than the number of
 * strings to test (roughly O(k^3)).
 *
 * [References]:
 * Jiang, Yu, Dong Deng, Jiannan Wang, Guoliang Li, et Jianhua Feng.
 * « Efficient Parallel Partition-Based Algorithms for Similarity Search and Join
 * with Edit Distance Constraints ». In Proceedings of the Joint EDBT/ICDT 2013
 * Workshops on - EDBT ’13, 341. Genoa, Italy: ACM Press, 2013.
 * https://doi.org/10.1145/2457317.2457382.
 *
 * Li, Guoliang, Dong Deng, et Jianhua Feng. « A Partition-Based Method for
 * String Similarity Joins with Edit-Distance Constraints ». ACM Transactions on
 * Database Systems 38, no 2 (1 juin 2013): 1‑33.
 * https://doi.org/10.1145/2487259.2487261.
 *
 * [Urls]:
 * http://people.csail.mit.edu/dongdeng/projects/passjoin/index.html
 */
var Iterator = __webpack_require__(177),
    forEach = __webpack_require__(168);

// TODO: leveraging BagDistance as an upper bound of Levenshtein
// TODO: leverage n-grams recursive indexing
// TODO: try the MultiArray as a memory backend
// TODO: what about damerau levenshtein

/**
 * Helpers.
 */

/**
 * Function returning the number of substrings that will be selected by the
 * multi-match-aware selection scheme for theshold `k`, for a string of length
 * `s` to match strings of length `l`.
 *
 * @param   {number} k - Levenshtein distance threshold.
 * @param   {number} s - Length of target strings.
 * @param   {number} l - Length of strings to match.
 * @returns {number}   - The number of selected substrings.
 */
function countSubstringsL(k, s, l) {
  return (((Math.pow(k, 2) - Math.pow(Math.abs(s - l), 2)) / 2) | 0) + k + 1;
}

/**
 * Function returning the minimum number of substrings that will be selected by
 * the multi-match-aware selection scheme for theshold `k`, for a string of
 * length `s` to match any string of relevant length.
 *
 * @param   {number} k - Levenshtein distance threshold.
 * @param   {number} s - Length of target strings.
 * @returns {number}   - The number of selected substrings.
 */
function countKeys(k, s) {
  var c = 0;

  for (var l = 0, m = s + 1; l < m; l++)
    c += countSubstringsL(k, s, l);

  return c;
}

/**
 * Function used to compare two keys in order to sort them first by decreasing
 * length and then alphabetically as per the "4.2 Effective Indexing Strategy"
 * point of the paper.
 *
 * @param   {number} k - Levenshtein distance threshold.
 * @param   {number} s - Length of target strings.
 * @returns {number}   - The number of selected substrings.
 */
function comparator(a, b) {
  if (a.length > b.length)
    return -1;
  if (a.length < b.length)
    return 1;

  if (a < b)
    return -1;
  if (a > b)
    return 1;

  return 0;
}

/**
 * Function partitioning a string into k + 1 uneven segments, the shorter
 * ones, then the longer ones.
 *
 * @param   {number} k - Levenshtein distance threshold.
 * @param   {number} l - Length of the string.
 * @returns {Array}    - The partition tuples (start, length).
 */
function partition(k, l) {
  var m = k + 1,
      a = (l / m) | 0,
      b = a + 1,
      i,
      j;

  var largeSegments = l - a * m,
      smallSegments = m - largeSegments;

  var tuples = new Array(k + 1);

  for (i = 0; i < smallSegments; i++)
    tuples[i] = [i * a, a];

  var offset = (i - 1) * a + a;

  for (j = 0; j < largeSegments; j++)
    tuples[i + j] = [offset + j * b, b];

  return tuples;
}

/**
 * Function yielding a string's k + 1 passjoin segments to index.
 *
 * @param   {number} k      - Levenshtein distance threshold.
 * @param   {string} string - Target string.
 * @returns {Array}         - The string's segments.
 */
function segments(k, string) {
  var l = string.length,
      m = k + 1,
      a = (l / m) | 0,
      b = a + 1,
      o,
      i,
      j;

  var largeSegments = l - a * m,
      smallSegments = m - largeSegments;

  var S = new Array(k + 1);

  for (i = 0; i < smallSegments; i++) {
    o = i * a;
    S[i] = string.slice(o, o + a);
  }

  var offset = (i - 1) * a + a;

  for (j = 0; j < largeSegments; j++) {
    o = offset + j * b;
    S[i + j] = string.slice(o, o + b);
  }

  return S;
}

// TODO: jsdocs
function segmentPos(k, i, string) {
  if (i === 0)
    return 0;

  var l = string.length;

  var m = k + 1,
      a = (l / m) | 0,
      b = a + 1;

  var largeSegments = l - a * m,
      smallSegments = m - largeSegments;

  if (i <= smallSegments - 1)
    return i * a;

  var offset = i - smallSegments;

  return smallSegments * a + offset * b;
}

/**
 * Function returning the interval of relevant substrings to lookup using the
 * multi-match-aware substring selection scheme described in the paper.
 *
 * @param   {number} k      - Levenshtein distance threshold.
 * @param   {number} delta  - Signed length difference between both considered strings.
 * @param   {number} i      - k + 1 segment index.
 * @param   {number} s      - String's length.
 * @param   {number} pi     - k + 1 segment position in target string.
 * @param   {number} li     - k + 1 segment length.
 * @returns {Array}         - The interval (start, stop).
 */
function multiMatchAwareInterval(k, delta, i, s, pi, li) {
  var start1 = pi - i,
      end1 = pi + i;

  var o = k - i;

  var start2 = pi + delta - o,
      end2 = pi + delta + o;

  var end3 = s - li;

  return [Math.max(0, start1, start2), Math.min(end1, end2, end3)];
}

/**
 * Function yielding relevant substrings to lookup using the multi-match-aware
 * substring selection scheme described in the paper.
 *
 * @param   {number} k      - Levenshtein distance threshold.
 * @param   {string} string  - Target string.
 * @param   {number} l      - Length of strings to match.
 * @param   {number} i      - k + 1 segment index.
 * @param   {number} pi     - k + 1 segment position in target string.
 * @param   {number} li     - k + 1 segment length.
 * @returns {Array}         - The contiguous substrings.
 */
function multiMatchAwareSubstrings(k, string, l, i, pi, li) {
  var s = string.length;

  // Note that we need to keep the non-absolute delta for this function
  // to work in both directions, up & down
  var delta = s - l;

  var interval = multiMatchAwareInterval(k, delta, i, s, pi, li);

  var start = interval[0],
      stop = interval[1];

  var currentSubstring = '';

  var substrings = [];

  var substring, j, m;

  for (j = start, m = stop + 1; j < m; j++) {
    substring = string.slice(j, j + li);

    // We skip identical consecutive substrings (to avoid repetition in case
    // of contiguous letter duplication)
    if (substring === currentSubstring)
      continue;

    substrings.push(substring);

    currentSubstring = substring;
  }

  return substrings;
}

/**
 * PassjoinIndex.
 *
 * @note I tried to apply the paper's optimizations regarding Levenshtein
 * distance computations but it did not provide a performance boost, quite
 * the contrary. This is because since we are mostly using the index for small k
 * here, most of the strings we work on are quite small and the bookkeeping
 * induced by Ukkonen's method and the paper's one are slowing us down more than
 * they actually help us go faster.
 *
 * @note This implementation does not try to ensure that you add the same string
 * more than once.
 *
 * @constructor
 * @param {function} levenshtein - Levenshtein distance function.
 * @param {number}   k           - Levenshtein distance threshold.
 */
function PassjoinIndex(levenshtein, k) {
  if (typeof levenshtein !== 'function')
    throw new Error('mnemonist/passjoin-index: `levenshtein` should be a function returning edit distance between two strings.');

  if (typeof k !== 'number' || k < 1)
    throw new Error('mnemonist/passjoin-index: `k` should be a number > 0');

  this.levenshtein = levenshtein;
  this.k = k;
  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
PassjoinIndex.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.strings = [];
  this.invertedIndices = {};
};

/**
 * Method used to add a new value to the index.
 *
 * @param  {string|Array} value - Value to add.
 * @return {PassjoinIndex}
 */
PassjoinIndex.prototype.add = function(value) {
  var l = value.length;

  var stringIndex = this.size;

  this.strings.push(value);
  this.size++;

  var S = segments(this.k, value);

  var Ll = this.invertedIndices[l];

  if (typeof Ll === 'undefined') {
    Ll = {};
    this.invertedIndices[l] = Ll;
  }

  var segment,
      matches,
      key,
      i,
      m;

  for (i = 0, m = S.length; i < m; i++) {
    segment = S[i];
    key = segment + i;
    matches = Ll[key];

    if (typeof matches === 'undefined') {
      matches = [stringIndex];
      Ll[key] = matches;
    }
    else {
      matches.push(stringIndex);
    }
  }

  return this;
};

/**
 * Method used to search for string matching the given query.
 *
 * @param  {string|Array} query - Query string.
 * @return {Array}
 */
PassjoinIndex.prototype.search = function(query) {
  var s = query.length,
      k = this.k;

  var M = new Set();

  var candidates,
      candidate,
      queryPos,
      querySegmentLength,
      key,
      S,
      P,
      l,
      m,
      i,
      n1,
      j,
      n2,
      y,
      n3;

  for (l = Math.max(0, s - k), m = s + k + 1; l < m; l++) {
    var Ll = this.invertedIndices[l];

    if (typeof Ll === 'undefined')
      continue;

    P = partition(k, l);

    for (i = 0, n1 = P.length; i < n1; i++) {
      queryPos = P[i][0];
      querySegmentLength = P[i][1];

      S = multiMatchAwareSubstrings(
        k,
        query,
        l,
        i,
        queryPos,
        querySegmentLength
      );

      // Empty string edge case
      if (!S.length)
        S = [''];

      for (j = 0, n2 = S.length; j < n2; j++) {
        key = S[j] + i;
        candidates = Ll[key];

        if (typeof candidates === 'undefined')
          continue;

        for (y = 0, n3 = candidates.length; y < n3; y++) {
          candidate = this.strings[candidates[y]];

          // NOTE: first condition is here not to compute Levenshtein
          // distance for tiny strings

          // NOTE: maintaining a Set of rejected candidate is not really useful
          // because it consumes more memory and because non-matches are
          // less likely to be candidates agains
          if (
            s <= k && l <= k ||
            (
              !M.has(candidate) &&
              this.levenshtein(query, candidate) <= k
            )
          )
            M.add(candidate);
        }
      }
    }
  }

  return M;
};

/**
 * Method used to iterate over the index.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
PassjoinIndex.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = 0, l = this.strings.length; i < l; i++)
    callback.call(scope, this.strings[i], i, this);
};

/**
 * Method used to create an iterator over a index's values.
 *
 * @return {Iterator}
 */
PassjoinIndex.prototype.values = function() {
  var strings = this.strings,
      l = strings.length,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

    var value = strings[i];
    i++;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  PassjoinIndex.prototype[Symbol.iterator] = PassjoinIndex.prototype.values;

/**
 * Convenience known methods.
 */
PassjoinIndex.prototype.inspect = function() {
  var array = this.strings.slice();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: PassjoinIndex,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  PassjoinIndex.prototype[Symbol.for('nodejs.util.inspect.custom')] = PassjoinIndex.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {PassjoinIndex}
 */
PassjoinIndex.from = function(iterable, levenshtein, k) {
  var index = new PassjoinIndex(levenshtein, k);

  forEach(iterable, function(string) {
    index.add(string);
  });

  return index;
};

/**
 * Exporting.
 */
PassjoinIndex.countKeys = countKeys;
PassjoinIndex.comparator = comparator;
PassjoinIndex.partition = partition;
PassjoinIndex.segments = segments;
PassjoinIndex.segmentPos = segmentPos;
PassjoinIndex.multiMatchAwareInterval = multiMatchAwareInterval;
PassjoinIndex.multiMatchAwareSubstrings = multiMatchAwareSubstrings;

module.exports = PassjoinIndex;


/***/ }),
/* 207 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Queue
 * ================
 *
 * Queue implementation based on the ideas of Queue.js that seems to beat
 * a LinkedList one in performance.
 */
var Iterator = __webpack_require__(177),
    forEach = __webpack_require__(168);

/**
 * Queue
 *
 * @constructor
 */
function Queue() {
  this.clear();
}

/**
 * Method used to clear the queue.
 *
 * @return {undefined}
 */
Queue.prototype.clear = function() {

  // Properties
  this.items = [];
  this.offset = 0;
  this.size = 0;
};

/**
 * Method used to add an item to the queue.
 *
 * @param  {any}    item - Item to enqueue.
 * @return {number}
 */
Queue.prototype.enqueue = function(item) {

  this.items.push(item);
  return ++this.size;
};

/**
 * Method used to retrieve & remove the first item of the queue.
 *
 * @return {any}
 */
Queue.prototype.dequeue = function() {
  if (!this.size)
    return;

  var item = this.items[this.offset];

  if (++this.offset * 2 >= this.items.length) {
    this.items = this.items.slice(this.offset);
    this.offset = 0;
  }

  this.size--;

  return item;
};

/**
 * Method used to retrieve the first item of the queue.
 *
 * @return {any}
 */
Queue.prototype.peek = function() {
  if (!this.size)
    return;

  return this.items[this.offset];
};

/**
 * Method used to iterate over the queue.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
Queue.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = this.offset, j = 0, l = this.items.length; i < l; i++, j++)
    callback.call(scope, this.items[i], j, this);
};

/*
 * Method used to convert the queue to a JavaScript array.
 *
 * @return {array}
 */
Queue.prototype.toArray = function() {
  return this.items.slice(this.offset);
};

/**
 * Method used to create an iterator over a queue's values.
 *
 * @return {Iterator}
 */
Queue.prototype.values = function() {
  var items = this.items,
      i = this.offset;

  return new Iterator(function() {
    if (i >= items.length)
      return {
        done: true
      };

    var value = items[i];
    i++;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over a queue's entries.
 *
 * @return {Iterator}
 */
Queue.prototype.entries = function() {
  var items = this.items,
      i = this.offset,
      j = 0;

  return new Iterator(function() {
    if (i >= items.length)
      return {
        done: true
      };

    var value = items[i];
    i++;

    return {
      value: [j++, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  Queue.prototype[Symbol.iterator] = Queue.prototype.values;

/**
 * Convenience known methods.
 */
Queue.prototype.toString = function() {
  return this.toArray().join(',');
};

Queue.prototype.toJSON = function() {
  return this.toArray();
};

Queue.prototype.inspect = function() {
  var array = this.toArray();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: Queue,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  Queue.prototype[Symbol.for('nodejs.util.inspect.custom')] = Queue.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a queue.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @return {Queue}
 */
Queue.from = function(iterable) {
  var queue = new Queue();

  forEach(iterable, function(value) {
    queue.enqueue(value);
  });

  return queue;
};

/**
 * Static @.of function taking an arbitrary number of arguments & converting it
 * into a queue.
 *
 * @param  {...any} args
 * @return {Queue}
 */
Queue.of = function() {
  return Queue.from(arguments);
};

/**
 * Exporting.
 */
module.exports = Queue;


/***/ }),
/* 208 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Stack
 * ================
 *
 * Stack implementation relying on JavaScript arrays, which are fast enough &
 * correctly optimized for this kind of work.
 */
var Iterator = __webpack_require__(177),
    forEach = __webpack_require__(168);

/**
 * Stack
 *
 * @constructor
 */
function Stack() {
  this.clear();
}

/**
 * Method used to clear the stack.
 *
 * @return {undefined}
 */
Stack.prototype.clear = function() {

  // Properties
  this.items = [];
  this.size = 0;
};

/**
 * Method used to add an item to the stack.
 *
 * @param  {any}    item - Item to add.
 * @return {number}
 */
Stack.prototype.push = function(item) {
  this.items.push(item);
  return ++this.size;
};

/**
 * Method used to retrieve & remove the last item of the stack.
 *
 * @return {any}
 */
Stack.prototype.pop = function() {
  if (this.size === 0)
    return;

  this.size--;
  return this.items.pop();
};

/**
 * Method used to get the last item of the stack.
 *
 * @return {any}
 */
Stack.prototype.peek = function() {
  return this.items[this.size - 1];
};

/**
 * Method used to iterate over the stack.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
Stack.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = 0, l = this.items.length; i < l; i++)
    callback.call(scope, this.items[l - i - 1], i, this);
};

/**
 * Method used to convert the stack to a JavaScript array.
 *
 * @return {array}
 */
Stack.prototype.toArray = function() {
  var array = new Array(this.size),
      l = this.size - 1,
      i = this.size;

  while (i--)
    array[i] = this.items[l - i];

  return array;
};

/**
 * Method used to create an iterator over a stack's values.
 *
 * @return {Iterator}
 */
Stack.prototype.values = function() {
  var items = this.items,
      l = items.length,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

    var value = items[l - i - 1];
    i++;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over a stack's entries.
 *
 * @return {Iterator}
 */
Stack.prototype.entries = function() {
  var items = this.items,
      l = items.length,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

    var value = items[l - i - 1];

    return {
      value: [i++, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  Stack.prototype[Symbol.iterator] = Stack.prototype.values;


/**
 * Convenience known methods.
 */
Stack.prototype.toString = function() {
  return this.toArray().join(',');
};

Stack.prototype.toJSON = function() {
  return this.toArray();
};

Stack.prototype.inspect = function() {
  var array = this.toArray();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: Stack,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  Stack.prototype[Symbol.for('nodejs.util.inspect.custom')] = Stack.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a stack.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @return {Stack}
 */
Stack.from = function(iterable) {
  var stack = new Stack();

  forEach(iterable, function(value) {
    stack.push(value);
  });

  return stack;
};

/**
 * Static @.of function taking an arbitrary number of arguments & converting it
 * into a stack.
 *
 * @param  {...any} args
 * @return {Stack}
 */
Stack.of = function() {
  return Stack.from(arguments);
};

/**
 * Exporting.
 */
module.exports = Stack;


/***/ }),
/* 209 */
/***/ ((__unused_webpack_module, exports) => {

/**
 * Mnemonist Set
 * ==============
 *
 * Useful function related to sets such as union, intersection and so on...
 */

// TODO: optimize versions for less variadicities

/**
 * Variadic function computing the intersection of multiple sets.
 *
 * @param  {...Set} sets - Sets to intersect.
 * @return {Set}         - The intesection.
 */
exports.intersection = function() {
  if (arguments.length < 2)
    throw new Error('mnemonist/Set.intersection: needs at least two arguments.');

  var I = new Set();

  // First we need to find the smallest set
  var smallestSize = Infinity,
      smallestSet = null;

  var s, i, l = arguments.length;

  for (i = 0; i < l; i++) {
    s = arguments[i];

    // If one of the set has no items, we can stop right there
    if (s.size === 0)
      return I;

    if (s.size < smallestSize) {
      smallestSize = s.size;
      smallestSet = s;
    }
  }

  // Now we need to intersect this set with the others
  var iterator = smallestSet.values(),
      step,
      item,
      add,
      set;

  // TODO: we can optimize by iterating each next time over the current intersection
  // but this probably means more RAM to consume since we'll create n-1 sets rather than
  // only the one.
  while ((step = iterator.next(), !step.done)) {
    item = step.value;
    add = true;

    for (i = 0; i < l; i++) {
      set = arguments[i];

      if (set === smallestSet)
        continue;

      if (!set.has(item)) {
        add = false;
        break;
      }
    }

    if (add)
      I.add(item);
  }

  return I;
};

/**
 * Variadic function computing the union of multiple sets.
 *
 * @param  {...Set} sets - Sets to unite.
 * @return {Set}         - The union.
 */
exports.union = function() {
  if (arguments.length < 2)
    throw new Error('mnemonist/Set.union: needs at least two arguments.');

  var U = new Set();

  var i, l = arguments.length;

  var iterator,
      step;

  for (i = 0; i < l; i++) {
    iterator = arguments[i].values();

    while ((step = iterator.next(), !step.done))
      U.add(step.value);
  }

  return U;
};

/**
 * Function computing the difference between two sets.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {Set}   - The difference.
 */
exports.difference = function(A, B) {

  // If first set is empty
  if (!A.size)
    return new Set();

  if (!B.size)
    return new Set(A);

  var D = new Set();

  var iterator = A.values(),
      step;

  while ((step = iterator.next(), !step.done)) {
    if (!B.has(step.value))
      D.add(step.value);
  }

  return D;
};

/**
 * Function computing the symmetric difference between two sets.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {Set}   - The symmetric difference.
 */
exports.symmetricDifference = function(A, B) {
  var S = new Set();

  var iterator = A.values(),
      step;

  while ((step = iterator.next(), !step.done)) {
    if (!B.has(step.value))
      S.add(step.value);
  }

  iterator = B.values();

  while ((step = iterator.next(), !step.done)) {
    if (!A.has(step.value))
      S.add(step.value);
  }

  return S;
};

/**
 * Function returning whether A is a subset of B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {boolean}
 */
exports.isSubset = function(A, B) {
  var iterator = A.values(),
      step;

  // Shortcuts
  if (A === B)
    return true;

  if (A.size > B.size)
    return false;

  while ((step = iterator.next(), !step.done)) {
    if (!B.has(step.value))
      return false;
  }

  return true;
};

/**
 * Function returning whether A is a superset of B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {boolean}
 */
exports.isSuperset = function(A, B) {
  return exports.isSubset(B, A);
};

/**
 * Function adding the items of set B to the set A.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 */
exports.add = function(A, B) {
  var iterator = B.values(),
      step;

  while ((step = iterator.next(), !step.done))
    A.add(step.value);

  return;
};

/**
 * Function subtracting the items of set B from the set A.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 */
exports.subtract = function(A, B) {
  var iterator = B.values(),
      step;

  while ((step = iterator.next(), !step.done))
    A.delete(step.value);

  return;
};

/**
 * Function intersecting the items of A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 */
exports.intersect = function(A, B) {
  var iterator = A.values(),
      step;

  while ((step = iterator.next(), !step.done)) {
    if (!B.has(step.value))
      A.delete(step.value);
  }

  return;
};

/**
 * Function disjuncting the items of A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 */
exports.disjunct = function(A, B) {
  var iterator = A.values(),
      step;

  var toRemove = [];

  while ((step = iterator.next(), !step.done)) {
    if (B.has(step.value))
      toRemove.push(step.value);
  }

  iterator = B.values();

  while ((step = iterator.next(), !step.done)) {
    if (!A.has(step.value))
      A.add(step.value);
  }

  for (var i = 0, l = toRemove.length; i < l; i++)
    A.delete(toRemove[i]);

  return;
};

/**
 * Function returning the size of the intersection of A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {number}
 */
exports.intersectionSize = function(A, B) {
  var tmp;

  // We need to know the smallest set
  if (A.size > B.size) {
    tmp = A;
    A = B;
    B = tmp;
  }

  if (A.size === 0)
    return 0;

  if (A === B)
    return A.size;

  var iterator = A.values(),
      step;

  var I = 0;

  while ((step = iterator.next(), !step.done)) {
    if (B.has(step.value))
      I++;
  }

  return I;
};

/**
 * Function returning the size of the union of A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {number}
 */
exports.unionSize = function(A, B) {
  var I = exports.intersectionSize(A, B);

  return A.size + B.size - I;
};

/**
 * Function returning the Jaccard similarity between A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {number}
 */
exports.jaccard = function(A, B) {
  var I = exports.intersectionSize(A, B);

  if (I === 0)
    return 0;

  var U = A.size + B.size - I;

  return I / U;
};

/**
 * Function returning the overlap coefficient between A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {number}
 */
exports.overlap = function(A, B) {
  var I = exports.intersectionSize(A, B);

  if (I === 0)
    return 0;

  return I / Math.min(A.size, B.size);
};


/***/ }),
/* 210 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist SparseQueueSet
 * =========================
 *
 * JavaScript sparse queue set implemented on top of byte arrays.
 *
 * [Reference]: https://research.swtch.com/sparse
 */
var Iterator = __webpack_require__(177),
    getPointerArray = (__webpack_require__(172).getPointerArray);

/**
 * SparseQueueSet.
 *
 * @constructor
 */
function SparseQueueSet(capacity) {

  var ByteArray = getPointerArray(capacity);

  // Properties
  this.start = 0;
  this.size = 0;
  this.capacity = capacity;
  this.dense = new ByteArray(capacity);
  this.sparse = new ByteArray(capacity);
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
SparseQueueSet.prototype.clear = function() {
  this.start = 0;
  this.size = 0;
};

/**
 * Method used to check the existence of a member in the queue.
 *
 * @param  {number} member - Member to test.
 * @return {SparseQueueSet}
 */
SparseQueueSet.prototype.has = function(member) {
  if (this.size === 0)
    return false;

  var index = this.sparse[member];

  var inBounds = (
    index < this.capacity &&
    (
      index >= this.start &&
      index < this.start + this.size
    ) ||
    (
      index < ((this.start + this.size) % this.capacity)
    )
  );

  return (
    inBounds &&
    this.dense[index] === member
  );
};

/**
 * Method used to add a member to the queue.
 *
 * @param  {number} member - Member to add.
 * @return {SparseQueueSet}
 */
SparseQueueSet.prototype.enqueue = function(member) {
  var index = this.sparse[member];

  if (this.size !== 0) {
    var inBounds = (
      index < this.capacity &&
      (
        index >= this.start &&
        index < this.start + this.size
      ) ||
      (
        index < ((this.start + this.size) % this.capacity)
      )
    );

    if (inBounds && this.dense[index] === member)
      return this;
  }

  index = (this.start + this.size) % this.capacity;

  this.dense[index] = member;
  this.sparse[member] = index;
  this.size++;

  return this;
};

/**
 * Method used to remove the next member from the queue.
 *
 * @param  {number} member - Member to delete.
 * @return {boolean}
 */
SparseQueueSet.prototype.dequeue = function() {
  if (this.size === 0)
    return;

  var index = this.start;

  this.size--;
  this.start++;

  if (this.start === this.capacity)
    this.start = 0;

  var member = this.dense[index];

  this.sparse[member] = this.capacity;

  return member;
};

/**
 * Method used to iterate over the queue's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
SparseQueueSet.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  while (j < l) {
    callback.call(scope, this.dense[i], j, this);
    i++;
    j++;

    if (i === c)
      i = 0;
  }
};

/**
 * Method used to create an iterator over a set's values.
 *
 * @return {Iterator}
 */
SparseQueueSet.prototype.values = function() {
  var dense = this.dense,
      c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  return new Iterator(function() {
    if (j >= l)
      return {
        done: true
      };

    var value = dense[i];

    i++;
    j++;

    if (i === c)
      i = 0;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  SparseQueueSet.prototype[Symbol.iterator] = SparseQueueSet.prototype.values;

/**
 * Convenience known methods.
 */
SparseQueueSet.prototype.inspect = function() {
  var proxy = [];

  this.forEach(function(member) {
    proxy.push(member);
  });

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: SparseQueueSet,
    enumerable: false
  });

  proxy.capacity = this.capacity;

  return proxy;
};

if (typeof Symbol !== 'undefined')
  SparseQueueSet.prototype[Symbol.for('nodejs.util.inspect.custom')] = SparseQueueSet.prototype.inspect;

/**
 * Exporting.
 */
module.exports = SparseQueueSet;


/***/ }),
/* 211 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist SparseMap
 * ====================
 *
 * JavaScript sparse map implemented on top of byte arrays.
 *
 * [Reference]: https://research.swtch.com/sparse
 */
var Iterator = __webpack_require__(177),
    getPointerArray = (__webpack_require__(172).getPointerArray);

/**
 * SparseMap.
 *
 * @constructor
 */
function SparseMap(Values, length) {
  if (arguments.length < 2) {
    length = Values;
    Values = Array;
  }

  var ByteArray = getPointerArray(length);

  // Properties
  this.size = 0;
  this.length = length;
  this.dense = new ByteArray(length);
  this.sparse = new ByteArray(length);
  this.vals = new Values(length);
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
SparseMap.prototype.clear = function() {
  this.size = 0;
};

/**
 * Method used to check the existence of a member in the set.
 *
 * @param  {number} member - Member to test.
 * @return {SparseMap}
 */
SparseMap.prototype.has = function(member) {
  var index = this.sparse[member];

  return (
    index < this.size &&
    this.dense[index] === member
  );
};

/**
 * Method used to get the value associated to a member in the set.
 *
 * @param  {number} member - Member to test.
 * @return {any}
 */
SparseMap.prototype.get = function(member) {
  var index = this.sparse[member];

  if (index < this.size && this.dense[index] === member)
    return this.vals[index];

  return;
};

/**
 * Method used to set a value into the map.
 *
 * @param  {number} member - Member to set.
 * @param  {any}    value  - Associated value.
 * @return {SparseMap}
 */
SparseMap.prototype.set = function(member, value) {
  var index = this.sparse[member];

  if (index < this.size && this.dense[index] === member) {
    this.vals[index] = value;
    return this;
  }

  this.dense[this.size] = member;
  this.sparse[member] = this.size;
  this.vals[this.size] = value;
  this.size++;

  return this;
};

/**
 * Method used to remove a member from the set.
 *
 * @param  {number} member - Member to delete.
 * @return {boolean}
 */
SparseMap.prototype.delete = function(member) {
  var index = this.sparse[member];

  if (index >= this.size || this.dense[index] !== member)
    return false;

  index = this.dense[this.size - 1];
  this.dense[this.sparse[member]] = index;
  this.sparse[index] = this.sparse[member];
  this.size--;

  return true;
};

/**
 * Method used to iterate over the set's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
SparseMap.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = 0; i < this.size; i++)
    callback.call(scope, this.vals[i], this.dense[i]);
};

/**
 * Method used to create an iterator over a set's members.
 *
 * @return {Iterator}
 */
SparseMap.prototype.keys = function() {
  var size = this.size,
      dense = this.dense,
      i = 0;

  return new Iterator(function() {
    if (i < size) {
      var item = dense[i];
      i++;

      return {
        value: item
      };
    }

    return {
      done: true
    };
  });
};

/**
 * Method used to create an iterator over a set's values.
 *
 * @return {Iterator}
 */
SparseMap.prototype.values = function() {
  var size = this.size,
      values = this.vals,
      i = 0;

  return new Iterator(function() {
    if (i < size) {
      var item = values[i];
      i++;

      return {
        value: item
      };
    }

    return {
      done: true
    };
  });
};

/**
 * Method used to create an iterator over a set's entries.
 *
 * @return {Iterator}
 */
SparseMap.prototype.entries = function() {
  var size = this.size,
      dense = this.dense,
      values = this.vals,
      i = 0;

  return new Iterator(function() {
    if (i < size) {
      var item = [dense[i], values[i]];
      i++;

      return {
        value: item
      };
    }

    return {
      done: true
    };
  });
};

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  SparseMap.prototype[Symbol.iterator] = SparseMap.prototype.entries;

/**
 * Convenience known methods.
 */
SparseMap.prototype.inspect = function() {
  var proxy = new Map();

  for (var i = 0; i < this.size; i++)
    proxy.set(this.dense[i], this.vals[i]);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: SparseMap,
    enumerable: false
  });

  proxy.length = this.length;

  if (this.vals.constructor !== Array)
    proxy.type = this.vals.constructor.name;

  return proxy;
};

if (typeof Symbol !== 'undefined')
  SparseMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = SparseMap.prototype.inspect;

/**
 * Exporting.
 */
module.exports = SparseMap;


/***/ }),
/* 212 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist SparseSet
 * ====================
 *
 * JavaScript sparse set implemented on top of byte arrays.
 *
 * [Reference]: https://research.swtch.com/sparse
 */
var Iterator = __webpack_require__(177),
    getPointerArray = (__webpack_require__(172).getPointerArray);

/**
 * SparseSet.
 *
 * @constructor
 */
function SparseSet(length) {

  var ByteArray = getPointerArray(length);

  // Properties
  this.size = 0;
  this.length = length;
  this.dense = new ByteArray(length);
  this.sparse = new ByteArray(length);
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
SparseSet.prototype.clear = function() {
  this.size = 0;
};

/**
 * Method used to check the existence of a member in the set.
 *
 * @param  {number} member - Member to test.
 * @return {SparseSet}
 */
SparseSet.prototype.has = function(member) {
  var index = this.sparse[member];

  return (
    index < this.size &&
    this.dense[index] === member
  );
};

/**
 * Method used to add a member to the set.
 *
 * @param  {number} member - Member to add.
 * @return {SparseSet}
 */
SparseSet.prototype.add = function(member) {
  var index = this.sparse[member];

  if (index < this.size && this.dense[index] === member)
    return this;

  this.dense[this.size] = member;
  this.sparse[member] = this.size;
  this.size++;

  return this;
};

/**
 * Method used to remove a member from the set.
 *
 * @param  {number} member - Member to delete.
 * @return {boolean}
 */
SparseSet.prototype.delete = function(member) {
  var index = this.sparse[member];

  if (index >= this.size || this.dense[index] !== member)
    return false;

  index = this.dense[this.size - 1];
  this.dense[this.sparse[member]] = index;
  this.sparse[index] = this.sparse[member];
  this.size--;

  return true;
};

/**
 * Method used to iterate over the set's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
SparseSet.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var item;

  for (var i = 0; i < this.size; i++) {
    item = this.dense[i];

    callback.call(scope, item, item);
  }
};

/**
 * Method used to create an iterator over a set's values.
 *
 * @return {Iterator}
 */
SparseSet.prototype.values = function() {
  var size = this.size,
      dense = this.dense,
      i = 0;

  return new Iterator(function() {
    if (i < size) {
      var item = dense[i];
      i++;

      return {
        value: item
      };
    }

    return {
      done: true
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  SparseSet.prototype[Symbol.iterator] = SparseSet.prototype.values;

/**
 * Convenience known methods.
 */
SparseSet.prototype.inspect = function() {
  var proxy = new Set();

  for (var i = 0; i < this.size; i++)
    proxy.add(this.dense[i]);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: SparseSet,
    enumerable: false
  });

  proxy.length = this.length;

  return proxy;
};

if (typeof Symbol !== 'undefined')
  SparseSet.prototype[Symbol.for('nodejs.util.inspect.custom')] = SparseSet.prototype.inspect;

/**
 * Exporting.
 */
module.exports = SparseSet;


/***/ }),
/* 213 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint no-loop-func: 0 */
/**
 * Mnemonist SymSpell
 * ===================
 *
 * JavaScript implementation of the Symmetric Delete Spelling dictionary to
 * efficiently index & query expression based on edit distance.
 * Note that the current implementation target the v3.0 of the algorithm.
 *
 * [Reference]:
 * http://blog.faroo.com/2012/06/07/improved-edit-distance-based-spelling-correction/
 * https://github.com/wolfgarbe/symspell
 *
 * [Author]:
 * Wolf Garbe
 */
var forEach = __webpack_require__(168);

/**
 * Constants.
 */
var DEFAULT_MAX_DISTANCE = 2,
    DEFAULT_VERBOSITY = 2;

var VERBOSITY = new Set([
  // Returns only the top suggestion
  0,
  // Returns suggestions with the smallest edit distance
  1,
  // Returns every suggestion (no early termination)
  2
]);

var VERBOSITY_EXPLANATIONS = {
  0: 'Returns only the top suggestion',
  1: 'Returns suggestions with the smallest edit distance',
  2: 'Returns every suggestion (no early termination)'
};

/**
 * Functions.
 */

/**
 * Function creating a dictionary item.
 *
 * @param  {number} [value] - An optional suggestion.
 * @return {object}         - The created item.
 */
function createDictionaryItem(value) {
  var suggestions = new Set();

  if (typeof value === 'number')
    suggestions.add(value);

  return {
    suggestions,
    count: 0
  };
}

/**
 * Function creating a suggestion item.
 *
 * @return {object} - The created item.
 */
function createSuggestionItem(term, distance, count) {
  return {
    term: term || '',
    distance: distance || 0,
    count: count || 0
  };
}

/**
 * Simplified edit function.
 *
 * @param {string} word      - Target word.
 * @param {number} distance  - Distance.
 * @param {number} max       - Max distance.
 * @param {Set}    [deletes] - Set mutated to store deletes.
 */
function edits(word, distance, max, deletes) {
  deletes = deletes || new Set();
  distance++;

  var deletedItem,
      l = word.length,
      i;

  if (l > 1) {
    for (i = 0; i < l; i++) {
      deletedItem = word.substring(0, i) + word.substring(i + 1);

      if (!deletes.has(deletedItem)) {
        deletes.add(deletedItem);

        if (distance < max)
          edits(deletedItem, distance, max, deletes);
      }
    }
  }

  return deletes;
}

/**
 * Function used to conditionally add suggestions.
 *
 * @param {array}  words       - Words list.
 * @param {number} verbosity   - Verbosity level.
 * @param {object} item        - The target item.
 * @param {string} suggestion  - The target suggestion.
 * @param {number} int         - Integer key of the word.
 * @param {object} deletedItem - Considered deleted item.
 * @param {SymSpell}
 */
function addLowestDistance(words, verbosity, item, suggestion, int, deletedItem) {
  var first = item.suggestions.values().next().value;

  if (verbosity < 2 &&
      item.suggestions.size > 0 &&
      words[first].length - deletedItem.length > suggestion.length - deletedItem.length) {
    item.suggestions = new Set();
    item.count = 0;
  }

  if (verbosity === 2 ||
      !item.suggestions.size ||
      words[first].length - deletedItem.length >= suggestion.length - deletedItem.length) {
    item.suggestions.add(int);
  }
}

/**
 * Custom Damerau-Levenshtein used by the algorithm.
 *
 * @param  {string} source - First string.
 * @param  {string} target - Second string.
 * @return {number}        - The distance.
 */
function damerauLevenshtein(source, target) {
  var m = source.length,
      n = target.length,
      H = [[]],
      INF = m + n,
      sd = new Map(),
      i,
      l,
      j;

  H[0][0] = INF;

  for (i = 0; i <= m; i++) {
    if (!H[i + 1])
      H[i + 1] = [];
    H[i + 1][1] = i;
    H[i + 1][0] = INF;
  }

  for (j = 0; j <= n; j++) {
    H[1][j + 1] = j;
    H[0][j + 1] = INF;
  }

  var st = source + target,
      letter;

  for (i = 0, l = st.length; i < l; i++) {
    letter = st[i];

    if (!sd.has(letter))
      sd.set(letter, 0);
  }

  // Iterating
  for (i = 1; i <= m; i++) {
    var DB = 0;

    for (j = 1; j <= n; j++) {
      var i1 = sd.get(target[j - 1]),
          j1 = DB;

      if (source[i - 1] === target[j - 1]) {
        H[i + 1][j + 1] = H[i][j];
        DB = j;
      }
      else {
        H[i + 1][j + 1] = Math.min(
          H[i][j],
          H[i + 1][j],
          H[i][j + 1]
        ) + 1;
      }

      H[i + 1][j + 1] = Math.min(
        H[i + 1][j + 1],
        H[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1)
      );
    }

    sd.set(source[i - 1], i);
  }

  return H[m + 1][n + 1];
}

/**
 * Lookup function.
 *
 * @param  {object} dictionary  - A SymSpell dictionary.
 * @param  {array}  words       - Unique words list.
 * @param  {number} verbosity   - Verbosity level.
 * @param  {number} maxDistance - Maximum distance.
 * @param  {number} maxLength   - Maximum word length in the dictionary.
 * @param  {string} input       - Input string.
 * @return {array}              - The list of suggestions.
 */
function lookup(dictionary, words, verbosity, maxDistance, maxLength, input) {
  var length = input.length;

  if (length - maxDistance > maxLength)
    return [];

  var candidates = [input],
      candidateSet = new Set(),
      suggestionSet = new Set();

  var suggestions = [],
      candidate,
      item;

  // Exhausting every candidates
  while (candidates.length > 0) {
    candidate = candidates.shift();

    // Early termination
    if (
      verbosity < 2 &&
      suggestions.length > 0 &&
      length - candidate.length > suggestions[0].distance
    )
      break;

    item = dictionary[candidate];

    if (item !== undefined) {
      if (typeof item === 'number')
        item = createDictionaryItem(item);

      if (item.count > 0 && !suggestionSet.has(candidate)) {
        suggestionSet.add(candidate);

        var suggestItem = createSuggestionItem(
          candidate,
          length - candidate.length,
          item.count
        );

        suggestions.push(suggestItem);

        // Another early termination
        if (verbosity < 2 && length - candidate.length === 0)
          break;
      }

      // Iterating over the item's suggestions
      item.suggestions.forEach(index => {
        var suggestion = words[index];

        // Do we already have this suggestion?
        if (suggestionSet.has(suggestion))
          return;

        suggestionSet.add(suggestion);

        // Computing distance between candidate & suggestion
        var distance = 0;

        if (input !== suggestion) {
          if (suggestion.length === candidate.length) {
            distance = length - candidate.length;
          }
          else if (length === candidate.length) {
            distance = suggestion.length - candidate.length;
          }
          else {
            var ii = 0,
                jj = 0;

            var l = suggestion.length;

            while (
              ii < l &&
              ii < length &&
              suggestion[ii] === input[ii]
            ) {
              ii++;
            }

            while (
              jj < l - ii &&
              jj < length &&
              suggestion[l - jj - 1] === input[length - jj - 1]
            ) {
              jj++;
            }

            if (ii > 0 || jj > 0) {
              distance = damerauLevenshtein(
                suggestion.substr(ii, l - ii - jj),
                input.substr(ii, length - ii - jj)
              );
            }
            else {
              distance = damerauLevenshtein(suggestion, input);
            }
          }
        }

        // Removing suggestions of higher distance
        if (verbosity < 2 &&
            suggestions.length > 0 &&
            suggestions[0].distance > distance) {
          suggestions = [];
        }

        if (verbosity < 2 &&
            suggestions.length > 0 &&
            distance > suggestions[0].distance) {
          return;
        }

        if (distance <= maxDistance) {
          var target = dictionary[suggestion];

          if (target !== undefined) {
            suggestions.push(createSuggestionItem(
              suggestion,
              distance,
              target.count
            ));
          }
        }
      });
    }

    // Adding edits
    if (length - candidate.length < maxDistance) {

      if (verbosity < 2 &&
          suggestions.length > 0 &&
          length - candidate.length >= suggestions[0].distance)
        continue;

      for (var i = 0, l = candidate.length; i < l; i++) {
        var deletedItem = (
          candidate.substring(0, i) +
          candidate.substring(i + 1)
        );

        if (!candidateSet.has(deletedItem)) {
          candidateSet.add(deletedItem);
          candidates.push(deletedItem);
        }
      }
    }
  }

  if (verbosity === 0)
    return suggestions.slice(0, 1);

  return suggestions;
}

/**
 * SymSpell.
 *
 * @constructor
 */
function SymSpell(options) {
  options = options || {};

  this.clear();

  // Properties
  this.maxDistance = typeof options.maxDistance === 'number' ?
    options.maxDistance :
    DEFAULT_MAX_DISTANCE;
  this.verbosity = typeof options.verbosity === 'number' ?
    options.verbosity :
    DEFAULT_VERBOSITY;

  // Sanity checks
  if (typeof this.maxDistance !== 'number' || this.maxDistance <= 0)
    throw Error('mnemonist/SymSpell.constructor: invalid `maxDistance` option. Should be a integer greater than 0.');

  if (!VERBOSITY.has(this.verbosity))
    throw Error('mnemonist/SymSpell.constructor: invalid `verbosity` option. Should be either 0, 1 or 2.');
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
SymSpell.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.dictionary = Object.create(null);
  this.maxLength = 0;
  this.words = [];
};

/**
 * Method used to add a word to the index.
 *
 * @param {string} word - Word to add.
 * @param {SymSpell}
 */
SymSpell.prototype.add = function(word) {
  var item = this.dictionary[word];

  if (item !== undefined) {
    if (typeof item === 'number') {
      item = createDictionaryItem(item);
      this.dictionary[word] = item;
    }

    item.count++;
  }

  else {
    item = createDictionaryItem();
    item.count++;

    this.dictionary[word] = item;

    if (word.length > this.maxLength)
      this.maxLength = word.length;
  }

  if (item.count === 1) {
    var number = this.words.length;
    this.words.push(word);

    var deletes = edits(word, 0, this.maxDistance);

    deletes.forEach(deletedItem => {
      var target = this.dictionary[deletedItem];

      if (target !== undefined) {
        if (typeof target === 'number') {
          target = createDictionaryItem(target);

          this.dictionary[deletedItem] = target;
        }

        if (!target.suggestions.has(number)) {
          addLowestDistance(
            this.words,
            this.verbosity,
            target,
            word,
            number,
            deletedItem
          );
        }
      }
      else {
        this.dictionary[deletedItem] = number;
      }
    });
  }

  this.size++;

  return this;
};

/**
 * Method used to search the index.
 *
 * @param  {string} input - Input query.
 * @return {array}        - The found suggestions.
 */
SymSpell.prototype.search = function(input) {
  return lookup(
    this.dictionary,
    this.words,
    this.verbosity,
    this.maxDistance,
    this.maxLength,
    input
  );
};

/**
 * Convenience known methods.
 */
SymSpell.prototype.inspect = function() {
  var array = [];

  array.size = this.size;
  array.maxDistance = this.maxDistance;
  array.verbosity = this.verbosity;
  array.behavior = VERBOSITY_EXPLANATIONS[this.verbosity];

  for (var k in this.dictionary) {
    if (typeof this.dictionary[k] === 'object' && this.dictionary[k].count)
      array.push([k, this.dictionary[k].count]);
  }

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: SymSpell,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  SymSpell.prototype[Symbol.for('nodejs.util.inspect.custom')] = SymSpell.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {SymSpell}
 */
SymSpell.from = function(iterable, options) {
  var index = new SymSpell(options);

  forEach(iterable, function(value) {
    index.add(value);
  });

  return index;
};

/**
 * Exporting.
 */
module.exports = SymSpell;


/***/ }),
/* 214 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Trie
 * ===============
 *
 * JavaScript Trie implementation based upon plain objects. As such this
 * structure is more a convenience building upon the trie's advantages than
 * a real performant alternative to already existing structures.
 *
 * Note that the Trie is based upon the TrieMap since the underlying machine
 * is the very same. The Trie just does not let you set values and only
 * considers the existence of the given prefixes.
 */
var forEach = __webpack_require__(168),
    TrieMap = __webpack_require__(215);

/**
 * Constants.
 */
var SENTINEL = String.fromCharCode(0);

/**
 * Trie.
 *
 * @constructor
 */
function Trie(Token) {
  this.mode = Token === Array ? 'array' : 'string';
  this.clear();
}

// Re-using TrieMap's prototype
for (var methodName in TrieMap.prototype)
  Trie.prototype[methodName] = TrieMap.prototype[methodName];

// Dropping irrelevant methods
delete Trie.prototype.set;
delete Trie.prototype.get;
delete Trie.prototype.values;
delete Trie.prototype.entries;

/**
 * Method used to add the given prefix to the trie.
 *
 * @param  {string|array} prefix - Prefix to follow.
 * @return {TrieMap}
 */
Trie.prototype.add = function(prefix) {
  var node = this.root,
      token;

  for (var i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];

    node = node[token] || (node[token] = {});
  }

  // Do we need to increase size?
  if (!(SENTINEL in node))
    this.size++;

  node[SENTINEL] = true;

  return this;
};

/**
 * Method used to retrieve every item in the trie with the given prefix.
 *
 * @param  {string|array} prefix - Prefix to query.
 * @return {array}
 */
Trie.prototype.find = function(prefix) {
  var isString = typeof prefix === 'string';

  var node = this.root,
      matches = [],
      token,
      i,
      l;

  for (i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    node = node[token];

    if (typeof node === 'undefined')
      return matches;
  }

  // Performing DFS from prefix
  var nodeStack = [node],
      prefixStack = [prefix],
      k;

  while (nodeStack.length) {
    prefix = prefixStack.pop();
    node = nodeStack.pop();

    for (k in node) {
      if (k === SENTINEL) {
        matches.push(prefix);
        continue;
      }

      nodeStack.push(node[k]);
      prefixStack.push(isString ? prefix + k : prefix.concat(k));
    }
  }

  return matches;
};

/**
 * Attaching the #.keys method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  Trie.prototype[Symbol.iterator] = Trie.prototype.keys;

/**
 * Convenience known methods.
 */
Trie.prototype.inspect = function() {
  var proxy = new Set();

  var iterator = this.keys(),
      step;

  while ((step = iterator.next(), !step.done))
    proxy.add(step.value);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: Trie,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  Trie.prototype[Symbol.for('nodejs.util.inspect.custom')] = Trie.prototype.inspect;

Trie.prototype.toJSON = function() {
  return this.root;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a trie.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @return {Trie}
 */
Trie.from = function(iterable) {
  var trie = new Trie();

  forEach(iterable, function(value) {
    trie.add(value);
  });

  return trie;
};

/**
 * Exporting.
 */
Trie.SENTINEL = SENTINEL;
module.exports = Trie;


/***/ }),
/* 215 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist TrieMap
 * ==================
 *
 * JavaScript TrieMap implementation based upon plain objects. As such this
 * structure is more a convenience building upon the trie's advantages than
 * a real performant alternative to already existing structures.
 *
 * Note that the Trie is based upon the TrieMap since the underlying machine
 * is the very same. The Trie just does not let you set values and only
 * considers the existence of the given prefixes.
 */
var forEach = __webpack_require__(168),
    Iterator = __webpack_require__(177);

/**
 * Constants.
 */
var SENTINEL = String.fromCharCode(0);

/**
 * TrieMap.
 *
 * @constructor
 */
function TrieMap(Token) {
  this.mode = Token === Array ? 'array' : 'string';
  this.clear();
}

/**
 * Method used to clear the trie.
 *
 * @return {undefined}
 */
TrieMap.prototype.clear = function() {

  // Properties
  this.root = {};
  this.size = 0;
};

/**
 * Method used to set the value of the given prefix in the trie.
 *
 * @param  {string|array} prefix - Prefix to follow.
 * @param  {any}          value  - Value for the prefix.
 * @return {TrieMap}
 */
TrieMap.prototype.set = function(prefix, value) {
  var node = this.root,
      token;

  for (var i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];

    node = node[token] || (node[token] = {});
  }

  // Do we need to increase size?
  if (!(SENTINEL in node))
    this.size++;

  node[SENTINEL] = value;

  return this;
};

/**
 * Method used to update the value of the given prefix in the trie.
 *
 * @param  {string|array} prefix - Prefix to follow.
 * @param  {(oldValue: any | undefined) => any} updateFunction - Update value visitor callback.
 * @return {TrieMap}
 */
TrieMap.prototype.update = function(prefix, updateFunction) {
  var node = this.root,
      token;

  for (var i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];

    node = node[token] || (node[token] = {});
  }

  // Do we need to increase size?
  if (!(SENTINEL in node))
    this.size++;

  node[SENTINEL] = updateFunction(node[SENTINEL]);

  return this;
};

/**
 * Method used to return the value sitting at the end of the given prefix or
 * undefined if none exist.
 *
 * @param  {string|array} prefix - Prefix to follow.
 * @return {any|undefined}
 */
TrieMap.prototype.get = function(prefix) {
  var node = this.root,
      token,
      i,
      l;

  for (i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    node = node[token];

    // Prefix does not exist
    if (typeof node === 'undefined')
      return;
  }

  if (!(SENTINEL in node))
    return;

  return node[SENTINEL];
};

/**
 * Method used to delete a prefix from the trie.
 *
 * @param  {string|array} prefix - Prefix to delete.
 * @return {boolean}
 */
TrieMap.prototype.delete = function(prefix) {
  var node = this.root,
      toPrune = null,
      tokenToPrune = null,
      parent,
      token,
      i,
      l;

  for (i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    parent = node;
    node = node[token];

    // Prefix does not exist
    if (typeof node === 'undefined')
      return false;

    // Keeping track of a potential branch to prune
    if (toPrune !== null) {
      if (Object.keys(node).length > 1) {
        toPrune = null;
        tokenToPrune = null;
      }
    }
    else {
      if (Object.keys(node).length < 2) {
        toPrune = parent;
        tokenToPrune = token;
      }
    }
  }

  if (!(SENTINEL in node))
    return false;

  this.size--;

  if (toPrune)
    delete toPrune[tokenToPrune];
  else
    delete node[SENTINEL];

  return true;
};

// TODO: add #.prune?

/**
 * Method used to assert whether the given prefix exists in the TrieMap.
 *
 * @param  {string|array} prefix - Prefix to check.
 * @return {boolean}
 */
TrieMap.prototype.has = function(prefix) {
  var node = this.root,
      token;

  for (var i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    node = node[token];

    if (typeof node === 'undefined')
      return false;
  }

  return SENTINEL in node;
};

/**
 * Method used to retrieve every item in the trie with the given prefix.
 *
 * @param  {string|array} prefix - Prefix to query.
 * @return {array}
 */
TrieMap.prototype.find = function(prefix) {
  var isString = typeof prefix === 'string';

  var node = this.root,
      matches = [],
      token,
      i,
      l;

  for (i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    node = node[token];

    if (typeof node === 'undefined')
      return matches;
  }

  // Performing DFS from prefix
  var nodeStack = [node],
      prefixStack = [prefix],
      k;

  while (nodeStack.length) {
    prefix = prefixStack.pop();
    node = nodeStack.pop();

    for (k in node) {
      if (k === SENTINEL) {
        matches.push([prefix, node[SENTINEL]]);
        continue;
      }

      nodeStack.push(node[k]);
      prefixStack.push(isString ? prefix + k : prefix.concat(k));
    }
  }

  return matches;
};

/**
 * Method returning an iterator over the trie's values.
 *
 * @param  {string|array} [prefix] - Optional starting prefix.
 * @return {Iterator}
 */
TrieMap.prototype.values = function(prefix) {
  var node = this.root,
      nodeStack = [],
      token,
      i,
      l;

  // Resolving initial prefix
  if (prefix) {
    for (i = 0, l = prefix.length; i < l; i++) {
      token = prefix[i];
      node = node[token];

      // If the prefix does not exist, we return an empty iterator
      if (typeof node === 'undefined')
        return Iterator.empty();
    }
  }

  nodeStack.push(node);

  return new Iterator(function() {
    var currentNode,
        hasValue = false,
        k;

    while (nodeStack.length) {
      currentNode = nodeStack.pop();

      for (k in currentNode) {
        if (k === SENTINEL) {
          hasValue = true;
          continue;
        }

        nodeStack.push(currentNode[k]);
      }

      if (hasValue)
        return {done: false, value: currentNode[SENTINEL]};
    }

    return {done: true};
  });
};

/**
 * Method returning an iterator over the trie's prefixes.
 *
 * @param  {string|array} [prefix] - Optional starting prefix.
 * @return {Iterator}
 */
TrieMap.prototype.prefixes = function(prefix) {
  var node = this.root,
      nodeStack = [],
      prefixStack = [],
      token,
      i,
      l;

  var isString = this.mode === 'string';

  // Resolving initial prefix
  if (prefix) {
    for (i = 0, l = prefix.length; i < l; i++) {
      token = prefix[i];
      node = node[token];

      // If the prefix does not exist, we return an empty iterator
      if (typeof node === 'undefined')
        return Iterator.empty();
    }
  }
  else {
    prefix = isString ? '' : [];
  }

  nodeStack.push(node);
  prefixStack.push(prefix);

  return new Iterator(function() {
    var currentNode,
        currentPrefix,
        hasValue = false,
        k;

    while (nodeStack.length) {
      currentNode = nodeStack.pop();
      currentPrefix = prefixStack.pop();

      for (k in currentNode) {
        if (k === SENTINEL) {
          hasValue = true;
          continue;
        }

        nodeStack.push(currentNode[k]);
        prefixStack.push(isString ? currentPrefix + k : currentPrefix.concat(k));
      }

      if (hasValue)
        return {done: false, value: currentPrefix};
    }

    return {done: true};
  });
};
TrieMap.prototype.keys = TrieMap.prototype.prefixes;

/**
 * Method returning an iterator over the trie's entries.
 *
 * @param  {string|array} [prefix] - Optional starting prefix.
 * @return {Iterator}
 */
TrieMap.prototype.entries = function(prefix) {
  var node = this.root,
      nodeStack = [],
      prefixStack = [],
      token,
      i,
      l;

  var isString = this.mode === 'string';

  // Resolving initial prefix
  if (prefix) {
    for (i = 0, l = prefix.length; i < l; i++) {
      token = prefix[i];
      node = node[token];

      // If the prefix does not exist, we return an empty iterator
      if (typeof node === 'undefined')
        return Iterator.empty();
    }
  }
  else {
    prefix = isString ? '' : [];
  }

  nodeStack.push(node);
  prefixStack.push(prefix);

  return new Iterator(function() {
    var currentNode,
        currentPrefix,
        hasValue = false,
        k;

    while (nodeStack.length) {
      currentNode = nodeStack.pop();
      currentPrefix = prefixStack.pop();

      for (k in currentNode) {
        if (k === SENTINEL) {
          hasValue = true;
          continue;
        }

        nodeStack.push(currentNode[k]);
        prefixStack.push(isString ? currentPrefix + k : currentPrefix.concat(k));
      }

      if (hasValue)
        return {done: false, value: [currentPrefix, currentNode[SENTINEL]]};
    }

    return {done: true};
  });
};

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  TrieMap.prototype[Symbol.iterator] = TrieMap.prototype.entries;

/**
 * Convenience known methods.
 */
TrieMap.prototype.inspect = function() {
  var proxy = new Array(this.size);

  var iterator = this.entries(),
      step,
      i = 0;

  while ((step = iterator.next(), !step.done))
    proxy[i++] = step.value;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: TrieMap,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  TrieMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = TrieMap.prototype.inspect;

TrieMap.prototype.toJSON = function() {
  return this.root;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a trie.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @return {TrieMap}
 */
TrieMap.from = function(iterable) {
  var trie = new TrieMap();

  forEach(iterable, function(value, key) {
    trie.set(key, value);
  });

  return trie;
};

/**
 * Exporting.
 */
TrieMap.SENTINEL = SENTINEL;
module.exports = TrieMap;


/***/ }),
/* 216 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Vector
 * =================
 *
 * Abstract implementation of a growing array that can be used with JavaScript
 * typed arrays and other array-like structures.
 *
 * Note: should try and use ArrayBuffer.transfer when it will be available.
 */
var Iterator = __webpack_require__(177),
    forEach = __webpack_require__(168),
    iterables = __webpack_require__(171),
    typed = __webpack_require__(172);

/**
 * Defaults.
 */
var DEFAULT_GROWING_POLICY = function(currentCapacity) {
  return Math.max(1, Math.ceil(currentCapacity * 1.5));
};

var pointerArrayFactory = function(capacity) {
  var PointerArray = typed.getPointerArray(capacity);

  return new PointerArray(capacity);
};

/**
 * Vector.
 *
 * @constructor
 * @param {function}      ArrayClass             - An array constructor.
 * @param {number|object} initialCapacityOrOptions - Self-explanatory:
 * @param {number}        initialCapacity          - Initial capacity.
 * @param {number}        initialLength            - Initial length.
 * @param {function}      policy                   - Allocation policy.
 */
function Vector(ArrayClass, initialCapacityOrOptions) {
  if (arguments.length < 1)
    throw new Error('mnemonist/vector: expecting at least a byte array constructor.');

  var initialCapacity = initialCapacityOrOptions || 0,
      policy = DEFAULT_GROWING_POLICY,
      initialLength = 0,
      factory = false;

  if (typeof initialCapacityOrOptions === 'object') {
    initialCapacity = initialCapacityOrOptions.initialCapacity || 0;
    initialLength = initialCapacityOrOptions.initialLength || 0;
    policy = initialCapacityOrOptions.policy || policy;
    factory = initialCapacityOrOptions.factory === true;
  }

  this.factory = factory ? ArrayClass : null;
  this.ArrayClass = ArrayClass;
  this.length = initialLength;
  this.capacity = Math.max(initialLength, initialCapacity);
  this.policy = policy;
  this.array = new ArrayClass(this.capacity);
}

/**
 * Method used to set a value.
 *
 * @param  {number} index - Index to edit.
 * @param  {any}    value - Value.
 * @return {Vector}
 */
Vector.prototype.set = function(index, value) {

  // Out of bounds?
  if (this.length < index)
    throw new Error('Vector(' + this.ArrayClass.name + ').set: index out of bounds.');

  // Updating value
  this.array[index] = value;

  return this;
};

/**
 * Method used to get a value.
 *
 * @param  {number} index - Index to retrieve.
 * @return {any}
 */
Vector.prototype.get = function(index) {
  if (this.length < index)
    return undefined;

  return this.array[index];
};

/**
 * Method used to apply the growing policy.
 *
 * @param  {number} [override] - Override capacity.
 * @return {number}
 */
Vector.prototype.applyPolicy = function(override) {
  var newCapacity = this.policy(override || this.capacity);

  if (typeof newCapacity !== 'number' || newCapacity < 0)
    throw new Error('mnemonist/vector.applyPolicy: policy returned an invalid value (expecting a positive integer).');

  if (newCapacity <= this.capacity)
    throw new Error('mnemonist/vector.applyPolicy: policy returned a less or equal capacity to allocate.');

  // TODO: we should probably check that the returned number is an integer
  return newCapacity;
};

/**
 * Method used to reallocate the underlying array.
 *
 * @param  {number}       capacity - Target capacity.
 * @return {Vector}
 */
Vector.prototype.reallocate = function(capacity) {
  if (capacity === this.capacity)
    return this;

  var oldArray = this.array;

  if (capacity < this.length)
    this.length = capacity;

  if (capacity > this.capacity) {
    if (this.factory === null)
      this.array = new this.ArrayClass(capacity);
    else
      this.array = this.factory(capacity);

    if (typed.isTypedArray(this.array)) {
      this.array.set(oldArray, 0);
    }
    else {
      for (var i = 0, l = this.length; i < l; i++)
        this.array[i] = oldArray[i];
    }
  }
  else {
    this.array = oldArray.slice(0, capacity);
  }

  this.capacity = capacity;

  return this;
};

/**
 * Method used to grow the array.
 *
 * @param  {number}       [capacity] - Optional capacity to match.
 * @return {Vector}
 */
Vector.prototype.grow = function(capacity) {
  var newCapacity;

  if (typeof capacity === 'number') {

    if (this.capacity >= capacity)
      return this;

    // We need to match the given capacity
    newCapacity = this.capacity;

    while (newCapacity < capacity)
      newCapacity = this.applyPolicy(newCapacity);

    this.reallocate(newCapacity);

    return this;
  }

  // We need to run the policy once
  newCapacity = this.applyPolicy();
  this.reallocate(newCapacity);

  return this;
};

/**
 * Method used to resize the array. Won't deallocate.
 *
 * @param  {number}       length - Target length.
 * @return {Vector}
 */
Vector.prototype.resize = function(length) {
  if (length === this.length)
    return this;

  if (length < this.length) {
    this.length = length;
    return this;
  }

  this.length = length;
  this.reallocate(length);

  return this;
};

/**
 * Method used to push a value into the array.
 *
 * @param  {any}    value - Value to push.
 * @return {number}       - Length of the array.
 */
Vector.prototype.push = function(value) {
  if (this.capacity === this.length)
    this.grow();

  this.array[this.length++] = value;

  return this.length;
};

/**
 * Method used to pop the last value of the array.
 *
 * @return {number} - The popped value.
 */
Vector.prototype.pop = function() {
  if (this.length === 0)
    return;

  return this.array[--this.length];
};

/**
 * Method used to create an iterator over a vector's values.
 *
 * @return {Iterator}
 */
Vector.prototype.values = function() {
  var items = this.array,
      l = this.length,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

    var value = items[i];
    i++;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over a vector's entries.
 *
 * @return {Iterator}
 */
Vector.prototype.entries = function() {
  var items = this.array,
      l = this.length,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

    var value = items[i];

    return {
      value: [i++, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  Vector.prototype[Symbol.iterator] = Vector.prototype.values;

/**
 * Convenience known methods.
 */
Vector.prototype.inspect = function() {
  var proxy = this.array.slice(0, this.length);

  proxy.type = this.array.constructor.name;
  proxy.items = this.length;
  proxy.capacity = this.capacity;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: Vector,
    enumerable: false
  });

  return proxy;
};

if (typeof Symbol !== 'undefined')
  Vector.prototype[Symbol.for('nodejs.util.inspect.custom')] = Vector.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a vector.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {function} ArrayClass - Byte array class.
 * @param  {number}   capacity   - Desired capacity.
 * @return {Vector}
 */
Vector.from = function(iterable, ArrayClass, capacity) {

  if (arguments.length < 3) {

    // Attempting to guess the needed capacity
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/vector.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }

  var vector = new Vector(ArrayClass, capacity);

  forEach(iterable, function(value) {
    vector.push(value);
  });

  return vector;
};

/**
 * Exporting.
 */
function subClass(ArrayClass) {
  var SubClass = function(initialCapacityOrOptions) {
    Vector.call(this, ArrayClass, initialCapacityOrOptions);
  };

  for (var k in Vector.prototype) {
    if (Vector.prototype.hasOwnProperty(k))
      SubClass.prototype[k] = Vector.prototype[k];
  }

  SubClass.from = function(iterable, capacity) {
    return Vector.from(iterable, ArrayClass, capacity);
  };

  if (typeof Symbol !== 'undefined')
    SubClass.prototype[Symbol.iterator] = SubClass.prototype.values;

  return SubClass;
}

Vector.Int8Vector = subClass(Int8Array);
Vector.Uint8Vector = subClass(Uint8Array);
Vector.Uint8ClampedVector = subClass(Uint8ClampedArray);
Vector.Int16Vector = subClass(Int16Array);
Vector.Uint16Vector = subClass(Uint16Array);
Vector.Int32Vector = subClass(Int32Array);
Vector.Uint32Vector = subClass(Uint32Array);
Vector.Float32Vector = subClass(Float32Array);
Vector.Float64Vector = subClass(Float64Array);
Vector.PointerVector = subClass(pointerArrayFactory);

module.exports = Vector;


/***/ }),
/* 217 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Mnemonist Vantage Point Tree
 * =============================
 *
 * JavaScript implementation of the Vantage Point Tree storing the binary
 * tree as a flat byte array.
 *
 * Note that a VPTree has worst cases and is likely not to be perfectly
 * balanced because of median ambiguity. It is therefore not suitable
 * for hairballs and tiny datasets.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Vantage-point_tree
 */
var iterables = __webpack_require__(171),
    typed = __webpack_require__(172),
    inplaceQuickSortIndices = (__webpack_require__(199).inplaceQuickSortIndices),
    lowerBoundIndices = (__webpack_require__(197).lowerBoundIndices),
    Heap = __webpack_require__(167);

var getPointerArray = typed.getPointerArray;

// TODO: implement vantage point selection techniques (by swapping with last)
// TODO: is this required to implement early termination for k <= size?

/**
 * Heap comparator used by the #.nearestNeighbors method.
 */
function comparator(a, b) {
  if (a.distance < b.distance)
    return 1;

  if (a.distance > b.distance)
    return -1;

  return 0;
}

/**
 * Function used to create the binary tree.
 *
 * @param  {function}     distance - Distance function to use.
 * @param  {array}        items    - Items to index (will be mutated).
 * @param  {array}        indices  - Indexes of the items.
 * @return {Float64Array}          - The flat binary tree.
 */
function createBinaryTree(distance, items, indices) {
  var N = indices.length;

  var PointerArray = getPointerArray(N);

  var C = 0,
      nodes = new PointerArray(N),
      lefts = new PointerArray(N),
      rights = new PointerArray(N),
      mus = new Float64Array(N),
      stack = [0, 0, N],
      distances = new Float64Array(N),
      nodeIndex,
      vantagePoint,
      medianIndex,
      lo,
      hi,
      mid,
      mu,
      i,
      l;

  while (stack.length) {
    hi = stack.pop();
    lo = stack.pop();
    nodeIndex = stack.pop();

    // Getting our vantage point
    vantagePoint = indices[hi - 1];
    hi--;

    l = hi - lo;

    // Storing vantage point
    nodes[nodeIndex] = vantagePoint;

    // We are in a leaf
    if (l === 0)
      continue;

    // We only have two elements, the second one has to go right
    if (l === 1) {

      // We put remaining item to the right
      mu = distance(items[vantagePoint], items[indices[lo]]);

      mus[nodeIndex] = mu;

      // Right
      C++;
      rights[nodeIndex] = C;
      nodes[C] = indices[lo];

      continue;
    }

    // Computing distance from vantage point to other points
    for (i = lo; i < hi; i++)
      distances[indices[i]] = distance(items[vantagePoint], items[indices[i]]);

    inplaceQuickSortIndices(distances, indices, lo, hi);

    // Finding median of distances
    medianIndex = lo + (l / 2) - 1;

    // Need to interpolate?
    if (medianIndex === (medianIndex | 0)) {
      mu = (
        distances[indices[medianIndex]] +
        distances[indices[medianIndex + 1]]
      ) / 2;
    }
    else {
      mu = distances[indices[Math.ceil(medianIndex)]];
    }

    // Storing mu
    mus[nodeIndex] = mu;

    mid = lowerBoundIndices(distances, indices, mu, lo, hi);

    // console.log('Vantage point', items[vantagePoint], vantagePoint);
    // console.log('mu =', mu);
    // console.log('lo =', lo);
    // console.log('hi =', hi);
    // console.log('mid =', mid);

    // console.log('need to split', Array.from(indices).slice(lo, hi).map(i => {
    //   return [distances[i], distance(items[vantagePoint], items[i]), items[i]];
    // }));

    // Right
    if (hi - mid > 0) {
      C++;
      rights[nodeIndex] = C;
      stack.push(C, mid, hi);
      // console.log('Went right with ', Array.from(indices).slice(mid, hi).map(i => {
      //   return [distances[i], distance(items[vantagePoint], items[i]), items[i]];
      // }));
    }

    // Left
    if (mid - lo > 0) {
      C++;
      lefts[nodeIndex] = C;
      stack.push(C, lo, mid);
      // console.log('Went left with', Array.from(indices).slice(lo, mid).map(i => {
      //   return [distances[i], distance(items[vantagePoint], items[i]), items[i]];
      // }));
    }

    // console.log();
  }

  return {
    nodes: nodes,
    lefts: lefts,
    rights: rights,
    mus: mus
  };
}

/**
 * VPTree.
 *
 * @constructor
 * @param {function} distance - Distance function to use.
 * @param {Iterable} items    - Items to store.
 */
function VPTree(distance, items) {
  if (typeof distance !== 'function')
    throw new Error('mnemonist/VPTree.constructor: given `distance` must be a function.');

  if (!items)
    throw new Error('mnemonist/VPTree.constructor: you must provide items to the tree. A VPTree cannot be updated after its creation.');

  // Properties
  this.distance = distance;
  this.heap = new Heap(comparator);
  this.D = 0;

  var arrays = iterables.toArrayWithIndices(items);
  this.items = arrays[0];
  var indices = arrays[1];

  // Creating the binary tree
  this.size = indices.length;

  var result = createBinaryTree(distance, this.items, indices);

  this.nodes = result.nodes;
  this.lefts = result.lefts;
  this.rights = result.rights;
  this.mus = result.mus;
}

/**
 * Function used to retrieve the k nearest neighbors of the query.
 *
 * @param  {number} k     - Number of neighbors to retrieve.
 * @param  {any}    query - The query.
 * @return {array}
 */
VPTree.prototype.nearestNeighbors = function(k, query) {
  var neighbors = this.heap,
      stack = [0],
      tau = Infinity,
      nodeIndex,
      itemIndex,
      vantagePoint,
      leftIndex,
      rightIndex,
      mu,
      d;

  this.D = 0;

  while (stack.length) {
    nodeIndex = stack.pop();
    itemIndex = this.nodes[nodeIndex];
    vantagePoint = this.items[itemIndex];

    // Distance between query & the current vantage point
    d = this.distance(vantagePoint, query);
    this.D++;

    if (d < tau) {
      neighbors.push({distance: d, item: vantagePoint});

      // Trimming
      if (neighbors.size > k)
        neighbors.pop();

      // Adjusting tau (only if we already have k items, else it stays Infinity)
      if (neighbors.size >= k)
       tau = neighbors.peek().distance;
    }

    leftIndex = this.lefts[nodeIndex];
    rightIndex = this.rights[nodeIndex];

    // We are a leaf
    if (!leftIndex && !rightIndex)
      continue;

    mu = this.mus[nodeIndex];

    if (d < mu) {
      if (leftIndex && d < mu + tau)
        stack.push(leftIndex);
      if (rightIndex && d >= mu - tau) // Might not be necessary to test d
        stack.push(rightIndex);
    }
    else {
      if (rightIndex && d >= mu - tau)
        stack.push(rightIndex);
      if (leftIndex && d < mu + tau) // Might not be necessary to test d
        stack.push(leftIndex);
    }
  }

  var array = new Array(neighbors.size);

  for (var i = neighbors.size - 1; i >= 0; i--)
    array[i] = neighbors.pop();

  return array;
};

/**
 * Function used to retrieve every neighbors of query in the given radius.
 *
 * @param  {number} radius - Radius.
 * @param  {any}    query  - The query.
 * @return {array}
 */
VPTree.prototype.neighbors = function(radius, query) {
  var neighbors = [],
      stack = [0],
      nodeIndex,
      itemIndex,
      vantagePoint,
      leftIndex,
      rightIndex,
      mu,
      d;

  this.D = 0;

  while (stack.length) {
    nodeIndex = stack.pop();
    itemIndex = this.nodes[nodeIndex];
    vantagePoint = this.items[itemIndex];

    // Distance between query & the current vantage point
    d = this.distance(vantagePoint, query);
    this.D++;

    if (d <= radius)
      neighbors.push({distance: d, item: vantagePoint});

    leftIndex = this.lefts[nodeIndex];
    rightIndex = this.rights[nodeIndex];

    // We are a leaf
    if (!leftIndex && !rightIndex)
      continue;

    mu = this.mus[nodeIndex];

    if (d < mu) {
      if (leftIndex && d < mu + radius)
        stack.push(leftIndex);
      if (rightIndex && d >= mu - radius) // Might not be necessary to test d
        stack.push(rightIndex);
    }
    else {
      if (rightIndex && d >= mu - radius)
        stack.push(rightIndex);
      if (leftIndex && d < mu + radius) // Might not be necessary to test d
        stack.push(leftIndex);
    }
  }

  return neighbors;
};

/**
 * Convenience known methods.
 */
VPTree.prototype.inspect = function() {
  var array = this.items.slice();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: VPTree,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  VPTree.prototype[Symbol.for('nodejs.util.inspect.custom')] = VPTree.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a tree.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} distance - Distance function to use.
 * @return {VPTree}
 */
VPTree.from = function(iterable, distance) {
  return new VPTree(distance, iterable);
};

/**
 * Exporting.
 */
module.exports = VPTree;


/***/ }),
/* 218 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fp = __webpack_require__(164)
const Middie = __webpack_require__(219)
const kMiddlewares = Symbol('fastify-middie-middlewares')
const kMiddie = Symbol('fastify-middie-instance')

function middiePlugin (fastify, options, next) {
  fastify.decorate('use', use)
  fastify[kMiddlewares] = []
  fastify[kMiddie] = Middie(onMiddieEnd)

  fastify
    .addHook(options.hook || 'onRequest', runMiddie)
    .addHook('onRegister', onRegister)

  function use (path, fn) {
    if (typeof path === 'string') {
      const prefix = this.prefix
      path = prefix + (path === '/' && prefix.length > 0 ? '' : path)
    }
    this[kMiddlewares].push([path, fn])
    if (fn == null) {
      this[kMiddie].use(path)
    } else {
      this[kMiddie].use(path, fn)
    }
    return this
  }

  function runMiddie (req, reply, next) {
    if (this[kMiddlewares].length > 0) {
      req.raw.originalUrl = req.raw.url
      req.raw.id = req.id
      req.raw.hostname = req.hostname
      req.raw.ip = req.ip
      req.raw.ips = req.ips
      req.raw.log = req.log
      req.raw.body = req.body
      req.raw.query = req.query
      reply.raw.log = req.log
      this[kMiddie].run(req.raw, reply.raw, next)
    } else {
      next()
    }
  }

  function onMiddieEnd (err, req, res, next) {
    next(err)
  }

  function onRegister (instance) {
    const middlewares = instance[kMiddlewares].slice()
    instance[kMiddlewares] = []
    instance[kMiddie] = Middie(onMiddieEnd)
    instance.decorate('use', use)
    for (const middleware of middlewares) {
      instance.use(...middleware)
    }
  }

  next()
}

module.exports = fp(middiePlugin, {
  fastify: '4.x',
  name: 'middie'
})


/***/ }),
/* 219 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const reusify = __webpack_require__(220)
const { pathToRegexp } = __webpack_require__(221)

function middie (complete) {
  const middlewares = []
  const pool = reusify(Holder)

  return {
    use,
    run
  }

  function use (url, f) {
    if (f === undefined) {
      f = url
      url = null
    }

    let regexp
    if (url) {
      regexp = pathToRegexp(sanitizePrefixUrl(url), [], {
        end: false,
        strict: false
      })
    }

    if (Array.isArray(f)) {
      for (const val of f) {
        middlewares.push({
          regexp,
          fn: val
        })
      }
    } else {
      middlewares.push({
        regexp,
        fn: f
      })
    }

    return this
  }

  function run (req, res, ctx) {
    if (!middlewares.length) {
      complete(null, req, res, ctx)
      return
    }

    req.originalUrl = req.url

    const holder = pool.get()
    holder.req = req
    holder.res = res
    holder.url = sanitizeUrl(req.url)
    holder.context = ctx
    holder.done()
  }

  function Holder () {
    this.next = null
    this.req = null
    this.res = null
    this.url = null
    this.context = null
    this.i = 0

    const that = this
    this.done = function (err) {
      const req = that.req
      const res = that.res
      const url = that.url
      const context = that.context
      const i = that.i++

      req.url = req.originalUrl

      if (res.finished === true || res.writableEnded === true) {
        that.req = null
        that.res = null
        that.context = null
        that.i = 0
        pool.release(that)
        return
      }

      if (err || middlewares.length === i) {
        complete(err, req, res, context)
        that.req = null
        that.res = null
        that.context = null
        that.i = 0
        pool.release(that)
      } else {
        const middleware = middlewares[i]
        const fn = middleware.fn
        const regexp = middleware.regexp
        if (regexp) {
          const result = regexp.exec(url)
          if (result) {
            req.url = req.url.replace(result[0], '')
            if (req.url.startsWith('/') === false) {
              req.url = '/' + req.url
            }
            fn(req, res, that.done)
          } else {
            that.done()
          }
        } else {
          fn(req, res, that.done)
        }
      }
    }
  }
}

function sanitizeUrl (url) {
  /* eslint-disable-next-line no-var */
  for (var i = 0, len = url.length; i < len; i++) {
    const charCode = url.charCodeAt(i)
    if (charCode === 63 || charCode === 35) {
      return url.slice(0, i)
    }
  }
  return url
}

function sanitizePrefixUrl (url) {
  if (url === '') return url
  if (url === '/') return ''
  if (url[url.length - 1] === '/') return url.slice(0, -1)
  return url
}

module.exports = middie


/***/ }),
/* 220 */
/***/ ((module) => {

"use strict";
module.exports = require("reusify");

/***/ }),
/* 221 */
/***/ ((module) => {

"use strict";
module.exports = require("path-to-regexp");

/***/ }),
/* 222 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(11);
tslib_1.__exportStar(__webpack_require__(223), exports);


/***/ }),
/* 223 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ })
];
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("6b8a2d0716f3ce648b84")
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/node module decorator */
/******/ (() => {
/******/ 	__webpack_require__.nmd = (module) => {
/******/ 		module.paths = [];
/******/ 		if (!module.children) module.children = [];
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/******/ }
;