/** @jsx React.DOM */

//https://github.com/rogerwang/node-webkit/issues/1188#issuecomment-26002789
// https://github.com/substack/node-browserify/issues/481
global.document = window.document;
global.navigator = window.navigator;

//var HelloMessage = require("./ui/components/temp");
//var React = require("react");
var $ = require("jquery");

var App = {
  init: function () {
    console.log("init");
    //React.renderComponent(<HelloMessage name="World 12467" />, $("#container")[0]);
    $("#container").html("hello world");
  }
};

module.exports = App;





