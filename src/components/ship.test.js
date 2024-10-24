import { Ship } from "./ship"

let battleShip

beforeEach(() => {
  battleShip = new Ship(5)
})

test("ship length", () => {
  expect(battleShip.length).toBe(5)
})

test("ship hit", () => {
  battleShip.hit()
  expect(battleShip.hits).toBe(1)
})

test("ship not sunk", () => {
  expect(battleShip.isSunk()).toBe(false)
})

test("ship sunk", () => {
  battleShip.hit()
  battleShip.hit()
  battleShip.hit()
  battleShip.hit()
  battleShip.hit()
  expect(battleShip.isSunk()).toBe(true)
})
