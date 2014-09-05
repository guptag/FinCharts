var Q = require('q'),
    _ = require('lodash');

//http://codepen.io/anon/pen/LvgIb?editors=001

var ChartPreview = function (options) {
    this.margin = _.defaults(options.margin, {left: 0, right: 0, top: 0, bottom: 0});

    this.canvasWidth = options.width - this.margin.left - this.margin.right;
    this.canvasHeight = options.height - this.margin.top - this.margin.bottom;

    this.priceMin = options.priceMin;
    this.priceMax = options.priceMax;

    this.data = options.data;

    this.xUnitScale = this.canvasWidth / this.data.series.length;

    this.timerCb = options.timerCb || function () {
            return 1000;
        }

    var s;

    var previewGroup, previewRect, previewAxis,
        highMarker, lowMarker, openPoint, closePoint,
        spreadMarker, closePriceText;


    this.init = function (snapElt) {
       s = snapElt;
    }

    this.play = function () {
        if (!s) { return; }

        if (!previewGroup) { generatePreviewElements(); }
    }

    this.pause = function () {
        if (!s) { return; }

        previewRect.stop();
        previewAxis.stop();
        highMarker.stop();
        lowMarker.stop();
        openPoint.stop();
        closePoint.stop();
        spreadMarker.stop();
        closePriceText.stop();

    }

    this.stop = function () {
        if (!s) { return; }

    }

    function generatePreviewElements() {
        previewGroup = s.group().attr("class", "chart-preview");

        previewRect = s.rect(0,0, this.canvasWidth, this.canvasHeight)
                       .attr("class", "preview-rect");
        previewGroup.add(previewRect);

        previewAxis = plot.line(0, 0, 0,  this.canvasHeight)
                          .attr("class", "preview-axis");
        previewGroup.add(previewAxis);

        openPoint = plot.circle(0, 0, 4).attr({"fill": "#000"});
        previewGroup.add(openPoint);

        closePoint = plot.circle(0, 0, 4).attr({"fill": "#000"});
        previewGroup.add(closePoint);

        highMarker = plot.line(0 - 8, 0, 0 + 8, 0)
                      .attr({
                        "stroke" : "#000",
                        "stroke-width" : 1
                      });
        previewGroup.add(highMarker);

        lowMarker = plot.line(0 - 8, 0, 0 + 8, 0)
                      .attr({
                        "stroke" : "#000",
                        "stroke-width" : 1
                      });
        previewGroup.add(lowMarker);

        spreadMarker = plot.line(0, 0, 0, 0)
                      .attr({
                        "stroke" : "#000",
                        "stroke-width" : 2
                      });
        previewGroup.add(spreadMarker);

        closePriceText = plot.text(0, 0, "").attr("class", "preview-closetext");
        previewGroup.add(closePriceText);
    }



};

module.exports = ChartPreview;