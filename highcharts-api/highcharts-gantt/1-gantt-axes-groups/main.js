Highcharts.ganttChart('container', {
    xAxis: {
        labels: {
            formatter: function () {
                console.log(this)
                const date = new Date(this.pos);
                return `${
                    date.toLocaleDateString('en-GB', { weekday: 'long' })
                }, ${
                    date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                }, ${
                    date.getFullYear()
                }`;
            }
        }
    },
    yAxis: {
        uniqueNames: true
    },
    series: [{
        name: 'Project 1',
        data: [{
            name: 'Main',
            pointWidth: 0
        }, {
            name: 'First',
            start: 1560902400000,
            end: 1561075200000,
        }, {
            name: 'Second',
            start: 1560902400000,
            end: 1561075200000
        }, {
            name: 'Second',
            start: 1561507200000,
            end: 1561680000000
        }]
    }]

});
