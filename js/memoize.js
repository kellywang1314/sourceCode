function memoize(func) {
    var memoize = function(key) {
      var cache = memoize.cache
      var address = '' + key
      if(Object.getOwnPropertyNames(cache).indexOf(address) === -1) {
        cache[address] = func.apply(this, arguments)
      }
      return cache[address]
    }
    memoize.cache = {}
    return memoize
}
  
  
  