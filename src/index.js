var HistoricalPrices = require('./data/historicalprices'),
	CandleStickChart = require('./controls/candlestickchart'),
	LayoutEngine = require('./layout/layoutengine'),
	LayoutDefinitions =  require('./layout/layoutdefinitions'),
	Q = require('q'),
	$ = require('jquery'),
	_ = require("lodash");


var totalCharts = 1;

var defaultTicker = "MSFT";

var currentChartsLayout = "chartslayout_1a";

// move to template
var chartTemplate = _.template(
					'<div id="<%= chartId %>" class="chartcontainer" data-layout="<%= layoutId%>">' +
        					'<div class="maincontainer">' +
        						'<svg class="plot"></svg>' +
        					'</div>' +
      				'</div>');

function init() {
	LayoutDefinitions.init();

	$( document ).ready(function() {
	   renderUI();
	});
}

function renderUI() {
	_.times(totalCharts, function(index) {
		var chartId = "chart" + (index + 1);
		var layoutId = currentChartsLayout + "_" + (index + 1);
		var chartContainerHtml = chartTemplate(
										{
											'chartId': chartId,
										    'layoutId': layoutId
										});
		$("#main").append(chartContainerHtml);

		if (index === 0) {
			$("#" + chartId).addClass("active");
		}
	});

	LayoutEngine.applyLayouts();

	renderAllCharts();

	bindUI();
}

function bindUI() {
    $("#ticker").keypress(function(event){
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if(keyCode == 13){
			loadChart(".chartcontainer.active svg", this.value);
		}
	}).focus();

  	// resize event
	$(window).on("resize", _.throttle(function () {
		LayoutEngine.applyLayouts();
		renderAllCharts();
	}, 100));

	// active chart selection
	$("#main").on("click", ".chartcontainer", function () {
		var $this = $(this);
		if (!$this.hasClass("active")) {
			$(".chartcontainer.active").removeClass("active");
			$this.addClass("active");
		}
	});

	$(".layoutbutton").on("click.charts", function () {
		console.log("clciked");
		var $this = $(this);
		updateChartsLayout($this.attr("data-layout"), $this.attr("data-chartcount"));
	});
}

function updateChartsLayout(newLayoutId, newChartCount) {
	console.log("updateChartsLayout", newLayoutId, newChartCount);
		// add new chart containers and adjust layoutids
		if (newChartCount >= totalCharts) {
			_.times(newChartCount, function(index) {
				var chartId = "chart" + (index + 1);
				var layoutId = newLayoutId + "_" + (index + 1);

				if (!$("#" + chartId)[0]) {
					var chartContainerHtml = chartTemplate(
													{
														 'chartId': chartId,
													   'layoutId': layoutId
													});
					$("#main").append(chartContainerHtml);
				} else {
					$("#" + chartId).attr("data-layout", layoutId);
				}
			});
		} else {
			_.times(totalCharts, function(index) {

				var chartId = "#chart" + (index + 1);
				var layoutId = newLayoutId + "_" + (index + 1);

				// remove the extra charts from DOM
				if (index + 1 > newChartCount) {
					$(chartId).remove();
				}

				$(chartId).attr("data-layout", layoutId);
			});
		}

		if(!$(".chartcontainer.active")[0]) {
			$(".chartcontainer").first().addClass("active");
		}

		// update global state
		totalCharts = newChartCount;
		currentChartsLayout = newLayoutId;

		LayoutEngine.applyLayouts(true);
		renderAllCharts();

		Q.delay(0).then(function() {

		});

}

function renderAllCharts() {
	_.times(totalCharts, function(index) {
		var chartId = "#chart" + (index + 1);
		var svgSelector = chartId + " svg";
		loadChart(svgSelector);
	});
}


function loadChart(svgSelector, _ticker) {
	var $svg = $(svgSelector);

	var ticker = _ticker || $svg.attr("data-ticker") || defaultTicker;

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
		 	console.log("width", $svg.width(), "height", $svg.height());

		 	$svg.attr("data-ticker", ticker);

		 	new CandleStickChart({
		 		data: data,
		 		width: $svg.width(),
		 		height: $svg.height(),
		 		selector: svgSelector,
		 		Snap: Snap
		 	});
		 })
		.fail(function (err) {
			console.log(err);
		});
}

init();





