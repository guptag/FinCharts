var _ = require("lodash");
var BaseStore = require("ui/core/stores/basestore");
var Commands = require("ui/core/atomconstants").commands;

var commandHandlers = {
    toggleTimeframeOptions: function (payload) {
        this.atom.transact(function (state) {

        }.bind(this));
    },

    toggleDurationOptions: function (payload) {
        this.atom.transact(function (state) {

        }.bind(this));
    },

    toggleChartLayoutOptions: function (payload) {
        this.atom.transact(function (state) {

        }.bind(this));
    },

    onWindowResize: function (payload) {
        this.atom.transact(function (state) {

        }.bind(this));
    }
};


function AppUIStore(atom) {
    BaseStore.call(this, atom);
    this.registerCommandHandlers([
        { key: Commands.APP_WINDOW_RESIZE,              value: _.debounce(commandHandlers.onWindowResize.bind(this), 600) },
        { key: Commands.APP_TOGGLE_TIMEFRAME_OPTIONS,   value: commandHandlers.toggleTimeframeOptions.bind(this) },
        { key: Commands.APP_TOGGLE_DURATION_OPTIONS,    value: commandHandlers.toggleDurationOptions.bind(this) },
        { key: Commands.APP_TOGGLE_CHARTLAYOUT_OPTIONS, value: commandHandlers.toggleChartLayoutOptions.bind(this) }
    ]);
}

AppUIStore.prototype = _.create(BaseStore.prototype, {

    'constructor': AppUIStore,

    isTimeframeMenuOpen: function () {

    },

    isDurationMenuOpen: function () {

    },

    isChartLayoutMenuOpen: function () {

    }

});

module.exports = AppUIStore;