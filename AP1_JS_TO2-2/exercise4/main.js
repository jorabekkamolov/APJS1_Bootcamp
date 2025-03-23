class App {
    constructor(boardLength, maxBoardShipLength, countBoardShips) {
        this._boardLength = boardLength;
        this._maxBoardShipLength = maxBoardShipLength;
        this._countBoardShips = countBoardShips;
        this.firstPlayer = null;
        this.secondPlayer = null;
    }

    get boardLength() { return this._boardLength; }
    set boardLength(newBoardLength) { this._boardLength = newBoardLength; }

    get maxBoardShipLength() { return this._maxBoardShipLength; }
    set maxBoardShipLength(newMaxBoardShipLength) { this._maxBoardShipLength = newMaxBoardShipLength; }

    get countBoardShips() { return this._countBoardShips; }
    set countBoardShips(newCountBoardShips) { this._countBoardShips = newCountBoardShips; }

    shipArrangement(player, shipCount, maxShipLength) {
        for(let i = 0; i < shipCount; i++) {
            let inputShipName = prompt(`${player.name} ${i + 1} - kemani nomini bering`);
            let inputShiplength;
            do {
                inputShiplength = parseInt(prompt(`${player.name} ${i + 1} - kemani uzunligini bering uzunlik ${maxShipLength} dan oshmasin`), 10);
            } while(isNaN(inputShiplength) || inputShiplength <= 0 || inputShiplength > maxShipLength);
            let inputIsVertical;
            do {
                inputIsVertical = parseInt(prompt(`${player.name} ${i + 1} - kema gorizantal yoki vertikal 0 - gorizantal 1 - vertikal`), 10);
            } while (isNaN(inputIsVertical) || inputIsVertical > 1 || inputIsVertical < 0);
            let inputX, inputY;
            do {
                let inputStartPosition = prompt(`${player.name} ${i + 1} - kemani boshlang'ich pozitsiyasi x va y`).split(" ");
                inputX = parseInt(inputStartPosition[0], 10);
                inputY = parseInt(inputStartPosition[1], 10);
            } while (isNaN(inputX) || isNaN(inputY) || inputX < 0 || inputY < 0 || inputX + inputShiplength > this._boardLength || 
                inputY + inputShiplength > this._boardLength);
            player.placeShips(inputShipName, inputShiplength, inputIsVertical, { x: inputX, y: inputY });
            
        }
    }
    run() {
        let inputFirstPlayer = prompt("1-O'yinchi ismini kiriting");
        this.firstPlayer = new Player(inputFirstPlayer, this._boardLength);
        let inputSecontPlayer = prompt("2-O'yinchi ismini kiriting");
        this.secondPlayer = new Player(inputSecontPlayer, this._boardLength);

        this.shipArrangement(this.firstPlayer, this._countBoardShips, this._maxBoardShipLength);
        this.shipArrangement(this.secondPlayer, this._countBoardShips, this._maxBoardShipLength);

        let currentPlayer = this.firstPlayer;
        let opponent = this.secondPlayer;

        while (true) {
            alert(`${currentPlayer.name}'s turn!`);
            const attack = currentPlayer.takeTurn(opponent);
            
            try {
                const hit = attack.opponent._playerBoard.receiveAttack(attack.x, attack.y);
                alert(hit ? "Hit!" : "Miss!");
                
                const allSunk = attack.opponent._playerBoard.ships.every(ship => ship.isSunk());
                if (allSunk) {
                    alert(`${currentPlayer.name} wins!`);
                    break;
                }
                
                attack.opponent._playerBoard.display();
            } catch (error) {
                alert(`Invalid attack: ${error.message}`);
            }
            
            [currentPlayer, opponent] = [opponent, currentPlayer];
        }

        
    }
}

const game = new App(10, 4, 2);
game.run();