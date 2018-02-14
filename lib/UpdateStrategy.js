"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ignoreUpdateStrategy = ignoreUpdateStrategy;
exports.instantUpdateStrategy = instantUpdateStrategy;
exports.intervalUpdateStrategy = intervalUpdateStrategy;
function ignoreUpdateStrategy() {
  return {
    onChange: function onChange() {},
    stop: function stop() {}
  };
}

function instantUpdateStrategy(manager) {
  return {
    onChange: function onChange() {
      return manager.updateIfChanged();
    },
    stop: function stop() {}
  };
}

function intervalUpdateStrategy(period) {
  return function (manager) {
    var interval = setInterval(function () {
      return manager.updateIfChanged();
    }, period);
    return {
      onChange: function onChange() {},
      stop: function stop() {
        return clearInterval(interval);
      }
    };
  };
}