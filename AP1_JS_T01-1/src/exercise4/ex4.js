function getSimpleNumbers(touple) {
    let answer = [];
    for(let i = touple[0]; i <= touple[1]; i++){
        if(isPrime(i)){
            answer.push(i);
        }
    }
    return answer;
}

function isPrime(num) {
    for(let i = 2; i*i <= num; i++){
        if(num % i == 0){
            return false;
        }
    }
    return true;
}

console.log(getSimpleNumbers([2, 2]));