// https://github.com/stample/atom-react/blob/master/src/atomReactContext.js

var React = require("react/addons");
var Atom  = require("./atom");

function AppContext() {
    this.stores = [];
    this.enableLogging = "false";
    this.beforeRenderCallback = null;
    this.afterRenderCallback = null;
    this.lastRenderedState = null;
    this.mountConfig = null;

    this.atom = new Atom({
        beforeCommit: this.beforeAtomCommit.bind(this),
        afterCommit: this.afterAtomCommit.bind(this)
    });
}

AppContext.prototype.addStore = function (store) {
        // this.stores.push({store:store, storeManager: store.createStoreManager(this)});
}

AppContext.prototype.setMountConfig = function (reactClass, domNode) {
    /*
        this.mountConfig = {
            reactElementClass: reactClass,
            reactElementFactory: React.createFactory(reactClass),
            domNode: domNode
        }

     */
}

AppContext.prototype.beforeAtomCommit = function () {

}

AppContext.prototype.afterAtomCommit = function () {

}

AppContext.prototype.publishCommand = function (atomCommand) {

}

AppContext.prototype.transact = function (task) {

}

AppContext.prototype.renderAtomState = function (atom) {

}

AppContext.prototype.logStateBeforeRender = function () {

}

module.exports = AppContext;