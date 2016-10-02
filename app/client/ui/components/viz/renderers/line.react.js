/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash");

var LineModel = require("ui/components/viz/models/linemodel");

var LinePaths = React.createClass({
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var lineModel = new LineModel(chartInfo);

        var childElements = _.map(lineModel.elements, function (element) {
            return React.DOM[element.type](element.props, element.children);
        });

        return (
            <g className="line">
                {childElements}
            </g>
        );
    }
});

module.exports = LinePaths;
