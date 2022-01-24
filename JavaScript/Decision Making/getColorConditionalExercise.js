/*
Write your code between the two comments
You will automatically have access to a variable called phrase.
Your job is to print out a color based upon the following rules:
1. if phrase is 'stop', print 'red'
2. if phrase is 'slow', print yellow
3. if phrase is 'go', print green
4. if phrase is anything else, print 'purple'
*/


function getColor(phrase){
    //WRITE YOUR CODE BETWEEN THIS LINE: ↓ ↓ ↓ ↓ 
    if (phrase === 'stop') {
        console.log('red')
    } else if (phrase === 'slow') {
        console.log('yellow')
    } else if (phrase === 'go') {
        console.log('green')
    } else {
        console.log('purple')
    }
   
    //AND THIS LINE ↑↑↑↑↑
}