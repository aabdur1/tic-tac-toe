const squares = document.querySelectorAll(".board>div");
const resetBtn = document.querySelector(".reset");

squares.forEach(function (square) {
  square.addEventListener("click", move);
});

resetBtn.addEventListener("click", clearBoard);

class Player {
  constructor(symbol) {
    this.symbol = symbol;
    this.isTurn = true;
  }
}

const player1 = new Player("X");
const player2 = new Player("O");

function move() {
  let player;
  let opponent;
  if (player1.isTurn) {
    player = player1;
    opponent = player2;
  } else {
    player = player2;
    opponent = player1;
  }
  this.textContent === ""
    ? (this.textContent = player.symbol)
    : this.textContent;
  boardObject[this.classList.value] = player.symbol;
  checkForWinner(player);
  player.isTurn = false;
  opponent.isTurn = true;
}

function checkForWinner(player) {
  if (
    boardObject["row1Col1"] === boardObject["row1Col2"] &&
    boardObject["row1Col1"] === boardObject["row1Col3"]
  ) {
    console.log(`${player.symbol} is the winner`);
    resetBoardObject();
  }
}

function resetBoardObject() {
  for (let key in boardObject) {
    boardObject[key] = "";
  }
}

function clearBoard() {
  squares.forEach(function (square) {
    square.textContent = "";
  });
}

const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const boardObject = {};

board.forEach((row, rowIndex) => {
  row.forEach((cell, colIndex) => {
    const key = `row${rowIndex + 1}Col${colIndex + 1}`;
    boardObject[key] = cell;
  });
});

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    board[i][j] = `${i} ${j}`;
  }
}
