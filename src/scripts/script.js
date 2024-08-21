const Game = (function() {
    const GameBoard = function() {
        return [ new Array(3), new Array(3), new Array(3) ];
    };
    let maxScore = 3;
    const setMaxScore = function(score) {
        maxScore = score;
    };
    const playGame = function() {
        const gameBoard = GameBoard();
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

    return { playGame };
})();