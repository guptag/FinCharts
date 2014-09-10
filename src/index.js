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

var chartsCollection = {}; //key -> chartid in dom; value -> chart instance

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
            loadChart($(".chartcontainer.active").attr("id"), this.value);
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

            // preview to play mode
            stopAllPreviews();
            $("#app .previewoptions").removeClass("stopview").addClass("playview");
        }
    });

    $(".layoutbutton").on("click.charts", function () {
        var $this = $(this);
        updateChartsLayout($this.attr("data-layout"), $this.attr("data-chartcount"));
    });

    $("#play").click(function () {
        stopAllPreviews();
        $("#app .previewoptions").removeClass("playview").addClass("stopview");

        var activeChartId = $(".chartcontainer.active")[0].id;
        chartsCollection[activeChartId].chartPreview.play();
    });

    $("#stop").click(function () {
        $("#app .previewoptions").removeClass("stopview").addClass("playview");

        var activeChartId = $(".chartcontainer.active")[0].id;
        chartsCollection[activeChartId].chartPreview.stop();
    });

    $("#pause").click(function () {
        if ($(this).text() === "||") {
            $(this).text("|>");
        } else {
            $(this).text("||");
        }
        var activeChartId = $(".chartcontainer.active")[0].id;
        chartsCollection[activeChartId].chartPreview.pause();
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
}

function renderAllCharts() {
    chartsCollection = {}; //reset state
    var promiseCollection = [];
    $("#app .previewoptions").addClass("hide"); //hide preview options

    _.times(totalCharts, function(index) {
        var chartId = "chart" + (index + 1);
        promiseCollection.push(loadChart(chartId));
    });

    Q.allSettled(promiseCollection)
     .then(function () {
        $("#app .previewoptions").removeClass("hide stopview").addClass("playview"); //show preview options
     })
}


function loadChart(chartId, _ticker) {
    var svgSelector = "#" + chartId + " svg";
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

    return HistoricalPrices.getDataForTicker(chartInputs)
                .then(function (data) {
                        console.log("width", $svg.width(), "height", $svg.height());

                        $svg.attr("data-ticker", ticker);

                        var chart = new CandleStickChart({
                            data: data,
                            width: $svg.width(),
                            height: $svg.height(),
                            selector: svgSelector,
                            timerCb: function () {
                               var frequency = parseFloat($("#previewfrequency").val());
                               if (frequency && frequency < 3) {
                                return frequency * 1000;
                               }
                               return 1000;
                            },
                            Snap: Snap
                        });

                        chartsCollection[chartId] = chart;
                 })
                .fail(function (err) {
                    console.log(err);
                });
}

function stopAllPreviews() {
    _.each(chartsCollection, function(chart, chartId) {
        chart.chartPreview.stop();
    })
}

init();





