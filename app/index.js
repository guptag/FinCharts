var app = require("./client/app.js");
var $ = require('jquery');
//var _ = require('lodash');

$(document).ready(function () {
    // console.log("app init 123", $, _);
    // console.log(window.server._);
    app.init();
});
