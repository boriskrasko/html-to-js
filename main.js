/* eslint-disable no-undef */
const inputHtml = document.querySelector('.input code');
const outputJavaScript = document.querySelector('.output code');
const convertBtn = document.querySelector('.convert-btn');
const copyBtn = document.querySelector('.copy-btn');
const toggleSwitch = document.querySelector('.toggle-switch');

const singletonTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'param', 'path', 'source', 'track', 'wbr'];
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

function* idGenerator() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function* generateCombination(prefix, length) {
    if (length === 0) {
      yield prefix;
      return;
    }
    for (let i = 0; i < alphabet.length; i++) {
      yield* generateCombination(prefix + alphabet[i], length - 1);
    }
  }

  for (let length = 2; length <= 4; length++) {
    yield* generateCombination('', length);
  }
}

const idGen = idGenerator();

const createId = (length) => {
  randomId = idGen.next().value;
  return randomId;
};

const getStringFromHtmlCode = () => {
  stringFromHtmlCode = inputHtml.innerText.slice(0, lastCharOfString);
};

const removeFirstStringFromHtml = () => {
  inputHtml.innerText = inputHtml.innerText.replace(`${stringFromHtmlCode}\n`, '');
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
  if (tagName === 'svg' || (parent && parent.includes('svg'))) {
    outputJavaScript.innerHTML += `<span class="decl">const</span> ${name} <span class="equal">=</span> document.<span class="method">createElementNS</span>(<span class="tagname">'http://www.w3.org/2000/svg', '${tagName}'</span>);\n`;
  } else {
    outputJavaScript.innerHTML += `<span class="decl">const</span> ${name} <span class="equal">=</span> document.<span class="method">createElement</span>(<span class="tagname">'${tagName}'</span>);\n`;
  }
  trimmedString = trimmedString.replace(`${tagName}`, '');
};

const checkClass = () => {
  hasClass = (trimmedString.indexOf('class') !== -1);
};

const getClassContent = () => {
  const startIndex = trimmedString.indexOf('class="') + 7;
  trimmedString = trimmedString.replace(/ +"/g, '"').trim();
  classContent = (trimmedString.includes('class="')) ? trimmedString.slice(startIndex, trimmedString.indexOf('"', startIndex)) : '';
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
  outputJavaScript.innerHTML += `${parent}.<span class="method">appendChild</span>(${name});\n`;
  getParent();
  removeFirstStringFromHtml();
  getLastCharOfString(inputHtml.innerText);
  getStringFromHtmlCode();
  checkOpeningTag();
};

const addTextContentToElement = () => {
  if (textContent.indexOf('&#') === -1) {
    outputJavaScript.innerHTML += `${parent}.<span class="property">textContent</span> <span class="equal">+=</span> \`<span class="value">${textContent}\`<span>;\n`;
  } else {
    outputJavaScript.innerHTML += `${parent}..<span class="property">innerHTML</span> <span class="equal">+=</span> \`<span class="value">${textContent}\`<span>;\n`;
  }
  if (trimmedString[0] !== '<') {
    removeFirstStringFromHtml();
    getLastCharOfString(inputHtml.innerText);
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
    outputJavaScript.innerHTML += `${name}.setAttribute('${attr}', '');\n`;
    checkAttributesWithoutValue();
  } else {
    attr = trimmedString;
    if (attr !== '/') {
      outputJavaScript.innerHTML += `${name}.<span class="method">setAttribute</span>('<span class="value">${attr}'</span>, '');\n`;
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
    outputJavaScript.innerHTML += `${name}.<span class="property">classList</span>.<span class="method">add</span>(<span class="value">'${className}'<span>);\n`;
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
    outputJavaScript.innerHTML += `${name}.<span class="property">id<span> <span class="equal">=</span> <span class="value">'${attrValue}'</span>;\n`;
  } else if (attrName === 'href') {
    outputJavaScript.innerHTML += `${name}.<span class="property">href</span> <span class="equal">=</span> <span class="value">'${attrValue}'</span>;\n`;
  } else {
    outputJavaScript.innerHTML += `${name}.<span class="method">setAttribute</span>(<span class="value">'${attrName}', '${attrValue}'<span class="value">);\n`;
  }
};

const addSrcToElement = () => {
  outputJavaScript.innerHTML += `${name}.<span class="property">src</span> <span class="equal">=</span> <span class="value">'${attrValue}'</span>;\n`;
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
      outputJavaScript.innerHTML += `${name}.<span class="property">style.${property}</span> <span class="equal">=</span> <span class="value">'${propertyValue}'</span>;\n`;
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
      outputJavaScript.innerHTML += 'Incorrect tag name\n';
    }
  }
};

checkOpeningTag = () => {
  getTrimmedString();
  createId(5);
  if (trimmedString[1] === '/') {
    stackOfClosingTags.pop();
    parent = stackOfClosingTags[stackOfClosingTags.length - 1];
    removeFirstStringFromHtml();
    getLastCharOfString(inputHtml.innerText);
    getStringFromHtmlCode();
    checkOpeningTag();
  } else {
    trimString();
    if (trimmedString.indexOf('Done') !== -1) {
      outputJavaScript.innerHTML += '';
    } else if (trimmedString[0] !== '<') {
      checkTextContent();
    } else {
      getOpeningTag();
    }
  }
};

const copyResult = () => {
  const input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = outputJavaScript.innerText;
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand('copy');
  document.body.removeChild(input);
  copyBtn.firstChild.textContent = 'copied';
  // eslint-disable-next-line no-return-assign
  setTimeout(() => copyBtn.firstChild.textContent = 'copy', 1000);
};

const clearInputHtmlValue = () => {
  if (inputHtml.innerText.indexOf('Done!') !== -1) inputHtml.innerText = '';
};

const getBody = () => {
  if (inputHtml.innerText.indexOf('<body') !== -1) {
    const startIndex = inputHtml.innerText.indexOf('>', inputHtml.innerText.indexOf('<body') + 5);
    const endIndex = (inputHtml.innerText.indexOf('<script', startIndex) !== -1)
      ? inputHtml.innerText.indexOf('<script')
      : inputHtml.innerText.lastIndexOf('</body>');
    inputHtml.innerText = inputHtml.innerText.slice(startIndex + 1, endIndex);
  }
};

const removeComments = () => {
  while (firstIndexOfComment !== -1) {
    firstIndexOfComment = inputHtml.innerText.indexOf('<!--');
    lastIndexOfComment = inputHtml.innerText.indexOf('-->') + 4;
    comment = inputHtml.innerText.slice(firstIndexOfComment, lastIndexOfComment);
    inputHtml.innerText = inputHtml.innerText.replace(comment, '');
  }
};

const clearResultArea = () => {
  outputJavaScript.innerHTML = '';
};

const addLineBreaks = () => {
  inputHtml.innerText = inputHtml.innerText.replace(/</gi, '\n<');
  inputHtml.innerText = inputHtml.innerText.replace(/>/gi, '>\n');
};

const removeEmptyLines = () => {
  inputHtml.innerText = inputHtml.innerText.replace(/^\s*[\r\n]/gm, '');
};

const checkCodeStart = () => {
  const inputText = inputHtml.innerText;

  if (inputText[0] !== '<' || inputText[1] === ' ') {
    outputJavaScript.innerHTML += 'Invalid HTML';
  } else {
    inputHtml.innerText += 'Done!\n';
    getLastCharOfString(inputHtml.innerText);
    getStringFromHtmlCode();
    checkOpeningTag();
    inputHtml.innerText = 'Done!';
  }
};

const prepare = () => {
  removeComments();
  getBody();
  clearResultArea();
  addLineBreaks();
  removeEmptyLines();
  checkCodeStart();
  copyBtn.firstChild.textContent = 'copy';
};

const logKey = (e) => {
  if (e.which === 27) {
    inputHtml.innerText = '';
    outputJavaScript.innerHTML = '';
  }
};

const changeTheme = () => {
  document.body.toggleAttribute('light');
};

copyBtn.addEventListener('click', copyResult);
inputHtml.addEventListener('click', clearInputHtmlValue);
document.addEventListener('keydown', logKey);
convertBtn.addEventListener('click', prepare);
toggleSwitch.addEventListener('change', changeTheme);
