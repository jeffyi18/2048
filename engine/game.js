/*
Add your code for Game here
 */

export default class Game{

    // constructor
    constructor(width) {
        this.moveObservers = [];
        this.winObservers = [];
        this.loseObservers = [];
        this.width = width;
        this.score = 0;
        this.won = false;
        this.over = false;
        this.board = new Array(width);
        for (let i = 0; i < this.width; i++) {
            this.board[i] = new Array(width);
            for (let j = 0; j < this.width; j++) {
                this.board[i][j] = 0;
            }
        }

        this.addNewTile();
        this.addNewTile();

    }

    // Methods
    isWon() {
        if (this.won == true) {
            return "YOU WON"
        } 
        return "";
    }

    isOver() {
        if (this.over == true) {
            return "YOU LOST"
        }
        return "";
    }

    addNewTile() {
        // Run through board to check which tiles have 0s
        let zeroIndexes = [];
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.board[i][j] == 0) {
                    zeroIndexes.push([i, j]);
                }
            }
        }
        // Now zeroIndexes is full of arrays that hold indexes of tiles with 0 in them

        if (zeroIndexes.length == 0) {
            return;
        }
        
        
        // Pick a random cell to place either a 2 or 4 
        let randomIndex = Math.floor(Math.random() * zeroIndexes.length);

        let selectedTile = zeroIndexes[randomIndex];
        
        // Get random number between 0 and 1 to make sure that 4 appears 10% of time and 2 the rest
        let random = Math.random();

        // Add either a new 2 or 4 tile to the that cell
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.width; j++) {
                if (i == selectedTile[0] && j == selectedTile[1]) {
                    if (random < 0.1) {
                        this.board[i][j] = 4;
                    } else {
                        this.board[i][j] = 2;
                    }
                }
            }
        }

    }

    tileNumber(i, j) {
        if (this.board[i][j] == 0) {
            return "";
        }
        return this.board[i][j];
    }

    setupNewGame() {
        // Resets the game back to a random starting position.

        // Resets the board back to blank slate
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.width; j++) {
                this.board[i][j] = 0;
            }
        }
        this.score = 0;
        this.won = false;
        this.over = false;
        this.addNewTile();
        this.addNewTile();
    }

    loadGame(gameState) {
        // Given a gameState object, it loads that board, score, etc...
        let boardWidth = Math.sqrt(gameState.board.length);

        let realBoard = new Array(boardWidth);

        for (let i = 0; i < boardWidth; i++) {
            realBoard[i] = new Array(boardWidth)
            for (let j = 0; j < boardWidth; j++) {
                realBoard[i][j] = gameState.board.shift();
            }
        }
        this.width = boardWidth;
        this.board = realBoard;
        this.score = gameState.score;
        this.won = gameState.won;
        this.over = gameState.over;
       
    }

    slide(array) {

        // Remove all zeroes and bring to back of array
        let noZeroes = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i] != 0) {
                noZeroes.push(array[i]);
            }
        }
        let x = array.length - noZeroes.length;
        for (let i = 0; i < x; i++) {
            noZeroes.push(0);
        }

        // rename variable to prevent confusion
        let newArr = noZeroes;

        // Now combine all numbers equal to each other into number * 2
        let previousNum = 10;
        for (let i = 0; i < newArr.length; i++) {
            if (newArr[i] == previousNum) {
                // We have to combine tiles here
                newArr[i-1] = newArr[i] * 2;
                newArr[i] = 0;
                // change score
                this.score += newArr[i-1];
                // check if game is won
                if (newArr[i-1] == 2048) {
                    this.won = true;
                    this.winObservers.forEach(element => {
                        element(this.getGameState());
                    });
                }
            } 
            previousNum = newArr[i];
        }

        // Run the new array through the first loop to move all zeroes to the back

        let noZeroes2 = [];
        for (let i = 0; i < newArr.length; i++) {
            if (newArr[i] != 0) {
                noZeroes2.push(newArr[i]);
            }
        }
        let y = newArr.length - noZeroes2.length;
        for (let i = 0; i < y; i++) {
            noZeroes2.push(0);
        }
        return noZeroes2;
        
    }


    checkGameOver() {
        // Check if board is game over state by running through the board and seeing if every tile is non-zero 
        // and is not touching any equivalent numbers
        let result = true;
        // checking each row
        for (let i = 0; i < this.width; i++) {
            let previousNum = 3;
            for (let j = 0; j < this.width; j++) {
                if (this.board[i][j] == 0) {
                    result = false;
                }
                if (this.board[i][j] == previousNum) {
                    result = false;
                }
                previousNum = this.board[i][j];
            }
        }
        // checking each column
        for (let i = 0; i < this.width; i++) {
            let previousNum = 3;
            for (let j = 0; j < this.width; j++) {
                if (this.board[j][i] == 0) {
                    result = false;
                }
                if (this.board[j][i] == previousNum) {
                    result = false;
                }
                previousNum = this.board[j][i];

            }
        }

        return result;
    }

    move(direction) {
        // Given "up", "down", "left", or "right" as string input, it makes the appropriate shifts and adds a random tile.
        if (direction == "up") {
            // make copy of board before move to determine later if tiles actually changed
            let copy = [];
            for (let i = 0; i < this.width; i++) {
                copy[i] = new Array(this.width);
                for (let j = 0; j < this.width; j++) {
                    copy[i][j] = this.board[i][j];
                }
            }
        
            // shift all tiles up and combine any tiles that have the same value into a new tile with their combined value
            // if a column is full of tiles with different values, nothing happens in that column

            // First loop is for iterating through entire board (width) times to create each column array
            for (let i = 0; i < this.width; i++) {
                let currColumn = [];
                for (let j = 0; j < this.width; j++) {
                    currColumn.push(this.board[j][i]);
                } 
                
                currColumn = this.slide(currColumn);
                for (let j = 0; j < this.width; j++) {
                    this.board[j][i] = currColumn[j];
                } 
            }
            // before adding a newTile and adding a new move to the moveObservers, check that the board changed
            let change = false;
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.width; j++) {
                    if (copy[i][j] != this.board[i][j]) {
                        change = true;
                    }
                }
            }
            if (change) {
                this.addNewTile();
                this.moveObservers.forEach(element => {
                    element(this.getGameState());
                }); 
            }

        } else if (direction == "down") {
            // shift all tiles down and combine any tiles that have the same value into a new tile with their combined value
            // if a column is full of tiles with different values, nothing happens in that column
            // First loop is for iterating through entire board (width) times to create each column array

            // make copy of board before move to determine later if tiles actually changed
            let copy = [];
            for (let i = 0; i < this.width; i++) {
                copy[i] = new Array(this.width);
                for (let j = 0; j < this.width; j++) {
                    copy[i][j] = this.board[i][j];
                }
            }

            for (let i = 0; i < this.width; i++) {
                let currColumn = [];
                for (let j = 0; j < this.width; j++) {
                    currColumn.push(this.board[j][i]);
                } 
                currColumn = this.slide(currColumn.reverse());
                let downColumn = currColumn.reverse();
                for (let j = 0; j < this.width; j++) {
                    this.board[j][i] = downColumn[j];
                } 
            }
            // before adding a newTile and adding a new move to the moveObservers, check that the board changed
            let change = false;
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.width; j++) {
                    if (copy[i][j] != this.board[i][j]) {
                        change = true;
                    }
                }
            }
            if (change) {
                this.addNewTile();
                this.moveObservers.forEach(element => {
                    element(this.getGameState());
                }); 
            }

        } else if (direction == "left") {
            // shift all tiles left and combine any tiles that have the same value into a new tile with their combined value
            // if a row is full of tiles with different values, nothing happens in that row

            // make copy of board before move to determine later if tiles actually changed
            let copy = [];
            for (let i = 0; i < this.width; i++) {
                copy[i] = new Array(this.width);
                for (let j = 0; j < this.width; j++) {
                    copy[i][j] = this.board[i][j];
                }
            }

            for (let i = 0; i < this.width; i++) {
                let currRow = [];
                for (let j = 0; j < this.width; j++) {
                    currRow.push(this.board[i][j]);
                } 
                // slide row to left
                currRow = this.slide(currRow);

                // Refilling original board with new rows
                for (let j = 0; j < this.width; j++) {
                    this.board[i][j] = currRow[j];
                } 
            }
            // before adding a newTile and adding a new move to the moveObservers, check that the board changed
            let change = false;
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.width; j++) {
                    if (copy[i][j] != this.board[i][j]) {
                        change = true;
                    }
                }
            }
            if (change) {
                this.addNewTile();
                this.moveObservers.forEach(element => {
                    element(this.getGameState());
                }); 
            }

        } else if (direction == "right") {
            // shift all tiles right and combine any tiles that have the same value into a new tile with their combined value
            // if a row is full of tiles with different values, nothing happens in that row

            // make copy of board before move to determine later if tiles actually changed
            let copy = [];
            for (let i = 0; i < this.width; i++) {
                copy[i] = new Array(this.width);
                for (let j = 0; j < this.width; j++) {
                    copy[i][j] = this.board[i][j];
                }
            }

            for (let i = 0; i < this.width; i++) {
                let currRow = [];
                for (let j = 0; j < this.width; j++) {
                    currRow.push(this.board[i][j]);
                } 

                // slide row to left
                currRow = this.slide(currRow.reverse());
                let newRow = currRow.reverse();
                // Refilling original board with new rows
                for (let j = 0; j < this.width; j++) {
                    this.board[i][j] = newRow[j];
                } 
            }
            // before adding a newTile and adding a new move to the moveObservers, check that the board changed
            let change = false;
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.width; j++) {
                    if (copy[i][j] != this.board[i][j]) {
                        change = true;
                    }
                }
            }
            if (change) {
                this.addNewTile();
                this.moveObservers.forEach(element => {
                    element(this.getGameState());
                }); 
            }
        }
        if (this.checkGameOver()) {
            this.over = true;
            this.loseObservers.forEach(element => {
                element(this.getGameState());
            });
        }
    }

    toString() {
        // Returns a string representation of the game as text/ascii. See the gameState section above for an example. 
        // This will not be graded, but it useful for your testing purposes when you run the game in the console. 
        // The run_in_console.js script uses the toString() method to print the state of the game to the console after every move.
        let result = "";
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.width; j++) {
                result += "[ " + this.board[i][j] + " ]";
            }
            result += '\n';
        }
        return result;
    }

    

    onMove(callback) {
        // Takes a callback function as input and registers that function as a listener to the move event. Every time a move is made, 
        // the game should call all previously registered move callbacks, 
        // passing in the game's current gameState as an argument to the function.
        this.moveObservers.push(callback);

    }

    onWin(callback) {
        // Takes a callback function as input and registers that function as a listener to the win event. 
        // When the player wins the game (by making a 2048 tile), the game should call all previously 
        // registered win callbacks, passing in the game's current gameState as an argument to the function.
        this.winObservers.push(callback);
    }

    onLose(callback) {
        // Takes a callback function as input and registers that function as a listener to the lose event. 
        // When the game transitions into a state where no more valid moves can be made, 
        // the game should call all previously registered lose callbacks, 
        // passing in the game's current gameState as an argument to the function.
        this.loseObservers.push(callback);
    }

    getFlatBoard() {
        let flatBoard = [];

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.width; j++) {
                flatBoard.push(this.board[i][j]);
            }
        }

        return flatBoard;
    }

    getGameState() {
        // Returns a accurate gameState object representing the current game state.
        let gameState = {
            board: this.getFlatBoard(),
            score: this.score,
            won: this.won,
            over: this.over
        }

        return gameState;
    }

} 

