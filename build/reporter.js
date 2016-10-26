'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _cucumber = require('cucumber');

var _cucumber2 = _interopRequireDefault(_cucumber);

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

var CUCUMBER_EVENTS = ['handleBeforeFeatureEvent', 'handleAfterFeatureEvent', 'handleBeforeScenarioEvent', 'handleAfterScenarioEvent', 'handleBeforeStepEvent', 'handleStepResultEvent'];

/**
 * Custom Cucumber Reporter
 */
var _CUCUMBER_EVENTS = CUCUMBER_EVENTS;

__$Getters__['CUCUMBER_EVENTS'] = function () {
    return CUCUMBER_EVENTS;
};

__$Setters__['CUCUMBER_EVENTS'] = function (value) {
    CUCUMBER_EVENTS = value;
};

__$Resetters__['CUCUMBER_EVENTS'] = function () {
    CUCUMBER_EVENTS = _CUCUMBER_EVENTS;
};

var CucumberReporter = (function () {
    function CucumberReporter(BaseListener, options, cid, specs) {
        _classCallCheck(this, CucumberReporter);

        this.listener = BaseListener;
        this.capabilities = options.capabilities;
        this.options = options;
        this.cid = cid;
        this.specs = specs;
        this.failedCount = 0;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _getIterator(CUCUMBER_EVENTS), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var fnName = _step.value;

                this.listener[fnName] = CucumberReporter.prototype[fnName].bind(this);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    _createClass(CucumberReporter, [{
        key: 'handleBeforeFeatureEvent',
        value: function handleBeforeFeatureEvent(event, callback) {
            var feature = event.getUri ? event : event.getPayloadItem('feature');
            this.featureStart = new Date();
            this.runningFeature = feature;

            this.emit('suite:start', {
                title: feature.getName(),
                description: feature.getDescription(),
                tags: this.tags(feature.getTags()),
                type: 'feature',
                file: this.getUriOf(feature)
            });

            process.nextTick(callback);
        }
    }, {
        key: 'handleBeforeScenarioEvent',
        value: function handleBeforeScenarioEvent(event, callback) {
            var scenario = event.getUri ? event : event.getPayloadItem('scenario');
            this.runningScenario = scenario;
            this.scenarioStart = new Date();
            this.testStart = new Date();

            this.emit('suite:start', {
                title: scenario.getName(),
                description: scenario.getDescription(),
                tags: this.tags(scenario.getTags()),
                parent: this.runningFeature.getName(),
                type: 'scenario',
                file: this.getUriOf(scenario)
            });

            process.nextTick(callback);
        }
    }, {
        key: 'handleBeforeStepEvent',
        value: function handleBeforeStepEvent(event, callback) {
            var step = event.getUri ? event : event.getPayloadItem('step');
            this.testStart = new Date();

            this.emit('test:start', {
                key: step.getKeyword(),
                title: step.getName(),
                type: 'test',
                file: step.getUri(),
                parent: this.runningScenario.getName(),
                duration: new Date() - this.testStart
            });

            process.nextTick(callback);
        }
    }, {
        key: 'handleStepResultEvent',
        value: function handleStepResultEvent(event, callback) {
            var stepResult = event.getStep ? event : event.getPayloadItem('stepResult');
            var step = stepResult.getStep();
            var e = 'undefined';

            switch (stepResult.getStatus()) {
                case Cucumber.Status.FAILED:
                case Cucumber.Status.UNDEFINED:
                    e = 'fail';
                    break;
                case Cucumber.Status.PASSED:
                    e = 'pass';
                    break;
                case Cucumber.Status.PENDING:
                case Cucumber.Status.SKIPPED:
                case Cucumber.Status.AMBIGUOUS:
                    e = 'pending';
            }
            var error = {};
            var stepKeyword = step.getKeyword() || 'Undefined Step';
            var stepTitle = step.getName() || step.getKeyword() || 'Undefined Step';

            /**
             * if step name is undefined we are dealing with a hook
             * don't report hooks if no error happened
             */
            if (!step.getName() && stepResult.getStatus() !== Cucumber.Status.FAILED) {
                return process.nextTick(callback);
            }

            if (stepResult.getStatus() === Cucumber.Status.UNDEFINED) {
                if (this.options.ignoreUndefinedDefinitions) {
                    /**
                     * mark test as pending
                     */
                    e = 'pending';
                    stepTitle += ' (undefined step)';
                } else {
                    /**
                     * mark test as failed
                     */
                    this.failedCount++;

                    error = {
                        message: 'Step "' + stepTitle + '" is not defined. You can ignore this error by setting\n                              cucumberOpts.ignoreUndefinedDefinitions as true.',
                        stack: step.getUri() + ':' + step.getLine()
                    };
                }
            } else if (stepResult.getStatus() === Cucumber.Status.FAILED) {
                /**
                 * cucumber failure exception can't get send to parent process
                 * for some reasons
                 */
                var err = stepResult.getFailureException();
                error = {
                    message: err.message,
                    stack: err.stack
                };
                this.failedCount++;
            } else if (stepResult.getStatus() === Cucumber.Status.AMBIGUOUS && this.options.failAmbiguousDefinitions) {
                e = 'fail';
                this.failedCount++;
                error = {
                    message: 'Step "' + stepTitle + '" is ambiguous. The following steps matched the step definition',
                    stack: stepResult.getAmbiguousStepDefinitions().map(function (step) {
                        return step.getPattern().toString() + ' in ' + step.getUri() + ':' + step.getLine();
                    }).join('\n')
                };
            }

            this.emit('test:' + e, {
                key: stepKeyword.trim(),
                title: stepTitle.trim(),
                type: 'test',
                file: this.getUriOf(step),
                parent: this.runningScenario.getName(),
                error: error,
                duration: new Date() - this.testStart
            });

            process.nextTick(callback);
        }
    }, {
        key: 'handleAfterScenarioEvent',
        value: function handleAfterScenarioEvent(event, callback) {
            var scenario = event.getUri ? event : event.getPayloadItem('scenario');
            this.emit('suite:end', {
                title: scenario.getName(),
                description: scenario.getDescription(),
                tags: this.tags(scenario.getTags()),
                parent: this.runningFeature.getName(),
                type: 'scenario',
                file: this.getUriOf(scenario),
                duration: new Date() - this.scenarioStart
            });

            process.nextTick(callback);
        }
    }, {
        key: 'handleAfterFeatureEvent',
        value: function handleAfterFeatureEvent(event, callback) {
            var feature = event.getUri ? event : event.getPayloadItem('feature');
            this.emit('suite:end', {
                title: feature.getName(),
                description: feature.getDescription(),
                tags: this.tags(feature.getTags()),
                type: 'feature',
                file: this.getUriOf(feature),
                duration: new Date() - this.featureStart
            });

            process.nextTick(callback);
        }
    }, {
        key: 'emit',
        value: function emit(event, payload) {
            var message = {
                event: event,
                cid: this.cid,
                key: payload.key,
                title: payload.title,
                description: payload.description,
                tags: payload.tags,
                pending: payload.pending || false,
                parent: payload.parent || null,
                type: payload.type,
                file: payload.file,
                err: payload.error || {},
                duration: payload.duration,
                runner: {},
                specs: this.specs
            };

            message.runner[this.cid] = this.capabilities;
            this.send(message);
        }
    }, {
        key: 'tags',
        value: function tags(array) {
            return array.map(function (obj) {
                return obj.getName();
            });
        }
    }, {
        key: 'send',
        value: function send(message) {
            return process.send(message);
        }
    }, {
        key: 'getListener',
        value: function getListener() {
            return this.listener;
        }
    }, {
        key: 'getUriOf',
        value: function getUriOf(type) {
            if (!type || !type.getUri()) {
                return;
            }

            return type.getUri().replace(process.cwd(), '');
        }
    }]);

    return CucumberReporter;
})();

var _defaultExport = CucumberReporter;

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
exports.__GetDependency__ = __GetDependency__;
exports.__get__ = __GetDependency__;
exports.__Rewire__ = __Rewire__;
exports.__set__ = __Rewire__;
exports.__ResetDependency__ = __ResetDependency__;
exports.__RewireAPI__ = __RewireAPI__;
module.exports = exports['default'];
