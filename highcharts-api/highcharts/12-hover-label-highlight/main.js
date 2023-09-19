
function generateRandomData(amount, max, min) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * (max - min) + min));
}

function getTickLabelByCategory(ticks, category) {
    return Object.values(ticks).find(
        tick => categories[tick.pos] === category
    )?.label;
}

const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Chart title'
    },
    xAxis: {
        categories: categories,
        title: {
            enabled: false
        },
    },
    plotOptions: {
        series: {
            pointPadding: 0.2,
            point: {
                events: {
                    mouseOver: function () {
                        // Find the tick for the current category and
                        // highlight it's label if it has one.
                        getTickLabelByCategory(
                            this.series.xAxis.ticks,
                            this.category
                        )?.css({ color: 'rgb(254,106,53)', fontSize: '1em' });
                    },
                    mouseOut: function () {
                        // Find the tick for the current category and
                        // remove the highlight on it's label if it has one.
                        getTickLabelByCategory(
                            this.series.xAxis.ticks,
                            this.category
                        )?.css({
                            color: this.series.xAxis.options.tickColor ?? 'rgb(51, 51, 51)',
                            fontSize: this.series.xAxis.options.labels.style.fontSize ?? '0.8em'
                        });
                    }
                }
            }
        }
    },
    series: [
        {
            name: 'Tokyo',
            data: generateRandomData(categories.length, 100, 0)
        },
        {
            name: 'New York',
            data: generateRandomData(categories.length, 100, 0)
        },
        {
            name: 'London',
            data: generateRandomData(categories.length, 100, 0)
        },
        {
            name: 'Berlin',
            data: generateRandomData(categories.length, 100, 0)
        }
    ]
}); 