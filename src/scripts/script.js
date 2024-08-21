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
    return { playGame };
})();