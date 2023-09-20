const data = [
    {
        name: 'Commerce',
        y: 70.67,
    }, {
        name: 'Logistics, Aviation & Shipping',
        y: 14.77
    },  {
        name: 'Engineering',
        y: 4.86
    }, {
        name: 'Seafood & Marine',
        y: 2.63
    }, {
        name: 'Financial Serivices',
        y: 1.53
    },  {
        name: 'Corporate Services & others',
        y: 1.40
    }
];

function getSamePointOnOtherSeries(chart, point) {
    const otherSeries = chart.series[point.series.index === 0 ? 1 : 0];
    return otherSeries.points[point.index];
}

function updateOtherTooltip(chart, point) {
    chart.otherTooltip.update({
        text: `${point.series.name}: <b>${point.y}</b>`
    });
    chart.otherTooltip.refresh(point);
    chart.otherTooltip.move(
        point.tooltipPos[0],
        point.tooltipPos[1] + 10,
        point.tooltipPos[0],
        point.tooltipPos[1]
    );
}


Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        events: {
            load: function () {
                // Create tooltip for the other series.
                this.otherTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                this.otherTooltip.hide(); // Don't show yet.
            },
        }
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: false
            },
            states: {
                inactive: {
                    enabled: false
                }
            },
            point: {
                events: {
                    mouseOver: function() {
                        // Get the other series' point.
                        const other = getSamePointOnOtherSeries(
                            this.series.chart,
                            this
                        );

                        // Transfer our state and update the tooltip.
                        other.setState('hover');
                        updateOtherTooltip(this.series.chart, other);
                    },
                    mouseOut: function() {
                        // Transfer our state to the other series' point.
                        getSamePointOnOtherSeries(
                            this.series.chart,
                            this
                        ).setState('');

                        this.series.chart.otherTooltip.hide();
                    },
                    legendItemClick: function() {
                        // Get the other series' point and toggle visibility.
                        getSamePointOnOtherSeries(this.series.chart, this)
                            .setVisible();
                    }
                }
            },
        }
    },
    series: [
        {
            colorByPoint: true,
            data: data,
            center: ['25%', '50%'],
            showInLegend: true
        },
        {
            colorByPoint: true,
            data: data,
            center: ['75%', '50%'],
        },
    ]
});