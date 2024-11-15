const grid = document.getElementById('grid');
const rows = 20;
const cols = 20;
let startNode = null;
let endNode = null;
let nodes = [];
let mode = 'start';

class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.distance = Infinity;
        this.visited = false;
        this.previousNode = null;
        this.isWall = false;
    }
}

function createGrid() {
    for (let row = 0; row < rows; row++) {
        const currentRow = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.addEventListener('click', () => handleCellClick(row, col));
            grid.appendChild(cell);
            currentRow.push(new Node(row, col));
        }
        nodes.push(currentRow);
    }
}

function handleCellClick(row, col) {
    const cell = grid.children[row * cols + col];
    const node = nodes[row][col];
    if (mode === 'start') {
        if (startNode) {
            const startCell = grid.children[startNode.row * cols + startNode.col];
            startCell.classList.remove('start');
        }
        startNode = node;
        cell.classList.add('start');
    } else if (mode === 'end') {
        if (endNode) {
            const endCell = grid.children[endNode.row * cols + endNode.col];
            endCell.classList.remove('end');
        }
        endNode = node;
        cell.classList.add('end');
    } else if (mode === 'wall') {
        node.isWall = !node.isWall;
        cell.classList.toggle('wall');
    }
}

function setMode(newMode) {
    mode = newMode;
}

function startVisualization() {
    if (!startNode || !endNode) return;
    dijkstraVisualization();
}

function dijkstraVisualization() {
    const unvisitedNodes = getAllNodes();
    startNode.distance = 0;

    // Sort nodes by distance and visualize step by step
    const timeoutIds = [];
    
    function step() {
        if (unvisitedNodes.length === 0) return;
        
        // Sort by distance
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.distance === Infinity) {
            // No path found
            visualizePath();
            return;
        }

        if (closestNode === endNode) {
            visualizePath();
            return;
        }

        closestNode.visited = true;
        updateCell(closestNode, 'visited');

        const neighbors = getUnvisitedNeighbors(closestNode);
        for (const neighbor of neighbors) {
            if (!neighbor.visited && !neighbor.isWall) {
                const newDistance = closestNode.distance + 1;
                if (newDistance < neighbor.distance) {
                    neighbor.distance = newDistance;
                    neighbor.previousNode = closestNode;
                }
            }
        }

        // Slow down the visualization process
        const timeoutId = setTimeout(step, 5);
        timeoutIds.push(timeoutId);
    }

    step();
}

function getAllNodes() {
    const nodesArray = [];
    for (const row of nodes) {
        for (const node of row) {
            nodesArray.push(node);
        }
    }
    return nodesArray;
}

function getUnvisitedNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(nodes[row - 1][col]); // Up
    if (row < rows - 1) neighbors.push(nodes[row + 1][col]); // Down
    if (col > 0) neighbors.push(nodes[row][col - 1]); // Left
    if (col < cols - 1) neighbors.push(nodes[row][col + 1]); // Right
    return neighbors.filter(neighbor => !neighbor.visited);
}

function updateCell(node, className) {
    const cell = grid.children[node.row * cols + node.col];
    cell.classList.add(className);
}

function visualizePath() {
    let currentNode = endNode;
    while (currentNode !== null) {
        if (currentNode !== startNode && currentNode !== endNode) {
            updateCell(currentNode, 'path');
        }
        currentNode = currentNode.previousNode;
    }
    updateCell(startNode, 'start');
    updateCell(endNode, 'end');
}

createGrid();
