
var _ = window.server.lodash;

var BaseStore = require("./basestore");
var Commands = require("../atomconstants").commands;

function ChartsStore(atom) {
    BaseStore.call(this, atom);
    this.atom = atom;
    this.registerCommandHandlers({
        Commands.CHART_UPDATE_TICKER: _.bind(commandHandlers.updateTicker, this),
        Commands.CHART_UPDATE_DURATION: _.bind(commandHandlers.updateDuration, this),
        Commands.CHART_UPDATE_TIMEFRAME: _.bind(commandHandlers.updateTimeFrame, this)
    });
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

var commandHandlers = {
    updateTicker: function (payload) {
        this.atom.transact(function (state) {

        });
    },

    updateTimeFrame: function (payload) {
        this.atom.transact(function (state) {

        });
    },

    updateDuration: function (payload) {
        this.atom.transact(function (state) {

        });
    }
}



module.exports = ChartsStore;

