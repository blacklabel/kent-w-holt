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
                // Shift the tooltip on mouse move and when we actually have an offset to follow.
                this.container.addEventListener('mousemove', function () {
                    if (this.otherTooltip.pointOffset) {
                        this.otherTooltip.move(
                            // Primary tooltip positon + point offset.
                            this.tooltip.now.x + this.otherTooltip.pointOffset.x,
                            this.tooltip.now.y + this.otherTooltip.pointOffset.y
                        );
                    }
                }.bind(this));
            },
        }
    },
    plotOptions: {
        pie: {
            colorByPoint: true,
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
                        
                        // Update tooltip to point.
                        this.series.chart.otherTooltip.refresh(other);
                        // Take note of the point offset.
                        this.series.chart.otherTooltip.pointOffset = {
                            x: other.shapeArgs.x - this.shapeArgs.x,
                            y: other.shapeArgs.y - this.shapeArgs.y
                        };
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
            data: data,
            center: ['25%', '50%'],
            showInLegend: true
        },
        {
            data: data,
            center: ['75%', '50%'],
        },
    ]
});