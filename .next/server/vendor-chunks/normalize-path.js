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

eval("/*!\n * normalize-path <https://github.com/jonschlinkert/normalize-path>\n *\n * Copyright (c) 2014-2018, Jon Schlinkert.\n * Released under the MIT License.\n */\n\nmodule.exports = function(path, stripTrailing) {\n  if (typeof path !== 'string') {\n    throw new TypeError('expected path to be a string');\n  }\n\n  if (path === '\\\\' || path === '/') return '/';\n\n  var len = path.length;\n  if (len <= 1) return path;\n\n  // ensure that win32 namespaces has two leading slashes, so that the path is\n  // handled properly by the win32 version of path.parse() after being normalized\n  // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces\n  var prefix = '';\n  if (len > 4 && path[3] === '\\\\') {\n    var ch = path[2];\n    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\\\\\') {\n      path = path.slice(2);\n      prefix = '//';\n    }\n  }\n\n  var segs = path.split(/[/\\\\]+/);\n  if (stripTrailing !== false && segs[segs.length - 1] === '') {\n    segs.pop();\n  }\n  return prefix + segs.join('/');\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLXBhdGgvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy9wcmFzb3BjaG9ja3NhbmNoYXJvZW4vRG9jdW1lbnRzL0ludGVybi1Qb29uc2FwL1Byb2plY3RFeGNlbC9mcm9udGVuZC1leGNlbC9ub2RlX21vZHVsZXMvbm9ybWFsaXplLXBhdGgvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBub3JtYWxpemUtcGF0aCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvbm9ybWFsaXplLXBhdGg+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTgsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocGF0aCwgc3RyaXBUcmFpbGluZykge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgcGF0aCB0byBiZSBhIHN0cmluZycpO1xuICB9XG5cbiAgaWYgKHBhdGggPT09ICdcXFxcJyB8fCBwYXRoID09PSAnLycpIHJldHVybiAnLyc7XG5cbiAgdmFyIGxlbiA9IHBhdGgubGVuZ3RoO1xuICBpZiAobGVuIDw9IDEpIHJldHVybiBwYXRoO1xuXG4gIC8vIGVuc3VyZSB0aGF0IHdpbjMyIG5hbWVzcGFjZXMgaGFzIHR3byBsZWFkaW5nIHNsYXNoZXMsIHNvIHRoYXQgdGhlIHBhdGggaXNcbiAgLy8gaGFuZGxlZCBwcm9wZXJseSBieSB0aGUgd2luMzIgdmVyc2lvbiBvZiBwYXRoLnBhcnNlKCkgYWZ0ZXIgYmVpbmcgbm9ybWFsaXplZFxuICAvLyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9saWJyYXJ5L3dpbmRvd3MvZGVza3RvcC9hYTM2NTI0Nyh2PXZzLjg1KS5hc3B4I25hbWVzcGFjZXNcbiAgdmFyIHByZWZpeCA9ICcnO1xuICBpZiAobGVuID4gNCAmJiBwYXRoWzNdID09PSAnXFxcXCcpIHtcbiAgICB2YXIgY2ggPSBwYXRoWzJdO1xuICAgIGlmICgoY2ggPT09ICc/JyB8fCBjaCA9PT0gJy4nKSAmJiBwYXRoLnNsaWNlKDAsIDIpID09PSAnXFxcXFxcXFwnKSB7XG4gICAgICBwYXRoID0gcGF0aC5zbGljZSgyKTtcbiAgICAgIHByZWZpeCA9ICcvLyc7XG4gICAgfVxuICB9XG5cbiAgdmFyIHNlZ3MgPSBwYXRoLnNwbGl0KC9bL1xcXFxdKy8pO1xuICBpZiAoc3RyaXBUcmFpbGluZyAhPT0gZmFsc2UgJiYgc2Vnc1tzZWdzLmxlbmd0aCAtIDFdID09PSAnJykge1xuICAgIHNlZ3MucG9wKCk7XG4gIH1cbiAgcmV0dXJuIHByZWZpeCArIHNlZ3Muam9pbignLycpO1xufTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/normalize-path/index.js\n");

/***/ })

};
;