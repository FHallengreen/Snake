
"use strict";

import { Queue } from "./Queue.js";

window.addEventListener("load", start);

// ******** CONTROLLER ********

/**
 * Function that starts the game.
 * Creates the grid and adds eventlisteners for keypresses.
 * Also runs the tick function.
 */
function start() {
  createGrid();
  document.addEventListener("keydown", keyPress);
  document.addEventListener("keyup", keyUp);
  queue.enqueue({ row: head.row, col: head.col });
  queue.enqueue({ row: head.row, col: head.col +1});
  queue.enqueue({ row: head.row, col: head.col  });
  spawnGoalAfterRandomDelay();
  tick();
}

/**
 * Function that runs the game.
 * Sets a timeout for the tick function and sets the direction of the snake depending on which key is pressed.
 * Also sets the head of the snake to the new position and enqueues the new position.
 * Finally it writes to the cell and displays the board.
 */
function tick() {
  setTimeout(tick, 100);

  writeToCell(head.row, head.col, 0);

  if (controls.left && direction !== "right") {
    direction = "left";
  } else if (controls.right && direction !== "left") {
    direction = "right";
  } else if (controls.up && direction !== "down") {
    direction = "up";
  } else if (controls.down && direction !== "up") {
    direction = "down";
  }

  switch (direction) {
    case "left":
      head.col--;
      if (head.col < 0) {
        head.col = columns - 1;
      }
      break;
    case "right":
      head.col++;
      if (head.col >= columns) {
        head.col = 0;
      }
      break;
    case "up":
      head.row--;
      if (head.row < 0) {
        head.row = rows - 1;
      }
      break;
    case "down":
      head.row++;
      if (head.row >= rows) {
        head.row = 0;
      }
      break;
  }
  
  checkIfSnakeHitsItself();
  const eatenGoal = snakeEatingGoal();
  if (!eatenGoal) {
    queue.enqueue({ ...head });
    queue.dequeue();
  } else {
    score++;
    queue.enqueue({ ...head });
  }

  writeToCell(head.row, head.col, 1);
  updateScore();
  displayBoard();
}

function spawnGoalAfterRandomDelay() {
  const minDelay = 1000;
  const maxDelay = 5000;
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;

  setTimeout(() => {
    let newGoal;
    do {
      newGoal = { row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * columns) };
    } while (isCellOccupiedBySnake(newGoal.row, newGoal.col));

    goal = newGoal;
    writeToCell(goal.row, goal.col, 2);
    console.log("New goal spawned at:", goal);
  }, delay);
}

function isCellOccupiedBySnake(row, col) {
  let occupied = false;
  queue.traverse(segment => {
    if (segment.row === row && segment.col === col) {
      occupied = true;
    }
  });
  return occupied;
}

function snakeEatingGoal() {
  if (head.row === goal.row && head.col === goal.col) {
    console.log("Snake is eating goal");
    goal = { row: -1, col: -1 };
    spawnGoalAfterRandomDelay();
    return true;
  } else {
    return false;
  }
}

/**
 * Function that updates the score in the view.
 */
function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = "Score: " + score;

}

function checkIfSnakeHitsItself() {
  queue.traverse(segment => {
    if (segment.row === head.row && segment.col === head.col) {
      direction ="";
      alert("Game over! You hit yourself! Your score was: " + score);
      window.location.reload();
    }
  }
  )
}

/**
 * Switch case for keypresses that sets controls to true depending on which key is pressed.
 * @param {*} event - html event when something happens (in this case used for keydown)
 */
function keyPress(event) {
  switch (event.key) {
    case "a":
    case "ArrowLeft":
      controls.left = true;
      break;
    case "d":
    case "ArrowRight":
      controls.right = true;
      break;
    case "w":
    case "ArrowUp":
      controls.up = true;
      break;
    case "s":
    case "ArrowDown":
      controls.down = true;
      break;
  }
}

/**
 * Switch case for keyrelease that sets controls to false when not pressing down anymore.
 * @param {*} event - html event when something happens (in this case used for keyup)
 */
function keyUp(event) {
  switch (event.key) {
    case "a":
    case "ArrowLeft":
      controls.left = false;
      break;
    case "d":
    case "ArrowRight":
      controls.right = false;
      break;
    case "w":
    case "ArrowUp":
      controls.up = false;
      break;
    case "s":
    case "ArrowDown":
      controls.down = false;
      break;
  }
}
// ******** MODEL ********

/**
 * Writes to a cell in the model.
 * @param {*} row - row in the model
 * @param {*} col - column in the model
 * @param {*} value - value to be written to the cell
 */
function writeToCell(row, col, value) {
  if (row >= 0 && row < rows && col >= 0 && col < columns) {
    model[row][col] = value;
  }
}
const rows = 20;
const columns = 30;
const model = [];

for (let i = 0; i < rows; i++) {
  const row = [];

  for (let j = 0; j < columns; j++) {
    row.push();
  }
  model.push(row);
}

let direction = "left";

const controls = {
  left: false,
  up: false,
  down: false,
  right: false,
}

let score = 0;
let goal = {  };

const queue = new Queue();
let head = { row: 7, col: 16 };


// ******** VIEW ********



/**
 * Creates a grid in the view.
 */
function createGrid() {
  const gridContainer = document.getElementById('grid');
  for (let i = 0; i < rows * columns; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gridContainer.appendChild(cell);
  }
}

/**
 * Displays the board in the view.
 */
function displayBoard() {
  const cells = document.querySelectorAll("#grid .cell");

  cells.forEach(cell => cell.classList.remove("player", "goal"));
  queue.traverse(segment => {
    const index = segment.row * columns + segment.col;
    if (index >= 0 && index < cells.length) {
      cells[index].classList.add("player");
    }
  });

  const goalIndex = goal.row * columns + goal.col;
  if (goalIndex >= 0 && goalIndex < cells.length) {
    cells[goalIndex].classList.add("goal");
  }
}

