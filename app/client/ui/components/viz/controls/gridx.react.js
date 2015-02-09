/** @jsx React.DOM */

var React = require("react/addons"),
    _     = require("lodash");

var GridXModel = require("ui/components/viz/models/gridxmodel");

var GridX = React.createClass({
    render: function() {
        var chartInfo = this.props.chartModel.chartInfo;
        var gridXModel = new GridXModel(chartInfo);

        var childElements = _.map(gridXModel.elements, function (element) {
            return React.DOM[element.type](element.props, element.children);
        });

        return (
            <g className="grid-x">
                {childElements}
            </g>
        );
    }
});

module.exports = GridX;

/*
<path d="M0,613L1388,613" className="axis"></path>
                <path d="M2,537L1353,537" className="axis"></path>
                <text x="1354.5" y="540.35" className="pricelabel">34</text>
                <path d="M2,461L1353,461" className="axis"></path>
                <text x="1354.5" y="464.35" className="pricelabel">36</text>
                <path d="M2,385L1353,385" className="axis"></path>
                <text x="1354.5" y="388.35" className="pricelabel">38</text>
                <path d="M2,309L1353,309" className="axis"></path>
                <text x="1354.5" y="312.35" className="pricelabel">40</text>
                <path d="M2,233L1353,233" className="axis"></path>
                <text x="1354.5" y="236.35" className="pricelabel">42</text>
                <path d="M2,157L1353,157" className="axis"></path>
                <text x="1354.5" y="160.35" className="pricelabel">44</text>
                <path d="M2,81L1353,81" className="axis"></path>
                <text x="1354.5" y="84.35" className="pricelabel">46</text>
                <path d="M2,5L1353,5" className="axis"></path>
                <text x="1354.5" y="8.35" className="pricelabel">48</text>

 */