/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash");

var AreaModel = require("ui/components/viz/models/areamodel");

var AreaPaths = React.createClass({
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var areaModel = new AreaModel(chartInfo);

        var childElements = _.map(areaModel.elements, function (element) {
            return React.DOM[element.type](element.props, element.children);
        });

        return (
            <g className="area">
                {childElements}
            </g>
        );
    }
});

module.exports = AreaPaths;
