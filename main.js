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
let attrName;
let hasClosingTag;
let textContent;

inputHtml.value = `<div visibled id="art" class="container flex-box greeting w-12" style="border: 1px solid gray" title="main block">The Times      
 <h1 class="title"></h1>
 <h2 class="subtitle hello"></h2>
 <ul class="list items">
  <li> </li>
  <li> </li>
 </ul>
</div>`;
 // <h2 class="subtitle"></h2>
 // <ul class="list items">
 //  <li></li>
 //  <li></li>
 // </ul>

let getLastCharOfString = (x) => {
 lastCharOfString = x.indexOf(`\n`);
}

let getStringFromHtmlCode = () => {
  stringFromHtmlCode = inputHtml.value.slice(0, lastCharOfString);
}

let removeFirstStringFromHtml = () => {
  inputHtml.value = inputHtml.value.replace(stringFromHtmlCode + signs[0], '');
  getStringFromHtmlCode();
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
 let startIndex = trimmedString.indexOf('class="') + 7;
 trimmedString = trimmedString.replace(/ +"/g, '"').trim();
 console.log(classContent);
 classContent = trimmedString.slice(startIndex , trimmedString.indexOf('"', startIndex));
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

let addChildToParrent = () => {
 outputJavaScript.value += `parrent.appendChild(name);\n`;
 removeFirstStringFromHtml();
 // getLastCharOfString(inputHtml.value);
 // getStringFromHtmlCode();
 // getOpennigTag();
}

let checkClosingTag = () => {
  hasClosingTag = (trimmedString.indexOf('</') !== -1) ? true : false;
  if (hasClosingTag) {
    let startIndex = trimmedString.indexOf('</') + 2
    closingTagName = trimmedString.slice(startIndex, trimmedString.indexOf('>', startIndex));
    console.log(closingTagName);
    if (closingTagName === tagName) {
      console.log('closingTagName === tagName');
    }
  }
}

let checkTextContent = () => {
 checkClosingTag();
 let startIndex = trimmedString.indexOf('>') + 1;
 if (hasClosingTag) {
  textContent = trimmedString.slice(startIndex, trimmedString.indexOf('</', startIndex))
 } else {
   textContent = trimmedString.slice(startIndex, trimmedString.indexOf('\n', startIndex))
 }
 console.log(textContent);
 if (textContent === '' || textContent === ' ') {
  console.log('no text content');
 }
}

let checkAttributes = () => {
 hasAttr = (trimmedString.indexOf(`"`) !== -1) ? true : false;
 console.log(hasAttr);
 if (hasAttr) {
  getAttr();
 } else {
  checkTextContent();
  // addChildToParrent();
 }
}

let addClassToElement = () => {
  outputJavaScript.value += `name.classList.add('${className}');\n`;
  trimmedString = trimmedString.replace(`class="${classContentBeforeTrimming}"`, '');
  console.log(trimmedString);
  checkAttributes();
  // addChildToParrent();
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

let addIdToElement = () => {
   outputJavaScript.value += `name.setAttribute('${attrName}', '${attrValue}');\n`;
}

let getAttrValue = () => {
  let startIndex = trimmedString.indexOf('="') + 2;
  attrValue = trimmedString.slice(startIndex, trimmedString.indexOf('"', startIndex));
  console.log(attrValue);
  trimmedString = trimmedString.replace(`${attrName}="${attrValue}"`, '');
  console.log(trimmedString);
  addIdToElement();
  checkAttributes();
}

let getAttrName = () => {
  console.log(trimmedString);
  let startIndex = trimmedString.indexOf('=');
  attrName = trimmedString.slice(trimmedString.lastIndexOf(' ', startIndex - 2) + 1, startIndex);
  attrName = attrName.trim();
  console.log(attrName);
  getAttrValue();
}

let getAttr = () => {
  checkClass();
  if (hasClass) {
    console.log(`yes`)
    checkClassesCount();
    if (classesCount === 1) {
      getClassName();
    } else {
      getClassNames();
    }
  } else {
    console.log('doesn`t class');
    getAttrName();
  }
}

let checkRightTagName = () => {
  isTagNameRight = /\W/.test(tagName) + /-/.test(tagName);
};

let getOpennigTag = () => {
  getTrimmedString()
  if (trimmedString[0] !== signs[1]) {
    outputJavaScript.value =  `Your code must start with the '<'\n`;
  } else if (trimmedString[1] == signs[2]) {
    outputJavaScript.value = `There can be no space after '<'\n`;
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
          outputJavaScript.value += `Incorrect tag name\n`;
       }
    }
  }
}

getLastCharOfString(inputHtml.value);
getStringFromHtmlCode();
getOpennigTag();

// console.log(stringFromHtmlCode);
// console.log(inputHtml.value);
