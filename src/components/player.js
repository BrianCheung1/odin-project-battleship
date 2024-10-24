import { Gameboard } from "./gameboard"

class Player {
  constructor(name, type) {
    this.name = name
    this.type = type
    this.board = new Gameboard()
  }

  makeMove(x, y, opponentBoard) {
    if (this.type === "Player") {
      return opponentBoard.receiveAttack(x, y) 
    } else if (this.type === "Computer") {
      return opponentBoard.receiveAttack(x, y) 
    }
  }
}

export { Player }
