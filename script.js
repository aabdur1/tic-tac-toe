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

console.log(board);
