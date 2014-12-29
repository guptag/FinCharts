var _ = require("lodash");
var PathHelper = require("paths-js/path");

/**
 * [GridXModel description]
 * @param {[type]} options {
 *           chartPositionRect: <rect>,
 *           canvas: {},
 *           margin: {},
 *           priceMarkers: {},
 *           extendedPrices: {},
 *           scaleRatio: {}
 * }
 */
function GridXModel(options) {
    var self = this;
    this.margin = options.margin;
    this.canvas = options.canvas;
    this.chartPositionRect = options.chartPositionRect;
    this.priceMarkers = options.priceMarkers;
    this.extendedPrices = options.extendedPrices;
    this.scaleRatio = options.scaleRatio;

    // X-axis bar
    var path = PathHelper();
    path.moveto(0, this.margin.top + this.canvas.height);
    path.lineto(this.chartPositionRect.width, this.margin.top + this.canvas.height);
    path.closepath();

    this.elements = [];

    this.elements.push({
                type: "path",
                props: {
                    pathStr : path.print(),
                    className: "axis"
                }
            });

    // X-axis ticks (represents price)
    this.priceMarkers.shift(); //remove first price item which aligns on x-axis
    _.each(this.priceMarkers, function(valueMarker) {
            var path = PathHelper()
                        .moveto(self.margin.left + "," + self.toPlotY(valueMarker))
                        .lineto((self.margin.left + self.canvas.width + 5 /* ext tick for label */) + "," + self.toPlotY(valueMarker)) //x-axis ticc
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
                    x: self.margin.left + self.canvas.width + 6.5 /* beyond extended tick */,
                    y: self.toPlotY(valueMarker) + 3.35 /* center vertically */,
                    className: "pricelabel"
                },
                children: +valueMarker.toFixed(3)
            });
        });



}

GridXModel.prototype.toPlotY = function (dataY) {
    return formatNumber(this.margin.top + this.canvas.height  - ((dataY - this.extendedPrices.min) * this.scaleRatio.y));
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = GridXModel;