var request = require('request'),
    fs = require('fs'),
    csv = require("csv"),
    Q = require("q"),
    util = require('util'),
    moment = require('moment'),
    sprintf = require("sprintf-js").sprintf,
    PriceSeries = require('../models/priceseries');

var  historicalPrices  = new function() {
    this.getDataForTicker = function (ticker) {
        return fetchData(ticker)
                 .then(parseData);
    }
};


function fetchData(chartInputs) {
    var fetchDeferred = Q.defer(), ticker = chartInputs.ticker;

    var toDate = moment().toDate();
    var fromDate = moment(toDate).subtract(chartInputs.timeframe, 'months').toDate();
    var range = chartInputs.range;

    var dataUrl = sprintf("http://ichart.finance.yahoo.com/table.csv?s=%s&a=%d&b=%d&c=%d&d=%d&e=%d&f=%d&g=%s&ignore=.csv",
                                                                        ticker,
                                                                        fromDate.getMonth(),
                                                                        fromDate.getDate(),
                                                                        fromDate.getFullYear(),
                                                                        toDate.getMonth(),
                                                                        toDate.getDate(),
                                                                        toDate.getFullYear(),
                                                                        range);

    var fileName = sprintf(".tmp/%s_%s_%s_%s.csv", ticker.toLowerCase(), range, moment(toDate).format('YYYYMMDD'), moment(fromDate).format('YYYYMMDD'));

    console.log(dataUrl, fileName);

    fs.exists(fileName, function (exists) {
        console.log(exists);
        if (!exists) {
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
    console.log(data);
    var series = new PriceSeries(data.ticker);
    var parseDeferred = Q.defer();
    console.log("started parsing...");
    csv()
        .from
        .stream(fs.createReadStream(data.fileName))
        .on('record', function (row, index) {
            series.add(row);
        })
        .on('end', function(count) {
            //console.log(series);
            parseDeferred.resolve(series);
        });

    return parseDeferred.promise;
}

module.exports = historicalPrices;
