var _ = require('lodash');


var increments = [0.01, 0.02, 0.025, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100,
                  200, 500, 1000, 2000, 5000, 10000, 50000, 100000, 500000];

var PriceMarkers = {
    generate : function (minValue, maxValue, height) {
        var minRowHeight = 75;

        if (height < minRowHeight) {
            return [minValue, maxValue];
        } else {
            var approxRows = Math.floor(height / 60);
            var diffUnit = (maxValue - minValue) / approxRows;

            // pick the right increment based on unit
            var increment;
            for (var i = increments.length - 1; i >= 0; --i) {
                if (diffUnit === increments[i]) {
                    increment = increments[i];
                    break;
                } else if (i > 0 && diffUnit < increments[i] && diffUnit > increments[i-1]) {
                    var mid = (increments[i-1] + increments[i]) / 2;
                    increment = diffUnit > mid ? increments[i] : increments[i-1];
                    increment = increments[i];
                    break;
                }
            }

            var roundedMin =  Math.floor(minValue / increment) * increment - increment;
            var roundedMax =  Math.ceil(maxValue / increment) * increment + increment;

            var labels = [], labelValue = roundedMin < 0 ? 0 : roundedMin;
            while (labelValue < roundedMax) {
                labels.push(labelValue);
                labelValue += increment;
            }

            return labels;
        }
    }
}

module.exports = PriceMarkers;
