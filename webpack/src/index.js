let memoize = function (fn) {
    let cache = {};
    return function (...args) {
        let key = JSON.stringify(args);
        if (!cache.hasOwnProperty(key)) {
            cache[key] = fn.apply(this, args);
        }
        return cache[key];
    };
}



let memoizeNew = function (fn) {
    const cache = {};
    return function (...args) {
        const params = JSON.stringify(args)
        if (!cache.hasOwnProperty(params)) {
            cache[params] = fn.apply(this, args);
        }
        return cache[params]
    }

}

function sum(a, b) {
    return a + b
}

const memoSum = memoize(sum)
console.log('memoSum(1,2)=', memoSum(1, 2), memoSum(1, 2))


const keys = Object.keys({ "a": 1 })
keys[0]
console.log(Object.keys({ "a": 1 }), 'wa11')
demoPrototypeReferenceSharing()
demoMyCall()
demoMyApply()
demoMyBind()
