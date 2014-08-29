var HistoricalPrices = require('./data/historicalprices'),
	CandleStickChart = require('./controls/candlestickchart'),
	LayoutEngine =  require('./layout/layoutengine'),
	Q = require('q'),
	$ = require('jquery'),
	_ = require("lodash");


var totalCharts = 2;

var defaultTicker = "MSFT";

var currentChartsLayout = "chartslayout_2b";

// move to template
var chartTemplate = _.template(
					'<div id="<%= chartId %>" class="chartcontainer" data-layout="<%= layoutId%>">' +
        					'<svg class="plot"></svg>' +
      				'</div>');

function init() {
	defineLayouts();

	$( document ).ready(function() {
	   renderUI();
	   //renderChart($("#ticker").attr("data-default"));
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

	LayoutEngine.addLayout("mainlayout", function(w, h) {
		return {
			width: w,
			height: h - 40,
			top: 40,
			left: 0
		};
	});

	LayoutEngine.addLayout("chartslayout_1a_1", function(w, h) {
		return {
			width: w,
			height: h,
			top: 0,
			left: 0
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_2a_1", function(w, h) {
		return {
			width: w/2,
			height: h,
			top: 0,
			left: 0
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_2a_2", function(w, h) {
		return {
			width: w/2,
			height: h,
			top: 0,
			left: w/2
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_2b_1", function(w, h) {
		return {
			width: w,
			height: h/2,
			top: 0,
			left: 0
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_2b_2", function(w, h) {
		return {
			width: w,
			height: h/2,
			top: h/2,
			left: 0
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_3a_1", function(w, h) {
		return {
			width: w/3,
			height: h,
			top: 0,
			left: 0
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_3a_2", function(w, h) {
		return {
			width: w/3,
			height: h,
			top: 0,
			left: w/3
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_3a_3", function(w, h) {
		return {
			width: w/3,
			height: h,
			top: 0,
			left: 2 * w/3
		};
	}, "mainlayout");


	LayoutEngine.addLayout("chartslayout_3b_1", function(w, h) {
		return {
			width: w,
			height: h/3,
			top: 0,
			left: 0
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_3b_2", function(w, h) {
		return {
			width: w,
			height: h/3,
			top: h/3,
			left: 0
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_3b_3", function(w, h) {
		return {
			width: w,
			height: h/3,
			top: 2 * h/3,
			left: 0
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_3c_1", function(w, h) {
		return {
			width: w/2,
			height: h,
			top: 0,
			left: 0
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_3c_2", function(w, h) {
		return {
			width: w/2,
			height: h/2,
			top: 0,
			left: w/2
		};
	}, "mainlayout");

	LayoutEngine.addLayout("chartslayout_3c_3", function(w, h) {
		return {
			width: w/2,
			height: h/2,
			top: h/2,
			left: w/2
		};
	}, "mainlayout");

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





