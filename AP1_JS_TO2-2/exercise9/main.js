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
        const x = parseInt(prompt("Enter attack X coordinate: "), 10);
        const y = parseInt(prompt("Enter attack Y coordinate: "), 10);
        return { x, y, opponent };
    }
}

class HumanPlayer extends Player {
    constructor(name, boardSize) {
        super(name, boardSize);
    }

    placeShips(shipName, length, inputIsVertical, startPosition) {
        super.placeShips(shipName, length, inputIsVertical, startPosition);
    }
    
    async takeTurn(opponent) {
        const x = parseInt(prompt("Введите X координату атаки: "), 10);
        const y = parseInt(prompt("Введите Y координату атаки: "), 10);
        return { x, y, opponent };
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
            let inputShipName = prompt(`${player.name} ${i + 1} - введите имя корабля`);
            let inputShiplength;
            do {
                inputShiplength = parseInt(prompt(`${player.name} ${i + 1} - введите длину корабля (не более ${maxShipLength})`), 10);
            } while(isNaN(inputShiplength) || inputShiplength <= 0 || inputShiplength > maxShipLength);
            let inputIsVertical;
            do {
                inputIsVertical = parseInt(prompt(`${player.name} ${i + 1} - выберите ориентацию: 0 – горизонтально, 1 – вертикально`), 10);
            } while(isNaN(inputIsVertical) || inputIsVertical > 1 || inputIsVertical < 0);
            let inputX, inputY;
            do {
                let inputStartPosition = prompt(`${player.name} ${i + 1} - введите начальные координаты (x и y через пробел)`).split(" ");
                inputX = parseInt(inputStartPosition[0], 10);
                inputY = parseInt(inputStartPosition[1], 10);
            } while(isNaN(inputX) || isNaN(inputY) || inputX < 0 || inputY < 0 ||
                    (inputIsVertical ? inputX + inputShiplength > this._boardLength : inputY + inputShiplength > this._boardLength));
            player.placeShips(inputShipName, inputShiplength, inputIsVertical, { x: inputX, y: inputY });
        }
    }

    async run() {
        let inputFirstPlayer = prompt("Введите имя первого игрока:");
        this.firstPlayer = new HumanPlayer(inputFirstPlayer, this._boardLength);
        let inputSecondPlayer = prompt("Введите имя второго игрока:");
        this.secondPlayer = new HumanPlayer(inputSecondPlayer, this._boardLength);

        this.shipArrangement(this.firstPlayer, this._countBoardShips, this._maxBoardShipLength);
        this.shipArrangement(this.secondPlayer, this._countBoardShips, this._maxBoardShipLength);

        let currentPlayer = this.firstPlayer;
        let opponent = this.secondPlayer;
        let winner = null;

        while (true) {
            alert(`${currentPlayer.name}'s turn!`);
            const attack = await currentPlayer.takeTurn(opponent);
            console.log(`${currentPlayer.name} атакует по координатам: x = ${attack.x}, y = ${attack.y}`);
            
            try {
                const hit = attack.opponent._playerBoard.receiveAttack(attack.x, attack.y);
                alert(hit ? "Hit!" : "Miss!");
                
                const allSunk = attack.opponent._playerBoard.ships.every(ship => ship.isSunk());
                if (allSunk) {
                    alert(`${currentPlayer.name} wins!`);
                    winner = currentPlayer;
                    break;
                }
                
                attack.opponent._playerBoard.display();
            } catch (error) {
                alert(`Invalid attack: ${error.message}`);
            }
            
            [currentPlayer, opponent] = [opponent, currentPlayer];
        }

        console.log("Игра окончена!");
        console.log("Победитель:", winner.name);
    }
}

const app = new App(10, 5, 2);
app.run();
