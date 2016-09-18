/** @jsx React.DOM */

var $ = require("jquery");
var React = require("react/addons");
var moment = require("moment");
var AppContext = require("ui/core/appcontext");
var ChartActions = require("ui/core/actions/chartactions");

var IconOhlc = require('./icons/icon-ohlc.react');
var IconHlc = require('./icons/icon-hlc.react');
var IconArea = require('./icons/icon-area.react');
var IconLine  = require('./icons/icon-line.react');
var IconCandleSticks = require('./icons/icon-candlesticks.react');

var Popups = React.createClass({
    onDurationChanged: function (evt) {
        var $target = $(evt.target);

        if (!$target.hasClass("disabled")) {
            var newDuration = $target.attr("value");
            ChartActions.updateDuration(newDuration);
        }
    },
    onTimeframeChanged: function (evt) {
        var timeframeInMonths = $(evt.target).attr("value");
        var toDate = moment().toDate();
        var fromDate = moment(toDate).subtract(timeframeInMonths, 'months').toDate();

        var chartStore = AppContext.stores.chartStore;
        var chartDuration = chartStore.getDuration();
        chartDuration =  (timeframeInMonths > 84) ? "monthly" : (timeframeInMonths > 24 ? "weekly" : "daily");

        ChartActions.updateTimeframe(fromDate, toDate, chartDuration);
    },
    onChartLayoutChanged: function (evt) {
        var $target = $(evt.target);

        var index = 0, chartLayoutId;
        for (index = 0; index < 5; ++index) {
            chartLayoutId = $target.attr("value") || $target.attr("data-layout");
            if (chartLayoutId) break;
            $target = $target.parent();
        }

        console.log("LAYOUT CHANGED", chartLayoutId);

        if (chartLayoutId) {
            ChartActions.updateChartLayout(chartLayoutId);
        }
    },
    onRendererChanged: function (evt) {
        var $target = $(evt.target);

        var index = 0, renderer;
        for (index = 0; index < 5; ++index) {
            renderer = $target.attr("value");
            if (renderer) break;
            $target = $target.parent();
        }

        console.log("Renderer CHANGED", renderer);

        if (renderer) {
            ChartActions.updateRenderer(renderer);
        }
    },
    getDurationPopupDOM: function (popupStyle) {
        var chartStore = AppContext.stores.chartStore;
        var currentDuration = chartStore.getDuration();
        var timeframeInMonths = chartStore.getTimeframeInMonths();

        var getCssForOptionItem = function (value) {
            var className = "option";

            if (currentDuration === value) {
                className += " selected";
            }

            if ( (timeframeInMonths > 24 && value === "daily") ||
                 (timeframeInMonths > 84 && value === "weekly")){
                className += " disabled";
            }

            return className;
        };

        return  <div className="range-options nav-options popup" style={popupStyle} onClick={this.onDurationChanged}>
                    <div className={getCssForOptionItem('daily')} value="daily">Daily</div>
                    <div className={getCssForOptionItem('weekly')} value="weekly">Weekly</div>
                    <div className={getCssForOptionItem('montly')} value="monthly">Monthly</div>
                </div>;

    },
    getTimeframePopupDOM: function (popupStyle) {
        var chartStore = AppContext.stores.chartStore;
        var timeframeDiffInMonths = chartStore.getTimeframeInMonths();

        var getCssForOptionItem = function (value) {
            var className = "option";

            if (timeframeDiffInMonths === value) {
                className += " selected";
            }

            return className;
        };

        return <div className="timeframe-options nav-options popup" style={popupStyle} onClick={this.onTimeframeChanged}>
                    <div className={getCssForOptionItem(3)} value="3">3M</div>
                    <div className={getCssForOptionItem(6)} value="6">6M</div>
                    <div className={getCssForOptionItem(9)} value="9">9M</div>
                    <div className={getCssForOptionItem(12)} value="12">1Y</div>
                    <div className={getCssForOptionItem(18)} value="18">1.5Y</div>
                    <div className={getCssForOptionItem(24)} value="24">2Y</div>
                    <div className={getCssForOptionItem(30)} value="30">2.5Y</div>
                    <div className={getCssForOptionItem(36)} value="36">3Y</div>
                    <div className={getCssForOptionItem(42)} value="42">3.5Y</div>
                    <div className={getCssForOptionItem(48)} value="48">4Y</div>
                    <div className={getCssForOptionItem(54)} value="54">4.5Y</div>
                    <div className={getCssForOptionItem(60)} value="60">5Y</div>
                    <div className={getCssForOptionItem(72)} value="72">6Y</div>
                    <div className={getCssForOptionItem(84)} value="84">7Y</div>
                    <div className={getCssForOptionItem(96)} value="96">8Y</div>
                    <div className={getCssForOptionItem(120)} value="120">10Y</div>
                    <div className={getCssForOptionItem(180)} value="180">15Y</div>
                    <div className={getCssForOptionItem(240)} value="240">20Y</div>
                    <div className={getCssForOptionItem(300)} value="300">25Y</div>
                    <div className={getCssForOptionItem(360)} value="360">30Y</div>
                </div>;

    },
    getChartLayoutPopupDOM: function (popupStyle, currentLayout) {
        var getCssForOptionItem = function (value) {
            return (value === currentLayout) ? "selected option" : "option";
        };

        return <div className="layouts-options nav-options popup" style={popupStyle} onClick={this.onChartLayoutChanged}>
                    <div className={getCssForOptionItem('chartslayout1a')} value="chartslayout1a">
                        <div className="layoutbutton" data-layout="chartslayout1a">
                            <span className="box box1"></span>
                        </div>
                    </div>
                    <div className={getCssForOptionItem('chartslayout2a')} value="chartslayout2a">
                        <div className="layoutbutton" data-layout="chartslayout2a">
                            <span className="box box1"></span>
                            <span className="box box2"></span>
                        </div>
                    </div>
                    <div className={getCssForOptionItem('chartslayout2b')} value="chartslayout2b">
                        <div className="layoutbutton" data-layout="chartslayout2b">
                            <span className="box box1"></span>
                            <span className="box box2"></span>
                        </div>
                    </div>
                    <div className={getCssForOptionItem('chartslayout3a')} value="chartslayout3a">
                        <div className="layoutbutton" data-layout="chartslayout3a">
                            <span className="box box1"></span>
                            <span className="box box2"></span>
                            <span className="box box3"></span>
                        </div>
                    </div>
                    <div className={getCssForOptionItem('chartslayout3b')} value="chartslayout3b">
                        <div className="layoutbutton" data-layout="chartslayout3b">
                            <span className="box box1"></span>
                            <span className="box box2"></span>
                            <span className="box box3"></span>
                        </div>
                    </div>
                    <div className={getCssForOptionItem('chartslayout3c')} value="chartslayout3c">
                        <div className="layoutbutton" data-layout="chartslayout3c">
                            <span className="box box1"></span>
                            <span className="box box2"></span>
                            <span className="box box3"></span>
                        </div>
                    </div>
                </div>;
    },
    getRendererPopupDOM: function (popupStyle) {
        return <div className="renderer-options nav-options popup" style={popupStyle}  onClick={this.onRendererChanged}>
                    <div className="option" value="candlesticks">
                        <IconCandleSticks/>
                    </div>
                    <div className="option selected" value="ohlc">
                        <IconOhlc/>
                    </div>
                    <div className="option" value="hlc">
                        <IconHlc/>
                    </div>
                    <div className="option" value="area">
                        <IconArea/>
                    </div>
                    <div className="option" value="line">
                        <IconLine/>
                    </div>
                </div>;

    },
    render: function() {
        var appUIStore = AppContext.stores.appUIStore;
        var chartStore = AppContext.stores.chartStore;
        var popupFlags = appUIStore.getPopupFlags();
        var popupRect = appUIStore.getPopupRect();
        var popupStyle = {
            top: popupRect.top,
            left: popupRect.left
        };


        var popupDOM;
        if (popupFlags.durationOptions) {
            popupDOM =  this.getDurationPopupDOM(popupStyle);
        } else if (popupFlags.timeframeOptions) {
            popupDOM =  this.getTimeframePopupDOM(popupStyle);
        } else if (popupFlags.chartLayoutOptions) {
            var layoutId = chartStore.getChartLayoutId().split("_")[0];
            popupDOM =  this.getChartLayoutPopupDOM(popupStyle, layoutId);
        } else if (popupFlags.rendererOptions) {
            popupDOM =  this.getRendererPopupDOM(popupStyle);
        }

        return (
            <section id="popups" style={popupStyle}>
                {popupDOM}
            </section>
        );
    }
});

module.exports = Popups;
