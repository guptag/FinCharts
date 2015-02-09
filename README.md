Design
------

![screen shot 2015-01-03 at 10 48 14 am](https://cloud.githubusercontent.com/assets/1994225/5603219/4e966f56-9336-11e4-9054-1daafd1393dc.png)

Architecture (draft)
--------------------

* Application leverages [React's Flux](http://fluxxor.com/what-is-flux.html) architecture where the data/state changes flow in an uni-directional way making the application easy to reason about.
* Describes the entire state of the application in an immutable data structure (using immutable.js) similar to OM's style of global atom state. Any user action creates an action message which updates the app state creating a new state reference and triggering a re-render of the app. React components leverage "canComponentUpdate" to compare the state references to speed up the rendering on top of virtual dom comparision provided by React.
* Q promises for coordinating async tasks.
* Downloaded ticker data will be stored on disk (for now).

Run
---
(from root)
 * npm install (once)
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
* [ ] Multi chart layout (3H, 3V, 2H, 2V)
* [ ] Animate chart
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
* [ ] Themes (light/dark)
