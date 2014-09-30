var app = require("./js/app.js");
var $ = require('jquery');
var _ = require('lodash');

$(document).ready(function () {
    console.log("app init 123", $, _);
    console.log(window.Server.Q);
    console.log(window.Server._);
    app.init();
});
