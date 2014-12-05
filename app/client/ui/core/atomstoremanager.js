
var _ = window.server.lodash;

var AtomCommand = require(".atomcommand");
var AppStore = require("./stores/appstore");
var ChartStore = require("./stores/chartstore");
var LayoutStore = require("./stores/layoutstore");
var WatchlistStore = require("./stores/watchliststore");

var Logger = require("./utils/logger");


function AtomStoreManager(atom) {

    (function init() {
        this.stores = {
            appStore: new AppStore(atom),
            chartStore: new ChartStore(atom),
            layoutStore: new LayoutStore(atom),
            watchlistStore: new WatchlistStore(atom)
        };
    })();

    this.prototype = {
        handleCommands: function (commands) {
            _.each(commands, function (command) {
                this.handleCommand(command);
            }, this);
        },

        handleCommand: function (command) {
            if (typeof command !== AtomCommand) {
                throw new Error("AtomStoreManager: command isn't AtomCommand", command);
            }

            if (!command.name) {
                throw new Error("AtomStoreManager: Cannot handle command, command.name is null", arguments);
            }

            _.each(this.stores, function (store) {
              if (store.canHandleCommand(command) {
                    Logger.info("Action:", command.name, "is handled by ", store.name);
                    store.handleCommand(command);
                }
            });
        }
    };
}

module.exports = AtomStoreManager;
