/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash"),
    AppContext = require("ui/core/appcontext");

var ChartPreview = React.createClass({
    getInitialState: function () {
        return {
            currentIndex: -1
        };
    },
    configureAnimate: function () {
        var self = this;

        if (this.intervalId) {
            return;
        }

        this.intervalId = window.setInterval(function () {
            self.setState({
                currentIndex: self.state.currentIndex + 1
            });
        }, 50);
    },
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var chartStore = AppContext.stores.chartStore;
        var preivewState = chartStore.getPreviewState();
        var posX = chartInfo.scaleRatio.x * (this.state.currentIndex + 1) + 2;

        if (this.state.currentIndex > chartInfo.priceData.series.length || preivewState === "stop") {
            preivewState = "stop";
            window.clearInterval(this.intervalId);
            this.intervalId = null;
            //todo: update state
        }

        var previewRect = {
            x: posX,
            top: chartInfo.margin.top,
            width: chartInfo.canvas.width - posX,
            height: chartInfo.canvas.height,
            className: "chartpreview " + (preivewState === "stop" ? "hide" : "")
        };

        this.configureAnimate();

        return (
            <g className="chartpreview">
                <rect x={previewRect.x} y={previewRect.y} width={previewRect.width} height={previewRect.height} className={previewRect.className}></rect>
            </g>
        );
    }
});

module.exports = ChartPreview;

/*
return (
            <g className="chartpreview">
                <rect x="0" y="0" width="1388" height="638" className="rect"></rect>
            </g>
        );
    }

 */