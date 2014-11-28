
var _ = window.server.lodash;
var Logger = require("./utils/logger");

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