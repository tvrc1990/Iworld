
define([], function () {

    return {

        //²Ëµ¥
        Menus: function () {
            return [
                {
                    text: "demo",
                    href: null,
                    ico: 'github-alt',
                    menus: [
                        { text: "form", href: '../modules/demo/form.html' },
                        { text: "table", href: '../modules/demo/table.html' },
                        {
                           text: "chart",
                           href: '',
                           menus: [
                                      { text: "line chart", href: '../modules/demo/chart/line.chart.html' },
                                      { text: "bar chart", href: '../modules/demo/chart/bar.chart.html' }
                           ]
                       }
                    ]
                }
            ];
        }


    }

});
