
define(['avalon','chart'], function (avalon,chart) {

    var panelModel = avalon.define({
        $id: "chart_line_ctrl",


    });

    var initChart = function () {
        var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var randomData = function () {
            return Math.round(Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1));
        };
        var randomColorFactor = function () {
            return Math.round(Math.random() * 255);
        };
        var randomColor = function (opacity) {
            return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
        };

        var config = {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April"],
                datasets: [{
                    label: "名称1",
                    data: [randomData(), randomData(), randomData()],
                    fill: false, //时候有幅度填充色
                    lineTension: 0,//线条弯曲幅度
                    borderColor: randomColor(0.5),
                    backgroundColor: randomColor(0.5),
                    pointBorderColor: randomColor(0.5),
                    pointBackgroundColor: randomColor(0.5),
                }, {
                    label: "名称2",
                    data: [randomData(), randomData(), randomData()],
                    fill: false,
                    //lineTension: 5,//线条幅度
                    borderDash: [5, 5],//虚线【实体长度，空心长度】
                    borderColor: randomColor(0.5),
                    backgroundColor: randomColor(0.5),
                    pointBorderColor: randomColor(0.5),
                    pointBackgroundColor: randomColor(0.5),

                }]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'bottom',
                },
                hover: {
                    mode: 'label'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart - Legend'
                }
            }
        };
        var ctx = $("#line_canvas")[0].getContext("2d");
        var myLine = new Chart(ctx, config);

        //$('#randomizeData').click(function () {
        //    $.each(config.data.datasets, function (i, dataset) {
        //        dataset.data = dataset.data.map(function () {
        //            return randomScalingFactor();
        //        });

        //    });

        //    myLine.update();
        //});

        //$('#addDataset').click(function () {
        //    var background = randomColor(0.5);
        //    var newDataset = {
        //        label: 'Dataset ' + config.data.datasets.length,
        //        borderColor: background,
        //        backgroundColor: background,
        //        pointBorderColor: background,
        //        pointBackgroundColor: background,
        //        pointBorderWidth: 1,
        //        fill: false,
        //        data: [],
        //    };

        //    for (var index = 0; index < config.data.labels.length; ++index) {
        //        newDataset.data.push(randomScalingFactor());
        //    }

        //    config.data.datasets.push(newDataset);
        //    myLine.update();
        //});

        //$('#addData').click(function () {
        //    if (config.data.datasets.length > 0) {
        //        var month = MONTHS[config.data.labels.length % MONTHS.length];
        //        config.data.labels.push(month);

        //        $.each(config.data.datasets, function (i, dataset) {
        //            dataset.data.push(randomScalingFactor());
        //        });

        //        myLine.update();
        //    }
        //});

        //$('#removeDataset').click(function () {
        //    config.data.datasets.splice(0, 1);
        //    myLine.update();
        //});

        //$('#removeData').click(function () {
        //    config.data.labels.splice(-1, 1); // remove the label first

        //    config.data.datasets.forEach(function (dataset, datasetIndex) {
        //        dataset.data.pop();
        //    });

        //    myLine.update();
        //});


    };
	
    return {
        renderer: function () {
            avalon.scan();
            initChart();
        }
    }

});

