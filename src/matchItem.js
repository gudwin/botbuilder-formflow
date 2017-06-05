const matchItem = module.exports = function (item, type, callback) {
  return ( item.type == type ) && (callback.call(null));
}
