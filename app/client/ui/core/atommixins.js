
var React = require("react/addons");

// var Atom = require("./atom");
var AppContext = require("./appcontext");
var Logger = require("./utils/logger");

// https://github.com/stample/atom-react/blob/master/src/atomReact.js
function shallowEqualObjects(prev, next) {
    if (prev === next) {
        return true;
    }

    if ( Object.keys(prev).length !== Object.keys(next).length ) {
        return false;
    }

    var key;
    for (key in prev) {
        if ( prev[key] !== next[key] ) return false;
    }
    return true;
}


var PureRenderMixin = {
    shouldComponentUpdate: function(nextProps, nextState) {
        try {
            var propsChanged = (this.props !== nextProps);
            var stateChanged = shallowEqualObjects(this.state, nextState); //todo: needed ?
            var shouldUpdate = propsChanged || stateChanged;

            if ( shouldUpdate ) {
                Logger.log("[", this.getDisplayName(), "] should update!", "propsChanged:", propsChanged, "stateChanged:", stateChanged);
            }

            return shouldUpdate;
        } catch (e) {
            Logger.error("Error in 'shouldComponentUpdate' for component ",this.getDisplayName(), e.message, e.stack);
            return true;
        }
    }
};


var TransactMixin = {
    contextTypes: {
        appContext: React.PropTypes.instanceOf(AppContext).isRequired
    },
    transact: function(tasks) {
        this.context.appContext.atom.transact(tasks);
    }
};

var PublishCommandMixin = {
    contextTypes: {
        appContext: React.PropTypes.instanceOf(AppContext).isRequired
    },
    publishCommand: function(command) {
        this.context.appContext.publishCommand(command);
    }
};



module.exports = {
    PureRenderMixin: PureRenderMixin,
    TransactMixin: TransactMixin,
    PublishCommandMixin: PublishCommandMixin
};

