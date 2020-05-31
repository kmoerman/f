const lookup = require('./lib/util/lookup.js')

module.exports = M

// generic M wrapper
function M (definition) {
  return function (...params) {
    const def = definition(...params)
    return function (...args) {
      return def.lookup(this, args).apply(this, args)
    }
  }
}

const runtime = constructor => (...args) => ({ lookup: lookup.bind(null, () => new constructor (...args), new WeakMap ()) })

Object.assign(M,
  { multi : M(require('./lib/definition-only/multimethod.js').create)

  , cache : M(runtime(require('./lib/runtime-only/cache.js')))
  , once  : M(runtime(require('./lib/runtime-only/once.js')))
  , seq   : M(runtime(require('./lib/runtime-only/sequential.js')))
  , bfr   : M(runtime(require('./lib/runtime-only/breadth-first.js')))

  , id    : x => x
  , noop  : () => {}
  , const : x => () => x
  })

M.global  = new Proxy (M, { get: (t,p) => typeof M[p] === 'function' ? (...params) => M[p](...params).bind(null) : M[p] })
