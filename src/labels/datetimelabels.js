var _ = require('lodash');

/*

    Some data scenarios:

    2-min updates:
        Nov 10 3:40 pm
        Nov 10 3:42 pm
        Nov 10 3:44 pm
        Nov 10 3:46 pm

    5-min updates:
        Nov 10 3:20 pm
        Nov 10 3:25 pm
        Nov 10 3:30 pm
        Nov 10 3:35 pm


    1-hr updates:
        Nov 10 1:00 pm
        Nov 10 2:00 pm
        Nov 10 3:00 pm
        Nov 10 4:00 pm


    2-hr updates:
        Nov 10 10:00 am
        Nov 10 12:00 pm
        Nov 10 2:00 pm
        Nov 10 4:00 pm


    Daily updates:
        Dec 28 2013 7:00 pm
        Dec 29 2013 7:00 pm
        Dec 30 2013 7:00 pm
        Dec 31 2013 7:00 pm
        Jan 1 2014 7:00 pm
        Jan 2 2014 7:00 pm


    Weekly updates:
        Dec 1 2013
        Dec 8 2013
        Dec 15 2013
        Dec 22 2013
        Dec 29 2013
        Jan 5 2014


    Monthly updates:
        Sep 1 2013
        Oct 1 2013
        Nov 1 2013
        Dec 1 2013
        Jan 1 2014
        Feb 1 2014


    Yearly updates:
        2013
        2014
        2015
        2016


*/


var _ = require('lodash');
var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var DateTimeLabels = {
    generate : function (data, range, width) {
        var minColWidth = 75,
            dayLabelDropDistance = 5,
            monthLabelDropDistance = 5,
            totalColumns = Math.floor(width / minColWidth),
            columnPerPoints = Math.floor(data.series.length / totalColumns),
            dateTimeLabels = [];

        switch (range.toLowerCase()) {
            /*
                YEARLY:
                    total labels = width / 100 (1 label per 100px)
                    labelsPerPoints = total data points / total labels (1 label per N points)
                    labelsPerPoints < 0 - add labels for all points
                    ELSE
                        _.forEach(datapoint, index)
                             if (index % labelsPerPoints === 0)
                                    Show YEAR

            */
            case "y":
                dateTimeLabels = _.chain(data.series).map(function(data, index) {
                    var dateObj = new Date(data.date);
                    if (columnPerPoints <= 0 || index % columnPerPoints === 0) {
                        return {
                            dataItemIndex: index,
                            label : dateObj.getUTCFullYear()
                        };
                    }
                }).compact().value();
                break;

            case "m":
            case "w":
                /*
                MONTHLY:
                WEEKLY:
                    total labels = width / 100 (1 label per 100px)
                    labelsPerPoints = total data points / total labels (1 label per N points)
                    labelsPerPoints < 0 - add labels for all points
                    ELSE
                        If (firstdatapoint is of jan and dates are either 1 2 or 3)
                            show YEAR

                        if (year changes with this current data point)
                            show YEAR

                        if (current index % columnPerPoints === 0)
                            show MONTH
                */
                var currentYear;
                dateTimeLabels = _.chain(data.series)
                                  .map(function(data, index) {
                                        var dateObj = new Date(data.date);
                                        var addYearLabel = false, addMonthLabel = false;

                                        var date = dateObj.getUTCDate(),
                                            month = dateObj.getUTCMonth(),
                                            year = dateObj.getUTCFullYear();

                                        var isFirstPoint = (index === 0);
                                        var isJanuary = (dateObj.getUTCMonth() === 0);
                                        var probableFirstWeekDayInMonth = (dateObj.getUTCDate() === 1 || dateObj.getUTCDate() === 2 || dateObj.getUTCDate() === 3);

                                        var isYearChanged = (currentYear !== year);

                                        var isIndexMultipleOfColumnPerPoints = (columnPerPoints <= 0 || index % columnPerPoints === 0);

                                        if (isFirstPoint) {
                                            currentYear = year;
                                        }

                                        if ((isFirstPoint && isJanuary && probableFirstWeekDayInMonth) ||
                                            (isYearChanged)) {
                                            addYearLabel = true;
                                            currentYear = dateObj.getUTCFullYear();
                                        } else if (isIndexMultipleOfColumnPerPoints) {
                                            addMonthLabel = true;
                                        }

                                        if (addYearLabel || addMonthLabel) {
                                            return {
                                                dataItemIndex: index,
                                                label: (addYearLabel ? year : shortMonths[month]) + "",
                                                isBold: addYearLabel
                                            };
                                        }

                                })
                                .compact().value();
                break;

            case "d":
                /*
                DAILY:
                    total labels = width / 100 (1 label per 100px)
                    labelsPerPoints = total data points / total labels (1 label per N points)
                    labelsPerPoints < 0 - add labels for all points
                    ELSE
                        If (firstdatapoint is of jan and dates are either 1 2 or 3)
                            show YEAR

                        if (year changes with this current data point)
                            show YEAR

                        If (firstdatapoint is of dates 1 2 or 3)
                            show MONTH

                        if (month changes with this current data point)
                            show MONTH

                        if (current index % columnPerPoints === 0)
                            show DAY
                */
                var currentYear, currentMonth;
                dateTimeLabels = _.chain(data.series)
                                .map(function(data, index) {
                                    var dateObj = new Date(data.date);
                                    var addYearLabel = false, addMonthLabel = false, addDayLabel = false;

                                    var date = dateObj.getUTCDate(),
                                        month = dateObj.getUTCMonth(),
                                        year = dateObj.getUTCFullYear();

                                    var isFirstPoint = (index === 0);
                                    var isJanuary = (dateObj.getUTCMonth() === 0);
                                    var probableFirstWeekDayInMonth = (dateObj.getUTCDate() === 1 || dateObj.getUTCDate() === 2 || dateObj.getUTCDate() === 3);

                                    var isYearChanged = (currentYear !== year);
                                    var isMonthChanged =  (currentMonth !== dateObj.getUTCMonth());

                                    var isIndexMultipleOfColumnPerPoints = (columnPerPoints <= 0 || index % columnPerPoints === 0);

                                    if (isFirstPoint) {
                                        currentYear = year;
                                        currentMonth = month;
                                    }

                                    if ((isFirstPoint && isJanuary && probableFirstWeekDayInMonth) ||
                                        (isYearChanged)) {
                                        addYearLabel = true;
                                        currentYear = dateObj.getUTCFullYear();
                                        currentMonth = dateObj.getUTCMonth();
                                    } else if ((isFirstPoint && probableFirstWeekDayInMonth) ||
                                        (isMonthChanged)) {
                                        addMonthLabel = true;
                                        currentMonth = dateObj.getUTCMonth();
                                    } else if (isIndexMultipleOfColumnPerPoints) {
                                        addDayLabel = true;
                                    }

                                    if (addYearLabel || addMonthLabel || addDayLabel) {
                                        return {
                                            dataItemIndex: index,
                                            label: (addYearLabel ? year : (addMonthLabel ? shortMonths[month] : date)) + "",
                                            isBold: addYearLabel || addMonthLabel
                                        };
                                    }

                                })
                            .compact()
                            .value();
                break;
        }

        //console.log(dateTimeLabels);

        // remove some (day) labels that are closer to year/month markers
        // remove some (month) labels that are closer to year markers
        // (4 digit - year, 3 digit - month, 1 or 2 digits - day)
        var filteredDateTimeLabels = [];
        for(var i = 1;i < dateTimeLabels.length - 1; ++i) /* ignore first and last */{
            var isDayLabel = (dateTimeLabels[i].label.length === 1 || dateTimeLabels[i].label.length === 2);
            var isMonthLabel = (dateTimeLabels[i].label.length === 3);

            var isPrevLabelWithinReach, isPrevLabelSpecialMarker, isNextLabelWithinReach, isNextLabelSpecialMarker;

            if (isDayLabel) {

                isPrevLabelWithinReach = !!(Math.abs(dateTimeLabels[i-1].dataItemIndex - dateTimeLabels[i].dataItemIndex) < dayLabelDropDistance);
                isPrevLabelSpecialMarker = (dateTimeLabels[i-1].label.length === 3 || dateTimeLabels[i-1].label.length === 4); //month or year

                isNextLabelWithinReach = !!(Math.abs(dateTimeLabels[i+1].dataItemIndex - dateTimeLabels[i].dataItemIndex) < dayLabelDropDistance);
                isNextLabelSpecialMarker = (dateTimeLabels[i+1].label.length === 3 || dateTimeLabels[i+1].label.length === 4); //month or year

            } else if (isMonthLabel) {

                isPrevLabelWithinReach = !!(Math.abs(dateTimeLabels[i-1].dataItemIndex - dateTimeLabels[i].dataItemIndex) < monthLabelDropDistance);
                isPrevLabelSpecialMarker = dateTimeLabels[i-1].label.length === 4; //year

                isNextLabelWithinReach = !!(Math.abs(dateTimeLabels[i+1].dataItemIndex - dateTimeLabels[i].dataItemIndex) < monthLabelDropDistance);
                isNextLabelSpecialMarker = dateTimeLabels[i+1].label.length === 4; //year
            }

            // drop if the current label is closer to the special markers
            var dropLabel = (isDayLabel || isMonthLabel) && ((isPrevLabelSpecialMarker && isPrevLabelWithinReach) || (isNextLabelSpecialMarker && isNextLabelWithinReach));

            if (!dropLabel) {
                filteredDateTimeLabels.push(dateTimeLabels[i]);
            }

        }

        return filteredDateTimeLabels;
    }
}

module.exports = DateTimeLabels;
