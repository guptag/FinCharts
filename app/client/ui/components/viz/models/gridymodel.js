var _ = require("lodash");
var PathHelper = require("paths-js/path");

/**
 * [GridYModel description]
 * @param {[type]} chartInfo {
 *           positionRect: <rect>,
 *           canvas: {},
 *           margin: {},
 *           priceMarkers: {},
 *           extendedPrices: {},
 *           scaleRatio: {}
 * }
 */
function GridYModel(chartInfo) {
    var self = this;

    this.elements = [];

    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    var positionRect = chartInfo.positionRect;
    var datetimeMarkers = chartInfo.datetimeMarkers;
    var extendedPrices = chartInfo.extendedPrices;
    var scaleRatio = chartInfo.scaleRatio;
    var tickMargin = chartInfo.tickMargin;

    var toPlotX = _.curry(function (margin, scaleRatio, tickMargin, dataX) {
        return formatNumber(margin.left + scaleRatio.x * dataX + tickMargin);
    })(margin, scaleRatio, tickMargin);

    // Y-axis bar
    var path = PathHelper()
                .moveto(margin.left + canvas.width, positionRect.height)
                .lineto(margin.left + canvas.width, margin.top + canvas.height)
                .closepath();

    this.elements.push({
            type: "path",
            props: {
                d : path.print(),
                className: "axis"
            }
        });

    // Y-axis ticks (represents datetime labels)
    _.each(datetimeMarkers, function(labelItem) {
        var dataIndex = labelItem.dataItemIndex;

        var labelPullBack;
        switch (labelItem.label.length) {
            case 4: labelPullBack = 14; break;
            case 3: labelPullBack = 10; break;
            case 2: labelPullBack = 7; break;
            case 1: labelPullBack = 4; break;
        };

        var path = PathHelper()
                        .moveto(toPlotX(dataIndex), margin.top)
                        .lineto(toPlotX(dataIndex), (margin.top + canvas.height + 5/* ext for label */)) //y-axis tick
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
                x: toPlotX(dataIndex) - labelPullBack /* based of length of chars */,
                y: margin.top + canvas.height + 17,
                className: "datetimelabel" + (labelItem.isMonthLabel ? " month" : (labelItem.isYearLabel ? " year" : ""))
            },
            children: labelItem.label
        });
    });
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = GridYModel;