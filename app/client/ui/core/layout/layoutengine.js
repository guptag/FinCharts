var $ = require('jquery'),
    _ = require('lodash');


function LayoutEngine() {
    this.definitions = [];
    this.resolvedLayouts = [];
}

/* measureCb -> function (w, h, W, H) { return {width: x, height: x, top: x, left: x} } */
LayoutEngine.prototype.addLayout = function (name, measureCb, parentLayout, dependsOn) {
    if (this.definitions[name]) throw new Error("Layout with name %s already exists. " + name);
    if (!measureCb) throw new Error("addLayout: measureCb shouldn't be null");

    this.definitions.push({
        name: name,
        measureCb : measureCb,
        parentLayout: parentLayout,
        dependsOn: dependsOn
    });
};

LayoutEngine.prototype.resolveLayouts = function () {
    var self = this;
    var $window = $(window);
    var windowW = $window.width();
    var windowH = $window.height();

    this.resolvedLayouts = {};

    // Resolve all the layouts
    _.forEach(this.definitions, function (layout) {
        resolveLayout.call(self, layout, [], windowW, windowH);
    });

    //console.log(this.resolvedLayouts);
};

LayoutEngine.prototype.getLayoutRect = function (layoutName) {
    var rect = this.resolvedLayouts[layoutName];

    if (!rect) {
        throw new Error("Resolved layout is not available for " + layoutName);
    }

    return rect;
};

LayoutEngine.prototype.getWindowRect = function () {
    var $window = $(window);
    var windowW = $window.width();
    var windowH = $window.height();

    return {
        width: windowW,
        height: windowH,
        top: 0,
        left: 0
    };
};

LayoutEngine.prototype.clear = function () {
    this.resolvedLayoutsLayouts = {};
    this.definitions = {};
};


function resolveLayout (layout, cache, windowW, windowH) {
    if (!layout.parentLayout && !layout.dependsOn) {
        this.resolvedLayouts[layout.name] = layout.measureCb(windowW, windowH);
        cache = [];
        return;
    }

    if (cache.indexOf(layout.name) !== -1) {
        throw new Error("cyclic dependencies detected in layout this.definitions, " + cache.join(", "));
    }

    // store the 'to be processed' layout name in cache
    // to detect cyclic dependencies
    cache.push(layout.name);

    // if parent is not resolved yet
    if (layout.parentLayout && !this.resolvedLayouts[layout.parentLayout]) {
        resolveLayout.call(this, layout.parentLayout, cache, windowW, windowH);
    }

    // if any of the dependencies are not resolved yet
    _.forEach(layout.dependsOn || [], function (layoutName) {
        if (!this.resolvedLayouts[layoutName]) {
            resolveLayout.call(this, layoutName, windowW, windowH);
        }
    });

    var parent = this.resolvedLayouts[layout.parentLayout];
    this.resolvedLayouts[layout.name] = layout.measureCb(parent.width, parent.height, windowW, windowH);
    cache = [];
    return;
}


module.exports = new LayoutEngine();
