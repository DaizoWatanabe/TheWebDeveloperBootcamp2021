// Leave the next line, the form must be assigned to a variable named 'form' in order for the exercise test to pass
const form = document.querySelector('form');
const gList = document.querySelector('#list');

form.addEventListener('submit', function(e) {
   e.preventDefault();
   
   const prodInput = form.elements.product;
   const qtyInput = form.elements.qty;
   addItem(prodInput.value, qtyInput.value);
   prodInput.value = '';
   qtyInput.value = '';
});

const addItem = (product, qty) => {
    const item = document.createElement('li');
    item.innerText = (`${qty} ${product}`);
    gList.appendChild(item);
};