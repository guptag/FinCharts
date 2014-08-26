

function PriceSeries(ticker) {
	this.series = [];
	this.ticker = ticker;
	this.series.min = Infinity;
	this.series.max = -Infinity;
	this.series.minVolume = Infinity;
	this.series.maxVolume = -Infinity;
}

PriceSeries.prototype.add = function (record) {
	if (record.length !== 7 || isNaN(record[1]) || isNaN(record[2]) ||
		isNaN(record[3]) || isNaN(record[4]) ||	isNaN(record[5]) ||
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

	this.series.unshift(data);

	if (data.low < this.series.min)
		this.series.min = data.low;

	if (data.high > this.series.max)
		this.series.max = data.high;

	if (data.volume < this.series.minVolume)
		this.series.minVolume = data.volume;

	if (data.volume > this.series.maxVolume)
		this.series.maxVolume = data.volume;
}

module.exports = PriceSeries;

