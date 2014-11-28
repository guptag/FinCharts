
var AtomCommand = function (commandName, commandData) {
    this.name = commandName;
    this.data = commandData;
    this.timestamp = new Date().getTime();
};

module.exports = AtomCommand;
