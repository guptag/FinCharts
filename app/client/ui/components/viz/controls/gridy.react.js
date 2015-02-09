/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash"),
    GridYModel = require("ui/components/viz/models/gridymodel");

var GridY = React.createClass({
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var gridYModel = new GridYModel(chartInfo);

        var childElements = _.map(gridYModel.elements, function (element) {
            return React.DOM[element.type](element.props, element.children);
        });

        return (
            <g className="grid-y">
                {childElements}
            </g>
        );
    }
});

module.exports = GridY;


/*

return (
            <g className="grid-y">
                <path d="M1348,638L1348,0" className="axis"></path>
                <path d="M83.468,5L83.468,618" className="axis"></path>
                <text x="76.468" y="630"  className="datetimelabel">22</text>
                <path d="M140.142,5L140.142,618" className="axis"></path>
                <text x="130.142" y="630"  className="datetimelabel month">Feb</text>
                <path d="M239.321,5L239.321,618" className="axis"></path>
                <text x="232.321" y="630"  className="datetimelabel">24</text>
                <path d="M274.742,5L274.742,618" className="axis"></path>
                <text x="264.742" y="630"  className="datetimelabel month">Mar</text>
                <path d="M317.247,5L317.247,618" className="axis"></path>
                <text x="310.247" y="630"  className="datetimelabel">11</text>
                <path d="M423.511,5L423.511,618" className="axis"></path>
                <text x="413.511" y="630"  className="datetimelabel month">Apr</text>
                <path d="M473.1,5L473.1,618" className="axis"></path>
                <text x="466.1" y="630"  className="datetimelabel">10</text>
                <path d="M572.279,5L572.279,618" className="axis"></path>
                <text x="562.279" y="630"  className="datetimelabel month">May</text>
                <path d="M628.953,5L628.953,618" className="axis"></path>
                <text x="621.953" y="630"  className="datetimelabel">13</text>
                <path d="M721.047,5L721.047,618" className="axis"></path>
                <text x="711.047" y="630"  className="datetimelabel month">Jun</text>
                <path d="M784.805,5L784.805,618" className="axis"></path>
                <text x="777.805" y="630"  className="datetimelabel">13</text>
                <path d="M869.816,5L869.816,618" className="axis"></path>
                <text x="859.816" y="630"  className="datetimelabel month">Jul</text>
                <path d="M940.658,5L940.658,618" className="axis"></path>
                <text x="933.658" y="630"  className="datetimelabel">16</text>
                <path d="M1025.668,5L1025.668,618" className="axis"></path>
                <text x="1015.6679999999999" y="630"  className="datetimelabel month">Aug</text>
                <path d="M1096.511,5L1096.511,618" className="axis"></path>
                <text x="1089.511" y="630"  className="datetimelabel">15</text>
                <path d="M1174.437,5L1174.437,618" className="axis"></path>
                <text x="1164.437" y="630"  className="datetimelabel month">Sep</text>
                <path d="M1252.363,5L1252.363,618" className="axis"></path>
                <text x="1245.363" y="630"  className="datetimelabel">17</text>
                <path d="M1323.205,5L1323.205,618" className="axis"></path>
                <text x="1313.205" y="630"  className="datetimelabel month">Oct</text>
            </g>
        );

 */