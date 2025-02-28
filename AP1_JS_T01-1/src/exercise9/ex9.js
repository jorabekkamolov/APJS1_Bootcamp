function binarySearch(arrayOfNumbers, num) {
    let left = 0;
    let right = arrayOfNumbers.length - 1;
    while(left <= right) {
        let temp = parseInt((left + right) / 2);

        if(arrayOfNumbers[temp] == num) {
            return temp;
        }
        if(arrayOfNumbers[temp] > num) {
            right = temp - 1;
        }else{
            left = temp + 1;
        }
    }
}

console.log(binarySearch([1, 2, 3, 4, 5, 6], 4));
console.log(binarySearch([2, 4, 6, 8, 10], 8));
console.log(binarySearch([-10, -5, 0, 5, 10], 0));
console.log(binarySearch([1, 3, 5, 7], 2));
