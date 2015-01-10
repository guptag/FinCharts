/** @jsx React.DOM */

var React = require("react/addons");
var AppContext = require("ui/core/appcontext");
var TopNav = require('./topnav.react');

var AppHeader = React.createClass({
    render: function() {
        var headerRect = AppContext.getLayoutRect("appheaderlayout");
        var headerStyle = {
            position: 'absolute',
            width: headerRect.width + "px",
            height: headerRect.height + "px",
            top: headerRect.top + "px",
            left: headerRect.left + "px",
            overflow: 'hidden'
        };

        return (
            <section id="appheader" style={headerStyle}>
              <div id="applogo">
                <div className="text">FinCharts</div>
                <div className="icon">
                    <span className="axis"></span>
                    <span className="dot1"></span>
                    <span className="dot2"></span>
                    <div className="tri1"></div>
                    <div className="tri2"></div>
                </div>
              </div>
              <TopNav/>
            </section>
        );
    }
});

module.exports = AppHeader;
