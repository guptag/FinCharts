/** @jsx React.DOM */

var React = require("react/addons");

var Candle = require("../elements/candle.react");

var CandleStickChart = React.createClass({
    render: function() {
        return (
            <g className="candles">
                <Candle/>
            </g>
        );
    }
});

module.exports = CandleStickChart;