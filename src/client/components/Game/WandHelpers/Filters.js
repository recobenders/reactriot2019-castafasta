import Constants from "../../../../shared/constants";
import Value from "./Value";
import { map, bufferCount, scan, filter } from "rxjs/operators";

export function applyFilters(series, filters) {
  Object.keys(series).forEach((key) => {
    let pipeFilters = [];

    filters.forEach(filterConfig => {
      let filter = resolveFilter(filterConfig, key);
      if (filter) {
        pipeFilters.push(filter);
      }
    });

    series[key] = series[key].pipe(...pipeFilters);
  });

  return series;
}


function resolveFilter(filterConfig, seriesKey) {
  switch (filterConfig.TYPE) {
    case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.LOW_PASS:
      return lowPassSmoothingFilter(filterConfig.WINDOW_SIZE, v => v.value, w => w.length);
    case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.EXPONENTIAL:
      return exponentialSmoothingFilter(filterConfig.ALPHA);
    case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.CLAMP:
      return clampFilter(filterConfig.LIMIT);
    case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.ZERO:
      return zeroFilter(seriesKey, filterConfig.AXES);
    case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.THRESHOLD:
      return thresholdFilter(filterConfig.THRESHOLD_VALUE);
    // case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.EXP_TRANSFORM:
    //   return exponentialTransformFilter(filterConfig.POWER, seriesKey, filterConfig.AXES);
    case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.INTEGRATION:
      if (filterConfig.RESET) {
        return integrationFilterWithReset(filterConfig.RESET.THRESHOLD_VALUE, filterConfig.RESET.SAMPLES_COUNT_LIMIT);
      }
      else {
        return integrationFilter();
      }
    default:
      throw new Error(`Requested filter is not supported: ${filterConfig.TYPE}`);
  }
}


// Higher the alpha, more significant the current value is
function exponentialSmoothing(previous, current, alpha) {
	return previous * (1 - alpha) + current * alpha;
}


function exponentialSmoothingFilter(alpha) {
	alpha = alpha || 0.3;
	return source => source.pipe(
    scan((previous, current) => new Value(exponentialSmoothing(previous.value, current.value, alpha), current.timestamp, current.id))
  );
}


function integrate(fa, fb, a, b) {
	return ((fa + fb) / 2) * (b - a);
}


// cumulative
function integrationFilterWithReset(resetThreshold, resetCountLimit) {
	resetThreshold = resetThreshold || 0.05;
	resetCountLimit = resetCountLimit || 25;

	let count = 0;

	return source => source.pipe(
    bufferCount(2, 1),
		filter(buffer => buffer.length === 2),
		map(buffer => ({ previous: buffer[0], current: buffer[buffer.length - 1] })),
		scan((result, samples) => {
			let previousResult = result ? result.value : 0;

			if (samples.current.value >= -resetThreshold && samples.current.value <= resetThreshold) {
				count++;
			}
			else {
				count = 0;
			}

			if (count < resetCountLimit) {
				return new Value(previousResult + integrate(samples.previous.value, samples.current.value, samples.previous.timestamp, samples.current.timestamp) / 1000.0, samples.current.timestamp, samples.current.id);
			}
			else {
				return new Value(0.0, samples.current.timestamp, samples.current.id);
			}
		}, 
    null)
  );
}


// cumulative
function integrationFilter() {
	return source => source.pipe(
    bufferCount(2, 1),
		filter(buffer => buffer.length === 2),
		map(buffer => ({ previous: buffer[0], current: buffer[buffer.length - 1] })),
		scan((result, samples) => {
			let previousResult = result ? result.value : 0;

			return new Value(previousResult + integrate(samples.previous.value, samples.current.value, samples.previous.timestamp, samples.current.timestamp) / 1000.0, samples.current.timestamp, samples.current.id);
    })
  );
}


function thresholdFilter(threshold) {
	threshold = threshold || 0;
	return source => source.pipe(
    map(v => {
      return new Value(
        (v.value >= -threshold && v.value <= threshold) ? 0 : v.value,
        v.timestamp,
        v.id
      );
    })
  );
}


function lowPassSmoothingFilter(windowSize, getValue, getWindowSize) {
  windowSize = windowSize || 5;
  getValue = getValue || (item => (item && item.value) || 0);
  getWindowSize = getWindowSize || (arr => (arr && arr.length) || 0);

  return source => source.pipe(
    bufferCount(windowSize, 1),
    bufferCount(2, 1),
    scan((previous, buffers) => {
      let value = 0;
      let size = 0;
      if (previous == null) {	// if first window, sum all the values
        value = buffers[1].reduce((a, b) => a + getValue(b), 0);
        size = getWindowSize(buffers[1]);
      }
      else {	// otherwise, subtract first value of the previous window and add only the last value from the new window (windows overlap with 1 sample)
        value = previous.value - getValue(buffers[0][0]) + getValue(buffers[1][buffers[1].length - 1]);
        size = previous.size - getWindowSize([ buffers[0][0], buffers[1][0] ]) + getWindowSize([ buffers[0][buffers[0].length - 1], buffers[1][buffers[1].length - 1] ]);
      }
      let pivot = buffers[1][Math.floor(buffers[1].length / 2)];

      return { value: value, pivot: pivot, size: size };
    }, null),
    map(window => new Value(window.value / window.size, window.pivot.timestamp, window.pivot.id))
  );
}


function clampFilter(limit) {
  limit = limit || Number.MAX_VALUE;

  return source => source.pipe(
    map(v => new Value(
        (v.value > limit) ? limit : (v.value < -limit ? -limit : v.value),
        v.timestamp,
        v.id
      )
    )
  );
}


function zeroFilter(channel, channels) {
  if (channels && channels.includes(channel)) {
    return source => source.pipe(map(v => new Value(0.0, v.timestamp, v.id)));
  }
  else {
    return source => source;
  }
}