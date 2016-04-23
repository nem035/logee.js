'use strict';

const {
  isArray
} = Array;

const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

// function to get the proper type of a variable 
// shoutout AngusCroll (https://goo.gl/pxwQGp)
function toType(x) {
  return ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
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
function isArrayLike({length}) {
  return toType(length) == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

const TypesMixin = {
  toType,
  isConsole,
  isObject,
  isFunction,
  isRegexp,
  isUndefined,
  isArray,
  isArrayLike
};

export default TypesMixin;