var Q = require("q");
var $ = require("jquery");

Q.delay(100).then(function() {
    $("#hello").html("Hello World");
});
