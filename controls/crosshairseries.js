var _ = require("lodash"),
    PriceLabels = require("../labels/pricelabels"),
    DateTimeLabels = require("../labels/datetimelabels");

function CrossHairSeries(options) {
    this.margin = _.defaults(options.margin, {left: 0, right: 0, top: 0, bottom: 0});
    this.canvasWidth = options.width - this.margin.left - this.margin.right;
    this.canvasHeight = options.height - this.margin.top - this.margin.bottom;

    // X-axis cross-hair
    var path = [];
    path.push("M" + "0" + "," + 0);
    path.push("L" + this.canvasWidth + "," + 0);
    this.xAxisGroup = {
                    path: {
                        pathStr : path.join(""),
                        stroke: "black",
                        transformStr: "T-50,-50",
                        "stroke-dasharray":"2, 2"
                    },
                    rect: {
                        x: this.canvasWidth,
                        y: -10,
                        width: this.margin.right,
                        height: 20
                    },
                    label: {
                        x: this.canvasWidth,
                        y: 3,
                        text: "38.05"
                    }
                };

    // y-axis cross-hair
    var path = [];
    path.push("M" + 0 + "," + this.canvasHeight);
    path.push("L" + 0 + "," + "0");
    this.yAxisGroup = {
                    path: {
                        pathStr : path.join(""),
                        stroke: "black",
                        "stroke-dasharray":"2, 2",
                        transformStr: "T-50,-50"
                    },
                    rect: {
                        x: -40,
                        y: this.canvasHeight + 2,
                        width: 80,
                        height: 20
                    },
                    label: {
                        x: -35,
                        y: this.canvasHeight + 15,
                        text: "2014-01-25"
                    }
                };
}

CrossHairSeries.prototype.updateTransform = function (mouseX, mouseY) {
    this.xAxisGroup.path.transformStr = "T0," + mouseY;
    this.yAxisGroup.path.transformStr = "T" + mouseX + ",0";
}

CrossHairSeries.prototype.toPlotX = function (dataX) {
    return formatNumber(this.margin.left + (this.xUnitScale * dataX) + this.candleLeftMargin);
}

CrossHairSeries.prototype.toPlotY = function (dataY) {
    return formatNumber(this.margin.top + this.canvasHeight - ((dataY - this.extendedMin) / this.yUnitScale));
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = CrossHairSeries;
