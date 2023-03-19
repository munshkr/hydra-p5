window._p5BySources = {};
window._idCounter = 0;

function getProperties(obj) {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((p) => properties.add(p));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].map((k) => [k, typeof obj[k] === "function"]);
}

function wrapFunctionWithP5Global(func, p5, source) {
  const defs = getProperties(p5)
    .filter(([k, _]) => !k.startsWith("_"))
    .map(([k, isFunc]) =>
      isFunc
        ? `const ${k} = this['${k}'].bind(this)`
        : `const ${k} = this['${k}']`
    )
    .join(";\n");
  const body = `"use strict";const _p5 = window._p5BySources[${source._p5id}];(function() { ${defs};(${func})() }).bind(_p5)()`;
  return Function(body);
}

function p5src(source, mode = "P2D") {
  // If p5 instance already exists but mode has changed, remove it to initialize again
  if (_p5BySources[source._p5id] && _p5BySources[source._p5id].mode !== mode) {
    _p5BySources[source._p5id].remove();
    _p5BySources[source._p5id] = null;
  }

  // If p5 instance does not exist, initialize once
  if (!_p5BySources[source._p5id]) {
    const p5 = new P5({ mode });
    source._p5id = window._idCounter++;
    _p5BySources[source._p5id] = p5;
    p5.hide();
    source.init({ src: p5.canvas });
  }

  const p5 = _p5BySources[source._p5id];
  const obj = src(source);

  // Extend glsl source with custom methods

  obj.setup = (callback) => {
    obj._setupError = false;

    p5.setup = () => {
      try {
        callback(p5);
      } catch (err) {
        if (!obj._setupError) {
          obj._setupError = true;
          console.error("P5 setup error:", err);
        }
      }
    };
    return obj;
  };

  obj.draw = (callback) => {
    obj._firstCall = true;
    obj._drawError = false;
    p5.draw = () => {
      if (obj._firstCall) {
        p5.setup();
        obj._firstCall = false;
      }

      try {
        callback(p5);
      } catch (err) {
        if (!obj._drawError) {
          obj._drawError = true;
          console.error("P5 draw error:", err);
        }
      }
    };
    return obj;
  };

  // Experimental: This function differs from `setup` in that the callback
  // function is able to use all? p5 methods as globals
  obj.setupP = (cb) => {
    if (typeof cb !== "function") throw "argument is not a function";

    obj._setupError = false;
    const wrappedCallback = wrapFunctionWithP5Global(cb, p5, source);

    p5.setup = () => {
      try {
        wrappedCallback();
      } catch (err) {
        if (!obj._setupError) {
          obj._setupError = true;
          console.error("P5 setup error:", err);
        }
      }
    };

    return obj;
  };

  // Experimental: This function differs from `draw` in that the callback
  // function is able to use all? p5 methods as globals
  obj.drawP = (cb) => {
    if (typeof cb !== "function") throw "argument is not a function";

    obj._firstCall = true;
    obj._drawError = false;
    const wrappedCallback = wrapFunctionWithP5Global(cb, p5, source);

    p5.draw = () => {
      if (obj._firstCall) {
        p5.setup();
        obj._firstCall = false;
      }

      try {
        wrappedCallback();
      } catch (err) {
        if (!obj._drawError) {
          obj._drawError = true;
          console.error("P5 draw error:", err);
        }
      }
    };

    return obj;
  };

  return obj;
}

window.p5src = p5src;
