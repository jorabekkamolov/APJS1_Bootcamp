function sma(arrayOfNumbers, period) {
    let answer = [];
    for(let i = 0; i < arrayOfNumbers.length; i++) {
        let start = 0;
        if(i >= period) {
            start = (i + 1) - period;
        }
        answer.push(arrayOfNumbers.slice(start, i+1).reduce((acc, num) => acc + num, 0) / period);
    }
    return answer;
}

console.log(sma([1,2,3], 3))
console.log(sma([1,2,3], 1))
console.log(sma([1,2,3], 2))
