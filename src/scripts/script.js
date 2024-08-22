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

        // Checks board, returns winner, and returns who won (if there is)
        const check = function(playerSymbol, computerSymbol) {
            // Make winner object
            let winner = { name: null, isWinner: false };

            // Gathers information about the grid, and returns new grids without empty rows
            const getInfo = (function() {
                let player = [];
                let computer = [];

                // Update contents of player and computer
                this.board.map(checkContents);

                // Iterates through the rows of a Tic Tac Toe's grid row list
                // Updates local player and computer array if there is symbol
                const checkContents = function(row, rowNumber) {
                    let playerRow = [];
                    let computerRow = [];
                    
                    // Adds symbols to the new player and computer row
                    row.map((symbol, index) => {
                        // Check if symbol exists
                        if (symbol !== undefined) {
                            // Make object that records the symbols's information
                            const symbolInfo = { symbol, index, rowNumber };

                            // If player's symbol, add to player
                            if (symbol === playerSymbol) {
                                playerRow.push(symbolInfo);
                            }

                            // Else, if computer's symbol, add to computer
                            else if (symbol === computerSymbol) {
                                computerRow.push(symbolInfo);
                            }
                        }
                    });

                    // Check if either side wins horizontally
                    const winningLine = 3;
                    if (playerRow.length >= winningLine) {
                        return;
                    }
                    if (computerRow.length >= winningLine) {
                        return;
                    }

                    // Check if there is something to give, if none, don't proceed
                    if (playerRow.length !== 0) {
                        player.push(playerRow);
                    }
                    if (computerRow.length !== 0) {
                        computer.push(computerRow);
                    }
                };

                return { player, computer };
            })();

            return { winner };
        };

        return { write };
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
        // Declare max score
        let maxScore = 3;

        // Sets Max Score
        const setMaxScore = function(score) {
            maxScore = score;
        };
        
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