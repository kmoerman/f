module.exports = mm

const primitive = x => (typeof x !== 'object' || x === null) && (typeof x !== 'function')

function mm (...init) {
  this.weak   = new WeakMap ()
  this.strong = new Map ()

  for (const [k,v] of init) this.set(k, v)
}

mm.prototype.select = function (x) {
  return (primitive(x) ? this.strong : this.weak)
}

mm.prototype.has = function (x) {
  return this.select(x).has(x)
}

mm.prototype.get = function (x) {
  return this.select(x).get(x)
}

mm.prototype.set = function (x, y) {
  this.select(x).set(x, y)
  return this
}

mm.prototype.delete = function (x) {
  this.select(x).delete(x)
  return this
}
