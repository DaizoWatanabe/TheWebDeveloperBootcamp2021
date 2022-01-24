/*
Write a function called isShortsWeather
It should accept a single number argument, which we will call temperature.
If temperature is greater than or equal to 75, return true
Otherwise, return false
*/


function isShortsWeather(temperature) {
    if (typeof temperature !== 'number') {
        return isNaN;
    }
    if(temperature >= 75) {
        return true;
    }
    return false;
}
