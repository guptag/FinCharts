/** @jsx React.DOM */

var React = require("react/addons"),
    DeferredEvents = require("ui/core/events/deferredevents");

var ChartPreview = React.createClass({
    getInitialState: function () {
        return {
            currentIndex: -1,
            previewState: "stop"
        };
    },
    componentWillMount: function () {
        // chart id won't change for this preview instance
        // no need to rebind in "componentwillreceiveprops"
        var chartId = this.props.chartModel.chartInfo.chartId;
        DeferredEvents.register(chartId + DeferredEvents.Keys.StartPreview, this.startPreview.bind(this));
        DeferredEvents.register(chartId + DeferredEvents.Keys.StopPreview, this.stopPreview.bind(this));
        DeferredEvents.register(chartId + DeferredEvents.Keys.PausePreview, this.pausePreview.bind(this));
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
    componentWillReceiveProps: function (/*nextProps*/) {
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

                // reset top nav preview options
                DeferredEvents.trigger(DeferredEvents.Keys.ResetPreviewOptions);
            }
        }, 350);
    },
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var preivewState = this.state.previewState;
        var posX = (chartInfo.scaleRatio.x * this.state.currentIndex) + 2;

        var previewRect = {
            x: posX,
            y: chartInfo.margin.top,
            width: chartInfo.canvas.width - posX + 2,
            height: chartInfo.canvas.height,
            className: "rect " + (preivewState === "stop" ? "hide" : "")
        };

        return (
            <g className="chartpreview">
                <rect x={previewRect.x} y={previewRect.y} width={previewRect.width} height={previewRect.height} className={previewRect.className}></rect>
            </g>
        );
    },
    componentWillUnmount: function () {
        var chartId = this.props.chartModel.chartInfo.chartId;
        DeferredEvents.clear(chartId + DeferredEvents.Keys.StartPreview);
        DeferredEvents.clear(chartId + DeferredEvents.Keys.StopPreview);
        DeferredEvents.clear(chartId + DeferredEvents.Keys.PausePreview);
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
