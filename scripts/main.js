/********** constants **********/
const OPERATORS = ["+", "-", "*", "/", "%"];

/********** variables **********/
const display = document.querySelector(".display");
let operators = [];
let operands = [];
let nextOperand = "";
let answered = false;

function operate(operator, x, y) {
  /* Return the result of applying operator on the operands x and y*/

  switch (operator) {
    case "+":
      return x + y;
    case "-":
      return x - y;
    case "*":
      return x * y;
    case "/":
      return x / y;
    case "%":
      return x % y;
    default:
      return NaN;
  }
}

/********** helper functions **********/
function inputDigit(digitStr) {
  if (answered) {
    display.textContent = "";
    operands = [];
    nextOperand = "";
    answered = false;
  }

  display.textContent += digitStr;
  nextOperand += digitStr;
}

function clearInfo() {
  display.textContent = "";
  operators = [];
  operands = [];
  nextOperand = "";
}

function inputOperator(operatorStr) {
  if (nextOperand) {
    operands.push(Number(nextOperand));
    nextOperand = "";
  }
  display.textContent += operatorStr;

  if (operatorStr === "÷") {
    operatorStr = "/";
  }
  operators.push(operatorStr);

  if (answered) {
    answered = false;
  }
}

function evaluateExpression() {
  let result = -9999;

  if (display.textContent === "") {
    return;
  }
  // an operand by itself is equal to itself
  else if (operators.length === 0 && nextOperand) {
    if (!Number.isNaN(Number(nextOperand))) {
      result = nextOperand;
      answered = true;
    } else {
      alert("Malformed Expression!");
    }
    return;
  }

  if (operands.includes(NaN) || nextOperand === ".") {
    alert("Malformed Expression!");
    return;
  }

  if (nextOperand) {
    operands.push(Number(nextOperand));
    nextOperand = "";
  }

  if (operators.length < operands.length) {
    //multiplication and division first
    for (let i = 0; i < operators.length; i++) {
      let operator = operators[i];
      if (operator === "*" || operator === "/") {
        result = operate(operator, operands[i], operands[i + 1]);
        operands[i] = null;
        operands[i + 1] = result;
        operators[i] = null;
      }
    }

    //then addition and subtraction
    for (let i = 0; i < operators.length; i++) {
      let operator = operators[i];
      if (operator) {
        let secondOperandIndex = i + 1;
        while (!operands[secondOperandIndex]) {
          secondOperandIndex += 1;
        }
        result = operate(operator, operands[i], operands[secondOperandIndex]);
        operands[secondOperandIndex] = result;
      }
    }

    // dividing by zero returns Infinity
    if (!Number.isFinite(result)) {
      clearInfo();
      alert("Division by Zero is undefined");
      return;
    }

    if (Number.isInteger(result)) {
      display.textContent = result;
    } else {
      display.textContent = result.toFixed(2);
    }
    answered = true;
    operators = [];
    operands = [];
    //operands.push(result)

    //makes sure trailing 0s are added to nextOperand string
    nextOperand = display.textContent;
  } else {
    alert("Malformed Expression!");
    return;
  }
}

/********** keyboard input **********/
document.addEventListener("keydown", e => {
  // digit input
  if (Number.isInteger(Number(e.key)) || e.key === ".") {
    inputDigit(e.key);
  }
  // operator input
  else if (OPERATORS.includes(e.key)) {
    // override browser keyboard-shortcut
    if (e.key === "/") {
      e.preventDefault();
      inputOperator("÷");
      return;
    }
    // Ctrl- should only zoom-out as usual, not enter an operator
    else if (e.key === "-" && e.ctrlKey) {
      return;
    }
    inputOperator(e.key);
  }
  // Ctrl+ should only zoom-in as usual, not enter an operator
  else if ((e.key === "=" && !e.ctrlKey) || e.key === "Enter") {
    e.preventDefault();
    evaluateExpression();
  } else if (e.key === "Escape") {
    clearInfo();
  } else if (e.key === "Backspace") {
    backSpace();
  }
});

function backSpace() {
  if (display.textContent) {
    display.textContent = display.textContent.slice(0, -1);

    if (nextOperand) {
      nextOperand = nextOperand.slice(0, -1);
    } else if (operators.length >= operands.length) {
      operators.pop();
    } else if (operators) {
      operators.pop();
      nextOperand = String(operands.pop());
    }

    if (answered) {
      answered = false;
    }
  }
}

/********** keypad buttons **********/
const numKeys = document.getElementsByClassName("number");
for (let i = 0; i < numKeys.length; i++) {
  let numKey = numKeys[i];
  numKey.addEventListener("click", () => {
    inputDigit(numKey.textContent);
  });
}

const operatorKeys = document.getElementsByClassName("operator");
for (let i = 0; i < operatorKeys.length; i++) {
  let operatorKey = operatorKeys[i];
  operatorKey.addEventListener("click", () => {
    let opStr = operatorKey.textContent[0];
    inputOperator(opStr);
  });
}

const equalsKey = document.getElementById("equals");
equalsKey.addEventListener("click", () => {
  evaluateExpression();
});

const backspaceKey = document.getElementById("backspace");
backspaceKey.addEventListener("click", () => {
  backSpace();
});

const clearKey = document.getElementById("clear");
clearKey.addEventListener("click", () => {
  clearInfo();
});
