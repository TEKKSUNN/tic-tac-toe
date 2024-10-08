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

        // Determine score
        const score = Score();

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
            })(score);

            // Find max score winner again & change value of scoreWinner
            scoreWinner = score.findWinner();
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
        const updateBoard = function(listParent, squareFunction, scoreObject, playerSymbol) {
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
            let computerSymbol = "O";
            let mainSymbol = playerSymbol !== null ? playerSymbol : "X";
            if (playerSymbol !== null) {
                computerSymbol = playerSymbol === "X" ? "O" : "X";
            }
            const checkWinner = check(mainSymbol, computerSymbol);
            if (checkWinner.getIsWinner() === true) {
                if (scoreObject !== null) {
                    const winner = checkWinner.getWinner();
                    if (winner === "Player") {
                        scoreObject.addPlayerScore();
                    }
                    else {
                        scoreObject.addCompScore();
                    }
                }
                resetBoard();
            }
        }

        // Returns true if board is empty, else false
        const isEmpty = function() {
            let res = true;
            board.map((row) => {
                row.map((symbol) => {
                    if (symbol !== undefined) {
                        res = false;
                    }
                })
            })
            return res;
        }

        // Writes on board (for GUI version)
        const sequenceWrite = function(squareNum, squareParent,  squareFunction, scoreObject, playerSymbol) {
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
            if (playerSymbol !== null) {
                symbol = playerSymbol;
            }
            if (board[row][column] === undefined) {
                board[row][column] = symbol;
            }
            updateBoard(squareParent, squareFunction, scoreObject, playerSymbol);
        };

        // Random write, but for GUI
        const randomSequenceWrite = function(squareParent, squareFunction, scoreObject, playerSymbol) {
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
            let symbol = playerSymbol === "X" ? "O" : "X";
            if (symbol === "O" && symbolX === 0) {
                return;
            }
            while (true) {
                const row = randomGridNumber();
                const column = randomGridNumber();
                if (board[row][column] === undefined) {
                    board[row][column] = symbol;
                    break;
                }
            }
            updateBoard(squareParent, squareFunction, scoreObject, playerSymbol);
        };

        return { showBoard, check, askWrite, randomWrite, updateBoard, sequenceWrite, resetBoard, randomSequenceWrite, isEmpty };
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
    const Score = function() {
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

        const resetScores = function() {
            player = 0;
            computer = 0;
        }

        return { addPlayerScore, addCompScore, setMaxScore, getPlayerScore, getComputerScore, getMaxScore, findWinner, resetScores };
    };

    // For the GUI version
    document.addEventListener("DOMContentLoaded", () => {
        // Make tic tac toe board
        const gameBoard = GameBoard();

        // Symbols declaration
        let playerSymbol = undefined;
        let computerSymbol = undefined;

        // Determines scores for player & computer
        const scores = Score();

        const updateSquares = function() {
            const squareFunction = function() {
                const SQUARES_PARENT = document.querySelector("#game-board");
                const SQUARES = Array.from(document.querySelectorAll(".square"));
                SQUARES.forEach((square, index) => {
                    square.addEventListener("click", () => {
                        gameBoard.sequenceWrite(index, SQUARES_PARENT, squareFunction, playerScores, null);
                        gameBoard.updateBoard(SQUARES_PARENT, squareFunction, playerScores, "X");
                        updatePlayerScores();
                    })
                });
            };
            gameBoard.updateBoard(document.querySelector("#game-board") /* Equivalent to SQUARES_PARENT */, squareFunction, playerScores, "X");
        };

        // Updates scores
        const updateScores = function() {
            const newScores = document.createElement("div");
            const playerMsg = document.createElement("p");
            playerMsg.textContent = `Player: ${scores.getPlayerScore()}`;
            const computerMsg = document.createElement("p");
            computerMsg.textContent = `Computer: ${scores.getComputerScore()}`;
            newScores.appendChild(playerMsg);
            newScores.appendChild(computerMsg);
            document.querySelector("div#scores").innerHTML = newScores.innerHTML;
        }

        // Updates squares based on symbol
        const updateSymbols = function() {
            const squareFunction = function() {
                const SQUARES_PARENT = document.querySelector("#game-board");
                const SQUARES = Array.from(document.querySelectorAll(".square"));
                SQUARES.forEach((square, index) => {
                    const checkForWinner = function() {
                        if (scores.findWinner() !== undefined) {
                            changeState(document.querySelector(".game-btn"), document.querySelector("dialog.pop-up"), "end");
                        }
                    }
                    const playerWrite = function() {
                        gameBoard.sequenceWrite(index, SQUARES_PARENT, squareFunction, scores, playerSymbol);
                        updateScores();
                        gameBoard.updateBoard(SQUARES_PARENT, squareFunction, scores, playerSymbol);
                        checkForWinner();
                    }
                    const computerWrite = function() {
                        gameBoard.randomSequenceWrite(SQUARES_PARENT, squareFunction, scores, playerSymbol);
                        updateScores();
                        gameBoard.updateBoard(SQUARES_PARENT, squareFunction, scores, playerSymbol);
                        checkForWinner();
                    }
                    square.addEventListener("click", () => {
                        playerWrite();
                        computerWrite();
                    })
                });
                if (computerSymbol === "X" && gameBoard.isEmpty() === true) {
                    gameBoard.randomSequenceWrite(SQUARES_PARENT, squareFunction, scores, playerSymbol);
                    updateScores();
                    gameBoard.updateBoard(SQUARES_PARENT, squareFunction, scores, playerSymbol);
                    // The error from this somehow stops the double X bug lol
                    checkForWinner();
                }
            };
            gameBoard.updateBoard(document.querySelector("#game-board") /* Equivalent to SQUARES_PARENT */, squareFunction, scores, playerSymbol);
        };

        // Reset board shorter function
        const resetBoard = function() {
            gameBoard.resetBoard();
            updateSquares();
        }

        // Resets the score to blank
        const resetScores = function() {
            document.querySelector("div#scores").innerHTML = "";
            scores.resetScores();
        }

        // Creates a normal dialog, returns the dialog element
        const createNewDialog = function(msg, dialogId) {
            const newDialog = document.createElement("dialog");
            const newContainer = document.createElement("div");
            newContainer.className = "container";
            const newMessage = document.createElement("p");
            newMessage.textContent = msg;
            const newCloseButton = document.createElement("button");
            newCloseButton.id = "close-dialog";
            newCloseButton.textContent = "OK";
            newContainer.appendChild(newMessage);
            newContainer.appendChild(newCloseButton);
            newDialog.appendChild(newContainer);
            newDialog.id = dialogId;
            return newDialog;
        }

        // Changes button & dialog based on mode given
        const changeState = function(button, dialog, mode) {
            const validModes = ["start", "during", "end", "pre-game"];
            if (!validModes.includes(mode)) {
                return;
            }

            // Handles dialog
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
                oldDialog.id = newDialog.id;
            }

            // Shows dialog
            const showDialog = function(dialog) {
                dialog.showModal();
            }

            // Changes button text and id
            const changeButton = function(newText, newId) {
                button.textContent = newText;
                button.id = newId;
            }

            // Pre-game template, returns a dialog element
            const preGameTemplate = function() {
                const newDialog = document.createElement("dialog");
                newDialog.id = "start-msg";
                const newContainer = document.createElement("div");
                newContainer.className = "container";
                const newMessage = document.createElement("p");
                newMessage.textContent = "Pick a side:";
                const newSides = document.createElement("div");
                newSides.className = "sides";
                const newButton1 = document.createElement("button");
                newButton1.className = "side";
                newButton1.textContent = "X";
                const newButton2 = document.createElement("button");
                newButton2.className = "side";
                newButton2.textContent = "O";
                newSides.appendChild(newButton1);
                newSides.appendChild(newButton2);
                newContainer.appendChild(newMessage);
                newContainer.appendChild(newSides);
                newDialog.appendChild(newContainer);
                return newDialog;
            };

            // Resets dialog and button to pre-game stage every time the close-dialog button is clicked
            const resetWhenClose = function() {
                document.querySelector("button#close-dialog").addEventListener("click", () => {
                    changeButton("Play Against Computer", "start-btn");
                    const newDialog = preGameTemplate();
                    changeDialog(dialog, newDialog);
                    changeState(document.querySelector("button#start-btn"), dialog, "start");
                    resetBoard();
                    resetScores();
                    dialog.close();
                    updatePlayerNames();
                    updatePlayerScores();
                });
            }

            // Change of button & dialog
            if (mode === "start") {
                dialog.showModal();
                document.querySelector("#player-names").innerHTML = "";
                const newDialog = createNewDialog("Game has started!", "start-msg");
                const handleSecondDialog = function() {
                    document.querySelector("button#close-dialog").addEventListener("click", () => {
                        handleCloseDialog();
                        changeButton("Cancel Game", "cancel-btn");
                        const newDialog = createNewDialog("Game has been cancelled!", "cancel-msg");
                        changeDialog(dialog, newDialog);
                        resetWhenClose();
                        updateSymbols();
                        updateScores();
                    });
                }
                Array.from(document.querySelectorAll("dialog .sides>button")).forEach((button) => {
                    if (button.textContent === "X") {
                        button.addEventListener("click", () => {
                            playerSymbol = "X";
                            computerSymbol = "O";
                            handleCloseDialog();
                            changeDialog(dialog, newDialog);
                            handleSecondDialog();
                            showDialog(dialog);
                            resetBoard();
                        });
                    }
                    else if (button.textContent === "O") {
                        button.addEventListener("click", () => {
                            playerSymbol = "O";
                            computerSymbol = "X";
                            handleCloseDialog();
                            changeDialog(dialog, newDialog);
                            handleSecondDialog();
                            showDialog(dialog);
                            resetBoard();
                        });
                    }
                });
            }
            else if (mode === "end") {
                updateSquares();
                changeButton("Restart Game", "restart-btn");
                let newDialog;
                if (scores.findWinner() === "Player") {
                    newDialog = createNewDialog("You Won!", "winner-msg");
                }
                else {
                    newDialog = createNewDialog("You Lost!", "loser-msg");
                }
                changeDialog(dialog, newDialog);
                document.querySelector("button#close-dialog").addEventListener("click", handleCloseDialog);
                showDialog(dialog);
                const handleClickRestart = function() {
                    const newDialog = createNewDialog("Game has restarted!", "restart-msg");
                    changeDialog(dialog, newDialog);
                    resetWhenClose();
                    button.removeEventListener("click", handleClickRestart);
                }
                button.addEventListener("click", handleClickRestart);
            }
        };

        const updatePlayerNames = function() {
            const namesTab = document.querySelector("div#player-names");
            const player1Name = document.createElement("p");
            player1Name.textContent = `Player 1 (X): ${player1}`;
            const player2Name = document.createElement("p");
            player2Name.textContent = `Player 2 (O): ${player2}`;
            namesTab.appendChild(player1Name);
            namesTab.appendChild(player2Name);
        }

        const createNewDialog2 = function(msg, dialogId) {
            const newDialog = document.createElement("dialog");
            const newContainer = document.createElement("div");
            newContainer.className = "container";
            const newMessage = document.createElement("p");
            newMessage.textContent = msg;
            const newCloseButton = document.createElement("button");
            newCloseButton.id = "close-msg";
            newCloseButton.textContent = "OK";
            newContainer.appendChild(newMessage);
            newContainer.appendChild(newCloseButton);
            newDialog.appendChild(newContainer);
            newDialog.id = dialogId;
            return newDialog;
        }
    
        // Integrate players manual playing
        let player1;
        let player2;
        let playerScores = Score();
        const updatePlayerScores = function() {
            const scoresTab = document.querySelector("#scores")
            scoresTab.innerHTML = "";
            const player1Score = document.createElement("p");
            player1Score.textContent = `Player 1 (${player1}, \"X\") Score: ${playerScores.getPlayerScore()}`;
            const player2Score = document.createElement("p");
            player2Score.textContent = `Player 2 (${player2}, \"O\") Score: ${playerScores.getComputerScore()}`;
            scoresTab.appendChild(player1Score);
            scoresTab.appendChild(player2Score);
            const dialog = document.querySelector("dialog#player-winner-msg");
            const closeDialog = function() {
                dialog.close();
                playerScores.resetScores();
                updatePlayerScores();
            }
            if (playerScores.findWinner() === "Player") {
                const newDialog = createNewDialog2(`Player 1 (${player1}) Won!`, "player-winner-msg");
                dialog.innerHTML = newDialog.innerHTML;
                document.querySelector("button#close-msg").addEventListener("click", closeDialog);
                dialog.showModal();
            }
            else if (playerScores.findWinner() === "Computer") {
                const newDialog = createNewDialog2(`Player 2 (${player2}) Won!`, "player-winner-msg");
                dialog.innerHTML = newDialog.innerHTML;
                document.querySelector("button#close-msg").addEventListener("click", closeDialog);
                dialog.showModal();
            }
        }
        const secondDialog = document.querySelector("dialog#player-form");
        secondDialog.showModal();
        document.querySelector("form#player-names-form").addEventListener("submit", (event) => {
            event.preventDefault();
            player1 = document.querySelector("input#player1").value;
            player2 = document.querySelector("input#player2").value;
            updatePlayerNames();
            updatePlayerScores();
            secondDialog.close();
        });

        // Handle Pre-game
        (function handlePreGame() {
            updateSquares();
        })();

        // Handle start of game
        (function handleStartGame() {
            const startButton = document.querySelector("button#start-btn");
            const handleClick = function(event) {
                const button = event.target;
                const dialog = document.querySelector("div>dialog.pop-up");
                changeState(button, dialog, "start");
            };
            startButton.addEventListener("click", handleClick);
        })();
    });

    return { playGame };
})();