var request = window.server.request,
    Q = require("q"),
    moment = require('moment'),
    _ = require("lodash"),
    sprintf = require("sprintf-js").sprintf,
    db = require("data/db/finchartsdb");

var PriceDataApi = {
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
    getTickerDataAsync: function (chartKeys) {
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


    var cacheKey = sprintf("%s_%s_%s_%s", ticker.toLowerCase(), duration, moment(toDate).format('YYYYMMDD'), moment(fromDate).format('YYYYMMDD'));

    getFromCache(cacheKey)
      .then(function (rowData /* {key: "", data: ""} */) {
        if (rowData) {
          fetchDeferred.resolve({priceData: rowData.data, ticker: ticker});
        } else {
          getDataFromServer(dataUrl)
            .then(function (priceData) {
              addToCache(cacheKey, priceData)
                .then(function () {
                  fetchDeferred.resolve({priceData: priceData, ticker: ticker});
                });
            });
        }
      });

    return fetchDeferred.promise;
}

function getFromCache(cacheKey) {
  return db.pricetable
          .where('key')
          .equals(cacheKey)
          .first()
          .then(function (priceData) {
            console.log("data loaded from indexDb", priceData);
            return priceData;
          }).catch(function (error) {
            console.log("IndexDb error:", error);
            return "";
          });
}


function getDataFromServer(dataUrl) {
  console.log("loading data from", dataUrl);
  var serverDataDeferred = Q.defer();
  request(dataUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("data downloaded");
      serverDataDeferred.resolve(body);
    }
  });
  return serverDataDeferred.promise;
}

function addToCache(cacheKey, priceData) {
  console.log("adding data to indexdb", cacheKey);
  return db.pricetable
          .add({key: cacheKey, data: priceData})
          .catch(function (error) {
            console.log("IndexDb add error:", error, cacheKey);
            return "";
          });
}

// Jan12 - Jan7 - daily - http://finance.yahoo.com/q/hp?s=YHOO&a=00&b=12&c=1996&d=00&e=7&f=2014&g=d
// Dec12 - Dec7 - daily - http://finance.yahoo.com/q/hp?s=YHOO&a=11&b=12&c=1996&d=11&e=7&f=2014&g=d
// Dec12 - Dec7 - weekly - http://finance.yahoo.com/q/hp?s=YHOO&a=11&b=12&c=1996&d=11&e=7&f=2014&g=w
// Dec12 - Dec7 - montly - http://finance.yahoo.com/q/hp?s=YHOO&a=11&b=12&c=1996&d=11&e=7&f=2014&g=m

// data - {priceData: "string", ticker: "ticker"}

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

    var dateRecords = data.priceData.split('\n');

    _.each(dateRecords, function (dataRow) {
        var record = (dataRow || "").split(',');

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
            adjClose: +parseFloat(record[6]).toFixed(2)
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
      });

      parseDeferred.resolve(returnData);

      return parseDeferred.promise;
}

/*function formatNumber(number) {
      return +number.toFixed(3);
}*/

module.exports = PriceDataApi;
