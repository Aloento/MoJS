/*
  Method to bootstrap approximation function.
  @private
  @param   {Object} Samples Object.
  @returns {Function} Approximate function.
*/
const _proximate = (samples) => {
  let n = samples.base,
    samplesAmount = Math.pow(10, n),
    samplesStep = 1 / samplesAmount;

  function RoundNumber(input, numberDecimals) {
    numberDecimals = +numberDecimals || 0; // +let magic!

    let multiplyer = Math.pow(10.0, numberDecimals);

    return Math.round(input * multiplyer) / multiplyer;
  }

  let cached = function cached(p) {
    let nextIndex,
      nextValue,
      newKey = RoundNumber(p, n),
      sample = samples.get(newKey);

    if (Math.abs(p - newKey) < samplesStep) {
      return sample;
    }

    if (p > newKey) {
      nextIndex = newKey + samplesStep;
      nextValue = samples.get(nextIndex);
    } else {
      nextIndex = newKey - samplesStep;
      nextValue = samples.get(nextIndex);
    }

    let dLength = nextIndex - newKey;
    let dValue = nextValue - sample;
    if (dValue < samplesStep) {
      return sample;
    }

    let progressScale = (p - newKey) / dLength;
    let coef = nextValue > sample ? -1 : 1;
    let scaledDifference = coef * progressScale * dValue;

    return sample + scaledDifference;
  };

  cached.getSamples = () => {
    return samples;
  };

  return cached;
};

/*
    Method to take samples of the function and call the _proximate
    method with the dunction and samples. Or if samples passed - pipe
    them to the _proximate method without sampling.
    @private
    @param {Function} Function to sample.
    @param {Number, Object, String} Precision or precomputed samples.
  */
const _sample = (fn, n = 4) => {
  const nType = typeof n;

  let samples = new Map();
  if (nType === "number") {
    let p = 0,
      samplesCount = Math.pow(10, n),
      step = 1 / samplesCount;

    samples.set(0, fn(0));
    for (let i = 0; i < samplesCount - 1; i++) {
      p += step;

      let index = parseFloat(p.toFixed(n));
      samples.set(index, p);
    }
    samples.set(1, fn(1));

    samples.base = n;
  } else if (nType === "object") {
    samples = new Map(n.entries());
  } else if (nType === "string") {
    samples = new Map(JSON.parse(n).entries());
  }

  return Approximate._sample._proximate(samples);
};

const Approximate = { _sample, _proximate };
Approximate._sample._proximate = Approximate._proximate;

export default Approximate._sample;
