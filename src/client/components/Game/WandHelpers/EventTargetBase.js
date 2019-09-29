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

export default EventTargetBase;