/** @jsx React.DOM */

var React = require("react/addons");

var ChartInfo = React.createClass({
    render: function() {
        return (
            <g className="chart-info" transform="translate(10, 30)">
                <text x="0" y="0" className="ticker">MSFT</text>
                <text x="0" y="20" className="range">1 Jan 2014 - 10 Oct 2014</text>
                <text x="160" y="20" className="period">(weekly)</text>
            </g>
        );
    }
});

module.exports = ChartInfo;