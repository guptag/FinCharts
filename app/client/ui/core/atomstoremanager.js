




/*
var AtomReactStoreManager = function AtomReactStoreManager(context,path,store) {
    Preconditions.checkHasValue(context);
    Preconditions.checkHasValue(store);
    this.context = context;
    this.path = path;
    this.store = store;
    // TODO probably not very elegant
    this.store.description.cursor = this.context.atom.cursor().follow(this.path);
    this.store.description.transact = this.context.atom.transact.bind(this.context.atom);

    // TODO this is a temporary hack that should be removed when we know how to handle CQRS Sagas better
    this.store.description.temporaryHack_publishEvents = this.context.publishEvents.bind(this.context);

    // TODO remove deprecated name!
    this.store.description.storeCursor = this.context.atom.cursor().follow(this.path);
};

// TODO this should be removed in favor of bootstrap event
AtomReactStoreManager.prototype.init = function() {
    if ( this.store.description.init ) {
        this.store.description.init();
    }
};

AtomReactStoreManager.prototype.handleEvent = function(event) {
    this.store.description.handleEvent(event);
};
AtomReactStoreManager.prototype.handleCommand = function(command) {
    if ( this.store.description.handleCommand ) {
        return this.store.description.handleCommand(command);
    }
};
exports.AtomReactStoreManager = AtomReactStoreManager;
*/
