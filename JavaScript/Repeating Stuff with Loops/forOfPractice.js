/*
Please use a for...of loop to loop over numbers array and print out the square of each value.
NOTE: udemy's coding exercise platform does not support the ** operator.
*/


const numbers = [1,2,3,4,5,6,7,8,9]; //DON'T CHANGE THIS LINE PLEASE!


for (let sqr of numbers) {
    console.log(Math.pow(sqr, 2));
}
