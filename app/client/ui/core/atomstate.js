

var _ = window.server.lodash;

module.exports =  {
   getDefaultAtomState: function (options) {
        return {
          appUIStore: this.getDefaultAppUIStoreState(options),
          chartStore: this.getDefaultChartStoreState(options),
          watchListStore: this.getDefaultWatchlistStoreState(options)
        }
   },

   getDefaultAppUIStoreState: function (options) {
      return {
          window: {
            width: 600,
            height: 400
          },
          theme: "blue"
        };
   },

   getDefaultChartStoreState: function (options) {
      return {
          syncCrosshair: true,
          layout: "chartonly",
          activeChartIndex: 0,
          charts: [ this.getDefaultChartState(options) ]
        }; //chartStore
   },

   getDefaultChartState: function (options) {
        return {
            type: "pricechart",
            id: 1,
            layout: "chart_1a_1",
            keys: {
              ticker: options.ticker || "MSFT",
              timeframe:  {
                from: new Date(),
                to: new Date()
              },
              range: "daily"
            },
            ui: {
              rect: {
                width: 600,
                height: 400,
                top: 50,
                left: 0
              },
              renderer: "candlestick",
              axis: {
                value: {
                  scale: 'linear'
                }
              },
              showGrid: true,
              showCrosshair: true
            },
            overlays: {
              compareTickers: ['googl', 'ibm'],
              indicators : [
                {
                  id: Date.now(),
                  type: "SMA",
                  settings: {
                    range: 14
                  }
                },
                {
                  id: Date.now(),
                  type: "BollingerBand",
                  settings: {
                    a: 14,
                    b: 10,
                    c: 20
                  }
                }
              ]
            },
            splits: {
              compareTickers: ['spy'],
              indicators: [
                {
                  id: Date.now(),
                  type: "ADX",
                  settings: {
                    range: 14
                  }
                }
              ]
            }
        } //chart
   },

   getDefaultWatchlistStoreState: function () {
        return {
          layout: "",
          groups: [
            {
              name: "Default",
              tickers: [
                {
                  name: "MSFT",
                  current: 47.79
                },
                {
                  name: "IBM",
                  current: 99.10
                }
              ]
            },
            {
              name: "Bull List",
              tickers: [
                {
                  name: "TQQQ",
                  current: 80.00
                },
                {
                  name: "SOXL",
                  current: 120.00
                }
              ]
            }
          ]
        }
   },

   getDefaultIndicatorState: function (name) {
        //TechnicalIndicators[name].getDefaultState();
   }
};



/*


console.time("immutable-load");
var defaultState = {
    appStore: {
      window: {
        width: 600,
        height: 400
      },
      theme: "blue"
    },
    chartStore: {
      syncCrosshair: true,
      layout: "chartonly",
      activeChartIndex: 0,
      charts: [
        {
          type: "pricechart",
          id: 1,
          layout: "chart_1a_1",
          keys: {
            ticker: "MSFT",
            timeframe:  {
              from: new Date(),
              to: new Date()
            },
            range: "daily"
          },
          ui: {
            rect: {
              width: 600,
              height: 400,
              top: 50,
              left: 0
            },
            renderer: "candlestick",
            axis: {
              value: {
                scale: 'linear'
              }
            },
            showGrid: true,
            showCrosshair: true
          },
          overlays: {
            compareTickers: ['googl', 'ibm'],
            indicators : [
              {
                id: Date.now(),
                type: "SMA",
                settings: {
                  range: 14
                }
              },
              {
                id: Date.now(),
                type: "BollingerBand",
                settings: {
                  a: 14,
                  b: 10,
                  c: 20
                }
              }
            ]
          },
          splits: {
            compareTickers: ['crm', 'spy'],
            indicators: [
              {
                id: Date.now(),
                type: "ADX",
                settings: {
                  range: 14
                }
              }
            ]
          }
        } //chart
      ]
    } //chartStore
};

var appState = Immutable.fromJS(defaultState);
console.timeEnd("immutable-load");
console.log(appState.toJS());

console.time("addnew");
var newChart = _.clone(defaultState.chartStore.charts[0]);
newChart.id = 2;
newChart.keys.ticker = "IBM";
var appState1 = appState.updateIn(['chartStore', 'activeChartIndex'], function (value) { return value + 1; })
     .updateIn(['chartStore', 'charts'], function (list) {
          return list.push(Immutable.fromJS(newChart));
        });
console.timeEnd("addnew");
console.log(appState1.toJS());


console.time("getActiveChart");
var activeChartIndex = appState1.getIn(['chartStore', 'activeChartIndex']);
console.log(activeChartIndex, appState1.getIn(['chartStore', 'charts', activeChartIndex]).toJS());
console.timeEnd("getActiveChart");

console.time("compare_states_1");
var activeChartIndex = appState1.getIn(['chartStore', 'activeChartIndex']);
console.log("Is chart0 same in both states", appState.getIn(['chartStore', 'charts', 0]) === appState1.getIn(['chartStore', 'charts', 0]));
console.log("Is chartStore same in both states", appState.getIn(['chartStore']) === appState1.getIn(['chartStore']));
console.timeEnd("compare_states_1");

console.time("resize_chart0");
var appState2 = appState1.updateIn(['chartStore', 'charts', 0, 'ui', 'rect'], function (rect) {
        return Immutable.fromJS({width:0,height:0, top:0, left:0});
});
console.timeEnd("resize_chart0");
console.log(appState2.toJS());

console.time("compare_states_2");
console.log("Is chart0 same in both appState/appState1 states", appState.getIn(['chartStore', 'charts', 0]) === appState1.getIn(['chartStore', 'charts', 0]));
console.log("Is chart0 same in both appState1/appState2 states", appState1.getIn(['chartStore', 'charts', 0]) === appState2.getIn(['chartStore', 'charts', 0]));
console.log("Is chart[0].ui same in both states", appState1.getIn(['chartStore', 'charts', 0, 'ui']) === appState2.getIn(['chartStore', 'charts', 0, 'ui']));
console.log("Is chart[0].ui.rect same in both states", appState1.getIn(['chartStore', 'charts', 0, 'ui', 'rect']) === appState2.getIn(['chartStore', 'charts', 0, 'ui', 'rect']));
console.log("Is chart[0].ui.axis same in both states", appState1.getIn(['chartStore', 'charts', 0, 'ui', 'axis']) === appState2.getIn(['chartStore', 'charts', 0, 'ui', 'axis']));
console.timeEnd("compare_states_2");


console.time("deletechart");
var newChart = _.clone(defaultState.chartStore.charts[0]);
newChart.id = Date.now;
newChart.keys.ticker = "IBM";
var appState3 = appState2.updateIn(['chartStore', 'activeChartIndex'], function (value) { return value + 1; })
     .updateIn(['chartStore', 'charts'], function (list) {
          return list.filterNot(function (chart) {
              return chart.getIn(['id']) === 2
          });
        });
console.timeEnd("deletechart");
console.log(appState3.toJS());

var tickerList = [];
_.times(100, function (index) {
  tickerList.push({
    ticker: Date.now(),
    current: Date.now()
  });
});

console.time("tickerList");
var tickerState = Immutable.fromJS(tickerList);
console.timeEnd("tickerList");
console.log(tickerState);

//debugger;

*/
