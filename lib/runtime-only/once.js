
module.exports = once

function once (f) {
  this.f = f
  this.done = false
}

once.prototype.apply = function (self, args) {
  if (this.done) return null;
  else {
    this.done = true;
    return this.f.apply(self, args);
  }
}
