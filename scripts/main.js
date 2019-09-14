/********** constants **********/
const OPERATORS = ['+', '-', '*', '/', '%']


/********** variables **********/
let display = document.querySelector('.display');
let operators = [];
let operands = [];
let nextOperand = '';
let answered = false;


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

function modulo(x, y) {
    return x % y;
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
            return divide(x, y);
        case "%":
            return modulo(x, y);
        default:
            return("ERROR: Invalid value for operator");
    }
}


/********** helper functions **********/
function inputDigit(digitStr) {
    if (answered) {
        display.textContent = '';
        operands = [];
        nextOperand = '';
        answered = false;
    }
    
    /*
    // only allow one '.' per operand
    if (digitStr === '.' && nextOperand.includes('.')) {
        return;
    }*/

    display.textContent += digitStr;
    nextOperand += digitStr;
}


function clearInfo() {
    display.textContent = '';
    operators = [];
    operands = [];
    nextOperand = '';
}


function inputOperator(operatorStr) {
    if (nextOperand) {
        operands.push(Number(nextOperand));
        nextOperand = '';
    }
    display.textContent += operatorStr;

    if (operatorStr === '÷') {
        operatorStr = '/';
    }
    operators.push(operatorStr);

    if (answered) {
        answered = false;
        }
}


function evaluateExpression() {
    result = -9999;

    if (display.textContent === '') {
        return;
    }
    // an operand by itself is equal to itself
    else if (operators.length === 0 && nextOperand) {
        if (!Number.isNaN(Number(nextOperand))) {
            result = nextOperand;
            answered = true;
        }
        else {
            alert('Malformed Expression!');
        }
        return;
    }

    if (operands.includes(NaN) || nextOperand === '.') {
        alert('Malformed Expression!');
        return;
    }

    if (nextOperand) {
        operands.push(Number(nextOperand));
        nextOperand = ''
    }

    if (operators.length < operands.length) {

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

        // dividing by zero returns Infinity
        if (!(Number.isFinite(result))) {
            clearInfo();
            alert('Division by Zero is undefined');
            return;
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
        //operands.push(result)

        //makes sure trailing 0s are added to nextOperand string
        nextOperand = display.textContent;
    }
    else {
        alert('Malformed Expression!');
        return;
    }
}


/********** keyboard input **********/
document.addEventListener('keydown', e => {
    //console.log(e.key, typeof(e.key));
    //TODO compare to button text-content instead?

    // digit input
    if (Number.isInteger(Number(e.key)) || e.key === '.') {
        inputDigit(e.key);
    }
    // operator input
    else if (OPERATORS.includes(e.key)) {
        // override browser keyboard-shortcut
        if (e.key === '/') {
            e.preventDefault();
            inputOperator('÷');
            return;
        }
        // Ctrl- should only zoom-out as usual, not enter an operator
        else if (e.key === '-' && e.ctrlKey) {
            return;
        }
        inputOperator(e.key);
    }
    // Ctrl+ should only zoom-in as usual, not enter an operator
    else if ( (e.key === '=' && !e.ctrlKey) || e.key === 'Enter') {
        e.preventDefault();
        evaluateExpression();
    }
    else if (e.key === 'Escape') {
        clearInfo();
    }
    else if (e.key === 'Backspace') {
        backSpace();
    }
})


function backSpace() {
    if (display.textContent) {
        // TODO test last character in display?
        //removeChar = display.textContent.slice(-1);
        display.textContent = display.textContent.slice(0, -1);

        if (nextOperand) {
            nextOperand = nextOperand.slice(0, -1);
        }
        else if (operators.length >= operands.length) {
            operators.pop();
        }
        else if (operators) {
            operators.pop();
            nextOperand = String(operands.pop());
        }

        if (answered) {
            answered = false;
        }
    }
}

/********** keypad(button) input **********/
let numKeys = document.querySelectorAll('.number');
numKeys.forEach( listObj => {
    listObj.addEventListener('click', e => {
        inputDigit(listObj.textContent)
    })
});

let clearKey = document.querySelector('#clear');
clearKey.addEventListener('click', e => {
    clearInfo();
});

let operatorKeys = document.querySelectorAll('.operator');
operatorKeys.forEach( listObj => {
    listObj.addEventListener('click', e => {
        // textContent gets the text of all child elements (i.e. the text of
        // the tooltip) whereas we only want the text shown on the button
        opStr = listObj.textContent[0];
        inputOperator(opStr)
    });
});

let equalsKey = document.querySelector('#equals');
equalsKey.addEventListener('click', e => {
    evaluateExpression();
});

let backspaceKey = document.querySelector('#backspace');
backspaceKey.addEventListener('click', e => {
    backSpace();
});
