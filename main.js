const inputHtml = document.querySelector('.input');
const outputJavaScript = document.querySelector('.output');
const convertBtn = document.querySelector('.convert-btn');
const copyBtn = document.querySelector('.copy-btn');
const tooltip = document.getElementById("myTooltip");

const signs = ['\n', '<', ' ', ];

const singletonTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'param', 'source', 'track', 'wbr'];

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
let stackOfClosingTags = [];
let isSingletonTags;
let firstIndexOfComment;
let lastIndexOfComment;
let comment;
let attr;

let getLastCharOfString = (x) => {
  lastCharOfString = x.indexOf(`\n`);
}

let checkSingletonTags = (tag) => {
  let x = false;
  for (let i = 0; i < singletonTags.length; i++) {
    if (singletonTags[i] == tagName) {
      x = true;
    }
  }
  isSingletonTags = x;
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
    checkSingletonTags();
    if (!isSingletonTags) {
      tagToClose = tagName;
      parent = name;
      stackOfClosingTags.push(name);
    }
  }
}

let getName = () => {
  name = `${tagName}_${randomId}`;
}

let createDOMElement = () => {
  getName();
  outputJavaScript.value += `const ${name} = document.createElement('${tagName}');\n`;
  trimmedString = trimmedString.replace(`${tagName}`, '');
}

let checkClass = () => {
  hasClass = (trimmedString.indexOf('class') !== -1) ? true : false;
}

let getClassContent = () => {
  let startIndex = trimmedString.indexOf('class="') + 7;
  trimmedString = trimmedString.replace(/ +"/g, '"').trim();
  classContent = trimmedString.slice(startIndex, trimmedString.indexOf('"', startIndex));
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
    removeExtraSpacesFromClassContent();
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
  if (parent === undefined) parent = `document.body`;
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
    if (closingTagName === tagName) {}
  }
}

let addTextContentToElement = () => {
  if (textContent.indexOf('&#') == -1) {
    outputJavaScript.value += `${parent}.textContent = '${textContent}';\n`;
  } else {
    outputJavaScript.value += `${parent}.innerHTML = '${textContent}';\n`;
  }
  if (trimmedString[0] !== signs[1]) {
    removeFirstStringFromHtml();
    getLastCharOfString(inputHtml.value);
    getStringFromHtmlCode();
    getOpennigTag();
  } else {
    addChildToParent();
  }
}

let checkTextContent = () => {
  checkClosingTag();
  let startIndex = trimmedString.indexOf('>') + 1;
  if (hasClosingTag) {
    textContent = trimmedString.slice(startIndex, trimmedString.lastIndexOf('</'))
  } else {
    textContent = trimmedString.slice(startIndex)
  }
  if (textContent === '' || textContent === ' ') {
    addChildToParent();
  } else if (textContent.trim()[0] == '<') {
    trimmedString = textContent;
    addChildToParent();
  } else {
    addTextContentToElement();
  }
}

let checkAttributesWithoutValue = () => {
  if (trimmedString.indexOf('<') !== -1) {
    trimmedString = trimmedString.replace('<', ``);
    trimmedString = trimmedString.replace('>', ``);
    trimmedString = trimmedString.trim();
  }
  if (trimmedString.length === 0) {
    checkTextContent();
  } else if (trimmedString.indexOf(' ') !== -1) {
    attr = trimmedString.slice(0, trimmedString.indexOf(' '))
    trimmedString = trimmedString.replace(attr, ``);
    trimmedString = trimmedString.trim();
    outputJavaScript.value += `${name}.setAttribute('${attr}', '');\n`;
    checkAttributesWithoutValue();
  }
  else {
    attr = trimmedString;
    outputJavaScript.value += `${name}.setAttribute('${attr}', '');\n`
    trimmedString = trimmedString.replace(attr, ``);
    trimmedString = trimmedString.trim();
    checkTextContent();
  }
}

let checkAttributes = () => {
  hasAttr = (trimmedString.indexOf(`"`) !== -1) ? true : false;
  if (hasAttr) {
    getAttrName();
  } else {
    checkAttributesWithoutValue();
  }
}

let addClassToElement = () => {
  className.trim();
  if (className.length !== 0) {
    outputJavaScript.value += `${name}.classList.add('${className}');\n`;
    // if (classesCount > 1) {
      trimmedString = trimmedString.replace(`class="${classContentBeforeTrimming}"`, '');
      console.log(classContentBeforeTrimming);
    // } else {
    //   trimmedString = trimmedString.replace(`class="${classContent}"`, '');
    // }
    checkAttributes();
  } else {
    trimmedString = trimmedString.replace(`class="${classContent}"`, '');
    checkAttributes();
  }
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

let addSrcToElement = () => {
  outputJavaScript.value += `${name}.src = '${attrValue}';\n`;
}

let getAttrValue = () => {
  let startIndex = trimmedString.indexOf('="') + 2;
  attrValue = trimmedString.slice(startIndex, trimmedString.indexOf('"', startIndex));
  trimmedString = trimmedString.replace(`${attrName}="${attrValue}"`, '');
  if (attrName == 'src') {
    addSrcToElement();
    checkAttributes();
  } else {
    addIdToElement();
    checkAttributes();
  }
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
    checkAttributes();
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
    stackOfClosingTags.pop();
    parent = stackOfClosingTags[stackOfClosingTags.length - 1];
    removeFirstStringFromHtml();
    getLastCharOfString(inputHtml.value);
    getStringFromHtmlCode();
    getOpennigTag();
  } else {
    trimmedString = trimmedString.replace('>', ' >');
    if (trimmedString.indexOf('Done') !== -1) {
      outputJavaScript.value += ``;
    } else if (trimmedString[0] !== signs[1]) {
      textContent = trimmedString;
      addTextContentToElement();
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
          }
        }
      }
    }
  }
}

let copyResult = () => {
  outputJavaScript.select();
  outputJavaScript.setSelectionRange(0, 99999);
  document.execCommand('copy');

  tooltip.innerHTML = `Copied`;
}

let outFunc = () => {
  tooltip.innerHTML = `Copy to clipboard`;
}

copyBtn.addEventListener('click', copyResult);
copyBtn.addEventListener('mouseout', outFunc);

convertBtn.addEventListener('click', () => {
  inputHtml.value = inputHtml.value.replace(/</gi, `\n<`);
  inputHtml.value = inputHtml.value.replace(/>/gi, `>\n`);
  while (firstIndexOfComment !== -1) {
    firstIndexOfComment = inputHtml.value.indexOf('<!--');
    lastIndexOfComment = inputHtml.value.indexOf('-->') + 4;
    comment = inputHtml.value.slice(firstIndexOfComment, lastIndexOfComment);
    inputHtml.value = inputHtml.value.replace(comment, ``);
  }
  inputHtml.value = inputHtml.value.replace(/^\s*[\r\n]/gm, ``);
  inputHtml.value += 'Done!\n';
  if (inputHtml.value[0] !== signs[1]) {
    outputJavaScript.value +=  `Your code must start with the '<'\n`;
  } else if (inputHtml.value[1] == signs[2]) {
    outputJavaScript.value += `There can be no space after '<'\n`;
  } else {
    getLastCharOfString(inputHtml.value);
    getStringFromHtmlCode();
    getOpennigTag();
  }
})
