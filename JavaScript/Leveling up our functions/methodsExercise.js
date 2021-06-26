/*
Define an object called square, which will hold methods that have to do with the geometry of squares. It should contain two methods, area and perimeter.
*/

const square = {
    area(side) {
        return side * side;
    },
    perimeter(side) {
        return side * 4;
    }
}