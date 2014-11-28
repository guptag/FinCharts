
var AtomCommand = function (storeName, actionName, commandData) {
    this.store = storeName;
    this.action = actionName;
    this.commandData = commandData;
    this.timestamp = new Date().getTime();
};

module.exports = AtomCommand;