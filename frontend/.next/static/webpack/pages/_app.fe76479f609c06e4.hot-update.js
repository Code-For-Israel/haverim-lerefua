"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./src/util/steps.ts":
/*!***************************!*\
  !*** ./src/util/steps.ts ***!
  \***************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_steps_Cold__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/steps/Cold */ \"./src/components/steps/Cold.tsx\");\n/* harmony import */ var _components_steps_Details__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/steps/Details */ \"./src/components/steps/Details.tsx\");\n/* harmony import */ var _components_steps_Home__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/steps/Home */ \"./src/components/steps/Home.tsx\");\n/* harmony import */ var _components_steps_Map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/steps/Map */ \"./src/components/steps/Map.tsx\");\n/* harmony import */ var _components_steps_Names__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/steps/Names */ \"./src/components/steps/Names.tsx\");\n/* harmony import */ var _components_steps_Quantity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/components/steps/Quantity */ \"./src/components/steps/Quantity.tsx\");\n/* harmony import */ var _components_steps_ThankYou__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/components/steps/ThankYou */ \"./src/components/steps/ThankYou.tsx\");\n\n\n\n\n\n\n\nconst steps = [\n    {\n        title: \"תרומת תרופות\",\n        path: \"start\",\n        showProgress: false,\n        finalStep: false,\n        component: _components_steps_Home__WEBPACK_IMPORTED_MODULE_2__[\"default\"]\n    },\n    {\n        title: \"כמות תרופות\",\n        path: \"quantity\",\n        showProgress: true,\n        finalStep: false,\n        component: _components_steps_Quantity__WEBPACK_IMPORTED_MODULE_5__[\"default\"]\n    },\n    {\n        title: \"שמות תרופות\",\n        path: \"names\",\n        showProgress: true,\n        finalStep: false,\n        component: _components_steps_Names__WEBPACK_IMPORTED_MODULE_4__[\"default\"]\n    },\n    {\n        title: \"אחסון בקירור\",\n        path: \"cold-storage\",\n        showProgress: true,\n        finalStep: false,\n        component: _components_steps_Cold__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n    },\n    {\n        title: \"פרטי התורמ/ת\",\n        path: \"details\",\n        showProgress: false,\n        finalStep: true,\n        component: _components_steps_Details__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n    },\n    {\n        title: \"אפשרויות מסירה\",\n        path: \"map\",\n        showProgress: false,\n        finalStep: true,\n        component: _components_steps_Map__WEBPACK_IMPORTED_MODULE_3__[\"default\"]\n    },\n    {\n        title: \"\",\n        path: \"thank-you\",\n        showProgress: false,\n        finalStep: true,\n        component: _components_steps_ThankYou__WEBPACK_IMPORTED_MODULE_6__[\"default\"]\n    }\n];\n/* harmony default export */ __webpack_exports__[\"default\"] = (steps);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbC9zdGVwcy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUEwQztBQUNNO0FBQ047QUFDRjtBQUNJO0FBQ007QUFDQTtBQUlsRCxNQUFNTyxRQUF3QjtJQUM1QjtRQUNFQyxPQUFPO1FBQ1BDLE1BQU07UUFDTkMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFdBQVdWLDhEQUFJQTtJQUNqQjtJQUNBO1FBQ0VNLE9BQU87UUFDUEMsTUFBTTtRQUNOQyxjQUFjO1FBQ2RDLFdBQVc7UUFDWEMsV0FBV1Asa0VBQVFBO0lBQ3JCO0lBQ0E7UUFDRUcsT0FBTztRQUNQQyxNQUFNO1FBQ05DLGNBQWM7UUFDZEMsV0FBVztRQUNYQyxXQUFXUiwrREFBS0E7SUFDbEI7SUFDQTtRQUNFSSxPQUFPO1FBQ1BDLE1BQU07UUFDTkMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFdBQVdaLDhEQUFJQTtJQUNqQjtJQUNBO1FBQ0VRLE9BQU87UUFDUEMsTUFBTTtRQUNOQyxjQUFjO1FBQ2RDLFdBQVc7UUFDWEMsV0FBV1gsaUVBQU9BO0lBQ3BCO0lBQ0E7UUFDRU8sT0FBTztRQUNQQyxNQUFNO1FBQ05DLGNBQWM7UUFDZEMsV0FBVztRQUNYQyxXQUFXVCw2REFBR0E7SUFDaEI7SUFDQTtRQUNFSyxPQUFPO1FBQ1BDLE1BQU07UUFDTkMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFdBQVdOLGtFQUFRQTtJQUNyQjtDQUNEO0FBRUQsK0RBQWVDLEtBQUtBLEVBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL3V0aWwvc3RlcHMudHM/NWMwZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29sZCBmcm9tICdAL2NvbXBvbmVudHMvc3RlcHMvQ29sZCdcbmltcG9ydCBEZXRhaWxzIGZyb20gJ0AvY29tcG9uZW50cy9zdGVwcy9EZXRhaWxzJ1xuaW1wb3J0IEhvbWUgZnJvbSAnQC9jb21wb25lbnRzL3N0ZXBzL0hvbWUnXG5pbXBvcnQgTWFwIGZyb20gJ0AvY29tcG9uZW50cy9zdGVwcy9NYXAnXG5pbXBvcnQgTmFtZXMgZnJvbSAnQC9jb21wb25lbnRzL3N0ZXBzL05hbWVzJ1xuaW1wb3J0IFF1YW50aXR5IGZyb20gJ0AvY29tcG9uZW50cy9zdGVwcy9RdWFudGl0eSdcbmltcG9ydCBUaGFua1lvdSBmcm9tICdAL2NvbXBvbmVudHMvc3RlcHMvVGhhbmtZb3UnXG5cbmltcG9ydCB7IEZvcm1TdGVwVHlwZSB9IGZyb20gJ0Zvcm1UeXBlcydcblxuY29uc3Qgc3RlcHM6IEZvcm1TdGVwVHlwZVtdID0gW1xuICB7XG4gICAgdGl0bGU6ICfXqteo15XXnteqINeq16jXldek15XXqicsXG4gICAgcGF0aDogJ3N0YXJ0JyxcbiAgICBzaG93UHJvZ3Jlc3M6IGZhbHNlLFxuICAgIGZpbmFsU3RlcDogZmFsc2UsXG4gICAgY29tcG9uZW50OiBIb21lLFxuICB9LFxuICB7XG4gICAgdGl0bGU6ICfXm9ee15XXqiDXqteo15XXpNeV16onLFxuICAgIHBhdGg6ICdxdWFudGl0eScsXG4gICAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICAgIGZpbmFsU3RlcDogZmFsc2UsXG4gICAgY29tcG9uZW50OiBRdWFudGl0eSxcbiAgfSxcbiAge1xuICAgIHRpdGxlOiAn16nXnteV16og16rXqNeV16TXldeqJyxcbiAgICBwYXRoOiAnbmFtZXMnLFxuICAgIHNob3dQcm9ncmVzczogdHJ1ZSxcbiAgICBmaW5hbFN0ZXA6IGZhbHNlLFxuICAgIGNvbXBvbmVudDogTmFtZXMsXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogJ9eQ15fXodeV158g15HXp9eZ16jXldeoJyxcbiAgICBwYXRoOiAnY29sZC1zdG9yYWdlJyxcbiAgICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gICAgZmluYWxTdGVwOiBmYWxzZSxcbiAgICBjb21wb25lbnQ6IENvbGQsXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogJ9ek16jXmNeZINeU16rXldeo154v16onLFxuICAgIHBhdGg6ICdkZXRhaWxzJyxcbiAgICBzaG93UHJvZ3Jlc3M6IGZhbHNlLFxuICAgIGZpbmFsU3RlcDogdHJ1ZSxcbiAgICBjb21wb25lbnQ6IERldGFpbHMsXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogJ9eQ16TXqdeo15XXmdeV16og157XodeZ16jXlCcsXG4gICAgcGF0aDogJ21hcCcsXG4gICAgc2hvd1Byb2dyZXNzOiBmYWxzZSxcbiAgICBmaW5hbFN0ZXA6IHRydWUsXG4gICAgY29tcG9uZW50OiBNYXAsXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogJycsXG4gICAgcGF0aDogJ3RoYW5rLXlvdScsXG4gICAgc2hvd1Byb2dyZXNzOiBmYWxzZSxcbiAgICBmaW5hbFN0ZXA6IHRydWUsXG4gICAgY29tcG9uZW50OiBUaGFua1lvdSxcbiAgfSxcbl1cblxuZXhwb3J0IGRlZmF1bHQgc3RlcHNcbiJdLCJuYW1lcyI6WyJDb2xkIiwiRGV0YWlscyIsIkhvbWUiLCJNYXAiLCJOYW1lcyIsIlF1YW50aXR5IiwiVGhhbmtZb3UiLCJzdGVwcyIsInRpdGxlIiwicGF0aCIsInNob3dQcm9ncmVzcyIsImZpbmFsU3RlcCIsImNvbXBvbmVudCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/util/steps.ts\n"));

/***/ })

});