window._p5BySources = {}

function p5src(source, mode = "P2D") {
  // If p5 instance already exists but mode has changed, remove it to initialize again
  if (_p5BySources[source] && _p5BySources[source].mode !== mode) {
    _p5BySources[source].remove()
    _p5BySources[source] = null
  }

  // If p5 instance does not exist, initialize once
  if (!_p5BySources[source]) {
    const p5 = new P5({ mode })
    _p5BySources[source] = p5
    p5.hide()
    source.init({ src: p5.canvas })
  }

  const p5 = _p5BySources[source]
  const obj = src(source)

  // Extend glsl source with custom methods

  obj.setup = (callback) => {
    obj._setupError = false
    p5.setup = () => {
      console.debug("Called setup")
      try {
        callback(p5)
      } catch (err) {
        if (!obj._setupError) {
          obj._setupError = true
          console.error("P5 setup error:", err)
        }
      }
    }
    return obj
  }

  obj.draw = (callback) => {
    obj._firstCall = true
    obj._drawError = false
    p5.draw = () => {
      if (obj._firstCall) {
        p5.setup()
        obj._firstCall = false
      }

      try {
        callback(p5)
      } catch (err) {
        if (!obj._drawError) {
          obj._drawError = true
          console.error("P5 draw error:", err)
        }
      }
    }
    return obj
  }

  return obj
}

window.p5src = p5src