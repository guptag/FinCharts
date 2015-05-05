/** @jsx React.DOM */

var React = require("react/addons");
var _     = require("lodash");
var AppContext = require("ui/core/appcontext");
var PriceChart = require('../viz/charts/pricechart.react');

var AppMain = React.createClass({
    render: function() {
        var chartStore = AppContext.stores.chartStore;
        var allChartsId = chartStore.getAllChartIds();

        var mainRect = AppContext.getLayoutRect("mainlayout");
        var mainStyle = {
            width: mainRect.width + "px",
            height: mainRect.height + "px",
            top: mainRect.top + "px",
            left: mainRect.left + "px"
        };

        var childElements = _.map(allChartsId, function (chartId) {
            return <PriceChart chartId={chartId}/>;
        });

        return (
            <section id="appmain" data-layout="mainlayout" style={mainStyle}>
              {childElements}
            </section>
        );
    }
});

module.exports = AppMain;
