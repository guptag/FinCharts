

function Logger () {
    this.log = function () {
        console.log.apply(arguments);
    };

    this.error = function () {
        console.error.apply(arguments);
    };

    this.warn = function () {
        console.warn.apply(arguments);
    };

    this.info = function () {
        console.info.apply(arguments);
    }
}

module.exports = new Logger();
