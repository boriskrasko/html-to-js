const inputHTML = document.querySelector('.input');
const outputJS = document.querySelector('.output');
const convertBtn = document.querySelector('.convert-btn');

let indexOfOpeningTag;
let indexOfClosingTag;
let indexOfSpace;
let tagName;
let classNames;
let indexOfBeginningClassName;
let indexOfEndClassName;
let spacesCount;

let createElementDOM = () => {
 indexOfOpeningTag = inputHTML.value.indexOf('<');
 indexOfClosingTag = inputHTML.value.indexOf('>');
 indexOfSpace = inputHTML.value.indexOf(' ');

 if (indexOfSpace >= 0) {
  tagName = inputHTML.value.slice(indexOfOpeningTag + 1, indexOfSpace);
 } else {
  tagName = inputHTML.value.slice(indexOfOpeningTag + 1, indexOfClosingTag);
 }

 indexOfBeginningClassName = inputHTML.value.indexOf('class="');
 indexOfEndClassName = inputHTML.value.indexOf('"', indexOfBeginningClassName + 7);
 className = inputHTML.value.slice(indexOfBeginningClassName + 7,  indexOfEndClassName);
 let re = / /gi;
 let classNames = className.replace(re, "', '");

 if (indexOfOpeningTag >= 0) {
  outputJS.value = `const x = document.createElement('${tagName}');\n`;
  if(indexOfBeginningClassName > 0) outputJS.value += `x.classList.add('${classNames}');\n`;
  outputJS.value += `root.appendChild(x);`;
  if (inputHTML.value[indexOfClosingTag + 1] == '\n') console.log('new string');
 } else {
  outputJS.value = `The code isn't html`;
 }
}

convertBtn.addEventListener('click', createElementDOM)
