
var _ = require("lodash");
var moment = require("moment");
var Immutable = require('immutable');

var BaseStore = require("./basestore");
var Commands = require("ui/core/atomconstants").commands;
var AtomState = require("ui/core/atomstate");
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
    },

    /**
     * [updateChartLayout description]
     * @param  {[type]} layoutId [description]
     * @return {[type]}          [description]
     */
    updateChartLayout: function (payload) {
        var _this = this;
        // TODO: CLEANUP
        this.atom.transact(function (state) {
            debugger;
            var totalChartsToRender = parseInt(payload.layoutId.replace("chartslayout", ""));

            var atomState = _this.atom.getState();
            var currentCharts = atomState.getIn(['chartStore', 'charts']);
            var currentChartCount = currentCharts.size;

            if (totalChartsToRender == currentChartCount) return state;

            if (totalChartsToRender > currentChartCount) {
              // Clone the additional charts from the getDefaultChartState
              // update layoutids, chartid
              // set ticker, keys, data from active charts

              var chartsToAdd = totalChartsToRender - currentChartCount;
              _.times(chartsToAdd, function (index) {
                  var chart = AtomState.getDefaultChartState();
                  chart.id = new Date().getTime();
                  chart.chartKeys = _this._getChartKeys();
                  chart.chartKeys.layoutId = payload.layoutId + "_" + chart.id;

                  // immutable obj
                  chart = Immutable.fromJS(chart);
                  chart = chart.updateIn(['data'], function () {
                      return _this.getPriceData();
                  });
                  currentCharts = currentCharts.push(chart);
              });

              return atomState.updateIn(['chartStore', 'charts'], function () {
                  return currentCharts;
              })

            } else {

            }

            return state;

        }.bind(this));


    },
};


function ChartsStore(atom) {
    BaseStore.call(this, atom);
    this.registerCommandHandlers([
        { key: Commands.CHART_UPDATE_TICKER,         value: commandHandlers.updateTicker.bind(this) },
        { key: Commands.CHART_UPDATE_DURATION,       value: commandHandlers.updateDuration.bind(this) },
        { key: Commands.CHART_UPDATE_TIMEFRAME,      value: commandHandlers.updateTimeFrame.bind(this) },
        { key: Commands.CHART_DATA_LOADING,          value: commandHandlers.setDataToLoading.bind(this) },
        { key: Commands.CHART_DATA_FETCHED,          value: commandHandlers.updatePriceData.bind(this) },
        { key: Commands.CHART_UPDATE_LAYOUT,         value: commandHandlers.updateChartLayout.bind(this)}
    ]);
    this.priceChartModel = null;
}

ChartsStore.prototype = _.create(BaseStore.prototype, {

    'constructor': ChartsStore,

    _getActiveChart: function (id) {
        var atomState = this.atom.getState();
        var activeChartId = id || this.getActiveChartId();
        return atomState
                .getIn(['chartStore', 'charts'])
                  .find(function(item) {
                    return (item.getIn(['id']) === activeChartId);
                  });
    },

    _getChartKeys: function (id) {
        return this._getActiveChart(id).getIn(['keys']);
    },

    getActiveChartId: function (id) {
        var atomState = this.atom.getState();
        return atomState.getIn(['chartStore', 'activeChartId']);
    },

    getActiveChartIndex: function (id) {
        var atomState = this.atom.getState();
        var activeChartId = id || this.getActiveChartId();
        return atomState
                .getIn(['chartStore', 'charts'])
                  .findIndex(function(item) {
                    return (item.getIn(['id']) === activeChartId);
                  });
    },

    getAllChartIds: function () {
        var atomState = this.atom.getState();
        return atomState
                .getIn(['chartStore', 'charts'])
                .map(function(item) {
                  return (item.getIn(['id']));
                }).toJS();
    },

    getActiveChart: function (id) {
        return this._getActiveChart(id).toJS();
    },

    getChartKeys: function (id) {
        return this._getChartKeys(id).toJS();
    },

    getTicker: function (id) {
        return this._getChartKeys(id).getIn(['ticker']);
    },

    getTimeframe: function (id) {
        return this._getChartKeys(id).getIn(['timeframe']).toJS();
    },

    getTimeframeInMonths: function (id) {
        var timeframe = this.getTimeframe(id);
        return Math.ceil(moment(timeframe.to).diff(moment(timeframe.from), 'months', true));
    },

    getDuration: function (id) {
        return this._getChartKeys(id).getIn(['duration']);
    },

    getChartLayoutId: function (id) {
       return this._getChartKeys(id).getIn(['layoutId']);
    },

    getPositionRect: function (id) {
      return LayoutEngine.getLayoutRect(this.getChartLayoutId(id));
    },

    getPriceData: function (id) {
      var data = this._getActiveChart(id).getIn(['data']);
      return data.toJS ? data.toJS() : data;
    }
});

module.exports = ChartsStore;

