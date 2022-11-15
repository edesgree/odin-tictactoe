// TIC TAC TOE

// player factory function
const player = (user, mark, turn) => {
    let score = 0;
    const getScore = (score) => {
        player.score++;
    }
    const greetName = () => console.log(`hello ${user} your mark is ${mark}`);
    return { user, mark, turn, getScore, greetName }
}

const gameBoard = (() => {
    const X_CLASS = 'x';
    const O_CLASS = 'o';
    //gameboard module
    const gameboard = ['', '', '', '', '', '', '', '', '',]
    const cells = [];
    const board = document.getElementById('board');

    const buildBoard = () => {
        for (i = 0; i < gameboard.length; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-cell', '');
            board.appendChild(cell);
            cells.push(cell)
        }
    }
    const resetBoard = () => {
        console.log('resetBoard', resetBoard)
        OTurn = false;
        for (let i = 0; i < gameboard.length; i++) {


            console.log('cells[i]', cells[i])
            cells[i].classList.remove('x', 'o');
        }
    };
    return {
        cells,
        X_CLASS,
        O_CLASS,
        buildBoard,
        resetBoard
    }
})();


// display elements
const statusElement = document.getElementById('game-status');
const restartButton = document.getElementById('restartButton');












const gameController = (() => {
    console.log("startgame")
    const WINNING_COMBINATIONS = [
        // gameboard
        // 0 1 2
        // 3 4 5
        // 6 7 8
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let OTurn = false;
    const startGame = () => {
        gameBoard.cells.forEach(cell => {

            cell.classList.remove(gameBoard.X_CLASS);
            cell.classList.remove(gameBoard.O_CLASS);
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true })
        });
        setBoardHoverClass();
        statusElement.innerText = '';
    }
    function handleClick(e) {
        console.log('clicked');
        const cell = e.target;
        const currentClass = OTurn ? gameBoard.O_CLASS : gameBoard.X_CLASS;
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            console.log('winner')
            endGame(false)

        } else if (isDraw()) {
            endGame(true)
        } else {
            swapTurns();
            setBoardHoverClass();
        }
        //check win
        //check draw
        //switch turns

    }
    function setBoardHoverClass() {
        board.classList.remove(gameBoard.X_CLASS)
        board.classList.remove(gameBoard.O_CLASS)
        if (OTurn) {
            board.classList.add(gameBoard.O_CLASS)
        } else {
            board.classList.add(gameBoard.X_CLASS)
        }
    }
    // add the player selection as a class on the cell clicked
    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }
    // player change
    function swapTurns() {
        OTurn = !OTurn
    }

    // check if the cell contain the current class and if its correspond to a combination in the combination table
    function checkWin(currentClass) {
        // return true if one combination is matched
        return WINNING_COMBINATIONS.some(combination => {
            // return true if current combination is true in 3 indexes (3 cells)
            return combination.every(index => {
                // return true if cell contain the current class
                return gameBoard.cells[index].classList.contains(currentClass)
            })
        })
    }
    function isDraw() {
        // check if every cells is filled. if every cell return a class X or O, it means all cells are full
        return [...gameBoard.cells].every(cell => {
            return cell.classList.contains(gameBoard.X_CLASS) || cell.classList.contains(gameBoard.O_CLASS)
        })
    }
    function endGame(draw) {
        if (draw) {
            statusElement.innerText = `It's a draw`
        } else {
            statusElement.innerText = `${OTurn ? "O" : "X"} wins!`

        }
    }

    return { startGame }
})();





gameBoard.buildBoard();
gameController.startGame();
restartButton.addEventListener('click', () => {
    console.log("restart");
    gameController.startGame();
})

//startGame();

















//displayController module
var displayController = (function () {
    function _displayBoard() {
        console.log("_displayBoard");
    }
    function displayChoice() {
        console.log('displayChoice');
    }
    function displayWinner() {
        console.log('displayWinner')
    }
    return {
        displayChoice: displayChoice,
        displayWinner: displayWinner
    };
})();
displayController.displayChoice();


// create player
const edouard = player("Edouard", 'X', false);
edouard.greetName();

