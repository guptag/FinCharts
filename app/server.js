//https://github.com/substack/node-browserify/issues/481

var serverContext = {};

// In case node-webkit's require() is still needed later on:
serverContext.requireNode = require;

// We cannot use the original names as node-webkit will reuse them in the window context.
serverContext.node_dirname = __dirname;

// More Node-context stuff that might be needed in "window" code
serverContext.node_proc = process;

// Import the node modules that need to be available in all windows
serverContext.path    = require('path');
serverContext.request = require('request');
serverContext.util    = require("util");

module.exports = serverContext;
