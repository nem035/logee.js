/* ========================================================================
 * logee.js v0.2.0
 * https://github.com/nem035/logee.js
 * ========================================================================
 * Copyright 2015 Nemanja Stojanovic
 * Licensed under MIT (https://github.com/nem035/logee.js/blob/master/LICENSE)
 * ======================================================================== */
(function(global) {
  "use strict";

  // create the global object, if it doesn't exist
  global = global || {};

  // create the global console object if it doesn't exist
  global.console = global.console || {};

  // DOM method wrappers
  function getById(id) {
    return document.getElementById(id);
  };

  function getByTag(tag) {
    return document.getElementsByTagName(tag);
  };

  function createElem(tag) {
    return document.createElement(tag);
  };

  function createText(text) {
    return document.createTextNode(text);
  };

  function append(elem, child) {
    return elem.appendChild(child);
  };

  function prepend(elem, child) {
    if (elem.children.length > 0) return elem.insertBefore(child, elem.children[0]);
    return append(elem, child);
  };

  function addText(elem, text) {
    return elem.appendChild(createText(text));
  };

  function addListener(elem, type, callback) {
    return elem.addEventListener(type, callback);
  };

  function removeListener(elem, type, callback) {
    return elem.removeEventListener(type, callback);
  };

  function setHeight(elem, val) {
    return elem.style.height = val;
  };

  function setWidth(elem, val) {
    return elem.style.width = val;
  };

  function setPadding(elem, val) {
    return elem.style.padding = val;
  };

  function setDimensions(elem, val) {
    setHeight(elem, val);
    setWidth(elem, val);
  };

  function scrollToBottom(elem) {
    elem.scrollTop = elem.scrollHeight;
  };

  // make sure Logee loads after the DOM
  addListener(document, 'DOMContentLoaded', function() {

    // main variables
    var _container, // main container
      _head, // header
      _body, // body
      _clearBtn, // clear button in the header
      _original = {}, // object that will contain original global.console methods
      _console = global.console; // global.console alias

    // default parameters
    var containerDim = 250, // height and width of the Logee container
      containerPadding = 2, // padding of the Logee container
      headHeight = 25, // height of the Logee header
      rootId = '__logee', // id for the Logee container
      clearBtnId = 'clear-btn', // id for the Clear button
      clearBtnClass = 'clear-btn', // class for the Clear button
      clearBtnLabel = 'Clear', // label for the Clear button
      titleText = 'Logee', // text displayed in the header
      isDraggable = false, // flag indicating if the container is draggable
      draggableClass = 'draggable', // class added to the container when dragging
      dragOffsetY = 0, // vertical offset when dragging the container
      dragOffsetX = 0, // horizontal offset when dragging the container
      prettyJSONSpace = 2, // number of spacing for JSON.stringify
      UNDEFINED = (rootId + '__undefined__'), // string to represent undefined value
      CIRC_REF = '_me_', // string to represent a circular reference
      msgCount = 0; // log message counter

    // set id for the element by prepending the root id to the parameter 
    // and adding random digits until it is unique
    function setId(elem, id) {
      id = rootId + (id ? ('-' + id) : '');
      while (getById(id)) {
        id = id + Math.floor(Math.random() * 10);
      }
      return elem.id = id;
    };
    // add class to the element, prepend the rootId by default
    function addClass(elem, c) {
      c = (rootId + '-' + c);
      if (elem.classList.add) {
        elem.classList.add(c);
      } else {
        elem.className = elem.className.replace(c, '');
      }
    };
    // remove class from the element
    function removeClass(elem, c) {
      c = (rootId + '-' + c);
      if (elem.classList.remove) {
        elem.classList.remove(c);
      } else {
        elem.className.rep = elem.className + ' ' + c;
      }
    };
    // called when container is being dragged, adjust its screen position per mouse movement
    function dragContainer(e) {
      if (isDraggable) {
        _container.style.top = e.clientY - dragOffsetY + 'px';
        _container.style.left = e.clientX - dragOffsetX + 'px';
      }
    };
    // initializes properties and methods for dragging the element
    function initDrag(e) {
      if (e.target.id !== (rootId + '-' + clearBtnId)) { // the user must click the header, but not the clear btn to drag
        isDraggable = true;
        dragOffsetX = e.clientX - _container.offsetLeft;
        dragOffsetY = e.clientY - _container.offsetTop;
        addClass(_container, draggableClass);
        addListener(document, 'mousemove', dragContainer);
      }
    };
    // resets properties and methods for dragging the element
    function resetDrag() {
      isDraggable = false;
      dragOffsetX = 0;
      dragOffsetY = 0;
      removeClass(_container, draggableClass);
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
      // set opacity so css animation is activated
      elem.style.opacity = 1;
    };
    // function to check if arg is an object
    function isObject(x) { 
    	return typeof x === 'object' && x !== null
    };
    // converts all circular references of the item to a string CIRC_REF
    function convertCircRefs(oldObj, currObj, newObj) {
      for (var prop in currObj) {
        var val = currObj[prop];
        if (isObject(val)) {
          if (val === oldObj) {
            newObj[prop] = CIRC_REF;
          } else {
            newObj[prop] = {};
            convertCircRefs(oldObj, val, newObj[prop]);
          }
        } else {
          newObj[prop] = val;
        }
      }
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
        }, prettyJSONSpace);
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
        return '<span class="' + rootId + '-' + cls + '">' + match + '</span>';
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

    // console methods

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

    // create container
    _container = createElem('div');
    setId(_container, 'container');
    addClass(_container, 'container');
    setDimensions(_container, containerDim);
    setPadding(_container, containerPadding + 'px');

    // prepend the container element to the body
    prepend(getByTag('body')[0], _container);

    // create header
    _head = createElem('div');
    addClass(_head, 'head');
    addText(_head, titleText);
    setHeight(_head, headHeight);
    addListener(_head, 'mousedown', initDrag);
    addListener(_head, 'mouseup', resetDrag);
    append(_container, _head);

    // create a clear button in the header
    _clearBtn = createElem('div');
    setId(_clearBtn, clearBtnId);
    addClass(_clearBtn, clearBtnClass);
    addText(_clearBtn, clearBtnLabel);
    _clearBtn.onclick = function() {
      _console.clear();
    };
    append(_head, _clearBtn);

    // create body
    _body = createElem('div');
    addClass(_body, 'body');
    setHeight(_body, containerDim - headHeight - 2 * containerPadding);
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