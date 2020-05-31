
function methodlist (x) {
  this.object = x
  this.fs = []
}

methodlist.prototype.define = function (f) {
  this.fs.push(f)
}

methodlist.prototype.lookup = function () {
  const p = Object.getPrototypeOf(this.object)
  return [p === null ? ERROR : p, this.fs]
}

const ERROR = Object.assign(Object.create(methodlist.prototype),
  { register (s) {
      this[s] = this
    }

  , lookup () {
      return [this, [this.fail]]
    }

  , fail: () =>
    { throw new TypeError ('No matching multimethod resolution') }

  , multiple : matches =>
    { throw new TypeError ('Non-unique multimethod resolution') }
  })


function multimethod () {
  this.symbols = []
}

multimethod.prototype.symbol = function (i) {
  let s = this.symbols[i]
  if (!s) {
    s = this.symbols[i] = Symbol(i)
    ERROR.register(s)
  }
  return s
}

multimethod.prototype.lookup = function (self, args) {
  const T = (1 << xs.length) - 1
  const partial = (new Map ()).set(ERROR.fail, T)
  const matches = new Set ()

  const xs_ = xs.slice()
  while (matches.size === 0)
    xs_.forEach((x,i) => {
      const s = this.symbols[i]
      const [x_, fs] = (x[s] || ERROR).lookup()
      fs.forEach(f => {
        const c = (partial.get(f) || 0) | (1<<i)
        partial.set(f, c)
        if (c === T)
          matches.add(f)
      })
      xs_[i] = x_
    })

  if (matches.size === 1) {
    const [match] = matches
    return match
  }
  else
    return ERROR.multiple(matches)
}

multimethod.prototype.define = function (...ds) {
  (typeof ds[ds.length-1] === 'function' ? [ds] : ds)
    .forEach(xsf => {
      const xs = xsf.slice(0,-1)
      const f  = xsf[xsf.length - 1]
      xs.forEach((x,i) => {
        let Fi = this.symbol(i)
        let m = x[Fi]
        if (!m || m.object !== x)
          Object.defineProperty(x, Fi, {value: m = new methodlist (x)})
        m.define(f)
      })
    })
}

multimethod.create = function (...ds) {
  const m = new multimethod ();
  return m.define(...ds)
}

module.exports = multimethod;
