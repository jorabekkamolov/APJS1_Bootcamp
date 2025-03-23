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
        const startX = ship.startX;
        const startY = ship.startY;
        let index = ship.shipOrientation ? x - startX : y - startY;
        ship.hit(index);
        console.log(`Статус корабля ${ship.shipName}:`, ship.hits);
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
                    let index = shipOrientation ? i - startX : j - startY;
                    row += hits[index] ? "X " : "S ";
                }
            }
            console.log(row.trim());
        }
    }
}

class Player {
    constructor(name, boardSize) {
        this._name = name;
        this._boardSize = boardSize;
        this._playerBoard = new Board(this._boardSize);
    }

    get name() { return this._name; }
    set name(newName) { this._name = newName; }

    get boardSize() { return this._boardSize; }
    set boardSize(newBoardSize) { this._boardSize = newBoardSize; }

    placeShips(shipName, length, isVertical, startPosition) {
        const ship = new Ship(shipName, length, isVertical);
        ship.startPosition = startPosition;
        this._playerBoard.placeShip(ship, startPosition.x, startPosition.y);
    }

    async takeTurn(opponent) {
        return { x: 0, y: 0, opponent };
    }
}

class AIPlayer extends Player {
    constructor(name, boardSize) {
        super(name, boardSize);
    }

    placeShips(shipName, length) {
        const isVertical = Math.random() < 0.5;
        let x, y;
        if (isVertical) {
            x = Math.floor(Math.random() * (this._boardSize - length + 1));
            y = Math.floor(Math.random() * this._boardSize);
        } else {
            x = Math.floor(Math.random() * this._boardSize);
            y = Math.floor(Math.random() * (this._boardSize - length + 1));
        }
        super.placeShips(shipName, length, isVertical, { x, y });
        console.log(`${this._name} разместил корабль ${shipName} в (${x}, ${y}), ориентация: ${isVertical ? "вертикально" : "горизонтально"}`);
    }

    async takeTurn(opponent) {
        const availableCells = opponent._playerBoard.findAvailableCells();
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        console.log(`${this._name} атакует по координатам: x = ${randomCell.x}, y = ${randomCell.y}`);
        return { x: randomCell.x, y: randomCell.y, opponent: opponent };
    }
}

class App {
    constructor(boardLength, maxBoardShipLength, countBoardShips) {
        this._boardLength = boardLength;
        this._maxBoardShipLength = maxBoardShipLength;
        this._countBoardShips = countBoardShips;
        this.firstPlayer = null;
        this.secondPlayer = null;
    }
    shipArrangement(player, shipCount, maxShipLength) {
        for (let i = 0; i < shipCount; i++) {
            const shipName = `Ship${i + 1}`;
            const length = Math.floor(Math.random() * maxShipLength) + 1;
            player.placeShips(shipName, length);
        }
    }

    async run() {
        let inputFirstPlayer = prompt("Введите имя первого игрока:");
        let inputSecondPlayer = prompt("Введите имя второго игрока:");

        this.firstPlayer = new AIPlayer(inputFirstPlayer, 5);
        this.secondPlayer = new AIPlayer(inputSecondPlayer, 5);

        this.shipArrangement(this.firstPlayer, 1, 3);
        this.shipArrangement(this.secondPlayer, 1, 3);

        let currentPlayer = this.firstPlayer;
        let opponent = this.secondPlayer;
        let winner = null;

        while (true) {
            console.log(`Ход игрока: ${currentPlayer.name}`);
            const attack = await currentPlayer.takeTurn(opponent);
            
            try {
                const hit = attack.opponent._playerBoard.receiveAttack(attack.x, attack.y);
                console.log(hit ? "Попадание!" : "Промах!");
                
                const allSunk = attack.opponent._playerBoard.ships.every(ship => ship.isSunk());
                if (allSunk) {
                    console.log(`${currentPlayer.name} победил!`);
                    winner = currentPlayer;
                    break;
                }
                
                attack.opponent._playerBoard.display();
            } catch (error) {
                console.log(`Ошибка атаки: ${error.message}`);
            }
            
            [currentPlayer, opponent] = [opponent, currentPlayer];
        }

        console.log("Игра окончена!");
        console.log("Победитель:", winner.name);
    }
}

const app = new App(5, 3, 1);
app.run();
