Run these commands from 'legacy':
 * npm install
 * node_modules/.bin/nodewebkit --remote-debugging-port=9222  .


Build (todo)
-----------
* gulp
* stylus
* nib
* node-webkit-builder


Architecture (draft)
--------------------

* Application will follow [React's Flux](https://github.com/facebook/flux) model.
* [D3.js](https://github.com/mbostock/d3) for chart components.
* OM style cursors to propagate specific application state to the views (looks like [React Cursor](https://github.com/dustingetz/react-cursor) is a perfect fit)
* Q promises for coordinating async tasks.
* Downloaded ticker data will be stored on disk (for now).



Chart Components (todo)
-----------------------
* Axis, Labels
* Y-axis (Prices, Percentages)
* Scale (normal, log)
* Grid Lines
* Main chart (line, area, candlestick, OHL, OHLC)
* Volume bars
* Crosshairs
* Split view (compare ticker, RSI, ADX etc)
* Multi chart layout (3H, 3V)
* Animate chart
* Listing of added modules on the chart (with remove option)

Settings (todo)
---------------
* Timeframe (3m, 6m, 1y, 3y, 5y, all, custom)
* Daily, Weekly, Monthly
* Sync crosshairs
* Compare tickers
* Technical indicators
    * Moving Averages
    * RSI
    * Bollingar Bands
    * ADX
    * Avg Volume
* Themes (light/dark)
