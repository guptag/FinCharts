var Q = require('q'),
    PriceLabels = require("../labels/pricelabels"),

    _ = require('lodash');

//http://codepen.io/anon/pen/LvgIb?editors=001

var ChartPreview = function (options) {
    var self = this;
    this.margin = _.defaults(options.margin, {left: 0, right: 0, top: 0, bottom: 0});

    console.log("chart preview", this.margin, options);

    this.canvasWidth = options.width - this.margin.left - this.margin.right;
    this.canvasHeight = options.height - this.margin.top - this.margin.bottom;

    this.priceMin = options.priceMin;
    this.priceMax = options.priceMax;

    var labels = PriceLabels.generate(options.data.series.min, options.data.series.max, this.canvasHeight);
    console.log(labels, options.data.series.min, options.data.series.max, this.canvasHeight);
    this.extendedMin = labels[0];
    this.extendedMax = labels[labels.length - 1];

    this.data = options.data;

    this.xUnitScale = this.canvasWidth / this.data.series.length;
    this.yUnitScale = this.canvasHeight / (this.extendedMax - this.extendedMin);

    this.timerCb = options.timerCb || function () {
            return 500;
        }
    this.onPreviewComplete = options.onPreviewComplete || _.noop;

    var s;

    var previewGroup, previewRect, previewAxis,
        highMarker, lowMarker, openPoint, closePoint,
        spreadMarker, closePriceText;

    var currentIndex = 0;
    var previewState = "";


    this.init = function (snapElt) {
       s = snapElt;
       generatePreviewElements();
    }

    this.play = function () {
        if (!s) { return; }

        previewGroup.removeClass("hide");
        previewState = "play";
        configureAnimate();
    }

    this.pause = function () {
        if (!s) { return; }

        if (previewState !== "pause") {
          previewState = "pause";

          previewRect.stop();
          highMarker.stop();
          lowMarker.stop();
          openPoint.stop();
          closePoint.stop();
          spreadMarker.stop();
          closePriceText.stop();
        } else {
          this.play();
        }
    }

    this.stop = function () {
        if (!s) { return; }
        previewGroup.addClass("hide");
        currentIndex = 0;
        previewState = "stop";
    }

    function configureAnimate() {
        window.setTimeout(function () {
            if (previewState !== "play") {
                return;
            }

            console.log(currentIndex, self.data.series.length)
            if (currentIndex >= self.data.series.length) {
                self.onPreviewComplete();
                currentIndex = 0;
            } else {
                slidePreview();
                Q.delay(0).then(function () {
                    currentIndex+=1;
                    configureAnimate();
                });
            }
        }, self.timerCb());
    }

    function generatePreviewElements() {
        previewGroup = s.group().attr("class", "chart-preview hide");

        previewRect = s.rect(self.margin.left, self.margin.top, self.canvasWidth, self.canvasHeight)
                       .attr( {"class": "preview-rect", "fill" : "white"});
        previewGroup.add(previewRect);

       /* previewAxis = s.line(0, 0, 0,  self.canvasHeight)
                          .attr( {"class": "preview-axis", "stroke" : "black"});
        previewGroup.add(previewAxis); */

        openPoint = s.circle(0, 0, 4).attr({"fill": "#000"});
        previewGroup.add(openPoint);

        closePoint = s.circle(0, 0, 4).attr({"fill": "#000"});
        previewGroup.add(closePoint);

        highMarker = s.line(0 - 8, 0, 0 + 8, 0)
                      .attr({
                        "stroke" : "#000",
                        "stroke-width" : 1
                      });
        previewGroup.add(highMarker);

        lowMarker = s.line(0 - 8, 0, 0 + 8, 0)
                      .attr({
                        "stroke" : "#000",
                        "stroke-width" : 1
                      });
        previewGroup.add(lowMarker);

        spreadMarker = s.line(0, 0, 0, 0)
                      .attr({
                        "stroke" : "#000",
                        "stroke-width" : 2
                      });
        previewGroup.add(spreadMarker);

        closePriceText = s.text(0, 0, "").attr("class", "preview-closetext");
        previewGroup.add(closePriceText);
    }

    function slidePreview () {
        //console.log(self.data, currentIndex);
      var priceOpen = self.data.series[currentIndex].open;
      var priceClose = self.data.series[currentIndex].close;
      var priceHigh = self.data.series[currentIndex].high;
      var priceLow = self.data.series[currentIndex].low;


      var priceOpenY = self.toPlotY(priceOpen);
      priceCloseY = self.toPlotY(priceClose);
      priceHighY = self.toPlotY(priceHigh);
      priceLowY = self.toPlotY(priceLow);
      color = (priceOpen > priceClose) ? "red" : "green";

      var posX = self.xUnitScale * (currentIndex + 1) + 2;
      var posXOffset = posX + 15;

      previewRect.attr({
        x: posX,
        width: self.canvasWidth - posX
      });

      /*previewAxis.attr({
        x1: posXOffset,
        x2: posXOffset,
      });*/

      openPoint.stop().attr({
        cx: posXOffset
      }).animate({
        cy: priceOpenY,
        "fill": color
      }, 100, window.mina.easein);

      closePoint.stop().attr({
        cx: posXOffset
      }).animate({
        cy: priceCloseY,
        "fill": color
      }, 100, window.mina.easein);

      highMarker.stop().animate({
        x1: posXOffset - 8,
        x2: posXOffset + 8,
        y1: priceHighY,
        y2: priceHighY,
        "stroke" : color
      }, 100);

      lowMarker.stop().animate({
        x1: posXOffset - 8,
        x2: posXOffset + 8,
        y1: priceLowY,
        y2: priceLowY,
        "stroke" : color
      }, 100);

      spreadMarker.stop().animate({
        x1: posXOffset,
        x2: posXOffset,
        y1: priceHighY,
        y2: priceLowY,
        "stroke" : color
      }, 100, window.mina.easein);
    }
};

ChartPreview.prototype.toPlotY = function (dataY) {
    return formatNumber(this.margin.top + this.canvasHeight  - ((dataY - this.extendedMin) * this.yUnitScale));
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = ChartPreview;
