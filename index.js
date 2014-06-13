var HistoricalPrices = require('./data/historicalprices'),
	CandleStickChart = require('./controls/candlestickchart'),
	LayoutEngine =  require('./layout/layoutengine'),
	Q = require('q'),
	$ = require('jquery');


function init() {
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


function bindControls() {
  $("#ticker").keypress(function(event){
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if(keyCode == 13){
			renderChart(this.value);
		}
	});
}


function renderChart (ticker) {
	ticker = ticker.trim();

	if (!ticker) return;

	HistoricalPrices.getDataForTicker(ticker)
	.then(function (data) {
	 	console.log(CandleStickChart);
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

$( document ).ready(function() {
   LayoutEngine.applyLayouts();
   bindControls();
   renderChart($("#ticker").attr("data-default"));
});




