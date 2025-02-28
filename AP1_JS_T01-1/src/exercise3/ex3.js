function getNOD(first, second) {
    if (second == 0) {
        return first;
    }
    return getNOD(second, first % second);
}

console.log(getNOD(3, 6));
console.log(getNOD(0, 2));