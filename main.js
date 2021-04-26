/**
 * This javascript page uses jquery to load a 2048 gameboard into a web page
 */

 import Game from "./engine/game.js"

// Given a game object, this function renders a gameboard
let testGame = new Game(4);

export const renderGameBoard = function(game) {
    // Code to put all tiles into the grid
    return `<div class="top-container">
    <h1 style="font-size: 120px; text-align: center;">2048</h1>
    <h1 class="win">${game.isWon()}</h1>
    <h1 class="lose">${game.isOver()}</h1>
    <div style="width: 700px; margin: 0 auto;"class="grid-container">
        <div class="grid-item">${game.tileNumber(0, 0)}</div>
        <div class="grid-item">${game.tileNumber(0, 1)}</div>
        <div class="grid-item">${game.tileNumber(0, 2)}</div>
        <div class="grid-item">${game.tileNumber(0, 3)}</div>
        <div class="grid-item">${game.tileNumber(1, 0)}</div>
        <div class="grid-item">${game.tileNumber(1, 1)}</div>
        <div class="grid-item">${game.tileNumber(1, 2)}</div>
        <div class="grid-item">${game.tileNumber(1, 3)}</div>
        <div class="grid-item">${game.tileNumber(2, 0)}</div>
        <div class="grid-item">${game.tileNumber(2, 1)}</div>
        <div class="grid-item">${game.tileNumber(2, 2)}</div>
        <div class="grid-item">${game.tileNumber(2, 3)}</div>
        <div class="grid-item">${game.tileNumber(3, 0)}</div>
        <div class="grid-item">${game.tileNumber(3, 1)}</div>
        <div class="grid-item">${game.tileNumber(3, 2)}</div>
        <div class="grid-item">${game.tileNumber(3, 3)}</div>
    </div>
    <h2 style="font-size: 50px; text-align: center;">SCORE: ${game.score}</h2>
    <div style="margin: auto; text-align: center;">
        <button class="button reset-button" style="margin: auto;">Reset</button>
    </div>
    <h2 style="font-size: 20px; text-align: center;">HOW TO PLAY: Use your arrow keys to move the tiles.</h2>
    <h2 style="font-size: 20px; text-align: center;">Tiles with the same number merge into one when they touch. Add them up to reach 2048!</h2>
    </div>`
};

// Handles the javascript event for the user pressing an arrow key to move the board

export const handleArrowKey = function (event) {
    event.preventDefault(); // prevent the default action (scroll / move caret)
    switch(event.keyCode) {
        case 37: // left
        testGame.move("left");
        $(".top-container").replaceWith(renderGameBoard(testGame));
        break;

        case 38: // up
        testGame.move("up");
        $(".top-container").replaceWith(renderGameBoard(testGame));
        break;

        case 39: // right
        testGame.move("right");
        $(".top-container").replaceWith(renderGameBoard(testGame));
        break;

        case 40: // down
        testGame.move("down");
        $(".top-container").replaceWith(renderGameBoard(testGame));
        break;
    }
}


// Handles the javascript event for the user pressing the reset button

export const handleResetButtonPress = function (event) {
    testGame.setupNewGame();
    $(event.target.parentNode.parentNode).replaceWith(renderGameBoard(testGame));
}

// Load board into DOM with jquery

export const loadGameIntoDOM = function (game) {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');
    $root.append(renderGameBoard(game))

    document.addEventListener("keydown", handleArrowKey);
    $root.on("click", ".reset-button", handleResetButtonPress);

}

/**
 * Use jQuery to execute the loadGameIntoDOM function after the page loads
 */
 $(function() {
    loadGameIntoDOM(testGame);
});
