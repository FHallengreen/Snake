
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
  queue.enqueue({ row: head.row, col: head.col + 1});
  queue.enqueue({ row: head.row, col: head.col  });
  spawnGoalAfterRandomDelay();
  tick();
}

/**
 * Function that runs the game.
 * The function sets a timeout for the tick function to run every 100ms.
 * The function also checks which direction the snake is moving and updates the head position accordingly.
 * The function also checks if the snake is eating the goal, and if it is, the score is updated and the goal is removed.
 * The function also checks if the snake hits itself, and if it does, the game is over.
 * The function also updates the score and displays the board.
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
        gameOver();
      }
      break;
    case "right":
      head.col++;
      if (head.col >= columns) {
        gameOver();
      }
      break;
    case "up":
      head.row--;
      if (head.row < 0) {
        gameOver();
      }
      break;
    case "down":
      head.row++;
      if (head.row >= rows) {
        gameOver();
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

/**
 * Function that spawns a goal after a random delay.
 * The goal is spawned in a random position on the board.
 * The function also checks if the goal is spawned on the snake, and if it is, it spawns a new goal.
 * If the goal is not spawned on the snake, it is written to the cell and displayed on the board.
 * The goal is then set to the new goal.
 * @returns the new goal.
 */
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

/**
 * Function that checks if a cell is occupied by the snake.
 * @param {*} row - row to check
 * @param {*} col - column to check
 */
function isCellOccupiedBySnake(row, col) {
  let occupied = false;
  queue.traverse(segment => {
    if (segment.row === row && segment.col === col) {
      occupied = true;
    }
  });
  return occupied;
}

/**
 * Function that runs when the game is over.
 * The direction is set to an empty string and the modalYouLost function is called.
 */
function gameOver(){
  direction ="";
  modalYouLost();
}

/**
 * Function that checks if the snake is eating the goal.
 * If it is, the goal is removed and a new goal is spawned after a random delay.
 * @returns true if the snake is eating the goal, false if not.
 */
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

/**
 * Function that checks if the snake hits itself.
 * If it does, the game is over and the score is displayed in an alert.
 * The page is then reloaded.
 */
function checkIfSnakeHitsItself() {
  queue.traverse(segment => {
    if (segment.row === head.row && segment.col === head.col) {
      gameOver();
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
 * Function that displays a modal when the game is over.
 * The modal displays the score and a button to restart the game.
 */
function modalYouLost(){
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  const modalText = document.getElementById("modalText");
  modalText.textContent = "You lost! Your score was: " + score;
  const modalButton = document.getElementById("modalButton");
  modalButton.addEventListener("click", () => {
    location.reload();
  });
  modalButton.focus();
};

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
 * The function removes the player and goal classes from the cells and then adds them to the new positions.
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

