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


function fetchData(ticker) {
	var fetchDeferred = Q.defer();

	fs.exists(util.format(".tmp/%s.csv", ticker), function (exists) {
		console.log(exists);
		if (!exists) {
			request(util.format('http://ichart.finance.yahoo.com/table.csv?s=%s&a=05&b=1&c=2013&d=05&e=30&f=2014&g=d&ignore=.csv', ticker))
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
