function generateRandomData(amount, max) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * max));
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

const categories = ['Dep1', 'Dep2', 'Dep3', 'Dep4', 'Dep5'];
Highcharts.chart('container', {
    chart: {
        type: 'bar',
        spacingTop: 60,
        events: {
            render: function () {
                // Ready the labels once so we can re-use them if they don't exsist.
                if (!this.titles) {
                    this.titles = {
                        leftAxisText: this.renderer.text(
                            'Manegrial Position',
                        ).add(),
                        rightAxisText: this.renderer.text(
                            'Non Manegrial Position'
                        ).add()
                    };
                }

                centerLabelOnAxis(this.titles.leftAxisText, this.yAxis[0]);
                centerLabelOnAxis(this.titles.rightAxisText, this.yAxis[1]);
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
        // 100 percent indicator shadow
        {
            name: '',
            data: Array.from({ length: categories.length }, () => 100),
            yAxis: 0,
            linkedTo: 'manegrial',
            color: '#9E9FA3',
            dataLabels: {
                enabled: false,
            },
            enableMouseTracking: false,

        },
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
        // 100 percent indicator shadow
        {
            name: '',
            data: Array.from({ length: categories.length }, () => 100),
            yAxis: 1,
            linkedTo: 'non-manegrial',
            color: '#9E9FA3',
            dataLabels: {
                enabled: false,
            },
            enableMouseTracking: false
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