function getPositionOnXZCircle(cx, cz, radius, value) {
    const angle = 2 * Math.PI * value;
    const x = cx + radius * Math.cos(angle);
    const z = cz + radius * Math.sin(angle);
    
    return { x: x, z: z};
}

function startAnimation(chart, points) {
    chart.prevTime = Date.now();
    chart.planetOrbitProgress = 0;
    chart.moonOrbitProgress = 0.25;

    // 60 fps update loop, don't need anything faster.
    setInterval(() => {
        // Calculate time since last update.
        const currTime = Date.now();
        const dt = ((currTime - chart.prevTime) / 1000) / 2;
        chart.prevTime = currTime;

        const sun = points[0];
        const planet = points[1];
        const moon = points[2];
        
        const planetPos = getPositionOnXZCircle(sun.x, sun.z, 2, chart.planetOrbitProgress);
        planet.update(
            { x: planetPos.x, y: planet.y, z: planetPos.z },
            // Don't redraw yet, we're not done updating.
            false
        );
    
        const moonPos = getPositionOnXZCircle(planet.x, planet.z, 0.5, chart.moonOrbitProgress);
        moon.update(
            { x: moonPos.x, y: moon.y, z: moonPos.z },
            // Don't redraw yet, we're not done updating.
            false
        );

        // Update the progress of the orbits and round over if above 1.
        chart.planetOrbitProgress = (chart.planetOrbitProgress + dt) <= 1
            ? chart.planetOrbitProgress + dt
            : chart.planetOrbitProgress + dt - 1;
        chart.moonOrbitProgress = (chart.moonOrbitProgress + dt) <= 1
            ? chart.moonOrbitProgress + (dt * 2)
            : chart.moonOrbitProgress + (dt * 2) - 1;

        // Tell the chart that it's time to redraw.
        chart.redraw();
    }, 1000 / 60);
}

function projectOn(chart, point, pane) {
    chart.get(point.id + '-' + pane).update(
        {
            x: (pane === 'yz') ? 0 : point.x,
            y: (pane === 'xz') ? 0 : point.y,
            z: (pane === 'xy') ? 0 : point.z
        },
        // False as this is a syncronous update call and will be redrawn in the update loop.
        false
    );
}

Highcharts.chart('part1', {
    chart: {
        type: 'scatter3d',
        animation: false,
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 45,
            depth: 350,
            viewDistance: 5,
            fitToPlot: true,
            frame: {
                bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                side: { size: 1, color: 'rgba(0,0,0,0.06)' }
            }
        },
        events: {
            load: function () {
                startAnimation(this, this.series[0].points);
            }
        }
    },
    title: {
        text: ''
    },
    tooltip: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    xAxis: {
        min: 0,
        max: 10,
    },
    yAxis: {
        min: 0,
        max: 10,
    },
    zAxis: {
        min: 0,
        max: 10,
        showLastLabel: false,
        reversed: true
    },
    series: [
        {
            data: [
                {
                    id: 'sun',
                    x: 5,
                    y: 5,
                    z: 5,
                    color: {
                        radialGradient: { cx: 0.35, cy: 0.35, r: 0.5 },
                        stops: [[0, '#EEEEEE'], [1, '#FFD900']]
                    },
                    marker: { radius: 10, symbol: 'circle' }
                },
                {
                    id: 'planet',
                    x: 0,
                    y: 5,
                    z: 0,
                    color: {
                        radialGradient: { cx: 0.35, cy: 0.35, r: 0.4 },
                        stops: [[0, '#EEEEEE'], [1, '#00A2FF']]
                    },
                    marker: { radius: 6, symbol: 'circle' }
                },
                {
                    id: 'moon',
                    x: 0,
                    y: 5,
                    z: 0,
                    color: {
                        radialGradient: { cx: 0.35, cy: 0.35, r: 0.3 },
                        stops: [[0, '#EEEEEE'], [1, '#AFAFAF']]
                    },
                    marker: { radius: 3, symbol: 'circle' }
                }
            ],
            point: {
                events: {
                    update: function () {
                        // Update the other projections.
                        projectOn(this.series.chart, this, 'xy');
                        projectOn(this.series.chart, this, 'xz');
                        projectOn(this.series.chart, this, 'yz');
                    }
                }
            }
        },
        {
            id: 'xy',
            name: 'Projection XY',
            data: [
                // Sun is fixed anyway, set position as it's never updated.
                { id: 'sun-xy', x: 5, y: 5, z: 0, color: '#FFD90055', marker: { radius: 10, symbol: 'circle' } },
                { id: 'planet-xy', color: '#00A2FF55', marker: { radius: 6, symbol: 'circle' } },
                { id: 'moon-xy', color: '#AFAFAF55', marker: { radius: 3, symbol: 'circle' } }
            ]
        },
        {
            id: 'xz',
            name: 'Projection XZ',
            data: [
                // Sun is fixed anyway, set position as it's never updated.
                { id: 'sun-xz', x: 5, y: 0, z: 5, color: '#FFD90055', marker: { radius: 10, symbol: 'circle' } },
                { id: 'planet-xz', color: '#00A2FF55', marker: { radius: 6, symbol: 'circle' } },
                { id: 'moon-xz', color: '#AFAFAF55', marker: { radius: 3, symbol: 'circle' } }
            ]
        },
        {
            id: 'yz',
            name: 'Projection YZ',
            data: [
                // Sun is fixed anyway, set position as it's never updated.
                { id: 'sun-yz', x: 0, y: 5, z: 5, color: '#FFD90055', marker: { radius: 10, symbol: 'circle' } },
                { id: 'planet-yz', color: '#00A2FF55', marker: { radius: 6, symbol: 'circle' } },
                { id: 'moon-yz', color: '#AFAFAF55', marker: { radius: 3, symbol: 'circle' } }
            ]
        }
    ]
});