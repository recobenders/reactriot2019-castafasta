/// <reference path="./node_modules/rx/ts/rx.all.d.ts" />


// https://stackoverflow.com/questions/8264518/using-accelerometer-gyroscope-and-compass-to-calculate-devices-movement-in-3d
// https://www.nxp.com/docs/en/application-note/AN3397.pdf
// https://stackoverflow.com/questions/42176603/getting-a-trajectory-from-accelerometer-and-gyroscope-imu

// https://codepen.io/vankusik/pen/MWgRvNN
function log(id, value) {
	document.getElementById(id).innerHTML = value;
}


const Constants = Object.freeze({
	DIRECTION_DETECTION: {
		SUPPORTED_FILTERS: {
			LOW_PASS: "lowPass",
			EXPONENTIAL: "exponential",
			THRESHOLD: "threshold",
			INTEGRATION: "integrate",
			CLAMP: "clamp",
			ZERO: "zero",
			TRANSFORM_EXP: "expTransform",
		},
		// pipeline for device orientation
		PIPELINE: [
			{
				NAME: "raw",
				FILTERS: [
					{
						TYPE: "zero",
						AXES: [ "y" ]
					}
				]
			},
			{
				NAME: "smooth",
				FILTERS: [
					{
						TYPE: "lowPass",
						WINDOW_SIZE: 10
					}
				]
			},
			{
				NAME: "clamped",
				FILTERS: [
					{
						TYPE: "clamp",
						LIMIT: 50
					}
				]
			}
		],
		DIRECTION: {
			DISTANCE_THRESHOLD_MIN: 8,
			GROUP_DURATION_MIN : 100,
			GROUP_DURATION_MAX : 400,
		}
			// // pipeline for device acceleration
			// PIPELINE: [
			// {
			// 	NAME: "smooth_raw",
			// 	FILTERS: [
			// 		{
			// 			TYPE: "lowPass",
			// 			WINDOW_SIZE: 5
			// 		},
			// 		{ 
			// 			TYPE: "threshold",
			// 			THRESHOLD_VALUE: 0.07 
			// 		}
			// 	]
			// },
			// {
			// 	NAME: "velocity",
			// 	FILTERS: [
			// 		{
			// 			TYPE: "integrate",
			// 			RESET: {
			// 				THRESHOLD_VALUE: 0.02,
			// 				SAMPLES_COUNT_LIMIT: 4
			// 			},
			// 		},
			// 		{ 
			// 			TYPE: "threshold",
			// 			THRESHOLD_VALUE: 0.02
			// 		},
			// 		{ 
			// 			TYPE: "lowPass",
			// 			THRESHOLD_VALUE: 15
			// 		}
			// 	]
			// }
			// ],
			// DIRECTION: {
			// 	DISTANCE_THRESHOLD_MIN: 0.2,
			// 	GROUP_DURATION_MIN : 100,
			// 	GROUP_DURATION_MAX : 400,
			// }
	}
});


const EventTargetBase = (function () {
	function EventTargetBase() {
		this.listeners = {};
	}

	const proto = EventTargetBase.prototype;
	proto.listeners = null;

	proto.addEventListener = function (type, callback) {
		console.log("listener");
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}
		this.listeners[type].push(callback);
	};

	proto.removeEventListener = function (type, callback) {
		if (!(type in this.listeners)) {
			return;
		}
		var stack = this.listeners[type];
		for (var i = 0, l = stack.length; i < l; i++) {
			if (stack[i] === callback) {
				stack.splice(i, 1);
				return;
			}
		}
	};

	proto.dispatchEvent = function (event) {
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


const Helpers = (function () {
	function Helpers() { }

	Helpers.extend = function (thisClass, extendedClass) {
		thisClass.prototype = Object.create(extendedClass.prototype);
		thisClass.prototype.constructor = thisClass;

		return thisClass.prototype;
	};

	return Helpers;
})();


const FakeAccelerometer = (function () {
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

	proto.start = function () {
		console.log("start");
		this._interval = setInterval(() => {
			let ev = new Event("reading");
			next(ev);
			this.dispatchEvent(ev);
		}, Math.round(1000.0 / this._frequency));
	}

	proto.stop = function () {
		console.log("stop");
		if (this._interval) {
			clearInterval(this._interval);
			this._interval = null;
		}
	}

	return FakeAccelerometer;
})();


const EventBasedAccelerometer = (function () {
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

	proto.start = function () {
		console.log("start");

		let listener = createListener(this);

		this._subscription = {
			dispose: () => window.removeEventListener("devicemotion", listener)
		};

		window.addEventListener("devicemotion", listener);
	}

	proto.stop = function () {
		console.log("stop");
		let subscription = this._subscription;
		this._subscription = null;

		if (subscription) {
			subscription.dispose();
		}
	}

	return EventBasedAccelerometer;
})();


const SensorAPIAccelerometer = (function () {
	function SensorAPIAccelerometer(frequency, includeGravity) {
		let sensorConstructor = includeGravity ? Accelerometer : LinearAccelerationSensor;

		this._sensor = new sensorConstructor({ referenceFrame: "device", frequency: frequency })
		this._frequency = frequency;
		this._subscription = null;

		EventTargetBase.prototype.constructor.call(this);
	}

	const proto = Helpers.extend(SensorAPIAccelerometer, EventTargetBase);

	proto.start = function () {
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

	proto.stop = function () {
		console.log("stop");
		if (this._subscription) {
			this._subscription.dispose();
			this._subscription = null;
		}
	}

	return SensorAPIAccelerometer;
})();



const EventOrientationSensor = (function () {
	function EventOrientationSensor() {
		if (!window.DeviceOrientationEvent) {
			let error = new Error("not supported");
			error.name = "ReferenceError";
			throw error;
		}
		this._subscription = null;

		EventTargetBase.prototype.constructor.call(this);
	}

	const proto = Helpers.extend(EventOrientationSensor, EventTargetBase);

	function createListener(target) {
		return (event) => {
			let ev = new Event("reading");
			ev.x = event.gamma;
			ev.y = event.alpha;
			ev.z = event.beta;
			target.dispatchEvent(ev);
		};
	}

	proto.start = function () {
		console.log("start");

		let listener = createListener(this);

		this._subscription = {
			dispose: () => window.removeEventListener("deviceorientation", listener)
		};

		window.addEventListener("deviceorientation", listener);
	}

	proto.stop = function () {
		console.log("stop");
		let subscription = this._subscription;
		this._subscription = null;

		if (subscription) {
			subscription.dispose();
		}
	}

	return EventOrientationSensor;
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
		case "fake":
			selectedSensor = FakeAccelerometer;
			break;
		case "api":
			selectedSensor = SensorAPIAccelerometer;
			break;
		case "orientation":
			selectedSensor = EventOrientationSensor;
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

	Array.from(document.getElementsByClassName("button-start")).forEach(b => b.disabled = false);

	return accelerometer;
}


function watchSensor(sensor, listener) {
	if (sensor) {
		return Rx.Observable.create((observer) => {
			let eventListener = (ev) => listener(sensor, observer, ev);

			sensor.start();
			sensor.addEventListener("reading", eventListener);

			return Rx.Disposable.create(() => {
				sensor.stop();
				sensor.removeEventListener("reading", eventListener);
			});
		});
	}
}


/// <begin>
/// for debug only:
const chartsRootElement = document.getElementById("charts");
const charts = {};

const colors = [[0, 255, 0], [255, 0, 0], [0, 0, 255]];

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
	let chart = (target && charts[target]) || new SmoothieChart({ responsive: true });

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


function showDirections(directions, elementId) {
	const map = {
		  "LEFT": "&lArr;"
		, "UP": "&uArr;"
		, "RIGHT": "&rArr;"
		, "DOWN": "&dArr;"
	};
  
	return directions.do(d => { 
		console.log(`${d.value.x} ${d.value.y} ${d.value.weight}`); 
		document.getElementById(elementId).innerHTML = `${(d.value.code && map[d.value.code]) || ""} ${parseFloat(d.value.weight).toFixed(2)}`; 
	});
}
/// <end> 


var subscription = null;

// Higher the alpha, more significant the current value is
function exponentialSmoothing(previous, current, alpha) {
	return previous * (1 - alpha) + current * alpha;
}


function exponentialSmoothingFilter(source, alpha) {
	alpha = alpha || 0.3;
	return source.scan((previous, current) => new Value(exponentialSmoothing(previous.value, current.value, alpha), current.timestamp, current.id));
}


function mapArrayOverlapping(arr, callback) {
	result = [];
	for (let i = 1; i < arr.length; i++) {
		result.push(callback(arr[i - 1], arr[i]));
	}

	return result;
}

function lowPassSmoothingFilter(source, windowSize, getValue, getWindowSize) {
	windowSize = windowSize || 5;
	getValue = getValue || (item => (item && item.value) || 0);
	getWindowSize = getWindowSize || (arr => (arr && arr.length) || 0);

	return source.bufferWithCount(windowSize, 1)
		.bufferWithCount(2, 1)
		.scan((previous, buffers) => {
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
		}, null)
		.select(window => new Value(window.value / window.size, window.pivot.timestamp, window.pivot.id));
}


function integrate(fa, fb, a, b) {
	return ((fa + fb) / 2) * (b - a);
}


// cumulative
function integrationWithReset(x, resetThreshold, resetCountLimit) {
	resetThreshold = resetThreshold || 0.05;
	resetCountLimit = resetCountLimit || 25;

	let count = 0;

	return x.bufferWithCount(2, 1)
		.where(buffer => buffer.length == 2)
		.select(buffer => { return { previous: buffer[0], current: buffer[buffer.length - 1] }; })
		.scan((result, samples) => {
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
		null);
}


// cumulative
function integration(x) {
	return x.bufferWithCount(2, 1)
		.where(buffer => buffer.length == 2)
		.select(buffer => ({ previous: buffer[0], current: buffer[buffer.length - 1] }))
		.scan((result, samples) => {
			let previousResult = result ? result.value : 0;

			return new Value(previousResult + integrate(samples.previous.value, samples.current.value, samples.previous.timestamp, samples.current.timestamp) / 1000.0, samples.current.timestamp, samples.current.id);
		},
		null);
}


function thresholdFilter(source, threshold) {
	threshold = threshold || 0;
	return source.select(v => {
		return new Value(
			(v.value >= -threshold && v.value <= threshold) ? 0 : v.value,
			v.timestamp,
			v.id
		);
	});
}


function clampFilter(source, limit) {
	limit = limit || Number.MAX_VALUE;
	return source.select(v => {
		return new Value(
			(v.value > limit) ? limit : (v.value < -limit ? -limit : v.value),
			v.timestamp,
			v.id
		);
	});
}


function zeroFilter(source, channel, channels) {
	if (channels.includes(channel || [])) {
		return source.select(v => new Value(0.0, v.timestamp, v.id));	
	}
	else {
		return source;
	}
}


function exponentialTransformFilter(source, power, channel, channels) {
	if (!channels || channels.length == 0 || (channel && channels.includes(channel))) {
		return source.select(v => new Value(Math.pow(v.value, power), v.timestamp, v.id));
	}
	else {
		return source;
	}
}


const FREQUENCY = 60;


const Value = (function () {
	function Value(value, timestamp, id) {
		this.value = value;
		this.timestamp = timestamp;
		this.id = id;
	}

	return Value;
})();


function toVector2(x, y) {
	return Rx.Observable.zip(x, y, (x, y) =>
		new Value(
			{
				x: x.value,
				y: y.value,
			},
			x.timestamp,
			x.id
		)
	).share();
}

function toVector3(x, y, z) {
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

function reduceVector3to2(vectors, component1, component2) { 
	return vectors.select(v => 
		new Value(
			{
				x: v.value[component1],
				y: v.value[component2]
			},
			v.timestamp,
			v.id
		)
	);
}


function getRelativeDirections(changes) {
	const zero = { x: 0.0, y: 0.0, z: 0.0 };
	//minDiff = minDiff || 0.5;

	return changes.select(change => {
			let vector = change.value;
			let max = Math.max(Math.abs(vector.x), Math.abs(vector.y), Math.abs(vector.z));
			
			let directionVector = zero;
			if (max > 0) {
				directionVector = { 
					x: vector.x / max,
					y: vector.y / max,
					z: vector.z / max
				};
			}

			return new Value(directionVector, change.timestamp, change.id);
		});
}


function evaluateDirections(directions, codesTable) {
	const getDirectionCode = function(value, codes) {
		if (value < 0) 
			return codes[0];
		else if (value > 0)
			return codes[2];
		return codes[1];
	}

	return directions.select(direction => {
		let directionX = getDirectionCode(direction.x, codesTable.X);
		let directionY = getDirectionCode(direction.y, codesTable.Y);
		let directionZ = getDirectionCode(direction.z, codesTable.Z);
		
		let code = `${directionX}${directionY}${directionZ}`;

		return new Value(
			Object.assign({ code: code }, direction),
			change.timestamp,
			change.id
		);
	});
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


function getMaxDirection(x, threshold) {
	return x.select(v => {
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


function groupDirections(directions, minThreshold, maxThreshold) {
	return bufferUntil(directions, (a, b) => (a.value.x !== b.value.x  || a.value.y !== b.value.y) || b.timestamp - a.timestamp > maxThreshold)
		.select(buffer => {
			let duration = Math.abs(buffer[buffer.length - 1].timestamp - buffer[0].timestamp);
			if (duration > minThreshold) {
				let values = mapArrayOverlapping(buffer, (previous, current) => current.value.weight * (current.timestamp - previous.timestamp));
				let avgWeight = values.reduce((sum, value) => sum + value, 0) / duration;
				return new Value({ x: buffer[0].value.x, y: buffer[0].value.y, weight: avgWeight }, buffer[buffer.length - 1].timestamp, buffer[buffer.length - 1].id);
			}
			return null;
		})
		.where(a => a != null);
}


function codeDirections(directions) {
	const codeDirection = function(d) {
		if (d.x == 0) {
			if (d.y == 1)
				return "UP";
			else if (d.y == -1)
				return "DOWN";
		}
		else if (d.y == 0) {
			if (d.x == 1)
				return "RIGHT";
			else if (d.x == -1)
				return "LEFT";
		}

		return "";
	};
	return directions.select(d => new Value(Object.assign({ code: codeDirection(d.value) }, d.value), d.timestamp, d.id));
}


function applyFilters(series, filters) {
	Object.keys(series).forEach((key) => {
		filters.forEach(filter => {
			switch (filter.TYPE) {
				case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.LOW_PASS:
					series[key] = lowPassSmoothingFilter(series[key], filter.WINDOW_SIZE, v => v.value, w => w.length);
					break;
				case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.EXPONENTIAL:
					series[key] = exponentialSmoothingFilter(series[key], fiter.ALPHA);
					break;
				case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.THRESHOLD:
					series[key] = thresholdFilter(series[key], filter.THRESHOLD_VALUE);
					break;
				case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.CLAMP:
					series[key] = clampFilter(series[key], filter.LIMIT);
					break;
				case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.ZERO:
					series[key] = zeroFilter(series[key], key, filter.AXES);
					break;
				case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.EXP_TRANSFORM:
					series[key] = exponentialTransformFilter(series[key], filter.POWER, key, filter.AXES);
					break;
				case Constants.DIRECTION_DETECTION.SUPPORTED_FILTERS.INTEGRATION:
					if (filter.RESET) {
						series[key] = integrationWithReset(series[key], filter.RESET.THRESHOLD_VALUE, filter.RESET.SAMPLES_COUNT_LIMIT);
					}
					else {
						series[key] = integration(series[key]);
					}
					break;
			}

			console.log(filter.TYPE);
		});
	});

	return series;
}


function start() {
	Array.from(document.getElementsByClassName("button-start")).forEach(b => b.disabled = true);
	document.getElementById("init").disabled = true;
	document.getElementById("stop").disabled = false;

	let data = watchSensor(accelerometer, (sensor, observer, ev) => { observer.onNext({ x: ev.x, y: ev.y, z: ev.z, timestamp: new Date().getTime() }); }).share();

	let x = data.select(d => new Value(d.x, d.timestamp, d.id));
	let y = data.select(d => new Value(d.y, d.timestamp, d.id));
	let z = data.select(d => new Value(d.z, d.timestamp, d.id));

	if (Constants.DIRECTION_DETECTION.PIPELINE) {
		Constants.DIRECTION_DETECTION.PIPELINE.forEach(group => {
			let series = applyFilters({ x: x, y: y, z: z }, group.FILTERS);
			x = series.x;
			y = series.y;
			z = series.z;
		});
	}

	let velocity = toVector3(x, y, z);
	let directions = getMaxDirection(velocity, Constants.DIRECTION_DETECTION.DIRECTION.DISTANCE_THRESHOLD_MIN);
	directions = groupDirections(directions, Constants.DIRECTION_DETECTION.DIRECTION.GROUP_DURATION_MIN, Constants.DIRECTION_DETECTION.DIRECTION.GROUP_DURATION_MAX);
	
	// output
	directions = codeDirections(directions);
	directions = showDirections(directions, "direction");
	
	subscription = directions.subscribe(_ => { }, (e) => console.log(e), () => { });
}


function debug() {
	Array.from(document.getElementsByClassName("button-start")).forEach(b => b.disabled = true);
	document.getElementById("init").disabled = true;
	document.getElementById("stop").disabled = false;
	let id = 0;

	let data = watchSensor(accelerometer, (sensor, observer, ev) => { observer.onNext({ x: ev.x, y: ev.y, z: ev.z, timestamp: new Date().getTime(), id: id++ }); }).share();

	let x = data.select(d => new Value(d.x, d.timestamp, d.id));
	let y = data.select(d => new Value(d.y, d.timestamp, d.id));
	let z = data.select(d => new Value(d.z, d.timestamp, d.id));

	if (Constants.DIRECTION_DETECTION.PIPELINE) {
		Constants.DIRECTION_DETECTION.PIPELINE.forEach(group => {
			let series = applyFilters({ x: x, y: y, z: z }, group.FILTERS);
			x = series.x;
			y = series.y;
			z = series.z;

			x = plot(x, group.NAME, 0, "X");
			y = plot(y, group.NAME, 1, "Y");
			z = plot(z, group.NAME, 2, "Z");
		});
	}

	let velocity = toVector3(x, y, z);
	let directions = getMaxDirection(velocity, Constants.DIRECTION_DETECTION.DIRECTION.DISTANCE_THRESHOLD_MIN);
	directions = groupDirections(directions, Constants.DIRECTION_DETECTION.DIRECTION.GROUP_DURATION_MIN, Constants.DIRECTION_DETECTION.DIRECTION.GROUP_DURATION_MAX);
	
	// debug
	directions = codeDirections(directions);
	directions = showDirections(directions, "direction");

	// debug
	const freq = 60;
	let sampleTime = data.scan((previous, current) => new Value(current.timestamp - previous.timestamp, current.timestamp, current.id), new Value(0, new Date().getTime(), 0))
	sampleTime = plot(sampleTime, "sample_time", 0, "sample_time");
	sampleTime = plot(lowPassSmoothingFilter(sampleTime, FREQUENCY), "sample_time", 1, "average");


	subscription = Rx.Observable.merge(directions, sampleTime).subscribe(_ => { }, (e) => console.log(e), () => { });
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

	Array.from(document.getElementsByClassName("button-start")).forEach(b => b.disabled = false);
	document.getElementById("init").disabled = false;
	document.getElementById("stop").disabled = true;
}


init(FREQUENCY);
document.getElementById("init").addEventListener("click", init);
document.getElementById("start").addEventListener("click", start);
document.getElementById("start_debug").addEventListener("click", debug);
document.getElementById("stop").addEventListener("click", stop);
