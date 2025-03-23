class App {
    constructor(boardLength, maxBoardShipLength, countBoardShips) {
        this._boardLength = boardLength;
        this._maxBoardShipLength = maxBoardShipLength;
        this._countBoardShips = countBoardShips;
        this.firstPlayer = null;
        this.secondPlayer = null;
    }

    shipArrangement(player, shipCount, maxShipLength) {
        for(let i = 0; i < shipCount; i++) {
            let inputShipName = prompt(`${player.name} ${i + 1} - введите имя корабля`);
            let inputShiplength;
            do {
                inputShiplength = parseInt(prompt(`${player.name} ${i + 1} - введите длину корабля (не более ${maxShipLength})`), 10);
            } while(isNaN(inputShiplength) || inputShiplength <= 0 || inputShiplength > maxShipLength);
            let inputIsVertical;
            do {
                inputIsVertical = parseInt(prompt(`${player.name} ${i + 1} - выберите ориентацию корабля: 0 – горизонтально, 1 – вертикально`), 10);
            } while (isNaN(inputIsVertical) || inputIsVertical > 1 || inputIsVertical < 0);
            let inputX, inputY;
            do {
                let inputStartPosition = prompt(`${player.name} ${i + 1} - введите начальные координаты корабля (x и y через пробел)`).split(" ");
                inputX = parseInt(inputStartPosition[0], 10);
                inputY = parseInt(inputStartPosition[1], 10);
            } while (isNaN(inputX) || isNaN(inputY) || inputX < 0 || inputY < 0 ||
                     (inputIsVertical ? inputX + inputShiplength > this._boardLength : inputY + inputShiplength > this._boardLength));
            player.placeShips(inputShipName, inputShiplength, inputIsVertical, { x: inputX, y: inputY });
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
            const attack = currentPlayer.takeTurn(opponent);
            console.log(`${currentPlayer.name} атакует по координатам: x = ${attack.x}, y = ${attack.y}`);
            
            try {
                const hit = attack.opponent._playerBoard.receiveAttack(attack.x, attack.y);
                alert(hit ? "Попадание!" : "Промах!");

                const allSunk = attack.opponent._playerBoard.ships.every(ship => ship.isSunk());
                if (allSunk) {
                    alert(`${currentPlayer.name} wins!`);
                    winner = currentPlayer;
                    break;
                }
                
                attack.opponent._playerBoard.display();
                console.log(`"${opponent.name} (${attack.x, attack.y})"`);
            } catch (error) {
                alert(`Неверная атака: ${error.message}`);
            }
            await this.delay(1000);

            [currentPlayer, opponent] = [opponent, currentPlayer];
        }

        console.log("Игра окончена!");
        console.log("Победитель:", winner.name);
    }
}

const app = new App(10, 5, 2);
app.run();