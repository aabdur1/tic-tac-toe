const squares = document.querySelectorAll(".board>div");

squares.forEach(function (square) {
  square.addEventListener("click", move);
});

function move() {
  console.log(this.textContent);
}

const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    board[i][j] = "X";
  }
}
