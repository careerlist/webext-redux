"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchObject;

var _constants = require("../constants");

var _arrayDiff = require("./arrayDiff");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Patches the given object according to the specified list of patches.
 * @param {Object} obj The object to patch
 * @param {Array} difference The array of differences generated from diffing
 */
function patchObject(obj, difference) {
  if (!difference.length) {
    return obj;
  } // Start with a shallow copy of the object.


  var newObject = _objectSpread({}, obj); // Iterate through the patches.


  difference.forEach(function (patch) {
    // If the value is an object whose keys are being updated,
    // then recursively patch the object.
    if (patch.change === _constants.DIFF_STATUS_KEYS_UPDATED) {
      newObject[patch.key] = patchObject(newObject[patch.key], patch.value);
    } // If the key has been deleted, delete it.
    else if (patch.change === _constants.DIFF_STATUS_REMOVED) {
        Reflect.deleteProperty(newObject, patch.key);
      } // If the key has been updated to a new value, update it.
      else if (patch.change === _constants.DIFF_STATUS_UPDATED) {
          newObject[patch.key] = patch.value;
        } // If the value is an array, update it
        else if (patch.change === _constants.DIFF_STATUS_ARRAY_UPDATED) {
            newObject[patch.key] = (0, _arrayDiff.applyPatch)(newObject[patch.key], patch.value);
          }
  });
  return newObject;
}