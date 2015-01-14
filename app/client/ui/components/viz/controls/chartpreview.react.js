/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash"),
    AtomConstants = require("ui/core/atomconstants"),
    AppContext = require("ui/core/appcontext");

var ChartPreview = React.createClass({
    getInitialState: function () {
        return {
            currentIndex: -1,
            previewState: "stop"
        };
    },
    componentWillMount: function () {
        AtomConstants.deferredActions.chartPreview.start.resolve(this.startPreview.bind(this));
        AtomConstants.deferredActions.chartPreview.stop.resolve(this.stopPreview.bind(this));
        AtomConstants.deferredActions.chartPreview.pause.resolve(this.pausePreview.bind(this));
    },
    startPreview: function () {
        if (this.state.previewState === "stop") {
            this.setState({
                currentIndex: 0,
                previewState: "start"
            });
        }
        this.configureAnimate();
    },
    stopPreview: function () {
        window.clearInterval(this.intervalId);
        this.intervalId = null;

        this.setState({
            currentIndex: -1,
            previewState: "stop"
        });
    },
    pausePreview: function () {
        window.clearInterval(this.intervalId);
        this.intervalId = null;

        this.setState({
            previewState: "pause"
        });
    },
    componentWillReceiveProps: function (nextProps) {
        this.stopPreview();
    },
    configureAnimate: function () {
        var self = this;

        if (this.intervalId) {
            return;
        }

        this.intervalId = window.setInterval(function () {
            var currentIndex = self.state.currentIndex;
            var chartInfo = self.props.chartModel.chartInfo;

            if (currentIndex <= chartInfo.priceData.series.length) {
                self.setState({
                    currentIndex: currentIndex + 1
                });
            } else {
                self.stopPreview();
            }
        }, 700);
    },
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var preivewState = this.state.previewState;
        var posX = (chartInfo.scaleRatio.x * this.state.currentIndex) + 2;

        var previewRect = {
            x: posX,
            y: chartInfo.margin.top,
            width: chartInfo.canvas.width - posX,
            height: chartInfo.canvas.height,
            className: "rect " + (preivewState === "stop" ? "hide" : "")
        };

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