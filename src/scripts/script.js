const Game = (function() {
    // Plays the game
    const playGame = function() {
        // Declare 3x3 object for Tic Tac Toe
        const gameBoard = GameBoard();

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
            while (gameWinner.getIsWinner() === false) {
                const symbolThatGoesFirst = "X";
                if (playerSymbol === symbolThatGoesFirst) {
                    gameBoard.askWrite(playerSymbol);
                    gameBoard.showBoard();
                    gameWinner = gameBoard.check(playerSymbol, computerSymbol);
                    if (gameWinner.getIsWinner() !== false) {
                        gameBoard.randomWrite(computerSymbol);
                        gameBoard.showBoard();
                    }
                    else {
                        break;
                    }
                }
                else {
                    gameBoard.randomWrite(computerSymbol);
                    gameBoard.showBoard();
                    gameBoard.askWrite(playerSymbol);
                    gameBoard.showBoard();
                }

                // Determine winner of game again by checking board
                gameWinner = gameBoard.check(playerSymbol, computerSymbol);
            }

            // Handle winner scenario
            (function handleWinner(name, ScoreObject) {
                if (name === "Player") {
                    window.alert("You won the game!");
                    ScoreObject.addPlayerScore();
                }
                else if (name === "Computer") {
                    window.alert("You lost the game!");
                    ScoreObject.addCompScore();
                }
            })(gameWinner.getWinner(), Score);

            (function showScoreCount(ScoreObject) {
                console.log(`You: ${ScoreObject.getPlayerScore()}, Computer: ${ScoreObject.getComputerScore()}`);
            })(Score);

            // Find max score winner again & change value of scoreWinner
            scoreWinner = Score.findWinner();
        }
    };

    // The 3x3 grid used for Tic Tac Toe
    const GameBoard = function() {
        // The Tic Tac Toe board
        let board = [ [undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined] ];

        // Asks player where to write on board
        const askWrite = function(playerSymbol) {
            window.alert("Your turn! Write on board.")
            let row;
            let column;
            while (row === undefined || column === undefined) {
                row = parseInt(window.prompt("Row:"));
                column = parseInt(window.prompt("Column:"));
                try {
                    if (board[row][column] === undefined) {
                        board[row][column] = playerSymbol;
                    }
                } catch (IndexError) {
                    window.alert("Out of range.");
                    continue;
                }
            }
        };

        // Gives random number
        const randomGridNumber = function() {
            return Math.floor(Math.random() * 3);
        }

        // Randomly writes on a board
        const randomWrite = function(computerSymbol) {
            while (true) {
                const row = randomGridNumber();
                const column = randomGridNumber();
                if (board[row][column] === undefined) {
                    board[row][column] = computerSymbol;
                    break;
                }
            }
        }

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
                const checkContents = function(row) {
                    let playerRow = new Array(3);
                    let computerRow = new Array(3);
                    
                    // Adds symbols to the new player and computer row
                    row.map((symbol, index) => {
                        // Check if symbol exists
                        if (symbol !== undefined) {
                            // If player's symbol, add to player
                            if (symbol === playerSymbol) {
                                playerRow[index] = symbol;
                            }

                            // Else, if computer's symbol, add to computer
                            else if (symbol === computerSymbol) {
                                computerRow[index] = symbol;
                            }
                        }
                    });

                    // Return a new array that removes undefined items
                    const removeUndefined = function(array) {
                        newArray = [];
                        array.map((value) => {
                            if (value === undefined) {
                                return;
                            }
                            newArray.push(value);
                        });
                        return newArray;
                    };

                    // Check if either side wins horizontally
                    const winningLine = 3;
                    if (removeUndefined(playerRow).length >= winningLine) {
                        declareWinner("Player");
                        return;
                    }
                    if (removeUndefined(computerRow).length >= winningLine) {
                        declareWinner("Computer");
                        return;
                    }

                    // Check if there is something to give, if none, don't proceed
                    if (removeUndefined(playerRow).length !== 0) {
                        player.push(playerRow);
                    }
                    if (removeUndefined(computerRow).length !== 0) {
                        computer.push(computerRow);
                    }
                };

                // Update contents of player and computer
                board.map(checkContents);

                return { player, computer };
            })(board);

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

                                // Handle empty symbol
                                if (currentSymbol === undefined) {
                                    break;
                                }
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
                            
                            // Handle empty symbol
                            if (currentSymbol === undefined) {
                                break;
                            }
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
                    for (let row = winningLine - 1, column = 0; row >= 0 ; row--, column++) {
                        // Check if the current symbol exists
                        let currentSymbol;
                        try {
                            currentSymbol = playerGrid[row][column];

                            // Handle empty symbol
                            if (currentSymbol === undefined) {
                                break;
                            }
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

                if (computerGrid.length === winningLine) {

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
                                
                                // Handle empty symbol
                                if (currentSymbol === undefined) {
                                    break;
                                }
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

                            // Handle empty symbol
                            if (currentSymbol === undefined) {
                                break;
                            }
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
                    for (let row = winningLine - 1, column = 0; row >= 0 ; row--, column++) {
                        // Check if the current symbol exists
                        let currentSymbol;
                        try {
                            currentSymbol = computerGrid[row][column];

                            // Handle empty symbol
                            if (currentSymbol === undefined) {
                                break;
                            }
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
            board = [ [undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined] ];
        }

        // Updates board on GUI version
        const updateBoard = function(listParent, squareFunction) {
            // Recreates grid, but in a linear version
            let linearGrid = [];
            board.map((row) => {
                row.map((symbol) => {
                    if (symbol !== undefined) {
                        linearGrid.push(symbol);
                    }
                    else {
                        linearGrid.push(" ");
                    }
                });
            });
            const newListParent = document.createElement("div");
            newListParent.id = listParent.id;
            linearGrid.forEach((symbol) => {
                const newSquare = document.createElement("div");
                newSquare.className = "square";
                newSquare.textContent = symbol;
                newListParent.appendChild(newSquare);
            });
            listParent.innerHTML = newListParent.innerHTML;
            squareFunction();
            if (check("X", "O").getIsWinner() === true) {
                resetBoard();
            }
        }

        // Writes on board (for GUI version)
        const sequenceWrite = function(squareNum, squareParent, squareFunction) {
            let row = 0;
            let column = 0;
            for (let i = 0; i < squareNum; i++) {
                if (column < 2) {
                    column++;
                }
                else {
                    row++;
                    column = 0;
                }
            }
            let symbolX = 0;
            let symbolO = 0;
            board.map((row) => {
                row.map((symbol) => {
                    if (symbol === "X") {
                        symbolX++;
                    }
                    else if (symbol === "O") {
                        symbolO++;
                    }
                });
            });
            let symbol = symbolX > symbolO ? "O" : "X";
            if (symbolX === 5 || symbolO === 5) {
                resetBoard();
                symbol = "X";
            }
            if (board[row][column] === undefined) {
                board[row][column] = symbol;
            }
            updateBoard(squareParent, squareFunction);
        };

        return { showBoard, check, askWrite, randomWrite, updateBoard, sequenceWrite, resetBoard };
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

        // Increments score of player
        const addPlayerScore = function() {
            player++;
        };

        // Increments score of computer
        const addCompScore = function() {
            computer++;
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

        return { addPlayerScore, addCompScore, setMaxScore, getPlayerScore, getComputerScore, getMaxScore, findWinner };
    })();

    // For the GUI version
    document.addEventListener("DOMContentLoaded", () => {
        // Make tic tac toe board
        const gameBoard = GameBoard();

        // Symbols declaration
        let playerSymbol = undefined;
        let computerSymbol = undefined;

        const updateSquares = function() {
            const squareFunction = function() {
                const SQUARES_PARENT = document.querySelector("#game-board");
                const SQUARES = Array.from(document.querySelectorAll(".square"));
                SQUARES.forEach((square, index) => {
                    square.addEventListener("click", () => {
                        gameBoard.sequenceWrite(index, SQUARES_PARENT, squareFunction);
                    })
                });
            };
            gameBoard.updateBoard(document.querySelector("#game-board") /* Equivalent to SQUARES_PARENT */, squareFunction);
        };

        // Handle Pre-game
        (function handlePreGame() {
            updateSquares();
        })();

        // Changes button & dialog based on mode given
        const changeState = function(button, dialog, mode) {
            const validModes = ["start", "during", "end", "pre-game"];
            if (!validModes.includes(mode)) {
                return;
            }

            // Handles dialog
            dialog.showModal();
            const handleCloseDialog = function() {
                dialog.close();
            }
            const closeDialog = document.querySelector("dialog>.container>button#close-dialog");
            if (closeDialog !== null){
                closeDialog.addEventListener("click", handleCloseDialog);
            }

            // Changes dialog
            const changeDialog = function(oldDialog, newDialog) {
                oldDialog.innerHTML = newDialog.innerHTML;
            }

            // Shows dialog
            const showDialog = function(dialog) {
                dialog.showModal();
            }

            // Change of button & dialog
            if (mode === "start") {
                const newDialog = document.createElement("dialog");
                const newContainer = document.createElement("div");
                newContainer.className = "container";
                const newMessage = document.createElement("p");
                newMessage.textContent = "Game has started!";
                const newCloseButton = document.createElement("button");
                newCloseButton.id = "close-dialog";
                newCloseButton.textContent = "OK";
                newContainer.appendChild(newMessage);
                newContainer.appendChild(newCloseButton);
                newDialog.appendChild(newContainer);
                const handleSecondDialog = function() {
                    document.querySelector("button#close-dialog").addEventListener("click", () => {
                        const startButton = document.querySelector("button#start-btn.game-btn");
                        handleCloseDialog();
                        startButton.textContent = "Cancel Game";
                        startButton.id = "cancel-btn";
                    });
                }
                Array.from(document.querySelectorAll("dialog .sides>button")).forEach((button) => {
                    if (button.textContent === "X") {
                        button.addEventListener("click", () => {
                            playerSymbol = "X";
                            computerSymbol = "O";
                            handleCloseDialog();
                            changeDialog(dialog, newDialog);
                            showDialog(dialog);
                            handleSecondDialog();
                        });
                    }
                    else if (button.textContent === "O") {
                        button.addEventListener("click", () => {
                            playerSymbol = "O";
                            computerSymbol = "X";
                            handleCloseDialog();
                            changeDialog(dialog, newDialog);
                            showDialog(dialog);
                            handleSecondDialog();
                        });
                    }
                });
            }
        };

        // Handle start of game
        (function handleStartGame() {
            const startButton = document.querySelector("button#start-btn");
            const handleClick = function(event) {
                const button = event.target;
                const dialog = document.querySelector("div>dialog.pop-up");
                changeState(button, dialog, "start");
            };
            startButton.addEventListener("click", handleClick);
            gameBoard.resetBoard();
            updateSquares();
        })();
    });

    return { playGame };
})();

/* TODO:
    - Deal with pre-game
    -- If user clicks any of the square even without the game starting, it will update the board with the appropriate symbol, the symbols alternating between "X" and "O" each click
    -- If there is a winning side, reset board

    - Deal with start of game
    -- Link start button with the opening of the dialog asking what the user wants to play as, once dialog is closed, then start the game after that

    - Deal with during of game
    -- Make a new button named "Cancel Game", and dialog that shows the cancel message, once cancel message is closed, restart back to normal
    -- After each start of a game, pop-up a message telling what game number it is. e.g. "Game 1 has started!"

    - Deal with end of game
    -- Go back to playing game

    - Deal with true end of game (either side reached max score)
    -- Pop-up a message telling who won, then once pop-up is closed, return the game to normal, which is pre-game stage
*/