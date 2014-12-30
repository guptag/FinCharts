var AppContext = require("ui/core/appcontext");

var PriceMarkerHelper = require("chartlib/pricemarkers");

var chartMargin = {
            top: 5,
            bottom: 25,
            left: 2,
            right: 40
        };

function PriceChartModel() {
    var chartStore = AppContext.stores.chartStore;
    var positionRect = chartStore.getPositionRect();
    var priceData = chartStore.getPriceData();

    var canvas =  {
            width: positionRect.width - chartMargin.left - chartMargin.right,
            height: positionRect.height - chartMargin.top - chartMargin.bottom
        };

    var priceMarkers = PriceMarkerHelper.generate(priceData.min,
                                    priceData.max,
                                    canvas.height);

    var extendedPrices = {
        min: priceMarkers[0] || 0,
        max: priceMarkers[priceMarkers.length - 1] || 0
    };

    var scaleRatio = {
        x: canvas.width / (priceData.series.length || 1),
        y: canvas.height / ((extendedPrices.max - extendedPrices.min) || 1)
    };

    this.chartInfo = {
        margin: chartMargin,
        positionRect: positionRect,
        canvas: canvas,
        priceMarkers: priceMarkers,
        extendedPrices: extendedPrices,
        scaleRatio: scaleRatio,
        tickMargin: scaleRatio.x / 2
    };

    console.log(this.chartInfo);
}

module.exports = PriceChartModel