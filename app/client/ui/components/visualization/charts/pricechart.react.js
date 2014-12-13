/** @jsx React.DOM */

var React = require("react/addons");

var PriceChart = React.createClass({
    render: function() {
        var chartStyle = {
            position: 'absolute',
            width: '1400px',
            height: '660px',
            top: '0px',
            left: '0px'
        };

        return (
            <section id="chart1" className="chartcontainer active" data-layout="chartslayout_1a_1" style={chartStyle}>
                <svg class="pricechart" data-ticker="MSFT"></svg>
            </section>
        );
    }
});

module.exports = PriceChart;