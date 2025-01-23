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

eval("/*!\r\n * normalize-path <https://github.com/jonschlinkert/normalize-path>\r\n *\r\n * Copyright (c) 2014-2018, Jon Schlinkert.\r\n * Released under the MIT License.\r\n */\r\n\r\nmodule.exports = function(path, stripTrailing) {\r\n  if (typeof path !== 'string') {\r\n    throw new TypeError('expected path to be a string');\r\n  }\r\n\r\n  if (path === '\\\\' || path === '/') return '/';\r\n\r\n  var len = path.length;\r\n  if (len <= 1) return path;\r\n\r\n  // ensure that win32 namespaces has two leading slashes, so that the path is\r\n  // handled properly by the win32 version of path.parse() after being normalized\r\n  // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces\r\n  var prefix = '';\r\n  if (len > 4 && path[3] === '\\\\') {\r\n    var ch = path[2];\r\n    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\\\\\') {\r\n      path = path.slice(2);\r\n      prefix = '//';\r\n    }\r\n  }\r\n\r\n  var segs = path.split(/[/\\\\]+/);\r\n  if (stripTrailing !== false && segs[segs.length - 1] === '') {\r\n    segs.pop();\r\n  }\r\n  return prefix + segs.join('/');\r\n};\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLXBhdGgvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiRDpcXFByb2plY3RcXEZyb250LUV4Y2VsXFxGcm9udGVuZC1FeGNlbFxcbm9kZV9tb2R1bGVzXFxub3JtYWxpemUtcGF0aFxcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIG5vcm1hbGl6ZS1wYXRoIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9ub3JtYWxpemUtcGF0aD5cclxuICpcclxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTgsIEpvbiBTY2hsaW5rZXJ0LlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXRoLCBzdHJpcFRyYWlsaW5nKSB7XHJcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgcGF0aCB0byBiZSBhIHN0cmluZycpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHBhdGggPT09ICdcXFxcJyB8fCBwYXRoID09PSAnLycpIHJldHVybiAnLyc7XHJcblxyXG4gIHZhciBsZW4gPSBwYXRoLmxlbmd0aDtcclxuICBpZiAobGVuIDw9IDEpIHJldHVybiBwYXRoO1xyXG5cclxuICAvLyBlbnN1cmUgdGhhdCB3aW4zMiBuYW1lc3BhY2VzIGhhcyB0d28gbGVhZGluZyBzbGFzaGVzLCBzbyB0aGF0IHRoZSBwYXRoIGlzXHJcbiAgLy8gaGFuZGxlZCBwcm9wZXJseSBieSB0aGUgd2luMzIgdmVyc2lvbiBvZiBwYXRoLnBhcnNlKCkgYWZ0ZXIgYmVpbmcgbm9ybWFsaXplZFxyXG4gIC8vIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2xpYnJhcnkvd2luZG93cy9kZXNrdG9wL2FhMzY1MjQ3KHY9dnMuODUpLmFzcHgjbmFtZXNwYWNlc1xyXG4gIHZhciBwcmVmaXggPSAnJztcclxuICBpZiAobGVuID4gNCAmJiBwYXRoWzNdID09PSAnXFxcXCcpIHtcclxuICAgIHZhciBjaCA9IHBhdGhbMl07XHJcbiAgICBpZiAoKGNoID09PSAnPycgfHwgY2ggPT09ICcuJykgJiYgcGF0aC5zbGljZSgwLCAyKSA9PT0gJ1xcXFxcXFxcJykge1xyXG4gICAgICBwYXRoID0gcGF0aC5zbGljZSgyKTtcclxuICAgICAgcHJlZml4ID0gJy8vJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBzZWdzID0gcGF0aC5zcGxpdCgvWy9cXFxcXSsvKTtcclxuICBpZiAoc3RyaXBUcmFpbGluZyAhPT0gZmFsc2UgJiYgc2Vnc1tzZWdzLmxlbmd0aCAtIDFdID09PSAnJykge1xyXG4gICAgc2Vncy5wb3AoKTtcclxuICB9XHJcbiAgcmV0dXJuIHByZWZpeCArIHNlZ3Muam9pbignLycpO1xyXG59O1xyXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/normalize-path/index.js\n");

/***/ })

};
;