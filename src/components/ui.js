import { Player } from "./player.js" // Adjust the path based on your structure
import { Ship } from "./ship.js"

let player1, player2
let currentPlayer

const TOTAL_SHIPS = 5 // Total number of ships to be placed by the player
let shipsPlacedCount = 0 // Counter for placed ships

function setupGame() {
  // Create players
  player1 = new Player("Player", "Player")
  player2 = new Player("Computer", "Computer")

  currentPlayer = player1
  shipsPlacedCount = 0
  placeComputerShip()
  renderBoard(player1.board, "player1-board")
  createDraggableShips()
}

function renderRestart() {
  const restart = document.getElementById("restart-button")
  restart.addEventListener("click", () => {
    restartGame()
  })

  const rotateButton = document.getElementById("rotate-button")
  rotateButton.addEventListener("click", rotateShip)
}

function renderBoard(board, elementId) {
  const boardElement = document.getElementById(elementId)
  boardElement.innerHTML = "" // Clear existing board

  for (let x = 0; x < board.size; x++) {
    for (let y = 0; y < board.size; y++) {
      const cell = document.createElement("div")
      cell.classList.add("cell")
      cell.id = `cell-${x}-${y}`
      cell.dataset.x = x
      cell.dataset.y = y

      // Player can attack on opponent's board
      cell.addEventListener("click", () => {
        if (elementId === "player2-board" && currentPlayer === player1) {
          handlePlayerMove(x, y, cell)
        }
      })

      // Allow dragging and dropping on player's own board
      if (elementId === "player1-board" && !cell.classList.contains("ship")) {
        cell.addEventListener("dragover", (event) => {
          event.preventDefault() // Allow drop
          cell.classList.add("dropzone")
        })

        cell.addEventListener("dragleave", () => {
          cell.classList.remove("dropzone")
        })

        cell.addEventListener("drop", (event) => {
          event.preventDefault()
          const ship = document.querySelector(".dragging")
          if (!ship) {
            console.error("No ship being dragged")
            return // Exit if no ship is being dragged
          }
          const size = parseInt(ship.dataset.size)
          const x = parseInt(cell.dataset.x)
          const y = parseInt(cell.dataset.y)
          const orientation = ship.dataset.orientation

          // Attempt to place the ship
          if (player1.board.placeShip(x, y, size, orientation)) {
            updateBoardDisplay(player1.board)
            ship.remove() // Remove the ship after placing
            shipsPlacedCount++ // Increment the placed ships counter
            if (shipsPlacedCount === TOTAL_SHIPS) {
              renderBoard(player2.board, "player2-board")
              updateTurnDisplay()
            }
          } else {
            console.log("Incorrect Placement")
          }
          cell.classList.remove("dropzone")
        })
      }

      // Display ships
      if (board.board[x][y] instanceof Ship) {
        cell.classList.add("ship-enemy")
      }

      boardElement.appendChild(cell)
    }
  }
}

function updateBoardDisplay(board) {
  // We don't want to clear all of the board, just update relevant cells
  for (let x = 0; x < board.size; x++) {
    for (let y = 0; y < board.size; y++) {
      const cell = document.getElementById(`cell-${x}-${y}`)
      // Clear previous classes
      cell.classList.remove("ship", "hit", "miss")

      // Add visual indication for ships
      if (board.board[x][y] instanceof Ship) {
        cell.classList.add("ship")
      }

      // Add visual indication for hits or misses
      if (board.board[x][y] === "hit") {
        cell.classList.add("hit")
      } else if (board.board[x][y] === "miss") {
        cell.classList.add("miss")
      }
    }
  }
}

function createDraggableShips() {
  const shipSizes = [5, 4, 3, 2, 1]
  const shipsContainer = document.getElementById("ships-container")
  shipsContainer.innerHTML = ""

  // Create a rotate button for each ship
  const rotateButton = document.createElement("button")
  rotateButton.textContent = "Rotate"
  rotateButton.classList.add("rotate-button")

  rotateButton.addEventListener("click", (event) => {
    event.stopPropagation() // Prevent the dragstart event from firing
    rotateShip() // Pass the ship element to the rotate function
  })

  shipSizes.forEach((size) => {
    const shipElement = document.createElement("div")
    shipElement.classList.add("ship")
    shipElement.dataset.size = size
    shipElement.dataset.orientation = "horizontal"
    shipElement.setAttribute("draggable", true)

    // Create sub-divs representing each part of the ship
    for (let i = 0; i < size; i++) {
      const part = document.createElement("div")
      part.classList.add("ship-part")
      shipElement.appendChild(part)
    }

    shipElement.addEventListener("dragstart", () => {
      shipElement.classList.add("dragging")
    })

    shipElement.addEventListener("dragend", () => {
      shipElement.classList.remove("dragging")
    })

    shipsContainer.appendChild(shipElement)
  })
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
    randomX = Math.floor(Math.random() * player2.board.size)
    randomY = Math.floor(Math.random() * player2.board.size)
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

function placeComputerShip() {
  const shipSizes = [5, 4, 3, 2, 1] // Sizes for the ships
  const orientations = ["horizontal", "vertical"]
  console.log(player2.board)
  for (const size of shipSizes) {
    let placed = false
    while (!placed) {
      const x = Math.floor(Math.random() * 10)
      const y = Math.floor(Math.random() * 10)
      const orientation =
        orientations[Math.floor(Math.random() * orientations.length)] // Randomly choose orientation
      // Attempt to place the ship with the chosen orientation
      if (player2.placeShip(x, y, size, orientation)) {
        placed = true // Ship placed successfully
      }
    }
  }
}

function restartGame() {
  // Reset players and ships placed count
  shipsPlacedCount = 0
  player1 = null
  player2 = null
  setupGame() // Re-initialize the game
  const player2_board = document.getElementById("player2-board")
  player2_board.innerHTML = ""
  const turnDisplay = document.getElementById("turn-display")
  turnDisplay.textContent = "Place all ships to start game"
}

function rotateShip() {
  const ships = document.querySelectorAll(".ship")
  ships.forEach((ship) => {
    const currentOrientation = ship.dataset.orientation
    ship.dataset.orientation =
      currentOrientation === "horizontal" ? "vertical" : "horizontal"

    // Update ship styles to visually represent the rotation
    ship.style.display = ship.style.display === "block" ? "flex" : "block"
  })
}

export { setupGame, renderRestart }
