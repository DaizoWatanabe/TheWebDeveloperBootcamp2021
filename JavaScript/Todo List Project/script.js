let usrText = prompt('What would you like to do?');
let list = [];
while (usrText !== 'quit') {
  if (usrText === 'new') {
    newTodo = prompt('Enter new todo');
    list.push(newTodo);
    console.log(`${newTodo} added to the list`);
  }
  if (usrText === 'list') {
    console.log(`***************`);
    for (let i = 0; i < list.length; i++) {
      console.log(`${i}: ${list[i]}`);
    }
    console.log(`***************`);
  }
  if (usrText === 'delete') {
    const index = parseInt(prompt('Enter the index to be removed'));
    if (index >= list.length || index < 0) {
      console.log('Invalid index');
    } else if (!Number.isNaN(index)) {
      let deleted = list.splice(index, 1);
      console.log(`Removed ${deleted[0]} from the list`);
    } else {
      console.log('Unknown index');
    }
  }
  usrText = prompt('What would you like to do?');
}

console.log('Ok, you quit the app');
