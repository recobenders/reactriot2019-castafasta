const Value = (function () {
  function Value(value, timestamp, id) {
    this.value = value;
    this.timestamp = timestamp;
    this.id = id;
  }

  return Value;
})();

export default Value;