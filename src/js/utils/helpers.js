'use strict';

import Types from './types';

const {
  keys
} = Object;

const {
  isObject,
  isArray,
  isArrayLike,
  isUndefined
} = Types;

// function to iterate over an object or an array
function each(item, cb) {
  if(isObject(item)) {
    for (let key of keys(item)) {
      cb(item[key], key);
    }
  } else if(isArrayLike(item)) {
    [...item].forEach(cb);
  } else {
    throw new Error('Argument is not iterable');
  }
}

// recursively converts all circular references of an object to a string `replacement`
function convertCircRefsRecursively(oldObj, currObj, newObj, replacement = 'Circular Ref') {
  each(currObj, (val, prop) => {
    
    if (isObject(val) || isArray(val)) {

      // detect a circular reference
      if (val === oldObj) {
        newObj[prop] = replacement;
      } 
      // otherwise initialize the current object
      else {
        if(isArray(val)) {
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
  const strictKeys = keys(strictSource);

  strictKeys.forEach(key => {
    let prop = otherSource[key];
    if (!isUndefined(prop)) {
      to[key] = prop;
    } else {
      to[key] = strictSource[key];
    }
  });

  return to;
}

const HelpersMixin = {
  each,
  convertCircRefsRecursively,
  assignStrict
};

export default HelpersMixin;