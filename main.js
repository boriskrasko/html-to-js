const inputHtml = document.querySelector('.input');
const outputJavaScript = document.querySelector('.output');
const convertBtn = document.querySelector('.convert-btn');

const signs = ['\n', '<', ' ',];

let lastCharOfString;
let stringFromHtmlCode;
let trimmedString;
let opennigTag;
let tagName;
let indexOfSpace;
let hasClass;
let classContent;
let classesCount = 0;
let className;
let classContentBeforeTrimming;

inputHtml.value = `<div class="container flex-box greeting">          
 <h1 class="title"></h1>
 <h2 class="subtitle"></h2>
 <ul class="list items">
  <li></li>
  <li></li>
 </ul>
</div>`;

let getLastCharOfString = (x) => {
 lastCharOfString = x.indexOf(`\n`);
}

let getStringFromHtmlCode = () => {
  stringFromHtmlCode = inputHtml.value.slice(0, lastCharOfString);
}

let removeFirstStringFromHtml = () => {
  inputHtml.value = inputHtml.value.replace(stringFromHtmlCode + signs[0], '');
}

let getTrimmedString = () => {
  trimmedString = stringFromHtmlCode.trim();
}

let getIndexOfChar = (str, char) => {
  indexOfChar = str.indexOf(char);
}

let createDOMElement = () => {
  outputJavaScript.value += `const name = document.createElement('${tagName}');\n`;
  trimmedString = trimmedString.replace(`${tagName}`, '');
}

let checkClass = () => {
  hasClass = (trimmedString.indexOf('class') !== -1) ? true : false;
}

let getClassContent =  () => {
 classContent = trimmedString.slice(trimmedString.indexOf('="') + 2, trimmedString.lastIndexOf('"'));
}

let removeExtraSpacesFromClassContent = () => {
  classContentBeforeTrimming = classContent;
  classContent = classContent.replace(/ +/g, ' ').trim();
}

let checkClassesCount = () => {
  classesCount = 1;
  getClassContent();
  classContent = classContent.trim()
  if (classContent.indexOf(' ') === -1) {
    classesCount = 1;
  } else {
    removeExtraSpacesFromClassContent();
    for (let i = 0; i < classContent.length; i++) {
      if (classContent[i] == ' ') {
        classesCount++;
      }
    }
  }
}

let checkAttributes = () => {
 hasAttr = (trimmedString.indexOf(`"`) !== -1) ? true : false;
 console.log(hasAttr);
}

let addClassToElement = () => {
  outputJavaScript.value += `name.classList.add('${className}');\n`;
  trimmedString = trimmedString.replace(`class="${classContentBeforeTrimming}"`, '');
  console.log(trimmedString);
  checkAttributes();
}

let getClassName = () => {
  className = classContent;
  addClassToElement();
}

let addClassesToElement = () => {
  className = classNames;
  addClassToElement();
}

let getClassNames = () => {
  re = / /gi;
  classNames = classContent.replace(re, `', '`);
  addClassesToElement();
}

let getAttr = () => {
  checkClass();
  if (hasClass) {
    console.log('has class');
    checkClassesCount();
    if (classesCount === 1) {
      getClassName();
    } else {
      getClassNames();
    }
  } else {
    console.log('doesn`t class');
    //
  }
}

let checkRightTagName = () => {
  isTagNameRight = /\W/.test(tagName) + /\d/.test(tagName) + /-/.test(tagName);
  console.log(isTagNameRight)
};

let getOpennigTag = () => {
  getTrimmedString()
  if (trimmedString[0] !== signs[1]) {
    outputJavaScript.value =  `Your code must start with the '<'`;
  } else if (trimmedString[1] == signs[2]) {
    outputJavaScript.value = `There can be no space after '<'`;
  } else {
    getIndexOfChar(trimmedString, ' ');
    indexOfSpace = indexOfChar;
    if (indexOfSpace === -1) {
      if (trimmedString[trimmedString.length - 1] == '>') {
        opennigTag = trimmedString.slice(1, trimmedString.length - 1);
        tagName = opennigTag;
        createDOMElement();
      }
    } else {
       opennigTag = trimmedString.slice(1, indexOfSpace);
       tagName = opennigTag;
       checkRightTagName();
       if (!isTagNameRight) {
        createDOMElement();
        getAttr();
       } else {
          outputJavaScript.value += `Incorrect tag name`;
       }
    }
  }
}

getLastCharOfString(inputHtml.value);
getStringFromHtmlCode();
getOpennigTag();
// removeFirstStringFromHtml();

// console.log(stringFromHtmlCode);
// console.log(inputHtml.value);
