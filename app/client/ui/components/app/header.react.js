/** @jsx React.DOM */

var React = require("react/addons");
var TopNav = require('./topnav.react');

var AppHeader = React.createClass({
    render: function() {
        var headerStyle = {
            position: 'absolute',
            width: '1400px',
            height: '40px',
            top: '0px',
            left: '0px',
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
