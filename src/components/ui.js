import { Player } from "./player.js" // Adjust the path based on your structure
import { Ship } from "./ship.js"

let player1, player2
let currentPlayer

function setupGame() {
  // Create players
  player1 = new Player("Alice", "Player")
  player2 = new Player("Computer", "Computer")

  currentPlayer = player1
  placeComputerShip()
  renderBoard(player1.board, "player1-board")
  renderBoard(player2.board, "player2-board")
  createDraggableShips()
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
          const size = parseInt(ship.dataset.size)
          const x = parseInt(cell.dataset.x)
          const y = parseInt(cell.dataset.y)

          // Attempt to place the ship
          if (player1.board.placeShip(x, y, size)) {
            updateBoardDisplay(player1.board, "player1-board") // Update board to show placed ship
            ship.remove() // Remove the ship after placing
          } else {
            alert(
              "Invalid placement! Ships cannot overlap or go out of bounds."
            )
          }
          cell.classList.remove("dropzone")
        })
      }

      // Display ships
      if (board.board[x][y] instanceof Ship) {
        cell.classList.add("ship")
      }

      boardElement.appendChild(cell)
    }
  }
}

function updateBoardDisplay(board, elementId) {
  const boardElement = document.getElementById(elementId)

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

  shipSizes.forEach((size) => {
    const shipElement = document.createElement("div")
    shipElement.classList.add("ship")
    shipElement.textContent = `Ship Size: ${size}`
    shipElement.dataset.size = size
    shipElement.setAttribute("draggable", true)

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

function placeComputerShip() {
  const shipSizes = [5, 4, 3, 2, 1] // Sizes for the ships
  for (const size of shipSizes) {
    let placed = false
    while (!placed) {
      if (
        player2.placeShip(
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          size
        )
      ) {
        placed = true // Ship placed successfully
      }
    }
  }
}

export { setupGame }
