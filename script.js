// Set up the maze layout (10x10 grid, 1 = wall, 0 = path)
const mazeLayout = [
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 1, 0, 1, 0, 0]
];

// Initialize maze and start/goal positions
const start = { x: 0, y: 0 };
const goal = { x: 9, y: 9 };
const mazeElement = document.getElementById("maze");
const infoElement = document.getElementById("info");

// Draw maze
function drawMaze() {
    mazeElement.innerHTML = '';
    mazeLayout.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.id = `cell-${x}-${y}`;
            if (cell === 1) cellElement.classList.add('wall');
            else cellElement.classList.add('path');
            if (x === start.x && y === start.y) cellElement.classList.add('start');
            if (x === goal.x && y === goal.y) cellElement.classList.add('goal');
            mazeElement.appendChild(cellElement);
        });
    });
}

// Display information in the info panel
function displayInfo(text) {
    infoElement.innerHTML += `<p>${text}</p>`;
}

// Calculate fitness (distance to goal)
function calculateFitness(pos) {
    return Math.sqrt(Math.pow(goal.x - pos.x, 2) + Math.pow(goal.y - pos.y, 2));
}

// Run BSA-DS Algorithm
async function bsaDS() {
    let current = { ...start };
    let candidates = [current];
    let visited = new Set();
    visited.add(`${current.x},${current.y}`);

    displayInfo("Starting BSA-DS Algorithm at start position (0,0)");
    drawMaze();

    while (candidates.length > 0) {
        // Pick a candidate randomly (dual scatter search step)
        const index = Math.floor(Math.random() * candidates.length);
        current = candidates[index];
        candidates.splice(index, 1);

        // Update the color for the current cell to indicate it's being explored
        const currentCell = document.getElementById(`cell-${current.x}-${current.y}`);
        if (currentCell) currentCell.classList.add('visited');

        // Check if goal is reached
        if (current.x === goal.x && current.y === goal.y) {
            displayInfo("Goal reached!");
            return;
        }

        // Generate new candidates (scatter search step)
        const moves = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ];

        displayInfo(`Current Position: (${current.x}, ${current.y}), Fitness: ${calculateFitness(current).toFixed(2)}`);

        moves.forEach(move => {
            if (isValidMove(move) && !visited.has(`${move.x},${move.y}`)) {
                move.fitness = calculateFitness(move);
                candidates.push(move);
                visited.add(`${move.x},${move.y}`);

                // Temporarily mark new candidates with a different color
                const candidateCell = document.getElementById(`cell-${move.x}-${move.y}`);
                if (candidateCell) candidateCell.classList.add('candidate');

                displayInfo(`Candidate Position: (${move.x}, ${move.y}), Fitness: ${move.fitness.toFixed(2)}`);
            }
        });

        // Sort candidates by fitness (Selection step)
        candidates.sort((a, b) => a.fitness - b.fitness);

        displayInfo(`Best Candidate Selected: (${candidates[0].x}, ${candidates[0].y}), Fitness: ${candidates[0].fitness.toFixed(2)}`);

        // Wait before moving to the next step to show progress visually
        await new Promise(resolve => setTimeout(resolve, 500));

        // Reset candidate color after exploring
        document.querySelectorAll('.candidate').forEach(cell => cell.classList.remove('candidate'));
    }

    displayInfo("No path found to goal.");
}

// Check if a move is valid
function isValidMove(pos) {
    return (
        pos.x >= 0 &&
        pos.y >= 0 &&
        pos.x < 10 &&
        pos.y < 10 &&
        mazeLayout[pos.y][pos.x] === 0
    );
}

// Run the functions
drawMaze();
bsaDS();
