var AppContext = require("./ui/core/appcontext");

var chartActions = {
    /**
     *  data: {
     *      ticker: "MSFT",
     *      timeframe: {
     *          from: <Date>,
     *          to: <Date>
     *      },
     *      duration: 'daily'
     *  }
     */
    fetchPriceDate: function (data) {

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
