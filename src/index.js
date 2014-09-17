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
            $("#app .previewoptions").removeClass("stopview").addClass("playview");
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

            var chartId = $this.attr("id");
            var chartInputs = chartsCollection[chartId].options.chartInputs;
            var numOfMonths = chartInputs.timeframe;
            $("#timeframe").val(chartInputs.timeframe);
            var $range = $("#range");
            if (numOfMonths > 120) {
                $range.find("option[value='d']").attr("disabled", "disabled");
                $range.find("option[value='w']").attr("disabled", "disabled");
            } else if  (numOfMonths > 24) {
              $range.find("option[value='w']").removeAttr("disabled");
              $range.find("option[value='d']").attr("disabled", "disabled");
            } else {
                $range.find("option[value='d']").removeAttr("disabled");
                $range.find("option[value='w']").removeAttr("disabled");
            }
            $("#range").val(chartInputs.range);
            console.log(chartInputs.timeframe, chartInputs.range);

        }
    });

    $(".layoutbutton").on("click.charts", function () {
        var $this = $(this);
        updateChartsLayout($this.attr("data-layout"), $this.attr("data-chartcount"));
    });

    $("#timeframe").change(function () {
        var numOfMonths = $(this).val();
        var $range = $("#range");
        var range = $range.val();
        if (numOfMonths > 120) {
            $range.find("option[value='d']").attr("disabled", "disabled");
            $range.find("option[value='w']").attr("disabled", "disabled");
            if (range === "w" || range === "d") {
                $range.val("m");
            }
        } else if  (numOfMonths > 24) {
        	  $range.find("option[value='w']").removeAttr("disabled");
            $range.find("option[value='d']").attr("disabled", "disabled");;
            if (range === "d") {
                $range.val("w");
            }
        } else {
            $range.find("option[value='d']").removeAttr("disabled");
            $range.find("option[value='w']").removeAttr("disabled");
        }

        loadChart($(".chartcontainer.active").attr("id"));
    });

    $("#range").change(function () {
        loadChart($(".chartcontainer.active").attr("id"));
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
        timeframe: $("#timeframe").val(), /* # of months */
        range: $("#range").val(), // d, w, m
        scale: "normal", //normal, log
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
                            chartInputs: chartInputs,
                            timerCb: function () {
                               var frequency = parseFloat($("#previewfrequency").val());
                               if (frequency && frequency < 3) {
                                return frequency * 1000;
                               }
                               return 1000;
                            },
                            hidePriceAnimationCb: function () {
                                console.log(!!($('#hidePriceAnimation').prop('checked')));
                                return !!($('#hidePriceAnimation').prop('checked'));
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





