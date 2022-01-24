/*
Define a function called allEvens that accepts a single array of numbers. If the array contains all even numbers, return true. Otherwise, return false. Use some or every to help you do this!
*/

function allEvens(arr) {
    if (arr.every(i => i % 2 === 0)) {
        return true;
    }
    return false;
}