var _ = require("lodash");
//var Immutable = require('immutable');

var BaseStore = require("./basestore");
//var Commands = require("ui/core/atomconstants").commands;

/*var commandHandlers = {
};*/


function WatchListStore(atom) {
    BaseStore.call(this, atom);

}

WatchListStore.prototype = _.create(BaseStore.prototype, {

    'constructor': WatchListStore
});

module.exports = WatchListStore;