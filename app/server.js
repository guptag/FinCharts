//https://github.com/substack/node-browserify/issues/481

var serverContext = {};

// In case node-webkit's require() is still needed later on:
serverContext.requireNode = require;

// We cannot use the original names as node-webkit will reuse them in the window context.
serverContext.node_dirname = __dirname;

// More Node-context stuff that might be needed in "window" code
serverContext.argv = window.require('nw.gui').App.argv;
serverContext.node_proc = process;

// Import the node-space modules that need to be available in all windows
serverContext.fs        = require('fs');
serverContext.path      = require('path');
serverContext._         = require('lodash');
serverContext.Q         = require('q');
serverContext.immutable = require('immutable');

module.exports = serverContext;
