import { Player } from "./player.js" // Adjust the path based on your structure
import { Ship } from "./ship.js"

let player1, player2
let currentPlayer

function setupGame() {
  // Create players
  player1 = new Player("Alice", "Player")
  player2 = new Player("Computer", "Computer")

  // Example of populating player boards with predetermined coordinates
  player1.board.placeShip(1, 0, 5) // Place ship for player 1
  player1.board.placeShip(4, 0, 5) // Place ship for player 1
  player2.board.placeShip(0, 0, 3) // Place ship for player 2

  currentPlayer = player1

  renderBoard(player1.board, "player1-board")
  renderBoard(player2.board, "player2-board")
  updateTurnDisplay()
}

function renderBoard(board, elementId) {
  const boardElement = document.getElementById(elementId)
  boardElement.innerHTML = "" // Clear existing board

  for (let x = 0; x < board.size; x++) {
    for (let y = 0; y < board.size; y++) {
      const cell = document.createElement("div")
      cell.classList.add("cell")
      cell.id = `cell-${x}-${y}`

      // Add event listener for player's attacks
      cell.addEventListener("click", () => {
        if (elementId === "player2-board" && currentPlayer === player1) {
          handlePlayerMove(x, y, cell)
        }
      })

      // Display the ship
      if (board.board[x][y] instanceof Ship) {
        cell.classList.add("ship")
      }

      boardElement.appendChild(cell)
    }
  }
}

function handlePlayerMove(x, y, cell) {
  const result = player1.makeMove(x, y, player2.board)
  if (result === "Error") {
    return
  }
  if (result) {
    cell.classList.add("hit")
  } else {
    cell.classList.add("miss")
  }
  if (checkResult(player2.board, player1)) {
    return
  }
  switchTurn() 
}

function handleComputerMove() {
  // Allow the computer to make its move automatically after the player's turn
  let computerResult
  let randomX, randomY
  do {
    randomX = Math.floor(Math.random() * player1.board.size)
    randomY = Math.floor(Math.random() * player1.board.size)
    computerResult = player2.makeMove(randomX, randomY, player1.board) 
  } while (computerResult === "Error")

  const cell = document.getElementById(`cell-${randomX}-${randomY}`)
  if (computerResult) {
    cell.classList.add("hit") 
  } else {
    cell.classList.add("miss") 
  }
  if (checkResult(player1.board, player2)) {
    return 
  }
  switchTurn() 
}

function switchTurn() {
  // Switch the current player
  currentPlayer = currentPlayer === player1 ? player2 : player1
  updateTurnDisplay()

  // If it's the computer's turn, make a move after a delay
  if (currentPlayer === player2) {
    setTimeout(handleComputerMove, 100)
  }
}

function updateTurnDisplay() {
  const turnDisplay = document.getElementById("turn-display")
  turnDisplay.textContent = `${currentPlayer.name}'s Turn`
}

function checkResult(board, player) {
  if (board.allSunk()) {
    const turnDisplay = document.getElementById("turn-display")
    turnDisplay.textContent = `${player.name} Wins!`
    disableGame()
    return true
  }
  return false
}

function disableGame() {
  // Disable all game actions when the game is over
  const cells = document.querySelectorAll(".cell")
  cells.forEach((cell) => {
    cell.style.pointerEvents = "none"
  })
}

export { setupGame }
