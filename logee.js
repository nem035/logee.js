/* ========================================================================
 * logee.js v0.2.1
 * https://github.com/nem035/logee.js
 * ========================================================================
 * Copyright 2015 Nemanja Stojanovic
 * Licensed under MIT (https://github.com/nem035/logee.js/blob/master/LICENSE)
 * ======================================================================== */
 
;(function(global) {
  "use strict";

  if(!isObject(global)) {
    throw new Error('Missing the global object');
  }

  // create the global console object if it doesn't exist
  if(!global.console) {
    global.console = {};
  }

  // ========== Default & Control variables ========== //

  var containerDim = 300, // height and width of the Logee container
    containerPadding = 2, // padding of the Logee container
    headHeight = containerDim * 0.10, // height of the Logee header
    headPadding = 5, // padding of the Loggee header
    ROOT_ID = '__logee', // id for the Logee container
    CLEAR_BTN_ID = 'clear-btn', // id for the Clear button
    CLEAR_BTN_CLASS = 'clear-btn', // class for the Clear button
    CLEAR_BTN_LABEL = 'Clear', // label for the Clear button
    TITLE_TEXT = 'Logee', // text displayed in the header
    DRAG_CLASS = 'draggable', // class added to the container when dragging
    JSON_SPACING = 2, // number of spacing for JSON.stringify
    UNDEFINED = (ROOT_ID + '__undefined__'), // string to represent undefined value
    CIRC_REF = '_me_'; // string to represent a circular reference

  var _container, // main container
    _head, // header
    _body, // body
    _clearBtn, // clear button in the header
    _original = {}, // object that will contain original global.console methods
    _console = global.console, // global.console alias
    isDragged = false, // flag indicating if the container is being dragged
    dragOffsetY = 0, // vertical offset when dragging the container
    dragOffsetX = 0, // horizontal offset when dragging the container
    msgCount = 0; // log message counter

  // ========== DOM method wrappers ========== //

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

  // function to set the height of an element
  function setHeight(elem, val, enforce) {
    elem.style.height = val;
    if(enforce) {
      elem.style.maxHeight = val + 'px';
      elem.style.minHeight = val + 'px';
    }
    return elem;
  };

  // function to set the width of an element
  function setWidth(elem, val, enforce) {
    elem.style.width = val;
    if(enforce) {
      elem.style.maxWidth = val + 'px';
      elem.style.minWidth = val + 'px';
    }
    return elem;
  };

  // function to set the padding of an element
  function setPadding(elem, val) {
    return elem.style.padding = val + 'px';
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
    id = ROOT_ID + (id ? ('-' + id) : '');
    while (getById(id)) {
      id = id + Math.floor(Math.random() * 10);
    }
    return elem.id = id;
  };

  // add class to the element, prepend the ROOT_ID by default
  function addClass(elem, c) {
    c = (ROOT_ID + '-' + c);
    if (elem.classList.add) {
      elem.classList.add(c);
    } else {
      elem.className = elem.className.replace(c, '');
    }
  };

  // remove class from the element
  function removeClass(elem, c) {
    c = (ROOT_ID + '-' + c);
    if (elem.classList.remove) {
      elem.classList.remove(c);
    } else {
      elem.className.rep = elem.className + ' ' + c;
    }
  };

  // ========== Control functions ========== //

  // called when container is being dragged, adjust its screen position per mouse movement
  function dragContainer(e) {
    if (isDragged) {
      _container.style.top = e.clientY - dragOffsetY + 'px';
      _container.style.left = e.clientX - dragOffsetX + 'px';
    }
  };

  // initializes properties and methods for dragging the element
  function initDrag(e) {
    if (e.target.id !== (ROOT_ID + '-' + CLEAR_BTN_ID)) { // the user must click the header, but not the clear btn to drag
      isDragged = true;
      dragOffsetX = e.clientX - _container.offsetLeft;
      dragOffsetY = e.clientY - _container.offsetTop;
      addClass(_container, DRAG_CLASS);
      addListener(document, 'mousemove', dragContainer);
    }
  };

  // resets properties and methods for dragging the element
  function resetDrag() {
    isDragged = false;
    dragOffsetX = 0;
    dragOffsetY = 0;
    removeClass(_container, DRAG_CLASS);
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
    append(_body, elem);
    // scroll to the latest msg
    scrollToBottom(_body);
    // set opacity so fade in animation is activated
    elem.style.opacity = 1;
  };

  // function to check if arg is an array
  function isArray(x) { 
    if(Array.isArray) {
      return Array.isArray(x);
    }
    return Object.prototype.toString.call(x) === '[object Array]';
  };

  // function to check if arg is an object
  function isObject(x) { 
    return typeof x === 'object' && x !== null;
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

  // converts all circular references of the item to a string CIRC_REF
  function convertCircRefs(oldObj, currObj, newObj) {
    each(currObj, function(val, prop) {
      if (isObject(val)) {
        if (val === oldObj) {
          newObj[prop] = CIRC_REF;
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
    if (JSON && typeof JSON.stringify == 'function') {
      var obj = {};
      convertCircRefs(item, item, obj);
      return JSON.stringify(obj, function(key, value) {
        if (value === void 0) {
          return UNDEFINED;
        }
        return value;
      }, JSON_SPACING);
    }
    return null;
  };

  // parses the JSON string and adds proper classes depending on item type
  function JSONsyntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
      var cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else if (match.substring(1, match.length - 1) === UNDEFINED) {
          cls = 'json-undefined';
          match = 'undefined';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + ROOT_ID + '-' + cls + '">' + match + '</span>';
    });
  };

  // function that creates a new console.log method and saves the original one (or its fallback) 
  function createMethod(name, method) {
    _original[name] = _console[name] || _original['log']; // all custom methods fallback to console.log
    _console[name] = function() {
      method(Array.prototype.slice.call(arguments));
      if (_original[name]) _original[name].apply(_console, arguments);
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
    _body.innerHTML = '';
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
    _container = createElem('div');
    setId(_container, 'container');
    addClass(_container, 'container');
    setDimensions(_container, containerDim, true); // pass true to enforce the dimensions
    setPadding(_container, containerPadding);

    // prepend the container element to the body
    prepend(document.body, _container);

    // create header
    _head = createElem('div');
    addClass(_head, 'head');
    appendText(_head, TITLE_TEXT);
    setHeight(_head, headHeight, true);
    setPadding(_head, headPadding);
    addListener(_head, 'mousedown', initDrag);
    addListener(_head, 'mouseup', resetDrag);
    append(_container, _head);

    // create a clear button in the header
    _clearBtn = createElem('div');
    setId(_clearBtn, CLEAR_BTN_ID);
    addClass(_clearBtn, CLEAR_BTN_CLASS);
    appendText(_clearBtn, CLEAR_BTN_LABEL);
    _clearBtn.onclick = function() {
      _console.clear();
    };
    append(_head, _clearBtn);

    // create body
    _body = createElem('div');
    addClass(_body, 'body');
    setHeight(_body, containerDim - 2 * containerPadding - headHeight, true);
    append(_container, _body);

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