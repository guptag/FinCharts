/** @jsx React.DOM */

var React = require("react/addons");
var ChartActions = require("ui/core/actions/chartactions");


var TopNav = React.createClass({
    onTickerChanged: function (ev) {
        var keyCode = (ev.keyCode ? ev.keyCode : ev.which);
        if(keyCode == 13){
           ChartActions.updateTicker(ev.target.value.trim());
        }
    },
    render: function() {
        var topNavStyle = {
            position: 'absolute',
            width: '1000px',
            height: '40px',
            top: '0px',
            right: '60px',
            overflow: 'hidden'
        };

        return (
            <section id="topnav" style={topNavStyle} className="clearfix">
                <input id="ticker" ref="tickerInput" className="topnav-item ticker" placeholder="(e.g. msft)" onKeyPress={this.onTickerChanged}></input>
                <div className="topnav-item range">
                    <i className="fa fa-chevron-down"></i>
                    <span className="value">W</span>
                    <div className="navitem-options popover clearfix hide">
                        <div className="option" value="d" selected="true">Daily</div>
                        <div className="option selected" value="w">Weekly</div>
                        <div className="option" value="m">Monthly</div>
                    </div>
                </div>
                <div className="topnav-item timeframe">
                    <i className="fa fa-chevron-down"></i>
                    <span className="value">3M</span>
                    <div className="navitem-options popover clearfix hide">
                        <div className="option selected" value="3">3M</div>
                        <div className="option" value="6">6M</div>
                        <div className="option" value="9">9M</div>
                        <div className="option" value="12">1Y</div>
                        <div className="option" value="18">1.5Y</div>
                        <div className="option" value="24">2Y</div>
                        <div className="option" value="30">2.5Y</div>
                        <div className="option" value="36">3Y</div>
                        <div className="option" value="60">5Y</div>
                        <div className="option" value="120">10Y</div>
                        <div className="option" value="180">15Y</div>
                        <div className="option" value="240">20Y</div>
                    </div>
                </div>
                <div className="layouts topnav-item layout-1a">
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
                    <div className="navitem-options popover clearfix hide">
                            <div className="option" value="1a">
                                <div className="layoutbutton" data-layout="1a">
                                    <span className="box box1"></span>
                                </div>
                            </div>
                            <div className="option" value="2a">
                                <div className="layoutbutton" data-layout="2a">
                                    <span className="box box1"></span>
                                    <span className="box box2"></span>
                                </div>
                            </div>
                            <div className="option" value="2b">
                                <div className="layoutbutton" data-layout="2b">
                                    <span className="box box1"></span>
                                    <span className="box box2"></span>
                                </div>
                            </div>
                            <div className="option" value="3a">
                                <div className="layoutbutton" data-layout="3a">
                                    <span className="box box1"></span>
                                    <span className="box box2"></span>
                                    <span className="box box3"></span>
                                </div>
                            </div>
                            <div className="option" value="3b">
                                <div className="layoutbutton" data-layout="3b">
                                    <span className="box box1"></span>
                                    <span className="box box2"></span>
                                    <span className="box box3"></span>
                                </div>
                            </div>
                            <div className="option" value="3c">
                                <div className="layoutbutton" data-layout="3c">
                                    <span className="box box1"></span>
                                    <span className="box box2"></span>
                                    <span className="box box3"></span>
                                </div>
                            </div>
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