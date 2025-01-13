// css classes
const cssBtnTxt = "btn-txt";
const cssBtn = "btn"

// extension names
const extPX = "px";
const extBTN = "-btn";
const extTXT = "-txt";

// html ids
const mainDiv = "main";
const promptDiv = "prompt";
const gameDiv = "game";
const formDiv = "gameForm";
const questionLabel = "question";
const submitLabel = "submitButton";
const numButtonsLabel = "numOfButtons";

// events
const eventClick = "click";
const eventSubmit = "submit";
const endInterval = 500;
const timeBetweenMoves = 2000; // 2 seconds

// other constants
const minButtons = 3;
const maxButtons = 7;

// This class handles the text label for each button.
class ButtonText {
    constructor(id) {
        this.id = id;
        this.elemID = id + extTXT;
    }

    initText() {
        const textElem = document.createElement("p");
        textElem.id = this.elemID
        textElem.classList.add(cssBtnTxt);
        textElem.textContent = this.id;
        return textElem;
    }

    hideText() {
        const textElem = document.getElementById(this.elemID);
        textElem.style.opacity = 0;
    }

    displayText() {
        const textElem = document.getElementById(this.elemID);
        textElem.style.opacity = 100;
    }
}

class Button {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.elemID = id + extBTN;
        this.txt = new ButtonText(id);
    }

    initButton() {
        const btnElem = document.createElement("button");
        btnElem.id = this.elemID;
        btnElem.style.backgroundColor = this.color;
        btnElem.classList.add(cssBtn);
        const textElem = this.txt.initText();
        btnElem.append(textElem);
        return btnElem;
    }

    setLocation(top, left) {
        this.top = top;
        this.left = left;
        const btnElem = document.getElementById(this.elemID);

        // need this after init or else buttons overlap at the beginning.
        btnElem.style.position = "absolute";
        btnElem.style.top = this.top + extPX;
        btnElem.style.left = this.left + extPX;
    }

    moveRandom() {
        const btnElem = document.getElementById(this.elemID);

        // Set range to account for the button size.
        const maxW = document.getElementById(mainDiv).clientWidth - btnElem.clientWidth;
        const maxH = window.innerHeight - btnElem.clientHeight;

        this.setLocation(
            Math.floor(Math.random() * maxH),
            Math.floor(Math.random() * maxW)
        );
    }
}

class Game {
    constructor() {
        this.initGame();
    }

    // initializes the game. Also acts as a clear function
    initGame() {
        this.buttons = [];
        this.selected = [];
        this.numButtons = 0;
    }
    
    resetGame() {
        this.initGame();
        document.getElementById(promptDiv).style.display = "none";
        document.getElementById(gameDiv).innerHTML = "";
    }

    endGame() {
        this.initGame();
        document.getElementById(promptDiv).style.display = "flex";
        document.getElementById(gameDiv).innerHTML = "";
    }

    randomColor() {
        // This snippet is from chatgpt.
        return "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0");
    }

    addButtons(n) {
        for (let i = 1; i <= n; i++) {
            const col = this.randomColor();
            this.buttons.push(new Button(i, col));
        }
    }

    // adds buttons to the game dom
    displayButtons() {
        const game = document.getElementById(gameDiv);
        this.buttons.forEach((btn) => {
            game.appendChild(btn.initButton());
        });
    }

    hideText() {
        this.buttons.forEach((btn) => {
            btn.txt.hideText();
        });
    }

    displayText() {
        this.buttons.forEach((btn) => {
            btn.txt.displayText();
        });
    }

    disableClick(btn) {
        const btnElem = document.getElementById(btn.elemID);
        btnElem.disabled = true;
    }

    handleClick(btn) {
        this.selected.push(btn);
        let currentIndex = this.selected.length;

        btn.txt.displayText();
        this.disableClick(btn);
        
        if (currentIndex === this.numButtons) {
            setTimeout(() => {
                alert(messages.winMessage);
                this.endGame();
            }, endInterval);
        } else if (currentIndex != btn.id) {
            this.displayText();
            setTimeout(() => {
                alert(messages.wrongMessage);
                this.endGame();
            }, endInterval);
        }
    }

    allowClick() {
        this.buttons.forEach((btn) => {
            const btnElem = document.getElementById(btn.elemID);
            btnElem.addEventListener(eventClick, () => this.handleClick(btn));
        });
    }
    
    randomMovement() {
        this.buttons.forEach((btn) => {
            btn.moveRandom();
        });
    }

    repeatMovement(n) {
        let count = 0;
        let interval = setInterval(() => {
            if (++count >= n) {
                this.hideText();
                this.allowClick();
                clearInterval(interval);
            }
            this.randomMovement();
        }, timeBetweenMoves);
    }

    startGame(n) {
        this.resetGame();
        this.addButtons(n);
        this.numButtons = this.buttons.length;
        this.displayButtons();
        setTimeout(() => {
            this.repeatMovement(n);
        }, (n - 2) * 1000);
    }
}

class UI {
    constructor() {
        this.game = new Game();
        this.initUI();
    }

    initUI() {
        document.getElementById(questionLabel).innerHTML = messages.inputPrompt;
        document.getElementById(submitLabel).innerHTML = messages.gameStartBtn;
        document.getElementById(formDiv).addEventListener(eventSubmit, (e) => this.handleSubmit(e));
    }

    validateInput(n) {
        if (!isNaN(n) && n >= minButtons && n <= maxButtons) {
            return true;
        }
        return false;
    }

    handleSubmit(e) {
        e.preventDefault();
        const input = document.getElementById(numButtonsLabel);
        const n = input.value;
        if (this.validateInput(n)) {
            this.game.startGame(n);
        } else {
            alert(messages.promptError);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new UI();
});
