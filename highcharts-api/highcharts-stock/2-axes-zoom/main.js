
function randomDataEntry(min, max) {
    return [new Date().getTime(), Math.floor(Math.random() * (max - min) + min)];
}

function mousemove(event) {
    const extremes = this.yAxis[0].getExtremes();

    const newMin = extremes.min + (event.movementY * this.scaleSensitivity);
    const newMax = extremes.max - (event.movementY * this.scaleSensitivity)

    // Skip axis flip over if ranges are get close to reversing (max < min).
    if (newMax - newMin <= 10) {
        return
    };

    this.yAxis[0].setExtremes(
        newMin, 
        newMax,
        true, false
    );
}

function mousewheel(event) {
    const extremes = this.xAxis[0].getExtremes();

    const newMin = extremes.min - (event.deltaY * this.scaleSensitivity);

    // Skip if axis extreme is on first point and the user is scrolling further in.
    if (newMin > this.xAxis[0].dataMin && event.deltaY < 0) {
        return
    };

    this.xAxis[0].setExtremes(
        newMin, 
        extremes.max,
        true, false
    );
}

Highcharts.stockChart('container', {
    chart: {
        events: {
            load: function () {
                this.scaleSensitivity = 10;

                // This allows binding context and removal of event handler.
                const eventCB = mousemove.bind(this);

                this.container.addEventListener('mousedown', (() => {
                    // Add mouse move event listener on mouse down to minimize callbacks.
                    // NOTE: Added on the document so the user can keep scaling if they exit the chart.
                    document.addEventListener('mousemove', eventCB);
                }).bind(this));
                // NOTE: Added on the document so the user can release anywhere.
                document.addEventListener('mouseup', (() => {
                    // Done dragging, remove listener to minimize callbacks.
                    document.removeEventListener('mousemove', eventCB);
                }).bind(this));

                // Scale x-axis min extreme on wheel changes.
                this.container.addEventListener('wheel', mousewheel.bind(this));
            }
        },
        // We're doing manual zooming.
        zooming: {
            mouseWheel: {
                enabled: false
            }
        }
    },
    xAxis: {
        // Allows smooth scaling and disables interval rounding.
        startOnTick: false,
        endOnTick: false,
        // Disables locking the axis to data set only.
        ordinal: false
    },
    yAxis: {
        // Allows smooth scaling and disables interval rounding.
        startOnTick: false,
        endOnTick: false
    },
    // Remove navigator, navigation should be done manually.
    navigator: {
        enabled: false
    },
    series: [
        {
            data: (function () {
                const data = [];
                for (let i = -100; i <= 0; i += 1) {
                    const [x, y] = randomDataEntry(100, 1000);
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
        }
    ]
});