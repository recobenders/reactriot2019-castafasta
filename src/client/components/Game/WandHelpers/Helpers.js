const Helpers = (function () {
  function Helpers() { }

  Helpers.extend = function (thisClass, extendedClass) {
    thisClass.prototype = Object.create(extendedClass.prototype);
    thisClass.prototype.constructor = thisClass;

    return thisClass.prototype;
  };

  return Helpers;
})();

export default Helpers;