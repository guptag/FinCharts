var _ = require("lodash");
var Logger = require("./utils/logger");

function BaseStore(atom) {
    this.commandHandlers = {};
}

BaseStore.prototype = {
    registerCommandHandlers: function (actionsHash) {
        this.commandHandlers = actionsHash;
    },

    handleCommand: function (command) {
        if (this.canHandleCommand(command)) {
            this.commandHandlers[command.name](command.payload);
            Logger.log(command.name, "is handled by store:", this.constructor.name);
        }
    },

    canHandleCommand: function (commandName) {
        return !!(this.commandHandlers[command.name]);
    }
};

module.exports = BaseStore;

/* atom.transact(function (state) {
    // do something with state
    // return updated state
}) */






