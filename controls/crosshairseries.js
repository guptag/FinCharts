var _ = require("lodash"),
    PriceLabels = require("../labels/pricelabels"),
    DateTimeLabels = require("../labels/datetimelabels");

function CrossHairSeries(options) {
    this.margin = _.defaults(options.margin, {left: 0, right: 0, top: 0, bottom: 0});
    this.canvasWidth = options.width - this.margin.left - this.margin.right;
    this.canvasHeight = options.height - this.margin.top - this.margin.bottom;
    this.priceMin = options.priceMin;
    this.priceMax = options.priceMax;

    this.data = options.data;

    this.xUnitScale = this.canvasWidth / this.data.series.length;
    this.tickMargin = (this.xUnitScale/2);



    // X-axis cross-hair (price)
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
                        x: this.canvasWidth + 2,
                        y: -10,
                        width: this.margin.right + 2,
                        height: 20
                    },
                    label: {
                        x: this.canvasWidth + 4,
                        y: 3,
                        text: "38.05"
                    }
                };

    // y-axis cross-hair (date)
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
                        x: -35,
                        y: this.canvasHeight + 4,
                        width: 70,
                        height: 20
                    },
                    label: {
                        x: -28,
                        y: this.canvasHeight + 18,
                        text: "2014-01-25"
                    }
                };
}

CrossHairSeries.prototype.updateTransform = function (mouseX, mouseY) {
    // price
    var price = this.getPrice(mouseY);
    if (price > 0) {
        this.xAxisGroup.path.transformStr = "T0," + mouseY;
        this.xAxisGroup.label.text = price;
    } else {
        this.xAxisGroup.path.transformStr = "T0,-50";
        this.xAxisGroup.label.text = "";
    }

    // date
    var result = this.getDateAndAxisPosition(mouseX);
    if (result) {
        this.yAxisGroup.path.transformStr = "T" + result.position + ",0";
        this.yAxisGroup.label.text = result.date;
    } else {
        this.yAxisGroup.path.transformStr = "T-50,0";
        this.yAxisGroup.label.text = "";
    }
}

CrossHairSeries.prototype.getPrice = function (mouseY) {
    // mouse pointer beyond chart boundaries
    if (mouseY < this.margin.top || mouseY > (this.margin.top + this.canvasHeight)) {
        return -1;
    }

    var pricePerPixel = (this.priceMax - this.priceMin) / this.canvasHeight;

    // 10px from top (in drawing space) ---> 90px from bottom (in a 100x100 rect)
    // price axis grows from bottom to top
    var translateY = (this.canvasHeight + this.margin.top) - mouseY;

    return formatNumber(this.priceMin + (translateY * pricePerPixel));
}

CrossHairSeries.prototype.getDateAndAxisPosition = function (mouseX) {
    // mouse pointer beyond chart boundaries
    if (mouseX < this.margin.left || mouseX > (this.margin.left + this.canvasWidth)) {
        return;
    }

    var index = Math.floor( (mouseX - this.margin.left) / this.xUnitScale );
    var date = new Date(this.data.series[index].date);
    var dateStr = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();

    var position = formatNumber(this.margin.left + (this.xUnitScale * index + this.tickMargin));

    return {
        position: position,
        date: dateStr
    }
}

function formatNumber(number) {
    return +number.toFixed(2);
}

module.exports = CrossHairSeries;
