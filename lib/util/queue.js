const DEFAULT_BLOCK_SIZE = 63

module.exports = queue

function queue (bsize=DEFAULT_BLOCK_SIZE) {
  this.bsize = bsize+1
  this.length = 0
  this.front = Array(this.bsize)
  this.back = this.front
  this.frontindex = 0
  this.backindex = 0
}

queue.prototype.unwind = function (f) {
  let i = 0;

  while (this.length > 0)
    f(this.dequeue(), i++, this)

  return this
}

queue.prototype.peek = function () {
  return this.front[this.frontindex]
}

queue.prototype.enqueue = function (x) {
  ++this.length
  const i = this.backindex
  const n = this.back.length

  if (i === n-1) {
    this.back = this.back[i] = Array(this.bsize)
    this.back[0] = x
    this.backindex = 1
  }
  else {
    this.back[i] = x
    ++this.backindex
  }

  return this
}

queue.prototype.dequeue = function () {
  if (this.length === 0) {
    return undefined
  }

  --this.length
  const i = this.frontindex
  const n = this.front.length

  let x = this.front[i]
  delete this.front[i]
  this.frontindex++

  if (this.length === 0) {
    this.frontindex = 0
    this.backindex = 0
  }
  else if (this.frontindex === n-1) {
    this.front = this.front[n-1]
    this.frontindex = 0
  }

  return x
}

// synonyms
queue.prototype.push  = queue.prototype.enqueue
queue.prototype.shift = queue.prototype.dequeue
