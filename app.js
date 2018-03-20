(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};

require.register("classnames/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "classnames");
  (function() {
    /*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());
  })();
});

require.register("csjs/csjs.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

module.exports = require('./lib/csjs');
  })();
});

require.register("csjs/get-css.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

module.exports = require('./lib/get-css');
  })();
});

require.register("csjs/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');
  })();
});

require.register("csjs/lib/base62-encode.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function encode(integer) {
  if (integer === 0) {
    return '0';
  }
  var str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
};
  })();
});

require.register("csjs/lib/build-exports.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

var makeComposition = require('./composition').makeComposition;

module.exports = function createExports(classes, keyframes, compositions) {
  var keyframesObj = Object.keys(keyframes).reduce(function(acc, key) {
    var val = keyframes[key];
    acc[val] = makeComposition([key], [val], true);
    return acc;
  }, {});

  var exports = Object.keys(classes).reduce(function(acc, key) {
    var val = classes[key];
    var composition = compositions[key];
    var extended = composition ? getClassChain(composition) : [];
    var allClasses = [key].concat(extended);
    var unscoped = allClasses.map(function(name) {
      return classes[name] ? classes[name] : name;
    });
    acc[val] = makeComposition(allClasses, unscoped);
    return acc;
  }, keyframesObj);

  return exports;
}

function getClassChain(obj) {
  var visited = {}, acc = [];

  function traverse(obj) {
    return Object.keys(obj).forEach(function(key) {
      if (!visited[key]) {
        visited[key] = true;
        acc.push(key);
        traverse(obj[key]);
      }
    });
  }

  traverse(obj);
  return acc;
}
  })();
});

require.register("csjs/lib/composition.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

module.exports = {
  makeComposition: makeComposition,
  isComposition: isComposition,
  ignoreComposition: ignoreComposition
};

/**
 * Returns an immutable composition object containing the given class names
 * @param  {array} classNames - The input array of class names
 * @return {Composition}      - An immutable object that holds multiple
 *                              representations of the class composition
 */
function makeComposition(classNames, unscoped, isAnimation) {
  var classString = classNames.join(' ');
  return Object.create(Composition.prototype, {
    classNames: { // the original array of class names
      value: Object.freeze(classNames),
      configurable: false,
      writable: false,
      enumerable: true
    },
    unscoped: { // the original array of class names
      value: Object.freeze(unscoped),
      configurable: false,
      writable: false,
      enumerable: true
    },
    className: { // space-separated class string for use in HTML
      value: classString,
      configurable: false,
      writable: false,
      enumerable: true
    },
    selector: { // comma-separated, period-prefixed string for use in CSS
      value: classNames.map(function(name) {
        return isAnimation ? name : '.' + name;
      }).join(', '),
      configurable: false,
      writable: false,
      enumerable: true
    },
    toString: { // toString() method, returns class string for use in HTML
      value: function() {
        return classString;
      },
      configurable: false,
      writeable: false,
      enumerable: false
    }
  });
}

/**
 * Returns whether the input value is a Composition
 * @param value      - value to check
 * @return {boolean} - whether value is a Composition or not
 */
function isComposition(value) {
  return value instanceof Composition;
}

function ignoreComposition(values) {
  return values.reduce(function(acc, val) {
    if (isComposition(val)) {
      val.classNames.forEach(function(name, i) {
        acc[name] = val.unscoped[i];
      });
    }
    return acc;
  }, {});
}

/**
 * Private constructor for use in `instanceof` checks
 */
function Composition() {}
  })();
});

require.register("csjs/lib/csjs.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

var extractExtends = require('./css-extract-extends');
var composition = require('./composition');
var isComposition = composition.isComposition;
var ignoreComposition = composition.ignoreComposition;
var buildExports = require('./build-exports');
var scopify = require('./scopeify');
var cssKey = require('./css-key');
var extractExports = require('./extract-exports');

module.exports = function csjsTemplate(opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  var noscope = (typeof opts.noscope === 'undefined') ? false : opts.noscope;

  return function csjsHandler(strings, values) {
    // Fast path to prevent arguments deopt
    var values = Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }
    var css = joiner(strings, values.map(selectorize));
    var ignores = ignoreComposition(values);

    var scope = noscope ? extractExports(css) : scopify(css, ignores);
    var extracted = extractExtends(scope.css);
    var localClasses = without(scope.classes, ignores);
    var localKeyframes = without(scope.keyframes, ignores);
    var compositions = extracted.compositions;

    var exports = buildExports(localClasses, localKeyframes, compositions);

    return Object.defineProperty(exports, cssKey, {
      enumerable: false,
      configurable: false,
      writeable: false,
      value: extracted.css
    });
  }
}

/**
 * Replaces class compositions with comma seperated class selectors
 * @param  value - the potential class composition
 * @return       - the original value or the selectorized class composition
 */
function selectorize(value) {
  return isComposition(value) ? value.selector : value;
}

/**
 * Joins template string literals and values
 * @param  {array} strings - array of strings
 * @param  {array} values  - array of values
 * @return {string}        - strings and values joined
 */
function joiner(strings, values) {
  return strings.map(function(str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}

/**
 * Returns first object without keys of second
 * @param  {object} obj      - source object
 * @param  {object} unwanted - object with unwanted keys
 * @return {object}          - first object without unwanted keys
 */
function without(obj, unwanted) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (!unwanted[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
  })();
});

require.register("csjs/lib/css-extract-extends.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

var makeComposition = require('./composition').makeComposition;

var regex = /\.([^\s]+)(\s+)(extends\s+)(\.[^{]+)/g;

module.exports = function extractExtends(css) {
  var found, matches = [];
  while (found = regex.exec(css)) {
    matches.unshift(found);
  }

  function extractCompositions(acc, match) {
    var extendee = getClassName(match[1]);
    var keyword = match[3];
    var extended = match[4];

    // remove from output css
    var index = match.index + match[1].length + match[2].length;
    var len = keyword.length + extended.length;
    acc.css = acc.css.slice(0, index) + " " + acc.css.slice(index + len + 1);

    var extendedClasses = splitter(extended);

    extendedClasses.forEach(function(className) {
      if (!acc.compositions[extendee]) {
        acc.compositions[extendee] = {};
      }
      if (!acc.compositions[className]) {
        acc.compositions[className] = {};
      }
      acc.compositions[extendee][className] = acc.compositions[className];
    });
    return acc;
  }

  return matches.reduce(extractCompositions, {
    css: css,
    compositions: {}
  });

};

function splitter(match) {
  return match.split(',').map(getClassName);
}

function getClassName(str) {
  var trimmed = str.trim();
  return trimmed[0] === '.' ? trimmed.substr(1) : trimmed;
}
  })();
});

require.register("csjs/lib/css-key.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';
  })();
});

require.register("csjs/lib/extract-exports.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = extractExports;

function extractExports(css) {
  return {
    css: css,
    keyframes: getExport(css, keyframesRegex),
    classes: getExport(css, classRegex)
  };
}

function getExport(css, regex) {
  var prop = {};
  var match;
  while((match = regex.exec(css)) !== null) {
    var name = match[2];
    prop[name] = name;
  }
  return prop;
}
  })();
});

require.register("csjs/lib/get-css.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};
  })();
});

require.register("csjs/lib/hash-string.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */

module.exports = function hashStr(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0;
};
  })();
});

require.register("csjs/lib/regex.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

var findClasses = /(\.)(?!\d)([^\s\.,{\[>+~#:)]*)(?![^{]*})/.source;
var findKeyframes = /(@\S*keyframes\s*)([^{\s]*)/.source;
var ignoreComments = /(?!(?:[^*/]|\*[^/]|\/[^*])*\*+\/)/.source;

var classRegex = new RegExp(findClasses + ignoreComments, 'g');
var keyframesRegex = new RegExp(findKeyframes + ignoreComments, 'g');

module.exports = {
  classRegex: classRegex,
  keyframesRegex: keyframesRegex,
  ignoreComments: ignoreComments,
};
  })();
});

require.register("csjs/lib/replace-animations.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    var ignoreComments = require('./regex').ignoreComments;

module.exports = replaceAnimations;

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    var regexStr = '((?:animation|animation-name)\\s*:[^};]*)('
      + unscoped.join('|') + ')([;\\s])' + ignoreComments;
    var regex = new RegExp(regexStr, 'g');

    var replaced = result.css.replace(regex, function(match, preamble, name, ending) {
      return preamble + animations[name] + ending;
    });

    return {
      css: replaced,
      keyframes: result.keyframes,
      classes: result.classes
    }
  }

  return result;
}
  })();
});

require.register("csjs/lib/scoped-name.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};
  })();
});

require.register("csjs/lib/scopeify.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "csjs");
  (function() {
    'use strict';

var fileScoper = require('./scoped-name');
var replaceAnimations = require('./replace-animations');
var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = scopify;

function scopify(css, ignores) {
  var makeScopedName = fileScoper(css);
  var replacers = {
    classes: classRegex,
    keyframes: keyframesRegex
  };

  function scopeCss(result, key) {
    var replacer = replacers[key];
    function replaceFn(fullMatch, prefix, name) {
      var scopedName = ignores[name] ? name : makeScopedName(name);
      result[key][scopedName] = name;
      return prefix + scopedName;
    }
    return {
      css: result.css.replace(replacer, replaceFn),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  var result = Object.keys(replacers).reduce(scopeCss, {
    css: css,
    keyframes: {},
    classes: {}
  });

  return replaceAnimations(result);
}
  })();
});

require.register("mithril/mithril.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "mithril");
  (function() {
    ;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}
		for(var key in attrs) {
			if (hasOwn.call(attrs, key)) {
				newAttrs[key] = attrs[key]
			}
		}
		attrs = newAttrs
	}
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, ns, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string") {
			if (typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			if (key2 === "value") {
				var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select") {
					if (value === null) {
						if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
					} else {
						if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					}
				}
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
			}
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		var namespace = dom.namespaceURI
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		dom.vnodes = vnodes
		// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
		if (active != null && $doc.activeElement !== active) active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw === false) e.redraw = undefined
		else redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.6"
m.vnode = Vnode
if (typeof module !== "undefined") module["exports"] = m
else window.m = m
}());
  })();
});
require.register("components/character/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _generic_table = require('components/generic_table');

var _generic_table2 = _interopRequireDefault(_generic_table);

var _dice = require('../../dice');

var _common_styles = require('../common_styles.js');

var _common_styles2 = _interopRequireDefault(_common_styles);

var _styles = require('./styles.js');

var _styles2 = _interopRequireDefault(_styles);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _rules = require('../../rules.js');

var rules = _interopRequireWildcard(_rules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function printableSign(num) {
  return num === 0 ? '±' : num < 0 ? '-' : '+';
}

class GeneralInfomationComponent {
  view(vnode) {
    const character = vnode.attrs.character;
    const {
      name,
      age,
      gender,
      affiliation,
      socialStanding,
      profession,
      height,
      weight
    } = character.generalInformation;

    return (0, _mithril2.default)(_generic_table2.default, {
      columns: [{ title: 'Field' }, { title: 'Value' }],
      getRows: () => [['Character name', name], ['Gender', gender], ['Social standing', socialStanding], ['Weight (kg)', weight], ['Height (cm)', height], ['Age', age], ['Affiliation', affiliation], ['Profession', profession]],
      renderRow: ([prop, val]) => (0, _mithril2.default)('tr', [(0, _mithril2.default)('td', prop), (0, _mithril2.default)('td', { className: _common_styles2.default.textAlignRight }, val)])
    });
  }
}

class BasicCapabilitiesComponent {
  view(vnode) {
    return (0, _mithril2.default)(_generic_table2.default, {
      columns: [{ title: 'Capability' }, { title: 'Value' }],
      getRows: () => {
        const {
          STR,
          PHY,
          COR,
          INT,
          MST,
          PER
        } = vnode.attrs.character.basicCapabilities;
        return [['STR', STR], ['PHY', PHY], ['COR', COR], ['INT', INT], ['MST', MST], ['PER', PER]];
      },
      renderRow: ([prop, val]) => (0, _mithril2.default)('tr', [(0, _mithril2.default)('td', prop), (0, _mithril2.default)('td', { className: _common_styles2.default.textAlignRight }, val)])
    });
  }
}

class CombatStatisticsComponent {
  view(vnode) {
    const character = vnode.attrs.character;
    const bc = character.basicCapabilities;

    const ma = rules.movementAllowance(bc);
    const ob = rules.offensiveBonus(bc);
    const act = rules.actionsPerRound(bc);
    const db = rules.defensiveBonus(bc);
    const pb = rules.perceptionBonus(bc);
    const ib = rules.initiativeBonus(bc);
    const { totalBodyPoints } = rules.bodyPoints(bc);

    return (0, _mithril2.default)(_generic_table2.default, {
      columns: [{ title: 'Property' }, { title: 'Value' }],
      getRows: () => [['LEVEL', character.generalInformation.level], ['Total BP\'s', totalBodyPoints], ['Movement allowance, sqr/act', ma.squaresPerAction], ['Movement allowance, m/min', ma.metersPerMinute.toFixed(0)], ['Initiative bonus (IB)', printableSign(ib) + ib.toString()], ['Offensive bonus (OB)', printableSign(ob) + ob.toString()], ['Actions / CR', act], ['Defensive bonus', printableSign(db) + db.toString()], ['Perception bonus', printableSign(pb) + pb.toString()]],
      renderRow: ([prop, val]) => (0, _mithril2.default)('tr', [(0, _mithril2.default)('td', prop), (0, _mithril2.default)('td', { className: _common_styles2.default.textAlignRight }, val)])
    });
  }
}

class BodyPointsComponent {
  view(vnode) {
    const character = vnode.attrs.character;
    const bc = character.basicCapabilities;
    const { bodyParts } = rules.bodyPoints(bc);
    return (0, _mithril2.default)(_generic_table2.default, {
      columns: [{ title: 'Body part' }, { title: 'Points' }],
      getRows: () => Object.keys(bodyParts).map(bp => [bp, bodyParts[bp]]),
      renderRow: ([prop, val]) => (0, _mithril2.default)('tr', [(0, _mithril2.default)('td', prop), (0, _mithril2.default)('td', { className: _common_styles2.default.textAlignRight }, val)])
    });
  }
}

class SkillTableComponent {
  view(vnode) {
    const skills = vnode.attrs.skills;

    return (0, _mithril2.default)(_generic_table2.default, {
      getRows: () => skills.map(([name, value]) => [name, value]),
      renderRow: ([prop, val]) => (0, _mithril2.default)('tr', [(0, _mithril2.default)('td', prop), (0, _mithril2.default)('td', { className: _common_styles2.default.textAlignRight }, val)])
    });
  }
}

class SkillsComponent {
  view(vnode) {
    const character = vnode.attrs.character;

    return (0, _mithril2.default)('div', { className: _common_styles2.default.flex }, [(0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h4', 'Combat'), (0, _mithril2.default)(SkillTableComponent, { skills: character.skills.combat })]), (0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h4', 'Firearms'), (0, _mithril2.default)(SkillTableComponent, { skills: character.skills.firearms })]), (0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h4', 'Communication'), (0, _mithril2.default)(SkillTableComponent, { skills: character.skills.communication })]), (0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h4', 'Technical'), (0, _mithril2.default)(SkillTableComponent, { skills: character.skills.technical })]), (0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h4', 'Movement'), (0, _mithril2.default)(SkillTableComponent, { skills: character.skills.movement })]), (0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h4', 'Special'), (0, _mithril2.default)(SkillTableComponent, { skills: character.skills.special })])]);
  }
}

class CharacterComponent {
  view(vnode) {
    const character = vnode.attrs.character;

    return (0, _mithril2.default)('div', {}, [(0, _mithril2.default)('h3', `Character sheet for: ${character.generalInformation.name}`), (0, _mithril2.default)('div', {}, [(0, _mithril2.default)('div', { className: _styles2.default.fwTables }, [(0, _mithril2.default)('div', { className: _common_styles2.default.flex }, [(0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h3', 'General Information'), (0, _mithril2.default)(GeneralInfomationComponent, { character })]), (0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h3', 'Basic Capabilities'), (0, _mithril2.default)(BasicCapabilitiesComponent, { character })]), (0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h3', 'Combat Statistics'), (0, _mithril2.default)(CombatStatisticsComponent, { character })]), (0, _mithril2.default)('div', { className: _common_styles2.default.spacingRight }, [(0, _mithril2.default)('h3', 'Body Points'), (0, _mithril2.default)(BodyPointsComponent, { character })])])]), (0, _mithril2.default)('div', {}, [(0, _mithril2.default)('h3', 'Skills'), (0, _mithril2.default)(SkillsComponent, { character })])])]);
  }
}
exports.default = CharacterComponent;
});

;require.register("components/character/styles.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _csjs = require('csjs');

var _csjs2 = _interopRequireDefault(_csjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _csjs2.default`
.fwTables table {
  width: 100%;
}
`;
});

;require.register("components/common_styles.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _csjs = require('csjs');

var _csjs2 = _interopRequireDefault(_csjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const solarized = `
@solarized-yellow:  #b58900;
@solarized-orange:  #cb4b16;
@solarized-red:     #dc322f;
@solarized-magenta: #d33682;
@solarized-violet:  #6c71c4;
@solarized-blue:    #268bd2;
@solarized-cyan:    #2aa198;
@solarized-green:   #859900;

@solarized-base03:  #002b36;
@solarized-base02:  #073642;
@solarized-base01:  #586e75;
@solarized-base00:  #657b83;
@solarized-base0:   #839496;
@solarized-base1:   #93a1a1;
@solarized-base2:   #eee8d5;
@solarized-base3:   #fdf6e3;
`;

exports.default = _csjs2.default`
.flex {display: flex;}
.f1 {flex: 1;}
.f2 {flex: 2;}
.f3 {flex: 3;}
.f4 {flex: 4;}
.flexCol {flex-direction: column;}
.flexSpaceBetween {align-content: space-between;}

.spacingRight {margin-right: 5px;}

.likeAnchor {
  color: blue;
  background: transparent;
}
.likeAnchor:hover {
  text-decoration: underline;
}

.textAlignRight {
  text-align: right;
}
`;
});

;require.register("components/generic_table/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GenericTableComponent {
  constructor(vnode) {
    const attrs = vnode.attrs;
    this.async = attrs.async;
    this.columns = attrs.columns || [];
    this.getRows = attrs.getRows;
    this.renderRow = attrs.renderRow;
  }

  view(vnode) {
    return (0, _mithril2.default)('table', [this.getHead(), (0, _mithril2.default)('tbody', [this.getRows().map(this.renderRow)])]);
  }

  getHead() {
    if (this.columns.length === 0) {
      return void 0;
    }

    return (0, _mithril2.default)('thead', [(0, _mithril2.default)('tr', this.columns.map(col => (0, _mithril2.default)('th', col.title)))]);
  }
}
exports.default = GenericTableComponent;
});

;require.register("components/main/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _styles = require('./styles.js');

var _styles2 = _interopRequireDefault(_styles);

var _tabs = require('../tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _character = require('../character');

var _character2 = _interopRequireDefault(_character);

var _rule_tables = require('../rule_tables');

var _rule_tables2 = _interopRequireDefault(_rule_tables);

var _prototype_definitions = require('../../random/prototype_definitions.js');

var _prototype_definitions2 = _interopRequireDefault(_prototype_definitions);

var _random = require('../../random');

var _dice = require('../../dice.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MainComponent {
  view() {
    const tabs = (0, _mithril2.default)(_tabs2.default, {
      navigation: [{
        title: 'Characters',
        content: () => (0, _mithril2.default)(_character2.default, { character: (0, _random.getCharacter)(_prototype_definitions2.default.criminals.streetScum, (0, _dice.cast)(1, 10)) })
      }, { title: 'Tables', content: () => (0, _mithril2.default)(_rule_tables2.default) }, { title: 'Combat', content: () => (0, _mithril2.default)('div', 'Combat') }, { title: 'Import/Export', content: () => (0, _mithril2.default)('div', [(0, _mithril2.default)('div', 'Import'), (0, _mithril2.default)('div', 'Export')]) }]
    });
    return (0, _mithril2.default)('div', { className: _styles2.default.main }, [tabs]);
  }
}
exports.default = MainComponent;
});

;require.register("components/main/styles.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _csjs = require('csjs');

var _csjs2 = _interopRequireDefault(_csjs);

var _common_styles = require('../common_styles.js');

var _common_styles2 = _interopRequireDefault(_common_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _csjs2.default`
.main extends ${_common_styles2.default.col} {
  width: 100%;
  height: 100%;
}
`;
});

;require.register("components/rule_tables/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RuleTables {
  view() {
    return (0, _mithril2.default)('div', [(0, _mithril2.default)('table', [(0, _mithril2.default)('tbody', ['a', 'b'].map(n => (0, _mithril2.default)('tr', [1, 2].map(v => (0, _mithril2.default)('td', n + v)))))])]);
  }
}
exports.default = RuleTables;
});

;require.register("components/tabs/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styles = require('./styles.js');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TabsComponent {
  static DEFAULT_NAVIGATION() {
    return [{ title: 'EMPTY', content: () => (0, _mithril2.default)('div', 'EMPTY') }];
  }

  constructor(vnode) {
    this.navigation = vnode.attrs.navigation || TabsComponent.DEFAULT_NAVIGATION();
    this.selectedNode = this.navigation[0];
  }

  view(vnode) {
    return (0, _mithril2.default)('div', { className: _styles2.default.component }, [(0, _mithril2.default)('div', { className: _styles2.default.tabNodeList }, this.getTabs()), (0, _mithril2.default)('div', { className: _styles2.default.tabContent }, this.getCurrentContent())]);
  }

  getTabs() {
    return this.navigation.map(node => (0, _mithril2.default)('button', {
      type: 'button',
      className: (0, _classnames2.default)(_styles2.default.tabNode.toString(), {
        [_styles2.default.active.toString()]: node == this.getCurrentNode()
      }),
      onclick: this.onTabClick.bind(this, node)
    }, node.title));
  }

  onTabClick(node) {
    this.selectedNode = node;
  }

  getCurrentNode() {
    return this.navigation.filter(node => node === this.selectedNode)[0];
  }

  getCurrentContent() {
    return this.getCurrentNode().content();
  }
}
exports.default = TabsComponent;
});

;require.register("components/tabs/styles.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _csjs = require('csjs');

var _csjs2 = _interopRequireDefault(_csjs);

var _common_styles = require('../common_styles.js');

var _common_styles2 = _interopRequireDefault(_common_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spacing = {
  small: '5px'
};

exports.default = _csjs2.default`
.component extends ${_common_styles2.default.col} {
  flex: 1;
}

.tabNodeList {
  display: flex;
  width: 100%;
}

.tabContent extends ${_common_styles2.default.row} {
  display: flex;
  flex: 1;
  border: 1px solid silver;
  padding: ${spacing.small};
  overflow-y: scroll;
}

.tabNode {
  top: 1px;
  position: relative;
  outline: none;
}

.active {
  border-bottom: 1px solid white;
}
`;
});

;require.register("dice.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.castExpr = castExpr;
exports.extendedCast = extendedCast;
exports.cast = cast;
exports.die = die;
exports.d4 = d4;
exports.d6 = d6;
exports.d8 = d8;
exports.d10 = d10;
exports.d12 = d12;
exports.d20 = d20;
exports.d100 = d100;
function castExpr(expr) {
  /**
   e.g.
   - castExpr('d20+4')
   - castExpr('4d6-4')
   */
  throw new Error('not implemented');
}

function extendedCast(diceCount, dieSides, options) {
  const mod = options.mod || 0;
  let outcomes = [];
  for (let i = 0; i < diceCount; ++i) {
    outcomes.push(die(dieSides));
  }
  if ('top' in options) {
    outcomes.sort().reverse();
    outcomes = outcomes.slice(0, options.top);
  }

  let result = outcomes.reduce((a, b) => a + b, mod);
  if ('max' in options) {
    result = Math.min(options.max, result);
  }
  if ('min' in options) {
    result = Math.max(options.min, result);
  }

  return result;
}

function cast(diceCount, dieSides, mod = 0) {
  let result = mod;
  for (let i = 0; i < diceCount; ++i) {
    result += die(dieSides);
  }

  return result;
}

function die(sides) {
  return 1 + (Math.random() * sides | 0);
}

function d4() {
  return die(4);
}

function d6() {
  return die(6);
}

function d8() {
  return die(8);
}

function d10() {
  return die(10);
}

function d12() {
  return die(12);
}

function d20() {
  return die(20);
}

function d100() {
  return die(100);
}
});

;require.register("initialize.js", function(exports, require, module) {
'use strict';

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _style_manager = require('./style_manager.js');

var _main = require('./components/main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', () => {
  // do your setup here
  _mithril2.default.mount(document.body, _main2.default);
  (0, _style_manager.registerStyles)(document);
  console.log('Initialized app');
});
});

require.register("random/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCharacter = getCharacter;

var _dice = require('../dice.js');

var dice = _interopRequireWildcard(_dice);

var _rules = require('../rules.js');

var rules = _interopRequireWildcard(_rules);

var _utilities = require('./utilities');

var _names = require('./names');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const { skills } = rules;

const corps = ['capitol', 'mishima', 'bauhaus', 'imperial', 'cybertronic'];
const characterPrototypes = {
  criminals: ['streetScum', 'gangster', 'mobster'],
  brotherhood: ['inquisitor', 'mystic', 'warrior', 'mortificator'],
  mundane: ['wageSlave', 'officeWorker'],
  corporate: ['police', 'military'],
  cartel: ['agent', 'doomTrooper'],
  freelancer: ['detective', 'problemSolver'],
  heretics: ['infiltrator']

  /**
   define the abstract level of the character
   e.g.
   level 0:  a really incompetent person, not capable of anything
   level 5:  an ordinary person, being capable of most mundane tasks
   level 10: a super-competent expert, probably with multiple areas of expertise.
   */
};const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function getCharacter(protoDef, level = 1) {
  function dc(args) {
    /**
     LEVEL/MOD
     1 0
     2 0
     3 0
     4 0
     5 0
     6 1
     7 2
     8 3
     9 5
     10 7
     */
    const mod = Math.pow(level * 4, 3) / 9000 | 0;
    return dice.extendedCast.apply(null, args) + mod;
  }

  const corp = (0, _utilities.pickOne)(corps);
  const gender = Math.random() < 0.6 ? 'M' : 'F';
  const profession = protoDef.name;
  const generalInformation = {
    level,
    name: (0, _names.getRandomName)(corp, gender),
    age: dc(protoDef.generalInformation.age),
    gender,
    height: dc(protoDef.generalInformation.height),
    weight: dc(protoDef.generalInformation.weight),
    socialStanding: dc(protoDef.generalInformation.socialStanding),
    affiliation: protoDef.generalInformation.affiliation.corporate ? [corp] : [],
    profession
  };

  const basicCapabilities = {
    STR: dc(protoDef.basicCapabilities.STR),
    PHY: dc(protoDef.basicCapabilities.PHY),
    COR: dc(protoDef.basicCapabilities.COR),
    INT: dc(protoDef.basicCapabilities.INT),
    MST: dc(protoDef.basicCapabilities.MST),
    PER: dc(protoDef.basicCapabilities.PER)
  };

  function chance(real) {
    return Math.random() < real;
  }

  function rollSkills(skillDefs, skills) {
    /**
     LEVEL/BASEVAL
     1 0
     2 0
     3 1
     4 2
     5 3
     6 4
     7 5
     8 6
     9 7
     10 9
     */
    const baseVal = level + Math.pow(level * 3, 1.5) / 18 | 0;
    const baseChance = 0.30;
    const lessChance = 0.05;
    const moreChance = 0.45;

    const min = skillDefs.min || 0;
    const max = skillDefs.max || null;
    const extra = skillDefs.extra || {};
    const less = extra.less || [];
    const more = extra.more || [];

    function randVal() {
      return baseVal + dice.cast(1, 6);
    }

    let count = 0;

    const pass1 = skills.map(skill => {
      let value = rules.smartBaseSkillValue(basicCapabilities, skill);
      if (!max || count <= max) {
        if (less.includes(skill.name)) {
          if (chance(lessChance)) {
            count++;
            value = randVal();
          }
        } else if (more.includes(skill.name)) {
          if (chance(moreChance)) {
            count++;
            value = randVal();
          }
        } else {
          if (chance(baseChance)) {
            count++;
            value = randVal();
          }
        }
      }

      return [skill.name, Math.max(value, level)];
    });

    if (count < min) {
      const picked = [];
      const diff = min - count;
      for (let i = 0, tries = 0; i < diff && tries < 100; ++i, ++tries) {
        const idx = (0, _utilities.randomIndex)(pass1);
        if (picked.includes(idx)) {
          --i;
          continue;
        } else {
          picked.push(idx);
          const [skillName, value] = pass1[idx];
          pass1[idx] = [skillName, randVal()];
        }
      }
    }
    return pass1;
  }

  return {
    generalInformation,
    basicCapabilities,
    skills: {
      combat: rollSkills(protoDef.skills.combat, skills.combat.slice()),
      firearms: rollSkills(protoDef.skills.firearms, skills.firearms.slice()),
      communication: rollSkills(protoDef.skills.communication, skills.communication.slice()),
      movement: rollSkills(protoDef.skills.movement, skills.movement.slice()),
      technical: rollSkills(protoDef.skills.technical, skills.technical.slice()),
      special: [['avoid', rules.defensiveBonus(basicCapabilities) + dice.cast(1, 4)], ['perception', rules.perceptionBonus(basicCapabilities) + dice.cast(1, 4)], ['the art', 0]]
    }
  };
}
});

;require.register("random/names/bauhaus.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const rawGerFemale = exports.rawGerFemale = `Lore Thiel
Isabel Bacharach
Nadine Molitor
Erica Huhn
Mara Grimminger
Dora Feistel
Seraphina Lüthi
Hannah Schoff
Celina Rosenhain
Mirjam Rohrbach
Nina Geschke
Emma Prantl
Heidemarie Glas
Franziska Schaab
Rahel Neuer
Liselotte Stassen
Luzie Scharwenka
Theresa Fellner
Emely Müntefering
Sibylle Mahlau`;

const rawGerMale = exports.rawGerMale = `Per Westheimer
Alwin Bartz
Dominik Krämer
Mathias Daschner
Albrecht Wegener
Gotthard Grau
Arno Scholz
Claus Schützenberger
Andre Honigsberg
Berend Erlach
Ulrich Hagel
Marco Heim
Eckhard Schindler
Marian Hämmerli
Denis Hänel
Dominik Rathenau
Ben Heerwagen
Gunther Heldt
Mike Schultze
Axel Schwan`;

const rawRusMale = exports.rawRusMale = `Lagransky Prokhor Filippovich
Furmanov Ilarion Semyonovich
Yesaulov Saveliy (Sava) Vladislavovich
Drugov Christov Yegorovich
Volodin Isaak Vladislavovich
Mesyats Kliment Fyodorovich
Reznikov Dimitri Timurovich
Blazhenov Taras (Tarasik) Afanasievich
Bogdanov Panteley Zakharovich
Yudachyov Yaroslav (Slava) Semyonovich
Dvoynev Anton (Antosha) Petrovich
Pozdnyakov Stepan (Styopa) Yegorovich
Polotentsev Arseniy Zakharovich
Charkov Ilarion Denisovich
Kuklev Lavr Valeryevich
Penkin Pavel (Pasha) Ruslanovich
Masmekhov Luka Leonidovich
Ovechkin Igor (Igorek) Pavlovich
Budanov Victor (Vitya) Semyonovich
Katayev Artemiy Valerianovich`;

const rawRusFemale = exports.rawRusFemale = `Fyodorova Adeliya Georgievna
Rzhevskaya Yuliya (Yulia) Valerievna
Nikulina Adeliya Nikolayevna
Lantsova Luiza Timofeyevna
Buzinskaya Katenka Semyonovna
Smolina Ulyana Leonidovna
Tereshchenko Rakhila Anatolievna
Kapralova Orina Gennadievna
Barndyk Tasha Maximovna
Lipina Aleksasha Nikolayevna`;

const rawMale = exports.rawMale = rawGerMale + '\n' + rawRusMale;
const rawFemale = exports.rawFemale = rawGerFemale + '\n' + rawRusFemale;
});

;require.register("random/names/capitol.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const rawMale = exports.rawMale = `Zachariah Woodford
Winford Ruddock
Trevor Hazel
Patricia Courts
Ezra Lacross
Jordan Porcaro
Barry Dudas
Santo Okeeffe
Donovan Hemstreet
Warner Sepulveda
Everett Schull
Lyndon Maris
Maxwell Lymon
Garth Secord
Jules Marti
Julio Maland
Gregory Gusman
Jessie Bruder
Alvin Milone
Ulysses Milici
Porfirio Melugin
Jeffrey Sternberg
Myles Sumrall
Kieth Markel
Francesco Dollison
Graham Recalde
Casey Pozo
Demarcus Lueders
Ken Kratz
Scot Kelliher
Grover Rahaim
Ronald Patao
Cristobal Coover
Royce Toupin
Alfredo Rowell
Johnnie Hua
Cleveland Delosantos
Ross Ridenour
Herbert Bratt
Harrison Ma
Dexter Bianchi
Gayle Hadnot
Thomas Keenan
Nathanial Keala
Jeremy Motz
Donnie Landsman
Les Difiore
Trinidad Yzaguirre
Marlin Roseberry
Sal Hinze`;

const rawFemale = exports.rawFemale = `Floretta Sabatino
Kate Cranor
Hildred Kuhlman
Euna Toon
Lezlie Linthicum
Iola Callison
Jeanene Christopherso
Janna Zeiger
Jonie Desouza
Maureen Steward
Melvina Cadwell
Leia Drapeau
Andera Higginbotham
Leeanne Krejci
Laree Secor
Kathaleen Cashion
Kenisha Mulcahy
Ching Sandusky
Clotilde Burmeister
Sunny Bufkin
Milissa Apolinar
Luella Purves
Mariela Paschke
Kitty Six
Shavonne Bondi
Lona Artman
Jodee Yorke
Shasta Delaney
Elvira Powers
Ludivina Denk
Farrah Utt
Trista Sass
Amal Martensen
Ariana Fabian
Serena Vedder
Caryn Thon
Emelia Urick
Rosana Desmarais
Cassidy Wixom
Janiece Zeller
Aja Mohn
Hye Kuhns
Celine Ting
Erma Mccrae
Dena Tippett
Krystle Zahm
Marquetta Sever
Lashaun Worthey
Lizzie Crandell
Ammie Mackson`;
});

;require.register("random/names/imperial.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const rawMale = exports.rawMale = `Terence Akers
Steven Allan
Julian Baker
Keith Boulter
Laurie Bradley
Keith Brooks
Paul Broom
David Brown
Michael Burrell
John Cavender
Anthony Coates
Angus Dick
Nafees Din
Gary Dyson
John Evans
David Farris
John Fitchett
Mahmoud Gilani
Anthony Gooch
Glenn Goodier
Graham Hannam
Richard Hardwick
Douglas Horn
Peter Hunter
Mark Jarvis
Ronald Knox
Simon Latham
Bev Littlewood
Angus MacGregor
Kenneth McWilliam
Joshua Mills
Colin Neville
Andrew O'Connell
Mitul Pala
Shivji Patel
Gordon Porter
Donald Richards
William Robinson
Frank Ross
Alexander Smith
Michael Smith
Graham Summers
David Thomas
Matthew Thomas
Robert Voice
Ben Wanless
David Waring
Leslie Winstanley
Leslie Woodford
Robert Young`;

const rawFemale = exports.rawFemale = `Sacha Appleton
Janet Ashworth
Louise Barker
Audrey Blankley
Nicola Butterworth
Janine Button
Aisling Byrne
Joyce Carroll
Wendy Carter
Paula Clarke
Paulinr Clough
Diana Cole
Susan Davis
Sally Downs
Tracey Edward
Kerry Evans
Iris Fenn
Karen Fergus
Kathryn Gallop
Angela Gilbert
Andrea Greig
Rebecca Halpin
Sarah Hesse
Sarah Hickey
Michelle Holland
Susan Honour
Laura Hull
Susan James
Sarah Jamieson
Brenda Jones
Louise Lamb
Frances McDaid
Blanche McLaughlin
Anne McShane
Doreen Mercer
Eileen Moran
Charlotte Morgan
Elizabeth Nolan
Sophie Payne
Karamjit Rama
Rosemary Rowlands
Margaret Sanderson
Julie Sawyer
Evelyn Smith
Victoria Taylor
Lynn Thomas
Jean Tynan
Marie Wagg
Margaret Williams
Emma Wilson`;
});

;require.register("random/names/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomName = getRandomName;

var _utilities = require('../utilities');

var _bauhaus = require('./bauhaus.js');

var bauhaus = _interopRequireWildcard(_bauhaus);

var _capitol = require('./capitol.js');

var capitol = _interopRequireWildcard(_capitol);

var _imperial = require('./imperial.js');

var imperial = _interopRequireWildcard(_imperial);

var _mishima = require('./mishima.js');

var mishima = _interopRequireWildcard(_mishima);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const cybertronic = [bauhaus, capitol, imperial, mishima].reduce((out, next) => {
  out.rawMale += '\n' + next.rawMale;
  out.rawFemale += '\n' + next.rawFemale;
  return out;
}, {
  rawMale: '',
  rawFemale: ''
});

function getRandomName(corp, gender) {
  const dispatch = { bauhaus, capitol, imperial, mishima, cybertronic };
  const obj = dispatch[corp];
  let src = null;
  if (gender === 'M') {
    src = obj['rawMale'];
  } else {
    src = obj['rawFemale'];
  }
  src = src.split('\n');
  return (0, _utilities.pickOne)(src);
}
});

;require.register("random/names/mishima.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const rawFemale = exports.rawFemale = `Yuguchi Kayoko
Izumi Toku
Yamabe Tamiko
Kawada Aoba
Yoichi Seiko
Furukawa Yukiji
Kure Rikako
Watabe Taya
Sawada Kiyumi
Hoga Rebun
Sadow Tomoko
Shoji Akeno
Saeki Etsuko
Shimoda Fuji
Hanamura Miyako
Hakuryū Chihiro
Hatanaka Chika
Inugami Chise
Mizutani Tanaka
Takeshita Kaminari
Nagamine Kaneie
Sawada Shoraku
Shoda Ryosei
Sasaki Hoitsu
Moto Gonshiro
Kajiwara Yoshiyuki
Terada Yorikane
Kojima Manzo
Ishikawa Kamlyn
Yabuta Hirotada`;

const rawMale = exports.rawMale = `Nagamine Kaneie
Sawada Shoraku
Shoda Ryosei
Sasaki Hoitsu
Moto Gonshiro
Kajiwara Yoshiyuki
Terada Yorikane
Kojima Manzo
Ishikawa Kamlyn
Yabuta Hirotada
Matsumura Kiyonori
Yamashita Murai
Hirata Namboku
Kanbayashi Motoki
Nakano Ryushi
Inugami Tadamasa
Kogane Naosuke
Motome Shichirobei
Arai Konosuke
Yamashiro Motoyasu
Sugiyama Shirai
Aoki Norihisa
Nagai Nichiren
Uchimura Shiba
Iwayanagi Tadakuni
Terada Eishi
Yahiro Terumoto
Goya Soshitsu
Fukunaga Mutsohito
Kinjo Gengyo`;
});

;require.register("random/prototype_definitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const def = {
  generalInformation: {
    affiliation: {
      corporate: false,
      local: false
    },
    height: [4, 10, { mod: 140 }],
    weight: [4, 10, { mod: 40 }],
    age: [4, 10, { mod: 10 }], // 14-50
    socialStanding: [1, 10, {}]
  },
  basicCapabilities: {
    // arguments for dice.extendedCast
    STR: [3, 6, {}], // e.g. 3d6, no special
    PHY: [3, 6, {}],
    COR: [3, 6, {}],
    INT: [3, 6, {}],
    MST: [3, 6, {}],
    PER: [3, 6, {}]
  },
  skills: {
    combat: { min: 0, max: 0, extra: {} },
    firearms: { min: 0, max: 0, extra: {} },
    communication: { min: 0, max: 0, extra: {} },
    movement: { min: 0, max: 0, extra: {} },
    technical: { min: 0, max: 0, extra: {} },
    special: { min: 0, max: 0, extra: {} }
  }
};

exports.default = {
  criminals: {
    streetScum: {
      name: 'criminal:street scum',
      generalInformation: {
        affiliation: {
          corporate: false,
          local: true
        },
        height: [4, 10, { mod: 140 }],
        weight: [4, 10, { mod: 40 }],
        age: [4, 10, { mod: 10 }], // 14-50
        socialStanding: [1, 4, {}]
      },
      basicCapabilities: {
        STR: [4, 6, { top: 3 }],
        PHY: [3, 6, { min: 10 }],
        COR: [3, 6, { min: 8 }],
        INT: [3, 6, {}],
        MST: [3, 6, {}],
        PER: [3, 6, { max: 13 }]
      },
      skills: {
        combat: { min: 2, max: null, extra: { less: ['silent combat'] } },
        firearms: { min: 1, max: null, extra: { more: ['handguns', 'light automatics'], less: ['shoulder launched'] } },
        communication: { min: null, max: null, extra: {} },
        movement: { min: 3, max: null, extra: {} },
        technical: { min: null, max: null, extra: { more: ['locksmith', 'mechanics', 'survival'] } },
        special: { min: null, max: 0, extra: {} }
      }
    }
  }
};
});

;require.register("random/utilities.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomIndex = randomIndex;
exports.pickOne = pickOne;
function randomIndex(arr) {
  return Math.random() * arr.length | 0;
}

function pickOne(arr) {
  return arr[randomIndex(arr)];
}
});

;require.register("rules.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socialStanding = socialStanding;
exports.startingNoOfSkillPicks = startingNoOfSkillPicks;
exports.ageModifier = ageModifier;
exports.smartBaseSkillValue = smartBaseSkillValue;
exports.baseSkillValue = baseSkillValue;
exports.movementAllowance = movementAllowance;
exports.actionsPerRound = actionsPerRound;
exports.offensiveBonus = offensiveBonus;
exports.defensiveBonus = defensiveBonus;
exports.perceptionBonus = perceptionBonus;
exports.initiativeBonus = initiativeBonus;
exports.bodyPoints = bodyPoints;
function pick(table, val) {
  /**
   picks a value from a table (array of 2-tuples)
   by comparing the value passed in to the first value of the tuple.
   If the value is less than or equal to the first value in the tuple,
   the second value in the tuple is returned. It is a bit like guarded
   pattern matching as such:
   return match table with {
     [compareTo, result] when val <= compareTo: result;
     otherwise: fallback-value
   }
   */
  for (let i = 0; i < table.length; ++i) {
    const [compareTo, result] = table[i];
    const isLast = i === table.length - 1;

    if (isLast) {
      if (compareTo === 'else') {
        return result;
      }
    }
    if (val <= compareTo) {
      return result;
    }
  }
  throw new Error('table exhausted');
}

function socialStanding(lvl) {
  return [
  /** description and liquidity (cardinal crowns) */
  { desc: 'lowlife punk', assets: 500 }, { desc: 'homeless nobody', assets: 2000 }, { desc: 'poor sucker', assets: 5000 }, { desc: 'poor but happy', assets: 10000 }, { desc: 'low standard', assets: 20000 }, { desc: 'average guy', assets: 30000 }, { desc: 'comfortable', assets: 40000 }, { desc: 'well-to-do', assets: 50000 }, { desc: 'wealthy', assets: 200000 }, { desc: 'very rich', assets: 1000000 }, { desc: 'stinking rich', assets: 20000000 }][lvl];
}

function startingNoOfSkillPicks(int) {
  const table = [
  /*INT=>PICKS*/
  [5, 4], [9, 5], [14, 6], [15, 7], [16, 8], [17, 9], ['else', 10]];
  return pick(table, int);
}

function ageModifier(bc, age) {
  const relevantMods = pick([[27, {
    STR: 0,
    PHY: -1,
    COR: 0,
    INT: +1,
    MST: 0,
    PER: 0
  }], [33, {
    STR: -1,
    PHY: -1,
    COR: -1,
    INT: 1,
    MST: 0,
    PER: 1
  }], [39, {
    STR: -1,
    PHY: -2, // max 15
    COR: -1,
    INT: 0,
    MST: 1,
    PER: 0
  }], ['else', {
    STR: 0,
    PHY: 0,
    COR: 0,
    INT: 0,
    MST: 0,
    PER: 0
  }]
  // ...
  ], age);
  return relevantMods[bc];
}

function smartBaseSkillValue(basicCapabilities, skill) {
  let value = 0;
  if (skill.gbc) {
    if (skill.gbc.includes('/')) {
      const [bc1, bc2] = skill.gbc.split('/');
      const [v1, v2] = [basicCapabilities[bc1], basicCapabilities[bc2]];
      value = (v1 + v2) / 2;
    } else {
      value = basicCapabilities[skill.gbc];
    }
  }
  return baseSkillValue(value);
}

function baseSkillValue(v) {
  if (v <= 5) {
    return 2;
  }

  if (v <= 9) {
    return 3;
  }

  if (v <= 14) {
    return 4;
  }

  if (v <= 16) {
    return 5;
  }

  return 6;
}

function movementAllowance(bc) {
  const {
    COR,
    PHY
  } = bc;
  const sum = COR + PHY;

  return {
    squaresPerAction: 1 + Math.ceil(sum / 15),
    metersPerMinute: 150 + Math.pow(sum, 1.35)
  };
}

function actionsPerRound(bc) {
  const {
    COR,
    MST
  } = bc;
  const sum = COR + MST;
  return 1 + Math.ceil(sum / 15);
}

function offensiveBonus(bc) {
  const {
    STR,
    PHY
  } = bc;
  const sum = STR + PHY;
  return Math.floor(sum / 10) - 1;
}

function defensiveBonus(bc) {
  const {
    COR,
    INT
  } = bc;
  const sum = COR + INT;
  return 2 + Math.floor(sum / 10);
}

function perceptionBonus(bc) {
  const {
    MST,
    INT
  } = bc;
  const sum = MST + INT;
  return 2 + Math.floor(sum / 10);
}

function initiativeBonus(bc) {
  const {
    COR,
    PER
  } = bc;
  const sum = PER + COR;
  return 1 + Math.floor(sum / 10);
}

function bodyPoints(bc) {
  const {
    PHY,
    MST
  } = bc;

  const totalBodyPoints = PHY + MST;

  return {
    totalBodyPoints,
    bodyParts: {
      head: Math.floor((5 + mod()) / 2),
      chest: 5 + mod(),
      leftArm: 4 + mod(),
      rightArm: 4 + mod(),
      stomach: 4 + mod(),
      leftLeg: 5 + mod(),
      rightLeg: 5 + mod()
    }
  };

  function mod() {
    return Math.floor(totalBodyPoints / 10);
  }
}

const skills = exports.skills = {
  combat: [{ name: 'missile weapons', gbc: 'COR' }, { name: 'throwing', gbc: 'STR/COR' }, { name: 'unarmed', gbc: 'STR/COR' }, { name: 'wrestling', gbc: 'STR/COR' }, { name: 'silent combat', gbc: 'COR/INT' }, { name: 'parrying', gbc: 'COR' }, { name: 'stabbing weapons', gbc: 'COR' }, { name: 'cutting weapons', gbc: 'COR' }, { name: 'crushing weapons', gbc: 'STR/COR' }],

  firearms: [{ name: 'handguns', gbc: 'COR' }, { name: 'rifles', gbc: 'COR' }, { name: 'light automatics', gbc: 'STR/COR' }, { name: 'heavy automatics', gbc: 'STR/COR' }, { name: 'shoulder launched', gbc: 'COR/INT' }, { name: 'grenade launchers', gbc: 'COR/INT' }],

  communication: [{ name: 'administration', gbc: 'INT' }, { name: 'oratory', gbc: 'PER' }, { name: 'dealing', gbc: 'INT' }, { name: 'interrogation', gbc: 'INT/PER' }, { name: 'social', gbc: 'PER' }, { name: 'conning', gbc: 'PER' }, { name: 'journalism', gbc: 'INT' }],

  movement: [{ name: 'tumbling', gbc: 'COR' }, { name: 'sleight of hand', gbc: 'COR' }, { name: 'stealth', gbc: 'COR' }, { name: 'agility', gbc: 'COR' }, { name: 'climbing', gbc: 'COR' }, { name: 'tracking', gbc: 'INT' }, { name: 'scuba diving', gbc: 'COR/INT' }, { name: 'rocket pack', gbc: 'COR' }, { name: 'parachuting', gbc: 'COR' }, { name: 'water vehicles', gbc: 'INT' }, { name: 'flying vehicles', gbc: 'INT/MST' }, { name: 'ground vehicles', gbc: 'INT/MST' }],

  technical: [{ name: 'electronics', gbc: 'INT' }, { name: 'chemistry', gbc: 'INT' }, { name: 'biology', gbc: 'INT' }, { name: 'mechanics', gbc: 'INT' }, { name: 'computers', gbc: 'INT' }, { name: 'weapon systems', gbc: 'INT' }, { name: 'gunsmith', gbc: 'INT' }, { name: 'locksmith', gbc: 'INT' }, { name: 'medicine', gbc: 'INT' }, { name: 'first aid', gbc: 'INT' }, { name: 'security systems', gbc: 'INT' }, { name: 'demolitions', gbc: 'INT' }, { name: 'survival', gbc: 'INT' }],

  special: [{ name: 'avoid', gcb: null, gcs: 'DB' }, { name: 'perception', gcb: null, gcs: 'PB' }, { name: 'the art', gcb: null, gcs: null }]
};
});

;require.register("style_manager.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStyles = registerStyles;

var _getCss = require('csjs/get-css');

var _getCss2 = _interopRequireDefault(_getCss);

var _common_styles = require('./components/common_styles.js');

var _common_styles2 = _interopRequireDefault(_common_styles);

var _styles = require('./components/main/styles.js');

var _styles2 = _interopRequireDefault(_styles);

var _styles3 = require('./components/tabs/styles.js');

var _styles4 = _interopRequireDefault(_styles3);

var _styles5 = require('./components/character/styles.js');

var _styles6 = _interopRequireDefault(_styles5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerStyles(document) {
  const style = document.createElement('style');
  const css = [_common_styles2.default, _styles2.default, _styles4.default, _styles6.default].reduce((result, next) => `${result}
${(0, _getCss2.default)(next)}`, '');
  style.innerText = css;
  document.body.appendChild(style);
}
});

;require.alias("mithril/mithril.js", "mithril");require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map