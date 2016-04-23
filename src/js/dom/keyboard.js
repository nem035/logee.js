'use strict';

import Utils from '../utils';

const {
	assign
} = Object;

const {
	showElem,
	hideElem,
	addListener
} = Utils;

const keyStringToCode = {
  'shift' : 16,
  'ctrl'  : 17,
  'alt'   : 18,
  'space' : 32,
  'left'  : 37,
  'up'    : 38,
  'right' : 39,
  'down'  : 40,
  'L'     : 76
};

const keyCodeToString = {
  16 : 'shift',
  17 : 'ctrl',
  18 : 'alt',
  32 : 'space',
  37 : 'left',
  38 : 'up',
  39 : 'right',
  40 : 'down',
  76 : 'L'
};

const keyboardDefaults = {
  isShowing: true
};

class Keyboard {

	constructor({launchKeyString, useLaunchShortcut}) {
		assign(this, { launchKeyString, useLaunchShortcut }, keyboardDefaults);

		if (this.useLaunchShortcut) {
			addListener(document, 'keyup', e => {
				if (this.isValidInput(e)) {
					this.toggle(e);
				}
			});
		}
	}

	// Toggle shortcut is CTRL + {shortcut}
	isValidInput({ctrlKey, keyCode}) {
		return ctrlKey && keyCodeToString[keyCode] === this.launchKeyString;
	}

	// called when the user presses the toggle shortcut
	toggle(e) {
		if (this.isShowing) {
			this.hideContainer(e);
		} else {
			this.showContainer(e);
		}
	}

	showContainer(e) {

		showElem(this.container);
		this.isShowing = true;
	}

	hideContainer(e) {
		hideElem(this.container);
		this.isShowing = false;
	}
};

export default Keyboard;