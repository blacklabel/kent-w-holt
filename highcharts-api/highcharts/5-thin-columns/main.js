function generateBankSeries(categories, amount, max, min = 0) {
    const list = [];

    for (let j = 0; j < amount; j++) {
        list.push({
            type: 'column',
            color: '#ff0000',
            name: '',
            data: Array.from({ length: categories }, (_, index) => {
                return {x: index, y: Math.floor(Math.random() * (max - min) + min)}
            })
        });
    }
    
    return list;
}

const categories = ['BANK 1', 'BANK 2', 'BANK 3', 'BANK 4', 'BANK 5'];

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    legend: {
        enabled: false
    },
    xAxis: {
        categories: categories,
        title: {
            enabled: false
        },
        minPadding: 0
    },
    yAxis: {
        title: {
            enabled: false
        },
        tickInterval: 25
    },
    plotOptions: {
        column: {
            pointPadding: 0,
            borderWidth: 0,
            pointWidth: 1
        }
    },
    series: generateBankSeries(categories.length, 300, 100, 10)
});