const Q = require('../util/queue.js')

module.exports = bfr

function bfr (f) {
  this.f = f
  this.Q = new Q ()
  this.running = false
}

bfr.prototype.apply = function (self, args) {
  this.Q.enqueue([self, args])
  if (!this.running)
    this.execute()
}

bfr.prototype.execute = function () {
  this.running = true
  this.Q.unwind(([self, args]) => this.f.apply(self, args))
  this.running = false
}
