let sudokuBoard = [...Array(9)].map(() => Array(9).fill(0)); // Empty 9x9 board
let copyBoard = [...Array(9)].map(() => Array(9).fill(0));   // Copy of the original board
let incorrectCount = 0;
const maxMistakes = 3; 

function generateSudoku() {
    fillBoard(0, 0);
    copyBoard = JSON.parse(JSON.stringify(sudokuBoard)); 
}


function fillBoard(row, col) {
    if (row === 9) return true; 
    if (col === 9) return fillBoard(row + 1, 0);
    if (sudokuBoard[row][col] !== 0) return fillBoard(row, col + 1);

    let nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let num of nums) {
        if (isValidPlacement(row, col, num)) {
            sudokuBoard[row][col] = num;
            if (fillBoard(row, col + 1)) return true;
            sudokuBoard[row][col] = 0; 
        }
    }
    return false;
}

function isValidPlacement(row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (sudokuBoard[i][col] === num || sudokuBoard[row][i] === num) return false;
        let boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        let boxCol = 3 * Math.floor(col / 3) + (i % 3);
        if (sudokuBoard[boxRow][boxCol] === num) return false;
    }
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createPuzzle(difficultyLevel) {
    let maxRemovals = difficultyLevel === "easy" ? 20 : difficultyLevel === "medium" ? 35 : difficultyLevel === "hard" ? 50 : 55;
    let cellsToRemove = shuffleArray([...Array(81).keys()]);

    for (let i = 0; i < maxRemovals; i++) {
        let cellIndex = cellsToRemove[i];
        let row = Math.floor(cellIndex / 9);
        let col = cellIndex % 9;
        sudokuBoard[row][col] = 0; 
    }
}

function startNewGame(difficulty) {
    sudokuBoard = [...Array(9)].map(() => Array(9).fill(0)); 
    incorrectCount = 0;
    generateSudoku();
    createPuzzle(difficulty);
    renderBoard(); 
    document.getElementById('errorCounter').textContent = 'Villur: 0 / 3';
    document.getElementById('statusMessage').textContent = '';
    closeModal();
}

function renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = ''; 

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.value = sudokuBoard[i][j] !== 0 ? sudokuBoard[i][j] : '';
            cell.disabled = sudokuBoard[i][j] !== 0; 
            cell.id = `cell-${i}-${j}`;

            cell.addEventListener('input', function () {
                if (!/^[1-9]?$/.test(this.value)) {
                    this.value = '';
                } else {
                    validateCell(i, j, parseInt(this.value));
                }
            });

            cell.addEventListener('click', function () {
                highlightSameNumbers(this.value);
            });

            gameBoard.appendChild(cell);
        }
    }
}

function validateCell(row, col, num) {
    let cell = document.getElementById(`cell-${row}-${col}`);

    cell.classList.remove('incorrect');
    cell.classList.remove('correct');

    if (num === 0 || isNaN(num)) return; 

    if (copyBoard[row][col] === num) {
        cell.classList.add('correct'); 
        cell.disabled = true; 
        checkVictory(); 
    } else {
        cell.classList.add('incorrect');
        incorrectCount++;

        document.getElementById('errorCounter').textContent = `Villur: ${incorrectCount} / 3`;

        if (incorrectCount >= maxMistakes) {
            gameOver();
        }
    }
}
function victoryMessage() {
    openModal('Jíbbí! Þú kláraðir leikinn!');
}

function gameOver() {
    openModal('Leik lokið! Þú fékkst of margar villur :(');
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let cell = document.getElementById(`cell-${row}-${col}`);
            cell.disabled = true;
        }
    }
}

function highlightSameNumbers(number) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let cell = document.getElementById(`cell-${row}-${col}`);
            if (cell.value === number && number !== '') {
                cell.classList.add('highlight');
            } else {
                cell.classList.remove('highlight');
            }
        }
    }
}

function checkVictory() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (document.getElementById(`cell-${row}-${col}`).disabled === false) {
                return; 
            }
        }
    }
    victoryMessage();
}


window.onload = () => startNewGame('easy'); 
