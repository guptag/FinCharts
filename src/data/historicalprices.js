var request = require('request'),
	fs = require('fs'),
	csv = require("csv"),
	Q = require("q"),
	util = require('util'),
	PriceSeries = require('../models/priceseries');

var  historicalPrices  = new function() {
	this.getDataForTicker = function (ticker) {
		return fetchData(ticker)
				 .then(parseData);
	}
};


function fetchData(chartInputs) {
	var fetchDeferred = Q.defer(), ticker = chartInputs.ticker;

	fs.exists(util.format(".tmp/%s.csv", ticker), function (exists) {
		console.log(exists);
		if (!exists) {
			request(util.format('http://ichart.finance.yahoo.com/table.csv?s=%s&a=11&b=1&c=2013&d=05&e=30&f=2014&g=d&ignore=.csv', ticker)) //dec 2013 - may 2014
				.pipe(fs.createWriteStream(util.format(".tmp/%s.csv", ticker)))
				.on('finish', function () {
					console.log("data downloaded");
					fetchDeferred.resolve({fileName: util.format(".tmp/%s.csv", ticker), ticker: ticker});
				});
		} else {
			fetchDeferred.resolve({fileName: util.format(".tmp/%s.csv", ticker), ticker: ticker});
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
