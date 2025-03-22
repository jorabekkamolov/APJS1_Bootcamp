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

const name = prompt("Kema nomini kiriting:");
const length = parseInt(prompt("Kema uzunligini kiriting:"), 10);
const orientation = parseInt(prompt("Kema yo‘nalishini kiriting (0 - gorizontal, 1 - vertikal):"), 10) === 1;

const myShip = new Ship(name, length, orientation);

myShip.hit(0);
myShip.hit(1);

console.log(`${myShip.shipName}, ${myShip.shipLength}, ${myShip.shipOrientation}, ${myShip.isSunk()}`);
