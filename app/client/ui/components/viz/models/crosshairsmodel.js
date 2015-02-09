var _ = require("lodash");
var moment = require("moment");
var PathHelper = require("paths-js/path");

/**
 * [CrosshairModel description]
 * @param {[Object]} chartInfo {
 *           positionRect: <rect>,
 *           canvas: {},
 *           margin: {},
 *           priceMarkers: {},
 *           extendedPrices: {},
 *           scaleRatio: {}
 * }
 * @param {[Object]} mousePosition {
 *           x: <number>
 *           y: <number>
 * }
 */
function CrosshairModel(chartInfo, mousePosition, events) {
    this.elements = generateElements(chartInfo, mousePosition, events);
}

function generateElements(chartInfo, mousePosition, events) {
    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    var positionRect = chartInfo.positionRect;

    mousePosition = mousePosition || {x: -50, y: -50};

    var elements = [];

    var price = getPrice(chartInfo, mousePosition.y);
    var dateAndPosition = getDateAndAxisPosition(chartInfo, mousePosition.x);

    // X-axis cross-hair (price)
    if (_.isFinite(price)) {
        var path = PathHelper()
                .moveto(0, 0)
                .lineto(canvas.width, 0)
                .closepath();

        elements.push({
            type: "g",
            id: "crosshairX",
            props: {
                className: "value-axis",
                transform: "translate(0," + mousePosition.y + ")"
            },
            elements: [
                {
                    type: "path",
                    id: "crosshairX-path",
                    props: {
                        d : path.print(),
                        className: "axis"
                    }
                },
                {
                    type: "rect",
                    id: "crosshairX-rect",
                    props: {
                        x: canvas.width + 2,
                        y: -10,
                        width: margin.right + 2,
                        height: 20,
                        className: "label-box"
                    }
                },
                {
                    type: "text",
                    id: "crosshairX-text",
                    props: {
                        x: canvas.width + 4,
                        y: 3,
                        className: "label"
                    },
                    elements: formatNumber(price, 2) || ""
                }
            ]
        });
    }

    // y-axis cross-hair (date)
    if (dateAndPosition && dateAndPosition.date && _.isFinite(dateAndPosition.position)) {
        var path = PathHelper()
                    .moveto(0, canvas.height)
                    .lineto(0, 0)
                    .closepath();

        elements.push({
            type: "g",
            id: "crosshairY",
            props: {
                className: "time-axis",
                transform: "translate(" + dateAndPosition.position + ", 0)"
            },
            elements: [
                {
                    type: "path",
                    id: "crosshairY-path",
                    props: {
                        d : path.print(),
                        className: "axis"
                    }
                },
                {
                    type: "rect",
                    id: "crosshairY-rect",
                    props: {
                        x: -35,
                        y: canvas.height + 4,
                        width: 70,
                        height: 20,
                        className: "label-box"
                    }
                },
                {
                    type: "text",
                    id: "crosshairY-text",
                    props: {
                        x: -28,
                        y: canvas.height + 18,
                        className: "label"
                    },
                    elements: dateAndPosition.date
                }
            ]
        });
    }

    //overlay rectangle (for capturing mouseover events)
    elements.push({
        type: "rect",
        id: "crosshair-overlay",
        props: {
            className: "overlay",
            x:0,
            y:0,
            width: positionRect.width,
            height: positionRect.height,
            onMouseMove: events.onMouseMove,
            onMouseOut: events.onMouseOut
        }
    });

    return elements;
}

function getPrice(chartInfo, mouseY) {
    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    var extendedPrices = chartInfo.extendedPrices;

    // mouse pointer beyond chart boundaries
    if (mouseY < margin.top || mouseY > (margin.top + canvas.height)) {
        return;
    }

    var pricePerPixel = (extendedPrices.max - extendedPrices.min) / canvas.height;

    // price axis grows from bottom to top
    // 10px from top (in drawing space) ---> 90px from bottom (in a 100x100 rect)
    var translateY = (canvas.height + margin.top) - mouseY;

    return formatNumber(extendedPrices.min + (translateY * pricePerPixel));
};

function getDateAndAxisPosition(chartInfo, mouseX) {
    var margin = chartInfo.margin;
    var canvas = chartInfo.canvas;
    var scaleRatio = chartInfo.scaleRatio;
    var priceData = chartInfo.priceData;

    var tickMargin = scaleRatio.x / 2;

    // mouse pointer beyond chart boundaries
    if (mouseX < margin.left || mouseX > (margin.left + canvas.width)) {
        return;
    }

    var index = Math.floor( (mouseX - margin.left) / scaleRatio.x );

    if (!priceData.series[index]) {
        console.error("Invalid Index - ", "mouseX:", mouseX, "index:", index);
        return;
    }

    //var date = new Date(priceData.series[index].date);
    //var dateStr = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
    var dateStr = moment.utc(priceData.series[index].date).format("MM-DD-YYYY");
    var position = formatNumber(margin.left + (scaleRatio.x * index + tickMargin));

    return {
        position: position,
        date: dateStr
    }
};


function formatNumber(number, digits) {
    return +number.toFixed(_.isFinite(digits) ? digits : 3);
}

module.exports = CrosshairModel;