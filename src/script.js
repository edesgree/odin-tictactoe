// TIC TAC TOE

// player factory function
const player = (name, mark, turn, score) => {
    const greetName = () => console.log(`hello ${name} your mark is ${mark}`);
    return { name, mark, turn, score, greetName }
}


const gameBoard = (() => {
    const X_CLASS = 'x';
    const O_CLASS = 'o';
    //gameboard module
    const movesHistory = ['', '', '', '', '', '', '', '', '',]
    const cells = [];

    const board = document.getElementById('board');

    const buildBoard = () => {
        for (i = 0; i < movesHistory.length; i++) {
            cells[i] = document.createElement('div');
            cells[i].classList.add('cell');
            cells[i].setAttribute('data-cell', i);
            board.appendChild(cells[i]);
        }
    }
    // const resetBoard = () => {
    //     console.log('resetBoard', resetBoard)
    //     player.turn = false;
    //     for (let i = 0; i < movesHistory.length; i++) {
    //         console.log('cells[i]', cells[i])
    //         cells[i].classList.remove('x', 'o');
    //     }
    // };
    return {
        cells,
        movesHistory,
        X_CLASS,
        O_CLASS,
        buildBoard
    }
})();


const gameController = (() => {
    const gameModes = ['vshuman', 'vsbot'];
    const gameModeActive = gameModes[1];
    console.log('gameModeActive', gameModeActive)
    
    
    // display elements
    const statusElement = document.getElementById('game-status');
    const restartButton = document.getElementById('restartButton');
    const scoreDivO = document.getElementById('score-player-o');
    const scoreDivX = document.getElementById('score-player-x');
    // create players
    const playerO = player('Croco', 'o', false, 0);
    const playerX = player('Hippo', 'x', true, 0);

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
    let gameState;
    console.log('gameState', gameState)
    scoreDivO.innerText = playerO.score;
    scoreDivX.innerText = playerX.score;
    const startGame = () => {

        gameState = true;
        console.log('gameState', gameState)
        gameBoard.cells.forEach(cell => {
            // remove css class and click event
            cell.classList.remove(playerX.mark);
            cell.classList.remove(playerO.mark);
            cell.removeEventListener('click', handleClick);
            // add click event
            cell.addEventListener('click', handleClick, { once: true })
        });

        setBoardHoverClass();
        statusElement.innerText = `It's  ${playerX.name}'s turn`;
    }
    function updateScoreDisplay(player, scoreDiv) {
        // increment score
        player.score++;
        // write score in score div
        scoreDiv.innerText = player.score;
    }
    function computerPlay() {
        console.log(`computer choose ${botChoice()} index`)
    }
    function botChoice() {
        // get empty cells
        let emptyCells = [];
        
        console.log('hey',gameBoard.movesHistory)
        console.log('gameBoard.movesHistory.length',gameBoard.movesHistory.length)
        for (let i = 0; i < gameBoard.movesHistory.length; i++) {
            
            if (gameBoard.movesHistory[i] == '') {
                emptyCells.push(i);
            }
        }
        console.log('emptyCells', emptyCells)
        // choose a random spot
        let choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        console.log('choice', choice)
        return choice;
        
    }
    // what to do when click on cell
    function handleClick(e) {
        console.log('clicked');
        const cell = e.target;
        const cellIndex = cell.dataset.cell;
        console.log('cellIndex', cellIndex)

        // change current class to the current players mark
        const currentClass = playerO.turn ? playerO.mark : playerX.mark;
        // keep a track of the plays in the gameBoard array
        gameBoard.movesHistory[cellIndex] = currentClass;
        
        placeMark(cell, currentClass);

        // call vsbot turn
        if (gameModeActive == gameModes[1]) {
        // computer turn                 A BOUGER
        computerPlay();
        }
        if (checkWin(currentClass)) {
            if (playerO.turn) {
                updateScoreDisplay(playerO, scoreDivO);
                console.log(`winner is ${playerO.name} with mark: ${playerO.mark}`);
            } else {
                updateScoreDisplay(playerX, scoreDivX);
                console.log(`winner is ${playerX.name} with mark: ${playerX.mark}`);
            }
            endGame(draw = false);
            gameState = false;
            console.log('gameState', gameState)

        } else if (isDraw()) {
            endGame(draw = true);
            gameState = false;
            console.log('gameState', gameState)
        } else {
            swapTurns();
            setBoardHoverClass();
        }

    }
    // display next player when hovering cell
    function setBoardHoverClass() {
        board.classList.remove(playerX.mark)
        board.classList.remove(playerO.mark)
        if (playerO.turn) {
            board.classList.add(playerO.mark)
        } else if (playerX.turn) {
            board.classList.add(playerX.mark)
        }
    }
    // add the player selection as a class on the cell clicked
    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }
    // player change
    function swapTurns() {
        playerO.turn = !playerO.turn;
        playerX.turn = !playerX.turn;

        // display players turn
        statusElement.innerText = playerO.turn ? `It's ${playerO.name}'s turn` : `It's ${playerX.name}'s turn`;
        console.log('playerO.turn', playerO.turn)
        console.log('playerX.turn', playerX.turn)
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
    function endGame(draw = true) {
        if (draw) {
            statusElement.innerText = ``;
            endGameDisplay("It's a draw");
        } else {
            endGameDisplay(`${playerO.turn ? playerO.name : playerX.name} wins!`);
        }
        gameState = false;

    }
    function endGameDisplay(string) {
        board.setAttribute('data-overlay-content', string);
        board.classList.add('overlay');
        statusElement.innerText = ``;
    }
    restartButton.addEventListener('click', () => {
        console.log("restart");
        board.classList.remove('overlay');
        startGame();
    })
    return { startGame }
})();


// build DOM gameboard
gameBoard.buildBoard();
// start game
gameController.startGame();