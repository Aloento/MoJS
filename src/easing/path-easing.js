import h from "../h";

// ## PathEasing
// Class allows you to specify custom easing function
// by **SVG path** [line commands](https://goo.gl/LzvV6P).
// Line commands should by in range of rect 100x100.
// @param {String, DOMNode}
// @param {Object} options
//   - eps  {Number}  Epsilon specifies how precise we
//     should be when sampling the path. Smaller number - more
//     precise is computation, but more CPU power it takes *default: 0.001*
//   - precompute {Number} Quantity of steps for sampling specified path
//     on init. It can be in *range of [100, 10000]*.
//     Larger number specified - more time it takes to init the module,
//     but less time it takes during the animation. *default: 1450*
//   - rect {Number} The largest
//     number SVG path coordinates can have *default: 100*
//   - approximateMax {Number} Number of loops avaliable
//     when approximating the path value *default: 5*
class PathEasing {
  // Method to create letiables
  // @method _lets
  _lets() {
    // options
    this._precompute = h.clamp(this.o.precompute || 1450, 100, 10000);
    this._step = 1 / this._precompute;
    this._rect = this.o.rect || 100;
    this._approximateMax = this.o.approximateMax || 5;
    this._eps = this.o.eps || 0.001;
    // util letiables
    return (this._boundsPrevProgress = -1);
  }
  // ---

  // Constructor
  constructor(path, o = {}) {
    // the class can work as a "creator" of self instances
    // so no need to init if 'creator' passed insted of path
    this.o = o;
    if (path === "creator") {
      return;
    }
    this.path = h.parsePath(path);
    if (this.path == null) {
      return h.error("Error while parsing the path");
    }

    this._lets();
    // normalize start and end x value of the path
    this.path.setAttribute(
      "d",
      this._normalizePath(this.path.getAttribute("d"))
    );

    this.pathLength = this.path.getTotalLength();

    this.sample = h.bind(this.sample, this);
    this._hardSample = h.bind(this._hardSample, this);

    // console.time 'pre sample'
    this._preSample();
    // console.timeEnd 'pre sample'
    this;
  }
  // ---

  // Samples the path on init
  //
  // @method _preSample
  // @sideEffect {Array} _samples - set of sampled points
  _preSample() {
    this._samples = [];
    return (() => {
      const result = [];
      for (
        let i = 0, end = this._precompute, asc = 0 <= end;
        asc ? i <= end : i >= end;
        asc ? i++ : i--
      ) {
        const progress = i * this._step;
        const length = this.pathLength * progress;
        const point = this.path.getPointAtLength(length);
        result.push((this._samples[i] = { point, length, progress }));
      }
      return result;
    })();
  }
  // ---

  // @method _findBounds
  // @param  {Array}   to search in
  // @param  {Number}  progress to search for
  // @return {Object}
  //         - start {Number}: lowest boundry
  //         - end   {Number}: highest boundry
  _findBounds(array, p) {
    let direction, end, loopEnd, start;
    if (p === this._boundsPrevProgress) {
      return this._prevBounds;
    }
    // get the start index in the array
    // reset the cached prev index if new progress
    // is smaller then previous one or it is not defined
    if (this._boundsStartIndex == null) {
      this._boundsStartIndex = 0;
    }

    const len = array.length;
    // get start and end indexes of the loop and save the direction
    if (this._boundsPrevProgress > p) {
      loopEnd = 0;
      direction = "reverse";
    } else {
      loopEnd = len;
      direction = "forward";
    }

    // set default start and end bounds to the
    // very first and the very last items in array
    if (direction === "forward") {
      start = array[0];
      end = array[array.length - 1];
    } else {
      start = array[array.length - 1];
      end = array[0];
    }

    // loop thru the array from the @_boundsStartIndex
    for (
      let i = this._boundsStartIndex,
        end1 = loopEnd,
        asc = this._boundsStartIndex <= end1;
      asc ? i < end1 : i > end1;
      asc ? i++ : i--
    ) {
      const value = array[i];
      let pointX = value.point.x / this._rect;
      let pointP = p;
      // if direction is reverse swap pointX and pointP
      // for if statement
      if (direction === "reverse") {
        const buffer = pointX;
        pointX = pointP;
        pointP = buffer;
      }
      // the next statement is nicer but it creates
      // a new object, so bothers GC
      // {pointX, pointP} = {pointX: pointP, pointP: pointX}
      // save the latest smaller value as start value
      if (pointX < pointP) {
        start = value;
        this._boundsStartIndex = i;
        // save the first larger value as end value
        // and break immediately
      } else {
        end = value;
        break;
      }
    }
    this._boundsPrevProgress = p;
    // return the first item if start wasn't found
    // start ?= array[0]
    // end   ?= array[array.length-1]

    return (this._prevBounds = { start, end });
  }
  // ---

  // Loop thru path trying to find the most closer x
  // compared to current progress value
  //
  // @method sample
  // @param  {Number} easing progress in range [0,1]
  // @return {Number} easing y
  sample(p) {
    p = h.clamp(p, 0, 1);
    const bounds = this._findBounds(this._samples, p);
    const res = this._checkIfBoundsCloseEnough(p, bounds);
    if (res != null) {
      return res;
    }
    return this._findApproximate(p, bounds.start, bounds.end);
  }
  // ---

  // Check if one of bounds.start or bounds.end
  // is close enough to searched progress
  //
  // @method _checkIfBoundsCloseEnough
  // @param  {Number} progress
  // @param  {Object} bounds
  // @return {Number, Undefined} returns Y value if true, undefined if false
  _checkIfBoundsCloseEnough(p, bounds) {
    const point = undefined;
    // check if start bound is close enough
    const y = this._checkIfPointCloseEnough(p, bounds.start.point);
    if (y != null) {
      return y;
    }
    // check if end bound is close enough
    return this._checkIfPointCloseEnough(p, bounds.end.point);
  }
  // ---

  // Check if bound point close enough to progress
  //
  // @method _checkIfPointCloseEnough
  // @param  {Number} progress
  // @param  {Object} bound point (start or end)
  // @return {Number, Undefined} returns Y value if true, undefined if false
  _checkIfPointCloseEnough(p, point) {
    if (h.closeEnough(p, point.x / this._rect, this._eps)) {
      return this._resolveY(point);
    }
  }
  // ---

  // @method _approximate
  // @param  {Object} start point object
  // @param  {Object} end point object
  // @param  {Number} progress to search
  // @return {Object} approximation
  _approximate(start, end, p) {
    const deltaP = end.point.x - start.point.x;
    const percentP = (p - start.point.x / this._rect) / (deltaP / this._rect);
    return start.length + percentP * (end.length - start.length);
  }
  // ---

  // @method _findApproximate
  // @param  {Number} progress to search for
  // @param  {Object} start point object
  // @param  {Object} end point object
  // @return {Nunomber} y approximation
  _findApproximate(p, start, end, approximateMax = this._approximateMax) {
    const approximation = this._approximate(start, end, p);
    const point = this.path.getPointAtLength(approximation);
    const x = point.x / this._rect;
    // if close enough resolve the y value
    if (h.closeEnough(p, x, this._eps)) {
      return this._resolveY(point);
    } else {
      // if looping for a long time
      if (--approximateMax < 1) {
        return this._resolveY(point);
      }
      // not precise enough so we will call self
      // again recursively, lets find arguments for the call
      const newPoint = { point, length: approximation };
      const args =
        p < x
          ? [p, start, newPoint, approximateMax]
          : [p, newPoint, end, approximateMax];
      return this._findApproximate.apply(this, args);
    }
  }
  // ---

  // @method resolveY
  // @param  {Object} SVG point
  // @return {Number} normalized y
  _resolveY(point) {
    return 1 - point.y / this._rect;
  }
  // ---
  //
  // Method to normalize path's X start and end value
  // since it must start at 0 and end at 100
  // @param  {String} Path coordinates to normalize
  // @return {String} Normalized path coordinates
  _normalizePath(path) {
    // SVG path commands
    let normalizedPath;
    const svgCommandsRegexp = /[M|L|H|V|C|S|Q|T|A]/gim;
    const points = path.split(svgCommandsRegexp);
    // remove the first empty item - it is always
    // empty cuz we split by M
    points.shift();
    const commands = path.match(svgCommandsRegexp);
    // normalize the x value of the start segment to 0
    const startIndex = 0;
    points[startIndex] = this._normalizeSegment(points[startIndex]);
    // normalize the x value of the end segment to _rect value
    const endIndex = points.length - 1;
    points[endIndex] = this._normalizeSegment(
      points[endIndex],
      this._rect || 100
    );

    // form the normalized path
    return (normalizedPath = this._joinNormalizedPath(commands, points));
  }

  // ---

  // Method to form normalized path.
  // @param {Array} Commands array.
  // @param {Array} Points array.
  // @return {String} Formed normalized path.
  _joinNormalizedPath(commands, points) {
    let normalizedPath = "";
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      const space = i === 0 ? "" : " ";
      normalizedPath += `${space}${command}${points[i].trim()}`;
    }

    return normalizedPath;
  }

  // ---

  // Method to normalize SVG path segment
  // @param  {String} Segment to normalize.
  // @param  {Number} Value to normalize to.
  // @return {String} Normalized Segment.
  _normalizeSegment(segment, value = 0) {
    segment = segment.trim();
    const nRgx = /(-|\+)?((\d+(\.(\d|\e(-|\+)?)+)?)|(\.?(\d|\e|(\-|\+))+))/gim;
    const pairs = this._getSegmentPairs(segment.match(nRgx));
    // get x value of the latest point
    const lastPoint = pairs[pairs.length - 1];
    const x = lastPoint[0];
    const parsedX = Number(x);
    // if the x point isn't the same as value, set it to the value
    if (parsedX !== value) {
      // join pairs to form segment
      segment = "";
      lastPoint[0] = value;
      for (let i = 0; i < pairs.length; i++) {
        const point = pairs[i];
        const space = i === 0 ? "" : " ";
        segment += `${space}${point[0]},${point[1]}`;
      }
    }
    return segment;
  }

  // Method to geather array values to pairs.
  // @param  {Array} Array to search pairs in.
  // @return {Array} Matrix of pairs.
  _getSegmentPairs(array) {
    if (array.length % 2 !== 0) {
      h.error("Failed to parse the path - segment pairs are not even.", array);
    }
    const newArray = [];
    // loop over the array by 2
    // and save the pairs
    for (let i = 0; i < array.length; i += 2) {
      const value = array[i];
      const pair = [array[i], array[i + 1]];
      newArray.push(pair);
    }
    return newArray;
  }

  // ---

  // Create new instance of PathEasing with specified parameters
  // *Please see the docs for PathEasing for more details on params.*
  //
  // @method create
  // @param  {String, DOMNode} path
  // @return {Object} easing y
  create(path, o) {
    const handler = new PathEasing(path, o);
    handler.sample.path = handler.path;
    return handler.sample;
  }
}

export default PathEasing;
