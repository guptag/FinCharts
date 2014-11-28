
var _ = window.server.lodash;

var AtomCommand = require(".atomcommand");
var AppStore = require("./stores/appstore");
var ChartStore = require("./stores/chartstore");
var LayoutStore = require("./stores/layoutstore");
var WatchlistStore = require("./stores/watchliststore");

function AtomStoreManager(atom) {

    (function init() {
        this.stores = {
            appStore: new AppStore(atom),
            chartStore: new ChartStore(atom),
            layoutStore: new LayoutStore(atom),
            watchlistStore: new WatchlistStore(atom)
        }
    })();

    this.prototype = {
        handleCommands: function (commands) {
            _.each(commands, function (command) {
                this.handleCommand(command);
            }, this)
        },

        handleCommand: function (command) {
            if (typeof command !== AtomCommand) {
                throw new Error("AtomStoreManager: command isn't AtomCommand", command);
            }

            var storeName = command.store,
                action = command.action,
                params = command.commandData;

            if (!this.stores[storeName]) {
                throw new Error("AtomStoreManager: cannot handle command. invalid store name", arguments);
            }

            if (!this.stores[storeName][method]) {
                throw new Error("AtomStoreManager: invalid action", arguments);
            }

            // call the action method
            this.stores[storeName][method].call(this.stores[storeName], params)
        }
    }

}





/*
var AtomReactStoreManager = function AtomReactStoreManager(context,path,store) {
    Preconditions.checkHasValue(context);
    Preconditions.checkHasValue(store);
    this.context = context;
    this.path = path;
    this.store = store;
    // TODO probably not very elegant
    this.store.description.cursor = this.context.atom.cursor().follow(this.path);
    this.store.description.transact = this.context.atom.transact.bind(this.context.atom);

    // TODO this is a temporary hack that should be removed when we know how to handle CQRS Sagas better
    this.store.description.temporaryHack_publishEvents = this.context.publishEvents.bind(this.context);

    // TODO remove deprecated name!
    this.store.description.storeCursor = this.context.atom.cursor().follow(this.path);
};

// TODO this should be removed in favor of bootstrap event
AtomReactStoreManager.prototype.init = function() {
    if ( this.store.description.init ) {
        this.store.description.init();
    }
};

AtomReactStoreManager.prototype.handleEvent = function(event) {
    this.store.description.handleEvent(event);
};
AtomReactStoreManager.prototype.handleCommand = function(command) {
    if ( this.store.description.handleCommand ) {
        return this.store.description.handleCommand(command);
    }
};
exports.AtomReactStoreManager = AtomReactStoreManager;
*/
