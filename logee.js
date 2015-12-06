/* ========================================================================
 * logee.js v0.2.0
 * https://github.com/nem035/logee.js
 * ========================================================================
 * Copyright 2015 Nemanja Stojanovic
 * Licensed under MIT (https://github.com/nem035/logee.js/blob/master/LICENSE)
 * ======================================================================== */

(function() {
	"use strict";

	// init window object, if it doesn't exist
	if(!window) { window = {}; }
	
	// create the window console object if it doesn't exist
	if(!window.console) {
		window.console = {};
	}

	// DOM method wrappers
	function f_getById(id) { 
		return document.getElementById(id); 
	};
	function f_getByTag(tag) { 
		return document.getElementsByTagName(tag); 
	};
	function f_createElem(tag) { 
		return document.createElement(tag); 
	};
	function f_createTextNode(text) { 
		return document.createTextNode(text); 
	};
	function f_appendChild(elem, child) { 
		return elem.appendChild(child); 
	};
	function f_prependChild(elem, child) { 
		if(elem.children.length) return elem.insertBefore(child, elem.children[0]); 
		return appendChild(elem, child);
	};
	function f_addTextNode(elem, text) { 
		return elem.appendChild(f_createTextNode(text)); 
	};
	function f_addListener(elem, type, callback) {
		return elem.addEventListener(type, callback);
	};
	function f_removeListener(elem, type, callback) {
		return elem.removeEventListener(type, callback);
	};
	function f_setHeight(elem, val) {
		return elem.style.height = val; 
	};
	function f_setWidth(elem, val) {
		return elem.style.width = val; 
	};
	function f_setPadding(elem, val) {
		return elem.style.padding = val;
	};
	function f_setDimensions(elem, val) { 
		f_setHeight(elem, val); 
		f_setWidth(elem, val); 
	};
	function f_scrollToBottom(elem) {
		elem.scrollTop = elem.scrollHeight;
	};

	// make sure SLI loads after the DOM
	f_addListener(document, 'DOMContentLoaded', function() {

		// main variables
		var _container,					// main container
			_head,						// header
			_body,						// body
			_clearBtn,					// clear button in the header
			_original = {},				// object that will contain original window.console methods
			_console = window.console,	// window.console alias
			p_msgCount = 0;				// log message counter

		// default parameters
		var p_containerDim = 250,
			p_containerPadding = 2,
			p_headHeight = 25,
			p_rootId = '__logee',
			p_clearBtnId = 'clear-btn',
			p_clearBtnClass = 'clear-btn',
			p_clearBtnLabel = 'Clear',
			p_titleText = 'Logee',
			p_isDraggable = false,
			p_draggableClass = 'draggable',
			p_dragOffsetY = 0,
			p_dragOffsetX = 0,
			p_prettyJSONSpace = 2,
			p_UNDEFINED = (p_rootId + '__undefined__');

		// functions
		function f_setId(elem, id) { 
			id = p_rootId + (id ? ('-' + id) : '');
			while(f_getById(id)) {
				id = id + Math.floor(Math.random() * 10);
			}
			return elem.id = id; 
		};
		function f_addClass(elem, c, noRoot) {
			c = noRoot ? c : (p_rootId + '-' + c);
			if(elem.classList.add) { elem.classList.add(c); }
			else { elem.className = elem.className.replace(c, ''); }
		};
		function f_removeClass(elem, c, noRoot) {
			c = noRoot ? c : (p_rootId + '-' + c);
			if(elem.classList.remove) { elem.classList.remove(c); }
			else { elem.className.rep = elem.className + ' ' + c; }
		};
		function f_dragContainer(e) {
			if(p_isDraggable) {
				_container.style.top = e.clientY - p_dragOffsetY + 'px';
		    	_container.style.left = e.clientX - p_dragOffsetX + 'px';
			}
		};
		function f_initDrag(e) {
			if(e.target.id !== (p_rootId + '-' + p_clearBtnId)) { // the user must click the header, but not the clear btn to drag
				p_isDraggable = true;
				p_dragOffsetX = e.clientX - _container.offsetLeft;
				p_dragOffsetY = e.clientY - _container.offsetTop;
				f_addClass(_container, p_draggableClass);
				f_addListener(document, 'mousemove', f_dragContainer);
			}
		};
		function f_resetDrag() {
			p_isDraggable = false;
			p_dragOffsetX = 0;
			p_dragOffsetY = 0;
			f_removeClass(_container, p_draggableClass);
			f_removeListener(document, 'mousemove', f_dragContainer);
		};
		// convert arguments to a single spaced string message
		function f_argsToString(args) { 
			return args.map(function(a) {
				if(a === null) { return 'null'; }
				if(a === void 0) { return 'undefined'}
				return a.toString();
			}).join(' ');
		};
		function f_initMessageElem(type) {
			var elem = f_createElem('div');
			f_setId(elem, 'msg-' + (++p_msgCount));
			f_addClass(elem, 'msg');
			f_addClass(elem, 'msg-' + type);
			return elem;
		};
		function f_appendMessage(message, type) {
			var elem, msg;
			// init dom message element
			elem = f_initMessageElem(type);
			// add create the DOM message content
			if(type == 'json') {
				msg = f_createElem('pre');
				msg.innerHTML = f_JSONsyntaxHighlight(message);
			} else {
				if(!message) {  // make empty string more visible
					message = '""'; 
					f_addClass(elem, 'msg-empty');
				} 
				msg = f_createTextNode(message);
			}
			// add the message to the DOM
			f_appendChild(elem, msg);
			f_appendChild(_body, elem);
			// scroll to the latest msg
			f_scrollToBottom(_body);
			// set opacity so css animation is activated
			elem.style.opacity = 1;
		};
		function f_JSONstringify(item) {
			if(JSON && typeof JSON.stringify == 'function') {
				return JSON.stringify(item, function(key, value) {
					if(value === void 0) {
						return p_UNDEFINED;
					}
					return value;
				}, p_prettyJSONSpace);
			}
			return null;
		};
		function f_JSONsyntaxHighlight(json) {
		    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		        var cls = 'json-number';
		        if (/^"/.test(match)) {
		            if (/:$/.test(match)) {
		                cls = 'json-key';
		            } else if(match.substring(1, match.length - 1) === p_UNDEFINED) {
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
		        return '<span class="' + p_rootId + '-' + cls + '">' + match + '</span>';
		    });
		};
		function f_log(args) {
			f_appendMessage(f_argsToString(args), 'log');
		};
		function f_info(args) {
			f_appendMessage(f_argsToString(args), 'info');
		};
		function f_debug(args) {
			f_appendMessage(f_argsToString(args), 'debug');
		};
		function f_success(args) {
			f_appendMessage(f_argsToString(args), 'success');
		};
		function f_error(args) {
			f_appendMessage(f_argsToString(args), 'error');
		};
		function f_warn(args) {
			f_appendMessage(f_argsToString(args), 'warn');
		};
		function f_clear() {
			_body.innerHTML = '';
			p_msgCount = 0;
		};
		function f_json(args) {
			f_appendMessage(f_JSONstringify(args[0]), 'json');
		};
		function f_enhanceMethod(name, method) {
			_original[name] = _console[name] || _original['log']; // all custom methods fallback to console.log
			_console[name] = function() {
				method(Array.prototype.slice.call(arguments));
				if(_original[name]) _original[name].apply(_console, arguments);
			}
		};

		// create container
		_container = f_createElem('div');
		f_setId(_container, 'container');
		f_addClass(_container, p_rootId, true);
		f_setDimensions(_container, p_containerDim);
		f_setPadding(_container, p_containerPadding + 'px');

		// prepend the container element to the body
		f_prependChild(f_getByTag('body')[0], _container);

		// create header
		_head = f_createElem('div');
		f_addClass(_head, 'head');
		f_addTextNode(_head, p_titleText);
		f_setHeight(_head, p_headHeight);
		f_addListener(_head, 'mousedown', f_initDrag); 
		f_addListener(_head, 'mouseup', f_resetDrag);
		f_appendChild(_container, _head);

		// create a clear button in the header
		_clearBtn = f_createElem('button');
		_clearBtn.setAttribute('type', 'button');
		f_setId(_clearBtn, p_clearBtnId);
		f_addClass(_clearBtn, p_clearBtnClass);
		f_addTextNode(_clearBtn, p_clearBtnLabel);
		_clearBtn.onclick = function() {
			_console.clear();
		};
		f_appendChild(_head, _clearBtn);

		// create body
		_body = f_createElem('div');
		f_addClass(_body, 'body');
		f_setHeight(_body, p_containerDim - p_headHeight - 2*p_containerPadding);
		f_appendChild(_container, _body);

		// enhance existing console methods
		f_enhanceMethod('log', f_log);
		f_enhanceMethod('info', f_info);
		f_enhanceMethod('debug', f_debug);
		f_enhanceMethod('warn', f_warn);
		f_enhanceMethod('error', f_error);
		f_enhanceMethod('clear', f_clear);

		// create custom console methods
		f_enhanceMethod('success', f_success);
		f_enhanceMethod('json', f_json);
	});
})();