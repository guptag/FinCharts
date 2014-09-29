/*var path = './css';
var fs = require('fs');
var gui = require('nw.gui');

console.log("auto reload init", process.cwd(), process.autoreload);
var win = gui.Window.get();
win.loading = false;
if (!process.autoreload) {
  fs.watch(process.cwd() + "/css", function() {

    if (!win.loading) {
      win.loading = true;
      setTimeout(function() {
        win.loading = false;
        console.log("watch triggered", win);
        gui.Window.get().reload(3);
      }, 4000);
    }
  });
  process.autoreload = true;
} */
