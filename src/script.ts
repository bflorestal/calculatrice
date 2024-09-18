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
// Ligne 1
const percentBtn = document.querySelector("[data-percent]");
const resetCurrentBtn = document.querySelector("[data-ce]");
const resetBtn = document.querySelector("[data-c]");
const deleteBtn = document.querySelector("[data-delete]");

if (!resetBtn || !resetCurrentBtn) {
    throw new Error("Unexpected error: Missing reset button element(s)");
}
// Ligne 2
const invertBtn = document.querySelector("[data-invert]");
const squareBtn = document.querySelector("[data-square]");
const squareRootBtn = document.querySelector("[data-sqrt]");
// Opérateurs
const operatorBtn = document.querySelectorAll("[data-operator]");
// Opposé (±)
const negateBtn = document.querySelector("[data-negate]");
// Afficher le résultat
const resultBtn = document.querySelector("[data-result]");
// Chiffres + point
const operands = document.querySelectorAll("[data-num]");
const dotBtn = document.querySelector("[data-dot]");
//
let prevOperand = prevOperandText.textContent;
let currentOperand = currentOperandText.textContent;
let operation: string | undefined;
// Mode erreur
let hasError = false;

// ----- Fonctions
function addNumber(number: string) {
    if (currentOperand?.includes(".") && number === ".") return;
    if (currentOperand === "0" && number === "0") return;

    if (currentOperand === "0" && number === ".") {
        currentOperand += number;
        return;
    }

    currentOperand === "0" ? currentOperand = number : currentOperand += number;
}

function displayNumber() {
    if (!currentOperandText) return;
    currentOperandText.textContent = currentOperand;

    // Si l'utilisateur choisit un opérateur, affiche l'opérande précédente et l'opérateur
    if (operation !== undefined) {
        prevOperandText && (prevOperandText.textContent = `${prevOperand} ${operation}`);
    } else {
        // prevOperandText && (prevOperandText.textContent += ` ${prevOperand}`);
        prevOperandText && (prevOperandText.textContent = prevOperand);
    }
}

function operationSelection(operator: string) {
    // S'il y a quelque chose en haut, effectuer l'opération
    if (prevOperand !== "") {
        calculatorOperation();
    }
    operation = operator;
    prevOperand = currentOperand;
}

function calculatorOperation() {
    if (!prevOperand || !currentOperand) return;
    let result;
    let current = parseFloat(currentOperand);
    // prevOperand ? prev = parseFloat(prevOperand) : prev = "???"
    let prev = parseFloat(prevOperand);

    switch (operation) {
        case "/":
            // Erreurs si division par 0
            if (current === 0) {
                hasError = true;
                prev === 0 ? errorMode("Le résultat est indéfini") : errorMode("Désolé... Nous ne pouvons pas diviser par zéro");
            } else {
                result = prev / current;
            }
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

    if (result) {
        currentOperand = result.toString();
        prevOperand = current.toString();
    }

    operation = undefined;
}

function reset() {
    prevOperand = "";
    currentOperand = "0";
    operation = undefined;
}

function resetCurrent() {
    currentOperand = "0";
    displayNumber();
}

function deleteNumber() {
    if (!currentOperand || currentOperand === "0") return;
    // Remettre à 0 s'il n'y a plus qu'un chiffre
    if (currentOperand.length === 1 || currentOperand === "-0.") {
        currentOperand = "0";
        displayNumber();
        return;
    }
    currentOperand = currentOperand.slice(0, -1);
    displayNumber();
}

function percentage(operand: string) {
    currentOperand = `${parseFloat(operand) / 100}`;
}

function invertNumber(operand: string) {
    if (currentOperand === "0") return;
    currentOperand = `${1 / (parseFloat(operand))}`;
}

function square(operand: string) {
    if (prevOperand === "") {
        prevOperandText && (prevOperandText.textContent = `sqr( ${operand} )`);
        currentOperand = `${parseFloat(operand) ** 2}`;
        prevOperand = currentOperand;
        // ...
    } else {
        // ...
    }
}

function squareRoot(operand: string) {
    if (prevOperand === "") {
        prevOperandText && (prevOperandText.textContent = `√( ${operand} )`);
        currentOperand = `${Math.sqrt(parseFloat(operand))}`;
        prevOperand = currentOperand;
        // ...
    } else {
        // ...
    }
}

// ----- Mode erreur
function errorMode(error: string) {
    if (!errorText) return;
    if (!hasError) return;

    // peut-être à mettre dans une autre fonction, qui ferait que
    // s'il y a une erreur on désactive, sinon on réactive
    const buttonsToDisable = [percentBtn, invertBtn, squareBtn, squareRootBtn, ...operatorBtn, negateBtn, dotBtn];

    // Affiche le message d'erreur
    errorText.textContent = error;
    currentOperand = "";

    // Désactive les boutons sauf reset, delete, chiffres et =
    // https://bobbyhadz.com/blog/typescript-disable-button
    buttonsToDisable.forEach(btn => btn?.setAttribute("disabled", ""));

    // Réactiver les boutons et mettre hasError à false au clic sur un bouton de
    // [...document.querySelectorAll("button")].filter(btn => btn.disabled === false)
    // hasError &&= false;
}

// ----- Événements au clic
// Boutons reset (CE et C)
for (const button of [resetBtn, resetCurrentBtn]) {
    button.addEventListener("click", () => {
        hasError &&= false;
        button.textContent === "CE" ? resetCurrent() : reset();
        displayNumber();
    })
}

// Bouton delete ()
deleteBtn?.addEventListener("click", () => {
    hasError &&= false;
    deleteNumber();
})

// Bouton pourcentage (%)
percentBtn?.addEventListener("click", () => {
    currentOperand && (percentage(currentOperand));
    displayNumber();
})

// Bouton inverse (1/x)
invertBtn?.addEventListener("click", () => {
    currentOperand && (invertNumber(currentOperand));
    displayNumber();
})

// Bouton carré (²)
squareBtn?.addEventListener("click", () => {
    currentOperand && (square(currentOperand));
    displayNumber();
})

// Bouton racine carrée (√x)
squareRootBtn?.addEventListener("click", () => {
    currentOperand && (squareRoot(currentOperand));
    displayNumber();
})

// Chiffre ou point
operands.forEach(operand => {
    operand.addEventListener("click", () => {
        hasError &&= false;
        operand.textContent && (addNumber(operand.textContent));
        // Affiche le chiffre à l'écran
        displayNumber();
    })
})

// Opérateurs
operatorBtn.forEach(button => {
    button.addEventListener("click", () => {
        button.textContent && (operationSelection(button.textContent));
        displayNumber();
    })
})

// Bouton opposé (±)
negateBtn?.addEventListener("click", () => {
    if (!currentOperand || currentOperand === "0") return;

    // if (prevOperand === "") {
        // Si le nombre est positif, il devient négatif
        if (currentOperand.charAt(0) !== "-") {
            currentOperand = currentOperand.replace(/^/gm, "-");
        // Si le nombre est négatif, il devient positif
        } else if (currentOperand.charAt(0) === "-") {
            currentOperand = currentOperand.replace(/^-/gm, "");
        }
    // } else {
        // ... 
    // }

    displayNumber();
})

// Bouton égal (=)
resultBtn?.addEventListener("click", () => {
    hasError ? hasError = false : calculatorOperation();
    displayNumber();
})