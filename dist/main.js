// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceWithForm = replaceWithForm;
exports.useApi = useApi;
exports.getInputValue = getInputValue;
exports.getInputValueByForm = getInputValueByForm;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BASE_URL = "/wp-json/recipe-list/v1";
var OPTIONS = {
  method: "POST",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json"
  }
};

function replaceWithForm(_ref) {
  var element = _ref.element,
      callback = _ref.callback,
      _ref$formLabel = _ref.formLabel,
      formLabel = _ref$formLabel === void 0 ? null : _ref$formLabel,
      _ref$btnText = _ref.btnText,
      btnText = _ref$btnText === void 0 ? "submit" : _ref$btnText,
      _ref$replaceParent = _ref.replaceParent,
      replaceParent = _ref$replaceParent === void 0 ? false : _ref$replaceParent,
      _ref$changeInnerTextO = _ref.changeInnerTextOfEl,
      changeInnerTextOfEl = _ref$changeInnerTextO === void 0 ? null : _ref$changeInnerTextO,
      _ref$waitTillResolve = _ref.waitTillResolve,
      waitTillResolve = _ref$waitTillResolve === void 0 ? false : _ref$waitTillResolve;
  var form = document.createElement("form");
  form.classList.add("generated-inline");
  var parent = element.parentElement;
  form.addEventListener("submit", function (e) {
    callback(e, parent);

    if (!replaceParent) {
      form.replaceWith(element);
    } else {
      form.replaceWith(parent);
    }

    if (changeInnerTextOfEl) {
      var newVal = form.querySelector(".small-inline-input").value;
      console.log(newVal);
      parent.querySelector(changeInnerTextOfEl).innerText = newVal;
    }
  });
  form.innerHTML = "\n    <input type=\"text\" placeholder=\"".concat(formLabel, "\" class=\"small-inline-input\" /> \n    <button type=\"submit\">").concat(btnText, "</button>\n    ");

  if (replaceParent === false || !replaceParent) {
    console.log(element);
    element.replaceWith(form);
  } else {
    parent.replaceWith(form);
  }
}

function useApi(endpoint, data) {
  var body = JSON.stringify(data);
  return fetch("".concat(BASE_URL, "/").concat(endpoint), _objectSpread(_objectSpread({}, OPTIONS), {}, {
    body: body
  })).then(function (res) {
    return res.json();
  });
}

function getInputValue(selector) {
  var el = document.querySelector(selector);
  var value = el.value;
  return value;
}

function getInputValueByForm(form) {
  var inputs = _toConsumableArray(form.querySelectorAll("input"));

  var values = inputs.reduce(function (valueObj, input, index) {
    var value = input.value,
        name = input.name;

    if (name) {
      valueObj[name] = value;
    } else {
      valueObj["index".concat(index)] = value;
    }

    return valueObj;
  }, {});
  return values;
}
},{}],"scripts/main.js":[function(require,module,exports) {
"use strict";

var _helpers = require("./helpers");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

window.addEventListener("DOMContentLoaded", initManagement);

function initManagement() {
  if (!document.querySelector(".recipe-list-management-area")) return;
  var list = document.querySelector(".my-lists");
  addListItemActionHandlers(list);
  var listBottom = document.querySelector(".lists-action");
  addCreateListHandler(listBottom);
} //HANDLERS AND API CALLS


function addCreateListHandler(parent) {
  console.log("object");
  var showFormBtn = parent.querySelector("[data-action='show-create-list']");
  showFormBtn.addEventListener("click", handleShowCreateListForm);
}

function handleShowCreateListForm(e) {
  var element = e.currentTarget;
  var callback = handleAddList;
  var formLabel = "List Name";
  var btnText = "create";
  (0, _helpers.replaceWithForm)({
    element: element,
    callback: callback,
    formLabel: formLabel,
    btnText: btnText,
    replaceParent: false,
    waitTillResolve: true
  });
} //ADD LIST


function handleAddList(e) {
  e.preventDefault();

  var _getInputValueByForm = (0, _helpers.getInputValueByForm)(e.target),
      listName = _getInputValueByForm.index0;

  var userId = getUserId();
  var listParent = document.querySelector(".my-lists");
  var listItemCopy = listParent.querySelector(".list-item").cloneNode(true);
  listItemCopy.querySelector(".recipe-title a").innerText = listName;
  listItemCopy.dataset.state = "loading";
  listParent.prepend(listItemCopy);
  addList(listName, userId).then(function (res) {
    if (res.error) {
      listItemCopy.dataset.state = "error";
    } else {
      var id = res.data.id;
      listItemCopy.dataset.listId = id;
      listItemCopy.dataset.state = "idle";
    }
  });
}

function addList(listName, userId) {
  var data = {
    user_id: parseInt(userId),
    title: listName
  };
  return (0, _helpers.useApi)("create-list", data);
}

function addListItemActionHandlers(list) {
  list.addEventListener("click", executeListItemAction);

  function executeListItemAction(e) {
    var item = e.target;
    var action = item.dataset.action;
    if (!action) return;

    switch (action) {
      case "delete-list":
        handleDeleteList(item);
        break;

      case "rename-list":
        handleRenameListBtnClick(item);
    }
  }
} //DELETE LIST


function handleDeleteList(element) {
  var list = element.closest(".list-item");
  var listId = list.dataset.listId;
  var parentElement = list.parentElement;
  var userId = getUserId();
  list.dataset.state = "loading";
  var response = deleteList(listId, userId).then(function (res) {
    if (res.error) {
      list.dataset.state = "error";
    } else {
      parentElement.removeChild(list);
    }
  });
}

function deleteList(listId, userId) {
  var data = {
    list_id: parseInt(listId),
    user_id: parseInt(userId)
  };
  return (0, _helpers.useApi)("delete-list", data);
} //RENAME LIST


function handleRenameListBtnClick(element) {
  var titleEl = element.closest(".list-item").querySelector(".recipe-title a");
  (0, _helpers.replaceWithForm)({
    element: element,
    callback: handleRenameRecipe,
    btnText: "rename",
    replaceParent: true,
    changeInnerTextOfEl: ".recipe-title a"
  });
}

function handleRenameRecipe(e, parent) {
  e.preventDefault();

  var _getInputValueByForm2 = (0, _helpers.getInputValueByForm)(e.target),
      title = _getInputValueByForm2.index0;

  var list = e.target.closest(".list-item");
  var list_id = list.dataset.listId;
  var titleEl = parent.querySelector("a");
  list.dataset.state = "loading";
  (0, _helpers.useApi)("rename-list", {
    title: title,
    list_id: list_id
  }).then(function (res) {
    if (res.error) {
      console.log(res.error);
      list.dataset.state = "error";
    } else {
      console.log("ran");
      list.dataset.state = "idle";
    }
  });
} //HANDLES ADDING ITEMS TO A LIST
//THIS MAY NEED TO BE ADDED TO A NEW LIST
// Jul 14, 2020 - Joseph changed this to accommodate his staging area.


function addRecipeToList(_ref) {
  var recipeId = _ref.recipeId,
      listId = _ref.listId;
  return (0, _helpers.useApi)("add-item", {
    item_id: parseInt(recipeId),
    list_id: listId
  });
}

function getUserId() {
  return document.querySelector("[data-user-id]").dataset.userId;
} //!--//--//
//////////////////////////////////////////////////////////////////////////////
//* PUT IN NEW JS FILE => BUTTON-RECIPE-LIST.JS
//////////////////////////////////////////////////////////////////////////////


function toggleOnOff(actionElement, parentElementSelector) {
  var action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "click";
  actionElement.addEventListener(action, toggleState);

  if (action === "click") {
    document.body.addEventListener(action, toggleOff);
  }

  function toggleState(e) {
    var parentEl = e.target.closest(parentElementSelector);
    var on = parentEl.dataset.state;

    if (on) {
      delete parentEl.dataset.state;
    } else {
      parentEl.dataset.state = "on";
    }
  }

  function toggleOff(e) {
    if (!e.target.closest(parentElementSelector)) {
      delete actionElement.closest(parentElementSelector).dataset.state;
    }
  }
}

window.addEventListener("DOMContentLoaded", addRecipeToListButtonInit);

function addRecipeToListButtonInit() {
  var mainComponents = _toConsumableArray(document.querySelectorAll(".add-recipe-to-list"));

  mainComponents.forEach(function (component) {
    return perMainComponentDo(component);
  });
}

function perMainComponentDo(component) {
  var toggleButton = component.querySelector('[data-action="toggle-list"]');
  toggleOnOff(toggleButton, ".add-recipe-to-list");
  var list = component.querySelector(".button-lists");
  list.addEventListener("click", handleRecipeListItemActionFromButton);

  function handleRecipeListItemActionFromButton(e) {
    var clickedItem = e.target;
    var button = clickedItem.closest("[data-action]");
    var action = button.dataset.action;

    switch (action) {
      case "add-recipe":
        addRecipeToList({
          recipeId: component.dataset.recipeId,
          listId: button.dataset.listId
        });
        plusOneCountFor(button.dataset.listId);
        break;

      default:
        console.log("no action was given");
        break;
    }
  }

  function plusOneCountFor(listId) {
    var allListWithID = document.querySelectorAll("[data-list-id=\"".concat(listId, "\"]"));
    allListWithID.forEach(function (list) {
      var countEl = list.querySelector(".recipe-title .count");
      var updatedCount = parseInt(countEl.innerText) + 1;
      countEl.innerText = updatedCount;
    });
  }
}
},{"./helpers":"scripts/helpers.js"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/main.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"main.js":[function(require,module,exports) {
"use strict";

require("./scripts/main.js");

require("./styles/main.scss");
},{"./scripts/main.js":"scripts/main.js","./styles/main.scss":"styles/main.scss"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51419" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.js.map