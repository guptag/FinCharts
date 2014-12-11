
var _ = window.server.lodash;
//var Immutable = require('immutable');

var BaseStore = require("./basestore");
//var Commands = require("../atomconstants").commands;

var commandHandlers = {
};


function LayoutStore(atom) {
    BaseStore.call(this, atom);

}

LayoutStore.prototype = _.create(BaseStore.prototype, {

    'constructor': LayoutStore
});

module.exports = LayoutStore;

