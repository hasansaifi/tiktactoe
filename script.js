function gameBoard() {
    const rows = 3;
    const columns = 3;
    const cells = rows * columns;
    const board = [];
    let turnCount = rows * columns;

    const getTurnCount = () => turnCount;

    for (let i = 0; i < cells; i++) {
        board.push(cell())

        /* for (let j = 0; j < columns; j++) {
        } */
    }

    // This method wil be used to give status of cell for DOM manipulation
    const getBoard = () => board;

    // Here we will check which player selected which cell and if that cell is available 
    const markCell = (rowNo, player) => {
        const selectedCell = board[rowNo];
        console.log("Selected cell value: " + selectedCell.getValue() + ", Player: " + player);
        // If selected cell is not available it will stop the execution of the code 
        if (selectedCell.getValue() != 0) return 0;
        turnCount--;
        // Otherwise, I have a valid cell, the last one in the filtered array
        selectedCell.addMark(player);
    }

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const getBoardValues = () => {
        const boardWithCellValues = board.map((cell) => cell.getValue());
        return boardWithCellValues
    };

    const printBoard = () => {

        console.table(getBoardValues());

    };

    return { getBoard, markCell, printBoard, getBoardValues, getTurnCount };
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


function checkWin(board) {
    const boardArr = board.getBoardValues();
    const rows = Math.sqrt(boardArr.length);
    const turnCount = board.getTurnCount();
    let loopCount = 0;
    let result = "Ongoing"; //Ongoing:Game still going on, Draw: Draw, X: player one wins, O: player two wins,

    const arrCellsToStr = (arr) => arr.reduce((accumulator, currentValue) => accumulator + currentValue, "",);

    for (let i = 0; i < rows; i++) {
        let arrRows = [];
        let arrColumns = [];
        let arrRDiag = [];
        let arrLDiag = [];

        //Checks rows
        for (let j = 0; j < rows; j++) {
            arrRows.push(boardArr[loopCount]);
            loopCount++;
        }
        const rowStr = arrCellsToStr(arrRows);

        //Checks columns
        for (let k = 0; k <= (rows * (rows - 1)) + i; k += rows) {
            arrColumns.push(boardArr[i + k]);
        }
        const columnStr = arrCellsToStr(arrColumns);

        // Check diagonal
        let rDiagCell = 0;
        let lDiagCell = 0;
        for (let l = 0; l < rows && i <= 0; l++) {
            //Check right(/) diagonal
            rDiagCell += rows - 1
            arrRDiag.push(boardArr[rDiagCell]);

            //Check left(\) diagonal    
            arrLDiag.push(boardArr[lDiagCell]);
            lDiagCell += rows + 1
        }
        const rDiagStr = arrCellsToStr(arrRDiag);
        const lDiagStr = arrCellsToStr(arrLDiag);

        //Check who wins 
        if (rowStr === "XXX" || columnStr === "XXX" || rDiagStr === "XXX" || lDiagStr === "XXX") {
            result = "xWin";
            break;
        } else if (rowStr === "OOO" || columnStr === "OOO" || rDiagStr === "OOO" || lDiagStr === "OOO") {
            result = "oWin";
            break;
        } else if (turnCount === 0) {
            result = "Draw";
        }

        arrRows = [];
        arrColumns = [];
        arrRDiag = [];
        arrLDiag = [];
    }
    const getResult = () => result;
    return { getResult };
}

/* The function to control the game */
function gameController(playerOneName = "X", playerTwoName = "O") {
    const board = gameBoard();
    let status = "Ongoing";
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

    const playRound = (rowNo) => {
        //Mark the cell
        console.log(
            `Marking ${getActivePlayer().name}'s marker into cell ${rowNo}...`
        )
        const markCell = board.markCell(rowNo, getActivePlayer().marker);
        if (markCell != 0) { switchPlayerTurn(); }
        /*  This is where we would check for a winner and handle that logic,
        such as a win message. */
        checkWin(board);
        status = checkWin(board).getResult();
        // console.table(board.getBoardValues());
        // Switch player turn
        printNewRound();
    };

    const getStatus = () => status;

    // Initial play game message
    printNewRound();

    return { playRound, switchPlayerTurn, getActivePlayer, getStatus, getBoard: board.getBoard };
}

function screenController() {
    const game = gameController();
    const gridDiv = document.querySelector(".gridDiv");
    const turnText = document.querySelector(".turnText");

    const updateScreen = () => {
        // clear the board
        gridDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        if (game.getStatus() === "Ongoing") {
            turnText.textContent = `${activePlayer.name}'s turn...`
            renderCells();
        } else if (game.getStatus() === "xWin") {
            turnText.textContent = `X win`
            renderCells();
        } else if (game.getStatus() === "oWin") {
            turnText.textContent = `O win`
            renderCells();
        }

        // Display player's turn

        function renderCells() {
            // Render board squares
            board.forEach((cell, index) => {

                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("cellButton");
                // Create a data attribute to identify the column
                // This makes it easier to pass into our `playRound` function 
                cellButton.dataset.column = index
                if (cell.getValue() != 0) {
                    cellButton.textContent = cell.getValue();
                }

                if (game.getStatus() != "Ongoing") {
                    cellButton.disabled = true;
                }
                gridDiv.appendChild(cellButton);

            })
        }

    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn) return;
        console.log(game.getStatus());


        game.playRound(selectedColumn);
        updateScreen();
    }


    gridDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.

}

screenController()
