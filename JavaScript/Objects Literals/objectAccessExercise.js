/*
Create a variable named fullAdress that points to a string using the information from restaurant.
fullAdress should point to a string that includes the adress, city, state and zipcode from the restaurant object.
To make it harder to "cheat" by copy and pasting, I've randomly generated the adress portion.
*/

//PLEASE DON'T TOUCH THIS LINE!
const restaurant = {
    name: 'Ichiran Ramen',
    address: `${Math.floor(Math.random() * 100) + 1} Johnson Ave`,
    city: 'Brooklyn',
    state: 'NY',
    zipcode: '11206',
}

let fullAddress = `"${restaurant.address}, ${restaurant.city}, ${restaurant.state}, ${restaurant.zipcode}"`