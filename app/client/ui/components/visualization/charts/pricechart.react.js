/** @jsx React.DOM */

var React = require("react/addons");

var GridX = require("../core/elements/gridx.react");
var GridY = require("../core/elements/gridy.react");
var Volume = require("./volume.react");
var CandleStickRenderer = require("../core/renderers/candlestick.react");
var ChartInfo = require("./chartinfo.react");
var CrossHairs = require("./crosshairs.react");

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
                <svg className="pricechart" data-ticker="MSFT">
                    <defs></defs>
                    <GridX/>
                    <GridY/>
                    <Volume/>
                    <CandleStickRenderer/>
                    <ChartInfo/>
                    <CrossHairs/>
                </svg>
            </section>
        );
    }
});

module.exports = PriceChart;