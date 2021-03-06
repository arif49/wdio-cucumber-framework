'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _cucumber = require('cucumber');

var _cucumber2 = _interopRequireDefault(_cucumber);

var _wdioSync = require('wdio-sync');

var _reporter = require('./reporter');

var _reporter2 = _interopRequireDefault(_reporter);

var _hookRunner = require('./hookRunner');

var _hookRunner2 = _interopRequireDefault(_hookRunner);

var __$Getters__ = [];
var __$Setters__ = [];
var __$Resetters__ = [];

function __GetDependency__(name) {
    return __$Getters__[name]();
}

function __Rewire__(name, value) {
    __$Setters__[name](value);
}

function __ResetDependency__(name) {
    __$Resetters__[name]();
}

var __RewireAPI__ = {
    '__GetDependency__': __GetDependency__,
    '__get__': __GetDependency__,
    '__Rewire__': __Rewire__,
    '__set__': __Rewire__,
    '__ResetDependency__': __ResetDependency__
};
var Cucumber = _cucumber2['default'];

__$Getters__['Cucumber'] = function () {
    return Cucumber;
};

__$Setters__['Cucumber'] = function (value) {
    Cucumber = value;
};

__$Resetters__['Cucumber'] = function () {
    Cucumber = _cucumber2['default'];
};

var wrapCommands = _wdioSync.wrapCommands;
var executeHooksWithArgs = _wdioSync.executeHooksWithArgs;
var executeSync = _wdioSync.executeSync;
var executeAsync = _wdioSync.executeAsync;

__$Getters__['wrapCommands'] = function () {
    return wrapCommands;
};

__$Setters__['wrapCommands'] = function (value) {
    wrapCommands = value;
};

__$Resetters__['wrapCommands'] = function () {
    wrapCommands = _wdioSync.wrapCommands;
};

__$Getters__['executeHooksWithArgs'] = function () {
    return executeHooksWithArgs;
};

__$Setters__['executeHooksWithArgs'] = function (value) {
    executeHooksWithArgs = value;
};

__$Resetters__['executeHooksWithArgs'] = function () {
    executeHooksWithArgs = _wdioSync.executeHooksWithArgs;
};

__$Getters__['executeSync'] = function () {
    return executeSync;
};

__$Setters__['executeSync'] = function (value) {
    executeSync = value;
};

__$Resetters__['executeSync'] = function () {
    executeSync = _wdioSync.executeSync;
};

__$Getters__['executeAsync'] = function () {
    return executeAsync;
};

__$Setters__['executeAsync'] = function (value) {
    executeAsync = value;
};

__$Resetters__['executeAsync'] = function () {
    executeAsync = _wdioSync.executeAsync;
};

var CucumberReporter = _reporter2['default'];

__$Getters__['CucumberReporter'] = function () {
    return CucumberReporter;
};

__$Setters__['CucumberReporter'] = function (value) {
    CucumberReporter = value;
};

__$Resetters__['CucumberReporter'] = function () {
    CucumberReporter = _reporter2['default'];
};

var HookRunner = _hookRunner2['default'];

__$Getters__['HookRunner'] = function () {
    return HookRunner;
};

__$Setters__['HookRunner'] = function (value) {
    HookRunner = value;
};

__$Resetters__['HookRunner'] = function () {
    HookRunner = _hookRunner2['default'];
};

var DEFAULT_TIMEOUT = 30000;
var _DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

__$Getters__['DEFAULT_TIMEOUT'] = function () {
    return DEFAULT_TIMEOUT;
};

__$Setters__['DEFAULT_TIMEOUT'] = function (value) {
    DEFAULT_TIMEOUT = value;
};

__$Resetters__['DEFAULT_TIMEOUT'] = function () {
    DEFAULT_TIMEOUT = _DEFAULT_TIMEOUT;
};

var DEFAULT_FORMAT = 'pretty';
var _DEFAULT_FORMAT = DEFAULT_FORMAT;

__$Getters__['DEFAULT_FORMAT'] = function () {
    return DEFAULT_FORMAT;
};

__$Setters__['DEFAULT_FORMAT'] = function (value) {
    DEFAULT_FORMAT = value;
};

__$Resetters__['DEFAULT_FORMAT'] = function () {
    DEFAULT_FORMAT = _DEFAULT_FORMAT;
};

var DEFAULT_OPTS = {
    backtrace: false, // <boolean> show full backtrace for errors
    compiler: [], // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    dryRun: false, // <boolean> invoke formatters without executing steps
    failFast: false, // <boolean> abort the run on first failure
    format: [DEFAULT_FORMAT], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    name: [], // <REGEXP[]> only execute the scenarios with name matching the expression (repeatable)
    colors: true, // <boolean> disable colors in formatter output
    snippets: true, // <boolean> hide step definition snippets for pending steps
    source: true, // <boolean> hide source uris
    profile: [], // <string> (name) specify the profile to use
    require: [], // <string> (file/dir) require files before executing features
    snippetSyntax: undefined, // <string> specify a custom snippet syntax
    strict: false, // <boolean> fail if there are any undefined or pending steps
    tags: [], // <string[]> (expression) only execute the features or scenarios with tags matching the expression
    timeout: DEFAULT_TIMEOUT // <number> timeout for step definitions in milliseconds
};

/**
 * Cucumber runner
 */
var _DEFAULT_OPTS = DEFAULT_OPTS;

__$Getters__['DEFAULT_OPTS'] = function () {
    return DEFAULT_OPTS;
};

__$Setters__['DEFAULT_OPTS'] = function (value) {
    DEFAULT_OPTS = value;
};

__$Resetters__['DEFAULT_OPTS'] = function () {
    DEFAULT_OPTS = _DEFAULT_OPTS;
};

var CucumberAdapter = (function () {
    function CucumberAdapter(cid, config, specs, capabilities) {
        _classCallCheck(this, CucumberAdapter);

        this.cid = cid;
        this.config = config;
        this.specs = specs;
        this.capabilities = capabilities;

        this.cucumberOpts = _Object$assign(DEFAULT_OPTS, config.cucumberOpts);

        this.origStepDefinition = Cucumber.SupportCode.StepDefinition;
        this.origLibrary = Cucumber.SupportCode.Library;
    }

    _createClass(CucumberAdapter, [{
        key: 'run',
        value: function run() {
            var reporterOptions, cucumberConf, runtime, reporter, hookRunner, result;
            return _regeneratorRuntime.async(function run$(context$2$0) {
                var _this = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        reporterOptions = {
                            capabilities: this.capabilities,
                            ignoreUndefinedDefinitions: Boolean(this.cucumberOpts.ignoreUndefinedDefinitions),
                            failAmbiguousDefinitions: Boolean(this.cucumberOpts.failAmbiguousDefinitions)
                        };

                        wrapCommands(global.browser, this.config.beforeCommand, this.config.afterCommand);

                        cucumberConf = Cucumber.Cli.Configuration(this.cucumberOpts, this.specs);
                        runtime = Cucumber.Runtime(cucumberConf);

                        Cucumber.SupportCode.StepDefinition = this.getStepDefinition();
                        Cucumber.SupportCode.Library = this.getLibrary();

                        reporter = new CucumberReporter(Cucumber.Listener(), reporterOptions, this.cid, this.specs);

                        runtime.attachListener(reporter.getListener());

                        hookRunner = new HookRunner(Cucumber.Listener(), this.config);

                        runtime.attachListener(hookRunner.getListener());

                        context$2$0.next = 12;
                        return _regeneratorRuntime.awrap(executeHooksWithArgs(this.config.before, [this.capabilities, this.specs]));

                    case 12:
                        context$2$0.next = 14;
                        return _regeneratorRuntime.awrap(new _Promise(function (resolve) {
                            runtime.start(function () {
                                resolve(reporter.failedCount);
                                Cucumber.SupportCode.StepDefinition = _this.origStepDefinition;
                                Cucumber.SupportCode.Library = _this.origLibrary;
                            });
                        }));

                    case 14:
                        result = context$2$0.sent;
                        context$2$0.next = 17;
                        return _regeneratorRuntime.awrap(executeHooksWithArgs(this.config.after, [result, this.capabilities, this.specs]));

                    case 17:
                        return context$2$0.abrupt('return', result);

                    case 18:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        /**
         * overwrites Cucumbers StepDefinition class to wrap step definiton code block in order
         * to enable retry and synchronous code execution using wdio-syncs fiber helpers
         */
    }, {
        key: 'getStepDefinition',
        value: function getStepDefinition() {
            var _this2 = this;

            var origStepDefinition = this.origStepDefinition;

            return function (pattern, options, code, uri, line) {
                var retryTest = isFinite(options.retry) ? parseInt(options.retry, 10) : 0;
                var wrappedCode = code.name === 'async' || _this2.config.sync === false ? _this2.wrapStepAsync(code, retryTest) : _this2.wrapStepSync(code, retryTest);

                var stepDefinition = origStepDefinition(pattern, options, wrappedCode, uri, line);
                stepDefinition.validCodeLengths = function () {
                    return [0];
                };
                return stepDefinition;
            };
        }

        /**
         * overwrites Cucumbers Library class to set default timeout for cucumber steps and hooks
         */
    }, {
        key: 'getLibrary',
        value: function getLibrary() {
            var _this3 = this;

            var origLibrary = this.origLibrary;

            return function (supportCodeDefinition) {
                var library = origLibrary(supportCodeDefinition);
                library.setDefaultTimeout(_this3.cucumberOpts.timeout);
                return library;
            };
        }

        /**
         * wrap step definition to enable retry ability
         * @param  {Function} code       step definitoon
         * @param  {Number}   retryTest  amount of allowed repeats is case of a failure
         * @return {Function}            wrapped step definiton for sync WebdriverIO code
         */
    }, {
        key: 'wrapStepSync',
        value: function wrapStepSync(code) {
            var retryTest = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            return function () {
                var _this4 = this;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return new _Promise(function (resolve, reject) {
                    return global.wdioSync(executeSync.bind(_this4, code, retryTest, args), function (resultPromise) {
                        return resultPromise.then(resolve, reject);
                    }).apply(_this4);
                });
            };
        }

        /**
         * wrap step definition to enable retry ability
         * @param  {Function} code       step definitoon
         * @param  {Number}   retryTest  amount of allowed repeats is case of a failure
         * @return {Function}            wrapped step definiton for async WebdriverIO code
         */
    }, {
        key: 'wrapStepAsync',
        value: function wrapStepAsync(code) {
            var retryTest = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            return function () {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                return executeAsync.call(this, code, retryTest, args);
            };
        }
    }]);

    return CucumberAdapter;
})();

var _CucumberAdapter = CucumberAdapter;
var _CucumberAdapter2 = _CucumberAdapter;

__$Getters__['_CucumberAdapter'] = function () {
    return _CucumberAdapter;
};

__$Setters__['_CucumberAdapter'] = function (value) {
    _CucumberAdapter = value;
};

__$Resetters__['_CucumberAdapter'] = function () {
    _CucumberAdapter = _CucumberAdapter2;
};

var adapterFactory = {};

var _adapterFactory = adapterFactory;

__$Getters__['adapterFactory'] = function () {
    return adapterFactory;
};

__$Setters__['adapterFactory'] = function (value) {
    exports.adapterFactory = adapterFactory = value;
};

__$Resetters__['adapterFactory'] = function () {
    exports.adapterFactory = adapterFactory = _adapterFactory;
};

adapterFactory.run = function callee$0$0(cid, config, specs, capabilities) {
    var adapter;
    return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                adapter = new _CucumberAdapter(cid, config, specs, capabilities);
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(adapter.run());

            case 3:
                return context$1$0.abrupt('return', context$1$0.sent);

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
};

var _defaultExport = adapterFactory;

if (typeof _defaultExport === 'object' || typeof _defaultExport === 'function') {
    Object.defineProperty(_defaultExport, '__Rewire__', {
        'value': __Rewire__,
        'enumberable': false
    });
    Object.defineProperty(_defaultExport, '__set__', {
        'value': __Rewire__,
        'enumberable': false
    });
    Object.defineProperty(_defaultExport, '__ResetDependency__', {
        'value': __ResetDependency__,
        'enumberable': false
    });
    Object.defineProperty(_defaultExport, '__GetDependency__', {
        'value': __GetDependency__,
        'enumberable': false
    });
    Object.defineProperty(_defaultExport, '__get__', {
        'value': __GetDependency__,
        'enumberable': false
    });
    Object.defineProperty(_defaultExport, '__RewireAPI__', {
        'value': __RewireAPI__,
        'enumberable': false
    });
}

exports['default'] = _defaultExport;
exports.CucumberAdapter = CucumberAdapter;
exports.adapterFactory = adapterFactory;
exports.__GetDependency__ = __GetDependency__;
exports.__get__ = __GetDependency__;
exports.__Rewire__ = __Rewire__;
exports.__set__ = __Rewire__;
exports.__ResetDependency__ = __ResetDependency__;
exports.__RewireAPI__ = __RewireAPI__;
