'use strict';

import DOMMixin from './dom';
import HelpersMixin from './helpers';
import TypesMixin from './types';

const Utils = Object.assign({}, DOMMixin, HelpersMixin, TypesMixin);

export default Utils; 