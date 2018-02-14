"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.checkCredentials = checkCredentials;
exports.fetchWithCredentials = fetchWithCredentials;
function checkCredentials(credentials) {
  if (credentials !== undefined && credentials !== null && (typeof credentials === "undefined" ? "undefined" : _typeof(credentials)) !== "object" && typeof credentials !== "function") {
    throw new Error("Credentials can be object or function(req)");
  }
}

function fetchWithCredentials(req, credentials) {
  if (credentials === undefined || credentials === null) {
    return fetch(req);
  } else if ((typeof credentials === "undefined" ? "undefined" : _typeof(credentials)) === "object") {
    return fetch(req, credentials);
  } else {
    var signedReq = credentials(req);
    return Promise.resolve(signedReq).then(function (req) {
      return fetch(req);
    });
  }
}