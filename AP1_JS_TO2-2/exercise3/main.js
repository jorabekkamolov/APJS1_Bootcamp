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

    takeTurn(opponent) {
        const x = parseInt(prompt("Enter attack X coordinate: "), 10);
        const y = parseInt(prompt("Enter attack Y coordinate: "), 10);
        return { x, y, opponent };
    }
}

const input = prompt("Enter player name and board size (e.g., 'Player1 10'): ").split(" ");
const playerName = input[0];
const boardSize = parseInt(input[1], 10);

const player = new Player(playerName, boardSize);

console.log(`${player.name}, ${player.boardSize}`);