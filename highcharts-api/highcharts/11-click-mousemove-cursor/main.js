function generateRandomData(amount, max, min) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * (max - min) + min));
}

Highcharts.chart('container', {
    chart: {
        events: {
            load: function () {
                this.dotRadius = 4;
                this.mouseIndicator = this.renderer.circle(0, 0, this.dotRadius).add();
                // Make indicator track mouse movements.
                this.container.addEventListener(
                    'mousemove',
                    (e) => this.mouseIndicator.attr({
                        cx: e.offsetX - (this.dotRadius / 2),
                        cy: e.offsetY - (this.dotRadius / 2)
                    })
                );
                // Place a circle on click.
                this.container.addEventListener(
                    'click',
                    (e) => this.renderer.circle(
                        e.offsetX - (this.dotRadius / 2),
                        e.offsetY - (this.dotRadius / 2),
                        4
                    ).add()
                );
            }
        },
    },
    title: {
        text: 'Chart title'
    },
    yAxis: {
        title: {
            enabled: false
        },
    },
    series: [
        {
            data: generateRandomData(10, 100, 0)
        }
    ]
});