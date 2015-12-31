/* ========================================================================
 * logee.js v0.2.1
 * https://github.com/nem035/logee.js
 * ========================================================================
 * Copyright 2015 Nemanja Stojanovic
 * Licensed under MIT (https://github.com/nem035/logee.js/blob/master/LICENSE)
 * ======================================================================== */
 
;(function(global) {
  "use strict";

  if(toType(global) !== 'global') {
    throw new Error('Missing the global object');
  }

  // create the global console object if it doesn't exist
  if(!global.console) {
    global.console = {};
  }

  // ========== Helper methods ========== //

  // function to get the proper type of a variable 
  // shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(x) {
    return ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  // function to get an element by id
  function getById(id) {
    return document.getElementById(id);
  };

  // function to create an element
  function createElem(tag) {
    return document.createElement(tag);
  };

  // function to create a text node element
  function createText(text) {
    return document.createTextNode(text);
  };

  // function to append a child to an element
  function append(elem, child) {
    return elem.appendChild(child);
  };

  // function to prepend a child to an element
  function prepend(elem, child) {
    if (elem.children.length > 0) return elem.insertBefore(child, elem.children[0]);
    return append(elem, child);
  };

  // function to append a text node to an element
  function appendText(elem, text) {
    return elem.appendChild(createText(text));
  };

  // function to add an event listener to an element
  function addListener(elem, type, callback) {
    return elem.addEventListener(type, callback);
  };

  // function to remove an event listener to an element
  function removeListener(elem, type, callback) {
    return elem.removeEventListener(type, callback);
  };

  // function to append 'px' if necessary
  function pixelize(val) {
    if(toType(val) === 'string') {
      val = parseInt(val);
    }
    return val + 'px';
  }

  // function to set the height of an element
  function setHeight(elem, val, enforce) {
    elem.style.height = val;
    if(enforce) {
      elem.style.maxHeight = pixelize(val);
      elem.style.minHeight = pixelize(val);
    }
    return elem;
  };

  // function to set the width of an element
  function setWidth(elem, val, enforce) {
    elem.style.width = val;
    if(enforce) {
      elem.style.maxWidth = pixelize(val);
      elem.style.minWidth = pixelize(val);
    }
    return elem;
  };

  // function to set the padding of an element
  function setPadding(elem, val) {
    return elem.style.padding = pixelize(val);
  };

  // function to set the width and height of an element
  function setDimensions(elem, val, enforce) {
    setWidth(elem, val, enforce);
    setHeight(elem, val, enforce);
  };

  // function to scroll to the bottom of an element
  function scrollToBottom(elem) {
    elem.scrollTop = elem.scrollHeight;
  };

  // set id for the element by prepending the root id to the parameter 
  // and adding random digits until it is unique
  function setId(elem, id) {
    id = toLogeeString(id);
    while (getById(id)) {
      id = id + Math.floor(Math.random() * 10);
    }
    return elem.id = id;
  };

  // add class to the element
  function addClass(elem, c) {
    c = toLogeeString(c);
    if (elem.classList.add) {
      elem.classList.add(c);
    } else {
      elem.className = elem.className.replace(c, '');
    }
  };

  // remove class from the element
  function removeClass(elem, c) {
    c = toLogeeString(c);
    if (elem.classList.remove) {
      elem.classList.remove(c);
    } else {
      elem.className.rep = elem.className + ' ' + c;
    }
  };

  // check if element has a class
  function hasClass(elem, c) {
    return Array.prototype.indexOf.call(elem.classList, c) !== -1;
  }

  // ========== Constants ========== //

  var LOGEE_ID = '__logee',                       // prefix to all DOM identifiers (classes and ids)
      
      CONTAINER_ID = 'container',                 // id for the Logee container
      CONTAINER_CLASS = 'container',              // class for the Logee container

      HEADER_CLASS = 'header',                    // class for the Logee header
      HEADER_LABEL_CLASS = 'header-label',        // class for the header label
      HEADER_BTN_CLASS = 'header-btn',            // class for all buttons in the header

      ZOOM_BTNS_CLASS = 'zoom-btns',              // class for the zoom buttons wrapper in the header

      PLUS_BTN_CLASS = 'plus-btn',                // class for the Plus button
      PLUS_BTN_LABEL = '+',                       // label for the Plus button
      
      MINUS_BTN_CLASS = 'minus-btn',              // class for the Minus button
      MINUS_BTN_LABEL = '-',                      // label for the Minus button
      
      CLEAR_BTN_CLASS = 'clear-btn',              // class for the Clear button
      CLEAR_BTN_LABEL = 'Clear',                  // label for the Clear button
      
      HEADER_LABEL = 'Logee',                     // text displayed in the header
      
      BODY_CLASS = 'body',                        // class for the Logee Box body

      DRAG_CLASS = 'draggable',                  // class added to the container when dragging

      NUMBER_CLASS = 'number',
      JSON_KEY_CLASS = 'json-key',
      JSON_PROP_CLASS = 'json-prop',
      UNDEFINED_CLASS = 'undefined',
      CIRCULAR_REF_CLASS = 'circ-ref',
      REGEXP_CLASS = 'regexp',
      STRING_CLASS = 'string',
      BOOLEAN_CLASS = 'boolean',
      NULL_CLASS = 'null';

  // ========== Setup variables ========== //

  var containerDim = 300,                         // height and width of the Logee container
      containerPadding = 2,                       // padding of the Logee container
      headerHeight = containerDim * 0.10,         // height of the Logee header
      headerPadding = 5,                          // padding of the Loggee header
      fontSize = 14,                              // font size for the Logee body
      maxFontSize = 20,                           // maximum font size for the Logee body
      minFontSize = 12,                           // minimum font size for the Logee body
      jsonSpacing = 2,                            // number of spacing for JSON.stringify
      strUndefined = toLogeeString('undefined'),  // string to represent undefined value
      strRegex = toLogeeString('regex'),          // string to represent a regular expression
      strCircularRef = toLogeeString('_self_');   // string to represent a circular reference
      
  // ========== Control variables ========== //

  var container,                  // Logee Box container
      header,                     // Logee Box header
      headerLabel,                // header label
      body,                       // Logee Box body
      zoomBtns,                   // container for the zoom buttons,
      plusBtn,                    // plus button in the header
      minusBtn,                   // minus button in the header
      clearBtn,                   // clear button in the header
      originalConsole = {},       // object that will contain original global.console methods
      console = global.console,   // global.console alias
      isDragged = false,          // flag indicating if the container is being dragged
      dragOffsetY = 0,            // vertical offset when dragging the container
      dragOffsetX = 0,            // horizontal offset when dragging the container
      msgCount = 0;               // log message counter
  
  // ========== Control functions ========== //

  // function to convert any string to a Logee string
  function toLogeeString(s) {
    return (LOGEE_ID + '-' + s);
  }

  // function to convert any Logee string to a regular string
  function fromLogeeString(s) {
    return s.replace(LOGEE_ID + '-', '');
  }

  // called when container is being dragged, adjust its screen position per mouse movement
  function dragContainer(e) {
    if (isDragged) {
      container.style.top = pixelize(e.clientY - dragOffsetY);
      container.style.left = pixelize(e.clientX - dragOffsetX);
    }
  };

  // initializes properties and methods for dragging the element
  function initDrag(e) {
    if (!hasClass(e.target, toLogeeString(HEADER_BTN_CLASS))) { // the user must click the header, but not a header button
      isDragged = true;
      dragOffsetX = e.clientX - container.offsetLeft;
      dragOffsetY = e.clientY - container.offsetTop;
      addClass(container, DRAG_CLASS);
      addListener(document, 'mousemove', dragContainer);
    }
  };

  // resets properties and methods for dragging the element
  function resetDrag() {
    isDragged = false;
    dragOffsetX = 0;
    dragOffsetY = 0;
    removeClass(container, DRAG_CLASS);
    removeListener(document, 'mousemove', dragContainer);
  };

  // convert arguments to a single spaced string message
  function argsToString(args) {
    return args.map(function(a) {
      if (a === null) {
        return 'null';
      }
      if (a === void 0) {
        return 'undefined'
      }
      return a.toString();
    }).join(' ');
  };

  // creates a log message div with proper id and classes
  function createMessage(type) {
    var elem = createElem('div');
    setId(elem, 'msg-' + (++msgCount));
    addClass(elem, 'msg');
    addClass(elem, 'msg-' + type);
    return elem;
  };

  // formats and adds a message div to the container body
  function appendMessage(message, type) {
    var elem, msg;
    // init dom message element
    elem = createMessage(type);
    // add create the DOM message content
    if (type == 'json') {
      msg = createElem('div');
      msg.innerHTML = JSONsyntaxHighlight(message);
    } else {
      if (!message) { // make empty string more visible by displaying empty quotes
        message = '""';
        addClass(elem, 'msg-empty');
      }
      msg = createText(message);
    }
    // add the message to the DOM
    append(elem, msg);
    append(body, elem);
    // scroll to the latest msg
    scrollToBottom(body);
    // set opacity so fade in animation is activated
    elem.style.opacity = 1;
  };

  // function to check if arg is an array
  function isArray(x) { 
    if(Array.isArray) {
      return Array.isArray(x);
    }
    return toType(x) === 'array';
  };

  // function to check if arg is an object
  function isObject(x) { 
    return toType(x) === 'object';
  };

  // function to iterate over an object or an array
  function each(item, cb) {
    if(isArray(item)) {
      item.forEach(cb);
    } else if(isObject(item)) {
      for (var prop in item) {
        // dont iterate over properties on the prototype chain
        if(item.hasOwnProperty(prop)) {
          cb(item[prop], prop);
        }
      }
    } else {
      throw new Error('Argument is not iterable');
    }
  };

  // converts all circular references of the item to a string strCircularRef
  function convertCircRefs(oldObj, currObj, newObj) {
    each(currObj, function(val, prop) {
      if (isObject(val) || isArray(val)) {
        if (val === oldObj) {
          newObj[prop] = strCircularRef;
        } else {
          if(isArray(val)) {
            newObj[prop] = [];
          } else {
            newObj[prop] = {};
          }
          convertCircRefs(oldObj, val, newObj[prop]);
        }
      } else {
        newObj[prop] = val;
      }
    });
  };

  // converts the item into a JSON string
  function JSONstringify(item) {
    if (toType(JSON) === 'json') {
      var obj = {};
      convertCircRefs(item, item, obj);
      return JSON.stringify(obj, function(key, value) {
        
        if (value === void 0) {
          return strUndefined;
        }
        
        if (toType(value) === 'regexp') {
          return strRegex + value.toString();
        }
        
        return value;
      }, jsonSpacing);
    }
    return null;
  };

  // parses the JSON string and adds proper classes depending on item type
  function JSONsyntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
      var cls = NUMBER_CLASS;
      // if starts with a double quote
      if (/^"/.test(match)) {
        // if ends with a colon
        if (/:$/.test(match)) {
          cls = JSON_KEY_CLASS;
        } else {
          // unquote the value (remove surrounding quotes)
          var unquoted = match.substring(1, match.length - 1);

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
      return '<span class="' + (cls === JSON_KEY_CLASS ? '' : toLogeeString(JSON_PROP_CLASS)) + ' ' + toLogeeString(cls) + '">' + match + '</span>';
    });
  };

  // function that creates a new console.log method and saves the original one (or its fallback) 
  function createMethod(name, method) {
    originalConsole[name] = console[name] || originalConsole['log']; // all custom methods fallback to console.log
    console[name] = function() {
      method(Array.prototype.slice.call(arguments));
      if (originalConsole[name]) originalConsole[name].apply(console, arguments);
    }
  };

  // ========== API Methods ========== //

  function log(args) {
    appendMessage(argsToString(args), 'log');
  };

  function info(args) {
    appendMessage(argsToString(args), 'info');
  };

  function debug(args) {
    appendMessage(argsToString(args), 'debug');
  };

  function success(args) {
    appendMessage(argsToString(args), 'success');
  };

  function error(args) {
    appendMessage(argsToString(args), 'error');
  };

  function warn(args) {
    appendMessage(argsToString(args), 'warn');
  };

  function clear() {
    body.innerHTML = '';
    msgCount = 0;
  };

  function json(args) {
    if(isObject(args[0])) {
      appendMessage(JSONstringify(args[0]), 'json');
    } else {
      console.log(args[0]);
    }
  };

  // make sure Logee loads after the DOM
  addListener(document, 'DOMContentLoaded', function() {

    // create container
    container = createElem('div');
    setId(container, CONTAINER_ID);
    addClass(container, CONTAINER_CLASS);
    setDimensions(container, containerDim, true); // pass true to enforce the dimensions
    setPadding(container, containerPadding);

    // prepend the container element to the body
    prepend(document.body, container);

    // create Logee Box header
    header = createElem('div');
    addClass(header, HEADER_CLASS);
    setHeight(header, headerHeight, true);
    setPadding(header, headerPadding);
    addListener(header, 'mousedown', initDrag);
    addListener(header, 'mouseup', resetDrag);
    append(container, header);

    // create the label in the header
    headerLabel = createElem('span');
    addClass(headerLabel, HEADER_LABEL_CLASS);
    appendText(headerLabel, HEADER_LABEL);
    append(header, headerLabel);

    // create a clear button in the header
    clearBtn = createElem('div');
    addClass(clearBtn, HEADER_BTN_CLASS);
    addClass(clearBtn, CLEAR_BTN_CLASS);
    appendText(clearBtn, CLEAR_BTN_LABEL);
    clearBtn.onclick = function() {
      console.clear();
    };
    append(header, clearBtn);

    // create the zoom buttons in the header
    zoomBtns = createElem('div');
    addClass(zoomBtns, ZOOM_BTNS_CLASS);
    append(header, zoomBtns);

    // create the plus button
    plusBtn = createElem('div');
    addClass(plusBtn, HEADER_BTN_CLASS);
    addClass(plusBtn, PLUS_BTN_CLASS);
    appendText(plusBtn, PLUS_BTN_LABEL);
    plusBtn.onclick = function() {
      if(fontSize <= maxFontSize) {
        body.style.fontSize = pixelize(++fontSize);
      }
    };
    append(zoomBtns, plusBtn);

    // create the minus button
    minusBtn = createElem('div');
    addClass(minusBtn, HEADER_BTN_CLASS);
    addClass(minusBtn, MINUS_BTN_CLASS);
    appendText(minusBtn, MINUS_BTN_LABEL);
    minusBtn.onclick = function() {
      if(fontSize >= minFontSize) {
        body.style.fontSize = pixelize(--fontSize);
      }
    };
    append(zoomBtns, minusBtn);

    // create Logee Box body
    body = createElem('div');
    addClass(body, BODY_CLASS);
    setHeight(body, containerDim - 2 * containerPadding - headerHeight, true);
    body.style.fontSize = pixelize(fontSize);
    append(container, body);

    // enhance existing console methods
    createMethod('log', log);
    createMethod('info', info);
    createMethod('debug', debug);
    createMethod('warn', warn);
    createMethod('error', error);
    createMethod('clear', clear);

    // create custom console methods
    createMethod('success', success);
    createMethod('json', json);
  });
})(window);