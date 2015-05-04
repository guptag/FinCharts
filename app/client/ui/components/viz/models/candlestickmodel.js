var _ = require("lodash");
var PathHelper = require("paths-js/path");

/**
 * [CandleStickModel description]
 * @param {[type]} chartInfo {
 *           positionRect: <rect>,
 *           canvas: {},
 *           margin: {},
 *           priceMarkers: {},
 *           extendedPrices: {},
 *           scaleRatio: {}
 * }
 */
function CandleStickModel(chartInfo) {
    var self = this;

    this.elements = [];

    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    //var positionRect = chartInfo.positionRect;
    var priceData = chartInfo.priceData;
    //var priceMarkers = chartInfo.priceMarkers;
    var extendedPrices = chartInfo.extendedPrices;
    var scaleRatio = chartInfo.scaleRatio;

    var candleWidth = (scaleRatio.x * 70/100.0); //candle takes 70% of the total space allowed (for now)
    var candleLeftMargin = (scaleRatio.x * 15/100.0); //center the candle in the available space (100-70/2)


    var toPlotY = _.curry(function (margin, canvas, extendedPrices, scaleRatio, dataY) {
        return formatNumber(margin.top + canvas.height  - ((dataY - extendedPrices.min) * scaleRatio.y));
    })(margin, canvas, extendedPrices, scaleRatio);

    var toPlotX = _.curry(function (margin, scaleRatio, candleLeftMargin, dataX) {
        return formatNumber(margin.left + scaleRatio.x * dataX + candleLeftMargin);
    })(margin, scaleRatio, candleLeftMargin);

    //console.log(options.data.series.minVolume, options.data.series.maxVolume);

    _.forEach(priceData.series, function(data, index) {
        var above, below;
        if (data.open > data.close) {
            above = data.open;
            below = data.close;
        } else {
            below = data.open;
            above = data.close;
        }

        var path = PathHelper()
                    .moveto(toPlotX(index), toPlotY(above))
                    .lineto(formatNumber(toPlotX(index) + candleWidth), toPlotY(above)) //top edge
                    .lineto(formatNumber(toPlotX(index) + candleWidth), toPlotY(below)) //right edge
                    .lineto(toPlotX(index), toPlotY(below)) //bottom edge
                    .lineto(toPlotX(index), toPlotY(above)) //left edge
                    .moveto(toPlotX(index) + candleWidth/2, toPlotY(data.high)) //top whisker
                    .lineto(toPlotX(index) + candleWidth/2, toPlotY(above))
                    .moveto(toPlotX(index) + candleWidth/2, toPlotY(below)) //bottom whisker
                    .lineto(toPlotX(index) + candleWidth/2, toPlotY(data.low))
                    .closepath();

        self.elements.push({
                    type: "path",
                    props: {
                        d : path.print(),
                        className: data.open > data.close ? "down" : "up"
                    }
                });

    });
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = CandleStickModel;