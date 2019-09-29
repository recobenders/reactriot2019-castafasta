/// <reference path="./node_modules/rx/ts/rx.all.d.ts" />


// https://stackoverflow.com/questions/8264518/using-accelerometer-gyroscope-and-compass-to-calculate-devices-movement-in-3d
// https://www.nxp.com/docs/en/application-note/AN3397.pdf
// https://stackoverflow.com/questions/42176603/getting-a-trajectory-from-accelerometer-and-gyroscope-imu

// https://codepen.io/vankusik/pen/MWgRvNN


// observeEvents(config) -> start() with pipeline

const Constants = Object.freeze({
	DIRECTION_DETECTION: {
		SUPPORTED_FILTERS: {
			LOW_PASS: "lowPass",
			EXPONENTIAL: "exponential",
			THRESHOLD: "threshold",
			INTEGRATION: "integrate",
			CLAMP: "clamp",
			ZERO: "zero"
		},
		SELECTED_MODE: "orientation",
		MODES: [
			{
				MODE: "orientation",
				PIPELINE: [
					{
						NAME: "raw",
						FILTERS: [
							{
								TYPE: "zero",	// TODO linear transform
								AXES: [ "y" ]	// TODO transform matrix instead
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
			},
			{
				MODE: "motion",
				INCLUDE_GRAVITY: false,
				PIPELINE: [
					{
						NAME: "smooth_raw",
						FILTERS: [
							{
								TYPE: "lowPass",
								WINDOW_SIZE: 5
							},
							{ 
								TYPE: "threshold",
								THRESHOLD_VALUE: 0.07 
							}
						]
					},
					{
						NAME: "velocity",
						FILTERS: [
							{
								TYPE: "integrate",
								RESET: {
									THRESHOLD_VALUE: 0.02,
									SAMPLES_COUNT_LIMIT: 4
								},
							},
							{ 
								TYPE: "threshold",
								THRESHOLD_VALUE: 0.02
							},
							{ 
								TYPE: "lowPass",
								THRESHOLD_VALUE: 15
							}
						]
					}
				],
				DIRECTION: {
					DISTANCE_THRESHOLD_MIN: 0.2,
					GROUP_DURATION_MIN : 100,
					GROUP_DURATION_MAX : 400,
				}	
			}
		]
	},
	SPELL_DIRECTIONS: [
		{ value: 0, x: 0, y: 1 }, // UP
		{ value: 1, x: 0, y: -1 }, // DOWN
		{ value: 2, x: 1, y: 0 }, // RIGHT
		{ value: 3, x: -1, y: 0 } // LEFT
	  ]	
});


function observeDeviceOrientationEvents() {
	return Rx.Observable.fromEvent(window, "deviceorientation")
			 			.select(event => ({ x: event.gamma, y: event.alpha, z: event.beta }));
}


function observeDeviceMotionEvents(config) {
	const type = config.INCLUDE_GRAVITY ? "accelerationIncludingGravity" : "acceleration";

	return Rx.Observable.fromEvent(window, "devicemotion")
						.select(event => ({ x: event[type].x, y: event[type].y, z: event[type].z }));
}


function observeFakeMotionEvents(config) {
	const next = function () {
		return { 
			x: (Math.random() - 0.5) * 10,
			y: (Math.random() - 0.5) * 10,
			z: (Math.random() - 0.5) * 10
		};
	}

	const frequency = config.FREQUENCY || 60;

	return Rx.Observable.create(observer => {
		let interval = setInterval(() => {
				observer.onNext(next());
			}, Math.round(1000.0 / frequency));

		return Rx.Disposable.create(() => {
			clearInterval(interval);
			observer.onCompleted();
		});
	});
}


function observeEvents(config, fake) {
	const selectedMode = config.MODE;

	let events = Rx.Observable.empty();

	if (fake) {
		events = observeFakeMotionEvents(config);
	}
	else if (selectedMode === "orientation") {
		events = observeDeviceOrientationEvents();
	}
	else if (selectedMode === "motion") {
		events = observeDeviceMotionEvents(config);
	}

	// TODO Unsupported mode

	return events;
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


function showDirection(d, elementId) {
	const map = [
		"&uArr;"	// 0: UP
	,	"&dArr;"	// 1: DOWN
	, 	"&rArr;"	// 2: RIGHT
	, 	"&lArr;" 	// 3: LEFT
	];				// -1: NONE

	console.log(`${d.value.x} ${d.value.y} ${d.value.weight} ${d.value.code}`); 
	document.getElementById(elementId).innerHTML = `${(d.value.code >= 0 && map[d.value.code]) || ""} ${parseFloat(d.value.weight).toFixed(2)}`; 
}
/// <end> 


var subscription = null;

const Value = (function () {
	function Value(value, timestamp, id) {
		this.value = value;
		this.timestamp = timestamp;
		this.id = id;
	}

	return Value;
})();


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


function convertToSpellDirection(directions) {
	const findSpellDirectionIndex = function(d) {
		let spell = Constants.SPELL_DIRECTIONS.find(direction => direction.x == d.x && direction.y == d.y);
		return (spell) ? spell.value : -1;
	};
	return directions.select(d => new Value(Object.assign({ code: findSpellDirectionIndex(d.value) }, d.value), d.timestamp, d.id));
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


function start(debug) {
	Array.from(document.getElementsByClassName("button-start")).forEach(b => b.disabled = true);
	document.getElementById("stop").disabled = false;

	let fake = document.getElementById("fake-switch").checked;
	
	let debugPlotDataCallback = null;
	if (debug) {
		debugPlotDataCallback = function(groupName, series) {
			series.x = plot(series.x, groupName, 0, "X");
			series.y = plot(series.y, groupName, 1, "Y");
			series.z = plot(series.z, groupName, 2, "Z");
			
			return series;
		} 
	}

	subscription = observeMovementDirections(debugPlotDataCallback, fake)
						.do(d => showDirection(d, "direction"))
						.subscribe(direction => { }, (e) => console.log(e), () => { });
}


function observeMovementDirections(onFilterGroupApplied, fake) {
	const selectedMode = Constants.DIRECTION_DETECTION.SELECTED_MODE; 
	const config = Constants.DIRECTION_DETECTION.MODES.find(config => config.MODE === selectedMode);

	let data = observeEvents(config, fake)
				.select(ev => Object.assign({ timestamp: new Date().getTime() }, ev))
				.share();

	let x = data.select(d => new Value(d.x, d.timestamp, d.id));
	let y = data.select(d => new Value(d.y, d.timestamp, d.id));
	let z = data.select(d => new Value(d.z, d.timestamp, d.id));
	
	if (config.PIPELINE) {
		config.PIPELINE.forEach(group => {
			let series = applyFilters({ x: x, y: y, z: z }, group.FILTERS);
			
			if (onFilterGroupApplied) {
				series = onFilterGroupApplied(group.NAME, series);
			}
			x = series.x;
			y = series.y;
			z = series.z;
		});
	}

	let velocity = toVector3(x, y, z);
	let directions = getMaxDirection(velocity, config.DIRECTION.DISTANCE_THRESHOLD_MIN);
	directions = groupDirections(directions, config.DIRECTION.GROUP_DURATION_MIN, config.DIRECTION.GROUP_DURATION_MAX);
	
	// output
	directions = convertToSpellDirection(directions);

	return directions;
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

	document.getElementById("direction").innerHTML = "";

	Array.from(document.getElementsByClassName("button-start")).forEach(b => b.disabled = false);
	document.getElementById("stop").disabled = true;
}


document.getElementById("start").addEventListener("click", () => start(false));
document.getElementById("start_debug").addEventListener("click", () => start(true));
document.getElementById("stop").addEventListener("click", stop);
