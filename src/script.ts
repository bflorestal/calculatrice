// À l'écran
const prevOperandText = document.querySelector("[data-previous-operand]");
const currentOperandText = document.querySelector("[data-current-operand]");
if (!prevOperandText || !currentOperandText) {
  throw new Error("Unexpected error: Missing operand element");
}
const errorText = document.querySelector("[data-error]");
if (!errorText) {
  throw new Error("Unexpected error: Missing error element");
}

// ----- Boutons
const percentBtn = document.querySelector("[data-percent]");
const resetCurrentBtn = document.querySelector("[data-ce]");
const resetBtn = document.querySelector("[data-c]");
const deleteBtn = document.querySelector("[data-delete]");

const invertBtn = document.querySelector("[data-invert]");
const squareBtn = document.querySelector("[data-square]");
const squareRootBtn = document.querySelector("[data-sqrt]");
const operatorBtn = document.querySelectorAll("[data-operator]");
const negateBtn = document.querySelector("[data-negate]");
const resultBtn = document.querySelector("[data-result]");
const operands = document.querySelectorAll("[data-num]");
const dotBtn = document.querySelector("[data-dot]");

type Operation = "+" | "-" | "x" | "/";

let prevOperand = prevOperandText.textContent || "";
let currentOperand = currentOperandText.textContent || "0";
let operation: Operation | undefined;
let hasError = false;

// ----- Fonctions
function addNumber(number: string) {
  if (currentOperand?.includes(".") && number === ".") return;
  if (currentOperand === "0" && number === "0") return;

  if (currentOperand === "0" && number === ".") {
    currentOperand += number;
    return;
  }

  currentOperand === "0"
    ? (currentOperand = number)
    : (currentOperand += number);
}

function displayNumber() {
  if (!currentOperandText) return;
  currentOperandText.textContent = currentOperand;

  if (operation !== undefined) {
    prevOperandText &&
      (prevOperandText.textContent = `${prevOperand} ${operation}`);
  } else {
    prevOperandText && (prevOperandText.textContent = prevOperand);
  }
}

function isValidOperation(value: string): value is Operation {
  return value === "+" || value === "-" || value === "x" || value === "/";
}

function selectOperation(operator: Operation) {
  if (prevOperand !== "") {
    calculatorOperation();
  }
  operation = operator;
  prevOperand = currentOperand;
  currentOperand = "0"; // réinitialiser l'opérande actuelle après sélection de l'opérateur
}

function calculatorOperation() {
  if (!prevOperand || !currentOperand || !operation) return;

  let result;
  let current = parseFloat(currentOperand);
  let prev = parseFloat(prevOperand);

  switch (operation) {
    case "/":
      if (current === 0) {
        hasError = true;
        errorMode("Désolé... Nous ne pouvons pas diviser par zéro");
        return;
      }
      result = prev / current;
      break;

    case "x":
      result = prev * current;
      break;

    case "-":
      result = prev - current;
      break;

    case "+":
      result = prev + current;
      break;
  }

  if (result !== undefined) {
    currentOperand = result.toString();
    prevOperand = "";
    operation = undefined;
  }
}

function reset() {
  prevOperand = "";
  currentOperand = "0";
  operation = undefined;
  displayNumber();
}

function resetCurrent() {
  currentOperand = "0";
  displayNumber();
}

function deleteNumber() {
  if (!currentOperand || currentOperand === "0") return;
  if (currentOperand.length === 1 || currentOperand === "-0.") {
    currentOperand = "0";
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
  displayNumber();
}

function percentage() {
  if (currentOperand) {
    currentOperand = `${parseFloat(currentOperand) / 100}`;
    displayNumber();
  }
}

function invertCurrentNumber() {
  if (currentOperand && currentOperand !== "0") {
    currentOperand = `${1 / parseFloat(currentOperand)}`;
    displayNumber();
  }
}

function calculateSquare() {
  if (currentOperand) {
    currentOperand = `${parseFloat(currentOperand) ** 2}`;
    displayNumber();
  }
}

function calculateSqrt() {
  if (currentOperand) {
    currentOperand = `${Math.sqrt(parseFloat(currentOperand))}`;
    displayNumber();
  }
}

function errorMode(error: string) {
  if (errorText && hasError) {
    errorText.textContent = error;
    currentOperand = "";
    const buttonsToDisable = [
      percentBtn,
      invertBtn,
      squareBtn,
      squareRootBtn,
      ...operatorBtn,
      negateBtn,
      dotBtn,
    ];
    buttonsToDisable.forEach((btn) => btn?.setAttribute("disabled", ""));
  }
}

function clearError() {
  if (hasError) {
    hasError = false;
    errorText && (errorText.textContent = "");
    const buttonsToEnable = [
      percentBtn,
      invertBtn,
      squareBtn,
      squareRootBtn,
      ...operatorBtn,
      negateBtn,
      dotBtn,
    ];
    buttonsToEnable.forEach((btn) => btn?.removeAttribute("disabled"));
  }
}

// ----- Événements au clic
[resetBtn, resetCurrentBtn].forEach((button) => {
  button?.addEventListener("click", () => {
    clearError();
    button.textContent === "CE" ? resetCurrent() : reset();
    displayNumber();
  });
});

deleteBtn?.addEventListener("click", () => {
  clearError();
  deleteNumber();
});

percentBtn?.addEventListener("click", () => {
  clearError();
  percentage();
});

invertBtn?.addEventListener("click", () => {
  clearError();
  invertCurrentNumber();
});

squareBtn?.addEventListener("click", () => {
  clearError();
  calculateSquare();
});

squareRootBtn?.addEventListener("click", () => {
  clearError();
  calculateSqrt();
});

operands.forEach((operand) => {
  operand.addEventListener("click", () => {
    clearError();
    addNumber(operand.textContent || "");
    displayNumber();
  });
});

operatorBtn.forEach((button) => {
  button.addEventListener("click", () => {
    clearError();

    const operation = button.textContent || "";
    if (isValidOperation(operation)) {
      selectOperation(operation);
      displayNumber();
    }
  });
});

negateBtn?.addEventListener("click", () => {
  if (!currentOperand || currentOperand === "0") return;
  currentOperand =
    currentOperand.charAt(0) !== "-"
      ? `-${currentOperand}`
      : currentOperand.slice(1);
  displayNumber();
});

resultBtn?.addEventListener("click", () => {
  if (hasError) return;
  calculatorOperation();
  displayNumber();
});
