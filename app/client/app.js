/** @jsx React.DOM */

// https://github.com/rogerwang/node-webkit/issues/1188#issuecomment-26002789
// https://github.com/substack/node-browserify/issues/481
// https://github.com/greypants/gulp-starter/issues/17
// http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
// https://github.com/joyent/node/issues/2479


var React = require("react/addons");
var Header = require("ui/components/app/header.react");
var Main = require("ui/components/app/main.react");
var Popups = require("ui/components/app/popups.react");
var jQuery = require("jquery");

var LayoutEngine = require("ui/core/layout/layoutengine");
var LayoutDefinitions = require("ui/core/layout/layoutdefinitions");

var AppContext = require("ui/core/appcontext");
var AtomCommand = require("ui/core/atomcommand");
var ChartActions = require("ui/core/actions/chartactions");

// TODO: move to unit tests
function testAtom () {
   /* console.log(AppContext.stores.chartStore.getTicker());
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
    console.log(AppContext.stores.chartStore.getDuration()); */

    /* AppContext.publishCommand(new AtomCommand(
        AtomCommand.commands.APP_TOGGLE_TIMEFRAME_OPTIONS,
        {show: true, rect: {top: 50, left: 100}}
      ));

    AppContext.publishCommand(new AtomCommand(
        AtomCommand.commands.APP_TOGGLE_DURATION_OPTIONS,
        {show: true, rect: {top: 150, left: 400}}
      )); */
}

function testActions() {
    ChartActions.updateTicker("ibm");
}

var Application = React.createClass({
    render: function() {
        var appStyle = {
            position: 'absolute',
            width: '1400px',
            height: '700px',
            top: '0px',
            left: '0px'
        };

        return (
            <section id="application" style={appStyle}>
              <Header/>
              <Main/>
              <Popups/>
            </section>
        );
    }
});


module.exports = {
    init: function() {
        LayoutDefinitions.init();
        AppContext.init(Application, jQuery("#root")[0]);
        this.renderApp();

        testAtom();
        testActions();
    },
    renderApp: function () {
        LayoutEngine.resolveLayouts();
        AppContext.renderAtomState();
    }
};






