/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash"),
    CrosshairsModel = require("ui/components/viz/models/crosshairsmodel");

var CrossHairs = React.createClass({
    getInitialState: function () {
        return {
            mousePosition: {x: -50, y: -50}
        };
    },

    componentWillReceiveProps: function (/*nextProps*/) {
        // reset crosshairs when re-rendered
        this.setState(this.getInitialState());
    },

    onMouseMove: function (ev) {
        this.setState({
            mousePosition: {
                x: ev.clientX,
                y: ev.clientY - 40 //todo (fix properly): diff topnav height
            }
        });
    },

    onMouseOut: function (/*ev*/) {
        this.setState({
            mousePosition: {x: -50, y: -50}
        });
    },

    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;

        var crosshairsModel = new CrosshairsModel(chartInfo,
            this.state.mousePosition,
            {
                onMouseMove: this.onMouseMove,
                onMouseOut: this.onMouseOut
            });

        var childElements = _.map(crosshairsModel.elements, function (element) {
            var grandChildren = _.map(element.elements || [], function (innerElement) {
                return React.DOM[innerElement.type](innerElement.props, innerElement.elements);
            });

            return React.DOM[element.type](element.props, grandChildren);
        });


        return (
            <g className="crosshairs">
                {childElements}
            </g>
        );
    }
});

module.exports = CrossHairs;

/*
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

 */