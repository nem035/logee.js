'use strict';

import Utils from './utils';
import UI from './ui';

const {
  assign
} = Object;

const {
  isFunction,
  each,
  append
} = Utils;

class System extends UI {

  constructor(Logee, options) {

    super(options);
    
    assign(this, { Logee }, options, { isAttachedToConsole: options.shouldAttachToConsole });

    this.installMethods();
    this.buildDOM();
  }

  installMethods() {

    const {
      Logee
    } = this;

    // set the fallback console.log method when using custom Logee methods
    this.logFallback = this.browserConsole.log;

    const methods = ['log', 'info', 'debug', 'warn', 'error', 'success'];

    // clear() is a special case, it doesn't create any messages
    Logee.clear = this.createClearMethod();
    if (this.shouldAttachToConsole) {
      this.attachToConsole('clear'); 
    }

    // extend console methods
    each(methods, methodName => {

      Logee[methodName] = this.createMethod(methodName);
      
      if (this.shouldAttachToConsole) {
        this.attachToConsole(methodName);
      }
    }); 
  }

  createClearMethod() {
    return () => {
      this.clear();
    }
  }

  createMethod(methodName) {
    
    const self = this;
    return function(...args) {

      // create appropriate dom msg div
      const msgDOM = self.createLogeeMessage(methodName);

      // create the dom nodes from each argument, styled according to the console method
      const nodes = args.map(a => self.createLogeeMessageNode(a, methodName));
        
      // add the nodes to the dom
      each(nodes, n => append(msgDOM, n));

      // append logee message to the dom
      self.appendLogeeMessage(msgDOM);
    };
  }

  attachToConsole(methodName) {

    const {
      browserConsole,
      Logee
    } = this;

    const oldConsoleMethod = this.getConsoleMethodWithFallback(methodName);
          
    const self = this;
    browserConsole[methodName] = function() {
      
      Logee[methodName](...arguments);

      // call the old console method
      oldConsoleMethod.apply(browserConsole, arguments);
    }
  }

  getConsoleMethodWithFallback(methodName) {
    const method = this.browserConsole[methodName];
    return isFunction(method) ? method : this.logFallback;
  }


};

export default System;