import { Ship } from "./ship"

class Gameboard {
  constructor() {
    this.board = []
    this.size = 10
    this.createBoard()
  }

  createBoard() {
    for (let i = 0; i < this.size; i++) {
      this.board[i] = new Array(this.size).fill(null)
    }
    return this.board
  }

  placeShip(x, y, length, orientation) {
    // Check if the position is within bounds based on orientation
    if (
      (orientation === "horizontal" &&
        (y + length - 1 >= this.size || x >= this.size)) ||
      (orientation === "vertical" &&
        (x + length - 1 >= this.size || y >= this.size))
    ) {
      return false
    }

    const newShip = new Ship(length)

    // Check for existing ships in the specified position
    for (let i = 0; i < length; i++) {
      if (
        (orientation === "horizontal" && this.board[x][y + i] !== null) ||
        (orientation === "vertical" && this.board[x + i][y] !== null)
      ) {
        return false
      }
    }
    // Place the ship on the board
    for (let i = 0; i < length; i++) {
      if (orientation === "horizontal") {
        this.board[x][y + i] = newShip // Place ship horizontally
      } else {
        this.board[x + i][y] = newShip // Place ship vertically
      }
    }
    return true
  }

  receiveAttack(x, y) {
    const target = this.board[x][y]
    if (target === "X") {
      return "Error"
    } else if (target instanceof Ship) {
      target.hit()
      target.isSunk()
      this.board[x][y] = "X"
      return true
    } else {
      this.board[x][y] = "X"
      return false
    }
  }

  allSunk() {
    for (let row of this.board) {
      for (let cell of row) {
        if (cell instanceof Ship && !cell.isSunk()) {
          return false
        }
      }
    }
    return true
  }
}

export { Gameboard }
