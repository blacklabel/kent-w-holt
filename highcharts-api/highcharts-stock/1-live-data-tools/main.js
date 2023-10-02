/*function randomDataEntry(min, max) {
    const value = Math.floor(Math.random() * (max - min) + min);
    return [
        new Date(),
        value + Math.floor(Math.random() * (3.5 - -3.5) + -3.5),
        value + Math.floor(Math.random() * (3.5 - -3.5) + -3.5),
        value + Math.floor(Math.random() * (3.5 - -3.5) + -3.5),
        value + Math.floor(Math.random() * (3.5 - -3.5) + -3.5)
    ];
}*/
function randomDataEntry(min, max) {
    return [new Date().getTime(), Math.floor(Math.random() * (max - min) + min)];
}

Highcharts.stockChart('containerA', {
    chart: {
        events: {
            load: function () {
                document.getElementById('live-data-a')?.addEventListener(
                    'click',
                    function () {
                        if (!this.liveDataInterval) {
                            this.liveDataInterval = setInterval(function () {
                                this.series[0].addPoint(randomDataEntry(10, 100), true, true);
                            }.bind(this), 1000);
                        } else {
                            clearInterval(this.liveDataInterval);
                            this.liveDataInterval = undefined;
                        }
                    }.bind(this)
                );
            }
        }
    },
    title: {
        text: 'Chart A'
    },
    yAxis: [
        {
            height: '50%'
        },
        {
            top: '50%',
            height: '50%'
        }
    ],
    series: [
        {
            id: 'main',
            data: (function () {
                const data = [];
                for (let i = -100; i <= 0; i += 1) {
                    const [x, y] = randomDataEntry(10, 100);
                    data.push({
                        x: x + i * 1000,
                        y: y
                    });
                }
                return data;
            }()),
            tooltip: {
                valueDecimals: 2
            },
        },
        {
            type: 'linearRegression',
            yAxis: 0,
            linkedTo: 'main',
            dataGrouping: {
                groupPixelWidth: 100
            }
        },
        {
            type: 'ema',
            yAxis: 1,
            linkedTo: 'main',
            dataGrouping: {
                groupPixelWidth: 50
            }
        }
    ]
});

Highcharts.stockChart('containerB', {
    chart: {
        events: {
            load: function () {
                console.log(this)
                document.getElementById('live-data-b')?.addEventListener(
                    'click',
                    function () {
                        if (!this.liveDataInterval) {
                            this.liveDataInterval = setInterval(function () {
                                this.series[0].addPoint(randomDataEntry(10, 100), true, true);
                            }.bind(this), 1000);
                        } else {
                            clearInterval(this.liveDataInterval);
                            this.liveDataInterval = undefined;
                        }
                    }.bind(this)
                );
            }
        }
    },
    stockTools: {
        gui: {
            enabled: true,
            buttons: ['customButton', 'indicators', 'separator', 'simpleShapes', 'lines', 'crookedLines', 'measure', 'advanced', 'toggleAnnotations', 'separator', 'verticalLabels', 'flags', 'separator', 'zoomChange', 'fullScreen', 'typeChange', 'separator', 'currentPriceIndicator', 'saveChart' ],
            definitions: {
                customButton: {
                    title: 'Data Grouping',
                    className: 'highcharts-data-grouping-button'
                }
            }
        }
    },
    navigation: {
        bindings: {
            customButton: {
                className: 'highcharts-data-grouping-button',
                click: function(event) {
                    console.log(event);
                    // Handle the button click, e.g., change DataGrouping options
                }
            }
        }
    },
    title: {
        text: 'Chart B'
    },
    series: [{
        data: (function () {
            const data = [];
            for (let i = -100; i <= 0; i += 1) {
                const [x, y] = randomDataEntry(10, 100);
                data.push({
                    x: x + i * 1000,
                    y: y
                });
            }
            return data;
        }()),
        tooltip: {
            valueDecimals: 2
        }
    }]
});