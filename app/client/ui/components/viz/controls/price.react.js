/** @jsx React.DOM */

var React = require("react/addons");
var CandleStickRenderer = require("ui/components/viz/renderers/candlestick.react");
var OHLCRenderer = require("ui/components/viz/renderers/ohlc.react");
var LineRenderer = require("ui/components/viz/renderers/line.react");
var AreaRenderer = require("ui/components/viz/renderers/area.react");

var Price = React.createClass({
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var renderer = chartInfo.renderer;

        var RendererType;
        switch (renderer) {
            case "candlesticks": RendererType = CandleStickRenderer; break;
            case "ohlc": RendererType = OHLCRenderer; break;
            case "hlc":  RendererType = OHLCRenderer; break;
            case "line": RendererType = LineRenderer; break;
            case "area": RendererType = AreaRenderer; break;
            default: RendererType = CandleStickRenderer; break;
        }

        var showOpen = false;
        if (renderer === "ohlc") { showOpen = true; }

       return (
            React.createElement(RendererType, {chartModel: this.props.chartModel, showOpen: showOpen})
        );
    }
});

module.exports = Price;
