function range(start, end) {
    let array = [];
    for(let i = start; i <= end; i++){
        array.push(i);
    }
    return array;
}
console.log(range(3, 3));