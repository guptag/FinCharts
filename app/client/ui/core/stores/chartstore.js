
var _ = window.server.lodash;
var Immutable = require('immutable');

var BaseStore = require("./basestore");
var Commands = require("../atomconstants").commands;

var commandHandlers = {
    /**
     * [updateTicker description]
     * @param  {[type]} payload {ticker: 'MSFT'}
     * @return {[type]}         [description]
     */
    updateTicker: function (payload) {
        this.atom.transact(function (state) {
            var activeChartIndex = this.getActiveChartIndex();
            return state.updateIn(['chartStore', 'charts', activeChartIndex, 'keys', 'ticker'], function (value) {
                return payload.ticker;
            });
        }.bind(this));
    },

    /**
     * [updateTimeFrame description]
     * @param  {[type]} payload {from: <Date>, to: <Date>}
     * @return {[type]}         [description]
     */
    updateTimeFrame: function (payload) {
        this.atom.transact(function (state) {
            var activeChartIndex = this.getActiveChartIndex();
            return state.updateIn(['chartStore', 'charts', activeChartIndex, 'keys', 'timeframe'], function (value) {
                return Immutable.fromJS(payload.timeframe);
            });
        }.bind(this));
    },

    /**
     * [updateRange description]
     * @param  {[type]} payload {range: 'daily'}
     * @return {[type]}         [description]
     */
    updateRange: function (payload) {
        this.atom.transact(function (state) {
            var activeChartIndex = this.getActiveChartIndex();
            return state.updateIn(['chartStore', 'charts', activeChartIndex, 'keys', 'range'], function (value) {
                return payload.range;
            });
        }.bind(this));
    }
};


function ChartsStore(atom) {
    BaseStore.call(this, atom);
    this.registerCommandHandlers([
        { key: Commands.CHART_UPDATE_TICKER,    value: commandHandlers.updateTicker.bind(this) },
        { key: Commands.CHART_UPDATE_RANGE,  value: commandHandlers.updateRange.bind(this) },
        { key: Commands.CHART_UPDATE_TIMEFRAME, value: commandHandlers.updateTimeFrame.bind(this) }
    ]);
}

ChartsStore.prototype = _.create(BaseStore.prototype, {

    'constructor': ChartsStore,

    _getActiveChart: function () {
        var atomState = this.atom.getState();
        var activeChartIndex = this.getActiveChartIndex();
        return atomState.getIn(['chartStore', 'charts', activeChartIndex]);
    },

    _getChartKeys: function () {
        var activeChartIndex = this.getActiveChartIndex();
        return this._getActiveChart().getIn(['keys']);
    },

    getActiveChartIndex: function () {
        var atomState = this.atom.getState();
        return atomState.getIn(['chartStore', 'activeChartIndex']);
    },

    getActiveChartJS: function () {
        return this._getActiveChart().toJS();
    },

    getTicker: function () {
        return this._getChartKeys().getIn(['ticker']);
    },

    getTimeframe: function () {
        return this._getChartKeys().getIn(['timeframe']).toJS();
    },

    getRange: function () {
        return this._getChartKeys().getIn(['range']);
    }
});

module.exports = ChartsStore;

