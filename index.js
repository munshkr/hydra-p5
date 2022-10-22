window._p5BySources = {}

function p5src(source) {
  if (!_p5BySources[source]) {
    const p5 = new P5()
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
    obj._drawError = false
    p5.draw = () => {
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