/** @jsx React.DOM */

var React = require("react/addons");

var IconArea = React.createClass({
    render: function() {
      return (
          <svg className="icon-area" viewBox="0 0 20 20">
            <path className="path1"  d="M 4 2
                     L 4 19
                     M 2 17
                     L 20 17 Z"/>
            <path className="path1" d="M 4 12
                     L 6 8
                     L 8 10
                     L 10 8
                     L 12 6
                     L 14 10
                     L 16 6
                     L 18 12
                     L 20 4
                     L 20 16.5
                     L 4 16.5 Z"/>
          </svg>
        );
    }
});

module.exports = IconArea;
