'use strict';

// private

function _pixelize(val) {
  return `${val}px`;
}

function _depixelize(val) {
  return parseInt(val);
}

function _getStyleProperty(elem, prop) {
  return window.getComputedStyle(elem, null).getPropertyValue(prop);
}

const LOGEE_ID = '__logee'; // prefix to all DOM identifiers (classes and ids)

// public

// convert any string to a Logee string
function toLogeeString(s) {
  return (`${LOGEE_ID}-${s}`);
}

// convert any Logee string to a regular string
function fromLogeeString(s) {
  return s.replace(`${LOGEE_ID}-`, '');
}

function getById(id) {
  return document.getElementById(id);
}

function createElem(tag) {
  return document.createElement(tag);
}

function showElem({style}) {
  style.display = 'block';
}

function hideElem({style}) {
  style.display = 'none';
}

function createText(text) {
  return document.createTextNode(text);
}

function append(elem, child) {
  return elem.appendChild(child);
}

function prepend(elem, child) {
  if (elem.children.length > 0) {
   return elem.insertBefore(child, elem.children[0]);
  }
  return append(elem, child);
}

function appendText(elem, text) {
  return elem.appendChild(createText(text));
}

function addListener(elem, type, callback) {
  return elem.addEventListener(type, callback);
}

function removeListener(elem, type, callback) {
  return elem.removeEventListener(type, callback);
}

function setLeft({style}, value) {
  style.left = value;
}

function setTop({style}, value) {
  style.top = value;
}

function getFontSize(elem) {
  return _depixelize(_getStyleProperty(elem, 'font-size'));
}

function setFontSize({style}, fontSize) {
  style.fontSize = _pixelize(fontSize);
}

function getHeight(elem) {
  return _depixelize(_getStyleProperty(elem, 'height'));
}

function setHeight({style}, val) {
  style.height = _pixelize(val);
}

function getWidth(elem) {
  return _depixelize(_getStyleProperty(elem, 'width'));
}

function setWidth({style}, val) {
  style.width = _pixelize(val);
}

function scrollToBottom(elem) {
  elem.scrollTop = elem.scrollHeight;
}

//set id for the element by prepending the root id to the parameter 
//and adding random digits until it is unique
function setId(elem, id) {
  id = toLogeeString(id);
  while (getById(id)) {
    id = id + Math.floor(Math.random() * 10);
  }
  return elem.id = id;
}

function addClass(elem, c) {
  c = toLogeeString(c);
  if (elem.classList.add) {
    elem.classList.add(c);
  } else {
  elem.className = `${elem.className} ${c}`;
  }
}

function removeClass(elem, c) {
  c = toLogeeString(c);
  if (elem.classList.remove) {
    elem.classList.remove(c);
  } else {
  elem.className = elem.className.replace(c, '');
  }
}

function hasClass({classList}, c) {
  return [...classList].includes(c);
}

function setTitle(elem, t) {
  elem.setAttribute('title', t);
}

function setHTML(elem, h) {
  elem.innerHTML = h;
}

function clearElem(elem) {
  elem.innerHTML = '';
}

// uses built in text parsing methods to protect against code injection
function toSafeString(s) {
  const elem = createElem('div');
  const text = createText(s);
  append(elem, text);
  return elem.innerHTML;
}

const DOMMixin = {
  toLogeeString,
  fromLogeeString,
  getById,
  createElem,
  createText,
  showElem,
  hideElem,
  append,
  prepend,
  appendText,
  addListener,
  removeListener,
  setLeft,
  setTop,
  getFontSize,
  setFontSize,
  getHeight,
  setHeight,
  getWidth,
  setWidth,
  scrollToBottom,
  setId,
  addClass,
  removeClass,
  hasClass,
  setTitle,
  setHTML,
  clearElem,
  toSafeString
};

export default DOMMixin;