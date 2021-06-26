const ctn = document.querySelector('#container');

for (let i=0; i< 100; i++) {
    const btn = document.createElement('button');
    btn.innerText = 'Hey!';
    ctn.appendChild(btn);
}