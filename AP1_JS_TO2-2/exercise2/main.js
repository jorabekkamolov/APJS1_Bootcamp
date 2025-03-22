class Ship {
    constructor(shipName, shipLength, shipOrientation) {
        this._shipName = shipName;
        this._shipLength = shipLength;
        this._shipOrientation = shipOrientation;
        this._hits = new Array(shipLength).fill(false);
        this._startPosition = { x: 0, y: 0 };
    }

    get shipName() { return this._shipName; }
    set shipName(name) { this._shipName = name; }

    get shipLength() { return this._shipLength; }
    set shipLength(length) { this._shipLength = length; }

    get shipOrientation() { return this._shipOrientation; }
    set shipOrientation(orientation) { this._shipOrientation = orientation; }

    get hits() { return this._hits; }
    set hits(index) {
        if (index >= 0 && index < this._shipLength) {
            this._hits[index] = true;
        }
    }

    get startPosition() { return this._startPosition; }
    set startPosition({ x, y }) { this._startPosition = { x, y }; }

    get startX() { return this._startPosition.x; }
    set startX(x) { this._startPosition.x = x; }

    get startY() { return this._startPosition.y; }
    set startY(y) { this._startPosition.y = y; }

    hit(index) {
        if (index >= 0 && index < this._shipLength) {
            this._hits[index] = true;
        }
    }

    isSunk() {
        return this._hits.every(hit => hit === true);
    }
}


class Board {
    constructor(size) {
        if (!Number.isInteger(size) || size <= 0) {
            throw new Error("Size must be a positive integer.");
        }
        this._size = size; // Размер доски
        this._grid = Array.from({ length: size }, () => Array(size).fill(null)); // Двумерный массив, инициализированный null
        this._ships = []; // Массив кораблей
    }

    // Геттеры и сеттеры
    get size() { return this._size; }
    set size(newSize) {
        if (!Number.isInteger(newSize) || newSize <= 0) {
            throw new Error("Size must be a positive integer.");
        }
        this._size = newSize;
        this._grid = Array.from({ length: newSize }, () => Array(newSize).fill(null)); // Обновляем сетку
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

    // Размещение корабля на доске
    placeShip(ship, x, y) {
        if (!ship || typeof ship !== "object" || typeof ship.shipLength !== "number") {
            throw new Error("Invalid ship object.");
        }
        if (x < 0 || y < 0 || x >= this._size || y >= this._size) {
            throw new Error("Invalid position: out of bounds.");
        }

        // Проверяем, не выходит ли корабль за пределы доски
        if (ship.shipOrientation) { // Вертикальный
            if (x + ship.shipLength > this._size) {
                throw new Error("Ship goes out of bounds.");        
            }
            for (let i = 0; i < ship.shipLength; i++) {
                if (this._grid[x + i][y] !== null) {
                    throw new Error("Cell is already occupied.");
                }
            }
        } else { // Горизонтальный
            if (y + ship.shipLength > this._size) {
                throw new Error("Ship goes out of bounds.");
            }
            for (let i = 0; i < ship.shipLength; i++) {
                if (this._grid[x][y + i] !== null) {
                    throw new Error("Cell is already occupied.");
                }
            }
        }

        // Размещаем корабль
        ship.startPosition = { x, y }; // Устанавливаем начальную позицию
        this._ships.push(ship);

        if (ship.shipOrientation) { // Вертикальный
            for (let i = 0; i < ship.shipLength; i++) {
                this._grid[x + i][y] = ship;
            }
        } else { // Горизонтальный
            for (let i = 0; i < ship.shipLength; i++) {
                this._grid[x][y + i] = ship;
            }
        }
    }

    // Поиск доступных клеток
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

    // Атака по координатам
    receiveAttack(x, y) {
        if (x < 0 || y < 0 || x >= this._size || y >= this._size) {
            throw new Error("Invalid position: out of bounds.");
        }

        if (this._grid[x][y] === null) {
            return false; // Промах
        }

        const ship = this._grid[x][y];
        const startX = ship.startX
        const startY = ship.startY
        let index = 0;
        if (ship.shipOrientation) { // Вертикальный
            index = x - startX;
        } else { // Горизонтальный
            index = y - startY;
        }

        ship.hit(index); // Регистрируем попадание
        console.log(ship.hits)
        return true; // Попадание
    }

    // Отображение доски
    display() {
        for (let i = 0; i < this._size; i++) {
            let row = "";
            for (let j = 0; j < this._size; j++) {
                const cell = this._grid[i][j];
                if (cell === null) {
                    row += "O "; // Пустая клетка
                } else if (cell instanceof Ship) {
                    const { startX, startY, shipOrientation, hits } = cell;
                    let index;
                    if (shipOrientation) {
                        index = i - startX;
                    } else {
                        index = j - startY;
                    }
                    if (hits[index]) {
                        row += "X "; // Поврежденная часть корабля
                    } else {
                        row += "S "; // Корабль
                    }
                }
            }
            console.log(row.trim());
        }
    }
}



const board = new Board(10); // Создаем доску 10x10

const ship1 = new Ship("Battleship", 4, true); // Вертикальный корабль длиной 4
const ship2 = new Ship("Cruiser", 3, false); // Горизонтальный корабль длиной 3

// Размещаем корабли на доске
board.placeShip(ship1, 2, 3); // Корабль 1 на позиции (2, 3)
board.placeShip(ship2, 5, 5); // Корабль 2 на позиции (5, 5)

// Отображаем доску
console.log("Initial Board:");
board.display();

// Атака по координатам
console.log("\nAttacking (2, 3):", board.receiveAttack(2, 3)); // Попадание
console.log("Attacking (5, 6):", board.receiveAttack(5, 6)); // Попадание
console.log("Attacking (0, 0):", board.receiveAttack(0, 0)); // Промах

// Отображаем доску после атаки
console.log("\nBoard after attacks:");
board.display();


// Поиск доступных клеток
console.log("\nAvailable cells:", board.findAvailableCells());