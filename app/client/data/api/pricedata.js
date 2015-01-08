var request = window.server.request,
    fs = window.server.fs,
    csv = window.server.csv,
    util = window.server.util,
    Q = require("q"),
    moment = require('moment'),
    sprintf = require("sprintf-js").sprintf;

var PriceDataApi = new function() {
    /**
     *  chartKeys: {
     *      ticker: "MSFT",
     *      timeframe: {
     *          from: <Date>,
     *          to: <Date>
     *      },
     *      duration: 'daily'
     *  }
     */
    this.getTickerDataAsync = function (chartKeys) {
        return fetchData(chartKeys)
                 .then(parseData);
    }
};


function fetchData(chartKeys) {
    var fetchDeferred = Q.defer(), ticker = chartKeys.ticker;

    var toDate = chartKeys.timeframe.to;
    var fromDate = chartKeys.timeframe.from;
    // var toDate = moment().toDate();
    // var fromDate = moment(toDate).subtract(chartKeys.timeframe.from, 'months').toDate();
    var duration = chartKeys.duration === "daily" ? "d" : (chartKeys.duration === "weekly" ? "w" : "m");

    var dataUrl = sprintf("http://ichart.finance.yahoo.com/table.csv?s=%s&a=%d&b=%d&c=%d&d=%d&e=%d&f=%d&g=%s&ignore=.csv",
                                        ticker,
                                        fromDate.getMonth(),
                                        fromDate.getDate(),
                                        fromDate.getFullYear(),
                                        toDate.getMonth(),
                                        toDate.getDate(),
                                        toDate.getFullYear(),
                                        duration);

    var fileName = sprintf("../../tempdb/%s_%s_%s_%s.csv", ticker.toLowerCase(), duration, moment(toDate).format('YYYYMMDD'), moment(fromDate).format('YYYYMMDD'));

    fs.exists(fileName, function (exists) {
        console.log("loading cached data from", fileName);
        if (!exists) {
            console.log("loading data from", dataUrl);
            request(dataUrl) //apr 2014 - sep 2014
                .pipe(fs.createWriteStream(fileName))
                .on('finish', function () {
                    console.log("data downloaded");
                    fetchDeferred.resolve({fileName: fileName, ticker: ticker});
                });
        } else {
            fetchDeferred.resolve({fileName: fileName, ticker: ticker});
        }
    });

    return fetchDeferred.promise;
}

// Jan12 - Jan7 - daily - http://finance.yahoo.com/q/hp?s=YHOO&a=00&b=12&c=1996&d=00&e=7&f=2014&g=d
// Dec12 - Dec7 - daily - http://finance.yahoo.com/q/hp?s=YHOO&a=11&b=12&c=1996&d=11&e=7&f=2014&g=d
// Dec12 - Dec7 - weekly - http://finance.yahoo.com/q/hp?s=YHOO&a=11&b=12&c=1996&d=11&e=7&f=2014&g=w
// Dec12 - Dec7 - montly - http://finance.yahoo.com/q/hp?s=YHOO&a=11&b=12&c=1996&d=11&e=7&f=2014&g=m

function parseData(data) {
    var returnData = {
        status: 'loaded',
        series: [],
        min: Infinity,
        max: -Infinity,
        minVolume: Infinity,
        maxVolume: -Infinity
    };

    var parseDeferred = Q.defer();
    csv()
        .from
        .stream(fs.createReadStream(data.fileName))
        .on('record', function (record, index) {
            if (record.length !== 7 || isNaN(record[1]) || isNaN(record[2]) ||
                isNaN(record[3]) || isNaN(record[4]) || isNaN(record[5]) ||
                isNaN(record[6])) {
                return;
            }

            var data = {
                date: Date.parse(record[0]),
                open: +parseFloat(record[1]).toFixed(2),
                high: +parseFloat(record[2]).toFixed(2),
                low: +parseFloat(record[3]).toFixed(2),
                close: +parseFloat(record[4]).toFixed(2),
                volume: +parseFloat(record[5]).toFixed(2),
                adjClose: +parseFloat(record[6]).toFixed(2),
            };

            // adjust prices for splits (unfortunately yahoo includes dividends in adjClose)
            // the prices displayed in this tool will be off by a bit
            /*var adjRatio = data.adjClose / data.close;
            data.open = formatNumber(data.open * adjRatio);
            data.high = formatNumber(data.high * adjRatio);
            data.low = formatNumber(data.low * adjRatio);
            data.close = formatNumber(data.close * adjRatio);*/

            returnData.series.unshift(data);

            if (data.low < returnData.min)
                returnData.min = data.low;

            if (data.high > returnData.max)
                returnData.max = data.high;

            if (data.volume < returnData.minVolume)
                returnData.minVolume = data.volume;

            if (data.volume > returnData.maxVolume)
                returnData.maxVolume = data.volume;
        })
        .on('end', function(count) {
            parseDeferred.resolve(returnData);
        });

    return parseDeferred.promise;
}

function formatNumber(number) {
      return +number.toFixed(3);
}

module.exports = PriceDataApi;