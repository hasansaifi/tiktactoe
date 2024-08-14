function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(cell())
        }
    }

    // This method wil be used to give status of cell for DOM manipulation
    const getBoard = () => board;

    // Here we will check which player selected which cell and if that cell is available 
    const markCell = (rowNo, columnNo, player) => {
        const selectedCell = board[rowNo][columnNo];

        console.log("Selected cell value: " + selectedCell.getValue() + ", Player: " + player);

        // If selected cell is not available it will stop the execution of the code 
        if (selectedCell.getValue() != 0) return;
        // Otherwise, I have a valid cell, the last one in the filtered array
        game.switchPlayerTurn();
        selectedCell.addMark(player);
    }

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.table(boardWithCellValues);
    };

    return { getBoard, markCell, printBoard };
}

/* The function to control status of each cell */
function cell() {
    let value = 0

    // Accept a player's token to change the value of the cell
    const addMark = (player) => {
        value = player;
    };

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;

    return {
        addMark,
        getValue
    };
}

/* The function to control the game */
function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = gameBoard();
    const players = [
        {
            name: playerOneName,
            marker: "X",
        },
        {
            name: playerTwoName,
            marker: "O",
        }
    ];

    let activePlayer = players[0];

    //Switch player after each cell mark
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    const playRound = (rowNo, columnNo) => {


        //Mark the cell
        console.log(
            `Marking ${getActivePlayer().name}'s marker into cell ${rowNo}, ${columnNo}...`
        )
        board.markCell(rowNo, columnNo, getActivePlayer().marker);
        /*  This is where we would check for a winner and handle that logic,
        such as a win message. */


        // Switch player turn
        printNewRound();
    };

    // Initial play game message
    printNewRound();

    return { playRound, switchPlayerTurn };
}


// Codes for testing
const game = gameController();
