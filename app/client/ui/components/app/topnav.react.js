/** @jsx React.DOM */

var $ = require("jquery");
var React = require("react/addons");
var AppContext = require("ui/core/appcontext");
var AtomCommand = require("ui/core/atomcommand");
var ChartActions = require("ui/core/actions/chartactions");
var DeferredEvents = require("ui/core/events/deferredevents");


var TopNav = React.createClass({
    getInitialState: function () {
        return {
            previewState: "stop"
        };
    },
    componentWillReceiveProps: function (/*nextProps*/) {
        this.setState({
            previewState: "stop"
        });
    },
    componentWillMount: function () {
        DeferredEvents.register(DeferredEvents.Keys.ResetPreviewOptions, function () {
            this.setState({
                previewState: "stop"
            });
        }.bind(this));
    },
    onTickerChanged: function (ev) {
        var keyCode = (ev.keyCode ? ev.keyCode : ev.which);
        if(keyCode === 13){
           ChartActions.updateTicker(ev.target.value.trim());
        }
    },
    toggleDurationOptions: function () {
        var appUIStore = AppContext.stores.appUIStore;
        var isShowing = appUIStore.isDurationPopupOpen();

        var showPopup = !isShowing;
        var navItemRect = showPopup ? this.refs.rangeItem.getDOMNode().getBoundingClientRect() : {
            left: -50,
            top: -50,
            height: 0,
            width: 0
        };

        AppContext.publishCommand(new AtomCommand(
            AtomCommand.commands.APP_TOGGLE_DURATION_OPTIONS,
            {
                show: showPopup,
                rect: {
                    top: navItemRect.height + 10,
                    left: navItemRect.left
                }
            })
        );
    },
    toggleTimeframeOptions: function () {
        var appUIStore = AppContext.stores.appUIStore;
        var isShowing = appUIStore.isTimeframePopupOpen();

        var showPopup = !isShowing;
        var navItemRect = showPopup ? this.refs.timeframeItem.getDOMNode().getBoundingClientRect() : {
            left: -50,
            top: -50,
            height: 0,
            width: 0
        };

        AppContext.publishCommand(new AtomCommand(
            AtomCommand.commands.APP_TOGGLE_TIMEFRAME_OPTIONS,
            {
                show: showPopup,
                rect: {
                    top: navItemRect.height + 10,
                    left: navItemRect.left
                }
            })
        );
    },
    toggleLayoutOptions: function () {
        var appUIStore = AppContext.stores.appUIStore;
        var isShowing = appUIStore.isLayoutPopupOpen();

        var showPopup = !isShowing;
        var navItemRect = showPopup ? this.refs.layoutItem.getDOMNode().getBoundingClientRect() : {
            left: -50,
            top: -50,
            height: 0,
            width: 0
        };

        AppContext.publishCommand(new AtomCommand(
            AtomCommand.commands.APP_TOGGLE_CHARTLAYOUT_OPTIONS,
            {
                show: showPopup,
                rect: {
                    top: navItemRect.height + 10,
                    left: navItemRect.left
                }
            })
        );
    },
    startPreview: function () {
        if ($(this.refs.playButton.getDOMNode()).hasClass("disabled")) {
            return;
        }

        var chartStore = AppContext.stores.chartStore;
        var chartId = chartStore.getActiveChartId();

        ChartActions.startPreview(chartId);

        this.setState({
            previewState: "start"
        });
    },
    stopPreview: function () {
        if ($(this.refs.stopButton.getDOMNode()).hasClass("disabled")) {
            return;
        }

        var chartStore = AppContext.stores.chartStore;
        var chartId = chartStore.getActiveChartId();

        ChartActions.stopPreview(chartId);

        this.setState({
            previewState: "stop"
        });
    },
    pausePreview: function () {
        if ($(this.refs.pauseButton.getDOMNode()).hasClass("disabled")) {
            return;
        }

        var chartStore = AppContext.stores.chartStore;
        var chartId = chartStore.getActiveChartId();

        ChartActions.pausePreview(chartId);

        this.setState({
            previewState: "pause"
        });
    },
    render: function() {
        var topNavRect = AppContext.getLayoutRect("topnavlayout");
        var topNavStyle = {
            position: 'absolute',
            width: topNavRect.width + "px",
            height: topNavRect.height + "px",
            top: topNavRect.top + "px",
            left: topNavRect.left + "px",
            overflow: 'hidden'
        };

        var playButtonCSS = "play " + (this.state.previewState === "start" ? "disabled" : "");
        var pauseButtonCSS = "pause " + (this.state.previewState === "pause" ||
                                            this.state.previewState === "stop" ? "disabled" : "");
        var stopButtonCSS = "stop " + (this.state.previewState === "stop" ? "disabled" : "");

        var chartStore = AppContext.stores.chartStore;

        var currentDuration = chartStore.getDuration();
        var currentDuraionStr = currentDuration[0].toUpperCase();

        var timeframeDiffInMonths = chartStore.getTimeframeInMonths();
        var timeframeDisplayStr = timeframeDiffInMonths < 12 ? timeframeDiffInMonths + "M" : (timeframeDiffInMonths / 12) + "Y";

        var layoutId = chartStore.getChartLayoutId().split("_")[0];
        var layoutsClass = "layouts topnav-item " + layoutId;

        // hacky to touch the dom directly (todo: refacor)
        var ticker = chartStore.getTicker();
        setTimeout(function () {
            $("#ticker").val(ticker).focus().select();
        });

        var useOhlcIcon = '<use xlink:href="assets/icon-sprite.svg#icon-area" />';

        return (
            <section id="topnav" style={topNavStyle} className="clearfix">
                <input id="ticker" ref="tickerInput" className="topnav-item ticker" defaultValue={ticker} placeholder="(e.g. msft)" onKeyPress={this.onTickerChanged}></input>
                <div className="topnav-item range" ref="rangeItem" onClick={this.toggleDurationOptions}>
                    <i className="fa fa-chevron-down"></i>
                    <span className="value">{currentDuraionStr}</span>
                </div>
                <div className="topnav-item timeframe" ref="timeframeItem" onClick={this.toggleTimeframeOptions}>
                    <i className="fa fa-chevron-down"></i>
                    <span className="value">{timeframeDisplayStr}</span>
                </div>
                <div className={layoutsClass} ref="layoutItem" onClick={this.toggleLayoutOptions}>
                    <i className="fa fa-chevron-down"></i>
                    <div className="layoutbutton" data-layout="chartslayout1a">
                        <span className="box box1"></span>
                    </div>
                    <div className="layoutbutton" data-layout="chartslayout2a">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                    </div>
                    <div className="layoutbutton" data-layout="chartslayout2b">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                    </div>
                    <div className="layoutbutton" data-layout="chartslayout3a">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                        <span className="box box3"></span>
                    </div>
                    <div className="layoutbutton" data-layout="chartslayout3b">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                        <span className="box box3"></span>
                    </div>
                    <div className="layoutbutton" data-layout="chartslayout3c">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                        <span className="box box3"></span>
                    </div>
                </div>
                <div className="charttype topnav-item">
                    <i className="fa fa-chevron-down"></i>
                    <svg width="40px" height="30px" dangerouslySetInnerHTML={{__html: useOhlcIcon }} />
                </div>
                <div className="preview topnav-item">
                    <i className="fa fa-chevron-down"></i>
                    <button className={playButtonCSS} ref="playButton" onClick={this.startPreview}>
                        <i className="fa fa-play"></i>
                    </button>
                    <button className={pauseButtonCSS}  ref="pauseButton" onClick={this.pausePreview}>
                        <i className="fa fa-pause"></i>
                    </button>
                    <button className={stopButtonCSS}  ref="stopButton" onClick={this.stopPreview}>
                        <i className="fa fa-stop"></i>
                    </button>
                    <section className="addl hide">
                        <input className="frequency" type="number" min="0.25" max="3" step="0.25" value="1"></input>
                        <label><input className="hide-price-movement" type="checkbox"></input>Hide</label>
                    </section>
                </div>
                <div className="compare topnav-item">
                    <i className="fa fa-chevron-down"></i>
                    <i className="fa fa-files-o"></i>
                    <span>Compare</span>
                </div>
                <div className="signals topnav-item">
                    <i className="fa fa-chevron-down"></i>
                    <i className="fa fa-puzzle-piece"></i>
                    <span>Signals</span>
                </div>
                <div className="indicators topnav-item">
                    <i className="fa fa-chevron-down"></i>
                    <i className="fa fa-cogs"></i>
                    <span>Indicators</span>
                </div>
            </section>
        );
    }
});

module.exports = TopNav;
