var _ = require("lodash");

function VolumeSeries(options) {
    /* {
            width: plot width
            height: plot height
            data: price data (raw)
       }
    */
    var self = this;
    this.options = options;


    this.margin = _.defaults(options.margin, {left: 0, right: 0, top: 0, bottom: 0});
    this.canvasWidth = options.width - this.margin.left - this.margin.right;
    this.canvasHeight = options.height - this.margin.top - this.margin.bottom;

    this.barHeight = formatNumber(this.canvasHeight * 30 / 100);

    this.xUnitScale = this.canvasWidth / options.data.series.length;
    this.yUnitScale = this.barHeight/options.data.series.maxVolume;

    this.barWidth = (this.xUnitScale * 86/100.0); //candle takes 86% of the total space allowed (for now)
    this.barLeftMargin = (this.xUnitScale * 7/100.0);  //center the candle in the available space (100-86/2)

    //console.log(options.data.series.minVolume, options.data.series.maxVolume);

    this.bars = _.chain(options.data.series)
                        .map(function(data, index) {

                            var path = [];
                            path.push("M" + self.toPlotX(index) + "," + self.toPlotY(data.volume));
                            path.push("L" + formatNumber(self.toPlotX(index) + self.barWidth) + "," + self.toPlotY(data.volume)); //top edge
                            path.push("L" + formatNumber(self.toPlotX(index) + self.barWidth) + "," + self.toPlotY(0)); //right edge
                            path.push("L" + self.toPlotX(index) + "," + self.toPlotY(0)); //bottom edge
                            path.push("L" + self.toPlotX(index) + "," + self.toPlotY(data.volume)); //left edge

                            return {
                                pathStr : path.join(""),
                                fill : data.open > data.close ? "#FF8E79" : "#74E068",
                                stroke: "black"
                            }
                        })
                        .value();
}


VolumeSeries.prototype.toPlotX = function (dataX) {
    return formatNumber(this.margin.left + (this.xUnitScale * dataX + this.barLeftMargin));
}

VolumeSeries.prototype.toPlotY = function (dataY) {
    return formatNumber(this.margin.top + this.canvasHeight - dataY * this.yUnitScale);
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = VolumeSeries;

