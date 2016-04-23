'use strict';

import Utils from './utils';
import System from './system';

const {
  isConsole,
  isObject,
  isUndefined,
  assignStrict
} = Utils;

const userAccessibleOptions = {
  useLaunchShortcut     : true, // flag determining if the user can use the launch shortcut
  launchKeyString       : 'L',  // keyboard key that shows/hides Logee when pressed while holding ctrl
  shouldAttachToConsole : true  // determines if Logee should be attached to the console or has to be used independently
};
  
// create a Symbol for the System class to enable proper data encapsulation
const _system = Symbol('System');

class Logee {

  constructor(opts = {}) {

    if (!isObject(opts)) {
      throw new Error(`Passed invalid type "${typeof opts}" for the options arguments.`);
    }

    // grab the console object from the window and make sure it exists
    const { console: browserConsole } = window;

    if (!isConsole(browserConsole)) {
      throw new Error('Missing the console object.');
    }

    // store the console and make sure we only take userAccessible options from the user and ignore the rest
    const options = assignStrict({ browserConsole }, userAccessibleOptions, opts);

    // build the loging system
    this[_system] = new System(window.Logee, options);

  }

  isAttachedToConsole() {
    return this[_system].isAttachedToConsole;
  }
};

if (!isUndefined(window.Logee)) {
  throw new Error('Cannot install Logee because the "Logee" name is already taken.');
} else {
  window.Logee = {
    init(options) {
      new Logee(options);
    }
  };
}
