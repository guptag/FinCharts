var Dexie = require("dexie");

// Dexie instance
var db = new Dexie("finchartsdb");

//db.delete();

// Database schema
db.version(1).stores({
   pricetable: '&key,data'
});

// Open database
db.open();

module.exports = db;
