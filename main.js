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
let name;
let parent;
let tagToClose;
let randomId;

let getLastCharOfString = (x) => {
 lastCharOfString = x.indexOf(`\n`);
}

let createId = (length) => {
  randomId = ``;
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
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

let getParent = () => {
  checkClosingTag();
  if (!hasClosingTag) {
    tagToClose = tagName;
    console.log('tagToClose = ' + tagToClose);
    parent = name;
  } else {
     if (closingTagName == tagToClose) {

     }
  }
}

let getName = () => {
  name = `${tagName}_${randomId}`;
}

let createDOMElement = () => {
  getName();
  console.log(`tagName = ${tagName}`);
  outputJavaScript.value += `const ${name} = document.createElement('${tagName}');\n`;
  trimmedString = trimmedString.replace(`${tagName}`, '');
}

let checkClass = () => {
  hasClass = (trimmedString.indexOf('class') !== -1) ? true : false;
}

let getClassContent =  () => {
 let startIndex = trimmedString.indexOf('class="') + 7;
 trimmedString = trimmedString.replace(/ +"/g, '"').trim();
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

let addChildToParent = () => {
 outputJavaScript.value += `${parent}.appendChild(${name});\n`;
 getParent();
 removeFirstStringFromHtml();
 getLastCharOfString(inputHtml.value);
 getStringFromHtmlCode();
 getOpennigTag();
}

let checkClosingTag = () => {
  hasClosingTag = (trimmedString.indexOf('</') !== -1) ? true : false;
  if (hasClosingTag) {
    let startIndex = trimmedString.indexOf('</') + 2
    closingTagName = trimmedString.slice(startIndex, trimmedString.indexOf('>', startIndex));
    if (closingTagName === tagName) {
    }
  }
}

let addTextContentToElement = () => {
  outputJavaScript.value += `${name}.textContent = '${textContent}';\n`;
  addChildToParent();
}

let checkTextContent = () => {
 checkClosingTag();
 let startIndex = trimmedString.indexOf('>') + 1;
 if (hasClosingTag) {
  textContent = trimmedString.slice(startIndex, trimmedString.indexOf('</', startIndex))
 } else {
   textContent = trimmedString.slice(startIndex)
 }
 if (textContent === '' || textContent === ' ') {
  addChildToParent();
 } else {
  addTextContentToElement();
 }
}

let checkAttributes = () => {
 hasAttr = (trimmedString.indexOf(`"`) !== -1) ? true : false;
 if (hasAttr) {
  getAttr();
 } else {
  checkTextContent();
  // addChildToParent();
 }
}

let addClassToElement = () => {
  outputJavaScript.value += `${name}.classList.add('${className}');\n`;
  if (classesCount > 1) {
    trimmedString = trimmedString.replace(`class="${classContentBeforeTrimming}"`, '');
  } else {
    trimmedString = trimmedString.replace(`class="${classContent}"`, '');
  }
  checkAttributes();
  // addChildToParent();
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
   outputJavaScript.value += `${name}.setAttribute('${attrName}', '${attrValue}');\n`;
}

let getAttrValue = () => {
  let startIndex = trimmedString.indexOf('="') + 2;
  attrValue = trimmedString.slice(startIndex, trimmedString.indexOf('"', startIndex));
  trimmedString = trimmedString.replace(`${attrName}="${attrValue}"`, '');
  addIdToElement();
  checkAttributes();
}

let getAttrName = () => {
  let startIndex = trimmedString.indexOf('=');
  if (startIndex !== -1) {
    attrName = trimmedString.slice(trimmedString.lastIndexOf(' ', startIndex - 2) + 1, startIndex);
    attrName = attrName.trim();
    getAttrValue();
  } else {
    checkTextContent();
  }
}

let getAttr = () => {
  checkClass();
  if (hasClass) {
    checkClassesCount();
    if (classesCount === 1) {
      getClassName();
    } else {
      getClassNames();
    }
  } else {
    getAttrName();
  }
}

let checkRightTagName = () => {
  isTagNameRight = /\W/.test(tagName) + /-/.test(tagName);
};

let getOpennigTag = () => {
  getTrimmedString();
  createId(5);
  if (trimmedString[1] === '/') {
    getParent();
    removeFirstStringFromHtml();
    getLastCharOfString(inputHtml.value);
    getStringFromHtmlCode();
    getOpennigTag();
    // getOpennigTag();
  } else {
    trimmedString = trimmedString.replace('>', ' >');
  if (trimmedString[0] !== signs[1]) {
    outputJavaScript.value +=  `Your code must start with the '<'\n`;
  } else if (trimmedString[1] == signs[2]) {
    outputJavaScript.value += `There can be no space after '<'\n`;
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
          if (tagName[0] !== '/') {
            outputJavaScript.value += `Incorrect tag name\n`;
          } else {
            getParent();
          }
        }
      }
    }
  } 
}

convertBtn.addEventListener('click', () => {
  inputHtml.value += '\n//';
  getLastCharOfString(inputHtml.value);
  getStringFromHtmlCode();
  getOpennigTag();
})
