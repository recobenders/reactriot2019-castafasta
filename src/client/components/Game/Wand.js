import React, { Component } from 'react';
import { Subject, Observable, fromEvent, empty } from 'rxjs';
import { map, zip, tap, share, filter, buffer } from 'rxjs/operators';
import Value from './WandHelpers/Value';
import { applyFilters } from './WandHelpers/Filters';
import Constants from '../../../shared/constants';

class Wand extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: null,
      x: null,
      y: null,
      weight: null
    }
  }

  componentDidMount() {
    const selectedMode = Constants.DIRECTION_DETECTION.SELECTED_MODE;
    const config = Constants.DIRECTION_DETECTION.MODES.find(config => config.MODE === selectedMode);

    let data = this.observeEvents(config).pipe(
        map(ev => Object.assign({ timestamp: new Date().getTime() }, ev)),
        share()
      );
      
    let x = data.pipe(map(d => new Value(d.x, d.timestamp, d.id)));
    let y = data.pipe(map(d => new Value(d.y, d.timestamp, d.id)));
    let z = data.pipe(map(d => new Value(d.z, d.timestamp, d.id)));

    const findSpellDirectionIndex = function(d) {
      let spell = Constants.SPELL_DIRECTIONS.find(direction => direction.x === d.x && direction.y === d.y);
      return (spell) ? spell.value : -1;
    };

    if (config.PIPELINE) {
      config.PIPELINE.forEach(group => {
        let series = applyFilters({ x: x, y: y, z: z }, group.FILTERS);
        
        x = series.x;
        y = series.y;
        z = series.z;
      });
    }

    x.pipe(
      zip(y, z),
      map(([x, y, z]) => 
        new Value(
          {
            x: x.value,
            y: y.value,
            z: z.value
          },
          x.timestamp,
          x.id
        )
      ),
      share(),
      this.getMaxDirection(config.DIRECTION.DISTANCE_THRESHOLD_MIN),
      this.groupDirections(config.DIRECTION.GROUP_DURATION_MIN, config.DIRECTION.GROUP_DURATION_MAX),
      map(d => new Value(Object.assign({ code: findSpellDirectionIndex(d.value) }, d.value), d.timestamp, d.id)),
      tap(d => {
        console.log(d.value.code);
        console.log(`${d.value.x} ${d.value.y} ${d.value.weight}`);
      }),
      tap(d => this.setState({
          code: d.value.code,
          x: d.value.x,
          y: d.value.y,
          weight: d.value.weight
        })
      )
    )
    .subscribe(
      d => this.props.socket.emit(Constants.MSG.CASTING_STEP, d.code, d.weight),
      err => this.setState({
        code: err,
        x: -1,
        y: -1,
        weight: 0
      })
    );
  }

  observeEvents(config) {
    const selectedMode = config.MODE;

    let events = empty();

    if (selectedMode === "orientation") {
      events = fromEvent(window, "deviceorientation").pipe(
        map(event => ({ x: event.gamma, y: event.alpha, z: event.beta }))
      );
    } else {
      console.log('Unsupported mode');
    }

    return events;
  }

  zipToVector3(x, y, z) {
    return x.pipe(
      zip(y, z),
      map(([x, y, z]) => 
        new Value(
          {
            x: x.value,
            y: y.value,
            z: z.value
          },
          x.timestamp,
          x.id
        )
      ),
      share()
    );
  }

  getMaxDirection(threshold) {
    return velocities => velocities.pipe(
        map(v => {
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
      })
    );
  }

  groupDirections(minThreshold, maxThreshold) {
    return directions => this.bufferUntil(directions, (a, b) => (a.value.x !== b.value.x  || a.value.y !== b.value.y) || b.timestamp - a.timestamp > maxThreshold)
      .pipe(
        map(buffer => {
          let duration = Math.abs(buffer[buffer.length - 1].timestamp - buffer[0].timestamp);
          if (duration > minThreshold) {
            let values = this.mapArrayOverlapping(buffer, (previous, current) => current.value.weight * (current.timestamp - previous.timestamp));
            let avgWeight = values.reduce((sum, value) => sum + value, 0) / duration;
            return new Value({ x: buffer[0].value.x, y: buffer[0].value.y, weight: avgWeight }, buffer[buffer.length - 1].timestamp, buffer[buffer.length - 1].id);
          }
          return null;
        }),
        filter(a => a != null)
      );
  }

  bufferUntil(source, predicate) {
    return Observable.create((observer) => {
      let isFirst = true;
      let firstValue = null;
      let closings = new Subject();
      return source
        .pipe(
          tap(v => {
            if (isFirst) {
              isFirst = false;
              firstValue = v;
            }
            else if (predicate(firstValue, v)) {
              isFirst = false;
              firstValue = v;
              closings.next({});
            }
          }),
          buffer(closings)
        ).subscribe(observer);
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
        Code: {this.state.code}
        X: {this.state.x}
        Y: {this.state.y}
        Weight: {this.state.weight}
      </div>
    );
  }
}

export default Wand;
