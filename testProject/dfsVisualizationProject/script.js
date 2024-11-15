const grid = document.getElementById('grid');
const rows = 20;
const cols = 20;
let startNode = null;
let endNode = null;
let nodes = [];
let mode = 'start';
let isVisualizing = false;
let stack = [];
let timeoutIds = [];

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

function toggleVisualization() {
    if (isVisualizing) {
        stopVisualization();
    } else {
        startVisualization();
    }
}

function startVisualization() {
    if (!startNode || !endNode) return;
    isVisualizing = true;
    document.getElementById('startStopButton').textContent = 'Stop Visualization';
    stack = [startNode];
    startNode.distance = 0;
    dfs();
}

function stopVisualization() {
    isVisualizing = false;
    document.getElementById('startStopButton').textContent = 'Start Visualization';
    timeoutIds.forEach(id => clearTimeout(id));
    timeoutIds = [];
}

function dfs() {
    if (!isVisualizing || stack.length === 0) return;
    const currentNode = stack.pop();
    if (currentNode.isWall) {
        dfs();
        return;
    }
    currentNode.visited = true;
    updateCell(currentNode, 'visited');
    if (currentNode === endNode) {
        visualizePath();
        return;
    }
    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode);
    for (const neighbor of unvisitedNeighbors) {
        if (!neighbor.visited && !neighbor.isWall) {
            neighbor.distance = currentNode.distance + 1;
            neighbor.previousNode = currentNode;
            stack.push(neighbor);
        }
    }
    const timeoutId = setTimeout(dfs, 10); // Delay of 100ms between each step
    timeoutIds.push(timeoutId);
}

function getUnvisitedNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(nodes[row - 1][col]);
    if (row < rows - 1) neighbors.push(nodes[row + 1][col]);
    if (col > 0) neighbors.push(nodes[row][col - 1]);
    if (col < cols - 1) neighbors.push(nodes[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.visited);
}

function updateCell(node, className) {
    const cell = grid.children[node.row * cols + node.col];
    if (className === 'path' && (node === startNode || node === endNode)) return; // Don't override start/end colors
    cell.classList.add(className);
}

function visualizePath() {
    let currentNode = endNode;
    while (currentNode !== null) {
        if (currentNode !== startNode && currentNode !== endNode) {
            updateCell(currentNode, 'path');  // Visualize the path in yellow
        }
        currentNode = currentNode.previousNode;
    }
    updateCell(startNode, 'start');  // Keep start node green
    updateCell(endNode, 'end');      // Keep end node red
    stopVisualization();
}

createGrid();
