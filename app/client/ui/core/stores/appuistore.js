var _ = require("lodash");
var Immutable = require('immutable');
var BaseStore = require("ui/core/stores/basestore");
var Commands = require("ui/core/atomconstants").commands;

var commandHandlers = {
    /**
     * [toggleTimeframeOptions description]
     * @param  {[type]} payload {
     *                            show: true/false,
     *                            rect: {
     *                              left: 500,
     *                              top: 200
     *                           }}
     * @return {[type]}         [description]
     */
    toggleTimeframeOptions: function (payload) {
        this.atom.transact(function (state) {
            var resetFlagsState = this._resetPopupFlags(state);

            if (!payload.show) {
                return resetFlagsState;
            }

            var setFlagState = resetFlagsState.updateIn(['appUIStore', 'popup', 'flags', 'timeframeOptions'], function (value) {
                return true;
            });

            return setFlagState.updateIn(['appUIStore', 'popup', 'rect'], function (value) {
                return Immutable.fromJS(payload.rect);
            });
        }.bind(this));
    },

    toggleDurationOptions: function (payload) {
        this.atom.transact(function (state) {
            var resetFlagsState = this._resetPopupFlags(state);

            if (!payload.show) {
                return resetFlagsState;
            }

            var setFlagState = resetFlagsState.updateIn(['appUIStore', 'popup', 'flags', 'durationOptions'], function (value) {
                return true;
            });

            return setFlagState.updateIn(['appUIStore', 'popup', 'rect'], function (value) {
                return Immutable.fromJS(payload.rect);
            });

        }.bind(this));
    },

    toggleChartLayoutOptions: function (payload) {
        this.atom.transact(function (state) {
            var resetFlagsState = this._resetPopupFlags(state);

            if (!payload.show) {
                return resetFlagsState;
            }

            var setFlagState = resetFlagsState.updateIn(['appUIStore', 'popup', 'flags', 'chartLayoutOptions'], function (value) {
                return true;
            });

            return setFlagState.updateIn(['appUIStore', 'popup', 'rect'], function (value) {
                return Immutable.fromJS(payload.rect);
            });
        }.bind(this));
    },

    onWindowResize: function (payload) {
        this.atom.transact(function (state) {

        }.bind(this));
    }
};


function AppUIStore(atom) {
    BaseStore.call(this, atom);
    this.registerCommandHandlers([
        { key: Commands.APP_WINDOW_RESIZE,              value: _.debounce(commandHandlers.onWindowResize.bind(this), 600) },
        { key: Commands.APP_TOGGLE_TIMEFRAME_OPTIONS,   value: commandHandlers.toggleTimeframeOptions.bind(this) },
        { key: Commands.APP_TOGGLE_DURATION_OPTIONS,    value: commandHandlers.toggleDurationOptions.bind(this) },
        { key: Commands.APP_TOGGLE_CHARTLAYOUT_OPTIONS, value: commandHandlers.toggleChartLayoutOptions.bind(this) }
    ]);
}

AppUIStore.prototype = _.create(BaseStore.prototype, {

    'constructor': AppUIStore,

    _resetPopupFlags: function (state) {
        return state.updateIn(['appUIStore', 'popup', 'flags'], function (obj) {
            return Immutable.fromJS(obj.toSeq().map(v => false).toObject());
        });
    },

    isDurationPopupOpen: function () {
        var atomState = this.atom.getState();
        return atomState.getIn(['appUIStore', 'popup', 'flags', 'durationOptions'])
    },

    isTimeframePopupOpen: function () {
        var atomState = this.atom.getState();
        return atomState.getIn(['appUIStore', 'popup', 'flags', 'timeframeOptions'])
    },

    isLayoutPopupOpen: function () {
        var atomState = this.atom.getState();
        return atomState.getIn(['appUIStore', 'popup', 'flags', 'chartLayoutOptions'])
    },

    getPopupFlags: function () {
        var atomState = this.atom.getState();
        return atomState.getIn(['appUIStore', 'popup', 'flags']).toJS();
    },

    getPopupRect: function () {
        var atomState = this.atom.getState();
        return atomState.getIn(['appUIStore', 'popup', 'rect']).toJS();
    }

});

module.exports = AppUIStore;