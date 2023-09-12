function generateRandomData(amount, max) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * max));
}

function createButton(renderer, text, click = null) {
    const btn = renderer.button(text, 0, 0, click).attr({
        'stroke': '#0000ff',
        'stroke-width': 3
    });
    return btn;
}

function createLabel(renderer, text) {
    return renderer.text(text).attr({
        'stroke': '#999999',
        'stroke-width': 0.5
    });
}

function makeContent(chart, renderer, categories, titles) {
    let largestTextWidth = 0;

    // Make a storage container for titles on the chart.
    if (!chart.titles) {
        chart.titles = {};
    }
    // Remove any titles if they change.
    for (const key of Object.keys(chart.titles).filter((k) => !titles.includes(k))) {
        chart.titles[key].destroy();
        delete chart.titles[key];
    }
    // Make new if missing.
    for (const title of titles) {
        if (!chart.titles[title]) {
            chart.titles[title] = renderer.text(title).add();
        }
        largestTextWidth = Math.max(
            largestTextWidth,
            chart.titles[title].getBBox().width
        );
    }

    // Make a storage container for labels on the chart.
    if (!chart.labels) {
        chart.labels = {};
    }
    // Remove any labels if they change.
    for (const key of Object.keys(chart.labels).filter((k) => !categories.includes(k))) {
        chart.labels[key].destroy();
        delete chart.labels[key];
    }
    // Make new if missing.
    for (const category of categories) {
        if (!chart.labels[category]) {
            chart.labels[category] = createLabel(renderer, category).add();
        }
        largestTextWidth = Math.max(
            largestTextWidth,
            chart.labels[category].getBBox().width
        );
    }

    let largestButtonWidth = 0;
    // Make a storage container for buttons on the chart.
    if (!chart.buttons) {
        chart.buttons = {};
    }
    // Remove any buttons if they change.
    for (const key of Object.keys(chart.buttons).filter((k) => !categories.includes(k))) {
        chart.buttons[key].destroy();
        delete chart.buttons[key];
    }
    // Make new if missing.
    for (const category of categories) {
        if (!chart.buttons[category]) {
            const button = createButton(renderer, 'How to fix', category).add();
            chart.buttons[category] = button;
        }
        largestButtonWidth = Math.max(
            largestButtonWidth,
            chart.buttons[category].getBBox().width
        );
    }

    return { textWidth: largestTextWidth, buttonWidth: largestButtonWidth };
}

function placeTitles(chart, yAxis, buttonWidth) {
    // Place "Íssues" over the labels.
    const issuesText = chart.titles[titles[0]];
    const issuesBB = issuesText.getBBox();
    issuesText.attr({
        x: chart.spacingBox.x + horizontalPadding, 
        y: chart.spacingBox.y - issuesBB.height
    });
    // Place "Record Count" over the columns.
    const barTitleText = chart.titles[titles[1]];
    const barTitleBB = barTitleText.getBBox();
    barTitleText.attr({
        x: yAxis.left + horizontalPadding, 
        y: chart.spacingBox.y - barTitleBB.height
    });
    // Place "Actions" over the action buttons.
    const actionText = chart.titles[titles[2]];
    const actionBB = actionText.getBBox();
    actionText.attr({
        x: chart.spacingBox.x + chart.spacingBox.width - buttonWidth - horizontalPadding, 
        y: chart.spacingBox.y - actionBB.height
    });
}

function placeLabels(chart, xAxis, yAxis) {
    // Make all series labels
    for (const key of categories) {
        let text = chart.labels[key]
        const textBB = text.getBBox();

        const point = chart.series[0].points.find((p) => p.category === key);

        // Place the labels aligned to the right next to the columns.
        const posx = yAxis.left - textBB.width - horizontalPadding;
        const posy = 
            // Add spacing offset +
            chart.spacingBox.y +
            // Add on the axis point padding +
            xAxis.minPixelPadding +
            // Get where the point should be along the raw, un-padded axis +
            ((xAxis.len / categories.length) * point.x) +
            // Center the text on the column vertically (removes half of the
            // difference between their sizes).
            ((chart.series[0].columnMetrics.width - textBB.height) / 2);
        text.attr({ x: posx, y: posy });
    }
}

function placeButtons(chart, xAxis) {
    // Make a button for all categories if necessary.
    for (const key of Object.keys(chart.buttons)) {
        let button = chart.buttons[key];
        const btnBB = button.getBBox();

        const point = chart.series[0].points.find((p) => p.category === key);

        // Place at the end of the chart over the buttons.
        const posx = chart.spacingBox.x + chart.spacingBox.width - btnBB.width - horizontalPadding;
        const posy = 
            // Add spacing offset +
            chart.spacingBox.y +
            // Add on the axis point padding +
            xAxis.minPixelPadding +
            // Get where the buton should be along the raw un-padded axis +
            ((xAxis.len / categories.length) * point.x) -
            // Center the button vertically
            (btnBB.height / 2);
        button.attr({ x: posx, y: posy });
    }
}

function handleChartUpdates(chart) {
    console.log(chart)
    const xAxis = chart.xAxis[0];
    const yAxis = chart.yAxis[0];
    const renderer = chart.renderer;

    // Make content and get button and label widths.
    const contentWidth = makeContent(chart, renderer, categories, titles);

    // Add padding to the button and label widths.
    const paddedLabelWidth = contentWidth.textWidth + (horizontalPadding * 2)
    const paddedButtonWidth = contentWidth.buttonWidth + (horizontalPadding * 2)

    // Calculate the space available for the columns
    const columnsWidth = chart.plotWidth - paddedLabelWidth - paddedButtonWidth;

    // Convert these into percentages for comparing with current settings.
    const labelWidthProcent = (paddedLabelWidth / chart.plotWidth) * 100 + '%';
    const columnsWidthProcent = (columnsWidth / chart.plotWidth) * 100 + '%';

    // Update width and left of the yAxis only if necessary.
    if (yAxis.userOptions.left !== labelWidthProcent || yAxis.userOptions.width !== columnsWidthProcent) {
        yAxis.update({ left: labelWidthProcent, width: columnsWidthProcent });
    }
    
    placeTitles(chart, yAxis, contentWidth.buttonWidth);
    placeLabels(chart, xAxis, yAxis);
    placeButtons(chart, xAxis);
}

let titles = ['Issues', 'Record Count', 'Actions'];
let categories = ['Data', 'Emails', 'Duplicate', 'Support'];
const horizontalPadding = 10;
Highcharts.chart('container', {
    chart: {
        type: 'bar',
        events: {
            load: function() {
                handleChartUpdates(this);
            },
            redraw: function() {
                handleChartUpdates(this);
            }
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
            enabled: false
        }
    },
    yAxis: {
        gridLineWidth: 0,
        title: {
            text: 'Amount'
        }
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
        },
        series: {
            stacking: 'normal',
        }
    },
    series: Array.from({ length: categories.length }, (_ , index) => {
        return {
            type: 'column',
            name: categories[index],
            data: generateRandomData(categories.length, 10)
        }
    })
});