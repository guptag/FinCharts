var _ = require("lodash");
var PathHelper = require("paths-js/path");

/**
 * [GridXModel description]
 * @param {[type]} chartInfo {
 *           positionRect: <rect>,
 *           canvas: {},
 *           margin: {},
 *           priceMarkers: {},
 *           extendedPrices: {},
 *           scaleRatio: {}
 * }
 */
function GridXModel(chartInfo) {
    var self = this;

    this.elements = [];

    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    var positionRect = chartInfo.positionRect;
    var priceMarkers = _.clone(chartInfo.priceMarkers);
    var extendedPrices = chartInfo.extendedPrices;
    var scaleRatio = chartInfo.scaleRatio;

    var toPlotY = _.curry(function (margin, canvas, extendedPrices, scaleRatio, dataY) {
        return formatNumber(margin.top + canvas.height  - ((dataY - extendedPrices.min) * scaleRatio.y));
    })(margin, canvas, extendedPrices, scaleRatio);

    // X-axis bar
    var path = PathHelper()
                .moveto(0, margin.top + canvas.height)
                .lineto(positionRect.width, margin.top + canvas.height)
                .closepath();

    this.elements.push({
                type: "path",
                props: {
                    d : path.print(),
                    className: "axis"
                }
            });

    // X-axis ticks (represents price)
    priceMarkers.shift(); //remove first price item which aligns on x-axis

    _.each(priceMarkers, function(valueMarker) {
            var path = PathHelper()
                        .moveto(margin.left + "," + toPlotY(valueMarker))
                        .lineto((margin.left + canvas.width + 5 /* ext tick for label */) + "," + toPlotY(valueMarker)) //x-axis ticc
                        .closepath();

            self.elements.push({
                type: "path",
                props: {
                    d: path.print(),
                    className: "axis"
                }
            });

            self.elements.push({
                type: "text",
                props: {
                    x: margin.left + canvas.width + 6.5 /* beyond extended tick */,
                    y: toPlotY(valueMarker) + 3.35 /* center vertically */,
                    className: "pricelabel"
                },
                children: +valueMarker.toFixed(3)
            });
        });
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = GridXModel;