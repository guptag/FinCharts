/** @jsx React.DOM */

var React = require("react/addons");
var TopNav = require('./topnav.react');

var AppHeader = React.createClass({
    render: function() {
        return (
            <section id="appheader">
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
