function generateRandomData(amount, max, min) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * (max - min) + min));
}

function makeLines(chart, renderer, xAxis, yAxis) {
    for (const series of chart.series) {
        // Clear any previous lines.
        if (series.connectorLines) {
            series.connectorLines.forEach(line => line.destroy());
        }
        series.connectorLines = [];

        // Skip series, it's hidden anyway.
        if (!series.visible) { continue; }

        for (let i = 0; i < series.points.length - 1; i++) {
            const start = series.points[i];
            const end = series.points[i + 1];
    
            // Find edges closest to either column.
            const startPos = {
                x: xAxis.left + start.plotX + start.pointWidth + series.pointXOffset,
                y: yAxis.top + start.plotY + 1
            };
            const endPos = {
                x: xAxis.left + end.plotX + series.pointXOffset,
                y: yAxis.top + end.plotY + 1
            };
            series.connectorLines.push(
                renderer
                    .path(['M', startPos.x, startPos.y, 'L', endPos.x, endPos.y, 'z'])
                    .attr({ stroke: series.color, 'stroke-width': 2, zIndex: 1 })
                    .add()
            );
        }
    }
}

Highcharts.chart('container', {
    chart: {
        type: 'column',
        events: {
            load: function () {
                makeLines(this, this.renderer, this.xAxis[0], this.yAxis[0]);
            },
            redraw: function () {
                makeLines(this, this.renderer, this.xAxis[0], this.yAxis[0]);
            }
        }
    },
    title: {
        text: ''
    },
    yAxis: {
        gridZIndex: 0
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
            borderRadius: 0
        },
    },
    series: [
        {
            data: generateRandomData(50, 20, 2)
        },
        {
            data: generateRandomData(50, 20, 2)
        },
    ]
});