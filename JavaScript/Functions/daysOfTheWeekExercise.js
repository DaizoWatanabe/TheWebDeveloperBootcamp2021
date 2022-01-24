/*
Write a function called returnDay, this function takes in one parameter (a number from 1-7) and returns day of the week. If the number is less than 1 or greater than 7 return null. 
*/

const dow = {
    1 : 'Monday',
    2 : 'Tuesday',
    3 : 'Wednesday',
    4 : 'Thursday',
    5 : 'Friday',
    6 : 'Saturday',
    7 : 'Sunday'
};


function returnDay(x) {
    if(x <1 || x>7) {
        return null
    }
    return dow[x]
}