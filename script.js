const player1Score = document.querySelector(".score.player1");
const player2Score = document.querySelector(".score.player2");
const player2Name = document.querySelector(".name.player2");
const player2EditIcon = document.querySelector(".player2 .edit-icon");
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
    this.scoreBoard.textContent = `: ${this.score}`;
  }

  reset() {
    this.score = 0;
    this.isTurn = this.name === "Player 1" ? true : false;
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
      square.classList.add("empty");
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
        event.target.classList.remove("empty");
        player.isTurn = false;
        opponent.isTurn = true;
        result.textContent = `${opponent.name}'s turn`;
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
    result.classList.remove("player1win", "player2win", "tie-result");
    document.querySelectorAll(".board>div").forEach(function (square) {
      square.classList.remove("player1win", "player2win");
    });
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
    this.aiToggle = document.querySelector("#is-computer-toggle");
    this.initGame();
  }

  initGame() {
    this.resetBtn.addEventListener("click", () => {
      this.gameBoard.clearBoard();
      this.gameBoard.initBoard();
    });
    this.newGameBtn.addEventListener("click", () => this.newGame());
    this.aiToggle.addEventListener("change", () => {
      this.player2.isComputer = this.player2.isComputer ? false : true;
      player2Name.textContent = this.player2.isComputer
        ? "Computer"
        : "Player 2";
      player2Name.contentEditable = this.player2.isComputer ? "false" : "true";
      if (this.player2.isComputer) {
        player2EditIcon.classList.remove("active");
      } else {
        player2EditIcon.classList.add("active");
      }
      this.newGame();
    });
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
        return { result: this.player1.symbol, winningCells: [a, b, c] };
      } else if (
        this.gameBoard.board[a.row][a.col] === "O" &&
        this.gameBoard.board[b.row][b.col] === "O" &&
        this.gameBoard.board[c.row][c.col] === "O"
      ) {
        return { result: this.player2.symbol, winningCells: [a, b, c] };
      }
    }

    if (this.gameBoard.board.flat().every((cell) => cell !== "")) {
      return { result: "tie" };
    }

    return { result: null };
  }

  checkForWinner() {
    const outcome = this.determineOutcome();
    if (outcome.result === this.player1.symbol) {
      result.classList.add("player1win");
      result.textContent = `${this.player1.name} is the winner`;
      console.log(outcome.winningCells);
      for (let cell of outcome.winningCells) {
        document
          .querySelector(`.row${cell.row + 1}Col${cell.col + 1}`)
          .classList.add("player1win");
      }
      this.player1.score++;
      this.gameBoard.displayScore();
      this.endRound();
    } else if (outcome.result === this.player2.symbol) {
      result.classList.add("player2win");
      result.textContent = `${this.player2.name} is the winner`;
      for (let cell of outcome.winningCells) {
        document
          .querySelector(`.row${cell.row + 1}Col${cell.col + 1}`)
          .classList.add("player2win");
      }
      this.player2.score++;
      this.gameBoard.displayScore();
      this.endRound();
    } else if (outcome.result === "tie") {
      result.classList.add("tie-result");
      result.textContent = "It's a tie";
      this.endRound();
    }
  }

  minimax(isMaximizing) {
    let score = {
      X: -1,
      O: 1,
      tie: 0,
    };
    let outcome = this.determineOutcome();
    if (outcome.result !== null) {
      return score[outcome.result];
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
          }
        }
      }
    }

    if (move !== null) {
      this.gameBoard.board[move.i][move.j] = this.player2.symbol;
      const gameBoardSquare = document.querySelector(
        `.row${move.i + 1}Col${move.j + 1}`
      );
      setTimeout(() => {
        gameBoardSquare.textContent = this.player2.symbol;
        result.textContent = "Player 1's turn";
      }, 1000);
      gameBoardSquare.classList.remove("empty");
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
  const player2 = new Player("Computer", "O", false, player2Score, true);
  new Game(player1, player2);
});
