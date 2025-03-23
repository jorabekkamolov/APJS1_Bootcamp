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
        console.log(`${this._name} placed ship ${shipName} at (${x}, ${y}), orientation: ${isVertical ? "vertical" : "horizontal"}`);
    }

    takeTurn(opponent) {
        const x = Math.floor(Math.random() * this._boardSize);
        const y = Math.floor(Math.random() * this._boardSize);
        return { x, y, opponent };
    }
}


let ai = new AIPlayer("Ai", 5);

console.log(ai.name)