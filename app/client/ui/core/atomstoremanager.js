
var _ = window.server.lodash;

var AtomCommand = require("./atomcommand");
var Logger = require("./utils/logger");


function AtomStoreManager(atom, stores) {
    this.stores = stores;
    this.atom = atom;
}

AtomStoreManager.prototype = {
    handleCommands: function (commands) {
        _.each(commands, function (command) {
            this.handleCommand(command);
        }, this);
    },

    handleCommand: function (command) {
        if (command.constructor !== AtomCommand) {
            throw new Error("AtomStoreManager: command isn't AtomCommand", command);
        }

        if (!command.name) {
            throw new Error("AtomStoreManager: Cannot handle command, command.name is null", arguments);
        }

        _.each(this.stores, function (store) {
          if (store.canHandleCommand(command)) {
                store.handleCommand(command);
            }
        });
    }
};

module.exports = AtomStoreManager;
