// Credit - https://github.com/stample/atom-react/blob/master/src/atomReactContext.js

var React = require("react/addons");
var Atom  = require("ui/core/atom");
var AtomStoreManager = require("ui/core/atomstoremanager");
var Logger = require("ui/core/utils/logger");

var LayoutEngine = require("ui/core/layout/layoutengine");

var AppUIStore = require("ui/core/stores/appuistore");
var ChartStore = require("ui/core/stores/chartstore");
var LayoutStore = require("ui/core/stores/layoutstore");
var WatchlistStore = require("ui/core/stores/watchliststore");


function AppContext () {
    var lastRenderedState;

    this.init = function (reactClass, domNode) {
        this.atom = new Atom({
            afterCommit: this.afterAtomCommit.bind(this)
        });

        this.stores = {
            appUIStore: new AppUIStore(this.atom),
            chartStore: new ChartStore(this.atom),
            layoutStore: new LayoutStore(this.atom),
            watchlistStore: new WatchlistStore(this.atom)
        };

        this.storeManager = new AtomStoreManager(this.atom, this.stores);

        this.mountConfig = {
            reactElementClass: reactClass,
            reactElementFactory: React.createFactory(reactClass),
            domNode: domNode
        };
    };

    this.afterAtomCommit = function (newState, previousState) {
        var shouldRender = (newState !== previousState);
        var self = this;
        if ( shouldRender ) {
            this.printReactPerfMesuresAround(
               function () {
                    self.renderAtomState(newState);
               }
            );
        }
    };

    this.publishCommand = function (atomCommand) {
        this.storeManager.handleCommand(atomCommand);
    };

    this.publishBatchCommands = function (atomCommands) {
        this.atom.openBatchTransaction();
        this.storeManager.handleCommands(atomCommands);
        this.atom.commitBatchTransactMode();
    };

    this.renderAtomState = function (state) {
        var self = this;

        var props = {
            atom: this.atom,
            appContext: this
        };

        var reactContext = {
            appContext: this /*,
            publishEvent: this.publishEvent.bind(this),
            publishEvents: this.publishEvents.bind(this),
            publishCommand: this.publishCommand.bind(this),
            addEventListener: this.addEventListener.bind(this),
            removeEventListener: this.addEventListener.bind(this) */
        };

        try {
            this.logStateBeforeRender();

            React.withContext(reactContext, function() {
                console.time("Rendered");
                React.render(
                    self.mountConfig.reactElementFactory(props),
                    self.mountConfig.domNode,
                    function () {
                        console.timeEnd("Rendered");
                    }
                );
            });
        } catch (e) {
            Logger.error("Could not render application with state ", (state && state.toJS && state.toJS()) || "<null>", e);
            throw e;
        }
    };

    this.printReactPerfMesuresAround = function(task) {
        React.addons.Perf.start();
        task();
        React.addons.Perf.stop();
        try {
            React.addons.Perf.printWasted();
            React.addons.Perf.printInclusive();
            React.addons.Perf.printExclusive();
        }
        catch (e) {
            Logger.error("Can't print React perf mesures: " + e.message);
        }
    };

    this.logStateBeforeRender = function() {
        var previousState = lastRenderedState;
        var currentState = this.atom.getState();
        lastRenderedState = currentState;
        console.debug(
            "####\n# Previous state#",
            previousState ? previousState.toJS(): "<nothing>",
             "\n####\n# Current state#",
            currentState ? currentState.toJS() : "<nothing>"
        );
    };

    this.getLayoutRect = function (layoutName) {
        return LayoutEngine.getLayoutRect(layoutName);
    };

    this.getWindowRect = function () {
        return LayoutEngine.getWindowRect();
    };
}

// singleton
module.exports = new AppContext();