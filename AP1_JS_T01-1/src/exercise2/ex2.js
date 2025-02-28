// function getNumbersIdBySum(arrayOfNumbers, sum) {
//     let answer = [];
//     for(let i = 0; i < arrayOfNumbers.length; i++) {
//         for(let j = i + 1; j < arrayOfNumbers.length; j++) {
//             if(arrayOfNumbers[i] + arrayOfNumbers[j] == sum) {
//                 answer.push(`[${i}, ${j}]`);
//                 break;
//             }
//         }
//     }
//     if(answer.length > 0) {
//         return answer;
//     }
//     return null;
// }

// console.log(getNumbersIdBySum([1,0,5], 2));

function getNumbersIdBySum(arrayOfNumbers, sum) {
    let hash_map = new Map();
    let answer = [];

    for(let i = 0; i < arrayOfNumbers.length; i++) {
        let complement = sum - arrayOfNumbers[i];
        if(hash_map.has(complement)) {
            answer.push(`[${hash_map.get(complement)}, ${i}]`);
        }
        hash_map.set(arrayOfNumbers[i], i);
    }
    answer.reverse();
    return (answer.length > 0) ? answer.join('/') : null;
}

console.log(getNumbersIdBySum([1,0,5], 2));
console.log(getNumbersIdBySum([1,2,3,4,5], 6));