var AppContext = require("ui/core/appcontext"),
    AtomCommand = require("ui/core/atomcommand"),
    PriceDataApi = require("data/api/pricedata");

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

        this.fetchPriceDate(AppContext.stores.chartStore.getChartKeys());
    },

    updateTimeframe: function (fromDate, toDate) {
        AppContext.publishBatchCommands([
               new AtomCommand(
                AtomCommand.commands.CHART_UPDATE_TIMEFRAME,
                {timeframe: {from: fromDate, to: toDate}}
              ),
              new AtomCommand(
                AtomCommand.commands.CHART_DATA_LOADING,
                {}
              )
            ]);

        this.fetchPriceDate(AppContext.stores.chartStore.getChartKeys());
    },

    updateDuration: function (duration) {
        AppContext.publishBatchCommands([
               new AtomCommand(
                AtomCommand.commands.CHART_UPDATE_DURATION,
                {duration: duration}
              ),
              new AtomCommand(
                AtomCommand.commands.CHART_DATA_LOADING,
                {}
              )
            ]);

        this.fetchPriceDate(AppContext.stores.chartStore.getChartKeys());
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
    fetchPriceDate: function (chartKeys) {
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

    updateRenderer: function (renderer) {

    },

    updateValueAxisScale: function (scale /* log, auto, linear */) {

    },

    toggleGridVisibility: function () {

    },

    toggleCrosshairVisibility: function () {

    }
};

module.exports = chartActions;
