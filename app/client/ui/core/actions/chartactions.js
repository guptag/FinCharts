var AppContext = require("ui/core/appcontext"),
    AtomCommand = require("ui/core/atomcommand"),
    PriceDataApi = require("data/api/pricedata"),
    DeferredEvents = require("ui/core/events/deferredevents");

var chartActions = {

    updateTicker: function (ticker) {
        AppContext.publishBatchCommands([
              new AtomCommand(
                AtomCommand.commands.CHART_UPDATE_TICKER,
                {ticker: ticker}
              ),
              new AtomCommand(
                AtomCommand.commands.CHART_DATA_LOADING,
                {}
              )
            ]);

        this.loadActiveChart(AppContext.stores.chartStore.getChartKeys());
    },

    updateTimeframe: function (fromDate, toDate, duration) {
        AppContext.publishBatchCommands([
              new AtomCommand(
                AtomCommand.commands.APP_TOGGLE_TIMEFRAME_OPTIONS,
                {
                    show: false,
                    rect: {
                        top: -50,
                        left: -50
                    }
                }
              ),
              new AtomCommand(
                AtomCommand.commands.CHART_UPDATE_TIMEFRAME,
                {timeframe: {from: fromDate, to: toDate}}
              ),
              new AtomCommand(
                AtomCommand.commands.CHART_UPDATE_DURATION,
                {duration: duration}
              ),
              new AtomCommand(
                AtomCommand.commands.CHART_DATA_LOADING,
                {}
              )
            ]);

        this.loadActiveChart(AppContext.stores.chartStore.getChartKeys());
    },

    updateDuration: function (duration) {
        AppContext.publishBatchCommands([
              new AtomCommand(
                AtomCommand.commands.APP_TOGGLE_DURATION_OPTIONS,
                {
                    show: false,
                    rect: {
                        top: -50,
                        left: -50
                    }
                }),
              new AtomCommand(
                AtomCommand.commands.CHART_UPDATE_DURATION,
                {duration: duration}
              ),
              new AtomCommand(
                AtomCommand.commands.CHART_DATA_LOADING,
                {}
              )
            ]);

        this.loadActiveChart(AppContext.stores.chartStore.getChartKeys());
    },

    /**
     *  chartKeys: {
     *      ticker: "MSFT",
     *      timeframe: {
     *          from: <Date>,
     *          to: <Date>
     *      },
     *      duration: 'daily'
     *  }
     */
    loadActiveChart: function (chartKeys) {
        /*AppContext.publishCommand(new AtomCommand(
            AtomCommand.commands.CHART_DATA_LOADING,
            {}
        ));*/

        PriceDataApi.getTickerDataAsync(chartKeys)
                    .then(function (priceData) {
                        AppContext.publishCommand(
                          new AtomCommand(
                            AtomCommand.commands.CHART_DATA_FETCHED,
                            {data: priceData}
                          ));
                    });
    },

    updateActiveChart: function (chartId) {
        AppContext.publishCommand(
            new AtomCommand(
              AtomCommand.commands.CHART_UPDATE_ACTIVECHART,
              {chartId: chartId}
            ));
    },

    startPreview: function (chartId) {
        console.log("start preview");
        DeferredEvents.trigger(chartId + DeferredEvents.Keys.StartPreview);
    },

    pausePreview: function (chartId) {
        DeferredEvents.trigger(chartId + DeferredEvents.Keys.PausePreview);
    },

    stopPreview: function (chartId) {
       DeferredEvents.trigger(chartId + DeferredEvents.Keys.StopPreview);
    },

    updateChartLayout: function (chartLayoutId) {
        AppContext.publishBatchCommands([
              new AtomCommand(
                AtomCommand.commands.APP_TOGGLE_CHARTLAYOUT_OPTIONS,
                {
                    show: false,
                    rect: {
                        top: -50,
                        left: -50
                    }
                }),
              new AtomCommand(
                AtomCommand.commands.CHART_UPDATE_LAYOUT,
                {layoutId: chartLayoutId}
              )]);
    },

    updateRenderer: function (/*renderer*/) {

    },

    updateValueAxisScale: function (/*scale*/) { /* log, auto, linear */

    },

    toggleGridVisibility: function () {

    },

    toggleCrosshairVisibility: function () {

    }
};

module.exports = chartActions;
