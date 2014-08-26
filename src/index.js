var HistoricalPrices = require('./data/historicalprices'),
	CandleStickChart = require('./controls/candlestickchart'),
	LayoutEngine =  require('./layout/layoutengine'),
	Q = require('q'),
	$ = require('jquery'),
	_ = require("lodash");


function init() {
	defineLayouts();

	$( document ).ready(function() {
	   LayoutEngine.applyLayouts();
	   bindControls();
	   renderChart($("#ticker").attr("data-default"));
	   attachEvents();
	});
}

function defineLayouts() {
	LayoutEngine.addLayout("topbarlayout", function(w, h) {
		return {
			width: w,
			height: 40,
			top: 0,
			left: 0
		};
	});

	LayoutEngine.addLayout("plotlayout", function(w, h) {
		return {
			width: w,
			height: h - 40,
			top: 40,
			left: 0
		};
	});
}

function attachEvents() {
	// resize event
	$(window).on("resize", _.throttle(function () {
		LayoutEngine.applyLayouts();
		renderChart($("#ticker").val() || $("#ticker").attr("data-default"));
	}, 100));
}

function bindControls() {
  $("#ticker").keypress(function(event){
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if(keyCode == 13){
			renderChart(this.value);
		}
	}).focus();
}


function renderChart (ticker) {
	ticker = ticker.trim();

	if (!ticker) return;

	//new Date(year, month (0-11), day (1-31), hours (0-23), minutes(0-59), seconds, milliseconds);

	var chartInputs = {
		ticker: ticker,
		From: new Date(2013, 9, 1),
		To: new Date(2014, 5, 31),
		Range: "daily", //1min, 3min, 5min, 15min, 1hr, 2hr, 4hr, daily, weekly, monthly, yearly,
		Scale: "normal", //normal, log
		chartType: "candlestick" //candlestick, OHLC, HLC, Line, Area
	};

	HistoricalPrices.getDataForTicker(chartInputs)
	.then(function (data) {
	 	console.log("width", $("#plot").width(), "height", $("#plot").height());
	 	new CandleStickChart({
	 		data: data,
	 		width: $("#plot").width(),
	 		height: $("#plot").height(),
	 		selector: "#plot",
	 		Snap: Snap
	 	});
	 })
	.fail(function (err) {
		console.log(err);
	})
}

init();





