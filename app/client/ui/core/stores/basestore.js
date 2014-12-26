var _ = require("lodash");
var Logger = require("ui/core/utils/logger");

function BaseStore(atom) {
    this.commandHandlers = {};
    this.atom = atom;
}

BaseStore.prototype = {
    registerCommandHandlers: function (handlers) {
        var self = this;
        _.each(handlers, function (handlerHash) {
            self.commandHandlers[handlerHash.key] = handlerHash.value;
        });
    },

    handleCommand: function (command) {
        if (this.canHandleCommand(command)) {
            this.commandHandlers[command.name](command.payload);
            Logger.log(command.name, "is handled by store:", this.constructor.name);
        }
    },

    canHandleCommand: function (command) {
        return !!(this.commandHandlers[command.name]);
    }
};

module.exports = BaseStore;

/* atom.transact(function (state) {
    // do something with state
    // return updated state
}) */






