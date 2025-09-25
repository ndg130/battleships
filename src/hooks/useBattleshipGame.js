import { useState, useEffect } from "react";

/**
 * Converts a cell number to an index
 * @param {string} cellNumber - The cell number to convert
 * @param {number} gridSize - The size of the grid
 * @returns {number} The index of the cell
 * @throws {Error} If the cell number is invalid
 * 
 */
export const convertCellNumberToIndex = (cellNumber, gridSize) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    const row = rows.indexOf(cellNumber[0]);
    const col = Number(cellNumber.slice(1)) - 1;

    // invalid if row or column is out of range
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
        return -1;
    }

    return row * gridSize + col;
}

/**
 * Picks a random starting point for a ship
 * @param {number} number - The size of the grid
 * @returns {number} The starting point
 */
export const pickRandomStartingPoint = (number) => {
    return Math.floor(Math.random() * (number*number));
}

/**
 * Picks a random orientation for a ship
 * @returns {string} The orientation
 */
export const pickRandomOrientation = () => {
    const number = Math.floor(Math.random() * 2);
    return number === 0 ? 'horizontal' : 'vertical';
}

/**
 * Generates a horizontal ship
 * @param {number} startingPoint - The starting point of the ship
 * @param {number} shipSize - The size of the ship, in cells
 * @param {number} gridSize - The size of the grid
 * @returns {number[]} The cells of the ship
 */
export const generateHorizontalShip = (startingPoint, shipSize, gridSize) => {
    const rowStart = Math.floor(startingPoint / gridSize) * gridSize;
    const rowEnd = rowStart + gridSize;
    const cells = [];

    for(let i = 0; i < shipSize; i++){
        const cell = startingPoint + i;
        if(cell >= rowEnd) return [];
        cells.push(cell);
    }
    return cells;
}
/** 
 * Generates a vertical ship
 * @param {number} startingPoint - The starting point of the ship
 * @param {number} shipSize - The size of the ship, in cells
 * @param {number} gridSize - The size of the grid
 * @returns {number[]} The cells of the ship
 */
export const generateVerticalShip = (startingPoint, shipSize, gridSize) => {
    const row = Math.floor(startingPoint / gridSize);
    if (row + shipSize > gridSize) return []; // overflows the grid

    const cells = [];
    for (let i = 0; i < shipSize; i++) {
        cells.push(startingPoint + i * gridSize);
    }
    return cells;
}

/**
 * Checks if a ship is overflowing the grid
 * @param {string} orientation - The orientation of the ship
 * @param {number} gridSize - The size of the grid
 * @param {number} shipSize - The size of the ship, in cells
 * @param {number} cellIndex - The starting point of the ship
 * @returns {boolean} True if the ship is overflowing, false otherwise
 */
export const isShipOverflowing = (orientation, gridSize, shipSize, cellIndex) => {

    if(orientation === 'horizontal') {
        const column = cellIndex % gridSize;
        if(column + shipSize > gridSize) {
            return true; // overflows the grid
        } else {
            return false;
        }
    }
    if(orientation === 'vertical') {
        const row = Math.floor(cellIndex / gridSize);
        if(row + shipSize > gridSize) {
            return true; // overflows the grid
        } else {
            return false;
        }
    }
};

/**
 * Checks if a ship is clashing with another ship
 * @param {number[]} shipCells - The cells of the ship
 * @param {number[]} allCells - The cells of all ships
 * @returns {boolean} True if the ship is clashing, false otherwise
 */
export const isShipClashing = (shipCells, allCells) => {
    const flatCells = allCells.flat();
    return shipCells.some(cell => flatCells.includes(cell));
};

/** 
 * The main Battleship game hook
 * @param {number} gridSize - The size of the grid
 * @param {object[]} battleShips - The ships
 * @returns {object} The game state
*/
export default function useBattleshipGame(gridSize, battleShips) {

    const [shipCells, setShipCells] = useState([]); // all ship cells
    const [remainingCells, setRemainingCells] = useState([]); // ship cells that have not been hit
    const [hitCells, setHitCells] = useState([]); // cells that have been previously entered
    const [move, setMove] = useState('');
    const [message, setMessage] = useState('');
    const [sunkenShips, setSunkenShips] = useState([]);

    // ---------------- UTILS ----------------

    /**
     * Places a ship on the grid
     * @param {object} ship - The ship
     * @param {number[]} allCells - The cells of all ships
     * @returns {number[]} The cells of all ships
     */
    const PlaceShip = (ship, allCells) => {
        let isPlaced = false;
        let singleShipCells = [];

        while(!isPlaced){

            let startingPoint = pickRandomStartingPoint(gridSize);
            const orientation = pickRandomOrientation();
            
            // check if ship is overflowing, if so, pick a new starting point
            while(isShipOverflowing(orientation, gridSize, ship.size, startingPoint)) {
                startingPoint = pickRandomStartingPoint(gridSize);
            }
            if (orientation === 'horizontal'){
                singleShipCells = generateHorizontalShip(startingPoint, ship.size, gridSize);
            } else {
                singleShipCells = generateVerticalShip(startingPoint, ship.size, gridSize);
            }
            
            if (singleShipCells.length > 0 && !isShipClashing(singleShipCells, allCells)) {
                allCells.push(singleShipCells); // update local
                isPlaced = true;
            }
        }
        return allCells;
        
    }   

    /**
     * Randomly places all ships on the grid
     * @param {object[]} ships - The ships
     */
    const RandomlyPlaceShips = (ships) => {
        let allCells = [];
        ships.forEach((ship) => {
            PlaceShip(ship, allCells);
        });
        setShipCells(allCells);
        
        
        setRemainingCells(allCells);
    }
    
    // ---------------- GAME ACTIONS ----------------
    /**
     * Initialises the game
     */
    const initGame = () => {
        setShipCells([]);
        setHitCells([]);
        setRemainingCells([]);
        setSunkenShips([]);
        setMove('');
        setMessage('');
        RandomlyPlaceShips(battleShips);
    }

    /**
     * Handles the message
     * @param {string} message - The message
     * @returns {void}
     */
    const handleMessage = (message) => {
        setMessage(message);
    }

    /**
     * Handles a hit
     * @param {number} index - The index of the cell
     */
    const handleHit = (index) => {
        setHitCells(prev => [...prev, index]);

        setRemainingCells(prevShips => {
            const updatedShips = prevShips.map(ship => 
                ship.includes(index) ? ship.filter(cell => cell !== index) : ship
            );

            // check if ship was sunk
            updatedShips.forEach((ship, i) => {
                if (ship.length === 0 && !sunkenShips.includes(i)) {
                    handleMessage(`You sank ship #${i + 1}!`);
                    setSunkenShips(prev => [...prev, i]); // mark as sunk
                }
            });

            return updatedShips;
        });

        handleMessage('You hit a ship!');
    };

    /**
     * Handles a miss
     * @param {number} index - The index of the cell
     */
    const handleMiss = (index) => {
        setHitCells(prev => [...prev, index]);
        handleMessage('You missed!');
    }

    /**
     * Check if the ship was sunk
     */
    const checkIfShipWasSunk = (index) => {
        // check array position in shipCells
        const shipIndex = shipCells.findIndex(ship => ship.includes(index));
        console.log('shipIndex', shipIndex);
        const shipRemainingCells = remainingCells[shipIndex];
        console.log('shipRemainingCells', shipRemainingCells);
        if (shipRemainingCells.length === 0) {
            handleMessage('You sank a ship!');
        }
    }

    /**
     * Handles a move
     * @param {Event} e - The event
     */
    const handleMove = (e) => {
        e.preventDefault();
        
        // move is null or empty
        if (!move || move.trim().length === 0) {
            handleMessage('Please enter a valid cell number');
            return;
        }

        const cellNumber = move;
        const index = convertCellNumberToIndex(cellNumber, gridSize);

        // check if index is within total grid cells
        if(index < 0 || index >= gridSize * gridSize) {
            handleMessage('Please enter a valid cell number');
            return;
        }
        // check if cell has already been hit
        if(hitCells.includes(index)){
            handleMessage('You already hit this cell');
            setMove('');            
            return;
        }
        // if move cell is a ship cell
        else if(shipCells.flat().includes(index)){
            console.log('hit');
            handleHit(index);
            checkIfShipWasSunk(index);

        } 
        else {
            console.log('miss');
            handleMiss(index);
        }
        setMove('');
    }

    // ---------------- EFFECTS ----------------

    // initialise the game
    useEffect(() => {
        initGame(gridSize);
        
    }, [])

    // check if all ship cells have been hit to end game
    useEffect(() => {
        console.log(shipCells);
        console.log(hitCells);
        console.log(remainingCells);
        const hitsOnShips = hitCells.filter(cell => shipCells.flat().includes(cell));
        if (hitsOnShips.length === shipCells.flat().length && shipCells.length > 0) {
            handleMessage('You won!');
        }
    }, [hitCells, shipCells]);

    return {
        shipCells,
        remainingCells,
        hitCells,
        move,
        message,
        setMove,
        handleMove,
        initGame,
        handleMessage,
        handleHit,
        handleMiss,
        setHitCells,
        setRemainingCells,
        setShipCells
  };
}
