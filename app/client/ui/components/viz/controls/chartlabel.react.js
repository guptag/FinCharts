/** @jsx React.DOM */

var React = require("react/addons");
var moment = require("moment");
var AppContext = require("ui/core/appcontext");

var ChartInfo = React.createClass({
    render: function() {
        var chartStore = AppContext.stores.chartStore;
        var ticker = chartStore.getTicker();
        var duration = chartStore.getDuration();
        var timeframe = chartStore.getTimeframe();

        var timeframeStr =  moment(timeframe.from).format("ll") +
                                " - " +
                                moment(timeframe.to).format("ll")

        var durationStr = "(" + duration + ")";

        return (
            <g className="chart-info" transform="translate(10, 30)">
                <text x="0" y="0" className="ticker">{ticker}</text>
                <text x="0" y="20" className="range">{timeframeStr}</text>
                <text x="180" y="20" className="period">{durationStr}</text>
            </g>
        );
    }
});

module.exports = ChartInfo;