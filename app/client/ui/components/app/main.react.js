/** @jsx React.DOM */

var React = require("react/addons");
var AppContext = require("ui/core/appcontext");
var PriceChart = require('../viz/charts/pricechart.react');

var AppMain = React.createClass({
    render: function() {
        var mainRect = AppContext.getLayoutRect("mainlayout");
        var mainStyle = {
            position: 'absolute',
            width: mainRect.width + "px",
            height: mainRect.height + "px",
            top: mainRect.top + "px",
            left: mainRect.left + "px",
            overflow: 'hidden'
        };

        return (
            <section id="appmain" data-layout="mainlayout" style={mainStyle}>
              <PriceChart/>
            </section>
        );
    }
});

module.exports = AppMain;
