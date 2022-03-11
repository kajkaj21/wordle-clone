"use strict";

const keyboard = document.querySelector(".keyboard");
const inputFields = document.querySelector(".input-fields");
const infoIcon = document.querySelector(".info");
const infoContainer = document.querySelector(".info-container");
const btnCloseInfo = document.querySelector(".btn-close-info");
const resultContainer = document.querySelector(".result-container");
const result = document.querySelector(".result");
const btnResult = document.querySelector(".btn-result");
const gameContainer = document.querySelector(".game-container");
const wrongWordMessage = document.querySelector(".error-message");

import { dictionary } from "./dictionary.js";

// console.log(dictionary);

const alphabet = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "BACKSPACE",
  "ENTER",
];

const randomWord =
  dictionary[Math.floor(Math.random() * dictionary.length)].toUpperCase();

// console.log(randomWord);

const userWord = [];
let letterPosition = 0;
let wordEl = 0;
let isGuessed = false;
let isInfoVisible = false;
const wordToBeGuessed = [...randomWord];

function createKeyboard(arr) {
  alphabet.forEach((letter) => {
    const letterContainer = document.createElement("div");

    letterContainer.classList.add("letter-container");
    letterContainer.classList.add("keyboard-key");

    letterContainer.setAttribute("data-key-value", letter);

    letterContainer.innerText = letter;
    if (letter === "ENTER") letterContainer.classList.add("enter");
    if (letter === "BACKSPACE") {
      letterContainer.innerHTML = '<i class="fas fa-backspace"></i>';
      letterContainer.classList.add("back");
    }

    keyboard.appendChild(letterContainer);

    letterContainer.addEventListener("click", () => {
      if (userWord.length < 5 && letter !== "BACKSPACE" && letter !== "ENTER") {
        addLetter(letter);
      }
      if (letter === "BACKSPACE") {
        if (userWord.length === 0) return;
        userWord.splice(-1);
        letterPosition--;
        inputFields.children[wordEl].children[letterPosition].innerText = "";
      }
      if (userWord.length === 5 && letter === "ENTER") {
        checkIfIncludes() ? applyWord() : displayWrongWordError();
      }
      console.log(userWord);
    });
  });
}

createKeyboard(alphabet);

window.addEventListener("keyup", (e) => {
  if (isInfoVisible) return;
  if (userWord.length < 5 && wordEl < 6 && e.keyCode >= 65 && e.keyCode <= 90) {
    addLetter(e.key.toUpperCase());
  }
  if (e.key === "Backspace") {
    removeLetter();
  }

  if (userWord.length === 5 && e.key === "Enter") {
    checkIfIncludes() ? applyWord() : displayWrongWordError();
  }
});

function addLetter(l) {
  if (!isGuessed) {
    userWord.push(l);
    inputFields.children[wordEl].children[letterPosition].innerText = l;
    letterPosition++;
  }
}

function removeLetter() {
  if (userWord.length === 0) return;
  userWord.splice(-1);
  letterPosition--;
  inputFields.children[wordEl].children[letterPosition].innerText = "";
}

function checkIfIncludes() {
  return dictionary.includes(userWord.join("").toLowerCase());
}

function applyWord() {
  const letters = inputFields.children[wordEl].children;
  for (const letter in letters) {
    if (letter <= letters.length) {
      if (letters[letter].innerText === wordToBeGuessed[letter]) {
        letters[letter].classList.add("correct");
        markKeyboardKey(letters[letter].innerText, "#fff", "#6aaa64");
      } else if (wordToBeGuessed.includes(letters[letter].innerText)) {
        letters[letter].classList.add("present");
        markKeyboardKey(letters[letter].innerText, "#fff", "#c9b458");
      } else {
        letters[letter].classList.add("absent");
        markKeyboardKey(letters[letter].innerText, "#fff", "grey");
      }
    }
  }

  checkIfGuessed();

  console.log(wordToBeGuessed);
  console.log(wordEl);
  wordEl++;
  letterPosition = 0;
  userWord.splice(0);

  if (wordEl >= 6 && !isGuessed) {
    displayResult("You didn't guess it");
  }
}

function displayResult(text) {
  resultContainer.style.display = "flex";
  result.childNodes[1].innerHTML = `${text}, the word is: <a href="https://www.scrabble-solver.com/define/${randomWord}" target="_blank"> ${randomWord} </a>`;
}

function checkIfGuessed() {
  if (
    userWord.join("").toUpperCase() === wordToBeGuessed.join("").toUpperCase()
  ) {
    isGuessed = true;
    displayResult("You guessed it");
  }
  console.log(isGuessed);
}

function displayWrongWordError() {
  wrongWordMessage.style.opacity = 1;
  setTimeout(() => {
    wrongWordMessage.style.opacity = 0;
  }, 1000);
}

// BUTTON EVENTS
infoIcon.addEventListener("click", () => {
  infoContainer.style.display = "block";
  isInfoVisible = true;
});

btnCloseInfo.addEventListener("click", () => {
  infoContainer.style.display = "none";
  isInfoVisible = false;
});

const keyboardKeys = document.querySelectorAll(".keyboard-key");

function markKeyboardKey(letter, col, bacCol) {
  for (let i = 0; i < keyboardKeys.length; i++) {
    if (keyboardKeys[i].innerText.toUpperCase() === letter.toUpperCase()) {
      keyboardKeys[i].style.color = col;
      keyboardKeys[i].style.backgroundColor = bacCol;
    }
  }
}

function closeResult() {
  resultContainer.style.display = "none";
  const btnRefresh = document.createElement("button");
  btnRefresh.innerHTML = "New Game";
  btnRefresh.classList.add("button-refresh");
  gameContainer.insertBefore(btnRefresh, inputFields.nextSibling);
  btnRefresh.addEventListener("click", () => {
    window.location.reload(true);
  });
}

btnResult.addEventListener("click", () => {
  closeResult();
});

// window.addEventListener("keydown", (e) => {
//   if (e.key === "Escape") closeResult();
//   else return;
// });
