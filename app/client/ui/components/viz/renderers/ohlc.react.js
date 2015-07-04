/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash");

var OHLCModel = require("ui/components/viz/models/ohlcmodel");

var OHLCBars = React.createClass({
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var showOpen = this.props.showOpen;
        var ohlcModel = new OHLCModel(chartInfo, showOpen);

        var childElements = _.map(ohlcModel.elements, function (element) {
            return React.DOM[element.type](element.props, element.children);
        });

        var classStr = showOpen ? "ohlcbars" : "hlcbars";
        if (childElements.length < 150) {
            classStr += " thick";
        }

        return (
            <g className={classStr}>
                {childElements}
            </g>
        );
    }
});

module.exports = OHLCBars;
