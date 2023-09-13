function generateRandomData(amount, max, min) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * (max - min) + min));
}

function maxAxisDots(chart, renderer, xAxis, yAxis) {
    // Get all visible points.
    const visiblePoints = chart.series[0].points.filter((p) => p.isInside);

    // Make counting label.
    if (!chart.visiblePointsLabel) {
        chart.visiblePointsLabel = renderer.text().add();
    }
    const visiblePointsLabelBB = chart.visiblePointsLabel.getBBox();
    chart.visiblePointsLabel.attr({
        text: 'visible points: ' + visiblePoints.length,
        x: yAxis.left,
        // Position on the bottom of the chart.
        y: chart.chartHeight - (visiblePointsLabelBB.height / 2) - chart.spacing[2]
    });

    // Clean up any previous value labels and dots.
    if (chart.visibleMaxLabels?.length > 0) {
        for (const label of chart.visibleMaxLabels) {
            label.destroy();
        }
    }
    if (chart.visibleMaxDots?.length > 0) {
        for (const dot of chart.visibleMaxDots) {
            dot.destroy();
        }
    }
    chart.visibleMaxLabels = [];
    chart.visibleMaxDots = [];

    // Find the maximum value of the currently visible points.
    const maxVisibleValue = Math.max(...visiblePoints.map((p) => p.y));

    // Loop over only max points and add labels and a axis indicator.
    for (const point of visiblePoints.filter((p) => maxVisibleValue === p.y)) {
        // Find the point position in the chart.
        const pos = { x: xAxis.left + point.plotX, y: xAxis.top + point.plotY };

        // Make a label above it.
        const label = 
            renderer.text(point.y).attr({ fill: '#FF0000', zIndex: 1 }).add();
        const labelBB = label.getBBox();
        label.attr({ x: pos.x - (labelBB.width / 2), y: pos.y - 10 });
        // Store it so we can remove it if a new update comes.
        chart.visibleMaxLabels.push(label);

        // Make a axis indicator dot on the axis line and save reference for future clean up.
        chart.visibleMaxDots.push(
            renderer.circle(pos.x, yAxis.top + yAxis.len, 3)
                .attr({ fill: '#FF0000', zIndex: 1 })
                .add()
        );
    }
}

Highcharts.chart('container', {
    chart: {
        events: {
            load: function () {
                maxAxisDots(this, this.renderer, this.xAxis[0], this.yAxis[0]);
            },
        },
        zooming: {
            type: 'xy'
        }
    },
    title: {
        text: ''
    },
    xAxis: {
        events: {
            afterSetExtremes: function () {
                maxAxisDots(this.chart, this.chart.renderer, this, this.chart.yAxis[0]);
            }
        }
    },
    yAxis: {
        title: {
            enabled: false
        },
        gridZIndex: 0,
    },
    plotOptions: {
        //
    },
    series: [
        {
            data: generateRandomData(100, 100, 0)
        }
    ]
});