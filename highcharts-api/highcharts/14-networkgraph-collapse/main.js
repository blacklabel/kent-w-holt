function generateRandomTree(depth, minChildren, maxChildren) {
    let id = 0;

    function generateNode(currentDepth) {
        const currentId = (id++).toString();
        const childrenCount = Math.floor(Math.random() * (maxChildren - minChildren + 1)) + minChildren;
        const edges = [];

        if (currentDepth < depth) {
            for (let i = 0; i < childrenCount; i++) {
                edges.push([currentId, id.toString()]);
                edges.push(...generateNode(currentDepth + 1));
            }
        }

        return edges;
    }

    return generateNode(1);
}

function setVisibility(node, visible, updateOnly) {
    // Update node visibility if not stated otherwise.
    if (!updateOnly || updateOnly === 'nodes') { node.visible = visible; }

    // Update link visability.
    if (!updateOnly || updateOnly === 'links') {
        node.linksFrom.forEach(link => {
            // NOTE: "link.visible" didn't work, using "width: 0" as a workaround.
            link.update({ width: visible ? 1 : 0 }, false);
        });
    }
}

/**
 * Traverses the tree and runs "action()" on all decendants.
 * @param {Highcharts.Node} node - Root node of the tree to traverse. 
 * @param {function} action - Action to perform on all nodes. Return false to skip the current sub-tree and continue with the rest of the tree.
 */
function traverseTree(node, action) {
    let queue = [...node.linksFrom.map((l) => l.toNode)];
    // Still have objects to process.
    while (queue.length) {
        // Grab the next node.
        const current = queue.shift();

        // They don't want us to keep processing the current subtree, skip it.
        if (action(current) === false) {
            continue;
        }

        // Add decendants to queue for processing.
        queue = queue.concat(current.linksFrom.map((l) => l.toNode));
    }
}

function fold(obj, all) {
    obj.folded = true;

    // Update only the links of the folded node.
    setVisibility(obj, false, 'links');

    // Run over all nodes below the clicked node.
    traverseTree(
        obj,
        (current) => {
            // I am only visible if the folded node is unfolded.
            setVisibility(current, !obj.folded);

            // Everyone should be folded.
            if (all) {
                current.folded = true;
            }
        }
    );
}

function unfold(obj) {
    obj.folded = false;

    // Update only the links of the folded node.
    setVisibility(obj, true, 'links');

    // Run over all nodes below the clicked node.
    traverseTree(
        obj,
        (current) => {
            // NOTE: Node is only visible if the folded node is unfolded.
            // If folded, don't show the links to my children.
            if (current.folded) {
                setVisibility(current, !obj.folded, 'nodes');
            
            // I'm not folded, show it all!
            } else {
                setVisibility(current, !obj.folded);
            }
            // Only continue with all decendants of this
            // sub-tree if the current node isn't folded.
            return !current.folded;
        }
    );
}

Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        events: {
            load: function () {
                fold(this.series[0].nodes[0], true);
                this.redraw();
            }
        }
    },
    title: { text: '' },
    credits: { enabled: false },
    plotOptions: {
        networkgraph: {
            marker: {
                radius: 10,
                states: {
                    inactive: {
                        enabled: false
                    }
                }
            },
            keys: ['from', 'to'],
            point: {
                events: {
                    click: function () {
                        if (!this.folded) {
                            fold(this);
                        } else {
                            unfold(this);
                        }
                        
                        this.series.chart.redraw();
                    }
                }
            },
            dataLabels: {
                enabled: true,
                linkFormat: '',
                style: {
                    fontSize: '0.8em',
                    fontWeight: 'normal'
                }
            }
        }
    },
    tooltip: {
        enabled: false
    },
    series: [{
        data: generateRandomTree(4, 1, 4)
    }]
});