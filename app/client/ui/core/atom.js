'use strict';

var React = require("react/addons");
var Logger = require("./utils/logger");

var Immutable = window.server.immutable;
var _ = window.server.lodash;



function Atom (options) {

    var state,
        lockReason,
        beforeTransactionCommit,
        afterTransactionCommit,
        currentTransactionState;

    // constructor
    (function init () {
        state = options.initialState || {};
        lockReason = "";
        beforeTransactionCommit = options.beforeCommit || _.noop;
        afterTransactionCommit = options.afterCommit || _.noop;
        currentTransactionState = undefined;
    })();

    return {
        isInTransaction: function () {

        },

        openTransaction: function () {

        },

        commitTransaction: function () {

        },

        rollbackTransaction: function () {

        },

        lock: function (lockReason) {

        },

        unlock: function () {

        },

        transact: function (tasks) {

        },

        get: function () {

        },

        setPathValue: function (path, value) {

        },

        getPathValue: function (path) {

        },

        compareAndSwapPathValue: function (path, expectedValue, newValue) {

        }
    }
}

module.exports = Atom;



/* var Atom = function Atom(options) {
    this.state = options.initialState || {};
    this.lockReason = "";
    this.beforeTransactionCommit = options.beforeCommit || _.noop;
    this.afterTransactionCommit = options.afterCommit || _.noop;
    this.currentTransactionState = undefined;
};


Atom.prototype.swap = function (newState) {
    if (!this.isInTransaction()) {
        throw new Error("Cannot swap state outside the transaction");
    }

    if (this.locked) {
        throw new Error("Atom is locked because: " + this.lockReason);
    }

    this.currentTransactionState = newState;
};


Atom.prototype.isInTransaction = function () {
    return !!this.currentTransactionState;
};

Atom.prototype.openTransaction = function () {
    this.currentTransactionState = this.state;
};

Atom.prototype.commitTransaction = function () {
    var transactionState = this.currentTransactionState;
    this.currentTransactionState = undefined
    this.state = transactionState;
};

Atom.prototype.rollbackTransaction = function () {
    this.currentTransactionState = undefined
};

Atom.prototype.lock = function (lockReason) {
    this.locked = true;
    this.lockReason = lockReason
};


Atom.prototype.unlock = function() {
    this.locked = false;
    this.lockReason = undefined
};

Atom.prototype.doWithLock = function(lockReason, task) {
    try {
        this.lock(lockReason);
        task();
    } finally {
        this.unlock();
    }
};



Atom.prototype.transact = function(tasks) {
    // TODO do we need to implement more complex transaction propagation rules than joining the existing transaction?
    if ( this.isInTransaction() ) {
        tasks();
    }
    else {
        this.openTransaction();
        try {
            tasks();
            // "lock" these values before calling the callbacks
            var previousState = this.state;
            this.beforeTransactionCommit(this.currentTransactionState,previousState);
            this.commitTransaction();
            try {
                this.afterTransactionCommit(this.state,previousState);
            } catch(error) {
                console.error("Error in 'afterTransactionCommit' callback. The transaction will still be commited",error.message);
                console.error(error.stack);
            }
        } catch (error) {
            console.error("Error during atom transaction! Atom state will be rollbacked",error.message);
            console.error(error.stack);
            this.rollbackTransaction();
        }
    }
};



Atom.prototype.get = function() {
    return this.currentTransactionState || this.state;
};



Atom.prototype.setPathValue = function(path,value) {
    var self = this;
    this.transact(function() {
        var newState = AtomUtils.setPathValue(self.get(),path,value);
        self.swap(newState);
    });
};

Atom.prototype.unsetPathValue = function(path) {
    var self = this;
    this.transact(function() {
        var newState = AtomUtils.setPathValue(self.get(),path,undefined);
        self.swap(newState);
    })

};


Atom.prototype.getPathValue = function(path) {
    return AtomUtils.getPathValue(this.get(),path);
};


Atom.prototype.compareAndSwapPathValue = function(path,expectedValue,newValue) {
    var actualValue = this.getPathValue(path);
    if ( actualValue === expectedValue ) {
        this.setPathValue(path,newValue);
        return true;
    }
    return false;
};



module.exports = Atom; */
