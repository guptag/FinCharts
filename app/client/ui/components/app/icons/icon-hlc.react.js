/** @jsx React.DOM */

var React = require("react/addons");

var IconHlc = React.createClass({
    render: function() {
      return (
          <svg className="icon-hlc" viewBox="0 0 20 20">
            <path className="box1"
                  d="M 6 2
                     L 6 18
                     M 6 4
                     L 10 4 Z"/>

            <path className="box2"
                  d="M 16 2
                     L 16 18
                     M 16 12
                     L 20 12 Z"/>
         </svg>
        );
    }
});

module.exports = IconHlc;
