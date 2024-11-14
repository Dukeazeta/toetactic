class TicTacToeAI {
    constructor() {
        this.difficulty = 'medium';
    }

    setDifficulty(level) {
        this.difficulty = level.toLowerCase();
    }

    makeMove(board, player) {
        switch (this.difficulty) {
            case 'easy':
                return this.makeEasyMove(board);
            case 'medium':
                return this.makeMediumMove(board, player);
            case 'hard':
                return this.makeHardMove(board, player);
            default:
                return this.makeMediumMove(board, player);
        }
    }

    makeEasyMove(board) {
        const emptyCells = board.reduce((acc, cell, index) => {
            if (!cell) acc.push(index);
            return acc;
        }, []);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    makeMediumMove(board, player) {
        // 70% chance of making a smart move, 30% chance of making a random move
        return Math.random() < 0.7 
            ? this.makeHardMove(board, player)
            : this.makeEasyMove(board);
    }

    makeHardMove(board, player) {
        const opponent = player === 'X' ? 'O' : 'X';
        const result = this.minimax(board, player, opponent, 0, true);
        return result.index;
    }

    minimax(board, player, opponent, depth, isMaximizing) {
        const availableMoves = this.getEmptyCells(board);
        
        // Terminal states checking
        if (this.checkWin(board, opponent)) {
            return { score: -10 + depth };
        }
        if (this.checkWin(board, player)) {
            return { score: 10 - depth };
        }
        if (availableMoves.length === 0) {
            return { score: 0 };
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            let bestMove = null;

            for (let move of availableMoves) {
                board[move] = player;
                const score = this.minimax(board, player, opponent, depth + 1, false).score;
                board[move] = null;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }

            return { score: bestScore, index: bestMove };
        } else {
            let bestScore = Infinity;
            let bestMove = null;

            for (let move of availableMoves) {
                board[move] = opponent;
                const score = this.minimax(board, player, opponent, depth + 1, true).score;
                board[move] = null;

                if (score < bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }

            return { score: bestScore, index: bestMove };
        }
    }

    getEmptyCells(board) {
        return board.reduce((acc, cell, index) => {
            if (!cell) acc.push(index);
            return acc;
        }, []);
    }

    checkWin(board, player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => {
            return pattern.every(index => board[index] === player);
        });
    }
}
