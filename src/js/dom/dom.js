'use strict';

import Constants from '../constants';
import Utils from '../utils';
import Draggable from './draggable';

const {
  assign
} = Object;

const {
	CONTAINER_ID,
	CONTAINER_CLASS,
	BODY_CLASS,
	HEADER_CLASS,
	HEADER_BTN_CLASS,
  FOOTER_CLASS,
  FOOTER_RESIZER_CLASS,
	TOGGLE_HEIGHT_BTN_CLASS,
	HEADER_LABEL_CLASS,
	HEADER_LABEL,
	CLEAR_BTN_CLASS,
	CLEAR_BTN_DESC,
	CLEAR_BTN_LABEL,
	ZOOM_BTNS_CLASS,
	PLUS_BTN_CLASS,
	PLUS_BTN_DESC,
	PLUS_BTN_LABEL,
	MINUS_BTN_CLASS,
	MINUS_BTN_DESC,
	MINUS_BTN_LABEL
} = Constants;

const {
	createElem,
  showElem,
  hideElem,
	setId,
	addClass,
	append,
	prepend,
	appendText,
  getHeight,
  setHeight,
  getFontSize,
	setFontSize,
	addListener,
	setHTML,
	setTitle
} = Utils;

const domElements = {
  container        : undefined, // Logee container
  header           : undefined, // Logee header
  headerLabel      : undefined, // header label
  footer           : undefined, // Logee footer
  footerResizer    : undefined, // resizer element in the footer
  body             : undefined, // Logee body
  toggleHeightBtn  : undefined, // toggleHeight button in the header
  zoomBtns         : undefined, // container for the zoom buttons,
  plusBtn          : undefined, // plus button in the header
  minusBtn         : undefined, // minus button in the header
  clearBtn         : undefined, // clear button in the header
};

const domDefaults = {
  isMinimized : false,
  maxFontSize : 17, // maximum font size for the Logee body
  minFontSize : 11, // minimum font size for the Logee body
  minDim      : 300
}

class DOM extends Draggable {

  constructor(options) {
    super(options);

    assign(this, domElements, domDefaults);
  }

	buildDOM() {

    const {
      maxFontSize,
      minFontSize
    } = this;

    // create Logee Box container
    const container = this.container = createElem('div');
    setId(container, CONTAINER_ID);
    addClass(container, CONTAINER_CLASS);

    // prepend the container element to the body
    prepend(document.body, container);

    // create Logee Box header
    const header = this.header = createElem('div');
    addClass(header, HEADER_CLASS);
    addListener(header, 'mousedown', (e) => this.initDrag(e));
    addListener(header, 'mouseup', (e) => this.resetDrag(e));
    append(container, header);

    // create a clear button in the header
    const toggleHeightBtn = this.toggleHeightBtn = createElem('div');
    addClass(toggleHeightBtn, HEADER_BTN_CLASS);
    addClass(toggleHeightBtn, TOGGLE_HEIGHT_BTN_CLASS);
    appendText(toggleHeightBtn, '-');

    let cachedContainerHeight;
    toggleHeightBtn.onclick = () => {

      const {
        container,
        header,
        body,
        footer
      } = this;

      if(this.isMinimized) {

        setHeight(container, cachedContainerHeight);

        showElem(body);
        showElem(footer);

        setHTML(toggleHeightBtn, '-');
        setTitle(toggleHeightBtn, 'Minimize');

        this.isMinimized = false;

      } else {

        cachedContainerHeight = getHeight(container);

        let bodyHeight = getHeight(body);
        let footerHeight = getHeight(footer);

        hideElem(body);
        hideElem(footer);

        setHeight(container, cachedContainerHeight - bodyHeight - footerHeight);

        setHTML(toggleHeightBtn, '+');
        setTitle(toggleHeightBtn, 'Maximize');
        
        this.isMinimized = true;
      }
    };
    append(header, toggleHeightBtn);

    // create the label in the header
    const headerLabel = this.headerLabel = createElem('span');
    addClass(headerLabel, HEADER_LABEL_CLASS);
    appendText(headerLabel, HEADER_LABEL);
    append(header, headerLabel);

    // create a clear button in the header
    const clearBtn = this.clearBtn = createElem('div');
    addClass(clearBtn, HEADER_BTN_CLASS);
    addClass(clearBtn, CLEAR_BTN_CLASS);
    setTitle(clearBtn, CLEAR_BTN_DESC);
    appendText(clearBtn, CLEAR_BTN_LABEL);
    append(header, clearBtn);

    clearBtn.onclick = () => {
      if (this.isAttachedToConsole) {
        this.browserConsole.clear();
      } else {
        this.clear();
      }
    };

    // create the zoom buttons in the header
    const zoomBtns = this.zoomBtns = createElem('div');
    addClass(zoomBtns, ZOOM_BTNS_CLASS);
    append(header, zoomBtns);

    // create the plus button
    const plusBtn = this.plusBtn = createElem('div');
    addClass(plusBtn, HEADER_BTN_CLASS);
    addClass(plusBtn, PLUS_BTN_CLASS);
    setTitle(plusBtn, PLUS_BTN_DESC);
    appendText(plusBtn, PLUS_BTN_LABEL);
    append(zoomBtns, plusBtn);

    plusBtn.onclick = () => {
      const fontSize = getFontSize(this.body);
      if (fontSize < maxFontSize) {
        setFontSize(this.body, fontSize + 1);
      }
    };

    // create the minus button
    const minusBtn = this.minusBtn = createElem('div');
    addClass(minusBtn, HEADER_BTN_CLASS);
    addClass(minusBtn, MINUS_BTN_CLASS);
    setTitle(minusBtn, MINUS_BTN_DESC);
    appendText(minusBtn, MINUS_BTN_LABEL);
    append(zoomBtns, minusBtn);

    minusBtn.onclick = () => {
      const fontSize = getFontSize(this.body);
      if (fontSize > minFontSize) {
        setFontSize(this.body, fontSize - 1);
      }
    };

    // create Logee Box body
    const body = this.body = createElem('div');
    addClass(body, BODY_CLASS);
    append(container, body);

    // create Logee Box footer
    const footer = this.footer = createElem('div');
    addClass(footer, FOOTER_CLASS);
    append(container, footer);

    // create the resizer
    const resizer = this.resizer = createElem('div');
    addClass(resizer, FOOTER_RESIZER_CLASS);
    addListener(resizer, 'mousedown', (e) => this.initResize(e));
    addListener(document, 'mouseup', (e) => this.resetResize(e));
    append(footer, resizer);

    // add two lines to the resizer
    const line1 = createElem('div');
    addClass(line1, `${FOOTER_RESIZER_CLASS}-line1`);
    append(resizer, line1);

    // add two lines to the resizer
    const line2 = createElem('div');
    addClass(line2, `${FOOTER_RESIZER_CLASS}-line2`);
    append(resizer, line2);
  }
};

export default DOM;
  