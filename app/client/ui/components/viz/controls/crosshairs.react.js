/** @jsx React.DOM */

var React = require("react/addons");

var CrossHairs = React.createClass({
    render: function() {
        return (
            <g className="crosshairs">
                <g transform="matrix(1,0,0,1,0,150)" className="value-axis">
                    <path d="M0,0L1346,0" className="axis"></path>
                    <rect x="1348" y="-10" className="label-box" width="42" height="20"></rect>
                    <text x="1352" y="4" className="label">44.05</text>
                </g>
                <g transform="matrix(1,0,0,1,450,0)" className="time-axis">
                    <path d="M0,608L0,0" className="axis"></path>
                    <rect x="-40" y="612" width="80" height="20" className="label-box" ></rect>
                    <text x="-35" y="626" className="label">2014-04-03</text>
                </g>
                <rect x="0" y="0" width="1388" height="638" className="overlay"></rect>
            </g>
        );
    }
});

module.exports = CrossHairs;