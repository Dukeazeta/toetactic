class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameMode = 'two-player';
        this.ai = new TicTacToeAI();
        this.history = [];
        this.scores = { X: 0, O: 0, Draws: 0 };
        this.gameOver = false;
        this.winningCombination = null;
        this.playerSymbol = 'X';
        this.sounds = {
            move: document.getElementById('moveSound'),
            win: document.getElementById('winSound'),
            draw: document.getElementById('drawSound')
        };

        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Game board clicks
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        // Game mode selection
        document.querySelectorAll('.mode-selection button').forEach(button => {
            button.addEventListener('click', (e) => this.handleModeSelection(e));
        });

        // Difficulty selection
        document.querySelectorAll('.difficulty-selection button').forEach(button => {
            button.addEventListener('click', (e) => this.handleDifficultySelection(e));
        });

        // Symbol selection
        document.querySelectorAll('.symbol-buttons button').forEach(button => {
            button.addEventListener('click', (e) => this.handleSymbolSelection(e));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Control buttons
        document.getElementById('resetButton').addEventListener('click', () => this.resetGame());
        document.getElementById('undoButton').addEventListener('click', () => this.undoMove());
    }

    handleCellClick(event) {
        const index = event.target.dataset.index;
        if (this.board[index] || this.gameOver) return;

        this.makeMove(index);
        
        if (this.gameMode === 'single-player' && !this.gameOver) {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    makeMove(index) {
        if (this.board[index] || this.gameOver) return false;

        this.history.push([...this.board]);
        this.board[index] = this.currentPlayer;
        this.playSound('move');
        
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = this.currentPlayer;
        cell.classList.add('populated');

        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
        }

        return true;
    }

    makeAIMove() {
        const aiMove = this.ai.makeMove([...this.board], this.currentPlayer);
        if (aiMove !== undefined) {
            this.makeMove(aiMove);
        }
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                this.winningCombination = pattern;
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        return this.board.every(cell => cell !== null);
    }

    handleWin() {
        this.gameOver = true;
        this.scores[this.currentPlayer]++;
        this.playSound('win');
        this.highlightWinningCombination();
        this.updateDisplay();
    }

    handleDraw() {
        this.gameOver = true;
        this.scores.Draws++;
        this.playSound('draw');
        this.updateDisplay();
    }

    highlightWinningCombination() {
        if (this.winningCombination) {
            this.winningCombination.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('win');
            });
        }
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.winningCombination = null;
        this.history = [];
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('win', 'populated');
        });
        
        this.updateDisplay();
    }

    undoMove() {
        if (this.history.length > 0 && !this.gameOver) {
            this.board = this.history.pop();
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateBoard();
            this.updateDisplay();
        }
    }

    updateBoard() {
        this.board.forEach((value, index) => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.textContent = value;
            cell.classList.toggle('populated', value !== null);
        });
    }

    updateDisplay() {
        // Update turn indicator
        document.querySelector('.turn-indicator').textContent = 
            this.gameOver 
                ? (this.checkDraw() ? "It's a Draw!" : `Player ${this.currentPlayer} Wins!`)
                : `Player ${this.currentPlayer}'s Turn`;

        // Update score board
        document.querySelector('.score-x').textContent = `X: ${this.scores.X}`;
        document.querySelector('.score-o').textContent = `O: ${this.scores.O}`;
        document.querySelector('.score-draws').textContent = `Draws: ${this.scores.Draws}`;

        // Update difficulty visibility
        document.querySelector('.difficulty-selection').style.display = 
            this.gameMode === 'single-player' ? 'flex' : 'none';
    }

    handleModeSelection(event) {
        const mode = event.target.dataset.mode;
        this.gameMode = mode;
        
        document.querySelectorAll('.mode-selection button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        this.resetGame();
    }

    handleDifficultySelection(event) {
        const difficulty = event.target.dataset.difficulty;
        this.ai.setDifficulty(difficulty);
        
        document.querySelectorAll('.difficulty-selection button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
        });
    }

    handleSymbolSelection(event) {
        const symbol = event.target.dataset.symbol;
        this.playerSymbol = symbol;
        
        document.querySelectorAll('.symbol-buttons button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.symbol === symbol);
        });

        if (this.gameMode === 'single-player') {
            this.resetGame();
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = document.body.classList.contains('dark-theme') ? '🌜' : '🌞';
    }

    playSound(type) {
        if (this.sounds[type]) {
            this.sounds[type].currentTime = 0;
            this.sounds[type].play().catch(() => {});
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
