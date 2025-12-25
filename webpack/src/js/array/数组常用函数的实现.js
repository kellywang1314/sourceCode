// map实现
Array.prototype.myMap = function (fn) {
    let temp = []
    for (let i = 0; i < this.length; i++) {
        temp.push(fn(this[i], i, this))
    }
    return temp
}

// filter实现
Array.prototype.myFilter = function (fn) {
    let temp = []
    for (let i = 0; i < this.length; i++) {
        fn(this[i]) && temp.push(fn(this[i], i, this))
    }
    return temp
}

// reduce实现
Array.prototype.myReduce = function (fn, init) {
    for (let i = 0; i < this.length; i++) {
        init = fn(init, this[i], i, this)
    }
    return init
}

// some函数的实现
Array.prototype.someNew = function (fn) {
    for (let i = 0; i < this.length; i++) {
        if (fn(this[i])) {
            return true
        }
    }
    return false
};

// every函数的实现
Array.prototype.everyNew = function (fn) {
    for (let i = 0; i < this.length; i++) {
        if (!fn(this[i])) {
            return false
        }
    }
    return true
};

// find函数的实现
Array.prototype.findNew = function (fn) {
    for (let i = 0; i < this.length; i++) {
        if (fn(this[i])) {
            return this[i]
        }
    }
    return undefined
};


// findIndex函数的实现
Array.prototype.findIndexNew = function (fn) {
    for (let i = 0; i < this.length; i++) {
        if (fn(this[i])) {
            return i
        }
    }
    return -1
};

// Array.from()的实现
Array.prototype.slice.call(this)

