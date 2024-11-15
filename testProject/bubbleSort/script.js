const arrayContainer = document.getElementById('array-container');
const formulaElement = document.getElementById('formula');
const stepsElement = document.getElementById('steps');
const totalStepsElement = document.getElementById('total-steps');
const sortedArrayElement = document.getElementById('sorted-array');

let array = [];
let isVisualizing = false;
let stepCount = 0;

function generateArray() {
    arrayContainer.innerHTML = '';
    stepsElement.innerHTML = '';
    totalStepsElement.textContent = '0';
    sortedArrayElement.textContent = '[]';
    stepCount = 0;
    array = [];

    const size = 10; // Array size with 10 bars
    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 50) + 1;
        array.push(value);

        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value * 5}px`;
        bar.textContent = value;
        arrayContainer.appendChild(bar);
    }

    const n = array.length;
    const comparisons = (n * (n - 1)) / 2;
    formulaElement.textContent = `Total Comparisons = n * (n - 1) / 2 = ${n} * (${n} - 1) / 2 = ${comparisons}`;
}

function toggleVisualization() {
    if (isVisualizing) {
        stopVisualization();
    } else {
        startVisualization();
    }
}

function startVisualization() {
    isVisualizing = true;
    document.getElementById('startStopButton').textContent = 'Stop Visualization';
    bubbleSort();
}

function stopVisualization() {
    isVisualizing = false;
    document.getElementById('startStopButton').textContent = 'Start Visualization';
}

async function bubbleSort() {
    let n = array.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
        swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            if (!isVisualizing) return;

            const bars = document.getElementsByClassName('bar');
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            await sleep(250); // Fast delay

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                bars[j].style.height = `${array[j] * 5}px`;
                bars[j].textContent = array[j];
                bars[j + 1].style.height = `${array[j + 1] * 5}px`;
                bars[j + 1].textContent = array[j + 1];

                swapped = true;
                stepCount++;
                stepsElement.innerHTML += `<p>Step ${stepCount}: Swapped ${array[j + 1]} and ${array[j]}</p>`;
                totalStepsElement.textContent = stepCount;
            }

            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
        }

        if (!swapped) break;
    }

    markAllBarsAsSorted();
    sortedArrayElement.textContent = `[${array.join(', ')}]`;

    stopVisualization();
}

function markAllBarsAsSorted() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add('sorted'); // All bars green at the end
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

generateArray();
