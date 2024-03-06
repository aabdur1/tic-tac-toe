const player1Score = document.querySelector(".score.player1");
const player2Score = document.querySelector(".score.player2");
const result = document.querySelector(".result");

class Player {
  constructor(name, symbol, isTurn, scoreBoard, isComputer = false) {
    this.name = name;
    this.symbol = symbol;
    this.isTurn = isTurn;
    this.score = 0;
    this.scoreBoard = scoreBoard;
    this.isComputer = isComputer;
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
  constructor(player1, player2, gameInstance) {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.player1 = player1;
    this.player2 = player2;
    this.game = gameInstance;
    this.initBoard();
  }

  initBoard() {
    document.querySelectorAll(".board>div").forEach((square) => {
      square.addEventListener("click", (event) => this.matchPosition(event));
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
        this.game.checkForWinner(player);
      }
    }
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
    this.gameBoard = new GameBoard(this.player1, this.player2, this);
    this.resetBtn = document.querySelector(".reset");
    this.newGameBtn = document.querySelector(".newGame");
    this.initGame();
  }

  initGame() {
    this.resetBtn.addEventListener("click", () => {
      this.gameBoard.clearBoard();
      this.gameBoard.initBoard();
    });
    this.newGameBtn.addEventListener("click", () => this.newGame());
    this.gameBoard.initBoard();
  }

  newGame() {
    this.gameBoard.clearBoard();
    this.gameBoard.player1.reset();
    this.gameBoard.player2.reset();
    this.gameBoard.displayScore();
    this.gameBoard.initBoard();
  }

  determineOutcome(player) {
    const winConditions = [
      // Check rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Check columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Check diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition.map((index) => {
        return { row: Math.floor(index / 3), col: index % 3 };
      });

      if (
        this.gameBoard.board[a.row][a.col] === player.symbol &&
        this.gameBoard.board[b.row][b.col] === player.symbol &&
        this.gameBoard.board[c.row][c.col] === player.symbol
      ) {
        return player.symbol;
      }
    }

    if (this.gameBoard.board.flat().every((cell) => cell !== "")) {
      return "tie";
    }

    return null;
  }

  checkForWinner(player) {
    const outcome = this.determineOutcome(player);

    if (this.player2.isComputer) {
      if (outcome === player.symbol) {
        return player === this.player2 ? 1 : -1;
      } else if (outcome === "tie") {
        return 0;
      }
    }

    if (outcome === player.symbol) {
      result.textContent = `${player.name} is the winner`;
      player.score++;
      this.gameBoard.displayScore();
      this.endRound();
    } else if (outcome === "tie") {
      result.textContent = "It's a tie";
      this.endRound();
    }
  }

  // minimax(board, depth, isMaximizing) {
  //   let score = {
  //     X: -1,
  //     O: 1,
  //     tie: 0,
  //   };
  //   let result = this.checkForWinner(this.player2);
  // }

  endRound() {
    document.querySelectorAll(".board>div").forEach((square) => {
      square.removeEventListener("click", (event) =>
        this.gameBoard.matchPosition(event)
      );
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const player1 = new Player("Player 1", "X", true, player1Score);
  const player2 = new Player("Player 2", "O", false, player2Score);
  new Game(player1, player2);
});
