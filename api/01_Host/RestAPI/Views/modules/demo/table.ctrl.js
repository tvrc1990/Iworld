
define(['avalon'], function (avalon) {

    var containerModel = avalon.define({
        $id: "demo_table_ctrl",
        Name: 'demo for table'


    });

    return {
        renderer: function () {
            avalon.scan();
        }
    }

});

