var _ = require("lodash");
var PathHelper = require("paths-js/path");

/**
 * [VolumeModel description]
 * @param {[type]} chartInfo {
 *           positionRect: <rect>,
 *           canvas: {},
 *           margin: {},
 *           priceMarkers: {},
 *           extendedPrices: {},
 *           scaleRatio: {}
 * }
 */
function VolumeModel(chartInfo) {
    var self = this;

    this.elements = [];

    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    //var positionRect = chartInfo.positionRect;
    var priceData = chartInfo.priceData;

    var barHeight = formatNumber(canvas.height * 30 / 100);
    var scaleRatio = {
        x: canvas.width / priceData.series.length,
        y: barHeight / priceData.maxVolume
    };

    var barWidth = (scaleRatio.x * 86/100.0); //candle takes 86% of the total space allowed (for now)
    var barLeftMargin = (scaleRatio.x * 7/100.0);  //center the candle in the available space (100-86/2)


    var toPlotY = _.curry(function (margin, canvas, scaleRatio, dataY) {
        return formatNumber(margin.top + canvas.height  - (dataY  * scaleRatio.y));
    })(margin, canvas, scaleRatio);

    var toPlotX = _.curry(function (margin, scaleRatio, barLeftMargin, dataX) {
        return formatNumber(margin.left + (scaleRatio.x * dataX + barLeftMargin));
    })(margin, scaleRatio, barLeftMargin);

    //console.log(options.data.series.minVolume, options.data.series.maxVolume);

    _.forEach(priceData.series, function(data, index) {
        var path = PathHelper()
                    .moveto(toPlotX(index), toPlotY(data.volume))
                    .lineto(formatNumber(toPlotX(index) + barWidth), toPlotY(data.volume)) //top edge
                    .lineto(formatNumber(toPlotX(index) + barWidth), toPlotY(0)) //right edge
                    .lineto(toPlotX(index), toPlotY(0)) //bottom edge
                    .lineto(toPlotX(index), toPlotY(data.volume)) //left edge
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

module.exports = VolumeModel;