/** @jsx React.DOM */

var React = require("react/addons");

var IconOhlc = React.createClass({
    render: function() {
      return (
          <svg className="icon-ohlc" viewBox="0 0 20 20">
            <path className="box1"
                  d="M 6 2
                     L 6 18
                     M 6 4
                     L 10 4
                     M 6 14
                     L 2 14 Z"/>

            <path className="box2"
                  d="M 16 2
                     L 16 18
                     M 16 8
                     L 12 8
                     M 16 12
                     L 20 12 Z"/>
         </svg>
        );
    }
});

module.exports = IconOhlc;
