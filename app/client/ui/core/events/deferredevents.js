var Q = require("q");

function DeferredEvents() {
    this.events = {};
}

DeferredEvents.prototype.Keys = {
  StartPreview: "startPreview",
  StopPreview: "stopPreview",
  PausePreview: "pausePreview",
  ResetPreviewOptions: "ResetPreviewOptions"
};

DeferredEvents.prototype.register = function (id, cb) {
    if (!this.events[id]) {
      this.events[id] = Q.defer();
    }

    this.events[id].resolve(cb);
};

DeferredEvents.prototype.trigger = function (id, payload) {
  if (!this.events[id]) {
    this.events[id] = Q.defer();
  }

  this.events[id].promise.fcall(payload);
};

DeferredEvents.prototype.clear = function (id) {
  this.events[id] = null;
};

// singleton
module.exports = new DeferredEvents();
