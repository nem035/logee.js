/* ========================================================================
 * logee.js v0.3.0
 * https://github.com/nem035/logee.js
 * ========================================================================
 * Copyright 2015-2016 Nemanja Stojanovic
 * Licensed under MIT (https://github.com/nem035/logee.js/blob/master/LICENSE)
 * ======================================================================== */
 
;(function(global) {
  "use strict";

  // make sure a global object exists
  if(['window', 'global'].indexOf(toType(global)) === -1) {
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

  // set the title attribute of an element
  function setTitle(elem, t) {
    elem.setAttribute('title', t);
  }

  // set the HTML content of an element
  function setHTML(elem, h) {
    elem.innerHTML = h;
  }

  // ========== Constants ========== //

  var LOGEE_ID                = '__logee',            // prefix to all DOM identifiers (classes and ids)
      
      CONTAINER_ID            = 'container',          // id for the Logee container
      CONTAINER_CLASS         = 'container',          // class for the Logee container

      HEADER_LABEL            = 'Logee',              // text displayed in the header
      HEADER_CLASS            = 'header',             // class for the Logee header
      HEADER_LABEL_CLASS      = 'header-label',       // class for the header label
      HEADER_BTN_CLASS        = 'header-btn',         // class for all buttons in the header

      TOGGLE_HEIGHT_BTN_CLASS = 'toggle-height-btn',  // class for the Toggle Height button
      TOGGLE_HEIGHT_BTN_DESC  = 'Toggle HEight',      // description for the Toggle Height button

      ZOOM_BTNS_CLASS         = 'zoom-btns',          // class for the zoom buttons wrapper in the header

      PLUS_BTN_CLASS          = 'plus-btn',           // class for the Plus button
      PLUS_BTN_LABEL          = '+',                  // label for the Plus button
      PLUS_BTN_DESC           = 'Increase Font Size', // description of the clear button
      
      MINUS_BTN_CLASS         = 'minus-btn',          // class for the Minus button
      MINUS_BTN_LABEL         = '-',                  // label for the Minus button      
      MINUS_BTN_DESC          = 'Decrease Font Size', // description of the clear button
      
      CLEAR_BTN_CLASS         = 'clear-btn',          // class for the Clear button
      CLEAR_BTN_LABEL         = 'Clear',              // label for the Clear button
      CLEAR_BTN_DESC          = 'Clear Console',      // description of the clear button

      BODY_CLASS              = 'body',               // class for the Logee Box body

      DRAG_CLASS              = 'draggable',          // class added to the container when dragging

      // CSS classes for different data types
      NUMBER_CLASS        = 'number',           
      JSON_KEY_CLASS      = 'json-key',
      JSON_PROP_CLASS     = 'json-prop',
      UNDEFINED_CLASS     = 'undefined',
      CIRCULAR_REF_CLASS  = 'circ-ref',
      REGEXP_CLASS        = 'regexp',
      STRING_CLASS        = 'string',
      BOOLEAN_CLASS       = 'boolean',
      NULL_CLASS          = 'null',
      EMPTY_CLASS         = 'empty',

      // control constants
      MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  // ========== Setup variables ========== //

  var containerDim      = 300,                                                // height and width of the Logee container
      containerPadding  = 2,                                                  // padding of the Logee container
      headerHeight      = 25,                                                 // height of the Logee header is 10% of the container height
      headerPadding     = 5,                                                  // padding of the Loggee header
      bodyHeight        = containerDim - 2 * containerPadding - headerHeight, // calculate the height of the Logee body
      fontSize          = 14,                                                 // font size for the Logee body
      maxFontSize       = 17,                                                 // maximum font size for the Logee body
      minFontSize       = 11,                                                 // minimum font size for the Logee body
      jsonSpacing       = 2,                                                  // number of spacing for JSON.stringify
      strUndefined      = toLogeeString('undefined'),                         // string to represent undefined value
      strRegex          = toLogeeString('regex'),                             // string to represent a regular expression
      strCircularRef    = toLogeeString('_self_'),                            // string to represent a circular reference
      strEmpty          = '""';                                               // string to represent an empty string
      
  // ========== Control variables ========== //

  // uninitialized
  var container,                  // Logee Box container
      header,                     // Logee Box header
      headerLabel,                // header label
      body,                       // Logee Box body
      toggleHeightBtn,            // toggleHeight button in the header
      zoomBtns,                   // container for the zoom buttons,
      plusBtn,                    // plus button in the header
      minusBtn,                   // minus button in the header
      clearBtn;                   // clear button in the header

  // initialized
  var oldConsole    = {},               // object that will contain original global.console methods
      _console      = global.console,   // global.console alias
      isDragged     = false,            // flag indicating if the container is being dragged
      dragOffsetY   = 0,                // vertical offset when dragging the container
      dragOffsetX   = 0,                // horizontal offset when dragging the container
      msgCount      = 0;                // log message counter
  
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
    if(!isArray(args)) {
      args = toArray(args);
    }
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

  // function to check if item is an array
  function isArray(x) { 
    if(Array.isArray) {
      return Array.isArray(x);
    }
    return toType(x) === 'array';
  };

  // function to theck if item is array-like
  function isArrayLike(x) {
    var len = x.length;
    return toType(len) == 'number' && len >= 0 && len <= MAX_ARRAY_INDEX;
  }

  // function to check if item is an object
  function isObject(x) { 
    return toType(x) === 'object';
  };

  // function to convert an item to an array
  function toArray(item) {
    return isArrayLike(item) ? Array.prototype.slice.call(item) : null;
  }

  // function to iterate over an object or an array
  function each(item, cb) {
    if(isObject(item)) {
      for (var prop in item) {
        // dont iterate over properties on the prototype chain
        if(toType(item.hasOwnProperty) === 'function' && item.hasOwnProperty(prop)) {
          cb(item[prop], prop);
        }
      }
    } else if(isArrayLike(item)) {
      for(var i = 0, l = item.length; i < l; i++) {
        cb(item[i], i, item);
      }
    } else {
      throw new Error('Argument is not iterable');
    }
  };

  // recursively converts all circular references of the item to a string strCircularRef
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

  // converts the item into an appropriate JSON string
  function logeeStringify(item) {

    var obj;
    
    if (toType(JSON) === 'json') {

      obj = {};
      if(toType(item) === 'object') {
        convertCircRefs(item, item, obj);
      } else {
        obj = item;
      }

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

  // parses the JSON string and adds proper classes (and converts some values) depending on item type
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

      return '<span class="' + 
             (cls === JSON_KEY_CLASS ? '' : toLogeeString(JSON_PROP_CLASS)) + 
             ' ' + toLogeeString(cls) + '">' + match + '</span>';
    });
  };

  // uses built in text parsing methods to protect against code injection
  function toSafeString(s) {
    var elem = createElem('div');
    var text = createText(s);
    append(elem, text);
    return elem.innerHTML;
  };

  // creates a log message div with proper id and classes
  function createLogeeMessage(type) {
    
    var elem = createElem('div');

    setId(elem, 'msg-' + (++msgCount));
    addClass(elem, 'msg');
    addClass(elem, 'msg-' + type);

    return elem;
  };

  // appends the logge message to the body
  function appendLogeeMessage(msg) {
    
    // add the message to the DOM
    append(body, msg);

    // scroll to the latest msg
    scrollToBottom(body);

    // set opacity so fade in animation is activated
    msg.style.opacity = 1;
  };

  // formats and adds a message div to the container body
  function createLogeeMessageNode(message, type) {
    
    // init the msg text container 
    var msgDiv = createElem('div');

    // add create the DOM message content
    
    if (message === '') { // make empty string more visible by displaying empty quotes
       
        message = strEmpty;
        addClass(msgDiv, EMPTY_CLASS);
      
    } else if (type == 'json') {
    
      message = JSONsyntaxHighlight(logeeStringify(message));
    
    } else {

      if(type === 'log') { // if performing a regular log, add data type class
        addClass(msgDiv, toType(message));
      } 
      
      message = toSafeString(message);

    }

    setHTML(msgDiv, message);

    return msgDiv;
  };

  // function that creates a new console.log method and saves the original one (or its fallback) 
  function createMethod(name, method) {
    
    // store the old console method
    oldConsole[name] = _console[name] || oldConsole['log']; // all custom methods fallback to console.log
    
    _console[name] = function() {

      // call the api method
      API.execute(name, arguments);

      // call the old console method or its fallback, if they exist
      if (oldConsole[name]) {
        oldConsole[name].apply(_console, arguments);
      }
    }
  };

  // ========== API Methods ========== //

  var singleLineMethods = ['info', 'debug', 'warn', 'error', 'success'];
  var multiLineMethods = ['log', 'json'];
  var methods = ['clear'].concat(singleLineMethods.concat(multiLineMethods));

  // initialize undefined methods, if there are any
  each(methods, function(m) {
    if(toType(_console[m]) === 'undefined') {
      _console[m] = function () { };
    }
  });

  var API = {

    execute: function(methodName, args) {

      if(methodName === 'clear') {

        this.clear();

      } else {

        // create appropriate dom msg div
        var msg = createLogeeMessage(methodName);

        // TODO:
        // if the first argument is a string and there are more than 1 arguments, parse/replace the formatters 
        // if(arguments.length > 1 && toType(arguments[0]) === 'string') {

        // }

        if(multiLineMethods.indexOf(methodName) !== -1) {
          this.multiLineLog(msg, args, methodName);
        } else {
          this.singleLineLog(msg, args, methodName);
        }

        // append logee message to the dom
        appendLogeeMessage(msg);
      }
    },

    singleLineLog: function(msg, args, methodName) {
      append(msg, createLogeeMessageNode(argsToString(args), methodName));
    },

    multiLineLog: function(msg, args, methodName) {
      each(args, function(a) {
        append(msg, createLogeeMessageNode(a, methodName));
      });
    },

    clear: function() {
      setHTML(body, '');
      msgCount = 0;
    }

  };

  // create API methods
  each(methods, function(name) {
    createMethod(name);
  });

  // make sure Logee loads after the DOM
  addListener(document, 'DOMContentLoaded', function() {

    // create container
    container = createElem('div');
    setId(container, CONTAINER_ID);
    addClass(container, CONTAINER_CLASS);
    setWidth(container, containerDim, true);
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

    // create a clear button in the header
    toggleHeightBtn = createElem('div');
    addClass(toggleHeightBtn, HEADER_BTN_CLASS);
    addClass(toggleHeightBtn, TOGGLE_HEIGHT_BTN_CLASS);
    appendText(toggleHeightBtn, '-');
    toggleHeightBtn.onclick = function() {
      if(parseInt(body.style.height) === 0) {
        setHeight(body, bodyHeight, true);
        setHTML(toggleHeightBtn, '-');
        setTitle(toggleHeightBtn, 'Minimize');
      } else {
        setHeight(body, 0, true);
        setHTML(toggleHeightBtn, '+');
        setTitle(toggleHeightBtn, 'Maximize');
      }
    };
    append(header, toggleHeightBtn);

    // create the label in the header
    headerLabel = createElem('span');
    addClass(headerLabel, HEADER_LABEL_CLASS);
    appendText(headerLabel, HEADER_LABEL);
    append(header, headerLabel);

    // create a clear button in the header
    clearBtn = createElem('div');
    addClass(clearBtn, HEADER_BTN_CLASS);
    addClass(clearBtn, CLEAR_BTN_CLASS);
    setTitle(clearBtn, CLEAR_BTN_DESC);
    appendText(clearBtn, CLEAR_BTN_LABEL);
    clearBtn.onclick = function() {
      _console.clear();
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
    setTitle(plusBtn, PLUS_BTN_DESC);
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
    setTitle(minusBtn, MINUS_BTN_DESC);
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
    setHeight(body, bodyHeight, true);
    body.style.fontSize = pixelize(fontSize);
    append(container, body);

  });
})(window);