/* eslint-disable no-undef */
const inputHtml = document.querySelector('.input');
const outputJavaScript = document.querySelector('.output');
const convertBtn = document.querySelector('.convert-btn');
const copyBtn = document.querySelector('.copy-btn');
const tooltip = document.getElementById('myTooltip');

const singletonTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'param', 'source', 'track', 'wbr'];
const declarations = [];
const stackOfClosingTags = [];

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
let classNames;
let classContentBeforeTrimming;
let attrName;
let attrValue;
let hasClosingTag;
let textContent;
let name;
let parent;
let randomId;
let isSingletonTags;
let firstIndexOfComment;
let lastIndexOfComment;
let comment;
let attr;
let styles = [];
let property;
let propertyValue;
let propertyLego = [];
let indexOfChar;
let hasAttr;
let isTagNameRight;
let checkOpeningTag;
let getAttrName;

const getLastCharOfString = (x) => {
  lastCharOfString = x.indexOf('\n');
};

const checkSingletonTags = () => {
  let x = false;
  for (let i = 0; i < singletonTags.length; i += 1) {
    if (singletonTags[i] === tagName) {
      x = true;
    }
  }
  isSingletonTags = x;
};

const createId = (length) => {
  randomId = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i += 1) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
};

const getStringFromHtmlCode = () => {
  stringFromHtmlCode = inputHtml.value.slice(0, lastCharOfString);
};

const removeFirstStringFromHtml = () => {
  inputHtml.value = inputHtml.value.replace(`${stringFromHtmlCode}\n`, '');
  getStringFromHtmlCode();
};

const getTrimmedString = () => {
  trimmedString = stringFromHtmlCode.trim();
};

const getIndexOfChar = (str, char) => {
  indexOfChar = str.indexOf(char);
};

const getParent = () => {
  if (!hasClosingTag) {
    checkSingletonTags();
  }
  if (!isSingletonTags) {
    parent = name;
    stackOfClosingTags.push(name);
  }
};

const getName = () => {
  name = `${tagName}_${randomId}`;
};

const createDOMElement = () => {
  getName();
  if (tagName === 'img') {
    outputJavaScript.value += `const ${name} = new Image();\n`;
  } else {
    outputJavaScript.value += `const ${name} = document.createElement('${tagName}');\n`;
  }
  trimmedString = trimmedString.replace(`${tagName}`, '');
};

const checkClass = () => {
  hasClass = (trimmedString.indexOf('class') !== -1);
};

const getClassContent = () => {
  const startIndex = trimmedString.indexOf('class="') + 7;
  trimmedString = trimmedString.replace(/ +"/g, '"').trim();
  classContent = trimmedString.slice(startIndex, trimmedString.indexOf('"', startIndex));
};

const removeExtraSpacesFromClassContent = () => {
  classContentBeforeTrimming = classContent;
  classContent = classContent.replace(/ +/g, ' ').trim();
};

const checkClassesCount = () => {
  classesCount = 1;
  getClassContent();
  classContent = classContent.trim();
  if (classContent.indexOf(' ') === -1) {
    classesCount = 1;
    removeExtraSpacesFromClassContent();
  } else {
    removeExtraSpacesFromClassContent();
    for (let i = 0; i < classContent.length; i += 1) {
      if (classContent[i] === ' ') {
        classesCount += 1;
      }
    }
  }
};

const addChildToParent = () => {
  if (parent === undefined) parent = 'document.body';
  outputJavaScript.value += `${parent}.appendChild(${name});\n`;
  getParent();
  removeFirstStringFromHtml();
  getLastCharOfString(inputHtml.value);
  getStringFromHtmlCode();
  checkOpeningTag();
};

const addTextContentToElement = () => {
  if (textContent.indexOf('&#') === -1) {
    outputJavaScript.value += `${parent}.textContent += \`${textContent}\`;\n`;
  } else {
    outputJavaScript.value += `${parent}.innerHTML += \`${textContent}\`;\n`;
  }
  if (trimmedString[0] !== '<') {
    removeFirstStringFromHtml();
    getLastCharOfString(inputHtml.value);
    getStringFromHtmlCode();
    checkOpeningTag();
  } else {
    addChildToParent();
  }
};

const checkTextContent = () => {
  if (trimmedString === '' || trimmedString === ' ') {
    addChildToParent();
  } else {
    textContent = trimmedString;
    addTextContentToElement();
  }
};

const checkAttributesWithoutValue = () => {
  if (trimmedString.indexOf('<') !== -1) {
    trimmedString = trimmedString.replace('<', '');
    trimmedString = trimmedString.replace('>', '');
    trimmedString = trimmedString.trim();
  }
  if (trimmedString.length === 0) {
    checkTextContent();
  } else if (trimmedString.indexOf(' ') !== -1) {
    attr = trimmedString.slice(0, trimmedString.indexOf(' '));
    trimmedString = trimmedString.replace(attr, '');
    trimmedString = trimmedString.trim();
    outputJavaScript.value += `${name}.setAttribute('${attr}', '');\n`;
    checkAttributesWithoutValue();
  } else {
    attr = trimmedString;
    if (attr !== '/') {
      outputJavaScript.value += `${name}.setAttribute('${attr}', '');\n`;
    }
    trimmedString = trimmedString.replace(attr, '');
    trimmedString = trimmedString.trim();
    checkTextContent();
  }
};

const checkAttributes = () => {
  hasAttr = (trimmedString.indexOf('"') !== -1);
  if (hasAttr) {
    getAttrName();
  } else {
    checkAttributesWithoutValue();
  }
};

const addClassToElement = () => {
  className.trim();
  if (className.length !== 0) {
    outputJavaScript.value += `${name}.classList.add('${className}');\n`;
    trimmedString = trimmedString.replace(`class="${classContentBeforeTrimming}"`, '');
    checkAttributes();
  } else {
    trimmedString = trimmedString.replace(`class="${classContent}"`, '');
    checkAttributes();
  }
};

const getClassName = () => {
  className = classContent;
  addClassToElement();
};

const addClassesToElement = () => {
  className = classNames;
  addClassToElement();
};

const getClassNames = () => {
  const re = / /gi;
  classNames = classContent.replace(re, '\', \'');
  addClassesToElement();
};

const addAttrToElement = () => {
  if (attrName === 'id') {
    outputJavaScript.value += `${name}.id = '${attrValue}';\n`;
  } else if (attrName === 'href') {
    outputJavaScript.value += `${name}.href = '${attrValue}';\n`;
  } else {
    outputJavaScript.value += `${name}.setAttribute(\`${attrName}\`, \`${attrValue}\`);\n`;
  }
};

const addSrcToElement = () => {
  outputJavaScript.value += `${name}.src = '${attrValue}';\n`;
};

const addStyleToElement = () => {
  while (declarations.length !== 0) {
    if (declarations[declarations.length - 1][0] !== '') {
      property = declarations[declarations.length - 1][0].trim();
      if (property.indexOf('-') !== -1) {
        propertyLego = property.split('-');
        // eslint-disable-next-line prefer-destructuring
        property = propertyLego[0];
        for (let i = 1; i < propertyLego.length; i += 1) {
          property += propertyLego[i][0].toUpperCase() + propertyLego[i].slice(1);
        }
      }
      propertyValue = declarations[declarations.length - 1][1].trim();
      declarations.pop();
      outputJavaScript.value += `${name}.style.${property} = '${propertyValue}';\n`;
    } else {
      declarations.pop();
    }
  }
};

const setStyles = () => {
  styles = attrValue.split(';');
  for (let i = 0; i < styles.length; i += 1) {
    if (styles[i] !== '') {
      styles[i] = styles[i].trim();
      declarations.push(styles[i].split(':'));
    }
  }
  addStyleToElement();
};

const getAttrValue = () => {
  const startIndex = trimmedString.indexOf('="') + 2;
  attrValue = trimmedString.slice(startIndex, trimmedString.indexOf('"', startIndex));
  trimmedString = trimmedString.replace(`${attrName}="${attrValue}"`, '');
  if (attrName === 'src') {
    addSrcToElement();
    checkAttributes();
  } else if (attrName === 'style') {
    setStyles();
    checkAttributes();
  } else {
    addAttrToElement();
    checkAttributes();
  }
};

getAttrName = () => {
  const startIndex = trimmedString.indexOf('=');
  if (startIndex !== -1) {
    attrName = trimmedString.slice(trimmedString.lastIndexOf(' ', startIndex - 2) + 1, startIndex);
    attrName = attrName.trim();
    getAttrValue();
  } else {
    checkTextContent();
  }
};

const getAttr = () => {
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
};

const checkRightTagName = () => {
  isTagNameRight = !/\W/.test(tagName) + /-/.test(tagName);
};

const trimString = () => {
  trimmedString = trimmedString.replace('>', ' >');
};

const getOpeningTag = () => {
  getIndexOfChar(trimmedString, ' ');
  indexOfSpace = indexOfChar;
  if (indexOfSpace === -1 && trimmedString[trimmedString.length - 1] === '>') {
    opennigTag = trimmedString.slice(1, trimmedString.length - 1);
    tagName = opennigTag;
    createDOMElement();
  } else {
    opennigTag = trimmedString.slice(1, indexOfSpace);
    tagName = opennigTag;
    checkRightTagName();
    if (isTagNameRight) {
      createDOMElement();
      getAttr();
    } else if (tagName[0] !== '/') {
      outputJavaScript.value += 'Incorrect tag name\n';
    }
  }
};

checkOpeningTag = () => {
  getTrimmedString();
  createId(5);
  if (trimmedString[1] === '/') {
    // getParent();
    stackOfClosingTags.pop();
    parent = stackOfClosingTags[stackOfClosingTags.length - 1];
    removeFirstStringFromHtml();
    getLastCharOfString(inputHtml.value);
    getStringFromHtmlCode();
    checkOpeningTag();
  } else {
    trimString();
    if (trimmedString.indexOf('Done') !== -1) {
      outputJavaScript.value += '';
    } else if (trimmedString[0] !== '<') {
      checkTextContent();
    } else {
      getOpeningTag();
    }
  }
};

const copyResult = () => {
  outputJavaScript.select();
  outputJavaScript.setSelectionRange(0, 99999);
  document.execCommand('copy');

  tooltip.innerHTML = 'Copied';
};

const outFunc = () => {
  tooltip.innerHTML = 'Copy to clipboard';
};

const clearInputHtmlValue = () => {
  if (inputHtml.value.indexOf('Done!') !== -1) inputHtml.value = '';
};

const getBody = () => {
  if (inputHtml.value.indexOf('<body') !== -1) {
    const startIndex = inputHtml.value.indexOf('>', inputHtml.value.indexOf('<body') + 5);
    const endIndex = (inputHtml.value.indexOf('<script', startIndex) !== -1)
      ? inputHtml.value.indexOf('<script')
      : inputHtml.value.lastIndexOf('</body>');
    inputHtml.value = inputHtml.value.slice(startIndex + 1, endIndex);
  }
};

const removeComments = () => {
  while (firstIndexOfComment !== -1) {
    firstIndexOfComment = inputHtml.value.indexOf('<!--');
    lastIndexOfComment = inputHtml.value.indexOf('-->') + 4;
    comment = inputHtml.value.slice(firstIndexOfComment, lastIndexOfComment);
    inputHtml.value = inputHtml.value.replace(comment, '');
  }
};

const clearResultArea = () => {
  outputJavaScript.value = '';
};

const addLineBreaks = () => {
  inputHtml.value = inputHtml.value.replace(/</gi, '\n<');
  inputHtml.value = inputHtml.value.replace(/>/gi, '>\n');
};

const removeEmptyLines = () => {
  inputHtml.value = inputHtml.value.replace(/^\s*[\r\n]/gm, '');
};

const checkCodeStart = () => {
  if (inputHtml.value[0] !== '<') {
    outputJavaScript.value += 'Your code must start with the \'<\'\n';
  } else if (inputHtml.value[1] === ' ') {
    outputJavaScript.value += 'There can be no space after \'<\'\n';
  } else {
    inputHtml.value += 'Done!\n';
    getLastCharOfString(inputHtml.value);
    getStringFromHtmlCode();
    checkOpeningTag();
    inputHtml.value = 'Done!';
  }
};

const prepare = () => {
  removeComments();
  getBody();
  clearResultArea();
  addLineBreaks();
  removeEmptyLines();
  checkCodeStart();
};

const logKey = (e) => {
  if (e.which === 27) {
    inputHtml.value = '';
    outputJavaScript.value = '';
  }
};

copyBtn.addEventListener('click', copyResult);
copyBtn.addEventListener('mouseout', outFunc);
inputHtml.addEventListener('click', clearInputHtmlValue);
document.addEventListener('keydown', logKey);

convertBtn.addEventListener('click', () => {
  prepare();
});
