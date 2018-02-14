"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FormManager = require("./FormManager");

Object.keys(_FormManager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _FormManager[key];
    }
  });
});

var _UpdateStrategy = require("./UpdateStrategy");

Object.keys(_UpdateStrategy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _UpdateStrategy[key];
    }
  });
});

var _withManager = require("./withManager");

var _withManager2 = _interopRequireDefault(_withManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _withManager2.default;