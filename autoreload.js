alert(window.autoReloadEnabled);
if (!window.autoReloadEnabled) {
    var path = './app';
    var fs = require('fs');

    fs.watch(path, function() {
    if (window.location)
      window.location.reload();
      alert(window.autoReloadEnabled);
    });

    window.autoReloadEnabled = true;
    alert(window.autoReloadEnabled);
}