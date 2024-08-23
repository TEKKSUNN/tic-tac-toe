const Game = (function() {
    // Plays the game
    const playGame = function() {
        // Declare 3x3 object for Tic Tac Toe
        const gameBoard = GameBoard();

        // Determine scores
        let playerScore = Score.getPlayerScore();
        let computerScore = Score.getComputerScore();
        const MAX_SCORE = Score.getMaxScore();

        // Asks user for symbol, and assigns symbol accordingly
        const symbols = assignSymbols();

        // Determine symbols
        const playerSymbol = symbols.player;
        const computerSymbol = symbols.computer;

        // Variable for checking winner based on max score
        let scoreWinner = Score.findWinner();

        // While no-one has reached max score
        while (scoreWinner === undefined) {
            // Determine winner of a game
            let gameWinner = gameBoard.check(playerSymbol, computerSymbol);
            
            // Play/continue board game while there is no game winner
            while (gameWinner.getIsWinner === false) {
                gameBoard.playerWrite();

                // Determine winner of game again by checking board
                gameWinner = gameBoard.check(playerSymbol, computerSymbol);
            }

            // Find max score winner again & change value of scoreWinner
            scoreWinner = Score.findWinner();
        }
    };

    // The 3x3 grid used for Tic Tac Toe
    const GameBoard = function() {
        // The Tic Tac Toe board
        const board = [ new Array(3), new Array(3), new Array(3) ];

        // Asks player where to write on board
        const playerWrite = function(playerSymbol) {
            window.alert("Your turn! Write on board.")
            let row;
            let column;
            while (row === undefined || column === undefined) {
                row = parseInt(window.prompt("Row:"));
                column = parseInt(window.prompt("Column:"));
                try {
                    board[row][column] = playerSymbol;
                } catch (IndexError) {
                    window.alert("Out of range.");
                    continue;
                }
            }
        }

        // Lets player write on the board
        const write = function(row, column, symbol) {
            if (board[row][column] === undefined) {
                board[row][column] = symbol;
            }
        };

        // Checks board, returns get functions for winner and state of who won
        const check = function(playerSymbol, computerSymbol) {
            // Make winner object
            let winner = { name: null, isWinner: false };

            // Declares the winner
            const declareWinner = function(name) {
                winner.name = name;
                winner.isWinner = true;
                resetBoard();
            }

            // Gathers information about the grid, and returns new grids without empty rows
            const getInfo = (function(board) {
                let player = [];
                let computer = [];

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
                    
                    // Update contents of player and computer
                    board.map(checkContents);

                    // Check if either side wins horizontally
                    const winningLine = 3;
                    if (playerRow.length >= winningLine) {
                        declareWinner("Player");
                        return;
                    }
                    if (computerRow.length >= winningLine) {
                        declareWinner("Computer");
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
            })(board);

            // Check if there is a winner going through getInfo function
            if (getInfo !== undefined) {
                return { winner };
            }

            // Check if there is winner vertically & diagonally, returns true when there is winner, false if not
            const checkVertDiag = (function(getInfo) {
                // Get grids from getInfo method
                const playerGrid = getInfo.player;
                const computerGrid = getInfo.computer;

                // Determine winning amount of symbols in a vertical
                const winningLine = 3;

                // Proceed if player's rows are 3 then check player's vertical grid
                if (playerGrid.length === winningLine) {

                    // Check vertical
                    // For every column inside a grid's row
                    for (let column = 0; column < winningLine; column++) {
                        // Determine vertical "row" of player grid
                        let verticalRow = [];

                        // For every row inside a grid
                        for (let row = 0; row < winningLine; row++) {
                            // Check if the current symbol exists
                            let currentSymbol;
                            try {
                                currentSymbol = playerGrid[row][column];
                            } catch (IndexError) {
                                // Get out of "row" for loop and continue with "column" for loop
                                break;
                            }

                            // Push current symbol inside player's vertical "row"
                            verticalRow.push(currentSymbol);
                        }

                        // If there is a vertical "row" with three symbols in it
                        if (verticalRow.length === 3) {
                            declareWinner("Player");
                            return true;
                        }
                    }
                    
                    // Check diagonals
                    let diagonalRow = [];

                    // Check from top-left to bottom-right
                    // For this one, the count acts as a row and a column since they both need to be the same value
                    for (let count = 0; count < winningLine; count++) {
                        // Check if the current symbol exists
                        let currentSymbol;
                        try {
                            currentSymbol = playerGrid[count][count];
                        } catch (IndexError) {
                            // Get out of loop and continue with next diagonal check
                            break;
                        }

                        // Push current symbol inside player's diagonal "row"
                        diagonalRow.push(currentSymbol);
                    }

                    // If there is a diagonal "row" with three symbols in it
                    if (diagonalRow.length === winningLine) {
                        declareWinner("Player");
                        return true;
                    }
                    else {
                        // Reset symbol list for next diagonal check
                        diagonalRow = [];
                    }

                    // Check from bottom-left to top-right
                    for (let count = winningLine - 1; count >= 0 ; count--) {
                        // Check if the current symbol exists
                        let currentSymbol;
                        try {
                            currentSymbol = playerGrid[count][count];
                        } catch (IndexError) {
                            // Get out of loop
                            break;
                        }

                        // Push current symbol inside player's diagonal "row"
                        diagonalRow.push(currentSymbol);
                    }

                    // If there is a diagonal "row" with three symbols in it
                    if (diagonalRow.length === winningLine) {
                        declareWinner("Player");
                        return true;
                    }
                }

                else if (computerGrid.length === winningLine) {

                    // Check vertical
                    // For every column inside a grid's row
                    for (let column = 0; column < winningLine; column++) {
                        // Determine vertical "row" of player grid
                        let verticalRow = [];

                        // For every row inside a grid
                        for (let row = 0; row < winningLine; row++) {
                            // Check if the current symbol exists
                            let currentSymbol;
                            try {
                                currentSymbol = computerGrid[row][column];
                            } catch (IndexError) {
                                // Get out of "row" for loop and continue with "column" for loop
                                break;
                            }

                            // Push current symbol inside player's vertical "row"
                            verticalRow.push(currentSymbol);
                        }

                        // If there is a vertical "row" with three symbols in it
                        if (verticalRow.length === 3) {
                            declareWinner("Computer");
                            return true;
                        }
                    }
                    
                    // Check diagonals
                    let diagonalRow = [];

                    // Check from top-left to bottom-right
                    // For this one, the count acts as a row and a column since they both need to be the same value
                    for (let count = 0; count < winningLine; count++) {
                        // Check if the current symbol exists
                        let currentSymbol;
                        try {
                            currentSymbol = computerGrid[count][count];
                        } catch (IndexError) {
                            // Get out of loop and continue with next diagonal check
                            break;
                        }

                        // Push current symbol inside player's diagonal "row"
                        diagonalRow.push(currentSymbol);
                    }

                    // If there is a diagonal "row" with three symbols in it
                    if (diagonalRow.length === winningLine) {
                        declareWinner("Computer");
                        return true;
                    }
                    else {
                        // Reset symbol list for next diagonal check
                        diagonalRow = [];
                    }

                    // Check from bottom-left to top-right
                    for (let count = winningLine - 1; count >= 0 ; count--) {
                        // Check if the current symbol exists
                        let currentSymbol;
                        try {
                            currentSymbol = computerGrid[count][count];
                        } catch (IndexError) {
                            // Get out of loop
                            break;
                        }

                        // Push current symbol inside player's diagonal "row"
                        diagonalRow.push(currentSymbol);
                    }

                    // If there is a diagonal "row" with three symbols in it
                    if (diagonalRow.length === winningLine) {
                        declareWinner("Computer");
                        return true;
                    }
                }

                return false;
            })(getInfo);

            // If vertically checking the board, we found a winner
            if (checkVertDiag === true) {
                return { winner };
            }

            const getWinner = function() {
                return winner.name;
            }

            const getIsWinner = function() {
                return winner.isWinner;
            }

            return { getWinner, getIsWinner };
        };

        // Shows board visually in console
        const showBoard = function() {
            // Determine maxIndex and grid array for storing strings
            const maxIndex = board.length - 1;
            let grid = [];

            // In each row of the board, add values to grid array
            board.map((row, index) => {
                // Push symbol values separated by "|"
                grid.push(`${row[0] === undefined ? " " : row[0]}|${row[1] === undefined ? " " : row[1]}|${row[2] === undefined ? " " : row[2]}`);
                
                // If the row isn't the last row, add a bottom separator
                if (index !== maxIndex) {
                    grid.push("-+-+-");
                }
            });

            // Turn grid to a string separated by newlines & log to console
            console.log(grid.join("\n"));
        };

        // Resets board
        const resetBoard = function() {
            board = [ new Array(3), new Array(3), new Array(3) ];
        }

        return { write, showBoard, check, playerWrite };
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
        const resetPlayerScore = function() {
            player = 0;
        };

        // Sets score of computer
        const resetCompScore = function() {
            computer = 0;
        };

        // Increments score of player
        const addPlayerScore = function() {
            player++;
        };

        // Increments score of computer
        const addCompScore = function() {
            computer++;
        };

        // Decrements score of player
        const subPlayerScore = function() {
            player--;
        };

        const subCompScore = function() {
            computer--;
        };

        // Shows score of player
        const getPlayerScore = function() {
            return player;
        }

        // Shows score of computer
        const getComputerScore = function() {
            return computer;
        }

        // Shows max score
        const getMaxScore = function() {
            return maxScore;
        }

        // Finds out who has max score
        const findWinner = function() {
            // If player reached max score
            if (player === maxScore) {
                return "Player";
            }

            // If computer reached max score
            else if (computer === maxScore) {
                return "Computer";
            }

            // If no-one reached max score, return undefined
            return;
        }

        return { resetPlayerScore, resetCompScore, addPlayerScore, addCompScore, subPlayerScore, subCompScore, setMaxScore, getPlayerScore, getComputerScore, getMaxScore, findWinner };
    })();

    return { playGame };
})();