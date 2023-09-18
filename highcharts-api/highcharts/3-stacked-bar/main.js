function generateRandomData(amount, max) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * max));
}

function placeTitles(chart, renderer, yAxis) {
    if (!chart.titles) {
        chart.titles = {
            issues: renderer.text('Issues').add(),
            bar: renderer.text('Record Count').add(),
            actions: renderer.text('Actions').add(),
        };
    }

    // Place "Íssues" over the labels.
    chart.titles.issues.attr({
        x: chart.spacingBox.x + horizontalPadding, 
        y: chart.spacingBox.y - chart.titles.issues.getBBox().height
    });
    // Place "Record Count" over the columns.
    chart.titles.bar.attr({
        x: yAxis.left + horizontalPadding, 
        y: chart.spacingBox.y - chart.titles.bar.getBBox().height
    });
    // Place "Actions" over the action buttons.
    chart.titles.actions.attr({
        x: chart.spacingBox.x + chart.spacingBox.width - chart.buttonWidth - horizontalPadding, 
        y: chart.spacingBox.y - chart.titles.actions.getBBox().height
    });
}

function placeButtons(chart, renderer, xAxis) {
    // Make a storage container for buttons on the chart.
    if (chart.buttons?.length !== categories.length) {
        const buttonStyle = {
            'stroke': '#0000ff',
            'stroke-width': 3
        };
        chart.buttons = Array.from(
            { length: categories.length },
            function (_, i) { 
                const btn = renderer.button(
                    'How to fix',
                    0,
                    0,
                    () => console.log(`Action for category ${categories[i]} was clicked`)
                ).attr(
                    // Initial styling.
                    buttonStyle
                ).add();
                btn.id = categories[i];
                // NOTE: Styles are being overridden by events, override those and re-apply/enforce styling.
                btn.on('mouseover', () => btn.attr(buttonStyle));
                btn.on('mouseleave', () => btn.attr(buttonStyle));
                return btn;
            }
        );
        chart.buttonWidth = chart.buttons[0].getBBox().width;
    }

    // Make a button for all categories if necessary.
    for (const button of chart.buttons) {
        const btnBB = button.getBBox();

        const point = chart.series[0].points.find((p) => p.category === button.id);

        // Place at the end of the chart over the buttons.
        const posx = chart.spacingBox.x + chart.spacingBox.width - btnBB.width - horizontalPadding;
        const posy = 
            // Add spacing offset +
            chart.spacingBox.y +
            // Add on the axis point padding +
            xAxis.minPixelPadding +
            // Get where the buton should be along the raw un-padded axis +
            ((xAxis.len / categories.length) * point.x) -
            // Center the button vertically.
            (btnBB.height / 2);
        button.attr({ x: posx, y: posy });
    }
}

function handleChartUpdates(chart) {
    console.log(chart)
    const xAxis = chart.xAxis[0];
    const yAxis = chart.yAxis[0];
    const renderer = chart.renderer;

    placeButtons(chart, renderer, xAxis);
    placeTitles(chart, renderer, yAxis);
}

let categories = ['Data', 'Emails', 'Duplicate', 'Support'];
const horizontalPadding = 10;
Highcharts.chart('container', {
    chart: {
        type: 'bar',
        events: {
            render: function() {
                handleChartUpdates(this);
            },
        },
        spacingTop: 50
    },
    title: {
        text: ''
    },
    legend: {
        enabled: false
    },
    xAxis: {
        categories: categories,
        gridLineWidth: 1,
        gridLineColor: '#9E9FA370',
        lineWidth: 0,
        labels: {
            align: 'right',
            reserveSpace: false,
            x: 60
        }
    },
    yAxis: {
        gridLineWidth: 0,
        title: {
            text: 'Amount'
        },
        maxPadding: 0.5,
        left: '10%'
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            pointPadding: 0.2,
        }
    },
    series: Array.from({ length: categories.length }, (_ , index) => {
        return {
            type: 'column',
            data: generateRandomData(categories.length, 100),
            dataLabels: {
                enabled: index === 0,
                align: 'right',
                x: 50,
                formatter: function() {
                    return this.point.total + ' K';
                }
            }
        }
    }),
});