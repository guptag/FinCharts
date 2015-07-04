/** @jsx React.DOM */

var React = require("react/addons");

var IconLine = React.createClass({
    render: function() {
      return (
          <svg className="icon-line" viewBox="0 0 20 20">
            <path d="M 4 2
                     L 4 19
                     M 2 17
                     L 20 17 Z"/>
            <path d="M 4 12
                     L 6 8
                     L 8 10
                     L 10 8
                     L 12 6
                     L 14 10
                     L 16 6
                     L 18 12
                     L 20 4"/>
          </svg>
        );
    }
});

module.exports = IconLine;
