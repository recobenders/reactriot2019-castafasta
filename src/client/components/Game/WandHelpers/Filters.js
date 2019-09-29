import Constants from "../../../../shared/constants";
import Value from "./Value";
import { map, bufferCount, scan } from "rxjs/operators";

export function applyFilters(series, filters) {
  Object.keys(series).forEach((key) => {
    filters.forEach(filterConfig => {
      let filter = null;

      switch (filterConfig.TYPE) {
        case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.LOW_PASS:
          filter = lowPassSmoothingFilter(filterConfig.WINDOW_SIZE, v => v.value, w => w.length);
          break;
        case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.CLAMP:
          filter = clampFilter(filterConfig.LIMIT);
          break;
        case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.ZERO:
          filter = zeroFilter(key, filterConfig.AXES);
          break;
        default:
          // Do nothing
          break;
      }

      if (filter) {
        series[key] = series[key].pipe(filter);
      }

      console.log(filterConfig.TYPE);
    });
  });

  return series;
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
    map(v => {
      return new Value(
        (v.value > limit) ? limit : (v.value < -limit ? -limit : v.value),
        v.timestamp,
        v.id
      );
    })
  );
}

function zeroFilter(channel, channels) {
  if (channels && channels.includes(channel)) {
    return source => source.pipe(map(v => new Value(0.0, v.timestamp, v.id)));
    // return map(v => new Value(0.0, v.timestamp, v.id));
  }
  else {
    return source => source;
  }
}