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


    this.barHeight = 200;
    this.xUnitScale = options.width / options.data.series.length;
    this.yUnitScale = this.barHeight/options.data.series.maxVolume;
    this.barWidth = (this.xUnitScale * 86/100.0); //candle takes 86% of the total space allowed (for now)
    this.barLeftMargin = (this.xUnitScale * 7/100.0);  //center the candle in the available space (100-86/2)

    console.log(options.data.series.minVolume, options.data.series.maxVolume);

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
    return formatNumber(this.xUnitScale * dataX + this.barLeftMargin);
}

VolumeSeries.prototype.toPlotY = function (dataY) {
     return formatNumber(this.options.height - dataY * this.yUnitScale);
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = VolumeSeries;

