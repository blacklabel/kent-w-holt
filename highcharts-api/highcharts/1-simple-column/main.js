function generateRandomData(amount, max) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * max));
}

/**
 * Find the max value across all given series.
 * @param {Array<Highcharts.Series>} series - series to check maximum values for.
 * @returns {number} - The max value across all given series.
 */
function getMaxValue(series) {
    return Math.max(...series.map((s) => s.dataMax));
}

/**
 * Runs through all points/columns and update their label to "max" if they have the max value.
 * @param {Array<Highcharts.Series>} series - All series to update.
 * @param {number} max - Max value to check for.
 */
function markMaxColumns(series, max) {
    // Collect all serices points. We want the global max of all data sets.
    const points = series.reduce((acc, s) => acc.concat(s.points), []);
    for (const point of points) {
        // Label any point/column max if it's eaqual to the max value.
        const isMax = max === point.y;
        point.update({
            dataLabels: {
                enabled: isMax,
                format: isMax ? `max` : ``
            }
        }, true);
    }
}

/**
 * Configures the "zoom" of the graph to be 2 times the maximum value, and adds
 * a plotline at 1.5 * times the max.
 * @param {Highcharts.Chart} chart - Chart to configure.
 * @param {number} max - Max value to configure for.
 */
function configureZoomAndPlotline(chart, max) {
    chart.update({
        yAxis: {
            max: 2 * max
        }
    });

    // Couldn't find a way to update plotline using update().
    chart.yAxis[0].addPlotLine({
        id: '1.5*max',
        value: 1.5 * max,
        dashStyle: 'Dash'
    });
}

Highcharts.chart('container', {
    chart: {
        type: 'column',
        events: {
            load: function () {
                // Find the highest value among the series.
                const max = getMaxValue(this.series);
                markMaxColumns(this.series, max);
                configureZoomAndPlotline(this, max);
            }
        }
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar'],
    },
    yAxis: {
        title: {
            enabled: false
        },
        // Rounds up max value to whole ticks if true, false uses actual min value.
        endOnTick: false
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            name: 'Tokyo',
            type: 'column',
            data: generateRandomData(3, 10)
        },
        {
            name: 'New York',
            type: 'column',
            data: generateRandomData(3, 10)
        },
        {
            name: 'London',
            type: 'column',
            data: generateRandomData(3, 10)
        }
    ]
});