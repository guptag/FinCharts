//https://github.com/substack/node-browserify/issues/481


// In case node-webkit's require() is still needed later on:
window.requireNode = require;

// We cannot use the original names as node-webkit will reuse them in the window context.
window.node_dirname = __dirname;

// More Node-context stuff that might be needed in "window" code
window.argv = window.require('nw.gui').App.argv;
window.node_proc = process;

// Import the node-space modules that need to be available in all windows
window.fs     = require('fs');
window.path   = require('path');
window._      = require('lodash');
window.Q      = require('q');
