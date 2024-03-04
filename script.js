const player1Score = document.querySelector(".score.player1");
const player2Score = document.querySelector(".score.player2");
const result = document.querySelector(".result");

class Player {
  constructor(name, symbol, isTurn, scoreBoard) {
    this.name = name;
    this.symbol = symbol;
    this.isTurn = isTurn;
    this.score = 0;
    this.scoreBoard = scoreBoard;
  }

  updateScore() {
    this.scoreBoard.textContent = `${this.name}: ${this.score}`;
  }

  reset() {
    this.score = 0;
    this.isTurn = this.scoreBoard === player1Score ? true : false;
    this.updateScore();
  }
}

class GameBoard {
  constructor(player1, player2) {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.player1 = player1;
    this.player2 = player2;
    this.matchPositionBound = this.matchPosition.bind(this);
    this.initBoard();
  }

  initBoard() {
    document.querySelectorAll(".board>div").forEach((square) => {
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
    this.player1.updateScore();
    this.player2.updateScore();
  }

  clearBoard() {
    document.querySelectorAll(".board>div").forEach(function (square) {
      square.textContent = "";
    });
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[i][j] = "";
      }
    }
    this.player1.isTurn = true;
    this.player2.isTurn = false;
    result.textContent = "";
  }
}

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameBoard = new GameBoard(this.player1, this.player2);
    this.gameBoard.setCheckWinnerCallback(this.checkForWinner.bind(this));
    this.resetBtn = document.querySelector(".reset");
    this.newGameBtn = document.querySelector(".newGame");
    this.initGame();
  }

  initGame() {
    this.resetBtn.addEventListener("click", () => this.gameBoard.clearBoard());
    this.newGameBtn.addEventListener("click", () => this.newGame());
    this.gameBoard.initBoard();
  }

  newGame() {
    this.gameBoard.clearBoard();
    this.gameBoard.player1.reset();
    this.gameBoard.player2.reset();
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
  const player1 = new Player("Player 1", "X", true, player1Score);
  const player2 = new Player("Player 2", "O", false, player2Score);
  new Game(player1, player2);
});
