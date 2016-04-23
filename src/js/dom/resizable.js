'use strict';

import Constants from '../constants';
import Utils from '../utils';
import Keyboard from './keyboard';

const {
	assign
} = Object;

const {
	RESIZE_CLASS
} = Constants;

const {
	addClass,
	addListener,
	getWidth,
	setWidth,
	getHeight,
	setHeight,
	removeClass,
	removeListener
} = Utils;

const resizeDefaults = {
  isResizing  : false, 
  startY      : 0,     
  startX      : 0,     
  startWidth  : 0,     
  startHeight : 0
};

const resizeState = assign({}, resizeDefaults, {
	listener: null
});

class Resizable extends Keyboard {

	constructor(options) {
		super(options);
		assign(this, resizeDefaults);
	}

	// initializes properties and methods for resizing the element
	initResize({ target, clientX, clientY }) {

		const {
			container
		} = this;

		resizeState.isResizing = true;
		resizeState.startX = clientX;
		resizeState.startY = clientY;
		resizeState.startWidth = getWidth(container);
		resizeState.startHeight = getHeight(container);

		addClass(container, RESIZE_CLASS);

	  resizeState.listener = e => this.resizeContainer(e);
	  addListener(document, 'mousemove', resizeState.listener);
	}

	// called when container is being resized, adjusting its size per mouse movement
	resizeContainer({clientX, clientY}) {
	  const { 
	    container,
	    minDim
	  } = this;

	  const {
	  	isResizing,
	    startX,
	    startY,
	    startWidth,
	    startHeight
	  } = resizeState;

	  if (isResizing) {

	  	const newWidth = startWidth + (clientX - startX);
		  const newHeight = startHeight + (clientY - startY);

	  	if (newWidth >= minDim) {
	  		setWidth(container, newWidth);
	  	}
	    
	  	if (newHeight >= minDim) {
	  		setHeight(container, newHeight);
	  	}
	    
	  }
	}

	// resets properties and methods for resizing the element
	resetResize() {
		const {
	  	isResizing
	  } = resizeState;

	  if (isResizing) {
	  	assign(resizeState, resizeDefaults);
		  removeClass(this.container, RESIZE_CLASS);
		  removeListener(document, 'mousemove', resizeState.listener);
	  }
	  
	}
};

export default Resizable;