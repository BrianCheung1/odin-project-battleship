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

  placeShip(x, y, length) {
    if (x + length > this.size || y >= this.size) {
      return false
    }
    const newShip = new Ship(length)
    for (let i = 0; i < length; i++) {
      if (this.board[x][y + i] !== null) {
        return false
      }
    }
    for (let i = 0; i < length; i++) {
      this.board[x][y + i] = newShip
    }
    return true
  }

  receiveAttack(x, y) {
    const target = this.board[x][y]
    if (target === "X") {
      return false
    } else if (target) {
      target.hit()
      target.isSunk()
      this.board[x][y] = "X"
      return true
    } else {
      this.board[x][y] = "X" // Mark miss on the board
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
