var _ = require('lodash');

var dateTimeHelper =  {
    /*
        returns {
                crossovers: {
                            years: <total number of year crossovers (total # of jan 1)>,
                            months: <total number of month crossovers (total # of 1st of the months))>
                    };
            }
    */
    getCrossoverStats: function (beginDate, endDate) {
        return {
            crossovers:  {
                years: getYearCrossovers(beginDate, endDate),
                months: getYearCrossovers(beginDate, endDate)
            };
        }
    },

    getYearCrossovers: function(beginDate, endDate) {
        var val =  (endDate.getUTCFullYear() - beginDate.getUTCFullYear()) +
                       ((beginDate.getUTCMonth() === 0 && beginDate.getUTCDate() === 1) ? 1 : 0);

        console.log("years", beginDate, endDate, val);
    },

    getMonthCrossovers: function(beginDate, endDate) {
        var inBetweenYears =  (endDate.getUTCFullYear() - beginDate.getUTCFullYear() - 1);
        var isSameYear = (endDate.getUTCFullYear() === beginDate.getUTCFullYear());

        if (inBetweenYears < 0) {
            inBetweenYears = 0;
        }

        var val = (inBetweenYears * 12) +
                  (isSameYear ? (endDate.getUTCMonth() - beginDate.getUTCMonth()) :
                       (12 - beginDate.getUTCMonth() - 1) + (endDate.getUTCMonth() + 1)) +
                  ((beginDate.getUTCMonth() === 0 && beginDate.getUTCDate() === 1) ? 1 : 0);

        console.log("months", beginDate, endDate, val);
    }
};

module.exports = dateTimeHelper;