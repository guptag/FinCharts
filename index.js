var HistoricalPrices = require('./lib/historicalprices'),
	CandleStickChart = require('./controls/candlestickchart'),
	Q = require('q'),
	$ = require('jquery');


function renderChart () {
	HistoricalPrices.getDataForTicker("ge")
	.then(function (data) {
	 	console.log(CandleStickChart);
	 	console.log("width", $(window).width(), "height", $(window).height());
	 	new CandleStickChart({
	 		data: data,
	 		width: $(window).width(),
	 		height: $(window).height() - 5,
	 		selector: "#plot",
	 		Snap: Snap
	 	});
	 })
	.fail(function (err) {
		console.log(err);
	})
}

renderChart();


