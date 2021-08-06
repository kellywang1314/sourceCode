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


let memoize = function(fn){
    let cache = {};
    return function(...args){
        let key = JSON.stringify(args);
        if(!cache.hasOwnProperty(key)){
            cache[key] = fn.apply(this,args);
        }
        return cache[key];
    };
}

  
  
  