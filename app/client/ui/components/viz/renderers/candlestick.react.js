/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash");

var CandleStickModel = require("ui/components/viz/models/candlestickmodel");

var CandleSticks = React.createClass({
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var candleStickModel = new CandleStickModel(chartInfo);

        var childElements = _.map(candleStickModel.elements, function (element) {
            return React.DOM[element.type](element.props, element.children);
        });

        return (
            <g className="candles">
                {childElements}
            </g>
        );
    }
});

module.exports = CandleSticks;