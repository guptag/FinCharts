var Immutable = require('immutable');
var _ = window.server.lodash;
// var Q = window.server.Q;

var Logger = require("./utils/logger");
var AtomState = require("./atomstate");



function Atom (options) {

    var state,
        currentTransactionState,
        preTransactionState,

        lockReason,
        locked,
        batchTransactMode,

        pendingTasks,

        beforeTransactionCommit,
        afterTransactionCommit;

    // constructor
    (function init () {
        state = Immutable.fromJS(AtomState.getDefaultAtomState());
        currentTransactionState = undefined;
        preTransactionState = undefined;
        lockReason = "";
        locked = false;
        batchTransactMode = false;
        pendingTasks = [];
        beforeTransactionCommit = options.beforeCommit || _.noop;
        afterTransactionCommit = options.afterCommit || _.noop;
    })();

    function openTransaction() {
        preTransactionState = state;
        currentTransactionState = state;
    }

    function commitTransaction () {
        var transactionState = currentTransactionState;
        currentTransactionState = undefined;
        preTransactionState = undefined;
        state = transactionState;
    }

    function rollbackTransaction () {
        currentTransactionState = undefined;
        preTransactionState = undefined;
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

        openBatchTransaction: function () {
            batchTransactMode = true;
            openTransaction();
        },

        commitBatchTransactMode: function () {
            try {
                beforeTransactionCommit(currentTransactionState, preTransactionState);
                commitTransaction();
                batchTransactMode = false;
                afterTransactionCommit(state, preTransactionState);
            } catch (e) {
                Logger.error("Error during atom commit transaction! Atom state will be rollbacked",e.message);
                rollbackTransaction();
                throw e;
            } finally {
                batchTransactMode = false;
            }
        },

        transact: function (task) {
            /*if (this.isInTransaction() || pendingTasks.length > 0) {
                Logger.log("added to transaction queue");
                pendingTasks.push(task);
            }*/
            if (batchTransactMode) {
                currentTransactionState = task(currentTransactionState || state);
            } else {
                try {
                    openTransaction();

                    var previousState = state;

                    currentTransactionState = task(previousState);

                    if (!currentTransactionState) {
                        throw new Error("Transact task handler haven't returned the updated state", task);
                    }

                    beforeTransactionCommit(currentTransactionState, previousState);

                    commitTransaction();

                    afterTransactionCommit(state, previousState);
                } catch (e) {
                    Logger.error("Error during atom commit transaction! Atom state will be rollbacked",e.message);
                    rollbackTransaction();
                    throw e;
                }
            }

            /*var self = this;
            if (pendingTasks.length > 0) {
                Q.delay(50).then(function () {
                    self.transact(pendingTasks.shift());
                });
            } */
        },

        getState: function () {
            var clone = batchTransactMode ? currentTransactionState : state;
            return clone;
        }
    };
}

module.exports = Atom;
