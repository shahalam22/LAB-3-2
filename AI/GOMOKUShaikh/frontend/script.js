const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const startButton = document.getElementById('start-btn');
const modeSelector = document.getElementById('mode');
const restartButton = document.getElementById('restart-btn');
let gameMode = 'two_player';
let gameStarted = false;

function initializeBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const cell = document.createElement('div');
            cell.classList.add('board-cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}        

async function startGame() {
    gameMode = modeSelector.value;
    const response = await fetch('http://localhost:8000/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: gameMode })  // Change this line to send an object with mode property
    });
    const state = await response.json();
    gameStarted = true;
    updateBoard(state);
    updateStatusDisplay(state.current_player);
    restartButton.classList.add('hidden');
}

function updateStatusDisplay(currentPlayer) {
    statusElement.innerHTML = `
        <div class="current-turn">Player ${currentPlayer}'s Turn</div>
        <div class="player-info">
            <div class="player-chip">
                <span class="player-stone black"></span>
                Player 1
            </div>
            <div class="player-chip">
                <span class="player-stone white"></span>
                Player 2
            </div>
        </div>
    `;
}

async function handleCellClick(event) {
    if (!gameStarted) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const state = await getState();
    if (state.winner) return;
    
    try {
        const response = await fetch('http://localhost:8000/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                row: row,
                col: col,
                player: state.current_player
            })
        });
        const newState = await response.json();
        updateBoard(newState);                if (newState.winner) {
            statusElement.innerHTML = `
                <div class="current-turn">
                    Player ${newState.winner} Wins!
                </div>
            `;
            gameStarted = false;
            restartButton.classList.remove('hidden');
        } else {
            updateStatusDisplay(newState.current_player);
        }
    } catch (error) {
        statusElement.textContent = 'Invalid move. Try again.';
    }
}

async function getState() {
    const response = await fetch('http://localhost:8000/state');
    return await response.json();
}

function updateBoard(state) {
    const cells = boardElement.children;
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const cell = cells[i * 15 + j];
            cell.innerHTML = '';
            if (state.board[i][j] === 1) {
                const stone = document.createElement('div');
                stone.classList.add('black-stone');
                cell.appendChild(stone);
            } else if (state.board[i][j] === 2) {
                const stone = document.createElement('div');
                stone.classList.add('white-stone');
                cell.appendChild(stone);
            }
        }
    }
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
initializeBoard();