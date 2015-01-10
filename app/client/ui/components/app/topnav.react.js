/** @jsx React.DOM */

var $ = require("jquery");
var moment = require("moment");
var React = require("react/addons");
var AppContext = require("ui/core/appcontext");
var AtomCommand = require("ui/core/atomcommand");
var ChartActions = require("ui/core/actions/chartactions");


var TopNav = React.createClass({
    onTickerChanged: function (ev) {
        var keyCode = (ev.keyCode ? ev.keyCode : ev.which);
        if(keyCode == 13){
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

        var chartStore = AppContext.stores.chartStore;

        var currentDuration = chartStore.getDuration();
        var currentDuraionStr = currentDuration[0].toUpperCase();

        var timeframeDiffInMonths = chartStore.getTimeframeInMonths();
        var timeframeDisplayStr = timeframeDiffInMonths < 12 ? timeframeDiffInMonths + "M" : (timeframeDiffInMonths / 12) + "Y";

        return (
            <section id="topnav" style={topNavStyle} className="clearfix">
                <input id="ticker" ref="tickerInput" className="topnav-item ticker" placeholder="(e.g. msft)" onKeyPress={this.onTickerChanged}></input>
                <div className="topnav-item range" ref="rangeItem" onClick={this.toggleDurationOptions}>
                    <i className="fa fa-chevron-down"></i>
                    <span className="value">{currentDuraionStr}</span>
                </div>
                <div className="topnav-item timeframe" ref="timeframeItem" onClick={this.toggleTimeframeOptions}>
                    <i className="fa fa-chevron-down"></i>
                    <span className="value">{timeframeDisplayStr}</span>
                </div>
                <div className="layouts topnav-item layout-1a" ref="layoutItem" onClick={this.toggleLayoutOptions}>
                    <i className="fa fa-chevron-down"></i>
                    <div className="layoutbutton" data-layout="1a">
                        <span className="box box1"></span>
                    </div>
                    <div className="layoutbutton" data-layout="2a">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                    </div>
                    <div className="layoutbutton" data-layout="2b">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                    </div>
                    <div className="layoutbutton" data-layout="3a">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                        <span className="box box3"></span>
                    </div>
                    <div className="layoutbutton" data-layout="3b">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                        <span className="box box3"></span>
                    </div>
                    <div className="layoutbutton" data-layout="3c">
                        <span className="box box1"></span>
                        <span className="box box2"></span>
                        <span className="box box3"></span>
                    </div>
                </div>
                <div className="preview topnav-item">
                    <i className="fa fa-chevron-down"></i>
                    <button className="play">
                        <i className="fa fa-play"></i>
                    </button>
                    <button className="pause disabled">
                        <i className="fa fa-pause"></i>
                    </button>
                    <button className="stop disabled">
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