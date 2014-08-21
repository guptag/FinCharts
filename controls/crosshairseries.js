var _ = require("lodash"),
    PriceLabels = require("../labels/pricelabels"),
    DateTimeLabels = require("../labels/datetimelabels");

function CrossHairSeries(options) {
    this.margin = _.defaults(options.margin, {left: 0, right: 0, top: 0, bottom: 0});
    this.canvasWidth = options.width - this.margin.left - this.margin.right;
    this.canvasHeight = options.height - this.margin.top - this.margin.bottom;
    this.priceMin = options.priceMin;
    this.priceMax = options.priceMax;


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
    // price
    var price = this.toPrice(mouseY);
    if (price > 0) {
        this.xAxisGroup.path.transformStr = "T0," + mouseY;
        this.xAxisGroup.label.text = this.toPrice(mouseY);
    } else {
        this.xAxisGroup.path.transformStr = "T0,-50";
        this.xAxisGroup.label.text = "";
    }

    // date
    var date = this.toDate(mouseX);
    if (date) {
        this.yAxisGroup.path.transformStr = "T" + mouseX + ",0";
        this.yAxisGroup.label.text = mouseX;
    } else {
        this.yAxisGroup.path.transformStr = "T-50,0";
        this.yAxisGroup.label.text = "";
    }
}

CrossHairSeries.prototype.toPrice = function (mouseY) {
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

CrossHairSeries.prototype.toDate = function (mouseX) {
    // mouse pointer beyond chart boundaries
    if (mouseX < this.margin.left || mouseX > (this.margin.left + this.canvasWidth)) {
        return;
    }

    return mouseX;
}

function formatNumber(number) {
    return +number.toFixed(2);
}

module.exports = CrossHairSeries;
