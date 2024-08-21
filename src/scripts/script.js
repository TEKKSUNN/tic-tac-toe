const Game = (function() {
    // Plays the game
    const playGame = function() {
        const gameBoard = GameBoard();
    };

    // The 3x3 grid used for Tic Tac Toe
    const GameBoard = function() {
        // The Tic Tac Toe board
        const board = [ new Array(3), new Array(3), new Array(3) ];

        // Lets player write on the board
        const write = function(row, column, symbol) {
            if (board[row][column] === undefined) {
                board[row][column] = symbol;
            }
        };

        return { write };
    };

    // Declare max score
    let maxScore = 3;

    // Sets Max Score
    const setMaxScore = function(score) {
        maxScore = score;
    };

    // Lets player decide what symbol or side they will play as
    const assignSymbols = function() {
        let playerSymbol = null;
        const validSymbols = ["X", "O"];
        while (!validSymbols.includes(playerSymbol)) {
            playerSymbol = window.prompt("Play as? (X or O)").trim().toUpperCase();
        }
        let computerSymbol = "X";
        if (playerSymbol === "X") {
            computerSymbol = "O";
        }
        return { player: playerSymbol, computer: computerSymbol };
    };

    // Handles all score-related stuff
    const Score = (function() {
        // Initialize and declare scores
        let player = 0;
        let computer = 0;

        // Sets score of player
        const setPlayerScore = function(score) {
            player = score;
        };

        // Sets score of computer
        const setCompScore = function(score) {
            computer = score;
        };

        // Increments score of player
        const addPlayerScore = function(score) {
            player += score;
        };

        // Increments score of computer
        const addCompScore = function(score) {
            computer += score;
        };

        // Decrements score of player
        const subPlayerScore = function(score) {
            player -= score;
        };

        const subCompScore = function(score) {
            computer -= score;
        };

        return { setPlayerScore, setCompScore, addPlayerScore, addCompScore, subPlayerScore, subCompScore };
    })();

    return { playGame };
})();