function mergeSort(arr) {
    if (arr.length <= 1) return arr;  // Bazaviy holat

    let mid = Math.floor(arr.length / 2);
    let left = mergeSort(arr.slice(0, mid));
    let right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    let result = [], i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

console.log(mergeSort([5, 2, 9, 1, 3, 6]));  // [1, 2, 3, 5, 6, 9]
console.log(mergeSort([10, -2, 4, 8, 0]));  // [-2, 0, 4, 8, 10]
