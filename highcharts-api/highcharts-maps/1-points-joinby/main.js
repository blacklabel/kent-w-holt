Highcharts.mapChart('container', {
    chart: {
        map: 'custom/world'
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
            joinBy: ['iso-a3']
        },
        {
            data: [
                ['NOR', 100],
                ['RUS', 85],
                ['DEU', 50]
            ],
            keys: ['iso-a3', 'value'],
            joinBy: ['iso-a3']
        }
    ]
});