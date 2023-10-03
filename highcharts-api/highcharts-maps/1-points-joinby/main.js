Highcharts.mapChart('container', {
    chart: {
        map: 'custom/world'
    },
    series: [{
        data: [
            ['POL', 100],
            ['USA', 90],
            ['PER', 50],
            ['TZA', 40],
            ['AUS', 1]
        ],
        joinBy: ['iso-a3']
    }]
});