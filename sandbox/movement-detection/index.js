/// <reference path="./node_modules/rx/ts/rx.all.d.ts" />


// https://stackoverflow.com/questions/8264518/using-accelerometer-gyroscope-and-compass-to-calculate-devices-movement-in-3d
// https://www.nxp.com/docs/en/application-note/AN3397.pdf
// https://stackoverflow.com/questions/42176603/getting-a-trajectory-from-accelerometer-and-gyroscope-imu

// https://codepen.io/vankusik/pen/MWgRvNN
function log(id, value) { 
	document.getElementById(id).innerHTML = value;
}


const EventTargetBase = (function() {
	function EventTargetBase() {
		this.listeners = {};
	}

	const proto = EventTargetBase.prototype;
	proto.listeners = null;

	proto.addEventListener = function(type, callback) {
	  console.log("listener");
	  if (!(type in this.listeners)) {
		this.listeners[type] = [];
	  }
	  this.listeners[type].push(callback);
	};
	
	proto.removeEventListener = function(type, callback) {
	  if (!(type in this.listeners)) {
		return;
	  }
	  var stack = this.listeners[type];
	  for (var i = 0, l = stack.length; i < l; i++) {
		if (stack[i] === callback){
		  stack.splice(i, 1);
		  return;
		}
	  }
	};
	
	proto.dispatchEvent = function(event) {
	  if (!(event.type in this.listeners)) {
		return true;
	  }
	  var stack = this.listeners[event.type].slice();
	
	  for (var i = 0, l = stack.length; i < l; i++) {
		stack[i].call(this, event);
	  }
	  return !event.defaultPrevented;
	};

	return EventTargetBase;
})();


const Helpers = (function() {
	function Helpers() { }

	Helpers.extend = function(thisClass, extendedClass) {
        thisClass.prototype = Object.create(extendedClass.prototype);
        thisClass.prototype.constructor = thisClass;

        return thisClass.prototype;
	};
	
	return Helpers;
})();


const FakeAccelerometer = (function() {
	function FakeAccelerometer(frequency) {
		this._interval = null;
		this._frequency = frequency;

		EventTargetBase.prototype.constructor.call(this);
	}
	
	const proto = Helpers.extend(FakeAccelerometer, EventTargetBase);

	function next(target) {
		target.x = (Math.random() - 0.5) * 10;
		target.y = (Math.random() - 0.5) * 10;
		target.z = (Math.random() - 0.5) * 10;
	}

	proto.start = function() {
		console.log("start");
		this._interval = setInterval(() => { 
			let ev = new Event("reading");
			next(ev);
			this.dispatchEvent(ev);
		}, Math.round(1000.0 / this._frequency));
	}

	proto.stop = function() {
		console.log("stop");
		if (this._interval) {
			clearInterval(this._interval);
			this._interval = null;
		}
	}

	return FakeAccelerometer;
})();


const EventBasedAccelerometer = (function() {
	function EventBasedAccelerometer(frequency, includeGravity) {
		if (!window.DeviceMotionEvent) {
			let error = new Error("not supported");
			error.name = "ReferenceError";
			throw error;
		}
		this._frequency = frequency;
		this._includeGravity = includeGravity;
		this._subscription = null;

		EventTargetBase.prototype.constructor.call(this);
	}
	
	const proto = Helpers.extend(EventBasedAccelerometer, EventTargetBase);

	function createListener(target) {
		const accelerationField = target._includeGravity ? "accelerationIncludingGravity" : "acceleration";
		return (event) => {
			let ev = new Event("reading");
			ev.x = event[accelerationField].x;
			ev.y = event[accelerationField].y;
			ev.z = event[accelerationField].z;
			target.dispatchEvent(ev);
		};
	}

	proto.start = function() {
		console.log("start");

		let listener = createListener(this);

		this._subscription = {
			dispose: () => window.removeEventListener("devicemotion", listener)
		};

		window.addEventListener("devicemotion", listener);
	}

	proto.stop = function() {
		console.log("stop");
		let subscription = this._subscription;
		this._subscription = null;
		
		if (subscription) {
			subscription.dispose();
		}
	}

	return EventBasedAccelerometer;
})();


const SensorAPIAccelerometer = (function() {
	function SensorAPIAccelerometer(frequency, includeGravity) {
		let sensorConstructor = includeGravity ? Accelerometer : LinearAccelerationSensor;
		
		this._sensor = new sensorConstructor({ referenceFrame: "device", frequency: frequency})
		this._frequency = frequency;
		this._subscription = null;

		EventTargetBase.prototype.constructor.call(this);
	}
	
	const proto = Helpers.extend(SensorAPIAccelerometer, EventTargetBase);

	proto.start = function() {
		console.log("start");

		let listener = (event) => {
			let ev = new Event("reading");
			ev.x = this._sensor.x;
			ev.y = this._sensor.y;
			ev.z = this._sensor.z;
			this.dispatchEvent(ev);
		};

		this._subscription = {
			dispose: () => { this._sensor.stop(); this._sensor.removeEventListener("reading", listener); }
		};

		this._sensor.addEventListener("reading", listener);
		this._sensor.start();
	}

	proto.stop = function() {
		console.log("stop");
		if (this._subscription) {
			this._subscription.dispose();
			this._subscription = null;
		}
	}

	return SensorAPIAccelerometer;
})();



let accelerometer = null;


function init(frequency) {
	frequency = parseInt(document.getElementsByName("frequency")[0].value) || 60;

	let sensors = document.getElementsByName("sensor");
	let selectedSensorName = null;
	for (let i = 0; i < sensors.length; i++) {
		if (sensors[i].checked) {
			selectedSensorName = sensors[i].value;
		}
	}

	let selectedSensor = null;
	switch (selectedSensorName) {
		case "fake" :
			selectedSensor = FakeAccelerometer;
			break;
		case "api":
			selectedSensor = SensorAPIAccelerometer;
			break;
		default:
		case "event": 
			selectedSensor = EventBasedAccelerometer;
			break;
	}
	console.log(selectedSensorName);

	let includeGravity = document.getElementsByName("gravity")[0].checked;

	try {
		accelerometer = new selectedSensor(frequency, includeGravity); // Accelerometer LinearAccelerationSensor

		log("status", "OK");
		log("device", selectedSensorName);
	} catch (error) {
		accelerometer = new FakeAccelerometer(frequency);
		log("device", "fake");
		
		// Handle construction errors.
		if (error.name === "SecurityError") {
			// See the note above about feature policy.
			log("status", "Sensor construction was blocked by a feature policy");
		} else if (error.name === "ReferenceError") {
			log("status", "Sensor is not supported by the User Agent");
		} else {
			log("status", "ERROR"); throw error;
		}
	}

	document.getElementById("start").disabled = false;

	return accelerometer;
}


function watchSensor(sensor, listener) {
	if (sensor) {
		return Rx.Observable.create((observer) => {
			let eventListener = (ev) => listener(sensor, observer, ev);	
			
			sensor.addEventListener("reading", eventListener);
			sensor.start();
			
			return Rx.Disposable.create(() => {
				sensor.stop();
				sensor.removeEventListener("reading", eventListener);	
			});
		});
	}
}

const chartsRootElement = document.getElementById("charts");
const charts = {};

const colors = [ [0, 255, 0], [255, 0, 0], [0, 0, 255] ];
function createBrush(color, alpha) {
	return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}


function addLabel(observable, parentElement, name) {
	let seriesLabel = document.createElement("span");
		
	parentElement.appendChild(seriesLabel);
	
	seriesLabel.innerHTML = `${name}: `;

	let seriesValueLabel = document.createElement("span");
	
	seriesValueLabel.setAttribute("style", "width: 50px; display: inline-block");

	seriesLabel.appendChild(seriesValueLabel);
	seriesValueLabel.innerHTML = "";

	return observable.do(d => seriesValueLabel.innerHTML = d.value.toFixed(2));
}


function plot(observable, target, color, label, log) {
	let chart = (target && charts[target]) || new SmoothieChart({responsive: true});

	let series = new TimeSeries();
	chart.addTimeSeries(series, { strokeStyle: createBrush(colors[color], 1), fillStyle: createBrush(colors[color], 0.2), lineWidth: 4 });

	let newElement = false;
	let chartElementId = target ? `canvas-${target}` : "";

	let chartElement = (chartElementId && document.getElementById(chartElementId));

	if (!chartElement) { // chart does not exist
		let chartPanel = document.createElement("div");
		chartsRootElement.appendChild(chartPanel);

		let chartLabel = document.createElement("span");
		chartPanel.appendChild(chartLabel);
		chartLabel.innerHTML = `${target}: `;
		chartLabel.classList.add("chart-label");
		
		chartPanel.appendChild(document.createElement("br"));

		chartElement = document.createElement("canvas");
		chartElement.setAttribute("id", chartElementId);
		chartElement.setAttribute("style", "width:100%; height:200px");
		
		chartPanel.appendChild(chartElement);

		chart.streamTo(chartElement, 500);
	}
	
	if (label) {
		observable = addLabel(observable, chartElement.parentElement.getElementsByClassName("chart-label")[0], label);
	}

	if (target) {
		charts[target || `_${Object.keys(charts).length}_`] = chart;
	}

	return observable.do(data => {
		if (log) console.log(data.id);

		series.append(data.timestamp, data.value);
	});
}



var subscription = null;

// Higher the alpha, more significant the current value is
function exponentialSmoothing(previous, current, alpha) {
	return previous * (1 - alpha) + current * alpha;
}


function smoothMovingAverage(source, windowSize) {
	return source.bufferWithCount(windowSize, 1)
					.bufferWithCount(2, 1)
					.scan((previous, buffers) => {
						let sum = 0;
						if (previous == null) {
							sum = buffers[1].reduce((a, b) => a + b.value, 0); // sum of current 
						}
						else {
							sum = previous.value - buffers[0][0].value + buffers[1][buffers[1].length - 1].value;
						}
						return new Value(sum, buffers[1][buffers[1].length - 1].timestamp, buffers[1][buffers[1].length - 1].id);
					}, null)
					.select(sum => new Value(sum.value / windowSize, sum.timestamp, sum.id));
}


function smoothExponential(x, alpha) {
	alpha = alpha || 0.3;
	return x.scan((previous, current) => new Value(exponentialSmoothing(previous.value, current.value, alpha), current.timestamp, current.id));
}


function integrationWithReset(x, resetSize, resetLimit) {
	resetSize  = resetSize  || 0.05;
	resetLimit = resetLimit || 25;

	let count = 0;

	return x.bufferWithCount(2, 1)
			.where(buffer => buffer.length > 1)
			.select(buffer => { return { previous: buffer[0], current: buffer[buffer.length - 1] }; })
			.scan((result, samples) => {
				let previousResult = result ? result.value : 0;

				if (samples.current.value >= -resetSize && samples.current.value <= resetSize) {
					count++;
				}
				else {
					count = 0;
				}

				if (result && result.id === samples.current.id) {
					console.log("SAME ID: integrationWithReset");
				}

				if (count < resetLimit) {
					return new Value(previousResult + ((samples.previous.value + samples.current.value) / 2) * ((samples.current.timestamp - samples.previous.timestamp) / 1000.0), samples.current.timestamp, samples.current.id);
				}
				else {
					return new Value(0.0, samples.current.timestamp, samples.current.id);
				}
			}, null);
}


function integration(x) {
	return x.bufferWithCount(2, 1)
			.where(buffer => buffer.length == 2)
			.select(buffer => { return { previous: buffer[0], current: buffer[buffer.length - 1] }; })
			.scan((result, samples) => { 
					let previousResult = result ? result.value : 0;
					
					if (result && result.id === samples.current.id) {
						console.log("SAME ID: integration");
					}

					return new Value(previousResult + ((samples.previous.value + samples.current.value)/2) * ((samples.current.timestamp - samples.previous.timestamp) / 1000.0), samples.current.timestamp, samples.current.id);
				},
				null);
}




function calibrate(x, samples) {
	return x.take(samples).average();
}


function clampOut(source, size) {
	return source.select(v => {
		return (v.value >= -size && v.value <= size)
			 ? new Value(0, v.timestamp, v.id)
			 : v;
	})
}


// function reset(source, reference, size, limit) {
// 	size  = size  || 0.05;
// 	limit = limit || 25;
	  
// 	let resets = Rx.Observable.create(observer => {
// 		let count = 0;

// 		return reference.subscribe(v => {
// 			if (v.value >= -size && v.value <= size) {
// 				count++;
// 			}
// 			else {
// 				count = 0;
// 			}

// 			// observer.onNext(new Value(count >= limit, v.timestamp));
// 			observer.onNext(count >= limit ? "reset" : "source");
// 		});
// 	});

// 	return Rx.Observable.create(observer => {
// 		let isResetting = false;
// 		return source.bufferWithCount(2,2).merge(resets).subscribe(v => {
// 			if (v === "reset") {
// 				isResetting = true;
// 				//console.log("reset");
// 			}
// 			else if (v === "source") {
// 				isResetting = false;
// 				//console.log("source");
// 			}
// 			else
// 			{
// 				//console.log(v[0].id);
// 				observer.onNext(isResetting ? new Value(0, v[0].timestamp, v[0].id) : v[0]);
// 				observer.onNext(isResetting ? new Value(0, v[1].timestamp, v[1].id) : v[1]);
// 			}
// 		})
// 	});
// }


const FREQUENCY = 60;


const Value = (function() {
	function Value(value, timestamp, id) {
		this.value = value;
		this.timestamp = timestamp;
		this.id = id;
	}

	return Value;
})();

const CALIBRATION_TIME = 2000;

const map = {
  "-100" : "&lArr;"
, "010"  : "&uArr;"
, "100"  : "&rArr;"
, "0-10" : "&dArr;"
, "-110" : "&nwArr;"
, "110"  : "&neArr;"
, "1-10" : "&seArr;"
, "-1-10" : "&swArr;"
};

function combine(x, y, z) {
	return Rx.Observable.zip(x, y, z, (x, y, z) => 
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

function directionChanges2(velocity, windowSize) {
	windowSize = windowSize || 11; 
	return velocity.bufferWithCount(windowSize, 1)
		.where(buffer => buffer.length == windowSize)
		.select(buffer => { 
			let avgX = buffer.reduce((sum, item) => sum + item.value.x, 0) / windowSize;
			let avgY = buffer.reduce((sum, item) => sum + item.value.y, 0) / windowSize;
			let avgZ = buffer.reduce((sum, item) => sum + item.value.z, 0) / windowSize;

			let change = {
				x: avgX,
				y: avgY,
				z: avgZ
			};

			let pivot = buffer[Math.floor(buffer.length / 2)];
			return new Value(change, pivot.timestamp, pivot.id);
		})
}


// smooth ?
function directionChanges(xyz, windowSize) {
	windowSize = windowSize || 11;
	// windowStep = Math.floor(windowSize / 2);
	return xyz.bufferWithCount(windowSize, 1)
			.where(buffer => buffer.length == windowSize)
			.select(buffer => { return { begin: buffer[0], end: buffer[buffer.length - 1], middle: buffer[Math.floor(buffer.length / 2)] }; })
			.select(positions =>  {
				// let length = Math.abs(positions.end.value - positions.begin.value);
				// let direction = length > epsilon ? (positions.end.value - positions.begin.value) : 0.0;
				let change = {
					x: positions.end.value.x - positions.begin.value.x,
					y: positions.end.value.y - positions.begin.value.y,
					z: positions.end.value.z - positions.begin.value.z
				}
				return new Value(change, positions.middle.timestamp, positions.middle.id);
			});
}


function directions(changes, minDiff) {
	const zero = { x: 0.0, y: 0.0, z: 0.0 };
	minDiff = minDiff || 0.5;

	return changes.select(change => {
		vector = change.value;
		let max = Math.max(Math.abs(vector.x), Math.abs(vector.y), Math.abs(vector.z));
		let dirVector = zero;

		if (max > 0) {
			dirVector = {
				x: vector.x / max,
				y: vector.y / max,
				z: vector.z / max
			};

			dirVector = {
				x: Math.abs(dirVector.x) > minDiff ? (dirVector.x / Math.abs(dirVector.x)) : 0.0,
				y: Math.abs(dirVector.y) > minDiff ? (dirVector.y / Math.abs(dirVector.y)) : 0.0,
				z: Math.abs(dirVector.z) > minDiff ? (dirVector.z / Math.abs(dirVector.z)) : 0.0
			}
		}

		return new Value(dirVector, change.timestamp, change.id);
	});
}

function plotVector(vectors, target, log) {
	let x = plot(vectors.select(v => new Value(v.value.x, v.timestamp, v.id)), target, 0, "X", log && log[0]);
	let y = plot(vectors.select(v => new Value(v.value.y, v.timestamp, v.id)), target, 1, "Y", log && log[1]);
	let z = plot(vectors.select(v => new Value(v.value.z, v.timestamp, v.id)), target, 2, "Z", log && log[2]);

	return combine(x, y, z);
}

function toArrow(directions) {
	return directions.select((vector) => 
			{ 
				let fixedX = vector.value.x.toFixed(0);
				let fixedY = vector.value.y.toFixed(0);
				let fixedZ = vector.value.z.toFixed(0);

				let key = `${fixedX}${fixedY}0`;
				let keyAlt = `${fixedX}${fixedZ}0`;
				
				return new Value(map[key] || map[keyAlt] || "", vector.timestamp, vector.id);
			});
}


function showArrow(arrows) {
	return arrows.do(arrow => { console.log(arrow); return document.getElementById("direction").innerHTML = arrow; });
}

function bufferUntil(source, predicate) {
	return Rx.Observable.create((observer) => {
		let isFirst = true;
		let firstValue = null;
		let closings = new Rx.Subject();
		return source.do(v => {
				if (isFirst) {
					isFirst = false;
					firstValue = v;
				}
				else if (predicate(firstValue, v))
				{
					isFirst = false;
					firstValue = v;
					closings.onNext({ });
				}
			})
	 	    .buffer(() => closings)
	 	    .subscribe(observer);
	});
}

function groupArrows(arrows) {
	return bufferUntil(arrows, (a, b) => a.value !== b.value || b.timestamp - a.timestamp > 400)
			.select(buffer => {
				if ((buffer[buffer.length - 1].timestamp - buffer[0].timestamp) > 300) {
					return buffer[0].value;
				}
				return null;
			})
			.where(a => a != null);
}

// public static IObservable<IList<T>> Buffer<T>(this IObservable<T> source, Func<T, bool> closeBufferPredicate)
//         {
//             return Observable.Create<IList<T>>(
//                 observer =>
//                 {
//                      bool isFirst = true;
                    // T firstValue = default(T);
                    // var closings = new Subject<Unit>();

                    // return source.Do(value =>
                    //              {
                    //                  if (isFirst)
                    //                  {
                    //                      isFirst = false;
                    //                      firstValue = value;
                    //                  }   
                    //                  else if (closeBufferPredicate.Invoke(firstValue, value))
                    //                  {
                    //                      isFirst = false;
                    //                      firstValue = value;
                    //                      closings.OnNext(Unit.Default);
                    //                  }
                    //              })
                    //              .Buffer(() => closings)
                    //              .Subscribe(observer);
//                 });
//         }


function start() {
	const samplingTime = Math.round(1000.0 / FREQUENCY);

	document.getElementById("start").disabled = true;
	document.getElementById("init").disabled = true;
	document.getElementById("stop").disabled = false;

	let id = 0;
	let data = watchSensor(accelerometer, (sensor, observer, ev) => { observer.onNext({ x: ev.x, y: ev.y, z: ev.z, timestamp: new Date().getTime(), id: id++ }); }).share();
	
	let x = data.select(d => new Value(d.x, d.timestamp, d.id));
	let y = data.select(d => new Value(d.y, d.timestamp, d.id));
	let z = data.select(d => new Value(d.z, d.timestamp, d.id));


	const calibrationSamplesCount = Math.round(CALIBRATION_TIME / samplingTime);

	// x = x.skip(calibrationSamplesCount).combineLatest(calibrate(x.select(d => d.value), calibrationSamplesCount), (dt, offset) => new Value(dt.value - offset, dt.timestamp, dt.id));
	// y = y.skip(calibrationSamplesCount).combineLatest(calibrate(y.select(d => d.value), calibrationSamplesCount), (dt, offset) => new Value(dt.value - offset, dt.timestamp, dt.id));
	// z = z.skip(calibrationSamplesCount).combineLatest(calibrate(z.select(d => d.value), calibrationSamplesCount), (dt, offset) => new Value(dt.value - offset, dt.timestamp, dt.id));
	
	x = plot(x, "raw", 0, "X");
	y = plot(y, "raw", 1, "Y");
	z = plot(z, "raw", 2, "Z");

	x = plot(smoothMovingAverage(x, 5), "smooth_mov", 0, "X");
	y = plot(smoothMovingAverage(y, 5), "smooth_mov", 1, "Y");
	z = plot(smoothMovingAverage(z, 5), "smooth_mov", 2, "Z");

	// x = plot(smoothExponential(x), "smooth_exp", 0, "X");
	// y = plot(smoothExponential(y), "smooth_exp", 1, "Y");
	// z = plot(smoothExponential(z), "smooth_exp", 2, "Z");
	
	x = plot(clampOut(x, 0.07), "clamp", 0, "X");
	y = plot(clampOut(y, 0.07), "clamp", 1, "Y");
	z = plot(clampOut(z, 0.07), "clamp", 2, "Z");

	// let resetX = plot(reset(x, 0.3, 20).select(v => new Value(v.value ? 1.0 : 0.0, v.timestamp)), "reset", 0, "X");
	// let resetY = plot(reset(x, 0.3, 20).select(v => new Value(v.value ? 1.0 : 0.0, v.timestamp)), "reset", 0, "Y");
	// let resetZ = plot(reset(x, 0.3, 20).select(v => new Value(v.value ? 1.0 : 0.0, v.timestamp)), "reset", 0, "Z");

	//reset based on acceleration, not velocity!
	// x = plot(integration(x), "velocity", 0, "X");
	// y = plot(integration(y), "velocity", 1, "Y");
	// z = plot(integration(z), "velocity", 2, "Z");

	// x = plot(integration(x), "position", 0, "X");	
	// y = plot(integration(y), "position", 1, "Y");
	// z = plot(integration(z), "position", 2, "Z");

	x = plot(integrationWithReset(x, 0.02, 4), "velocity", 0, "X");
	y = plot(integrationWithReset(y, 0.02, 4), "velocity", 1, "Y");
	z = plot(integrationWithReset(z, 0.02, 4), "velocity", 2, "Z");

	// x = plot(integration(x), "position", 0, "X");	
	// y = plot(integration(y), "position", 1, "Y");
	// z = plot(integration(z), "position", 2, "Z");

	// x = plot(integrationWithReset(x, 0.4, 5), "position", 0, "X");	
	// y = plot(integrationWithReset(y, 0.4, 5), "position", 1, "Y");
	// z = plot(integrationWithReset(z, 0.4, 5), "position", 2, "Z");

	// x = x.do(d => console.log(d.id));

	// x = plot(direction(x, 0.1), "direction", 0, "X");
	// y = plot(direction(y, 0.1), "direction", 1, "Y");
	// z = plot(direction(z, 0.1), "direction", 2, "Z");

	// let dirs = showDirections(x, y, z);

	let dirs = showArrow(
		groupArrows(
			toArrow(
				plotVector(
					directions(
						directionChanges2(
							combine(x, y, z)
						)
					), 
					"direction"
				)
			)
		)
	);

	let sampleTime = data.scan((previous, current) => new Value(current.timestamp - previous.timestamp, current.timestamp, current.id), new Value(0, new Date().getTime(), 0))
	sampleTime = plot(sampleTime, "sample_time", 0, "sample_time");
	sampleTime = plot(smoothMovingAverage(sampleTime, FREQUENCY), "sample_time", 1, "average");

	subscription = Rx.Observable.merge(dirs, sampleTime /*, cubeIndexX, cubeIndexY, cubeIndexZ , resetX, resetY, resetZ*/).subscribe(_ => {}, (e) => console.log(e), () => {});
}


function stop() {
	if (subscription) {
		subscription.dispose();
		subscription = null;
	}

    Object.keys(charts).forEach(key => { charts[key].stop(); delete charts[key]; });

	while (chartsRootElement.firstChild) {
	  	chartsRootElement.removeChild(chartsRootElement.firstChild);
	}

	let labelContainer = document.getElementById("cubes");
	while (labelContainer.firstChild) {
		labelContainer.removeChild(labelContainer.firstChild);
	}

	document.getElementById("direction").innerHTML = "";

	document.getElementById("start").disabled = false;
	document.getElementById("init").disabled = false;
	document.getElementById("stop").disabled = true;
}


init(FREQUENCY);
document.getElementById("init" ).addEventListener("click", init);
document.getElementById("start").addEventListener("click", start);
document.getElementById("stop" ).addEventListener("click", stop );
