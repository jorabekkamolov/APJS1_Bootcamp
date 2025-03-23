class Board {
    constructor(size) {
        if (!Number.isInteger(size) || size <= 0) {
            throw new Error("Size must be a positive integer.");
        }
        this._size = size;
        this._grid = Array.from({ length: size }, () => Array(size).fill(null));
        this._ships = [];
    }

    get size() { return this._size; }
    set size(newSize) {
        if (!Number.isInteger(newSize) || newSize <= 0) {
            throw new Error("Size must be a positive integer.");
        }
        this._size = newSize;
        this._grid = Array.from({ length: newSize }, () => Array(newSize).fill(null));
    }

    get ships() { return this._ships; }
    set ships(newShips) {
        if (!Array.isArray(newShips)) {
            throw new Error("Ships must be an array.");
        }
        this._ships = newShips;
    }

    get grid() { return this._grid; }
    set grid(newGrid) {
        if (!Array.isArray(newGrid) || newGrid.length !== this._size || 
            newGrid.some(row => !Array.isArray(row) || row.length !== this._size)) {
            throw new Error("Invalid grid format.");
        }
        this._grid = newGrid;
    }

    placeShip(ship, x, y) {
        if (!ship || typeof ship !== "object" || typeof ship.shipLength !== "number") {
            throw new Error("Invalid ship object.");
        }
        if (x < 0 || y < 0 || x >= this._size || y >= this._size) {
            throw new Error("Invalid position: out of bounds.");
        }

        if (ship.shipOrientation) {
            if (x + ship.shipLength > this._size) {
                throw new Error("Ship goes out of bounds.");        
            }
            for (let i = 0; i < ship.shipLength; i++) {
                if (this._grid[x + i][y] !== null) {
                    throw new Error("Cell is already occupied.");
                }
            }
        } else {
            if (y + ship.shipLength > this._size) {
                throw new Error("Ship goes out of bounds.");
            }
            for (let i = 0; i < ship.shipLength; i++) {
                if (this._grid[x][y + i] !== null) {
                    throw new Error("Cell is already occupied.");
                }
            }
        }

        ship.startPosition = { x, y };
        this._ships.push(ship);

        if (ship.shipOrientation) {
            for (let i = 0; i < ship.shipLength; i++) {
                this._grid[x + i][y] = ship;
            }
        } else {
            for (let i = 0; i < ship.shipLength; i++) {
                this._grid[x][y + i] = ship;
            }
        }
    }

    findAvailableCells() {
        const result = [];
        for (let i = 0; i < this._size; i++) {
            for (let j = 0; j < this._size; j++) {
                if (this._grid[i][j] === null) {
                    result.push({ x: i, y: j });
                }
            }
        }
        return result;
    }

    receiveAttack(x, y) {
        if (x < 0 || y < 0 || x >= this._size || y >= this._size) {
            throw new Error("Invalid position: out of bounds.");
        }

        if (this._grid[x][y] === null) {
            return false;
        }

        const ship = this._grid[x][y];
        const startX = ship.startX
        const startY = ship.startY
        let index = 0;
        if (ship.shipOrientation) {
            index = x - startX;
        } else {
            index = y - startY;
        }

        ship.hit(index);
        console.log(ship.hits)
        return true;
    }

    display() {
        for (let i = 0; i < this._size; i++) {
            let row = "";
            for (let j = 0; j < this._size; j++) {
                const cell = this._grid[i][j];
                if (cell === null) {
                    row += "O ";
                } else if (cell instanceof Ship) {
                    const { startX, startY, shipOrientation, hits } = cell;
                    let index;
                    if (shipOrientation) {
                        index = i - startX;
                    } else {
                        index = j - startY;
                    }
                    if (hits[index]) {
                        row += "X ";
                    } else {
                        row += "S ";
                    }
                }
            }
            console.log(row.trim());
        }
    }
}



const board = new Board(10);

const ship1 = new Ship("Battleship", 4, true);
const ship2 = new Ship("Cruiser", 3, false);

board.placeShip(ship1, 2, 3);
board.placeShip(ship2, 5, 5);

console.log("Initial Board:");
board.display();

console.log("\nAttacking (2, 3):", board.receiveAttack(2, 3));
console.log("Attacking (5, 6):", board.receiveAttack(5, 6));
console.log("Attacking (0, 0):", board.receiveAttack(0, 0));

console.log("\nBoard after attacks:");
board.display();

console.log("\nAvailable cells:", board.findAvailableCells());