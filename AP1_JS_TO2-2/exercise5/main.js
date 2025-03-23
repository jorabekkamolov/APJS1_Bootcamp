class HumanPlayer extends Player {
    constructor(name, boardSize) {
        super(name, boardSize);
    }

    placeShips(shipName, length) {
        const inputX = parseInt(prompt(`Введите начальную координату X для корабля ${shipName}: `), 10);
        const inputY = parseInt(prompt(`Введите начальную координату Y для корабля ${shipName}: `), 10);
        const isVertical = confirm(`Расположить корабль ${shipName} вертикально? (OK - Да, Отмена - Нет)`);
        super.placeShips(shipName, length, isVertical, { x: inputX, y: inputY });
    }
    takeTurn(opponent) {
        const x = parseInt(prompt("Введите X координату атаки: "), 10);
        const y = parseInt(prompt("Введите Y координату атаки: "), 10);
        return { x, y, opponent };
    }
}