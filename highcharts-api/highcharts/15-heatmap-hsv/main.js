function hsvToHsl(h, s, v) {
    let l = v - (v * s) / 2;
    let minVal = Math.min(l, 1 - l);
    let sl = minVal ? (v - l) / minVal : 0;

    return `hsl(${h}, ${sl * 100}%, ${l * 100}%)`;
}

function generateHSVValues(hueResolution, secondParamResolution) {
    let hueStep = 360 / hueResolution;
    let secondParamStep = 1 / secondParamResolution;

    let hsvValues = [];
    for (let h = 0; h < hueResolution + 1; h++) {
        for (let s = 0; s < secondParamResolution + 1; s++) {
            for (let v = 0; v < secondParamResolution + 1; v++) {
                let hsv = {
                    h: h * hueStep,
                    s: s * secondParamStep,
                    v: v * secondParamStep
                };
                hsvValues.push({
                    x: hsv.h,
                    y: hsv.s,
                    value: hsv.v,
                    // CSS doesn't know hsv, so converting to hsl for displaying purposes.
                    color: hsvToHsl(hsv.h, hsv.s, hsv.v),
                    custom: { hsv: hsv }
                });
            }
        }

    }
    return hsvValues;
}

function updatePoints(chart) {
    const currentProperty = chart.series[0].currentProperty;
    const currentValue = chart.series[0].currentValue;

    // Might be quite a few points, used cached-for as it's the fastest.
    const iterations = chart.series[0].points.length;
    for (let i = 0; i < iterations; i++) {
        const point = chart.series[0].points[i];
        const hsv = point.custom.hsv;
        point.update(
            {
                y: hsv[currentProperty],
                value: hsv[currentProperty],
                // Update the color, CSS doesn't know hsv, converting to hsl for displaying purposes.
                color: hsvToHsl(
                    hsv.h,
                    currentProperty === 's' ? hsv.s : currentValue,
                    currentProperty === 'v' ? hsv.v : currentValue
                )
            },
            // Do not redraw, will do after all points are updated.
            false
        );
    }
    chart.redraw();
}

function switchProperty(event) {
    this.series[0].currentProperty = event.target.id;
    updatePoints(this);
}

function changePropertyAmount(event) {
    this.series[0].currentValue = event.target.value;
    updatePoints(this);
}

const resolution = { h: 36, s_v: 20 };
Highcharts.chart('container', {
    chart: {
        type: 'heatmap',
        height: 600,
        events: {
            load: function () {
                // Start property is "s";
                this.series[0].currentProperty = 's';

                // Save the current value of the slider into the series
                // so all callbacks can use the value.
                const slider = document.getElementById('slider');
                this.series[0].currentValue = slider ? slider.value : 0;

                updatePoints(this);

                document.getElementById('s')?.addEventListener('change', switchProperty.bind(this));
                document.getElementById('v')?.addEventListener('change', switchProperty.bind(this));
                slider?.addEventListener('change', changePropertyAmount.bind(this));
            }
        },
        animation: false
    },
    title: {
        text: 'Heatmap of Colors in HSV'
    },
    xAxis: {
        title: {
            text: 'H'
        },
        tickInterval: 36
    },
    yAxis: {
        title: {
            text: null
        },
        tickInterval: 0.05
    },
    plotOptions:{
        series: {
            turboThreshold: 0
        }
    },
    series: [{
        data: generateHSVValues(resolution.h, resolution.s_v),
        borderWidth: 0,
        pointPadding: 0,
        colsize: 360 / resolution.h,
        rowsize: 1 / resolution.s_v
    }]
});