function generateRandomData(amount, max) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * max));
}

function getValueOnAxis(axis, val) {
    return axis.len * (val / axis.max);
}

function makeTitles(chart, renderer, leftAxis, rightAxis) {
    // Make the shadows container.
    if (!chart.titles) {
        chart.titles = {
            leftAxisText: renderer.text(
                'Manegrial Position',
            ).add(),
            rightAxisText: renderer.text(
                'Non Manegrial Position'
            ).add()
        };
    }

    centerLabelOnAxis(chart.titles.leftAxisText, leftAxis);
    centerLabelOnAxis(chart.titles.rightAxisText, rightAxis);
}

function centerLabelOnAxis(label, axis) {
    const leftAxisTextBB = label.getBBox();
    // Position label horizontally centered on the given axis
    const leftTextPosX = 
        axis.left +
        (axis.width / 2) -
        (leftAxisTextBB.width / 2);
    // Lift the title a little higher than the top of the axis.
    const leftTextPosY = axis.top -
        leftAxisTextBB.height;

    label.attr({ x: leftTextPosX, y: leftTextPosY });
}

function makeShadows(chart, renderer, xAxis, leftAxis, rightAxis) {
    // Clean up previous shadows if any.
    if (chart.shadows?.length > 0) {
        for (const shadow of chart.shadows) {
            shadow.destroy();
        }
    }

    // Clears any old shadows.
    chart.shadows = [];
    
    // Loops through all yAxis' points and adds shadows.
    for (const [i, axis] of [leftAxis, rightAxis].entries()) {
        for (const point of axis.series[0].points) {
            // Point's position on the current y-axis in pixels.
            const valueAxisPosX = getValueOnAxis(axis, point.y);
    
            // Position on the end of either axis.
            const x = i < 1 ? axis.left : axis.left + valueAxisPosX - 1;
            const y =
            // Add spacing offset +
            chart.spacingBox.y +
            // Add on the axis point padding +
            (xAxis.minPixelPadding / 2) +
            // Get where the point should be along the raw un-padded axis
            // divided by categories +
            ((xAxis.len / categories.length) * point.x);
            const width =
                // Start where value 100 is on the axis -
                getValueOnAxis(axis, 100) -
                // Get where the current point should be along the raw un-padded
                // axis divided by categories +
                valueAxisPosX +
                // Shadow is one pixel off on the right side (i = 1 on right y-axis).
                i;
            const height = point.pointWidth;
            const shadow = renderer
                .rect(x, y, width, height)
                .attr({ fill: '#B6B6B6', zIndex: 1 })
                .add();
            chart.shadows.push(shadow);
        }
    }
}

const categories = ['Dep1', 'Dep2', 'Dep3', 'Dep4', 'Dep5'];

Highcharts.chart('container', {
    chart: {
        type: 'bar',
        spacingTop: 60,
        events: {
            // Ready the labels once so we can re-use them.
            load: function () {
                makeTitles(this, this.renderer, this.yAxis[0], this.yAxis[1]);
                makeShadows(this, this.renderer, this.xAxis[0], this.yAxis[0], this.yAxis[1]);
            },
            redraw: function () {
                makeTitles(this, this.renderer, this.yAxis[0], this.yAxis[1]);
                makeShadows(this, this.renderer, this.xAxis[0], this.yAxis[0], this.yAxis[1]);
            }
        }
    },
    title: {
        text: ''
    },
    legend: {
        enabled: false
    },
    xAxis: {
        categories: categories,
        left: '49%',
        lineWidth: 0,
        labels: {
            align: 'center',
            distance: 0
        }
    },
    yAxis: [
        {
            title: {
                text: '',
            },
            width: '40%',
            reversed: true,
            offset: 0,
            max: 100,
            gridZIndex: 0,
            tickInterval: 20
        },
        {
            title: {
                text: '',
            },
            left: '55%',
            width: '40%',
            offset: 0,
            max: 100,
            gridZIndex: 0,
            tickInterval: 20
        },
    ],
    plotOptions: {
        series: {
            grouping: false,
            dataLabels: {
                enabled: true,
                format: '{y} %',
                inside: true,
            },
            borderWidth: 0,
            borderRadius: 0
        }
    },
    series: [
        {
            id: 'manegrial',
            name: 'Manegrial Position',
            data: generateRandomData(categories.length, 100),
            yAxis: 0,
            color: '#ff0000',
            dataLabels: {
                align: 'right',
            }
        },
        {
            id: 'non-manegrial',
            name: 'Non Manegrial Position',
            data: generateRandomData(categories.length, 100),
            yAxis: 1,
            color: '#ff0000',
            dataLabels: {
                align: 'left',
            }
        },
    ]
});