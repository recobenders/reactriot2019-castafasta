import React, { Component } from "react";
import { Subscription, Subject } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { map } from "rxjs/operators";
import EventOrientationSensor from "./WandHelpers/EventOrientationSensor";
import Value from './WandHelpers/Value';
import { applyFilters } from './WandHelpers/Filters';
import Constants from '../../../shared/constants';

class Wand extends Component {
  componentDidMount() {
    let accelerometer = new EventOrientationSensor(60, false);
    let data = this.watchSensor(accelerometer, (sensor, observer, ev) => { observer.onNext({ x: ev.x, y: ev.y, z: ev.z, timestamp: new Date().getTime() }); }).share();

    let x = data.pipe(map(d => new Value(d.x, d.timestamp, d.id)));
    let y = data.pipe(map(d => new Value(d.y, d.timestamp, d.id)));
    let z = data.pipe(map(d => new Value(d.z, d.timestamp, d.id)));

    if (Constants.DIRECTION_DETECTION.PIPELINE) {
      Constants.DIRECTION_DETECTION.PIPELINE.forEach(group => {
        let series = applyFilters({ x: x, y: y, z: z }, group.FILTERS);
        x = series.x;
        y = series.y;
        z = series.z;
      });
    }

    let velocity = this.toVector3(x, y, z);
    let directions = this.getMaxDirection(velocity, Constants.DIRECTION_DETECTION.DIRECTION.DISTANCE_THRESHOLD_MIN);
    directions = this.groupDirections(directions, Constants.DIRECTION_DETECTION.DIRECTION.GROUP_DURATION_MIN, Constants.DIRECTION_DETECTION.DIRECTION.GROUP_DURATION_MAX);
  }

  watchSensor(sensor, listener) {
    if (sensor) {
      return Observable.create((observer) => {
        let eventListener = (ev) => listener(sensor, observer, ev);

        sensor.start();
        sensor.addEventListener("reading", eventListener);

        return Subscription.create(() => {
          sensor.stop();
          sensor.removeEventListener("reading", eventListener);
        });
      });
    }
  }

  toVector3(x, y, z) {
    return Observable.zip(x, y, z, (x, y, z) =>
      new Value(
        {
          x: x.value,
          y: y.value,
          z: z.value
        },
        x.timestamp,
        x.id
      )
    ).share();
  }

  getMaxDirection(x, threshold) {
    return x.map(v => {
      let x = v.value.x;
      let y = v.value.y;
      let z = v.value.z;
      let xLength = Math.abs(x);
      let yLength = Math.abs(y);
      let zLength = Math.abs(z);

      let totalLength = xLength + yLength + zLength;

      let direction = { x: 0, y: 0, weight: 0.0 };

      if (xLength > zLength && xLength > threshold) {
        direction.x = parseInt((x / xLength).toFixed(0));
        direction.weight = xLength / totalLength;
      }
      else if (xLength < zLength && zLength > threshold) {	// Z will be Y in 2d
        direction.y = parseInt((z / zLength).toFixed(0));
        direction.weight = zLength / totalLength;
      }

      return new Value(direction, v.timestamp, v.id);
    });
  }

  groupDirections(directions, minThreshold, maxThreshold) {
    return this.bufferUntil(directions, (a, b) => (a.value.x !== b.value.x  || a.value.y !== b.value.y) || b.timestamp - a.timestamp > maxThreshold)
      .map(buffer => {
        let duration = Math.abs(buffer[buffer.length - 1].timestamp - buffer[0].timestamp);
        if (duration > minThreshold) {
          let values = this.mapArrayOverlapping(buffer, (previous, current) => current.value.weight * (current.timestamp - previous.timestamp));
          let avgWeight = values.reduce((sum, value) => sum + value, 0) / duration;
          return new Value({ x: buffer[0].value.x, y: buffer[0].value.y, weight: avgWeight }, buffer[buffer.length - 1].timestamp, buffer[buffer.length - 1].id);
        }
        return null;
      });
      // .where(a => a != null); where is undefined
  }

  bufferUntil(source, predicate) {
    return Observable.create((observer) => {
      let isFirst = true;
      let firstValue = null;
      let closings = new Subject();
      return source.do(v => {
        if (isFirst) {
          isFirst = false;
          firstValue = v;
        }
        else if (predicate(firstValue, v)) {
          isFirst = false;
          firstValue = v;
          closings.onNext({});
        }
      })
        .buffer(() => closings)
        .subscribe(observer);
    });
  }

  mapArrayOverlapping(arr, callback) {
    let result = [];
    for (let i = 1; i < arr.length; i++) {
      result.push(callback(arr[i - 1], arr[i]));
    }

    return result;
  }

  render() {
    return (
      <div>
        WAND
      </div>
    );
  }
}

export default Wand;
