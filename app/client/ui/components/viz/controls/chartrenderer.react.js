/** @jsx React.DOM */

var React = require("react/addons");
var CandleStickRenderer = require("ui/components/viz/renderers/candlestick.react");
var OHLCRenderer = require("ui/components/viz/renderers/ohlc.react");

var ChartRenderer = React.createClass({
    render: function() {
        //var chartInfo = this.props.chartModel.chartInfo;

        return (
            <CandleStickRenderer chartModel={this.props.chartModel}/>
        );
    }
});

module.exports = ChartRenderer;
