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
exports.toggleOnOff = toggleOnOff;
exports.getUserId = getUserId;
exports.updateAllListsWithNewList = updateAllListsWithNewList;
exports.updateAllListsWithNewCount = updateAllListsWithNewCount;
exports.handleError = handleError;

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
      changeInnerTextOfEl = _ref$changeInnerTextO === void 0 ? null : _ref$changeInnerTextO;
  var form = document.createElement("form");
  form.classList.add("generated-inline");
  var parent = element.parentElement;
  var changingEl = changeInnerTextOfEl && parent.querySelector(changeInnerTextOfEl);
  form.addEventListener("submit", handleSubmit);
  form.innerHTML = "\n    <input type=\"text\" class=\"small-inline-input\" value=\"".concat((changeInnerTextOfEl ? changingEl.innerHTML : "&nbsp;").trim(), "\"/> \n    <button type=\"submit\">").concat(btnText, "</button>\n    ");

  if (replaceParent === false || !replaceParent) {
    element.replaceWith(form);
  } else {
    parent.replaceWith(form);
  }

  form.elements[0].focus();
  clickOutside(form.parentElement, formReset);

  function handleSubmit(e) {
    callback(e, parent);
    formReset();

    if (changeInnerTextOfEl) {
      var newVal = form.querySelector(".small-inline-input").value;
      changingEl.innerText = newVal;
    }
  }

  function formReset() {
    if (!replaceParent) {
      form.replaceWith(element);
    } else {
      form.replaceWith(parent);
    }

    form.removeEventListener("submit", handleSubmit);
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
    if (document.contains(e.target) && !actionElement.closest(parentElementSelector).contains(e.target)) {
      delete actionElement.closest(parentElementSelector).dataset.state;
    }
  }
}

function getUserId() {
  return WP.userId;
}

function clickOutside(element, callback) {
  document.body.addEventListener("click", runCallBack);

  function runCallBack(e) {
    if (!element) return;

    if (document.contains(e.target) && !element.contains(e.target) && element !== e.target) {
      callback();
    }
  }
}

function updateAllListsWithNewList(newListItem, parentList) {
  updateAllListsWith(function (list) {
    var clone = newListItem.cloneNode(true);
    if (parentList === list) return;
    list.prepend(clone);
  });
}

function updateAllListsWithNewCount(_ref2) {
  var itemId = _ref2.itemId,
      newCount = _ref2.newCount,
      parentList = _ref2.parentList;
  updateAllListsWith(function (list) {
    if (parentList === list) return;
    var countToUpdate = list.querySelector("[data-list-id=\"".concat(itemId, "\"] .count"));
    countToUpdate.innerText = newCount;
  });
}

function updateAllListsWith(callback) {
  _toConsumableArray(document.querySelectorAll(".add-recipe-to-list")).forEach(function (parentEl) {
    var list = parentEl.querySelector("ul");
    callback(list);
  });
}

function handleError(err, item) {
  if (err.message) {
    alert(err.message);
  }

  item.dataset.state = "error";
}
},{}],"scripts/add-list.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCreateListHandler = addCreateListHandler;
exports.handleShowCreateListForm = handleShowCreateListForm;
exports.handleAddList = handleAddList;

var _helpers = require("./helpers");

function addCreateListHandler(parent) {
  var showFormBtn = parent.querySelector("[data-action='show-create-list']");
  showFormBtn.addEventListener("click", function () {
    return handleShowCreateListForm(showFormBtn);
  });
}

function handleShowCreateListForm(element) {
  var callback = handleAddList;
  var btnText = "create";
  (0, _helpers.replaceWithForm)({
    element: element,
    callback: callback,
    btnText: btnText,
    replaceParent: false,
    waitTillResolve: true
  });
} //ADD LIST


function handleAddList(e) {
  e.preventDefault();

  var _getInputValueByForm = (0, _helpers.getInputValueByForm)(e.target),
      listName = _getInputValueByForm.index0;

  var userId = (0, _helpers.getUserId)();
  var listParent = e.target.closest(".lists, .add-recipe-to-list").querySelector("ul");
  var listItemCopy = createNewListItem(listParent, listName);
  listItemCopy.dataset.state = "loading";
  addList(listName, userId).then(function (res) {
    if (res.error) {
      (0, _helpers.handleError)(res.error, listItemCopy);
    } else {
      var _res$data = res.data,
          list_id = _res$data.list_id,
          link = _res$data.link;
      var listItem = updateNewListItemWith({
        listItemCopy: listItemCopy,
        list_id: list_id,
        link: link
      });
      listItem.dataset.state = "idle"; // this is for the recipe button

      if (listParent.classList.contains("lists")) {
        (0, _helpers.updateAllListsWithNewList)(listItem, listParent);
      }
    }
  });
}

function createNewListItem(listParent, listName) {
  var listItemCopy = listParent.querySelector("li").cloneNode(true);
  listItemCopy.querySelector(".recipe-title .title-el").innerText = listName;
  listParent.prepend(listItemCopy);
  return listItemCopy;
}

function updateNewListItemWith(_ref) {
  var listItemCopy = _ref.listItemCopy,
      list_id = _ref.list_id,
      link = _ref.link;
  listItemCopy.dataset.listId = list_id;
  var titleEl = listItemCopy.querySelector(".recipe-title .title-el");
  if (titleEl.hasAttribute("href")) titleEl.setAttribute("href", link);
  return listItemCopy;
}

function addList(listName, userId) {
  var data = {
    user_id: parseInt(userId),
    title: listName
  };
  return (0, _helpers.useApi)("create-list", data);
}
},{"./helpers":"scripts/helpers.js"}],"scripts/add-recipe-button.js":[function(require,module,exports) {
"use strict";

var _helpers = require("./helpers");

var _addList = require("./add-list");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

window.addEventListener("DOMContentLoaded", addRecipeToListButtonInit);

function addRecipeToListButtonInit() {
  var mainComponents = _toConsumableArray(document.querySelectorAll(".add-recipe-to-list"));

  mainComponents.forEach(function (component) {
    return perMainComponentDo(component);
  });
}

function perMainComponentDo(component) {
  var toggleButton = component.querySelector('[data-action="toggle-list"]');
  (0, _helpers.toggleOnOff)(toggleButton, ".add-recipe-to-list");
  var list = component.querySelector(".button-lists");
  list.addEventListener("click", handleRecipeListItemActionFromButton);

  function handleRecipeListItemActionFromButton(e) {
    var clickedItem = e.target;
    var button = clickedItem.closest("[data-action]");
    var action = button && button.dataset.action;
    if (!action) return;

    switch (action) {
      case "add-recipe":
        handleAddRecipeToList(button.parentElement, component);
        break;

      case "show-create-list":
        (0, _addList.handleShowCreateListForm)(button);

      default:
        console.log("no action was given");
        break;
    }
  }
}

function handleAddRecipeToList(listItem, component) {
  listItem.dataset.state = "loading";
  var countEl = listItem.querySelector(".count");
  var newCount = parseInt(countEl.innerText) + 1;
  countEl.innerText = newCount;
  var data = {
    recipeId: component.dataset.recipeId,
    listId: listItem.dataset.listId
  };
  addRecipeToList(data).then(function (res) {
    if (res.error) {
      (0, _helpers.handleError)(res.error, listItem);
    } else {
      listItem.dataset.state = "idle";
      (0, _helpers.updateAllListsWithNewCount)({
        itemId: data.listId,
        newCount: newCount,
        parentElement: listItem.parentElement
      });
    }
  });
}

function addRecipeToList(_ref) {
  var recipeId = _ref.recipeId,
      listId = _ref.listId;
  return (0, _helpers.useApi)("add-item", {
    item_id: parseInt(recipeId),
    list_id: listId
  });
}
},{"./helpers":"scripts/helpers.js","./add-list":"scripts/add-list.js"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
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
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/tooltip.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"styles/global.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"global.js":[function(require,module,exports) {
"use strict";

require("./scripts/add-recipe-button.js");

require("./styles/tooltip.scss");

require("./styles/global.scss");
},{"./scripts/add-recipe-button.js":"scripts/add-recipe-button.js","./styles/tooltip.scss":"styles/tooltip.scss","./styles/global.scss":"styles/global.scss"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59903" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","global.js"], null)
//# sourceMappingURL=/global.js.map