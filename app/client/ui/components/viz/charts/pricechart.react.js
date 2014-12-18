/** @jsx React.DOM */

var React = require("react/addons");

var GridX = require("../elements/gridx.react");
var GridY = require("../elements/gridy.react");
var CandleStickRenderer = require("../renderers/candlestick.react");
var Volume     = require("../controls/volume.react");
var ChartInfo  = require("../controls/chartinfo.react");
var CrossHairs = require("../controls/crosshairs.react");

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


/*
    render: function() {
        this.props.NotificationComponent.addNotification({msg: "render", addlInfo: ["Component is rendered."]});
        return <div>{this.props.title}</div>;
    },

    getInitialState: function () {
        this.props.NotificationComponent.addNotification({
          msg: "getInitialState",
          addlInfo: ["Invoked once before the component is mounted", "The return value will be used as the initial value of this.state"]
        });
        return {};
    },

    getDefaultProps: function () {
       this.props.NotificationComponent.addNotification({
            msg:"getDefaultProps",
            addlInfo: ["Invoked once when the component is mounted",
                       "This method is invoked before getInitialState and therefore cannot rely on this.state or use this.setState."]
          }, true);
       return {
          title: "Hello World (default)",
          NotificationComponent: {
            addNotification: function(msg) {
              console.log("addNotification - noop", msg);
            }
          }
        };
    },

    componentWillMount: function () {
        this.props.NotificationComponent.addNotification({
            msg:"componentWillMount",
            addlInfo: ["Invoked once, immediately before the initial rendering occurs.",
              "If you call setState within this method, render() will see the updated state and will be executed only once despite the state change."]
          });
    },

    componentDidMount: function () {
        this.props.NotificationComponent.addNotification({
            msg:"componentDidMount",
            addlInfo: ["Invoked immediately after rendering occurs.",
            "At this point in the lifecycle, the component has a DOM representation which you can access via this.getDOMNode()"]
          });
    },

    componentWillReceiveProps: function(nextPros) {
        this.props.NotificationComponent.addNotification({
            msg: "componentWillReceiveProps",
            addlInfo: ["Invoked when a component is receiving new props.", "This method is not called for the initial render."]
          });
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        this.props.NotificationComponent.addNotification({
            msg:"shouldComponentUpdate",
            addlInfo: ["Invoked before rendering when new props or state are being received.",
            "This method is not called for the initial render or when forceUpdate is used."]
          });
        return true;
    },

    componentWillUpdate: function (nextProps, nextState) {
        this.props.NotificationComponent.addNotification({
            msg:"componentWillUpdate",
            addlInfo: ["Invoked immediately before rendering when new props or state are being received. ",
                       "This method is not called for the initial render."]
          });
    },

    componentDidUpdate: function (prevProps, prevState) {
        this.props.NotificationComponent.addNotification({
            msg:"componentDidUpdate",
            addlInfo: ["Invoked immediately after updating occurs.", "This method is not called for the initial render."]
          });
    },

    componentWillUnmount: function () {
        this.props.NotificationComponent.addNotification({
            msg:"componentWillUnmount",
            addlInfo: ["Invoked immediately before a component is unmounted from the DOM.",
            "Perform any necessary cleanup in this method, such as invalidating timers or cleaning up any DOM elements that were created in componentDidMount."]
          });
    }

 */