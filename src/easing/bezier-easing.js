/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import h from "../h";

/**
 * Copyright (c) 2014 Gaëtan Renaudeau https://goo.gl/El3k7u
 * Adopted from https://github.com/gre/bezier-easing
 */

class BezierEasing {
  constructor(o) {
    this.lets();
    return this.generate;
  }
  lets() {
    return (this.generate = h.bind(this.generate, this));
  }
  generate(mX1, mY1, mX2, mY2) {
    // params parsing
    let j;
    let i;
    if (arguments.length < 4) {
      return this.error("Bezier function expects 4 arguments");
    }
    for (j = 0, i = j; j < 4; j++, i = j) {
      const arg = arguments[i];
      if (typeof arg !== "number" || isNaN(arg) || !isFinite(arg)) {
        return this.error("Bezier function expects 4 arguments");
      }
    }
    if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) {
      return this.error("Bezier x values should be > 0 and < 1");
    }
    // These values are established by empiricism with
    // tests (tradeoff: performance VS precision)
    const NEWTON_ITERATIONS = 4;
    const NEWTON_MIN_SLOPE = 0.001;
    const SUBDIVISION_PRECISION = 0.0000001;
    const SUBDIVISION_MAX_ITERATIONS = 10;
    const kSplineTableSize = 11;
    const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
    const float32ArraySupported = !!Float32Array;

    const A = (aA1, aA2) => 1.0 - 3.0 * aA2 + 3.0 * aA1;
    const B = (aA1, aA2) => 3.0 * aA2 - 6.0 * aA1;
    const C = (aA1) => 3.0 * aA1;

    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    const calcBezier = (aT, aA1, aA2) =>
      ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    const getSlope = (aT, aA1, aA2) =>
      3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);

    const newtonRaphsonIterate = function (aX, aGuessT) {
      i = 0;
      while (i < NEWTON_ITERATIONS) {
        const currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) {
          return aGuessT;
        }
        const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
        ++i;
      }
      return aGuessT;
    };

    const calcSampleValues = function () {
      i = 0;
      while (i < kSplineTableSize) {
        mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        ++i;
      }
    };
    const binarySubdivide = function (aX, aA, aB) {
      let currentX = undefined;
      let currentT = undefined;
      i = 0;
      while (true) {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
        const isBig = Math.abs(currentX) > SUBDIVISION_PRECISION;
        if (!isBig || ++i >= SUBDIVISION_MAX_ITERATIONS) {
          break;
        }
      }
      return currentT;
    };

    const getTForX = function (aX) {
      let intervalStart = 0.0;
      let currentSample = 1;
      const lastSample = kSplineTableSize - 1;
      while (
        currentSample !== lastSample &&
        mSampleValues[currentSample] <= aX
      ) {
        intervalStart += kSampleStepSize;
        ++currentSample;
      }
      --currentSample;
      // Interpolate to provide an initial guess for t
      const delta =
        mSampleValues[currentSample + 1] - mSampleValues[currentSample];
      const dist = (aX - mSampleValues[currentSample]) / delta;
      const guessForT = intervalStart + dist * kSampleStepSize;
      const initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT);
      } else {
        if (initialSlope === 0.0) {
          return guessForT;
        } else {
          return binarySubdivide(
            aX,
            intervalStart,
            intervalStart + kSampleStepSize
          );
        }
      }
    };

    const precompute = function () {
      const _precomputed = true;
      if (mX1 !== mY1 || mX2 !== mY2) {
        return calcSampleValues();
      }
    };

    let mSampleValues = !float32ArraySupported
      ? new Array(kSplineTableSize)
      : new Float32Array(kSplineTableSize);
    const _precomputed = false;

    const f = function (aX) {
      if (!_precomputed) {
        precompute();
      }
      if (mX1 === mY1 && mX2 === mY2) {
        return aX;
      }
      // linear
      // Because JavaScript number are imprecise,
      // we should guarantee the extremes are right.
      if (aX === 0) {
        return 0;
      }
      if (aX === 1) {
        return 1;
      }
      return calcBezier(getTForX(aX), mY1, mY2);
    };

    const str = "bezier(" + [mX1, mY1, mX2, mY2] + ")";
    f.toStr = () => str;
    return f;
  }

  error(msg) {
    return h.error(msg);
  }
}

const bezierEasing = new BezierEasing();

export default bezierEasing;
