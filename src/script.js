// TIC TAC TOE

// player factory function
const player = (name, mark, turn, score) => {
    
    const updateScore = () => {
        score++;
        console.log('score', score)
    }
    const greetName = () => console.log(`hello ${name} your mark is ${mark}`);
    return { name, mark, turn, score, updateScore, greetName }
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
        playerO.turn = false;
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
const scoreDivO = document.getElementById('score-player-o');
const scoreDivX = document.getElementById('score-player-x');











const gameController = (() => {
    console.log("startgame")

    // create players
    const playerO = player('john', 'o', false,0);
    const playerX = player('bob', 'x', false,0);
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
    scoreDivO.innerText = playerO.score;
    scoreDivX.innerText = playerX.score;
    const startGame = () => {
        gameBoard.cells.forEach(cell => {

            cell.classList.remove(playerX.mark);
            cell.classList.remove(playerO.mark);
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true })
        });
        setBoardHoverClass();
        statusElement.innerText = '';
    }
    function updateScoreDisplay(player,scoreDiv){
        player.score++;
        scoreDiv.innerText = player.score;
        console.log('scoreDiv', scoreDiv)
        console.log(`${player.mark} score:${player.score}`, player.score)
        
    }
    function handleClick(e) {
        console.log('clicked');
        const cell = e.target;
        const currentClass = playerO.turn ? playerO.mark : playerX.mark;
        placeMark(cell, currentClass);
        console.log('placeMark', placeMark)
        if (checkWin(currentClass)) {

            if (playerO.turn) {
                updateScoreDisplay(playerO,scoreDivO)
                
                console.log(`winner is ${playerO.name} with mark: ${playerO.mark}`)

            } else {
                updateScoreDisplay(playerX,scoreDivX)
                console.log(`winner is ${playerX.name} with mark: ${playerX.mark}`)
            }
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
        board.classList.remove(playerX.mark)
        board.classList.remove(playerO.mark)
        if (playerO.turn) {
            board.classList.add(playerO.mark)
        } else {
            board.classList.add(playerX.mark)
        }
    }
    // add the player selection as a class on the cell clicked
    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }
    // player change
    function swapTurns() {
        playerO.turn = !playerO.turn
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
            return cell.classList.contains(playerX.mark) || cell.classList.contains(playerO.mark)
        })
    }
    function endGame(draw) {
        let endgame = false;
        if (draw) {
            statusElement.innerText = `It's a draw`;
            endgame = true;
        } else {
            statusElement.innerText = `${playerO.turn ? "O" : "X"} wins!`
            endgame = true;
        }
        return false;
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

