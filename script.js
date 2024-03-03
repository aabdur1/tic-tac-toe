const squares = document.querySelectorAll(".board>div");

squares.forEach(function (square) {
  square.addEventListener("click", move);
});

class Player {
  constructor(symbol) {
    this.symbol = symbol;
    this.isTurn = true;
  }
}

const player1 = new Player("X");

function move() {
  this.textContent = "X";
  boardObject[this.classList.value] = player1.symbol;
  console.log(boardObject);
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
