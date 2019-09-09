/* wrappers for fundamental mathematic operations */
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


// returns the result of an operation defined by operator on numbers x and y
function operate(operator, x, y) {
    //TODO throw errors in error cases?
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
let operators = [];
let operands = [];
let nextOperand = '';
let answered = false;


//add functionality to number keys
let numKeys = document.querySelectorAll('.number');
numKeys.forEach( listObj => {
    listObj.addEventListener('click', e => {
        if (answered) {
            display.textContent = '';
            operands = [];
            nextOperand = '';
            answered = false;
        }
        //clicking on a number key populates display with corresponding number
        digitStr = listObj.textContent;
        display.textContent += digitStr;
        nextOperand += digitStr;
    })
});


//add functionality to clear key
let clearKey = document.querySelector('#clear');
clearKey.addEventListener('click', e => {
    display.textContent = '';
    operators = [];
    operands = [];
    nextOperand = '';
});


//add functionality to operator keys
let operatorKeys = document.querySelectorAll('.operator');
operatorKeys.forEach( listObj => {
    listObj.addEventListener('click', e => {
        if (display.textContent) {
            if (nextOperand) {
                operands.push(Number(nextOperand));
                nextOperand = '';
            }
            operator = listObj.textContent;
            operators.push(operator);
            display.textContent += operator;
            if (answered) {
                answered = false;
            }
        }
    });
});


//add functionality to equals key
let equalsKey = document.querySelector('#equals');
equalsKey.addEventListener('click', e => {
    result = -9999;

    if (nextOperand) {
        operands.push(Number(nextOperand));
        nextOperand = ''
    }

    if (operators.length && operands.length > 1) {

        //multiplication and division first
        for (let i = 0; i < operators.length; i++) {
            operator = operators[i];
            if (operator === '*' || operator === '/') {
                result = operate(operator, operands[i], operands[i+1]);
                operands[i] = null;
                operands[i+1] = result;
                operators[i] = null;
            }
        }

        //then addition and subtraction
        for (let i = 0; i < operators.length; i++) {
            operator = operators[i];
            if (operator) {
                secondOperandIndex = i+1;
                while (!operands[secondOperandIndex]) {
                    secondOperandIndex += 1;
                }
                result = operate(operator, operands[i], operands[secondOperandIndex]);
                operands[secondOperandIndex] = result;
            }
        }


        if (Number.isInteger(result)) {
            display.textContent = result;
        }
        else {
            display.textContent = result.toFixed(2);
        }
        answered = true;
        operators = [];
        operands = [];
        operands.push(result)
        nextOperand = '';
    }
});
