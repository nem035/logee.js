/**
 * logee.js - JavaScript library for loging in the browser without opening the browser console.
 * @version v0.3.0
 * @author Nemanja Stojanovic
 * @link https://github.com/nem035/logee.js#readme
 * @license MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Constants = {

    CONTAINER_ID: 'container', // id for the Logee container
    CONTAINER_CLASS: 'container', // class for the Logee container

    HEADER_LABEL: 'Logee', // text displayed in the header
    HEADER_CLASS: 'header', // class for the Logee header
    HEADER_LABEL_CLASS: 'header-label', // class for the header label
    HEADER_BTN_CLASS: 'header-btn', // class for all buttons in the header

    FOOTER_CLASS: 'footer', // class for the Loggee footer
    FOOTER_RESIZER_CLASS: 'footer-resizer', // clas for the resizer element in the footer

    TOGGLE_HEIGHT_BTN_CLASS: 'toggle-height-btn', // class for the Toggle Height button
    TOGGLE_HEIGHT_BTN_DESC: 'Toggle Height', // description for the Toggle Height button

    ZOOM_BTNS_CLASS: 'zoom-btns', // class for the zoom buttons wrapper in the header

    PLUS_BTN_CLASS: 'plus-btn', // class for the Plus button
    PLUS_BTN_LABEL: '+', // label for the Plus button
    PLUS_BTN_DESC: 'Increase Font Size', // description of the clear button

    MINUS_BTN_CLASS: 'minus-btn', // class for the Minus button
    MINUS_BTN_LABEL: '-', // label for the Minus button     
    MINUS_BTN_DESC: 'Decrease Font Size', // description of the clear button

    CLEAR_BTN_CLASS: 'clear-btn', // class for the Clear button
    CLEAR_BTN_LABEL: 'Clear', // label for the Clear button
    CLEAR_BTN_DESC: 'Clear Console', // description of the clear button

    BODY_CLASS: 'body', // class for the Logee Box body

    DRAG_CLASS: 'draggable', // class added to the container when dragging
    RESIZE_CLASS: 'resizable', // class added to the container when resizing

    // CSS classes for different data types
    NUMBER_CLASS: 'number',
    JSON_KEY_CLASS: 'json-key',
    JSON_PROP_CLASS: 'json-prop',
    UNDEFINED_CLASS: 'undefined',
    CIRCULAR_REF_CLASS: 'circ-ref',
    REGEXP_CLASS: 'regexp',
    STRING_CLASS: 'string',
    BOOLEAN_CLASS: 'boolean',
    NULL_CLASS: 'null',
    EMPTY_CLASS: 'empty'
};

exports.default = Constants;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _draggable = require('./draggable');

var _draggable2 = _interopRequireDefault(_draggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assign = Object.assign;
var CONTAINER_ID = _constants2.default.CONTAINER_ID;
var CONTAINER_CLASS = _constants2.default.CONTAINER_CLASS;
var BODY_CLASS = _constants2.default.BODY_CLASS;
var HEADER_CLASS = _constants2.default.HEADER_CLASS;
var HEADER_BTN_CLASS = _constants2.default.HEADER_BTN_CLASS;
var FOOTER_CLASS = _constants2.default.FOOTER_CLASS;
var FOOTER_RESIZER_CLASS = _constants2.default.FOOTER_RESIZER_CLASS;
var TOGGLE_HEIGHT_BTN_CLASS = _constants2.default.TOGGLE_HEIGHT_BTN_CLASS;
var HEADER_LABEL_CLASS = _constants2.default.HEADER_LABEL_CLASS;
var HEADER_LABEL = _constants2.default.HEADER_LABEL;
var CLEAR_BTN_CLASS = _constants2.default.CLEAR_BTN_CLASS;
var CLEAR_BTN_DESC = _constants2.default.CLEAR_BTN_DESC;
var CLEAR_BTN_LABEL = _constants2.default.CLEAR_BTN_LABEL;
var ZOOM_BTNS_CLASS = _constants2.default.ZOOM_BTNS_CLASS;
var PLUS_BTN_CLASS = _constants2.default.PLUS_BTN_CLASS;
var PLUS_BTN_DESC = _constants2.default.PLUS_BTN_DESC;
var PLUS_BTN_LABEL = _constants2.default.PLUS_BTN_LABEL;
var MINUS_BTN_CLASS = _constants2.default.MINUS_BTN_CLASS;
var MINUS_BTN_DESC = _constants2.default.MINUS_BTN_DESC;
var MINUS_BTN_LABEL = _constants2.default.MINUS_BTN_LABEL;
var createElem = _utils2.default.createElem;
var showElem = _utils2.default.showElem;
var hideElem = _utils2.default.hideElem;
var setId = _utils2.default.setId;
var addClass = _utils2.default.addClass;
var append = _utils2.default.append;
var prepend = _utils2.default.prepend;
var appendText = _utils2.default.appendText;
var getHeight = _utils2.default.getHeight;
var setHeight = _utils2.default.setHeight;
var getFontSize = _utils2.default.getFontSize;
var setFontSize = _utils2.default.setFontSize;
var addListener = _utils2.default.addListener;
var setHTML = _utils2.default.setHTML;
var setTitle = _utils2.default.setTitle;


var domElements = {
  container: undefined, // Logee container
  header: undefined, // Logee header
  headerLabel: undefined, // header label
  footer: undefined, // Logee footer
  footerResizer: undefined, // resizer element in the footer
  body: undefined, // Logee body
  toggleHeightBtn: undefined, // toggleHeight button in the header
  zoomBtns: undefined, // container for the zoom buttons,
  plusBtn: undefined, // plus button in the header
  minusBtn: undefined, // minus button in the header
  clearBtn: undefined };

// clear button in the header
var domDefaults = {
  isMinimized: false,
  maxFontSize: 17, // maximum font size for the Logee body
  minFontSize: 11, // minimum font size for the Logee body
  minDim: 300
};

var DOM = function (_Draggable) {
  _inherits(DOM, _Draggable);

  function DOM(options) {
    _classCallCheck(this, DOM);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DOM).call(this, options));

    assign(_this, domElements, domDefaults);
    return _this;
  }

  _createClass(DOM, [{
    key: 'buildDOM',
    value: function buildDOM() {
      var _this2 = this;

      var maxFontSize = this.maxFontSize;
      var minFontSize = this.minFontSize;

      // create Logee Box container

      var container = this.container = createElem('div');
      setId(container, CONTAINER_ID);
      addClass(container, CONTAINER_CLASS);

      // prepend the container element to the body
      prepend(document.body, container);

      // create Logee Box header
      var header = this.header = createElem('div');
      addClass(header, HEADER_CLASS);
      addListener(header, 'mousedown', function (e) {
        return _this2.initDrag(e);
      });
      addListener(header, 'mouseup', function (e) {
        return _this2.resetDrag(e);
      });
      append(container, header);

      // create a clear button in the header
      var toggleHeightBtn = this.toggleHeightBtn = createElem('div');
      addClass(toggleHeightBtn, HEADER_BTN_CLASS);
      addClass(toggleHeightBtn, TOGGLE_HEIGHT_BTN_CLASS);
      appendText(toggleHeightBtn, '-');

      var cachedContainerHeight = void 0;
      toggleHeightBtn.onclick = function () {
        var container = _this2.container;
        var header = _this2.header;
        var body = _this2.body;
        var footer = _this2.footer;


        if (_this2.isMinimized) {

          setHeight(container, cachedContainerHeight);

          showElem(body);
          showElem(footer);

          setHTML(toggleHeightBtn, '-');
          setTitle(toggleHeightBtn, 'Minimize');

          _this2.isMinimized = false;
        } else {

          cachedContainerHeight = getHeight(container);

          var bodyHeight = getHeight(body);
          var footerHeight = getHeight(footer);

          hideElem(body);
          hideElem(footer);

          setHeight(container, cachedContainerHeight - bodyHeight - footerHeight);

          setHTML(toggleHeightBtn, '+');
          setTitle(toggleHeightBtn, 'Maximize');

          _this2.isMinimized = true;
        }
      };
      append(header, toggleHeightBtn);

      // create the label in the header
      var headerLabel = this.headerLabel = createElem('span');
      addClass(headerLabel, HEADER_LABEL_CLASS);
      appendText(headerLabel, HEADER_LABEL);
      append(header, headerLabel);

      // create a clear button in the header
      var clearBtn = this.clearBtn = createElem('div');
      addClass(clearBtn, HEADER_BTN_CLASS);
      addClass(clearBtn, CLEAR_BTN_CLASS);
      setTitle(clearBtn, CLEAR_BTN_DESC);
      appendText(clearBtn, CLEAR_BTN_LABEL);
      append(header, clearBtn);

      clearBtn.onclick = function () {
        if (_this2.isAttachedToConsole) {
          _this2.browserConsole.clear();
        } else {
          _this2.clear();
        }
      };

      // create the zoom buttons in the header
      var zoomBtns = this.zoomBtns = createElem('div');
      addClass(zoomBtns, ZOOM_BTNS_CLASS);
      append(header, zoomBtns);

      // create the plus button
      var plusBtn = this.plusBtn = createElem('div');
      addClass(plusBtn, HEADER_BTN_CLASS);
      addClass(plusBtn, PLUS_BTN_CLASS);
      setTitle(plusBtn, PLUS_BTN_DESC);
      appendText(plusBtn, PLUS_BTN_LABEL);
      append(zoomBtns, plusBtn);

      plusBtn.onclick = function () {
        var fontSize = getFontSize(_this2.body);
        if (fontSize < maxFontSize) {
          setFontSize(_this2.body, fontSize + 1);
        }
      };

      // create the minus button
      var minusBtn = this.minusBtn = createElem('div');
      addClass(minusBtn, HEADER_BTN_CLASS);
      addClass(minusBtn, MINUS_BTN_CLASS);
      setTitle(minusBtn, MINUS_BTN_DESC);
      appendText(minusBtn, MINUS_BTN_LABEL);
      append(zoomBtns, minusBtn);

      minusBtn.onclick = function () {
        var fontSize = getFontSize(_this2.body);
        if (fontSize > minFontSize) {
          setFontSize(_this2.body, fontSize - 1);
        }
      };

      // create Logee Box body
      var body = this.body = createElem('div');
      addClass(body, BODY_CLASS);
      append(container, body);

      // create Logee Box footer
      var footer = this.footer = createElem('div');
      addClass(footer, FOOTER_CLASS);
      append(container, footer);

      // create the resizer
      var resizer = this.resizer = createElem('div');
      addClass(resizer, FOOTER_RESIZER_CLASS);
      addListener(resizer, 'mousedown', function (e) {
        return _this2.initResize(e);
      });
      addListener(document, 'mouseup', function (e) {
        return _this2.resetResize(e);
      });
      append(footer, resizer);

      // add two lines to the resizer
      var line1 = createElem('div');
      addClass(line1, FOOTER_RESIZER_CLASS + '-line1');
      append(resizer, line1);

      // add two lines to the resizer
      var line2 = createElem('div');
      addClass(line2, FOOTER_RESIZER_CLASS + '-line2');
      append(resizer, line2);
    }
  }]);

  return DOM;
}(_draggable2.default);

;

exports.default = DOM;

},{"../constants":1,"../utils":12,"./draggable":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _resizable = require('./resizable');

var _resizable2 = _interopRequireDefault(_resizable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assign = Object.assign;
var HEADER_BTN_CLASS = _constants2.default.HEADER_BTN_CLASS;
var DRAG_CLASS = _constants2.default.DRAG_CLASS;
var toLogeeString = _utils2.default.toLogeeString;
var hasClass = _utils2.default.hasClass;
var setLeft = _utils2.default.setLeft;
var setTop = _utils2.default.setTop;
var addClass = _utils2.default.addClass;
var addListener = _utils2.default.addListener;
var removeClass = _utils2.default.removeClass;
var removeListener = _utils2.default.removeListener;


var dragDefaults = {
	isDragged: false, // flag indicating if the container is being dragged
	dragOffsetY: 0, // vertical offset when dragging the container
	dragOffsetX: 0 };

// horizontal offset when dragging the container
var dragState = assign({}, dragDefaults, {
	listener: null // will be assigned in the constructor
});

var Draggable = function (_Resizable) {
	_inherits(Draggable, _Resizable);

	function Draggable(options) {
		_classCallCheck(this, Draggable);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Draggable).call(this, options));

		assign(_this, dragDefaults);
		return _this;
	}

	// initializes properties and methods for dragging the element


	_createClass(Draggable, [{
		key: 'initDrag',
		value: function initDrag(_ref) {
			var _this2 = this;

			var target = _ref.target;
			var clientX = _ref.clientX;
			var clientY = _ref.clientY;


			// the user must click the header, but not a header button
			if (!hasClass(target, toLogeeString(HEADER_BTN_CLASS))) {
				var container = this.container;
				var dragContainer = this.dragContainer;
				var offsetLeft = container.offsetLeft;
				var offsetTop = container.offsetTop;


				dragState.isDragged = true;
				dragState.dragOffsetX = clientX - offsetLeft;
				dragState.dragOffsetY = clientY - offsetTop;

				addClass(container, DRAG_CLASS);

				dragState.listener = function (e) {
					return _this2.dragContainer(e);
				};
				addListener(document, 'mousemove', dragState.listener);
			}
		}

		// called when container is being dragged, adjust its screen position per mouse movement

	}, {
		key: 'dragContainer',
		value: function dragContainer(_ref2) {
			var clientX = _ref2.clientX;
			var clientY = _ref2.clientY;
			var container = this.container;
			var isDragged = dragState.isDragged;
			var dragOffsetX = dragState.dragOffsetX;
			var dragOffsetY = dragState.dragOffsetY;


			if (isDragged) {
				setLeft(container, clientX - dragOffsetX);
				setTop(container, clientY - dragOffsetY);
			}
		}

		// resets properties and methods for dragging the element

	}, {
		key: 'resetDrag',
		value: function resetDrag() {
			assign(dragState, dragDefaults);
			removeClass(this.container, DRAG_CLASS);
			removeListener(document, 'mousemove', dragState.listener);
		}
	}]);

	return Draggable;
}(_resizable2.default);

;

exports.default = Draggable;

},{"../constants":1,"../utils":12,"./resizable":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = require('./dom');

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _dom2.default;

},{"./dom":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assign = Object.assign;
var showElem = _utils2.default.showElem;
var hideElem = _utils2.default.hideElem;
var addListener = _utils2.default.addListener;


var keyStringToCode = {
	'shift': 16,
	'ctrl': 17,
	'alt': 18,
	'space': 32,
	'left': 37,
	'up': 38,
	'right': 39,
	'down': 40,
	'L': 76
};

var keyCodeToString = {
	16: 'shift',
	17: 'ctrl',
	18: 'alt',
	32: 'space',
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down',
	76: 'L'
};

var keyboardDefaults = {
	isShowing: true
};

var Keyboard = function () {
	function Keyboard(_ref) {
		var _this = this;

		var launchKeyString = _ref.launchKeyString;
		var useLaunchShortcut = _ref.useLaunchShortcut;

		_classCallCheck(this, Keyboard);

		assign(this, { launchKeyString: launchKeyString, useLaunchShortcut: useLaunchShortcut }, keyboardDefaults);

		if (this.useLaunchShortcut) {
			addListener(document, 'keyup', function (e) {
				if (_this.isValidInput(e)) {
					_this.toggle(e);
				}
			});
		}
	}

	// Toggle shortcut is CTRL + {shortcut}


	_createClass(Keyboard, [{
		key: 'isValidInput',
		value: function isValidInput(_ref2) {
			var ctrlKey = _ref2.ctrlKey;
			var keyCode = _ref2.keyCode;

			return ctrlKey && keyCodeToString[keyCode] === this.launchKeyString;
		}

		// called when the user presses the toggle shortcut

	}, {
		key: 'toggle',
		value: function toggle(e) {
			if (this.isShowing) {
				this.hideContainer(e);
			} else {
				this.showContainer(e);
			}
		}
	}, {
		key: 'showContainer',
		value: function showContainer(e) {

			showElem(this.container);
			this.isShowing = true;
		}
	}, {
		key: 'hideContainer',
		value: function hideContainer(e) {
			hideElem(this.container);
			this.isShowing = false;
		}
	}]);

	return Keyboard;
}();

;

exports.default = Keyboard;

},{"../utils":12}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _keyboard = require('./keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assign = Object.assign;
var RESIZE_CLASS = _constants2.default.RESIZE_CLASS;
var addClass = _utils2.default.addClass;
var addListener = _utils2.default.addListener;
var getWidth = _utils2.default.getWidth;
var setWidth = _utils2.default.setWidth;
var getHeight = _utils2.default.getHeight;
var setHeight = _utils2.default.setHeight;
var removeClass = _utils2.default.removeClass;
var removeListener = _utils2.default.removeListener;


var resizeDefaults = {
	isResizing: false,
	startY: 0,
	startX: 0,
	startWidth: 0,
	startHeight: 0
};

var resizeState = assign({}, resizeDefaults, {
	listener: null
});

var Resizable = function (_Keyboard) {
	_inherits(Resizable, _Keyboard);

	function Resizable(options) {
		_classCallCheck(this, Resizable);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Resizable).call(this, options));

		assign(_this, resizeDefaults);
		return _this;
	}

	// initializes properties and methods for resizing the element


	_createClass(Resizable, [{
		key: 'initResize',
		value: function initResize(_ref) {
			var _this2 = this;

			var target = _ref.target;
			var clientX = _ref.clientX;
			var clientY = _ref.clientY;
			var container = this.container;


			resizeState.isResizing = true;
			resizeState.startX = clientX;
			resizeState.startY = clientY;
			resizeState.startWidth = getWidth(container);
			resizeState.startHeight = getHeight(container);

			addClass(container, RESIZE_CLASS);

			resizeState.listener = function (e) {
				return _this2.resizeContainer(e);
			};
			addListener(document, 'mousemove', resizeState.listener);
		}

		// called when container is being resized, adjusting its size per mouse movement

	}, {
		key: 'resizeContainer',
		value: function resizeContainer(_ref2) {
			var clientX = _ref2.clientX;
			var clientY = _ref2.clientY;
			var container = this.container;
			var minDim = this.minDim;
			var isResizing = resizeState.isResizing;
			var startX = resizeState.startX;
			var startY = resizeState.startY;
			var startWidth = resizeState.startWidth;
			var startHeight = resizeState.startHeight;


			if (isResizing) {

				var newWidth = startWidth + (clientX - startX);
				var newHeight = startHeight + (clientY - startY);

				if (newWidth >= minDim) {
					setWidth(container, newWidth);
				}

				if (newHeight >= minDim) {
					setHeight(container, newHeight);
				}
			}
		}

		// resets properties and methods for resizing the element

	}, {
		key: 'resetResize',
		value: function resetResize() {
			var isResizing = resizeState.isResizing;


			if (isResizing) {
				assign(resizeState, resizeDefaults);
				removeClass(this.container, RESIZE_CLASS);
				removeListener(document, 'mousemove', resizeState.listener);
			}
		}
	}]);

	return Resizable;
}(_keyboard2.default);

;

exports.default = Resizable;

},{"../constants":1,"../utils":12,"./keyboard":5}],7:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _system2 = require('./system');

var _system3 = _interopRequireDefault(_system2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isConsole = _utils2.default.isConsole;
var isObject = _utils2.default.isObject;
var isUndefined = _utils2.default.isUndefined;
var assignStrict = _utils2.default.assignStrict;


var userAccessibleOptions = {
  useLaunchShortcut: true, // flag determining if the user can use the launch shortcut
  launchKeyString: 'L', // keyboard key that shows/hides Logee when pressed while holding ctrl
  shouldAttachToConsole: true // determines if Logee should be attached to the console or has to be used independently
};

// create a Symbol for the System class to enable proper data encapsulation
var _system = Symbol('System');

var Logee = function () {
  function Logee() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Logee);

    if (!isObject(opts)) {
      throw new Error('Passed invalid type "' + (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) + '" for the options arguments.');
    }

    // grab the console object from the window and make sure it exists
    var _window = window;
    var browserConsole = _window.console;


    if (!isConsole(browserConsole)) {
      throw new Error('Missing the console object.');
    }

    // store the console and make sure we only take userAccessible options from the user and ignore the rest
    var options = assignStrict({ browserConsole: browserConsole }, userAccessibleOptions, opts);

    // build the loging system
    this[_system] = new _system3.default(window.Logee, options);
  }

  _createClass(Logee, [{
    key: 'isAttachedToConsole',
    value: function isAttachedToConsole() {
      return this[_system].isAttachedToConsole;
    }
  }]);

  return Logee;
}();

;

if (!isUndefined(window.Logee)) {
  throw new Error('Cannot install Logee because the "Logee" name is already taken.');
} else {
  window.Logee = {
    init: function init(options) {
      new Logee(options);
    }
  };
}

},{"./system":8,"./utils":12}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assign = Object.assign;
var isFunction = _utils2.default.isFunction;
var each = _utils2.default.each;
var append = _utils2.default.append;

var System = function (_UI) {
  _inherits(System, _UI);

  function System(Logee, options) {
    _classCallCheck(this, System);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(System).call(this, options));

    assign(_this, { Logee: Logee }, options, { isAttachedToConsole: options.shouldAttachToConsole });

    _this.installMethods();
    _this.buildDOM();
    return _this;
  }

  _createClass(System, [{
    key: 'installMethods',
    value: function installMethods() {
      var _this2 = this;

      var Logee = this.Logee;

      // set the fallback console.log method when using custom Logee methods

      this.logFallback = this.browserConsole.log;

      var methods = ['log', 'info', 'debug', 'warn', 'error', 'success'];

      // clear() is a special case, it doesn't create any messages
      Logee.clear = this.createClearMethod();
      if (this.shouldAttachToConsole) {
        this.attachToConsole('clear');
      }

      // extend console methods
      each(methods, function (methodName) {

        Logee[methodName] = _this2.createMethod(methodName);

        if (_this2.shouldAttachToConsole) {
          _this2.attachToConsole(methodName);
        }
      });
    }
  }, {
    key: 'createClearMethod',
    value: function createClearMethod() {
      var _this3 = this;

      return function () {
        _this3.clear();
      };
    }
  }, {
    key: 'createMethod',
    value: function createMethod(methodName) {

      var self = this;
      return function () {

        // create appropriate dom msg div
        var msgDOM = self.createLogeeMessage(methodName);

        // create the dom nodes from each argument, styled according to the console method

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var nodes = args.map(function (a) {
          return self.createLogeeMessageNode(a, methodName);
        });

        // add the nodes to the dom
        each(nodes, function (n) {
          return append(msgDOM, n);
        });

        // append logee message to the dom
        self.appendLogeeMessage(msgDOM);
      };
    }
  }, {
    key: 'attachToConsole',
    value: function attachToConsole(methodName) {
      var browserConsole = this.browserConsole;
      var Logee = this.Logee;


      var oldConsoleMethod = this.getConsoleMethodWithFallback(methodName);

      var self = this;
      browserConsole[methodName] = function () {

        Logee[methodName].apply(Logee, arguments);

        // call the old console method
        oldConsoleMethod.apply(browserConsole, arguments);
      };
    }
  }, {
    key: 'getConsoleMethodWithFallback',
    value: function getConsoleMethodWithFallback(methodName) {
      var method = this.browserConsole[methodName];
      return isFunction(method) ? method : this.logFallback;
    }
  }]);

  return System;
}(_ui2.default);

;

exports.default = System;

},{"./ui":9,"./utils":12}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _dom = require('./dom');

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assign = Object.assign;
var stringify = JSON.stringify;
var NUMBER_CLASS = _constants2.default.NUMBER_CLASS;
var JSON_KEY_CLASS = _constants2.default.JSON_KEY_CLASS;
var JSON_PROP_CLASS = _constants2.default.JSON_PROP_CLASS;
var UNDEFINED_CLASS = _constants2.default.UNDEFINED_CLASS;
var CIRCULAR_REF_CLASS = _constants2.default.CIRCULAR_REF_CLASS;
var REGEXP_CLASS = _constants2.default.REGEXP_CLASS;
var STRING_CLASS = _constants2.default.STRING_CLASS;
var BOOLEAN_CLASS = _constants2.default.BOOLEAN_CLASS;
var NULL_CLASS = _constants2.default.NULL_CLASS;
var EMPTY_CLASS = _constants2.default.EMPTY_CLASS;
var toLogeeString = _utils2.default.toLogeeString;
var fromLogeeString = _utils2.default.fromLogeeString;
var toType = _utils2.default.toType;
var isObject = _utils2.default.isObject;
var isArray = _utils2.default.isArray;
var arrayToString = _utils2.default.arrayToString;
var isRegexp = _utils2.default.isRegexp;
var isUndefined = _utils2.default.isUndefined;
var each = _utils2.default.each;
var createElem = _utils2.default.createElem;
var append = _utils2.default.append;
var scrollToBottom = _utils2.default.scrollToBottom;
var setId = _utils2.default.setId;
var addClass = _utils2.default.addClass;
var setHTML = _utils2.default.setHTML;
var clearElem = _utils2.default.clearElem;
var toSafeString = _utils2.default.toSafeString;
var convertCircRefsRecursively = _utils2.default.convertCircRefsRecursively;


var uiDefaults = {

  msgCount: 0, // log message counter
  strUndefined: toLogeeString('undefined'), // string to represent undefined value
  strRegex: toLogeeString('regex'), // string to represent a regular expression
  strCircularRef: toLogeeString('_self_'), // string to represent a circular reference
  strEmpty: '""', // string to represent an empty string
  jsonSpacing: 2 // number of spacing for JSON.stringify

};

var JSON_REGEX = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

var UI = function (_DOM) {
  _inherits(UI, _DOM);

  function UI(options) {
    _classCallCheck(this, UI);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UI).call(this, options));

    assign(_this, uiDefaults);
    return _this;
  }

  _createClass(UI, [{
    key: 'convertCircularReferences',
    value: function convertCircularReferences(obj) {
      var converted = {};
      convertCircRefsRecursively(obj, obj, converted, this.strCircularRef);
      return converted;
    }

    // converts the item into an appropriate JSON string

  }, {
    key: 'logeeStringify',
    value: function logeeStringify(item) {
      var _this2 = this;

      var jsonSpacing = this.jsonSpacing;
      var strUndefined = this.strUndefined;
      var strRegex = this.strRegex;


      var obj = {};

      if (isObject(item)) {
        obj = this.convertCircularReferences(item);
      } else {
        obj = item.map(function (curr) {
          return isObject(curr) ? _this2.convertCircularReferences(curr) : curr;
        });
      }

      return stringify(obj, function (key, value) {

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

  }, {
    key: 'JSONsyntaxHighlight',
    value: function JSONsyntaxHighlight(item) {
      var _this3 = this;

      var strUndefined = this.strUndefined;
      var strCircularRef = this.strCircularRef;
      var strRegex = this.strRegex;


      var json = this.logeeStringify(item);

      return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(JSON_REGEX, function (match) {

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

        return _this3.jsonDOM(match, cls);
      });
    }
  }, {
    key: 'jsonDOM',
    value: function jsonDOM(match, cls) {
      var domClass = (cls === JSON_KEY_CLASS ? '' : toLogeeString(JSON_PROP_CLASS)) + ' ' + toLogeeString(cls);
      return '<span class="' + domClass + '">' + match + '</span>';
    }

    // creates a log message div with proper id and classes

  }, {
    key: 'createLogeeMessage',
    value: function createLogeeMessage(type) {

      var elem = createElem('div');

      setId(elem, 'msg-' + ++this.msgCount);
      addClass(elem, 'msg');
      addClass(elem, 'msg-' + type);

      return elem;
    }

    // appends the logge message to the body

  }, {
    key: 'appendLogeeMessage',
    value: function appendLogeeMessage(msg) {
      var body = this.body;

      // add the message to the DOM

      append(body, msg);

      // scroll to the latest msg
      scrollToBottom(body);

      // set opacity so fade in animation is activated
      msg.style.opacity = 1;
    }

    // formats and adds a message div to the container body

  }, {
    key: 'createLogeeMessageNode',
    value: function createLogeeMessageNode(item, methodName) {
      var strEmpty = this.strEmpty;

      // init the msg text container

      var msgDiv = createElem('div');

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
  }, {
    key: 'clear',
    value: function clear() {
      clearElem(this.body);
      this.msgCount = 0;
    }
  }]);

  return UI;
}(_dom2.default);

exports.default = UI;

},{"./constants":1,"./dom":4,"./utils":12}],10:[function(require,module,exports){
'use strict';

// private

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _pixelize(val) {
  return val + 'px';
}

function _depixelize(val) {
  return parseInt(val);
}

function _getStyleProperty(elem, prop) {
  return window.getComputedStyle(elem, null).getPropertyValue(prop);
}

var LOGEE_ID = '__logee'; // prefix to all DOM identifiers (classes and ids)

// public

// convert any string to a Logee string
function toLogeeString(s) {
  return LOGEE_ID + '-' + s;
}

// convert any Logee string to a regular string
function fromLogeeString(s) {
  return s.replace(LOGEE_ID + '-', '');
}

function getById(id) {
  return document.getElementById(id);
}

function createElem(tag) {
  return document.createElement(tag);
}

function showElem(_ref) {
  var style = _ref.style;

  style.display = 'block';
}

function hideElem(_ref2) {
  var style = _ref2.style;

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

function setLeft(_ref3, value) {
  var style = _ref3.style;

  style.left = value;
}

function setTop(_ref4, value) {
  var style = _ref4.style;

  style.top = value;
}

function getFontSize(elem) {
  return _depixelize(_getStyleProperty(elem, 'font-size'));
}

function setFontSize(_ref5, fontSize) {
  var style = _ref5.style;

  style.fontSize = _pixelize(fontSize);
}

function getHeight(elem) {
  return _depixelize(_getStyleProperty(elem, 'height'));
}

function setHeight(_ref6, val) {
  var style = _ref6.style;

  style.height = _pixelize(val);
}

function getWidth(elem) {
  return _depixelize(_getStyleProperty(elem, 'width'));
}

function setWidth(_ref7, val) {
  var style = _ref7.style;

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
    elem.className = elem.className + ' ' + c;
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

function hasClass(_ref8, c) {
  var classList = _ref8.classList;

  return [].concat(_toConsumableArray(classList)).includes(c);
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
  var elem = createElem('div');
  var text = createText(s);
  append(elem, text);
  return elem.innerHTML;
}

var DOMMixin = {
  toLogeeString: toLogeeString,
  fromLogeeString: fromLogeeString,
  getById: getById,
  createElem: createElem,
  createText: createText,
  showElem: showElem,
  hideElem: hideElem,
  append: append,
  prepend: prepend,
  appendText: appendText,
  addListener: addListener,
  removeListener: removeListener,
  setLeft: setLeft,
  setTop: setTop,
  getFontSize: getFontSize,
  setFontSize: setFontSize,
  getHeight: getHeight,
  setHeight: setHeight,
  getWidth: getWidth,
  setWidth: setWidth,
  scrollToBottom: scrollToBottom,
  setId: setId,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  setTitle: setTitle,
  setHTML: setHTML,
  clearElem: clearElem,
  toSafeString: toSafeString
};

exports.default = DOMMixin;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var keys = Object.keys;
var isObject = _types2.default.isObject;
var isArray = _types2.default.isArray;
var isArrayLike = _types2.default.isArrayLike;
var isUndefined = _types2.default.isUndefined;

// function to iterate over an object or an array

function each(item, cb) {
  if (isObject(item)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys(item)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        cb(item[key], key);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else if (isArrayLike(item)) {
    [].concat(_toConsumableArray(item)).forEach(cb);
  } else {
    throw new Error('Argument is not iterable');
  }
}

// recursively converts all circular references of an object to a string `replacement`
function convertCircRefsRecursively(oldObj, currObj, newObj) {
  var replacement = arguments.length <= 3 || arguments[3] === undefined ? 'Circular Ref' : arguments[3];

  each(currObj, function (val, prop) {

    if (isObject(val) || isArray(val)) {

      // detect a circular reference
      if (val === oldObj) {
        newObj[prop] = replacement;
      }
      // otherwise initialize the current object
      else {
          if (isArray(val)) {
            newObj[prop] = [];
          } else {
            newObj[prop] = {};
          }
          convertCircRefsRecursively(oldObj, val, newObj[prop], replacement);
        }
    } else {
      newObj[prop] = val;
    }
  });
}

function assignStrict(to, strictSource, otherSource) {
  var strictKeys = keys(strictSource);

  strictKeys.forEach(function (key) {
    var prop = otherSource[key];
    if (!isUndefined(prop)) {
      to[key] = prop;
    } else {
      to[key] = strictSource[key];
    }
  });

  return to;
}

var HelpersMixin = {
  each: each,
  convertCircRefsRecursively: convertCircRefsRecursively,
  assignStrict: assignStrict
};

exports.default = HelpersMixin;

},{"./types":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = require('./dom');

var _dom2 = _interopRequireDefault(_dom);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Utils = Object.assign({}, _dom2.default, _helpers2.default, _types2.default);

exports.default = Utils;

},{"./dom":10,"./helpers":11,"./types":13}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isArray = Array.isArray;


var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

// function to get the proper type of a variable
// shoutout AngusCroll (https://goo.gl/pxwQGp)
function toType(x) {
  return {}.toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

// function to check if item is a console
function isConsole(x) {
  return toType(x) === 'console';
}

// function to check if item is an object
function isObject(x) {
  return toType(x) === 'object';
}

function isFunction(x) {
  return toType(x) === 'function';
}

// function to check if item is a Regexp
function isRegexp(x) {
  return toType(x) === 'regexp';
}

// function to check if item is undefined
function isUndefined(x) {
  return x === void 0;
}

// function to theck if item is array-like
function isArrayLike(_ref) {
  var length = _ref.length;

  return toType(length) == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

var TypesMixin = {
  toType: toType,
  isConsole: isConsole,
  isObject: isObject,
  isFunction: isFunction,
  isRegexp: isRegexp,
  isUndefined: isUndefined,
  isArray: isArray,
  isArrayLike: isArrayLike
};

exports.default = TypesMixin;

},{}]},{},[7]);
