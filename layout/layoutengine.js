var $ = require('jquery'),
    _ = require('lodash'),
    util = require('util');

var defnitions = [];
var generated = {};
var domCache = {};

function LayoutEngine() { }

/* measureCb -> function (W, H) { return {width: x, height: x, top: x, left: x} } */
LayoutEngine.prototype.addLayout = function (name, measureCb, parentLayout, dependsOn) {
    if (defnitions[name]) throw new Error(util.format("Layout with name %s already exists.", name));
    if (!measureCb) throw new Error("measureCb is null");

    defnitions.push({
        name: name,
        measureCb : measureCb,
        parentLayout: parentLayout,
        dependsOn: dependsOn
    });
}

LayoutEngine.prototype.applyLayouts = function () {
    var $window = $(window);
    var windowW = $window.width();
    var windowH = $window.height();

    generated = {};

    // Resolve all the layouts
    _.forEach(defnitions, function (layout) {
        resolveLayout(layout, [], windowW, windowH);
    });

    // apply the layout dimentions on the dom elements
    _.forEach(generated, function (layout, name) {
        if (!domCache[name]) {
            domCache[name] = $('[data-layout='+name+']');
        }

        var $element = domCache[name];
        $element.css({
            "position": "absolute",
            "width": layout.width,
            "height": layout.height,
            "top": layout.top,
            "left": layout.left,
        });
    })


}

LayoutEngine.prototype.clear = function () {
    generatedLayouts = {};
    defnitions = {};
    domCache = {};
}


function resolveLayout (layout, cache, windowW, windowH) {
    debugger;
    if (!layout.parentLayout && !layout.dependsOn) {
        generated[layout.name] = layout.measureCb(windowW, windowH);
        cache = [];
        return;
    }

    if (cache.indexOf(layout.name) !== -1) {
        throw new Error("cyclic dependencies detected in layout defnitions, " + cache.join(", "));
    }

    // store the 'to be processed' layout name in cache
    // to detect cyclic dependencies
    cache.push(layout.name);

    // if parent is not resolved yet
    if (layout.parentLayout && !generated[layout.parentLayout]) {
        resolveLayout(layout.parentLayout, cache, windowW, windowH);
    }

    // if any of the dependencies are not resolved yet
    _.forEach(layout.dependsOn || [], function (layoutName) {
        if (!generated[layoutName]) {
            resolveLayout(layoutName, windowW, windowH);
        }
    });

    var parent = generated[layout.parentLayout];
    generated[layout.name] = layout.measureCb(parent.width, parent.height);
    cache = [];
    return;
}




module.exports = new LayoutEngine();