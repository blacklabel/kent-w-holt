Highcharts.mapChart('container', {
    chart: {
        map: 'custom/world'
    },
    plotOptions: {
        series: {
            joinBy: ['iso-a3']
        }
    },
    series: [
        {
            data: [
                ['POL', 100],
                ['USA', 90],
                ['PER', 50],
                ['TZA', 40],
                ['AUS', 1]
            ],
            keys: ['iso-a3', 'value'],
        },
        {
            type: 'mapbubble',
            data: [
                ['NOR', 100],
                ['RUS', 25],
                ['CAN', 50]
            ],
            keys: ['iso-a3', 'z']
        }
    ]
});