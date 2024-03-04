const player1Score = document.querySelector(".score.player1");
const player2Score = document.querySelector(".score.player2");
const squares = document.querySelectorAll(".board>div");
const result = document.querySelector(".result");
const resetBtn = document.querySelector(".reset");
const newGameBtn = document.querySelector(".newGame");

class Player {
  constructor(name, symbol, isTurn, scoreBoard) {
    this.name = name;
    this.symbol = symbol;
    this.isTurn = isTurn;
    this.score = 0;
    this.scoreBoard = scoreBoard;
  }
}

const player1 = new Player("Player 1", "X", true, player1Score);
const player2 = new Player("Player 2", "O", false, player2Score);

class GameBoard {
  constructor(player1, player2, game) {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.player1 = player1;
    this.player2 = player2;
    this.game = game;
    this.matchPositionBound = this.matchPosition.bind(this);
    this.initBoard();
  }

  initBoard() {
    squares.forEach((square) => {
      square.addEventListener("click", this.matchPositionBound);
    });
  }

  findCurrentPlayer() {
    return this.player1.isTurn ? this.player1 : this.player2;
  }

  matchPosition(event) {
    const player = this.findCurrentPlayer();
    const opponent = player === this.player1 ? this.player2 : this.player1;

    const className = event.target.classList.value;
    const positionMatch = className.match(/row(\d)Col(\d)/);
    if (positionMatch) {
      const rowIndex = parseInt(positionMatch[1], 10) - 1;
      const colIndex = parseInt(positionMatch[2], 10) - 1;

      if (this.board[rowIndex][colIndex] === "") {
        this.board[rowIndex][colIndex] = player.symbol;
        event.target.textContent = player.symbol;
        player.isTurn = false;
        opponent.isTurn = true;
        this.checkWinner(player);
      }
    }
  }

  setCheckWinnerCallback(callback) {
    this.checkWinner = callback;
  }

  displayScore() {
    this.player1.scoreBoard.textContent = `Player 1: ${this.player1.score}`;
    this.player2.scoreBoard.textContent = `Player 2: ${this.player2.score}`;
  }

  clearBoard() {
    squares.forEach(function (square) {
      square.textContent = "";
    });
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[i][j] = "";
      }
    }
    player1.isTurn = true;
    player2.isTurn = false;
    result.textContent = "";
  }
}

class Game {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.initGame();
  }

  initGame() {
    resetBtn.addEventListener("click", () => this.gameBoard.clearBoard());
    newGameBtn.addEventListener("click", () => this.newGame());
  }

  newGame() {
    this.gameBoard.clearBoard().displayScore();
    player1.score = 0;
    player2.score = 0;
    this.gameBoard.displayScore();
  }

  checkForWinner(player) {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Check rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Check columns
      [0, 4, 8],
      [2, 4, 6], // Check diagonals
    ];
    const flatBoard = this.gameBoard.board.flat();

    const playerWon = winConditions.some((condition) => {
      return condition.every((index) => {
        const [row, col] = [Math.floor(index / 3), index % 3];
        return this.gameBoard.board[row][col] === player.symbol;
      });
    });

    if (playerWon) {
      result.textContent = `${player.name} is the winner`;
      player.score++;
      this.gameBoard.displayScore();
    } else if (flatBoard.every((cell) => cell !== "")) {
      result.textContent = "It's a tie";
    }
  }

  endRound() {
    squares.forEach((square) => {
      square.removeEventListener("click", this.gameBoard.matchPositionBound);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const player1Score = document.querySelector(".score.player1");
  const player2Score = document.querySelector(".score.player2");
  const squares = document.querySelectorAll(".board>div");
  const result = document.querySelector(".result");
  const resetBtn = document.querySelector(".reset");
  const newGameBtn = document.querySelector(".newGame");
  const player1 = new Player(
    "Player 1",
    "X",
    true,
    document.querySelector(".score.player1")
  );
  const player2 = new Player(
    "Player 2",
    "O",
    false,
    document.querySelector(".score.player2")
  );
  const gameBoard = new GameBoard(player1, player2);
  const game = new Game(gameBoard);

  gameBoard.setCheckWinnerCallback((player) => game.checkForWinner(player));

  squares.forEach(function (square) {
    square.addEventListener("click", gameBoard.matchPositionBound);
  });

  newGameBtn.addEventListener("click", () => game.newGame());
  resetBtn.addEventListener("click", () => gameBoard.clearBoard());
});
