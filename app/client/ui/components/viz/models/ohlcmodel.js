var _ = require("lodash");
var PathHelper = require("paths-js/path");

/*
   http://stockcharts.com/school/doku.php?id=chart_school:overview:technical_analysis_4
 */

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
function OHLCModel(chartInfo, showOpen) {
    var self = this;

    this.elements = [];

    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    var priceData = chartInfo.priceData;
    var extendedPrices = chartInfo.extendedPrices;
    var scaleRatio = chartInfo.scaleRatio;

    var barLeftMargin = (scaleRatio.x * 10/100.0); // leave x% margin on left side of the ohlc box
    var barRightMargin = (scaleRatio.x * 90/100.0); // leave x% margin on right side of the ohlc box
    var barCenter  = (scaleRatio.x * 50/100.0); // center of the ohlc box

    var toPlotY = _.curry(function (margin, canvas, extendedPrices, scaleRatio, dataY) {
        return formatNumber(margin.top + canvas.height  - ((dataY - extendedPrices.min) * scaleRatio.y));
    })(margin, canvas, extendedPrices, scaleRatio);

    var toPlotX = _.curry(function (margin, scaleRatio, marginOffset, dataX) {
        return formatNumber(margin.left + scaleRatio.x * dataX + marginOffset);
    })(margin, scaleRatio);

    _.forEach(priceData.series, function(data, index) {
        var path;
        if (showOpen) {
            path = PathHelper()
                    .moveto(toPlotX(barCenter, index), toPlotY(data.high))
                    .lineto(toPlotX(barCenter, index), toPlotY(data.low)) //high-low vertical line
                    .moveto(toPlotX(barCenter, index), toPlotY(data.close))
                    .lineto(toPlotX(barRightMargin, index), toPlotY(data.close)) //(close) right tick
                    .moveto(toPlotX(barCenter, index), toPlotY(data.open))
                    .lineto(toPlotX(barLeftMargin, index), toPlotY(data.open)) //(open) left tick
                    .closepath();
        } else {
            path = PathHelper()
                    .moveto(toPlotX(barCenter, index), toPlotY(data.high))
                    .lineto(toPlotX(barCenter, index), toPlotY(data.low)) //high-low vertical line
                    .moveto(toPlotX(barCenter, index), toPlotY(data.close))
                    .lineto(toPlotX(barRightMargin, index), toPlotY(data.close)) //(close) right tick
                    .closepath();

        }

        var color = (index === 0) ? (data.open > data.close ? "down" : "up")
                                  : (data.close < priceData.series[index-1].close ? "down" : "up");


        self.elements.push({
                    type: "path",
                    props: {
                        d : path.print(),
                        className: color
                    }
                });

    });
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = OHLCModel;
