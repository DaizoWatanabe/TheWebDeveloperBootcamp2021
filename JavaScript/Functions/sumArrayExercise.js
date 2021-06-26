/*
Write a function called sumArray which accepts a single argument: an array of numbers. It should return the sum of all the numbers in the array.
*/


function sumArray(arr) {
    let sum = 0;
    for (let i=0; i<arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}