let maximum = parseInt(prompt('Enter the maximum number'));

while (!maximum) {
  maximum = parseInt(prompt('Enter a valid number!'));
}

const num = Math.floor(Math.random() * maximum) + 1;

let guess = parseInt(prompt('Enter your first guess!'));
let attempts = 1;

while (parseInt(guess) !== num) {
  if (guess === 'q') {
    break;
  } else if (guess > num) {
    guess = prompt('Too high! Try again:');
  } else {
    guess = prompt('Too low! Try again:');
  }
  attempts++;
}

if (guess === 'q') {
  console.log('You QUIT! Maybe next time');
} else {
  console.log(
    `Congratz, you got it! It took you ${attempts} guesses. The number is ${num}!`
  );
}
