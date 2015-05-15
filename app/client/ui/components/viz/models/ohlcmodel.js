var _ = require("lodash");
var PathHelper = require("paths-js/path");

/*
    <svg width="90%" height="90%"><g>
    <path id="k9ffd8001"
          d="M10 10 H 90"
          stroke="#808600"
          stroke-width="3"
          transform="rotate(0 0 0)"
          stroke-linecap="square"
          stroke-linejoin="round"
          fill="#a0a700"></path>
    </g></svg>
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
function OHLCModel(chartInfo) {
    var self = this;

    this.elements = [];

    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    var priceData = chartInfo.priceData;
    var extendedPrices = chartInfo.extendedPrices;
    var scaleRatio = chartInfo.scaleRatio;

    var barMargin = (scaleRatio.x * 15/100.0); // leave 15% margin on either side of the ohlc box
    var barCenter  = (scaleRatio.x * 50/100.0); // center of the ohlc box

    var toPlotY = _.curry(function (margin, canvas, extendedPrices, scaleRatio, dataY) {
        return formatNumber(margin.top + canvas.height  - ((dataY - extendedPrices.min) * scaleRatio.y));
    })(margin, canvas, extendedPrices, scaleRatio);

    var toPlotX = _.curry(function (margin, scaleRatio, marginOffset, dataX) {
        return formatNumber(margin.left + scaleRatio.x * dataX + marginOffset);
    })(margin, scaleRatio);

    _.forEach(priceData.series, function(data, index) {
        var above, below;
        if (data.open > data.close) {
            above = data.open;
            below = data.close;
        } else {
            above = data.close;
            below = data.open;
        }

        var path = PathHelper()
                    .moveto(toPlotX(barCenter, index), toPlotY(data.high))
                    .lineto(toPlotX(barCenter, index), toPlotY(data.low)) //high-low vertical line
                    .moveto(toPlotX(barMargin, index), toPlotY(above))
                    .lineto(toPlotX(barCenter + barMargin, index), toPlotY(above)) //open/close (above) right tick
                    .moveto(toPlotX(barCenter, index), toPlotY(below))
                    .lineto(toPlotX(barMargin, index), toPlotY(below)) //open/close (below) left tick
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

module.exports = OHLCModel;