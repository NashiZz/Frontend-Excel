/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/normalize-path";
exports.ids = ["vendor-chunks/normalize-path"];
exports.modules = {

/***/ "(ssr)/./node_modules/normalize-path/index.js":
/*!**********************************************!*\
  !*** ./node_modules/normalize-path/index.js ***!
  \**********************************************/
/***/ ((module) => {

eval("/*!\r\n * normalize-path <https://github.com/jonschlinkert/normalize-path>\r\n *\r\n * Copyright (c) 2014-2018, Jon Schlinkert.\r\n * Released under the MIT License.\r\n */\r\n\r\nmodule.exports = function(path, stripTrailing) {\r\n  if (typeof path !== 'string') {\r\n    throw new TypeError('expected path to be a string');\r\n  }\r\n\r\n  if (path === '\\\\' || path === '/') return '/';\r\n\r\n  var len = path.length;\r\n  if (len <= 1) return path;\r\n\r\n  // ensure that win32 namespaces has two leading slashes, so that the path is\r\n  // handled properly by the win32 version of path.parse() after being normalized\r\n  // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces\r\n  var prefix = '';\r\n  if (len > 4 && path[3] === '\\\\') {\r\n    var ch = path[2];\r\n    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\\\\\') {\r\n      path = path.slice(2);\r\n      prefix = '//';\r\n    }\r\n  }\r\n\r\n  var segs = path.split(/[/\\\\]+/);\r\n  if (stripTrailing !== false && segs[segs.length - 1] === '') {\r\n    segs.pop();\r\n  }\r\n  return prefix + segs.join('/');\r\n};\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLXBhdGgvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiRDpcXFByb2plY3RcXEZyb250LUV4Y2VsXFxGcm9udGVuZC1FeGNlbFxcRnJvbnRlbmQtRXhjZWxcXG5vZGVfbW9kdWxlc1xcbm9ybWFsaXplLXBhdGhcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxyXG4gKiBub3JtYWxpemUtcGF0aCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvbm9ybWFsaXplLXBhdGg+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE4LCBKb24gU2NobGlua2VydC5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocGF0aCwgc3RyaXBUcmFpbGluZykge1xyXG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdGVkIHBhdGggdG8gYmUgYSBzdHJpbmcnKTtcclxuICB9XHJcblxyXG4gIGlmIChwYXRoID09PSAnXFxcXCcgfHwgcGF0aCA9PT0gJy8nKSByZXR1cm4gJy8nO1xyXG5cclxuICB2YXIgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgaWYgKGxlbiA8PSAxKSByZXR1cm4gcGF0aDtcclxuXHJcbiAgLy8gZW5zdXJlIHRoYXQgd2luMzIgbmFtZXNwYWNlcyBoYXMgdHdvIGxlYWRpbmcgc2xhc2hlcywgc28gdGhhdCB0aGUgcGF0aCBpc1xyXG4gIC8vIGhhbmRsZWQgcHJvcGVybHkgYnkgdGhlIHdpbjMyIHZlcnNpb24gb2YgcGF0aC5wYXJzZSgpIGFmdGVyIGJlaW5nIG5vcm1hbGl6ZWRcclxuICAvLyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9saWJyYXJ5L3dpbmRvd3MvZGVza3RvcC9hYTM2NTI0Nyh2PXZzLjg1KS5hc3B4I25hbWVzcGFjZXNcclxuICB2YXIgcHJlZml4ID0gJyc7XHJcbiAgaWYgKGxlbiA+IDQgJiYgcGF0aFszXSA9PT0gJ1xcXFwnKSB7XHJcbiAgICB2YXIgY2ggPSBwYXRoWzJdO1xyXG4gICAgaWYgKChjaCA9PT0gJz8nIHx8IGNoID09PSAnLicpICYmIHBhdGguc2xpY2UoMCwgMikgPT09ICdcXFxcXFxcXCcpIHtcclxuICAgICAgcGF0aCA9IHBhdGguc2xpY2UoMik7XHJcbiAgICAgIHByZWZpeCA9ICcvLyc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgc2VncyA9IHBhdGguc3BsaXQoL1svXFxcXF0rLyk7XHJcbiAgaWYgKHN0cmlwVHJhaWxpbmcgIT09IGZhbHNlICYmIHNlZ3Nbc2Vncy5sZW5ndGggLSAxXSA9PT0gJycpIHtcclxuICAgIHNlZ3MucG9wKCk7XHJcbiAgfVxyXG4gIHJldHVybiBwcmVmaXggKyBzZWdzLmpvaW4oJy8nKTtcclxufTtcclxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/normalize-path/index.js\n");

/***/ })

};
;