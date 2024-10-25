import { Gameboard } from "./gameboard"
import { Player } from "./player"

let player1, player2
beforeEach(() => {
  player1 = new Player("Brian", "Player")
  player2 = new Player("Computer", "Computer")
})

test("Initial Players", () => {
  expect(player1.name).toBe("Brian")
  expect(player1.type).toBe("Player")
  expect(player1.board).toBeInstanceOf(Gameboard)

  expect(player2.name).toBe("Computer")
  expect(player2.type).toBe("Computer")
  expect(player2.board).toBeInstanceOf(Gameboard)
})

test("Real Player moves", () => {
  const result = player1.makeMove(0, 0, player2.board)
  expect(result).toBeDefined()
})

test("Computer Makes a move", () => {
  const result = player2.makeMove(0, 0, player1.board)
  expect(result).toBeDefined()
})
