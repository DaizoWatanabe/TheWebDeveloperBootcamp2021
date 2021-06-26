/*
Write a function called lastElement which accepts a single array argument. The function should return the last element of the array (without removing the element). If the array is empty, the function should return null.
*/

function lastElement(arr) {
    if (!arr.length) {
        return null;
    }
    return arr[arr.length - 1];
}