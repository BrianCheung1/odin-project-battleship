import { Gameboard } from "./gameboard"

class Player {
  constructor(name, type) {
    this.name = name
    this.type = type
    this.board = new Gameboard()
  }

  makeMove(x, y) {
    if (this.type === "Player") {
      return this.board.receiveAttack(x, y)
    } else if (this.type === "Computer") {
      const randomX = Math.floor(Math.random() * this.board.size)
      const randomY = Math.floor(Math.random() * this.board.size)

      return this.board.receiveAttack(randomX, randomY)
    }
  }
}

export {Player}