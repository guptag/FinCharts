var LayoutEngine =  require('./layoutengine');

LayoutDefinitions = {
    init: function () {
        LayoutEngine.addLayout("topbarlayout", function(w, h) {
            return {
                width: w,
                height: 40,
                top: 0,
                left: 0
            };
        });

        LayoutEngine.addLayout("mainlayout", function(w, h) {
            return {
                width: w,
                height: h - 40,
                top: 40,
                left: 0
            };
        });

        LayoutEngine.addLayout("chartslayout_1a_1", function(w, h) {
            return {
                width: w,
                height: h,
                top: 0,
                left: 0
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_2a_1", function(w, h) {
            return {
                width: w/2,
                height: h,
                top: 0,
                left: 0
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_2a_2", function(w, h) {
            return {
                width: w/2,
                height: h,
                top: 0,
                left: w/2
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_2b_1", function(w, h) {
            return {
                width: w,
                height: h/2,
                top: 0,
                left: 0
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_2b_2", function(w, h) {
            return {
                width: w,
                height: h/2,
                top: h/2,
                left: 0
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_3a_1", function(w, h) {
            return {
                width: w/3,
                height: h,
                top: 0,
                left: 0
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_3a_2", function(w, h) {
            return {
                width: w/3,
                height: h,
                top: 0,
                left: w/3
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_3a_3", function(w, h) {
            return {
                width: w/3,
                height: h,
                top: 0,
                left: 2 * w/3
            };
        }, "mainlayout");


        LayoutEngine.addLayout("chartslayout_3b_1", function(w, h) {
            return {
                width: w,
                height: h/3,
                top: 0,
                left: 0
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_3b_2", function(w, h) {
            return {
                width: w,
                height: h/3,
                top: h/3,
                left: 0
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_3b_3", function(w, h) {
            return {
                width: w,
                height: h/3,
                top: 2 * h/3,
                left: 0
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_3c_1", function(w, h) {
            return {
                width: w/2,
                height: h,
                top: 0,
                left: 0
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_3c_2", function(w, h) {
            return {
                width: w/2,
                height: h/2,
                top: 0,
                left: w/2
            };
        }, "mainlayout");

        LayoutEngine.addLayout("chartslayout_3c_3", function(w, h) {
            return {
                width: w/2,
                height: h/2,
                top: h/2,
                left: w/2
            };
        }, "mainlayout");
    }
}

module.exports = LayoutDefinitions;