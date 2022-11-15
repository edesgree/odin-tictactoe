// app
const app = () => {
    const cells = document.querySelectorAll('[data-cell]');
    const board = document.getElementById('board');
    const statusElement = document.getElementById('game-status');
    const restartButton = document.getElementById('restartButton');

    
    const X_CLASS = 'x';
    const O_CLASS = 'o';
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let OTurn;

    startGame();
    //player factory function
    const Player = (name, marker) => {
        const greetName = () => console.log(`hello ${name}`);
        return { greetName, name, marker }
    }
    //gameboard module
    const gameboard = ['', '', '', '', '', '', '', '', '',]




    function startGame() {
        console.log("startgame")
        OTurn = false;
        cells.forEach(cell => {
            cell.classList.remove(X_CLASS);
            cell.classList.remove(O_CLASS);
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true })
        });
        setBoardHoverClass();
        statusElement.innerText = '';
    }
    function handleClick(e) {
        console.log('clicked');
        const cell = e.target;
        const currentClass = OTurn ? O_CLASS : X_CLASS;
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
    // add the player selection as a class on the cell clicked
    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }
    // player change
    function swapTurns() {
        OTurn = !OTurn
    }
    function setBoardHoverClass() {
        board.classList.remove(X_CLASS)
        board.classList.remove(O_CLASS)
        if (OTurn) {
            board.classList.add(O_CLASS)
        } else {
            board.classList.add(X_CLASS)
        }
    }
    // check if the cell contain the current class and if its correspond to a combination in the combination table
    function checkWin(currentClass) {
        // return true if one combination is matched
        return WINNING_COMBINATIONS.some(combination => {
            // return true if current combination is true in 3 indexes (3 cells)
            return combination.every(index => {
                // return true if cell contain the current class
                return cells[index].classList.contains(currentClass)
            })
        })
    }
    function isDraw() {
        // check if every cells is filled. if every cell return a class X or O, it means all cells are full
        return [...cells].every(cell => {
            return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
        })
    }
    function endGame(draw) {
        if (draw) {
            statusElement.innerText = `Its a draw`
        } else {
            statusElement.innerText = `${OTurn ? "O" : "X"} wins!`
        }
    }


    restartButton.addEventListener('click', ()=>{
        console.log("restart");
        startGame();
    })





















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
    const edouard = Player("Edouard");
    edouard.greetName();
}

//play app
app();