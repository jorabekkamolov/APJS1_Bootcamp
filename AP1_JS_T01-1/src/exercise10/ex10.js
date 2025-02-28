function getMaxZeroCount(raw) {
    let zeroGroups = raw.split("1").map(x => x.length);
    return Math.max(...zeroGroups);
}

console.log(getMaxZeroCount("11011001"));
console.log(getMaxZeroCount("100001000"));
console.log(getMaxZeroCount("1111"));
console.log(getMaxZeroCount("0000"));
