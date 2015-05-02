/** @jsx React.DOM */

var React = require("react/addons");
var moment = require("moment");

var ChartInfo = React.createClass({
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var ticker = chartInfo.ticker.toUpperCase();
        var duration = chartInfo.duration;
        var timeframe = chartInfo.timeframe;

        var timeframeStr =  moment(timeframe.from).format("ll") +
                                " - " +
                                moment(timeframe.to).format("ll")

        var tickerAndDuration = ticker + " " + "(" + duration + ")";

        return (
            <g className="chart-info" transform="translate(10, 30)">
                <text x="0" y="0" className="ticker">{tickerAndDuration}</text>
                <text x="0" y="20" className="range">{timeframeStr}</text>
            </g>
        );
    }
});

module.exports = ChartInfo;
