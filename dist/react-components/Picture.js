"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenSrc = flattenSrc;
exports.makeSizes = makeSizes;
exports.Picture = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Picture = (0, _react.forwardRef)(function Picture(_ref, ref) {
  var src = _ref.src,
      sizes = _ref.sizes,
      breakpoints = _ref.breakpoints,
      imgProps = _objectWithoutProperties(_ref, ["src", "sizes", "breakpoints"]);

  if (!src) {
    return null;
  }

  if (!Array.isArray(src)) {
    src = [src];
  }

  if (!Array.isArray(sizes)) {
    sizes = [sizes];
  }

  if (src.length === 0) {
    return null;
  } // fallback img is for old browsers, which
  // we're mostly not that interested in, but do it
  // as part of the <picture /> spec


  var fallbackImg = src[0]; // each image has breakdpoints config attached
  // from the plugin config, use that but only
  // if it's not overriden via props

  breakpoints = breakpoints || src[0].breakpoints;
  var flattendSrc = flattenSrc(src, sizes, breakpoints); // when we have only one image source (that is we're not doing
  // art direction), provide the width and height for the image,
  // so that the browser knows the aspect ratio of the images

  var dimensions = src.length === 1 ? {
    width: src[0].images[0].width,
    height: src[0].images[0].height
  } : {};
  return /*#__PURE__*/_react["default"].createElement("picture", null, flattendSrc.map(function (_ref2, i) {
    var img = _ref2.img,
        sizes = _ref2.sizes,
        breakpoints = _ref2.breakpoints,
        maxWidth = _ref2.maxWidth;
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, {
      key: i
    }, img.webpSrcSet && img.webpSrcSet.length > 0 && /*#__PURE__*/_react["default"].createElement("source", {
      type: "image/webp",
      srcSet: img.webpSrcSet,
      media: maxWidth ? "(max-width: ".concat(maxWidth, "px)") : undefined,
      sizes: makeSizes(img, sizes, breakpoints)
    }), img.srcSet && img.srcSet.length > 0 && /*#__PURE__*/_react["default"].createElement("source", {
      type: img.type,
      srcSet: img.srcSet,
      media: maxWidth ? "(max-width: ".concat(maxWidth, "px)") : undefined,
      sizes: makeSizes(img, sizes, breakpoints)
    }));
  }), /*#__PURE__*/_react["default"].createElement("img", _extends({}, imgProps, {
    ref: ref,
    src: fallbackImg.src,
    srcSet: fallbackImg.srcSet
  }, dimensions)));
});
exports.Picture = Picture;

function flattenSrc(src, sizes, breakpoints) {
  var result = [];

  for (var i = 0; i < src.length; i++) {
    if (i > breakpoints.length) {
      console.warn("Image ".concat(src[i].name, " was not included due to insufficient breakpoints."));
      continue;
    }

    result.push({
      img: src[i],
      sizes: sizes[i],
      breakpoints: src.length === 1 ? breakpoints : [],
      maxWidth: i === src.length - 1 ? null : breakpoints[i]
    });
  }

  return result;
}

function makeSizes(img, sizes, breakpoints) {
  // a custom sizes value has been provided via props for this image
  if (sizes) return sizes; // otherwise, we generate a sizes definition using the metadata
  // about available image sizes and breakpoints provided by the loader

  return img.sizes.reduce(function (acc, s, i) {
    if (i > breakpoints.length) {
      console.warn("The ".concat(img.name, " @ ").concat(s, "w will never be shown due to insufficient breakpoints."));
      return acc;
    }

    return breakpoints[i] && img.sizes.length - 1 > i ? acc.concat("(max-width: ".concat(breakpoints[i], "px) ").concat(s, "px")) : acc.concat("".concat(s, "px"));
  }, []).join(', ');
}