import { Gameboard } from "./gameboard"
import { Ship } from "./ship"

let gameboard

beforeEach(() => {
  gameboard = new Gameboard()
})

test("gameboard size", () => {
  expect(gameboard.board.length).toBe(10)
  expect(gameboard.board[0].length).toBe(10)
})

test("gameboard ship placement", () => {
  gameboard.createBoard()
  gameboard.placeShip(0, 0, 5)
  expect(gameboard.board[0][0]).toBeInstanceOf(Ship)
  expect(gameboard.board[0][1]).toBeInstanceOf(Ship)
  expect(gameboard.board[0][2]).toBeInstanceOf(Ship)
  expect(gameboard.board[0][3]).toBeInstanceOf(Ship)
  expect(gameboard.board[0][4]).toBeInstanceOf(Ship)
  expect(gameboard.board[0][5]).toBe(null)
})

test("gameboard receive attack", () => {
  gameboard.placeShip(0, 0, 5)
  gameboard.receiveAttack(0, 0)
  gameboard.receiveAttack(1, 1)
  expect(gameboard.board[0][0]).toBe("X")
  expect(gameboard.board[0][1]).toBeInstanceOf(Ship)
  expect(gameboard.board[1][1]).toBe("X")
  expect(gameboard.board[1][2]).toBe(null)
  gameboard.receiveAttack(0, 0)
  expect(gameboard.board[0][0]).toBe("X")
})

test("all ships sunk", () => {
  gameboard.placeShip(0, 0, 5)
  gameboard.placeShip(1, 1, 3)
  gameboard.receiveAttack(0, 0)
  gameboard.receiveAttack(0, 1)
  gameboard.receiveAttack(0, 2)
  gameboard.receiveAttack(0, 3)
  gameboard.receiveAttack(0, 4)

  gameboard.receiveAttack(1, 1)
  gameboard.receiveAttack(1, 2)
  gameboard.receiveAttack(1, 3)

  expect(gameboard.allSunk()).toBe(true)
  gameboard.placeShip(2, 0, 4)
  expect(gameboard.allSunk()).toBe(false)
})
