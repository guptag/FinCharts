/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash");

var OHLCModel = require("ui/components/viz/models/ohlcmodel");

var OHLCBars = React.createClass({
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var ohlcModel = new OHLCModel(chartInfo);

        var childElements = _.map(ohlcModel.elements, function (element) {
            return React.DOM[element.type](element.props, element.children);
        });

        return (
            <g className="ohlcbars">
                {childElements}
            </g>
        );
    }
});

module.exports = OHLCBars;