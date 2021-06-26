/*
I've provided you with array called planets. Unfortunately, I'm an idiot who doesn't know much about our solar system and I made some mistakes. Please help me fix the planets array!
Using the array methods we just learned:
1. Remove the first element, "The Moon", from the planets array. 
2. Add in "Saturn" at the very end of the planets array.
3. Add "Mercury" as the first element in the planets array.
*/

const planets = ['The Moon','Venus', 'Earth', 'Mars', 'Jupiter']; //DO NOT TOUCH THIS LINE!

// YOUR CODE GOES BELOW THIS LINE:
planets.shift();
planets.push('Saturn');
planets.unshift('Mercury');
