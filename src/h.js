// Utils methods and map objects
//
// @class Helpers
class Helpers {
  static initClass() {
    // ---

    // SVG namespace
    //
    // @property   NS
    // @type       {String}
    this.prototype.NS = "http://www.w3.org/2000/svg";
    // ---

    // CSS styles for console.log/warn/error ::mojs:: badge styling
    //
    // @property   logBadgeCss
    // @type       {String}
    this.prototype.logBadgeCss = `background:#3A0839;color:#FF512F;border-radius:5px; \
padding: 1px 5px 2px; border: 1px solid #FF512F;`;
    // ---

    // Shortcut map for the 16 standart web colors
    // used to coerce literal name to rgb
    //
    // @property   shortColors
    // @type       {Object}
    // REMOVE WHEN ALL MODULES WILL USE DELTAS CLASS
    this.prototype.shortColors = {
      transparent: "rgba(0,0,0,0)",
      none: "rgba(0,0,0,0)",
      aqua: "rgb(0,255,255)",
      black: "rgb(0,0,0)",
      blue: "rgb(0,0,255)",
      fuchsia: "rgb(255,0,255)",
      gray: "rgb(128,128,128)",
      green: "rgb(0,128,0)",
      lime: "rgb(0,255,0)",
      maroon: "rgb(128,0,0)",
      navy: "rgb(0,0,128)",
      olive: "rgb(128,128,0)",
      purple: "rgb(128,0,128)",
      red: "rgb(255,0,0)",
      silver: "rgb(192,192,192)",
      teal: "rgb(0,128,128)",
      white: "rgb(255,255,255)",
      yellow: "rgb(255,255,0)",
      orange: "rgb(255,128,0)",
    };
    // ---
    // none-tweenable props
    this.prototype.chainOptionMap = {}; // callbacksContext: 1
    this.prototype.callbacksMap = {
      onRefresh: 1,
      onStart: 1,
      onComplete: 1,
      onFirstUpdate: 1,
      onUpdate: 1,
      onProgress: 1,
      onRepeatStart: 1,
      onRepeatComplete: 1,
      onPlaybackStart: 1,
      onPlaybackPause: 1,
      onPlaybackStop: 1,
      onPlaybackComplete: 1,
    };
    this.prototype.tweenOptionMap = {
      duration: 1,
      delay: 1,
      speed: 1,
      repeat: 1,
      easing: 1,
      backwardEasing: 1,
      isYoyo: 1,
      shiftTime: 1,
      isReversed: 1,
      callbacksContext: 1,
    };
    this.prototype.unitOptionMap = {
      left: 1,
      top: 1,
      x: 1,
      y: 1,
      rx: 1,
      ry: 1,
    };
    // strokeDashPropsMap:
    //   strokeDasharray:  1
    //   # strokeDashoffset: 1
    this.prototype.RAD_TO_DEG = 180 / Math.PI;
  }
  // DEG_TO_RAD: Math.PI/180
  constructor() {
    this.lets();
  }
  lets() {
    this.prefix = this.getPrefix();
    this.getRemBase();
    this.isFF = this.prefix.lowercase === "moz";
    this.isIE = this.prefix.lowercase === "ms";
    const ua = navigator.userAgent;
    this.isOldOpera = ua.match(/presto/gim);
    this.isSafari = ua.indexOf("Safari") > -1;
    this.isChrome = ua.indexOf("Chrome") > -1;
    this.isOpera = ua.toLowerCase().indexOf("op") > -1;
    this.isChrome && this.isSafari && (this.isSafari = false);
    ua.match(/PhantomJS/gim) && (this.isSafari = false);
    this.isChrome && this.isOpera && (this.isChrome = false);
    this.is3d = this.checkIf3d();

    this.uniqIDs = -1;

    this.div = document.createElement("div");
    document.body.appendChild(this.div);

    return (this.defaultStyles = this.computedStyle(this.div));
  }

  // ---

  // Clones object by iterating thru object properties
  //
  // @method cloneObj
  // @param {Object} to clone
  // @param {Object} with key names that will be excluded
  //                 from the new object, key value should
  //                 be truthy
  // @example
  //   h.cloneObj({ foo: 'bar', baz: 'bar' }, { baz: 1 })
  //   // result: { foo: 'bar' }
  // @return {Object} new object
  cloneObj(obj, exclude) {
    const keys = Object.keys(obj);
    const newObj = {};
    let i = keys.length;
    while (i--) {
      const key = keys[i];
      if (exclude != null) {
        if (!exclude[key]) {
          newObj[key] = obj[key];
        }
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }
  // ---

  // Copies keys and values from the second object to the first if
  // key was not defined on the first object
  //
  // @method extend
  //
  // @param {Object} to copy values to
  // @param {Object} from copy values from
  //
  // @example
  //   let objA = { foo: 'bar' }, objB = { baz: 'bax' };
  //   h.extend(objA, objB)
  //   // result: objA{ foo: 'bar', baz: 'bax' }
  //
  // @return {Object} the first modified object
  extend(objTo, objFrom) {
    for (let key in objFrom) {
      const value = objFrom[key];
      if (objTo[key] == null) {
        objTo[key] = objFrom[key];
      }
    }
    return objTo;
  }

  getRemBase() {
    const html = document.querySelector("html");
    const style = getComputedStyle(html);
    return (this.remBase = parseFloat(style.fontSize));
  }

  clamp(value, min, max) {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    } else {
      return value;
    }
  }
  // Math.min Math.max(value, min), max
  setPrefixedStyle(el, name, value) {
    name === "transform" && (el.style[`${this.prefix.css}${name}`] = value);
    return (el.style[name] = value);
  }
  // ---
  //
  // Sets styles on element with prefix(if needed) on el
  //
  // @method style
  // @param {DOMNode}          element to set the styles on
  // @param {String, Object}   style name or style: value object
  // @param {String}           style value
  // @example
  //   h.style(el, 'width', '20px')
  // @example
  //   h.style(el, { width: '20px', height: '10px' })
  style(el, name, value) {
    if (typeof name === "object") {
      const keys = Object.keys(name);
      let len = keys.length;
      return (() => {
        const result = [];
        while (len--) {
          const key = keys[len];
          value = name[key];
          result.push(this.setPrefixedStyle(el, key, value));
        }
        return result;
      })();
    } else {
      return this.setPrefixedStyle(el, name, value);
    }
  }

  prepareForLog(args) {
    args = Array.prototype.slice.apply(args);
    args.unshift("::");
    args.unshift(this.logBadgeCss);
    args.unshift("%cmo·js%c");
    return args;
  }
  log() {
    if (mojs.isDebug === false) {
      return;
    }
    return console.log.apply(console, this.prepareForLog(arguments));
  }
  warn() {
    if (mojs.isDebug === false) {
      return;
    }
    return console.warn.apply(console, this.prepareForLog(arguments));
  }
  error() {
    if (mojs.isDebug === false) {
      return;
    }
    return console.error.apply(console, this.prepareForLog(arguments));
  }
  parseUnit(value) {
    let returnVal;
    if (typeof value === "number") {
      return (returnVal = {
        unit: "px",
        isStrict: false,
        value,
        string: value === 0 ? `${value}` : `${value}px`,
      });
    } else if (typeof value === "string") {
      const regex = /px|%|rem|em|ex|cm|ch|mm|in|pt|pc|vh|vw|vmin|deg/gim;
      let unit = __guard__(value.match(regex), (x) => x[0]);
      let isStrict = true;
      // if a plain number was passed set isStrict to false and add px
      if (!unit) {
        unit = "px";
        isStrict = false;
      }
      const amount = parseFloat(value);
      return (returnVal = {
        unit,
        isStrict,
        value: amount,
        string: amount === 0 ? `${amount}` : `${amount}${unit}`,
      });
    }
    return value;
  }
  bind(func, context) {
    const wrapper = function () {
      const args = Array.prototype.slice.call(arguments);
      const unshiftArgs = bindArgs.concat(args);
      return func.apply(context, unshiftArgs);
    };
    let bindArgs = Array.prototype.slice.call(arguments, 2);
    return wrapper;
  }
  getRadialPoint(o = {}) {
    // return if !o.radius? or !o.rotate? or !o.center?
    let point;
    const radAngle = (o.rotate - 90) * 0.017453292519943295; // Math.PI/180
    const radiusX = o.radiusX != null ? o.radiusX : o.radius;
    const radiusY = o.radiusY != null ? o.radiusY : o.radius;
    return (point = {
      x: o.center.x + Math.cos(radAngle) * radiusX,
      y: o.center.y + Math.sin(radAngle) * radiusY,
    });
  }

  getPrefix() {
    const styles = window.getComputedStyle(document.documentElement, "");
    const v = Array.prototype.slice
      .call(styles)
      .join("")
      .match(/-(moz|webkit|ms)-/);
    const pre = (v || (styles.OLink === "" && ["", "o"]))[1];
    const dom = __guard__(
      "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i")),
      (x) => x[1]
    );
    return {
      dom,
      lowercase: pre,
      css: "-" + pre + "-",
      js:
        (pre != null ? pre[0].toUpperCase() : undefined) +
        (pre != null ? pre.substr(1) : undefined),
    };
  }
  strToArr(string) {
    const arr = [];
    // plain number
    if (typeof string === "number" && !isNaN(string)) {
      arr.push(this.parseUnit(string));
      return arr;
    }
    // string array
    string
      .trim()
      .split(/\s+/gim)
      .forEach((str) => {
        return arr.push(this.parseUnit(this.parseIfRand(str)));
      });
    return arr;
  }

  calcArrDelta(arr1, arr2) {
    // if !arr1? or !arr2? then throw Error 'Two arrays should be passed'
    // if !@isArray(arr1)or!@isArray(arr2) then throw Error 'Two arrays expected'
    const delta = [];
    for (let i = 0; i < arr1.length; i++) {
      const num = arr1[i];
      delta[i] = this.parseUnit(
        `${arr2[i].value - arr1[i].value}${arr2[i].unit}`
      );
    }
    return delta;
  }

  isArray(letiable) {
    return letiable instanceof Array;
  }

  normDashArrays(arr1, arr2) {
    // if !arr1? or !arr2? then throw Error 'Two arrays should be passed'
    let currItem, i, lenDiff, startI;
    const arr1Len = arr1.length;
    const arr2Len = arr2.length;
    if (arr1Len > arr2Len) {
      let asc, end;
      lenDiff = arr1Len - arr2Len;
      startI = arr2.length;
      for (
        i = 0, end = lenDiff, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        currItem = i + startI;
        arr2.push(this.parseUnit(`0${arr1[currItem].unit}`));
      }
    } else if (arr2Len > arr1Len) {
      let asc1, end1;
      lenDiff = arr2Len - arr1Len;
      startI = arr1.length;
      for (
        i = 0, end1 = lenDiff, asc1 = 0 <= end1;
        asc1 ? i < end1 : i > end1;
        asc1 ? i++ : i--
      ) {
        currItem = i + startI;
        arr1.push(this.parseUnit(`0${arr2[currItem].unit}`));
      }
    }
    return [arr1, arr2];
  }

  makeColorObj(color) {
    // HEX
    let b, colorObj, g, r, result;
    if (color[0] === "#") {
      result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(color);
      colorObj = {};
      if (result) {
        r = result[1].length === 2 ? result[1] : result[1] + result[1];
        g = result[2].length === 2 ? result[2] : result[2] + result[2];
        b = result[3].length === 2 ? result[3] : result[3] + result[3];
        colorObj = {
          r: parseInt(r, 16),
          g: parseInt(g, 16),
          b: parseInt(b, 16),
          a: 1,
        };
      }
    }

    // not HEX
    // shorthand color and rgb()
    if (color[0] !== "#") {
      let rgbColor;
      const isRgb = color[0] === "r" && color[1] === "g" && color[2] === "b";
      // rgb color
      if (isRgb) {
        rgbColor = color;
      }
      // shorthand color name
      if (!isRgb) {
        rgbColor = (() => {
          if (!this.shortColors[color]) {
            this.div.style.color = color;
            return this.computedStyle(this.div).color;
          } else {
            return this.shortColors[color];
          }
        })();
      }

      const regexString1 = "^rgba?\\((\\d{1,3}),\\s?(\\d{1,3}),";
      const regexString2 = "\\s?(\\d{1,3}),?\\s?(\\d{1}|0?\\.\\d{1,})?\\)$";
      result = new RegExp(regexString1 + regexString2, "gi").exec(rgbColor);
      colorObj = {};
      const alpha = parseFloat(result[4] || 1);
      if (result) {
        colorObj = {
          r: parseInt(result[1], 10),
          g: parseInt(result[2], 10),
          b: parseInt(result[3], 10),
          a: alpha != null && !isNaN(alpha) ? alpha : 1,
        };
      }
    }

    return colorObj;
  }

  computedStyle(el) {
    return getComputedStyle(el);
  }

  capitalize(str) {
    if (typeof str !== "string") {
      throw Error("String expected - nothing to capitalize");
    }
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
  parseRand(string) {
    const randArr = string.split(/rand\(|\,|\)/);
    const units = this.parseUnit(randArr[2]);
    const rand = this.rand(parseFloat(randArr[1]), parseFloat(randArr[2]));
    if (units.unit && randArr[2].match(units.unit)) {
      return rand + units.unit;
    } else {
      return rand;
    }
  }
  parseStagger(string, index) {
    let base;
    let value = string.split(/stagger\(|\)$/)[1].toLowerCase();
    // split the value in case it contains base
    // the regex splits 0,0 0,1 1,0 1,1 combos
    // if num taken as 1, rand() taken as 0
    const splittedValue = value.split(
      /(rand\(.*?\)|[^\(,\s]+)(?=\s*,|\s*$)/gim
    );
    // if contains the base value
    value = (() => {
      if (splittedValue.length > 3) {
        base = this.parseUnit(this.parseIfRand(splittedValue[1]));
        return splittedValue[3];
        // if just a plain value
      } else {
        base = this.parseUnit(0);
        return splittedValue[1];
      }
    })();

    value = this.parseIfRand(value);
    // parse with units
    const unitValue = this.parseUnit(value);
    const number = index * unitValue.value + base.value;
    // add units only if option had a unit before
    const unit = base.isStrict
      ? base.unit
      : unitValue.isStrict
      ? unitValue.unit
      : "";

    if (unit) {
      return `${number}${unit}`;
    } else {
      return number;
    }
  }

  // ---

  // Method to parse stagger or return the passed value if
  // it has no stagger expression in it.
  parseIfStagger(value, i) {
    if (!(typeof value === "string" && value.match(/stagger/g))) {
      return value;
    } else {
      return this.parseStagger(value, i);
    }
  }

  // if passed string has rand function then get the rand value
  parseIfRand(str) {
    if (typeof str === "string" && str.match(/rand\(/)) {
      return this.parseRand(str);
    } else {
      return str;
    }
  }
  // if delta object was passed: like { 20: 75 }
  parseDelta(key, value, index) {
    // clone the delta object before proceed
    value = this.cloneObj(value);
    // parse delta easing
    let { easing } = value;
    if (easing != null) {
      easing = mojs.easing.parseEasing(easing);
    }
    delete value.easing;
    // parse delta curve
    let { curve } = value;
    if (curve != null) {
      curve = mojs.easing.parseEasing(curve);
    }
    delete value.curve;

    let start = Object.keys(value)[0];
    let end = value[start];
    let delta = { start };
    // color values
    if (
      isNaN(parseFloat(start)) &&
      !start.match(/rand\(/) &&
      !start.match(/stagger\(/)
    ) {
      if (key === "strokeLinecap") {
        this.warn(
          `Sorry, stroke-linecap property is not animatable \
yet, using the start(${start}) value instead`,
          value
        );
        // @props[key] = start;
        return delta;
      }
      const startColorObj = this.makeColorObj(start);
      const endColorObj = this.makeColorObj(end);
      delta = {
        type: "color",
        name: key,
        start: startColorObj,
        end: endColorObj,
        easing,
        curve,
        delta: {
          r: endColorObj.r - startColorObj.r,
          g: endColorObj.g - startColorObj.g,
          b: endColorObj.b - startColorObj.b,
          a: endColorObj.a - startColorObj.a,
        },
      };
      // color strokeDasharray/strokeDashoffset
    } else if (
      key === "strokeDasharray" ||
      key === "strokeDashoffset" ||
      key === "origin"
    ) {
      const startArr = this.strToArr(start);
      const endArr = this.strToArr(end);
      this.normDashArrays(startArr, endArr);

      for (let i = 0; i < startArr.length; i++) {
        start = startArr[i];
        end = endArr[i];
        this.mergeUnits(start, end, key);
      }

      delta = {
        type: "array",
        name: key,
        start: startArr,
        end: endArr,
        delta: this.calcArrDelta(startArr, endArr),
        easing,
        curve,
      };
      //# plain numeric value ##
    } else {
      //# filter tween-related properties
      // defined in helpers.chainOptionMap
      // because tween-related props shouldn't
      //# have deltas
      if (!this.callbacksMap[key] && !this.tweenOptionMap[key]) {
        // position values defined in unitOptionMap
        if (this.unitOptionMap[key]) {
          end = this.parseUnit(this.parseStringOption(end, index));
          start = this.parseUnit(this.parseStringOption(start, index));
          this.mergeUnits(start, end, key);
          delta = {
            type: "unit",
            name: key,
            start,
            end,
            delta: end.value - start.value,
            easing,
            curve,
          };
        } else {
          // not position but numeric values
          end = parseFloat(this.parseStringOption(end, index));
          start = parseFloat(this.parseStringOption(start, index));
          delta = {
            type: "number",
            name: key,
            start,
            end,
            delta: end - start,
            easing,
            curve,
          };
        }
      }
    }
    return delta;
  }

  mergeUnits(start, end, key) {
    if (!end.isStrict && start.isStrict) {
      end.unit = start.unit;
      return (end.string = `${end.value}${end.unit}`);
    } else if (end.isStrict && !start.isStrict) {
      start.unit = end.unit;
      return (start.string = `${start.value}${start.unit}`);
    } else if (end.isStrict && start.isStrict) {
      if (end.unit !== start.unit) {
        start.unit = end.unit;
        start.string = `${start.value}${start.unit}`;
        return this
          .warn(`Two different units were specified on \"${key}\" delta \
property, mo · js will fallback to end \"${end.unit}\" unit `);
      }
    }
  }

  rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  isDOM(o) {
    if (o == null) {
      return false;
    }
    // if typeof Node is 'function' then o instanceof Node
    const isNode =
      typeof o.nodeType === "number" && typeof o.nodeName === "string";
    return typeof o === "object" && isNode;
  }
  getChildElements(element) {
    const { childNodes } = element;
    const children = [];
    let i = childNodes.length;
    while (i--) {
      if (childNodes[i].nodeType === 1) {
        children.unshift(childNodes[i]);
      }
    }
    return children;
  }
  delta(start, end) {
    const type1 = typeof start;
    const type2 = typeof end;
    const isType1 = type1 === "string" || (type1 === "number" && !isNaN(start));
    const isType2 = type2 === "string" || (type2 === "number" && !isNaN(end));
    if (!isType1 || !isType2) {
      this.error(`delta method expects Strings or Numbers at input \
but got - ${start}, ${end}`);
      return;
    }
    const obj = {};
    obj[start] = end;
    return obj;
  }
  // ---

  // Returns uniq id
  //
  // @method getUniqID
  // @return {Number}
  getUniqID() {
    return ++this.uniqIDs;
  }
  // ---

  // Returns an uniq id
  //
  // @method parsePath
  // @return {SVGPath}
  parsePath(path) {
    if (typeof path === "string") {
      if (path.charAt(0).toLowerCase() === "m") {
        const domPath = document.createElementNS(this.NS, "path");
        domPath.setAttributeNS(null, "d", path);
        return domPath;
      } else {
        return document.querySelector(path);
      }
    }
    if (path.style) {
      return path;
    }
  }
  // ---

  // Returns uniq id
  //
  // @method parsePath
  // @return {SVGPath}
  closeEnough(num1, num2, eps) {
    return Math.abs(num1 - num2) < eps;
  }
  // ---

  // Method to check if 3d transform are supported
  checkIf3d() {
    const div = document.createElement("div");
    this.style(div, "transform", "translateZ(0)");
    const { style } = div;
    const prefixed = `${this.prefix.css}transform`;
    const tr = style[prefixed] != null ? style[prefixed] : style.transform;
    return tr !== "";
  }
  /*
    Method to check if letiable holds pointer to an object.
    @param {Any} letiable to test
    @returns {Boolean} If letiable is object.
  */
  isObject(letiable) {
    return letiable !== null && typeof letiable === "object";
  }
  /*
    Method to get first value of the object.
    Used to get end value on ∆s.
    @param {Object} Object to get the value of.
    @returns {Any} The value of the first object' property.
  */
  getDeltaEnd(obj) {
    const key = Object.keys(obj)[0];
    return obj[key];
  }
  /*
    Method to get first key of the object.
    Used to get start value on ∆s.
    @param {Object} Object to get the value of.
    @returns {String} The key of the first object' property.
  */
  getDeltaStart(obj) {
    const key = Object.keys(obj)[0];
    return key;
  }
  /*
    Method to check if propery exists in callbacksMap or tweenOptionMap.
    @param {String} Property name to check for
    @returns {Boolean} If property is tween property.
  */
  isTweenProp(keyName) {
    return this.tweenOptionMap[keyName] || this.callbacksMap[keyName];
  }
  /*
    Method to parse string property value
    which can include both `rand` and `stagger `
    value in letious positions.
    @param {String} Property name to check for.
    @param {Number} Optional index for stagger.
    @returns {Number} Parsed option value.
  */
  parseStringOption(value, index = 0) {
    if (typeof value === "string") {
      value = this.parseIfStagger(value, index);
      value = this.parseIfRand(value);
    }
    return value;
  }
  /*
    Method to get the last item of array.
    @private
    @param {Array} Array to get the last item in.
    @returns {Any} The last item of array.
  */
  getLastItem(arr) {
    return arr[arr.length - 1];
  }
  /*
    Method parse HTMLElement.
    @private
    @param {String, Object} Selector string or HTMLElement.
    @returns {Object} HTMLElement.
  */
  parseEl(el) {
    if (h.isDOM(el)) {
      return el;
    } else if (typeof el === "string") {
      el = document.querySelector(el);
    }

    if (el === null) {
      h.error("Can't parse HTML element: ", el);
    }
    return el;
  }
  /*
    Method force compositor layer on HTMLElement.
    @private
    @param {Object} HTMLElement.
    @returns {Object} HTMLElement.
  */
  force3d(el) {
    this.setPrefixedStyle(el, "backface-visibility", "hidden");
    return el;
  }
  /*
    Method to check if value is delta.
    @private
    @param {Any} Property to check.
    @returns {Boolean} If value is delta.
  */
  isDelta(optionsValue) {
    let isObject = this.isObject(optionsValue);
    isObject = isObject && !optionsValue.unit;
    return !(
      !isObject ||
      this.isArray(optionsValue) ||
      this.isDOM(optionsValue)
    );
  }
}
Helpers.initClass();

let h = new Helpers();
export default h;

function __guard__(value, transform) {
  return typeof value !== "undefined" && value !== null
    ? transform(value)
    : undefined;
}
