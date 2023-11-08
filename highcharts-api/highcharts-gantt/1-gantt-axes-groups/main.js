Highcharts.ganttChart('container', {
    xAxis: [
        // Had to wrap axis definition in a list to get rid of extra axis label
        // group + for dateTimeLabelFormats to work.
        {
            tickInterval: 7 * 24 * 3600 * 1000, // one week in milliseconds
            dateTimeLabelFormats: {
                week: '%A, %e %b, %Y'
            },
        }
    ],
    yAxis: {
        uniqueNames: true
    },
    series: [{
        name: 'Project 1',
        data: [{
            name: 'Main'
        }, {
            name: 'First',
            start: 1560902400000,
            end: 1561075200000,
        }, {
            name: 'Second',
            start: 1560902400000,
            end: 1561075200000
        }, {
            name: 'Second',
            start: 1561507200000,
            end: 1561680000000
        }]
    }]

});
