/** @jsx React.DOM */

var React = require("react/addons");

var IconCandleSticks = React.createClass({
    render: function() {
      return (
          <svg className="icon-candle-sticks" viewBox="0 0 20 20">
            <path className="box1"
                  d="M 4 6
                     L 10 6
                     L 10 16
                     L 4 16
                     L 4 6
                     M 7 1
                     L 7 6
                     M 7 16
                     L 7 20 Z"/>

            <path className="box2"
                  d="M 14 4
                     L 20 4
                     L 20 12
                     L 14 12
                     L 14 4
                     M 17 0
                     L 17 4
                     M 17 12
                     L 17 20 Z"/>

         </svg>
        );
    }
});

module.exports = IconCandleSticks;
