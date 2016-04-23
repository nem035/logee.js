'use strict';

import Constants from './constants';
import Utils from './utils';
import DOM from './dom';

const {
  assign
} = Object;

const {
  stringify
} = JSON;

const {
  NUMBER_CLASS,
  JSON_KEY_CLASS,
  JSON_PROP_CLASS,
  UNDEFINED_CLASS,
  CIRCULAR_REF_CLASS,
  REGEXP_CLASS,
  STRING_CLASS,
  BOOLEAN_CLASS,
  NULL_CLASS,
  EMPTY_CLASS
} = Constants;

const {
	toLogeeString,
  fromLogeeString,
  toType,
  isObject,
  isArray,
  arrayToString,
  isRegexp,
  isUndefined,
  each,
  createElem,
  append,
  scrollToBottom,
  setId,
  addClass,
  setHTML,
  clearElem,
  toSafeString,
  convertCircRefsRecursively
} = Utils;


const uiDefaults = {

  msgCount          : 0,                          // log message counter
  strUndefined      : toLogeeString('undefined'), // string to represent undefined value
  strRegex          : toLogeeString('regex'),     // string to represent a regular expression
  strCircularRef    : toLogeeString('_self_'),    // string to represent a circular reference
  strEmpty          : '""',                       // string to represent an empty string
  jsonSpacing       : 2                           // number of spacing for JSON.stringify

};

const JSON_REGEX = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

class UI extends DOM {

	constructor(options) {
    super(options);
    assign(this, uiDefaults);
  }

  convertCircularReferences(obj) {
    const converted = {};
    convertCircRefsRecursively(obj, obj, converted, this.strCircularRef);
    return converted;
  } 

  // converts the item into an appropriate JSON string
  logeeStringify(item) {

    const {
      jsonSpacing,
      strUndefined,
      strRegex
    } = this;

    let obj = {};

    if (isObject(item)) {
      obj = this.convertCircularReferences(item);
    } else {
      obj = item.map(curr => isObject(curr) ? this.convertCircularReferences(curr) : curr);
    }

    return stringify(obj, (key, value) => {

      if (isUndefined(value)) {
        return strUndefined;
      }
      
      if (isRegexp(value)) {
        return strRegex + value.toString();
      }
      
      return value;
    }, jsonSpacing);
  }

  // parses the JSON string and adds proper classes (and converts some values) depending on item type
  JSONsyntaxHighlight(item) {

    const {
      strUndefined,
      strCircularRef,
      strRegex
    } = this;

    const json = this.logeeStringify(item);
    
    return json.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(JSON_REGEX, (match) => {
      
      let cls = NUMBER_CLASS;
      
      // if starts with a double quote
      if (/^"/.test(match)) {
        // if ends with a colon
        if (/:$/.test(match)) {
          cls = JSON_KEY_CLASS;
        } else {
          // unquote the value (remove surrounding quotes)
          let unquoted = match.substring(1, match.length - 1);

          // determine the class and match
          if (unquoted === strUndefined) {

            cls = UNDEFINED_CLASS;
            match = 'undefined';

          } else if (unquoted === strCircularRef) {

            cls = CIRCULAR_REF_CLASS;
            match = fromLogeeString(strCircularRef);

          } else if (unquoted.startsWith(strRegex)) {

            cls = REGEXP_CLASS;
            match = unquoted.replace(strRegex, '');

          } else {
            cls = STRING_CLASS;
          }
        }
      } else if (/true|false/.test(match)) {
        cls = BOOLEAN_CLASS;
      } else if (/null/.test(match)) {
        cls = NULL_CLASS;
      }

      return this.jsonDOM(match, cls);
    });
  }

  jsonDOM(match, cls) {
    const domClass = `${cls === JSON_KEY_CLASS ? '' : toLogeeString(JSON_PROP_CLASS)} ${toLogeeString(cls)}`;
    return `<span class="${domClass}">${match}</span>`;
  }

  // creates a log message div with proper id and classes
  createLogeeMessage(type) {
    
    const elem = createElem('div');

    setId(elem, `msg-${++this.msgCount}`);
    addClass(elem, 'msg');
    addClass(elem, `msg-${type}`);

    return elem;
  }

  // appends the logge message to the body
  appendLogeeMessage(msg) {
    
    const {
      body
    } = this;

    // add the message to the DOM
    append(body, msg);

    // scroll to the latest msg
    scrollToBottom(body);

    // set opacity so fade in animation is activated
    msg.style.opacity = 1;
  }

  // formats and adds a message div to the container body
  createLogeeMessageNode(item, methodName) {
    
    const {
      strEmpty 
    } = this;

    // init the msg text container 
    const msgDiv = createElem('div');

    if (item === '') {
      item = strEmpty;
    } else if (isObject(item) || isArray(item)) {
      item = this.JSONsyntaxHighlight(item);
    } else {
      // add syntax highlighting only for the log() method
      if (methodName === 'log') {
        addClass(msgDiv, toType(item));
      }
      item = toSafeString(item);
    }
    
    setHTML(msgDiv, item);

    return msgDiv;
  }

  clear() {
    clearElem(this.body);
    this.msgCount = 0;
  }
}

export default UI;