var Q = require("q");

Q.delay(100).then(function() {
    window.document.write("Hello World");
});
