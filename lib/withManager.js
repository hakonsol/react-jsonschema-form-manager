"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = withManager;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _deepEqual = require("deep-equal");

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _UpdateStrategy = require("./UpdateStrategy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function DefaultLoadingScreen() {
  return _react2.default.createElement(
    "div",
    { className: "container" },
    _react2.default.createElement(
      "h1",
      null,
      "Loading"
    )
  );
}

function DefaultErrorScreen(_ref) {
  var message = _ref.error.message;

  return _react2.default.createElement(
    "div",
    { className: "container" },
    _react2.default.createElement(
      "h4",
      null,
      "Error"
    ),
    _react2.default.createElement(
      "h2",
      null,
      message
    )
  );
}

var propTypes = {
  configPromise: _propTypes2.default.shape({
    then: _propTypes2.default.func.isRequired
  }).isRequired,
  manager: _propTypes2.default.shape({
    onChange: _propTypes2.default.func.isRequired,
    submit: _propTypes2.default.func.isRequired,
    updateIfChanged: _propTypes2.default.func.isRequired
  }).isRequired,
  updateStrategy: _propTypes2.default.shape({
    onChange: _propTypes2.default.func.isRequired,
    stop: _propTypes2.default.func.isRequired
  }).isRequired
};

function withManager(configPromise, manager) {
  var updateStrategy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _UpdateStrategy.ignoreUpdateStrategy;

  updateStrategy = updateStrategy(manager);

  _propTypes2.default.checkPropTypes(propTypes, { configPromise: configPromise, manager: manager, updateStrategy: updateStrategy }, "props", "react-jsonschema-form-manager");

  var origUpdate = manager.updateIfChanged;
  manager.updateIfChanged = function () {
    var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var upd = origUpdate(force);
    if (upd) {
      upd.then(function (formData) {
        return manager.onUpdate(formData);
      });
    }
    return upd;
  };

  return function (FormComponent, LoadingScreen, ErrorScreen) {
    var FormWithManager = function (_Component) {
      _inherits(FormWithManager, _Component);

      function FormWithManager(props) {
        _classCallCheck(this, FormWithManager);

        var _this = _possibleConstructorReturn(this, (FormWithManager.__proto__ || Object.getPrototypeOf(FormWithManager)).call(this, props));

        _this.updateExternal = function (state, callback) {
          _this.formData = state.formData;
          _this.setState({ formData: state.formData });
          if (callback) {
            callback(state);
          }
        };

        _this.handleChange = function (state) {
          manager.onChange(state);
          updateStrategy.onChange(state);
          _this.updateExternal(state, _this.props.onChange);
        };

        _this.handleSubmit = function (state) {
          manager.submit(state.formData).then(function () {
            _this.updateExternal(state, _this.props.onSubmit);
          });
        };

        _this.handleUpdate = function (formData) {
          _this.setState({ formData: formData });
          if (_this.props.onUpdate) {
            _this.props.onUpdate(formData);
          }
        };

        _this.handleBlur = function (state) {
          manager.onBlur(state);
          _this.updateExternal(state, _this.props.onBlur);
        };

        _this.state = {
          isLoading: true,
          isError: false,
          configPromise: configPromise
        };
        manager.onUpdate = _this.handleUpdate;
        return _this;
      }

      _createClass(FormWithManager, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          updateStrategy.stop();
        }
      }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps, nextState) {
          var sameData = (0, _deepEqual2.default)(nextState.formData, this.formData);
          var sameState = nextState.isLoading === this.state.isLoading && nextState.isError === this.state.isError;
          var sameProps = (0, _deepEqual2.default)(this.props, nextProps);
          return !sameProps || !sameData || !sameState;
        }
      }, {
        key: "componentWillMount",
        value: function componentWillMount() {
          var _this2 = this;

          this.state.configPromise.then(function (config) {
            _this2.setState({
              isLoading: false,
              isEqual: false,
              config: config,
              formData: config.formData
            });
          }).catch(function (error) {
            _this2.setState({ isLoading: false, isError: true, error: error });
          });
        }
      }, {
        key: "render",
        value: function render() {
          var _state = this.state,
              isLoading = _state.isLoading,
              isError = _state.isError,
              error = _state.error,
              config = _state.config,
              formData = _state.formData;

          if (isLoading) {
            return LoadingScreen ? _react2.default.createElement(LoadingScreen, null) : _react2.default.createElement(DefaultLoadingScreen, null);
          } else if (isError) {
            return ErrorScreen ? _react2.default.createElement(ErrorScreen, { error: error }) : _react2.default.createElement(DefaultErrorScreen, { error: error });
          } else {
            var configs = Object.assign({}, this.props, config, { formData: formData });
            return _react2.default.createElement(FormComponent, _extends({}, configs, {
              onSubmit: this.handleSubmit,
              onChange: this.handleChange,
              onBlur: this.handleBlur
            }));
          }
        }
      }]);

      return FormWithManager;
    }(_react.Component);

    return FormWithManager;
  };
}