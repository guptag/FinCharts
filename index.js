var HistoricalPrices = require('./lib/historicalprices'),
	CandleStickChart = require('./controls/candlestickchart'),
	Q = require('q'),
	$ = require('jquery');


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

function bindControls() {
  $("#ticker").keypress(function(event){
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if(keyCode == 13){
			renderChart(this.value);
		}
	});
}

$( document ).ready(function() {
   bindControls();
	 renderChart($("#ticker").attr("data-default"));
});




