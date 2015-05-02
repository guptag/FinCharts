/** @jsx React.DOM */

var React = require("react/addons");
var AppContext = require("ui/core/appcontext");
var GridX = require("ui/components/viz/controls/gridx.react");
var GridY = require("ui/components/viz/controls/gridy.react");
var CandleStickRenderer = require("ui/components/viz/renderers/candlestick.react");
var Volume     = require("ui/components/viz/controls/volume.react");
var ChartLabel  = require("ui/components/viz/controls/chartlabel.react");
var CrossHairs = require("ui/components/viz/controls/crosshairs.react");
var ChartPreview = require("ui/components/viz/controls/chartpreview.react");

var PriceChartModel = require("ui/components/viz/models/pricechartmodel");


var PriceChart = React.createClass({
    render: function() {
        var chartId = this.props.chartId;
        var layoutId = AppContext.stores.chartStore.getChartLayoutId(chartId);
        var chartRect = AppContext.getLayoutRect(layoutId);
        var chartStyle = {
            position: 'absolute',
            width: chartRect.width + "px",
            height: chartRect.height + "px",
            top: chartRect.top + "px",
            left: chartRect.left + "px",
            overflow: 'hidden'
        };

        var priceChartModel = new PriceChartModel(chartId);

        return (
            <section id={chartId} className="chartcontainer active" style={chartStyle}>
                <svg className="pricechart" data-ticker="MSFT">
                    <defs></defs>
                    <GridX chartModel={priceChartModel}/>
                    <GridY chartModel={priceChartModel}/>
                    <Volume chartModel={priceChartModel}/>
                    <CandleStickRenderer chartModel={priceChartModel}/>
                    <ChartLabel chartModel={priceChartModel}/>
                    <CrossHairs chartModel={priceChartModel}/>
                    <ChartPreview chartModel={priceChartModel}/>
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
