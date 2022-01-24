/*
Define a function called capitalize that accepts a string argument and returns a new string with the first letter capitalized.
*/

function capitalize(str) {
    return `${str[0].toUpperCase()}${str.slice(1)}`
}
