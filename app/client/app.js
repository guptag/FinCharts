/** @jsx React.DOM */

// https://github.com/rogerwang/node-webkit/issues/1188#issuecomment-26002789
// https://github.com/substack/node-browserify/issues/481
// https://github.com/greypants/gulp-starter/issues/17
// http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
// https://github.com/joyent/node/issues/2479



/*var React = require('react');

var TodoApp = require('ui/components/TodoApp.react');

module.exports = {
  init: function() {
    React.renderComponent(
              <TodoApp />,
              document.getElementById('todoapp'));
  }
};*/


//var React = require("react/addons");

var AppContext = require("./ui/core/appcontext");
var AtomCommand = require("./ui/core/atomcommand");
var AtomConstants = require("./ui/core/atomconstants");

module.exports = {
  init: function() {
    /*React.renderComponent(
              <TodoApp />,
              document.getElementById('todoapp'));*/
    AppContext.init();

    console.log(AppContext.stores.chartStore.getTicker());
    console.log(AppContext.stores.chartStore.getTimeframe());
    console.log(AppContext.stores.chartStore.getRange());

    AppContext.publishCommand(new AtomCommand(
        AtomConstants.commands.CHART_UPDATE_TICKER,
        {ticker: "GOOGL"}
      ));

    console.log(AppContext.stores.chartStore.getTicker());

    AppContext.publishBatchCommands([
      new AtomCommand(
        AtomConstants.commands.CHART_UPDATE_TICKER,
        {ticker: "IBM"}
      ),
      new AtomCommand(
        AtomConstants.commands.CHART_UPDATE_TIMEFRAME,
        {timeframe: {from: new Date(), to: new Date()}}
      ),
      new AtomCommand(
        AtomConstants.commands.CHART_UPDATE_RANGE,
        {range: "weekly"}
      )
    ]);

    console.log(AppContext.stores.chartStore.getTicker());
    console.log(AppContext.stores.chartStore.getTimeframe());
    console.log(AppContext.stores.chartStore.getRange());
  }
};






