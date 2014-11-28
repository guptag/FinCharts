

function Logger () {
    this.log = function () {
        console.log.apply(console, arguments);
    };

    this.error = function () {
        console.error.apply(console, arguments);
    };

    this.warn = function () {
        console.warn.apply(console, arguments);
    };

    this.info = function () {
        console.info.apply(console, arguments);
    }
}

module.exports = new Logger();
