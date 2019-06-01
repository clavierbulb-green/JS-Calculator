/*BASIC FUNCTIONS*/
function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}

// takes an operator and 2 numbers and then calls one of the above functions on
// the numbers.
function operate(operator, x, y) {
    switch (operator) {
        case "+":
            return add(x, y);
        case "-":
            return subtract(x, y);
        case "*":
            return multiply(x, y);
        case "/":
            if (y === 0) {
                return "ERROR: Divide by Zero";
            }
            else {
                return divide(x, y);
            }
        default:
            return("ERROR: Invalid value for operator");
    }
}


let display = document.querySelector('.display');
let firstOperand = undefined;
let secondOperand = undefined;
let operator = undefined;


//add functionality to number keys
let numKeys = document.querySelectorAll('.number');
numKeys.forEach( listObj => {
    listObj.addEventListener('click', e => {
        display.textContent += listObj.textContent;
    })
});

//add functionality to clear key
let clearKey = document.querySelector('#clear');
clearKey.addEventListener('click', e => {
    display.textContent = '';
    firstOperand = undefined;
    secondOperand = undefined;
    operator = undefined;
});

//add functionality to operator keys
let operatorKeys = document.querySelectorAll('.operator');
operatorKeys.forEach( listObj => {
    listObj.addEventListener('click', e => {
        if (display.textContent !== '') {
            if (!operator) {
                firstOperand = Number(display.textContent);
                operator = listObj.textContent;
                display.textContent = '';
            }
            else {
                secondOperand = Number(display.textContent);
                firstOperand = 
                operate(operator, firstOperand, secondOperand).toFixed(2);
                operator = listObj.textContent;
                secondOperator = undefined;
                display.textContent = '';
            }
        }
    });
});

//add functionality to equals key
let equalsKey = document.querySelector('#equals');
equalsKey.addEventListener('click', e => {
    if (operator && firstOperand) {
        secondOperand = Number(display.textContent);
        display.textContent = 
        operate(operator, firstOperand, secondOperand).toFixed(2);
        firstOperand = undefined;
        secondOperand = undefined;
        operator = undefined;
    }
});

