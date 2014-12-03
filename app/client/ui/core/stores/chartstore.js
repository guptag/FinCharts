
var BaseStore = require("./basestore");

function ChartsStore(atom) {
    BaseStore.call(this, atom);
}

ChartsStore.prototype = _.create(BaseStore.prototype, {

    'constructor': ChartsStore,

    getActiveChartIndex: function () {

    },

    getChartKey: function () {

    },

    getTicker: function () {

    }

});

module.exports = ChartsStore;