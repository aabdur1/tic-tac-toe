const squares = document.querySelectorAll(".board>div");
const result = document.querySelector(".result");
const resetBtn = document.querySelector(".reset");

squares.forEach(function (square) {
  square.addEventListener("click", move);
});

resetBtn.addEventListener("click", clearBoard);

const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

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

  const className = this.classList.value;
  const positionMatch = className.match(/row(\d)Col(\d)/);
  if (positionMatch) {
    const rowIndex = parseInt(positionMatch[1], 10) - 1;
    const colIndex = parseInt(positionMatch[2], 10) - 1;
    if (board[rowIndex][colIndex] === "") {
      board[rowIndex][colIndex] = player.symbol;
      this.textContent = player.symbol;
      player.isTurn = false;
      opponent.isTurn = true;
      checkForWinner(player);
    }
  }
}

function checkForWinner(player) {
  for (let i = 0; i < 3; i++) {
    if (board.every((row) => !row.includes(""))) {
      result.textContent = "It's a tie";
    }
    if (
      board[i].every((cell) => cell === player.symbol) || // Check rows
      board.every((row) => row[i] === player.symbol) // Check columns
    ) {
      result.textContent = `${player.symbol} is the winner`;
    }
    if (
      [...Array(3).keys()].every(
        (index) => board[index][index] === player.symbol // Left to right diagonal
      ) ||
      [...Array(3).keys()].every(
        (index) => board[index][2 - index] === player.symbol // Right to left diagonal
      )
    ) {
      result.textContent = `${player.symbol} is the winner`;
    }
  }
}

function clearBoard() {
  squares.forEach(function (square) {
    square.textContent = "";
  });
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[i][j] = "";
    }
  }
  player1.isTurn = true;
  player2.isTurn = false;
  result.textContent = "";
}
