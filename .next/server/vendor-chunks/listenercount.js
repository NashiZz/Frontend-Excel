"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/listenercount";
exports.ids = ["vendor-chunks/listenercount"];
exports.modules = {

/***/ "(ssr)/./node_modules/listenercount/index.js":
/*!*********************************************!*\
  !*** ./node_modules/listenercount/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar listenerCount = (__webpack_require__(/*! events */ \"events\").listenerCount)\n// listenerCount isn't in node 0.10, so here's a basic polyfill\nlistenerCount = listenerCount || function (ee, event) {\n  var listeners = ee && ee._events && ee._events[event]\n  if (Array.isArray(listeners)) {\n    return listeners.length\n  } else if (typeof listeners === 'function') {\n    return 1\n  } else {\n    return 0\n  }\n}\n\nmodule.exports = listenerCount\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbGlzdGVuZXJjb3VudC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTs7QUFFWixvQkFBb0IsMkRBQStCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyIvVXNlcnMvcHJhc29wY2hvY2tzYW5jaGFyb2VuL0RvY3VtZW50cy9JbnRlcm4tUG9vbnNhcC9Qcm9qZWN0RXhjZWwvZnJvbnRlbmQtZXhjZWwvbm9kZV9tb2R1bGVzL2xpc3RlbmVyY291bnQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbnZhciBsaXN0ZW5lckNvdW50ID0gcmVxdWlyZSgnZXZlbnRzJykubGlzdGVuZXJDb3VudFxuLy8gbGlzdGVuZXJDb3VudCBpc24ndCBpbiBub2RlIDAuMTAsIHNvIGhlcmUncyBhIGJhc2ljIHBvbHlmaWxsXG5saXN0ZW5lckNvdW50ID0gbGlzdGVuZXJDb3VudCB8fCBmdW5jdGlvbiAoZWUsIGV2ZW50KSB7XG4gIHZhciBsaXN0ZW5lcnMgPSBlZSAmJiBlZS5fZXZlbnRzICYmIGVlLl9ldmVudHNbZXZlbnRdXG4gIGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVycykpIHtcbiAgICByZXR1cm4gbGlzdGVuZXJzLmxlbmd0aFxuICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gMVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0ZW5lckNvdW50XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/listenercount/index.js\n");

/***/ })

};
;