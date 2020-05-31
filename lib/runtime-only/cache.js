
const lookup   = require('../util/lookup.js')
const MixedMap = require('../util/mixed-map.js')

module.exports = cache

class MarkedMixedMap extends MixedMap {}
const new_mmm = () => new MarkedMixedMap ()

const VALUE = Symbol('value')

function cache (f, ...limits) {
  this.f = f
  this.limits = limits.length === 0 ? null : limits
  this.cache = new MarkedMixedMap ()
}

cache.prototype.apply = function (self, args) {
  const apply = () => this.f.apply(self, args)

  const N = args.length
  let i=0,n=N
  if (this.limits !== null) {
    const [a,b=N] = this.limits
    i = a < 0 ? Math.max(N+a, 0) : Math.min(a, N)
    n = b < 0 ? Math.max(N+b, 0) : Math.min(b, N)
  }
  const n_ = n-1
  let m0 = null, m1 = this.cache
  for (; i<n; ++i) {
    if (!(m1 instanceof MarkedMixedMap)) {
      m1 = (new MarkedMixedMap ()).set(VALUE, m1)
      m0.set(args[i-1], m1)
    }

    m0 = m1
    m1 = lookup(i === n_ ? apply : new_mmm, m1, args[i])
  }

  return (m1 instanceof MarkedMixedMap) ? lookup(apply, m1, VALUE) : m1;
}

/*
//equivalent, but the leafs of the cache-tree will consist of mostly 1-key maps {VALUE => result}
cache.prototype.apply = function (f, self, args) {
  const map = args.slice(...(this.limits||[])).reduce(lookup.new.bind(null, MixedMap), this.cache)
  return lookup(() => this.definition.apply(self, args), map, VALUE);
}
*/
