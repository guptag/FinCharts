var Logger = require("./utils/logger");
var AtomState = require("./atomstate");

var Immutable = window.server.immutable;
var _ = window.server.lodash;
var Q = window.server.Q;



function Atom (options) {

    var state,
        currentTransactionState,

        lockReason,
        locked,

        pendingTasks,

        beforeTransactionCommit,
        afterTransactionCommit;

    // constructor
    (function init () {
        state = Immutable.fromJS(AtomState.getDefaultAtomState());
        currentTransactionState = undefined;
        lockReason = "";
        locked = false;
        pendingTasks = [];
        beforeTransactionCommit = options.beforeCommit || _.noop;
        afterTransactionCommit = options.afterCommit || _.noop;
    })();

    function openTransaction() {
        currentTransactionState = state;
    }

    function commitTransaction () {
        var transactionState = currentTransactionState;
        currentTransactionState = undefined;
        state = transactionState;
    }

    function rollbackTransaction () {
        currentTransactionState = undefined;
    }

    return {
        isInTransaction: function () {
            return !!currentTransactionState;
        },

        lock: function (lockReason) {
            locked = true;
            lockReason = lockReason;
        },

        unlock: function () {
            locked = false;
            lockReason = undefined;
        },

        transactWithLock: function (task, lockReason) {
            try {
                this.lock(lockReason);
                this.transact(task);
            }
            catch (e) {
                Logger.error(e);
                return e;
            }
            finally {
                this.unlock();
            }
        },

        transact: function (task) {
            if (this.isInTransaction() || pendingTasks.length > 0) {
                Logger.log("added to transaction queue");
                pendingTasks.push(task);
            }

            openTransaction();

            try {
                var previousState = state;

                currentTransactionState = task(previousState);

                beforeTransactionCommit(currentTransactionState, previousState);

                commitTransaction();

                afterTransactionCommit(state, previousState);
            } catch (error) {
                Logger.error("Error during atom transaction! Atom state will be rollbacked",error.message);
                rollbackTransaction();
                return error;
            }

            var self = this;
            if (pendingTasks.length > 0) {
                Q.delay(50).then(function () {
                    self.transact(pendingTasks.shift());
                });
            }
        },

        get: function () {
            var clone = state;
            return clone;
        }
    };
}

module.exports = Atom;