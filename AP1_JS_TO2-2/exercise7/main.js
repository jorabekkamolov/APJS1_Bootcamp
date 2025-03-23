class App {
    constructor(boardLength, maxBoardShipLength, countBoardShips) {
        this._boardLength = boardLength;
        this._maxBoardShipLength = maxBoardShipLength;
        this._countBoardShips = countBoardShips;
        this.firstPlayer = null;
        this.secondPlayer = null;
    }

    shipArrangement(player, isAI = false) {
        if(isAI) {
            for (let i = 0; i < this._countBoardShips; i++) {
                const shipName = `Ship${i + 1}`;
                const length = Math.floor(Math.random() * (this._maxBoardShipLength)) + 1;
                player.placeShips(shipName, length);
            }
        } else {
            for (let i = 0; i < this._countBoardShips; i++) {
                let inputShipName = prompt(`${player.name} ${i + 1} - введите имя корабля`);
                let inputShipLength;
                do {
                    inputShipLength = parseInt(prompt(`${player.name} ${i + 1} - введите длину корабля (не более ${this._maxBoardShipLength})`), 10);
                } while (isNaN(inputShipLength) || inputShipLength <= 0 || inputShipLength > this._maxBoardShipLength);
                player.placeShips(inputShipName, inputShipLength);
            }
        }
    }

    run() {
        const inputFirstPlayerName = prompt("Введите имя первого игрока (человек):");
        this.firstPlayer = new HumanPlayer(inputFirstPlayerName, this._boardLength);

        const opponentType = parseInt(prompt("Выберите тип оппонента: 1 - человек, 0 - компьютер"), 10);
        if (opponentType === 1) {
            const inputSecondPlayerName = prompt("Введите имя второго игрока (человек):");
            this.secondPlayer = new HumanPlayer(inputSecondPlayerName, this._boardLength);
        } else {
            this.secondPlayer = new AIPlayer("Компьютер", this._boardLength);
        }
        console.log("Игрок 1:", this.firstPlayer.name);
        console.log("Игрок 2:", this.secondPlayer.name);

        this.shipArrangement(this.firstPlayer, false);
        this.shipArrangement(this.secondPlayer, this.secondPlayer instanceof AIPlayer);

        let currentPlayer = this.firstPlayer;
        let opponent = this.secondPlayer;
        let winner = null;

        while (true) {
            alert(`${currentPlayer.name} делает ход!`);
            const attack = currentPlayer.takeTurn(opponent);

            try {
                const hit = attack.opponent._playerBoard.receiveAttack(attack.x, attack.y);
                alert(hit ? "Попадание!" : "Промах!");

                const allSunk = attack.opponent._playerBoard.ships.every(ship => ship.isSunk());
                if (allSunk) {
                    alert(`${currentPlayer.name} победил!`);
                    winner = currentPlayer;
                    break;
                }
                console.log(`Доска игрока ${opponent.name}:`);
                attack.opponent._playerBoard.display();
            } catch (error) {
                alert(`Неверная атака: ${error.message}`);
            }

            [currentPlayer, opponent] = [opponent, currentPlayer];
        }
        console.log("Игра окончена!");
        console.log("Игрок 1:", this.firstPlayer.name);
        console.log("Игрок 2:", this.secondPlayer.name);
        console.log("Победитель:", winner.name);
    }
}

const aiPlayer = new AIPlayer("AIPlayer", 10);
console.log("AIPlayer name:", aiPlayer.name);

const humanPlayer = new HumanPlayer("HumanPlayer", 10);
console.log("HumanPlayer name:", humanPlayer.name);

const app = new App(10, 5, 2);
app.run();
