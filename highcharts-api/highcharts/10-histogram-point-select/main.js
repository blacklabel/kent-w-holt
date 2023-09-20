Highcharts.chart('container', {
    xAxis: [
        {
            alignTicks: false
        },
        {
            opposite: true,
            alignTicks: false
        }
    ],
    yAxis: [
        {
            max: 12
        },
        {
            opposite: true
        }
    ],
    plotOptions: {
        histogram: {
            borderRadius: 0,
            borderWidth: 0,
            pointPadding: 0
        },
        series: {
            states: {
                inactive: {
                    enabled: false
                }
            }
        },
    },
    series: [
        {
            type: 'histogram',
            xAxis: 1,
            yAxis: 1,
            baseSeries: 'main-series',
            point: {
                events: {
                    click: function () {
                        // Select all points related to this bin.
                        for (const point of this.series.baseSeries.points) {
                            point.select(point.y >= this.x && point.y <= this.x2, true);
                        }
                        // Select the clicked bin, deselect all others.
                        for (const point of this.series.points) {
                            point.select(point == this, true);
                        }
                    }
                }
            }
        },
        {
            type: 'scatter',
            id: 'main-series',
            data: [3, 4, 5, 3, 2, 3, 2, 3, 4, 5, 3, 6, 3, 2, 4, 5, 5, 6, 6, 1, 6, 6, 2, 1, 3, 5, 6],
            allowPointSelect: true,
        },
    ]
});