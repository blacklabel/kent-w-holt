Highcharts.mapChart('container', {
    chart: {
        map: 'custom/world'
    },
    plotOptions: {
        map: {
            keys: ['iso-a3', 'value'],
            joinBy: ['iso-a3'],

            // Turn off all unused areas on default.
            allAreas: false,
        }
    },
    series: [
        // Hidden series to display the map underneath using all areas.
        {
            allAreas: true,
            showInLegend: false
        },
        {
            data: [
                ['POL', 100],
                ['USA', 90],
                ['PER', 50],
                ['TZA', 40],
                ['AUS', 1]
            ],
        },
        {
            data: [
                ['NOR', 100],
                ['RUS', 85],
                ['DEU', 50]
            ],
        }
    ]
});