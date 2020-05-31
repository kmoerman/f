
module.exports = lookup

function lookup (f, m, x) {
  if (m.has(x))
    return m.get(x);
  else {
    let y = f();
    m.set(x, y);
    return y;
  }
}

lookup.new = (c, m, x) => lookup(() => new c (), m, x)
