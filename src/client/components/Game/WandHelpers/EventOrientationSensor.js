import EventTargetBase from './EventTargetBase';
import Helpers from './Helpers';

const EventOrientationSensor = (function () {
  function EventOrientationSensor() {
    // TODO: re-enable support check
    // if (!window.DeviceOrientationEvent) {
    //   let error = new Error("not supported");
    //   error.name = "ReferenceError";
    //   throw error;
    // }
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
  };

  proto.stop = function () {
    console.log("stop");
    let subscription = this._subscription;
    this._subscription = null;

    if (subscription) {
      subscription.dispose();
    }
  };

  return EventOrientationSensor;
})();

export default EventOrientationSensor;