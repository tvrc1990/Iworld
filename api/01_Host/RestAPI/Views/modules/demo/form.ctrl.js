
define(['avalon'], function (avalon) {

    var containerModel = avalon.define({

        $id: "demo_form_ctrl",
        duplex: 'input ˫���'

    });

    var init = function () {

        $('.i-checks').find('input').iCheck({
            checkboxClass: 'icheckbox_minimal-green',
            radioClass: 'iradio_minimal-green'
        });

    };

    return {
        renderer: function () {
            avalon.scan();
            init();
        }
    }

});

