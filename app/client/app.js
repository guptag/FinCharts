/** @jsx React.DOM */

// https://github.com/rogerwang/node-webkit/issues/1188#issuecomment-26002789
// https://github.com/substack/node-browserify/issues/481
// https://github.com/greypants/gulp-starter/issues/17
// http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
// https://github.com/joyent/node/issues/2479


var React = require("react/addons");
var Header = require("./ui/components/header/header.react");
var Main = require("./ui/components/main/index.react");
var jQuery = require("jquery");

var AppContext = require("./ui/core/appcontext");
var AtomCommand = require("./ui/core/atomcommand");
var ChartActions = require("./ui/core/actions/chartactions");

// TODO: move to unit tests
function testAtom () {
    console.log(AppContext.stores.chartStore.getTicker());
    console.log(AppContext.stores.chartStore.getTimeframe());
    console.log(AppContext.stores.chartStore.getDuration());

    AppContext.publishCommand(new AtomCommand(
        AtomCommand.commands.CHART_UPDATE_TICKER,
        {ticker: "GOOGL"}
      ));

    console.log(AppContext.stores.chartStore.getTicker());

    AppContext.publishBatchCommands([
      new AtomCommand(
        AtomCommand.commands.CHART_UPDATE_TICKER,
        {ticker: "IBM"}
      ),
      new AtomCommand(
        AtomCommand.commands.CHART_UPDATE_TIMEFRAME,
        {timeframe: {from: new Date(), to: new Date()}}
      ),
      new AtomCommand(
        AtomCommand.commands.CHART_UPDATE_DURATION,
        {duration: "weekly"}
      )
    ]);

    console.log(AppContext.stores.chartStore.getTicker());
    console.log(AppContext.stores.chartStore.getTimeframe());
    console.log(AppContext.stores.chartStore.getDuration());
}

function testActions() {
    ChartActions.updateTicker("ibm");
}


var Application = React.createClass({
    render: function() {
        return (
            <section id="application">
              <Header/>
              <Main/>
            </section>
        );
    }
});


module.exports = {
  init: function() {
    AppContext.init(Application, jQuery("#root")[0]);
    AppContext.renderAtomState();

    //testAtom();
    testActions();
  }
};






