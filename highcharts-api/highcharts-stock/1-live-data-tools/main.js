function randomDataEntry(min, max) {
    return [new Date().getTime(), Math.floor(Math.random() * (max - min) + min)];
}

function setupLiveDataToggle(chart, id) {
    document.getElementById(id)?.addEventListener(
        'click',
        function () {
            if (!chart.liveDataInterval) {
                chart.liveDataInterval = setInterval(function () {
                    chart.series[0].addPoint(randomDataEntry(10, 100), true, true);
                }, 1000);
            } else {
                clearInterval(chart.liveDataInterval);
                chart.liveDataInterval = undefined;
            }
        }
    );
}

Highcharts.stockChart('containerA', {
    chart: {
        events: {
            load: function () {
                setupLiveDataToggle(this, 'live-data-a');
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

function mapGroupingDialogElements(chart) {
    chart.groupingDialog = {
        container: document.querySelector('#grouping-settings-popup'),
        enabled: document.querySelector('#grouping-settings-popup #enabled'),
        all: document.querySelector('#grouping-settings-popup #all'),
        forced: document.querySelector('#grouping-settings-popup #forced'),
        anchor: document.querySelector('#grouping-settings-popup #anchor'),
        pixelWidth: document.querySelector('#grouping-settings-popup #pixelWidth'),
        close: document.querySelector('#grouping-settings-popup #close'),
        save: document.querySelector('#grouping-settings-popup #save')
    };
}

function setupSaveGrouping(chart) {
    chart.groupingDialog.save.addEventListener('click', function () {
        chart.series[0].update({
            dataGrouping: {
                enabled: chart.groupingDialog.enabled.value,
                groupAll: chart.groupingDialog.all.value,
                forced: chart.groupingDialog.forced.value,
                anchor: chart.groupingDialog.anchor.value,
                groupPixelWidth: chart.groupingDialog.pixelWidth.value,
            }
        });
        chart.groupingDialog.container.style.display = 'none';
    });
}

function fillGroupingDialogFields(chart, data) {
    chart.groupingDialog.enabled.value = data.enabled;
    chart.groupingDialog.all.value = data.groupAll;
    chart.groupingDialog.forced.value = data.forced;
    // "anchor" isn't defined by default but should be "start" according
    // to API Doc: https://api.highcharts.com/highstock/series.line.dataGrouping.anchor
    chart.groupingDialog.anchor.value = data.anchor ?? 'start';
    chart.groupingDialog.pixelWidth.value = data.groupPixelWidth;
}

Highcharts.stockChart('containerB', {
    chart: {
        events: {
            load: function () {
                console.log(this)
                // Random data toggle button handling.
                setupLiveDataToggle(this, 'live-data-b');
                // Fetch all components of the grouping dialog.
                mapGroupingDialogElements(this);
                // Close button, cancel and hide dialog.
                this.groupingDialog.close.addEventListener('click', (function () {
                    this.groupingDialog.container.style.display = 'none';
                }).bind(this));
                // Handling of updating the chart.
                setupSaveGrouping(this);
            }
        }
    },
    stockTools: {
        gui: {
            buttons: ['grouping'],
            definitions: {
                grouping: {
                    symbol: 'indicators.svg',
                    title: 'Data Grouping',
                    className: 'highcharts-data-grouping-button',
                },
            }
        }
    },
    navigation: {
        bindingsClassName: 'tools-container',
        bindings: {
            grouping: {
                className: 'highcharts-data-grouping-button',
                // Handling click for the toolbar button.
                init: function() {
                    // Set the field values to current settings.
                    fillGroupingDialogFields(this.chart, this.chart.series[0].options.dataGrouping);
                    const dialog = this.chart.groupingDialog.container;
                    dialog.style.display = dialog.style.display === 'block'
                        ? 'none'
                        : 'block';
                },
                
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