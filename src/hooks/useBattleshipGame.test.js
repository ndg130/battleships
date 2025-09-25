import { test, expect, describe } from '@jest/globals';
import { renderHook, act } from "@testing-library/react";
import useBattleshipGame, {
    convertCellNumberToIndex,
    pickRandomStartingPoint,
    generateHorizontalShip,
    generateVerticalShip,
    isShipOverflowing,
    isShipClashing
} from "./useBattleshipGame";


// tests for utility functions
describe("Utility functions", () => {
    test("converts cell number to correct index", () => {
        expect(convertCellNumberToIndex('A1', 10)).toBe(0);
        expect(convertCellNumberToIndex('B4', 10)).toBe(13);
        expect(convertCellNumberToIndex('Z9', 10)).toBe(-1);
        expect(convertCellNumberToIndex('', 10)).toBe(-1);
    });

    test("generates a random number within a squared range", () => {
        expect(pickRandomStartingPoint(10)).toBeLessThanOrEqual(99);
        expect(pickRandomStartingPoint(10)).toBeGreaterThanOrEqual(0);
    });

    test("generates a horizontal ship", () => {
        expect(generateHorizontalShip(0, 5, 10)).toEqual([0, 1, 2, 3, 4]); // in bounds
        expect(generateHorizontalShip(8, 5, 10)).toEqual([]); // out of bounds
    });

    test("generates a vertical ship", () => {
        expect(generateVerticalShip(0, 5, 10)).toEqual([0, 10, 20, 30, 40]); // in bounds
        expect(generateVerticalShip(69, 5, 10)).toEqual([]); // out of bounds
    });

    test("determines if a ship is overflowing the grid", () => {
        expect(isShipOverflowing('horizontal', 10, 5, 0)).toBe(false); // in bounds
        expect(isShipOverflowing('horizontal', 10, 5, 8)).toBe(true); // out of bounds
        expect(isShipOverflowing('vertical', 10, 5, 0)).toBe(false); // in bounds
        expect(isShipOverflowing('vertical', 10, 5, 69)).toBe(true); // out of bounds
    });

    test("determines if a ship is clashing with another ship", () => {
        expect(isShipClashing([0,1,2,3,4], [0,1,2,3,4])).toBe(true);
        expect(isShipClashing([0,1,2,3,4], [5,6,7,8,9])).toBe(false);
        expect(isShipClashing([0,1,2,3,4], [])).toBe(false);
        expect(isShipClashing([2,3,4,5], [4,14,24,34])).toBe(true);

    });
});

// tests for useBattleshipGame hook
describe("useBattleshipGame hook", () => {
    const battleShips = [{id: 1, name: 'Battleship', size: 5}, {id: 2, name: 'Destroyer', size: 4}, {id: 3, name: 'Destroyer', size: 4}];

    test("initialises the game correctly", () => {
        const { result } = renderHook(() => useBattleshipGame(10, battleShips));
        act(() => {result.current.initGame();});

        expect(result.current.shipCells.flat().length).toBeGreaterThan(0);
        expect(result.current.remainingCells.flat().length).toBe(battleShips.reduce((acc, ship) => acc + ship.size, 0));
        expect(result.current.hitCells.length).toBe(0);
        expect(result.current.move).toBe('');
        expect(result.current.message).toBe('');
    });

    test("handleHit updates state correctly", () => {
        const battleShips = [{ id: 1, name: "Battleship", size: 4 }];
        const { result } = renderHook(() => useBattleshipGame(10, battleShips));

        act(() => {
            result.current.initGame();
        });

        const cellIndex = 20;

        act(() => {
            result.current.setShipCells([[20, 21, 22, 23]]);
            result.current.setRemainingCells([[20, 21, 22, 23]]);
        });

        act(() => {
            result.current.handleHit(cellIndex);
        });

        expect(result.current.hitCells).toContain(cellIndex);
        expect(result.current.remainingCells).not.toContain(cellIndex);
        expect(result.current.message).toBe("You hit a ship!");
    });

    test("handleMiss updates state correctly", () => {
        const battleShips = [{ id: 1, name: "Battleship", size: 4 }];
        const { result } = renderHook(() => useBattleshipGame(10, battleShips));

        act(() => {
            result.current.initGame();
        });

        const cellIndex = 30;

        act(() => {
            result.current.setShipCells([[20, 21, 22, 23]]);
            result.current.setRemainingCells([[20, 21, 22, 23]]);
        });

        act(() => {
            result.current.handleMiss(cellIndex);
        });

        expect(result.current.hitCells).toContain(cellIndex);
        expect(result.current.remainingCells).not.toContain(cellIndex);
        expect(result.current.message).toBe("You missed!");
    });

    test("handleHit shows sunken ship message", () => {
        const battleShips = [{ id: 1, name: "Battleship", size: 4 }, { id: 2, name: "Destroyer", size: 3 }];
        const { result } = renderHook(() => useBattleshipGame(10, battleShips));

        act(() => {
            result.current.initGame();
        });

        const cellIndex = 20;

        act(() => {
            result.current.setShipCells([[20, 21, 22, 23], [1, 2, 3, 4]]);
            result.current.setRemainingCells([[20]]);
            result.current.setHitCells([21, 22, 23]);
        });

        act(() => {
            result.current.handleHit(cellIndex);
        });

        expect(result.current.hitCells).toContain(cellIndex);
        expect(result.current.remainingCells[0]).toEqual([]);
        expect(result.current.message).toBe("You sank ship #1!");
    });


    test("handleMove with an input outside of range does not update state", () => {
        const battleShips = [{id: 1, name: 'Battleship', size: 5}];
        const { result } = renderHook(() => useBattleshipGame(10, battleShips));

        act(() => {
            result.current.setMove('Z1');
        })
        act(() => {
            result.current.handleMove({preventDefault: () => {}});
        }) 

        expect(result.current.move).toBe('');
        expect(result.current.message).toBe('Please enter a valid cell within the grid coordinate range');

    });

    test("handleMove with an invalid input does not update state", () => {
        const battleShips = [{id: 1, name: 'Battleship', size: 5}];
        const { result } = renderHook(() => useBattleshipGame(10, battleShips));

        act(() => {
            result.current.setMove('Z1A');
        })
        act(() => {
            result.current.handleMove({preventDefault: () => {}});
        }) 

        expect(result.current.move).toBe('');
        expect(result.current.message).toBe('Please enter a valid cell like A1 or J10');

    });

    test("handleMove with a previous move does not update state", () => {
        const battleShips = [{id: 1, name: 'Battleship', size: 5}];
        const { result } = renderHook(() => useBattleshipGame(10, battleShips));

        act(() => {
            result.current.setShipCells([[0,1,2,3,4]]);
            result.current.setRemainingCells([[0,2,3,4]]);
            result.current.setHitCells([1]);
            result.current.setMove('A2');
        });

        act(() => {
            result.current.handleMove({ preventDefault: () => {} });
        });

        expect(result.current.message).toBe('You already hit this cell');

    });

    test("Game won message displays when final cell is hit", () => {
        const battleShips = [{id: 1, name: 'Battleship', size: 1}];
        const { result } = renderHook(() => useBattleshipGame(10, battleShips));

        act(() => {
            result.current.setShipCells([[0]]);
            result.current.setRemainingCells([[0]]);
            result.current.setMove('A1');
        });
        act(() => {
            result.current.handleMove({preventDefault: () => {}})
           
        })

         expect(result.current.message).toBe('You won!');
    });

    test('Move is reset after a move is taken successfully', () => {
        const battleShips = [{id: 1, name: 'Battleship', size: 1}];
        const { result } = renderHook(() => useBattleshipGame(10, battleShips));

        act(() => {
            result.current.setMove('A1');
            result.current.setShipCells([[0]]);
            result.current.setRemainingCells([[0]]);
        })
        act(() => {
            result.current.handleMove({preventDefault: () => {}});
        })

        expect(result.current.move).toBe('');
    });

});
