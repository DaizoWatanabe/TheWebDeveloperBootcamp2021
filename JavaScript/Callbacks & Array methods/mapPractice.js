/*
Define a function called cleanNames. It should accept an array of strings, which may contain additional space characters at the beginning and end. The cleanNames function should use the array map method to return a new array, full of trimmed names.
*/

function cleanNames (arr) {
    return arr.map(function(t) {
       return t.trim(); 
    });
}
