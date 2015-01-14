
var _ = require("lodash");
var moment = require("moment");
var Immutable = require('immutable');

var BaseStore = require("./basestore");
var Commands = require("ui/core/atomconstants").commands;
var LayoutEngine = require("ui/core/layout/layoutengine");

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
                return Immutable.fromJS(payload.timeframe); //remove fromJS() ??
            });
        }.bind(this));
    },

    /**
     * [updateRange description]
     * @param  {[type]} payload {duration: 'daily'}
     * @return {[type]}         [description]
     */
    updateDuration: function (payload) {
        this.atom.transact(function (state) {
            var activeChartIndex = this.getActiveChartIndex();
            return state.updateIn(['chartStore', 'charts', activeChartIndex, 'keys', 'duration'], function (value) {
                return payload.duration;
            });
        }.bind(this));
    },

    /**
     * [updatePriceData description]
     * @param  {[type]} payload {
     *   data: {
              status: "loaded",
              series: [{
                    date: Date.parse(record[0]),
                    open: +parseFloat(record[1]).toFixed(2),
                    high: +parseFloat(record[2]).toFixed(2),
                    low: +parseFloat(record[3]).toFixed(2),
                    close: +parseFloat(record[4]).toFixed(2),
                    volume: +parseFloat(record[5]).toFixed(2),
                    adjClose: +parseFloat(record[6]).toFixed(2),
              }, ...],
              min: 0,
              max: 0,
              minVolume: 0,
              maxVolume: 0
            }
     * }
     * @return {[type]}         [description]
     */
    updatePriceData: function (payload) {
        this.atom.transact(function (state) {
            var activeChartIndex = this.getActiveChartIndex();
            return state.updateIn(['chartStore', 'charts', activeChartIndex, 'data'], function (value) {
                return payload.data; //set raw json (immutable map not needed, also speeeds up the lookup)
            });
        }.bind(this));
    },

    /**
     * [updatePriceData description]
     * @param  {[type]} payload  {
     *   data: {
              status: "loading",
              series: [{
                    date: Date.parse(record[0]),
                    open: +parseFloat(record[1]).toFixed(2),
                    high: +parseFloat(record[2]).toFixed(2),
                    low: +parseFloat(record[3]).toFixed(2),
                    close: +parseFloat(record[4]).toFixed(2),
                    volume: +parseFloat(record[5]).toFixed(2),
                    adjClose: +parseFloat(record[6]).toFixed(2),
              }, ...],
              min: 0,
              max: 0,
              minVolume: 0,
              maxVolume: 0
            }
     * }
     * @return {[type]} [description]
     */
    setDataToLoading: function (/*payload*/) {
        this.atom.transact(function (state) {
            var activeChartIndex = this.getActiveChartIndex();
            return state.updateIn(['chartStore', 'charts', activeChartIndex, 'data'], function (value) {
                return {
                          status: "loading",
                          series: [],
                          min: 0,
                          max: 0,
                          minVolume: 0,
                          maxVolume: 0
                        };
                });
        }.bind(this));
    }
};


function ChartsStore(atom) {
    BaseStore.call(this, atom);
    this.registerCommandHandlers([
        { key: Commands.CHART_UPDATE_TICKER,         value: commandHandlers.updateTicker.bind(this) },
        { key: Commands.CHART_UPDATE_DURATION,       value: commandHandlers.updateDuration.bind(this) },
        { key: Commands.CHART_UPDATE_TIMEFRAME,      value: commandHandlers.updateTimeFrame.bind(this) },
        { key: Commands.CHART_DATA_LOADING,          value: commandHandlers.setDataToLoading.bind(this) },
        { key: Commands.CHART_DATA_FETCHED,          value: commandHandlers.updatePriceData.bind(this) }
    ]);
    this.priceChartModel = null;
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

    getActiveChart: function () {
        return this._getActiveChart().toJS();
    },

    getChartKeys: function () {
        return this._getChartKeys().toJS();
    },

    getTicker: function () {
        return this._getChartKeys().getIn(['ticker']);
    },

    getTimeframe: function () {
        return this._getChartKeys().getIn(['timeframe']).toJS();
    },

    getTimeframeInMonths: function () {
        var timeframe = this.getTimeframe();
        return Math.ceil(moment(timeframe.to).diff(moment(timeframe.from), 'months', true));
    },

    getDuration: function () {
        return this._getChartKeys().getIn(['duration']);
    },

    getChartLayoutId: function () {
       return this._getChartKeys().getIn(['layoutId']);
    },

    getPositionRect: function () {
      return LayoutEngine.getLayoutRect(this.getChartLayoutId());
    },

    getPriceData: function () {
      var activeChartIndex = this.getActiveChartIndex();
      var data = this._getActiveChart().getIn(['data']);
      return data.toJS ? data.toJS() : data;
    }
});

module.exports = ChartsStore;

