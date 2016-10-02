var _ = require("lodash");
var PathHelper = require("paths-js/path");

/**
 * [LineModel description]
 * @param {[type]} chartInfo {
 *           positionRect: <rect>,
 *           canvas: {},
 *           margin: {},
 *           priceMarkers: {},
 *           extendedPrices: {},
 *           scaleRatio: {}
 * }
 */
function LineModel(chartInfo) {
    var self = this;

    this.elements = [];

    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    //var positionRect = chartInfo.positionRect;
    var priceData = chartInfo.priceData;
    //var priceMarkers = chartInfo.priceMarkers;
    var extendedPrices = chartInfo.extendedPrices;
    var scaleRatio = chartInfo.scaleRatio;

    var center = (scaleRatio.x * 50/100.0); // draw the line at the center

    var toPlotY = _.curry(function (margin, canvas, extendedPrices, scaleRatio, dataY) {
        return formatNumber(margin.top + canvas.height  - ((dataY - extendedPrices.min) * scaleRatio.y));
    })(margin, canvas, extendedPrices, scaleRatio);

    var toPlotX = _.curry(function (margin, scaleRatio, dataX) {
        return formatNumber(margin.left + scaleRatio.x * dataX);
    })(margin, scaleRatio);

    //console.log(options.data.series.minVolume, options.data.series.maxVolume);

    var pathClass = priceData.series.length > 0 ?
                       (priceData.series[priceData.series.length - 1].close > priceData.series[0].close ? "up" : "down") :
                       "up";

    // line path - for stroke
    var path = PathHelper();
    _.forEach(priceData.series, function(data, index) {
        if (index === 0) {
            path = path.moveto(toPlotX(index) + center, toPlotY(data.close));
        } else {
            path = path.lineto(toPlotX(index) + center, toPlotY(data.close));
        }
    });
    path.closepath();

    self.elements.push({
        type: "path",
        props: {
            d : path.print(),
            className: "line-path " + pathClass
        }
    });

    // area path - polygon covering the region beneath the price line
    path = PathHelper();
    path = path.moveto(toPlotX(0) + center, toPlotY(extendedPrices.min));
    _.forEach(priceData.series, function(data, index) {
        path = path.lineto(toPlotX(index) + center, toPlotY(data.close));
    });
    path = path.lineto(toPlotX(priceData.series.length - 1) + center, toPlotY(extendedPrices.min));
    path.closepath();

    self.elements.push({
        type: "path",
        props: {
            d : path.print(),
            className: "area-path " + pathClass
        }
    });
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = LineModel;
