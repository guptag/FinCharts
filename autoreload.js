var path = './';
var fs = require('fs');

fs.watch(path, function() {
  if (!window.isLoading){
    window.isLoading = true;
    setTimeout(function(){
      window.location.reload();
    }, 1500);
  }
});
