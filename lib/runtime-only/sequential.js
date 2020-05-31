
module.exports = sequential

const noop = () => {}

function sequential (f) {
  this.f = f
  this.queue = Promise.resolve(null)
}

sequential.prototype.apply = function (self, args) {
  const p = this.queue.then(() => this.f.apply(self, args))
  this.queue = p.then(noop)
  return p
}
