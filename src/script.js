// TIC TAC TOE

// player factory function
const player = (name, mark, turn, score) => {
    return { name, mark, turn, score }
}

// gameBoard module
const gameBoard = (() => {
    const X_CLASS = 'x';
    const O_CLASS = 'o';
    const movesHistory = ['', '', '', '', '', '', '', '', '',]
    const cells = [];
    const board = document.getElementById('board');

    // create 9 divs for the board
    const buildBoard = () => {
        for (i = 0; i < movesHistory.length; i++) {
            cells[i] = document.createElement('div');
            cells[i].classList.add('cell');
            cells[i].setAttribute('data-cell', i);
            board.appendChild(cells[i]);
        }
    }

    return {
        cells,
        movesHistory,
        X_CLASS,
        O_CLASS,
        buildBoard
    }
})();

// gameController module
const gameController = (() => {
    // init game mode default to vs human
    let vsbot = false;

    // display elements
    const statusElement = document.getElementById('game-status');
    const restartButton = document.getElementById('restartButton');
    const scoreDivO = document.getElementById('score-player-o');
    const scoreDivX = document.getElementById('score-player-x');
    const opponentChoice = document.getElementById('vsbot');

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
    
    // display score for both players
    scoreDivO.innerText = playerO.score;
    scoreDivX.innerText = playerX.score;
    
    // start a game
    const startGame = (vsbot) => {
        // reset board
        resetTurn();
       
        // for each cell, listen for click
        gameBoard.cells.forEach(cell => {
            // remove css class and click event
            cell.classList.remove(playerX.mark);
            cell.classList.remove(playerO.mark);
            cell.removeAttribute("data-taken");
            cell.removeEventListener('click', handleClick);
            // add click event (once:true so you can only choose this cell once in the game)
            cell.addEventListener('click', handleClick, { once: true })
        });

        setBoardHoverClass(); // tells you who plays next when hovering a cell
        statusElement.innerText = `It's  ${playerX.name}'s turn`; // info on to whose turn is it
    }
    function updateScoreDisplay(player, scoreDiv) {
        // increment score
        player.score++;
        // Update score in DOM
        scoreDiv.innerText = player.score;
    }

    // return a choice of cell for the bot
    function botChoice() {
        // get empty cells
        let emptyCells = [];
        // get an array of what cells are still available to play (based on the moves history array)
        for (let i = 0; i < gameBoard.movesHistory.length; i++) {
            if (gameBoard.movesHistory[i] == '') {
                emptyCells.push(i);
            }
        }
        
        // choose a random spot in this array of possible moves
        let choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        return choice;
    }

    // what to do when click on cell
    function handleClick(e) {
        const cell = e.target;
        const cellIndex = cell.dataset.cell;
        const cellAvailability = cell.dataset.taken;

        // change current class to the current players mark
        const currentClass = playerO.turn ? playerO.mark : playerX.mark;

        // keep a track of the plays in the moves history array
        gameBoard.movesHistory[cellIndex] = currentClass;
        
        if (vsbot) {
            // TODO: in vsbot mode, block the user click
            e.preventDefault();
        }

        // if cell has not been taken by computer (or other player), we can place mark
        if (!cellAvailability) {
            playTurn(cell, currentClass);
        } else {
            //cell already taken
            e.preventDefault();
        }

        // call vsbot turn, computer is playerO by default
        if (vsbot && playerO.turn) {
            toggleWaitAnimation(); // wait animation on cursor

            // assign a random choice for the computer
            let botMove = botChoice();
            let computerCell = gameBoard.cells[botMove];

            // add computer move in the moves history array
            gameBoard.movesHistory[botMove] = playerO.mark;
            // create a wait time for more realism
            setTimeout(() => {
                playTurn(computerCell, playerO.mark);
                toggleWaitAnimation();
            }, 1500);
        }
    }
    function playTurn(cellChoice, playerMark) {
        placeMark(cellChoice, playerMark);
        endTurn(playerMark);
    }
    function endTurn(playerMark) {
        if (checkWin(playerMark)) {
            if (playerO.turn) { // winner is playerO
                updateScoreDisplay(playerO, scoreDivO);
            } else { // winner is playerX
                updateScoreDisplay(playerX, scoreDivX);
            }
            endGame(draw = false);
        } else if (isDraw()) {
            endGame(draw = true);
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    }
    function resetTurn() {
        playerO.turn = false;
        playerX.turn = true;
        setBoardHoverClass();
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
    // add the player selection on the gameboard (as a class on the cell clicked)
    function placeMark(cellChoice, playerMark) {
        if (cellChoice.dataset.taken) {
            console.log("cell already taken !!!")
        }
        cellChoice.classList.add(playerMark);
        cellChoice.setAttribute('data-taken', true);
    }
    // player change
    function swapTurns() {
        playerO.turn = !playerO.turn;
        playerX.turn = !playerX.turn;

        // display players turn
        statusElement.innerText = playerO.turn ? `It's ${playerO.name}'s turn` : `It's ${playerX.name}'s turn`;
        // update current class
        currentClass = playerO.turn ? playerO.mark : playerX.mark;
    }

    // check if the cell contain the current class and if its correspond to a match in the combination table
    function checkWin(playerMark) {
        // return true if one combination is matched
        return WINNING_COMBINATIONS.some(combination => {
            // return true if current class is true in 3 indexes (3 cells)
            return combination.every(index => {
                // return true if cell contain the current class
                return gameBoard.cells[index].classList.contains(playerMark)
            })
        })
    }
    // check if game is a draw
    function isDraw() {
        // check if every cells is filled. if every cell return a class X or O, it means all cells are full
        return [...gameBoard.cells].every(cell => {
            return cell.classList.contains(playerX.mark) || cell.classList.contains(playerO.mark)
        })
    }
    function endGame(draw = true) {
        // display winner or draw  message 
        if (draw) {
            endGameDisplay("It's a draw");
        } else {
            endGameDisplay(`${playerO.turn ? playerO.name : playerX.name} wins!`);
        }
        //empty moves history
        gameBoard.movesHistory.fill("");
    }
    // display end of game message
    function endGameDisplay(string) {
        board.setAttribute('data-overlay-content', string);
        board.classList.add('overlay');
        statusElement.innerText = ``;
    }

    restartButton.addEventListener('click', () => {
        board.classList.remove('overlay');
        //restart game with the game mode value in parameter (vsbot or vshuman)
        startGame(vsbot = ('true' === opponentChoice.value));
    })

    // waiting animation when computer is playing
    function toggleWaitAnimation() {
        board.classList.toggle('wait');
    }
    return { startGame }
})();


// build DOM gameboard
gameBoard.buildBoard();
// start game
gameController.startGame();