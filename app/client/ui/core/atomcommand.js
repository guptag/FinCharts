var AtomConstants = require("./atomconstants");

var AtomCommand = function (name, payload) {
    this.name = name;
    this.payload = payload;
};

// short cut to get to the commands enum
AtomCommand.commands = AtomConstants.commands;

module.exports = AtomCommand;