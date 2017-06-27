Stock Charts (Electron.js) desktop application using React and Immutable.js
------

![screen shot 2015-07-03 at 6 41 24 pm](https://cloud.githubusercontent.com/assets/1994225/8506015/6451129a-21b3-11e5-8f2a-4fd266274be6.png)

![screen shot 2015-07-03 at 6 42 16 pm](https://cloud.githubusercontent.com/assets/1994225/8506016/657f1f7c-21b3-11e5-8a81-691a781f6a07.png)

Perf metrics
------------
![screen shot 2015-02-13 at 4 44 03 am](https://cloud.githubusercontent.com/assets/1994225/6187428/4deb3094-b33b-11e4-9867-3248ae81917d.png)

Architecture (draft)
--------------------

* Application leverages [React's Flux](http://fluxxor.com/what-is-flux.html) architecture where the data/state changes flow in an uni-directional way making the application easy to reason about.
* Describes the entire state of the application in an immutable persistent data structure (using immutable.js) similar to OM's style of global atom state. Any user action creates an action message which updates the app state creating a new state reference and triggers a re-render of the app. Due to the immutable nature of the state, React components can leverage "canComponentUpdate" just by comparing the state references. This speeds up the rendering (by skipping the render step when not needed) on top of virtual dom comparision provided by React.
* Q promises for coordinating async tasks.
* Downloaded ticker data will be stored on disk (for now).

Run
---
(from root)
 * nvm use (current v6.6.0)
 * npm install
 * gulp (builds and opens the app)
 * gulp dev (builds, adds file watchers and opens the app)

Build
-----
* [x] gulp
* [x] stylus
* [x] nib
* [x] node-webkit-builder
* [x] watchers (dev)
* [x] auto reload (dev)


Chart Components
-----------------------
* [x] Axis, Labels
* [x] Y-axis (Prices, Percentages)
* [ ] Scales
 * [x] Normal
 * [ ] Log
* [x] Grid Lines
* [x] Main chart (line, area, candlestick, OHL, OHLC)
* [x] Volume bars
* [x] Crosshairs
* [ ] Split view (compare ticker, RSI, ADX etc)
* [x] Multi chart layout (3H, 3V, 2H, 2V)
* [x] Animate chart
* [ ] Listing of added modules on the chart (with remove option)

Settings
---------------
* [x] Timeframe (3m, 6m, 1y, 3y, 5y, all, custom)
* [x] Daily, Weekly, Monthly
* [ ] Sync crosshairs
* [ ] Compare tickers
* [ ] Technical indicators
    * [ ] Moving Averages
    * [ ] RSI
    * [ ] Bollingar Bands
    * [ ] ADX
    * [ ] Avg Volume
    * [ ] Fib ranges
* [ ] Themes (light/dark)
