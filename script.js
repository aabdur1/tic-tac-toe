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
    this.handleClick = this.matchPosition.bind(this);
    this.initBoard();
  }

  initBoard() {
    document.querySelectorAll(".board>div").forEach((square) => {
      square.addEventListener("click", this.handleClick);
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
        this.game.checkForWinner();
        if (this.player2.isComputer && this.player2.isTurn) {
          this.game.bestMove();
        }
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

  clearListeners() {
    document.querySelectorAll(".board>div").forEach((square) => {
      square.removeEventListener("click", this.handleClick);
    });
  }
}

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameBoard = new GameBoard(this.player1, this.player2, this);
    this.resetBtn = document.querySelector(".reset");
    this.newGameBtn = document.querySelector(".newGame");
    this.aiBtn = document.querySelector(".ai");
    this.initGame();
  }

  initGame() {
    this.resetBtn.addEventListener("click", () => {
      this.gameBoard.clearBoard();
      this.gameBoard.initBoard();
    });
    this.newGameBtn.addEventListener("click", () => this.newGame());
    this.aiBtn.addEventListener(
      "click",
      () => (this.player2.isComputer = true)
    );
    this.gameBoard.initBoard();
  }

  newGame() {
    this.gameBoard.clearBoard();
    this.player1.reset();
    this.player2.reset();
    this.gameBoard.displayScore();
    this.gameBoard.initBoard();
  }

  determineOutcome() {
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
        this.gameBoard.board[a.row][a.col] === "X" &&
        this.gameBoard.board[b.row][b.col] === "X" &&
        this.gameBoard.board[c.row][c.col] === "X"
      ) {
        return this.player1.symbol;
      } else if (
        this.gameBoard.board[a.row][a.col] === "O" &&
        this.gameBoard.board[b.row][b.col] === "O" &&
        this.gameBoard.board[c.row][c.col] === "O"
      ) {
        return this.player2.symbol;
      }
    }

    if (this.gameBoard.board.flat().every((cell) => cell !== "")) {
      return "tie";
    }

    return null;
  }

  checkForWinner() {
    const outcome = this.determineOutcome();
    if (outcome === this.player1.symbol) {
      result.textContent = `${this.player1.name} is the winner`;
      this.player1.score++;
      this.gameBoard.displayScore();
      this.endRound();
    } else if (outcome === this.player2.symbol) {
      result.textContent = `${this.player2.name} is the winner`;
      this.player2.score++;
      this.gameBoard.displayScore();
      this.endRound();
    } else if (outcome === "tie") {
      result.textContent = "It's a tie";
      this.endRound();
    }
  }

  minimax(isMaximizing) {
    let player = isMaximizing ? this.player2 : this.player1;
    let opponent = !isMaximizing ? this.player1 : this.player2;
    let score = {
      X: -1,
      O: 1,
      tie: 0,
    };
    let result = this.determineOutcome();
    if (result !== null) {
      return score[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.gameBoard.board[i][j] === "") {
            this.gameBoard.board[i][j] = this.player2.symbol;
            let score = this.minimax(false);
            this.gameBoard.board[i][j] = "";
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.gameBoard.board[i][j] === "") {
            this.gameBoard.board[i][j] = this.player1.symbol;
            let score = this.minimax(true);
            this.gameBoard.board[i][j] = "";
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }

  bestMove() {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.gameBoard.board[i][j] === "") {
          this.gameBoard.board[i][j] = this.player2.symbol;
          let score = this.minimax(false);
          this.gameBoard.board[i][j] = "";
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
            console.log(move);
          }
        }
      }
    }

    if (move !== null) {
      this.gameBoard.board[move.i][move.j] = this.player2.symbol;
      document.querySelector(`.row${move.i + 1}Col${move.j + 1}`).textContent =
        this.player2.symbol;
      this.player1.isTurn = true;
      this.player2.isTurn = false;
      this.checkForWinner();
    }
  }

  endRound() {
    this.gameBoard.clearListeners();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const player1 = new Player("Player 1", "X", true, player1Score);
  const player2 = new Player("Player 2", "O", false, player2Score);
  new Game(player1, player2);
});
