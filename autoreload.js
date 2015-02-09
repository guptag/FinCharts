// target will be recreated for every change
// just watch for a change in a small dir
var path = process.cwd() + '/css';
var fs = window.server.fs;

// Attach the watcher only once per app restart
if (!process.appRefreshConfigured) {
    fs.watch(path, function() {
        if (!window.refreshing) {
          // stop watching further updates
          window.refreshing = true;

          // refresh with delay
          // will take some time for browserify to run
          setTimeout(function() {
            window.location.reload();
            //gui.Window.get().reload(3);
          }, 2500);
        }
    });
    process.appRefreshConfigured = true;
}




