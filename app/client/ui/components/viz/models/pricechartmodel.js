var AppContext = require("ui/core/appcontext");

var PriceMarkerHelper = require("chartlib/pricemarkers");

var GridXModel = require("./gridxmodel");


var chartMargin = {
            top: 5,
            bottom: 25,
            left: 2,
            right: 40
        };

function PriceChartModel() {
    this.chartStore = AppContext.stores.chartStore;
    this.chartPositionRect = this.chartStore.getPositionRect();
    this.priceData = this.chartStore.getPriceData();

    var options = {};
    options.margin = chartMargin;
    options.chartPositionRect = this.chartPositionRect;

    options.canvas = {
        width: this.chartPositionRect.width - chartMargin.left - chartMargin.right,
        height: this.chartPositionRect.height - chartMargin.top - chartMargin.bottom
    };

    options.priceMarkers = PriceMarkerHelper.generate(this.priceData.min,
                                    this.priceData.max,
                                    options.canvas.height);

    options.extendedPrices = {
        min: options.priceMarkers[0] || 0,
        max: options.priceMarkers[options.priceMarkers.length - 1] || 0
    };

    options.scaleRatio = {
        x: options.canvas.width / (this.priceData.series.length || 1),
        y: options.canvas.height / ((options.extendedPrices.max - options.extendedPrices.min) || 1)
    };

    options.tickMargin = options.scaleRatio.x / 2;

    this.gridXModel = new GridXModel(options);
    console.log(this);
}

module.exports = PriceChartModel