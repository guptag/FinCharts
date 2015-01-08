/** @jsx React.DOM */

var React = require("react/addons");
var moment = require("moment");
var AppContext = require("ui/core/appcontext");


var Popups = React.createClass({
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
            var currentDuration = chartStore.getDuration();

            var isSelected = function (value) {
                return currentDuration === value;
            }

            popupDOM =  <div className="range-options nav-options popup" style={popupStyle}>
                            <div className={isSelected('daily') ? 'option selected' : 'option'} value="daily">Daily</div>
                            <div className={isSelected('weekly') ? 'option selected' : 'option'} value="weekly">Weekly</div>
                            <div className={isSelected('monthly') ? 'option selected' : 'option'} value="monthly">Monthly</div>
                        </div>;

        }

        if (popupFlags.timeframeOptions) {
            var currentTimeframe = chartStore.getTimeframe();
            var timeframeDiffInMonths = Math.ceil(moment(currentTimeframe.to).diff(moment(currentTimeframe.from), 'months', true));

            console.log("diff months", timeframeDiffInMonths);

            var isSelected = function (months) {
                return timeframeDiffInMonths === months;
            };

            popupDOM = <div className="timeframe-options nav-options popup" style={popupStyle}>
                            <div className={isSelected(3) ? 'option selected' : 'option'} value="3">3M</div>
                            <div className={isSelected(6) ? 'option selected' : 'option'} value="6">6M</div>
                            <div className={isSelected(9) ? 'option selected' : 'option'} value="9">9M</div>
                            <div className={isSelected(12) ? 'option selected' : 'option'} value="12">1Y</div>
                            <div className={isSelected(18) ? 'option selected' : 'option'} value="18">1.5Y</div>
                            <div className={isSelected(24) ? 'option selected' : 'option'} value="24">2Y</div>
                            <div className={isSelected(30) ? 'option selected' : 'option'}value="30">2.5Y</div>
                            <div className={isSelected(36) ? 'option selected' : 'option'} value="36">3Y</div>
                            <div className={isSelected(60) ? 'option selected' : 'option'} value="60">5Y</div>
                            <div className={isSelected(120) ? 'option selected' : 'option'} value="120">10Y</div>
                            <div className={isSelected(180) ? 'option selected' : 'option'} value="180">15Y</div>
                            <div className={isSelected(240) ? 'option selected' : 'option'} value="240">20Y</div>
                        </div>;

        }

        if (popupFlags.chartLayoutOptions) {
            popupDOM = <div className="layouts-options nav-options popup" style={popupStyle}>
                            <div className="option selected" value="1a">
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
                        </div>;
        }

        return (
            <section id="popups" style={popupStyle}>
                {popupDOM}
            </section>
        );
    }
});

module.exports = Popups;
