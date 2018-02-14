"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESTFormManager = exports.LocalStorageFormManager = undefined;

var _rfc = require("rfc6902");

var _rfc2 = _interopRequireDefault(_rfc);

var _utils = require("react-jsonschema-form/lib/utils");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormManager = function FormManager() {
  _classCallCheck(this, FormManager);
};

var DEFAULT_KEY = "form";

var LocalStorageFormManager = exports.LocalStorageFormManager = function (_FormManager) {
  _inherits(LocalStorageFormManager, _FormManager);

  function LocalStorageFormManager() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_KEY;

    _classCallCheck(this, LocalStorageFormManager);

    var _this = _possibleConstructorReturn(this, (LocalStorageFormManager.__proto__ || Object.getPrototypeOf(LocalStorageFormManager)).call(this));

    _this.doUpdate = function () {
      localStorage.setItem(_this.key, JSON.stringify(_this.formData));
      return Promise.resolve(_this.formData);
    };

    _this.submit = function (formData) {
      _this.formData = formData ? formData : _this.formData;
      return _this.doUpdate();
    };

    _this.onChange = function (_ref) {
      var formData = _ref.formData;

      _this.formData = formData;
    };

    _this.sameData = function () {
      if (localStorage.getItem(_this.key) !== null) {
        var savedStr = localStorage.getItem(_this.key);
        var sameData = savedStr === JSON.stringify(_this.formData);
        return sameData;
      }
      return false;
    };

    _this.updateIfChanged = function () {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!force && _this.sameData()) {
        return undefined;
      }
      return _this.doUpdate();
    };

    _this.key = key;
    _this.formData = {};
    return _this;
  }

  return LocalStorageFormManager;
}(FormManager);
/* eslint no-unused-vars: 0*/


var RESTAPI = function RESTAPI(url, credentials) {
  var _this2 = this;

  _classCallCheck(this, RESTAPI);

  this.post = function (formData) {
    var postReq = new Request(_this2.url, {
      method: "POST",
      body: JSON.stringify(formData)
    });
    return (0, _utils2.fetchWithCredentials)(postReq, _this2.credentials).then(function (res) {
      return res.json();
    });
  };

  this.put = function (id, formData) {
    var putUrl = _this2.url + "/" + id;
    var putReq = new Request(putUrl, {
      method: "PUT",
      body: JSON.stringify(formData)
    });
    return (0, _utils2.fetchWithCredentials)(putReq, _this2.credentials).then(function (res) {
      return res.json();
    });
  };

  this.patch = function (id, oldFormData, formData) {
    var patchUrl = _this2.url + "/" + id;
    var patchReq = new Request(patchUrl, {
      method: "PATCH",
      body: _rfc2.default.createPatch(oldFormData, formData)
    });
    return (0, _utils2.fetchWithCredentials)(patchReq, _this2.credentials).then(function (res) {
      return res.json();
    });
  };

  this.url = url;
  this.credentials = credentials;
};

var RESTFormManager = exports.RESTFormManager = function (_FormManager2) {
  _inherits(RESTFormManager, _FormManager2);

  function RESTFormManager(url) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";
    var credentials = arguments[2];
    var patch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, RESTFormManager);

    var _this3 = _possibleConstructorReturn(this, (RESTFormManager.__proto__ || Object.getPrototypeOf(RESTFormManager)).call(this));

    _this3.onChange = function (_ref2) {
      var formData = _ref2.formData;

      _this3.formData = formData;
      if (!_this3.id) {
        _this3.id = _this3.toID(formData);
      }
    };

    _this3.submit = function () {
      var formData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return _this3.api.post(formData).then(function (saved) {
        _this3.id = _this3.toID(saved);
        return saved;
      });
    };

    _this3.isNew = function () {
      return _this3.id === undefined;
    };

    _this3.updateIfChanged = function () {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!force && (0, _utils.deepEquals)(_this3.formData, _this3.savedFormData)) {
        return Promise.resolve(_this3.formData);
      }
      if (_this3.isNew()) {
        return _this3.submit(_this3.formData);
      } else if (_this3.patch) {
        _this3.savedFormData = _this3.formData;
        return _this3.api.patch(_this3.id, _this3.savedFormData, _this3.formData);
      } else {
        _this3.savedFormData = _this3.formData;
        return _this3.api.put(_this3.id, _this3.formData);
      }
    };

    _this3.toID = typeof id === "function" ? id : function (formData) {
      return formData[id];
    };
    _this3.api = new RESTAPI(url, credentials);
    _this3.patch = patch;

    _this3.formData = {};
    _this3.savedFormData = {};

    (0, _utils2.checkCredentials)(credentials);
    return _this3;
  }

  return RESTFormManager;
}(FormManager);