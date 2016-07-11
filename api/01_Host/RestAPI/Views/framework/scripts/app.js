

requirejs.config({
    baseUrl: 'scripts',
    paths: {
        avalon: 'lib/avalon.shim',

        linq: 'lib/linq',
        chart: '../plug-in/chartJs/Chart.bundle',

        frameMain: 'app/framework.main',
        frameCtrl: 'app/framework.ctrl',
        frameModel: 'app/framework.model',
        global: 'app/framework.global',

        demo_form_ctrl: '../../modules/demo/form.ctrl',
        demo_table_ctrl: '../../modules/demo/table.ctrl',
        chart_bar_ctrl: '../../modules/demo/chart/bar.chart.ctrl',
        chart_line_ctrl: '../../modules/demo/chart/line.chart.ctrl'
    }
    //},
    //shim: {
    //    frameMain: {
    //        exports: "frameMain"
    //    },
    //    chart: {

    //        exports: "chart"
    //    },
    //}

});

require(['frameMain', 'frameCtrl'], function (frameMain, frameCtrl) {
    frameMain.ToolObj.topInit();
    //frameMain.ToolObj.taskInit();
    frameCtrl.renderer();
})