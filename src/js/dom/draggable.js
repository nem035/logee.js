'use strict';

import Constants from '../constants';
import Utils from '../utils';
import Resizable from './resizable';

const {
	assign
} = Object;

const {
	HEADER_BTN_CLASS,
	DRAG_CLASS
} = Constants;

const {
	toLogeeString,
	hasClass,
	setLeft,
	setTop,
	addClass,
	addListener,
	removeClass,
	removeListener
} = Utils;

const dragDefaults = {
  isDragged     : false, // flag indicating if the container is being dragged
  dragOffsetY   : 0,     // vertical offset when dragging the container
  dragOffsetX   : 0,     // horizontal offset when dragging the container
};

const dragState = assign({}, dragDefaults, {
	listener: null // will be assigned in the constructor
});

class Draggable extends Resizable {

	constructor(options) {
		super(options);
		assign(this, dragDefaults);
	}

	// initializes properties and methods for dragging the element
	initDrag({ target, clientX, clientY }) {

	  // the user must click the header, but not a header button
	  if (!hasClass(target, toLogeeString(HEADER_BTN_CLASS))) { 

	    const { container, dragContainer } = this;
	    const { offsetLeft, offsetTop } = container;

	    dragState.isDragged = true;
	    dragState.dragOffsetX = clientX - offsetLeft;
	    dragState.dragOffsetY = clientY - offsetTop;

	    addClass(container, DRAG_CLASS);

	    dragState.listener = e => this.dragContainer(e);
	    addListener(document, 'mousemove', dragState.listener);
	  }
	}

	// called when container is being dragged, adjust its screen position per mouse movement
	dragContainer({clientX, clientY}) {
	  const { 
	    container
	  } = this;

	  const {
	  	isDragged,
	    dragOffsetX,
	    dragOffsetY
	  } = dragState;

	  if (isDragged) {
	  	setLeft(container, clientX - dragOffsetX);
	  	setTop(container, clientY - dragOffsetY);
	  }
	}

	// resets properties and methods for dragging the element
	resetDrag() {
	  assign(dragState, dragDefaults);
	  removeClass(this.container, DRAG_CLASS);
	  removeListener(document, 'mousemove', dragState.listener);
	}
};

export default Draggable;