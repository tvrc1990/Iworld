
define(['avalon','chart'], function (avalon,chart) {

    var panelModel = avalon.define({
        $id: "chart_bar_ctrl",


    });

    var initChart = function () {
        var randomData = function () {
            return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
        };
        var randomColorFactor = function () {
            return Math.round(Math.random() * 255);
        };
        var randomColor = function (opacity) {
            return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
        };

        var barChartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: 'Dataset 1',
                backgroundColor: randomColor(),
                data: [randomData(), randomData(), randomData(), randomData()]
            }, {
                label: 'Dataset 2',
                backgroundColor: randomColor(),
                data: [randomData(), randomData(), randomData(), randomData()]
            }, {
                label: 'Dataset 3',
                backgroundColor: randomColor(),
                data: [randomData(), randomData(), randomData(), randomData()]
            }]

        };

        var ctx = $('#bar_canvas')[0].getContext("2d");
        var chartJs = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: true,
                    text: "Chart.js Bar Chart - Stacked"
                },
                tooltips: {
                    mode: 'label'
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });


    };
	
    return {
        renderer: function () {
            avalon.scan();
            initChart();
        }
    }

});

